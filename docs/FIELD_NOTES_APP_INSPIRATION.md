# Field Notes App Inspiration

This document captures app-improvement ideas drawn from local field notes, chat summaries, and backlog exports kept outside this repository.

The source material contains real support context, client names, email addresses, ticket numbers, phone numbers, internal links, and operational details. Those raw exports must not be committed to GitHub. This document keeps only the product patterns, learning opportunities, and privacy-safe implementation ideas.

## Product Direction

The strongest inspiration is to make Avance PD feel less like a static training app and more like a calm MSP field cockpit. The app should help a technician move from noisy real-world work into clear next actions: follow up, triage, document, learn, escalate, and close the loop.

The guiding idea is:

- capture only safe, generic workflow data
- turn repeated support patterns into local playbooks and primers
- make hidden follow-ups visible before they are forgotten
- build judgement through realistic scenarios rather than generic quizzes
- protect privacy before any AI, sync, or external workflow is considered

## Source Handling Rules

- Do not commit raw chat exports, ticket exports, screenshots, or email threads.
- Do not store client names, user emails, phone numbers, hostnames, IP addresses, internal PSA URLs, or copied ticket text in the app.
- Use generic scenario labels such as `medical vendor coordination`, `identity provider migration`, or `foreign sign-in alert`.
- Ticket IDs may be used only as manual local references when needed for personal workflow, and should not be required in training examples.
- Any AI helper must show sanitized text before anything leaves the browser.

## High-Value Inspiration

### 1. Pending Action Tracker

Field pattern: tickets often stall while waiting for a client, vendor, or teammate to confirm the next step.

App improvement:

- keep a lightweight follow-up tracker on the dashboard or command center
- record a generic action required, due time, and status
- default follow-up due date to 24 hours
- include a one-click `Mark Complete` action
- generate a safe follow-up note scaffold

Guardrail:

- no direct PSA integration
- no automatic client import
- localStorage only until a deliberate sync model exists

Status:

- The app already has follow-up and task concepts. The next improvement is to make stalled third-party actions more explicit and easier to review during shift start and shutdown.

### 2. Monitoring Alert Sanitizer

Field pattern: security alerts can contain sensitive users, tenants, IP addresses, devices, and internal URLs, but the technician still needs quick triage guidance.

App improvement:

- add a `Monitoring Alert` mode to a privacy-safe helper
- paste raw alert text locally
- replace emails, IP addresses, hostnames, tenant names, and device names with placeholders
- show the sanitized version before coaching or note generation
- output a structured first-response plan

Suggested output:

- alert type and priority
- first system to check
- three immediate verification steps
- escalation condition
- ticket note scaffold

Guardrail:

- never submit raw alert text to an AI endpoint
- make the sanitized preview mandatory
- keep all examples fictional or generic

### 3. Security Alert Triage Paths

Field pattern: not every security notification is the same. A foreign sign-in, third-party app consent, and admin security-info change need different responses.

App improvement:

- create short triage paths for common alert categories
- use calm branching questions instead of a single generic MFA playbook
- include severity, first checks, documentation prompts, and escalation thresholds

Initial triage paths:

- anomalous foreign access
- user consent to a third-party application
- administrator security information change
- backup failure or monitoring failure
- endpoint agent health warning

Guardrail:

- classify by pattern, not by storing real user or client details
- keep the result as a note scaffold, not an incident-response automation

### 4. RDP And RemoteApps Primer

Field pattern: remote access issues recur and often involve certificates, RemoteApp feeds, VPN/RDG access, or server-side RDS configuration.

App improvement:

- keep a high-priority tool primer for Windows Remote Desktop and RemoteApps
- include the difference between client-side checks and senior-only server-side changes
- include a screenshot placeholder for RemoteApp and Desktop Connections
- add a ticket-note checklist for exact error, access path, reproduction, and escalation

Guardrail:

- warn against changing server-side RDP encryption, certificate bindings, or security settings without senior direction

Status:

- This idea already exists in the companion app pattern and should remain high priority because it turns a real recurring issue into a reusable technician reference.

### 5. Onsite Checklist

Field pattern: physical visits need preparation, execution, and closure discipline. Missed cables, vendor passwords, sign-off, or status updates create avoidable rework.

App improvement:

- build a three-phase onsite checklist
- persist checked items locally by visit draft
- include note export for the ticket-note builder
- support quick exception capture for work outside the original scope

Phases:

- before leaving office: hardware, cables, induction, tool checks, relevant playbooks
- onsite execution: arrival status, vendor coordination, install work, exceptions, sign-off
- after visit: structured notes, follow-up status, time entry, end-of-day reminders

Guardrail:

- do not store addresses, client names, or private access details
- keep vendor details generic unless manually entered into a private local-only note

### 6. Vendor Coordination Playbooks

Field pattern: medical, finance, and industry-specific clients often rely on third-party software vendors. The technician needs to coordinate access without mixing up vendors or assuming the wrong product owner.

App improvement:

- add vendor coordination as a playbook category
- include phone/email preparation prompts
- separate `what the client must do`, `what the vendor must do`, and `what Avance must do`
- include a waiting-on-client or waiting-on-vendor follow-up template

Guardrail:

- examples should use fictional vendor names or generic labels
- do not store real vendor case numbers in sample data

### 7. Identity Provider Migration Primer

Field pattern: small-business identity decisions can shift when licensing or management constraints change. Moving from one identity provider to Microsoft Entra can be sensible, but it needs careful device/profile planning.

App improvement:

