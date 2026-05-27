# Agent Coordination

This document defines the split of responsibilities between Codex and Copilot for the AvancePD repo.

## Responsibilities

- **Codex owns implementation under `src/`.**
  - Codex is responsible for writing, updating, and testing application code.
  - All feature work in the React/Vite app should be implemented inside `src/` by Codex unless Josh explicitly asks otherwise.

- **Copilot owns docs, QA, acceptance criteria, and review notes.**
  - Copilot writes coordination docs, QA checklists, and acceptance criteria for feature slices.
  - Copilot reviews changes for doc accuracy, public-safety guardrails, and consistency.

## Workflow rules

- Both agents must run `git status` and `git pull --rebase` before starting work.
- Work should be delivered in one feature slice per commit.
- Do not commit raw KB files or private customer data to GitHub.
- Do not add external integrations unless Josh explicitly requests them.
- If source changes are already present, do not modify or commit `src/` files unless Codex or Josh asks.

## Safety guardrails

- Preserve local-only raw KB files and prompt exports outside the public repo history.
- Avoid duplicating long prompt packs or private content into tracked docs.
- Keep repository changes narrow and QA-focused when coordinating with Codex.
