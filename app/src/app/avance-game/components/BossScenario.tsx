'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { bossScenariosByNode } from '../data/bossScenarios';

type BossScenarioProps = {
  nodeId: string;
  nodeLabel: string;
  onComplete: (passed: boolean) => void;
  onClose: () => void;
};

const TIMER_SECONDS = 90;

export function BossScenario({ nodeId, nodeLabel, onComplete, onClose }: BossScenarioProps) {
  const questions = bossScenariosByNode[nodeId] ?? [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [score, setScore] = useState(0);
  const completedRef = useRef(false);
  const answersRef = useRef<number[]>([]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const endBoss = (finalAnswers: number[]) => {
    if (completedRef.current) return;
    completedRef.current = true;
    const finalScore = finalAnswers.filter((a, i) => a === questions[i]?.correctIndex).length;
    const didPass = finalScore >= 4;
    setScore(finalScore);
    setPassed(didPass);
    setFinished(true);
    onComplete(didPass);
  };

  useEffect(() => {
    if (finished || questions.length === 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          endBoss(answersRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [finished, questions.length]);

  const submitAnswer = () => {
    if (selected === null || finished) return;
    const next = [...answers, selected];
    setAnswers(next);
    setSelected(null);
    if (next.length >= questions.length) {
      endBoss(next);
    } else {
      setIndex(next.length);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4">
        <div className="rounded-xl bg-white p-6 dark:bg-slate-900">
          <p>No boss scenario for this node yet.</p>
          <Button className="mt-4" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">⚡ Boss Challenge: {nodeLabel}</h2>
          <span className="rounded-full bg-red-100 px-2 py-1 font-mono text-xs text-red-800 dark:bg-red-950 dark:text-red-200">
            {finished ? '0:00' : `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`}
          </span>
        </div>

        {!finished && q && (
          <>
            <p className="mb-1 text-xs text-muted-foreground">
              Question {index + 1} of {questions.length}
            </p>
            <p className="mb-4 text-sm font-medium">{q.question}</p>
            <div className="space-y-2">
              {q.choices.map((choice, i) => (
                <label key={choice} className="flex cursor-pointer gap-2 rounded-lg border p-3 text-sm">
                  <input type="radio" checked={selected === i} onChange={() => setSelected(i)} className="mt-0.5" />
                  {choice}
                </label>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={submitAnswer} disabled={selected === null}>
              Submit answer
            </Button>
          </>
        )}

        {finished && (
          <div className="space-y-4">
            <p className={`text-lg font-bold ${passed ? 'text-emerald-600' : 'text-amber-600'}`}>
              {passed ? `Passed! ${score}/5` : `Not yet — ${score}/5 (need 4)`}
            </p>
            <p className="text-sm text-muted-foreground">
              {passed ? 'Node boss complete! +200 XP and badge earned.' : 'Try again tomorrow.'}
            </p>
            <ul className="space-y-3 text-xs">
              {questions.map((item) => (
                <li key={item.question} className="rounded-lg border p-2">
                  <p className="font-medium">{item.question}</p>
                  <p className="mt-1 text-emerald-700 dark:text-emerald-300">✓ {item.choices[item.correctIndex]}</p>
                  <p className="mt-1 text-muted-foreground">{item.explanation}</p>
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
