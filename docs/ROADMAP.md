# Roadmap

This roadmap holds optional or future work that should not block the current local-first app.

## Low-Risk Future Work

- Email-to-note import: support pasting a cleaned, generic communication summary into Quick Capture. Do not connect directly to email until privacy rules and consent are clear.
- Calendar reminders: continue with copyable calendar text first. Add provider sync only with explicit opt-in.
- Attachment support: prefer private backup/export first. Add attachments only with clear file-size limits and warnings against screenshots, credentials, ticket exports, or client-sensitive files.
- Smarter suggestions: derive suggestions from local tags and categories only.
- Mobile capture: keep improving Quick Capture layout, tap targets, and presets.

## Higher-Risk Future Work

- Supabase or other cloud sync.
- Email sending through `/api/send-health-reminder`.
- Direct Gmail or calendar API integrations.
- PSA/RMM integrations.

## Required Guardrails

- Server-side secrets only.
- Opt-in for any cloud sync or external API.
- Export/delete controls before sync.
- No client names, passwords, IPs, hostnames, screenshots, copied tickets, or private medical notes.
