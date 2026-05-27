import { avanceGameChallenges, type AvanceGameMode } from '@/data/avanceGameContent';

export type DailyQuestion = {
  mode: AvanceGameMode;
  modeLabel: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  clues?: string[];
};

const MODES: AvanceGameMode[] = [
  'recall-rush',
  'ticket-detective',
  'flow-drill',
  'logic-sprint',
  'command-line',
  'break-fix',
];

const MODE_LABELS: Record<AvanceGameMode, string> = {
  'recall-rush': 'Recall Rush',
  'ticket-detective': 'Ticket Detective',
  'flow-drill': 'Flow Drill',
  'logic-sprint': 'Logic Sprint',
  'command-line': 'Command Line',
  'break-fix': 'Break-Fix Lab',
};

function seededIndex(seed: string, max: number, salt: number): number {
  let h = 0;
  const s = `${seed}-${salt}`;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h) % max;
}

export const getDailyChallengeQuestions = (dateKey: string): DailyQuestion[] =>
  MODES.map((mode, i) => {
    const pool = avanceGameChallenges.filter((c) => c.mode === mode);
    const c = pool[seededIndex(dateKey, pool.length, i)] ?? pool[0];
    return {
      mode,
      modeLabel: MODE_LABELS[mode],
      prompt: c.prompt,
      choices: c.choices,
      correctIndex: c.correctIndex,
      explanation: c.explanation,
      clues: c.clues,
    };
  });

export const DAILY_CHALLENGE_XP = 150;
export const DAILY_STORAGE_KEY = 'avance_daily_challenge';
