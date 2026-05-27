'use client';

import type { SaveStatusState } from '@/hooks/useSaveStatus';

type SaveStatusProps = {
  status: SaveStatusState;
  savedMessage?: string;
  className?: string;
};

export function SaveStatus({
  status,
  savedMessage = 'Saved to Evidence Pack',
  className = '',
}: SaveStatusProps) {
  if (status === 'idle') return null;

  const message =
    status === 'saving'
      ? 'Saving...'
      : status === 'saved'
        ? savedMessage
        : 'Could not save. Try again.';

  const tone =
    status === 'error'
      ? 'text-red-600 dark:text-red-400'
      : status === 'saved'
        ? 'text-green-600 dark:text-green-400'
        : 'text-muted-foreground';

  return <p className={`text-sm ${tone} ${className}`}>{message}</p>;
}
