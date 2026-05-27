import { useEffect, useMemo, useState } from 'react';
import { microLearningCards, type MicroLearningCard } from '../data/microLearning';
import { mspScenarios } from '../data/mspScenarios';

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
  }
}

const gameStorageKey = 'avance-pd-games-state';

const factions = [
  { id: 'identity-guild', name: 'Identity Guild' },
  { id: 'cloud-court', name: 'Cloud Court' },
  { id: 'network-watch', name: 'Network Watch' },
  { id: 'security-circle', name: 'Security Circle' },
  { id: 'endpoint-smiths', name: 'Endpoint Smiths' },
  { id: 'recovery-order', name: 'Recovery Order' },
  { id: 'docs-college', name: 'Docs College' }
] as const;

const upgrades = [
  {
    id: 'automation-grid',
    name: 'Automation Grid',
    detail: 'Adds passive XP and credits after every contract.',
    baseCost: 60,
    maxRank: 5
  },
  {
    id: 'knowledge-forge',
    name: 'Knowledge Forge',
    detail: 'Raises XP from correct answers and teach-back contracts.',
    baseCost: 75,
    maxRank: 5
  },
  {
    id: 'loot-signal',
    name: 'Loot Signal',
    detail: 'Improves the chance of rare reward rolls.',
    baseCost: 90,
    maxRank: 4
  },
  {
    id: 'focus-cache',
    name: 'Focus Cache',
    detail: 'Increases maximum focus for stronger tactical plays.',
    baseCost: 85,
    maxRank: 4
  },
  {
    id: 'guild-mentor',
    name: 'Guild Mentor',
    detail: 'Softens the penalty from one wrong answer during a streak.',
    baseCost: 110,
    maxRank: 3
  }
] as const;

const tactics = [
  { id: 'none', name: 'Clean Run', cost: 0, detail: 'Keep focus for later.' },
  { id: 'scope-scan', name: 'Scope Scan', cost: 1, detail: 'Reveal the key clue.' },
  { id: 'mentor-call', name: 'Mentor Call', cost: 2, detail: 'Reduce answer noise.' },
  { id: 'automation-burst', name: 'Automation Burst', cost: 2, detail: 'Double credit payout.' },
  { id: 'change-window', name: 'Change Window', cost: 1, detail: 'Protect one streak break.' }
] as const;

type FactionId = (typeof factions)[number]['id'];
type UpgradeId = (typeof upgrades)[number]['id'];
type TacticId = (typeof tactics)[number]['id'];
type MissionDifficulty = 'cadet' | 'operator' | 'veteran';
type MissionKind = 'scope' | 'risk' | 'teach';
type GameMode = 'contracts' | 'factory' | 'raid';
type RewardRarity = 'common' | 'rare' | 'epic';

type MissionOption = {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
};

type GameMission = {
  id: string;
  cardId: string;
  title: string;
  category: string;
  factionId: FactionId;
  difficulty: MissionDifficulty;
  kind: MissionKind;
  prompt: string;
  options: MissionOption[];
  correctOptionId: string;
  clue: string;
  successText: string;
  failureText: string;
  flowSteps: string[];
  scenarioTitle?: string;
  scenarioId?: string;
};

type MissionLog = {
  missionId: string;
  cardId: string;
  category: string;
  correct: boolean;
  reward: string;
  xp: number;
  credits: number;
  at: string;
};

type AvancePDGameState = {
  xp: number;
  credits: number;
  streak: number;
  bestStreak: number;
  focus: number;
  turn: number;
  heat: number;
  raidIntegrity: number;
  masteredCardIds: string[];
  badges: string[];
  rareFinds: string[];
  upgrades: Record<UpgradeId, number>;
  factionStanding: Record<FactionId, number>;
  currentMissionId: string;
  history: MissionLog[];
};

type MissionOutcome = {
  correct: boolean;
  cardId: string;
  missionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  answerFeedback: string;
  title: string;
  message: string;
  explanation: string;
  reward: string;
  rarity: RewardRarity;
  xp: number;
  credits: number;
  streak: number;
  raidCleared: boolean;
};

const factionIds = factions.map((faction) => faction.id) as FactionId[];
const upgradeIds = upgrades.map((upgrade) => upgrade.id) as UpgradeId[];

const difficultySettings: Record<MissionDifficulty, { label: string; xp: number; credits: number; heat: number }> = {
  cadet: { label: 'Cadet', xp: 28, credits: 16, heat: 8 },
  operator: { label: 'Operator', xp: 42, credits: 24, heat: 12 },
  veteran: { label: 'Veteran', xp: 58, credits: 34, heat: 16 }
};

const rarityLoot: Record<RewardRarity, string[]> = {
  common: ['Clean Note', 'Patch Token', 'Scope Mark', 'Review Spark'],
  rare: ['Runbook Sigil', 'Signal Lens', 'Escalation Seal', 'Automation Shard'],
  epic: ['Zero-Downtime Relic', 'Incident Crown', 'Mastery Prism', 'Vault Key']
};

