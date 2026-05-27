'use client';

export type ShiftSession = {
  shiftId: string;
  actualStartAt?: string;
  actualEndAt?: string;
};

const STORAGE_KEY = 'avance:shift-sessions';

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const getShiftSessions = (): Record<string, ShiftSession> => {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ShiftSession>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const saveSessions = (sessions: Record<string, ShiftSession>) => {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const getShiftSession = (shiftId: string): ShiftSession | undefined =>
  getShiftSessions()[shiftId];

export const startShiftSession = (shiftId: string): ShiftSession => {
  const sessions = getShiftSessions();
  const session: ShiftSession = {
    shiftId,
    actualStartAt: new Date().toISOString(),
    actualEndAt: undefined,
  };
  sessions[shiftId] = session;
  saveSessions(sessions);
  return session;
};

export const endShiftSession = (shiftId: string): ShiftSession => {
  const sessions = getShiftSessions();
  const existing = sessions[shiftId] ?? { shiftId };
  const session: ShiftSession = {
    ...existing,
    actualEndAt: new Date().toISOString(),
  };
  sessions[shiftId] = session;
  saveSessions(sessions);
  return session;
};

export const clearShiftSession = (shiftId: string) => {
  const sessions = getShiftSessions();
  delete sessions[shiftId];
  saveSessions(sessions);
};

export type ShiftDisplayStatus = 'scheduled' | 'in-progress' | 'completed';

export const getShiftDisplayStatus = (
  shift: { date: Date; startTime: string; endTime: string },
  session?: ShiftSession
): ShiftDisplayStatus => {
  if (session?.actualEndAt) return 'completed';
  if (session?.actualStartAt && !session.actualEndAt) return 'in-progress';

  const now = new Date();
  const start = getShiftDateTime(shift, shift.startTime);
  const end = getShiftDateTime(shift, shift.endTime);

  if (now > end) return 'completed';
  if (now >= start && now <= end) return 'in-progress';
  return 'scheduled';
};

export const getShiftDateTime = (shift: { date: Date }, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(shift.date);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const formatSessionTime = (iso?: string) => {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};
