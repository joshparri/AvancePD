# Avance KB Learning Guide

This guide explains how to use the local Avance knowledge base with the two Avance apps.

> Important: The raw KB files under `docs/Avance KB_s` are local reference material only. Do not copy private customer data or internal-only content into public repo docs or GitHub.

## What the KB library is for

The `docs/Avance KB_s` folder contains procedure and troubleshooting guides for MSP topics such as device enrollment, remote access, cloud migrations, security policies, phone and printer configuration, and recovery workflows.

The KB library is a reference source, not app data. Use it to connect real work to learning and to seed App 2 with relevant skill categories, scenarios, and evidence notes.

## How the apps use the KB

- **Avance Work Companion** is the capture engine.
  - Use it to log work, follow-ups, ticket notes, and learning seeds.
  - Tag captured items with the relevant KB topic or skill area.
  - Send learning-worthy captures into a local learning queue if the app supports it.

- **Avance PD** is the learning cockpit.
  - Use it to study KB-related skills, practise scenarios, and build manager-safe evidence.
  - Map captured work to skill cards, scenarios, ticket note practice, and evidence pack entries.
  - Keep the KB library local and use it as the source of truth for task-specific guidance.

## Learning flow

1. **Capture work in App 1**
   - Create a quick log or ticket note immediately after completing a task.
   - Mark whether the item is a learning seed, a follow-up, or a reusable knowledge item.

2. **Link the capture to a KB topic**
   - Choose the nearest KB topic category from the local library.
   - If App 1 supports it, add a `relatedKb` or `learningQueue` marker.

3. **Use App 2 to deepen the learning**
   - Open the relevant skill category in the `MSP Skills` section.
   - Find a matching scenario in `MSP Scenarios`.
   - Practise writing a clean `Ticket Note` based on the issue.
   - Add the result to the `Evidence Pack` when the learning is useful.

4. **Review and repeat**
   - Use the `Weekly Review` or `Learning Cockpit` to track progress.
   - Convert repeated issues into reusable playbooks or knowledge notes.
   - Keep the evidence pack manager-safe by excluding private customer data.

## Recommended KB topic categories

Use the following categories as a starting point rather than individual file titles:

- Device onboarding and management
  - Apple device enrollment
  - Intune enrollment
  - JumpCloud and Entra account migration

- Remote access and network access
  - SSH proxy and remote desktop access
  - VPN and remote application configuration
  - Firewall rules for remote management

- Cloud identity and email
  - Microsoft 365 and Google Workspace migration
  - Exchange Online administration
  - Password and credential provider setup

- Security and policy
  - Anti-phishing policy creation
  - Safe links and security hardening
  - Certificate and authentication troubleshooting

- Phone, printer, and peripheral setup
  - Yealink phone configuration
  - Printer installation and network printing
  - Device-specific MDM policies

- Troubleshooting and recovery
  - Application repair and driver issues
  - File recovery and system restore guidance
  - Permission and admin rights workflows

## Notes on privacy and public docs

- Keep raw KB content local to `docs/Avance KB_s`.
- Do not include customer names, ticket details, or internal case notes in GitHub-tracked docs.
- The public docs should describe the learning process, not reproduce the KB content.

## Next documentation steps

- Add this KB learning guide to the root and docs TODO trackers.
- Update the user guide with a short KB workflow section.
- Keep the local KB folder private and treat it as reference-only material for learning and app guidance.
