# Awesome Ideas And Vibe Coder Plan

This document captures forward-looking ideas for making Avance Work Companion healthier, more useful for MSP professional development, and more polished without losing the local-first privacy model.

These are not commitments to build everything at once. Treat them as scoped options for future iterations.

## 10 New Feature Ideas

### 1. Shift Command Center

Create a single focused shift screen that combines open follow-ups, today's focus, next health action, current PD suggestion, and shutdown checklist.

Vibe coder implementation:

- Build `src/pages/ShiftCommandCenter.tsx`.
- Reuse Dashboard data props instead of creating new storage.
- Pull next health action from `getNextHealthReminder`.
- Add navigation item after `Avance Workday`.
- Keep the first screen action-focused: "Now", "Next", "Later", "Shutdown".

### 2. Focus Mode Timer

Add a gentle focus timer for ticket blocks with built-in break prompts and urgent-ticket quiet mode.

Vibe coder implementation:

- Add local state in a `FocusModePanel` component.
- Persist active session start, duration, and mode in localStorage.
- Modes: triage, documentation, follow-up, learning, shutdown.
- On timer end, suggest a Health & Outdoors reset instead of an alarm-heavy flow.
- Avoid sounds by default.

### 3. Weekly Reflection Dashboard

Create a weekly view that brings together PD notes, scenario practice, health actions, repeated tags, and Evidence Pack snippets.

Vibe coder implementation:

- Build `src/pages/WeeklyReview.tsx`.
- Read from existing localStorage-backed props and `avance-health-outdoors`.
- Group data by current week.
- Add copyable manager-safe summary.
- Do not include private health details or client data.

### 4. Skill Quest Tracks

Turn MSP growth into optional tracks, such as M365 Basics, Endpoint Triage, Network Foundations, Communication, and Documentation.

Vibe coder implementation:

- Add `src/data/skillTracks.ts`.
- Map each track to existing MSP skill IDs, scenarios, quiz topics, and micro-learning cards.
- Build progress from existing `AvanceProgress`.
- Add a track detail page with "next tiny practice" action.

### 5. Scenario Step Trainer

Make scenarios more interactive by revealing context in stages: intake, first questions, checks, escalation, ticket note, reflection.

Vibe coder implementation:

- Extend `MspScenarios` with a `stepMode` view.
- Store per-scenario step progress in `AvanceProgress`.
- Add "Reveal next clue" and "Write my next action" fields.
- Only show ideal answer after user attempts.
- Keep AI coaching optional.

### 6. Calm Communication Coach

Add a focused tool for rewriting rushed or stressed messages into calm, professional MSP replies.

Vibe coder implementation:

- Build `CommunicationRewritePanel`.
- Use local templates first; optional AI endpoint later.
- Inputs: rough message, audience, tone target, urgency.
- Outputs: concise rewrite, empathy line, next-step line.
- Add privacy warning against pasting real names, ticket text, or client details.

### 7. Health Streaks Without Shame

Add gentle trend indicators for hydration, outdoor minutes, eye breaks, and shutdowns without failure states.

Vibe coder implementation:

- Extend `getWeeklyTotals` with previous-week comparison.
- Display "steady", "more than last week", or "reset week" labels.
- Avoid red colours and streak-loss language.
- Add "best tiny habit this week" summary.

### 8. Evidence Pack Builder

Create a guided Evidence Pack builder that lets Josh choose which safe achievements to include before copying/exporting.

Vibe coder implementation:

- Add selectable evidence cards in `EvidencePack`.
- Store selection in component state only unless persistence is needed.
- Add categories: scenarios, skills, ticket notes, learning notes, health routine.
- Add "manager-safe preview" with no diagnoses or sensitive details.

### 9. Personal Playbook Generator

Use repeated safe tags and knowledge entries to suggest draft playbooks.

Vibe coder implementation:

- Add a `suggestPlaybookDrafts(workLogs, knowledgeEntries)` helper.
- Suggest title, symptoms, first checks, and tags from generic local data only.
- Add "Create draft playbook" button.
- Mark generated playbooks as drafts until reviewed.

### 10. End-Of-Day Family Transition

Add a shutdown ritual focused on leaving work at work, reconnecting with family, and noting tomorrow's first action.

Vibe coder implementation:

- Extend Health & Outdoors shutdown section.
- Add three fields: closed loops, tomorrow's first action, transition intention.
- Store locally by date.
- Add optional faith prompt.
- Keep wording professional and private.

## 10 Upgrade Ideas

### 1. Better Mobile Bottom Actions

Add a sticky mobile action bar for Quick Capture, Health Reset, and Urgent Ticket Mode.

Implementation notes:

- Add responsive CSS only under `@media (max-width: 700px)`.
- Keep it hidden on desktop.
- Use existing navigation callbacks.

### 2. Import/Export Settings Separately

Let Josh export only settings without exporting all notes.

Implementation notes:

