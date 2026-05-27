export type KbConfidence =
  | 'recognise'
  | 'explain'
  | 'follow-with-kb'
  | 'with-support'
  | 'independent'
  | 'teach';

export type KbReviewRating = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface KbReviewHistoryEntry {
  rating: KbReviewRating;
  reviewedAt: string;
  nextReviewDate: string;
}

export interface KbFieldCard {
  id: string;
  title: string;
  category: string;
  whenToUse: string;
  prerequisites: string[];
  firstChecks: string[];
  coreSteps: string[];
  commonMistake: string;
  escalateIf: string;
  relatedSkill: string;
  confidence: KbConfidence;
  reviewDueDate: string;
  lastReviewedAt?: string;
  reviewHistory: KbReviewHistoryEntry[];
}

export const kbConfidenceLabels: Record<KbConfidence, string> = {
  recognise: 'I recognise it',
  explain: 'I can explain it',
  'follow-with-kb': 'I can follow it with the KB open',
  'with-support': 'I can do it with support',
  independent: 'I can do it independently',
  teach: 'I can teach it',
};

export const kbConfidenceRank: Record<KbConfidence, number> = {
  recognise: 1,
  explain: 2,
  'follow-with-kb': 3,
  'with-support': 4,
  independent: 5,
  teach: 6,
};

