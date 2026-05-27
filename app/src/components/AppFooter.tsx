import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/50 py-4 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
        <p>Avance PD · Local-first · Data stays in your browser</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/health-outdoors" className="hover:text-blue-600 dark:hover:text-blue-400">
            Health
          </Link>
          <Link href="/work-logs" className="hover:text-blue-600 dark:hover:text-blue-400">
            Work logs
          </Link>
          <Link href="/evidence-pack" className="hover:text-blue-600 dark:hover:text-blue-400">
            Evidence
          </Link>
        </div>
      </div>
    </footer>
  );
}
