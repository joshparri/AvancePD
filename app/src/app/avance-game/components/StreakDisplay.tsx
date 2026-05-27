'use client';

import { Flame, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { streakFlameTier, type RewardState } from '../lib/rewardEngine';

type StreakDisplayProps = {
  reward: RewardState;
  playedToday: boolean;
  atRisk: boolean;
};

export function StreakDisplay({ reward, playedToday, atRisk }: StreakDisplayProps) {
  const tier = streakFlameTier(reward.streak);
  const maxShields = 3;

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition',
        atRisk && !playedToday
          ? 'animate-pulse border-amber-400 bg-amber-50/80 dark:border-amber-600 dark:bg-amber-950/40'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/80'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame
            className={cn(
              'h-6 w-6',
              tier === 'legend' && 'text-orange-500',
              tier === 'hot' && 'text-orange-400',
              tier === 'warm' && 'text-amber-500',
              tier === 'none' && 'text-slate-400'
            )}
          />
          <div>
            <p className="text-2xl font-bold">{reward.streak}</p>
            <p className="text-xs text-muted-foreground">day streak · best {reward.longestStreak}</p>
          </div>
        </div>
        <div className="flex items-center gap-1" title="Streak shields">
          {Array.from({ length: maxShields }).map((_, i) => (
            <Shield
              key={i}
              className={cn(
                'h-4 w-4',
                i < reward.streakShields ? 'text-blue-500' : 'text-slate-300 dark:text-slate-600'
              )}
            />
          ))}
        </div>
      </div>
      {atRisk && !playedToday && (
        <p className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-200">Streak at risk! Play today to keep it.</p>
      )}
      {tier !== 'none' && (
        <p className="mt-1 text-[10px] text-muted-foreground">
          {tier === 'warm' && '🔥 7-day flame'}
          {tier === 'hot' && '🔥🔥 14-day flame'}
          {tier === 'legend' && '🔥🔥🔥 30-day legend flame'}
        </p>
      )}
    </div>
  );
}
