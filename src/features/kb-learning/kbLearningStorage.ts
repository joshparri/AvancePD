import type { LearningItem } from '../../types';
import type { AvanceProgress } from '../../utils/progressStorage';
import { demoKbFieldCards } from './kbSeedCards';
import type {
  KbActivityProgressMap,
  KbCardActivityProgress,
  KbConfidence,
  KbFieldCard,
  KbLearningActivity,
  KbLearningMetrics,
  KbQuizAttempt
} from './kbLearningTypes';

export const kbFieldCardsStorageKey = 'avancepd.kbFieldCards';
export const kbActivityProgressStorageKey = 'avancepd.kbActivityProgress';

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadUserKbCards(): KbFieldCard[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  const raw = window.localStorage.getItem(kbFieldCardsStorageKey);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((card) => !card.isDemo).map(normalizeUserCard);
    }
  } catch {
    // ignore invalid data
  }

  return [];
}

export function saveUserKbCards(cards: KbFieldCard[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(kbFieldCardsStorageKey, JSON.stringify(cards.filter((card) => !card.isDemo).map(normalizeUserCard)));
}

export function loadStoredKbCards(): KbFieldCard[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  const raw = window.localStorage.getItem(kbFieldCardsStorageKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeStoredCard) : [];
  } catch {
    return [];
  }
}

export function saveKbCards(cards: KbFieldCard[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(kbFieldCardsStorageKey, JSON.stringify(cards.map(normalizeStoredCard)));
}

export function createKbFieldCard(data: Omit<KbFieldCard, 'id' | 'createdAt' | 'updatedAt' | 'isDemo'>): KbFieldCard {
  const now = new Date().toISOString();
  return {
    ...data,
    id: createId('kbcard'),
    createdAt: now,
    updatedAt: now,
    isDemo: false
  };
}

export function getAllKbCards(demoCards: KbFieldCard[] = demoKbFieldCards): KbFieldCard[] {
  const storedCards = loadStoredKbCards();
  const storedById = new Map(storedCards.map((card) => [card.id, card]));
  const mergedDemoCards = demoCards.map((card) => ({
    ...card,
    ...storedById.get(card.id),
    isDemo: true
  }));
  const userCards = storedCards.filter((card) => !card.isDemo && !demoCards.some((demoCard) => demoCard.id === card.id));
  return [...mergedDemoCards, ...userCards];
}

export function updateKbCard(card: KbFieldCard): void {
  const cards = loadUserKbCards();
  const index = cards.findIndex((item) => item.id === card.id);
  if (index !== -1) {
    cards[index] = { ...card, updatedAt: new Date().toISOString() };
    saveUserKbCards(cards);
  }
}

export function addUserKbCard(card: Omit<KbFieldCard, 'id' | 'createdAt' | 'updatedAt' | 'isDemo'>): KbFieldCard {
  const newCard = createKbFieldCard(card);
  const cards = loadUserKbCards();
  saveUserKbCards([...cards, newCard]);
  return newCard;
}

export function deleteUserKbCard(cardId: string): void {
  const cards = loadUserKbCards();
  saveUserKbCards(cards.filter((item) => item.id !== cardId));
}

export function scheduleNextKbReview(card: KbFieldCard): KbFieldCard {
  const nextStage = Math.min(card.reviewStage + 1, 5);
  const intervals = [1, 3, 7, 14, 30, 45];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervals[nextStage]);

  return {
    ...card,
    reviewStage: nextStage,
    updatedAt: new Date().toISOString(),
    nextReviewAt: nextDate.toISOString().slice(0, 10)
  };
}

export function advanceKbCardProgress(card: KbFieldCard, scoreHint?: number): KbFieldCard {
  const confidence: KbConfidence = scoreHint === undefined
    ? nextConfidence(card.confidence)
    : scoreHint >= 4
      ? 'high'
      : scoreHint >= 3
        ? 'medium'
        : card.confidence === 'high'
          ? 'medium'
          : card.confidence;

  return {
    ...scheduleNextKbReview(card),
    confidence
  };
}

export function loadKbActivityProgress(): KbActivityProgressMap {
  if (typeof window === 'undefined' || !window.localStorage) return {};

  const raw = window.localStorage.getItem(kbActivityProgressStorageKey);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed as KbActivityProgressMap : {};
  } catch {
    return {};
  }
}

export function saveKbActivityProgress(progress: KbActivityProgressMap): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.setItem(kbActivityProgressStorageKey, JSON.stringify(progress));
}

export function updateKbActivityProgress(
  progress: KbActivityProgressMap,
  cardId: string,
  activity: KbLearningActivity,
  update: Partial<KbCardActivityProgress> & { textResponse?: string; quizAttempt?: KbQuizAttempt }
): KbActivityProgressMap {
  const current = progress[cardId] ?? {
    textResponses: {},
    assessments: {},
    completedActivities: [],
    updatedAt: new Date().toISOString()
  };
  const completedActivities = current.completedActivities.includes(activity)
    ? current.completedActivities
    : [...current.completedActivities, activity];

  return {
    ...progress,
    [cardId]: {
      ...current,
      ...update,
      textResponses: update.textResponse
        ? { ...current.textResponses, [activity]: update.textResponse }
        : current.textResponses,
      quizAttempt: update.quizAttempt ?? current.quizAttempt,
      assessments: update.assessments ?? current.assessments,
      completedActivities,
      updatedAt: new Date().toISOString()
    }
  };
}

export function getKbLearningMetrics(
  cards: KbFieldCard[] = getAllKbCards(),
  progress?: AvanceProgress,
  learningItems: LearningItem[] = []
): KbLearningMetrics {
  const today = todayIso();
  const reviewsDue = cards.filter((card) => card.nextReviewAt.slice(0, 10) <= today).length;
  const scenariosCompleted = progress
    ? Object.values(progress.scenarioProgress).filter((item) => item.status === 'practised' || item.status === 'confident').length
    : 0;
  const evidenceItems = learningItems.filter((item) => item.evidenceWorthy).length + (progress?.ticketNotePracticeCount ?? 0);

  return {
    kbCards: cards.length,
    reviewsDue,
    scenariosCompleted,
    evidenceItems
  };
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeUserCard(card: KbFieldCard): KbFieldCard {
  return {
    ...card,
    id: card.id || createId('kbcard'),
    title: card.title || 'Untitled KB field card',
    firstChecks: Array.isArray(card.firstChecks) ? card.firstChecks : [],
    coreSteps: Array.isArray(card.coreSteps) ? card.coreSteps : [],
    confidence: card.confidence || 'low',
    reviewStage: Number.isFinite(card.reviewStage) ? card.reviewStage : 0,
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    nextReviewAt: card.nextReviewAt || todayIso(),
    isDemo: false
  };
}

function normalizeStoredCard(card: KbFieldCard): KbFieldCard {
  return {
    ...normalizeUserCard(card),
    isDemo: Boolean(card.isDemo)
  };
}

function nextConfidence(confidence: KbConfidence): KbConfidence {
  if (confidence === 'low') return 'medium';
  if (confidence === 'medium') return 'high';
  return 'high';
}
