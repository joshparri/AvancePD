export type MspSkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type MspReadiness =
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
  readiness: MspReadiness;
  description: string;
  practicalExamples: string[];
  relatedTools: string[];
  evidenceExamples: string[];
  suggestedPractice: string[];
}

export const mspSkillCategories = [
  'Helpdesk and triage',
  'Endpoint support',
  'Windows troubleshooting',
  'Microsoft 365 support',
  'Entra ID and identity',
  'Intune and endpoint management',
  'Networking',
  'Cybersecurity',
  'Backup and disaster recovery',
  'RMM and PSA operations',
  'Scripting and automation',
  'Documentation',
  'Client communication',
  'Escalation and professional judgement',
  'Service management',
] as const;

export const mspSkills: MspSkill[] = [
  {
    id: 'helpdesk-ticket-triage',
    title: 'Ticket triage and prioritisation',
    category: 'Helpdesk and triage',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Sort incoming requests by impact, urgency, scope, and service agreement so noisy tickets do not hide genuinely urgent work.',
    practicalExamples: [
      'Identify whether an issue affects one user, a department, or a whole site.',
      'Separate an incident from a service request before choosing next steps.',
    ],
    relatedTools: ['PSA ticket queue', 'SLA matrix', 'Client agreement notes'],
    evidenceExamples: ['Triage decision note', 'Priority explanation', 'Escalation-ready ticket summary'],
    suggestedPractice: ['Classify five sample tickets by impact and urgency.', 'Rewrite a vague ticket title into a useful summary.'],
  },
  {
    id: 'helpdesk-diagnostic-questions',
    title: 'Diagnostic first questions',
    category: 'Helpdesk and triage',
    level: 'beginner',
    readiness: 'practised',
    description:
      'Ask concise questions that narrow scope, reproduce symptoms, and uncover recent changes before touching settings.',
    practicalExamples: [
      'Ask what changed, who is affected, and whether there is an error message.',
      'Confirm whether the same issue happens on another device or network.',
    ],
    relatedTools: ['Ticket form', 'Phone script', 'Remote support session'],
    evidenceExamples: ['First-question checklist', 'Scenario attempt notes', 'Improved ticket intake template'],
    suggestedPractice: ['Write three first questions for each new ticket scenario.', 'Practise avoiding leading questions.'],
  },
  {
    id: 'helpdesk-password-mfa',
    title: 'Password reset and MFA first-line support',
    category: 'Helpdesk and triage',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Handle password and MFA issues safely while confirming identity, checking lockout state, and spotting suspicious access patterns.',
    practicalExamples: [
      'Confirm whether web sign-in works before rebuilding a local profile.',
      'Escalate repeated lockouts or unexpected MFA prompts.',
    ],
    relatedTools: ['Microsoft 365 admin centre', 'Entra admin centre', 'Authenticator app'],
    evidenceExamples: ['MFA troubleshooting note', 'Account lockout decision tree', 'Security escalation summary'],
    suggestedPractice: ['Complete password reset scenarios.', 'Write a safe user identity verification checklist.'],
  },
  {
    id: 'endpoint-device-lifecycle',
    title: 'Device lifecycle basics',
    category: 'Endpoint support',
    level: 'beginner',
    readiness: 'unseen',
    description:
      'Understand how laptops and desktops move through provisioning, assignment, maintenance, replacement, and retirement.',
    practicalExamples: [
      'Check whether a laptop is assigned to the right user.',
      'Prepare a device retirement checklist before wiping hardware.',
    ],
    relatedTools: ['Asset register', 'RMM inventory', 'Intune device list'],
    evidenceExamples: ['Device lifecycle checklist', 'Asset audit note', 'Retirement handover summary'],
    suggestedPractice: ['Map the steps from new device request to user handover.', 'Review a fictional asset record for missing data.'],
  },
  {
    id: 'endpoint-app-installs',
    title: 'Application install and removal support',
    category: 'Endpoint support',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Install, update, repair, or remove applications while checking licensing, permissions, restart needs, and user impact.',
    practicalExamples: [
      'Confirm whether an app install is blocked by policy or permissions.',
      'Record install source, version, and result in the ticket.',
    ],
    relatedTools: ['Company Portal', 'RMM software deployment', 'Programs and Features'],
    evidenceExamples: ['App install ticket note', 'Known app install issue KB draft', 'Licensing check summary'],
    suggestedPractice: ['Write an app install troubleshooting flow.', 'Compare manual install vs managed deployment risk.'],
  },
  {
    id: 'endpoint-security-basics',
    title: 'Endpoint security basics',
    category: 'Endpoint support',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Recognise endpoint protection states, EDR alerts, disk encryption status, and when a normal support issue may be security related.',
    practicalExamples: [
      'Check BitLocker state before device handover.',
      'Escalate an unexplained EDR alert instead of suppressing it.',
    ],
    relatedTools: ['Microsoft Defender', 'EDR console', 'BitLocker management', 'RMM'],
    evidenceExamples: ['Endpoint security checklist', 'EDR alert triage note', 'BitLocker verification note'],
    suggestedPractice: ['Review sample EDR alerts.', 'Build a safe endpoint security first-check list.'],
  },
  {
    id: 'windows-event-viewer',
    title: 'Event Viewer basics',
    category: 'Windows troubleshooting',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Use Windows logs to support a troubleshooting theory without drowning in noise or treating every warning as root cause.',
    practicalExamples: [
      'Check Application and System logs around the time a problem occurred.',
      'Distinguish repeated critical errors from routine warnings.',
    ],
    relatedTools: ['Event Viewer', 'Reliability Monitor', 'Windows logs'],
    evidenceExamples: ['Event log explanation', 'Troubleshooting timeline', 'Known issue note'],
    suggestedPractice: ['Explain three sample log entries in plain English.', 'Build a timeline from symptoms and log timestamps.'],
  },
  {
    id: 'windows-update-repair',
    title: 'Windows Update failure triage',
    category: 'Windows troubleshooting',
    level: 'intermediate',
    readiness: 'learning',
    description:
      'Troubleshoot failed updates by checking disk space, pending restarts, policy state, service health, and error history.',
    practicalExamples: [
      'Check update history and pending restart before running repair commands.',
      'Escalate fleet-wide update failures as a patch management risk.',
    ],
    relatedTools: ['Windows Update', 'Settings', 'Services', 'RMM patch reports'],
    evidenceExamples: ['Update failure ticket note', 'Patch risk summary', 'Restart state checklist'],
    suggestedPractice: ['Complete the Windows update failed scenario.', 'Write safe checks before repair actions.'],
  },
  {
    id: 'windows-performance-profile',
    title: 'Slow laptop and profile triage',
    category: 'Windows troubleshooting',
    level: 'intermediate',
    readiness: 'practised',
    description:
      'Investigate slow Windows devices by checking startup load, disk pressure, updates, user profile issues, and security scans.',
    practicalExamples: [
      'Use Task Manager to identify resource pressure.',
      'Check whether a new profile resolves a user-specific issue.',
    ],
    relatedTools: ['Task Manager', 'Startup apps', 'Disk Cleanup', 'Event Viewer'],
    evidenceExamples: ['Slow laptop ticket note', 'Performance checklist', 'User profile troubleshooting note'],
    suggestedPractice: ['Complete slow laptop scenarios.', 'Write a no-risk first-check performance flow.'],
  },
  {
    id: 'm365-admin-basics',
    title: 'Microsoft 365 admin centre basics',
    category: 'Microsoft 365 support',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Navigate core Microsoft 365 admin tasks for users, licences, groups, service health, and basic tenant support.',
    practicalExamples: [
      'Check whether a user has the correct licence assigned.',
      'Review service health before treating a tenant-wide issue as local.',
    ],
    relatedTools: ['Microsoft 365 admin centre', 'Service health', 'Admin roles'],
    evidenceExamples: ['M365 task card', 'Licence decision note', 'Admin centre navigation checklist'],
    suggestedPractice: ['Create task cards for five common admin actions.', 'Explain licence impact in plain English.'],
  },
  {
    id: 'm365-outlook-troubleshooting',
    title: 'Outlook mailbox troubleshooting',
    category: 'Microsoft 365 support',
    level: 'beginner',
    readiness: 'practised',
    description:
      'Troubleshoot Outlook issues by comparing desktop app, webmail, profile state, add-ins, connectivity, and mailbox health.',
    practicalExamples: [
      'Use webmail comparison to isolate local Outlook issues.',
      'Record whether the issue is sync, send, receive, calendar, or profile related.',
    ],
    relatedTools: ['Outlook', 'Outlook on the web', 'Exchange admin centre'],
    evidenceExamples: ['Outlook troubleshooting ticket note', 'Profile rebuild checklist', 'Mailbox sync KB draft'],
    suggestedPractice: ['Complete Outlook mailbox not updating scenario.', 'Write a profile repair decision tree.'],
  },
  {
    id: 'm365-onedrive-sync',
    title: 'OneDrive sync troubleshooting',
    category: 'Microsoft 365 support',
    level: 'intermediate',
    readiness: 'learning',
    description:
      'Resolve OneDrive sync problems by checking client state, account sign-in, storage, permissions, path issues, and online file state.',
    practicalExamples: [
      'Compare local file status with OneDrive web.',
      'Identify path length, invalid character, or storage quota problems.',
    ],
    relatedTools: ['OneDrive sync client', 'SharePoint', 'Microsoft 365 admin centre'],
    evidenceExamples: ['OneDrive sync ticket note', 'Sync icon glossary', 'Data risk explanation'],
    suggestedPractice: ['Complete OneDrive sync scenario.', 'Build a sync icon and first-check cheat sheet.'],
  },
  {
    id: 'm365-teams-support',
    title: 'Teams meeting support',
    category: 'Microsoft 365 support',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Support Teams audio, video, meeting access, and basic user experience issues without overcomplicating first-line checks.',
    practicalExamples: [
      'Check Teams device settings before reinstalling drivers.',
      'Confirm whether browser, desktop app, or all meetings are affected.',
    ],
    relatedTools: ['Teams', 'Windows sound settings', 'Browser permissions'],
    evidenceExamples: ['Teams audio checklist', 'Meeting support ticket note', 'User-facing quick fix guide'],
    suggestedPractice: ['Complete Teams microphone scenario.', 'Write a three-minute meeting rescue checklist.'],
  },
  {
    id: 'entra-users-groups',
    title: 'Entra users and groups',
    category: 'Entra ID and identity',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Understand how users, groups, roles, and access assignments connect across Microsoft cloud services.',
    practicalExamples: [
      'Check whether access is direct or group-based.',
      'Confirm whether a guest account is being used instead of a member account.',
    ],
    relatedTools: ['Entra admin centre', 'Microsoft 365 admin centre', 'Access assignments'],
    evidenceExamples: ['Access check note', 'User/group diagram', 'Permission summary'],
    suggestedPractice: ['Map a user access path from group to mailbox.', 'Write a least privilege explanation.'],
  },
  {
    id: 'entra-mfa-troubleshooting',
    title: 'MFA troubleshooting',
    category: 'Entra ID and identity',
    level: 'intermediate',
    readiness: 'learning',
    description:
      'Resolve MFA prompts, registration problems, and authentication method issues while staying alert to suspicious sign-in behaviour.',
    practicalExamples: [
      'Check registered methods before resetting MFA.',
      'Escalate unexpected MFA prompts that may indicate credential compromise.',
    ],
    relatedTools: ['Entra admin centre', 'Authenticator app', 'Sign-in logs'],
    evidenceExamples: ['MFA reset checklist', 'Suspicious prompt escalation note', 'User guidance template'],
    suggestedPractice: ['Complete sign-in scenario.', 'Write safe MFA reset wording.'],
  },
  {
    id: 'entra-joiner-mover-leaver',
    title: 'Joiner, mover, leaver lifecycle',
    category: 'Entra ID and identity',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Coordinate identity changes across accounts, licences, groups, devices, mailbox access, and approvals.',
    practicalExamples: [
      'Confirm manager approval before granting access.',
      'Remove access cleanly during role changes or departures.',
    ],
    relatedTools: ['Entra ID', 'Microsoft 365 admin centre', 'Intune', 'PSA tasks'],
    evidenceExamples: ['Onboarding checklist', 'Access approval note', 'Leaver process summary'],
    suggestedPractice: ['Complete new staff onboarding scenario.', 'Write a mover access review checklist.'],
  },
  {
    id: 'intune-compliance-policy',
    title: 'Intune compliance policy triage',
    category: 'Intune and endpoint management',
    level: 'intermediate',
    readiness: 'learning',
    description:
      'Understand why a device is compliant or non-compliant and how that affects access to organisational resources.',
    practicalExamples: [
      'Check last check-in time before assuming a policy is broken.',
      'Identify whether BitLocker, OS version, or threat state caused non-compliance.',
    ],
    relatedTools: ['Intune admin centre', 'Company Portal', 'Compliance reports'],
    evidenceExamples: ['Compliance troubleshooting note', 'Policy explanation', 'Device state summary'],
    suggestedPractice: ['Complete missing compliance scenario.', 'Build a compliance first-check card.'],
  },
  {
    id: 'intune-app-deployment',
    title: 'Intune app deployment troubleshooting',
    category: 'Intune and endpoint management',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Investigate failed app deployment by checking assignment, detection rules, device state, install context, and logs.',
    practicalExamples: [
      'Confirm whether the user or device is in the assigned group.',
      'Check whether detection rules mark an app as already installed.',
    ],
    relatedTools: ['Intune admin centre', 'Company Portal', 'IME logs'],
    evidenceExamples: ['App deployment failure note', 'Detection rule checklist', 'Policy assignment diagram'],
    suggestedPractice: ['Write a failed deployment triage flow.', 'Compare user vs device assignment examples.'],
  },
  {
    id: 'intune-autopilot-enrolment',
    title: 'Autopilot and enrolment basics',
    category: 'Intune and endpoint management',
    level: 'advanced',
    readiness: 'unseen',
    description:
      'Understand the broad Autopilot and enrolment workflow so device setup problems can be described and escalated accurately.',
    practicalExamples: [
      'Check whether a device is registered before blaming the build process.',
      'Record the stage where enrolment failed.',
    ],
    relatedTools: ['Windows Autopilot', 'Intune devices', 'Enrollment Status Page'],
    evidenceExamples: ['Autopilot workflow map', 'Enrolment failure ticket note', 'Device preparation checklist'],
    suggestedPractice: ['Map Autopilot stages.', 'Write escalation notes for a failed enrolment.'],
  },
  {
    id: 'networking-dns-dhcp',
    title: 'DNS and DHCP troubleshooting',
    category: 'Networking',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Troubleshoot name resolution and address assignment issues before assuming an application or internet outage.',
    practicalExamples: [
      'Use `nslookup` to compare expected and actual DNS answers.',
      'Check whether a device has a valid DHCP address, gateway, and DNS server.',
    ],
    relatedTools: ['ipconfig', 'nslookup', 'DHCP scope', 'DNS records'],
    evidenceExamples: ['DNS troubleshooting note', 'DHCP checklist', 'Network fault isolation summary'],
    suggestedPractice: ['Complete DNS website failure scenario.', 'Write a DNS vs internet outage comparison.'],
  },
  {
    id: 'networking-wifi-troubleshooting',
    title: 'Wi-Fi troubleshooting',
    category: 'Networking',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Investigate wireless issues by checking scope, signal, affected devices, location, authentication, and wired comparison.',
    practicalExamples: [
      'Compare Wi-Fi performance in the affected room with a nearby room.',
      'Check whether wired devices are also slow.',
    ],
    relatedTools: ['Wi-Fi analyser', 'Access point dashboard', 'Speed test', 'RMM'],
    evidenceExamples: ['Wi-Fi scope note', 'AP issue escalation', 'Room-specific performance log'],
    suggestedPractice: ['Complete Wi-Fi slow room scenario.', 'Draw a site Wi-Fi scope map.'],
  },
  {
    id: 'networking-internet-outage',
    title: 'Internet outage triage',
    category: 'Networking',
    level: 'intermediate',
    readiness: 'practised',
    description:
      'Determine whether an outage is device, Wi-Fi, LAN, firewall, ISP, DNS, or service related before escalating.',
    practicalExamples: [
      'Confirm whether the issue affects all devices or only one path.',
      'Check firewall/router status before contacting the ISP.',
    ],
    relatedTools: ['ping', 'tracert', 'Firewall dashboard', 'ISP status page'],
    evidenceExamples: ['Outage triage ticket note', 'ISP escalation template', 'Impact summary'],
    suggestedPractice: ['Complete internet down scenario.', 'Write a site outage update for a manager.'],
  },
  {
    id: 'networking-ports-protocols',
    title: 'Ports and protocols basics',
    category: 'Networking',
    level: 'beginner',
    readiness: 'unseen',
    description:
      'Recognise common ports and protocols so application, firewall, VPN, and mail flow issues can be described accurately.',
    practicalExamples: [
      'Know when DNS, HTTPS, SMTP, RDP, or VPN traffic may be relevant.',
      'Avoid opening firewall access without approval and scope.',
    ],
    relatedTools: ['Port reference', 'Firewall rules', 'Packet capture basics'],
    evidenceExamples: ['Port flashcards', 'Firewall request note', 'Protocol explanation'],
    suggestedPractice: ['Create port/protocol flashcards.', 'Match common services to ports and risk levels.'],
  },
  {
    id: 'cyber-phishing-analysis',
    title: 'Phishing email analysis',
    category: 'Cybersecurity',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Assess suspicious emails by checking sender, links, attachments, urgency, requested action, and whether credentials were entered.',
    practicalExamples: [
      'Ask whether the user clicked or entered a password.',
      'Escalate if multiple users received the same credential harvesting email.',
    ],
    relatedTools: ['Outlook message headers', 'Defender portal', 'Security awareness material'],
    evidenceExamples: ['Phishing analysis note', 'User response template', 'Incident escalation summary'],
    suggestedPractice: ['Analyse five sample phishing emails.', 'Write calm guidance for a user who clicked a link.'],
  },
  {
    id: 'cyber-security-baselines',
    title: 'Security baseline awareness',
    category: 'Cybersecurity',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Understand common MSP baseline controls such as MFA, patching, endpoint protection, backups, least privilege, and logging.',
    practicalExamples: [
      'Explain why admin rights should be limited.',
      'Connect patching and backups to practical client risk.',
    ],
    relatedTools: ['Essential Eight', 'CIS Controls', 'NIST CSF', 'Security baselines'],
    evidenceExamples: ['Security maturity checklist', 'Client risk explanation', 'Baseline gap note'],
    suggestedPractice: ['Map common controls to Essential Eight.', 'Write one plain-English risk explanation.'],
  },
  {
    id: 'cyber-incident-first-response',
    title: 'Security incident first response',
    category: 'Cybersecurity',
    level: 'intermediate',
    readiness: 'learning',
    description:
      'Respond to suspected compromise by preserving evidence, reducing harm, escalating quickly, and avoiding casual reassurance.',
    practicalExamples: [
      'Treat credential entry into a phishing site as urgent.',
      'Avoid deleting evidence before escalation.',
    ],
    relatedTools: ['PSA escalation', 'Defender', 'Sign-in logs', 'Incident checklist'],
    evidenceExamples: ['Incident triage note', 'Credential exposure escalation', 'Security timeline'],
    suggestedPractice: ['Complete phishing scenario.', 'Write a five-step first response checklist.'],
  },
  {
    id: 'backup-monitoring',
    title: 'Backup monitoring and failure triage',
    category: 'Backup and disaster recovery',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Review backup alerts, identify failure patterns, and record the recovery risk clearly for escalation or remediation.',
    practicalExamples: [
      'Check last successful backup before closing a failed job alert.',
      'Escalate repeated failures or missing restore points.',
    ],
    relatedTools: ['Backup console', 'RMM alerts', 'PSA tickets'],
    evidenceExamples: ['Backup failure note', 'Restore risk summary', 'Alert triage checklist'],
    suggestedPractice: ['Complete backup job failed scenario.', 'Write a backup alert triage flow.'],
  },
  {
    id: 'backup-restore-testing',
    title: 'Restore testing evidence',
    category: 'Backup and disaster recovery',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Understand why backups are only trustworthy when restores are tested and evidence is recorded.',
    practicalExamples: [
      'Record what was restored, where, when, and whether the data opened successfully.',
      'Explain why a green backup job is not the same as proven recovery.',
    ],
    relatedTools: ['Backup console', 'Restore test log', 'Client DR plan'],
    evidenceExamples: ['Restore test evidence log', 'Recovery proof summary', 'DR checklist'],
    suggestedPractice: ['Draft a restore-test evidence template.', 'Explain restore testing to a non-technical manager.'],
  },
  {
    id: 'backup-rpo-rto',
    title: 'RPO and RTO basics',
    category: 'Backup and disaster recovery',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Use recovery point and recovery time language to discuss backup expectations and business continuity tradeoffs.',
    practicalExamples: [
      'Explain how much data could be lost after the last backup.',
      'Clarify whether a client expects minutes, hours, or days to recover.',
    ],
    relatedTools: ['DR plan', 'Backup reports', 'Client agreement notes'],
    evidenceExamples: ['RPO/RTO explanation', 'Business impact note', 'Recovery expectation checklist'],
    suggestedPractice: ['Complete RPO/RTO decision exercises.', 'Write a manager-safe recovery explanation.'],
  },
  {
    id: 'rmm-alert-triage',
    title: 'RMM alert triage',
    category: 'RMM and PSA operations',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Review monitoring alerts without blindly clearing them, linking the alert to impact, history, and next action.',
    practicalExamples: [
      'Check whether a disk space alert is recurring.',
      'Distinguish noisy alerts from service-impacting alerts.',
    ],
    relatedTools: ['RMM alert queue', 'Device inventory', 'PSA ticket'],
    evidenceExamples: ['Alert triage notes', 'Recurring alert summary', 'Remediation checklist'],
    suggestedPractice: ['Sort a fake RMM alert queue.', 'Write close notes for a resolved alert.'],
  },
  {
    id: 'psa-ticket-discipline',
    title: 'PSA ticket and time entry discipline',
    category: 'RMM and PSA operations',
    level: 'beginner',
    readiness: 'practised',
    description:
      'Keep ticket notes, status, ownership, time entries, and next steps clear enough for billing, handover, and client trust.',
    practicalExamples: [
      'Record user impact and next step before changing ticket status.',
      'Write time entries that are specific but not noisy.',
    ],
    relatedTools: ['PSA', 'Ticket queue', 'Time entry form'],
    evidenceExamples: ['Clean ticket note', 'Time entry examples', 'Handover summary'],
    suggestedPractice: ['Rewrite three poor ticket notes.', 'Practise concise time entries for common issues.'],
  },
  {
    id: 'rmm-patch-management',
    title: 'Patch management awareness',
    category: 'RMM and PSA operations',
    level: 'intermediate',
    readiness: 'learning',
    description:
      'Understand patch schedules, restart impact, failed updates, and when patching creates business or security risk.',
    practicalExamples: [
      'Identify devices missing critical patches.',
      'Communicate restart requirements without surprising users.',
    ],
    relatedTools: ['RMM patch reports', 'Windows Update', 'Maintenance window notes'],
    evidenceExamples: ['Patch triage note', 'Restart communication template', 'Failed patch summary'],
    suggestedPractice: ['Review a fake Patch Tuesday report.', 'Write a patch delay risk explanation.'],
  },
  {
    id: 'script-powershell-basics',
    title: 'PowerShell basics',
    category: 'Scripting and automation',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Use simple PowerShell commands safely for discovery, reporting, and low-risk support tasks.',
    practicalExamples: [
      'Read service state without changing it.',
      'Export basic device or user information for a ticket note.',
    ],
    relatedTools: ['PowerShell', 'Windows Terminal', 'VS Code'],
    evidenceExamples: ['Annotated command list', 'Mini challenge output', 'Script safety note'],
    suggestedPractice: ['Complete five read-only PowerShell challenges.', 'Explain a command before running it.'],
  },
  {
    id: 'script-safe-testing',
    title: 'Safe script testing',
    category: 'Scripting and automation',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Test scripts carefully using scope control, backups, dry runs, error handling, and rollback thinking.',
    practicalExamples: [
      'Run against one test device before a fleet deployment.',
      'Avoid destructive scripts without approval and a rollback plan.',
    ],
    relatedTools: ['PowerShell', 'RMM script deployment', 'Test device'],
    evidenceExamples: ['Script test plan', 'Rollback note', 'Annotated script'],
    suggestedPractice: ['Mark a script as safe or unsafe.', 'Write a pre-flight checklist for script deployment.'],
  },
  {
    id: 'script-log-reading',
    title: 'Reading logs for automation and support',
    category: 'Scripting and automation',
    level: 'intermediate',
    readiness: 'learning',
    description:
      'Read logs methodically to find timing, error codes, repeated failures, and useful evidence for escalation.',
    practicalExamples: [
      'Find the first error before a chain of follow-on failures.',
      'Summarise a log error in plain English.',
    ],
    relatedTools: ['Event Viewer', 'Intune Management Extension logs', 'Application logs'],
    evidenceExamples: ['Log interpretation note', 'Escalation evidence extract', 'Error code summary'],
    suggestedPractice: ['Explain three sample log snippets.', 'Write a log-to-ticket summary.'],
  },
  {
    id: 'docs-kb-writing',
    title: 'Knowledge base article writing',
    category: 'Documentation',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Turn repeated fixes into clear, reusable knowledge that states symptoms, cause, fix, risk, and escalation limits.',
    practicalExamples: [
      'Convert a solved ticket into a short KB article.',
      'Mark whether a fix is tested, assumed, or needs verification.',
    ],
    relatedTools: ['Knowledge base', 'Markdown', 'PSA ticket history'],
    evidenceExamples: ['KB article draft', 'Known issue note', 'Troubleshooting playbook'],
    suggestedPractice: ['Convert one scenario into a KB article.', 'Improve a vague fix note into a reusable article.'],
  },
  {
    id: 'docs-handover-notes',
    title: 'Handover notes',
    category: 'Documentation',
    level: 'beginner',
    readiness: 'practised',
    description:
      'Write handovers that allow another technician to continue without re-discovering the same facts.',
    practicalExamples: [
      'Capture current state, blockers, next step, owner, and risk.',
      'Separate what is known from what is assumed.',
    ],
    relatedTools: ['Work log', 'PSA ticket', 'Shift summary'],
    evidenceExamples: ['Shift handover', 'Escalation summary', 'Follow-up checklist'],
    suggestedPractice: ['Write a handover for a half-solved scenario.', 'Review whether a note has enough context to continue.'],
  },
  {
    id: 'docs-root-cause-summary',
    title: 'Root cause summary basics',
    category: 'Documentation',
    level: 'advanced',
    readiness: 'unseen',
    description:
      'Summarise what happened, why it happened, what was done, and how recurrence can be reduced without overclaiming certainty.',
    practicalExamples: [
      'Distinguish root cause from symptom and workaround.',
      'Write a summary after a repeated issue is resolved.',
    ],
    relatedTools: ['Problem record', 'Incident ticket', 'KB article'],
    evidenceExamples: ['Root cause summary', 'Problem trend note', 'Prevention action list'],
    suggestedPractice: ['Write a root cause summary for a DNS scenario.', 'Label evidence, assumption, and recommendation.'],
  },
  {
    id: 'comm-plain-english',
    title: 'Plain-English technical explanations',
    category: 'Client communication',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Explain technical findings in language that is accurate, calm, and useful for non-technical users and managers.',
    practicalExamples: [
      'Explain DNS as name lookup rather than using unexplained acronyms.',
      'Tell a user what happens next and what they need to do.',
    ],
    relatedTools: ['Ticket replies', 'Email', 'Phone updates'],
    evidenceExamples: ['Client-friendly response', 'Risk explanation rewrite', 'Manager update'],
    suggestedPractice: ['Rewrite three technical notes for non-technical readers.', 'Practise one-sentence status updates.'],
  },
  {
    id: 'comm-deescalation',
    title: 'De-escalation and calm intake',
    category: 'Client communication',
    level: 'intermediate',
    readiness: 'learning',
    description:
      'Respond to frustrated users with calm acknowledgement, useful boundaries, and clear next steps.',
    practicalExamples: [
      'Acknowledge impact without accepting blame before evidence is known.',
      'Keep the user informed during longer troubleshooting.',
    ],
    relatedTools: ['Phone script', 'Ticket update templates', 'Escalation email'],
    evidenceExamples: ['Difficult-user response', 'Follow-up message', 'Tone rewrite'],
    suggestedPractice: ['Rewrite a defensive response into a calm one.', 'Practise outage and delay wording.'],
  },
  {
    id: 'comm-outage-updates',
    title: 'Outage updates',
    category: 'Client communication',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Communicate outage scope, impact, next checks, and update rhythm without overpromising an ETA.',
    practicalExamples: [
      'State what has been confirmed and what is still being checked.',
      'Avoid guessing a fix time when the cause is unknown.',
    ],
    relatedTools: ['Ticket update', 'Email', 'Teams', 'Phone'],
    evidenceExamples: ['Outage update template', 'Manager-safe status note', 'Client communication log'],
    suggestedPractice: ['Write three outage updates at different stages.', 'Practise no-ETA wording.'],
  },
  {
    id: 'judgement-escalation',
    title: 'Escalation decision-making',
    category: 'Escalation and professional judgement',
    level: 'beginner',
    readiness: 'practised',
    description:
      'Know when to continue troubleshooting, when to pause, and when to escalate with enough context for the next technician.',
    practicalExamples: [
      'Escalate suspected security incidents quickly.',
      'Stop before making risky changes outside access or approval.',
    ],
    relatedTools: ['Escalation matrix', 'PSA ticket', 'Team handover'],
    evidenceExamples: ['Escalation reason', 'Risk summary', 'Checks performed list'],
    suggestedPractice: ['Identify escalation triggers in each scenario.', 'Write escalation notes using issue, impact, checks, and risk.'],
  },
  {
    id: 'judgement-risk-scope',
    title: 'Risk and scope awareness',
    category: 'Escalation and professional judgement',
    level: 'intermediate',
    readiness: 'learning',
    description:
      'Recognise when a fix could affect security, data, business operations, billing, or client trust.',
    practicalExamples: [
      'Avoid granting access without approval.',
      'Do not change firewall or retention settings casually.',
    ],
    relatedTools: ['Change process', 'Approval notes', 'Client agreement'],
    evidenceExamples: ['Risk rating note', 'Scope boundary explanation', 'Approval request'],
    suggestedPractice: ['Complete "should you touch this?" drills.', 'Label safe, risky, and approval-required actions.'],
  },
  {
    id: 'judgement-change-safety',
    title: 'Change safety basics',
    category: 'Escalation and professional judgement',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Understand why changes need context, approval, timing, rollback planning, and communication.',
    practicalExamples: [
      'Check whether a change can wait for a maintenance window.',
      'Record rollback steps before applying a high-impact change.',
    ],
    relatedTools: ['Change request', 'Maintenance window', 'Rollback notes'],
    evidenceExamples: ['Change request draft', 'Rollback checklist', 'Impact note'],
    suggestedPractice: ['Draft a change request for a network setting.', 'Compare emergency vs standard change examples.'],
  },
  {
    id: 'service-incident-request',
    title: 'Incident vs service request',
    category: 'Service management',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Distinguish broken service restoration from a request for something new so work can be handled correctly.',
    practicalExamples: [
      'Treat "internet is down" as an incident.',
      'Treat "new user needs access" as a service request with approval needs.',
    ],
    relatedTools: ['PSA categories', 'Service desk process', 'Request forms'],
    evidenceExamples: ['Ticket categorisation exercise', 'Process note', 'Request checklist'],
    suggestedPractice: ['Classify 20 sample tickets.', 'Write why category changes the workflow.'],
  },
  {
    id: 'service-sla-priority',
    title: 'SLA and priority logic',
    category: 'Service management',
    level: 'beginner',
    readiness: 'learning',
    description:
      'Use impact, urgency, VIP context, and service agreement expectations to set priority without panic or guesswork.',
    practicalExamples: [
      'Prioritise a whole-site outage over a single noisy low-impact request.',
      'Record why a priority was raised or lowered.',
    ],
    relatedTools: ['SLA matrix', 'PSA priority field', 'Client agreement'],
    evidenceExamples: ['Priority decision note', 'SLA triage drill', 'Manager-safe explanation'],
    suggestedPractice: ['Rank ten tickets by priority.', 'Explain why urgency and impact are different.'],
  },
  {
    id: 'service-continual-improvement',
    title: 'Continual improvement habit',
    category: 'Service management',
    level: 'intermediate',
    readiness: 'unseen',
    description:
      'Turn recurring tickets and repeated confusion into better documentation, checklists, automation ideas, or learning goals.',
    practicalExamples: [
      'Create a KB draft after the third repeat issue.',
      'Identify one weak skill after each scenario set.',
    ],
    relatedTools: ['Learning tracker', 'Knowledge base', 'PD goals', 'Evidence pack'],
    evidenceExamples: ['Weekly improvement note', 'Learning goal', 'KB backlog item'],
    suggestedPractice: ['Write a weekly reflection.', 'Pick one repeated issue and propose a process improvement.'],
  },
];

