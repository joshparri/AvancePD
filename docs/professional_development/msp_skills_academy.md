# MSP Skills Academy Specification

## High-level concept
The Avance Work Companion should grow into a practical MSP Skills Academy: a private learning layer that trains judgement, documentation discipline, communication, and hands-on troubleshooting habits alongside technical knowledge. It should help Josh move from "I have read about this" to "I can handle this calmly, safely, document it clearly, and know when to escalate."

The Academy is not a generic quiz bank. It is a work-readiness system for Level 1 and early Level 2 MSP capability, grounded in helpdesk triage, endpoints, Microsoft 365, Entra ID, Intune, networking, cybersecurity, backup/DR, RMM/PSA workflows, scripting, documentation, and client care.

## Core learner fantasy
Josh opens the app and sees a clear map of the MSP skills he is building, realistic tickets to practise, weak areas to revisit, and evidence he can show in a professional development conversation. The app helps him think like a calm service desk technician: ask good questions, avoid risky actions, capture clean notes, protect security, communicate clearly, and escalate with useful context.

## Current app context
Relevant current files and structure:

- `VISION.md`: defines the app as a private Avance Work Companion for preparation, knowledge capture, task tracking, continuity, and professional development.
- `TODO.md`: includes broad placeholders for Learning Tracker, PD-focused features, and MSP skill development.
- `docs/requirements/prd.md`: already requires learning items with confidence, seen-in-real-work flags, team questions, review dates, PD goals, and milestones.
- `docs/architecture/information_architecture.md`: currently has Learning as a top-level section but no dedicated MSP academy screens.
- `app/package.json`: Next.js 16, React 19, TypeScript, Tailwind, Dexie, Fuse.js, Zod, lucide-react.
- `app/src/types/index.ts`: already has `LearningItem`, `PDGoal`, and `PDAchievement`.
- `app/src/lib/db.ts`: already persists `learningItems`, `pdGoals`, and `pdAchievements` in Dexie.
- `app/src/components/Navigation.tsx`: has a generic `Learning` nav item but not the proposed MSP Skills, Scenario Trainer, Roadmap, Evidence Pack, or Ticket Notes pages.
- Existing implemented app routes are limited: dashboard at `/` and shifts at `/shifts`.

This means the best next step is additive: keep the existing app and extend the learning/PD model rather than rewriting from scratch.

## Design principles
- Train judgement before trivia.
- Treat confidence as something proven by evidence, not just self-rated.
- Prefer realistic MSP scenarios over abstract quizzes.
- Make every practice item produce useful output: ticket notes, KB drafts, checklists, risk explanations, or escalation summaries.
- Keep all client examples fictional or anonymised.
- Avoid storing secrets, credentials, client private data, or real ticket content.
- Use simple rule-based recommendations before attempting AI-style coaching.
- Make the app useful for real work even when the learner has only five minutes.

## Readiness levels
Every skill should use the same readiness ladder:

| Status | Meaning | Evidence expected |
| --- | --- | --- |
| `unseen` | Josh has not engaged with the skill yet. | None. |
| `learning` | Josh has read/watched/studied the topic. | Notes, glossary entries, linked resources. |
| `practised` | Josh has completed a lab, scenario, checklist, or simulated ticket. | Scenario completion, ticket note, lab output. |
| `work-ready` | Josh can perform the skill with normal supervision and knows escalation limits. | Passed scenario, clean notes, safe decisions, escalation criteria understood. |
| `evidence-proven` | Josh has used or demonstrated the skill in real or realistic work and can explain what happened. | Work log, reflection, KB article, reviewed note, manager-safe PD summary. |

## MSP skill taxonomy
Create a structured data file later at `app/src/data/mspSkills.ts`. The documentation-level taxonomy is below.

### 1. Helpdesk and triage
Core skills:
- Ticket triage and categorisation.
- Asking clear diagnostic questions.
- Password reset and MFA issue handling.
- Printer, email, Wi-Fi, and basic Microsoft 365 support.
- Remote support etiquette.
- Escalation judgement.
- SLA awareness and urgency vs noise.
- Writing useful ticket notes and closing tickets properly.
- Knowing when work is outside scope.

Related tools:
- PSA/ticketing system, remote support tool, Microsoft 365 admin centre, Teams/phone, knowledge base.

