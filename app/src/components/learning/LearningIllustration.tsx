import { cn } from '@/lib/utils';
import type { MspLearningActivityType } from '@/data/mspLearningActivities';

export type LearningIllustrationVariant =
  | 'dashboard-command-centre'
  | 'learning-cockpit'
  | 'kb-field-card'
  | 'scenario-practice'
  | 'ticket-note'
  | 'evidence-pack'
  | 'm365-identity'
  | 'endpoint-device'
  | 'network-troubleshooting'
  | 'security-mfa'
  | 'external-learning'
  | 'activity-flashcard'
  | 'activity-scenario'
  | 'activity-quiz'
  | 'activity-roleplay'
  | 'activity-read'
  | 'activity-checklist';

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
} as const;

const altText: Record<LearningIllustrationVariant, string> = {
  'dashboard-command-centre': 'MSP learning command centre',
  'learning-cockpit': 'Learning cockpit workspace',
  'kb-field-card': 'Knowledge base field study cards',
  'scenario-practice': 'Scenario practice ticket',
  'ticket-note': 'Support ticket documentation',
  'evidence-pack': 'Professional growth evidence report',
  'm365-identity': 'Cloud identity and access',
  'endpoint-device': 'Endpoint device management',
  'network-troubleshooting': 'Network troubleshooting map',
  'security-mfa': 'Multi-factor authentication security',
  'external-learning': 'External learning resources',
  'activity-flashcard': 'Flashcard recall activity',
  'activity-scenario': 'Scenario practice activity',
  'activity-quiz': 'Quiz assessment activity',
  'activity-roleplay': 'Role-play communication activity',
  'activity-read': 'Reading study activity',
  'activity-checklist': 'Checklist evidence activity',
};

type LearningIllustrationProps = {
  variant: LearningIllustrationVariant;
  size?: keyof typeof sizeClasses;
  className?: string;
  decorative?: boolean;
};

function SvgShell({
  children,
  className,
  title,
  decorative,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  decorative?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 text-blue-600 dark:text-blue-400', className)}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative}
      aria-label={decorative ? undefined : title}
    >
      {!decorative && <title>{title}</title>}
      {children}
    </svg>
  );
}

function DashboardCommandCentre({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['dashboard-command-centre']} decorative={decorative}>
      <rect x="8" y="14" width="44" height="28" rx="4" stroke="currentColor" strokeWidth="2" className="fill-blue-50 dark:fill-blue-950/40" />
      <rect x="14" y="20" width="20" height="3" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="14" y="26" width="28" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <circle cx="58" cy="24" r="10" stroke="currentColor" strokeWidth="2" className="fill-emerald-50 dark:fill-emerald-950/40" />
      <path d="M54 24l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="20" y="50" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="36" y="46" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" className="fill-blue-100/60 dark:fill-blue-900/30" />
      <rect x="52" y="52" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </SvgShell>
  );
}

function LearningCockpit({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['learning-cockpit']} decorative={decorative}>
      <rect x="10" y="12" width="60" height="40" rx="5" stroke="currentColor" strokeWidth="2" className="fill-slate-50 dark:fill-slate-900/50" />
      <circle cx="24" cy="28" r="6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="34" y="24" width="28" height="3" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="34" y="30" width="20" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="16" y="42" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" className="fill-blue-100/50 dark:fill-blue-900/30" />
      <rect x="33" y="42" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="50" y="42" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 58l-6 8h12l-6-8z" stroke="currentColor" strokeWidth="1.5" className="fill-blue-50 dark:fill-blue-950/30" />
    </SvgShell>
  );
}

function KbFieldCard({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['kb-field-card']} decorative={decorative}>
      <rect x="18" y="10" width="36" height="48" rx="4" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-slate-900/60" />
      <rect x="24" y="18" width="24" height="3" rx="1" fill="currentColor" opacity="0.45" />
      <rect x="24" y="24" width="18" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="24" y="30" width="20" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="8" y="18" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <rect x="50" y="22" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <circle cx="40" cy="52" r="4" stroke="currentColor" strokeWidth="1.5" />
    </SvgShell>
  );
}

function ScenarioPractice({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['scenario-practice']} decorative={decorative}>
      <rect x="12" y="16" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" className="fill-amber-50/80 dark:fill-amber-950/30" />
      <rect x="18" y="22" width="20" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="18" y="28" width="28" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="18" y="34" width="24" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <path d="M56 20v28M56 20h10l-4 6 4 6H56" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </SvgShell>
  );
}

