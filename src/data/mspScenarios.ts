export type MspScenarioDifficulty = 'easy' | 'medium' | 'hard';

export type MspScenario = {
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
};

export const mspScenarios: MspScenario[] = [
  {
    id: 'password-reset-signin',
    title: 'User cannot sign in after password reset',
    category: 'Entra ID and identity',
    difficulty: 'easy',
    ticketText: 'I reset my password this morning and now I cannot get into email or Teams.',
    userEmotion: 'Frustrated and worried about missing meetings',
    hiddenCause: 'User is entering the old password on one device and MFA re-registration is pending.',
    goodFirstQuestions: ['Which app or device fails first?', 'Can you sign in at office.com in a browser?', 'Did you receive an MFA prompt or error code?'],
    expectedChecks: ['Confirm account enabled state', 'Check sign-in logs', 'Check MFA methods', 'Test web sign-in before desktop apps'],
    unsafeActions: ['Disable MFA without approval', 'Ask for the user password', 'Reset repeatedly without checking sign-in logs'],
    escalationTriggers: ['Risky sign-in shown', 'Account lockouts continue', 'Conditional Access policy blocks sign-in unexpectedly'],
    idealTicketNotes: 'Issue: user unable to sign in after password reset. Impact: email and Teams unavailable. Checked account state, web sign-in, MFA methods, and sign-in logs. Found MFA re-registration required and old credentials cached on laptop. Guided user through approved re-registration and sign-out/sign-in. Result: web and Teams sign-in successful. Next step: user to test Outlook desktop; escalate if lockouts return.',
    learningPoints: ['Separate password, MFA, and device cache issues', 'Use sign-in logs before guessing', 'Never ask for passwords'],
    relatedSkillIds: ['mfa-troubleshooting', 'entra-users-groups', 'diagnostic-questions']
  },
  {
    id: 'outlook-mailbox-not-updating',
    title: 'Outlook mailbox not updating',
    category: 'Microsoft 365 support',
    difficulty: 'easy',
    ticketText: 'My Outlook has not received new mail since yesterday, but my phone still gets messages.',
    userEmotion: 'Annoyed and under time pressure',
    hiddenCause: 'Desktop Outlook is offline and stuck with a failing add-in.',
    goodFirstQuestions: ['Does Outlook on the web show new mail?', 'Is this only on one computer?', 'Do you see working offline or send/receive errors?'],
    expectedChecks: ['Compare OWA and desktop Outlook', 'Check Work Offline state', 'Start Outlook in safe mode', 'Check add-ins and connection status'],
    unsafeActions: ['Delete the mailbox profile before confirming OWA works', 'Purge OST files without explaining impact', 'Change mail flow settings'],
    escalationTriggers: ['OWA also missing mail', 'Multiple users affected', 'Mailbox corruption or service incident suspected'],
    idealTicketNotes: 'Issue: Outlook desktop not updating. Impact: user relying on phone for current mail. Confirmed OWA and mobile receive mail, so mail flow is healthy. Checked Outlook desktop and found Work Offline plus add-in errors. Disabled suspect add-in, turned online mode back on, and restarted Outlook. Result: mailbox synced. Next step: monitor and reopen if add-in errors return.',
    learningPoints: ['Compare web and desktop first', 'Avoid destructive profile rebuilds early', 'Document what was changed'],
    relatedSkillIds: ['outlook-support', 'diagnostic-questions', 'helpdesk-triage']
  },
  {
    id: 'onedrive-sync-broken',
    title: 'OneDrive sync broken',
    category: 'Microsoft 365 support',
    difficulty: 'medium',
    ticketText: 'My files have red crosses and I am not sure whether my work is saved.',
    userEmotion: 'Anxious about losing work',
    hiddenCause: 'OneDrive is paused and one file path exceeds sync limits.',
    goodFirstQuestions: ['Which folder or file shows the error?', 'Can you see the file in OneDrive online?', 'Did anything change with file names or folders recently?'],
    expectedChecks: ['Check OneDrive sync icon status', 'Open OneDrive online', 'Check storage and file path length', 'Review sync errors'],
    unsafeActions: ['Delete local files to force sync', 'Unlink OneDrive before confirming online copy', 'Move large folder trees without backup'],
    escalationTriggers: ['Data loss suspected', 'Multiple users have the same library issue', 'SharePoint permissions appear broken'],
    idealTicketNotes: 'Issue: OneDrive shows sync errors and user is concerned about saved work. Impact: risk of working from unsynced local files. Checked OneDrive online, sync status, storage, and error list. Found sync paused and one long file path causing failure. Resumed sync and helped user shorten path safely after confirming online copy. Result: sync healthy except one renamed file now uploading. Next step: user to confirm file availability on second device.',
    learningPoints: ['Protect user data first', 'Confirm cloud and local copies', 'Long paths can block sync'],
    relatedSkillIds: ['onedrive-sync', 'plain-english', 'handover-notes']
  },
  {
    id: 'teams-microphone-not-working',
    title: 'Teams microphone not working',
    category: 'Microsoft 365 support',
    difficulty: 'easy',
    ticketText: 'No one can hear me in Teams calls, but I can hear them.',
    userEmotion: 'Embarrassed before a meeting',
    hiddenCause: 'Windows input device is set to a monitor microphone that does not exist.',
    goodFirstQuestions: ['Does the microphone work in another app?', 'Which device are you trying to use?', 'Did this start after docking or using a headset?'],
    expectedChecks: ['Check Teams device settings', 'Check Windows sound input', 'Test browser Teams', 'Check privacy permission'],
    unsafeActions: ['Reinstall Teams first', 'Update drivers during an urgent meeting', 'Change tenant-wide Teams policies'],
    escalationTriggers: ['Multiple users affected', 'Device missing in Windows', 'Hardware failure suspected'],
    idealTicketNotes: 'Issue: Teams microphone not working. Impact: user cannot speak in meetings. Checked Teams device settings, Windows input, privacy permission, and test call. Found Windows default input set to invalid monitor device after docking. Set correct headset microphone and completed test call. Result: audio working. Next step: user to keep headset selected when docking.',
    learningPoints: ['Start with app and OS device selection', 'Match urgency to fix depth', 'Do not over-fix during live meetings'],
    relatedSkillIds: ['teams-support', 'windows-settings', 'remote-support-etiquette']
  },
  {
    id: 'printer-not-printing',
    title: 'Printer not printing',
    category: 'Endpoint support',
    difficulty: 'easy',
    ticketText: 'My document will not print to the office printer.',
    userEmotion: 'Impatient',
    hiddenCause: 'User selected an old printer queue and the active printer is online.',
    goodFirstQuestions: ['Is anyone else able to print?', 'Which printer name did you select?', 'Do you see an error or stuck job?'],
    expectedChecks: ['Check selected printer', 'Check queue status', 'Print test page', 'Confirm network connectivity if needed'],
    unsafeActions: ['Delete all printer queues immediately', 'Restart shared print services without impact check', 'Change printer IP settings'],
    escalationTriggers: ['Everyone cannot print', 'Printer offline at network level', 'Driver package failure across devices'],
    idealTicketNotes: 'Issue: user could not print document. Impact: blocked local printing. Checked whether others were affected, selected queue, printer status, and test page. Found user selected retired queue. Set current office printer as default and removed stuck job from old queue. Result: test page and document printed. Next step: update KB if old queue appears on more devices.',
    learningPoints: ['Scope single user versus shared service', 'Check selected printer before deeper fixes', 'Avoid broad service changes for one-user issues'],
    relatedSkillIds: ['windows-settings', 'diagnostic-questions', 'kb-writing']
  },
  {
    id: 'wifi-slow-one-room',
    title: 'Wi-Fi slow in one room',
    category: 'Networking',
    difficulty: 'medium',
    ticketText: 'Wi-Fi is unusable in Room 4, but the rest of the building seems okay.',
    userEmotion: 'Disrupted and expecting an update',
    hiddenCause: 'One access point is offline after a switch port lost power.',
    goodFirstQuestions: ['Is it only Room 4?', 'Are wired devices in that room working?', 'When did it start?', 'Which SSID is affected?'],
    expectedChecks: ['Confirm scope by location', 'Check AP/controller status', 'Check switch port PoE', 'Compare wired connectivity'],
    unsafeActions: ['Reboot all network gear without approval', 'Change SSID settings globally', 'Blame ISP before checking local AP'],
    escalationTriggers: ['AP or switch port needs physical access', 'Multiple rooms become affected', 'Controller shows hardware fault'],
    idealTicketNotes: 'Issue: Wi-Fi slow in Room 4. Impact: users in one room cannot work reliably. Confirmed issue is location-specific and wired service remains healthy. Checked wireless controller and found Room 4 AP offline. Switch port shows no PoE. Escalated to network lead/site contact for physical port and cabling check. Result: user updated with workaround to use nearby room. Next step: confirm AP online after port remediation.',
    learningPoints: ['Scope by location, user, and service', 'Do not reboot shared infrastructure casually', 'Give workaround and next update'],
    relatedSkillIds: ['wifi-troubleshooting', 'incident-thinking', 'client-updates']
  },
  {
    id: 'dns-website-failure',
    title: 'DNS issue causing website failure',
    category: 'Networking',
    difficulty: 'medium',
    ticketText: 'The finance website will not open from the office, but it works on my phone hotspot.',
    userEmotion: 'Concerned because payroll is due',
    hiddenCause: 'Internal DNS has stale record for the vendor domain.',
    goodFirstQuestions: ['Is it only this website?', 'Does it fail for everyone on office Wi-Fi and wired?', 'What error appears?'],
    expectedChecks: ['Compare office and hotspot DNS resolution', 'Use nslookup', 'Test by IP only if safe', 'Check DNS forwarder or internal record'],
    unsafeActions: ['Change client DNS settings broadly without approval', 'Flush DNS everywhere as the only fix', 'Disable security filtering without approval'],
    escalationTriggers: ['Business-critical outage', 'DNS server changes required', 'Security filtering or firewall block suspected'],
    idealTicketNotes: 'Issue: finance website fails from office network but works on hotspot. Impact: payroll access blocked. Confirmed multiple office devices affected and external network works. nslookup from office returns stale internal address. Escalated to network/DNS admin with domain, timestamps, client IP, and comparison result. Workaround: approved hotspot access for payroll user. Next step: confirm DNS record correction and retest.',
    learningPoints: ['Compare internal and external resolution', 'Record command outputs', 'Escalate when infrastructure changes are needed'],
    relatedSkillIds: ['dns-basics', 'cmd-networking', 'escalation-basics']
  },
  {
    id: 'new-staff-onboarding',
    title: 'New staff onboarding request',
    category: 'Entra ID and identity',
    difficulty: 'medium',
    ticketText: 'New staff member starts Monday. Please set up access like Sarah has.',
    userEmotion: 'Busy manager wanting it done quickly',
    hiddenCause: 'Request is missing role, manager approval, device need, and exact access requirements.',
    goodFirstQuestions: ['What is the role and start date?', 'Who approved access?', 'Which systems and shared mailboxes are needed?', 'Do they need a device or only account access?'],
    expectedChecks: ['Confirm requestor authority', 'Use onboarding checklist', 'Avoid copying access blindly', 'Record licence and group requirements'],
    unsafeActions: ['Copy another user exactly without approval', 'Grant admin rights because requested', 'Skip MFA setup'],
    escalationTriggers: ['Privileged access requested', 'Ambiguous system ownership', 'No approval trail'],
    idealTicketNotes: 'Issue: new starter onboarding requested. Impact: staff member needs ready access by Monday. Request was missing role, approval, device, and exact access. Asked manager for required systems, group access, shared mailbox needs, device requirement, and approval. Prepared onboarding checklist and paused access creation until approved details are provided. Next step: create account, assign licence/groups, configure MFA, and document evidence after approval.',
    learningPoints: ['Do not copy access blindly', 'Least privilege starts at onboarding', 'Good questions prevent risky access'],
    relatedSkillIds: ['joiner-mover-leaver', 'm365-licensing', 'escalation-basics']
  },
  {
    id: 'phishing-email',
    title: 'Suspicious phishing email',
    category: 'Cybersecurity',
    difficulty: 'medium',
    ticketText: 'I received an invoice email that looks odd. I clicked it but did not enter anything.',
    userEmotion: 'Nervous and embarrassed',
    hiddenCause: 'Credential phishing email with a malicious link, clicked from a managed laptop.',
    goodFirstQuestions: ['Did you enter credentials or download anything?', 'What time did you click it?', 'Can you forward or report the email using the approved method?'],
    expectedChecks: ['Preserve message details', 'Check URL safely in security tools', 'Check sign-in logs', 'Confirm endpoint alert status'],
    unsafeActions: ['Shame the user', 'Click the link yourself', 'Delete evidence before security review'],
    escalationTriggers: ['Credentials entered', 'File downloaded', 'Suspicious sign-in or EDR alert detected'],
    idealTicketNotes: 'Issue: user reported suspicious invoice email and clicked link. Impact: possible credential phishing exposure. Collected timestamp, sender, subject, and user action. User confirms no credentials entered and no download. Reported email through approved process, checked sign-in logs for unusual activity, and confirmed no endpoint alert at time of review. Result: escalated to security queue for message analysis and tenant search. Next step: notify user of outcome and reinforce reporting process.',
    learningPoints: ['Keep the user calm so they report early', 'Preserve evidence', 'Escalate quickly if credentials or downloads are involved'],
    relatedSkillIds: ['phishing-analysis', 'edr-alerts', 'client-updates']
  },
  {
    id: 'backup-job-failed',
    title: 'Backup job failed overnight',
    category: 'Backup and disaster recovery',
    difficulty: 'medium',
    ticketText: 'Backup alert: Server file backup failed overnight.',
    userEmotion: 'Internal alert requiring disciplined follow-up',
    hiddenCause: 'Repository ran out of space after retention policy stopped pruning.',
    goodFirstQuestions: ['Which server and job failed?', 'When was the last successful backup?', 'Is any production service affected?', 'Has this failed more than once?'],
    expectedChecks: ['Review backup job error', 'Confirm last successful restore point', 'Check repository capacity', 'Check retention status'],
    unsafeActions: ['Delete backup chains without approval', 'Mark resolved before next successful run', 'Ignore because it is only one failure'],
    escalationTriggers: ['No recent successful backup', 'Repository full', 'Protected server has critical data', 'Repeated failure'],
    idealTicketNotes: 'Issue: overnight file server backup failed. Impact: latest restore point not created. Checked job error, last successful backup, repository capacity, and retention status. Found repository full and retention pruning not completing. Escalated to backup owner with job ID, affected server, last successful backup date, and capacity screenshot. Next step: remediate storage/retention and confirm next backup plus test restore if risk window is high.',
    learningPoints: ['A successful backup is not the same as recoverability', 'Record last good restore point', 'Do not delete backup data casually'],
    relatedSkillIds: ['backup-monitoring', 'restore-testing', 'rpo-rto']
  },
  {
    id: 'intune-compliance-missing',
    title: 'Device missing Intune compliance',
    category: 'Intune and endpoint management',
    difficulty: 'hard',
    ticketText: 'User cannot access company apps because their laptop is marked non-compliant.',
    userEmotion: 'Blocked and confused',
    hiddenCause: 'Device has not checked in for 12 days and BitLocker status is stale.',
    goodFirstQuestions: ['Is the device online and used regularly?', 'Did access fail after a policy prompt?', 'Can the user open Company Portal?'],
    expectedChecks: ['Check Intune device status', 'Check last check-in time', 'Review compliance policy failure', 'Confirm BitLocker state locally if needed'],
    unsafeActions: ['Exclude user from Conditional Access casually', 'Mark device compliant without fixing root cause', 'Disable BitLocker requirement'],
    escalationTriggers: ['Conditional Access exception requested', 'Device cannot check in', 'Encryption state unclear', 'Multiple devices affected'],
    idealTicketNotes: 'Issue: laptop blocked from company apps due to non-compliance. Impact: user cannot access work apps. Checked Intune compliance details, last check-in, Company Portal status, and BitLocker policy. Found last check-in 12 days old and BitLocker status stale. Guided user to connect to internet, open Company Portal, and sync device. Compliance pending after sync, escalated for endpoint review if policy state does not update. Next step: confirm compliance and access after check-in.',
    learningPoints: ['Compliance is an access control signal', 'Avoid unsafe policy exceptions', 'Check last check-in before changing policy'],
    relatedSkillIds: ['intune-compliance', 'intune-enrolment', 'conditional-access']
  },
  {
    id: 'shared-mailbox-access',
    title: 'User needs access to shared mailbox',
    category: 'Microsoft 365 support',
    difficulty: 'easy',
    ticketText: 'Please add me to the accounts shared mailbox today.',
    userEmotion: 'Direct and expecting quick action',
    hiddenCause: 'Request lacks owner approval and send-as requirement is unclear.',
    goodFirstQuestions: ['Who owns the mailbox and has approval been provided?', 'Do you need read access, send-as, or send-on-behalf?', 'Is this temporary or ongoing?'],
    expectedChecks: ['Confirm mailbox owner approval', 'Check existing permissions', 'Record access type', 'Advise propagation time'],
    unsafeActions: ['Grant access without approval', 'Grant send-as when only read access was requested', 'Use another user as a template without checking'],
    escalationTriggers: ['Sensitive mailbox', 'No approval trail', 'External or privileged mailbox access'],
    idealTicketNotes: 'Issue: user requested access to accounts shared mailbox. Impact: user needs mailbox access for work. Confirmed mailbox owner approval and access type required. Added full access only, no send-as requested. Advised propagation may take time and user may need to restart Outlook. Result: permission applied. Next step: user to confirm mailbox appears; escalate if access does not appear after expected delay.',
    learningPoints: ['Access requests need approval and exact permission type', 'Document what was granted', 'Explain propagation delay'],
    relatedSkillIds: ['shared-mailboxes', 'entra-users-groups', 'client-updates']
  },
  {
    id: 'laptop-running-slow',
    title: 'Laptop running slowly',
    category: 'Endpoint support',
    difficulty: 'easy',
    ticketText: 'My laptop is painfully slow today and I cannot get work done.',
    userEmotion: 'Irritated',
    hiddenCause: 'Disk nearly full and Windows updates are pending a restart.',
    goodFirstQuestions: ['When did it start?', 'Is it slow after sign-in, in one app, or everywhere?', 'Have you restarted recently?'],
    expectedChecks: ['Check Task Manager', 'Check disk space', 'Check update/restart state', 'Review startup apps'],
    unsafeActions: ['Run cleanup tools without knowing what they remove', 'Disable security software', 'Delete user data'],
    escalationTriggers: ['Disk health warnings', 'Malware signs', 'Repeated performance issue after normal cleanup'],
    idealTicketNotes: 'Issue: laptop running slowly. Impact: user productivity affected. Checked scope, uptime, Task Manager, disk space, and Windows Update. Found disk at 96 percent used and restart pending. Cleared safe temporary files, advised user on large personal downloads, and restarted to complete updates. Result: performance improved after restart. Next step: monitor; escalate if disk fills again or health warnings appear.',
    learningPoints: ['Check simple resource pressure first', 'Avoid deleting user data', 'Restart can be valid when evidence supports it'],
    relatedSkillIds: ['endpoint-performance', 'windows-update', 'plain-english']
  },
  {
    id: 'windows-update-failed',
    title: 'Windows Update failed',
    category: 'Windows troubleshooting',
    difficulty: 'medium',
    ticketText: 'My laptop keeps saying Windows Update failed and asks me to try again.',
    userEmotion: 'Mildly frustrated',
    hiddenCause: 'Feature update blocked by low disk space.',
    goodFirstQuestions: ['What error code is shown?', 'How much free disk space is available?', 'Is this blocking your work now?'],
    expectedChecks: ['Capture update error code', 'Check free disk space', 'Check pending restart', 'Review update history'],
    unsafeActions: ['Force a major update during business-critical work', 'Delete unknown folders', 'Reset Windows Update blindly'],
    escalationTriggers: ['Repeated failure after free space and restart', 'BitLocker recovery risk', 'Fleet-wide update failure'],
    idealTicketNotes: 'Issue: Windows Update repeatedly failing. Impact: device may miss security updates. Captured update error, checked update history, restart state, and disk space. Found feature update blocked by low disk space. Cleared safe temporary files and scheduled update outside user meeting time. Result: update started successfully after restart. Next step: confirm completion and compliance status.',
    learningPoints: ['Capture error code first', 'Check free space and restart state', 'Schedule disruptive updates thoughtfully'],
    relatedSkillIds: ['windows-update', 'patch-management', 'change-awareness']
  },
  {
    id: 'internet-is-down',
    title: 'Client reports internet is down',
    category: 'Networking',
    difficulty: 'hard',
    ticketText: 'The internet is down for everyone. We cannot process payments.',
    userEmotion: 'Urgent and business-impacting',
    hiddenCause: 'Primary ISP outage, firewall failed over but DNS forwarder did not update.',
    goodFirstQuestions: ['Is everyone affected or only one area?', 'Are internal systems working?', 'When did it start?', 'Are payment terminals affected too?'],
    expectedChecks: ['Confirm business impact', 'Check WAN status', 'Check firewall failover', 'Test DNS and IP connectivity', 'Check ISP status'],
    unsafeActions: ['Reboot firewall without approval and rollback plan', 'Change DNS globally without recording current state', 'Give no update while investigating'],
    escalationTriggers: ['Business-wide outage', 'Firewall or ISP fault', 'Payment processing affected', 'No clear workaround'],
    idealTicketNotes: 'Issue: client reports internet down for all users and payment processing unavailable. Impact: business-wide outage affecting revenue. Confirmed internal network works, WAN primary link down, failover link active, and DNS forwarding not resolving externally. Escalated to network lead with firewall WAN status, DNS test results, affected services, and start time. Provided client update and next update time. Next step: apply approved DNS/failover remediation or ISP escalation, then confirm payments and browsing.',
    learningPoints: ['Treat business-wide outage as high priority', 'Separate LAN, WAN, DNS, and ISP layers', 'Communicate while technical work continues'],
    relatedSkillIds: ['incident-thinking', 'dns-basics', 'client-updates', 'escalation-basics']
  }
];
