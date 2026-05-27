# Learning Machine TODO

This backlog turns the prompt packs in `VIBE_CODER_PROMPT_PACKS.md` into implementation-sized tasks.

Core model:

Work Companion captures real work. Avance PD turns that work plus safe KB summaries into skill.

Learning loop:

`work -> learning seed -> KB field card -> active recall -> scenario drill -> ticket note drill -> spaced review -> evidence`

## Priority Build Order

- [ ] App 2: create the KB Learning Machine shell.
- [ ] App 2: add KB Map and editable field cards.
- [ ] App 2: add spaced repetition review scheduling.
- [ ] App 2: add scenario-first learning mode.
- [ ] App 2: add ticket-note drill scoring.
- [ ] App 2: upgrade Evidence Pack around learning proof.
- [ ] App 1: mark captured work as learning seeds.
- [ ] App 1: add After Action Review on work logs.
- [ ] App 1: add local KB hints from safe static metadata.
- [ ] App 1: add Change Guardrail for risky work.

## App 1: Work Companion Backlog

- [ ] App shell identity: ensure title, metadata, header, sidebar, and dashboard use `Avance Work Companion`.
- [ ] Quick Capture ticket-note builder: add note-quality checklist, ticket-note preview, and copy action.
- [ ] Follow-up triage: add waiting status, due date, priority, next nudge, overdue counts, and generic follow-up wording.
- [ ] Repeated issue to playbook draft: convert repeated local tags/logs into editable generic playbook drafts.
- [ ] Healthy MSP Shift rhythm coach: add mode selector, short mode-specific actions, reset timestamp, and local-only storage.
- [ ] Change Guardrail: add approval, rollback, before-state, and senior-check prompts for risky work.
- [ ] Learning seeds: add work type, skill area, confidence, review flag, related KB, follow-up date, and learning note fields.
- [ ] Learning queue: store `learningQueue` items locally and include them in backup/export.
- [ ] After Action Review: add `Review this` action to work logs with reflection note and learning queue export.
- [ ] Ticket note drill from real work: score notes locally as needs work, usable, or strong.
- [ ] KB hints: add a static `kbHints` data file with generic titles/categories/keywords only.

## App 2: PD Product Backlog

- [ ] Product identity: set browser title/header to `Avance PD` and clarify the app as the learning cockpit.
- [ ] PD Focus Today: replace static next move with a local next-best-action engine.
- [ ] Scenario-to-ticket-note flow: make scenario practice end with a rubric-checked ticket note.
- [ ] Manager-safe Evidence Pack export: generate copyable/downloadable Markdown with privacy warnings.
- [ ] MSP skill map: show confidence, evidence count, related scenarios, and next recommended practice.
- [ ] Follow-up discipline training: add categories, templates, stale indicators, and next-action guidance.
- [ ] Communication Practice: add client update, escalation, change approval, follow-up, closure, and investigation drills.
- [ ] Demo data controls: badge seed data, clear demo data, restore demo data, and protect user-created entries.
- [ ] Privacy/safety linting: warn on obvious emails, phone numbers, passwords, tokens, and private details.
- [ ] Weekly PD Review: generate a short manager-ready weekly review and save it to Evidence Pack.

## App 2: KB Learning Machine Backlog

- [ ] KB Learning Machine navigation/page with KB Map, Learning Queue, Reviews, Field Cards, Flashcards, Scenario Drills, Ticket Note Drills, and Evidence connection.
- [ ] Dashboard card showing KB cards created, reviews due today, scenarios completed, and skills improving.
- [ ] Field card data model with title, category, when to use, prerequisites, first checks, core steps, common mistake, escalation point, related skill, confidence, and review due date.
- [ ] Seed manual KB cards for Intune, Entra migration, JumpCloud import, Google 2FA, Veeam, Outlook, Exchange permissions, RDP USB, printer config, Yealink, and SharePoint/OneDrive security policy topics.
- [ ] Category filters for Identity, Microsoft 365, Devices, Security, Backup/recovery, Phones, Printing, Client-specific, Networking, Business/admin, and Unknown.
- [ ] Review scheduler fields: `createdAt`, `lastReviewedAt`, `nextReviewAt`, `reviewStage`, `easeRating`, and `confidence`.
- [ ] Review results: Again, Hard, Good, Easy.
- [ ] Active recall flashcards generated from field card content, plus custom flashcards.
- [ ] Scenario Mode with at least 12 realistic but generic MSP scenarios.
- [ ] Ticket note drill scoring linked to KB cards, scenarios, work logs when available, and Evidence Pack.
- [ ] Skill tree/mastery map linking skills to KB cards, reviews, scenarios, flashcards, ticket-note drills, and evidence.
- [ ] Daily Learning Plan with one KB review, one recall drill, one scenario or ticket-note drill, one reflection, and optional stretch item.
- [ ] Teach-back Mode with checklist feedback and Evidence Pack save.

## Data Model Notes

Suggested `learningQueue` item:

```ts
{
  id: string;
  createdAt: string;
  title: string;
  summary: string;
  workType: string;
  skillArea: string;
  confidence: string;
  relatedKb?: string;
  sourceWorkLogId?: string;
  needsReview: boolean;
  reviewDueAt?: string;
}
```

Suggested KB field card:

```ts
{
  id: string;
  title: string;
  category: string;
  whenToUse: string;
  prerequisites: string;
  firstChecks: string[];
  coreSteps: string[];
  commonMistake: string;
  escalateIf: string;
  relatedSkill: string;
  confidence: string;
  reviewStatus: string;
  createdAt: string;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  reviewStage: number;
  easeRating?: string;
}
```

## Privacy Checklist

- [ ] No client names or company names in seed data.
- [ ] No copied ticket text.
- [ ] No passwords, tokens, recovery codes, or API keys.
- [ ] No hostnames, IPs, screenshots, emails, phone numbers, or private addresses.
- [ ] No direct HaloPSA, Gmail, Google Drive, Google Chat, RMM, or PSA sync.
- [ ] Export and Evidence Pack flows show `Review before sharing. Remove client-specific details.`
- [ ] Safety linting is a helper, not a guarantee.
- [ ] User can still save local notes after warnings when needed.
