import { Button } from '@/components/ui/button';
import { StatusBadge, type StatusBadgeVariant } from '@/components/academy/StatusBadge';
import {
  LearningIllustration,
  activityTypeToIllustration,
} from '@/components/learning/LearningIllustration';
import type { MspLearningActivityType } from '@/data/mspLearningActivities';
import { cn } from '@/lib/utils';

type LearningCardProps = {
  activityType: string;
  title: string;
  domain: string;
  minutes: number;
  difficulty: StatusBadgeVariant;
  summary?: string;
  isCompleted?: boolean;
  isRecommended?: boolean;
  onStart: () => void;
  onToggleComplete?: () => void;
  className?: string;
};

export function LearningCard({
  activityType,
  title,
  domain,
  minutes,
  difficulty,
  summary,
  isCompleted = false,
  isRecommended = false,
  onStart,
  onToggleComplete,
  className,
}: LearningCardProps) {
  const illustrationVariant = activityTypeToIllustration(activityType as MspLearningActivityType);

  return (
    <article
      className={cn(
        'academy-learning-card flex h-full flex-col rounded-xl border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/80',
        isCompleted
          ? 'border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20'
          : 'border-slate-200/80 dark:border-slate-800',
        isRecommended && !isCompleted && 'ring-1 ring-blue-200/80 dark:ring-blue-800/60',
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge variant="saved">{activityType}</StatusBadge>
          <StatusBadge variant={difficulty}>{difficulty}</StatusBadge>
        </div>
        <LearningIllustration variant={illustrationVariant} size="sm" decorative />
      </div>
      <h3 className="text-sm font-semibold leading-snug text-slate-900 dark:text-white">{title}</h3>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-800">{domain}</span>
        <span>{minutes} min</span>
      </div>
      {summary && (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {summary}
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <Button size="sm" className="flex-1" variant={isCompleted ? 'secondary' : 'default'} onClick={onStart}>
          {isCompleted ? 'Review' : 'Start'}
        </Button>
        {onToggleComplete && (
          <Button size="sm" variant="outline" onClick={onToggleComplete} aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}>
            {isCompleted ? '✓' : '○'}
          </Button>
        )}
      </div>
    </article>
  );
}
