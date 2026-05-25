import type { HealthSettings, HealthBreak, HealthReminderType } from '../types';

// Default reminder schedule (HH:mm format)
export const DEFAULT_HEALTH_REMINDERS: Array<{ time: string; type: HealthReminderType; title: string; description: string }> = [
  {
    time: '08:20',
    type: 'pre-shift',
    title: 'Pre-shift setup',
    description: 'Fill water, quick daylight, breathe, choose focus'
  },
  {
    time: '09:20',
    type: 'eye-break',
    title: '20-20-20 eye break',
    description: 'Look at something 20 feet away for 20 seconds, drink water'
  },
  {
    time: '10:30',
    type: 'outdoor-reset',
    title: 'Outdoor reset',
    description: 'Step outside if possible, breathe fresh air'
  },
  {
    time: '11:30',
    type: 'posture',
    title: 'Posture & shoulders',
    description: 'Relax jaw and shoulders, straighten posture, drink water'
  },
  {
    time: '12:30',
    type: 'lunch',
    title: 'Lunch away from screen',
    description: 'Eat away from your desk if possible'
  },
  {
    time: '14:15',
    type: 'walk',
    title: 'Outdoor walk or sunlight',
    description: 'Step outside for 5–10 minutes, let eyes focus far away'
  },
  {
    time: '15:30',
    type: 'stretch',
    title: 'Water + stretch + eyes',
    description: 'Drink water, stretch gently, do another 20-20-20 break'
  },
  {
    time: '16:45',
    type: 'shutdown',
    title: 'End-of-day shutdown',
    description: 'Close loops, note next actions, breathe, leave work at work'
  }
];

export const DEFAULT_HEALTH_SETTINGS: HealthSettings = {
  shiftDays: ['Monday', 'Wednesday'],
  shiftStartTime: '08:30',
  shiftEndTime: '17:00',
  notificationsEnabled: false,
  notificationPermissionStatus: 'default',
  reminderCadence: 'full',
  includesFaithPrompt: true,
  enableEmailSetup: true,
  mondayWednesdayOnly: true,
  reminderSound: false
};

export function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dateStr === today;
}

export function getDayOfWeek(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

export function isShiftDay(settings: HealthSettings): boolean {
  const today = getDayOfWeek();
  return settings.shiftDays.includes(today as any);
}

export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function isWithinShiftHours(settings: HealthSettings): boolean {
  const now = getCurrentTimeInMinutes();
  const shiftStart = timeStringToMinutes(settings.shiftStartTime);
  const shiftEnd = timeStringToMinutes(settings.shiftEndTime);
  return now >= shiftStart && now <= shiftEnd;
}

export function getNextHealthReminder(
  now: Date,
  settings: HealthSettings,
  completedBreakIds: Set<string>
): HealthBreak | null {
  // Only return reminders on shift days during shift hours
  if (!isShiftDay(settings) || !isWithinShiftHours(settings)) {
    return null;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const shiftEnd = timeStringToMinutes(settings.shiftEndTime);

  // Find the next due reminder
  for (const reminder of DEFAULT_HEALTH_REMINDERS) {
    const reminderMinutes = timeStringToMinutes(reminder.time);

    if (reminderMinutes > currentMinutes && reminderMinutes <= shiftEnd) {
      const reminderId = `${new Date().toISOString().slice(0, 10)}-${reminder.type}`;

      if (!completedBreakIds.has(reminderId)) {
        return {
          id: reminderId,
          type: reminder.type,
          scheduledTime: reminder.time,
          title: reminder.title,
          description: reminder.description,
          status: 'due'
        };
      }
    }
  }

  return null;
}

export function getShiftState(
  settings: HealthSettings
): 'before-shift' | 'morning' | 'lunch' | 'afternoon' | 'wrap-up' | 'off-shift' {
  if (!isShiftDay(settings)) {
    return 'off-shift';
  }

  const now = getCurrentTimeInMinutes();
  const shiftStart = timeStringToMinutes(settings.shiftStartTime);
  const shiftEnd = timeStringToMinutes(settings.shiftEndTime);

  if (now < shiftStart) {
    return 'before-shift';
  } else if (now < timeStringToMinutes('11:00')) {
    return 'morning';
  } else if (now < timeStringToMinutes('13:00')) {
    return 'lunch';
  } else if (now < timeStringToMinutes('16:30')) {
    return 'afternoon';
  } else if (now <= shiftEnd) {
    return 'wrap-up';
  }

  return 'off-shift';
}

export function loadHealthSettings(): HealthSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_HEALTH_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem('avance-health-settings');
    return raw ? { ...DEFAULT_HEALTH_SETTINGS, ...(JSON.parse(raw) as Partial<HealthSettings>) } : DEFAULT_HEALTH_SETTINGS;
  } catch {
    return DEFAULT_HEALTH_SETTINGS;
  }
}

export function saveHealthSettings(settings: HealthSettings): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem('avance-health-settings', JSON.stringify(settings));
  } catch {
    console.warn('Failed to save health settings');
  }
}

export function loadCompletedBreaks(): Map<string, HealthBreak> {
  if (typeof window === 'undefined') {
    return new Map();
  }

  try {
    const raw = window.localStorage.getItem('avance-health-breaks');
    if (!raw) return new Map();

    const breaks = JSON.parse(raw) as HealthBreak[];
    const map = new Map();

    for (const breakRecord of breaks) {
      map.set(breakRecord.id, breakRecord);
    }

    return map;
  } catch {
    return new Map();
  }
}

export function saveCompletedBreaks(breaks: Map<string, HealthBreak>): void {
  if (typeof window === 'undefined') return;

  try {
    const array = Array.from(breaks.values());
    window.localStorage.setItem('avance-health-breaks', JSON.stringify(array));
  } catch {
    console.warn('Failed to save completed breaks');
  }
}

export function getTodaysBreaks(breaks: Map<string, HealthBreak>): HealthBreak[] {
  const today = new Date().toISOString().slice(0, 10);
  const todaysBreaks: HealthBreak[] = [];

  for (const [id, breakRecord] of breaks.entries()) {
    if (id.startsWith(today)) {
      todaysBreaks.push(breakRecord);
    }
  }

  return todaysBreaks.sort((a, b) => timeStringToMinutes(a.scheduledTime) - timeStringToMinutes(b.scheduledTime));
}

export function getThisWeeksReview(): { weekStart: string; breaks: HealthBreak[] } {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);

  const weekStartStr = weekStart.toISOString().slice(0, 10);

  const breaks = loadCompletedBreaks();
  const weekBreaks: HealthBreak[] = [];

  for (const [id, breakRecord] of breaks.entries()) {
    if (id >= weekStartStr && id < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)) {
      weekBreaks.push(breakRecord);
    }
  }

  return {
    weekStart: weekStartStr,
    breaks: weekBreaks
  };
}

export function formatTimeForNotification(time: string): string {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
}
