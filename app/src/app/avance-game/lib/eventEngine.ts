'use client';

export interface ActiveEvent {
  label: string;
  multiplier: number;
  startIso: string;
  endIso: string;
}

const STORAGE_KEY = 'avance_game_active_event';

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const createEvent = (hours = 2, multiplier = 1.5, label = 'Double XP Event') => {
  if (!canUseStorage()) return null;
  const start = new Date();
  const end = new Date();
  end.setHours(end.getHours() + hours);
  const ev: ActiveEvent = { label, multiplier, startIso: start.toISOString(), endIso: end.toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ev));
  return ev;
};

export const clearEvent = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
};

export const getActiveEvent = (): ActiveEvent | null => {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveEvent;
    const now = new Date();
    if (new Date(parsed.endIso) <= now) {
      clearEvent();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const getMultiplier = (): number => {
  const ev = getActiveEvent();
  return ev ? ev.multiplier : 1;
};

export const timeRemainingMs = (): number => {
  const ev = getActiveEvent();
  if (!ev) return 0;
  return Math.max(0, new Date(ev.endIso).getTime() - Date.now());
};