Suggested practice:
- "What would you ask next?" scenarios.
- SLA triage drills.
- Ticket note improvement exercises.
- Escalation wording practice.

Evidence examples:
- Three cleaned-up ticket notes.
- One escalation summary with impact, checks, and next step.
- One reflection on a ticket where the first assumption was wrong.

### 2. Endpoint support
Core skills:
- Windows 10/11 settings and Control Panel legacy tools.
- Device Manager, Event Viewer, Services, Task Manager, startup apps.
- Disk cleanup and performance basics.
- Driver troubleshooting and Windows Update issues.
- Local profiles, domain joined devices, Entra joined devices, and device registration states.
- BitLocker basics.
- Antivirus/EDR basics.
- App installs/uninstalls.
- Mac and mobile device basics.
- Imaging and provisioning concepts.

Related tools:
- Windows Settings, Control Panel, Event Viewer, Device Manager, PowerShell, Intune Company Portal, EDR console, RMM.

Suggested practice:
- "Find the likely cause" endpoint labs.
- Screenshot-based quizzes.
- Error log explanation practice.
- Device lifecycle checklist building.

Evidence examples:
- Windows troubleshooting flowchart.
- App install failure note.
- Device lifecycle KB draft.

### 3. Microsoft 365 support
Core skills:
- Outlook support.
- Teams support.
- OneDrive sync issues.
- SharePoint basics.
- Microsoft 365 admin centre.
- User creation and licensing.
- Mailbox access, shared mailboxes, distribution groups, Microsoft 365 groups.
- Calendar permissions.
- Spam/phishing basics.
- Mail flow basics.
- Retention/archive basics.
- Exchange Online basics.

Related tools:
- Microsoft 365 admin centre, Exchange admin centre, Teams admin centre, SharePoint admin centre, Outlook, OneDrive sync client.

Suggested practice:
- M365 admin task cards.
- Licensing decision quizzes.
- Mail flow troubleshooting trees.
- OneDrive sync issue simulations.

Evidence examples:
- Shared mailbox access checklist.
- OneDrive sync troubleshooting article.
- Plain-English explanation of mailbox vs group vs shared mailbox.

### 4. Entra ID and identity
Core skills:
- Entra ID basics.
- Users and groups.
- MFA workflows.
- Conditional Access concepts.
- Password reset workflows.
- Role-based access and least privilege.
- Device join/registration states.
- Guest users.
- Access reviews.
- Joiner/mover/leaver lifecycle.
- Basic Zero Trust thinking.

Related tools:
- Microsoft Entra admin centre, Microsoft 365 admin centre, Intune, Conditional Access reports.

Suggested practice:
- Identity lifecycle simulator.
- "Should this user have access?" scenarios.
- MFA troubleshooting modules.
- Permission risk quizzes.

Evidence examples:
- Joiner/mover/leaver checklist.
- MFA troubleshooting decision tree.
- Least privilege risk explanation.

### 5. Intune and endpoint management
Core skills:
- Device enrolment.
- Compliance policies.
- Configuration profiles.
- App deployment.
- Windows Autopilot basics.
- Mobile device management.
- App protection policies.
- Update rings.
- Device retirement/wipe.
- Endpoint security baselines.
- Reporting.
- Troubleshooting failed deployments.

Related tools:
- Intune admin centre, Company Portal, Autopilot device list, Windows Update for Business, endpoint security baselines.

Suggested practice:
- Policy design challenges.
- "Why did this app not deploy?" cases.
- Compliance policy builder practice.
- Autopilot workflow mapping.

Evidence examples:
- Compliance policy explanation.
- App deployment troubleshooting note.
- Device retirement checklist.

### 6. Networking
Core skills:
- IP addressing, subnets, DNS, DHCP, gateways.
- VLANs.
- Wi-Fi troubleshooting.
- Ethernet troubleshooting.
- Switch, router, and firewall basics.
- NAT and VPNs.
- Ports and protocols.
- Speed, latency, packet loss.
- Network diagrams.
- Packet capture concepts.
- Internet outage triage and ISP escalation.

Related tools:
- `ipconfig`, `ping`, `tracert`, `nslookup`, Wi-Fi analyser, switch/firewall interface, ISP status page, network diagrams.

