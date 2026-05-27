import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusBadgeVariant =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'completed'
  | 'review-due'
  | 'learning'
  | 'practised'
  | 'work-ready'
  | 'saved'
  | 'default';

const variantClasses: Record<StatusBadgeVariant, string> = {
  easy: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  medium: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  hard: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  'review-due': 'border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-200',
  learning: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200',
  practised: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  'work-ready': 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  saved: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
  default: '',
};

type StatusBadgeProps = {
  variant?: StatusBadgeVariant;
  children: React.ReactNode;
  className?: string;
};

export function StatusBadge({ variant = 'default', children, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium capitalize', variantClasses[variant], className)}>
      {children}
    </Badge>
  );
}
