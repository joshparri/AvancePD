'use client';

export interface BonusEvent {
  type: 'multiplier' | 'shield' | 'rare_scenario';
  value: number;
  message: string;
}

export interface RewardState {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastPlayedDate: string;
  streakShields: number;
  totalSessionsCompleted: number;
  unlockedBadges: string[];
  nodeProgress: Record<string, number>;
  lastSessionRankPercentile: number;
  bossAttemptsToday: Record<string, string>;
  mysteryMeter: number;
}

const STORAGE_KEY = 'avance_game_reward_state';
const LEGACY_KEY = 'avance:game-progress';
const XP_PER_LEVEL = 500;
const MAX_SHIELDS = 3;
const BONUS_CHANCE = 0.15;
const MYSTERY_METER_MAX = 5;

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const xpForLevel = (level: number) => (level - 1) * XP_PER_LEVEL;

export const levelFromXp = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

export const xpProgressInLevel = (xp: number) => {
  const level = levelFromXp(xp);
  const current = xp - xpForLevel(level);
  return { current, max: XP_PER_LEVEL, level, percent: Math.min(100, Math.round((current / XP_PER_LEVEL) * 100)) };
};

const defaultState = (): RewardState => ({
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastPlayedDate: '',
  streakShields: 0,
  totalSessionsCompleted: 0,
  unlockedBadges: [],
  nodeProgress: {},
  lastSessionRankPercentile: 62,
  bossAttemptsToday: {},
  mysteryMeter: 0,
});

const migrateLegacy = (): Partial<RewardState> | null => {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { totalXp?: number; currentStreak?: number; longestStreak?: number; lastPlayedDate?: string | null };
    return {
      xp: parsed.totalXp ?? 0,
      streak: parsed.currentStreak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      lastPlayedDate: parsed.lastPlayedDate ?? '',
    };
  } catch {
    return null;
  }
};

export const loadRewardState = (): RewardState => {
  if (!canUseStorage()) return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = migrateLegacy();
      const base = defaultState();
      if (legacy) {
        const xp = legacy.xp ?? 0;
        return {
          ...base,
          ...legacy,
          xp,
          level: levelFromXp(xp),
          lastPlayedDate: legacy.lastPlayedDate ?? '',
        };
      }
      return base;
    }
    const parsed = JSON.parse(raw) as Partial<RewardState>;
    const xp = parsed.xp ?? 0;
    return {
      ...defaultState(),
      ...parsed,
      xp,
      level: levelFromXp(xp),
      nodeProgress: parsed.nodeProgress ?? {},
      unlockedBadges: parsed.unlockedBadges ?? [],
      bossAttemptsToday: parsed.bossAttemptsToday ?? {},
      mysteryMeter: parsed.mysteryMeter ?? 0,
    };
  } catch {
    return defaultState();
  }
};

export const saveRewardState = (state: RewardState): void => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const rollBonus = (forceReward = false): BonusEvent | null => {
  if (!forceReward && Math.random() >= BONUS_CHANCE) return null;
  const roll = Math.random();
  if (roll < 0.4) {
    return { type: 'multiplier', value: 2, message: 'Mystery drop: 2x XP bonus.' };
  }
  if (roll < 0.75) {
    return { type: 'shield', value: 1, message: 'Mystery drop: streak shield earned.' };
  }
  return {
    type: 'rare_scenario',
    value: Math.floor(Math.random() * 6) + 1,
    message: 'Mystery drop: rare scenario bonus unlocked.',
  };
};

export const spinForBonus = (
  state: RewardState
): { newState: RewardState; bonusEvent: BonusEvent | null; xpGained: number } => {
  const nextMeter = Math.min(MYSTERY_METER_MAX, state.mysteryMeter + 1);
  const guaranteedDrop = nextMeter >= MYSTERY_METER_MAX;
  const bonusEvent = rollBonus(guaranteedDrop);
  const base = 8 + Math.floor(Math.random() * 8);
  let xpGained = base;
  let next: RewardState = {
    ...state,
    mysteryMeter: bonusEvent ? 0 : nextMeter,
  };

  if (bonusEvent?.type === 'multiplier') {
    xpGained = base * bonusEvent.value;
  }
  if (bonusEvent?.type === 'shield') {
    next = { ...next, streakShields: Math.min(MAX_SHIELDS, next.streakShields + bonusEvent.value) };
  }

  next = {
    ...next,
    xp: next.xp + xpGained,
    level: levelFromXp(next.xp + xpGained),
    totalSessionsCompleted: next.totalSessionsCompleted + 1,
  };

  return { newState: next, bonusEvent, xpGained };
};

