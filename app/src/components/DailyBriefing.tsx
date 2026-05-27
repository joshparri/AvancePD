'use client';

import Link from 'next/link';
import { format, isPast } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Shift, Task } from '@/types';
import type { MspLearningActivity } from '@/data/mspLearningActivities';
import { loadRewardState } from '@/app/avance-game/lib/rewardEngine';
import { getStoredQuizAttempts } from '@/lib/mspQuizProgress';
import { Calendar, Gamepad2, Lightbulb, ListTodo, Sparkles } from 'lucide-react';

type DailyBriefingProps = {
  nextShift: Shift | null;
  pendingTasks: Task[];
  nextBestActivity: MspLearningActivity | null;
  learningCompleted: number;
  recentLogCount: number;
};

export function DailyBriefing({
  nextShift,
  pendingTasks,
  nextBestActivity,
  learningCompleted,
  recentLogCount,
}: DailyBriefingProps) {
  const overdueTasks = pendingTasks.filter((t) => t.dueDate && isPast(new Date(t.dueDate)));
  const reward = typeof window !== 'undefined' ? loadRewardState() : null;
  const quizAttempts = typeof window !== 'undefined' ? getStoredQuizAttempts().length : 0;

  return (
    <Card className="border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 to-blue-50/50 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:to-slate-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-white">
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Daily briefing
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-white/60 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            Next shift
          </div>
          {nextShift ? (
            <>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {format(new Date(nextShift.date), 'EEE d MMM')} · {nextShift.startTime}–{nextShift.endTime}
              </p>
              <Button size="sm" variant="link" className="mt-1 h-auto p-0" asChild>
                <Link href={`/shifts/${nextShift.id}`}>Prep checklist →</Link>
              </Button>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">No shift scheduled</p>
          )}
        </div>

        <div className="rounded-lg border border-white/60 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <ListTodo className="h-3.5 w-3.5" />
            Tasks
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {pendingTasks.length} pending
            {overdueTasks.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-[10px]">
                {overdueTasks.length} overdue
              </Badge>
            )}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{recentLogCount} recent work logs</p>
        </div>

        <div className="rounded-lg border border-white/60 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Lightbulb className="h-3.5 w-3.5" />
            Learning
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {learningCompleted} activities done
          </p>
          {nextBestActivity ? (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{nextBestActivity.title}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">On track — explore more in Cockpit</p>
          )}
          <Button size="sm" variant="link" className="mt-1 h-auto p-0" asChild>
            <Link href="/learning-cockpit">Open Cockpit →</Link>
          </Button>
        </div>

        <div className="rounded-lg border border-white/60 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Gamepad2 className="h-3.5 w-3.5" />
            AvanceGame
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            Level {reward?.level ?? 1} · {reward?.streak ?? 0}-day streak
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{quizAttempts} quiz attempts logged</p>
          <Button size="sm" variant="link" className="mt-1 h-auto p-0" asChild>
            <Link href="/avance-game">Play today →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
