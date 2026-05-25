# QA Checklist

Use this checklist before release or deployment changes.

## Build

- Run `npm run build`.
- Confirm TypeScript and Vite complete successfully.

## Core Navigation

- Dashboard opens.
- Search opens and returns local results.
- Avance Workday opens.
- Health & Outdoors opens.
- MSP Skills, Scenarios, Ticket Notes, Evidence Pack, and Micro-Learning open.

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
- Time page shows billable totals and invoice preview.
- Quick Capture presets reduce typing during busy states.
- Work Logs and Knowledge accept only small safe local attachments.
- Pressing `?` opens the keyboard shortcut overlay, and Escape closes it.
- Delete actions ask for confirmation before removing local data.

## Health & Outdoors

- Notification permission is requested only after user click.
- Denied or unsupported notifications use in-app banners.
- Snooze works.
- Quiet mode works.
- Reset and export actions work.
- Downloadable `.ics` reminder file works.
- Email reminder endpoint fails closed if server email settings are missing.

## Privacy

- No client names, credentials, IPs, hostnames, screenshots, copied tickets, or private medical notes are required by any flow.
