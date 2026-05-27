import { addDays, isSameDay, parseISO, startOfToday } from 'date-fns';
import {
  kbFieldCards,
  type KbConfidence,
  kbConfidenceRank,
  type KbFieldCard,
  type KbReviewHistoryEntry,
  type KbReviewRating,
} from '@/data/kbFieldCards';

const KB_PROGRESS_KEY = 'avance_kb_learning_progress_v1';

export interface KbScenarioPractice {
  response: string;
  savedAt: string;
}

export interface KbTicketNotePractice {
  summary: string;
  environment: string;
  checksPerformed: string;
  actionTaken: string;
  result: string;
  followUp: string;
  escalation: string;
  nextStep: string;
  savedAt: string;
}

export interface KbReflectionPractice {
  text: string;
  savedAt: string;
}

export interface KbCardProgressOverride {
  confidence?: KbConfidence;
  reviewDueDate?: string;
  lastReviewedAt?: string;
  reviewHistory?: KbReviewHistoryEntry[];
  scenarioPractice?: KbScenarioPractice;
  ticketNotePractice?: KbTicketNotePractice;
  reflection?: KbReflectionPractice;
}

export type KbProgressByCardId = Record<string, KbCardProgressOverride>;

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const todayIso = () => startOfToday().toISOString();

const addDaysIso = (days: number) => addDays(startOfToday(), days).toISOString();

export const getKbLearningProgress = (): KbProgressByCardId => {
  if (!canUseLocalStorage()) return {};

  try {
    const raw = window.localStorage.getItem(KB_PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as KbProgressByCardId) : {};
  } catch {
    return {};
  }
};

const saveKbLearningProgress = (progress: KbProgressByCardId) => {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(KB_PROGRESS_KEY, JSON.stringify(progress));
};

export const mergeKbCardsWithProgress = (
  cards: KbFieldCard[] = kbFieldCards,
  progress: KbProgressByCardId = getKbLearningProgress()
): KbFieldCard[] =>
  cards.map((card) => {
    const override = progress[card.id];
    if (!override) return card;

    return {
      ...card,
      confidence: override.confidence ?? card.confidence,
      reviewDueDate: override.reviewDueDate ?? card.reviewDueDate,
      lastReviewedAt: override.lastReviewedAt ?? card.lastReviewedAt,
      reviewHistory: override.reviewHistory ?? card.reviewHistory,
    };
  });

export const getNextReviewDateForRating = (rating: KbReviewRating) => {
  if (rating === 'Again') return todayIso();
  if (rating === 'Hard') return addDaysIso(2);
  if (rating === 'Good') return addDaysIso(7);
  return addDaysIso(14);
};

export const recordKbReview = (cardId: string, rating: KbReviewRating) => {
  const progress = getKbLearningProgress();
  const current = progress[cardId] ?? {};
  const nextReviewDate = getNextReviewDateForRating(rating);
  const entry: KbReviewHistoryEntry = {
    rating,
    reviewedAt: new Date().toISOString(),
    nextReviewDate,
  };

  progress[cardId] = {
    ...current,
    reviewDueDate: nextReviewDate,
    lastReviewedAt: entry.reviewedAt,
    reviewHistory: [...(current.reviewHistory ?? []), entry],
  };

  saveKbLearningProgress(progress);
  return progress;
};

export const updateKbConfidence = (cardId: string, confidence: KbConfidence) => {
  const progress = getKbLearningProgress();
  progress[cardId] = {
    ...(progress[cardId] ?? {}),
    confidence,
  };
  saveKbLearningProgress(progress);
  return progress;
};

export const saveKbScenarioPractice = (cardId: string, response: string) => {
  const progress = getKbLearningProgress();
  progress[cardId] = {
    ...(progress[cardId] ?? {}),
    scenarioPractice: {
      response,
      savedAt: new Date().toISOString(),
    },
  };
  saveKbLearningProgress(progress);
  return progress;
};