Suggested practice:
- Subnetting drills.
- DNS/DHCP scenario trainer.
- "Where is the fault?" network maps.
- Port/protocol flashcards.
- Wi-Fi troubleshooting cases.

Evidence examples:
- Small office network diagram.
- DNS troubleshooting note.
- ISP escalation template.

### 7. Cybersecurity
Core skills:
- Phishing detection.
- MFA enforcement.
- Password hygiene.
- Patch and vulnerability management.
- EDR alerts.
- Antivirus exclusions.
- Security baselines.
- Least privilege.
- Backup protection.
- Incident response basics.
- Log review.
- SIEM/MDR concepts.
- Security awareness.
- Risk language.
- Client security recommendations.
- Essential Eight maturity.
- CIS Controls basics.
- NIST CSF basics.

Related tools:
- EDR console, Microsoft Defender portals, security baseline docs, backup console, SIEM/MDR alerts, ACSC Essential Eight material, NIST CSF, CIS Controls.

Suggested practice:
- Phishing email analysis.
- Security incident simulations.
- Essential Eight checklist mapping.
- Client-facing risk explanation writing.

Evidence examples:
- Phishing analysis note.
- Risk explanation rewritten for a non-technical manager.
- Security incident escalation summary.

### 8. Backup, disaster recovery, and business continuity
Core skills:
- Backup types.
- Restore testing.
- RPO/RTO.
- Cloud backup.
- Microsoft 365 backup assumptions.
- Immutable backups.
- Disaster recovery plans.
- File recovery.
- Bare-metal recovery concepts.
- Client communication during outages.
- Backup monitoring.
- Backup failure remediation.

Related tools:
- Backup console, alerting system, restore test evidence log, client DR documentation.

Suggested practice:
- RPO/RTO decision games.
- Backup failure ticket simulator.
- "Can this client recover?" scenario.
- Restore-test evidence log.

Evidence examples:
- Backup failure triage note.
- Restore test checklist.
- RPO/RTO explanation for a client.

### 9. RMM and PSA operations
Core skills:
- Remote monitoring tools.
- Patch management.
- Alert triage.
- Remote control tools.
- Script deployment.
- Device inventory.
- Asset management.
- Ticket queues.
- Time entries.
- Client agreements.
- Recurring maintenance.
- Documentation discipline.
- Change tracking.
- Monthly reporting.
- Escalation pathways.

Related tools:
- RMM, PSA, remote support tool, asset inventory, documentation platform.

Suggested practice:
- Fake RMM alert queue.
- Patch Tuesday triage.
- Time entry practice.
- Monthly client report generator.

Evidence examples:
- Alert triage decisions.
- Sample time entries.
- Asset audit checklist.

### 10. Scripting and automation
Core skills:
- PowerShell basics.
- CMD basics.
- Windows Registry caution.
- Batch scripts.
- Microsoft Graph basics.
- Automation thinking.
- Reading logs.
- Safe script testing.
- Idempotent scripts.
- Error handling.
- Script documentation.
- Knowing when not to automate.

Related tools:
- PowerShell, Windows Terminal, Microsoft Graph Explorer, VS Code, script repository.

Suggested practice:
- PowerShell mini challenges.
- "Explain this script" mode.
- Safe vs unsafe command quiz.
- Script annotation exercises.

Evidence examples:
- Commented script.
- Before/after automation note.
- Safe testing checklist.

### 11. Documentation
Core skills:
- Knowledge base articles.
- SOPs.
- Client environment notes.
- Network diagrams.
- Password/access documentation discipline.
- Change logs.
- Ticket summaries.
- Handover notes.
- Known issue articles.
- Root cause summaries.
- Plain-English writing for users.

Related tools:
- Knowledge base, markdown editor, diagram tool, PSA ticket notes.

Suggested practice:
- KB article builder.
- Ticket-to-KB converter.
- Documentation quality rubric.
- Handover note practice.

Evidence examples:
- One polished KB article.
- One handover summary.
- One root cause summary.

### 12. Client communication
Core skills:
- Calm phone manner.
- De-escalation.
- Explaining technical issues simply.
- Setting expectations.
- Saying no kindly.
- Asking clarifying questions.
- Avoiding blame.
- Progress updates.
- Risk explanations.
- Delay explanations.
- Handling frustrated users.
- Speaking with non-technical managers.
- Client trust-building.

Related tools:
- Ticket replies, email, Teams, phone scripts, client update templates.

