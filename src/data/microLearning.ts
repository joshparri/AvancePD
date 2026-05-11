export type MicroLearningCard = {
  id: string;
  topic: string;
  category: string;
  concept: string;
  whyItMatters: string;
  commonMistake: string;
  example: string;
  practiceTask: string;
  linkedScenarioIds: string[];
  linkedSkillIds: string[];
  tags: string[];
};

export const microLearningCards: MicroLearningCard[] = [
  {
    id: 'mfa-first-response',
    topic: 'MFA troubleshooting: first response',
    category: 'Identity and Access',
    concept: 'When MFA fails at sign-in, distinguish between the three root causes before touching any account: the user changed device, the authenticator code is expired, or a conditional access policy is blocking the session.',
    whyItMatters: 'Resetting MFA without understanding why it failed can lock a user out of all their devices at once. A reset without re-registration guidance creates a second ticket immediately.',
    commonMistake: 'Resetting MFA admin-side immediately without checking whether the existing method (phone or authenticator app) is still reachable by the user.',
    example: 'User reports they cannot sign in after getting a new phone. Check: is the authenticator app installed on the new device? Guide re-registration through Microsoft Authenticator before resetting MFA in the admin portal.',
    practiceTask: 'Write a short privacy-safe ticket note for a hypothetical MFA re-registration. Include: issue, check performed, action, result, and next step.',
    linkedScenarioIds: ['password-reset-signin'],
    linkedSkillIds: ['mfa-troubleshooting', 'entra-users-groups'],
    tags: ['identity', 'mfa', 'authentication', 'M365']
  },
  {
    id: 'outlook-sync-triage',
    topic: 'Outlook desktop sync: triage checklist',
    category: 'M365 Support',
    concept: 'Outlook sync failures have four common causes: offline mode is on, the mailbox is over quota, the cached profile is corrupted, or a recent update failed to apply. Check in that order before touching the profile or reinstalling anything.',
    whyItMatters: 'Reinstalling Office for a simple offline-mode issue wastes 30 or more minutes and creates a reinstall-verification ticket. Checking quick items first resolves most cases in under five minutes.',
    commonMistake: 'Repairing the Office installation when the fix is just toggling Work Offline off, or when the mailbox is simply full.',
    example: 'User reports email not arriving. Steps: (1) Check Work Offline toggle in Outlook. (2) Check mailbox storage in OWA. (3) Check OST file path for corruption signs. Only then consider profile repair.',
    practiceTask: 'List three questions you would ask a user before opening any Outlook settings. Each question should narrow down offline vs quota vs profile as the cause.',
    linkedScenarioIds: ['outlook-mailbox-not-updating'],
    linkedSkillIds: ['outlook-support', 'm365-licensing'],
    tags: ['outlook', 'M365', 'email', 'sync']
  },
  {
    id: 'onedrive-sync-triage',
    topic: 'OneDrive sync: red icons and what they mean',
    category: 'M365 Support',
    concept: 'OneDrive red status icons have four causes: file path longer than 260 characters, unsupported characters in a filename, a network drop, or an account mismatch. Each cause has a different fix and a different way to confirm resolution.',
    whyItMatters: 'Users often interpret a red icon as "my files are deleted." Identifying the cause quickly and explaining what is actually at risk — usually nothing — reduces the emotional load of the ticket significantly.',
    commonMistake: 'Unlinking and relinking OneDrive before checking file paths. This triggers a full re-sync that can take hours for large libraries and does not fix the root cause.',
    example: 'User sees red icons on a folder synced from SharePoint. Check the path length in Windows Explorer. Rename the parent folder to shorten the path, then confirm sync resumes within 60 seconds.',
    practiceTask: 'Write the "Checks performed" field for a ticket where OneDrive had red icons due to a long file path. Include what you checked, what you found, and what you changed.',
    linkedScenarioIds: ['onedrive-sync-broken'],
    linkedSkillIds: ['onedrive-sync'],
    tags: ['onedrive', 'M365', 'sync', 'files']
  },
  {
    id: 'printer-triage',
    topic: 'Printer not printing: scope first',
    category: 'Endpoint Support',
    concept: 'Printer issues split into three scopes: one user on one device (driver or queue), one user on all devices (account permissions), or all users on one printer (print server or the printer itself). Establishing scope before touching anything saves time and prevents repeat tickets.',
    whyItMatters: 'Reinstalling a driver on one PC when the print server queue is stuck means the fix works for seconds and then fails again. Getting scope right prevents the same ticket arriving twice.',
    commonMistake: 'Starting with "reinstall the printer" when a stuck shared print queue job is blocking everyone.',
    example: 'Three users report printing stopped at once. Check the print server queue, clear the stuck job, and all users can print again. No driver reinstall needed.',
    practiceTask: 'Draft the first three questions you would ask a user reporting a printer issue. Each question should narrow down one of the three scope dimensions.',
    linkedScenarioIds: ['printer-not-printing'],
    linkedSkillIds: ['helpdesk-triage', 'diagnostic-questions'],
    tags: ['printer', 'endpoint', 'triage', 'scope']
  },
  {
    id: 'internet-down-triage',
    topic: 'Internet down: scope before you fix',
    category: 'Networking',
    concept: 'Before touching any network hardware, confirm whether the outage affects one device, one area, or the whole site. This one check prevents incorrect resets and tells you whether the issue is with the ISP, the router, or just a single device.',
    whyItMatters: 'Rebooting the router for a one-device issue interrupts every connected user. Scoping takes 60 seconds and keeps the repair proportionate to the actual fault.',
    commonMistake: 'Rebooting the router or modem as a first step without confirming whether other devices on the same network are also affected.',
    example: 'User reports no internet. Ask: can you check on your phone using the same wifi? If the phone also fails, the router or ISP is the cause. If the phone works, the issue is device-specific — check drivers or IP conflict.',
    practiceTask: 'Write a three-step scope check for an "internet is down" ticket that you could run in under two minutes without rebooting anything.',
    linkedScenarioIds: ['internet-is-down', 'wifi-slow-one-room'],
    linkedSkillIds: ['dns-basics', 'dhcp-basics', 'wifi-troubleshooting'],
    tags: ['networking', 'internet', 'scope', 'triage']
  },
  {
    id: 'dns-vs-dhcp',
    topic: 'DNS vs DHCP: what each one does',
    category: 'Networking',
    concept: 'DHCP assigns an IP address to a device so it can communicate on the network. DNS translates a domain name such as google.com into an IP address so the device knows where to send the request. They fail in different ways and need different diagnostics.',
    whyItMatters: 'Confusing DNS and DHCP means running the wrong diagnostic tool. A DHCP failure means no IP at all — the device shows a 169.x.x.x self-assigned address. A DNS failure means the device has a valid IP but cannot resolve hostnames.',
    commonMistake: 'Running ipconfig /flushdns when the real problem is a DHCP lease expiry, or rebooting the DHCP server when only DNS resolution is failing.',
    example: 'User cannot open google.com but can ping 8.8.8.8 directly — DNS issue. User cannot reach anything and shows 169.x.x.x address — DHCP issue and no lease was obtained.',
    practiceTask: 'Write two short diagnostic steps: one to confirm a DHCP problem and one to confirm a DNS problem. Use command-line tools where relevant.',
    linkedScenarioIds: ['dns-website-failure', 'internet-is-down'],
    linkedSkillIds: ['dns-basics', 'dhcp-basics'],
    tags: ['networking', 'DNS', 'DHCP', 'concepts']
  },
  {
    id: 'backup-failure-response',
    topic: 'Backup failure: what to check and when to escalate',
    category: 'Infrastructure',
    concept: 'A backup failure means the most recent recoverable restore point may be missing. The correct response is: read the error, check repository health and capacity, and escalate with the error details if you cannot resolve it. Never attempt a manual backup run without first checking why the scheduled one failed.',
    whyItMatters: 'A missed escalation on a backup failure can leave a client with no recovery option if a hardware failure or ransomware event follows shortly after.',
    commonMistake: 'Closing the alert after it clears on a retry without confirming the next scheduled backup completed successfully.',
    example: 'Overnight backup fails with a "repository full" error. Check storage capacity, report to the backup owner with the error message and remaining space, and confirm a remediation ticket is opened before closing the alert.',
    practiceTask: 'Write a ticket note for a backup failure escalation. Include the error type, your check, who you escalated to, and the next confirmation step.',
    linkedScenarioIds: ['backup-job-failed'],
    linkedSkillIds: ['backup-monitoring', 'restore-testing', 'rpo-rto'],
    tags: ['backup', 'infrastructure', 'escalation', 'monitoring']
  },
  {
    id: 'phishing-first-response',
    topic: 'Phishing email: first 60 seconds',
    category: 'Cybersecurity',
    concept: 'When a user reports a suspicious email, the first priority is to preserve it before it is deleted, then determine whether any credentials were entered. These two checks determine whether this is a low-risk awareness event or a potential account compromise requiring immediate security escalation.',
    whyItMatters: 'Deleting the email immediately removes evidence needed by the security team. Acting too slowly after credentials are entered means the attacker has more time in the account.',
    commonMistake: 'Telling the user to delete the email immediately. This destroys evidence and prevents the security team from investigating the sending domain or embedded links.',
    example: 'User forwarded a phishing email to IT. Steps: (1) Do not delete it. (2) Ask: did you click any links? Did you enter any credentials? (3) If credentials were entered, escalate immediately for account review and potential password reset.',
    practiceTask: 'Write the first two questions you would ask a user who clicked a suspicious link but says they did not enter their password. Then write a one-sentence ticket note summary for that state.',
    linkedScenarioIds: ['phishing-email'],
    linkedSkillIds: ['phishing-analysis', 'escalation-basics'],
    tags: ['cybersecurity', 'phishing', 'security', 'escalation']
  },
  {
    id: 'intune-compliance-basics',
    topic: 'Intune compliance: why devices go non-compliant',
    category: 'Endpoint Management',
    concept: 'A non-compliant Intune device is blocked by conditional access from accessing company resources. The three most common causes are: OS version below the policy threshold, BitLocker encryption not enabled, or a required security app missing. Each cause has a specific fix — but the fix must be verified in Intune, not only on the device.',
    whyItMatters: 'A non-compliant device is a security enforcement, not a support bug. Bypassing it without understanding why it triggered creates a gap in the security posture and usually a repeat ticket.',
    commonMistake: 'Marking the device compliant manually in Intune without fixing the underlying issue, for example leaving BitLocker still off or the Windows update not yet applied.',
    example: 'User reports they cannot access email on their work laptop. Intune shows non-compliant due to OS version. Fix: force a Windows Update, wait for the Intune device sync (up to 15 minutes), then verify the compliance state in the Intune portal.',
    practiceTask: 'Write a ticket note for a device that was non-compliant because BitLocker was disabled. Include what you checked, what you enabled, and how you confirmed it resolved.',
    linkedScenarioIds: ['intune-compliance-missing'],
    linkedSkillIds: ['intune-compliance', 'intune-enrolment', 'conditional-access'],
    tags: ['intune', 'compliance', 'endpoint', 'security']
  },
  {
    id: 'escalation-timing',
    topic: 'Escalation: when and how to hand off cleanly',
    category: 'Escalation and Professional Judgement',
    concept: 'Escalate when: you have reached the limit of your safe diagnostic steps, the issue affects security or data integrity, the resolution requires access or tools you do not have, or the SLA is about to breach. A clean escalation includes: what you observed, what you tried, what you did not try and why, and what the next technician needs to know.',
    whyItMatters: 'A vague escalation ("user cannot connect, not sure why") restarts the diagnostic process from zero and wastes the escalation team\'s time. A clean escalation gets the user resolved faster.',
    commonMistake: 'Escalating before doing the obvious first checks such as offline mode, wrong password, or a simple reboot — or escalating with no notes, forcing the next technician to re-ask the user everything from the beginning.',
    example: 'After confirming DHCP lease, DNS resolution, and local firewall with no resolution, write in the ticket: "Confirmed DHCP lease valid (192.168.x.x), DNS resolves external addresses, local firewall rules reviewed — no block found. Escalating to L2 networking for further investigation."',
    practiceTask: 'Write the escalation summary for a ticket where a user cannot access a file share and you have confirmed: network is reachable, permissions look correct, and no recent changes were made. What do you include?',
    linkedScenarioIds: ['backup-job-failed', 'internet-is-down', 'phishing-email'],
    linkedSkillIds: ['escalation-basics'],
    tags: ['escalation', 'communication', 'documentation', 'professional']
  },
  {
    id: 'ticket-note-structure',
    topic: 'Ticket note structure: the six fields',
    category: 'Documentation',
    concept: 'A useful ticket note has six parts: Issue (what the symptom is), User impact (what work is blocked), Checks performed (what diagnostics were run), Action taken (what was changed), Result (what happened), Next step (who does what next). Each field serves a different future reader.',
    whyItMatters: 'A note that only says "Fixed Outlook" leaves the next technician with no information if the issue recurs, and leaves the client with no confidence the problem was properly investigated.',
    commonMistake: 'Skipping "Checks performed" because it feels redundant. This is the field that prevents duplicated work and proves due diligence on complex tickets.',
    example: 'Issue: Outlook not syncing. User impact: unable to send customer responses. Checks: verified OWA working, confirmed offline mode off, checked OST file size. Action: cleared cached OST, reconfigured profile. Result: sync restored. Next step: monitor for 24 hours.',
    practiceTask: 'Take the example above and rewrite the "Checks performed" field in your own words, then add a realistic "Escalation reason if applicable" field for a scenario where sync did not return.',
    linkedScenarioIds: [],
    linkedSkillIds: ['kb-writing', 'handover-notes'],
    tags: ['documentation', 'ticket-notes', 'structure', 'communication']
  },
  {
    id: 'new-staff-onboarding-checklist',
    topic: 'New staff onboarding: the L1 handover',
    category: 'Identity and Access',
    concept: 'When onboarding a new user, the L1 role is to confirm each access item is provisioned and tested — not just created. An account that exists but cannot sign in, or a licence assigned but not activated, counts as an incomplete onboarding.',
    whyItMatters: 'An onboarding handover with unchecked items creates a chain of first-day tickets from the new staff member. Each one is avoidable with a five-minute test at handover.',
    commonMistake: 'Marking onboarding complete when all accounts are created without testing sign-in, verifying MFA setup, or confirming shared mailbox access.',
    example: 'New staff member provisioned: Entra account created → M365 licence assigned → MFA registered → Teams sign-in tested → Shared mailbox access confirmed → Intune enrolment verified → Ticket closed with test results noted.',
    practiceTask: 'Write a five-item onboarding checklist for a new staff member joining a company that uses M365, Intune, and a shared mailbox. Focus on what you would test, not just what you would create.',
    linkedScenarioIds: ['new-staff-onboarding'],
    linkedSkillIds: ['joiner-mover-leaver', 'mfa-troubleshooting', 'entra-users-groups', 'intune-enrolment'],
    tags: ['onboarding', 'identity', 'M365', 'access']
  }
];
