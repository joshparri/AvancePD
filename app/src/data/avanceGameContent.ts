export type AvanceGameMode =
  | 'recall-rush'
  | 'ticket-detective'
  | 'flow-drill'
  | 'logic-sprint'
  | 'command-line'
  | 'break-fix';

export type AvanceSkillNodeId =
  | 'helpdesk'
  | 'm365'
  | 'identity'
  | 'network'
  | 'security'
  | 'cloud';

export interface AvanceSkillNode {
  id: AvanceSkillNodeId;
  title: string;
  description: string;
  xpToUnlock: number;
  prerequisite?: AvanceSkillNodeId;
}

export interface AvanceGameChallenge {
  id: string;
  mode: AvanceGameMode;
  skillNode: AvanceSkillNodeId;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  clues?: string[];
  commandHint?: string;
}

export const avanceGameModeMeta: Record<
  AvanceGameMode,
  { label: string; hook: string; inspiredBy: string; description: string }
> = {
  'recall-rush': {
    label: 'Recall Rush',
    hook: 'Active recall & spaced repetition',
    inspiredBy: 'Duolingo',
    description: 'Bite-sized MSP prompts—answer before the concept fades.',
  },
  'ticket-detective': {
    label: 'Ticket Detective',
    hook: 'Contextual deduction from clues',
    inspiredBy: 'GeoGuessr',
    description: 'Read ticket clues and infer the most likely root cause.',
  },
  'flow-drill': {
    label: 'Flow Drill',
    hook: 'Adaptive difficulty in the flow zone',
    inspiredBy: 'Elevate & Khan Academy',
    description: 'Difficulty shifts with your session streak—stay challenged, not overwhelmed.',
  },
  'logic-sprint': {
    label: 'Logic Sprint',
    hook: 'Low-friction 60-second puzzles',
    inspiredBy: 'Coolmath Games',
    description: 'Quick ordering and true/false judgement calls for support logic.',
  },
  'command-line': {
    label: 'Command Line',
    hook: 'Type the right fix (pick the command)',
    inspiredBy: 'CMD Challenge / Terminus',
    description: 'Choose the cmdlet or command that safely moves the ticket forward.',
  },
  'break-fix': {
    label: 'Break-Fix Lab',
    hook: 'Broken system detective work',
    inspiredBy: 'SadServers',
    description: 'A service is failing—pick the safest first check or action.',
  },
};

export const avanceSkillTree: AvanceSkillNode[] = [
  {
    id: 'helpdesk',
    title: 'Helpdesk foundations',
    description: 'Triage, tickets, and safe first questions.',
    xpToUnlock: 0,
  },
  {
    id: 'm365',
    title: 'Microsoft 365',
    description: 'Mail, Teams, and tenant basics.',
    xpToUnlock: 80,
    prerequisite: 'helpdesk',
  },
  {
    id: 'identity',
    title: 'Identity & MFA',
    description: 'Sign-in, tokens, and access recovery.',
    xpToUnlock: 160,
    prerequisite: 'm365',
  },
  {
    id: 'network',
    title: 'Networking',
    description: 'DNS, VPN, Wi-Fi, and connectivity.',
    xpToUnlock: 240,
    prerequisite: 'helpdesk',
  },
  {
    id: 'security',
    title: 'Security judgement',
    description: 'Phishing, escalation, and unsafe shortcuts.',
    xpToUnlock: 320,
    prerequisite: 'identity',
  },
  {
    id: 'cloud',
    title: 'Cloud & automation',
    description: 'Azure basics, scripts, and change risk.',
    xpToUnlock: 400,
    prerequisite: 'network',
  },
];

