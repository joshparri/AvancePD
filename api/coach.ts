import Groq from 'groq-sdk';

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function sendError(res: any, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, code, message });
}

const JSON_SCHEMA_INSTRUCTION = `
Return ONLY a valid JSON object. No markdown. No extra text before or after the JSON.
Use this exact schema:
{
  "verdict": "needs work" or "partly correct" or "strong",
  "summary": "One short sentence under 15 words.",
  "sections": [
    {
      "title": "Section name",
      "status": "missing" or "partial" or "good",
      "points": ["Bullet under 18 words.", "Bullet under 18 words."]
    }
  ],
  "nextStep": "One practical action to try next, under 20 words."
}
Rules: max 2 bullets per section. No markdown. Be kind and practical. If fields are blank, say what is missing. Do not mention client names or sensitive data.`;

const SCENARIO_SECTIONS = 'First questions, Checks, Escalation, Ticket note';
const COMMUNICATION_SECTIONS = 'Opening, Tone and empathy, Content, Professional close';
const TICKET_NOTE_SECTIONS = 'Issue and impact, Checks performed, Action and result, Next step';

function fallbackFeedback(text: string) {
  return {
    verdict: 'partly correct',
    summary: 'Feedback received but could not be structured.',
    sections: [
      {
        title: 'General feedback',
        status: 'partial',
        points: [text.slice(0, 140).trim() || 'No feedback text returned.'],
      },
    ],
    nextStep: 'Try again with more specific details in each field.',
  };
}

export interface CoachRequest {
  mode: 'scenario' | 'communication' | 'ticket-note';
  scenarioTitle?: string;
  scenarioContext?: string;
  idealAnswer?: string;
  userAnswer: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'INVALID_METHOD', 'Only POST requests are accepted.');
  }

  if (!process.env.GROQ_API_KEY) {
    console.error('Missing GROQ_API_KEY in server environment.');
    return sendError(res, 500, 'MISSING_API_KEY', 'AI feedback is not configured yet.');
  }

  const body: CoachRequest = req.body;

  if (!body || typeof body !== 'object' || !body.userAnswer || typeof body.userAnswer !== 'string') {
    return sendError(res, 400, 'INVALID_PAYLOAD', 'Invalid request payload.');
  }

  if (body.userAnswer.length > 5000) {
    return sendError(res, 400, 'INVALID_PAYLOAD', 'User answer is too long.');
  }

  let systemPrompt = '';
  let userPrompt = '';

  switch (body.mode) {
    case 'scenario':
      systemPrompt = `You are a coaching mentor for junior MSP technicians. Assess the learner's approach across four areas: ${SCENARIO_SECTIONS}.${JSON_SCHEMA_INSTRUCTION}`;
      userPrompt = `Scenario: ${body.scenarioTitle ?? 'MSP scenario'}

Ideal answer:
${body.idealAnswer ?? ''}

Learner's answer:
${body.userAnswer}

Return JSON with sections titled: ${SCENARIO_SECTIONS}.`;
      break;

    case 'communication':
      systemPrompt = `You are a coaching mentor for junior MSP technicians. Assess the learner's communication across four areas: ${COMMUNICATION_SECTIONS}.${JSON_SCHEMA_INSTRUCTION}`;
      userPrompt = `Scenario context: ${body.scenarioContext ?? 'Professional communication scenario'}

Ideal response:
${body.idealAnswer ?? ''}

Learner's response:
${body.userAnswer}

Return JSON with sections titled: ${COMMUNICATION_SECTIONS}.`;
      break;

    case 'ticket-note':
      systemPrompt = `You are a coaching mentor for junior MSP technicians. Assess the learner's ticket note across four areas: ${TICKET_NOTE_SECTIONS}.${JSON_SCHEMA_INSTRUCTION}`;
      userPrompt = `Template structure:
${body.idealAnswer ?? 'Issue / User impact / Checks performed / Action taken / Result / Next step'}

Learner's ticket note:
${body.userAnswer}

Return JSON with sections titled: ${TICKET_NOTE_SECTIONS}.`;
      break;

    default:
      return sendError(res, 400, 'INVALID_MODE', 'Invalid mode.');
  }

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 700,
    });

    const raw = completion.choices?.[0]?.message?.content ?? '';

    let feedback;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : null;
      feedback =
        parsed &&
        typeof parsed.verdict === 'string' &&
        typeof parsed.summary === 'string' &&
        Array.isArray(parsed.sections)
          ? parsed
          : fallbackFeedback(raw);
    } catch {
      feedback = fallbackFeedback(raw);
    }

    return res.status(200).json({ ok: true, feedback, model: GROQ_MODEL });
  } catch (error: any) {
    console.error('Groq API error:', error?.message ?? error);
    const msg = String(error?.message ?? error);
    if (msg.match(/model|unavailable|unsupported/i)) {
      return sendError(res, 502, 'MODEL_UNAVAILABLE', 'Selected AI model is unavailable.');
    }
    return sendError(res, 502, 'GROQ_REQUEST_FAILED', 'AI feedback request failed.');
  }
}
