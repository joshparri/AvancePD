import Groq from 'groq-sdk';

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function sendError(res: any, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, code, message });
}

export interface CoachRequest {
  mode: 'scenario' | 'communication' | 'ticket-note';
  scenarioTitle?: string;
  scenarioContext?: string;
  idealAnswer?: string;
  userAnswer: string;
  category?: string;
  difficulty?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'INVALID_METHOD', 'Only POST requests are accepted.');
  }

  if (!process.env.GROQ_API_KEY) {
    console.error('Missing GROQ_API_KEY in server environment.');
    return sendError(res, 500, 'MISSING_API_KEY', 'AI feedback is not configured yet.');
  }

  try {
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
        systemPrompt = "You are a mentor for MSP technicians. Compare the user's answers to the ideal answers and provide calm, practical feedback. Highlight what they did well and what could be improved. Keep feedback constructive and focused on learning.";
        userPrompt = `Scenario: ${body.scenarioTitle || 'Generic scenario'}

Ideal answers: ${body.idealAnswer || 'Follow best practices'}

User answer: ${body.userAnswer}`;
        break;

      case 'communication':
        systemPrompt = "You are a mentor for MSP technicians. Evaluate the user's communication response for tone, clarity, professionalism, and effectiveness. Provide constructive feedback on how to improve.";
        userPrompt = `Context: ${body.scenarioContext || 'Generic communication scenario'}

Ideal response: ${body.idealAnswer || 'Professional and clear response'}

User response: ${body.userAnswer}`;
        break;

      case 'ticket-note':
        systemPrompt = "You are a mentor for MSP technicians. Evaluate the user's ticket note for completeness, clarity, and usefulness. Use the standard template and provide feedback on what to improve.";
        userPrompt = `Template: ${body.idealAnswer || 'Issue / User impact / Checks / Action / Result / Next step'}

User note: ${body.userAnswer}`;
        break;

      default:
        return res.status(400).json({ error: 'Invalid mode' });
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
    });

    const feedback = completion.choices?.[0]?.message?.content || 'No feedback available';

    return res.status(200).json({ ok: true, feedback, model: GROQ_MODEL });
  } catch (error: any) {
    console.error('Groq API error:', error);
    const errorText = String(error?.message || error);
    if (errorText.match(/model|unavailable|unsupported/i)) {
      return sendError(res, 502, 'MODEL_UNAVAILABLE', 'Selected AI model is unavailable.');
    }
    return sendError(res, 502, 'GROQ_REQUEST_FAILED', 'AI feedback request failed.');
  }
}