Suggested practice:
- Roleplay conversations.
- "Rewrite this response" exercises.
- Tone checker prompts.
- Difficult-user scenarios.

Evidence examples:
- Three model ticket replies.
- One outage update.
- One escalation explanation.

### 13. Escalation and professional judgement
Core skills:
- Scope awareness.
- Risk awareness.
- Knowing when to escalate.
- Knowing when to stop troubleshooting.
- Prioritising safety over cleverness.
- Avoiding cowboy fixes.
- Following change process.
- Understanding business impact.
- Thinking like a service provider, not just a fixer.

Related tools:
- Escalation matrix, change request process, risk rubric, ticket notes, team handover.

Suggested practice:
- "Should you touch this?" scenarios.
- Risk rating exercises.
- Change approval simulator.
- Escalation decision tree.

Evidence examples:
- Escalation summary.
- Risk rating note.
- Change request draft.

### 14. Service management and ITIL-style process
Core skills:
- Incident vs service request vs problem vs change.
- SLA and priority logic.
- Major incident awareness.
- Change control basics.
- Knowledge management.
- Continual improvement.
- Customer satisfaction.
- Handover and ownership.

Related tools:
- PSA, service desk workflow, ticket categories, change calendar, KB.

Suggested practice:
- Categorise ticket drills.
- SLA priority matrix.
- Change vs incident scenarios.
- Weekly improvement reflection.

Evidence examples:
- Ticket categorisation exercise.
- Priority decision explanation.
- Weekly PD summary.

## Proposed TypeScript shapes
These are documentation-level shapes to guide later implementation.

```ts
export type MspSkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type MspReadinessStatus =
  | 'unseen'
  | 'learning'
  | 'practised'
  | 'work-ready'
  | 'evidence-proven';

export interface MspSkill {
  id: string;
  title: string;
  category: string;
  level: MspSkillLevel;
  description: string;
  practicalExamples: string[];
  relatedTools: string[];
  evidenceExamples: string[];
  suggestedPractice: string[];
  readinessStatus: MspReadinessStatus;
}
```

## MSP Skills Matrix
Future route: `/msp-skills`

Purpose:
- Show the full MSP skill map grouped by category.
- Make weak areas visible without shaming the learner.
- Suggest the next practice action for each gap.
- Link skills to scenarios, ticket notes, evidence items, and roadmap stages.

Required interface:
- Category filters.
- Level filters.
- Search by title, tool, or example.
- Readiness tags.
- "What to practise next" panel.
- Weak-area summary based on low readiness or repeated misses.

Useful first version:
- Static data in `app/src/data/mspSkills.ts`.
- Client-side search and filter.
- Readiness values initially hardcoded or derived from local progress later.
- Links to matching scenarios once scenario pages exist.

## Scenario and ticket practice system
Future data file: `app/src/data/mspScenarios.ts`

```ts
export type MspScenarioDifficulty = 'easy' | 'moderate' | 'hard';

export interface MspScenario {
  id: string;
  title: string;
  category: string;
  difficulty: MspScenarioDifficulty;
  ticketText: string;
  userEmotion: 'calm' | 'confused' | 'frustrated' | 'urgent' | 'anxious';
  hiddenCause: string;
  goodFirstQuestions: string[];
  expectedChecks: string[];
  unsafeActions: string[];
  escalationTriggers: string[];
  idealTicketNotes: string;
  learningPoints: string[];
  relatedSkills: string[];
}
```

### Initial scenario bank

