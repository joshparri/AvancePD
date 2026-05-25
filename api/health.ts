export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, code: 'INVALID_METHOD', message: 'Only GET requests are allowed.' });
  }

  const hasGroqKey = Boolean(process.env.GROQ_API_KEY);
  const hasHealthReminderEmail = Boolean(process.env.RESEND_API_KEY && process.env.HEALTH_REMINDER_FROM_EMAIL);
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  return res.status(200).json({
    ok: true,
    service: 'avance-pd-coach',
    hasGroqKey,
    hasHealthReminderEmail,
    model,
    timestamp: new Date().toISOString(),
  });
}
