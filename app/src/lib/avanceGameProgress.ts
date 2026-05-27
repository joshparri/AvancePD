'use client';

import type { AvanceGameMode, AvanceSkillNodeId } from '@/data/avanceGameContent';
import { avanceSkillTree } from '@/data/avanceGameContent';

export interface AvanceGameProgress {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  completedChallengeIds: string[];
  modeStats: Record<AvanceGameMode, { played: number; correct: number }>;
  sessionCorrectStreak: number;
  reviewsDue: string[];
}

const STORAGE_KEY = 'avance:game-progress';

const defaultModeStats = (): AvanceGameProgress['modeStats'] => ({
  'recall-rush': { played: 0, correct: 0 },
  'ticket-detective': { played: 0, correct: 0 },
  'flow-drill': { played: 0, correct: 0 },
  'logic-sprint': { played: 0, correct: 0 },
  'command-line': { played: 0, correct: 0 },
  'break-fix': { played: 0, correct: 0 },
});

const defaultProgress = (): AvanceGameProgress => ({
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  completedChallengeIds: [],
  modeStats: defaultModeStats(),
  sessionCorrectStreak: 0,
  reviewsDue: [],
});

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const todayKey = () => new Date().toISOString().slice(0, 10);

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

export const getAvanceGameProgress = (): AvanceGameProgress => {
  if (!canUseStorage()) return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<AvanceGameProgress>;
    return {
      ...defaultProgress(),
      ...parsed,
      modeStats: { ...defaultModeStats(), ...parsed.modeStats },
    };
  } catch {
    return defaultProgress();
  }
};

const saveProgress = (progress: AvanceGameProgress) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const updateStreakOnPlay = (progress: AvanceGameProgress): AvanceGameProgress => {
  const today = todayKey();
  if (progress.lastPlayedDate === today) return progress;

  let currentStreak = progress.currentStreak;
  if (progress.lastPlayedDate === yesterdayKey()) {
    currentStreak += 1;
  } else if (progress.lastPlayedDate === null) {
    currentStreak = 1;
  } else {
    currentStreak = 1;
  }

  return {
    ...progress,
    lastPlayedDate: today,
    currentStreak,
    longestStreak: Math.max(progress.longestStreak, currentStreak),
  };
};

export const recordChallengeResult = (
  progress: AvanceGameProgress,
  opts: {
    challengeId: string;
    mode: AvanceGameMode;
    correct: boolean;
    xpEarned: number;
  }
): AvanceGameProgress => {
  let next = updateStreakOnPlay(progress);
  const modeStats = { ...next.modeStats };
  modeStats[opts.mode] = {
    played: modeStats[opts.mode].played + 1,
    correct: modeStats[opts.mode].correct + (opts.correct ? 1 : 0),
  };

  const sessionCorrectStreak = opts.correct ? next.sessionCorrectStreak + 1 : 0;
  const totalXp = next.totalXp + (opts.correct ? opts.xpEarned : Math.max(2, Math.floor(opts.xpEarned / 3)));
  const completedChallengeIds = opts.correct
    ? [...new Set([...next.completedChallengeIds, opts.challengeId])]
    : next.completedChallengeIds;

  const reviewsDue = opts.correct
    ? next.reviewsDue.filter((id) => id !== opts.challengeId)
    : [...new Set([...next.reviewsDue, opts.challengeId])].slice(-20);

  next = {
    ...next,
    totalXp,
    modeStats,
    sessionCorrectStreak,
    completedChallengeIds,
    reviewsDue,
  };
  saveProgress(next);
  return next;
};

export const getUnlockedSkillNodes = (totalXp: number): AvanceSkillNodeId[] =>
  avanceSkillTree.filter((node) => totalXp >= node.xpToUnlock).map((node) => node.id);