function createRecord<K extends string>(keys: readonly K[], value: number) {
  return Object.fromEntries(keys.map((key) => [key, value])) as Record<K, number>;
}

function defaultGameState(): AvancePDGameState {
  return {
    xp: 0,
    credits: 80,
    streak: 0,
    bestStreak: 0,
    focus: 3,
    turn: 0,
    heat: 18,
    raidIntegrity: 100,
    masteredCardIds: [],
    badges: [],
    rareFinds: [],
    upgrades: createRecord(upgradeIds, 0),
    factionStanding: createRecord(factionIds, 0),
    currentMissionId: '',
    history: []
  };
}

function loadGameState(): AvancePDGameState {
  const fallback = defaultGameState();
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(gameStorageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<AvancePDGameState>;
    return {
      ...fallback,
      ...parsed,
      upgrades: { ...fallback.upgrades, ...(parsed.upgrades ?? {}) },
      factionStanding: { ...fallback.factionStanding, ...(parsed.factionStanding ?? {}) },
      masteredCardIds: Array.isArray(parsed.masteredCardIds) ? parsed.masteredCardIds : [],
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      rareFinds: Array.isArray(parsed.rareFinds) ? parsed.rareFinds : [],
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, 80) : []
    };
  } catch {
    return fallback;
  }
}

function saveGameState(state: AvancePDGameState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(gameStorageKey, JSON.stringify(state));
}

function firstSentence(value: string) {
  return value.match(/[^.!?]+[.!?]?/)?.[0]?.trim() ?? value;
}

