# Health & Outdoors Module

Health & Outdoors is a local-first wellbeing-support module for Josh's Monday and Wednesday Avance MSP shifts, normally 8:30am-5:00pm.

It is not a medical app. It does not diagnose, prescribe, or store sensitive medical records. It uses gentle reminders for hydration, outdoor light, 20-20-20 eye breaks, posture, movement, lunch away from screen, nervous-system reset after intense tickets, and end-of-day shutdown.

## Privacy Rules

- Store only simple local action counts and reminder settings.
- Do not store client names, passwords, IPs, hostnames, screenshots, copied ticket data, or private medical notes.
- Keep manager-safe summaries generic and professional.
- Do not mention ADHD or any private health diagnosis in exports unless Josh manually writes that elsewhere.

## Local Data

The module stores data in browser localStorage under `avance-health-outdoors`:

- completedBreaks
- skippedBreaks
- hydrationCount
- outdoorMinutes
- lastBreakTime
- notificationPermissionStatus
- preferredReminderCadence
- mondayWednesdayOnly
- notificationsEnabled
- quietModeUntil
- reminderSound

## Email Reminder Architecture

The app can copy schedule text, download calendar reminder text as an `.ics` file, and copy a Google Apps Script prompt.

The app also includes `/api/send-health-reminder`, which sends email through Resend only when server-side environment variables are configured:

- `RESEND_API_KEY`
- `HEALTH_REMINDER_FROM_EMAIL`

A static frontend still cannot reliably send fully unattended scheduled emails by itself. Unattended schedules require one of:

- Vercel Cron calling the backend endpoint
- Google Apps Script
- Gmail automation
- another scheduled service

Implementation notes:

- Use server-side secrets only.
- Never expose Gmail tokens or API keys in client code.
- Keep email content generic and free of ticket/client data.
- Make email reminders explicit opt-in.
