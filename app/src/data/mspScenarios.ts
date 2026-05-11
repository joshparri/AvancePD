export type MspScenarioDifficulty = 'easy' | 'medium' | 'hard';

export interface MspScenario {
  id: string;
  title: string;
  category: string;
  difficulty: MspScenarioDifficulty;
  ticketText: string;
  userEmotion: string;
  hiddenCause: string;
  goodFirstQuestions: string[];
  expectedChecks: string[];
  unsafeActions: string[];
  escalationTriggers: string[];
  idealTicketNotes: string;
  learningPoints: string[];
  relatedSkillIds: string[];
}

export const mspScenarios: MspScenario[] = [
  {
    id: 'password-reset-sign-in-fail',
    title: 'User cannot sign in after password reset',
    category: 'Entra ID and identity',
    difficulty: 'easy',
    ticketText:
      'I reset my password this morning but now I cannot get into email or Teams. It keeps asking me to sign in again and then says something went wrong.',
    userEmotion: 'Anxious and blocked from work',
    hiddenCause: 'Cached old credentials plus an MFA prompt that the user is not completing successfully.',
    goodFirstQuestions: [
      'What exact error message appears after you enter the new password?',
      'Can you sign in to Outlook on the web from a browser?',
      'Are you receiving an MFA prompt, and what happens when you approve it?',
      'Are you on the office network, home Wi-Fi, or mobile data?',
    ],
    expectedChecks: [
      'Check whether the account is locked or disabled.',
      'Confirm the password works in a browser.',
      'Review registered MFA methods if access allows.',
      'Check for repeated failed sign-ins or suspicious prompts.',
      'Clear cached credentials only after confirming identity and account state.',
    ],
    unsafeActions: [
      'Reset MFA without verifying identity or approval.',
      'Tell the user to keep approving unexpected MFA prompts.',
      'Assume the password reset failed without testing web sign-in.',
    ],
    escalationTriggers: [
      'Unexpected MFA prompts or suspicious sign-in activity.',
      'Repeated lockouts after a reset.',
      'Conditional Access or tenant-wide authentication errors.',
    ],
    idealTicketNotes:
      'Issue: User unable to sign in to Microsoft 365 apps after password reset. Impact: Email and Teams unavailable. Checks: Confirmed current password status, tested browser sign-in path, checked for MFA prompt behaviour and account lockout. Action: Guided user through correct MFA prompt and identified cached credentials as likely local app issue. Result: Web sign-in successful; desktop apps require credential refresh. Next step: If lockouts continue or MFA prompts appear unexpectedly, escalate as possible identity/security issue.',
    learningPoints: [
      'Separate account authentication from local app cached credentials.',
      'MFA issues can be security events, not just convenience problems.',
      'Identity verification matters before resets or method changes.',
    ],
    relatedSkillIds: ['helpdesk-password-mfa', 'entra-mfa-troubleshooting', 'judgement-escalation'],
  },
  {
    id: 'outlook-mailbox-not-updating',
    title: 'Outlook mailbox not updating',
    category: 'Microsoft 365 support',
    difficulty: 'easy',
    ticketText:
      'Outlook has not shown any new email since yesterday afternoon, but my phone seems to have some new messages.',
    userEmotion: 'Concerned about missing messages',
    hiddenCause: 'Outlook desktop cached mode/profile issue while mailbox is healthy online.',
    goodFirstQuestions: [
      'Does Outlook on the web show the latest messages?',
      'Is sending affected, receiving affected, or both?',
      'Do you see "Working offline", password prompts, or connection errors?',
      'Did anything change yesterday, such as updates or password changes?',
    ],
    expectedChecks: [
      'Compare Outlook desktop with Outlook on the web.',
      'Check Outlook connection status and offline mode.',
      'Check mailbox quota and service health.',
      'Disable suspicious add-ins only if evidence points there.',
      'Consider profile repair or rebuild after confirming mailbox data is online.',
    ],
    unsafeActions: [
      'Delete the profile before confirming mailbox data exists online.',
      'Assume mail flow is broken without checking webmail.',
      'Ignore service health if multiple users report the same issue.',
    ],
    escalationTriggers: [
      'Multiple users missing mail.',
      'Mail flow or Exchange Online service health issue.',
      'Mailbox corruption or permissions issue beyond first-line support.',
    ],
    idealTicketNotes:
      'Issue: Outlook desktop not receiving new mail since yesterday. Impact: User may miss client messages. Checks: Compared Outlook desktop with webmail, checked connection state, offline mode, mailbox quota, and whether other users were affected. Action: Confirmed webmail current, treated issue as local Outlook sync/profile problem, and refreshed Outlook connection path. Result: New mail visible online; desktop sync remediation started. Next step: Rebuild profile if refresh does not restore sync, escalate if multiple mailboxes affected.',
    learningPoints: [
      'Webmail comparison is the fastest isolation step.',
      'Do not treat every Outlook issue as mail flow.',
      'Ticket notes should record what was ruled out.',
    ],
    relatedSkillIds: ['m365-outlook-troubleshooting', 'docs-handover-notes', 'psa-ticket-discipline'],
  },
  {
    id: 'onedrive-sync-broken',
    title: 'OneDrive sync broken',
    category: 'Microsoft 365 support',
    difficulty: 'medium',
    ticketText:
      'My OneDrive has red crosses everywhere and I am worried my files are not backed up. I need the latest version for a meeting.',
    userEmotion: 'Worried about file loss',
    hiddenCause: 'Several files have invalid characters and the sync client is paused after repeated failures.',
    goodFirstQuestions: [
      'Which folder or files show the red cross?',
      'Can you see the latest version in OneDrive online?',
      'Did you recently rename or move a folder?',
      'Is storage full locally or in Microsoft 365?',
    ],
    expectedChecks: [
      'Check OneDrive client status and account sign-in.',
      'Compare local file state with OneDrive web.',
      'Check storage quota and path/file name issues.',
      'Review sync error details before resetting OneDrive.',
      'Confirm user has access to the library or shared folder.',
    ],
    unsafeActions: [
      'Reset OneDrive before confirming unsynced files are protected.',
      'Delete local files to clear errors.',
      'Promise data is safe without checking online versions.',
    ],
    escalationTriggers: [
      'Potential data loss or unsynced critical files.',
      'Shared library permissions issue affecting multiple users.',
      'Tenant-wide OneDrive service issue.',
    ],
    idealTicketNotes:
      'Issue: OneDrive showing sync errors with red X indicators. Impact: User concerned meeting files may not be current or protected. Checks: Reviewed OneDrive status, compared affected files with OneDrive online, checked storage and sync error messages, and looked for invalid paths/names. Action: Identified sync client paused and filename issues as likely cause; advised preserving local copies before remediation. Result: Online versions confirmed for unaffected files; affected files require rename/resync. Next step: Fix invalid names and monitor sync; escalate if latest local-only data cannot be confirmed online.',
    learningPoints: [
      'Data protection comes before quick reset actions.',
      'Sync icons are evidence, not decoration.',
      'OneDrive troubleshooting must compare local and online state.',
    ],
    relatedSkillIds: ['m365-onedrive-sync', 'judgement-risk-scope', 'docs-kb-writing'],
  },
  {
    id: 'teams-microphone-not-working',
    title: 'Teams microphone not working',
    category: 'Microsoft 365 support',
    difficulty: 'easy',
    ticketText:
      'Nobody can hear me in Teams meetings. I have a meeting with a client in ten minutes.',
    userEmotion: 'Urgent and embarrassed',
    hiddenCause: 'Teams is using the laptop microphone while the headset is selected in Windows.',
    goodFirstQuestions: [
      'Can you hear other people?',
      'Does the microphone work in another app or browser test?',
      'Which microphone is selected inside Teams?',
      'Are you using a headset, dock, or laptop microphone?',
    ],
    expectedChecks: [
      'Check Teams device settings.',
      'Check Windows sound input and privacy permissions.',
      'Run a Teams test call if time allows.',
      'Try browser Teams or phone dial-in as a short-term workaround.',
      'Check headset mute switch and physical connection.',
    ],
    unsafeActions: [
      'Reinstall Teams as the first action when a meeting is imminent.',
      'Change device drivers without checking selected input.',
      'Ignore a quick workaround when the user has an urgent meeting.',
    ],
    escalationTriggers: [
      'Multiple users or meeting rooms affected.',
      'Device driver or policy issue recurring across devices.',
      'Executive or client-impacting meeting with no workaround.',
    ],
    idealTicketNotes:
      'Issue: User microphone not working in Teams before client meeting. Impact: User could not speak in meeting. Checks: Confirmed audio output worked, checked Teams selected microphone, Windows input device, privacy permission, headset mute, and quick test call path. Action: Selected correct headset microphone in Teams and confirmed input level. Result: Test audio successful. Next step: If issue returns, check headset hardware and driver state; use browser or phone audio as workaround.',
    learningPoints: [
      'Meeting support rewards fast isolation and practical workaround thinking.',
      'Teams and Windows can use different audio devices.',
      'Urgency changes the first action, but not safety.',
    ],
    relatedSkillIds: ['m365-teams-support', 'comm-plain-english', 'helpdesk-diagnostic-questions'],
  },
  {
    id: 'printer-not-printing',
    title: 'Printer not printing',
    category: 'Endpoint support',
    difficulty: 'easy',
    ticketText:
      'The office printer is not printing my document. I sent it three times and nothing came out.',
    userEmotion: 'Frustrated but not panicked',
    hiddenCause: 'The user is printing to an old offline queue instead of the current shared printer.',
    goodFirstQuestions: [
      'Can other users print to the same printer?',
      'Which printer name did you select?',
      'Is there an error on the printer or in the print queue?',
      'Is this one document or anything you try to print?',
    ],
    expectedChecks: [
      'Check printer display and paper/jam status.',
      'Check selected printer and print queue.',
      'Confirm whether other users are affected.',
      'Check network reachability if the printer is shared/networked.',
      'Remove duplicate or retired queues only after confirming the correct queue.',
    ],
    unsafeActions: [
      'Restart print services affecting everyone without checking scope.',
      'Delete queues blindly when jobs may be needed.',
      'Treat a site print outage as a single user issue.',
    ],
    escalationTriggers: [
      'All users unable to print.',
      'Print server or network printer offline.',
      'Business-critical printing blocked for payroll, finance, or dispatch.',
    ],
    idealTicketNotes:
      'Issue: User unable to print document. Impact: User blocked from producing required paperwork. Checks: Confirmed affected printer name, checked queue status, printer display, and whether other users could print. Action: Identified user was sending jobs to retired offline queue and selected correct shared printer. Result: Test page printed successfully. Next step: Remove old queue if approved or document correct printer name for future reference.',
    learningPoints: [
      'Printer issues are scope questions first.',
      'Duplicate queues are common and confusing.',
      'Avoid broad print service changes until impact is known.',
    ],
    relatedSkillIds: ['endpoint-app-installs', 'helpdesk-diagnostic-questions', 'psa-ticket-discipline'],
  },
  {
    id: 'wifi-slow-one-room',
    title: 'Wi-Fi slow in one room',
    category: 'Networking',
    difficulty: 'medium',
    ticketText:
      'The Wi-Fi in the meeting room is painfully slow, but people near reception say theirs is fine.',
    userEmotion: 'Irritated because meetings are affected',
    hiddenCause: 'The room has weak signal due to an access point fault or coverage gap.',
    goodFirstQuestions: [
      'Is it only this room or nearby rooms as well?',
      'Are all devices slow or just one laptop?',
      'Does wired network work normally in the same area?',
      'When did it start and is it constant or intermittent?',
    ],
    expectedChecks: [
      'Compare signal and speed in affected and unaffected rooms.',
      'Check whether multiple devices are affected.',
      'Check access point status if available.',
      'Compare wired performance to isolate Wi-Fi from internet.',
      'Record time, location, device count, and impact.',
    ],
    unsafeActions: [
      'Reconfigure Wi-Fi channels without approval.',
      'Assume ISP issue when only one room is affected.',
      'Move or reboot access points without understanding site impact.',
    ],
    escalationTriggers: [
      'Access point offline or hardware fault.',
      'Critical meeting room unusable.',
      'Coverage issue requiring site survey or network design change.',
    ],
    idealTicketNotes:
      'Issue: Wi-Fi slow in meeting room while reception appears normal. Impact: Meetings affected in one location. Checks: Compared multiple devices in affected room, checked nearby rooms, compared wired/internet performance, and reviewed AP status if available. Action: Gathered scope evidence pointing to room-specific wireless coverage/AP issue. Result: Not confirmed as ISP outage. Next step: Escalate with location, affected devices, test results, and AP observations for wireless review.',
    learningPoints: [
      'Location-specific Wi-Fi problems are not the same as internet outages.',
      'Good escalation includes location and comparison tests.',
      'Wireless changes can affect many users.',
    ],
    relatedSkillIds: ['networking-wifi-troubleshooting', 'networking-internet-outage', 'comm-outage-updates'],
  },
  {
    id: 'dns-website-failure',
    title: 'DNS issue causing website failure',
    category: 'Networking',
    difficulty: 'medium',
    ticketText:
      'Our company website works on my phone using mobile data, but it will not load from the office network.',
    userEmotion: 'Confused and worried',
    hiddenCause: 'Internal DNS resolver has a stale or incorrect record while public DNS resolves correctly.',
    goodFirstQuestions: [
      'Which exact website URL fails?',
      'Does it fail for everyone in the office?',
      'Does it work on mobile data or outside the office?',
      'Were there recent DNS, website, or hosting changes?',
    ],
    expectedChecks: [
      'Use `nslookup` against internal and public DNS resolvers.',
      'Check whether the issue is office-wide or device-specific.',
      'Compare DNS result with mobile data or external resolver.',
      'Flush DNS only as a local test, not as a full fix.',
      'Record resolver, IP result, and timestamp.',
    ],
    unsafeActions: [
      'Change DNS records without approval.',
      'Blame the website host without comparing DNS results.',
      'Clear caches and close the ticket without proving resolution.',
    ],
    escalationTriggers: [
      'Internal DNS needs record changes.',
      'Public DNS records appear incorrect.',
      'Website outage affects customers or revenue.',
    ],
    idealTicketNotes:
      'Issue: Company website fails from office network but works via mobile data. Impact: Staff cannot access site internally; possible customer concern if wider. Checks: Confirmed URL, tested multiple devices, compared internal DNS response with public resolver/mobile data, and recorded returned IPs. Action: Identified likely internal DNS stale/incorrect record rather than website outage. Result: External access works; internal resolution requires DNS review. Next step: Escalate with resolver results, timestamps, and requested DNS validation.',
    learningPoints: [
      'DNS comparison creates strong evidence.',
      'Internal and public DNS can disagree.',
      'Record exact commands/results for escalation.',
    ],
    relatedSkillIds: ['networking-dns-dhcp', 'docs-root-cause-summary', 'judgement-change-safety'],
  },
  {
    id: 'new-staff-onboarding',
    title: 'New staff onboarding request',
    category: 'Entra ID and identity',
    difficulty: 'medium',
    ticketText:
      'A new staff member starts tomorrow. Please set them up like Sam and make sure they can access everything they need.',
    userEmotion: 'Manager wants it done quickly',
    hiddenCause: 'The request is missing approval details, role scope, licence needs, device assignment, and exact access requirements.',
    goodFirstQuestions: [
      'What is the new staff member name, start date, role, and location?',
      'Who has approved the account and access?',
      'Which mailbox, groups, apps, shared folders, and devices are required?',
      'Should access match Sam exactly, and has Sam changed roles recently?',
    ],
    expectedChecks: [
      'Confirm approval and start date.',
      'Check licence availability.',
      'Identify role-based groups and mailbox needs.',
      'Confirm device requirement and onboarding checklist.',
      'Record assumptions and unresolved access decisions.',
    ],
    unsafeActions: [
      'Copy another user access blindly.',
      'Grant broad access without approval.',
      'Create privileged access from a vague request.',
    ],
    escalationTriggers: [
      'Privileged or sensitive access requested.',
      'No manager or data owner approval.',
      'Urgent start with incomplete required details.',
    ],
    idealTicketNotes:
      'Issue: New staff onboarding requested for start tomorrow. Impact: New user may be unable to work if account, licence, device, or access is incomplete. Checks: Requested role, location, start date, manager approval, required groups/apps/mailbox/device, and whether access should truly match nominated user. Action: Identified missing approval and access scope details before provisioning. Result: Awaiting confirmed access list and approvals. Next step: Proceed with standard onboarding once details are confirmed; escalate if privileged access is requested without owner approval.',
    learningPoints: [
      'Onboarding is an identity lifecycle process, not just account creation.',
      'Copying another user can copy old mistakes.',
      'Approval and least privilege protect the client and technician.',
    ],
    relatedSkillIds: ['entra-joiner-mover-leaver', 'entra-users-groups', 'judgement-risk-scope'],
  },
  {
    id: 'suspicious-phishing-email',
    title: 'Suspicious phishing email',
    category: 'Cybersecurity',
    difficulty: 'hard',
    ticketText:
      'I received an email that looked like Microsoft asking me to verify my mailbox. I clicked the link and entered my password before I realised it seemed odd.',
    userEmotion: 'Embarrassed and worried',
    hiddenCause: 'Credential harvesting email; password was entered into a fake login page.',
    goodFirstQuestions: [
      'What time did you click the link and enter your password?',
      'Did you approve any MFA prompt after entering the password?',
      'Did you open any attachments or download anything?',
      'Do you know whether anyone else received the same email?',
    ],
    expectedChecks: [
      'Treat as urgent credential exposure.',
      'Preserve the email for analysis if possible.',
      'Escalate for password reset, session revocation, and sign-in review.',
      'Check whether MFA prompts or suspicious sign-ins occurred.',
      'Identify whether the phishing message was sent to others.',
    ],
    unsafeActions: [
      'Delete the email before analysis.',
      'Tell the user it is probably fine because MFA exists.',
      'Only reset the password and ignore sessions/sign-in logs.',
    ],
    escalationTriggers: [
      'Credentials entered into suspicious site.',
      'MFA prompt approved unexpectedly.',
      'Multiple recipients or mailbox rule changes suspected.',
    ],
    idealTicketNotes:
      'Issue: User entered password into suspected phishing site. Impact: Potential account compromise and wider phishing risk. Checks: Confirmed time of click, whether credentials and MFA were entered, whether attachments were opened, and preserved message details. Action: Treated as urgent security incident and escalated for credential reset, session revocation, sign-in review, and message investigation. Result: Awaiting security/admin remediation confirmation. Next step: Confirm account secured, check for mailbox rule/forwarding changes, and advise user on follow-up.',
    learningPoints: [
      'Credential entry makes this a security incident.',
      'Preserve evidence and escalate quickly.',
      'Calm user communication matters because embarrassment delays reporting.',
    ],
    relatedSkillIds: ['cyber-phishing-analysis', 'cyber-incident-first-response', 'entra-mfa-troubleshooting'],
  },
  {
    id: 'backup-job-failed',
    title: 'Backup job failed overnight',
    category: 'Backup and disaster recovery',
    difficulty: 'medium',
    ticketText:
      'Backup alert: Server backup failed overnight. Last successful backup was two days ago.',
    userEmotion: 'Operational alert with hidden risk',
    hiddenCause: 'Backup repository is full, causing repeat backup failures and increasing recovery exposure.',
    goodFirstQuestions: [
      'Which system or backup set failed?',
      'When was the last successful backup?',
      'Is this the first failure or a repeated pattern?',
      'What error message or code did the backup console show?',
    ],
    expectedChecks: [
      'Check failed job details and error message.',
      'Check last successful restore point.',
      'Check repository/storage capacity.',
      'Check backup agent/device online state.',
      'Assess business risk based on age of last good backup.',
    ],
    unsafeActions: [
      'Close the alert because one failure is common.',
      'Delete backup data to make space without retention approval.',
      'Assume backups are recoverable without restore evidence.',
    ],
    escalationTriggers: [
      'Multiple failed nights.',
      'No recent restore point for critical system.',
      'Storage full or repository integrity concern.',
    ],
    idealTicketNotes:
      'Issue: Overnight server backup failed; last success two days ago. Impact: Recovery point is ageing and business recovery risk is increasing. Checks: Reviewed job error, last successful backup, repository capacity, agent/device status, and recurrence pattern. Action: Identified storage capacity as likely cause and did not delete backups without approval. Result: Backup remains at risk until repository issue is resolved. Next step: Escalate for backup storage remediation and confirm next successful job or restore point.',
    learningPoints: [
      'Backup failures are risk tickets, not noise.',
      'Last successful backup is more important than the latest failed alert.',
      'Deleting backup data requires process and approval.',
    ],
    relatedSkillIds: ['backup-monitoring', 'backup-restore-testing', 'judgement-risk-scope'],
  },
  {
    id: 'intune-compliance-missing',
    title: 'Device missing Intune compliance',
    category: 'Intune and endpoint management',
    difficulty: 'medium',
    ticketText:
      'My laptop says it does not meet company requirements and now I cannot access email.',
    userEmotion: 'Blocked and confused',
    hiddenCause: 'Device has not checked in recently and BitLocker compliance is reporting as failed.',
    goodFirstQuestions: [
      'What does Company Portal show as the reason for non-compliance?',
      'Is the device connected to the internet and recently restarted?',
      'When did access stop working?',
      'Is this device new, rebuilt, or recently renamed?',
    ],
    expectedChecks: [
      'Check Company Portal status.',
      'Check Intune last check-in if available.',
      'Check compliance policy details.',
      'Check BitLocker and OS update state.',
      'Confirm whether issue is one device or policy-wide.',
    ],
    unsafeActions: [
      'Disable compliance requirements to restore access quickly.',
      'Wipe or retire the device without confirming state and approval.',
      'Ignore potential fleet-wide policy change.',
    ],
    escalationTriggers: [
      'VIP or many users locked out.',
      'Policy-wide compliance failure.',
      'BitLocker or security baseline failure requiring admin remediation.',
    ],
    idealTicketNotes:
      'Issue: Device marked non-compliant and user cannot access email. Impact: User blocked from Microsoft 365 access. Checks: Reviewed Company Portal status, device connectivity/restart state, last check-in, compliance reasons, BitLocker, and update state. Action: Identified stale check-in and BitLocker compliance as likely causes; avoided bypassing policy. Result: User access depends on device returning to compliant state. Next step: Force sync/restart and escalate if BitLocker state or policy assignment requires admin action.',
    learningPoints: [
      'Compliance protects access and should not be bypassed casually.',
      'Last check-in matters before assuming policy failure.',
      'Device, user, and policy causes must be separated.',
    ],
    relatedSkillIds: ['intune-compliance-policy', 'endpoint-security-basics', 'judgement-change-safety'],
  },
  {
    id: 'shared-mailbox-access',
    title: 'User needs access to shared mailbox',
    category: 'Microsoft 365 support',
    difficulty: 'easy',
    ticketText:
      'Can you add Taylor to the accounts shared mailbox? They need to see it today.',
    userEmotion: 'Routine but time-sensitive',
    hiddenCause: 'The request is missing data owner approval and does not specify read access vs send access.',
    goodFirstQuestions: [
      'Who owns or approves access to this mailbox?',
      'Does Taylor need read access, send as, or send on behalf?',
      'Is access temporary or ongoing?',
      'Is there any sensitive finance, HR, or client information in the mailbox?',
    ],
    expectedChecks: [
      'Confirm approval from mailbox owner or manager.',
      'Clarify permission type.',
      'Check whether access is direct or group-based.',
      'Advise about propagation delay after permission changes.',
      'Record approval and permission granted.',
    ],
    unsafeActions: [
      'Grant send permissions when only read access was requested.',
      'Add access without owner approval.',
      'Ignore sensitive mailbox implications.',
    ],
    escalationTriggers: [
      'Sensitive mailbox without clear owner approval.',
      'Request for broad or privileged access.',
      'Permission does not apply after expected propagation and checks.',
    ],
    idealTicketNotes:
      'Issue: Request to grant Taylor access to accounts shared mailbox. Impact: User needs mailbox for work today. Checks: Confirmed mailbox owner approval required, clarified read vs send permission, checked sensitivity and duration. Action: Awaited or recorded approval before access change; advised propagation may take time. Result: Permission can be applied once approved and scoped. Next step: Confirm access type and close only after user can see mailbox or escalation is logged.',
    learningPoints: [
      'Access requests need approval and permission type.',
      'Shared mailbox access can include sensitive business data.',
      'Propagation delay should be communicated clearly.',
    ],
    relatedSkillIds: ['m365-admin-basics', 'entra-users-groups', 'judgement-risk-scope'],
  },
  {
    id: 'laptop-running-slowly',
    title: 'Laptop running slowly',
    category: 'Windows troubleshooting',
    difficulty: 'medium',
    ticketText:
      'My laptop has been painfully slow all week. It takes ages to open anything and sometimes freezes after login.',
    userEmotion: 'Frustrated by repeated interruption',
    hiddenCause: 'Disk nearly full, heavy startup load, and pending updates after weeks without restart.',
    goodFirstQuestions: [
      'When is it slow: startup, all day, specific apps, or network drives?',
      'Did anything change recently?',
      'Is anyone else affected?',
      'Have you restarted recently and is there any warning about low disk space?',
    ],
    expectedChecks: [
      'Check Task Manager CPU, memory, and disk.',
      'Check disk free space.',
      'Check startup apps and pending restarts.',
      'Check Windows Update state.',
      'Review Event Viewer or Reliability Monitor if freezes are reported.',
    ],
    unsafeActions: [
      'Delete user data to free space.',
      'Disable security tools to improve performance.',
      'Run aggressive cleanup scripts without backup or approval.',
    ],
    escalationTriggers: [
      'Signs of failing disk or hardware fault.',
      'Possible malware or EDR alert.',
      'Critical user blocked with no spare device.',
    ],
    idealTicketNotes:
      'Issue: Laptop slow and freezing after login for one week. Impact: User productivity significantly reduced. Checks: Reviewed Task Manager resource pressure, disk space, startup apps, pending restart/update state, and recent changes. Action: Identified low disk space, heavy startup load, and pending updates as likely contributors; avoided deleting user files or disabling security. Result: Initial cleanup/restart/update path recommended. Next step: Monitor performance after updates; escalate if hardware errors or EDR concerns appear.',
    learningPoints: [
      'Slow device tickets need evidence, not guesswork.',
      'Security tools should not be disabled casually.',
      'User data protection matters during cleanup.',
    ],
    relatedSkillIds: ['windows-performance-profile', 'windows-event-viewer', 'endpoint-security-basics'],
  },
  {
    id: 'windows-update-failed',
    title: 'Windows Update failed',
    category: 'Windows troubleshooting',
    difficulty: 'medium',
    ticketText:
      'Windows Update keeps failing on my laptop with an error code. It has tried three times and now it keeps asking me to restart.',
    userEmotion: 'Annoyed by interruptions',
    hiddenCause: 'Pending restart and low disk space are preventing update completion.',
    goodFirstQuestions: [
      'What error code is shown?',
      'How many times has the update failed?',
      'Is there a pending restart?',
      'How much free disk space is available?',
    ],
    expectedChecks: [
      'Check update history and error code.',
      'Check pending restart state.',
      'Check disk space.',
      'Check Windows Update service state if needed.',
      'Check whether failures are isolated or fleet-wide in RMM reports.',
    ],
    unsafeActions: [
      'Run repair commands before checking simple causes.',
      'Ignore repeated patch failure on a security update.',
      'Force restarts without warning the user about open work.',
    ],
    escalationTriggers: [
      'Critical security update repeatedly failing.',
      'Many devices failing the same patch.',
      'Corruption or policy issue beyond first-line repair.',
    ],
    idealTicketNotes:
      'Issue: Windows Update repeatedly failing and prompting for restart. Impact: User disrupted and device may remain unpatched. Checks: Reviewed error code, update history, restart state, disk space, and whether issue appears isolated. Action: Identified pending restart and low disk space as likely blockers; planned safe restart/space remediation before deeper repair. Result: Update not yet confirmed complete. Next step: Recheck after restart and cleanup; escalate if failure continues or patch report shows multiple devices affected.',
    learningPoints: [
      'Simple blockers should be checked before repair commands.',
      'Patch failures can become security risk.',
      'User communication matters before restarts.',
    ],
    relatedSkillIds: ['windows-update-repair', 'rmm-patch-management', 'comm-plain-english'],
  },
  {
    id: 'client-internet-down',
    title: 'Client reports internet is down',
    category: 'Networking',
    difficulty: 'hard',
    ticketText:
      'The internet is down for the whole office. EFTPOS and phones may also be affected. We need help urgently.',
    userEmotion: 'Urgent business impact',
    hiddenCause: 'Firewall/router lost WAN connectivity while LAN and Wi-Fi are still operating internally.',
    goodFirstQuestions: [
      'Is every device affected or only Wi-Fi devices?',
      'Are phones, EFTPOS, email, and line-of-business apps affected?',
      'Are there any lights or alerts on the modem/router/firewall?',
      'When did it start, and did anything change just before it failed?',
    ],
    expectedChecks: [
      'Confirm scope and business impact.',
      'Check wired vs Wi-Fi devices.',
      'Check gateway/firewall and WAN status if available.',
      'Check DNS vs full internet reachability.',
      'Check ISP outage status and prepare escalation evidence.',
    ],
    unsafeActions: [
      'Power cycle core network gear without warning or approval if remote access may be lost.',
      'Assume ISP outage without checking router/firewall status.',
      'Close after service returns without recording cause and impact.',
    ],
    escalationTriggers: [
      'Whole site outage.',
      'Phones, EFTPOS, or critical business systems affected.',
      'Firewall/router offline or ISP escalation required.',
    ],
    idealTicketNotes:
      'Issue: Client reports whole-office internet outage with possible EFTPOS/phone impact. Impact: High business disruption across site. Checks: Confirmed affected services, wired vs Wi-Fi scope, gateway/firewall/WAN status, DNS vs internet reachability, and ISP outage indicators. Action: Treated as high-priority site outage and gathered escalation evidence before risky changes. Result: LAN/Wi-Fi appear internal only; WAN/firewall/ISP path requires escalation. Next step: Escalate urgently with scope, affected services, device status, and ISP/router observations; provide client updates until restored.',
    learningPoints: [
      'Whole-site outages are priority and communication tickets.',
      'Internet, Wi-Fi, LAN, DNS, firewall, and ISP are different layers.',
      'Record business impact for prioritisation and escalation.',
    ],
    relatedSkillIds: ['networking-internet-outage', 'service-sla-priority', 'comm-outage-updates'],
  },
];

