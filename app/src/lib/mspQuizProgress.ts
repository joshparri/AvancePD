export type MspQuizAttempt = {
  id: string;
  date: string;
  totalQuestions: number;
  correct: number;
  percentage: number;
  domainBreakdown: Record<string, { correct: number; total: number }>;
  weakestDomains: string[];
};

const QUIZ_ATTEMPTS_KEY = 'mspQuizAttempts';

export function getStoredQuizAttempts(): MspQuizAttempt[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(QUIZ_ATTEMPTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveQuizAttempt(attempt: MspQuizAttempt): void {
  if (typeof window === 'undefined') return;
  try {
    const attempts = getStoredQuizAttempts();
    attempts.unshift(attempt); // Add to beginning
    // Keep only last 10 attempts
    if (attempts.length > 10) {
      attempts.splice(10);
    }
    localStorage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    // Ignore localStorage errors
  }
}

export function getBestQuizScore(): { percentage: number; date: string } | null {
  const attempts = getStoredQuizAttempts();
  if (attempts.length === 0) return null;

  let best = attempts[0];
  for (const attempt of attempts) {
    if (attempt.percentage > best.percentage) {
      best = attempt;
    }
  }

  return { percentage: best.percentage, date: best.date };
}