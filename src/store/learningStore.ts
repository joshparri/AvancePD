import { create } from 'zustand';
import type { LearningItem } from '../types';
import { learningItems as sampleLearningItems } from '../data/sampleData';

const LEARNING_STORAGE_KEY = 'avance-learningItems';

function loadPersistedLearningItems(): LearningItem[] {
  if (typeof window === 'undefined') {
    return sampleLearningItems;
  }

  try {
    const raw = window.localStorage.getItem(LEARNING_STORAGE_KEY);
    if (raw === null) {
      return sampleLearningItems;
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as LearningItem[]) : sampleLearningItems;
  } catch {
    return sampleLearningItems;
  }
}

function saveLearningItems(learningItems: LearningItem[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(learningItems));
}

type LearningStore = {
  learningItems: LearningItem[];
  setLearningItems: (learningItems: LearningItem[]) => void;
  addLearningItem: (item: LearningItem) => void;
  updateLearningItem: (item: LearningItem) => void;
  deleteLearningItem: (itemId: string) => void;
};

export const useLearningStore = create<LearningStore>((set) => ({
  learningItems: loadPersistedLearningItems(),
  setLearningItems: (learningItems) => {
    saveLearningItems(learningItems);
    set({ learningItems });
  },
  addLearningItem: (item) =>
    set((state) => {
      const nextLearningItems = [item, ...state.learningItems];
      saveLearningItems(nextLearningItems);
      return { learningItems: nextLearningItems };
    }),
  updateLearningItem: (updatedItem) =>
    set((state) => {
      const nextLearningItems = state.learningItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      saveLearningItems(nextLearningItems);
      return { learningItems: nextLearningItems };
    }),
  deleteLearningItem: (itemId) =>
    set((state) => {
      const nextLearningItems = state.learningItems.filter((item) => item.id !== itemId);
      saveLearningItems(nextLearningItems);
      return { learningItems: nextLearningItems };
    })
}));
