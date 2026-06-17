export type HealthReminderType = 'setup' | 'eyes' | 'outdoors' | 'posture' | 'lunch' | 'movement' | 'shutdown';
export type NotificationPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export type HealthReminder = {
  id: string;
  type: HealthReminderType;
  title: string;
  time: string;
  summary: string;
  action: string;
  notificationText: string;
};

export type HealthSettings = {
  enabled: boolean;
  shiftDays: number[];
  shiftStart: string;
  shiftEnd: string;
  reminderTimes: Record<string, string>;
  notificationPermissionStatus: NotificationPermissionStatus;
  notificationPermission?: NotificationPermissionStatus;
  notificationsEnabled: boolean;
  notificationPermissionDenied?: boolean;
  preferredReminderCadence: 'default' | 'gentle' | 'frequent';
  reminderCadenceMinutes: number;
  mondayWednesdayOnly: boolean;
  quietModeUntil?: string;
  snoozeUntil?: string;
  reminderSound: boolean;
  enableFaithPrompt: boolean;
  enableEmailSetup: boolean;
  emailRemindersEnabled: boolean;
  reminderEmailAddress: string;
  eyeCareWorkModeEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HealthDayLog = {
  date: string;
  completedBreaks: string[];
  skippedBreaks: string[];
  hydrationCount: number;
  outdoorMinutes: number;
  movementBreaks: number;
  eyeBreaks: number;
  lunchAwayFromScreenCount: number;
  shutdownCount: number;
  postureResets: number;
  nervousSystemResets: number;
  lunchAwayFromScreen: boolean;
  shutdownCompleted: boolean;
  completedActionIds: string[];
  completedReminderIds: string[];
  skippedReminderIds: string[];
  urgentTicketModeCount: number;
  lastBreakTime?: string;
  snoozedUntil: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

export type HealthState = {
  settings: HealthSettings;
  days: Record<string, HealthDayLog>;
};

export const healthStorageKey = 'avance-health-outdoors';

export const defaultHealthReminders: HealthReminder[] = [
  {
    id: 'pre-shift-setup',
    type: 'setup',
    title: 'Pre-shift setup',
    time: '08:20',
    summary: 'Fill water, get quick daylight, breathe, and choose one steady focus.',
    action: 'Tiny reset before the day starts.',
    notificationText: 'Tiny reset: fill water, get daylight if possible, breathe, and choose focus.'
  },
  {
    id: 'eye-water-0920',
    type: 'eyes',
    title: '20-20-20 + water',
    time: '09:20',
    summary: 'Look into the distance and drink water.',
    action: 'Look away from the screen for 20 seconds.',
    notificationText: 'Tiny reset: drink water and look outside for 20 seconds.'
  },
  {
    id: 'outdoor-1030',
    type: 'outdoors',
    title: 'Outdoor reset',
    time: '10:30',
    summary: 'Step outside if possible for five minutes of daylight.',
    action: 'Step outside if possible.',
    notificationText: 'Step outside if possible: 5 minutes of daylight can help your body reset.'
  },
  {
    id: 'posture-1130',
    type: 'posture',
    title: 'Posture, jaw, shoulders',
    time: '11:30',
    summary: 'Relax your jaw and shoulders, breathe, and drink water.',
    action: 'Shoulders down, jaw soft.',
    notificationText: 'Shoulders down, jaw soft, breathe slowly. Then return to the next ticket.'
  },
  {
    id: 'lunch-1230',
    type: 'lunch',
    title: 'Lunch away from screen',
    time: '12:30',
    summary: 'Eat away from the screen if you can.',
    action: 'Let lunch be a real pause.',
    notificationText: 'Lunch reset: eat away from the screen if you can.'
  },
  {
    id: 'outdoor-1415',
    type: 'outdoors',
    title: 'Sunlight reset',
    time: '14:15',
    summary: 'Outdoor walk or sunlight reset.',
    action: 'Get daylight and move gently.',
    notificationText: 'Step outside if possible: daylight and movement can support a steadier afternoon.'
  },
  {
    id: 'water-stretch-1530',
    type: 'movement',
    title: 'Water + stretch + eyes',
    time: '15:30',
    summary: 'Drink water, stretch, and look into the distance.',
    action: 'Tiny reset, then return to one next action.',
    notificationText: 'Tiny reset: water, stretch, and look into the distance.'
  },
  {
    id: 'shutdown-1645',
    type: 'shutdown',
    title: 'End-of-day shutdown',
    time: '16:45',
    summary: 'Close loops: notes, tickets, breathe, and leave work at work.',
    action: 'This is about sustainability, not perfection.',
    notificationText: 'End-of-day: close loops, note next actions, and let work stay at work.'
  }
];

const eyeCareExtraReminders: HealthReminder[] = [
  {
    id: 'eyes-blink-focus',
    type: 'eyes',
    title: 'Blink and refocus',
    time: '15:00',
    summary: 'Blink slowly, then look away from the screen for 20 seconds.',
    action: 'Blink slowly and let your eyes rest for a moment.',
    notificationText: 'Blink slowly and look away from the screen for 20 seconds to help your eyes reset.'
  }
];

export const defaultHealthSettings: HealthSettings = {
  enabled: true,
  shiftDays: [1, 3],
  shiftStart: '08:30',
  shiftEnd: '17:00',
  reminderTimes: Object.fromEntries(defaultHealthReminders.map((reminder) => [reminder.id, reminder.time])),
  notificationPermissionStatus: 'default',
  notificationsEnabled: false,
  preferredReminderCadence: 'default',
  reminderCadenceMinutes: 20,
  mondayWednesdayOnly: true,
  reminderSound: false,
  enableFaithPrompt: true,
  enableEmailSetup: true,
  emailRemindersEnabled: false,
  reminderEmailAddress: '',
  eyeCareWorkModeEnabled: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const defaultHealthState: HealthState = {
  settings: defaultHealthSettings,
  days: {}
};

export function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function createEmptyDayLog(date: string): HealthDayLog {
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

export function getTodayLog(state: HealthState, now = new Date()) {
  const key = dateKey(now);
  return state.days[key] ?? createEmptyDayLog(key);
}

export function loadHealthState(): HealthState {
  if (typeof window === 'undefined') return defaultHealthState;
  try {
    const raw = window.localStorage.getItem(healthStorageKey);
    if (!raw) return defaultHealthState;
    const parsed = JSON.parse(raw) as Partial<HealthState>;
    return {
      settings: { ...defaultHealthSettings, ...parsed.settings },
      days: parsed.days ?? {}
    };
  } catch {
    return defaultHealthState;
  }
}

export function saveHealthState(state: HealthState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(healthStorageKey, JSON.stringify(state));
}

export function buildReminders(settings: HealthSettings): HealthReminder[] {
  const reminders = [...defaultHealthReminders];
  if (settings.eyeCareWorkModeEnabled) {
    reminders.push(...eyeCareExtraReminders);
  }

  return reminders
    .map((reminder) => ({
      ...reminder,
      time: settings.reminderTimes[reminder.id] ?? reminder.time
    }))
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}

export function isShiftDay(date: Date, settings: HealthSettings) {
  return settings.enabled && settings.shiftDays.includes(date.getDay());
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getShiftState(now: Date, settings: HealthSettings) {
  if (!isShiftDay(now, settings)) return 'off shift';
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes < timeToMinutes(settings.shiftStart)) return 'before shift';
  if (minutes < timeToMinutes('12:00')) return 'morning';
  if (minutes < timeToMinutes('13:15')) return 'lunch';
  if (minutes < timeToMinutes('16:30')) return 'afternoon';
  if (minutes <= timeToMinutes(settings.shiftEnd)) return 'wrap-up';
  return 'off shift';
}

export function getNextHealthReminder(now: Date, settings: HealthSettings, completions: HealthDayLog) {
  if (!isShiftDay(now, settings)) return null;
  if (settings.quietModeUntil && new Date(settings.quietModeUntil) > now) return null;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const reminders = buildReminders(settings)
    .filter((reminder) => !completions.completedBreaks.includes(reminder.id) && !completions.skippedBreaks.includes(reminder.id))
    .filter((reminder) => {
      const snoozedUntil = completions.snoozedUntil[reminder.id];
      return !snoozedUntil || new Date(snoozedUntil) <= now;
    });

  return reminders.find((reminder) => timeToMinutes(reminder.time) >= nowMinutes) ?? reminders[0] ?? null;
}

export function getDueHealthReminder(now: Date, settings: HealthSettings, completions: HealthDayLog) {
  if (!isShiftDay(now, settings)) return null;
  if (settings.quietModeUntil && new Date(settings.quietModeUntil) > now) return null;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return buildReminders(settings)
    .filter((reminder) => !completions.completedBreaks.includes(reminder.id) && !completions.skippedBreaks.includes(reminder.id))
    .filter((reminder) => timeToMinutes(reminder.time) <= nowMinutes)
    .find((reminder) => {
      const snoozedUntil = completions.snoozedUntil[reminder.id];
      return !snoozedUntil || new Date(snoozedUntil) <= now;
    }) ?? null;
}

export function setQuietMode(state: HealthState, minutes: number, now = new Date()): HealthState {
  const until = new Date(now.getTime() + minutes * 60 * 1000).toISOString();
  const today = getTodayLog(state, now);
  return {
    ...state,
    settings: { ...state.settings, quietModeUntil: until, updatedAt: now.toISOString() },
    days: {
      ...state.days,
      [today.date]: {
        ...today,
        urgentTicketModeCount: today.urgentTicketModeCount + 1,
        updatedAt: now.toISOString()
      }
    }
  };
}

export function markReminderDone(state: HealthState, reminder: HealthReminder, now = new Date()): HealthState {
  const today = getTodayLog(state, now);
  const completedBreaks = today.completedBreaks.includes(reminder.id)
    ? today.completedBreaks
    : [...today.completedBreaks, reminder.id];

  return {
    ...state,
    settings: { ...state.settings, updatedAt: now.toISOString() },
    days: {
      ...state.days,
      [today.date]: {
        ...today,
        completedBreaks,
        hydrationCount: ['eyes', 'posture', 'movement'].includes(reminder.type) ? today.hydrationCount + 1 : today.hydrationCount,
        outdoorMinutes: reminder.type === 'outdoors' ? today.outdoorMinutes + 5 : today.outdoorMinutes,
        movementBreaks: ['movement', 'posture', 'outdoors'].includes(reminder.type) ? today.movementBreaks + 1 : today.movementBreaks,
        eyeBreaks: reminder.type === 'eyes' ? today.eyeBreaks + 1 : today.eyeBreaks,
        lunchAwayFromScreenCount: reminder.type === 'lunch' ? today.lunchAwayFromScreenCount + 1 : today.lunchAwayFromScreenCount,
        shutdownCount: reminder.type === 'shutdown' ? today.shutdownCount + 1 : today.shutdownCount,
        lastBreakTime: now.toISOString()
      }
    }
  };
}

export function skipReminder(state: HealthState, reminderId: string, now = new Date()): HealthState {
  const today = getTodayLog(state, now);
  return {
    ...state,
    settings: { ...state.settings, updatedAt: now.toISOString() },
    days: {
      ...state.days,
      [today.date]: {
        ...today,
        skippedBreaks: today.skippedBreaks.includes(reminderId) ? today.skippedBreaks : [...today.skippedBreaks, reminderId],
        lastBreakTime: now.toISOString()
      }
    }
  };
}

export function snoozeReminder(state: HealthState, reminderId: string, minutes: number, now = new Date()): HealthState {
  const today = getTodayLog(state, now);
  return {
    ...state,
    settings: {
      ...state.settings,
      updatedAt: now.toISOString()
    },
    days: {
      ...state.days,
      [today.date]: {
        ...today,
        snoozedUntil: {
          ...today.snoozedUntil,
          [reminderId]: new Date(now.getTime() + minutes * 60 * 1000).toISOString()
        }
      }
    }
  };
}

export function getWeeklyTotals(state: HealthState, now = new Date()) {
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return Object.values(state.days).reduce(
    (totals, day) => {
      const dayDate = new Date(`${day.date}T00:00:00`);
      if (dayDate < weekStart || dayDate > now) return totals;
      return {
        water: totals.water + day.hydrationCount,
        outdoorMinutes: totals.outdoorMinutes + day.outdoorMinutes,
        movementBreaks: totals.movementBreaks + day.movementBreaks,
        eyeBreaks: totals.eyeBreaks + day.eyeBreaks,
        lunchAway: totals.lunchAway + day.lunchAwayFromScreenCount,
        shutdowns: totals.shutdowns + day.shutdownCount,
        urgentTicketMode: totals.urgentTicketMode + day.urgentTicketModeCount,
        skipped: totals.skipped + day.skippedBreaks.length
      };
    },
    { water: 0, outdoorMinutes: 0, movementBreaks: 0, eyeBreaks: 0, lunchAway: 0, shutdowns: 0, urgentTicketMode: 0, skipped: 0 }
  );
}
