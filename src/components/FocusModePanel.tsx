import { useEffect, useState } from 'react';

const focusStorageKey = 'avance-focus-mode';
const focusModes = ['triage', 'documentation', 'follow-up', 'learning', 'shutdown'];

type FocusSession = {
  mode: string;
  minutes: number;
  startedAt?: string;
};

function loadFocusSession(): FocusSession {
  try {
    const raw = window.localStorage.getItem(focusStorageKey);
    return raw ? JSON.parse(raw) as FocusSession : { mode: 'triage', minutes: 25 };
  } catch {
    return { mode: 'triage', minutes: 25 };
  }
}

function FocusModePanel() {
  const [session, setSession] = useState(loadFocusSession);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    window.localStorage.setItem(focusStorageKey, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const started = session.startedAt ? new Date(session.startedAt).getTime() : null;
  const totalMs = session.minutes * 60 * 1000;
  const remainingMs = started ? Math.max(0, totalMs - (now - started)) : totalMs;
  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
  const isDone = Boolean(started && remainingMs <= 0);

  return (
    <section className="card health-panel">
      <h2>Focus Mode</h2>
      <p>Gentle ticket block timer. When it ends, take a tiny reset instead of pushing harder.</p>
      <div className="quick-capture-form">
        <label>
          Mode
          <select value={session.mode} onChange={(event) => setSession((current) => ({ ...current, mode: event.target.value }))}>
            {focusModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
          </select>
        </label>
        <label>
          Minutes
          <input type="number" min="5" max="90" step="5" value={session.minutes} onChange={(event) => setSession((current) => ({ ...current, minutes: Number(event.target.value) || 25 }))} />
        </label>
      </div>
      <div className="mini-card">
        <h3>{String(remainingMinutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}</h3>
        <p>{isDone ? 'Focus block complete. Drink water, look away, and name the next tiny action.' : `Current mode: ${session.mode}`}</p>
      </div>
      <div className="status-button-row">
        <button type="button" onClick={() => setSession((current) => ({ ...current, startedAt: new Date().toISOString() }))}>Start</button>
        <button type="button" className="small-action" onClick={() => setSession((current) => ({ ...current, startedAt: undefined }))}>Reset</button>
      </div>
    </section>
  );
}

export default FocusModePanel;
