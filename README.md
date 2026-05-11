 # Avance Work Companion / Avance PD

A combined repository for the Avance Work Companion and Avance PD applications — local-first tools to support daily MSP shift work, learning, and professional development for Josh and the Avance team.

Overview
--------
- Purpose: Provide a privacy-first, local-first web app to help a single operator (Josh) manage shifts, capture work logs, triage incidents, and practice MSP skills.
- Two complementary focuses:
	- Avance Work Companion: operational tools for shift prep, tasks, work logs, troubleshooting playbooks, and quick capture.
	- Avance PD: professional development flows (MSP Skills Matrix, Scenario Trainer, Ticket Notes Trainer, Evidence Pack, Learning Cockpit).

Features
--------
- Dashboard with next shift, follow-ups, quick-capture and PD summary
- MSP skills matrix with readiness tracking
- Guided MSP scenario trainer and ticket-notes practice
- Evidence Pack summary and exportable, manager-safe reports
- Knowledge base, playbooks, and troubleshooting flows
- Health & Outdoors reminders and microbreak flows

Documentation
-------------
- Vision and product docs: `VISION.md`, `docs/vision/`
- Requirements and PRD: `docs/requirements/`
- Implementation backlog: `TODO.md`
- Guides and how-tos: `docs/guides/`
- Build prompts and instructions: `build/`

Run locally
------------
Install and run the application (app directory):

```bash
npm install
npm run dev
```

Build
-----

```bash
npm run build
```

Notes
-----
- This repo is intentionally local-first and privacy-focused: do not store client-sensitive data (names, emails, hostnames, passwords) in the app. Use `docs/` for non-sensitive planning content and archive private exports outside the repo.
