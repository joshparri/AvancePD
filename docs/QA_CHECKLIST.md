# QA Checklist

Use this checklist before release or deployment changes.

## Build

- Run `npm run build`.
- Confirm TypeScript and Vite complete successfully.

## Core Navigation

- Dashboard opens.
- Search opens and returns local results.
- Command Center opens and shows Now, Focus Mode, Health, Later, and Shutdown sections.
- Quick Tools opens and shows phrase bank, escalation builder, ticket checklist, phone prep, decompression, and safe wording checker.
- Avance Workday opens.
- Weekly Review opens and shows scorecard plus copyable manager-safe summary.
- Health & Outdoors opens.
- Skill Tracks opens and shows progress by MSP growth track.
- MSP Skills, Scenarios, Ticket Notes, Evidence Pack, and Micro-Learning open.
- Evidence Pack shows deployment status for AI coach and Health email.
- MSP Scenarios step trainer reveals one clue at a time.
- Communication Practice calm rewrite coach generates a privacy-safe rewrite from a generic draft.

## Local Persistence

- Create a task, refresh, and confirm it remains.
- Create a work log, refresh, and confirm it remains.
- Create a learning note, refresh, and confirm it remains.
- Export backup JSON from Dashboard.
- Push a backup to Supabase only after opt-in settings are configured.

## Workflows

- Dashboard shows next shift, open follow-ups, Healthy MSP Shift, and Quick Capture.
- Tasks survive shift transitions because they are stored in localStorage.
- Knowledge and Playbooks search by title, tags, checks, symptoms, and category.
- Knowledge shows stale entries that have not been verified for more than 60 days.
- Time page shows billable totals and invoice preview.
- Quick Capture presets reduce typing during busy states.
- Low energy mode can be toggled from the sidebar and reduces visual clutter.
- Focus Mode starts, counts down, and resets.
- Work Logs and Knowledge accept only small safe local attachments.
- Work Logs and Knowledge attachment lists show metadata and download buttons.
- Dashboard backup can copy settings-only data.
- Dashboard backup shows a gentle reminder when no recent local backup exists.
- Playbooks can create draft playbooks from repeated safe tags.
- Mobile width shows bottom quick actions for Capture, Reset, and Now.
- Dashboard shows Avance day banner on Mondays/Wednesdays, scenario of the week, micro-learning card, and lunch reset.
- PD notes can be marked evidence-worthy, copied as safe summaries, and converted to Knowledge.
- Pressing `?` opens the keyboard shortcut overlay, and Escape closes it.
- Delete actions ask for confirmation before removing local data.
- Evidence Pack builder can include/exclude sections and copy Markdown, plain text, and JSON.

## Health & Outdoors

- Notification permission is requested only after user click.
- Denied or unsupported notifications use in-app banners.
- Snooze works.
- Quiet mode works.
- Reset and export actions work.
- Downloadable `.ics` reminder file works.
- Email reminder endpoint fails closed if server email settings are missing.
- Health trends show gentle labels, not red failure states.
- Reminder test mode changes the displayed next reminder without sending notifications.
- End-of-day family transition saves closed loops, tomorrow action, and intention.
- End-of-day family transition can create a follow-up task from tomorrow's first action.
- Health & Outdoors can copy CSV export.

## Privacy

- No client names, credentials, IPs, hostnames, screenshots, copied tickets, or private medical notes are required by any flow.
