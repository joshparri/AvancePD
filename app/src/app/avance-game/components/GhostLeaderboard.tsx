'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RewardState } from '../lib/rewardEngine';

const GHOST_PLAYERS = [
  { name: 'Alex M.', xp: 4820, streak: 14 },
  { name: 'Jordan T.', xp: 3910, streak: 9 },
  { name: 'Sam K.', xp: 3450, streak: 7 },
  { name: 'Riley P.', xp: 2100, streak: 5 },
  { name: 'Casey W.', xp: 1580, streak: 3 },
];

type GhostLeaderboardProps = {
  reward: RewardState;
};

export function GhostLeaderboard({ reward }: GhostLeaderboardProps) {
  const rows = [
    ...GHOST_PLAYERS,
    { name: 'You', xp: reward.xp, streak: reward.streak, isUser: true },
  ].sort((a, b) => b.xp - a.xp);

  const userRank = rows.findIndex((r) => 'isUser' in r && r.isUser) + 1;
  const percentile = Math.round(((rows.length - userRank) / rows.length) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">This Week&apos;s MSP Learners</CardTitle>
        <p className="text-[11px] text-muted-foreground">847 learners active</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={row.name}
            className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-sm ${
              'isUser' in row && row.isUser
                ? 'bg-blue-50 font-medium dark:bg-blue-950/40'
                : ''
            }`}
          >
            <span>
              <span className="text-muted-foreground mr-2">#{i + 1}</span>
              {row.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.xp} XP · 🔥 {row.streak}
            </span>
          </div>
        ))}
        <p className="pt-2 text-xs text-slate-600 dark:text-slate-400">
          You&apos;re faster than <strong>{reward.lastSessionRankPercentile || percentile}%</strong> of players on your
          last session.
        </p>
      </CardContent>
    </Card>
  );
}
