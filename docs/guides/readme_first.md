# Avance Work Companion — Claude Code Starter Pack

This pack is designed to help Claude Code build a private work companion app for Josh as he starts part-time work with Avance Business Technology.

## What to do first
1. Open `01_CLAUDE_CODE_MASTER_PROMPT.md`
2. Paste that whole prompt into Claude Code in the root of your project folder
3. Let Claude scaffold the app, docs, and initial seed data
4. Then use `11_SECOND_PASS_PROMPT.md` for refinement after the first working version exists

## What this app is for
This is **not** meant to be a full PSA/RMM replacement.
It is a **personal operator app** for:
- getting ready before each Avance shift
- tracking shifts, notes, and invoices
- capturing client and tool knowledge
- building repeatable troubleshooting playbooks
- staying calm, prepared, and organised on Mondays and Wednesdays
- preserving continuity between part-time work days

## Suggested app name
Use a neutral internal name first:
- Avance Work Companion
- Avance Ops Companion
- Josh MSP Companion

## Strong recommendation
Build this as a **private, local-first web app / PWA** first.
Do **not** build real client credential storage in v1.
Do **not** scrape portals or break terms of service.
Keep integrations optional and gated behind manual setup.

## Files in this pack
- `01_CLAUDE_CODE_MASTER_PROMPT.md` — the main prompt for Claude Code
- `02_PRODUCT_VISION.md` — what the app is and why it should exist
- `03_PRD.md` — product requirements
- `04_INFORMATION_ARCHITECTURE.md` — pages, modules, and navigation
- `05_USER_STORIES_AND_ACCEPTANCE_CRITERIA.md` — concrete requirements
- `06_TECHNICAL_ARCHITECTURE.md` — recommended stack and implementation
- `07_UI_UX_AND_TONE_GUIDE.md` — how it should feel and behave
- `08_SAMPLE_SEED_DATA.md` — realistic starter content
- `09_30_60_90_DAY_PLAN.md` — how to use the app as work ramps up
- `10_RESEARCH_BASIS_AND_ASSUMPTIONS.md` — what is known vs assumed
- `11_SECOND_PASS_PROMPT.md` — prompt for Claude after first scaffold
- `12_PROJECT_CHECKLIST.md` — build checklist

## Notes
Where public information conflicted, the current Avance website was treated as more current than older notes.
