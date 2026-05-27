import { useEffect, useMemo, useState } from 'react';

type GameMission = {
  id: string;
  title: string;
  category: string;
  description: string;
  xp: number;
  rating: string;
  tags: string[];
};

type LootReward = {
  label: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  xp: number;
  description: string;
};

type GamesProgress = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalPoints: number;
  streakDays: number;
  completedMissions: string[];
  loot: string[];
  lastDailyClaim: string;
  dailyQuestId: string;
  feedback: string;
};

const storageKey = 'avance-games-progress';

const missions: GameMission[] = [
  {
    id: 'one-more-turn',
    title: 'One More Turn: Empire Upgrade',
    category: 'Strategy',
    description:
      'Channel Civilization and Factorio with a planning loop that rewards you for polishing one more concept, one more automation, and one more skills upgrade.',
    xp: 120,
    rating: 'gold',
    tags: ['strategy', 'planning', 'automation']
  },
  {
    id: 'support-battle',
    title: 'Support Battle Royale',
    category: 'Competitive',
    description:
      'Treat every ticket like a ranked match. Fast decisions, immediate feedback, and the drive to come back stronger after each loss.',
    xp: 95,
    rating: 'silver',
    tags: ['competitive', 'speed', 'rank']
  },
  {
    id: 'sandbox-loop',
    title: 'Sandbox Loop: Build and Iterate',
    category: 'Survival',
    description:
      'Use a Minecraft/Stardew-style loop: build a concept foundation, test it, and expand again with better tools every time.',
    xp: 90,
    rating: 'silver',
    tags: ['sandbox', 'experiment', 'growth']
  },
  {
    id: 'deck-run',
    title: 'Deck Builder Run',
    category: 'Roguelike',
    description:
      'Learn like Slay the Spire: each run is different, every reward is unpredictable, and every choice makes the next run stronger.',
    xp: 110,
    rating: 'gold',
    tags: ['roguelike', 'replayable', 'reward']
  },
  {
    id: 'flow-state',
    title: 'Flow State Sprint',
    category: 'Live Service',
    description:
      'Drop into a flow state with instant wins, clear goals, and a streak system that keeps your brain engaged and hungry for the next boost.',
    xp: 80,
    rating: 'bronze',
    tags: ['flow', 'goal', 'instant feedback']
  }
];

const lootRewards: LootReward[] = [
  {
    label: 'Critical Insight',
    rarity: 'rare',
    xp: 35,
    description: 'A sharp idea that makes your next task more efficient.'
  },
  {
    label: 'Practice Token',
    rarity: 'common',
    xp: 12,
    description: 'A small, reliable reward that keeps your compulsion loop moving.'
  },
  {
    label: 'Legendary Shortcut',
    rarity: 'legendary',
    xp: 60,
    description: 'A rare breakthrough that feels like gambling and powers your learning spike.'
  },
  {
    label: 'Resource Cache',
    rarity: 'uncommon',
    xp: 22,
    description: 'A stash of useful knowledge and momentum for your next run.'
  },
  {
    label: 'Restart Bonus',
    rarity: 'common',
    xp: 15,
    description: 'A soft reward for resetting the loop and starting fresh with more focus.'
  }
];

