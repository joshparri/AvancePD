# Avance Vibe Coder Prompt Packs

These prompt packs turn the captured planning notes into repo-safe implementation prompts for Codex, Trae, Windsurf, Cursor, or another coding agent.

Use one prompt at a time. Each prompt is intentionally scoped so an agent improves the app without rewriting the product, adding risky integrations, or storing sensitive client data.

## Product Model

Real work -> captured clearly -> mapped to skill -> converted into practice -> reviewed later -> proven in an Evidence Pack.

App 1: `avance-pd.vercel.app`

- Role: in-shift capture, ticket note drafts, follow-ups, quick learning capture, and safe workday rhythm.
- Product name: `Avance Work Companion`.
- This repository currently uses React, TypeScript, Vite, and browser localStorage. If a deployed version differs, inspect `package.json` before editing.

App 2: `avance-professional-development.vercel.app`

- Role: the learning cockpit for KB study, flashcards, scenario drills, spaced repetition, skill confidence, and evidence.
- Product name: `Avance PD`.
- Inspect the actual app before coding. Do not assume App Router, Pages Router, Vite, or Tailwind until the repo confirms it.

## Shared Guardrails

- Keep both apps local-first unless an existing optional sync feature is already present.
- Do not add auth, HaloPSA, Gmail, Google Chat, Google Drive, RMM, PSA, or external AI integrations unless a future task explicitly asks for them.
- Do not store passwords, API keys, recovery codes, private client details, copied ticket text, screenshots, hostnames, IP addresses, private emails, phone numbers, or medical/private personal notes.
- Use generic labels such as `client`, `ticket`, `workstation`, `tenant`, `mailbox`, and `device`.
- Preserve backup/export behavior.
- Run the relevant build command before finishing, usually `npm run build`.

## How To Use These Prompts

Give a coding agent one prompt only, then ask for:

- changed files
- verification steps
- assumptions
- any follow-up TODOs

Do not paste the whole pack into an agent at once. That invites broad rewrites and fake progress.

## App 1 Prompt Pack: Avance Work Companion

### App 1 Prompt 1: Rename, Stabilise, And Clarify The App Shell

You are working on the Avance Work Companion app.

Context:

This is a lightweight internal MSP work companion for Josh at Avance Technology. It is not a full PSA, not HaloPSA, not a replacement for tickets, and not a client-data system. It helps capture local work logs, follow-ups, learning notes, task reminders, shift context, and healthy work habits.

Observed dashboard areas:

- Next shift
- Invoice cycle
- Getting started
- Healthy MSP Shift
- Today's tiny practice
- Quick capture
- Open follow-ups
- Recent work logs
- Repeated issue suggestions
- Backup/export
- Optional Supabase sync if already implemented

Task:

Improve the app shell and identity without changing the core data model unnecessarily.

Required changes:

- Set the browser tab title to `Avance Work Companion`.
- Add or update metadata/description: `Local-first work companion for Avance shifts, tasks, follow-ups, work logs, and professional development.`
- Use `Avance Work Companion` as the primary product name and `Work Companion` only where space is tight.
- Add a small dashboard subtitle: `Capture work, follow up clearly, and keep the shift sustainable.`
- Do not rename this app to `Avance PD`; that name belongs to App 2.

Implementation notes:

- Inspect `package.json` first.
- In this repo, Vite metadata usually belongs in `index.html`; React page text lives under `src/`.
- If a separate deployed app uses Next.js App Router, update `src/app/layout.tsx` metadata.
- If it uses Next.js Pages Router, update `Head`, `_app`, or `_document` as appropriate.
- Keep changes minimal and production safe.

Acceptance criteria:

- Browser tab no longer says `Create Next App`.
- App title is consistent.
- Dashboard subtitle is visible and useful.
- No dashboard sections disappear.
- LocalStorage and backup/export behavior still work.
- Build passes.

### App 1 Prompt 2: Upgrade Quick Capture Into A Ticket Note Builder

You are improving the Quick Capture section of Avance Work Companion.

Context:

Quick Capture should help Josh turn messy MSP work into structured notes without storing sensitive client data. It should support follow-ups, learned-today notes, shift notes, communication notes, work logs, tasks, and learning items.

