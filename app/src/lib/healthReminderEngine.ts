import { healthActions } from '@/data/healthOutdoors';
import type { DailyHealthLog, HealthOutdoorsSettings, HealthShiftPhase } from '@/types/healthOutdoors';

export interface HealthReminder {
  id: string;
  actionId: string;
  time: string;
  scheduledAt: Date;
  title: string;
  message: string;
  whyItHelps: string;
  phase: HealthShiftPhase;
  notificationBody: string;
}

interface ReminderTemplate {
  id: string;
  actionId: string;
  time: string;
  phase: HealthShiftPhase;
  title: string;
  message: string;
  notificationBody: string;
}

const reminderTemplates: ReminderTemplate[] = [
  {
    id: 'pre-shift-water-daylight',
    actionId: 'hydration-morning-water',
    time: '08:20',
    phase: 'pre-shift',
    title: 'Pre-shift steady start',
    message: 'Fill water, get a little daylight, and choose one calm focus for the morning.',
    notificationBody: 'Tiny reset: fill water, get daylight if possible, and choose a calm focus.',
  },
  {
    id: 'morning-eyes-water',
    actionId: 'eyes-20-20-20',
    time: '09:20',
    phase: 'morning',
    title: 'Eye break and water',
    message: 'Look away from the screen for 20 seconds, blink slowly, then take a sip of water.',
    notificationBody: 'Tiny reset: drink water and look away from the screen.',
  },
  {
    id: 'morning-outdoor-daylight',
    actionId: 'outdoors-daylight-break',
    time: '10:30',
    phase: 'morning',
    title: 'Outdoor daylight reset',
    message: 'Step outside if possible. A few minutes of daylight can help you reset.',
    notificationBody: 'Step outside if possible. A few minutes of daylight can help you reset.',
  },
  {
    id: 'late-morning-posture-water',
    actionId: 'posture-shoulders-jaw',
    time: '11:30',
    phase: 'morning',
    title: 'Posture and jaw reset',
    message: 'Shoulders down, jaw soft, slow breath, then return to the next realistic step.',
    notificationBody: 'Shoulders down, jaw soft, breathe slowly, then return to the next ticket.',
  },
  {
    id: 'lunch-away-from-screen',
    actionId: 'lunch-away-from-screen',
    time: '12:30',
    phase: 'lunch',
    title: 'Lunch away from screen',
    message: 'Eat away from the screen if you can. This is about sustainability, not perfection.',
    notificationBody: 'Lunch reset: eat away from the screen if you can.',
  },
  {
    id: 'afternoon-outdoor-walk',
    actionId: 'outdoors-short-walk',
    time: '14:15',
    phase: 'afternoon',
    title: 'Afternoon outdoor walk',
    message: 'Take a short walk or stand in daylight. Do what is realistic during the workday.',
    notificationBody: 'A short walk or daylight break can help the afternoon feel clearer.',
  },
  {
    id: 'afternoon-water-stretch-eyes',
    actionId: 'movement-stretch',
    time: '15:30',
    phase: 'afternoon',
    title: 'Water, stretch, eyes',
    message: 'Sip water, stretch gently, and look away from the screen. No guilt, just return.',
    notificationBody: 'Tiny reset: water, stretch, and look away from the screen.',
  },
  {
    id: 'wrap-up-shutdown',
    actionId: 'shutdown-close-loops',
    time: '16:45',
    phase: 'wrap-up',
    title: 'Shutdown ritual',
    message: 'Close loops, note next actions, and let work stay at work where possible.',
    notificationBody: 'Shutdown ritual: close loops, note next actions, and let work stay at work.',
  },
];

const parseTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours: Number.isFinite(hours) ? hours : 0, minutes: Number.isFinite(minutes) ? minutes : 0 };
};

const dateAtTime = (date: Date, time: string) => {
  const { hours, minutes } = parseTime(time);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60 * 1000);

const getSuppressedUntil = (now: Date, settings: HealthOutdoorsSettings) => {
  const suppressions = [settings.quietModeUntil, settings.snoozeUntil]
    .map((value) => (value ? new Date(value) : null))
    .filter((date): date is Date => date instanceof Date && date.getTime() > now.getTime())
    .sort((a, b) => b.getTime() - a.getTime());

  return suppressions[0] ?? null;
};

const toReminder = (template: ReminderTemplate, date: Date): HealthReminder => {
  const action = healthActions.find((item) => item.id === template.actionId);

  return {
    ...template,
    scheduledAt: dateAtTime(date, template.time),
    whyItHelps: action?.whyItHelps ?? 'Small breaks can help make MSP work more sustainable.',
  };
};

