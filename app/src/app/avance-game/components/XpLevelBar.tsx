'use client';

import { xpProgressInLevel } from '../lib/rewardEngine';
import { Sparkles } from 'lucide-react';

type XpLevelBarProps = {
  xp: number;
  xpDelta?: number;
};

export function XpLevelBar({ xp, xpDelta = 0 }: XpLevelBarProps) {
  const { current, max, level, percent } = xpProgressInLevel(xp);

  return (
    <div className="rounded-xl border border-blue-100/80 bg-white/80 p-4 shadow-sm dark:border-blue-900/40 dark:bg-slate-900/60">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className={`h-4 w-4 text-blue-600 ${xpDelta > 0 ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Level {level}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {xpDelta > 0 && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{xpDelta} XP</span>
          )}
          <span>
            {current} / {max} XP
          </span>
        </div>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          key={`${level}-${percent}`}
          className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 ease-out ${
            xpDelta > 0 ? 'shadow-[0_0_12px_rgba(59,130,246,0.6)]' : ''
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {max - current} XP to level {level + 1}
      </p>
    </div>
  );
}
