import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  helper?: string;
  className?: string;
};

export function StatCard({ icon: Icon, label, value, helper, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'academy-stat-card group rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
          {helper && <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p>}
        </div>
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600 transition group-hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </div>
    </div>
  );
}
