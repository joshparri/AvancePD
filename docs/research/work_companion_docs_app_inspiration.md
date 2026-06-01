# App Inspiration From Work Companion Docs

Source reviewed: `C:\AvanceWorkCompanion\docs`, especially the exported Google Meet chat summary and the living app backlog CSV.

This document captures app improvement ideas that can be drawn from those local notes without copying client-sensitive detail into the repository. Keep implementation local-first and privacy-by-default: store only generic workflow state, ticket IDs where needed, and user-authored reminders. Do not store client names, email addresses, internal URLs, passwords, hostnames, or raw ticket notes.

## Product Direction

The strongest pattern in the docs is not a need for a general note-taking app. The app should act as an MSP work companion: fast checklists, decision trees, note scaffolds, follow-up nudges, and sanitized AI assistance for recurring Level 1/2 workflows.

Priority should go to modules that reduce missed follow-ups, improve security triage consistency, and make repeat client-service procedures easier to execute under time pressure.

## Highest-Value Suggestions

### 1. Pending Action Tracker

Build a local follow-up tracker for stalled tickets that are waiting on a client, vendor, or teammate.

- Allow manual entry of a ticket ID, short generic action required, owner, and follow-up due time.
- Default the next follow-up to 24 hours, but allow quick presets.
- Surface overdue items on the home dashboard.
- Include a `Mark complete` action and a `Snooze` action.
- Do not integrate directly with HaloPSA or import raw ticket content.
- Suggested placement: Home dashboard follow-up area.

Why it matters: the docs repeatedly show tickets that depend on third-party scheduling, vendor callbacks, customer confirmation, or billing handoff. A local reminder loop would reduce forgotten handoffs without storing sensitive content.

### 2. Security Alert Triage Module

Create a dedicated triage path for recurring monitoring alerts.

- Classify alerts into categories such as anomalous sign-in, MFA/security-info change, account enablement, app consent, endpoint alert, backup failure, and phishing/security training event.
- For each category, show first checks, escalation conditions, and a structured ticket-note scaffold.
- Keep guidance calm and operational, not alarm-heavy.
- Use generic roles and systems only: M365 Admin, SentinelOne, Augmentt, Adlumin, Veeam, IRONSCALES, Keeper, HaloPSA.
- Do not store client names, user emails, IP addresses, tenant names, or raw alert text.

Suggested note scaffold:

```text
Issue reported:
What I checked:
What I found:
Action taken:
Outcome:
Next step / follow-up needed:
```

### 3. Monitoring Alert LLM Sanitizer

Add a privacy-preserving LLM helper mode for monitoring alerts.

- Let the technician paste raw alert text locally.
- Before any API call, tokenize sensitive values such as emails, IP addresses, names, tenant names, hostnames, URLs, phone numbers, and device names.
- Show the sanitized preview and require explicit confirmation before sending.
- Use placeholders such as `[User_Email_1]`, `[Client_Tenant_1]`, `[IP_Address_1]`, `[Device_Name_1]`, and `[Internal_URL_1]`.
- Return the likely alert type, severity, first system to check, three immediate checks, and escalation trigger.
- Keep a `copy sanitized note` action for HaloPSA.

This should be separate from the normal LLM helper so sensitive alert handling has stronger guardrails.

### 4. Windows Remote Desktop And RemoteApps Primer

Add a tool primer for RDP, RemoteApps, and Remote Desktop Gateway issues.

- Include a quick explanation of what RDP/RemoteApps are used for.
- Add a troubleshooting path for generic connection failures.
- Add a certificate/TLS path for errors such as "An internal error has occurred".
- Prompt the technician to verify whether the fault reproduces from an internal VM before assuming a client-side issue.
- Include a placeholder for a screenshot of the Windows `RemoteApp and Desktop Connections` control panel area.
- Warn technicians not to change server-side RDP encryption or certificate settings without senior direction.

Suggested placement: Tool Primers and How-Tos.

### 5. Onsite Checklist Module

The docs support a three-phase onsite workflow.

- Phase 1: before leaving office.
- Phase 2: onsite execution.
- Phase 3: after-visit closure.

Checklist items should cover packing, induction requirements, hardware/cables, arrival status, vendor contact needs, scope exceptions, customer sign-off, 3CX status reminders, structured ticket notes, and ticket status update.

Use localStorage for check-off state and generic local reflections only. Avoid storing visit addresses, client details, credentials, internal URLs, or raw ticket notes.

### 6. Vendor Remote Session Coordinator

Add a lightweight workflow for tickets that require a third-party vendor remote session.

- Track the vendor category, required access type, who must be present, and next contact attempt.
- Include a distinction step when multiple similar vendors or systems exist.
- Provide call/email attempt logging without storing vendor contacts or client-specific details.
- Offer a generic note scaffold for "vendor contacted", "vendor unavailable", "remote session completed", and "awaiting customer/vendor response".
- Link naturally to the Pending Action Tracker.

This came up repeatedly in medical software and line-of-business app support patterns.

### 7. HaloPSA Workflow Guardrails

Add small, task-oriented helpers for recurring HaloPSA friction.

- Reminder that some tickets may require changing from an enquiries channel to a support channel before replies can be sent.
- Checklist for hidden-ticket-view troubleshooting.
- Status guidance for `resolved`, `awaiting invoice`, `awaiting client`, and `awaiting vendor`.
- Private-note versus customer-reply reminder.
- Copyable structured note templates.
- Billing handoff reminder for jobs outside a managed service agreement.

