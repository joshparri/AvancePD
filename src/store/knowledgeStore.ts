import { create } from 'zustand';
import type { KnowledgeEntry } from '../types';
import { knowledgeEntries as sampleKnowledgeEntries } from '../data/sampleData';

const KNOWLEDGE_STORAGE_KEY = 'avance-knowledgeEntries';

function loadPersistedKnowledgeEntries(): KnowledgeEntry[] {
  if (typeof window === 'undefined') {
    return sampleKnowledgeEntries;
  }

  try {
    const raw = window.localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
    if (raw === null) {
      return sampleKnowledgeEntries;
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as KnowledgeEntry[]) : sampleKnowledgeEntries;
  } catch {
    return sampleKnowledgeEntries;
  }
}

function saveKnowledgeEntries(entries: KnowledgeEntry[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(entries));
}

type KnowledgeStore = {
  knowledgeEntries: KnowledgeEntry[];
  setKnowledgeEntries: (entries: KnowledgeEntry[]) => void;
  addKnowledgeEntry: (entry: KnowledgeEntry) => void;
  updateKnowledgeEntry: (entry: KnowledgeEntry) => void;
  deleteKnowledgeEntry: (entryId: string) => void;
};

export const useKnowledgeStore = create<KnowledgeStore>((set) => ({
  knowledgeEntries: loadPersistedKnowledgeEntries(),
  setKnowledgeEntries: (entries) => {
    saveKnowledgeEntries(entries);
    set({ knowledgeEntries: entries });
  },
  addKnowledgeEntry: (entry) =>
    set((state) => {
      const nextEntries = [entry, ...state.knowledgeEntries];
      saveKnowledgeEntries(nextEntries);
      return { knowledgeEntries: nextEntries };
    }),
  updateKnowledgeEntry: (updatedEntry) =>
    set((state) => {
      const nextEntries = state.knowledgeEntries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry));
      saveKnowledgeEntries(nextEntries);
      return { knowledgeEntries: nextEntries };
    }),
  deleteKnowledgeEntry: (entryId) =>
    set((state) => {
      const nextEntries = state.knowledgeEntries.filter((entry) => entry.id !== entryId);
      saveKnowledgeEntries(nextEntries);
      return { knowledgeEntries: nextEntries };
    })
}));
