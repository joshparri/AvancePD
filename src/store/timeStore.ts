import { create } from 'zustand';
import type { TimeEntry } from '../types';
import { timeEntries as sampleTimeEntries } from '../data/sampleData';

const TIME_ENTRY_STORAGE_KEY = 'avance-timeEntries';

function loadPersistedTimeEntries(): TimeEntry[] {
  if (typeof window === 'undefined') {
    return sampleTimeEntries;
  }

  try {
    const raw = window.localStorage.getItem(TIME_ENTRY_STORAGE_KEY);
    if (raw === null) {
      return sampleTimeEntries;
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as TimeEntry[]) : sampleTimeEntries;
  } catch {
    return sampleTimeEntries;
  }
}

function saveTimeEntries(timeEntries: TimeEntry[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(TIME_ENTRY_STORAGE_KEY, JSON.stringify(timeEntries));
}

type TimeStore = {
  timeEntries: TimeEntry[];
  setTimeEntries: (timeEntries: TimeEntry[]) => void;
  addTimeEntry: (entry: TimeEntry) => void;
  updateTimeEntry: (entry: TimeEntry) => void;
  deleteTimeEntry: (entryId: string) => void;
};

export const useTimeStore = create<TimeStore>((set) => ({
  timeEntries: loadPersistedTimeEntries(),
  setTimeEntries: (timeEntries) => {
    saveTimeEntries(timeEntries);
    set({ timeEntries });
  },
  addTimeEntry: (entry) =>
    set((state) => {
      const nextTimeEntries = [entry, ...state.timeEntries];
      saveTimeEntries(nextTimeEntries);
      return { timeEntries: nextTimeEntries };
    }),
  updateTimeEntry: (updatedEntry) =>
    set((state) => {
      const nextTimeEntries = state.timeEntries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry));
      saveTimeEntries(nextTimeEntries);
      return { timeEntries: nextTimeEntries };
    }),
  deleteTimeEntry: (entryId) =>
    set((state) => {
      const nextTimeEntries = state.timeEntries.filter((entry) => entry.id !== entryId);
      saveTimeEntries(nextTimeEntries);
      return { timeEntries: nextTimeEntries };
    })
}));