| Scenario | Hidden cause | Good first questions | Expected checks | Escalation triggers |
| --- | --- | --- | --- | --- |
| User cannot sign in after password reset | Old password cached, MFA prompt failing, or account locked | "What error appears?", "Can you sign into webmail?", "Are you on-site or remote?" | Account status, sign-in logs if available, MFA methods, device network, time sync | Suspicious sign-in, repeated lockouts, Conditional Access block |
| Outlook mailbox not updating | Cached mode issue, full mailbox, connectivity, or profile problem | "Does webmail show new mail?", "Is it one mailbox or all?", "When did it start?" | Outlook connection status, webmail comparison, mailbox quota, add-ins, profile | Mail flow issue across multiple users, suspected service outage |
| OneDrive sync broken | Sync client paused, credential issue, path length, storage quota, or library sync limit | "Which files?", "Do they show online?", "Any red X or sync icon?" | OneDrive status, account sign-in, storage, path names, web access | Data loss risk, mass sync failure, permissions issue |
| Teams microphone not working | Wrong input device, browser/app permission, driver, or device conflict | "Does it work in another app?", "Which meeting device is selected?" | Teams device settings, Windows privacy settings, driver, test call | Hardware failure, policy issue, repeated executive-impacting fault |
| Printer not printing | Offline queue, wrong default printer, driver, paper/jam, or print server issue | "Can anyone else print?", "Which printer?", "Any error on the printer?" | Printer status, queue, default printer, network reachability, driver | Shared print server outage, finance/payroll critical printing |
| Wi-Fi slow in one room | Weak signal, channel interference, AP issue, or overloaded AP | "Is it only this room?", "Wired speed OK?", "All devices or one?" | Signal strength, AP status, speed test, wired comparison, device count | Building-wide outage, AP hardware fault, safety-critical site |
| DNS issue causing website failure | Incorrect DNS record, stale cache, external DNS outage, or local resolver issue | "Which site?", "Does it fail on mobile data?", "When did DNS change?" | `nslookup`, alternate DNS, local cache, public resolver, record TTL | Business-critical service down, DNS zone change needed |
| New staff onboarding request | Missing approvals, licensing, group access, device assignment | "Has manager approved access?", "Start date?", "Role and location?" | Identity template, licence availability, groups, mailbox, device | Privileged access request, unclear approval, urgent start |
| Suspicious phishing email | Credential harvesting email with spoofed display name | "Did anyone click?", "Was a password entered?", "Who received it?" | Headers if allowed, links, sender domain, recipients, user action | Credential entered, malware opened, multiple recipients |
| Backup job failed overnight | Repository full, credentials expired, agent offline, or snapshot issue | "Which backup set?", "Last successful backup?", "Any recent changes?" | Backup console, error message, storage capacity, agent status, previous jobs | Multiple failed nights, no recent restore point, ransomware concern |
| Device missing Intune compliance | Pending check-in, BitLocker off, OS update missing, or policy conflict | "What does Company Portal show?", "Is the device online?" | Intune device status, compliance policy, last check-in, BitLocker, update status | VIP locked out, policy misconfiguration across fleet |
| User needs access to shared mailbox | Missing approval, wrong permission type, or propagation delay | "Who approved access?", "Send as or read-only?", "Is this temporary?" | Approval, mailbox permissions, group membership, Outlook restart/webmail | Sensitive mailbox, no owner approval, legal/HR data |
| Laptop running slowly | Startup load, disk pressure, update pending, malware/EDR scan, failing disk | "When is it slow?", "Any recent change?", "Is disk near full?" | Task Manager, startup apps, disk space, updates, event logs, EDR status | Signs of compromise, disk failure, business-critical user |
| Windows update failed | Pending restart, corrupt component store, low disk, policy block | "What error code?", "How long failing?", "Any restart pending?" | Update history, disk space, restart state, services, logs | Widespread patch failure, security deadline risk |
| Client says internet is down | ISP outage, router/firewall, DNS, Wi-Fi only, or single device issue | "Is it all devices?", "Are wired devices affected?", "Any lights/alerts?" | Scope, modem/firewall status, DNS, gateway ping, ISP status | Whole client offline, firewall down, outage exceeds SLA |

## MSP Scenario Trainer
Future route: `/msp-scenarios`

First useful version:
- Pick a scenario from a dropdown or card list.
- Show the ticket text and user emotion.
- Let Josh type first questions.
- Let Josh select likely checks from good and distractor options.
- Ask: resolve, gather more info, or escalate?
- Show comparison with ideal answer.
- Save completion status later if progress storage exists.

Feedback should score:
- Good first questions.
- Safe troubleshooting order.
- Security awareness.
- Escalation judgement.
- Ticket note quality.
- Communication tone.

Avoid:
- Rewarding fast guesses.
- Pretending every scenario has one magic fix.
- Encouraging risky changes without backup, approval, or escalation.

## Ticket Notes Trainer
Future route: `/ticket-notes`

Teach this note structure:
- Issue.
- User impact.
- Checks performed.
- Action taken.
- Result.
- Next step.
- Escalation reason if applicable.