export const saveKbTicketNotePractice = (cardId: string, note: Omit<KbTicketNotePractice, 'savedAt'>) => {
  const progress = getKbLearningProgress();
  progress[cardId] = {
    ...(progress[cardId] ?? {}),
    ticketNotePractice: {
      ...note,
      savedAt: new Date().toISOString(),
    },
  };
  saveKbLearningProgress(progress);
  return progress;
};

export const saveKbReflection = (cardId: string, text: string) => {
  const progress = getKbLearningProgress();
  progress[cardId] = {
    ...(progress[cardId] ?? {}),
    reflection: {
      text,
      savedAt: new Date().toISOString(),
    },
  };
  saveKbLearningProgress(progress);
  return progress;
};

export const getKbCardsDueToday = (cards: KbFieldCard[]) => {
  const today = startOfToday();
  return cards.filter((card) => parseISO(card.reviewDueDate) <= today);
};

export const getLowConfidenceCards = (cards: KbFieldCard[]) =>
  [...cards].sort((a, b) => kbConfidenceRank[a.confidence] - kbConfidenceRank[b.confidence]);

export const buildKbFlashcards = (card: KbFieldCard) => [
  {
    question: 'When would I use this KB?',
    answer: card.whenToUse,
  },
  {
    question: 'What should I check first?',
    answer: card.firstChecks.join(' '),
  },
  {
    question: 'What tool/admin portal is involved?',
    answer: card.relatedSkill,
  },
  {
    question: 'What is the riskiest step?',
    answer: card.commonMistake,
  },
  {
    question: 'When should I escalate?',
    answer: card.escalateIf,
  },
  {
    question: 'What would I write in the ticket note?',
    answer: `Summarise the request, environment, first checks, action taken, result, follow-up, escalation point, and next step for ${card.title}.`,
  },
];

export const buildKbScenarioPrompt = (card: KbFieldCard) =>
  `A user or device needs help with ${card.title.toLowerCase()}. What do you check first, what is the safest next step, when would you escalate, and what would you write in the ticket?`;

// Daily Plan persistence
const KB_DAILY_PLAN_KEY = 'avance_kb_daily_plan';

export const saveDailyPlanNote = (note: string): void => {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.setItem(KB_DAILY_PLAN_KEY, note);
  } catch {
    // Ignore localStorage errors
  }
};

export const getDailyPlanNote = (): string => {
  if (!canUseLocalStorage()) return '';
  try {
    return window.localStorage.getItem(KB_DAILY_PLAN_KEY) ?? '';
  } catch {
    return '';
  }
};

export const getKbEvidenceSummary = (
  cards: KbFieldCard[] = mergeKbCardsWithProgress(),
  progress: KbProgressByCardId = getKbLearningProgress()
) => {
  const reviewsCompleted = cards.reduce((total, card) => total + card.reviewHistory.length, 0);
  const scenariosCompleted = Object.values(progress).filter((item) => item.scenarioPractice?.response.trim()).length;
  const ticketNotesPractised = Object.values(progress).filter((item) =>
    item.ticketNotePractice && Object.values(item.ticketNotePractice).some((value) => value.trim())
  ).length;
  const confidenceChanges = Object.values(progress).filter((item) => item.confidence).length;
  const dueCards = getKbCardsDueToday(cards);
  const lowConfidenceCards = getLowConfidenceCards(cards).slice(0, 3);

  return {
    kbsStudied: cards.filter((card) => card.reviewHistory.length > 0 || progress[card.id]?.scenarioPractice || progress[card.id]?.ticketNotePractice).length,
    reviewsCompleted,
    scenariosCompleted,
    ticketNotesPractised,
    confidenceChanges,
    currentGaps: lowConfidenceCards.map((card) => card.title),
    nextGoals: [
      dueCards[0] ? `Review ${dueCards[0].title}` : `Review ${lowConfidenceCards[0]?.title ?? 'one KB field card'}`,
      `Complete one scenario drill for ${lowConfidenceCards[0]?.title ?? 'a low-confidence KB'}`,
      'Write one clean ticket note from a KB scenario',
    ],
  };
};

export const formatKbReviewDate = (dateIso: string) => {
  const date = parseISO(dateIso);
  if (isSameDay(date, startOfToday())) return 'Today';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};