export const kbFieldCards: KbFieldCard[] = [
  {
    id: 'intune-enrolment',
    title: 'Intune enrolment',
    category: 'Devices',
    whenToUse: 'A new or rebuilt Windows device needs to be brought under standard device management.',
    prerequisites: [
      'The user identity and licence are ready.',
      'The device has stable internet access.',
      'Any required approval or handover context is recorded.',
    ],
    firstChecks: [
      'Confirm whether the device is new, rebuilt, or already in use.',
      'Check the expected owner/user and device naming convention.',
      'Confirm the user can sign in before changing enrolment state.',
    ],
    coreSteps: [
      'Confirm identity, licence, and device readiness.',
      'Start enrolment through the approved Windows/Intune path.',
      'Check that policies, apps, and compliance begin applying.',
      'Record what was checked, what changed, and any follow-up.',
    ],
    commonMistake: 'Treating enrolment as finished before compliance, apps, and user access have been checked.',
    escalateIf: 'Enrolment fails repeatedly, compliance blocks access, or a policy appears to affect more than one device.',
    relatedSkill: 'Intune and endpoint management',
    confidence: 'follow-with-kb',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'entra-profile-migration',
    title: 'Entra profile migration',
    category: 'Identity',
    whenToUse: 'A local Windows profile needs to move toward managed Entra sign-in without losing user work.',
    prerequisites: [
      'The target Entra account exists and can sign in.',
      'User files and app-specific data are identified.',
      'Rollback or support path is understood before profile changes.',
    ],
    firstChecks: [
      'Confirm what must be preserved from the local profile.',
      'Check whether the device is already joined or registered.',
      'Confirm any business-critical apps, mapped drives, or browser data.',
    ],
    coreSteps: [
      'Document the current sign-in/profile state.',
      'Confirm the managed account works before moving user data.',
      'Move required user data using the approved migration approach.',
      'Validate access, apps, files, and sign-in after migration.',
    ],
    commonMistake: 'Deleting or abandoning the local profile before proving the new profile has the user data and access needed.',
    escalateIf: 'The user has complex app data, profile corruption, sync errors, or uncertainty about data preservation.',
    relatedSkill: 'Entra ID and Windows profiles',
    confidence: 'follow-with-kb',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'jumpcloud-user-import',
    title: 'JumpCloud user import',
    category: 'Identity',
    whenToUse: 'A user needs to be represented in JumpCloud from an existing Microsoft 365 or Google Workspace identity.',
    prerequisites: [
      'The source account is confirmed.',
      'The target JumpCloud tenant and groups are known.',
      'Required approvals and role context are clear.',
    ],
    firstChecks: [
      'Confirm the user email and source directory.',
      'Check whether this is a new user or an existing account alignment.',
      'Confirm required group memberships before assigning access.',
    ],
    coreSteps: [
      'Locate or import the user using the approved admin workflow.',
      'Assign only the required groups and policies.',
      'Check authentication and required app access.',
      'Document groups, access, and any follow-up.',
    ],
    commonMistake: 'Assigning broad groups without confirming the role or approval path.',
    escalateIf: 'Authentication fails, group policy conflicts appear, or privileged access is requested.',
    relatedSkill: 'JumpCloud and identity lifecycle',
    confidence: 'recognise',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'google-2fa',
    title: 'Google 2FA',
    category: 'Security',
    whenToUse: 'A Google account needs two-factor authentication enabled or checked as part of account hardening.',
    prerequisites: [
      'The user can access the account.',
      'The approved second factor method is known.',
      'Recovery options are considered before changing sign-in requirements.',
    ],
    firstChecks: [
      'Confirm the account owner and whether this is setup or troubleshooting.',
      'Check if the user is already enrolled in any second factor.',
      'Confirm recovery path if the user loses access.',
    ],
    coreSteps: [
      'Guide the user through the approved 2FA setup path.',
      'Verify the second factor works with a test sign-in.',
      'Record the setup outcome without storing codes or secrets.',
      'Flag any recovery or policy follow-up.',
    ],
    commonMistake: 'Recording backup codes or sensitive recovery details in notes.',
    escalateIf: 'The user is locked out, recovery options are missing, or suspicious sign-in activity appears.',
    relatedSkill: 'Google Workspace security',
    confidence: 'explain',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'veeam-recovery',
    title: 'Veeam recovery',
    category: 'Backup/recovery',
    whenToUse: 'A file, folder, or system item needs to be restored from a known Veeam backup point.',
    prerequisites: [
      'The restore request and target item are clear.',
      'A suitable restore point exists.',
      'Overwrite risk and destination path are understood.',
    ],
    firstChecks: [
      'Confirm exactly what needs restoring and from when.',
      'Check last successful backup and available restore points.',
      'Confirm whether restoring might overwrite newer data.',
    ],
    coreSteps: [
      'Open the approved Veeam recovery workflow.',
      'Select the safest restore point and destination.',
      'Restore to a safe location when overwrite risk exists.',
      'Confirm the restored item opens and meets the request.',
    ],
    commonMistake: 'Restoring over live data without confirming the target path and overwrite risk.',
    escalateIf: 'Restore points are missing, backup health is unclear, or the request involves business-critical data.',
    relatedSkill: 'Backup and disaster recovery',
    confidence: 'recognise',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'outlook-links-edge',
    title: 'Outlook links opening in Edge',
    category: 'Microsoft 365',
    whenToUse: 'A user reports Outlook links opening in the wrong browser or behaving differently than expected.',
    prerequisites: [
      'The affected app and browser are identified.',
      'The desired default browser behaviour is confirmed.',
      'The user impact is understood.',
    ],
    firstChecks: [
      'Confirm whether the issue is Outlook desktop, webmail, or Teams.',
      'Check Windows default browser settings.',
      'Check Outlook or Microsoft 365 link handling settings if available.',
    ],
    coreSteps: [
      'Confirm current default app behaviour.',
      'Adjust the approved browser/link setting.',
      'Test with a safe link.',
      'Record the setting changed and result.',
    ],
    commonMistake: 'Changing multiple browser settings without testing the specific Outlook behaviour.',
    escalateIf: 'Policy controls the setting, the issue affects multiple users, or browser security settings are involved.',
    relatedSkill: 'Outlook support',
    confidence: 'explain',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'pst-ost-capacity',
    title: 'PST/OST capacity',
    category: 'Microsoft 365',
    whenToUse: 'Outlook performance or sync issues may be related to large local mailbox data files.',
    prerequisites: [
      'The mailbox type and data file type are known.',
      'Mailbox data is backed by the service or otherwise protected.',
      'The user impact is documented.',
    ],
    firstChecks: [
      'Confirm whether the issue is PST, OST, mailbox quota, or Outlook profile.',
      'Check file size and available disk space.',
      'Compare Outlook behaviour with webmail where possible.',
    ],
    coreSteps: [
      'Identify whether local file size is the likely issue.',
      'Use the approved remediation path for file size/profile/cache.',
      'Avoid deleting data unless recovery path is known.',
      'Test sync and document current status.',
    ],
    commonMistake: 'Assuming every Outlook problem is a data file size issue before checking webmail and profile health.',
    escalateIf: 'Data loss risk exists, mailbox quota is unclear, or registry/profile changes are being considered.',
    relatedSkill: 'Outlook troubleshooting',
    confidence: 'recognise',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'exchange-calendar-permissions',
    title: 'Exchange calendar permissions',
    category: 'Microsoft 365',
    whenToUse: 'A user needs access to view or manage another mailbox calendar.',
    prerequisites: [
      'The mailbox/calendar owner and requester are identified.',
      'Approval is confirmed for the requested access.',
      'The access level required is understood.',
    ],
    firstChecks: [
      'Confirm whether the request is view, edit, delegate, or send-related access.',
      'Check existing permissions and group-based access.',
      'Confirm whether Outlook restart or propagation time is expected.',
    ],
    coreSteps: [
      'Verify approval and required permission level.',
      'Apply the permission using the approved admin method.',
      'Test or advise expected propagation.',
      'Document access granted and owner/requester context generically.',
    ],
    commonMistake: 'Granting broader mailbox permissions when only calendar access was requested.',
    escalateIf: 'The calendar contains sensitive data, approval is missing, or permissions do not apply after expected propagation.',
    relatedSkill: 'Exchange Online administration',
    confidence: 'follow-with-kb',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'rdp-usb-passthrough',
    title: 'RDP USB passthrough',
    category: 'Remote access',
    whenToUse: 'A user in an RDP session cannot access a local USB device that should redirect.',
    prerequisites: [
      'The USB device type and business need are known.',
      'The remote access method is identified.',
      'Security and policy implications are considered.',
    ],
    firstChecks: [
      'Confirm the USB device works locally.',
      'Check RDP local resource redirection settings.',
      'Confirm whether policy or server configuration blocks redirection.',
    ],
    coreSteps: [
      'Check local device health before changing RDP settings.',
      'Confirm redirection settings in the RDP client.',
      'Reconnect the session and test the device.',
      'Document whether the block is local, client, policy, or server-side.',
    ],
    commonMistake: 'Changing server settings before proving the USB device and local redirection settings work.',
    escalateIf: 'The device is security-sensitive, redirection is blocked by policy, or multiple users are affected.',
    relatedSkill: 'Remote desktop troubleshooting',
    confidence: 'recognise',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'yealink-provisioning',
    title: 'Yealink provisioning',
    category: 'Phones',
    whenToUse: 'A Yealink handset needs to be provisioned or checked against a managed phone configuration.',
    prerequisites: [
      'The handset model and MAC address are known.',
      'The extension/user assignment is approved.',
      'Network connectivity and voice service context are available.',
    ],
    firstChecks: [
      'Confirm the phone model, MAC address, and firmware state.',
      'Check network link and whether the phone can reach provisioning.',
      'Confirm extension assignment before applying settings.',
    ],
    coreSteps: [
      'Add or verify the handset record in the approved provisioning system.',
      'Apply the correct profile for the extension/user.',
      'Reboot or reprovision the phone.',
      'Test registration, inbound, and outbound calls.',
    ],
    commonMistake: 'Using the wrong MAC address, profile, or extension and then troubleshooting the wrong handset.',
    escalateIf: 'The handset cannot register, multiple phones are affected, or voice routing/service health is unclear.',
    relatedSkill: 'VoIP and handset provisioning',
    confidence: 'recognise',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'printer-configuration',
    title: 'Printer configuration',
    category: 'Printing',
    whenToUse: 'A workstation or user needs printer access recreated, corrected, or tested.',
    prerequisites: [
      'The printer, site, and user need are known.',
      'Driver/source path or print server context is known if required.',
      'The user impact and urgency are understood.',
    ],
    firstChecks: [
      'Confirm whether one user, one device, or many users are affected.',
      'Check printer power/network/status before workstation settings.',
      'Confirm the correct printer and queue.',
    ],
    coreSteps: [
      'Verify printer status and network reachability.',
      'Add or correct the printer using the approved method.',
      'Print a test page or confirm user workflow.',
      'Document printer, device, and outcome generically.',
    ],
    commonMistake: 'Reinstalling drivers before checking whether the printer itself is offline or the wrong queue is selected.',
    escalateIf: 'A shared print server is involved, many users are affected, or specialist label/finance printing is impacted.',
    relatedSkill: 'Printer troubleshooting',
    confidence: 'explain',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
  {
    id: 'sharepoint-onedrive-malicious-file-policy',
    title: 'SharePoint/OneDrive malicious file policy',
    category: 'Security',
    whenToUse: 'A tenant needs malicious file detection or related SharePoint/OneDrive protection checked.',
    prerequisites: [
      'The tenant/security scope is approved.',
      'The desired protection behaviour is understood.',
      'Any change-management requirement is clear.',
    ],
    firstChecks: [
      'Confirm this is a review, setup, or troubleshooting request.',
      'Check current policy state before changing anything.',
      'Confirm whether alerts, quarantine, or user impact are expected.',
    ],
    coreSteps: [
      'Review current SharePoint/OneDrive protection policy state.',
      'Compare against the approved security baseline.',
      'Document gaps and proposed change before applying risky changes.',
      'Record outcome and any required monitoring follow-up.',
    ],
    commonMistake: 'Changing a security policy without confirming scope, approval, and expected user impact.',
    escalateIf: 'A policy change could affect many users, suspicious files are active, or approval/security ownership is unclear.',
    relatedSkill: 'Microsoft 365 security',
    confidence: 'recognise',
    reviewDueDate: '2026-05-27',
    reviewHistory: [],
  },
];
