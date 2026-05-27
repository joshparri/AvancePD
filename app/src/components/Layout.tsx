import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
