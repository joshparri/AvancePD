 # Avance Work Companion / Avance Professional Development

This repository contains two tightly related projects: the Avance Work Companion (operational tools for shift work) and the Avance Professional Development (PD) app (learning, scenario practice, and evidence generation). The codebase is local-first and privacy-focused.

Overview
--------
- Avance Work Companion: shift prep, quick capture, follow-ups, playbooks, and work logs to support daily MSP operations.
- Avance PD: MSP Skills Matrix, Scenario Trainer, Ticket Notes Trainer, Evidence Pack, Learning Cockpit for structured PD practice.

Features
--------
- Dashboard with next shift, follow-ups, quick-capture and PD summary
- MSP Skills Matrix and Scenario Trainer
- Ticket Notes Trainer and Evidence Pack (manager-safe summaries)
- Knowledge base, playbooks, and troubleshooting flows
- Health & Outdoors reminders and microbreak flows

Current Implementation Status
-----------------------------
The PD features (MSP Skills Matrix, Scenario Trainer, Ticket Notes Trainer, Evidence Pack) are implemented in the `app/` folder. Other planned modules (Work Logs, Tasks, Knowledge Base, Playbooks, Clients, Learning Tracker) are documented in `TODO.md` and may return 404 until implemented.

Known Issues
------------
- MSP Scenario Trainer: "Scenario progress" select dropdown shows a dark background when opened, which can hide options.
- Evidence Pack: missing explicit copy-to-clipboard button (now addressed) for the Markdown summary.
- Ticket Notes Trainer: currently accessible via direct URL only; navigation needs updating.

Run Locally
-----------
From the repository root:

```bash
cd app
npm install
npm run dev
```

Build
-----

```bash
npm run build
```

Repository Structure
--------------------
- `app/`: Next.js application source code (primary codebase for both PD and Work Companion features).
- `docs/`: Documentation, requirements, architecture, and guides.
- `build/`: Prompts and build instructions used during development.
- `archive/`: Archived or legacy files.

Deployment
----------
See `docs/deployment/vercel_deployment.md` for Vercel deployment notes.

Getting Started
---------------
1. Read `VISION.md` for high-level product direction.
2. Review `docs/vision/` and `docs/requirements/` for scope and specs.
3. Run the app locally via `app/`.

Notes
-----
- Keep the app local-first and avoid storing client-sensitive data inside the app or repo.