Task:

Upgrade Quick Capture into a safer structured note builder.

Required UI changes:

- Add a `Note quality` helper panel beside or below the capture form.
- Show this checklist:
  - Outcome clear?
  - Next action clear?
  - Ticket/client reference generic?
  - No passwords or secrets?
  - Follow-up needed?
- Add a `Convert to ticket note` button.
- Generate a preview without overwriting the original entry.
- Add a copy-to-clipboard button.

Generated ticket note format:

```text
Summary:
What happened:
Action taken:
Current status:
Follow-up required:
Tags:
```

Use `Not captured yet.` for missing fields.

Constraints:

- Work offline.
- Do not use AI or external APIs.
- Reuse existing work log fields where possible.
- Avoid schema churn.
- If backup JSON shape changes, add safe defaults or migration handling.

Acceptance criteria:

- User can enter a work log.
- User can generate a clean ticket-note preview.
- User can copy the generated note.
- Existing capture still works.
- Backup/export still works.
- Build passes.

### App 1 Prompt 3: Add Follow-Up Triage Without Becoming A PSA

You are improving Open Follow-ups in Avance Work Companion.

Context:

Follow-ups often mean waiting on a client, waiting on Avance, waiting on a vendor, waiting on invoicing/admin, waiting on user action, or closing a loop later. The app should help track local reminders without becoming HaloPSA.

Task:

Add a lightweight Follow-up Triage panel.

Required features:

- Follow-up status:
  - Waiting on client
  - Waiting on Avance
  - Waiting on vendor
  - Waiting on invoice
  - Waiting on user action
  - Done
- Due date.
- Next nudge field.
- Priority: low, medium, high.
- Compact dashboard summary:
  - Due today
  - Overdue
  - Waiting on others
  - Waiting on me
- `Generate follow-up wording` button.

Generated wording:

```text
Hi [name/client], just following up on [generic issue/ticket reference]. Could you please confirm [next step]? Thanks.
```

Safety copy:

`Keep this generic. Use Halo for official client records.`

Acceptance criteria:

- User can create a follow-up.
- User can assign waiting status and due date.
- User can see overdue/due counts.
- User can generate simple follow-up wording.
- Existing demo follow-ups still render.
- Build passes.

### App 1 Prompt 4: Build Repeated Issue To Playbook Draft

You are improving Repeated Issue Suggestions in Avance Work Companion.

Context:

Repeated local tags or similar work-log titles should become reusable generic playbooks. Examples include Outlook sync issues, MFA/authenticator problems, endpoint security performance concerns, OneDrive confusion, shared drive permissions, printer issues, mailbox workflow confusion, phishing mailbox setup, laptop setup, and onboarding steps.

Task:

Turn repeated issues into editable playbook drafts.

Required features:

- On each repeated issue card, show `Draft playbook`.
- Prefill:
  - Title
  - When to use
  - Symptoms
  - First checks
  - Safe next steps
  - Escalate when
  - Related tags
- Populate from local work log titles/details/tags where possible.
- Do not use AI or external APIs.
- Let the user edit before saving.
- Save into the existing Knowledge or Playbooks area.

Acceptance criteria:

- Repeated issue card can become an editable playbook draft.
- Draft can be saved.
- Saved draft appears in the existing playbook/knowledge area.
- Existing logs still work.
- Build passes.

### App 1 Prompt 5: Improve Healthy MSP Shift Into A Rhythm Coach

You are improving Healthy MSP Shift.

Context:

The goal is not wellness fluff. It is to keep Josh steady, sustainable, and useful during reactive MSP shifts.

Task:

Make Healthy MSP Shift more actionable.

Required features:

- Add a current mode selector:
  - normal shift
  - urgent ticket mode
  - admin catch-up
  - learning block
  - off shift
- Change recommendations by mode.
- Suggested actions:
  - Normal shift: drink water, check posture, capture one note.
  - Urgent ticket mode: slow breath, write the next concrete step, avoid major changes without approval.
  - Admin catch-up: process follow-ups, update notes, export backup if due.
  - Learning block: choose one micro-learning card, write one learned-today note.
  - Off shift: stop logging unless urgent, transition away from work.
