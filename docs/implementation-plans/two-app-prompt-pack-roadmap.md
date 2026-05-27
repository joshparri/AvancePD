# Two App Prompt Pack Roadmap

Source: `2 x prompt packs.txt`

This roadmap turns the prompt-pack notes into an implementation backlog for the two live Avance apps.

## Product split

- App 1, `avance-pd.vercel.app`: Avance Work Companion. Role: capture engine for work logs, follow-ups, ticket notes, healthy shift habits, and learning seeds.
- App 2, `avance-professional-development.vercel.app`: Avance PD. Role: learning machine for KB study, scenarios, ticket-note drills, skill confidence, spaced review, teach-back, and evidence packs.

Keep both apps local-first. Do not add auth, real PSA integrations, Google/Drive/Gmail scraping, external AI calls, passwords, client secrets, private emails, or private customer details unless a later task explicitly designs that safely.

## App 1: Avance Work Companion backlog

1. Stabilise app shell and identity: set title/metadata to `Avance Work Companion`, keep naming consistent, add a useful dashboard subtitle, and preserve existing local/export behaviour.
2. Upgrade Quick Capture into a ticket note builder with a note-quality checklist, `Convert to ticket note`, copyable preview, and sections for summary, what happened, action taken, current status, follow-up, and tags.
3. Add follow-up triage with status, due date, next nudge, priority, dashboard summary, and editable follow-up wording templates.
4. Convert repeated issues into editable playbook drafts with problem pattern, first checks, likely causes, safe steps, escalation trigger, and ticket note template.
5. Improve Healthy MSP Shift into a rhythm coach with current mode, water/eye/outdoor/posture actions, `2-minute reset done`, and last-reset timestamp.
6. Add change-management guardrails for risky work involving migration, deletion, policies, firewall, DNS, backup, restore, MFA, Conditional Access, Intune, registry, scripts, or production systems.
7. Turn Work Companion into the capture engine for learning by adding learning seed fields to work logs.
8. Add After Action Review for selected work logs with prompts for issue, first checks, fix/progress, gaps, related KB/skill, faster next time, and review need.
9. Add ticket-note drill from real work logs with deterministic scoring and privacy checks.
10. Add local KB hints without scraping Drive or importing private KB content.

## App 1 learning seed skill areas

- Microsoft 365
- Outlook
- OneDrive/SharePoint
- Entra ID
- Intune
- JumpCloud
- Google Workspace
- SentinelOne
- Datto RMM
- Ironscales / phishing protection
- DNS/domains
- Printers
- Phones/Yealink
- Backup/recovery
- HaloPSA ticketing
- Client communication
- Change management
- Documentation/ticket notes

## App 2: Avance PD backlog

1. Fix title, branding, and app purpose: title `Avance PD`, metadata for a local-first MSP professional development app, and clear separation from App 1.
2. Upgrade PD Focus Today into a deterministic next-best-action engine.
3. Add scenario-to-ticket-note practice flow.
4. Build manager-safe Evidence Pack copy/download/export.
5. Add skill map for MSP growth.
6. Improve follow-up area into operational discipline training.
7. Add communication practice templates and tone checklist.
8. Add onboarding-safe demo data badges and reset controls.
9. Add privacy and safety linting for entries.
10. Create manager-ready weekly PD review.
11. Create the KB Learning Machine shell.
12. Build KB Map and field cards.
13. Add spaced repetition review scheduling.
14. Build active recall flashcards from field cards.
15. Build scenario-first learning mode.
16. Add ticket-note drill scoring.
17. Build skill tree / mastery map.
18. Build Evidence Pack as proof of learning.
19. Add Daily Learning Plan.
20. Add Teach-back Mode.

## KB Learning Machine details

Field cards should include KB title, category, when to use, prerequisites, first checks, core steps, common mistake, escalation point, related skill, confidence level, and review due date.

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

Seed generic field cards:

- Enrolling a New Computer into Intune
- Migrating Local User Account to Entra Account
- Importing Office 365 or Google GSuite User into JumpCloud
- Turning on 2 Factor Authentication for Google Account
- Veeam Agent Recovery Guide
- Outlook Opening Links in Edge
- Increase Outlook PST and OST capacity
- Editing Exchange Calendar Permissions with PowerShell
- RDP Not Passing Through USB Drives
- MHC Printer Configuration
- Adding a New Yealink Phone to Provisioning Server
- Creating a Policy for Detecting Malicious Files in SharePoint and OneDrive

Spaced review intervals:

- First review: same day
- Review 1: next day
- Review 2: 3 days later
- Review 3: 1 week later
- Review 4: 2 weeks later
- Review 5: 1 month later

Review result buttons: Again, Hard, Good, Easy.

Flashcard prompts generated from field cards:

- When would I use this KB?
- What should I check first?
- What tool/admin portal is involved?
- What is the riskiest step?
- What mistake should I avoid?
- When should I escalate?
- What would I write in the ticket note?

## Scenario seed backlog

- Local profile must be preserved while moving a computer to Entra/Intune.
- New laptop needs Intune enrolment.
- User needs Google 2FA enabled.
- User needs Office 365/Google user imported into JumpCloud.
- User needs a file restored from Veeam backup.
- Outlook links keep opening in Edge.
- PST/OST mailbox file is too large.
- Exchange calendar permissions need to be adjusted.
- RDP session does not pass through USB drives.
- Yealink phone needs provisioning.
- Printer config needs to be recreated.
- SharePoint/OneDrive malicious file detection policy needs checking.

## Evidence Pack sections

- Date range
- Skills practised
- KBs studied
- Scenarios completed
- Ticket notes practised
- Confidence changes
- Gaps identified
- Next development goals
- Support needed

Privacy warning: `Review before sharing. Remove client-specific details.`

## Recommended build order

1. App 2 Prompt 11: create the KB Learning Machine shell.
2. App 2 Prompt 12: KB Map and field cards.
3. App 2 Prompt 13: spaced repetition.
4. App 2 Prompt 15: scenario-first mode.
5. App 2 Prompt 16: ticket-note drills.
6. App 2 Prompt 18: evidence pack.
7. App 1 Prompt 7: capture work as learning seeds.
8. App 1 Prompt 8: after action review.

This creates the intended loop: work capture, learning seed, KB card, review, scenario, ticket note, evidence.

## New technician KB study priorities

Use these as seed learning categories, not as imported KB content.

1. Passwords, credentials, and security:
   - Keeper Password Manager User Guide.
   - Setting Up Account Password for Solutions Centric Staff.
   - Creating Conditional Access Policy.
2. Device enrolment and workstation setup:
   - Enrolling a New Computer into Intune.
   - Signing Into a New Windows Device with a Local Account.
   - Autologon Any Windows Computer.
3. Backup monitoring and recovery:
   - Backup and Recovery Procedure for Customers.
   - Cove Recovery Testing Guide.
   - Veeam Backup Troubleshooting.
4. Remote access and terminal services:
   - Setting up Remote Access - End User Guide.
   - Accessing SharePoint Files Through Remote Apps / Work Resources.
   - RDP High DPI Screen Fix.
   - Span RDP Session Across 2 out of 3 Monitors.
5. Communications and VoIP:
   - Yealink Phone Configuration.
   - Yealink Common Config File Names.
   - MondoTalk Cloud PBX Manual.
   - MondoTalk Dial Codes.
