import type { AvanceProgress } from '../utils/progressStorage';
import type { LearningItem } from '../types';

export type KbFieldCard = {
  id: string;
  title: string;
  category: string;
  whenToUse: string;
  prerequisites: string;
  firstChecks: string[];
  coreSteps: string[];
  commonMistake: string;
  escalateIf: string;
  relatedSkill: string;
  confidence: string;
  reviewStage: number;
  createdAt: string;
  updatedAt: string;
  nextReviewAt: string;
  isDemo: boolean;
};

export const kbFieldCardsStorageKey = 'avancepd.kbFieldCards';

export const kbCategories = [
  'Identity',
  'Microsoft 365',
  'Devices',
  'Security',
  'Backup/recovery',
  'Printing',
  'Networking',
  'Unknown'
];

export const kbConfidenceLevels = [
  'I recognise it',
  'I can explain it',
  'I can follow it with the KB open',
  'I can do it with support',
  'I can do it independently',
  'I can teach it'
];

const seedDate = '2026-05-27';

export const demoKbFieldCards: KbFieldCard[] = [
  makeDemoCard({
    id: 'demo-intune-enrolment',
    title: 'Enrolling a New Computer into Intune',
    category: 'Devices',
    relatedSkill: 'Intune',
    whenToUse: 'A new or rebuilt workstation needs to be enrolled into cloud device management.',
    prerequisites: 'Confirm tenant, user readiness, device ownership, and any existing build standard.',
    firstChecks: ['Confirm the device is ready for enrolment', 'Check the user has the expected account access', 'Confirm whether local data needs to be preserved'],
    coreSteps: ['Prepare the device', 'Follow the approved enrolment path', 'Verify policy and app deployment', 'Record a generic completion note'],
    commonMistake: 'Starting enrolment before confirming profile or data requirements.',
    escalateIf: 'Policy assignment is unclear, enrolment loops, or data migration risk exists.'
  }),
  makeDemoCard({
    id: 'demo-entra-migration',
    title: 'Migrating Local User Account to Entra Account',
    category: 'Identity',
    relatedSkill: 'Entra ID',
    whenToUse: 'A device needs to move from a local profile to a cloud identity workflow.',
    prerequisites: 'Confirm backup state, profile data needs, sign-in method, and rollback options.',
    firstChecks: ['Identify current sign-in method', 'Confirm user data locations', 'Check whether the task needs senior oversight'],
    coreSteps: ['Capture before-state', 'Prepare target identity', 'Migrate carefully', 'Verify sign-in, apps, sync, and files'],
    commonMistake: 'Treating identity migration like a quick sign-in change.',
    escalateIf: 'Profile data is critical, encryption is involved, or rollback is unclear.'
  }),
  makeDemoCard({
    id: 'demo-jumpcloud-import',
    title: 'Importing Office 365 or Google GSuite User into JumpCloud',
    category: 'Identity',
    relatedSkill: 'JumpCloud',
    whenToUse: 'A cloud user needs to be represented in JumpCloud for identity or device management.',
    prerequisites: 'Confirm source system, target user, naming convention, and duplicate-user risk.',
    firstChecks: ['Check whether the user already exists', 'Confirm source identity', 'Confirm required groups or policies'],
    coreSteps: ['Find the source user', 'Import or link the identity', 'Apply required groups', 'Verify sign-in expectations'],
    commonMistake: 'Creating duplicate users or applying the wrong group.',
    escalateIf: 'Identity data conflicts, sync errors, or group membership is unclear.'
  }),
  makeDemoCard({
    id: 'demo-google-2fa',
    title: 'Turning on 2 Factor Authentication for Google Account',
    category: 'Security',
    relatedSkill: 'Google Workspace',
    whenToUse: 'A user needs stronger sign-in protection for a Google account.',
    prerequisites: 'Confirm user identity, recovery options, device availability, and policy expectations.',
    firstChecks: ['Confirm the right account', 'Check recovery options', 'Confirm the user can complete setup'],
    coreSteps: ['Open security settings', 'Enable 2FA using the approved method', 'Confirm sign-in works', 'Record a safe note'],
    commonMistake: 'Enabling 2FA before recovery options are checked.',
    escalateIf: 'The user is locked out, recovery details are stale, or admin policy conflicts appear.'
  }),
  makeDemoCard({
    id: 'demo-veeam-recovery',
    title: 'Veeam Agent Recovery Guide',
    category: 'Backup/recovery',
    relatedSkill: 'Backup/recovery',
    whenToUse: 'A file, workstation, or system recovery needs to be checked through backup tooling.',
    prerequisites: 'Confirm restore scope, recovery point, approval, and overwrite risk.',
    firstChecks: ['Confirm the restore target', 'Check backup recency', 'Confirm restore destination'],
    coreSteps: ['Find the restore point', 'Choose the safest restore path', 'Validate recovered data', 'Document result and limits'],
    commonMistake: 'Restoring before confirming scope, approval, or overwrite risk.',
    escalateIf: 'Restore points are missing, data loss risk exists, or production systems are affected.'
  }),
  makeDemoCard({
    id: 'demo-outlook-links-edge',
    title: 'Outlook Opening Links in Edge',
    category: 'Microsoft 365',
    relatedSkill: 'Outlook',
    whenToUse: 'A user reports Outlook links opening in an unexpected browser.',
    prerequisites: 'Confirm Outlook version, default browser expectation, and policy limitations.',
    firstChecks: ['Check default apps', 'Check Outlook settings', 'Check whether policy controls the behavior'],
    coreSteps: ['Review app/browser settings', 'Adjust supported preference if allowed', 'Test a link', 'Capture result'],
    commonMistake: 'Changing browser settings without checking whether Outlook or policy controls the behavior.',
    escalateIf: 'Settings revert, policy is unclear, or multiple users are affected.'
  }),
  makeDemoCard({
    id: 'demo-pst-ost-capacity',
    title: 'Increase Outlook PST and OST capacity',
    category: 'Microsoft 365',
    relatedSkill: 'Outlook',
    whenToUse: 'Outlook mailbox/cache size is causing performance or storage issues.',
    prerequisites: 'Confirm mailbox size, Outlook mode, storage limits, and whether cleanup is safer.',
    firstChecks: ['Check mailbox/cache size', 'Check disk space', 'Confirm whether webmail works'],
    coreSteps: ['Review size limits', 'Choose cleanup/archive/config option', 'Test Outlook behavior', 'Record risk and result'],
    commonMistake: 'Increasing limits instead of addressing root cause or storage constraints.',
    escalateIf: 'Large mailboxes, corruption symptoms, or organisation policy questions are involved.'
  }),
  makeDemoCard({
    id: 'demo-exchange-calendar-permissions',
    title: 'Editing Exchange Calendar Permissions with PowerShell',
    category: 'Microsoft 365',
    relatedSkill: 'Exchange Online',
    whenToUse: 'Calendar access needs to be reviewed or adjusted in Exchange Online.',
    prerequisites: 'Confirm approval, mailbox/calendar target, requested access level, and admin permission.',
    firstChecks: ['Confirm the exact mailbox/calendar', 'Confirm access level requested', 'Check existing permissions'],
    coreSteps: ['Connect to the admin tool safely', 'Review current permissions', 'Apply approved change', 'Verify access and note outcome'],
    commonMistake: 'Changing permissions without confirming the requested access level or owner approval.',
    escalateIf: 'Permissions are complex, shared mailboxes are involved, or admin access is unclear.'
  }),
  makeDemoCard({
    id: 'demo-rdp-usb',
    title: 'RDP Not Passing Through USB Drives',
    category: 'Networking',
    relatedSkill: 'Remote access',
    whenToUse: 'A remote desktop session does not show expected redirected local USB or storage devices.',
    prerequisites: 'Confirm session type, local device, policy restrictions, and whether redirection is approved.',
    firstChecks: ['Check the local device works', 'Check RDP redirection settings', 'Check policy/session restrictions'],
    coreSteps: ['Verify local settings', 'Reconnect with redirection enabled', 'Check server-side policy', 'Document what is blocked or allowed'],
    commonMistake: 'Assuming the remote server is broken before checking local redirection and policy.',
    escalateIf: 'Policy blocks redirection, device data is sensitive, or server configuration needs change approval.'
  }),
  makeDemoCard({
    id: 'demo-mhc-printer',
    title: 'MHC Printer Configuration',
    category: 'Printing',
    relatedSkill: 'Printers',
    whenToUse: 'A printer or queue needs to be recreated, mapped, or checked after a device or network change.',
    prerequisites: 'Confirm printer identity, network path, driver requirement, and user impact.',
    firstChecks: ['Check printer power/network state', 'Check queue/driver', 'Confirm whether other users are affected'],
    coreSteps: ['Verify connection path', 'Install or repair queue', 'Print a test page', 'Record generic result'],
    commonMistake: 'Reinstalling without checking whether the issue is printer-wide, network-wide, or user-specific.',
    escalateIf: 'Multiple users are affected, print server changes are needed, or admin access is unclear.'
  })
];