- add an identity-provider migration primer
- include readiness checks before any device migration
- capture Windows edition, user profile migration plan, rollback plan, and senior approval
- include a ForensIT-style profile migration concept without making it a blind recipe

Guardrail:

- this should be a planning and learning primer, not a push-button migration workflow
- require senior approval before any live environment changes

### 8. Change-Management Guardrails

Field pattern: security-tool changes can be technically easy but operationally risky if old systems, billing, or client state are not understood first.

App improvement:

- add change-management prompts to security and admin workflows
- require the technician to answer `who approved this`, `what systems are affected`, `what is the rollback`, and `what billing/licensing changes`
- show a warning before any playbook step that implies tenant-wide or policy-level change

Guardrail:

- the app should teach restraint and escalation judgement, not just technical confidence

### 9. Device Setup And Handover Checklists

Field pattern: laptop and Mac setups often repeat the same categories: account access, office apps, cloud sync, RMM, endpoint protection, browser/profile setup, and user handover.

App improvement:

- create reusable setup checklists for Windows laptop, Mac laptop, and shared device setup
- include billable/non-billable prompt
- include handover confirmation and known limitation capture
- link completed checklist items to Evidence Pack skills

Guardrail:

- sample setup data must stay generic
- no usernames, license keys, passwords, or device serials

### 10. Halo Workflow Knowledge

Field pattern: support work includes PSA workflow knowledge, such as correct status, mailbox/source quirks, awaiting-invoice handling, and when to assign back to a senior.

App improvement:

- add a PSA workflow primer using generic labels
- include safe reminders for status changes, assignment, customer updates, and invoice handoff
- add a quick `closure readiness` checklist before marking a ticket resolved

Guardrail:

- no internal URLs or copied PSA screens in public docs
- keep operational specifics in private notes if required

### 11. Daily Monitoring Discipline

Field pattern: monitoring dashboards and alert queues need deliberate daily attention, especially when outages or failed alerts can be missed during busy shifts.

App improvement:

- add a daily monitoring checklist to the command center
- include `check monitoring board`, `review high severity alerts`, `confirm stale alerts`, and `record anything needing follow-up`
- connect repeated missed-alert patterns to learning scenarios

Guardrail:

- do not connect to monitoring tools directly
- store only generic completion state and reflections

### 12. Evidence Pack From Real Work Patterns

Field pattern: useful professional-development evidence comes from repeated work patterns: vendor coordination, security triage, device setup, documentation, escalation, and follow-up discipline.

App improvement:

- let safe checklist completions and scenario reflections feed the Evidence Pack
- group evidence by skill domain
- generate manager-safe summaries without sensitive operational detail

Guardrail:

- evidence summaries should say what skill was practised, not who the client was or what system was touched

### 13. Email-To-Backlog Intake

Field pattern: automated summaries and forwarded prompts can produce useful feature ideas, but they need triage before becoming product requirements.

App improvement:

- create a backlog intake checklist for any email/chat-derived suggestion
- classify as `workflow`, `knowledge`, `training`, `privacy risk`, or `discard`
- require a safe user story, privacy review, and implementation size before adding to build backlog

Guardrail:

- raw inbox content stays out of the repo and out of seed data

### 14. Creative Research Notes

Field pattern: not all useful app content is strict MSP work. Some creative AI experiments are valuable as examples of structured prompting and exploratory thinking.

App improvement:

- keep creative research notes as a low-priority knowledge category
- clearly separate them from operational primers
- use them to demonstrate prompt patterns, not to distract from field workflow

Guardrail:

- never let creative notes crowd out high-impact technician workflows

## Prioritized Build Sequence

### Now

- Add this field-notes inspiration doc and link it from the docs index.
- Keep raw exports outside GitHub.
- Review existing command center, quick tools, tasks, and evidence pack for overlap with the ideas above.
- Add missing QA items for privacy-safe follow-up, alert sanitization, and onsite checklist flows.

Implementation status:

- Added `Field Ops` as an in-app cockpit for pending actions, monitoring alert sanitization, security triage paths, field checklists, operational primers, backlog intake, and safe evidence export.
- Wired Field Ops into the main navigation, Dashboard, Shift Command Center, shortcut overlay, and Evidence Pack.
- Kept raw field-note source material outside GitHub and ignored local `docs/1/` exports.

### Next

- Build Monitoring Alert Sanitizer as a local-only utility and UI panel.
- Add security alert triage paths with note scaffolds.
- Add or refine the RDP/RemoteApps primer.
- Add the onsite checklist as a focused, mobile-friendly workflow.

### Later

- Add identity-provider migration and device setup primers.
- Add vendor coordination playbooks.
- Feed safe checklist completions into Evidence Pack.
- Add backlog-intake review for future local exports.

## Acceptance Criteria

- A user can turn a real support pattern into a safe app workflow without copying private details.
- Every new workflow has an explicit privacy note.
- AI-assisted flows sanitize locally first and show the sanitized text.
- Any workflow involving security, identity, remote access, or tenant-wide change includes escalation guidance.
- Evidence Pack output remains manager-safe and free of client identifiers.
- Docs clearly distinguish source inspiration from committed product requirements.

## Open Design Questions

- Should follow-up reminders live primarily in Dashboard, Shift Command Center, Tasks, or all three?
- Should Monitoring Alert Sanitizer be a Quick Tools panel, a Security Triage page, or part of Ticket Notes?
- Should onsite checklists become reusable templates, one-off visit drafts, or both?
- How much ticket ID usage is acceptable before it weakens the privacy posture?
- Should low-priority creative research notes live in Knowledge, Micro-Learning, or a separate sandbox?
