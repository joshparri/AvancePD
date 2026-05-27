'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Lock, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/academy';
import { Target } from 'lucide-react';
import {
  canAttemptBossToday,
  checkNodeUnlock,
  type RewardState,
} from '../lib/rewardEngine';
import { BossScenario } from './BossScenario';

export const SKILL_NODES = [
  { id: 'helpdesk', label: 'Helpdesk', unlockThreshold: 0, requires: null as string | null },
  { id: 'm365', label: 'M365', unlockThreshold: 5, requires: 'helpdesk' },
  { id: 'identity', label: 'Identity', unlockThreshold: 5, requires: 'm365' },
  { id: 'network', label: 'Network', unlockThreshold: 5, requires: 'identity' },
  { id: 'security', label: 'Security', unlockThreshold: 5, requires: 'network' },
  { id: 'cloud', label: 'Cloud', unlockThreshold: 5, requires: 'security' },
] as const;

const BOSS_ACTIVITY_THRESHOLD = 5;

type SkillTreeProps = {
  reward: RewardState;
  onUnlockToast: (label: string) => void;
  onBossComplete: (nodeId: string, passed: boolean) => void;
};

function isNodeUnlocked(node: (typeof SKILL_NODES)[number], reward: RewardState): boolean {
  if (!node.requires) return true;
  return checkNodeUnlock(reward, node.requires, node.unlockThreshold);
}

import type { AvanceGameProgress } from '@/lib/avanceGameProgress';
import { avanceGameChallenges } from '@/data/avanceGameContent';

type SkillTreePropsWithProgress = SkillTreeProps & { progress?: AvanceGameProgress };

export function SkillTree({ reward, onUnlockToast, onBossComplete, progress }: SkillTreePropsWithProgress) {
  const [bossNode, setBossNode] = useState<{ id: string; label: string } | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const prevUnlocked = useRef<Set<string>>(new Set());

  useEffect(() => {
    const now = new Set(SKILL_NODES.filter((n) => isNodeUnlocked(n, reward)).map((n) => n.id));
    SKILL_NODES.forEach((n) => {
      if (now.has(n.id) && !prevUnlocked.current.has(n.id) && n.id !== 'helpdesk') {
        onUnlockToast(n.label);
      }
    });
    prevUnlocked.current = now;
  }, [reward, onUnlockToast]);

  return (
    <section className="space-y-4">
      <SectionHeader
        icon={Target}
        title="MSP skill tree"
        description="Complete activities on each branch to unlock the next. Boss challenges earn certificates."
      />
      {tooltip && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {tooltip}
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_NODES.map((node) => {
          // compute mastery for the node from progress.challengeStats
          const nodeChallenges = avanceGameChallenges.filter((c) => c.skillNode === node.id);
          const mastered = nodeChallenges.filter((c) => {
            const stats = progress?.challengeStats?.[c.id];
            if (!stats) return false;
            if (stats.correct >= 3) return true;
            if (stats.attempts >= 5 && stats.correct / stats.attempts >= 0.8) return true;
            return false;
          }).length;
          const totalCh = nodeChallenges.length || 0;
          const unlocked = isNodeUnlocked(node, reward);
          const nodeProgressCount = reward.nodeProgress[node.id] ?? 0;
          const bossBadge = reward.unlockedBadges.includes(`boss_${node.id}_complete`);
          const readyForBoss = unlocked && nodeProgressCount >= BOSS_ACTIVITY_THRESHOLD && !bossBadge;
          const parentLabel = SKILL_NODES.find((n) => n.id === node.requires)?.label;

          return (
            <Card
              key={node.id}
              className={`relative transition ${
                unlocked ? 'border-emerald-200/80 dark:border-emerald-900/50' : 'cursor-not-allowed opacity-40'
              } ${bossBadge ? 'ring-1 ring-emerald-300/50' : ''}`}
              onClick={() => {
                if (!unlocked && node.requires) {
                  const need = node.unlockThreshold - (reward.nodeProgress[node.requires] ?? 0);
                  setTooltip(
                    `Complete ${Math.max(0, need)} more ${parentLabel} activities to unlock.`
                  );
                  setTimeout(() => setTooltip(null), 4000);
                }
              }}
            >
              {bossBadge && (
                <span className="absolute right-2 top-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
              )}
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {unlocked ? (
                    <Zap className="h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <Lock className="h-5 w-5 shrink-0 text-slate-400" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{node.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {nodeProgressCount} / {node.unlockThreshold || 5} activities
                    </p>
                    {totalCh > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">Mastered: {mastered}/{totalCh}</p>
                    )}
                    {readyForBoss && canAttemptBossToday(reward, node.id) && (
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBossNode({ id: node.id, label: node.label });
                        }}
                      >
                        ⚡ Boss Challenge
                      </Button>
                    )}
                    {readyForBoss && !canAttemptBossToday(reward, node.id) && (
                      <p className="mt-2 text-[10px] text-muted-foreground">Boss available again tomorrow</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {bossNode && (
        <BossScenario
          nodeId={bossNode.id}
          nodeLabel={bossNode.label}
          onComplete={(passed) => {
            onBossComplete(bossNode.id, passed);
            setBossNode(null);
          }}
          onClose={() => setBossNode(null)}
        />
      )}
    </section>
  );
}
