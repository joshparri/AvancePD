import { healthActions } from '@/data/healthOutdoors';
import {
  createDefaultDailyHealthLog,
  DailyHealthLog,
  HealthOutdoorsSettings,
  normalizeDailyHealthLog,
  normalizeHealthOutdoorsSettings,
  WeeklyHealthSummary,
} from '@/types/healthOutdoors';

const SETTINGS_KEY = 'avance:health-outdoors-settings';
const LOG_KEY_PREFIX = 'avance:health-outdoors-log-';

export const getLocalIsoDate = (date = new Date()) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
};

const canUseLocalStorage = () => {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readJson = (key: string): unknown => {
  if (!canUseLocalStorage()) {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore local storage quota or privacy-mode failures.
  }
};

const logKey = (date: string) => `${LOG_KEY_PREFIX}${date}`;

const withUpdatedAt = <T extends { updatedAt: string }>(value: T): T => ({
  ...value,
  updatedAt: new Date().toISOString(),
});

const unique = (items: string[]) => [...new Set(items)];

const getActionCategory = (actionId: string) => {
  const action = healthActions.find((item) => item.id === actionId);
  return action?.category;
};

export const getHealthOutdoorsSettings = (): HealthOutdoorsSettings =>
  normalizeHealthOutdoorsSettings(readJson(SETTINGS_KEY));

export const saveHealthOutdoorsSettings = (
  settings: HealthOutdoorsSettings
): HealthOutdoorsSettings => {
  const normalized = normalizeHealthOutdoorsSettings(withUpdatedAt(settings));
  writeJson(SETTINGS_KEY, normalized);
  return normalized;
};

export const updateHealthOutdoorsSettings = (
  updates: Partial<HealthOutdoorsSettings>
): HealthOutdoorsSettings => saveHealthOutdoorsSettings({ ...getHealthOutdoorsSettings(), ...updates });

export const getHealthLog = (date = getLocalIsoDate()): DailyHealthLog =>
  normalizeDailyHealthLog(readJson(logKey(date)), date);

export const getTodayHealthLog = (): DailyHealthLog => getHealthLog(getLocalIsoDate());

export const saveHealthLog = (log: DailyHealthLog): DailyHealthLog => {
  const normalized = normalizeDailyHealthLog(withUpdatedAt(log), log.date);
  writeJson(logKey(normalized.date), normalized);
  return normalized;
};

export const saveTodayHealthLog = (log: DailyHealthLog): DailyHealthLog =>
  saveHealthLog({ ...log, date: getLocalIsoDate() });

const updateTodayHealthLog = (update: (log: DailyHealthLog) => DailyHealthLog): DailyHealthLog =>
  saveHealthLog(update(getTodayHealthLog()));

export const incrementWater = (): DailyHealthLog =>
  updateTodayHealthLog((log) => ({
    ...log,
    waterCount: log.waterCount + 1,
    completedActionIds: unique([...log.completedActionIds, 'hydration-water-drink']),
    lastCompletedActionId: 'hydration-water-drink',
  }));

export const addOutdoorMinutes = (minutes: number): DailyHealthLog =>
  updateTodayHealthLog((log) => ({
    ...log,
    outdoorMinutes: log.outdoorMinutes + Math.max(0, Math.round(minutes)),
    completedActionIds: unique([...log.completedActionIds, 'outdoors-daylight-break']),
    lastCompletedActionId: 'outdoors-daylight-break',
  }));

export const completeHealthAction = (actionId: string, reminderId?: string): DailyHealthLog =>
  updateTodayHealthLog((log) => {
    const category = getActionCategory(actionId);
    const nextLog = {
      ...log,
      completedActionIds: unique([...log.completedActionIds, actionId]),
      completedReminderIds: reminderId
        ? unique([...log.completedReminderIds, reminderId])
        : log.completedReminderIds,
      lastCompletedActionId: actionId,
    };

    switch (category) {
      case 'hydration':
        return { ...nextLog, waterCount: nextLog.waterCount + 1 };
      case 'outdoors':
      case 'sleep':
        return { ...nextLog, outdoorMinutes: nextLog.outdoorMinutes + 5 };
      case 'eyes':
        return { ...nextLog, eyeBreaks: nextLog.eyeBreaks + 1 };
      case 'movement':
        return { ...nextLog, movementBreaks: nextLog.movementBreaks + 1 };
      case 'posture':
        return { ...nextLog, postureResets: nextLog.postureResets + 1 };
      case 'stress':
        return {
          ...nextLog,
          nervousSystemResets: nextLog.nervousSystemResets + 1,
          lastResetAt: new Date().toISOString(),
        };
      case 'lunch':
        return { ...nextLog, lunchAwayFromScreen: true };
      case 'shutdown':
        return { ...nextLog, shutdownCompleted: true };
      default:
        return nextLog;
    }
  });

export const completeTwoMinuteReset = (): DailyHealthLog =>
  updateTodayHealthLog((log) => ({
    ...log,
    nervousSystemResets: log.nervousSystemResets + 1,
    completedActionIds: unique([...log.completedActionIds, 'stress-breathing']),
    lastCompletedActionId: 'stress-breathing',
    lastResetAt: new Date().toISOString(),
  }));

export const skipHealthReminder = (reminderId: string): DailyHealthLog =>
  updateTodayHealthLog((log) => ({
    ...log,
    skippedCount: log.skippedCount + 1,
    skippedReminderIds: unique([...log.skippedReminderIds, reminderId]),
  }));

export const snoozeReminder = (minutes: number): {
  settings: HealthOutdoorsSettings;
  log: DailyHealthLog;
} => {
  const snoozeUntil = new Date(Date.now() + Math.max(1, minutes) * 60 * 1000).toISOString();
  const settings = updateHealthOutdoorsSettings({ snoozeUntil });
  const log = updateTodayHealthLog((current) => ({
    ...current,
    snoozedCount: current.snoozedCount + 1,
  }));

  return { settings, log };
};

export const enableQuietMode = (minutes: number): HealthOutdoorsSettings => {
  const quietModeUntil = new Date(Date.now() + Math.max(1, minutes) * 60 * 1000).toISOString();
  return updateHealthOutdoorsSettings({ quietModeUntil });
};

export const enableUrgentTicketMode = (): {
  settings: HealthOutdoorsSettings;
  log: DailyHealthLog;
} => {
  const settings = enableQuietMode(60);
  const log = updateTodayHealthLog((current) => ({
    ...current,
    urgentTicketModeCount: current.urgentTicketModeCount + 1,
  }));

  return { settings, log };
};

export const resetTodayHealthLog = (): DailyHealthLog =>
  saveHealthLog(createDefaultDailyHealthLog(getLocalIsoDate()));

const getStoredHealthLogDates = (): string[] => {
  if (!canUseLocalStorage()) {
    return [];
  }

  const dates: string[] = [];

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith(LOG_KEY_PREFIX)) {
        dates.push(key.slice(LOG_KEY_PREFIX.length));
      }
    }
  } catch {
    return [];
  }

  return dates.sort();
};

