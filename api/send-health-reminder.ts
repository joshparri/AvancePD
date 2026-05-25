function sendError(res: any, status: number, code: string, message: string) {
  return res.status(status).json({ ok: false, code, message });
}

function isSafeReminderText(value: string) {
  const blocked = /(password|secret|token|hostname|ip address|screenshot|ticket #|client:)/i;
  return value.length > 0 && value.length <= 500 && !blocked.test(value);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'INVALID_METHOD', 'Only POST requests are accepted.');
  }

  if (!process.env.RESEND_API_KEY || !process.env.HEALTH_REMINDER_FROM_EMAIL) {
    return sendError(res, 503, 'EMAIL_NOT_CONFIGURED', 'Health reminder email is not configured on the server.');
  }

  const { to, subject, body } = req.body ?? {};
  if (typeof to !== 'string' || !to.includes('@')) {
    return sendError(res, 400, 'INVALID_EMAIL', 'A valid destination email is required.');
  }

  if (typeof subject !== 'string' || typeof body !== 'string' || !isSafeReminderText(subject) || !isSafeReminderText(body)) {
    return sendError(res, 400, 'INVALID_CONTENT', 'Reminder content must be short, generic, and free of sensitive data.');
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.HEALTH_REMINDER_FROM_EMAIL,
        to,
        subject,
        text: body
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return sendError(res, 502, 'EMAIL_SEND_FAILED', data?.message ?? 'Email provider rejected the request.');
    }

    return res.status(200).json({ ok: true, id: data?.id ?? null });
  } catch {
    return sendError(res, 502, 'EMAIL_SEND_FAILED', 'Email reminder request failed.');
  }
}
