'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface InteractiveFlashcardProps {
  prompt: string;
  answer: string;
  previousSelfScore?: 'right' | 'wrong';
  onComplete: (result: { selfScore: 'right' | 'wrong'; learnerAnswer: string }) => void;
}

export function InteractiveFlashcard({
  prompt,
  answer,
  previousSelfScore,
  onComplete,
}: InteractiveFlashcardProps) {
  const [learnerAnswer, setLearnerAnswer] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [savedScore, setSavedScore] = useState(previousSelfScore);

  const saveScore = (selfScore: 'right' | 'wrong') => {
    setSavedScore(selfScore);
    onComplete({ selfScore, learnerAnswer });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-950">
        <p className="text-sm font-semibold">Recall prompt</p>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{prompt}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="flashcard-answer">
          Your answer
        </label>
        <Input
          id="flashcard-answer"
          value={learnerAnswer}
          onChange={(event) => setLearnerAnswer(event.target.value)}
          placeholder="Type what you remember before revealing the answer."
        />
      </div>

      {!isRevealed ? (
        <Button onClick={() => setIsRevealed(true)} disabled={!learnerAnswer.trim()}>
          Submit and reveal answer
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <p className="text-sm font-semibold">Correct answer</p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{answer}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => saveScore('right')}>
              I was right
            </Button>
            <Button size="sm" variant="outline" onClick={() => saveScore('wrong')}>
              I was wrong
            </Button>
            {savedScore && <Badge variant="secondary">Saved: {savedScore}</Badge>}
          </div>
        </div>
      )}
    </div>
  );
}
