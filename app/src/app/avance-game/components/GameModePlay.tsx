'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  avanceGameChallenges,
  avanceGameModeMeta,
  type AvanceGameChallenge,
  type AvanceGameMode,
} from '@/data/avanceGameContent';
import { SKILL_NODES } from './SkillTree';
import { checkNodeUnlock, type RewardState } from '../lib/rewardEngine';

export function getUnlockedNodeIds(reward: RewardState): string[] {
  return SKILL_NODES.filter((node) => {
    if (!node.requires) return true;
    return checkNodeUnlock(reward, node.requires, node.unlockThreshold);
  }).map((n) => n.id);
}

export function pickChallenge(
  mode: AvanceGameMode,
  unlocked: string[],
  completed: string[],
  sessionStreak: number
): AvanceGameChallenge | null {
  const pool = avanceGameChallenges.filter(
    (c) => c.mode === mode && unlocked.includes(c.skillNode) && !completed.includes(c.id)
  );
  if (pool.length === 0) {
    const fallback = avanceGameChallenges.filter((c) => c.mode === mode && unlocked.includes(c.skillNode));
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  if (mode === 'flow-drill' && sessionStreak >= 3) {
    const harder = pool.filter((c) => c.difficulty !== 'easy');
    if (harder.length) return harder[Math.floor(Math.random() * harder.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

type GameModePlayProps = {
  mode: AvanceGameMode;
  challenge: AvanceGameChallenge;
  selectedIndex: number | null;
  feedback: 'idle' | 'correct' | 'wrong';
  lastXp: number;
  sessionStreak: number;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  onExit: () => void;
};

export function GameModePlay({
  mode,
  challenge,
  selectedIndex,
  feedback,
  lastXp,
  onSelect,
  onSubmit,
  onNext,
  onExit,
}: GameModePlayProps) {
  return (
    <Card className="border-blue-200/80 dark:border-blue-900/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{avanceGameModeMeta[mode].label}</CardTitle>
          <div className="flex gap-2">
            <Badge>{challenge.difficulty}</Badge>
            <Badge variant="outline">{challenge.xpReward} XP</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenge.clues && challenge.clues.length > 0 && (
          <div className="rounded-lg border border-amber-200/80 bg-amber-50/80 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-200">Clues</p>
            <ul className="mt-2 space-y-1 text-sm">
              {challenge.clues.map((clue) => (
                <li key={clue}>• {clue}</li>
              ))}
            </ul>
          </div>
        )}
        {challenge.commandHint && <p className="font-mono text-xs text-slate-500">{challenge.commandHint}</p>}
        <p className="text-sm font-medium">{challenge.prompt}</p>
        <div className="space-y-2">
          {challenge.choices.map((choice, index) => (
            <label
              key={choice}
              className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${
                selectedIndex === index ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' : ''
              } ${feedback !== 'idle' ? 'pointer-events-none opacity-80' : ''}`}
            >
              <input
                type="radio"
                checked={selectedIndex === index}
                onChange={() => onSelect(index)}
                disabled={feedback !== 'idle'}
                className="mt-1"
              />
              <span>{choice}</span>
            </label>
          ))}
        </div>
        {feedback === 'idle' && (
          <Button onClick={onSubmit} disabled={selectedIndex === null}>
            Check answer
          </Button>
        )}
        {feedback !== 'idle' && (
          <div
            className={`rounded-lg border p-4 text-sm ${
              feedback === 'correct'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30'
                : 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30'
            }`}
          >
            <p className="font-medium">
              {feedback === 'correct' ? `Correct! +${lastXp} XP` : `Not quite — +${lastXp} XP for trying`}
            </p>
            <p className="mt-2 text-muted-foreground">{challenge.explanation}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={onNext}>
                Next challenge
              </Button>
              <Button size="sm" variant="outline" onClick={onExit}>
                Back to modes
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
