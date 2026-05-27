import { cn } from '@/lib/utils';

type PageShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
};

export function PageShell({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
  className,
  narrow = false,
}: PageShellProps) {
  return (
    <div className={cn('academy-page py-8 sm:py-10', className)}>
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', narrow ? 'max-w-4xl' : 'max-w-7xl')}>
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </header>
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
