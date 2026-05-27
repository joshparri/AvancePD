import type { LearningItem } from '../../types';
import type { AvanceProgress } from '../../utils/progressStorage';
import { demoKbFieldCards } from './kbSeedCards';
import type { KbFieldCard, KbLearningMetrics } from './kbLearningTypes';

export const kbFieldCardsStorageKey = 'avancepd.kbFieldCards';

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
  const userCards = loadUserKbCards();
  return [...demoCards, ...userCards];
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
