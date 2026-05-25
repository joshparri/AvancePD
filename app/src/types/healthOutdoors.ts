export type HealthShiftPhase =
  | 'off-shift'
  | 'pre-shift'
  | 'morning'
  | 'lunch'
  | 'afternoon'
  | 'wrap-up';

export type HealthNotificationPermission = 'default' | 'granted' | 'denied' | 'unsupported';

export interface HealthOutdoorsSettings {
  enabled: boolean;
  shiftDays: number[];
  shiftStart: string;
  shiftEnd: string;
  mondayWednesdayOnly: boolean;
  notificationsEnabled: boolean;
  notificationPermission?: HealthNotificationPermission;
  notificationPermissionDenied?: boolean;
  faithPromptEnabled: boolean;
  quietModeUntil?: string;
  snoozeUntil?: string;
  reminderCadenceMinutes: number;
  emailSetupEnabled: false;
  lastNotificationId?: string;
  lastNotificationTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyHealthLog {
  date: string;
  waterCount: number;
  outdoorMinutes: number;
  movementBreaks: number;
  eyeBreaks: number;
  postureResets: number;
  nervousSystemResets: number;
  lunchAwayFromScreen: boolean;
  shutdownCompleted: boolean;
  skippedCount: number;
  snoozedCount: number;
  urgentTicketModeCount: number;
  completedActionIds: string[];
  completedReminderIds: string[];
  skippedReminderIds: string[];
  lastResetAt?: string;
  lastCompletedActionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyHealthSummary {
  fromDate: string;
  toDate: string;
  waterCount: number;
  outdoorMinutes: number;
  movementBreaks: number;
  eyeBreaks: number;
  postureResets: number;
  nervousSystemResets: number;
  lunchAwayFromScreenCount: number;
  shutdownCompletedCount: number;
  skippedCount: number;
  snoozedCount: number;
  urgentTicketModeCount: number;
  logsCount: number;
}

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

export const createDefaultHealthOutdoorsSettings = (): HealthOutdoorsSettings => {
  const now = new Date().toISOString();

  return {
    enabled: true,
    shiftDays: [1, 3],
    shiftStart: '08:30',
    shiftEnd: '17:00',
    mondayWednesdayOnly: true,
    notificationsEnabled: false,
    notificationPermission: 'default',
    notificationPermissionDenied: false,
    faithPromptEnabled: true,
    reminderCadenceMinutes: 60,
    emailSetupEnabled: false,
    createdAt: now,
    updatedAt: now,
  };
};

export const createDefaultDailyHealthLog = (date = todayIsoDate()): DailyHealthLog => {
  const now = new Date().toISOString();

  return {
    date,
    waterCount: 0,
    outdoorMinutes: 0,
    movementBreaks: 0,
    eyeBreaks: 0,
    postureResets: 0,
    nervousSystemResets: 0,
    lunchAwayFromScreen: false,
    shutdownCompleted: false,
    skippedCount: 0,
    snoozedCount: 0,
    urgentTicketModeCount: 0,
    completedActionIds: [],
    completedReminderIds: [],
    skippedReminderIds: [],
    createdAt: now,
    updatedAt: now,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const optionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === 'string';

const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

export const normalizeHealthOutdoorsSettings = (value: unknown): HealthOutdoorsSettings => {
  const defaults = createDefaultHealthOutdoorsSettings();

  if (!isRecord(value)) {
    return defaults;
  }

  const shiftDays = Array.isArray(value.shiftDays)
    ? value.shiftDays.filter((day): day is number => Number.isInteger(day) && day >= 0 && day <= 6)
    : defaults.shiftDays;

  const notificationPermission = value.notificationPermission;
  const validPermission =
    notificationPermission === 'default' ||
    notificationPermission === 'granted' ||
    notificationPermission === 'denied' ||
    notificationPermission === 'unsupported'
      ? notificationPermission
      : defaults.notificationPermission;

  return {
    ...defaults,
    enabled: typeof value.enabled === 'boolean' ? value.enabled : defaults.enabled,
    shiftDays: shiftDays.length > 0 ? shiftDays : defaults.shiftDays,
    shiftStart: typeof value.shiftStart === 'string' ? value.shiftStart : defaults.shiftStart,
    shiftEnd: typeof value.shiftEnd === 'string' ? value.shiftEnd : defaults.shiftEnd,
    mondayWednesdayOnly:
      typeof value.mondayWednesdayOnly === 'boolean'
        ? value.mondayWednesdayOnly
        : defaults.mondayWednesdayOnly,
    notificationsEnabled:
      typeof value.notificationsEnabled === 'boolean'
        ? value.notificationsEnabled
        : defaults.notificationsEnabled,
    notificationPermission: validPermission,
    notificationPermissionDenied:
      typeof value.notificationPermissionDenied === 'boolean'
        ? value.notificationPermissionDenied
        : validPermission === 'denied',
    faithPromptEnabled:
      typeof value.faithPromptEnabled === 'boolean'
        ? value.faithPromptEnabled
        : defaults.faithPromptEnabled,
    quietModeUntil: optionalString(value.quietModeUntil) ? value.quietModeUntil : undefined,
    snoozeUntil: optionalString(value.snoozeUntil) ? value.snoozeUntil : undefined,
    reminderCadenceMinutes:
      typeof value.reminderCadenceMinutes === 'number' && value.reminderCadenceMinutes > 0
        ? value.reminderCadenceMinutes
        : defaults.reminderCadenceMinutes,
    emailSetupEnabled: false,
    lastNotificationId: optionalString(value.lastNotificationId) ? value.lastNotificationId : undefined,
    lastNotificationTime: optionalString(value.lastNotificationTime)
      ? value.lastNotificationTime
      : undefined,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : defaults.createdAt,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : defaults.updatedAt,
  };
};

export const normalizeDailyHealthLog = (value: unknown, date = todayIsoDate()): DailyHealthLog => {
  const defaults = createDefaultDailyHealthLog(date);

  if (!isRecord(value)) {
    return defaults;
  }

  return {
    ...defaults,
    date: typeof value.date === 'string' ? value.date : defaults.date,
    waterCount: typeof value.waterCount === 'number' ? Math.max(0, value.waterCount) : 0,
    outdoorMinutes: typeof value.outdoorMinutes === 'number' ? Math.max(0, value.outdoorMinutes) : 0,
    movementBreaks: typeof value.movementBreaks === 'number' ? Math.max(0, value.movementBreaks) : 0,
    eyeBreaks: typeof value.eyeBreaks === 'number' ? Math.max(0, value.eyeBreaks) : 0,
    postureResets: typeof value.postureResets === 'number' ? Math.max(0, value.postureResets) : 0,
    nervousSystemResets:
      typeof value.nervousSystemResets === 'number' ? Math.max(0, value.nervousSystemResets) : 0,
    lunchAwayFromScreen:
      typeof value.lunchAwayFromScreen === 'boolean' ? value.lunchAwayFromScreen : false,
    shutdownCompleted:
      typeof value.shutdownCompleted === 'boolean' ? value.shutdownCompleted : false,
    skippedCount: typeof value.skippedCount === 'number' ? Math.max(0, value.skippedCount) : 0,
    snoozedCount: typeof value.snoozedCount === 'number' ? Math.max(0, value.snoozedCount) : 0,
    urgentTicketModeCount:
      typeof value.urgentTicketModeCount === 'number' ? Math.max(0, value.urgentTicketModeCount) : 0,
    completedActionIds: stringArray(value.completedActionIds),
    completedReminderIds: stringArray(value.completedReminderIds),
    skippedReminderIds: stringArray(value.skippedReminderIds),
    lastResetAt: optionalString(value.lastResetAt) ? value.lastResetAt : undefined,
    lastCompletedActionId: optionalString(value.lastCompletedActionId)
      ? value.lastCompletedActionId
      : undefined,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : defaults.createdAt,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : defaults.updatedAt,
  };
};
