import { cn } from '@/lib/utils';

export type LearningDiagramVariant = 'ticket-lifecycle' | 'troubleshooting-ladder' | 'learning-loop';

const diagramLabels: Record<LearningDiagramVariant, string> = {
  'ticket-lifecycle': 'Ticket lifecycle from request to evidence',
  'troubleshooting-ladder': 'Troubleshooting ladder from scope to escalation',
  'learning-loop': 'Learning loop from study to review',
};

type LearningDiagramProps = {
  variant: LearningDiagramVariant;
  className?: string;
  compact?: boolean;
};

type Step = { label: string };

function FlowDiagram({
  steps,
  title,
  className,
  compact,
}: {
  steps: Step[];
  title: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <figure
      className={cn(
        'rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40',
        className
      )}
      aria-label={title}
    >
      <figcaption className="sr-only">{title}</figcaption>
      <ol
        className={cn(
          'flex flex-wrap items-center gap-2',
          compact ? 'text-[11px]' : 'text-xs'
        )}
      >
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-lg border border-blue-200/80 bg-white px-2.5 py-1.5 font-medium text-slate-700 dark:border-blue-900/50 dark:bg-slate-900/60 dark:text-slate-200',
                compact ? 'px-2 py-1' : 'px-2.5 py-1.5'
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <span className="text-blue-500 dark:text-blue-400" aria-hidden>
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}

const diagramSteps: Record<LearningDiagramVariant, Step[]> = {
  'ticket-lifecycle': [
    { label: 'Request' },
    { label: 'Checks' },
    { label: 'Action' },
    { label: 'Result' },
    { label: 'Evidence' },
  ],
  'troubleshooting-ladder': [
    { label: 'Scope' },
    { label: 'First check' },
    { label: 'Safe action' },
    { label: 'Escalate' },
  ],
  'learning-loop': [
    { label: 'Learn' },
    { label: 'Practise' },
    { label: 'Reflect' },
    { label: 'Save evidence' },
    { label: 'Review' },
  ],
};

export function LearningDiagram({ variant, className, compact = false }: LearningDiagramProps) {
  return (
    <FlowDiagram
      steps={diagramSteps[variant]}
      title={diagramLabels[variant]}
      className={className}
      compact={compact}
    />
  );
}
