# Health & Outdoors Implementation

Status: implemented and build-verified.

The Health & Outdoors module adds local-first wellbeing support for Josh's Monday and Wednesday Avance MSP shifts, normally 8:30am-5:00pm. It is intentionally not a medical app: it does not diagnose, prescribe, or store sensitive medical records.

## Implemented Scope

- Sidebar navigation item: `Health & Outdoors`
- Main page: `src/pages/HealthOutdoors.tsx`
- Shared dashboard/workday panel: `src/components/HealthyMspShiftPanel.tsx`
- Local storage and reminder logic: `src/utils/healthOutdoors.ts`
- Static research card data: `src/data/healthResearch.ts`
- Documentation: `docs/HEALTH_AND_OUTDOORS.md`

## User-Facing Features

- Today's Shift Health Plan
- Next Recommended Break
- Hydration check-ins
- Outdoor/daylight minute tracking
- Eyes and posture prompts
- Nervous-system reset with optional faith prompt
- End-of-day downshift
- Weekly nature target
- Weekly Health Review
- Manager-safe Evidence Pack summary text
- Email Reminder Setup with copyable schedule, calendar text, and Google Apps Script prompt
- Downloadable `.ics` calendar reminder file
- Optional server-side email reminder endpoint via Resend

## Reminder Defaults

Default shift days are Monday and Wednesday. Default shift time is 8:30am-5:00pm.

- 8:20am: pre-shift setup
- 9:20am: 20-20-20 eye break and water
- 10:30am: outdoor reset if possible
- 11:30am: posture, jaw, shoulders, water
- 12:30pm: lunch away from screen
- 2:15pm: outdoor walk or sunlight reset
- 3:30pm: water, stretch, eyes
- 4:45pm: end-of-day shutdown

The schedule can be edited in the Health & Outdoors settings section. Other shift days can also be enabled manually.

## Local Data Stored

Data is stored in browser localStorage under `avance-health-outdoors`.

The app stores simple wellbeing action data only:

- completedBreaks
- skippedBreaks
- hydrationCount
- outdoorMinutes
- movementBreaks
- eyeBreaks
- lunchAwayFromScreenCount
- shutdownCount
- urgentTicketModeCount
- lastBreakTime
- snoozedUntil
- notificationPermissionStatus
- preferredReminderCadence
- mondayWednesdayOnly
- notificationsEnabled
- quietModeUntil
- reminderSound

The app must not store client names, passwords, IP addresses, hostnames, screenshots, copied ticket text, private medical notes, or other sensitive operational data.

## Notification Behavior

- Browser notification permission is requested only after the user clicks `Enable health reminders`.
- If permission is granted, local browser notifications can be shown for due reminders.
- If permission is denied or unsupported, the app uses in-app banners.
- Reminder sound defaults to off.
- Quiet mode pauses reminders for 60 minutes during urgent ticket work.

## Email Reminder Design

The frontend never stores email API keys. Email sending is available only through `/api/send-health-reminder` when server-side environment variables are configured.

Required server-side environment variables:

- `RESEND_API_KEY`
- `HEALTH_REMINDER_FROM_EMAIL`

When configured, the Health & Outdoors page can send a test reminder and can send reminder emails while the app is open. Fully unattended scheduled email still requires a hosting scheduler such as Vercel Cron or an external automation service.

## Build Verification

Command used:

```bash
npm run build
```

Result: TypeScript and Vite production build pass.

## Known Limitations

- Fully unattended email reminders require server environment variables plus a scheduler.
- Notifications are local browser notifications only, not push server notifications.
- Browser notification behavior depends on browser permission settings.
- Health data is local to the current browser profile unless manually exported or synced through the optional Supabase backup panel.