const defaultProgress: GamesProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: 180,
  totalPoints: 0,
  streakDays: 0,
  completedMissions: [],
  loot: [],
  lastDailyClaim: '',
  dailyQuestId: missions[0].id,
  feedback: 'Pick a mission and feel the rush of instant feedback.'
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function loadGameProgress(): GamesProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? { ...defaultProgress, ...(JSON.parse(raw) as GamesProgress) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function saveGameProgress(progress: GamesProgress) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

function rollLoot(): LootReward {
  const roll = Math.random();
  if (roll > 0.94) return lootRewards.find((item) => item.rarity === 'legendary') ?? lootRewards[0];
  if (roll > 0.72) return lootRewards.find((item) => item.rarity === 'rare') ?? lootRewards[0];
  if (roll > 0.42) return lootRewards.find((item) => item.rarity === 'uncommon') ?? lootRewards[0];
  return lootRewards.find((item) => item.rarity === 'common') ?? lootRewards[0];
}

function levelUpProgress(progress: GamesProgress): GamesProgress {
  let xp = progress.xp;
  let level = progress.level;
  let xpToNextLevel = progress.xpToNextLevel;

  while (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level += 1;
    xpToNextLevel = Math.ceil(xpToNextLevel * 1.2);
  }

  return {
    ...progress,
    xp,
    level,
    xpToNextLevel
  };
}

function formatRarity(rarity: LootReward['rarity']) {
  switch (rarity) {
    case 'legendary':
      return '✨';
    case 'rare':
      return '⭐';
    case 'uncommon':
      return '🔹';
    default:
      return '🔸';
  }
}

function AvancePDGames() {
  const [progress, setProgress] = useState<GamesProgress>(loadGameProgress);
  const [activeMissionId, setActiveMissionId] = useState(progress.dailyQuestId);
  const [lastAction, setLastAction] = useState('Ready for a new learning run.');

  useEffect(() => {
    saveGameProgress(progress);
  }, [progress]);

  const activeMission = useMemo(
    () => missions.find((mission) => mission.id === activeMissionId) ?? missions[0],
    [activeMissionId]
  );

  const dailyCompleted = progress.lastDailyClaim === todayIso();

  const xpProgress = Math.min((progress.xp / progress.xpToNextLevel) * 100, 100);

  const handleCompleteMission = (mission: GameMission) => {
    const reward = rollLoot();
    const earnedXp = mission.xp + (mission.id === progress.dailyQuestId ? 20 : 0);
    const next = levelUpProgress({
      ...progress,
      xp: progress.xp + earnedXp + reward.xp,
      totalPoints: progress.totalPoints + earnedXp + reward.xp,
      completedMissions: Array.from(new Set([...progress.completedMissions, mission.id])),
      loot: [reward.label, ...progress.loot].slice(0, 8),
      feedback: `Conquered ${mission.title}. +${earnedXp} XP, +${reward.xp} bonus from ${reward.label}.`,
      streakDays: dailyCompleted ? progress.streakDays : progress.streakDays + 1,
      lastDailyClaim: todayIso()
    });

    setProgress(next);
    setLastAction(`Mission complete: ${mission.title}. Loot found: ${reward.label}.`);
  };

  const handleOpenLootChest = () => {
    const reward = rollLoot();
    const next = levelUpProgress({
      ...progress,
      xp: progress.xp + reward.xp,
      totalPoints: progress.totalPoints + reward.xp,
      loot: [reward.label, ...progress.loot].slice(0, 8),
      feedback: `Opened a loot chest and found ${reward.label}. +${reward.xp} XP!`,
      lastDailyClaim: progress.lastDailyClaim
    });

    setProgress(next);
    setLastAction(`Loot chest opened: ${reward.label}.`);
  };

  const handleShuffleDeck = () => {
    const nextQuest = missions[Math.floor(Math.random() * missions.length)];
    setActiveMissionId(nextQuest.id);
    setProgress((current) => ({
      ...current,
      dailyQuestId: nextQuest.id,
      feedback: `Your deck has been reshuffled. New daily quest: ${nextQuest.title}.`
    }));
    setLastAction(`New deck card drawn: ${nextQuest.title}.`);
  };

  const leaderboard = [
    { name: 'Support Legends', score: 14220 },
    { name: 'Ops Guild', score: 11840 },
    { name: 'You', score: progress.totalPoints }
  ];

  return (
    <div>
      <section className="card game-hero">
        <h1>AvancePD Games</h1>
        <p>
          A learning playground built like the most addictive strategy and live-service games.
          Complete fast quests, open surprise loot, level up your IT skill power, and keep coming back for one more run.
        </p>
        <div className="metric-row">
          <span className="status-chip info">Level {progress.level}</span>
          <span className="status-chip success">{progress.totalPoints} total points</span>
          <span className="status-chip warn">{progress.streakDays} day streak</span>
        </div>
      </section>

      <section className="card game-hub">
        <div className="game-summary">
          <div className="xp-panel">
            <div className="xp-header">
              <div>
                <strong>XP progress</strong>
                <div className="xp-subtitle">{progress.xp} / {progress.xpToNextLevel} XP to next level</div>
              </div>
              <div className="xp-percent">{Math.floor(xpProgress)}%</div>
            </div>
            <div className="xp-bar-background">
              <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>

          <div className="quest-panel">
            <h2>Your Active Quest</h2>
            <div className="quest-card">
              <div className="quest-card-header">
                <span className="status-chip info">{activeMission.category}</span>
                <span className="status-chip success">{activeMission.rating}</span>
              </div>
              <h3>{activeMission.title}</h3>
              <p>{activeMission.description}</p>
              <div className="metric-row">
                <span className="status-chip warn">{activeMission.xp} XP</span>
                <span className="status-chip info">{activeMission.tags.join(' · ')}</span>
              </div>
              <div className="game-actions">
                <button type="button" className="game-action-btn" onClick={() => handleCompleteMission(activeMission)}>
                  Complete quest
                </button>
                <button type="button" className="game-action-btn secondary" onClick={handleShuffleDeck}>
                  Shuffle deck
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="game-board">
          <div className="game-section">
            <h2>Instant Feedback Loop</h2>
            <p>
              Every play gives immediate results: earned XP, a loot reward, and a new game state that fuels the next session.
              That keeps your attention locked in, just like the best competitive and live-service games.
            </p>
            <button type="button" className="game-action-btn" onClick={handleOpenLootChest}>
              Open surprise loot chest
            </button>
            <p className="feedback-text">{progress.feedback}</p>
          </div>

          <div className="game-section leaderboard-card">
            <h2>Guild Leaderboard</h2>
            <ol>
              {leaderboard.map((entry) => (
                <li key={entry.name} className={entry.name === 'You' ? 'leaderboard-you' : ''}>
                  <span>{entry.name}</span>
                  <strong>{entry.score.toLocaleString()}</strong>
                </li>
              ))}
            </ol>
            <p>
              FOMO in a social loop. Keep your score ahead of the guild and the app will gently push you back to earn more.
            </p>
          </div>
        </div>

        <div className="loot-grid">
          <div>
            <h2>Recent loot</h2>
            <div className="loot-list">
              {progress.loot.length === 0 ? (
                <p>No loot yet. Start a quest to earn rewards.</p>
              ) : (
                progress.loot.map((item, index) => (
                  <span key={`${item}-${index}`} className="loot-chip">{item}</span>
                ))
              )}
            </div>
          </div>

          <div>
            <h2>Challenge deck</h2>
            <div className="deck-list">
              {missions.map((mission) => (
                <button
                  key={mission.id}
                  type="button"
                  className={mission.id === activeMissionId ? 'deck-card active' : 'deck-card'}
                  onClick={() => setActiveMissionId(mission.id)}
                >
                  <strong>{mission.title}</strong>
                  <span>{mission.category} · {mission.xp} XP</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card game-insight">
        <h2>Why this feels addictive</h2>
        <ul>
          <li><strong>Variable ratio rewards:</strong> random loot chests and surprise mission bonuses keep every round unpredictable.</li>
          <li><strong>Compulsion loops:</strong> choose a quest, earn XP, open rewards, then invest it into leveling and streaks.</li>
          <li><strong>Clear goals:</strong> your active quest, progress bar, and streak are always visible so you know exactly what to do next.</li>
          <li><strong>Instant gratification:</strong> each button click gives feedback immediately, mirroring the dopamine burst of the best games.</li>
          <li><strong>Social pull:</strong> the leaderboard simulates the urge to stay competitive and not fall behind.</li>
        </ul>
      </section>
    </div>
  );
}

export default AvancePDGames;
