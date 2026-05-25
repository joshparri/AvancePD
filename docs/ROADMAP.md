# Roadmap

This roadmap holds optional or future work that should not block the current local-first app.

For a broader idea bank with implementation notes, see `AWESOME_IDEAS_AND_VIBE_CODER_PLAN.md`.

## Low-Risk Future Work

- Email-to-note import: implemented as a cleaned communication-note Quick Capture preset. Direct inbox access remains deferred.
- Calendar reminders: implemented as downloadable `.ics` reminders. Provider API sync remains deferred.
- Attachment support: implemented for small safe local files on Work Logs and Knowledge. Cloud file sync remains deferred.
- Smarter suggestions: implemented from local safe tags on Dashboard. Broader analytics remain deferred.
- Mobile capture: quick-capture presets and stacked mobile controls are implemented. Native mobile/PWA capture remains deferred.

## Higher-Risk Future Work

- Supabase or other cloud sync.
- Unattended email sending through `/api/send-health-reminder` plus a scheduler.
- Direct Gmail or calendar API integrations.
- PSA/RMM integrations.

## Required Guardrails

- Server-side secrets only.
- Opt-in for any cloud sync or external API.
- Export/delete controls before sync.
- No client names, passwords, IPs, hostnames, screenshots, copied tickets, or private medical notes.
