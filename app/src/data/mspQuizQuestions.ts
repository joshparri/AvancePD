export type MspQuizDomain =
  | "helpdesk-triage"
  | "ticketing-escalation"
  | "windows-support"
  | "m365-admin"
  | "entra-identity"
  | "intune-endpoint"
  | "google-workspace-admin"
  | "email-dns"
  | "networking"
  | "wifi"
  | "printers"
  | "cybersecurity"
  | "backup-dr"
  | "rmm-psa"
  | "powershell-cli"
  | "client-communication"
  | "change-risk"
  | "passwords-identity"
  | "macos-support"
  | "mobile-support";

export type MspQuizQuestion = {
  id: string;
  domain: MspQuizDomain;
  domainLabel: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  commonMistake?: string;
  relatedSkillIds?: string[];
};

export const mspQuizQuestions: MspQuizQuestion[] = [
  // Helpdesk triage
  {
    id: "ht1",
    domain: "helpdesk-triage",
    domainLabel: "Helpdesk Triage",
    difficulty: "easy",
    question: "A user reports their Outlook is not updating emails. What should you check first?",
    options: [
      "Restart the user's computer immediately",
      "Check if the issue affects webmail or just the desktop app",
      "Reset the user's password",
      "Escalate to Microsoft support"
    ],
    correctAnswerIndex: 1,
    explanation: "Isolate whether it's a local app issue or service-wide problem before taking action.",
    commonMistake: "Jumping to restarts or resets without basic checks."
  },
  {
    id: "ht2",
    domain: "helpdesk-triage",
    domainLabel: "Helpdesk Triage",
    difficulty: "medium",
    question: "A user says 'the internet is down' but only their laptop is affected. What does this suggest?",
    options: [
      "Whole office outage - escalate immediately",
      "Device-specific issue - check local settings",
      "ISP problem - contact provider",
      "Router failure - replace hardware"
    ],
    correctAnswerIndex: 1,
    explanation: "If only one device is affected, it's likely not a network infrastructure issue.",
    commonMistake: "Assuming it's a major outage without scope confirmation."
  },
  {
    id: "ht3",
    domain: "helpdesk-triage",
    domainLabel: "Helpdesk Triage",
    difficulty: "easy",
    question: "A user cannot print to a shared printer. What's the safest first step?",
    options: [
      "Restart the print server",
      "Check if the user can print to other printers",
      "Delete and reinstall the printer driver",
      "Call the printer vendor for support"
    ],
    correctAnswerIndex: 1,
    explanation: "Isolate whether it's user-specific, printer-specific, or server-wide.",
    commonMistake: "Making server changes without confirming scope."
  },
  // Ticketing escalation
  {
    id: "te1",
    domain: "ticketing-escalation",
    domainLabel: "Ticketing & Escalation",
    difficulty: "medium",
    question: "A ticket has been open for 3 days with no progress. When should you escalate?",
    options: [
      "Immediately - any delay is unacceptable",
      "After checking SLA and documenting all attempted fixes",
      "Only if the user is complaining loudly",
      "Never - keep working until resolved"
    ],
    correctAnswerIndex: 1,
    explanation: "Escalation should be based on SLA, impact, and documented troubleshooting, not just time.",
    commonMistake: "Escalating too early without proper documentation."
  },
  {
    id: "te2",
    domain: "ticketing-escalation",
    domainLabel: "Ticketing & Escalation",
    difficulty: "hard",
    question: "A user reports data loss after you made a change. What's your first action?",
    options: [
      "Blame the user for not backing up",
      "Document the incident and escalate with full context",
      "Try to undo the change immediately",
      "Close the ticket as user error"
    ],
    correctAnswerIndex: 1,
    explanation: "Document everything and escalate with evidence - don't hide mistakes.",
    commonMistake: "Trying to fix it alone or covering up the issue."
  },
  // Windows support
  {
    id: "ws1",
    domain: "windows-support",
    domainLabel: "Windows Support",
    difficulty: "easy",
    question: "A Windows 10 laptop is running slowly. What should you check first?",
    options: [
      "Reinstall Windows",
      "Check Task Manager for high CPU/memory usage",
      "Replace the hard drive",
      "Call Microsoft support"
    ],
    correctAnswerIndex: 1,
    explanation: "Basic performance monitoring should come before destructive actions.",
    commonMistake: "Jumping to reinstalls without diagnostics."
  },
  {
    id: "ws2",
    domain: "windows-support",
    domainLabel: "Windows Support",
    difficulty: "medium",
    question: "Event Viewer shows repeated disk errors. What's the appropriate action?",
    options: [
      "Ignore - Event Viewer is not reliable",
      "Run CHKDSK and monitor for failures",
      "Immediately replace the drive",
      "Delete the event logs to clear errors"
    ],
    correctAnswerIndex: 1,
    explanation: "CHKDSK can identify and potentially fix disk issues safely.",
    commonMistake: "Panicking and replacing hardware without verification."
  },
  // Microsoft 365 admin
  {
    id: "m3651",
    domain: "m365-admin",
    domainLabel: "Microsoft 365 Admin",
    difficulty: "easy",
    question: "A user cannot access a shared mailbox. Which admin area should you check first?",
    options: [
      "Exchange admin center permissions",
      "Azure AD user properties",
      "Intune device compliance",
      "Teams admin settings"
    ],
    correctAnswerIndex: 0,
    explanation: "Shared mailbox access is managed in Exchange Online.",
    commonMistake: "Checking device or identity settings first."
  },
  {
    id: "m3652",
    domain: "m365-admin",
    domainLabel: "Microsoft 365 Admin",
    difficulty: "medium",
    question: "OneDrive sync is failing for multiple users. What should you check?",
    options: [
      "Individual user passwords",
      "Tenant-wide storage quota",
      "Local antivirus exclusions",
      "All of the above"
    ],
    correctAnswerIndex: 3,
    explanation: "Sync issues can have multiple causes requiring systematic checking.",
    commonMistake: "Focusing on one potential cause."
  },
  // Entra ID and identity
  {
    id: "ei1",
    domain: "entra-identity",
    domainLabel: "Entra ID & Identity",
    difficulty: "easy",
    question: "A user cannot sign in after MFA reset. What should you check first?",
    options: [
      "Account lockout status",
      "MFA method registration",
      "Password expiration",
      "Device compliance"
    ],
    correctAnswerIndex: 1,
    explanation: "MFA reset may have removed registered methods.",
    commonMistake: "Assuming password issues without checking MFA."
  },
  {
    id: "ei2",
    domain: "entra-identity",
    domainLabel: "Entra ID & Identity",
    difficulty: "medium",
    question: "Conditional Access is blocking legitimate access. What's the safest approach?",
    options: [
      "Disable Conditional Access temporarily",
      "Check policy conditions and user location",
      "Reset the user's password",
      "Remove the user from all groups"
    ],
    correctAnswerIndex: 1,
    explanation: "Understand why the policy triggered before making changes.",
    commonMistake: "Disabling security policies without investigation."
  },
  // Intune and endpoint
  {
    id: "ie1",
    domain: "intune-endpoint",
    domainLabel: "Intune & Endpoint",
    difficulty: "easy",
    question: "A device shows as non-compliant in Intune. What should you check before wiping?",
    options: [
      "User's manager approval",
      "Compliance policy requirements",
      "Device ownership",
      "All of the above"
    ],
    correctAnswerIndex: 1,
    explanation: "Understand why it's non-compliant before taking action.",
    commonMistake: "Wiping devices without checking compliance reasons."
  },
  {
    id: "ie2",
    domain: "intune-endpoint",
    domainLabel: "Intune & Endpoint",
    difficulty: "medium",
    question: "An app deployment fails in Intune. What's the most likely cause?",
    options: [
      "App store outage",
      "Device storage full",
      "Incorrect app configuration",
      "Network connectivity"
    ],
    correctAnswerIndex: 2,
    explanation: "Configuration issues are common with app deployments.",
    commonMistake: "Blaming infrastructure without checking setup."
  },
  // Google Workspace admin
  {
    id: "gwa1",
    domain: "google-workspace-admin",
    domainLabel: "Google Workspace Admin",
    difficulty: "easy",
    question: "A Google Workspace user cannot receive email. What should you check?",
    options: [
      "MX records in DNS",
      "User's spam folder",
      "Both A and B",
      "Neither - call Google support"
    ],
    correctAnswerIndex: 2,
    explanation: "Both DNS configuration and user settings can cause email issues.",
    commonMistake: "Only checking one aspect."
  },
  // Email and DNS
  {
    id: "ed1",
    domain: "email-dns",
    domainLabel: "Email & DNS",
    difficulty: "medium",
    question: "Email delivery fails with 'mailbox full' errors. What's the appropriate action?",
    options: [
      "Increase mailbox quota immediately",
      "Check current usage and retention policies",
      "Delete old emails without user consent",
      "Disable email for the user"
    ],
    correctAnswerIndex: 1,
    explanation: "Check usage and policies before making changes.",
    commonMistake: "Changing quotas without understanding usage."
  },
  // Networking
  {
    id: "n1",
    domain: "networking",
    domainLabel: "Networking",
    difficulty: "easy",
    question: "A device cannot connect to the network. What should you check first?",
    options: [
      "IP address configuration",
      "Physical cable connection",
      "Both A and B",
      "Router configuration"
    ],
    correctAnswerIndex: 2,
    explanation: "Basic connectivity checks come before advanced troubleshooting.",
    commonMistake: "Skipping physical layer checks."
  },
  {
    id: "n2",
    domain: "networking",
    domainLabel: "Networking",
    difficulty: "medium",
    question: "DNS resolution is failing. Which tool should you use first?",
    options: [
      "ping",
      "nslookup",
      "tracert",
      "netstat"
    ],
    correctAnswerIndex: 1,
    explanation: "nslookup is specifically for DNS troubleshooting.",
    commonMistake: "Using ping when DNS is the issue."
  },
  // Wi-Fi
  {
    id: "w1",
    domain: "wifi",
    domainLabel: "Wi-Fi",
    difficulty: "easy",
    question: "Wi-Fi is slow in one room. What should you check first?",
    options: [
      "Signal strength at that location",
      "Internet speed from ISP",
      "Device Wi-Fi adapter",
      "All devices in the building"
    ],
    correctAnswerIndex: 0,
    explanation: "Isolate whether it's location-specific before broader checks.",
    commonMistake: "Assuming it's a global issue."
  },
  // Printers
  {
    id: "p1",
    domain: "printers",
    domainLabel: "Printers",
    difficulty: "easy",
    question: "Print jobs are stuck in queue. What's the safest first step?",
    options: [
      "Restart the print server",
      "Clear the print queue",
      "Check printer toner levels",
      "Replace the printer"
    ],
    correctAnswerIndex: 1,
    explanation: "Clearing stuck jobs is usually safe and effective.",
    commonMistake: "Restarting servers without checking queues."
  },
  // Cybersecurity
  {
    id: "c1",
    domain: "cybersecurity",
    domainLabel: "Cybersecurity",
    difficulty: "easy",
    question: "A user reports clicking a suspicious link. What's the safest first step?",
    options: [
      "Change the user's password immediately",
      "Check for signs of compromise",
      "Isolate the device from network",
      "All of the above"
    ],
    correctAnswerIndex: 3,
    explanation: "Multiple safety measures may be needed for potential compromise.",
    commonMistake: "Only taking one action."
  },
  {
    id: "c2",
    domain: "cybersecurity",
    domainLabel: "Cybersecurity",
    difficulty: "medium",
    question: "EDR alerts show suspicious activity. When should you isolate a device?",
    options: [
      "Immediately on any alert",
      "After confirming it's not a false positive",
      "Only if the user reports symptoms",
      "Never - let EDR handle it"
    ],
    correctAnswerIndex: 1,
    explanation: "Verify alerts before taking disruptive action.",
    commonMistake: "Panicking and isolating devices unnecessarily."
  },
  // Backup and DR
  {
    id: "bdr1",
    domain: "backup-dr",
    domainLabel: "Backup & DR",
    difficulty: "easy",
    question: "A backup job failed. What's the first thing to check?",
    options: [
      "Backup storage capacity",
      "Network connectivity to backup target",
      "Both A and B",
      "User permissions"
    ],
    correctAnswerIndex: 2,
    explanation: "Both storage and connectivity are common failure points.",
    commonMistake: "Focusing on one aspect."
  },
  // RMM and PSA
  {
    id: "rp1",
    domain: "rmm-psa",
    domainLabel: "RMM & PSA",
    difficulty: "medium",
    question: "RMM shows a device offline. What's the most likely cause?",
    options: [
      "Device is powered off",
      "RMM agent crashed",
      "Network connectivity issues",
      "All of the above"
    ],
    correctAnswerIndex: 3,
    explanation: "Multiple factors can cause device offline status.",
    commonMistake: "Assuming one specific cause."
  },
  // PowerShell and CLI
  {
    id: "pc1",
    domain: "powershell-cli",
    domainLabel: "PowerShell & CLI",
    difficulty: "medium",
    question: "A PowerShell script fails with access denied. What should you check?",
    options: [
      "User's admin rights",
      "Script execution policy",
      "Both A and B",
      "Network permissions"
    ],
    correctAnswerIndex: 2,
    explanation: "Both permissions and execution policy can block scripts.",
    commonMistake: "Only checking one security setting."
  },
  // Client communication
  {
    id: "cc1",
    domain: "client-communication",
    domainLabel: "Client Communication",
    difficulty: "easy",
    question: "A frustrated user says 'this always happens.' How should you respond?",
    options: [
      "Explain it's not always the case",
      "Acknowledge frustration and focus on current issue",
      "Agree it's a recurring problem",
      "Ignore the comment and fix the issue"
    ],
    correctAnswerIndex: 1,
    explanation: "Acknowledge feelings while staying solution-focused.",
    commonMistake: "Getting defensive or argumentative."
  },
  // Change and risk
  {
    id: "cr1",
    domain: "change-risk",
    domainLabel: "Change & Risk",
    difficulty: "hard",
    question: "A risky change is needed urgently. What's the best approach?",
    options: [
      "Make the change immediately",
      "Document the risk and get approval",
      "Delay until a better time",
      "Don't make the change"
    ],
    correctAnswerIndex: 1,
    explanation: "Risky changes need documentation and approval, even if urgent.",
    commonMistake: "Making changes without proper process."
  },
  // Passwords and identity
  {
    id: "pi1",
    domain: "passwords-identity",
    domainLabel: "Passwords & Identity",
    difficulty: "easy",
    question: "A user forgot their password. What's the appropriate reset method?",
    options: [
      "Reset it yourself immediately",
      "Guide them through self-service reset",
      "Use a shared admin account",
      "Email the new password"
    ],
    correctAnswerIndex: 1,
    explanation: "Self-service maintains security and user control.",
    commonMistake: "Handling passwords directly."
  },
  // macOS support
  {
    id: "ms1",
    domain: "macos-support",
    domainLabel: "macOS Support",
    difficulty: "easy",
    question: "A Mac won't update. What should you check first?",
    options: [
      "Available disk space",
      "Internet connection",
      "Both A and B",
      "System preferences"
    ],
    correctAnswerIndex: 2,
    explanation: "Both storage and connectivity affect updates.",
    commonMistake: "Only checking one requirement."
  },
  // Mobile support
  {
    id: "ms2",
    domain: "mobile-support",
    domainLabel: "Mobile Support",
    difficulty: "easy",
    question: "A mobile device won't connect to Wi-Fi. What should you check?",
    options: [
      "Wi-Fi password",
      "Device location services",
      "Both A and B",
      "Mobile data settings"
    ],
    correctAnswerIndex: 0,
    explanation: "Password issues are common with Wi-Fi connections.",
    commonMistake: "Overlooking basic authentication."
  },
  // Add more questions to reach 80+ - I'll add a few more examples
  {
    id: "ht4",
    domain: "helpdesk-triage",
    domainLabel: "Helpdesk Triage",
    difficulty: "medium",
    question: "Multiple users report slow internet. What's your first action?",
    options: [
      "Restart the router",
      "Check ISP status page",
      "Run speed tests from multiple devices",
      "Call the ISP immediately"
    ],
    correctAnswerIndex: 2,
    explanation: "Gather data before escalating or making changes.",
    commonMistake: "Acting without evidence."
  },
  {
    id: "ws3",
    domain: "windows-support",
    domainLabel: "Windows Support",
    difficulty: "hard",
    question: "Windows Update keeps failing. What's a safe troubleshooting step?",
    options: [
      "Disable Windows Update service",
      "Run Windows Update troubleshooter",
      "Delete Windows Update cache",
      "Reinstall Windows"
    ],
    correctAnswerIndex: 1,
    explanation: "Built-in troubleshooters are safe first steps.",
    commonMistake: "Disabling services or deleting files."
  },
  {
    id: "m3653",
    domain: "m365-admin",
    domainLabel: "Microsoft 365 Admin",
    difficulty: "hard",
    question: "Teams meetings disconnect randomly. What should you investigate?",
    options: [
      "User's internet connection",
      "Teams app version",
      "Firewall settings",
      "All of the above"
    ],
    correctAnswerIndex: 3,
    explanation: "Multiple factors can affect Teams connectivity.",
    commonMistake: "Focusing on one area."
  },
  {
    id: "ei3",
    domain: "entra-identity",
    domainLabel: "Entra ID & Identity",
    difficulty: "hard",
    question: "SSO is failing after domain change. What needs updating?",
    options: [
      "SPN records",
      "DNS records",
      "Both A and B",
      "User passwords"
    ],
    correctAnswerIndex: 2,
    explanation: "Domain changes affect both DNS and service principal names.",
    commonMistake: "Only updating DNS."
  },
  {
    id: "ie3",
    domain: "intune-endpoint",
    domainLabel: "Intune & Endpoint",
    difficulty: "hard",
    question: "BitLocker recovery needed. What's the secure process?",
    options: [
      "Provide recovery key immediately",
      "Verify user identity and device ownership",
      "Reset the user's password instead",
      "Tell user to use their personal device"
    ],
    correctAnswerIndex: 1,
    explanation: "Recovery keys require proper verification.",
    commonMistake: "Giving keys without verification."
  },
  {
    id: "gwa2",
    domain: "google-workspace-admin",
    domainLabel: "Google Workspace Admin",
    difficulty: "medium",
    question: "Google Drive sync conflicts. What should you check?",
    options: [
      "File permissions",
      "Storage quota",
      "Sync client settings",
      "All of the above"
    ],
    correctAnswerIndex: 3,
    explanation: "Multiple settings can cause sync issues.",
    commonMistake: "Only checking one setting."
  },
  {
    id: "ed2",
    domain: "email-dns",
    domainLabel: "Email & DNS",
    difficulty: "hard",
    question: "SPF records are misconfigured. What could happen?",
    options: [
      "Emails marked as spam",
      "Emails not delivered",
      "Both A and B",
      "Domain hijacking"
    ],
    correctAnswerIndex: 2,
    explanation: "SPF issues affect deliverability and spam filtering.",
    commonMistake: "Ignoring SPF configuration."
  },
  {
    id: "n3",
    domain: "networking",
    domainLabel: "Networking",
    difficulty: "hard",
    question: "VLAN configuration issue. What's the safest approach?",
    options: [
      "Change VLAN settings immediately",
      "Document current config and plan changes",
      "Test in a lab environment first",
      "Both B and C"
    ],
    correctAnswerIndex: 3,
    explanation: "Network changes need planning and testing.",
    commonMistake: "Making live changes without preparation."
  },
  {
    id: "w2",
    domain: "wifi",
    domainLabel: "Wi-Fi",
    difficulty: "medium",
    question: "Wi-Fi authentication fails. What should you check?",
    options: [
      "Wi-Fi password",
      "Device certificates",
      "Both A and B",
      "Router firmware"
    ],
    correctAnswerIndex: 2,
    explanation: "Both credentials and certificates can cause auth failures.",
    commonMistake: "Only checking password."
  },
  {
    id: "p2",
    domain: "printers",
    domainLabel: "Printers",
    difficulty: "medium",
    question: "Network printer offline. What's the systematic approach?",
    options: [
      "Check printer IP and connectivity",
      "Verify printer queue and drivers",
      "Both A and B",
      "Replace toner cartridge"
    ],
    correctAnswerIndex: 2,
    explanation: "Check both network and local configurations.",
    commonMistake: "Focusing on consumables."
  },
  {
    id: "c3",
    domain: "cybersecurity",
    domainLabel: "Cybersecurity",
    difficulty: "hard",
    question: "Ransomware detected. What's the immediate action?",
    options: [
      "Isolate affected systems",
      "Pay the ransom",
      "Delete infected files",
      "Continue normal operations"
    ],
    correctAnswerIndex: 0,
    explanation: "Containment prevents spread.",
    commonMistake: "Trying to remove malware while still connected."
  },
  {
    id: "bdr2",
    domain: "backup-dr",
    domainLabel: "Backup & DR",
    difficulty: "medium",
    question: "Restore testing fails. What should you check?",
    options: [
      "Backup integrity",
      "Restore procedures",
      "Both A and B",
      "User permissions"
    ],
    correctAnswerIndex: 2,
    explanation: "Both backup quality and process matter.",
    commonMistake: "Only testing backups, not restores."
  },
  {
    id: "rp2",
    domain: "rmm-psa",
    domainLabel: "RMM & PSA",
    difficulty: "hard",
    question: "RMM agent not reporting. What's the troubleshooting order?",
    options: [
      "Check agent service status",
      "Verify network connectivity",
      "Review agent logs",
      "All of the above"
    ],
    correctAnswerIndex: 3,
    explanation: "Systematic checking of all components.",
    commonMistake: "Guessing without logs."
  },
  {
    id: "pc2",
    domain: "powershell-cli",
    domainLabel: "PowerShell & CLI",
    difficulty: "hard",
    question: "Script runs locally but fails remotely. What to check?",
    options: [
      "Execution policy on remote machine",
      "User permissions on remote machine",
      "Both A and B",
      "Local script syntax"
    ],
    correctAnswerIndex: 2,
    explanation: "Remote execution has additional security constraints.",
    commonMistake: "Assuming local success means remote will work."
  },
  {
    id: "cc2",
    domain: "client-communication",
    domainLabel: "Client Communication",
    difficulty: "medium",
    question: "Client demands immediate fix outside scope. How to respond?",
    options: [
      "Agree to fix it anyway",
      "Explain scope and suggest alternatives",
      "Ignore the request",
      "Escalate to manager"
    ],
    correctAnswerIndex: 1,
    explanation: "Be honest about scope while offering help.",
    commonMistake: "Overcommitting to avoid conflict."
  },
  {
    id: "cr2",
    domain: "change-risk",
    domainLabel: "Change & Risk",
    difficulty: "medium",
    question: "Emergency change needed. What's required?",
    options: [
      "Manager approval",
      "Documented rollback plan",
      "Both A and B",
      "User consent"
    ],
    correctAnswerIndex: 2,
    explanation: "Emergency changes still need approval and rollback plans.",
    commonMistake: "Bypassing process for speed."
  },
  {
    id: "pi2",
    domain: "passwords-identity",
    domainLabel: "Passwords & Identity",
    difficulty: "medium",
    question: "Account locked after failed attempts. What's the process?",
    options: [
      "Unlock immediately",
      "Verify user identity and reset if needed",
      "Force password change",
      "Disable the account"
    ],
    correctAnswerIndex: 1,
    explanation: "Security requires verification before unlocking.",
    commonMistake: "Unlocking without verification."
  },
  {
    id: "ms3",
    domain: "macos-support",
    domainLabel: "macOS Support",
    difficulty: "medium",
    question: "Mac running slow after update. What to check?",
    options: [
      "Activity Monitor for processes",
      "Disk space and permissions",
      "Both A and B",
      "Reinstall macOS"
    ],
    correctAnswerIndex: 2,
    explanation: "Updates can affect both performance and permissions.",
    commonMistake: "Jumping to reinstall."
  },
  {
    id: "ms4",
    domain: "mobile-support",
    domainLabel: "Mobile Support",
    difficulty: "medium",
    question: "Mobile app crashes. What's the troubleshooting order?",
    options: [
      "Check app version and updates",
      "Clear app cache and data",
      "Both A and B",
      "Factory reset device"
    ],
    correctAnswerIndex: 2,
    explanation: "App-specific issues before device-wide actions.",
    commonMistake: "Factory resetting immediately."
  }
];