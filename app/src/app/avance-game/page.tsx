'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { HeroPanel, PageShell, SectionHeader, StatCard } from '@/components/academy';
import { LearningIllustration } from '@/components/learning/LearningIllustration';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { avanceExternalItPlatforms, avanceGameModeMeta, type AvanceGameMode } from '@/data/avanceGameContent';
import { getAvanceGameProgress, recordChallengeResult, type AvanceGameProgress } from '@/lib/avanceGameProgress';
import { ArrowLeft, ArrowUpRight, Gamepad2, Trophy, Zap } from 'lucide-react';
import { DailyChallenge } from './components/DailyChallenge';
import EventBanner from './components/EventBanner';
import FomoBanner from './components/FomoBanner';
import FriendLeaderboard from './components/FriendLeaderboard';
import SocialShare from './components/SocialShare';
import { EngagementLoops } from './components/EngagementLoops';
import { GameToast } from './components/GameToast';
import { GhostLeaderboard } from './components/GhostLeaderboard';
import { GameModePlay, getUnlockedNodeIds, pickChallenge } from './components/GameModePlay';
import { SkillTree, SKILL_NODES } from './components/SkillTree';
import { StreakDisplay } from './components/StreakDisplay';
import { XpLevelBar } from './components/XpLevelBar';
import {
  addXP,
  awardBadge,
  loadRewardState,
  recordBossAttempt,
  recordNodeActivity,
  saveRewardState,
  updateStreak,
  spinForBonus,
  type BonusEvent,
  type RewardState,
} from './lib/rewardEngine';
import { getMultiplier } from './lib/eventEngine';

type ToastState = { message: string; variant: 'default' | 'bonus' | 'unlock' | 'shield' } | null;

function initRewardState(): { state: RewardState; shieldUsed: boolean } {
  if (typeof window === 'undefined') {
    return { state: loadRewardState(), shieldUsed: false };
  }
  const prev = loadRewardState();
  const { newState, shieldUsed } = updateStreak(prev);
  saveRewardState(newState);
  return { state: newState, shieldUsed };
}

