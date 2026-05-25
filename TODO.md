# Avance Work Companion TODO

## 1. Product definition & validation
- [x] Confirm the core user: Josh as a single-user MSP operator
- [x] Validate the Monday/Wednesday shift rhythm and recurring shift needs
- [x] Finalize MVP scope around dashboard, shift prep, work logs, tasks, knowledge, playbooks, time logging, and learning tracker
- [x] Define clear success metrics for the app (time-to-context, quick log speed, task follow-through, invoice prep)
- [x] Review and align on the product principles in `docs/vision.md`

## 2. App architecture & data model
- [x] Design the data model for shifts, work logs, tasks, knowledge entries, playbooks, clients, time entries, and learning items
- [x] Decide on storage strategy: local-first persistence plus optional Supabase or export/import
- [x] Define the page/section structure for dashboard, shift view, notes, tasks, knowledge, playbooks, time, and PD
- [x] Add search/index architecture to support fast retrieval of logs, notes, playbooks, and knowledge
- [x] Add security guidance to prevent storing credentials or sensitive data

## 3. Core feature implementation
- [x] Build the dashboard with today/next shift, priorities, open follow-ups, recent handover, quick capture, and invoice-cycle summary
- [x] Build the shift scheduler/prep module with recurring Mon/Wed support, exceptions, priorities, prep checklist, and handover links
- [x] Build quick work logging with timestamp, client, summary, actions, result, next step, tags, and draft support
- [x] Build task management with status, due date, priority, client link, work log link, and carry-forward behaviour
- [x] Build the knowledge base with title, body, tags, confidence, last verified, category, source type, draft/trusted states, and search
- [x] Build playbooks for issue triage, symptoms, checks, escalation, and field notes
- [x] Build time logging and invoice preview support with billable entries, totals, unbilled/billed/paid state, and export-ready line items
- [x] Build the learning tracker with topic, confidence score, "seen in real work", ask-team flag, and next review date

## 4. User experience & UI work
- [x] Implement the calm, readable UI style described in `docs/strategy/07_UI_UX_AND_TONE_GUIDE.md`
- [ ] Add keyboard shortcuts or quick-capture affordances for busy work states
- [x] Build clear status chips and colour semantics for urgent, review, trusted, and billed states
- [ ] Create empty-state guidance for all core modules
- [ ] Ensure the app loads quickly and displays key context in under 60 seconds
- [x] Add explicit warnings about not storing passwords or sensitive information

## 5. Documentation & onboarding
- [x] Keep `docs/vision.md` up to date with any scope or feature changes
- [ ] Create a short in-app onboarding flow for first-time use
- [x] Add a user guide or quick-start page for daily shift routine and PD habits
- [x] Build a developer-facing README describing how to run and extend the app
- [x] Add an accessible `docs/TODO.md` or project tracker for ongoing priorities

## 6. Professional development / MSP growth
- [ ] Add PD-specific workflows in the app for learning goals and shift review
- [ ] Integrate the PD checklist from `docs/pd/PROFESSIONAL_DEVELOPMENT.md` into shift wrap-up or dashboard prompts
- [ ] Add a "learned today" tag or note type in the knowledge base
- [ ] Add a review cadence for learning entries and confidence updates
- [x] Include communication, security, endpoint, and network troubleshooting guidance as reference templates

## 7. Testing, validation & polish
- [x] Populate the app with sample seed data for early testing (`docs/strategy/08_SAMPLE_SEED_DATA.md`)
- [ ] Test that the dashboard surfaces the right context after a gap between shifts
- [ ] Validate that follow-ups and tasks survive shift transitions
- [ ] Verify that knowledge and playbooks are searchable and discoverable
- [ ] Test invoice preview generation and time tracking summaries
- [ ] Run usability checks for quick capture under pressure
- [ ] Fix any UI/UX friction that prevents fast note capture or task creation

## 8. Deployment & support
- [ ] Choose a runnable deployment method for a private web app (local static site, desktop wrapper, or simple hosted app)
- [x] Document launch instructions for Josh and how to open the app each shift
- [ ] Add backup/export functionality so app data can be preserved
- [ ] Add an optional sync plan only if it stays low-risk and optional

## 9. Cleanup & repo health
- [x] Keep the repo organized with the current folder structure and doc index files
- [x] Remove any remaining duplicate or unused draft files
- [x] Archive legacy ZIPs and raw downloads in `archives/`
- [x] Keep `references/` as read-only raw source materials only
- [x] Review the root `README.md` and `docs/README.md` for accuracy

## 10. Future improvements
- [ ] Add email-to-note ingestion or import from client communication if needed
- [ ] Add calendar sync or shift reminders for Monday/Wednesday work
- [ ] Add file attachments for work logs and knowledge items
- [ ] Add smarter suggestions for repeated issues and auto-suggested playbooks
- [ ] Add mobile quick-capture support for field use
- [ ] Add optional Supabase sync only after the local-first experience is solid

## 11. Health & Outdoors module
- [x] Add a local-first Health & Outdoors module for Monday/Wednesday Avance shifts
- [x] Add gentle reminders for hydration, 20-20-20 eye breaks, posture, movement, outdoor daylight, lunch away from screen, stressful-ticket reset, and end-of-day shutdown
- [x] Add editable reminder schedule, shift days, quiet mode, snooze, skip, and notification permission handling
- [x] Add browser notification support with in-app banner fallback and no repeated permission prompts after denial
- [x] Add a research-backed "Why this helps" card library with plain-English summaries and source links
- [x] Add a Healthy MSP Shift panel to Dashboard and Avance Workday
- [x] Add optional 2-minute reset with optional faith prompt
- [x] Add weekly review, manager-safe evidence summary, export JSON, and reset health data actions
- [x] Add email reminder setup copy/export helpers without storing API keys or Gmail credentials
- [ ] Future: add `/api/send-health-reminder` only with server-side secrets and explicit opt-in
