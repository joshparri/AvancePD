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

<<<<<<< HEAD
Current Implementation Status
-----------------------------
- The PD features (MSP Skills Matrix, Scenario Trainer, Ticket Notes Trainer, Evidence Pack) are implemented in the `app/` folder.
- The KB Learning Machine (seeded field cards, local practice evidence) is present but currently operates with localStorage only; manual card management and import from private KB sources are future work.
- Other planned modules (Work Logs, Tasks, Knowledge Base, Playbooks, Clients, Learning Tracker) are documented in `TODO.md` and may return 404 until implemented.

Known Issues
------------
- On the MSP Scenario Trainer page (`/msp-scenarios`), the "Scenario progress" select dropdown shows a dark background when opened, making options invisible (though selection still works).
- The KB Learning Machine uses local storage only and does not import private KB PDFs yet.
- The KB Learning Machine has seeded field cards and practice flows but lacks create/edit/delete UI for manual card management.
- Evidence Pack: prior to the recent fix, the page lacked an explicit copy-to-clipboard button for the Markdown summary (now addressed).
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
3. Review `docs/professional_development/msp_skills_academy.md` for PD specifics.
4. Review `docs/implementation-plans/two-app-prompt-pack-roadmap.md` and `docs/guides/prompt_pack_recommendations.md` for prompt-pack and AI coaching guidance.
5. Use `build/master_prompt.md` with Claude Code to reproduce or regenerate app scaffolding if needed.
6. Follow `docs/guides/` for usage and planning.

Notes & Maintenance
-------------------
- Keep the app local-first and avoid storing client-sensitive data inside the app or repo.
- Update documents as the product evolves and archive outdated materials in `archive/`.