- Add `2-minute reset done`.
- Record and show last reset timestamp.

Guidance:

- Avoid guilt language.
- Avoid medical claims.
- Keep suggestions short.
- Keep data local.

Acceptance criteria:

- Mode selector works.
- Recommendations update by mode.
- Reset timestamp saves locally.
- Dashboard remains clean.
- Build passes.

### App 1 Prompt 6: Add Change Management Guardrail

You are adding a lightweight change-management guardrail to Avance Work Companion.

Context:

Major technical changes can create risk if done too quickly. The app should help Josh pause before risky actions. It should not block work; it is a quick thinking checklist.

Where it fits:

- Add it under Quick Tools or Command Center.
- Optionally surface it when work-log tags include security, Microsoft 365, endpoint security, DNS, firewall, migration, user setup, tenant, backup, deletion, or change.

Required checklist:

- Is there an existing ticket?
- Is the client impact understood?
- Is this reversible?
- Has approval been given?
- Have I captured a before-state?
- Do I know the rollback step?
- Should a senior tech/manager be asked first?

Generated change note:

```text
Proposed change:
Reason:
Risk:
Approval needed:
Rollback:
Evidence captured:
```

Acceptance criteria:

- User can open Change Guardrail.
- User can tick checklist items.
- App generates a simple change note.
- User can copy the note.
- Build passes.

### App 1 Prompt 7: Turn Work Companion Into The Capture Engine For Learning

You are improving Avance Work Companion as App 1 in the two-app learning system.

Goal:

Work Companion captures real work during or immediately after Avance shifts. Avance PD turns that work into structured learning.

Task:

Upgrade Quick Capture so every captured item can optionally become a learning seed.

Add these fields:

- Work type:
  - ticket note
  - follow-up
  - learned today
  - client communication
  - troubleshooting
  - change/check
  - admin/invoice
- Skill area:
  - Microsoft 365
  - Outlook
  - OneDrive
  - Intune
  - Entra ID
  - JumpCloud
  - SentinelOne
  - Datto RMM
  - Ironscales
  - DNS/domain
  - printers
  - phones/Yealink
  - backup/recovery
  - HaloPSA
  - client communication
  - change management
  - unknown
- Confidence:
  - new
  - practising
  - can follow KB
  - can do with support
  - independent
  - can teach
- Needs review: yes/no.
- Related KB: optional free text, with a placeholder like `e.g. Enrolling a New Computer into Intune`.
- Follow-up date: optional.
- Learning note: optional short text.

Add a compact `Send to learning queue` button.

When clicked, save a local `learningQueue` item:

- id
- createdAt
- title
- summary
- workType
- skillArea
- confidence
- relatedKb
- sourceWorkLogId
- needsReview
- reviewDueAt

Set `reviewDueAt` to tomorrow by default if `needsReview` is true.

UI requirements:

- Do not make the form huge.
- Use progressive disclosure if needed.
- Show a compact card called `Learning seeds captured today`.
- Show count and latest 3 items.

Acceptance criteria:

- Existing Quick Capture still works.
- User can capture a work log and mark it as a learning seed.
- Learning queue saves locally.
- Backup/export includes learning queue.
- App still builds.
- No existing dashboard sections disappear.

### App 1 Prompt 8: Add After Action Review

You are adding a fast After Action Review feature.

Where it fits:

- Near Recent Work Logs or on each work-log card.
- Button label: `Review this`.
- Open a small panel or modal.

Required fields:

1. What was the issue?
2. What did I check first?
3. What fixed it or moved it forward?
4. What did I not understand yet?
5. What KB or skill does this relate to?
6. What would I do faster next time?
7. Do I need to review this later?

Buttons:

- Save review
- Copy as reflection note
- Add to learning queue

Generated reflection note:

```text
Summary:
First checks:
Action taken:
Gap noticed:
KB/skill:
Next time:
Review needed:
```

Acceptance criteria:

- Each work log can have an After Action Review.
- Review can become a learning queue item.
- Review is included in backup/export.
- Existing work-log display still works.
- Build passes.

### App 1 Prompt 9: Add Ticket Note Drill From Real Work

