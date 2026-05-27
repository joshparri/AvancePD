'use client';

import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/contexts/dark-mode';
import { cn } from '@/lib/utils';

type DarkModeToggleProps = {
  showLabel?: boolean;
  className?: string;
};

export function DarkModeToggle({ showLabel = false, className }: DarkModeToggleProps) {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
        className
      )}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Light mode' : 'Dark mode'}
    >
      {darkMode ? (
        <Sun className="h-5 w-5 shrink-0 text-amber-400" aria-hidden />
      ) : (
        <Moon className="h-5 w-5 shrink-0 text-slate-600" aria-hidden />
      )}
      {showLabel && <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>}
    </button>
  );
}
