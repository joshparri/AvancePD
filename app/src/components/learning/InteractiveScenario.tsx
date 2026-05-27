'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import type { InteractiveScenarioStep } from '@/data/mspLearningActivities';

interface InteractiveScenarioProps {
  scenarioDescription: string;
  steps: InteractiveScenarioStep[];
  previousTicketNote?: string;
  onComplete: (result: { score: number; maxScore: number; ticketNote: string }) => void;
}

export function InteractiveScenario({
  scenarioDescription,
  steps,
  previousTicketNote,
  onComplete,
}: InteractiveScenarioProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [ticketNote, setTicketNote] = useState(previousTicketNote ?? '');
  const [completed, setCompleted] = useState(false);
  const currentStep = steps[stepIndex];
  const score = answers.filter((answer, index) => answer === steps[index].correctChoiceIndex).length;

  const submitStep = () => {
    if (selectedIndex === null) return;
    setAnswers((current) => [...current, selectedIndex]);
    setShowFeedback(true);
  };

  const nextStep = () => {
    setSelectedIndex(null);
    setShowFeedback(false);
    setStepIndex((current) => current + 1);
  };

  const finish = () => {
    setCompleted(true);
    onComplete({ score, maxScore: steps.length, ticketNote });
  };

  if (!currentStep) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-950">
          <p className="text-sm font-semibold">Scenario complete</p>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Score: {score} / {steps.length}. Now write a short ticket note for the handover.
          </p>
        </div>
        <Textarea
          value={ticketNote}
          onChange={(event) => setTicketNote(event.target.value)}
          rows={5}
          placeholder="Issue, impact, checks, action, result, and next step."
        />
        <Button onClick={finish} disabled={!ticketNote.trim()}>
          Save scenario and ticket note
        </Button>
        {completed && <Badge variant="secondary">Saved</Badge>}
      </div>
    );
  }

  const isCorrect = selectedIndex === currentStep.correctChoiceIndex;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-gray-50 p-4 text-sm dark:bg-gray-950">
        <p className="font-semibold">Scenario</p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{scenarioDescription}</p>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold">{currentStep.question}</p>
          <Badge variant="outline">
            Step {stepIndex + 1} of {steps.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {currentStep.choices.map((choice, index) => (
            <label key={choice} className="flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm">
              <input
                type="radio"
                checked={selectedIndex === index}
                onChange={() => setSelectedIndex(index)}
                disabled={showFeedback}
                className="mt-1"
              />
              <span>{choice}</span>
            </label>
          ))}
        </div>
      </div>
      {!showFeedback ? (
        <Button onClick={submitStep} disabled={selectedIndex === null}>
          Check step
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg border bg-gray-50 p-4 text-sm dark:bg-gray-950">
            <Badge variant={isCorrect ? 'default' : 'secondary'}>{isCorrect ? 'Good choice' : 'Needs review'}</Badge>
            <p className="mt-3 text-gray-700 dark:text-gray-300">{currentStep.explanation}</p>
          </div>
          <Button onClick={nextStep}>{stepIndex + 1 === steps.length ? 'Write ticket note' : 'Next step'}</Button>
        </div>
      )}
    </div>
  );
}
