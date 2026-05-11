'use client';

import type { MspLearningActivityType } from '@/data/mspLearningActivities';

export interface MspLearningActivityAttempt {
  attempts: number;
  lastCompletedDate?: string;
  minutesLogged: number;
}

export interface MspLearningProgress {
  completedActivityIds: string[];
  activityAttempts: Record<string, MspLearningActivityAttempt>;
  activityMetadata: Record<string, { activityType: MspLearningActivityType; domain: string }>;
  lastCompletedDate?: string;
  minutesLogged: number;
  activityTypeCounts: Record<MspLearningActivityType, number>;
  domainCounts: Record<string, number>;
  reflections: Record<string, string>;
}

const LEARNING_PROGRESS_KEY = 'avance:msp-learning-progress';

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const defaultProgress: MspLearningProgress = {
  completedActivityIds: [],
  activityAttempts: {},
  activityMetadata: {},
  lastCompletedDate: undefined,
  minutesLogged: 0,
  activityTypeCounts: {
    read: 0,
    watch: 0,
    flashcard: 0,
    scenario: 0,
    quiz: 0,
    'command-practice': 0,
    'ticket-note': 0,
    roleplay: 0,
    reflection: 0,
    checklist: 0,
    'mini-project': 0,
    'troubleshooting-flow': 0,
  },
  domainCounts: {},
  reflections: {},
};

const readProgress = (): MspLearningProgress => {
  if (!canUseLocalStorage()) {
    return defaultProgress;
  }

  try {
    const raw = window.localStorage.getItem(LEARNING_PROGRESS_KEY);
    if (!raw) {
      return defaultProgress;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return defaultProgress;
    }

    return {
      ...defaultProgress,
      ...parsed,
      activityTypeCounts: {
        ...defaultProgress.activityTypeCounts,
        ...(parsed.activityTypeCounts ?? {}),
      },
      activityAttempts: parsed.activityAttempts ?? {},
      activityMetadata: parsed.activityMetadata ?? {},
      domainCounts: parsed.domainCounts ?? {},
      reflections: parsed.reflections ?? {},
    };
  } catch {
    return defaultProgress;
  }
};

const writeProgress = (progress: MspLearningProgress) => {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
};

export const getLearningProgress = (): MspLearningProgress => readProgress();

export const getCompletedActivityIds = (): string[] => getLearningProgress().completedActivityIds;

export const markActivityComplete = (
  activityId: string,
  activityType: MspLearningActivityType,
  domain: string,
  minutesLogged = 0
): MspLearningProgress => {
  const progress = getLearningProgress();
  const now = new Date().toISOString();
  const completedIds = [...progress.completedActivityIds];
  const metadata = { ...progress.activityMetadata };
  const activityAttempts = { ...progress.activityAttempts };
  const activityTypeCounts = { ...progress.activityTypeCounts };
  const domainCounts = { ...progress.domainCounts };

  if (!completedIds.includes(activityId)) {
    completedIds.push(activityId);
    metadata[activityId] = { activityType, domain };
    activityTypeCounts[activityType] = (activityTypeCounts[activityType] ?? 0) + 1;
    domainCounts[domain] = (domainCounts[domain] ?? 0) + 1;
  }

  const previousAttempt = activityAttempts[activityId] ?? { attempts: 0, minutesLogged: 0 };
  activityAttempts[activityId] = {
    attempts: previousAttempt.attempts + 1,
    lastCompletedDate: now,
    minutesLogged: previousAttempt.minutesLogged + minutesLogged,
  };

  const nextProgress: MspLearningProgress = {
    ...progress,
    completedActivityIds: completedIds,
    activityMetadata: metadata,
    activityAttempts,
    activityTypeCounts,
    domainCounts,
    minutesLogged: progress.minutesLogged + minutesLogged,
    lastCompletedDate: now,
  };

  writeProgress(nextProgress);
  return nextProgress;
};

export const unmarkActivityComplete = (activityId: string): MspLearningProgress => {
  const progress = getLearningProgress();
  if (!progress.completedActivityIds.includes(activityId)) {
    return progress;
  }

  const completedIds = progress.completedActivityIds.filter((id) => id !== activityId);
  const activityTypeCounts = { ...progress.activityTypeCounts };
  const domainCounts = { ...progress.domainCounts };
  const metadata = { ...progress.activityMetadata };

  const removed = metadata[activityId];
  if (removed) {
    const { activityType, domain } = removed;
    activityTypeCounts[activityType] = Math.max((activityTypeCounts[activityType] ?? 1) - 1, 0);
    domainCounts[domain] = Math.max((domainCounts[domain] ?? 1) - 1, 0);
    delete metadata[activityId];
  }

  const nextProgress: MspLearningProgress = {
    ...progress,
    completedActivityIds: completedIds,
    activityTypeCounts,
    domainCounts,
    activityMetadata: metadata,
  };

  writeProgress(nextProgress);
  return nextProgress;
};

export const getLearningStats = () => {
  const progress = getLearningProgress();
  return {
    completedCount: progress.completedActivityIds.length,
    totalMinutes: progress.minutesLogged,
    activityTypeCounts: progress.activityTypeCounts,
    domainCounts: progress.domainCounts,
    lastCompletedDate: progress.lastCompletedDate,
    totalAttempts: Object.values(progress.activityAttempts).reduce((sum, value) => sum + value.attempts, 0),
  };
};

export const getDueReviewSuggestions = (activities: Array<{ id: string; domain: string; activityType: MspLearningActivityType }>): string[] => {
  const progress = getLearningProgress();
  const incomplete = activities.filter((item) => !progress.completedActivityIds.includes(item.id));
  const typeCounts = progress.activityTypeCounts;
  const recommended: string[] = [];

  const lowType = (['scenario', 'command-practice', 'reflection', 'checklist', 'read'] as MspLearningActivityType[]).find(
    (type) => (typeCounts[type] ?? 0) < 2
  );

  if (lowType) {
    const next = incomplete.find((item) => item.activityType === lowType);
    if (next) {
      recommended.push(next.id);
    }
  }

  const weakDomain = Object.entries(progress.domainCounts)
    .sort((a, b) => a[1] - b[1])
    .map(([domain]) => domain)
    .find(Boolean);

  if (weakDomain) {
    const next = incomplete.find((item) => item.domain === weakDomain);
    if (next && !recommended.includes(next.id)) {
      recommended.push(next.id);
    }
  }

  for (const item of incomplete) {
    if (recommended.length >= 3) break;
    if (!recommended.includes(item.id)) {
      recommended.push(item.id);
    }
  }

  return recommended;
};

export const getActivityTypeBreakdown = (): Record<MspLearningActivityType, number> =>
  getLearningProgress().activityTypeCounts;

export const saveActivityReflection = (activityId: string, note: string): MspLearningProgress => {
  const progress = getLearningProgress();
  const reflections = { ...progress.reflections, [activityId]: note };
  const nextProgress = { ...progress, reflections };
  writeProgress(nextProgress);
  return nextProgress;
};