You are adding a ticket-note drill from work logs.

Where it fits:

- Add `Ticket note drill` on work-log cards.
- Reuse or extend the Ticket Note Builder if one exists.

Required note structure:

- Summary
- Environment/context
- Checks performed
- Action taken
- Result/status
- Follow-up required
- Escalation/approval
- Next step

Checklist feedback:

- Has summary?
- Has action taken?
- Has current status?
- Has next step?
- Has follow-up owner?
- Avoids passwords/secrets?
- Avoids unnecessary sensitive details?

Score labels:

- Needs work
- Usable
- Strong

Acceptance criteria:

- Ticket note drill works from a work log.
- Missing fields show.
- User can copy final note.
- User can save note as learning evidence.
- No data leaves the browser.
- Build passes.

### App 1 Prompt 10: Add KB Hints Without Scraping Drive

You are adding local KB hints.

Goal:

When Josh captures work, suggest possible KB categories or KB titles to study later.

Important:

- Do not connect to Google Drive.
- Do not fetch private KB PDFs.
- Do not scrape the KB folder.
- Use only a local static list of generic KB titles/categories.

Create `kbHints.ts` or equivalent.

Each KB hint should have:

- id
- title
- category
- keywords
- skillArea
- cautionLevel: low, medium, or high
- studyPrompt

Example:

```ts
{
  title: "Migrating Local User Account to Entra Account",
  category: "Identity / Device migration",
  keywords: ["entra", "local profile", "profile migration", "intune"],
  skillArea: "Entra ID",
  cautionLevel: "high",
  studyPrompt: "Practise explaining when to migrate a local profile and what can go wrong."
}
```

Feature:

- Match local work-log title/details/tags against keywords.
- Show `Possible KB to study`.
- Let the user click `Add to learning queue`.
- Store only title/category, not KB content.

Acceptance criteria:

- KB hints appear when relevant.
- User can add a hint to the learning queue.
- Works offline.
- Build passes.

## App 2 Prompt Pack: Avance PD Product Polish

### App 2 Prompt 1: Fix Browser Title And Product Identity

You are working on Avance PD.

Current issue:

The browser tab may still say `Create Next App`.

Product distinction:

Avance PD is focused on professional development, learning progress, skill growth, scenarios, evidence packs, and readiness. It is not the same as Avance Work Companion.

Task:

- Change browser tab title to `Avance PD`.
- Add description: `Professional development cockpit for MSP skills, scenarios, ticket notes, learning evidence, and sustainable work habits.`
- Header should say `Avance PD`.
- Subtitle should say `MSP learning, evidence, and skill growth.`
- Keep `Avance Work Companion` wording out of this app except as a comparison/migration note.

Acceptance criteria:

- Browser tab says `Avance PD`.
- Header branding is consistent.
- No navigation items disappear.
- Existing local data still works.
- Build passes.

### App 2 Prompt 2: Upgrade PD Focus Today Into A Next Best Action Engine

You are improving `PD Focus Today`.

Task:

Create a local next-best-action engine.

Recommendation logic:

1. If there are overdue tasks, recommend the most urgent overdue task.
2. Else if follow-ups are due, recommend follow-up triage.
3. Else if there are recent repeated work-log tags, recommend a matching skill/scenario.
4. Else if no learning has been logged today, recommend a micro-learning activity.
5. Else recommend a reflection note or Evidence Pack update.

UI:

- Add `Why this?`.
- Add estimated time.
- Add action type: task, scenario, learning, follow-up, evidence, or reflection.
- Add `Start next action`.

Constraints:

- No external AI call.
- Use current local data structures.
- Keep logic readable.

Acceptance criteria:

- Next Best Move changes based on local data.
- Explanation is visible.
- It never shows blank.
- It handles empty/demo data.
- Build passes.

### App 2 Prompt 3: Add Scenario-To-Ticket-Note Practice Flow

You are improving MSP Scenarios and Ticket Notes.

Task:

Create a scenario practice flow that ends with a ticket note.

Required flow:

