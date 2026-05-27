export interface BossQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export const bossScenariosByNode: Record<string, BossQuestion[]> = {
  helpdesk: [
    {
      question: 'A user cannot log in after a password reset. What is your safest first action?',
      choices: [
        'Clear MFA without verifying identity',
        'Test sign-in in a browser and check lockout/MFA prompts',
        'Reimage the laptop immediately',
        'Disable the account',
      ],
      correctIndex: 1,
      explanation: 'Confirm account state and MFA before disruptive local changes.',
    },
    {
      question: 'Ticket: "Outlook keeps crashing." What do you collect before touching anything?',
      choices: [
        'Only the serial number',
        'Scope, web vs desktop, recent changes, error text, one user or many',
        'Admin password from the user',
        'Printer model',
      ],
      correctIndex: 1,
      explanation: 'Scope and environment narrow client vs service issues.',
    },
    {
      question: 'User says "nothing works." Best first question?',
      choices: [
        'What exactly fails—one app, Wi-Fi, sign-in, or everything?',
        'When did you last reboot the server room?',
        'Approve all MFA prompts',
        'Ship a new laptop today',
      ],
      correctIndex: 0,
      explanation: 'Symptom scope prevents wrong-layer fixes.',
    },
    {
      question: 'Printer offline for one user only. Likely layer?',
      choices: ['Tenant-wide outage', 'Local queue/driver on that PC', 'DNS root failure', 'Entra sync'],
      correctIndex: 1,
      explanation: 'Single-user printer issues are usually local.',
    },
    {
      question: 'Before escalating, you should always have:',
      choices: [
        'Screenshots of unrelated tickets',
        'Clear symptom, checks done, result, and next step documented',
        'The user’s home address',
        'Global admin credentials',
      ],
      correctIndex: 1,
      explanation: 'Handover-ready notes speed resolution.',
    },
  ],
  m365: [
    {
      question: 'Outlook desktop fails; webmail works. First focus?',
      choices: ['Tenant outage', 'Local Outlook profile/add-in/cache', 'Replace all licenses', 'Firewall port 25'],
      correctIndex: 1,
      explanation: 'Web working points to the local client stack.',
    },
    {
      question: 'Shared mailbox sends as the user. First check?',
      choices: ['Send As / Send on Behalf permissions', 'Delete all mailboxes', 'Disable MFA', 'Reinstall Windows'],
      correctIndex: 0,
      explanation: 'Exchange honours explicit mailbox permissions.',
    },
    {
      question: 'Teams works on web but not desktop app. Safe first step?',
      choices: ['Wipe tenant', 'Sign out/in, check updates, clear Teams cache per runbook', 'Open RDP to DC', 'Reset AD forest'],
      correctIndex: 1,
      explanation: 'Client cache and auth tokens are common culprits.',
    },
    {
      question: 'New hire missing M365 apps. Check first?',
      choices: ['License assignment and group-based licensing', 'Replace monitor', 'Disable Conditional Access globally', 'Printer drivers'],
      correctIndex: 0,
      explanation: 'Licensing and group membership drive app entitlement.',
    },
    {
      question: 'Mail flow delayed—queue growing. First action?',
      choices: ['Purge all queues', 'Review queue errors, connectors, recent cert/connector changes', 'Grant anonymous SMTP', 'Delete all users'],
      correctIndex: 1,
      explanation: 'Queue diagnostics reveal connector vs DNS vs auth blocks.',
    },
  ],
  identity: [
    {
      question: 'Unexpected MFA prompts and foreign sign-ins. Immediate step?',
      choices: ['Ignore as GPS error', 'Contain account, revoke sessions, escalate per security runbook', 'Email password in chat', 'Disable logging'],
      correctIndex: 1,
      explanation: 'Treat as potential compromise until verified.',
    },
    {
      question: 'Conditional Access blocks a compliant device. Investigation order?',
      choices: ['Wipe device', 'CA sign-in logs, device compliance, app in use', 'Reset all passwords', 'Open port 3389 globally'],
      correctIndex: 1,
      explanation: 'Policy decisions are visible in sign-in and compliance logs.',
    },
    {
      question: 'User locked out repeatedly after reset. Check?',
      choices: ['Lockout status, browser sign-in, MFA completion', 'Reimage first', 'Disable account', 'Change tenant region'],
      correctIndex: 0,
      explanation: 'Account state and MFA must be confirmed before cache clears.',
    },
    {
      question: 'When is resetting MFA without approval unsafe?',
      choices: ['Never—always skip verification', 'When identity is not verified or phishing is suspected', 'Always safe on Fridays', 'When user is VIP'],
      correctIndex: 1,
      explanation: 'Identity verification prevents attacker-assisted resets.',
    },
    {
      question: 'Guest access request for external vendor. Best practice?',
      choices: ['Grant Global Admin', 'Time-bound access, sponsor, least privilege, documented approval', 'Share admin password', 'Disable auditing'],
      correctIndex: 1,
      explanation: 'Guests need lifecycle and sponsorship controls.',
    },
  ],
  network: [
    {
      question: 'Wi-Fi connects but no internet. First isolation?',
      choices: ['Replace motherboard', 'Ping gateway/DNS; test another device on same SSID', 'Reset Entra password', 'Disable BitLocker'],
      correctIndex: 1,
      explanation: 'Prove link vs DHCP vs DNS vs upstream.',
    },
    {
      question: 'VPN works but internal app fails. Likely cause?',
      choices: ['Mailbox full', 'Missing VPN route or DNS suffix for internal subnet', 'Monitor cable', 'Outlook add-in'],
      correctIndex: 1,
      explanation: 'Split tunnel and name resolution are common VPN gaps.',
    },
    {
      question: 'Single site cannot resolve internal hostnames after DC work. First check?',
      choices: ['DNS SRV records and client DNS pointing to healthy DC', 'Reboot all PCs', 'Disable firewall on DC', 'Delete AD'],
      correctIndex: 0,
      explanation: 'Post-DC maintenance issues often trace to DNS.',
    },
    {
      question: 'Intermittent packet loss on one switch port. Safe step?',
      choices: ['Replace entire building switch stack', 'Check port errors, cable, duplex, PoE draw', 'Disable spanning tree globally', 'Format servers'],
      correctIndex: 1,
      explanation: 'Physical and port-level stats before wholesale replacement.',
    },
    {
      question: 'Public DNS resolves but internal name fails. Think?',
      choices: ['Internal DNS forwarders or conditional forwarders', 'Printer driver', 'Teams cache', 'Monitor brightness'],
      correctIndex: 0,
      explanation: 'Split-horizon DNS separates public vs internal resolution.',
    },
  ],
  security: [
    {
      question: 'User clicked phishing link and entered credentials. First step?',
      choices: ['Wait', 'Contain account, reset creds, review sign-ins, follow phishing runbook', 'Publish password in Teams', 'Disable AV'],
      correctIndex: 1,
      explanation: 'Speed and session revocation limit blast radius.',
    },
    {
      question: 'Impossible travel alert for finance user. Action?',
      choices: ['Ignore', 'Revoke sessions, force reset, escalate per security policy', 'Email credentials', 'Turn off logs'],
      correctIndex: 1,
      explanation: 'Finance accounts warrant immediate containment.',
    },
    {
      question: 'Ransomware note on one workstation. First step?',
      choices: ['Pay immediately', 'Isolate host from network, preserve evidence, escalate IR', 'Delete all backups', 'Reboot DC'],
      correctIndex: 1,
      explanation: 'Isolation and evidence beat reactive wipes.',
    },
    {
      question: 'User asks to bypass MFA for convenience. Response?',
      choices: ['Approve if manager emails', 'Refuse; follow MFA policy and offer supported alternatives', 'Disable MFA tenant-wide', 'Share break-glass without logging'],
      correctIndex: 1,
      explanation: 'Policy exceptions need formal approval trails.',
    },
    {
      question: 'Suspicious outbound SMTP from mailbox. Check?',
      choices: ['Mailbox rules, forwarding, recent compromise sign-ins', 'Replace keyboard', 'Clear printer queue', 'Update graphics driver'],
      correctIndex: 0,
      explanation: 'Compromised mailboxes often have hidden forward rules.',
    },
  ],
  cloud: [
    {
      question: 'Azure app registration secret expired—apps fail auth. Fix path?',
      choices: ['Delete tenant', 'Rotate secret/cert, update apps, test auth, document change', 'Disable MFA', 'Open 0.0.0.0/0 RDP'],
      correctIndex: 1,
      explanation: 'Controlled rotation with validation beats shortcuts.',
    },
    {
      question: 'Automation runbook failed mid-deploy. First step?',
      choices: ['Re-run blindly', 'Review logs, rollback if needed, fix root cause in dev', 'Delete subscription', 'Disable change control'],
      correctIndex: 1,
      explanation: 'Controlled recovery protects production.',
    },
    {
      question: 'Storage account public exposure flagged. Action?',
      choices: ['Ignore', 'Restrict access, verify no data exfil, audit policies', 'Delete all blobs without review', 'Disable monitoring'],
      correctIndex: 1,
      explanation: 'Exposure alerts need access review and policy hardening.',
    },
    {
      question: 'Script changes DNS in production. Safest approach?',
      choices: ['Run at 5pm Friday without ticket', 'Change window, peer review, rollback plan, test in non-prod', 'Email script to user', 'Disable backups'],
      correctIndex: 1,
      explanation: 'DNS changes need governance and rollback.',
    },
    {
      question: 'Hybrid sync errors after schema change. Check?',
      choices: ['Azure AD Connect sync logs and attribute mismatches', 'Monitor cable', 'Outlook font size', 'Printer DPI'],
      correctIndex: 0,
      explanation: 'Sync errors map to attribute and OU scope issues.',
    },
  ],
};