function TicketNote({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['ticket-note']} decorative={decorative}>
      <path d="M20 12h32l8 8v44H20V12z" stroke="currentColor" strokeWidth="2" className="fill-slate-50 dark:fill-slate-900/50" />
      <path d="M52 12v8h8" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="28" width="28" height="2" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="26" y="34" width="22" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="26" y="40" width="26" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="26" y="50" width="16" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" className="fill-emerald-50 dark:fill-emerald-950/30" />
    </SvgShell>
  );
}

function EvidencePack({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['evidence-pack']} decorative={decorative}>
      <rect x="14" y="10" width="52" height="56" rx="5" stroke="currentColor" strokeWidth="2" className="fill-indigo-50/80 dark:fill-indigo-950/30" />
      <rect x="22" y="20" width="28" height="3" rx="1" fill="currentColor" opacity="0.45" />
      <path d="M22 30h12v8H22zM38 30h12v5H38zM22 42h28v3H22z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M50 52l6 6 10-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400" />
    </SvgShell>
  );
}

function M365Identity({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['m365-identity']} decorative={decorative}>
      <ellipse cx="40" cy="28" rx="22" ry="12" stroke="currentColor" strokeWidth="2" className="fill-blue-50/80 dark:fill-blue-950/30" />
      <circle cx="40" cy="48" r="10" stroke="currentColor" strokeWidth="2" />
      <rect x="34" y="44" width="12" height="8" rx="2" fill="currentColor" opacity="0.2" />
      <path d="M28 58h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </SvgShell>
  );
}

function EndpointDevice({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['endpoint-device']} decorative={decorative}>
      <rect x="14" y="18" width="52" height="34" rx="4" stroke="currentColor" strokeWidth="2" className="fill-slate-50 dark:fill-slate-900/50" />
      <rect x="20" y="24" width="40" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <rect x="32" y="54" width="16" height="4" rx="1" fill="currentColor" opacity="0.35" />
      <circle cx="58" cy="58" r="8" stroke="currentColor" strokeWidth="1.5" className="fill-emerald-50 dark:fill-emerald-950/30" />
      <path d="M55 58l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </SvgShell>
  );
}

function NetworkTroubleshooting({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['network-troubleshooting']} decorative={decorative}>
      <circle cx="20" cy="40" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="24" r="8" stroke="currentColor" strokeWidth="2" className="fill-blue-50 dark:fill-blue-950/30" />
      <circle cx="60" cy="40" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="58" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M28 36l8-6M48 30l8 6M48 46l8-2M32 46l4 6" stroke="currentColor" strokeWidth="1.5" />
    </SvgShell>
  );
}

function SecurityMfa({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['security-mfa']} decorative={decorative}>
      <path d="M40 14l18 8v16c0 10-8 18-18 22-10-4-18-12-18-22V22l18-8z" stroke="currentColor" strokeWidth="2" className="fill-blue-50/80 dark:fill-blue-950/30" />
      <rect x="32" y="30" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="36" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M52 52h8v8h-8zM56 56v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </SvgShell>
  );
}

function ExternalLearning({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['external-learning']} decorative={decorative}>
      <rect x="12" y="20" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M52 32h12M58 26v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="18" y="28" width="20" height="2" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="18" y="34" width="28" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <circle cx="28" cy="44" r="4" stroke="currentColor" strokeWidth="1.5" />
    </SvgShell>
  );
}

function ActivityFlashcard({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['activity-flashcard']} decorative={decorative}>
      <rect x="16" y="14" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2" className="fill-blue-50 dark:fill-blue-950/30" />
      <rect x="28" y="20" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <text x="26" y="36" fontSize="10" fill="currentColor" opacity="0.6">?</text>
    </SvgShell>
  );
}

function ActivityScenario({ className, decorative }: { className?: string; decorative?: boolean }) {
  return <ScenarioPractice className={className} decorative={decorative} />;
}