### Poor example
> Fixed Outlook.

Why it is weak:
- No symptoms.
- No checks.
- No result detail.
- No user impact.
- No next step.
- Not useful if the issue returns.

### Okay example
> User reported Outlook was not updating. Checked webmail and confirmed new mail was present. Restarted Outlook and recreated profile. Mail started syncing again. User confirmed email is working.

Why it is okay:
- Captures issue, checks, action, and result.
- Still missing impact, timing, and next step if it recurs.

### Excellent example
> Issue: User reported Outlook desktop app had not received new mail since this morning, while webmail continued to work. Impact: User could not reliably respond to client emails from Outlook. Checks: Confirmed Microsoft 365 webmail showed current mail, checked Outlook connection state, confirmed network access, and noted no wider reports. Action: Restarted Outlook, cleared stuck send/receive state, and recreated the Outlook profile after confirming mailbox data was available online. Result: Mailbox synced successfully and user confirmed current mail appeared. Next step: If issue returns, check add-ins and mailbox profile health before escalating to Exchange Online support.

Why it is strong:
- Clear for the next technician.
- Separates evidence from action.
- Captures impact and recurrence path.
- Does not overclaim root cause.

## Evidence Pack
Future route: `/evidence-pack`

The evidence pack should generate a manager-safe professional development summary, not inflated self-promotion.

It should summarise:
- Skills practised.
- Scenarios completed.
- Modules completed.
- Ticket notes written.
- Weak areas identified.
- Next recommended study areas.
- Practical outputs created.
- Real-work examples, only if anonymised.

Markdown export outline:

```md
# MSP Professional Development Evidence Pack

## Summary
- Period:
- Main focus:
- Strongest growth area:
- Current weak area:

## Skills Practised
- Skill:
- Readiness movement:
- Evidence:

## Scenarios Completed
- Scenario:
- Outcome:
- Key learning:

## Documentation Outputs
- Ticket notes:
- KB drafts:
- Checklists:

## Reflection
- What improved:
- What still needs practice:
- Next best action:
```

## MSP Roadmap
Future route: `/msp-roadmap`

### Stage 1: Level 1 Helpdesk Foundations
Target skills:
- Ticket triage, password resets, MFA basics, printer/email/Wi-Fi first checks, ticket notes, escalation basics.

Practice tasks:
- Complete five L1 ticket scenarios.
- Write three excellent ticket notes.
- Build one escalation template.

Suggested evidence:
- Ticket notes.
- SLA triage exercise.
- Helpdesk question checklist.

Readiness indicators:
- Can ask useful first questions before touching settings.
- Can document issue, impact, checks, action, result, and next step.
- Can identify when a ticket is urgent or outside scope.

### Stage 2: Endpoint and Windows Confidence
Target skills:
- Windows troubleshooting, Device Manager, Event Viewer, Services, Task Manager, local profiles, updates, BitLocker basics.

Practice tasks:
- Build a Windows troubleshooting flowchart.
- Explain three Event Viewer entries.
- Complete slow laptop and update failure scenarios.

Suggested evidence:
- Flowchart.
- Endpoint ticket note.
- Command reference.

Readiness indicators:
- Can separate symptoms, likely causes, and evidence.
- Can avoid risky registry or system changes without approval.
- Can explain endpoint findings clearly.

### Stage 3: Microsoft 365 Admin Basics
Target skills:
- Outlook, Teams, OneDrive, shared mailboxes, licensing, user creation, calendar permissions, mail flow basics.

Practice tasks:
- Complete shared mailbox, OneDrive, Teams, and Outlook scenarios.
- Build an M365 admin task card set.

Suggested evidence:
- Shared mailbox checklist.
- OneDrive troubleshooting note.
- Licensing decision notes.

Readiness indicators:
- Can distinguish local app issues from service/account issues.
- Can explain access and licensing in plain English.
- Can escalate suspected tenant-wide issues.

### Stage 4: Networking Fundamentals
Target skills:
- IP, DNS, DHCP, gateways, Wi-Fi, switch/router/firewall basics, NAT, VPN, ports, latency, packet loss.

Practice tasks:
- Complete DNS and internet outage scenarios.
- Draw a small office network diagram.
- Do subnetting and port/protocol drills.

Suggested evidence:
- Network diagram.
- DNS troubleshooting note.
- ISP escalation template.