1. User opens an MSP scenario.
2. Scenario shows a client-safe title, context, symptoms, constraints, and first checks.
3. User writes what they would check first, what they would say to the client, and a final ticket note.
4. App provides local rubric feedback:
   - Clear summary
   - Action taken
   - Current status
   - Follow-up required
   - No sensitive data
   - Escalation noted if needed
5. User can save completed practice as evidence.

Seed scenario examples:

- Outlook not sending or receiving on one workstation.
- Endpoint security appears to be causing high CPU on a slow laptop.
- Phishing-reporting mailbox/setup issue.
- New laptop setup requires productivity apps, sync, and mail.
- PSA email workflow issue due to the wrong mailbox workflow.
- Client waiting on hardware quote or invoice.

Acceptance criteria:

- At least 6 scenarios exist.
- User can complete a scenario.
- Rubric-based feedback appears.
- Completed scenario can be saved to Evidence Pack.
- Build passes.

### App 2 Prompt 4: Build Manager-Safe Evidence Pack Export

You are improving Evidence Pack.

Task:

Generate a Markdown-style summary that can be copied/downloaded.

Sections:

1. Date range
2. Summary of learning activity
3. Skills practised
4. Scenarios completed
5. Ticket-note quality examples
6. Work patterns noticed
7. Follow-ups managed
8. Areas to keep improving
9. Next development goals

Safety:

- Redact or avoid client names by default.
- Never include credentials, emails, phone numbers, private health notes, or client-sensitive details.
- Show: `Review before sharing. Remove client-specific details.`

Acceptance criteria:

- Evidence Pack can be generated.
- Copy works.
- Empty state works.
- Sensitive-data warning appears.
- Build passes.

### App 2 Prompt 5: Add MSP Skill Map

You are improving MSP Skills.

Skill areas:

- Microsoft 365 basics
- MFA/authenticator support
- Outlook profile troubleshooting
- OneDrive sync
- HaloPSA ticketing and notes
- Datto RMM basics
- SentinelOne basics
- Ironscales/phishing protection
- Phishing-reporting mailbox setup
- Laptop setup/onboarding
- Printer troubleshooting
- DNS/domain basics
- Change management
- Client communication
- Follow-up discipline
- Invoicing awareness

Each skill card should show:

- Skill name
- Confidence level
- Evidence count
- Next recommended practice
- Related scenarios

Confidence levels:

- new
- practising
- reliable with support
- independent
- can teach

Acceptance criteria:

- Skill map displays.
- User can update confidence.
- Evidence count appears.
- Related scenarios link correctly.
- Build passes.

### App 2 Prompt 6: Improve Follow-Up Area Into Operational Discipline Training

You are improving Follow-Up Area while preserving its privacy-first design.

Categories:

- client response
- internal approval
- vendor/third party
- invoice/admin
- hardware pickup
- investigation decision
- close/check later

Required features:

- Add next-action templates for each category.
- Add due date and reminder label.
- Add stale follow-up indicator if overdue.
- Add a compact `what to do next` helper.

Acceptance criteria:

- Follow-up can be created with category.
- Template appears.
- Overdue state is visible.
- Empty state still works.
- Build passes.

### App 2 Prompt 7: Add Communication Practice

You are adding communication practice for client-safe wording.

Practice types:

- Client update
- Internal escalation
- Change approval request
- Follow-up nudge
- Ticket closure summary
- `I am not sure yet, but I am investigating` message

Each practice includes:

- Scenario
- User draft field
- Local checklist feedback:
  - clear
  - calm
  - concise
  - next step included
  - no sensitive/private data
  - appropriate escalation
- Improved generic example answer

Acceptance criteria:

- Communication Practice exists.
- User can draft response.
- Checklist feedback appears.
- Example answer appears.
- Practice can be saved to Evidence Pack.
- Build passes.

### App 2 Prompt 8: Add Demo Data And Reset Controls

You are improving demo/local data handling.

Task:

- Add `Demo data` badge where seeded examples appear.
- Add `Clear demo data`.
- Add `Restore demo data`.
- Ensure user-created entries are not deleted unless the user explicitly chooses `Clear all local data`.
- Add confirmation dialogs for destructive actions.
- Add backup reminder before clearing data.

Acceptance criteria:

