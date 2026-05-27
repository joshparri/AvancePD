'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Repeat2, Sparkles } from 'lucide-react';
import {
  avanceGameChallenges,
  avanceGameModeMeta,
  mode: AvanceGameMode,
  unlocked: string[],
  progress: AvanceGameProgress
): AvanceGameChallenge | null {
  const pool = avanceGameChallenges.filter((c) => c.mode === mode && unlocked.includes(c.skillNode));
  const due = pool.filter((c) => progress.reviewsDue.includes(c.id));
  if (due.length > 0) return due[Math.floor(Math.random() * due.length)];
  return SKILL_NODES.filter((node) => {
    if (!node.requires) return true;
    return checkNodeUnlock(reward, node.requires, node.unlockThreshold);
  }).map((n) => n.id);
}

export function pickChallenge(
  mode: AvanceGameMode,
  unlocked: string[],
  progress: AvanceGameProgress
): AvanceGameChallenge | null {
  // Prefer review items due for reinforcement
  const pool = avanceGameChallenges.filter((c) => c.mode === mode && unlocked.includes(c.skillNode));
  const due = pool.filter((c) => progress.reviewsDue.includes(c.id));
  if (due.length > 0) return due[Math.floor(Math.random() * due.length)];

  // Prioritise weak items: challenges with low correct rate or never attempted
  const scored = pool.map((c) => {
    const stats = progress.challengeStats[c.id] || { attempts: 0, correct: 0 };
    const attempts = stats.attempts || 0;
    const correct = stats.correct || 0;
    const success = attempts === 0 ? 0 : correct / attempts;
    return { c, attempts, correct, success };
  });

  // find candidates with attempts < 3 or success rate < 0.75
  const weak = scored.filter((s) => s.attempts < 3 || s.success < 0.75).map((s) => s.c);
  // Apply simple spaced-repetition weighting: prefer items with low accuracy or older lastSeen
  const scored = pool.map((c) => {
    const stats = challengeStats?.[c.id];
    let errorRate = 1;
    let recencyFactor = 1;
    if (stats && stats.attempts > 0) {
      const acc = stats.correct / stats.attempts;
      errorRate = 1 - acc; // higher when user is worse
      if (stats.lastSeen) {
        const ageMs = Date.now() - new Date(stats.lastSeen).getTime();
        // normalize over 3 days
        recencyFactor = Math.min(1, ageMs / (1000 * 60 * 60 * 24 * 3));
      } else {
        recencyFactor = 1;
      }
    } else {
      // unseen items should be prioritized strongly
      errorRate = 1;
      recencyFactor = 1;
    }
    const weight = 0.65 * errorRate + 0.35 * recencyFactor + Math.random() * 0.1;
    return { challenge: c, weight };
  });

  scored.sort((a, b) => b.weight - a.weight);
  // if flow-drill and streak high, prefer harder among top candidates
  if (mode === 'flow-drill' && sessionStreak >= 3) {
    const top = scored.slice(0, Math.min(5, scored.length)).map((s) => s.challenge).filter((ch) => ch.difficulty !== 'easy');
    if (top.length) return top[Math.floor(Math.random() * top.length)];
  }
  // pick one of top 3
  const topN = scored.slice(0, Math.min(3, scored.length)).map((s) => s.challenge);
  return topN[Math.floor(Math.random() * topN.length)];
  if (weak.length > 0) return weak[Math.floor(Math.random() * weak.length)];

  // fallback: previous behaviour (avoid completed challenges first)
  const uncompleted = pool.filter((c) => !progress.completedChallengeIds.includes(c.id));
  const basePool = uncompleted.length > 0 ? uncompleted : pool;

  // flow-drill adaptive difficulty
  if (mode === 'flow-drill' && progress.sessionCorrectStreak >= 3) {
    const harder = basePool.filter((c) => c.difficulty !== 'easy');
    if (harder.length) return harder[Math.floor(Math.random() * harder.length)];
  }

  if (basePool.length === 0) return null;
  return basePool[Math.floor(Math.random() * basePool.length)];
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
  sessionStreak,
  onSelect,
  onSubmit,
  onNext,
  onExit,
}: GameModePlayProps) {
  const streakNudge = sessionStreak > 0 ? `${sessionStreak} correct in a row` : 'Start a clean run';

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
            <div className="mt-3 grid grid-cols-1 gap-2 rounded-lg border bg-white/70 p-3 text-xs dark:bg-slate-950/30 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Repeat2 className="h-4 w-4 text-blue-600" />
                <span>{streakNudge}. One more answer keeps the run alive.</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" />
                <span>Every challenge advances XP, node progress, and mystery drops.</span>
              </div>
            </div>
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
