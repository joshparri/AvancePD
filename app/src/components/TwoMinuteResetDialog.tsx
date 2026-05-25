'use client';

import { ReactNode, useMemo, useState } from 'react';
import { CheckCircle2, Eye, Footprints, Pause, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { completeTwoMinuteReset, enableQuietMode } from '@/lib/healthOutdoorsStorage';
import type { DailyHealthLog, HealthOutdoorsSettings } from '@/types/healthOutdoors';

interface TwoMinuteResetDialogProps {
  faithPromptEnabled: boolean;
  trigger: ReactNode;
  onLogChange?: (log: DailyHealthLog) => void;
  onSettingsChange?: (settings: HealthOutdoorsSettings) => void;
}

const baseSteps = [
  {
    title: 'Feet on the floor',
    body: 'Put both feet down and let the chair hold you for a moment.',
    icon: Footprints,
  },
  {
    title: 'Jaw and shoulders',
    body: 'Relax your jaw. Let your shoulders drop. You do not need to solve everything at once.',
    icon: Pause,
  },
  {
    title: 'Look away',
    body: 'Look away from the screen. Let your eyes land on something still.',
    icon: Eye,
  },
  {
    title: 'Three slow breaths',
    body: 'Take three slow breaths. Keep it simple and quiet.',
    icon: Pause,
  },
  {
    title: 'Name it',
    body: 'Name what you are feeling in one word: tired, stuck, tense, scattered, or something else.',
    icon: ShieldCheck,
  },
  {
    title: 'Next tiny action',
    body: 'Name the next tiny action. One check, one note, one question, one step.',
    icon: CheckCircle2,
  },
];

const faithStep = {
  title: 'Optional prayer',
  body: 'Lord, give me wisdom, patience, and peace for the next step.',
  icon: ShieldCheck,
};

export function TwoMinuteResetDialog({
  faithPromptEnabled,
  trigger,
  onLogChange,
  onSettingsChange,
}: TwoMinuteResetDialogProps) {
  const [open, setOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showFaithPrompt, setShowFaithPrompt] = useState(faithPromptEnabled);

  const steps = useMemo(
    () => (faithPromptEnabled && showFaithPrompt ? [...baseSteps, faithStep] : baseSteps),
    [faithPromptEnabled, showFaithPrompt]
  );

  const activeStep = steps[Math.min(stepIndex, steps.length - 1)];
  const Icon = activeStep.icon;

  const resetState = () => {
    setHasStarted(false);
    setStepIndex(0);
    setShowFaithPrompt(faithPromptEnabled);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetState();
    }
  };

  const handleDone = () => {
    const log = completeTwoMinuteReset();
    onLogChange?.(log);
    setOpen(false);
    resetState();
  };

  const handleQuietMode = () => {
    const settings = enableQuietMode(30);
    onSettingsChange?.(settings);
    setOpen(false);
    resetState();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>2-minute reset</DialogTitle>
          <DialogDescription>
            A quiet reset for overloaded MSP moments. No hype, no shame, just the next good step.
          </DialogDescription>
        </DialogHeader>

        {!hasStarted ? (
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
            This takes two minutes or less. Do what is realistic during the workday.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <Icon className="mt-1 h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-300" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Step {stepIndex + 1} of {steps.length}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
                  {activeStep.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {activeStep.body}
                </p>
              </div>
            </div>

            {faithPromptEnabled && showFaithPrompt && stepIndex < steps.length - 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowFaithPrompt(false)}>
                Skip faith prompt
              </Button>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleQuietMode}>
            I need quiet mode
          </Button>
          {!hasStarted ? (
            <Button type="button" onClick={() => setHasStarted(true)}>
              Start reset
            </Button>
          ) : stepIndex < steps.length - 1 ? (
            <Button type="button" onClick={() => setStepIndex((current) => current + 1)}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleDone}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
