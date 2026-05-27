import { useEffect, useMemo, useState } from 'react';

type GameMission = {
  id: string;
  title: string;
  category: string;
  description: string;
  xp: number;
  rating: string;
  tags: string[];
  subject: string;
  learningOutcome: string;
  relatedPage?: string;
  relatedStudy?: string;
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
    title: 'One More Turn: Build Your IT Empire',
    category: 'Strategy',
    description:
      'A Civilization-style quest that rewards you for refining one more IT concept, one more process, and one more automation flow.',
    subject: 'Identity & Automation',
    learningOutcome: 'Sharpen your ability to scale access and automate routine cloud workflows.',
    relatedPage: 'microLearning',
    relatedStudy: 'Identity and Access concepts',
    xp: 120,
    rating: 'gold',
    tags: ['strategy', 'planning', 'automation']
  },
  {
    id: 'support-battle',
    title: 'Support Battle Royale',
    category: 'Competitive',
    description:
      'Treat every ticket like a ranked match: quick triage, smart escalation, and a better run after every loss.',
    subject: 'Triage & Response',
    learningOutcome: 'Improve your speed and judgment on real MSP issues so each session feels like a competitive win.',
    relatedPage: 'mspSkills',
    relatedStudy: 'Incident triage and escalation skills',
    xp: 95,
    rating: 'silver',
    tags: ['competitive', 'speed', 'rank']
  },
  {
    id: 'sandbox-loop',
    title: 'Sandbox Loop: Build and Iterate',
    category: 'Survival',
    description:
      'A Minecraft-like loop for IT learning: explore concepts, build small fixes, then expand your toolkit each time.',
    subject: 'Problem Solving',
    learningOutcome: 'Practice creative diagnostics and build repeatable troubleshooting habits that scale.',
    relatedPage: 'microLearning',
    relatedStudy: 'Diagnostic checklist and troubleshooting loops',
    xp: 90,
    rating: 'silver',
    tags: ['sandbox', 'experiment', 'growth']
  },
  {
    id: 'deck-run',
    title: 'Deck Builder Run',
    category: 'Roguelike',
    description:
      'Collect IT knowledge cards and use them in different scenarios — every run makes your next one stronger.',
    subject: 'Knowledge Collection',
    learningOutcome: 'Build a deck of essential MSP concepts and rewards for repeated practice.',
    relatedPage: 'microLearning',
    relatedStudy: 'Core MSP knowledge cards',
    xp: 110,
    rating: 'gold',
    tags: ['roguelike', 'replayable', 'reward']
  },
  {
    id: 'flow-state',
    title: 'Flow State Sprint',
    category: 'Live Service',
    description:
      'Hit a focused learning sprint with clear goals, instant feedback, and a streak bonus for keeping momentum.',
    subject: 'Focus & Mastery',
    learningOutcome: 'Keep your brain in flow as you grind through meaningful IT skill milestones.',
    relatedPage: 'mspSkills',
    relatedStudy: 'Focused skills mastery challenges',
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

type AvancePDGamesProps = {
  onNavigate?: (page: string) => void;
};

function AvancePDGames({ onNavigate }: AvancePDGamesProps) {
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
          Complete fast quests, open surprise loot, level up your IT skill power, and jump straight into real IT study content after every reward.
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
                <span className="status-chip success">{activeMission.subject}</span>
                <span className="status-chip info">{activeMission.tags.join(' · ')}</span>
              </div>
              <div className="mission-outcome">
                <strong>Learning outcome:</strong> {activeMission.learningOutcome}
              </div>
              <div className="game-actions">
                <button type="button" className="game-action-btn" onClick={() => handleCompleteMission(activeMission)}>
                  Complete quest
                </button>
                <button type="button" className="game-action-btn secondary" onClick={handleShuffleDeck}>
                  Shuffle deck
                </button>
              </div>
              {activeMission.relatedPage && (
                <div className="mission-link">
                  <strong>Study tie:</strong> {activeMission.relatedStudy}
                  <button
                    type="button"
                    className="game-action-btn secondary"
                    onClick={() => onNavigate?.(activeMission.relatedPage ?? 'microLearning')}
                  >
                    Open related study page
                  </button>
                </div>
              )}
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
            <p>
              Each victory also teaches a real IT skill: identity automation, ticket triage, troubleshooting loops, or knowledge card mastery.
            </p>
            <button type="button" className="game-action-btn" onClick={handleOpenLootChest}>
              Open surprise loot chest
            </button>
            <p className="feedback-text">{progress.feedback}</p>
            <div className="game-actions">
              <button type="button" className="game-action-btn secondary" onClick={() => onNavigate?.('microLearning')}>
                Open Micro-Learning
              </button>
              <button type="button" className="game-action-btn secondary" onClick={() => onNavigate?.('mspSkills')}>
                Open MSP Skills
              </button>
            </div>
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
            <p className="game-note">
              Every reward is a learning boost. Use the loot to unlock the next IT concept or skill card.
            </p>
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
        <h3>How this turns into IT learning</h3>
        <ul>
          <li>Your missions are framed around real MSP skills like identity, triage, endpoint support, and cloud automation.</li>
          <li>Completing a quest gives you XP and makes the next IT concept feel like a natural upgrade.</li>
          <li>Each mission includes a direct study tie to Micro-Learning or MSP Skills so your play session flows into actual learning.
          </li>
          <li>Your streak and leaderboard are designed to make returning feel like progressing in a training program, not just a distraction.</li>
          <li>Every reward becomes a prompt to explore a new IT skill card or concept, turning the addictive loop into a study habit.</li>
        </ul>
      </section>
    </div>
  );
}

export default AvancePDGames;