export function loadKbFieldCards(): KbFieldCard[] {
  if (typeof window === 'undefined') return demoKbFieldCards;

  try {
    const raw = window.localStorage.getItem(kbFieldCardsStorageKey);
    const savedCards = raw ? (JSON.parse(raw) as KbFieldCard[]) : [];
    return [...demoKbFieldCards, ...savedCards.filter((card) => !card.isDemo).map(normalizeUserCard)];
  } catch {
    return demoKbFieldCards;
  }
}

export function saveUserKbFieldCards(cards: KbFieldCard[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(kbFieldCardsStorageKey, JSON.stringify(cards.filter((card) => !card.isDemo)));
}

export function getKbLearningMetrics(
  cards = loadKbFieldCards(),
  progress?: AvanceProgress,
  learningItems: LearningItem[] = []
) {
  const today = todayIso();
  const reviewsDue = cards.filter((card) => card.nextReviewAt <= today).length;
  const scenariosCompleted = progress
    ? Object.values(progress.scenarioProgress).filter((item) => item.status === 'practised' || item.status === 'confident').length
    : 0;
  const evidenceItems = learningItems.filter((item) => item.evidenceWorthy).length + (progress?.ticketNotePracticeCount ?? 0);

  return {
    kbCards: cards.length,
    reviewsDue,
    scenariosCompleted,
    evidenceItems
  };
}

export function scheduleNextReview(card: KbFieldCard) {
  const nextStage = Math.min(card.reviewStage + 1, 5);
  const intervals = [1, 3, 7, 14, 30, 45];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervals[nextStage]);

  return {
    ...card,
    reviewStage: nextStage,
    updatedAt: new Date().toISOString(),
    nextReviewAt: nextDate.toISOString().slice(0, 10)
  };
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function makeDemoCard(card: Omit<KbFieldCard, 'confidence' | 'reviewStage' | 'createdAt' | 'updatedAt' | 'nextReviewAt' | 'isDemo'>): KbFieldCard {
  return {
    ...card,
    confidence: 'I recognise it',
    reviewStage: 0,
    createdAt: seedDate,
    updatedAt: seedDate,
    nextReviewAt: seedDate,
    isDemo: true
  };
}

function normalizeUserCard(card: KbFieldCard): KbFieldCard {
  return {
    ...card,
    id: card.id || `kb-${Date.now()}`,
    title: card.title || 'Untitled KB field card',
    category: card.category || 'Unknown',
    firstChecks: Array.isArray(card.firstChecks) ? card.firstChecks : [],
    coreSteps: Array.isArray(card.coreSteps) ? card.coreSteps : [],
    confidence: card.confidence || 'I recognise it',
    reviewStage: Number.isFinite(card.reviewStage) ? card.reviewStage : 0,
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    nextReviewAt: card.nextReviewAt || todayIso(),
    isDemo: false
  };
}
