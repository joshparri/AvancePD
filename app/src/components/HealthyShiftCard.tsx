'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Droplets, Footprints, HeartPulse, Shield, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TwoMinuteResetDialog } from '@/components/TwoMinuteResetDialog';
import {
  enableUrgentTicketMode,
  getHealthOutdoorsSettings,
  getTodayHealthLog,
  incrementWater,
} from '@/lib/healthOutdoorsStorage';
import { getDueReminder, getNextReminder, getShiftPhase } from '@/lib/healthReminderEngine';
import type { DailyHealthLog, HealthOutdoorsSettings, HealthShiftPhase } from '@/types/healthOutdoors';

const phaseLabels: Record<HealthShiftPhase, string> = {
  'off-shift': 'Off shift',
  'pre-shift': 'Pre-shift',
  morning: 'Morning',
  lunch: 'Lunch',
  afternoon: 'Afternoon',
  'wrap-up': 'Wrap-up',
};

const outlineBtnClass =
  'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700';

export function HealthyShiftCard() {
  const [settings, setSettings] = useState<HealthOutdoorsSettings | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyHealthLog | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  const refresh = () => {
    setSettings(getHealthOutdoorsSettings());
    setDailyLog(getTodayHealthLog());
    setNow(new Date());
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(refresh, 0);
    const intervalId = window.setInterval(refresh, 60 * 1000);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  const phase = useMemo(() => {
    if (!settings || !now) {
      return 'off-shift' as HealthShiftPhase;
    }
    return getShiftPhase(now, settings);
  }, [now, settings]);

  const dueReminder = useMemo(() => {
    if (!settings || !dailyLog || !now) return null;
    return getDueReminder(now, settings, dailyLog);
  }, [dailyLog, now, settings]);

  const nextReminder = useMemo(() => {
    if (!settings || !dailyLog || !now) return null;
    return getNextReminder(now, settings, dailyLog);
  }, [dailyLog, now, settings]);

  const activeReminder = dueReminder ?? nextReminder;

  const handleWater = () => {
    setDailyLog(incrementWater());
    setNow(new Date());
  };

  const handleUrgentTicketMode = () => {
    const result = enableUrgentTicketMode();
    setSettings(result.settings);
    setDailyLog(result.log);
    setNow(new Date());
  };

  if (!settings || !dailyLog) {
    return (
      <Card className="academy-wellness-card">
        <CardContent className="p-6 text-sm text-muted-foreground">Loading healthy shift card...</CardContent>
      </Card>
    );
  }

  return (
    <Card className="academy-wellness-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-white">
          <HeartPulse className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
          Healthy MSP Shift
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeReminder && (
          <div className="academy-inset-panel space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {dueReminder ? 'Due now' : 'Next micro-break'}
              </p>
              <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-200">
                {phaseLabels[phase]}
              </Badge>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{activeReminder.title}</h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{activeReminder.message}</p>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-800 dark:text-slate-100">Why it helps: </span>
              {activeReminder.whyItHelps}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Shift phase</p>
            <Badge variant="outline" className="mt-1 dark:border-slate-600 dark:text-slate-200">
              {phaseLabels[phase]}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Next health action</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
              {activeReminder?.title ?? 'No reminder due'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Water check-ins</p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-bold text-slate-900 dark:text-white">
              <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
              {dailyLog.waterCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Outdoor minutes</p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-bold text-slate-900 dark:text-white">
              <Footprints className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              {dailyLog.outdoorMinutes}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={handleWater}>
            <Droplets className="mr-2 h-4 w-4" />
            Drink water
          </Button>
          <TwoMinuteResetDialog
            faithPromptEnabled={settings.faithPromptEnabled}
            onLogChange={setDailyLog}
            onSettingsChange={setSettings}
            trigger={
              <Button type="button" size="sm" variant="outline" className={outlineBtnClass}>
                <Sparkles className="mr-2 h-4 w-4" />
                2-minute reset
              </Button>
            }
          />
          <Button type="button" size="sm" variant="outline" className={outlineBtnClass} onClick={handleUrgentTicketMode}>
            <Shield className="mr-2 h-4 w-4" />
            Urgent ticket mode
          </Button>
          <Button asChild size="sm" variant="outline" className={outlineBtnClass}>
            <Link href="/health-outdoors">Open Health & Outdoors</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
