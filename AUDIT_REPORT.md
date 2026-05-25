# Avance PD Current App Audit

## Audit Date

May 25, 2026

## Summary

Avance PD is a local-first React, TypeScript, and Vite app for MSP professional development, workday support, privacy-safe evidence capture, and sustainable Monday/Wednesday Avance shift routines.

Current build status: passing with `npm run build`.

## Current Core Pages

- Dashboard
- Shifts
- Tasks
- Work Logs
- Knowledge
- Playbooks
- Time
- PD
- Avance Workday
- Health & Outdoors
- MSP Skills
- MSP Scenarios
- Strict Quiz
- Ticket Notes
- Communication Practice
- MSP Roadmap
- Evidence Pack
- Micro-Learning

## Local-First Data

The app stores user data in browser localStorage. Important keys include:

- `avance-msp-progress`
- `avance-workLogs`
- `avance-tasks`
- `avance-knowledgeEntries`
- `avance-playbooks`
- `avance-learningItems`
- `avance-timeEntries`
- `avance-onboarded`
- `avance-health-outdoors`

## Privacy Posture

The documentation and app copy consistently warn against storing:

- client names
- company names
- passwords or secrets
- screenshots
- copied ticket text
- hostnames
- IP addresses
- sensitive operational data
- private medical notes

## Documentation Status

Current public docs:

- `README.md`
- `TODO.md`
- `HEALTH_OUTDOORS_IMPLEMENTATION.md`
- `docs/README.md`
- `docs/DEVELOPER_README.md`
- `docs/TODO.md`
- `docs/vision.md`
- `docs/USER_GUIDE.md`
- `docs/PROFESSIONAL_DEVELOPMENT.md`
- `docs/UI_UX_AND_TONE_GUIDE.md`
- `docs/SAMPLE_SEED_DATA.md`
- `docs/HEALTH_AND_OUTDOORS.md`

Private or operational notes should remain outside Git or under ignored private folders such as `docs/operations/` and `docs/integration/`.

## Remaining Product Work

The canonical checklist is `TODO.md`.

High-value remaining work:

- first-run onboarding
- keyboard shortcuts or quick-capture affordances
- broader empty-state guidance
- PD-specific shift review workflow
- learned-today tagging
- learning review cadence
- backup/export support
- deployment decision
- optional sync plan

## Health & Outdoors Limitations

- Email reminders are copy/export only; no frontend email sending is implemented.
- Browser notifications are local only.
- Notification behavior depends on browser permission settings.
- Health data remains local unless exported manually.

## Recommended Next Build Sequence

1. Documentation cleanup and public docs alignment.
2. Onboarding and empty-state polish.
3. Quick-capture keyboard/shortcut improvements.
4. PD shift review and learned-today workflow.
5. Backup/export and deployment support.
6. Optional sync only after local-first flows remain stable.