function shorten(value: string, maxLength = 130) {
  const clean = value.trim().replace(/\s+/g, ' ');
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 3).trim()}...` : clean;
}

function rotateOptions(items: Array<Omit<MissionOption, 'id'>>, missionId: string, rotateBy: number) {
  const rotate = rotateBy % items.length;
  const rotated = [...items.slice(rotate), ...items.slice(0, rotate)];
  return rotated.map((item, index) => ({ ...item, id: `${missionId}-option-${index}` }));
}

function factionForCategory(category: string): FactionId {
  const lower = category.toLowerCase();
  if (lower.includes('identity')) return 'identity-guild';
  if (lower.includes('m365') || lower.includes('collaboration')) return 'cloud-court';
  if (lower.includes('network')) return 'network-watch';
  if (lower.includes('cyber') || lower.includes('security')) return 'security-circle';
  if (lower.includes('endpoint') || lower.includes('intune')) return 'endpoint-smiths';
  if (lower.includes('backup') || lower.includes('infrastructure')) return 'recovery-order';
  return 'docs-college';
}

function scenarioTitleFor(card: MicroLearningCard) {
  const directScenario = mspScenarios.find((scenario) => card.linkedScenarioIds.includes(scenario.id));
  if (directScenario) return directScenario.title;
  return mspScenarios.find((scenario) => scenario.relatedSkillIds.some((skillId) => card.linkedSkillIds.includes(skillId)))?.title;
}

function scenarioIdFor(card: MicroLearningCard) {
  const directScenario = mspScenarios.find((scenario) => card.linkedScenarioIds.includes(scenario.id));
  if (directScenario) return directScenario.id;
  return mspScenarios.find((scenario) => scenario.relatedSkillIds.some((skillId) => card.linkedSkillIds.includes(skillId)))?.id;
}

function buildMissionOptions(
  missionId: string,
  correctText: string,
  correctFeedback: string,
  distractors: Array<{ text: string; feedback: string }>,
  rotateBy: number
) {
  const options = rotateOptions(
    [
      { text: correctText, correct: true, feedback: correctFeedback },
      ...distractors.slice(0, 3).map((distractor) => ({ ...distractor, correct: false }))
    ],
    missionId,
    rotateBy
  );
  return {
    options,
    correctOptionId: options.find((option) => option.correct)?.id ?? options[0].id
  };
}

function buildMissions(cards: MicroLearningCard[]): GameMission[] {
  return cards.flatMap((card, cardIndex) => {
    const factionId = factionForCategory(card.category);
    const scenarioTitle = scenarioTitleFor(card);
    const scenarioId = scenarioIdFor(card);
    const difficulties: MissionDifficulty[] = ['cadet', 'operator', 'veteran'];
    const concept = shorten(firstSentence(card.concept));
    const specificRisk = shorten(card.commonMistake);
    const teachBack = shorten(firstSentence(card.whyItMatters));
    const flowSteps = [
      `Intake: identify whether this is ${card.topic.toLowerCase()} and confirm the user impact before changing anything.`,
      `Safe check: ${shorten(card.practiceTask, 120)}`,
      `Risk guard: ${shorten(card.commonMistake, 120)}`,
      `Teach-back: ${shorten(firstSentence(card.whyItMatters), 120)}`
    ];

    const scopeId = `${card.id}-scope`;
    const scopeOptions = buildMissionOptions(
      scopeId,
      `Scope the issue first, then apply this concept: ${concept}`,
      'Correct: this keeps the first move tied to evidence, not guessing.',
      [
        {
          text: 'Perform the largest reset available and see what changes.',
          feedback: 'That is overreach. A broad reset can disrupt users and hide the original cause before you have scoped it.'
        },
        {
          text: 'Ask for private credentials so you can test as the user.',
          feedback: 'That breaks a core support boundary. Never ask for passwords or private credentials.'
        },
        {
          text: 'Close the ticket as soon as the user stops replying.',
          feedback: 'That skips confirmation. A quiet user is not proof the root cause is fixed or safely documented.'
        }
      ],
      cardIndex
    );

    const riskId = `${card.id}-risk`;
    const riskOptions = buildMissionOptions(
      riskId,
      `Avoid this exact trap: ${specificRisk}`,
      'Correct: the common mistake is the highest-value trap to recognize before acting.',
      [
        {
          text: 'Avoid writing any ticket notes until the whole queue is empty.',
          feedback: 'Poor documentation is bad practice, but it is not the specific risk this concept is warning you about.'
        },
        {
          text: 'Avoid asking scope questions because they slow the first response.',
          feedback: 'Scope questions are usually the fast path. Skipping them makes the fix less reliable.'
        },
        {
          text: 'Avoid checking evidence when the user sounds confident.',
          feedback: 'User confidence is useful context, not proof. You still need evidence before changing systems.'
        }
      ],
      cardIndex + 1
    );

    const teachId = `${card.id}-teach`;
    const teachOptions = buildMissionOptions(
      teachId,
      teachBack,
      'Correct: this explains the operational reason the concept matters.',
      [
        {
          text: 'It matters mostly because tickets look better when they have more technical words.',
          feedback: 'That confuses appearance with skill. Good IT learning is about safer decisions, less rework, and clearer outcomes.'
        },
        {
          text: 'It matters because fast action is always safer than asking one more question.',
          feedback: 'Speed helps only after you know the risk. One precise question can prevent the wrong fix.'
        },
        {
          text: 'It matters only when a manager is watching the queue.',
          feedback: 'That misses the point. The concept matters even when nobody is watching because it protects the user, client, and system.'
        }
      ],
      cardIndex + 2
    );

    return [
      {
        id: scopeId,
        cardId: card.id,
        title: `${card.topic}: first move`,
        category: card.category,
        factionId,
        difficulty: difficulties[cardIndex % difficulties.length],
        kind: 'scope',
        prompt: `Ticket pressure hits: ${card.topic}. What is the best opening play?`,
        clue: card.concept,
        successText: 'You narrowed the fault before changing the environment.',
        failureText: 'That choice creates avoidable risk. Start by scoping, preserving evidence, and using the safest first check.',
        flowSteps,
        scenarioTitle,
        scenarioId,
        ...scopeOptions
      },
      {
        id: riskId,
        cardId: card.id,
        title: `${card.topic}: risk call`,
        category: card.category,
        factionId,
        difficulty: difficulties[(cardIndex + 1) % difficulties.length],
        kind: 'risk',
        prompt: `Which mistake would most likely create a repeat ticket or security risk here?`,
        clue: card.commonMistake,
        successText: 'You spotted the trap before it became technical debt.',
        failureText: 'The dangerous move is the one the card warns about directly. Slow down and protect the system state.',
        flowSteps,
        scenarioTitle,
        scenarioId,
        ...riskOptions
      },
      {
        id: teachId,
        cardId: card.id,
        title: `${card.topic}: teach-back`,
        category: card.category,
        factionId,
        difficulty: difficulties[(cardIndex + 2) % difficulties.length],
        kind: 'teach',
        prompt: `A teammate asks why this concept matters. Which answer proves you understand it?`,
        clue: card.whyItMatters,
        successText: 'Clean teach-back. That knowledge is now easier to use under pressure.',
        failureText: 'The best explanation connects the concept to risk, time, safety, or repeat tickets.',
        flowSteps,
        scenarioTitle,
        scenarioId,
        ...teachOptions
      }
    ];
  });
}

function getLevelInfo(xp: number) {
  let level = 1;
  let spent = 0;
  let next = 120;

  while (xp - spent >= next) {
    spent += next;
    level += 1;
    next = 120 + level * 45;
  }

  return {
    level,
    current: xp - spent,
    next,
    percent: Math.min(100, Math.round(((xp - spent) / next) * 100))
  };
}

function getRankName(level: number) {
  if (level >= 18) return 'Principal Strategist';
  if (level >= 12) return 'Senior Incident Mage';
  if (level >= 7) return 'Systems Adept';
  if (level >= 4) return 'Queue Ranger';
  return 'Apprentice Analyst';
}

function getUpgradeCost(upgrade: (typeof upgrades)[number], rank: number) {
  return upgrade.baseCost + rank * Math.round(upgrade.baseCost * 0.65);
}

function hashText(value: string) {
  return value.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyEvent(today: string) {
  const events = [
    { name: 'Identity audit window', factionId: 'identity-guild' as FactionId, bonus: '+12 XP on Identity Guild contracts' },
    { name: 'Cloud migration sprint', factionId: 'cloud-court' as FactionId, bonus: '+12 XP on Cloud Court contracts' },
    { name: 'Network change freeze', factionId: 'network-watch' as FactionId, bonus: '+12 XP on Network Watch contracts' },
    { name: 'Security drill', factionId: 'security-circle' as FactionId, bonus: '+12 XP on Security Circle contracts' },
    { name: 'Endpoint hardening push', factionId: 'endpoint-smiths' as FactionId, bonus: '+12 XP on Endpoint Smiths contracts' },
    { name: 'Recovery test day', factionId: 'recovery-order' as FactionId, bonus: '+12 XP on Recovery Order contracts' },
    { name: 'Documentation harvest', factionId: 'docs-college' as FactionId, bonus: '+12 XP on Docs College contracts' }
  ];
  return events[hashText(today) % events.length];
}

function pickNextMission(missions: GameMission[], state: AvancePDGameState) {
  const recentIds = new Set(state.history.slice(0, 6).map((entry) => entry.missionId));
  const unmastered = missions.filter((mission) => !state.masteredCardIds.includes(mission.cardId) && !recentIds.has(mission.id));
  const candidates = unmastered.length > 0 ? unmastered : missions.filter((mission) => !recentIds.has(mission.id));
  const pool = candidates.length > 0 ? candidates : missions;
  const index = Math.abs(state.turn * 7 + state.xp + state.streak * 13) % pool.length;
  return pool[index] ?? missions[0];
}

function rollReward(state: AvancePDGameState, mission: GameMission, isCorrect: boolean): { name: string; rarity: RewardRarity } {
  if (!isCorrect) return { name: 'Practice Spark', rarity: 'common' };

  const signalRank = state.upgrades['loot-signal'];
  const chance = Math.min(0.42, 0.16 + signalRank * 0.045 + Math.min(state.streak, 8) * 0.012);
  const roll = Math.random();
  const rarity: RewardRarity = roll < 0.055 + signalRank * 0.01 ? 'epic' : roll < chance ? 'rare' : 'common';
  const lootPool = rarityLoot[rarity];
  const lootName = lootPool[Math.floor(Math.random() * lootPool.length)] ?? lootPool[0];
  const faction = factions.find((item) => item.id === mission.factionId)?.name ?? 'Guild';
  return { name: `${lootName} of the ${faction}`, rarity };
}

function earnedBadges(state: AvancePDGameState) {
  const badges: string[] = [];
  const masteredCategories = new Set(
    microLearningCards
      .filter((card) => state.masteredCardIds.includes(card.id))
      .map((card) => card.category)
  );
  const totalUpgradeRanks = Object.values(state.upgrades).reduce((total, rank) => total + rank, 0);

  if (state.history.length >= 1) badges.push('First Contract Cleared');
  if (state.bestStreak >= 5) badges.push('Five-Fix Streak');
  if (state.bestStreak >= 10) badges.push('Flow State');
  if (state.masteredCardIds.length >= 10) badges.push('Ten Concepts Mastered');
  if (masteredCategories.size >= 5) badges.push('Cross-Discipline Operator');
  if (totalUpgradeRanks >= 8) badges.push('Factory Builder');
  if (state.rareFinds.length >= 3) badges.push('Rare Cache Hunter');

  return badges;
}

function getDailyQuests(state: AvancePDGameState, today: string) {
  const todays = state.history.filter((entry) => entry.at.slice(0, 10) === today);
  const correctToday = todays.filter((entry) => entry.correct);
  const categoriesToday = new Set(correctToday.map((entry) => entry.category));

  return [
    { title: 'Clear five contracts', progress: Math.min(todays.length, 5), target: 5 },
    { title: 'Chain three correct calls', progress: Math.min(state.streak, 3), target: 3 },
    { title: 'Master two skill domains', progress: Math.min(categoriesToday.size, 2), target: 2 }
  ];
}

type AvancePDGamesProps = {
  onNavigate?: (page: string, focusId?: string) => void;
};

function AvancePDGames({ onNavigate }: AvancePDGamesProps) {
  const missions = useMemo(() => buildMissions(microLearningCards), []);
  const [gameState, setGameState] = useState<AvancePDGameState>(loadGameState);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [activeTactic, setActiveTactic] = useState<TacticId>('none');
  const [mode, setMode] = useState<GameMode>('contracts');
  const [lastOutcome, setLastOutcome] = useState<MissionOutcome | null>(null);

  const currentMission = missions.find((mission) => mission.id === gameState.currentMissionId) ?? missions[0];
  const currentCard = microLearningCards.find((card) => card.id === currentMission?.cardId);
  const currentFaction = factions.find((faction) => faction.id === currentMission?.factionId);
  const activeTacticConfig = tactics.find((tactic) => tactic.id === activeTactic) ?? tactics[0];
  const levelInfo = getLevelInfo(gameState.xp);
  const rankName = getRankName(levelInfo.level);
  const today = todayIso();
  const dailyEvent = getDailyEvent(today);
  const dailyQuests = getDailyQuests(gameState, today);
  const maxFocus = 3 + gameState.upgrades['focus-cache'];
  const playerScore = gameState.xp + gameState.credits + gameState.masteredCardIds.length * 70 + gameState.bestStreak * 35;
  const leaderboard = [
    { name: 'You', score: playerScore },
    { name: 'Patch Guild', score: 1450 },
    { name: 'Signal Desk', score: 980 },
    { name: 'Night Queue', score: 720 }
  ].sort((a, b) => b.score - a.score);
  const reviewedCard = lastOutcome
    ? microLearningCards.find((card) => card.id === lastOutcome.cardId)
    : currentCard;
  const reviewedMission = lastOutcome
    ? missions.find((mission) => mission.id === lastOutcome.missionId)
    : currentMission;
  const reviewedScenarioId = reviewedMission?.scenarioId ?? reviewedCard?.linkedScenarioIds[0];
  const conceptMastery = microLearningCards.map((card) => {
    const cardHistory = gameState.history.filter((entry) => entry.cardId === card.id);
    const correct = cardHistory.filter((entry) => entry.correct).length;
    return {
      card,
      attempts: cardHistory.length,
      correct,
      mastered: gameState.masteredCardIds.includes(card.id)
    };
  });
  const practisedConcepts = conceptMastery.filter((row) => row.attempts > 0 || row.mastered);
  const masteryPercent = Math.round((gameState.masteredCardIds.length / microLearningCards.length) * 100);

  const visibleOptions = useMemo(() => {
    if (!currentMission) return [];
    if (activeTactic === 'mentor-call' && gameState.focus >= activeTacticConfig.cost) {
      const correct = currentMission.options.find((option) => option.correct);
      const firstWrong = currentMission.options.find((option) => !option.correct);
      return currentMission.options.filter((option) => option.id === correct?.id || option.id === firstWrong?.id);
    }
    return currentMission.options;
  }, [activeTactic, activeTacticConfig.cost, currentMission, gameState.focus]);

  useEffect(() => {
    if (!gameState.currentMissionId && missions[0]) {
      setGameState((current) => ({ ...current, currentMissionId: missions[0].id }));
    }
  }, [gameState.currentMissionId, missions]);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    window.render_game_to_text = () => JSON.stringify({
      page: 'AvancePDGames',
      mode,
      level: levelInfo.level,
      rankName,
      xp: gameState.xp,
      credits: gameState.credits,
      focus: gameState.focus,
      streak: gameState.streak,
      currentMission: currentMission?.title,
      selectedOptionId,
      visibleOptions: visibleOptions.map((option) => ({ id: option.id, text: option.text })),
      reviewConcept: reviewedCard?.topic,
      masteredConcepts: gameState.masteredCardIds.length,
      masteryPercent,
      lastOutcome
    });
    window.advanceTime = () => undefined;

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [currentMission, gameState, lastOutcome, levelInfo.level, masteryPercent, mode, rankName, reviewedCard, selectedOptionId, visibleOptions]);

  const buyUpgrade = (upgradeId: UpgradeId) => {
    const upgrade = upgrades.find((item) => item.id === upgradeId);
    if (!upgrade) return;

    setGameState((current) => {
      const currentRank = current.upgrades[upgradeId] ?? 0;
      const cost = getUpgradeCost(upgrade, currentRank);
      if (currentRank >= upgrade.maxRank || current.credits < cost) return current;

      return {
        ...current,
        credits: current.credits - cost,
        upgrades: {
          ...current.upgrades,
          [upgradeId]: currentRank + 1
        },
        focus: upgradeId === 'focus-cache' ? Math.min(current.focus + 1, 3 + currentRank + 1) : current.focus
      };
    });
  };

  const startNextMission = () => {
    setGameState((current) => ({ ...current, currentMissionId: pickNextMission(missions, current).id }));
    setSelectedOptionId('');
    setLastOutcome(null);
    setActiveTactic('none');
  };

  const submitAnswer = () => {
    if (!currentMission || !selectedOptionId) return;

    const selected = currentMission.options.find((option) => option.id === selectedOptionId);
    const correct = selected?.id === currentMission.correctOptionId;
    const current = gameState;
    const currentMaxFocus = 3 + current.upgrades['focus-cache'];
    const tacticCost = activeTacticConfig.cost;
    const tacticReady = current.focus >= tacticCost;
    const protectedWrong = !correct && activeTactic === 'change-window' && tacticReady;
    const automationBurst = correct && activeTactic === 'automation-burst' && tacticReady;
    const nextStreak = correct ? current.streak + 1 : protectedWrong ? Math.max(1, current.streak) : 0;
    const difficulty = difficultySettings[currentMission.difficulty];
    const dailyBonus = correct && currentMission.factionId === dailyEvent.factionId ? 12 : 0;
    const passiveXp = current.upgrades['automation-grid'] * 4;
    const passiveCredits = current.upgrades['automation-grid'] * 3;
    const forgeBonus = 1 + current.upgrades['knowledge-forge'] * 0.08 + (currentMission.kind === 'teach' ? 0.06 : 0);
    const modeXp = mode === 'contracts' ? 8 : 0;
    const modeCredits = mode === 'factory' ? 10 : 0;
    const baseXp = correct ? Math.round((difficulty.xp + dailyBonus + modeXp) * forgeBonus) : protectedWrong ? 10 : 5;
    const baseCredits = correct ? difficulty.credits + modeCredits : 4;
    const xpGain = baseXp + passiveXp;
    let creditsGain = baseCredits + passiveCredits + (automationBurst ? baseCredits : 0);
    const focusAfterCost = Math.max(0, current.focus - (activeTactic === 'none' || !tacticReady ? 0 : tacticCost));
    const nextFocus = correct ? Math.min(currentMaxFocus, focusAfterCost + 1) : focusAfterCost;
    const reward = rollReward(current, currentMission, correct);
    const nextMastered = new Set(current.masteredCardIds);
    const nextRareFinds = new Set(current.rareFinds);
    let raidIntegrity = current.raidIntegrity;
    let finalXpGain = xpGain;
    let raidCleared = false;

    if (correct) {
      nextMastered.add(currentMission.cardId);
      if (reward.rarity !== 'common') nextRareFinds.add(reward.name);
      const raidDamage = difficulty.heat + nextStreak * 2 + (mode === 'raid' ? 12 : 0);
      raidIntegrity = Math.max(0, current.raidIntegrity - raidDamage);
      if (raidIntegrity === 0) {
        raidCleared = true;
        raidIntegrity = 100;
        finalXpGain += 120;
        creditsGain += 100;
        nextRareFinds.add(`Raid cache ${today}`);
      }
    } else {
      raidIntegrity = Math.min(100, current.raidIntegrity + 5);
    }

    const nextStanding = {
      ...current.factionStanding,
      [currentMission.factionId]: current.factionStanding[currentMission.factionId] + (correct ? 3 : 1)
    };
    const nextHeat = correct ? Math.max(0, current.heat - difficulty.heat) : Math.min(100, current.heat + 11);
    const logEntry: MissionLog = {
      missionId: currentMission.id,
      cardId: currentMission.cardId,
      category: currentMission.category,
      correct,
      reward: reward.name,
      xp: finalXpGain,
      credits: creditsGain,
      at: new Date().toISOString()
    };

    let nextState: AvancePDGameState = {
      ...current,
      xp: current.xp + finalXpGain,
      credits: current.credits + creditsGain,
      streak: nextStreak,
      bestStreak: Math.max(current.bestStreak, nextStreak),
      focus: nextFocus,
      turn: current.turn + 1,
      heat: nextHeat,
      raidIntegrity,
      masteredCardIds: Array.from(nextMastered),
      rareFinds: Array.from(nextRareFinds).slice(-16),
      factionStanding: nextStanding,
      history: [logEntry, ...current.history].slice(0, 80)
    };
    nextState = {
      ...nextState,
      badges: Array.from(new Set([...nextState.badges, ...earnedBadges(nextState)])),
      currentMissionId: pickNextMission(missions, nextState).id
    };

    setGameState(nextState);
    setLastOutcome({
      correct,
      cardId: currentMission.cardId,
      missionId: currentMission.id,
      selectedAnswer: selected?.text ?? 'No answer selected',
      correctAnswer: currentMission.options.find((option) => option.id === currentMission.correctOptionId)?.text ?? '',
      answerFeedback: selected?.feedback ?? 'Review the concept card before trying the next contract.',
      title: correct ? 'Contract cleared' : protectedWrong ? 'Streak protected' : 'Contract failed',
      message: correct ? currentMission.successText : protectedWrong ? 'The change window caught the mistake. Review the clue and keep moving.' : currentMission.failureText,
      explanation: currentMission.clue,
      reward: raidCleared ? `${reward.name} plus Raid Cache` : reward.name,
      rarity: raidCleared ? 'epic' : reward.rarity,
      xp: finalXpGain,
      credits: creditsGain,
      streak: nextStreak,
      raidCleared
    });
    setSelectedOptionId('');
    setActiveTactic('none');
  };

  const resetGame = () => {
    if (!window.confirm('Reset AvancePDGames progress on this device?')) return;
    setGameState({ ...defaultGameState(), currentMissionId: missions[0]?.id ?? '' });
    setSelectedOptionId('');
    setLastOutcome(null);
    setActiveTactic('none');
  };

  if (!currentMission) {
    return (
      <section className="card">
        <h1>AvancePDGames</h1>
        <p>No learning missions are available yet.</p>
      </section>
    );
  }

  return (
    <div className="games-page">
      <section className="card games-hero-card">
        <div className="games-hero-grid">
          <div>
            <span className="games-kicker">AvancePDGames</span>
            <h1>NOC Citadel</h1>
            <p className="page-subtitle">
              Clear IT contracts, grow your guild rank, build automation, and turn MSP concepts into fast instincts.
            </p>
          </div>
          <div className="games-stat-stack">
            <div className="games-rank-panel">
              <span className="games-stat-label">Rank</span>
              <strong>{rankName}</strong>
              <span>Level {levelInfo.level}</span>
            </div>
            <div className="games-resource-row">
              <span className="status-chip success">{gameState.credits} credits</span>
              <span className="status-chip info">{gameState.focus}/{maxFocus} focus</span>
              <span className="status-chip warn">{gameState.streak} streak</span>
            </div>
          </div>
        </div>
        <div className="games-xp-track" aria-label={`XP progress ${levelInfo.percent}%`}>
          <div className="games-xp-fill" style={{ width: `${levelInfo.percent}%` }} />
        </div>
        <div className="games-xp-caption">
          <span>{levelInfo.current} / {levelInfo.next} XP to next level</span>
          <span>{gameState.masteredCardIds.length} concepts mastered</span>
        </div>
      </section>

      <div className="games-command-grid">
        <section className="card games-mission-card">
          <div className="games-mode-tabs" role="tablist" aria-label="AvancePDGames mode">
            {[
              ['contracts', 'Contracts'],
              ['factory', 'Factory'],
              ['raid', 'Raid']
            ].map(([modeId, label]) => (
              <button
                key={modeId}
                type="button"
                className={mode === modeId ? 'games-mode-tab active' : 'games-mode-tab'}
                onClick={() => setMode(modeId as GameMode)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="games-mission-header">
            <div>
              <div className="metric-row">
                <span className="status-chip info">{difficultySettings[currentMission.difficulty].label}</span>
                <span className="status-chip success">{currentFaction?.name}</span>
                <span className="status-chip warn">{currentMission.category}</span>
              </div>
              <h2>{currentMission.title}</h2>
              {currentMission.scenarioTitle && (
                <p className="games-scenario-link">Scenario thread: {currentMission.scenarioTitle}</p>
              )}
            </div>
            <div className="games-raid-meter">
              <span>Raid integrity</span>
              <strong>{gameState.raidIntegrity}%</strong>
            </div>
          </div>

          <div className="games-prompt-panel">
            <p>{currentMission.prompt}</p>
            {activeTactic === 'scope-scan' && gameState.focus >= activeTacticConfig.cost && (
              <div className="games-clue-box">
                <strong>Scope scan:</strong> {currentMission.clue}
              </div>
            )}
          </div>

          <div className="games-tactic-row">
            {tactics.map((tactic) => (
              <button
                key={tactic.id}
                type="button"
                className={activeTactic === tactic.id ? 'games-tactic active' : 'games-tactic'}
                onClick={() => setActiveTactic(tactic.id)}
                disabled={tactic.cost > gameState.focus}
              >
                <strong>{tactic.name}</strong>
                <span>{tactic.cost === 0 ? 'Free' : `${tactic.cost} focus`} - {tactic.detail}</span>
              </button>
            ))}
          </div>

          <div className="games-flow-panel">
            <h3>Troubleshooting flow</h3>
            <div className="games-flow-steps">
              {currentMission.flowSteps.map((step, index) => (
                <div key={step} className="games-flow-step">
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="games-options">
            {visibleOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={selectedOptionId === option.id ? 'games-option active' : 'games-option'}
                onClick={() => setSelectedOptionId(option.id)}
              >
                {option.text}
              </button>
            ))}
          </div>

          <div className="games-action-row">
            <button type="button" className="primary-action" onClick={submitAnswer} disabled={!selectedOptionId}>
              Lock answer
            </button>
            <button type="button" className="secondary-action" onClick={startNextMission}>
              New contract
            </button>
          </div>

          {lastOutcome && (
            <div className={`games-outcome ${lastOutcome.correct ? 'success' : 'miss'}`}>
              <div>
                <span className={`status-chip ${lastOutcome.correct ? 'success' : 'error'}`}>{lastOutcome.title}</span>
                <h3>{lastOutcome.reward}</h3>
              </div>
              <p>{lastOutcome.message}</p>
              <div className="games-answer-review">
                <div>
                  <strong>Your answer</strong>
                  <p>{lastOutcome.selectedAnswer}</p>
                </div>
                {!lastOutcome.correct && (
                  <div>
                    <strong>Correct answer</strong>
                    <p>{lastOutcome.correctAnswer}</p>
                  </div>
                )}
                <div>
                  <strong>{lastOutcome.correct ? 'Why it works' : 'Why that answer failed'}</strong>
                  <p>{lastOutcome.answerFeedback}</p>
                </div>
              </div>
              <p className="games-outcome-note">{lastOutcome.explanation}</p>
              <div className="metric-row">
                <span className="status-chip info">+{lastOutcome.xp} XP</span>
                <span className="status-chip success">+{lastOutcome.credits} credits</span>
                <span className="status-chip warn">{lastOutcome.streak} streak</span>
                {lastOutcome.raidCleared && <span className="status-chip success">Raid cache opened</span>}
              </div>
              {reviewedCard && (
                <div className="games-review-panel">
                  <div className="games-panel-header">
                    <h3>Review this concept</h3>
                    <span className="status-chip info">{reviewedCard.category}</span>
                  </div>
                  <h4>{reviewedCard.topic}</h4>
                  <div className="games-review-grid">
                    <div>
                      <strong>Concept</strong>
                      <p>{reviewedCard.concept}</p>
                    </div>
                    <div>
                      <strong>Why it matters</strong>
                      <p>{reviewedCard.whyItMatters}</p>
                    </div>
                    <div>
                      <strong>Common mistake</strong>
                      <p>{reviewedCard.commonMistake}</p>
                    </div>
                    <div>
                      <strong>Practice task</strong>
                      <p>{reviewedCard.practiceTask}</p>
                    </div>
                  </div>
                  <div className="games-action-row">
                    <button type="button" className="secondary-action" onClick={() => onNavigate?.('microLearning', reviewedCard.id)}>
                      Open exact concept card
                    </button>
                    {reviewedScenarioId && (
                      <button type="button" className="secondary-action" onClick={() => onNavigate?.('mspScenarios', reviewedScenarioId)}>
                        Open linked scenario
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <div className="games-side-stack">
          <section className="card games-panel">
            <div className="games-panel-header">
              <h2>Today</h2>
              <span className="status-chip info">{dailyEvent.name}</span>
            </div>
            <p className="games-muted">{dailyEvent.bonus}</p>
            <div className="games-quest-list">
              {dailyQuests.map((quest) => (
                <div key={quest.title} className="games-quest-row">
                  <div>
                    <strong>{quest.title}</strong>
                    <span>{quest.progress}/{quest.target}</span>
                  </div>
                  <div className="games-mini-track">
                    <div style={{ width: `${Math.round((quest.progress / quest.target) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card games-panel">
            <div className="games-panel-header">
              <h2>Factory</h2>
              <span className="status-chip success">Heat {gameState.heat}%</span>
            </div>
            <div className="games-upgrade-list">
              {upgrades.map((upgrade) => {
                const rank = gameState.upgrades[upgrade.id];
                const cost = getUpgradeCost(upgrade, rank);
                return (
                  <div key={upgrade.id} className="games-upgrade-row">
                    <div>
                      <strong>{upgrade.name} <span>{rank}/{upgrade.maxRank}</span></strong>
                      <p>{upgrade.detail}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => buyUpgrade(upgrade.id)}
                      disabled={rank >= upgrade.maxRank || gameState.credits < cost}
                    >
                      {rank >= upgrade.maxRank ? 'Max' : `${cost}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <div className="games-lower-grid">
        <section className="card games-panel">
          <div className="games-panel-header">
            <h2>Guild Board</h2>
            <span className="status-chip warn">Best streak {gameState.bestStreak}</span>
          </div>
          <div className="games-leaderboard">
            {leaderboard.map((entry, index) => (
              <div key={entry.name} className={entry.name === 'You' ? 'games-leader-row player' : 'games-leader-row'}>
                <span>{index + 1}</span>
                <strong>{entry.name}</strong>
                <em>{entry.score}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="card games-panel">
          <div className="games-panel-header">
            <h2>Factions</h2>
            <span className="status-chip info">{gameState.badges.length} badges</span>
          </div>
          <div className="games-faction-grid">
            {factions.map((faction) => {
              const standing = gameState.factionStanding[faction.id];
              return (
                <div key={faction.id} className="games-faction-row">
                  <strong>{faction.name}</strong>
                  <div className="games-mini-track">
                    <div style={{ width: `${Math.min(100, standing)}%` }} />
                  </div>
                  <span>{standing} standing</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card games-panel games-mastery-panel">
          <div className="games-panel-header">
            <h2>Concept Mastery</h2>
            <span className="status-chip success">{masteryPercent}%</span>
          </div>
          <p className="games-muted">
            {gameState.masteredCardIds.length} of {microLearningCards.length} IT concepts have been cleared at least once.
          </p>
          <div className="games-mastery-list">
            {(practisedConcepts.length > 0 ? practisedConcepts : conceptMastery.slice(0, 6)).slice(0, 10).map(({ card, attempts, correct, mastered }) => (
              <button
                key={card.id}
                type="button"
                className={mastered ? 'games-mastery-row mastered' : 'games-mastery-row'}
                onClick={() => onNavigate?.('microLearning', card.id)}
              >
                <strong>{card.topic}</strong>
                <span>{mastered ? 'mastered' : attempts > 0 ? 'practised' : 'not started'} - {correct}/{attempts || 0} correct</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card games-panel">
          <div className="games-panel-header">
            <h2>Vault</h2>
            <button type="button" className="games-reset-btn" onClick={resetGame}>Reset</button>
          </div>
          <div className="games-vault-list">
            {[...gameState.badges, ...gameState.rareFinds].slice(-10).map((item) => (
              <span key={item}>{item}</span>
            ))}
            {gameState.badges.length === 0 && gameState.rareFinds.length === 0 && (
              <p className="games-muted">Clear contracts to fill the vault.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AvancePDGames;
