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

Phase 1 is intentionally local and copy/export only. The app can copy schedule text, calendar reminder text, and a Google Apps Script prompt.

A static frontend cannot reliably send scheduled emails by itself. Future email reminders require one of:

- a backend endpoint such as `/api/send-health-reminder`
- Google Apps Script
- Gmail automation
- a scheduled service

Future implementation notes:

- Use server-side secrets only.
- Never expose Gmail tokens or API keys in client code.
- Keep email content generic and free of ticket/client data.
- Make email reminders explicit opt-in.
