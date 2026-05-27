import type { KbFieldCard, KbConfidence } from './kbLearningTypes';

const STORAGE_KEY = 'avancepd.kbFieldCards';

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

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
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

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
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

export function getAllKbCards(demoCards: KbFieldCard[] = []): KbFieldCard[] {
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