function ActivityQuiz({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['activity-quiz']} decorative={decorative}>
      <rect x="14" y="16" width="52" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" className="fill-blue-100 dark:fill-blue-900/40" />
      <rect x="32" y="28" width="26" height="2" rx="1" fill="currentColor" opacity="0.35" />
      <circle cx="24" cy="42" r="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="32" y="40" width="20" height="2" rx="1" fill="currentColor" opacity="0.25" />
      <circle cx="24" cy="54" r="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="32" y="52" width="24" height="2" rx="1" fill="currentColor" opacity="0.25" />
    </SvgShell>
  );
}

function ActivityRoleplay({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['activity-roleplay']} decorative={decorative}>
      <path d="M18 44c0-8 6-14 14-14h16c8 0 14 6 14 14" stroke="currentColor" strokeWidth="2" />
      <circle cx="30" cy="28" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="28" r="8" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <path d="M24 52h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </SvgShell>
  );
}

function ActivityRead({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['activity-read']} decorative={decorative}>
      <path d="M20 16h16v48H20c0-8-4-12-8-14V16zM44 16h16v34c-4 2-8 6-8 14H44V16z" stroke="currentColor" strokeWidth="2" className="fill-slate-50 dark:fill-slate-900/50" />
      <path d="M36 16v48" stroke="currentColor" strokeWidth="1.5" />
    </SvgShell>
  );
}

function ActivityChecklist({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <SvgShell className={className} title={altText['activity-checklist']} decorative={decorative}>
      <rect x="18" y="14" width="44" height="52" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M26 28l4 4 8-8M26 42l4 4 8-8M26 56l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44" y="26" width="12" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="44" y="40" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="44" y="54" width="14" height="2" rx="1" fill="currentColor" opacity="0.3" />
    </SvgShell>
  );
}

const illustrations: Record<
  LearningIllustrationVariant,
  React.ComponentType<{ className?: string; decorative?: boolean }>
> = {
  'dashboard-command-centre': DashboardCommandCentre,
  'learning-cockpit': LearningCockpit,
  'kb-field-card': KbFieldCard,
  'scenario-practice': ScenarioPractice,
  'ticket-note': TicketNote,
  'evidence-pack': EvidencePack,
  'm365-identity': M365Identity,
  'endpoint-device': EndpointDevice,
  'network-troubleshooting': NetworkTroubleshooting,
  'security-mfa': SecurityMfa,
  'external-learning': ExternalLearning,
  'activity-flashcard': ActivityFlashcard,
  'activity-scenario': ActivityScenario,
  'activity-quiz': ActivityQuiz,
  'activity-roleplay': ActivityRoleplay,
  'activity-read': ActivityRead,
  'activity-checklist': ActivityChecklist,
};

export function activityTypeToIllustration(
  activityType: MspLearningActivityType
): LearningIllustrationVariant {
  const map: Partial<Record<MspLearningActivityType, LearningIllustrationVariant>> = {
    flashcard: 'activity-flashcard',
    scenario: 'activity-scenario',
    quiz: 'activity-quiz',
    roleplay: 'activity-roleplay',
    read: 'activity-read',
    watch: 'activity-read',
    checklist: 'activity-checklist',
    'ticket-note': 'ticket-note',
    'troubleshooting-flow': 'network-troubleshooting',
    'command-practice': 'endpoint-device',
    reflection: 'learning-cockpit',
    'mini-project': 'evidence-pack',
  };
  return map[activityType] ?? 'learning-cockpit';
}

export function scenarioCategoryToIllustration(category: string): LearningIllustrationVariant {
  const lower = category.toLowerCase();
  if (lower.includes('entra') || lower.includes('identity')) return 'm365-identity';
  if (lower.includes('365') || lower.includes('outlook') || lower.includes('email')) return 'm365-identity';
  if (lower.includes('endpoint') || lower.includes('intune') || lower.includes('windows')) return 'endpoint-device';
  if (lower.includes('network') || lower.includes('wi-fi') || lower.includes('wifi')) return 'network-troubleshooting';
  if (lower.includes('security') || lower.includes('cyber')) return 'security-mfa';
  if (lower.includes('backup')) return 'evidence-pack';
  return 'scenario-practice';
}

export function LearningIllustration({
  variant,
  size = 'md',
  className,
  decorative = false,
}: LearningIllustrationProps) {
  const Illustration = illustrations[variant];
  return (
    <div className={cn('flex items-center justify-center', sizeClasses[size], className)}>
      <Illustration className="h-full w-full" decorative={decorative} />
    </div>
  );
}
