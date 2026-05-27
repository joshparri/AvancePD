'use client';

export type RotatingEvent = { id: string; label: string; multiplier: number; startIso: string; endIso: string; description?: string };

const EVENTS: RotatingEvent[] = [
  {
    id: 're_weekend_wave',
    label: 'Weekend Wave',
    multiplier: 1.5,
    startIso: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    endIso: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    description: 'Short weekend boost — 1.5× XP for quick sessions',
  },
  {
    id: 're_midweek_spike',
    label: 'Midweek Spike',
    multiplier: 2,
    startIso: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    endIso: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    description: 'Limited-time 2× XP — clear quick challenges to earn extra',
  },
];

export const getRotatingEvents = (): RotatingEvent[] => EVENTS;

export const getCurrentRotatingEvent = (): RotatingEvent | null => {
  const now = Date.now();
  for (const e of EVENTS) {
    if (new Date(e.startIso).getTime() <= now && new Date(e.endIso).getTime() > now) return e;
  }
  return null;
};