Readiness indicators:
- Can isolate device vs network vs ISP vs DNS problems.
- Can ask scope questions before assuming an outage.
- Can explain findings without jargon overload.

### Stage 5: Security and Essential Eight Basics
Target skills:
- Phishing, MFA, patching, vulnerability language, EDR alerts, least privilege, backups, incident response basics.

Practice tasks:
- Analyse five phishing examples.
- Map common MSP controls to Essential Eight, CIS Controls, and NIST CSF categories.
- Write one client-facing risk explanation.

Suggested evidence:
- Phishing analysis.
- Security maturity checklist.
- Risk explanation.

Readiness indicators:
- Can avoid dismissing suspicious activity as "probably fine."
- Can escalate credential exposure quickly.
- Can explain risk without fearmongering.

### Stage 6: Intune and Cloud Endpoint Management
Target skills:
- Enrolment, compliance, configuration profiles, app deployment, Autopilot, app protection, update rings, device retirement.

Practice tasks:
- Complete missing compliance and app deployment scenarios.
- Build a policy design note.
- Draft a device retirement checklist.

Suggested evidence:
- Compliance explanation.
- App deployment troubleshooting note.
- Device wipe/retirement checklist.

Readiness indicators:
- Can read device state before making policy changes.
- Can distinguish user, device, app, and policy causes.
- Can escalate policy-wide failures.

### Stage 7: Automation and PowerShell
Target skills:
- PowerShell basics, CMD, logs, safe script testing, idempotence, error handling, Microsoft Graph basics.

Practice tasks:
- Complete five PowerShell mini challenges.
- Annotate a script line-by-line.
- Write a safe testing checklist.

Suggested evidence:
- Commented script.
- Script safety note.
- Automation idea backlog.

Readiness indicators:
- Can explain what a script does before running it.
- Can test safely and avoid destructive changes.
- Can identify when manual work is safer than automation.

### Stage 8: L2 Readiness and Client Ownership
Target skills:
- Escalation judgement, problem patterns, change process, client communication, risk language, documentation quality, service ownership.

Practice tasks:
- Complete three hard scenarios.
- Write a root cause summary.
- Generate a weekly PD evidence pack.

Suggested evidence:
- Root cause summary.
- Change request draft.
- Weekly manager-safe PD summary.

Readiness indicators:
- Can own a ticket without hiding uncertainty.
- Can communicate status and risk clearly.
- Can hand over work so the next person can continue.

## Communication practice prompts

### Frustrated user
Prompt:
- "This keeps happening. I do not have time for this."

Model response:
- "I understand this is frustrating, especially if it has interrupted your work more than once. I am going to check whether this is isolated to your device or part of a wider issue, then I will update you with the next step rather than leaving you guessing."

### Non-technical manager
Prompt:
- "Can you explain what went wrong without the technical detail?"

Model response:
- "The issue appears to be with the way access is being applied, not with the user's password itself. I am checking the account and permission path now. If it is a wider policy issue, I will escalate it with the evidence needed for the next technician to act quickly."

### Security warning
Prompt:
- "I clicked a link in an email and now I am worried."

Model response:
- "Thanks for telling us quickly. Please do not enter any more details into that page. I will help check the message and your account activity, and if there is any chance credentials were entered we will treat it as urgent."

### Outage update
Prompt:
- "Is the internet back yet?"

Model response:
- "Not yet. We have confirmed the issue affects multiple devices, so we are treating it as a site-level outage rather than a single computer fault. The next step is checking the router/firewall and ISP status, and I will update you again once we know which side the fault is on."

### Escalation
Prompt:
- "Can you just fix it now?"

Model response:
- "I do not want to make a risky change without the right approval or access. I have gathered the symptoms, impact, and checks performed, and I am escalating it with that context so the next step is faster and safer."

### Asking for more information
Prompt:
- "It is broken."

Model response:
- "I can help. To narrow it down quickly, what were you trying to do, what happened instead, and does the same problem occur for anyone else or on another device?"

### Explaining a delay
Prompt:
- "Why is this taking so long?"

Model response:
- "The first checks ruled out the simple causes, so I am now checking the account and service side. I would rather confirm the cause than make a change that only masks the issue. I will keep the ticket updated with what has been checked."

### Closing a ticket professionally
Prompt:
- "It seems fixed now."

