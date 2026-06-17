"use client";

import { useEffect, useState } from 'react';
import { loadHealthState, saveHealthState } from '@/shared/health/healthOutdoors';
import { notifyStateUpdated } from '@/shared/health/eyeCareCoordinator';

export default function EyeCareSettingsPage() {
  const [state, setState] = useState(() => loadHealthState());

  useEffect(() => {
    const id = setInterval(() => setState(loadHealthState()), 2000);
    return () => clearInterval(id);
  }, []);

  const toggleEyeCare = () => {
    const s = loadHealthState();
    s.settings.eyeCareWorkModeEnabled = !s.settings.eyeCareWorkModeEnabled;
    s.settings.updatedAt = new Date().toISOString();
    saveHealthState(s);
    notifyStateUpdated();
    setState(s);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Eye Care Settings</h1>
      <div className="mt-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={state.settings.eyeCareWorkModeEnabled} onChange={toggleEyeCare} />
          Enable Eye Care Work Mode
        </label>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Schedule</h2>
        <p className="text-sm text-muted-foreground">Configure days and times in a later iteration.</p>
      </div>
    </div>
  );
}