- Demo entries are labelled.
- User can clear demo data only.
- User can restore demo data.
- User data remains safe.
- Build passes.

### App 2 Prompt 9: Add Privacy And Safety Linting

You are adding a local safety helper for user-entered text.

Warn if text appears to contain:

- email addresses
- phone numbers
- passwords
- API keys
- long secret-looking tokens
- private addresses
- credit-card-like numbers
- medical/private personal notes
- real client credentials

Behavior:

- Warning does not block saving by default.
- Show: `This looks like it may contain sensitive information. Consider replacing it with a generic reference before saving.`
- Add `Save anyway`.
- Add `Copy redacted version` if easy.

Acceptance criteria:

- Safety warning appears for obvious email/password/token patterns.
- User can still save if needed.
- Warning does not break forms.
- Build passes.

### App 2 Prompt 10: Create Manager-Ready Weekly PD Review

You are adding Weekly Review.

Inputs:

- work logs
- completed scenarios
- skill confidence changes
- ticket note practice
- evidence entries
- pending tasks
- follow-ups
- learning minutes if available

Sections:

1. This week I worked on
2. Skills I practised
3. Scenarios or training completed
4. Ticket-note quality improvements
5. Follow-ups managed
6. Risks or blockers
7. What I need help with
8. Focus for next week

Buttons:

- Generate weekly review
- Copy review
- Save to Evidence Pack

Acceptance criteria:

- Weekly review can be generated from existing local data.
- Copy works.
- Save to Evidence Pack works.
- Empty state gives guidance.
- Build passes.

## App 2 Prompt Pack: KB Learning Machine

### KB Prompt 1: Create The KB Learning Machine Shell

You are working on Avance PD.

Goal:

Turn Avance PD into the main learning machine for MSP skill growth.

Core learning model:

KB -> field card -> active recall -> scenario -> ticket note drill -> spaced review -> evidence.

Add a new section/page: `KB Learning Machine`.

It should include:

- KB Map
- Learning Queue
- Today's Reviews
- Field Cards
- Flashcards
- Scenario Drills
- Ticket Note Drills
- Evidence Pack connection

Dashboard card:

- Title: `KB Learning Machine`
- Subtitle: `Turn Avance KBs into recall, scenarios, and ticket-note practice.`
- Stats:
  - KB cards created
  - Reviews due today
  - Scenarios completed
  - Skills improving

Acceptance criteria:

- New KB Learning Machine section exists.
- Dashboard links to it.
- Existing navigation still works.
- Existing PD Focus still works.
- Build passes.

### KB Prompt 2: Build KB Map And Field Cards

You are adding the KB Map and Field Card system.

Field card structure:

- KB title
- Category
- When to use
- Prerequisites
- First checks
- Core steps
- Common mistake
- Escalate if
- Related skill
- Confidence level
- Review due date

Categories:

- Identity
- Microsoft 365
- Devices
- Security
- Backup/recovery
- Phones
- Printing
- Client-specific
- Networking
- Business/admin
- Unknown

Seed example KB cards:

1. Enrolling a New Computer into Intune
2. Migrating Local User Account to Entra Account
3. Importing Office 365 or Google Workspace User into JumpCloud
4. Turning on 2 Factor Authentication for Google Account
5. Veeam Agent Recovery Guide
6. Outlook Opening Links in Edge
7. Increase Outlook PST and OST capacity
8. Editing Exchange Calendar Permissions with PowerShell
9. RDP Not Passing Through USB Drives
10. Generic Printer Configuration
11. Adding a New Yealink Phone to Provisioning Server
12. Creating a Policy for Detecting Malicious Files in SharePoint and OneDrive

Important:

- Do not include private client details.
- Do not include credentials.
- Do not pretend to have imported every KB from Drive.
- These are seed/manual cards.

Acceptance criteria:

- User can create/edit/delete KB field cards.
- Seed cards appear only as demo/seed data.
- User can filter by category.
- User can change confidence.
- Cards save locally.
- Build passes.

### KB Prompt 3: Add Spaced Repetition Review Scheduling

You are adding spaced repetition.

Learning intervals:

- First review: same day
- Review 1: next day
- Review 2: 3 days later
- Review 3: 1 week later
- Review 4: 2 weeks later
- Review 5: 1 month later

