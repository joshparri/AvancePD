'use client';

import { useCallback, useState } from 'react';

export type SaveStatusState = 'idle' | 'saving' | 'saved' | 'error';

export function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatusState>('idle');

  const runSave = useCallback(async (saveFn: () => void | Promise<void>) => {
    setStatus('saving');
    try {
      await saveFn();
      setStatus('saved');
      window.setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
      window.setTimeout(() => setStatus('idle'), 3000);
    }
  }, []);

  const reset = useCallback(() => setStatus('idle'), []);

  return { status, runSave, reset };
}