This should not be a HaloPSA clone. It should be a compact set of workflow nudges and note generators.

### 8. Billing And Invoice Handoff Prompts

Add workflow prompts for jobs that need billing attention.

- Ask whether the work is covered by an agreement.
- Ask whether out-of-scope work was completed during an onsite visit.
- Ask whether parts, travel, setup, or vendor coordination need to be noted.
- Provide a generic handoff note for assigning the ticket to the billing owner or setting `awaiting invoice`.
- Keep all financial/client specifics in the approved PSA/accounting systems.

### 9. Change Management Guardrail

Add a visible pre-flight warning for major system changes.

- Trigger it from security integrations, tenant-wide settings, email filtering, endpoint management, RDP/server changes, identity provider changes, and decommissioning tools.
- Ask the technician to confirm scope, rollback plan, senior approval, client impact, and documentation location.
- Include a "stop and ask senior tech" outcome when the risk is too high.

This aligns with repeated notes about asking before fundamental system changes.

### 10. IRONSCALES And Phishing Setup Primer

Create a focused security-tool onboarding primer.

- Include 911 phishing mailbox setup.
- Include report-phishing button deployment.
- Include licensed-user scoping.
- Include VIP impersonation tagging.
- Include country-blocking guidance that explicitly avoids blindly following outdated vendor documentation.
- Include a decommissioning check for old email security systems.

Keep the content generic and avoid tenant-specific values.

### 11. Device Setup And Handoff Checklists

Add repeatable device setup workflows.

- Windows laptop setup.
- Mac laptop setup.
- Microsoft 365 or Google Workspace account setup.
- Outlook with Gmail setup.
- OneDrive setup.
- Endpoint protection/RMM install checks.
- Entra enrollment checks.
- Customer pickup/handoff confirmation.
- Billing or agreement check.

The docs contain many hardware setup patterns that would benefit from a repeatable checklist rather than memory.

### 12. Performance Troubleshooting Decision Tree

Add a decision tree for slow laptops and high CPU issues.

- Check endpoint agent CPU usage.
- Check OneDrive sync pressure.
- Check CPU architecture compatibility, especially ARM/Snapdragon machines running a standard MSP stack.
- Check memory and storage pressure.
- Suggest removing or pausing one agent only when approved and reversible.
- Include a "recommend hardware upgrade" threshold with plain-language reasoning.

### 13. Profile Migration And Identity Transition Primer

Add a primer for Windows profile and identity migrations.

- Include cached credential symptoms.
- Include when creating a new Windows profile is a practical fix.
- Include when to use Forensit.
- Include JumpCloud-to-Entra and Google Credential Provider for Windows considerations.
- Include a reminder that some migrations require Windows Pro and case-sensitive configuration.
- Include handoff steps for PST/export tasks.

### 14. Knowledge Base Maintenance Tracker

Add a small workflow for keeping internal KB articles current.

- Track KB articles that need URL or process updates.
- Prompt for old URL, new URL, affected article count, review owner, and publish status.
- Provide a note template for "updated KB due to vendor/admin portal change".
- Include a periodic review prompt for stale security/admin console links.

### 15. App Consent And AI Tool Review Path

Add a triage path for user consent to third-party apps and AI meeting/note tools.

- Ask what permission category was granted.
- Check whether the app is approved or previously vetted.
- Check whether the grant was user-initiated and expected.
- Provide a low-friction escalation route when the permission scope is broad or unclear.
- Keep app names generic in stored state unless the organization approves storing them.

### 16. Hardware Delivery And Field Logistics Tracker

Add lightweight tracking for office arrivals, client hardware, and field equipment.

- Record generic item category, required action, owner, due date, and handoff status.
- Avoid serial numbers, client names, and addresses.
- Link to onsite checklist when the item is tied to a visit.

### 17. Communication Discipline Prompts

Add nudges that keep work in approved channels.

- Remind the technician to direct support work into the support address or PSA rather than chat DMs.
- Offer a quick "turn this chat request into a ticket note" scaffold.
- Add a reminder to update the team when an onsite visit starts, blocks, or completes.

### 18. Creative AI Prompts And Research Notes

Add a low-priority knowledge area for non-operational AI experiments and research notes.

- Keep it clearly separated from service delivery modules.
- Include fields for tool used, creator, topic, purpose, and useful output.
- Do not let this compete with operational primers in the main dashboard.

This is useful for learning culture, but it should be treated as lower priority than workflow, security, and ticketing features.

## Suggested Implementation Order

1. Pending Action Tracker.
2. Security Alert Triage Module.
3. Monitoring Alert LLM Sanitizer.
4. RDP and RemoteApps Primer.
5. Vendor Remote Session Coordinator.
6. HaloPSA Workflow Guardrails.
7. IRONSCALES and phishing setup primer.
8. Device Setup and Onsite Checklist expansion.
9. Profile migration and identity transition primer.
10. Knowledge Base Maintenance Tracker.
11. Billing and invoice handoff prompts.
12. Creative AI Prompts and Research Notes.

## Design Principles From The Docs

- The app should reduce cognitive load during real tickets, not become another place to store the ticket.
- The safest persistent data is generic workflow metadata.
- The strongest UI pattern is guided action: checklist, decision tree, note scaffold, and follow-up reminder.
- Security workflows need privacy controls before AI assistance.
- Senior-tech escalation points should be explicit, especially for tenant-wide, server-side, identity, email security, or endpoint-management changes.
- The dashboard should highlight what needs action now: overdue follow-ups, active onsite checklist, open security triage, and unresolved handoffs.