export const avanceGameChallenges: AvanceGameChallenge[] = [
  // Recall Rush
  {
    id: 'rr-1',
    mode: 'recall-rush',
    skillNode: 'helpdesk',
    difficulty: 'easy',
    xpReward: 10,
    prompt: 'A user says "nothing works" on their laptop. What is the best first question?',
    choices: [
      'Reimage the device immediately',
      'What exactly fails—one app, Wi-Fi, sign-in, or everything?',
      'Reset their password without verifying identity',
      'Remote in and disable antivirus',
    ],
    correctIndex: 1,
    explanation: 'Scope the symptom before touching the environment.',
  },
  {
    id: 'rr-2',
    mode: 'recall-rush',
    skillNode: 'm365',
    difficulty: 'easy',
    xpReward: 10,
    prompt: 'Outlook desktop fails but webmail works. What does that usually narrow down?',
    choices: [
      'Tenant-wide outage',
      'Profile, add-in, or local client issue',
      'DNS root zone misconfiguration',
      'Printer driver conflict',
    ],
    correctIndex: 1,
    explanation: 'Web working implicates the local Outlook stack, not the mailbox service.',
  },
  {
    id: 'rr-3',
    mode: 'recall-rush',
    skillNode: 'identity',
    difficulty: 'medium',
    xpReward: 15,
    prompt: 'After a password reset, the user still cannot sign in. Best next check?',
    choices: [
      'Clear MFA and skip verification',
      'Test sign-in in a browser and review lockout/MFA prompts',
      'Disable the account',
      'Reinstall Office only',
    ],
    correctIndex: 1,
    explanation: 'Confirm account state and MFA before local credential wipes.',
  },
  // Ticket Detective
  {
    id: 'td-1',
    mode: 'ticket-detective',
    skillNode: 'helpdesk',
    difficulty: 'easy',
    xpReward: 12,
    clues: [
      'Ticket: "Printer shows offline on one PC only."',
      'Other users can print to the same queue.',
      'USB cable was swapped yesterday.',
    ],
    prompt: 'Most likely root cause?',
    choices: ['Tenant license expired', 'Local driver/queue on one workstation', 'WAN outage', 'Entra ID sync failure'],
    correctIndex: 1,
    explanation: 'Single-user + single-device points local, not platform-wide.',
  },
  {
    id: 'td-2',
    mode: 'ticket-detective',
    skillNode: 'network',
    difficulty: 'medium',
    xpReward: 15,
    clues: [
      'Ticket: "Cannot reach internal app from VPN."',
      'Split tunneling was enabled last week.',
      'On-site users are fine.',
    ],
    prompt: 'Most likely root cause?',
    choices: [
      'Mailbox full',
      'VPN route or DNS suffix missing for internal subnet',
      'Monitor cable loose',
      'BitLocker recovery key needed',
    ],
    correctIndex: 1,
    explanation: 'VPN-only symptoms often trace to routing or name resolution over the tunnel.',
  },
  {
    id: 'td-3',
    mode: 'ticket-detective',
    skillNode: 'security',
    difficulty: 'hard',
    xpReward: 20,
    clues: [
      'User received MFA prompts they did not start.',
      'Sign-in logs show unfamiliar geography.',
      'Password was reused on a shopping site.',
    ],
    prompt: 'Most likely root cause?',
    choices: [
      'Expired SSL cert on printer',
      'Credential compromise or phishing—treat as security incident',
      'Outlook cache corruption',
      'Wi-Fi channel congestion',
    ],
    correctIndex: 1,
    explanation: 'Unexpected MFA + foreign sign-ins = escalate as identity security.',
  },
  // Flow Drill
  {
    id: 'fd-1',
    mode: 'flow-drill',
    skillNode: 'm365',
    difficulty: 'easy',
    xpReward: 12,
    prompt: 'Shared mailbox replies go out as the user, not the shared address. First safe check?',
    choices: [
      'Grant everyone Global Admin',
      'Verify Send As / Send on Behalf permissions on the shared mailbox',
      'Delete the user profile',
      'Disable MFA tenant-wide',
    ],
    correctIndex: 1,
    explanation: 'Permissions define which From address Exchange will honour.',
  },
  {
    id: 'fd-2',
    mode: 'flow-drill',
    skillNode: 'identity',
    difficulty: 'medium',
    xpReward: 15,
    prompt: 'Conditional Access blocks a compliant device. Best investigation order?',
    choices: [
      'Wipe the device',
      'Review CA sign-in logs, device compliance state, and app in use',
      'Reset all passwords',
      'Open firewall port 25',
    ],
    correctIndex: 1,
    explanation: 'CA decisions are logged—match policy, device state, and app context.',
  },
  // Logic Sprint
  {
    id: 'ls-1',
    mode: 'logic-sprint',
    skillNode: 'helpdesk',
    difficulty: 'easy',
    xpReward: 10,
    prompt: 'Put troubleshooting in the safest order: (pick the best first step)',
    choices: [
      'Reboot → confirm symptom → document',
      'Confirm symptom & scope → safe checks → action → document',
      'Escalate immediately → reboot → close ticket',
      'Install updates → reimage → ask questions',
    ],
    correctIndex: 1,
    explanation: 'Scope and safe checks before disruptive changes.',
  },
  {
    id: 'ls-2',
    mode: 'logic-sprint',
    skillNode: 'network',
    difficulty: 'medium',
    xpReward: 12,
    prompt: 'Wi-Fi connects but no internet. Best first isolation step?',
    choices: [
      'Replace the laptop motherboard',
      'Ping gateway/DNS and test another device on same SSID',
      'Reset Entra password',
      'Disable BitLocker',
    ],
    correctIndex: 1,
    explanation: 'Prove whether the issue is link, DHCP, DNS, or upstream.',
  },
  // Command Line
  {
    id: 'cl-1',
    mode: 'command-line',
    skillNode: 'helpdesk',
    difficulty: 'easy',
    xpReward: 12,
    commandHint: 'Windows: list IP configuration',
    prompt: 'Which command shows IP addresses, DNS servers, and adapters?',
    choices: ['ipconfig /all', 'format c:', 'net user /domain', 'shutdown -r -t 0'],
    correctIndex: 0,
    explanation: 'ipconfig /all is the standard first network snapshot on Windows.',
  },
  {
    id: 'cl-2',
    mode: 'command-line',
    skillNode: 'cloud',
    difficulty: 'medium',
    xpReward: 15,
    commandHint: 'PowerShell: test connectivity to host',
    prompt: 'Quick test if a server responds on the network?',
    choices: ['Test-Connection server01', 'Remove-Item C:\\* -Recurse', 'Stop-Computer -Force', 'Clear-EventLog -LogName *'],
    correctIndex: 0,
    explanation: 'Test-Connection (ping) is a safe reachability check.',
  },
  {
    id: 'cl-3',
    mode: 'command-line',
    skillNode: 'm365',
    difficulty: 'medium',
    xpReward: 15,
    commandHint: 'Exchange Online PowerShell',
    prompt: 'List mailbox permissions for a shared mailbox (conceptual—pick the right cmdlet family)?',
    choices: [
      'Get-MailboxPermission',
      'Get-Process',
      'Get-WmiObject Win32_BIOS',
      'defrag C:',
    ],
    correctIndex: 0,
    explanation: 'Mailbox permission cmdlets reveal Send As / Full Access grants.',
  },
  // Break-Fix
  {
    id: 'bf-1',
    mode: 'break-fix',
    skillNode: 'network',
    difficulty: 'easy',
    xpReward: 12,
    prompt: 'Server: "Users cannot resolve internal hostnames after DC maintenance." Safest first action?',
    choices: [
      'Reboot every workstation',
      'Verify DNS SRV records and client DNS server points to healthy DC',
      'Disable Windows Firewall on DC',
      'Delete AD forest',
    ],
    correctIndex: 1,
    explanation: 'Name resolution failures after DC work usually trace to DNS service or client pointers.',
  },
  {
    id: 'bf-2',
    mode: 'break-fix',
    skillNode: 'm365',
    difficulty: 'medium',
    xpReward: 15,
    prompt: 'Server: "Exchange transport queue growing—mail delayed." First safe check?',
    choices: [
      'Purge all queues without review',
      'Review queue errors, connector status, and recent cert/connector changes',
      'Grant anonymous SMTP',
      'Disable all mailboxes',
    ],
    correctIndex: 1,
    explanation: 'Queue diagnostics reveal whether the block is connector, DNS, or auth related.',
  },
  {
    id: 'bf-3',
    mode: 'break-fix',
    skillNode: 'security',
    difficulty: 'hard',
    xpReward: 20,
    prompt: 'Alert: "Impossible travel sign-in for finance user." Immediate action?',
    choices: [
      'Ignore—probably GPS error',
      'Contain: revoke sessions, force reset, escalate per security runbook',
      'Email the user their password in plain text',
      'Disable logging to reduce noise',
    ],
    correctIndex: 1,
    explanation: 'Treat as potential account compromise until verified.',
  },
  // More recall for variety
  {
    id: 'rr-4',
    mode: 'recall-rush',
    skillNode: 'security',
    difficulty: 'medium',
    xpReward: 15,
    prompt: 'User clicked a phishing link and entered credentials. First step?',
    choices: [
      'Wait for another ticket',
      'Contain account, reset creds, review sign-ins, follow phishing runbook',
      'Tell them to try again tomorrow',
      'Publish password in Teams',
    ],
    correctIndex: 1,
    explanation: 'Speed matters—session revoke and evidence preservation.',
  },
  {
    id: 'fd-3',
    mode: 'flow-drill',
    skillNode: 'cloud',
    difficulty: 'hard',
    xpReward: 18,
    prompt: 'Azure app registration secret expired—apps fail auth. Best fix path?',
    choices: [
      'Delete the tenant',
      'Rotate secret/cert, update app config, test auth flow, document change',
      'Disable MFA for all users',
      'Open RDP to 0.0.0.0/0',
    ],
    correctIndex: 1,
    explanation: 'Controlled rotation with validation beats wide-open workarounds.',
  },
];

export const avanceExternalItPlatforms = [
  {
    id: 'tryhackme',
    name: 'TryHackMe',
    domain: 'Cybersecurity',
    url: 'https://tryhackme.com/',
    mimic: 'GeoGuessr + Khan — explore VMs and find flags with guided paths.',
  },
  {
    id: 'codewars',
    name: 'Codewars',
    domain: 'Coding & algorithms',
    url: 'https://www.codewars.com/',
    mimic: 'Elevate — daily kata ranks from 8kyu upward with instant feedback.',
  },
  {
    id: 'sadservers',
    name: 'SadServers',
    domain: 'DevOps & Linux',
    url: 'https://sadservers.com/',
    mimic: 'SadServers — broken Linux scenarios; fix the crying server.',
  },
  {
    id: 'hackthebox',
    name: 'Hack The Box',
    domain: 'Cybersecurity',
    url: 'https://www.hackthebox.com/',
    mimic: 'Labs with streaks, ranks, and progressive difficulty.',
  },
];
