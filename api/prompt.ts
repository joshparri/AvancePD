import Groq from 'groq-sdk';

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function sendError(res: any, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, code, message });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'INVALID_METHOD', 'Only POST requests are accepted.');
  }

  if (!process.env.GROQ_API_KEY) {
    return sendError(res, 500, 'MISSING_API_KEY', 'AI prompt generation is not configured on the server.');
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || typeof body.promptId !== 'string') {
    return sendError(res, 400, 'INVALID_PAYLOAD', 'Request must include promptId.');
  }

  const promptId = body.promptId as string;
  const context = typeof body.context === 'string' ? body.context : JSON.stringify(body.context ?? {}, null, 2);

  const systemPrompt = [
    'You are a safe productivity assistant for an MSP work companion. Generate a concise, generic draft based on the prompt type and context.',
    'Do not include client names, credentials, hostnames, IP addresses, ticket numbers, passwords, or private incident details.',
    'Return only the draft text itself, with no markdown wrappers or extra commentary.'
  ].join(' ');

  const userPrompt = `Prompt type: ${promptId}\nContext:\n${context}`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      max_tokens: 500
    });

    const raw = completion.choices?.[0]?.message?.content ?? '';
    const draft = raw.trim();

    return res.status(200).json({ ok: true, draft, model: GROQ_MODEL });
  } catch (error: any) {
    console.error('Groq prompt API error:', error?.message ?? error);
    return sendError(res, 502, 'GROQ_REQUEST_FAILED', 'AI prompt generation failed.');
  }
}
