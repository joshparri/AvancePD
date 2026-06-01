# App Improvement Suggestions from Docs

This document collects app improvement ideas inspired by the existing notes and backlog content in `docs/`.

## 1. Add a Ticket Follow-Up / Pending Action Tracker

Why:
- The chat logs describe stalled tickets waiting for clients or third-party vendors, such as Medical Objects remote-access coordination.
- APendingActionTracker would help technicians track tickets that are pending action and avoid forgotten follow-ups.

Suggested app feature:
- New dashboard module: `PendingActionTracker`
- Manual input fields: ticket ID, action required, follow-up due date
- Show overdue items prominently in the Follow-Up area
- `Mark Complete` button to clear items
- Store only generic workflow data in local storage (no client PII)

## 2. Add a Windows Remote Desktop / RemoteApps Troubleshooting Primer

Why:
- The notes include a clear support issue category around RDP, certificates, and remote desktop access.
- A dedicated primer would help technicians quickly troubleshoot common RDP failures.

Suggested app feature:
- Add a new primer under the existing Tool Primers & How-Tos section
- Include step-by-step guidance for:
  - "An internal error has occurred" certificate/TLS issues
  - VPN/RDG connectivity checks
  - selecting the correct RDP icon/file
  - verifying remote server status via Datto RMM
- Add an explicit warning: do not change server-side encryption settings without senior approval.

## 3. Add a Creative AI Prompts & Research Notes Section

Why:
- The backlog notes explicitly call out a low-priority knowledge base entry for AI-generated research and creative prompt examples.
- This would let the team document useful AI-driven discoveries without distracting from core workflows.

Suggested app feature:
- Add a collapsed accordion item in the Tool Primers section titled `Creative AI Prompts & Research Notes`
- Store generative content examples with fields like:
  - Title
  - Description
  - Key outputs
  - Tool used (`Gemini/LLM`)
  - Author (`Josh Parris`)

## 4. Expand the Onsite Checklist with more visit workflow guidance

Why:
- The current app already includes an Onsite Checklist module, but the docs suggest more real-world tasks and follow-up steps.

Suggested app improvements:
- Add a dedicated step for `Confirm remote access and third-party coordination` before leaving the site
- Add a closure step for `Schedule follow-up when pending client or vendor action remains`
- Add a `Client visit logistics` sub-checklist for common onsite items such as spare HDMI, power adaptors, and workspace permissions
- Make the privacy guidance even more explicit: keep only generic reminders, no ticket notes or client names.

## 5. Add workflow primers for MSP-specific tasks from docs

Why:
- The notes contain repeated real-world problems that match the app's target audience.

Suggested app primers:
- `Ironscales / phishing mailbox setup checklist`
- `Medical Objects Document Delivery troubleshooting`
- `SentinelOne performance troubleshooting` for ARM/Intel compatibility
- `HaloPSA ticket pending workflow` and `follow-up automation` guidance
- `Invoice and exception tracking` for onsite scope creep

## 6. Add an internal knowledge / notes capture area with privacy guardrails

Why:
- The docs include a lot of operational detail and meeting notes that would be useful to store as generic workflows.
- The app should keep this local and privacy-first.

Suggested app feature:
- Add a `Work Notes` or `Backlog` module that accepts only safe, non-sensitive bullet points
- Include templates for `Action item`, `Follow-up reminder`, and `Incident note`
- Avoid storing client-specific identifiers or personal data

## 7. Improvements for app documentation and backlog tracking

Why:
- The current docs are a great source of feature ideas, but the app would benefit from a dedicated backlog and suggestion tracker.

Suggested app feature:
- Keep a `docs`-driven backlog of improvement ideas within the app or as a separate local document
- Use the app itself to capture future suggestions from chat transcripts, support tickets, and technical notes.

---

### Notes

These suggestions are based on the document content in `docs/` and the current app structure in `src/`.
They are intentionally focused on workflow improvement, privacy-first local storage, and the MSP technician use case.