- Extend `DataBackupPanel` with "settings-only backup".
- Include health settings, onboarding status, and sync settings.
- Do not include work logs or learning notes.

### 3. Keyboard Shortcut Overlay

Status: done in `src/components/ShortcutOverlay.tsx`.

Add a small overlay listing keyboard shortcuts.

Implementation notes:

- Add `?` key listener in `App`.
- Show modal with `Alt+Q` and future shortcuts.
- Ensure Escape closes it.

### 4. Safer Delete Confirmations

Status: done in `src/App.tsx` for local tasks, logs, notes, playbooks, learning notes, and time entries.

Replace immediate deletes with confirmation for tasks, notes, logs, playbooks, and attachments.

Implementation notes:

- Add shared `confirmDelete(label, action)` helper or inline `window.confirm`.
- Prefer a small reusable modal later.
- Keep wording calm: "Remove this local item?"

### 5. Better Attachment Viewer

Show attachment metadata and allow downloading attached files.

Implementation notes:

- Add `downloadAttachment(attachment)` helper.
- Render name, size, type, added date.
- Avoid inline preview for PDFs/screenshots to reduce accidental exposure.

### 6. Health Reminder Test Mode

Let Josh simulate Monday/Wednesday reminders without changing system time.

Implementation notes:

- Add dev/test controls hidden behind Health settings.
- Let user choose test date/time.
- Pass simulated `now` into reminder helpers.
- Keep real notification sending off in test mode.

### 7. Search Across Everything

Status: done in `src/pages/Search.tsx`.

Add a global search page for tasks, work logs, knowledge, playbooks, learning notes, and scenarios.

Implementation notes:

- Build `src/pages/Search.tsx`.
- Accept arrays from `App` props.
- Search locally in memory.
- Never index sensitive external sources.

### 8. Better Evidence Export Formats

Add copyable plain text, Markdown, and JSON exports.

Implementation notes:

- Extend `EvidencePack`.
- Keep PDF/Word for later unless a small client-side library is justified.
- Add privacy preflight checklist before export.

### 9. Personal Weekly Scorecard

Add a low-pressure weekly scorecard for practice, documentation, follow-ups, and health resets.

Implementation notes:

- Use existing data only.
- Use plain words, not grades.
- Example labels: "steady", "building", "needs gentler plan".

### 10. Deployment Status Panel

Show whether API health, AI coach, and email reminder backend are configured.

Implementation notes:

- Extend `EvidencePack` or add a Settings page.
- Fetch `/api/health`.
- Show `hasGroqKey` and `hasHealthReminderEmail`.
- Avoid exposing keys or secret values.

## 20-30 Smaller Ideas

- Add a "first action tomorrow" field to Avance Workday.
- Add "copy safe summary" buttons to Work Logs and Learning Notes.
- Add task carry-forward prompts on Monday and Wednesday.
- Add "review before shift" list based on overdue learning notes.
- Add "mark as evidence-worthy" to learning notes.
- Add "convert learning note to knowledge entry".
- Add "convert repeated tag to playbook draft".
- Add a "safe wording checker" for evidence exports.
- Add a "private data reminder" before file attachment upload.
- Add a small "today is an Avance day" banner.
- Add "lunch taken away from screen" quick button in Dashboard.
- Add "outdoor reset suggestion based on weather" later, only if using a privacy-safe weather source.
- Add Health & Outdoors CSV export.
- Add "copy calendar schedule" in Google Calendar-friendly wording.
- Add "create tomorrow task from shutdown ritual".
- Add "scenario of the week".
- Add "micro-learning card of the day".
- Add "communication phrase bank".
- Add "escalation note builder".
- Add "ticket note quality checklist".
- Add "phone call prep checklist".
- Add "post-call decompression reset".
- Add "low energy mode" that reduces UI clutter.
- Add "review stale knowledge entries".
- Add "confidence changed this week" trend.
- Add "backup reminder" every few weeks.
- Add "deployment checklist before release".
- Add "sync health check" for Supabase backup.
- Add "keyboard-only QA checklist".
- Add "family transition reflection" as an optional private prompt.

## Vibe Coder Operating Rules

When implementing any idea above:

1. Start by reading `src/App.tsx`, the relevant page, and existing storage utilities.
2. Reuse existing props and localStorage patterns before adding new architecture.
3. Keep each feature behind a small component or helper.
4. Add privacy warnings anywhere a user can paste/import/upload content.
5. Never add client names, copied tickets, screenshots, hostnames, IP addresses, or credentials to sample data.
6. Run `npm run build`.
7. Update `TODO.md`, `docs/README.md`, and the relevant feature doc.
8. Commit and push a small coherent change.

## Suggested Build Order

1. Keyboard shortcut overlay. Done.
2. Safer delete confirmations. Done.
3. Global search. Done.
4. Evidence Pack builder.
5. Weekly Reflection Dashboard.
6. Skill Quest Tracks.
7. Scenario Step Trainer.
8. Personal Playbook Generator.
9. Health streaks without shame.
10. Shift Command Center.
