export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'All';
export type QuizType = 'multiple-choice' | 'true-false' | 'best-first-question' | 'spot-unsafe-action' | 'escalation-decision' | 'ticket-note-quality';

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  category: string;
  difficulty: QuizDifficulty;
  type: QuizType;
  question: string;
  options?: QuizOption[];
  correctOptionId?: string;
  correctAnswer?: string;
  explanation: string;
  whyTheWrongAnswersAreWrong?: string;
  linkedSkillIds: string[];
  linkedMicroCardIds: string[];
  linkedScenarioIds: string[];
};

const mspQuizQuestions: QuizQuestion[] = [
  // MFA troubleshooting
  {
    id: 'mfa-001',
    category: 'MFA troubleshooting',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: 'A user cannot receive MFA codes on their phone. What is the FIRST thing you should check?',
    options: [
      { id: 'a', text: 'Reset the user password' },
      { id: 'b', text: 'Check if the user phone has signal' },
      { id: 'c', text: 'Disable MFA for the user account' },
      { id: 'd', text: 'Recreate the user account' }
    ],
    correctOptionId: 'b',
    explanation: 'Always check basic connectivity first. No network connection means no MFA codes can be received.',
    whyTheWrongAnswersAreWrong: 'Password reset does not affect MFA delivery. Disabling MFA reduces security. Recreating accounts is excessive.',
    linkedSkillIds: ['diagnostic-questions', 'mfa-management'],
    linkedMicroCardIds: ['mfa-basics', 'troubleshooting-first-steps'],
    linkedScenarioIds: ['mfa-fail']
  },
  {
    id: 'mfa-002',
    category: 'MFA troubleshooting',
    difficulty: 'medium',
    type: 'true-false',
    question: 'If a user authenticator app shows codes but they do not work, the issue is always time sync.',
    correctAnswer: 'False',
    explanation: 'While time sync is a common cause, it could also be app configuration, account issues, or app-specific problems.',
    whyTheWrongAnswersAreWrong: 'Assuming it is always time sync may lead to missing other root causes like app misconfiguration.',
    linkedSkillIds: ['mfa-management', 'diagnostic-questions'],
    linkedMicroCardIds: ['mfa-time-sync', 'authenticator-apps'],
    linkedScenarioIds: ['mfa-fail']
  },
  {
    id: 'mfa-003',
    category: 'MFA troubleshooting',
    difficulty: 'hard',
    type: 'spot-unsafe-action',
    question: 'Which action is UNSAFE when troubleshooting MFA issues?',
    options: [
      { id: 'a', text: 'Generate backup codes for the user' },
      { id: 'b', text: 'Ask the user to verify their identity through video call' },
      { id: 'c', text: 'Temporarily disable MFA to test if it works' },
      { id: 'd', text: 'Check the user account for MFA method conflicts' }
    ],
    correctOptionId: 'c',
    explanation: 'Never disable security controls temporarily for testing - this creates vulnerabilities.',
    whyTheWrongAnswersAreWrong: 'Backup codes should be a valid recovery method, not a troubleshooting step. Video verification is appropriate. Method conflicts should be checked, not disabled.',
    linkedSkillIds: ['security-awareness', 'mfa-management'],
    linkedMicroCardIds: ['security-principles', 'mfa-recovery'],
    linkedScenarioIds: ['mfa-fail']
  },

  // Outlook sync
  {
    id: 'outlook-001',
    category: 'Outlook sync',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: 'Outlook desktop is not syncing with the user mailbox. What is the most common cause?',
    options: [
      { id: 'a', text: 'The user computer is offline' },
      { id: 'b', text: 'Exchange server is down' },
      { id: 'c', text: 'Outlook is in Offline Mode' },
      { id: 'd', text: 'User mailbox is full' }
    ],
    correctOptionId: 'c',
    explanation: 'Outlook Offline Mode button is frequently clicked accidentally and prevents syncing.',
    whyTheWrongAnswersAreWrong: 'Computer offline would affect all network access. Exchange issues would affect all users. Mailbox full prevents sending, not syncing.',
    linkedSkillIds: ['outlook-troubleshooting', 'diagnostic-questions'],
    linkedMicroCardIds: ['outlook-sync-basics', 'outlook-offline-mode'],
    linkedScenarioIds: ['outlook-sync-issue']
  },
  {
    id: 'outlook-002',
    category: 'Outlook sync',
    difficulty: 'medium',
    type: 'best-first-question',
    question: 'A user reports "Outlook is not showing new emails." What is your BEST first diagnostic question?',
    options: [
      { id: 'a', text: 'When did you last see new emails?' },
      { id: 'b', text: 'Are you connected to the internet?' },
      { id: 'c', text: 'What version of Outlook are you using?' },
      { id: 'd', text: 'Have you tried restarting Outlook?' }
    ],
    correctOptionId: 'a',
    explanation: 'Understanding the timeline helps determine if it is a recent issue or ongoing problem, guiding your troubleshooting path.',
    whyTheWrongAnswersAreWrong: 'Internet connectivity is important but secondary to understanding the scope. Version info comes later. Restarting is a troubleshooting step, not a diagnostic question.',
    linkedSkillIds: ['diagnostic-questions', 'outlook-troubleshooting'],
    linkedMicroCardIds: ['diagnostic-questioning', 'outlook-sync-basics'],
    linkedScenarioIds: ['outlook-sync-issue']
  },

  // OneDrive sync
  {
    id: 'onedrive-001',
    category: 'OneDrive sync',
    difficulty: 'easy',
    type: 'true-false',
    question: 'If OneDrive shows a red X, it means the user has exceeded their storage limit.',
    correctAnswer: 'False',
    explanation: 'Red X indicates sync errors or connection issues. Yellow triangle indicates storage limits.',
    whyTheWrongAnswersAreWrong: 'Storage limits show different icons. Red X is for sync/connection problems, not storage.',
    linkedSkillIds: ['onedrive-troubleshooting', 'file-sync'],
    linkedMicroCardIds: ['onedrive-status-icons', 'sync-troubleshooting'],
    linkedScenarioIds: ['onedrive-sync-fail']
  },
  {
    id: 'onedrive-002',
    category: 'OneDrive sync',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: 'A user has "conflicting copies" in OneDrive. What is the BEST solution?',
    options: [
      { id: 'a', text: 'Delete all conflicting copies except the newest' },
      { id: 'b', text: 'Have the user choose which version to keep' },
      { id: 'c', text: 'Merge the files manually' },
      { id: 'd', text: 'Restore from backup' }
    ],
    correctOptionId: 'b',
    explanation: 'The user must decide which version contains their correct work. IT cannot make content decisions.',
    whyTheWrongAnswersAreWrong: 'IT should not delete user content without permission. Manual merging may create more conflicts. Restore may lose recent work.',
    linkedSkillIds: ['file-conflict-resolution', 'user-communication'],
    linkedMicroCardIds: ['onedrive-conflicts', 'file-versioning'],
    linkedScenarioIds: ['onedrive-sync-fail']
  },

  // Printer triage
  {
    id: 'printer-001',
    category: 'printer triage',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: 'A user says "the printer is not working." What is your FIRST question?',
    options: [
      { id: 'a', text: 'What error message are you seeing?' },
      { id: 'b', text: 'Is the printer turned on?' },
      { id: 'c', text: 'Can you print from another application?' },
      { id: 'd', text: 'When was the last time it worked?' }
    ],
    correctOptionId: 'b',
    explanation: 'Always start with the basics - power is the most fundamental requirement.',
    whyTheWrongAnswersAreWrong: 'Error messages come after basic checks. Testing other applications comes later. Last worked time helps understand scope.',
    linkedSkillIds: ['printer-triage', 'diagnostic-questions'],
    linkedMicroCardIds: ['printer-basics', 'troubleshooting-first-steps'],
    linkedScenarioIds: ['printer-down']
  },
  {
    id: 'printer-002',
    category: 'printer triage',
    difficulty: 'medium',
    type: 'spot-unsafe-action',
    question: 'Which action is UNSAFE when troubleshooting printer issues?',
    options: [
      { id: 'a', text: 'Ask the user to unplug the printer while it is printing' },
      { id: 'b', text: 'Tell the user to restart their computer' },
      { id: 'c', text: 'Access the printer web interface remotely' },
      { id: 'd', text: 'Tell the user to open the printer and remove jammed paper' }
    ],
    correctOptionId: 'c',
    explanation: 'Never tell users to unplug devices while they are actively processing. This can cause hardware damage.',
    whyTheWrongAnswersAreWrong: 'Computer restart is a troubleshooting step, not an immediate action. Remote access is appropriate. Opening printers can be dangerous if they are actively printing.',
    linkedSkillIds: ['printer-safety', 'hardware-troubleshooting'],
    linkedMicroCardIds: ['printer-safety', 'hardware-basics'],
    linkedScenarioIds: ['printer-down']
  },

  // Internet down triage
  {
    id: 'internet-001',
    category: 'internet down triage',
    difficulty: 'easy',
    type: 'true-false',
    question: 'If a user cannot access any websites, the issue is always their computer.',
    correctAnswer: 'False',
    explanation: 'Could be computer, network, router, DNS, or ISP issues. Need to isolate the scope.',
    whyTheWrongAnswersAreWrong: 'Assuming it is always the computer may lead to missing network-wide outages or infrastructure problems.',
    linkedSkillIds: ['network-triage', 'diagnostic-questions'],
    linkedMicroCardIds: ['internet-troubleshooting', 'network-basics'],
    linkedScenarioIds: ['internet-outage']
  },
  {
    id: 'internet-002',
    category: 'internet down triage',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: 'A single user reports no internet access. Others are fine. What is your BEST first step?',
    options: [
      { id: 'a', text: 'Restart the office router' },
      { id: 'b', text: 'Check if the user can access internal resources' },
      { id: 'c', text: 'Test with a different website' },
      { id: 'd', text: 'Check the user network cable' }
    ],
    correctOptionId: 'b',
    explanation: 'Testing internal access helps determine if it is a local machine issue or external connectivity problem.',
    whyTheWrongAnswersAreWrong: 'Router restart affects everyone. Testing different websites comes later. Network cable check comes after isolation.',
    linkedSkillIds: ['network-triage', 'diagnostic-questions'],
    linkedMicroCardIds: ['network-isolation', 'troubleshooting-methodology'],
    linkedScenarioIds: ['internet-outage']
  },

  // DNS vs DHCP
  {
    id: 'dns-001',
    category: 'DNS vs DHCP',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: 'A user can ping 8.8.8.8 but cannot google.com. What is the issue?',
    options: [
      { id: 'a', text: 'DHCP is not working' },
      { id: 'b', text: 'The internet connection is down' },
      { id: 'c', text: 'The user firewall is blocking web access' },
      { id: 'd', text: 'Google DNS servers are down' }
    ],
    correctOptionId: 'b',
    explanation: 'IP connectivity works but name resolution fails. This is a classic DNS issue.',
    whyTheWrongAnswersAreWrong: 'DHCP provides IP addresses, not name resolution. Internet down would affect IP access too. Firewall issues would block both IP and domain access. Google DNS being down would affect many users.',
    linkedSkillIds: ['dns-troubleshooting', 'network-fundamentals'],
    linkedMicroCardIds: ['dns-vs-dhcp', 'network-troubleshooting'],
    linkedScenarioIds: ['dns-resolution-fail']
  },
  {
    id: 'dns-002',
    category: 'DNS vs DHCP',
    difficulty: 'hard',
    type: 'true-false',
    question: 'DHCP and DNS are the same service - they both assign IP addresses.',
    correctAnswer: 'False',
    explanation: 'DHCP assigns IP addresses. DNS resolves domain names to IP addresses. They are different services.',
    whyTheWrongAnswersAreWrong: 'Confusing these services leads to incorrect troubleshooting approaches and wasted time.',
    linkedSkillIds: ['network-fundamentals', 'network-services'],
    linkedMicroCardIds: ['dns-vs-dhcp', 'network-basics'],
    linkedScenarioIds: ['dns-resolution-fail']
  },

  // Backup failure
  {
    id: 'backup-001',
    category: 'backup failure',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: 'What is the most common cause of backup failures?',
    options: [
      { id: 'a', text: 'Network connectivity issues' },
      { id: 'b', text: 'Insufficient storage space' },
      { id: 'c', text: 'Backup software corruption' },
      { id: 'd', text: 'User interference' }
    ],
    correctOptionId: 'b',
    explanation: 'Insufficient storage space is the most frequent cause of backup failures across all systems.',
    whyTheWrongAnswersAreWrong: 'Network issues are common but less frequent than storage. Software corruption is rare. User interference is uncommon but possible.',
    linkedSkillIds: ['backup-troubleshooting', 'storage-management'],
    linkedMicroCardIds: ['backup-failures', 'storage-monitoring'],
    linkedScenarioIds: ['backup-failure']
  },

  // Phishing first response
  {
    id: 'phishing-001',
    category: 'phishing first response',
    difficulty: 'easy',
    type: 'spot-unsafe-action',
    question: 'A user forwards you a suspicious email. What is the UNSAFE action?',
    options: [
      { id: 'a', text: 'Click the links in the email to test if they are malicious' },
      { id: 'b', text: 'Forward the email to the security team' },
      { id: 'c', text: 'Reply to the sender asking for verification' },
      { id: 'd', text: 'Delete the email without investigation' }
    ],
    correctOptionId: 'a',
    explanation: 'Never click suspicious links - this can trigger malware downloads or validate your email to attackers.',
    whyTheWrongAnswersAreWrong: 'Forwarding to security is correct procedure. Replying to sender may not help investigation. Deleting evidence is problematic. Verification requests are appropriate but should be done carefully.',
    linkedSkillIds: ['security-awareness', 'phishing-response'],
    linkedMicroCardIds: ['phishing-safety', 'email-security'],
    linkedScenarioIds: ['phishing-report']
  },
  {
    id: 'phishing-002',
    category: 'phishing first response',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: 'A user clicked a phishing link and entered credentials. What is your FIRST priority?',
    options: [
      { id: 'a', text: 'Educate the user about phishing' },
      { id: 'b', text: 'Force the user to change their password' },
      { id: 'c', text: 'Scan their computer for malware' },
      { id: 'd', text: 'Report the incident to management' }
    ],
    correctOptionId: 'b',
    explanation: 'Immediate password change prevents account takeover. This is the highest security priority.',
    whyTheWrongAnswersAreWrong: 'Education is important but not urgent. Malware scan comes after password change. Management reporting is necessary but not immediate.',
    linkedSkillIds: ['incident-response', 'account-security'],
    linkedMicroCardIds: ['phishing-response', 'account-compromise'],
    linkedScenarioIds: ['phishing-report']
  },

  // Intune compliance
  {
    id: 'intune-001',
    category: 'Intune compliance',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: 'A user device shows non-compliant in Intune. What should you do first?',
    options: [
      { id: 'a', text: 'Contact the user to explain the issue' },
      { id: 'b', text: 'Check if the device needs updates' },
      { id: 'c', text: 'Create a compliance exception' },
      { id: 'd', text: 'Wipe the device' }
    ],
    correctOptionId: 'a',
    explanation: 'Always communicate with users first to understand the compliance issue and provide guidance.',
    whyTheWrongAnswersAreWrong: 'Updates may not resolve the underlying issue. Exceptions should be documented. Wiping devices is excessive and may not be necessary.',
    linkedSkillIds: ['intune-management', 'user-communication'],
    linkedMicroCardIds: ['intune-compliance', 'mdm-basics'],
    linkedScenarioIds: ['intune-noncompliant']
  },

  // Escalation judgement
  {
    id: 'escalation-001',
    category: 'escalation judgement',
    difficulty: 'medium',
    type: 'escalation-decision',
    question: 'A user reports their computer is running very slow. When should you escalate to senior tech?',
    options: [
      { id: 'a', text: 'Immediately - this affects productivity' },
      { id: 'b', text: 'After trying basic troubleshooting' },
      { id: 'c', text: 'When the user gets frustrated' },
      { id: 'd', text: 'Never - handle all issues at your level' }
    ],
    correctOptionId: 'b',
    explanation: 'Always try basic troubleshooting first. Escalate when common fixes do not work or when user frustration impacts productivity.',
    whyTheWrongAnswersAreWrong: 'Immediate escalation wastes senior resources. User frustration is not a technical trigger. Never escalating may miss complex issues that need expertise.',
    linkedSkillIds: ['escalation-judgement', 'performance-troubleshooting'],
    linkedMicroCardIds: ['escalation-guidelines', 'troubleshooting-methodology'],
    linkedScenarioIds: ['slow-computer']
  },
  {
    id: 'escalation-002',
    category: 'escalation judgement',
    difficulty: 'hard',
    type: 'escalation-decision',
    question: 'Multiple users report the same issue simultaneously. When should you IMMEDIATELY escalate?',
    options: [
      { id: 'a', text: 'When a single user is affected' },
      { id: 'b', text: 'When the issue affects critical business functions' },
      { id: 'c', text: 'When the issue involves security or data loss' },
      { id: 'd', text: 'When management asks for an update' }
    ],
    correctOptionId: 'c',
    explanation: 'Security issues and critical business impact require immediate escalation to management awareness.',
    whyTheWrongAnswersAreWrong: 'Single user issues can often be handled at first level. Critical business functions require immediate attention. Security issues cannot wait for management requests.',
    linkedSkillIds: ['escalation-judgement', 'incident-management'],
    linkedMicroCardIds: ['escalation-triggers', 'security-ethics'],
    linkedScenarioIds: ['system-outage']
  },

  // Ticket notes
  {
    id: 'ticket-001',
    category: 'ticket notes',
    difficulty: 'easy',
    type: 'ticket-note-quality',
    question: 'What is the MOST important element of a good ticket note?',
    options: [
      { id: 'a', text: 'Including the resolution' },
      { id: 'b', text: 'Writing clear technical details' },
      { id: 'c', text: 'Documenting steps taken' },
      { id: 'd', text: 'Adding timestamps' }
    ],
    correctOptionId: 'b',
    explanation: 'Clear technical details help other technicians understand what was tried and what worked.',
    whyTheWrongAnswersAreWrong: 'Resolution is important but secondary to understanding the process. Technical details without steps are not useful. Documentation without timestamps makes it hard to follow the issue timeline.',
    linkedSkillIds: ['ticket-documentation', 'knowledge-sharing'],
    linkedMicroCardIds: ['ticket-note-quality', 'documentation-basics'],
    linkedScenarioIds: ['ticket-documentation']
  },

  // Communication and user updates
  {
    id: 'comm-001',
    category: 'communication and user updates',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: 'A system outage will last 2 hours. What is the BEST communication approach?',
    options: [
      { id: 'a', text: 'Wait until it is fixed to report' },
      { id: 'b', text: 'Send initial notification immediately' },
      { id: 'c', text: 'Provide updates every 30 minutes' },
      { id: 'd', text: 'Tell users to check status page for updates' }
    ],
    correctOptionId: 'b',
    explanation: 'Immediate notification manages expectations and reduces support calls. Regular updates keep users informed.',
    whyTheWrongAnswersAreWrong: 'Waiting may increase anxiety and calls. 30-minute updates may be too frequent. Status pages should be proactively monitored.',
    linkedSkillIds: ['communication-skills', 'outage-communication'],
    linkedMicroCardIds: ['outage-communication', 'user-updates'],
    linkedScenarioIds: ['system-outage']
  },

  // RMM/PSA workflows
  {
    id: 'rmm-001',
    category: 'RMM/PSA workflows',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: 'When should you use RMM remote access instead of asking for user control?',
    options: [
      { id: 'a', text: 'Always - it is more efficient' },
      { id: 'b', text: 'When the user is unavailable or unable to follow instructions' },
      { id: 'c', text: 'For emergency security fixes' },
      { id: 'd', text: 'Never - ask for user credentials' }
    ],
    correctOptionId: 'a',
    explanation: 'RMM should be used for efficiency and when users cannot cooperate. Never ask for credentials.',
    whyTheWrongAnswersAreWrong: 'User cooperation should be requested, not assumed. Emergency fixes are valid use cases. Asking for credentials violates security policies.',
    linkedSkillIds: ['remote-support', 'rmm-tools'],
    linkedMicroCardIds: ['rmm-best-practices', 'remote-support-etiquette'],
    linkedScenarioIds: ['remote-session']
  },

  // Documentation quality
  {
    id: 'docs-001',
    category: 'documentation quality',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: 'What makes documentation most useful for other technicians?',
    options: [
      { id: 'a', text: 'Including technical jargon' },
      { id: 'b', text: 'Writing detailed step-by-step instructions' },
      { id: 'c', text: 'Adding screenshots and diagrams' },
      { id: 'd', text: 'Including error messages and solutions' }
    ],
    correctOptionId: 'b',
    explanation: 'Clear steps with context and examples help others reproduce solutions and understand the reasoning.',
    whyTheWrongAnswersAreWrong: 'Jargon excludes less experienced staff. Instructions without context are hard to follow. Screenshots are valuable but must be sanitized.',
    linkedSkillIds: ['technical-documentation', 'knowledge-sharing'],
    linkedMicroCardIds: ['documentation-basics', 'knowledge-base'],
    linkedScenarioIds: ['documentation-standards']
  },

  // Professional judgement
  {
    id: 'judgement-001',
    category: 'professional judgement',
    difficulty: 'hard',
    type: 'multiple-choice',
    question: 'You discover a security vulnerability that management says to ignore. What should you do?',
    options: [
      { id: 'a', text: 'Ignore it as directed' },
      { id: 'b', text: 'Document your concerns and ignore the directive' },
      { id: 'c', text: 'Report through proper channels' },
      { id: 'd', text: 'Fix the vulnerability yourself' }
    ],
    correctOptionId: 'c',
    explanation: 'Security vulnerabilities have ethical and legal implications. Always document concerns and follow proper reporting channels.',
    whyTheWrongAnswersAreWrong: 'Ignoring security issues creates liability. Fixing without authorization may violate policies. Direct fixes are appropriate for some issues but not security vulnerabilities.',
    linkedSkillIds: ['professional-judgement', 'security-ethics'],
    linkedMicroCardIds: ['ethics-in-it', 'security-responsibility'],
    linkedScenarioIds: ['ethical-dilemma']
  }
];

export const quizCategories = [
  'MFA troubleshooting',
  'Outlook sync', 
  'OneDrive sync',
  'printer triage',
  'internet down triage',
  'DNS vs DHCP',
  'backup failure',
  'phishing first response',
  'Intune compliance',
  'escalation judgement',
  'ticket notes',
  'communication and user updates',
  'RMM/PSA workflows',
  'documentation quality',
  'professional judgement'
];

export const quizDifficulties: QuizDifficulty[] = ['easy', 'medium', 'hard'];

export const quizTypes: QuizType[] = [
  'multiple-choice',
  'true-false', 
  'best-first-question',
  'spot-unsafe-action',
  'escalation-decision',
  'ticket-note-quality'
];

export default mspQuizQuestions;
