"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  loadHealthState,
  saveHealthState,
  getTodayLog,
  getNextHealthReminder,
  timeToMinutes,
} from '@/shared/health/healthOutdoors';
import { triggerReminderNow, notifyStateUpdated } from '@/shared/health/eyeCareCoordinator';

function formatTimeToNext(reminderTime?: string) {
  if (!reminderTime) return 'No scheduled action';
  const [h, m] = reminderTime.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(now.getDate() + 1);
  const diff = Math.max(0, Math.round((target.getTime() - now.getTime()) / 1000));
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return `${minutes}m ${seconds}s`;
}

function Timer({ initialSeconds }: { initialSeconds: number }) {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="p-2 border rounded">
      <div className="text-xl">{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2,'0')}</div>
      <div className="space-x-2 mt-2">
        <button onClick={() => setRunning(true)} className="btn">Start</button>
        <button onClick={() => setRunning(false)} className="btn">Pause</button>
        <button onClick={() => { setRunning(false); setSeconds(initialSeconds); }} className="btn">Reset</button>
      </div>
    </div>
  );
}

export default function EyeCareDashboard() {
  const [state, setState] = useState(() => loadHealthState());

  useEffect(() => {
    const id = setInterval(() => setState(loadHealthState()), 2000);
    return () => clearInterval(id);
  }, []);

  const todayLog = getTodayLog(state);
  const next = getNextHealthReminder(new Date(), state.settings, todayLog);

  const startWorkMode = () => {
    const s = loadHealthState();
    s.settings.eyeCareWorkModeEnabled = true;
    s.settings.updatedAt = new Date().toISOString();
    saveHealthState(s);
    notifyStateUpdated();
    setState(s);
  };

  const pauseReminders = (minutes = 30) => {
    const now = new Date();
    const until = new Date(now.getTime() + minutes * 60 * 1000).toISOString();
    const s = loadHealthState();
    s.settings.quietModeUntil = until;
    s.settings.updatedAt = new Date().toISOString();
    saveHealthState(s);
    notifyStateUpdated();
    setState(s);
  };

  const doNow = () => {
    // trigger the canonical eye reminder if present
    triggerReminderNow('eyes-blink-focus');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Eye Care</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Work Mode</h2>
          <p>Status: {state.settings.eyeCareWorkModeEnabled ? 'Active' : 'Inactive'}</p>
          <div className="mt-3 space-x-2">
            <button onClick={startWorkMode} className="btn">Start Eye-Care Work Mode</button>
            <button onClick={() => pauseReminders(30)} className="btn">Pause 30m</button>
            <button onClick={doNow} className="btn">Do eye-care routine now</button>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Next Action</h2>
          <p>{next ? `${next.title} @ ${next.time}` : 'No upcoming action'}</p>
          <p className="mt-2">Time until next: {next ? formatTimeToNext(next.time) : '—'}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Today</h2>
          <p>Completed eye breaks: {todayLog.eyeBreaks}</p>
          <p>Completed actions: {todayLog.completedBreaks.length}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Before-work Routine</h2>
          <p className="text-sm">Five-minute warm mask and 30s massage.</p>
          <div className="mt-3 space-y-2">
            <div>
              <div className="text-sm">Warm mask (5:00)</div>
              <Timer initialSeconds={5 * 60} />
            </div>
            <div>
              <div className="text-sm">Massage (0:30)</div>
              <Timer initialSeconds={30} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