Data on each field card:

- createdAt
- lastReviewedAt
- nextReviewAt
- reviewStage
- easeRating
- confidence

Review result options:

- Again
- Hard
- Good
- Easy

Scheduling:

- Again: review tomorrow, keep same stage.
- Hard: review in 2 days.
- Good: move to next interval.
- Easy: move forward one extra stage if safe.

Acceptance criteria:

- Reviews become due based on date.
- User can complete a review.
- `nextReviewAt` updates.
- Dashboard count updates.
- Build passes.

### KB Prompt 4: Build Active Recall Flashcards

You are adding flashcards from field cards.

Generate these question types locally:

1. When would I use this KB?
2. What should I check first?
3. What tool/admin portal is involved?
4. What is the riskiest step?
5. What mistake should I avoid?
6. When should I escalate?
7. What would I write in the ticket note?

Flow:

- Show question.
- User thinks/answers.
- Button: `Show answer`.
- Buttons: `Missed it`, `Nearly`, `Got it`.
- Save result to review history.

Acceptance criteria:

- Each KB can have flashcards.
- User can review flashcards.
- Answers come from field card content.
- User can add custom flashcards.
- Review results are saved.
- Build passes.

### KB Prompt 5: Build Scenario-First Learning Mode

You are adding Scenario Mode.

Scenario structure:

- Scenario title
- Related KB
- Skill area
- Situation
- Symptoms
- Constraints
- What should you check first?
- What would you do next?
- When would you escalate?
- What ticket note would you write?

Seed scenarios:

1. Local profile must be preserved while moving a computer to Entra/Intune.
2. New laptop needs Intune enrolment.
3. User needs Google 2FA enabled.
4. User needs Office 365/Google user imported into JumpCloud.
5. User needs a file restored from backup.
6. Outlook links keep opening in Edge.
7. PST/OST mailbox file is too large.
8. Exchange calendar permissions need to be adjusted.
9. RDP session does not pass through USB drives.
10. Yealink phone needs provisioning.
11. Printer configuration needs to be recreated.
12. SharePoint/OneDrive malicious file detection policy needs checking.

Practice flow:

- Show scenario.
- Ask for first checks, safest next step, risk, escalation point, and ticket note.
- Show rubric checklist:
  - identified likely KB
  - first checks clear
  - safe next step
  - risk noted
  - escalation noted
  - ticket note complete
- User can save as evidence.

Acceptance criteria:

- Scenario Mode exists.
- At least 12 scenarios exist.
- User can complete a scenario.
- Rubric gives local checklist feedback.
- Completed scenario can save to Evidence Pack.
- Build passes.

### KB Prompt 6: Add Ticket-Note Drill Scoring

You are improving Ticket Notes.

Create a ticket-note drill system linked to:

- KB cards
- scenarios
- work logs if available
- Evidence Pack

Required sections:

- Summary
- Environment
- Checks performed
- Action taken
- Result
- Follow-up
- Escalation
- Next step

Rubric:

- Clear summary
- Mentions relevant system/tool
- Notes first checks
- States action taken
- States current status
- Names follow-up/owner
- Avoids secrets
- Avoids unnecessary sensitive details
- Is short enough for a real PSA note

Scoring:

- 0-3: needs work
- 4-6: usable
- 7-9: strong

Acceptance criteria:

- Ticket note drill exists.
- Scoring works.
- Copy works.
- Save to Evidence Pack works.
- Build passes.

### KB Prompt 7: Build Skill Tree And Mastery Map

You are improving MSP Skills.

Skill areas:

- Microsoft 365
- Outlook
- OneDrive/SharePoint
- Entra ID
- Intune
- JumpCloud
- Google Workspace
- SentinelOne
- Datto RMM
- Ironscales/phishing protection
- DNS/domains
- printers
- phones/Yealink
- backup/recovery
- HaloPSA ticketing
- client communication
- change management
- documentation/ticket notes

Each skill card should show:

- skill name
- confidence level
- linked KB cards
- due reviews
- scenarios completed
- ticket-note drills completed
- evidence count
- next recommended action

Confidence levels:

