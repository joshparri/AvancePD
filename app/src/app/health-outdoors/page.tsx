'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Droplets,
  Eye,
  Footprints,
  HeartPulse,
  Moon,
  Pause,
  Shield,
  Sun,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { TwoMinuteResetDialog } from '@/components/TwoMinuteResetDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { healthActions, researchCards, weeklyReviewPrompts } from '@/data/healthOutdoors';
import {
  addOutdoorMinutes,
  completeHealthAction,
  enableUrgentTicketMode,
  exportHealthOutdoorsJson,
  getHealthOutdoorsSettings,
  getManagerSafeHealthSummary,
  getTodayHealthLog,
  getWeeklyHealthSummary,
  incrementWater,
  markHealthNotificationSent,
  resetTodayHealthLog,
  skipHealthReminder,
  snoozeReminder,
  updateHealthOutdoorsSettings,
} from '@/lib/healthOutdoorsStorage';
import { getDueReminder, getNextReminder, getShiftPhase } from '@/lib/healthReminderEngine';
import type { DailyHealthLog, HealthOutdoorsSettings, HealthShiftPhase, WeeklyHealthSummary } from '@/types/healthOutdoors';

const phaseLabels: Record<HealthShiftPhase, string> = {
  'off-shift': 'Off shift',
  'pre-shift': 'Pre-shift',
  morning: 'Morning',
  lunch: 'Lunch',
  afternoon: 'Afternoon',
  'wrap-up': 'Wrap-up',
};

const confidenceClasses = {
  strong: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
  moderate: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200',
  emerging: 'border-slate-400/50 bg-slate-500/10 text-slate-700 dark:text-slate-200',
};

const formatTime = (date?: Date) =>
  date
    ? date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Not scheduled';

function StatCard({
  title,
  value,
  caption,
  icon,
}: {
  title: string;
  value: string | number;
  caption: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  );
}

