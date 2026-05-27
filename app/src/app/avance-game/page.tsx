'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { HeroPanel, PageShell, SectionHeader, StatCard } from '@/components/academy';
import { LearningIllustration } from '@/components/learning/LearningIllustration';
import { LearningDiagram } from '@/components/learning/LearningDiagram';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  avanceExternalItPlatforms,
  avanceGameChallenges,
  avanceGameModeMeta,
  avanceSkillTree,
  type AvanceGameChallenge,
  type AvanceGameMode,
  type AvanceSkillNodeId,
} from '@/data/avanceGameContent';
import {
  getAvanceGameProgress,
  getUnlockedSkillNodes,
  recordChallengeResult,
  type AvanceGameProgress,
} from '@/lib/avanceGameProgress';
import {
  ArrowLeft,
  ArrowUpRight,
  Flame,
  Gamepad2,
  Lock,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';

function pickChallenge(
  mode: AvanceGameMode,
  unlocked: AvanceSkillNodeId[],
  completed: string[],
  reviewsDue: string[],
  sessionStreak: number
): AvanceGameChallenge | null {
  const pool = avanceGameChallenges.filter(
    (c) => c.mode === mode && unlocked.includes(c.skillNode) && !completed.includes(c.id)
  );
  if (pool.length === 0) {
    const reviewPool = avanceGameChallenges.filter(
      (c) => c.mode === mode && reviewsDue.includes(c.id)
    );
    if (reviewPool.length > 0) return reviewPool[Math.floor(Math.random() * reviewPool.length)];
    const fallback = avanceGameChallenges.filter((c) => c.mode === mode && unlocked.includes(c.skillNode));
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  if (mode === 'flow-drill' && sessionStreak >= 3) {
    const harder = pool.filter((c) => c.difficulty !== 'easy');
    if (harder.length > 0) return harder[Math.floor(Math.random() * harder.length)];
  }
  if (mode === 'flow-drill' && sessionStreak === 0) {
    const easier = pool.filter((c) => c.difficulty === 'easy');
    if (easier.length > 0) return easier[Math.floor(Math.random() * easier.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export default function AvanceGamePage() {
  const [progress, setProgress] = useState<AvanceGameProgress>(() => getAvanceGameProgress());
  const [activeMode, setActiveMode] = useState<AvanceGameMode | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<AvanceGameChallenge | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [lastXp, setLastXp] = useState(0);

  const unlockedNodes = useMemo(() => getUnlockedSkillNodes(progress.totalXp), [progress.totalXp]);

  const startMode = useCallback(
    (mode: AvanceGameMode) => {
      const challenge = pickChallenge(
        mode,
        unlockedNodes,
        progress.completedChallengeIds,
        progress.reviewsDue,
        progress.sessionCorrectStreak
      );
      setActiveMode(mode);
      setCurrentChallenge(challenge);
      setSelectedIndex(null);
      setFeedback('idle');
      setLastXp(0);
    },
    [progress.completedChallengeIds, progress.reviewsDue, progress.sessionCorrectStreak, unlockedNodes]
  );

  const submitAnswer = () => {
    if (!currentChallenge || selectedIndex === null || activeMode === null) return;
    const correct = selectedIndex === currentChallenge.correctIndex;
    const xp = correct ? currentChallenge.xpReward : Math.max(2, Math.floor(currentChallenge.xpReward / 3));
    setLastXp(xp);
    setFeedback(correct ? 'correct' : 'wrong');
    const next = recordChallengeResult(progress, {
      challengeId: currentChallenge.id,
      mode: activeMode,
      correct,
      xpEarned: currentChallenge.xpReward,
    });
    setProgress(next);
  };

  const nextChallenge = () => {
    if (!activeMode) return;
    const challenge = pickChallenge(
      activeMode,
      getUnlockedSkillNodes(progress.totalXp),
      progress.completedChallengeIds,
      progress.reviewsDue,
      progress.sessionCorrectStreak
    );
    setCurrentChallenge(challenge);
    setSelectedIndex(null);
    setFeedback('idle');
    setLastXp(0);
  };

  const exitMode = () => {
    setActiveMode(null);
    setCurrentChallenge(null);
    setSelectedIndex(null);
    setFeedback('idle');
  };

  return (
    <Layout>
      <PageShell
        eyebrow="Built-in"
        title="AvanceGame"
        subtitle="Duolingo-style streaks, GeoGuessr-style deduction, Elevate-style flow, and MSP skill trees—in one Avance PD experience."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        }
      >
        <HeroPanel
          title="Hook your IT learning habit"
          subtitle="Trigger → Action → Variable reward → Investment. Five-minute sessions, streaks, XP, and a visible skill tree."
          illustration={<LearningIllustration variant="learning-cockpit" size="lg" decorative />}
          stats={[
            { label: 'Total XP', value: progress.totalXp },
            { label: 'Streak', value: progress.currentStreak, helper: `Best: ${progress.longestStreak}` },
            { label: 'Session', value: progress.sessionCorrectStreak, helper: 'correct in a row' },
          ]}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={Flame} label="Daily streak" value={progress.currentStreak} helper="Play today to keep it" />
          <StatCard icon={Trophy} label="Challenges cleared" value={progress.completedChallengeIds.length} />
          <StatCard icon={Zap} label="In flow zone" value={progress.sessionCorrectStreak >= 2 ? 'Yes' : 'Warm up'} helper="3+ correct raises difficulty in Flow Drill" />
        </div>

        <LearningDiagram variant="learning-loop" compact />

        <section className="space-y-4">
          <SectionHeader
            icon={Target}
            title="MSP skill tree"
            description="Unlock branches with XP—structured progression like Khan Academy paths."
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {avanceSkillTree.map((node) => {
              const unlocked = unlockedNodes.includes(node.id);
              return (
                <Card
                  key={node.id}
                  className={
                    unlocked
                      ? 'border-emerald-200/80 dark:border-emerald-900/50'
                      : 'border-slate-200 opacity-75 dark:border-slate-800'
                  }
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    {unlocked ? (
                      <Sparkles className="h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <Lock className="h-5 w-5 shrink-0 text-slate-400" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{node.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{node.description}</p>
                      <p className="mt-2 text-[11px] text-slate-500">
                        {unlocked ? 'Unlocked' : `${node.xpToUnlock} XP to unlock`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {!activeMode && (
          <section className="space-y-4">
            <SectionHeader
              icon={Gamepad2}
              title="Game modes"
              description="Each mode borrows a mechanic from the best learning games—applied to MSP work."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(avanceGameModeMeta) as AvanceGameMode[]).map((mode) => {
                const meta = avanceGameModeMeta[mode];
                const stats = progress.modeStats[mode];
                return (
                  <Card key={mode} className="flex h-full flex-col hover:border-blue-200 dark:hover:border-blue-800">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">{meta.label}</CardTitle>
                        <Badge variant="outline" className="text-[10px]">
                          Like {meta.inspiredBy}
                        </Badge>
                      </div>
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">{meta.hook}</p>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                      <p className="text-sm text-muted-foreground">{meta.description}</p>
                      <p className="text-xs text-slate-500">
                        Played {stats.played} · {stats.played > 0 ? Math.round((stats.correct / stats.played) * 100) : 0}% accuracy
                      </p>
                      <Button className="mt-auto" size="sm" onClick={() => startMode(mode)}>
                        Play {meta.label}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {activeMode && currentChallenge && (
          <Card className="border-blue-200/80 dark:border-blue-900/50">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{avanceGameModeMeta[activeMode].label}</CardTitle>
                <div className="flex gap-2">
                  <Badge>{currentChallenge.difficulty}</Badge>
                  <Badge variant="outline">{currentChallenge.xpReward} XP</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentChallenge.clues && currentChallenge.clues.length > 0 && (
                <div className="rounded-lg border border-amber-200/80 bg-amber-50/80 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
                  <p className="text-xs font-medium text-amber-900 dark:text-amber-200">Clues</p>
                  <ul className="mt-2 space-y-1 text-sm text-amber-950 dark:text-amber-100">
                    {currentChallenge.clues.map((clue) => (
                      <li key={clue}>• {clue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {currentChallenge.commandHint && (
                <p className="text-xs font-mono text-slate-500">{currentChallenge.commandHint}</p>
              )}
              <p className="text-sm font-medium">{currentChallenge.prompt}</p>
              <div className="space-y-2">
                {currentChallenge.choices.map((choice, index) => (
                  <label
                    key={choice}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm transition ${
                      selectedIndex === index ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' : ''
                    } ${feedback !== 'idle' ? 'pointer-events-none opacity-80' : ''}`}
                  >
                    <input
                      type="radio"
                      name="avance-game-answer"
                      checked={selectedIndex === index}
                      onChange={() => setSelectedIndex(index)}
                      disabled={feedback !== 'idle'}
                      className="mt-1"
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>

              {feedback === 'idle' && (
                <Button onClick={submitAnswer} disabled={selectedIndex === null}>
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
                  <p className="mt-2 text-muted-foreground">{currentChallenge.explanation}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" onClick={nextChallenge}>
                      Next challenge
                    </Button>
                    <Button size="sm" variant="outline" onClick={exitMode}>
                      Back to modes
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeMode && !currentChallenge && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No challenges available for this mode yet. Try another branch or mode.</p>
              <Button className="mt-4" variant="outline" onClick={exitMode}>
                Back to modes
              </Button>
            </CardContent>
          </Card>
        )}

        <section className="space-y-4 border-t pt-8">
          <SectionHeader
            title="Level up on the open IT game ecosystem"
            description="AvanceGame is your daily hook—then go deeper on these platforms when you are ready."
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {avanceExternalItPlatforms.map((platform) => (
              <Card key={platform.id}>
                <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-sm">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">{platform.domain}</p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{platform.mimic}</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <a href={platform.url} target="_blank" rel="noopener noreferrer">
                      Open
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="academy-surface-muted">
          <CardContent className="space-y-2 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-slate-700 dark:text-slate-300">The Hook Model in AvanceGame</p>
            <p>
              <strong>Trigger:</strong> dashboard tile and streak reminder · <strong>Action:</strong> one 5-minute mode ·{' '}
              <strong>Variable reward:</strong> XP and explanations · <strong>Investment:</strong> skill tree and review queue
            </p>
            <p>Progress saves locally in your browser. For ticket work, use Learning Cockpit and MSP Scenarios.</p>
          </CardContent>
        </Card>
      </PageShell>
    </Layout>
  );
}