1. I recognise it
2. I can explain it
3. I can follow a KB
4. I can do it with support
5. I can do it independently
6. I can teach it

Acceptance criteria:

- Skill tree/map displays.
- Skills link to KB cards, scenarios, flashcards, and evidence.
- User can update confidence.
- Dashboard can show weakest skill and next skill.
- Build passes.

### KB Prompt 8: Build Evidence Pack As Proof Of Learning

You are improving Evidence Pack.

Evidence sources:

- completed KB reviews
- completed flashcards
- completed scenarios
- ticket-note drills
- field cards created
- skill confidence changes
- weekly reflections
- work logs marked as learning seeds

Output sections:

1. Date range
2. Skills practised
3. KBs studied
4. Scenarios completed
5. Ticket notes practised
6. Confidence changes
7. Gaps identified
8. Next development goals
9. Support needed

Buttons:

- Generate Evidence Pack
- Copy
- Download Markdown
- Save snapshot

Acceptance criteria:

- Evidence Pack generates from local learning data.
- Copy works.
- Download works if existing app patterns support downloads.
- Empty state gives useful guidance.
- Build passes.

### KB Prompt 9: Add Daily Learning Plan

You are adding Daily Learning Plan.

Inputs:

- reviews due today
- weak skills
- learning queue
- pending scenarios
- recent work logs if present
- confidence levels
- last study date

Daily plan:

1. One KB review
2. One active recall drill
3. One scenario or ticket-note drill
4. One tiny reflection
5. Optional stretch item

Target time:

- 15 minutes minimum
- 30 minutes ideal
- 45 minutes stretch

Buttons:

- Start plan
- Mark done
- Skip today
- Reschedule

Acceptance criteria:

- Daily plan appears.
- Plan uses due reviews first.
- User can complete or skip.
- Build passes.

### KB Prompt 10: Add Teach-Back Mode

You are adding Teach-back Mode.

Goal:

Josh should explain KBs as if teaching a new L1 tech.

Flow:

1. Pick a KB card.
2. App asks: `Explain this in your own words without looking.`
3. User writes or types explanation.
4. App shows checklist:
   - Did you explain when to use it?
   - Did you mention prerequisites?
   - Did you explain the safe order?
   - Did you mention common mistake?
   - Did you mention escalation point?
   - Could a new L1 follow this?
5. User marks: not yet, nearly, or clear.
6. Save teach-back attempt to evidence.

Acceptance criteria:

- Teach-back mode exists.
- User can complete teach-back attempt.
- Checklist feedback works.
- Attempt saves to Evidence Pack.
- Build passes.

## Recommended Build Order

Start here for the strongest learning loop:

1. App 2 KB Prompt 1: create the KB Learning Machine shell.
2. App 2 KB Prompt 2: KB Map and field cards.
3. App 2 KB Prompt 3: spaced repetition.
4. App 2 KB Prompt 5: scenario mode.
5. App 2 KB Prompt 6: ticket-note drills.
6. App 2 KB Prompt 8: evidence pack.
7. App 1 Prompt 7: capture work as learning seeds.
8. App 1 Prompt 8: After Action Review.

Quick polish order:

1. App 2 Prompt 1: fix product title and branding.
2. App 1 Prompt 2: ticket note builder.
3. App 2 Prompt 4: Evidence Pack export.
4. App 2 Prompt 5: skill map.
5. App 1 Prompt 6: change-management guardrail.

## Starter Study Areas

These are safe, generic starter areas derived from the planning notes. Keep actual KB contents, client names, credentials, and private operational details out of the app.

1. Passwords, access, and security hygiene
   - Password manager process
   - Account setup and MFA
   - Conditional access basics
2. Device enrolment and workstation setup
   - Intune enrolment
   - Local-to-cloud profile migration concepts
   - New workstation setup checklist
3. Backup monitoring and recovery
   - Backup verification
   - Recovery testing
   - Escalation and evidence capture
4. Remote access and terminal services
   - Remote app access
   - VPN/RDP troubleshooting
   - Multi-monitor and display issues
5. Communications and VoIP
   - Yealink provisioning concepts
   - PBX basics
   - Call-routing and handover notes
