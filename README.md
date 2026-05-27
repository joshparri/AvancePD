# Avance PD

Avance PD is a local-first professional development app for practising MSP help desk skills, tracking learning progress, and producing privacy-safe evidence of growth.

## Features

- MSP skills matrix with readiness tracking
- Guided MSP scenario trainer
- Ticket notes trainer
- Evidence pack summary
- Communication practice examples
- MSP roadmap
- Workday checklist and next-best-action recommendations
- Health & Outdoors reminders for hydration, screen breaks, outdoor daylight, movement, and end-of-day shutdown

## Documentation

- User guide: `docs/USER_GUIDE.md`
- Developer guide: `docs/DEVELOPER_README.md`
- Product vision: `docs/vision.md`
- Deployment: `docs/DEPLOYMENT.md`
- Roadmap: `docs/ROADMAP.md`
- Ideas and vibe-coder plan: `docs/AWESOME_IDEAS_AND_VIBE_CODER_PLAN.md`
- Vibe-coder prompt packs: `docs/VIBE_CODER_PROMPT_PACKS.md`
- Learning machine backlog: `docs/LEARNING_MACHINE_TODO.md`
- KB learning guide: `docs/KB_LEARNING_GUIDE.md`
- KB learning experience model: `docs/KB_LEARNING_EXPERIENCE_MODEL.md`
- KB learning acceptance criteria: `docs/KB_LEARNING_ACCEPTANCE.md`
- KB learning QA checklist: `docs/KB_LEARNING_QA.md`
- Agent coordination guide: `docs/AGENT_COORDINATION.md`
- Project tracker: `TODO.md`
- Health & Outdoors implementation note: `HEALTH_OUTDOORS_IMPLEMENTATION.md`

## Privacy

This app is designed for generic professional development tracking. Do not store client names, company names, passwords, screenshots, copied ticket text, hostnames, IP addresses, or sensitive operational data in the app.

## Tech Stack

- React
- TypeScript
- Vite
- Browser localStorage for local progress

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is generated in `dist/`.