export default function AvanceGamePage() {
  const [init] = useState(initRewardState);
  const [reward, setReward] = useState<RewardState>(init.state);
  const [legacy, setLegacy] = useState<AvanceGameProgress>(() => getAvanceGameProgress());
  const [toast, setToast] = useState<ToastState>(
    init.shieldUsed ? { message: '🛡 Streak Shield used — streak protected!', variant: 'shield' } : null
  );
  const [xpDelta, setXpDelta] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [activeMode, setActiveMode] = useState<AvanceGameMode | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<ReturnType<typeof pickChallenge>>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [lastXp, setLastXp] = useState(0);

  const unlockedNodes = useMemo(() => getUnlockedNodeIds(reward), [reward]);
  const today = new Date().toISOString().slice(0, 10);
  const playedToday = reward.lastPlayedDate === today;
  const atRisk = typeof window !== 'undefined' && !playedToday && new Date().getHours() >= 20;
  const hasBossBadge = reward.unlockedBadges.some((b) => b.startsWith('boss_'));
  const nextUnlock = useMemo(() => {
    const locked = SKILL_NODES.find((node) => !unlockedNodes.includes(node.id) && node.requires);
    if (!locked || !locked.requires) return null;
    const remaining = Math.max(0, locked.unlockThreshold - (reward.nodeProgress[locked.requires] ?? 0));
    return { label: locked.label, remaining };
  }, [reward.nodeProgress, unlockedNodes]);

  const applyReward = useCallback((state: RewardState, bonus: BonusEvent | null, gained: number) => {
    setReward(state);
    saveRewardState(state);
    if (gained > 0) {
      setXpDelta(gained);
      setTimeout(() => setXpDelta(0), 2200);
    }
    if (bonus) {
      setToast({
        message: bonus.message,
        variant: bonus.type === 'shield' ? 'shield' : 'bonus',
      });
    }
  }, []);

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    try {
      const result = spinForBonus(reward);
      const eventMult = getMultiplier();
      let finalState = result.newState;
      let finalXp = result.xpGained;
      if (eventMult > 1) {
        const adjusted = Math.round(result.xpGained * eventMult);
        const diff = adjusted - result.xpGained;
        finalState = { ...result.newState, xp: result.newState.xp + diff, level: Math.floor((result.newState.xp + diff) / 500) + 1 };
        finalXp = adjusted;
      }
      applyReward(finalState, result.bonusEvent, finalXp);
      setToast({ message: result.bonusEvent?.message ?? `+${finalXp} XP`, variant: 'bonus' });
    } finally {
      setSpinning(false);
    }
  };

  const startMode = (mode: AvanceGameMode) => {
    const challenge = pickChallenge(mode, unlockedNodes, legacy.completedChallengeIds, legacy.sessionCorrectStreak);
    setActiveMode(mode);
    setCurrentChallenge(challenge);
    setSelectedIndex(null);
    setFeedback('idle');
    setLastXp(0);
  };

  const startSuggestedMode = () => {
    const modes = Object.keys(avanceGameModeMeta) as AvanceGameMode[];
    const mode = modes.find((candidate) =>
      Boolean(pickChallenge(candidate, unlockedNodes, legacy.completedChallengeIds, legacy.sessionCorrectStreak))
    );
    if (mode) startMode(mode);
  };

  const submitAnswer = () => {
    if (!currentChallenge || selectedIndex === null || activeMode === null) return;
    const correct = selectedIndex === currentChallenge.correctIndex;
    const baseXp = correct ? currentChallenge.xpReward : Math.max(2, Math.floor(currentChallenge.xpReward / 3));
    const multiplier = getMultiplier();
    const { newState, bonusEvent, xpGained } = addXP(reward, baseXp, multiplier);
    let nextReward = recordNodeActivity(newState, currentChallenge.skillNode);
    nextReward = {
      ...nextReward,
      lastSessionRankPercentile: Math.min(95, 50 + legacy.sessionCorrectStreak * 8 + (correct ? 12 : 0)),
    };
    applyReward(nextReward, bonusEvent, xpGained);
    setLastXp(xpGained);
    setFeedback(correct ? 'correct' : 'wrong');
    const nextLegacy = recordChallengeResult(legacy, {
      challengeId: currentChallenge.id,
      mode: activeMode,
      correct,
      xpEarned: currentChallenge.xpReward,
    });
    setLegacy(nextLegacy);
  };

  const nextChallenge = () => {
    if (!activeMode) return;
    setCurrentChallenge(
      pickChallenge(activeMode, getUnlockedNodeIds(reward), legacy.completedChallengeIds, legacy.sessionCorrectStreak)
    );
    setSelectedIndex(null);
    setFeedback('idle');
    setLastXp(0);
    setXpDelta(0);
  };

  const handleBossComplete = (nodeId: string, passed: boolean) => {
    let next = recordBossAttempt(reward, nodeId);
    if (passed) {
      const result = addXP(next, 200, getMultiplier());
      next = awardBadge(result.newState, `boss_${nodeId}_complete`);
      applyReward(next, result.bonusEvent, result.xpGained);
      setToast({ message: `🏆 Boss defeated! +${result.xpGained} XP`, variant: 'bonus' });
    } else {
      saveRewardState(next);
      setReward(next);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !atRisk || !('Notification' in window) || Notification.permission !== 'default') {
      return;
    }
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        new Notification('Come back to Avance', { body: 'Quick 5-minute challenge will keep your streak alive!' });
      }
    });
  }, [atRisk]);

  return (
    <Layout>
      <PageShell
        eyebrow="Built-in"
        title="AvanceGame"
        subtitle="Streaks, variable rewards, live events, cohort pressure, boss levels, and daily challenges built for MSP habits."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        }
      >
        <XpLevelBar xp={reward.xp} xpDelta={xpDelta} />

        <EventBanner />
        <FomoBanner onJoin={() => startSuggestedMode()} />
        <EngagementLoops
          reward={reward}
          playedToday={playedToday}
          nextUnlockLabel={nextUnlock?.label ?? null}
          nextUnlockRemaining={nextUnlock?.remaining ?? null}
          onPlaySuggested={startSuggestedMode}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <DailyChallenge reward={reward} onRewardUpdate={applyReward} />
            <Card className="border-yellow-200/80 bg-gradient-to-r from-yellow-50/60 to-amber-50/40 dark:border-yellow-900/40">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200">Spin for Bonus</p>
                  <p className="text-xs text-muted-foreground">Try your luck — small XP, chance for shields, or a rare scenario. Mystery meter fills with each spin.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSpin} disabled={spinning}>
                    {spinning ? 'Spinning...' : 'Spin now'}
                  </Button>
                  <SocialShare userId="local_user" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <StreakDisplay reward={reward} playedToday={playedToday} atRisk={atRisk} />
            <FriendLeaderboard />
          </div>
        </div>

        <HeroPanel
          title="Your learning hook"
          subtitle="A short loop: clear one ticket, move the mystery meter, protect the streak, and unlock the next branch."
          illustration={<LearningIllustration variant="learning-cockpit" size="lg" decorative />}
          stats={[
            { label: 'Level', value: reward.level },
            { label: 'Total XP', value: reward.xp },
            { label: 'Sessions', value: reward.totalSessionsCompleted },
          ]}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard icon={Trophy} label="Badges" value={reward.unlockedBadges.length} />
          <StatCard icon={Zap} label="Session streak" value={legacy.sessionCorrectStreak} helper="correct in a row" />
        </div>

        <SkillTree
          reward={reward}
          onUnlockToast={(label) => setToast({ message: `${label} unlocked.`, variant: 'unlock' })}
          onBossComplete={handleBossComplete}
        />

        {!activeMode && (
          <section className="space-y-4">
            <SectionHeader icon={Gamepad2} title="Game modes" description="Unlocked branches only. Earn XP, node progress, and mystery meter progress." />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(avanceGameModeMeta) as AvanceGameMode[]).map((mode) => {
                const meta = avanceGameModeMeta[mode];
                const stats = legacy.modeStats[mode];
                return (
                  <Card key={mode} className="flex h-full flex-col hover:border-blue-200 dark:hover:border-blue-800">
                    <CardContent className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex justify-between">
                        <p className="font-semibold text-sm">{meta.label}</p>
                        <Badge variant="outline" className="text-[10px]">{meta.inspiredBy}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{meta.description}</p>
                      <p className="text-xs text-slate-500">
                        {stats.played} played · {stats.played ? Math.round((stats.correct / stats.played) * 100) : 0}%
                      </p>
                      <Button className="mt-auto" size="sm" onClick={() => startMode(mode)}>
                        Play
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {activeMode && currentChallenge && (
          <GameModePlay
            mode={activeMode}
            challenge={currentChallenge}
            selectedIndex={selectedIndex}
            feedback={feedback}
            lastXp={lastXp}
            sessionStreak={legacy.sessionCorrectStreak}
            onSelect={setSelectedIndex}
            onSubmit={submitAnswer}
            onNext={nextChallenge}
            onExit={() => {
              setActiveMode(null);
              setCurrentChallenge(null);
              setFeedback('idle');
            }}
          />
        )}

        <GhostLeaderboard reward={reward} />

        {hasBossBadge && (
          <section className="space-y-3 border-t pt-6">
            <SectionHeader
              title="Go deeper (unlocked)"
              description="You have cleared a boss node—optional external labs for extra depth."
            />
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {avanceExternalItPlatforms.map((p) => (
                <Card key={p.id}>
                  <CardContent className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.domain}</p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        Open <ArrowUpRight className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {toast && (
          <GameToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
        )}
      </PageShell>
    </Layout>
  );
}
