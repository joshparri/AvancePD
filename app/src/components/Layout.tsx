import Link from 'next/link';
import { Navigation } from './Navigation';
import { AppFooter } from './AppFooter';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Navigation />
      <main className="flex-1">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-3 rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Quick links
              </p>
              <Link
                href="/app-links"
                className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                App Links
              </Link>
              <Link
                href="/"
                className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Dashboard
              </Link>
            </div>
          </aside>
          <div>{children}</div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