const getScheduleForDate = (date: Date): HealthReminder[] =>
  reminderTemplates.map((template) => toReminder(template, date));

const isReminderOpen = (reminder: HealthReminder, dailyLog: DailyHealthLog) =>
  !dailyLog.completedReminderIds.includes(reminder.id) &&
  !dailyLog.skippedReminderIds.includes(reminder.id);

export const defaultHealthReminderSchedule = reminderTemplates;

export const isHealthShiftDay = (date: Date, settings: HealthOutdoorsSettings): boolean => {
  if (!settings.enabled) {
    return false;
  }

  const day = date.getDay();
  const shiftDays = settings.mondayWednesdayOnly ? [1, 3] : settings.shiftDays;
  return shiftDays.includes(day);
};

export const getShiftPhase = (date: Date, settings: HealthOutdoorsSettings): HealthShiftPhase => {
  if (!isHealthShiftDay(date, settings)) {
    return 'off-shift';
  }

  const preShiftStart = dateAtTime(date, '08:20');
  const shiftStart = dateAtTime(date, settings.shiftStart);
  const lunchStart = dateAtTime(date, '12:00');
  const lunchEnd = dateAtTime(date, '13:15');
  const wrapUpStart = dateAtTime(date, '16:30');
  const shiftEnd = dateAtTime(date, settings.shiftEnd);

  if (date >= preShiftStart && date < shiftStart) {
    return 'pre-shift';
  }

  if (date >= shiftStart && date < lunchStart) {
    return 'morning';
  }

  if (date >= lunchStart && date < lunchEnd) {
    return 'lunch';
  }

  if (date >= lunchEnd && date < wrapUpStart) {
    return 'afternoon';
  }

  if (date >= wrapUpStart && date <= shiftEnd) {
    return 'wrap-up';
  }

  return 'off-shift';
};

export const shouldSuppressReminder = (now: Date, settings: HealthOutdoorsSettings): boolean =>
  !settings.enabled || Boolean(getSuppressedUntil(now, settings));

export const getDueReminder = (
  now: Date,
  settings: HealthOutdoorsSettings,
  dailyLog: DailyHealthLog
): HealthReminder | null => {
  if (shouldSuppressReminder(now, settings) || getShiftPhase(now, settings) === 'off-shift') {
    return null;
  }

  const schedule = getScheduleForDate(now).filter((reminder) => isReminderOpen(reminder, dailyLog));
  const dueReminders = schedule.filter((reminder) => reminder.scheduledAt.getTime() <= now.getTime());
  return dueReminders[dueReminders.length - 1] ?? null;
};

export const getNextReminder = (
  now: Date,
  settings: HealthOutdoorsSettings,
  dailyLog: DailyHealthLog
): HealthReminder | null => {
  const suppressedUntil = getSuppressedUntil(now, settings);
  const dueReminder = getDueReminder(addMinutes(now, -1), { ...settings, quietModeUntil: undefined, snoozeUntil: undefined }, dailyLog);

  if (suppressedUntil && dueReminder) {
    return {
      ...dueReminder,
      scheduledAt: suppressedUntil,
      title: `Snoozed: ${dueReminder.title}`,
    };
  }

  for (let dayOffset = 0; dayOffset < 10; dayOffset += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);

    if (!isHealthShiftDay(date, settings)) {
      continue;
    }

    const schedule = getScheduleForDate(date).filter((reminder) => {
      const isToday = dayOffset === 0;
      const open = isToday ? isReminderOpen(reminder, dailyLog) : true;
      return open && reminder.scheduledAt.getTime() > now.getTime();
    });

    if (schedule.length > 0) {
      return schedule[0];
    }
  }

  return null;
};

export const applySnooze = (
  settings: HealthOutdoorsSettings,
  minutes: number,
  now = new Date()
): HealthOutdoorsSettings => ({
  ...settings,
  snoozeUntil: addMinutes(now, Math.max(1, minutes)).toISOString(),
  updatedAt: now.toISOString(),
});

export const applyQuietMode = (
  settings: HealthOutdoorsSettings,
  minutes: number,
  now = new Date()
): HealthOutdoorsSettings => ({
  ...settings,
  quietModeUntil: addMinutes(now, Math.max(1, minutes)).toISOString(),
  updatedAt: now.toISOString(),
});
