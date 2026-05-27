import type { KbFieldCard } from './kbLearningTypes';

const now = '2026-05-27T00:00:00.000Z';

export const demoKbFieldCards: KbFieldCard[] = [
  {
    id: 'demo-1',
    title: 'Enrolling a New Computer into Intune',
    category: 'Endpoint Management',
    whenToUse: 'Use when a new Windows or macOS device must be added to corporate Intune management.',
    prerequisites: 'Device is powered on, connected to the network, and has the correct enrollment account available.',
    firstChecks: [
      'Confirm the device is on the supported OS version.',
      'Verify the user has the required account access.',
      'Check that MDM enrollment is allowed in the tenant policy.'
    ],
    coreSteps: [
      'Open the company portal or enrollment agent.',
      'Sign in with the business account and follow enrollment prompts.',
      'Accept device management permissions and complete the setup flow.'
    ],
    commonMistake: 'Skipping the tenant and account selection step can leave the device unenrolled.',
    escalateIf: 'The device fails to reach Intune after enrollment or shows policy sync errors.',
    relatedSkill: 'Device onboarding and management',
    confidence: 'medium',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  },
  {
    id: 'demo-2',
    title: 'Migrating Local User Account to Entra Account',
    category: 'Identity & Access',
    whenToUse: 'Use when a device user moves from a local account to a managed Entra ID account.',
    prerequisites: 'The target Entra account exists and the device is joined or registered to the organization.',
    firstChecks: [
      'Confirm the local account is not already linked to an Entra user.',
      'Ensure the device is online and reachable by Azure services.',
      'Backup any local data that must be preserved.'
    ],
    coreSteps: [
      'Sign out of the local account and sign in using the Entra account.',
      'Verify the user profile syncs and device policies apply.',
      'Confirm access to required apps and network resources.'
    ],
    commonMistake: 'Assuming the local profile automatically moves without checking permissions.',
    escalateIf: 'The Entra account cannot sign in or device policies do not apply after migration.',
    relatedSkill: 'Identity migration and account management',
    confidence: 'medium',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  },
  {
    id: 'demo-3',
    title: 'Importing Office 365 or Google GSuite User into JumpCloud',
    category: 'Endpoint Management',
    whenToUse: 'Use when a user account from a cloud directory needs to be onboarded in JumpCloud.',
    prerequisites: 'JumpCloud directory access is available and the source user provisioning settings are configured.',
    firstChecks: [
      'Confirm the user account exists in the source directory.',
      'Review JumpCloud import settings and sync options.',
      'Verify the target system is ready for the imported user account.'
    ],
    coreSteps: [
      'Start the JumpCloud import workflow and select the source user.',
      'Map the user attributes to JumpCloud fields.',
      'Complete the import and verify the account appears in JumpCloud.'
    ],
    commonMistake: 'Importing without checking group assignment or access settings first.',
    escalateIf: 'The imported account cannot authenticate or access the expected resources.',
    relatedSkill: 'Cloud directory user onboarding',
    confidence: 'medium',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  },
  {
    id: 'demo-4',
    title: 'Turning on 2 Factor Authentication for Google Account',
    category: 'Security & Authentication',
    whenToUse: 'Use when a user needs an additional authentication layer for a Google account.',
    prerequisites: 'The user can access the Google account and has a second authentication method available.',
    firstChecks: [
      'Verify the account owner can sign in.',
      'Confirm available authentication methods such as phone or authenticator app.',
      'Review the organization security policy for MFA requirements.'
    ],
    coreSteps: [
      'Open the Google account security settings.',
      'Enable 2-Step Verification and follow the setup flow.',
      'Register the second factor and test sign-in with the new method.'
    ],
    commonMistake: 'Skipping the backup method setup and risking account lockout.',
    escalateIf: 'The user cannot complete verification or loses access after registration.',
    relatedSkill: 'Authentication hardening',
    confidence: 'high',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  },
  {
    id: 'demo-5',
    title: 'Veeam Agent Recovery Guide',
    category: 'Backup & Recovery',
    whenToUse: 'Use when a protected endpoint needs recovery from a Veeam backup.',
    prerequisites: 'A known backup point exists and the Veeam agent is installed on the protected device.',
    firstChecks: [
      'Confirm the backup job completed successfully.',
      'Verify the recovery destination is available.',
      'Check that the recovery agent is online and reachable.'
    ],
    coreSteps: [
      'Open the Veeam recovery console.',
      'Select the restore point and recovery target.',
      'Start the restore and monitor the progress.'
    ],
    commonMistake: 'Restoring to the wrong destination without verifying the target.',
    escalateIf: 'Recovery fails repeatedly or important files are missing after restore.',
    relatedSkill: 'Endpoint recovery and backup verification',
    confidence: 'medium',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  },
  {
    id: 'demo-6',
    title: 'Outlook Opening Links in Edge',
    category: 'Email & Collaboration',
    whenToUse: 'Use when Outlook link behavior needs to be changed for a Windows user.',
    prerequisites: 'The user has Outlook installed and the desired browser is already configured.',
    firstChecks: [
      'Confirm the current default browser settings.',
      'Check Outlook link behavior settings if available.',
      'Review the organization policy for browser defaults.'
    ],
    coreSteps: [
      'Open Windows default apps settings.',
      'Set the preferred browser as the default for web links.',
      'Restart Outlook and verify link behavior.'
    ],
    commonMistake: 'Assuming Outlook can change the default browser without Windows settings updates.',
    escalateIf: 'Links still open in the wrong browser after changing defaults.',
    relatedSkill: 'Email client troubleshooting',
    confidence: 'medium',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  },
  {
    id: 'demo-7',
    title: 'Increase Outlook PST and OST capacity',
    category: 'Email & Collaboration',
    whenToUse: 'Use when Outlook mailbox data file limits are causing storage or performance issues.',
    prerequisites: 'The Outlook profile is configured and the PST/OST file is accessible.',
    firstChecks: [
      'Verify the current PST/OST file locations and sizes.',
      'Confirm there is enough disk space available.',
      'Review mailbox size policies.'
    ],
    coreSteps: [
      'Adjust mailbox caching or archive settings.',
      'Create a new PST archive if needed.',
      'Restart Outlook and verify data file stability.'
    ],
    commonMistake: 'Growing the file without checking for damaged or corrupted data first.',
    escalateIf: 'Outlook errors persist after storage changes.',
    relatedSkill: 'Email data management',
    confidence: 'medium',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  },
  {
    id: 'demo-8',
    title: 'Editing Exchange Calendar Permissions with PowerShell',
    category: 'Email & Collaboration',
    whenToUse: 'Use when calendar permission changes must be scripted in Exchange Online.',
    prerequisites: 'Exchange Online PowerShell is available and the operator has permission to manage the mailbox.',
    firstChecks: [
      'Confirm the target mailbox and calendar folder.',
      'Verify the admin account has Exchange permissions.',
      'Review the desired permission level.'
    ],
    coreSteps: [
      'Connect to Exchange Online PowerShell.',
      'Run the permission update command with the correct mailbox and user.',
      'Validate the new calendar access settings.'
    ],
    commonMistake: 'Changing permissions without checking the correct mailbox alias or user identity.',
    escalateIf: 'Calendar access remains incorrect after the script runs.',
    relatedSkill: 'Exchange administration',
    confidence: 'high',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  },
  {
    id: 'demo-9',
    title: 'RDP Not Passing Through USB Drives',
    category: 'Networking & Remote Access',
    whenToUse: 'Use when a remote desktop session needs access to local USB devices.',
    prerequisites: 'The client and remote host support device redirection.',
    firstChecks: [
      'Verify RDP client settings allow local device redirection.',
      'Confirm the USB device is connected to the local machine.',
      'Check remote session policies for device redirection.'
    ],
    coreSteps: [
      'Enable local resources and USB device redirection in RDP settings.',
      'Reconnect to the remote desktop session.',
      'Test whether the USB drive appears on the remote host.'
    ],
    commonMistake: 'Forgetting to enable redirection before connecting.',
    escalateIf: 'The remote host blocks redirected devices or the session policy prevents access.',
    relatedSkill: 'Remote access troubleshooting',
    confidence: 'medium',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  },
  {
    id: 'demo-10',
    title: 'MHC Printer Configuration',
    category: 'Printing & Peripherals',
    whenToUse: 'Use when a managed printer or print queue needs safe, generic configuration practice.',
    prerequisites: 'The printer is connected to the network and the correct driver is available.',
    firstChecks: [
      'Verify the printer network path and connectivity.',
      'Confirm the correct driver or universal printer driver is selected.',
      'Review any required security or privacy settings for the environment.'
    ],
    coreSteps: [
      'Install or update the printer driver.',
      'Add the printer to the workstation and test a print page.',
      'Confirm print access and secure settings are applied.'
    ],
    commonMistake: 'Using the wrong driver or account context for the printer setup.',
    escalateIf: 'The printer remains unavailable or print jobs fail after configuration.',
    relatedSkill: 'Printer installation and configuration',
    confidence: 'medium',
    reviewStage: 1,
    createdAt: now,
    updatedAt: now,
    nextReviewAt: '2026-05-27',
    isDemo: true
  }
];
