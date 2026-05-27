'use client';

import { CalendarClock, Gift, Repeat2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mysteryMeterProgress, type RewardState } from '../lib/rewardEngine';

type EngagementLoopsProps = {
  reward: RewardState;
  playedToday: boolean;
  nextUnlockLabel: string | null;
  nextUnlockRemaining: number | null;
  onPlaySuggested: () => void;
};

const getEventWindow = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const hours = Math.max(1, Math.ceil((end.getTime() - Date.now()) / 36e5));
  return `${hours}h left`;
};

export function EngagementLoops({
  reward,
  playedToday,
  nextUnlockLabel,
  nextUnlockRemaining,
  onPlaySuggested,
}: EngagementLoopsProps) {
  const mystery = mysteryMeterProgress(reward);
  const eventBonus = playedToday ? 'Daily ticket claimed' : '+40 XP first-clear bonus';
  const cohortTarget = Math.max(6, 12 - Math.min(6, reward.totalSessionsCompleted % 7));

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Card className="border-cyan-200/80 bg-cyan-50/50 dark:border-cyan-900/50 dark:bg-cyan-950/20">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
              <p className="text-sm font-semibold">Live event</p>
            </div>
            <Badge variant="outline">{getEventWindow()}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Close today&apos;s MSP incident chain before reset. {eventBonus}.
          </p>
        </CardContent>
      </Card>

      <Card className="border-violet-200/80 bg-violet-50/50 dark:border-violet-900/50 dark:bg-violet-950/20">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-violet-700 dark:text-violet-300" />
              <p className="text-sm font-semibold">Mystery drop</p>
            </div>
            <Badge variant="secondary">
              {mystery.current}/{mystery.max}
            </Badge>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/80 dark:bg-slate-800">
            <div className="h-full bg-violet-500 transition-all" style={{ width: `${mystery.percent}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">Every play moves the meter. A drop is guaranteed when it fills.</p>
        </CardContent>
      </Card>

      <Card className="border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
              <p className="text-sm font-semibold">Cohort chase</p>
            </div>
            <Badge variant="outline">Top {100 - reward.lastSessionRankPercentile}% target</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {cohortTarget} learners are within one clean session. Keep pace with the weekly board.
          </p>
          <Button size="sm" variant="outline" onClick={onPlaySuggested}>
            <Repeat2 className="mr-2 h-3.5 w-3.5" />
            {nextUnlockLabel && nextUnlockRemaining !== null
              ? `${nextUnlockRemaining} to ${nextUnlockLabel}`
              : 'Play one more'}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