export const addXP = (
  state: RewardState,
  amount: number,
  multiplier = 1
): { newState: RewardState; bonusEvent: BonusEvent | null; xpGained: number } => {
  const baseAmount = Math.max(0, Math.round(amount * multiplier));
  const nextMeter = Math.min(MYSTERY_METER_MAX, state.mysteryMeter + 1);
  const guaranteedDrop = nextMeter >= MYSTERY_METER_MAX;
  const bonusEvent = rollBonus(guaranteedDrop);
  let xpGained = baseAmount;
  let next: RewardState = {
    ...state,
    mysteryMeter: bonusEvent ? 0 : nextMeter,
  };

  if (bonusEvent?.type === 'multiplier') {
    xpGained = baseAmount * bonusEvent.value;
  }
  if (bonusEvent?.type === 'shield') {
    next = {
      ...next,
      streakShields: Math.min(MAX_SHIELDS, next.streakShields + 1),
    };
  }

  const xp = next.xp + xpGained;
  next = {
    ...next,
    xp,
    level: levelFromXp(xp),
    totalSessionsCompleted: next.totalSessionsCompleted + 1,
  };

  return { newState: next, bonusEvent, xpGained };
};

export const mysteryMeterProgress = (state: RewardState) => ({
  current: state.mysteryMeter,
  max: MYSTERY_METER_MAX,
  percent: Math.round((state.mysteryMeter / MYSTERY_METER_MAX) * 100),
});

const todayKey = () => new Date().toISOString().slice(0, 10);

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

export type StreakUpdateResult = {
  newState: RewardState;
  shieldUsed: boolean;
};

export const updateStreak = (state: RewardState): StreakUpdateResult => {
  const today = todayKey();
  if (state.lastPlayedDate === today) {
    return { newState: state, shieldUsed: false };
  }

  let shieldUsed = false;
  let streak = state.streak;

  if (state.lastPlayedDate === yesterdayKey()) {
    streak = Math.max(1, streak + 1);
  } else if (state.lastPlayedDate && state.lastPlayedDate < yesterdayKey()) {
    if (state.streakShields > 0) {
      shieldUsed = true;
      streak = Math.max(1, state.streak);
    } else {
      streak = 1;
    }
  } else {
    streak = 1;
  }

  const newState: RewardState = {
    ...state,
    streak,
    longestStreak: Math.max(state.longestStreak, streak),
    lastPlayedDate: today,
    streakShields: shieldUsed ? Math.max(0, state.streakShields - 1) : state.streakShields,
  };

  return { newState, shieldUsed };
};

export const checkNodeUnlock = (state: RewardState, nodeId: string, threshold: number): boolean =>
  (state.nodeProgress[nodeId] ?? 0) >= threshold;

export const recordNodeActivity = (state: RewardState, nodeId: string): RewardState => {
  const nodeProgress = { ...state.nodeProgress };
  nodeProgress[nodeId] = (nodeProgress[nodeId] ?? 0) + 1;
  return { ...state, nodeProgress };
};

export const awardBadge = (state: RewardState, badgeId: string): RewardState => {
  if (state.unlockedBadges.includes(badgeId)) return state;
  return { ...state, unlockedBadges: [...state.unlockedBadges, badgeId] };
};

export const canAttemptBossToday = (state: RewardState, nodeId: string): boolean =>
  state.bossAttemptsToday[nodeId] !== todayKey();

export const recordBossAttempt = (state: RewardState, nodeId: string): RewardState => ({
  ...state,
  bossAttemptsToday: { ...state.bossAttemptsToday, [nodeId]: todayKey() },
});

export const streakFlameTier = (streak: number): 'none' | 'warm' | 'hot' | 'legend' => {
  if (streak >= 30) return 'legend';
  if (streak >= 14) return 'hot';
  if (streak >= 7) return 'warm';
  return 'none';
};
