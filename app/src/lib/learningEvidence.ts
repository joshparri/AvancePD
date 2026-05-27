'use client';

export type LearningEvidenceType =
  | 'learning-activity'
  | 'kb-review'
  | 'kb-flashcard'
  | 'kb-scenario'
  | 'kb-ticket-note'
  | 'kb-reflection'
  | 'quiz-attempt'
  | 'skill-practice'
  | 'external-study';

export type LearningEvidenceSource =
  | 'learning-cockpit'
  | 'kb-learning-machine'
  | 'msp-quiz'
  | 'msp-skills'
  | 'external';

export type LearningEvidenceStatus = 'saved' | 'started' | 'completed' | 'reviewed';

export type LearningEvidenceResult = 'right' | 'wrong' | 'passed' | 'needs-review';

export type LearningEvidenceItem = {
  id: string;
  type: LearningEvidenceType;
  title: string;
  domain?: string;
  skill?: string;
  source?: LearningEvidenceSource;
  status: LearningEvidenceStatus;
  result?: LearningEvidenceResult;
  score?: number;
  maxScore?: number;
  minutes?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type LearningEvidenceSummary = {
  activitiesCompleted: number;
  kbReviews: number;
  quizAttempts: number;
  averageQuizScore: number | null;
  ticketNotesPractised: number;
  reflectionsSaved: number;
  minutesLogged: number;
  recentItems: LearningEvidenceItem[];
  bySource: Record<LearningEvidenceSource, number>;
  nextActions: string[];
};

const EVIDENCE_KEY = 'avance_learning_evidence_v1';

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const nowIso = () => new Date().toISOString();

const readStore = (): LearningEvidenceItem[] => {
  if (!canUseLocalStorage()) return [];

  try {
    const raw = window.localStorage.getItem(EVIDENCE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id === 'string');
  } catch {
    return [];
  }
};

const writeStore = (items: LearningEvidenceItem[]) => {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.setItem(EVIDENCE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export const buildEvidenceId = (type: LearningEvidenceType, key: string) => `${type}:${key}`;

export const getLearningEvidence = (): LearningEvidenceItem[] => readStore();

export const addLearningEvidence = (
  item: Omit<LearningEvidenceItem, 'createdAt' | 'updatedAt'> & { createdAt?: string }
): LearningEvidenceItem => {
  const timestamp = nowIso();
  const nextItem: LearningEvidenceItem = {
    ...item,
    createdAt: item.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
  writeStore([nextItem, ...readStore()]);
  return nextItem;
};

export const upsertLearningEvidence = (
  item: Omit<LearningEvidenceItem, 'createdAt' | 'updatedAt'> & { createdAt?: string }
): LearningEvidenceItem => {
  const items = readStore();
  const index = items.findIndex((existing) => existing.id === item.id);
  const timestamp = nowIso();

  if (index === -1) {
    const nextItem: LearningEvidenceItem = {
      ...item,
      createdAt: item.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    writeStore([nextItem, ...items]);
    return nextItem;
  }

  const previous = items[index];
  const nextItem: LearningEvidenceItem = {
    ...previous,
    ...item,
    createdAt: previous.createdAt,
    updatedAt: timestamp,
  };
  const nextItems = [...items];
  nextItems[index] = nextItem;
  writeStore(nextItems);
  return nextItem;
};

export const markEvidenceCompleted = (
  id: string,
  patch: Partial<Omit<LearningEvidenceItem, 'id' | 'createdAt' | 'updatedAt'>> = {}
): LearningEvidenceItem | null => {
  const items = readStore();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const nextItem: LearningEvidenceItem = {
    ...items[index],
    ...patch,
    status: patch.status ?? 'completed',
    updatedAt: nowIso(),
  };
  const nextItems = [...items];
  nextItems[index] = nextItem;
  writeStore(nextItems);
  return nextItem;
};

export const getEvidenceByType = (type: LearningEvidenceType) =>
  readStore().filter((item) => item.type === type);

export const getCompletedEvidence = () =>
  readStore().filter((item) => item.status === 'completed' || item.status === 'reviewed');

export const getEvidenceSummary = (): LearningEvidenceSummary => {
  const items = readStore();

  const learningActivities = items.filter((item) => item.type === 'learning-activity');
  const kbReviews = items.filter((item) => item.type === 'kb-review');
  const quizAttempts = items.filter((item) => item.type === 'quiz-attempt');
  const ticketNotes = items.filter((item) => item.type === 'kb-ticket-note');
  const reflections = items.filter(
    (item) => item.type === 'kb-reflection' || (item.type === 'learning-activity' && Boolean(item.notes))
  );

  const quizScores = quizAttempts
    .map((item) => {
      if (typeof item.score === 'number' && typeof item.maxScore === 'number' && item.maxScore > 0) {
        return Math.round((item.score / item.maxScore) * 100);
      }
      return null;
    })
    .filter((score): score is number => score !== null);
  const averageQuizScore =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
      : null;

  const minutesLogged = items.reduce((sum, item) => sum + (item.minutes ?? 0), 0);

  const bySource: Record<LearningEvidenceSource, number> = {
    'learning-cockpit': 0,
    'kb-learning-machine': 0,
    'msp-quiz': 0,
    'msp-skills': 0,
    external: 0,
  };

  for (const item of items) {
    if (item.source) {
      bySource[item.source] += 1;
    }
  }

  const recentItems = [...items]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  const nextActions: string[] = [];
  if (quizAttempts.length === 0) {
    nextActions.push('Complete one MSP Quiz attempt to benchmark weak domains.');
  }
  if (kbReviews.length === 0) {
    nextActions.push('Run one KB spaced review in KB Learning Machine.');
  }
  if (ticketNotes.length === 0) {
    nextActions.push('Practise one KB ticket-note drill and save it to evidence.');
  }
  const weakQuiz = quizAttempts.find((item) => (item.score ?? 100) < 70);
  if (weakQuiz) {
    nextActions.push(
      `Revisit practice for ${weakQuiz.domain ?? 'your weakest quiz domain'} after scoring ${weakQuiz.score}%.`
    );
  }
  if (learningActivities.length === 0) {
    nextActions.push('Complete one Learning Cockpit activity and mark it done.');
  }
  if (nextActions.length === 0) {
    nextActions.push('Keep a steady mix: one quiz, one KB review, and one Cockpit activity this week.');
  }

  return {
    activitiesCompleted: learningActivities.filter((item) => item.status === 'completed').length,
    kbReviews: kbReviews.length,
    quizAttempts: quizAttempts.length,
    averageQuizScore,
    ticketNotesPractised: ticketNotes.length,
    reflectionsSaved: reflections.length,
    minutesLogged,
    recentItems,
    bySource,
    nextActions: nextActions.slice(0, 4),
  };
};

export const clearLearningEvidenceForDevOnly = () => {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(EVIDENCE_KEY);
};

// Convenience recorders (keep existing progress keys untouched)

export const recordLearningActivityEvidence = (input: {
  activityId: string;
  title: string;
  domain?: string;
  activityType?: string;
  minutes?: number;
  status?: LearningEvidenceStatus;
  result?: LearningEvidenceResult;
  score?: number;
  maxScore?: number;
  notes?: string;
}) =>
  upsertLearningEvidence({
    id: buildEvidenceId('learning-activity', input.activityId),
    type: 'learning-activity',
    title: input.title,
    domain: input.domain,
    source: 'learning-cockpit',
    status: input.status ?? 'completed',
    result: input.result,
    score: input.score,
    maxScore: input.maxScore,
    minutes: input.minutes,
    notes: input.notes,
  });

export const recordKbReviewEvidence = (input: {
  cardId: string;
  title: string;
  skill?: string;
  rating: string;
}) =>
  upsertLearningEvidence({
    id: buildEvidenceId('kb-review', input.cardId),
    type: 'kb-review',
    title: `${input.title} — review (${input.rating})`,
    skill: input.skill,
    source: 'kb-learning-machine',
    status: 'reviewed',
    notes: `Spaced review rating: ${input.rating}`,
  });

export const recordKbFlashcardEvidence = (input: {
  cardId: string;
  title: string;
  skill?: string;
  flashcardIndex: number;
  result: 'right' | 'wrong';
}) =>
  upsertLearningEvidence({
    id: buildEvidenceId('kb-flashcard', `${input.cardId}:${input.flashcardIndex}`),
    type: 'kb-flashcard',
    title: `${input.title} — flashcard ${input.flashcardIndex + 1}`,
    skill: input.skill,
    source: 'kb-learning-machine',
    status: 'completed',
    result: input.result,
  });

export const recordKbScenarioEvidence = (input: {
  cardId: string;
  title: string;
  skill?: string;
  notes: string;
}) =>
  upsertLearningEvidence({
    id: buildEvidenceId('kb-scenario', input.cardId),
    type: 'kb-scenario',
    title: `${input.title} — scenario drill`,
    skill: input.skill,
    source: 'kb-learning-machine',
    status: 'completed',
    notes: input.notes,
  });

export const recordKbTicketNoteEvidence = (input: {
  cardId: string;
  title: string;
  skill?: string;
  notes: string;
}) =>
  upsertLearningEvidence({
    id: buildEvidenceId('kb-ticket-note', input.cardId),
    type: 'kb-ticket-note',
    title: `${input.title} — ticket note`,
    skill: input.skill,
    source: 'kb-learning-machine',
    status: 'completed',
    notes: input.notes,
  });

export const recordKbReflectionEvidence = (input: {
  cardId: string;
  title: string;
  skill?: string;
  notes: string;
}) =>
  upsertLearningEvidence({
    id: buildEvidenceId('kb-reflection', input.cardId),
    type: 'kb-reflection',
    title: `${input.title} — reflection`,
    skill: input.skill,
    source: 'kb-learning-machine',
    status: 'completed',
    notes: input.notes,
  });

export const recordQuizAttemptEvidence = (input: {
  attemptId: string;
  title: string;
  score: number;
  maxScore: number;
  domain?: string;
  notes?: string;
}) => {
  const passed = input.score / input.maxScore >= 0.7;
  return upsertLearningEvidence({
    id: buildEvidenceId('quiz-attempt', input.attemptId),
    type: 'quiz-attempt',
    title: input.title,
    domain: input.domain,
    source: 'msp-quiz',
    status: 'completed',
    result: passed ? 'passed' : 'needs-review',
    score: input.score,
    maxScore: input.maxScore,
    notes: input.notes,
  });
};