Model response:
- "Great, I will close this ticket as resolved. I have recorded the issue, checks performed, and fix applied. If it returns, please reply to the ticket with the time it happened and any error shown so we can continue from the existing notes."

## Next best action recommendation system
Future utility: `app/src/lib/mspRecommendations.ts`

Inputs:
- Skills with readiness below `practised`.
- Failed or low-scoring scenarios.
- Skills not reviewed recently.
- Foundational gaps blocking later skills.
- Repeated weak feedback areas: DNS, escalation, ticket notes, security judgement, communication tone.

Simple first rules:
- If more than three beginner skills are `unseen`, recommend the lowest-stage roadmap item.
- If a scenario failed due to unsafe action, recommend professional judgement and security practice before more technical scenarios.
- If ticket notes are missing issue/impact/result, recommend Ticket Notes Trainer.
- If networking scenarios are failed twice, recommend DNS/DHCP basics before VPN or firewall content.
- If Microsoft 365 scenarios are failed, recommend M365 admin task cards and identity basics.
- If no evidence has been created in seven days, recommend one small evidence output: a KB article, ticket note, or scenario reflection.
- If confidence is high but evidence is empty, recommend evidence creation rather than more self-rating.

Output shape:

```ts
export interface MspRecommendation {
  id: string;
  title: string;
  reason: string;
  actionType: 'skill' | 'scenario' | 'ticket-note' | 'roadmap' | 'evidence' | 'communication';
  targetId?: string;
  priority: 'low' | 'medium' | 'high';
}
```

## Technical integration plan
Add data first:
- `app/src/data/mspSkills.ts`
- `app/src/data/mspScenarios.ts`
- `app/src/data/mspRoadmap.ts`
- `app/src/data/communicationPrompts.ts`

Add shared types:
- Either extend `app/src/types/index.ts`, or create `app/src/types/msp.ts` and re-export from the main index.

Add routes incrementally:
- `/msp-skills`
- `/msp-scenarios`
- `/msp-roadmap`
- `/evidence-pack`
- `/ticket-notes`

Add small reusable components:
- `MspSkillCard`
- `ReadinessBadge`
- `ScenarioPicker`
- `ScenarioFeedback`
- `TicketNoteRubric`
- `EvidenceSummary`
- `RoadmapStageCard`

Storage path:
- First version can use static data and local component state.
- Second version should extend Dexie with scenario completions, skill readiness overrides, ticket note drafts, and evidence items.
- Later, map completed scenarios and notes into `PDAchievement` and `LearningItem` records so existing PD structures are reused.

Suggested future persisted records:

```ts
export interface MspScenarioAttempt {
  id: string;
  scenarioId: string;
  completedAt: Date;
  firstQuestions: string;
  selectedChecks: string[];
  decision: 'resolve' | 'gather-more-info' | 'escalate';
  ticketNotes: string;
  score: number;
  feedbackTags: string[];
}

export interface MspSkillProgress {
  id: string;
  skillId: string;
  readinessStatus: MspReadinessStatus;
  confidence: 1 | 2 | 3 | 4 | 5;
  lastPractisedAt?: Date;
  evidenceIds: string[];
  notes?: string;
}
```

## Professional standards anchors
Use these as learning anchors without copying proprietary course content:
- CompTIA A+: hardware, software, troubleshooting, networking, security, and support fundamentals.
- CompTIA Network+: network management and troubleshooting foundations.
- CompTIA Security+: practical security operations and risk basics.
- Microsoft Learn: Entra ID, Microsoft 365, Intune, Azure fundamentals.
- ITIL-style service management: incidents, requests, problems, changes, SLAs, knowledge management.
- NIST CSF: Govern, Identify, Protect, Detect, Respond, Recover.
- CIS Controls: prioritised safeguards.
- ACSC Essential Eight: especially relevant for Australian security maturity language.

## Definition of done for the Academy MVP
- A learner can browse the MSP skill matrix and see readiness statuses.
- A learner can complete at least 10 realistic ticket scenarios.
- A learner can write a ticket note and compare it to the rubric.
- A learner can view the MSP roadmap and choose the next stage.
- A learner can generate a simple Markdown evidence pack.
- Navigation exposes the new sections without disrupting the existing dashboard and shift pages.
- The app still builds, runs, and keeps existing features intact.
