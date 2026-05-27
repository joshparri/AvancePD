import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ icon: Icon, title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="flex gap-3">
        {Icon && (
          <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Icon className="h-4 w-4" aria-hidden />
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
