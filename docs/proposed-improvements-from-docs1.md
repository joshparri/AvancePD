# Proposed Improvements — inspiration from `docs/1`

Summary
-------
- Source: `_Avance Google Meet Chats - Spreadsheet - Living App Backlog - Sheet1.csv` and `_Avance Google Meet Chats.txt` (docs/1).
- These notes contain practical feature ideas, workflow improvements, and knowledge-base items that map directly to the AvancePD app.

High-level suggestions (actionable)
---------------------------------
- **PendingActionTracker**: Add a small follow-up tracker component to the dashboard so technicians can log stalled tickets, set follow-up due dates, and mark items complete. Persist to `localStorage`.
  - Suggested file: `src/components/PendingActionTracker.tsx` and integration in `src/components/Dashboard.tsx`.

- **OnsiteChecklist**: Three-phase onsite visit checklist (Pre-check, Onsite, After visit) with tick-off state persisted locally and a note-export option for HaloPSA.
  - Suggested file: `src/components/OnsiteChecklist.tsx` and route `/work-logs/onsite-checklist`.

- **Tool Primers — RDP & Creative Research**: Add primers for recurring technician needs:
  - `Windows Remote Desktop & RemoteApps` troubleshooting primer (RDP cert/TLS errors, steps, screenshots).
  - `LLM Creative Research` primer (optional low-priority bucket for creative prompts / experiments).
  - Suggested data file: `src/data/toolPrimers.ts` (or extend `toolPrimers.ts`), UI in `src/components/ToolPrimers.tsx`.

- **LLM: Monitoring Alert Mode & Sanitization**: Add a Monitoring Alert input mode to the LLM helper that sanitizes PII locally (emails, IPs, hostnames) and shows sanitized text before sending. Provide structured triage output scaffold.
  - Suggested file: `src/components/LLMHelper/MonitoringAlert.tsx` and sanitization util `src/lib/sanitizeAlert.ts`.

- **Security Alert Triage Module**: Short, calm triage flows for High / Medium / Low alerts with structured note templates (Issue -> What I checked -> Findings -> Actions -> Outcome).
  - Suggested route: `/msp-scenarios/triage` and `src/components/SecurityTriage.tsx`.

- **Health & Outdoors module**: Implement the phased wellness flows, reminders, 2-minute reset, and weekly review as a local-first feature for PD users.
  - Suggested path: `src/app/health-outdoors/` components and pages (matches existing app areas).

- **Evidence Pack UX**: Add a `Copy summary` button for the generated Markdown summary textarea (fixes known issue in QA checklist).
  - Suggested file change: `src/app/evidence-pack/page.tsx` or `src/components/EvidencePack.tsx`.

- **MSP Scenario Trainer fixes**: Fix the dropdown open-state styling (black background hiding options) and ensure scenario progress persists via `localStorage`.
  - Suggested files: `src/app/msp-scenarios/*` and `src/lib/persistence.ts`.

- **Navigation & Access**: Fix nav so Ticket Notes Trainer is reachable from the menu; hide or mark 'Coming soon' links that return 404 (Work Logs, Tasks, Playbooks, Clients, Learning).
  - Suggested file: `src/components/Navigation.tsx` and `src/app/layout.tsx`.

Prioritised checklist (quick start)
---------------------------------
1. Add `Copy summary` to Evidence Pack — small UI change, high impact.
2. Fix scenario dropdown CSS & ensure persistence — high impact for training flows.
3. Add PendingActionTracker (local storage) — reduces lost follow-ups.
4. Add RDP Tool Primer content to `toolPrimers` data — knowledge base improvement.
5. Implement Monitoring Alert sanitization util and basic UI.
6. Create OnsiteChecklist component (phase-based) and integrate export to note templates.

Notes & implementation hints
---------------------------
- Keep all new features local-first (use `localStorage`) unless the team chooses to add backend storage later.
- Follow existing UI patterns (Tailwind + dark navy / electric cyan accents) to keep the app consistent.
- Add unit/visual tests where feasible and a short README in `docs/` describing each new component and how to test it locally.

Files added/updated
-------------------
- New: `docs/proposed-improvements-from-docs1.md` (this file)
- Suggested edits (not applied by this commit): `src/components/*`, `src/app/*`, `src/data/*`, `src/lib/*` (see suggestions above)

Next steps I can take for you
----------------------------
- Implement one item at a time (pick highest priority) and open PRs.
- I can scaffold the components and wire up `localStorage` persistence now.
- I can commit and attempt to push these docs to the repository.

-- End of proposed improvements
