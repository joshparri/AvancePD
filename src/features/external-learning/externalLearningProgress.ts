import type { ExternalLearningProgress } from './externalLearningTypes';

export const externalLearningStorageKey = 'avancepd.externalLearningProgress';

const defaultProgress: ExternalLearningProgress = {
  savedExternalResourceIds: [],
  startedExternalResourceIds: [],
  completedExternalResourceIds: []
};

function ensureUnique(values: string[]) {
  return Array.from(new Set(values));
}

export function loadExternalLearningProgress(): ExternalLearningProgress {
  const raw = window.localStorage.getItem(externalLearningStorageKey);
  if (!raw) return defaultProgress;

  try {
    const parsed = JSON.parse(raw) as Partial<ExternalLearningProgress>;
    return {
      savedExternalResourceIds: Array.isArray(parsed.savedExternalResourceIds) ? ensureUnique(parsed.savedExternalResourceIds.map(String)) : [],
      startedExternalResourceIds: Array.isArray(parsed.startedExternalResourceIds) ? ensureUnique(parsed.startedExternalResourceIds.map(String)) : [],
      completedExternalResourceIds: Array.isArray(parsed.completedExternalResourceIds) ? ensureUnique(parsed.completedExternalResourceIds.map(String)) : []
    };
  } catch {
    return defaultProgress;
  }
}

export function saveExternalLearningProgress(progress: ExternalLearningProgress): ExternalLearningProgress {
  window.localStorage.setItem(externalLearningStorageKey, JSON.stringify(progress));
  return progress;
}

function updateProgress(progress: ExternalLearningProgress, resourceId: string, key: keyof ExternalLearningProgress) {
  const next = {
    ...progress,
    [key]: ensureUnique([...progress[key], resourceId])
  } as ExternalLearningProgress;
  return next;
}

export function markResourceSaved(resourceId: string): ExternalLearningProgress {
  const current = loadExternalLearningProgress();
  const next = updateProgress(current, resourceId, 'savedExternalResourceIds');
  return saveExternalLearningProgress(next);
}

export function markResourceStarted(resourceId: string): ExternalLearningProgress {
  const current = loadExternalLearningProgress();
  const next = updateProgress(current, resourceId, 'startedExternalResourceIds');
  return saveExternalLearningProgress(next);
}

export function markResourceCompleted(resourceId: string): ExternalLearningProgress {
  const current = loadExternalLearningProgress();
  const next = updateProgress(current, resourceId, 'completedExternalResourceIds');
  const started = updateProgress(next, resourceId, 'startedExternalResourceIds');
  return saveExternalLearningProgress(started);
}

export function getResourceProgress(resourceId: string) {
  const current = loadExternalLearningProgress();
  return {
    saved: current.savedExternalResourceIds.includes(resourceId),
    started: current.startedExternalResourceIds.includes(resourceId),
    completed: current.completedExternalResourceIds.includes(resourceId)
  };
}