export const getStoredHealthLogs = (): DailyHealthLog[] =>
  getStoredHealthLogDates().map((date) => getHealthLog(date));

export const getRecentHealthLogs = (days = 7, now = new Date()): DailyHealthLog[] => {
  const dates = new Set<string>();

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - offset);
    dates.add(getLocalIsoDate(date));
  }

  return [...dates].sort().map((date) => getHealthLog(date));
};

export const getWeeklyHealthSummary = (days = 7): WeeklyHealthSummary => {
  const logs = getRecentHealthLogs(days);
  const first = logs[0] ?? createDefaultDailyHealthLog();
  const last = logs[logs.length - 1] ?? first;

  return logs.reduce<WeeklyHealthSummary>(
    (summary, log) => ({
      ...summary,
      waterCount: summary.waterCount + log.waterCount,
      outdoorMinutes: summary.outdoorMinutes + log.outdoorMinutes,
      movementBreaks: summary.movementBreaks + log.movementBreaks,
      eyeBreaks: summary.eyeBreaks + log.eyeBreaks,
      postureResets: summary.postureResets + log.postureResets,
      nervousSystemResets: summary.nervousSystemResets + log.nervousSystemResets,
      lunchAwayFromScreenCount:
        summary.lunchAwayFromScreenCount + (log.lunchAwayFromScreen ? 1 : 0),
      shutdownCompletedCount: summary.shutdownCompletedCount + (log.shutdownCompleted ? 1 : 0),
      skippedCount: summary.skippedCount + log.skippedCount,
      snoozedCount: summary.snoozedCount + log.snoozedCount,
      urgentTicketModeCount: summary.urgentTicketModeCount + log.urgentTicketModeCount,
      logsCount: summary.logsCount + 1,
    }),
    {
      fromDate: first.date,
      toDate: last.date,
      waterCount: 0,
      outdoorMinutes: 0,
      movementBreaks: 0,
      eyeBreaks: 0,
      postureResets: 0,
      nervousSystemResets: 0,
      lunchAwayFromScreenCount: 0,
      shutdownCompletedCount: 0,
      skippedCount: 0,
      snoozedCount: 0,
      urgentTicketModeCount: 0,
      logsCount: 0,
    }
  );
};

export const getManagerSafeHealthSummary = () =>
  'Josh used a structured wellbeing routine to support sustainable MSP work, including planned hydration, screen breaks, movement resets, outdoor/daylight breaks, and end-of-day shutdown habits.';

export const markHealthNotificationSent = (
  reminderId: string,
  sentAt = new Date().toISOString()
): HealthOutdoorsSettings =>
  updateHealthOutdoorsSettings({
    lastNotificationId: reminderId,
    lastNotificationTime: sentAt,
  });

export const exportHealthOutdoorsJson = (): string =>
  JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      privacy:
        'Simple local action tracking only. No medical records, ticket details, hostnames, IP addresses, screenshots, client data, or passwords.',
      settings: getHealthOutdoorsSettings(),
      logs: getStoredHealthLogs(),
      weeklySummary: getWeeklyHealthSummary(),
    },
    null,
    2
  );
