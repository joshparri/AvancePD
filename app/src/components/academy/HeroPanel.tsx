import { cn } from '@/lib/utils';

type HeroPanelProps = {
  title: string;
  subtitle?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  stats?: Array<{ label: string; value: string | number; helper?: string }>;
  className?: string;
};

export function HeroPanel({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  stats,
  className,
}: HeroPanelProps) {
  return (
    <section
      className={cn(
        'academy-hero relative overflow-hidden rounded-2xl border border-blue-100/80 p-6 shadow-sm dark:border-blue-900/40 sm:p-8',
        className
      )}
    >
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              {subtitle}
            </p>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap gap-2 pt-1">{primaryAction}{secondaryAction}</div>
          )}
        </div>
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[280px]">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                {stat.helper && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{stat.helper}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
