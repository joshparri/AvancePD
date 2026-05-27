'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DAILY_CHALLENGE_XP,
  DAILY_STORAGE_KEY,
  getDailyChallengeQuestions,
} from '../lib/dailyChallenge';
import type { BonusEvent, RewardState } from '../lib/rewardEngine';
import { addXP, saveRewardState } from '../lib/rewardEngine';
import { getMultiplier } from '../lib/eventEngine';

type DailyChallengeProps = {
  reward: RewardState;
  onRewardUpdate: (state: RewardState, bonus: BonusEvent | null, xpGained: number) => void;
};

type DailySave = {
  date: string;
  step: number;
  completed: boolean;
  xpEarned?: number;
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const loadDaily = (): DailySave => {
  if (typeof window === 'undefined') return { date: '', step: 0, completed: false };
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) return { date: todayKey(), step: 0, completed: false };
    const parsed = JSON.parse(raw) as DailySave;
    if (parsed.date !== todayKey()) return { date: todayKey(), step: 0, completed: false };
    return parsed;
  } catch {
    return { date: todayKey(), step: 0, completed: false };
  }
};

const saveDaily = (data: DailySave) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(data));
};

export function DailyChallenge({ reward, onRewardUpdate }: DailyChallengeProps) {
  const [daily, setDaily] = useState<DailySave>(loadDaily);
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const questions = useMemo(() => getDailyChallengeQuestions(todayKey()), []);
  const current = questions[daily.step];

  const completeStep = () => {
    if (selected === null || !current) return;
    const nextStep = daily.step + 1;
    if (nextStep >= questions.length) {
      const multiplier = getMultiplier();
      const { newState, bonusEvent, xpGained } = addXP(reward, DAILY_CHALLENGE_XP, multiplier);
      saveRewardState(newState);
      onRewardUpdate(newState, bonusEvent, xpGained);
      const done: DailySave = { date: todayKey(), step: questions.length, completed: true, xpEarned: xpGained };
      saveDaily(done);
      setDaily(done);
      setActive(false);
    } else {
      const mid: DailySave = { date: todayKey(), step: nextStep, completed: false };
      saveDaily(mid);
      setDaily(mid);
      setSelected(null);
    }
  };

  if (daily.completed) {
    return (
      <Card className="border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-200">✓ Daily Challenge Complete</p>
            <p className="text-xs text-muted-foreground">+{daily.xpEarned ?? DAILY_CHALLENGE_XP} XP earned today</p>
          </div>
          <Badge variant="outline" className="border-emerald-300">6/6</Badge>
        </CardContent>
      </Card>
    );
  }

  if (!active) {
    return (
      <Card className="border-blue-200/80 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-indigo-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daily Challenge</CardTitle>
          <p className="text-xs text-muted-foreground">One question from each mode · ~3 minutes · +{DAILY_CHALLENGE_XP} XP</p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setActive(true)}>Start Today&apos;s Challenge →</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200/80 dark:border-blue-900/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Daily Challenge</CardTitle>
          <Badge variant="secondary">
            {daily.step} / {questions.length} complete
          </Badge>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(daily.step / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge variant="outline">{current.modeLabel}</Badge>
        {current.clues && (
          <ul className="text-xs text-amber-800 dark:text-amber-200">
            {current.clues.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        )}
        <p className="text-sm font-medium">{current.prompt}</p>
        <div className="space-y-2">
          {current.choices.map((choice, i) => (
            <label key={choice} className="flex gap-2 rounded-lg border p-2 text-sm">
              <input type="radio" checked={selected === i} onChange={() => setSelected(i)} />
              {choice}
            </label>
          ))}
        </div>
        <Button onClick={completeStep} disabled={selected === null}>
          {daily.step + 1 >= questions.length ? 'Finish daily challenge' : 'Next step'}
        </Button>
      </CardContent>
    </Card>
  );
}
