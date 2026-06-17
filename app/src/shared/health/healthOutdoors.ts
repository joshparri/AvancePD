// @ts-nocheck
// Lightweight app-local health utilities (mirror of shared functions used by the dashboard)

export const healthStorageKey = 'avance-health-outdoors';

export function loadHealthState() {
  if (typeof window === 'undefined') return { settings: { eyeCareWorkModeEnabled: false }, days: {} };
  try {
    const raw = window.localStorage.getItem(healthStorageKey);
    if (!raw) return { settings: { eyeCareWorkModeEnabled: false }, days: {} };
    return JSON.parse(raw);
  } catch {
    return { settings: { eyeCareWorkModeEnabled: false }, days: {} };
  }
}

export function saveHealthState(state: any) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(healthStorageKey, JSON.stringify(state));
  } catch {}
}

export function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function createEmptyDayLog(date) {
  const now = new Date().toISOString();
  return {
    date,
    completedBreaks: [],
    skippedBreaks: [],
    hydrationCount: 0,
    outdoorMinutes: 0,
    movementBreaks: 0,
    eyeBreaks: 0,
    lunchAwayFromScreenCount: 0,
    shutdownCount: 0,
    postureResets: 0,
    nervousSystemResets: 0,
    lunchAwayFromScreen: false,
    shutdownCompleted: false,
    completedActionIds: [],
    completedReminderIds: [],
    skippedReminderIds: [],
    urgentTicketModeCount: 0,
    lastBreakTime: undefined,
    snoozedUntil: {},
    createdAt: now,
    updatedAt: now
  };
}

export function getTodayLog(state, now = new Date()) {
  const key = dateKey(now);
  return state.days?.[key] ?? createEmptyDayLog(key);
}

export function timeToMinutes(time) {
  const [hours, minutes] = (time || '00:00').split(':').map(Number);
  return hours * 60 + minutes;
}

const defaultReminders = [
  { id: 'eyes-blink-focus', type: 'eyes', title: 'Blink and refocus', time: '09:20', notificationText: 'Blink slowly and look away from the screen for 20 seconds.' },
  { id: 'eye-drop-1230', type: 'eyes', title: 'Eye-drop reminder', time: '12:30', notificationText: 'Use your lubricating eye drops as advised.' },
  { id: 'eye-drop-1530', type: 'eyes', title: 'Eye-drop reminder', time: '15:30', notificationText: 'Use your lubricating eye drops as advised.' }
];

export function buildReminders(settings) {
  const reminders = [...defaultReminders];
  return reminders.map((r) => ({ ...r, time: (settings?.reminderTimes?.[r.id]) ?? r.time })).sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}

export function getNextHealthReminder(now, settings, completions) {
  if (!settings?.eyeCareWorkModeEnabled) return null;
  const reminders = buildReminders(settings).filter((r) => !completions.completedBreaks.includes(r.id) && !completions.skippedBreaks.includes(r.id));
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return reminders.find((r) => timeToMinutes(r.time) >= nowMinutes) ?? reminders[0] ?? null;
}

