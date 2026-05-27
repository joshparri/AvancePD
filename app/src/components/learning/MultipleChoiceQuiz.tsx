'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MultipleChoiceQuizProps {
  question: string;
  choices: string[];
  correctChoiceIndex: number;
  explanation: string;
  onComplete: (result: { score: number; maxScore: number; learnerAnswer: string }) => void;
}

export function MultipleChoiceQuiz({
  question,
  choices,
  correctChoiceIndex,
  explanation,
  onComplete,
}: MultipleChoiceQuizProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selectedIndex === correctChoiceIndex;

  const submit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
    onComplete({
      score: isCorrect ? 1 : 0,
      maxScore: 1,
      learnerAnswer: choices[selectedIndex],
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{question}</p>
      <div className="space-y-2">
        {choices.map((choice, index) => (
          <label
            key={choice}
            className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            <input
              type="radio"
              name="interactive-quiz"
              checked={selectedIndex === index}
              onChange={() => setSelectedIndex(index)}
              disabled={submitted}
              className="mt-1"
            />
            <span>{choice}</span>
          </label>
        ))}
      </div>
      {!submitted ? (
        <Button onClick={submit} disabled={selectedIndex === null}>
          Check answer
        </Button>
      ) : (
        <div className="academy-inset-panel text-sm">
          <Badge variant={isCorrect ? 'default' : 'secondary'}>{isCorrect ? 'Correct' : 'Review this'}</Badge>
          <p className="mt-3 text-slate-700 dark:text-slate-200">{explanation}</p>
        </div>
      )}
    </div>
  );
}
