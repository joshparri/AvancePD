'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

type GameToastProps = {
  message: string;
  onDismiss: () => void;
  variant?: 'default' | 'bonus' | 'unlock' | 'shield';
};

export function GameToast({ message, onDismiss, variant = 'default' }: GameToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-lg',
        variant === 'bonus' && 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100',
        variant === 'unlock' && 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100',
        variant === 'shield' && 'border-blue-300 bg-blue-50 text-blue-950 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
        variant === 'default' && 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
      )}
      role="status"
    >
      {message}
    </div>
  );
}
