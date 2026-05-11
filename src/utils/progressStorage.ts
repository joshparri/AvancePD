import type { MspSkillReadiness } from '../data/mspSkills';

export type ScenarioStatus = 'not-started' | 'practised' | 'confident' | 'needs-review';

export type ScenarioProgress = {
  status: ScenarioStatus;
  lastPractisedDate?: string;
  reflection?: string;
};

export type AvanceProgress = {
  scenarioProgress: Record<string, ScenarioProgress>;
  skillReadinessOverrides: Record<string, MspSkillReadiness>;
  ticketNotePracticeCount: number;
  migratedLegacyTicketNotePracticeCount?: number;
  lastPractisedDate?: string;
  weakAreas: string[];
  workdayFocus?: string;
  quickSupportMode?: string;
  viewedMicroCardIds?: string[];
};

export const defaultProgress: AvanceProgress = {
  scenarioProgress: {},
  skillReadinessOverrides: {},
  ticketNotePracticeCount: 0,
  weakAreas: []
};

export const progressStorageKey = 'avance-msp-progress';
export const legacyTicketNotePracticeCountKey = 'avance-ticket-note-practice-count';

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function loadProgress(): AvanceProgress {
  if (typeof window === 'undefined') {
    return defaultProgress;
  }

  try {
    const raw = window.localStorage.getItem(progressStorageKey);
    const progress = raw ? { ...defaultProgress, ...(JSON.parse(raw) as AvanceProgress) } : defaultProgress;
    return migrateLegacyTicketNotePracticeCount(progress);
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: AvanceProgress) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
}

export function setScenarioProgress(
  progress: AvanceProgress,
  scenarioId: string,
  status: ScenarioStatus,
  reflection?: string
): AvanceProgress {
  const current = progress.scenarioProgress[scenarioId];
  return {
    ...progress,
    lastPractisedDate: todayIso(),
    scenarioProgress: {
      ...progress.scenarioProgress,
      [scenarioId]: {
        status,
        lastPractisedDate: status === 'not-started' ? current?.lastPractisedDate : todayIso(),
        reflection: reflection ?? current?.reflection
      }
    }
  };
}

export function setSkillReadiness(
  progress: AvanceProgress,
  skillId: string,
  readiness: MspSkillReadiness
): AvanceProgress {
  return {
    ...progress,
    lastPractisedDate: todayIso(),
    skillReadinessOverrides: {
      ...progress.skillReadinessOverrides,
      [skillId]: readiness
    }
  };
}

export function incrementTicketNotePractice(progress: AvanceProgress): AvanceProgress {
  return {
    ...progress,
    ticketNotePracticeCount: progress.ticketNotePracticeCount + 1,
    lastPractisedDate: todayIso()
  };
}

export function markMicroCardViewed(progress: AvanceProgress, cardId: string): AvanceProgress {
  const current = progress.viewedMicroCardIds ?? [];
  if (current.includes(cardId)) return progress;
  return { ...progress, viewedMicroCardIds: [...current, cardId] };
}

export function updateWorkdayProgress(progress: AvanceProgress, workdayFocus: string, quickSupportMode: string): AvanceProgress {
  return {
    ...progress,
    workdayFocus,
    quickSupportMode
  };
}

function migrateLegacyTicketNotePracticeCount(progress: AvanceProgress): AvanceProgress {
  const rawLegacyCount = window.localStorage.getItem(legacyTicketNotePracticeCountKey);
  const legacyCount = rawLegacyCount ? Number(rawLegacyCount) : 0;
  const migratedCount = progress.migratedLegacyTicketNotePracticeCount ?? 0;

  if (!Number.isFinite(legacyCount) || legacyCount <= migratedCount) {
    return progress;
  }

  const migratedProgress = {
    ...progress,
    ticketNotePracticeCount: progress.ticketNotePracticeCount + (legacyCount - migratedCount),
    migratedLegacyTicketNotePracticeCount: legacyCount
  };

  saveProgress(migratedProgress);
  return migratedProgress;
}