function InlineStat({
  title,
  value,
  caption,
  icon,
}: {
  title: string;
  value: string | number;
  caption: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{title}</p>
        {icon}
      </div>
      <p className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}

function WeeklyReview({ summary }: { summary: WeeklyHealthSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sun className="h-5 w-5" />
          Weekly Health Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <InlineStat title="Water" value={summary.waterCount} caption="check-ins" icon={<Droplets className="h-4 w-4 text-cyan-500" />} />
          <InlineStat title="Outdoors" value={summary.outdoorMinutes} caption="minutes" icon={<Footprints className="h-4 w-4 text-emerald-500" />} />
          <InlineStat title="Movement" value={summary.movementBreaks} caption="breaks" icon={<Pause className="h-4 w-4 text-cyan-500" />} />
          <InlineStat title="Eye breaks" value={summary.eyeBreaks} caption="screen resets" icon={<Eye className="h-4 w-4 text-cyan-500" />} />
          <InlineStat title="Shutdowns" value={summary.shutdownCompletedCount} caption="days completed" icon={<Moon className="h-4 w-4 text-slate-500" />} />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {weeklyReviewPrompts.map((prompt) => (
            <div key={prompt.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950">
              {prompt.question}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HealthOutdoorsPage() {
  const [settings, setSettings] = useState<HealthOutdoorsSettings | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyHealthLog | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklyHealthSummary | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [copyMessage, setCopyMessage] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [exportJson, setExportJson] = useState('');

  const refresh = () => {
    setSettings(getHealthOutdoorsSettings());
    setDailyLog(getTodayHealthLog());
    setWeeklySummary(getWeeklyHealthSummary());
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
    if (!settings || !dailyLog || !now) {
      return null;
    }

    return getDueReminder(now, settings, dailyLog);
  }, [dailyLog, now, settings]);

  const nextReminder = useMemo(() => {
    if (!settings || !dailyLog || !now) {
      return null;
    }

    return getNextReminder(now, settings, dailyLog);
  }, [dailyLog, now, settings]);

  const activeReminder = dueReminder ?? nextReminder;
  const managerSafeSummary = getManagerSafeHealthSummary();

  const syncLog = (log: DailyHealthLog) => {
    setDailyLog(log);
    setWeeklySummary(getWeeklyHealthSummary());
    setNow(new Date());
  };

  useEffect(() => {
    if (!settings || !dueReminder || typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (!settings.notificationsEnabled || Notification.permission !== 'granted') {
      return;
    }

    if (settings.lastNotificationId === dueReminder.id) {
      return;
    }

    new Notification(`Tiny reset: ${dueReminder.title}`, {
      body: dueReminder.notificationBody,
    });

    const timeoutId = window.setTimeout(() => {
      setSettings(markHealthNotificationSent(dueReminder.id));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [dueReminder, settings]);

  const handleDone = () => {
    if (!activeReminder) {
      return;
    }

    syncLog(completeHealthAction(activeReminder.actionId, activeReminder.id));
  };

  const handleSkip = () => {
    if (!activeReminder) {
      return;
    }

    syncLog(skipHealthReminder(activeReminder.id));
  };

  const handleSnooze = (minutes: number) => {
    const result = snoozeReminder(minutes);
    setSettings(result.settings);
    setDailyLog(result.log);
    setWeeklySummary(getWeeklyHealthSummary());
    setNow(new Date());
  };

  const handleUrgentTicketMode = () => {
    const result = enableUrgentTicketMode();
    setSettings(result.settings);
    setDailyLog(result.log);
    setWeeklySummary(getWeeklyHealthSummary());
    setNow(new Date());
  };

  const handleEnableNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationMessage('This browser does not support local notifications. In-app reminders will still work.');
      setSettings(updateHealthOutdoorsSettings({ notificationsEnabled: false, notificationPermission: 'unsupported' }));
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      new Notification('Health reminders enabled', {
        body: 'In-app reminders will stay gentle, and browser reminders will respect snooze and quiet mode.',
      });
      setNotificationMessage('Browser health reminders are enabled.');
      setSettings(
        updateHealthOutdoorsSettings({
          notificationsEnabled: true,
          notificationPermission: 'granted',
          notificationPermissionDenied: false,
        })
      );
      return;
    }

    setNotificationMessage('Notifications were not enabled. In-app reminders will still work.');
    setSettings(
      updateHealthOutdoorsSettings({
        notificationsEnabled: false,
        notificationPermission: 'denied',
        notificationPermissionDenied: true,
      })
    );
  };

  const handleFaithToggle = (checked: boolean) => {
    setSettings(updateHealthOutdoorsSettings({ faithPromptEnabled: checked }));
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(managerSafeSummary);
      setCopyMessage('Summary copied.');
    } catch {
      setCopyMessage('Could not copy summary.');
    }
  };

  const handleExport = () => {
    setExportJson(exportHealthOutdoorsJson());
  };

  const handleResetToday = () => {
    setDailyLog(resetTodayHealthLog());
    setWeeklySummary(getWeeklyHealthSummary());
    setNow(new Date());
  };

  if (!settings || !dailyLog || !weeklySummary) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl p-6 text-sm text-muted-foreground">
          Loading Health & Outdoors...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Health & Outdoors</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                Gentle local-first habits for sustainable MSP shifts. No medical records, no ticket data, no pressure.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{phaseLabels[phase]}</Badge>
              <Badge variant="outline">Mon/Wed 8:30-5:00</Badge>
            </div>
          </div>

          <Card className="academy-wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HeartPulse className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                {dueReminder ? 'Tiny reset due now' : 'Next tiny reset'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {activeReminder ? formatTime(activeReminder.scheduledAt) : 'No reminder scheduled'}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                      {activeReminder?.title ?? 'You are clear for now'}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {activeReminder?.message ?? 'No guilt - just return to the next good step when one appears.'}
                    </p>
                    {activeReminder && (
                      <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">
                        Why it helps: {activeReminder.whyItHelps}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">{dueReminder ? 'Due now' : 'Upcoming'}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={handleDone} disabled={!activeReminder}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Done
                </Button>
                <Button type="button" variant="outline" onClick={() => handleSnooze(15)} disabled={!activeReminder}>
                  Snooze 15 min
                </Button>
                <Button type="button" variant="outline" onClick={() => handleSnooze(30)} disabled={!activeReminder}>
                  Snooze 30 min
                </Button>
                <Button type="button" variant="outline" onClick={handleSkip} disabled={!activeReminder}>
                  Skip for now
                </Button>
                <Button type="button" variant="outline" onClick={handleUrgentTicketMode}>
                  <Shield className="mr-2 h-4 w-4" />
                  Urgent ticket mode
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This is about sustainability, not perfection. Do what is realistic during the workday.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Today's Health Plan" value={phaseLabels[phase]} caption="Follow the next realistic reset" icon={<Clock className="h-4 w-4 text-cyan-500" />} />
            <StatCard title="Next Tiny Reset" value={activeReminder?.title ?? 'Clear'} caption={activeReminder ? formatTime(activeReminder.scheduledAt) : 'No action due'} icon={<HeartPulse className="h-4 w-4 text-cyan-500" />} />
            <StatCard title="Hydration" value={dailyLog.waterCount} caption="water check-ins today" icon={<Droplets className="h-4 w-4 text-cyan-500" />} />
            <StatCard title="Outdoor Time" value={`${dailyLog.outdoorMinutes} min`} caption="daylight or walk time" icon={<Sun className="h-4 w-4 text-emerald-500" />} />
            <StatCard title="Eyes & Posture" value={dailyLog.eyeBreaks + dailyLog.postureResets} caption="screen and body resets" icon={<Eye className="h-4 w-4 text-cyan-500" />} />
            <StatCard title="Nervous System Reset" value={dailyLog.nervousSystemResets} caption="2-minute resets today" icon={<Pause className="h-4 w-4 text-cyan-500" />} />
            <StatCard title="Weekly Nature Target" value={`${weeklySummary.outdoorMinutes}/120`} caption="minutes toward a gentle target" icon={<Footprints className="h-4 w-4 text-emerald-500" />} />
            <StatCard title="End-of-Day Shutdown" value={dailyLog.shutdownCompleted ? 'Done' : 'Open'} caption="close loops before leaving" icon={<Moon className="h-4 w-4 text-slate-500" />} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => syncLog(incrementWater())}>
                <Droplets className="mr-2 h-4 w-4" />
                Drink water
              </Button>
              <Button type="button" variant="outline" onClick={() => syncLog(addOutdoorMinutes(5))}>
                <Sun className="mr-2 h-4 w-4" />
                Add 5 outdoor min
              </Button>
              <Button type="button" variant="outline" onClick={() => syncLog(addOutdoorMinutes(15))}>
                <Footprints className="mr-2 h-4 w-4" />
                Add 15 outdoor min
              </Button>
              <Button type="button" variant="outline" onClick={() => syncLog(completeHealthAction('eyes-20-20-20'))}>
                Eye break
              </Button>
              <Button type="button" variant="outline" onClick={() => syncLog(completeHealthAction('posture-shoulders-jaw'))}>
                Posture reset
              </Button>
              <Button type="button" variant="outline" onClick={() => syncLog(completeHealthAction('lunch-away-from-screen'))}>
                Lunch away from screen
              </Button>
              <Button type="button" variant="outline" onClick={() => syncLog(completeHealthAction('shutdown-close-loops'))}>
                Shutdown complete
              </Button>
              <TwoMinuteResetDialog
                faithPromptEnabled={settings.faithPromptEnabled}
                onLogChange={syncLog}
                onSettingsChange={setSettings}
                trigger={<Button type="button">Start 2-minute reset</Button>}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5" />
                  Browser reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  Browser notifications are optional and only requested after you click the button.
                </p>
                <Button type="button" onClick={handleEnableNotifications} disabled={settings.notificationPermissionDenied}>
                  Enable browser health reminders
                </Button>
                {settings.notificationPermissionDenied && (
                  <p className="text-sm text-muted-foreground">
                    Notifications were denied. In-app reminders will still work.
                  </p>
                )}
                {notificationMessage && <p className="text-sm text-cyan-700 dark:text-cyan-200">{notificationMessage}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings and guardrails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="faith-prompt"
                    checked={settings.faithPromptEnabled}
                    onCheckedChange={handleFaithToggle}
                  />
                  <Label htmlFor="faith-prompt">Show optional faith prompt in 2-minute reset</Label>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Local action tracking only. No medical readings, heart data, client details, passwords,
                  hostnames, IP addresses, screenshots, or ticket content are stored.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export health JSON
                  </Button>
                  <Button type="button" variant="outline" onClick={handleResetToday}>
                    Reset today
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {exportJson && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Local JSON export</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea readOnly value={exportJson} className="min-h-[18rem] font-mono text-xs" />
              </CardContent>
            </Card>
          )}

          <WeeklyReview summary={weeklySummary} />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Manager-safe Evidence Pack summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 dark:border-slate-800 dark:bg-slate-950">
                {managerSafeSummary}
              </p>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" onClick={handleCopySummary}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy manager-safe summary
                </Button>
                {copyMessage && <span className="text-sm text-cyan-700 dark:text-cyan-200">{copyMessage}</span>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Research-backed action ideas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {researchCards.slice(0, 8).map((card) => (
                <div key={card.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-950 dark:text-white">{card.title}</h3>
                    <Badge variant="outline" className={confidenceClasses[card.confidenceLevel]}>
                      {card.confidenceLevel}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{card.summary}</p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{card.practicalAction}</p>
                  <a
                    href={card.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-xs text-cyan-700 underline-offset-4 hover:underline dark:text-cyan-200"
                  >
                    {card.sourceLabel}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Action library</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {healthActions.slice(0, 9).map((action) => (
                <div key={action.id} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{action.title}</h3>
                    <Badge variant="outline">{action.durationMinutes} min</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{action.shortPrompt}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
