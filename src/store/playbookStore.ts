import { create } from 'zustand';
import type { Playbook } from '../types';
import { playbooks as samplePlaybooks } from '../data/sampleData';

const PLAYBOOK_STORAGE_KEY = 'avance-playbooks';

function loadPersistedPlaybooks(): Playbook[] {
  if (typeof window === 'undefined') {
    return samplePlaybooks;
  }

  try {
    const raw = window.localStorage.getItem(PLAYBOOK_STORAGE_KEY);
    if (raw === null) {
      return samplePlaybooks;
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Playbook[]) : samplePlaybooks;
  } catch {
    return samplePlaybooks;
  }
}

function savePlaybooks(playbooks: Playbook[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(PLAYBOOK_STORAGE_KEY, JSON.stringify(playbooks));
}

type PlaybookStore = {
  playbooks: Playbook[];
  setPlaybooks: (playbooks: Playbook[]) => void;
  addPlaybook: (playbook: Playbook) => void;
  updatePlaybook: (playbook: Playbook) => void;
  deletePlaybook: (playbookId: string) => void;
};

export const usePlaybookStore = create<PlaybookStore>((set) => ({
  playbooks: loadPersistedPlaybooks(),
  setPlaybooks: (playbooks) => {
    savePlaybooks(playbooks);
    set({ playbooks });
  },
  addPlaybook: (playbook) =>
    set((state) => {
      const nextPlaybooks = [playbook, ...state.playbooks];
      savePlaybooks(nextPlaybooks);
      return { playbooks: nextPlaybooks };
    }),
  updatePlaybook: (updatedPlaybook) =>
    set((state) => {
      const nextPlaybooks = state.playbooks.map((playbook) => (playbook.id === updatedPlaybook.id ? updatedPlaybook : playbook));
      savePlaybooks(nextPlaybooks);
      return { playbooks: nextPlaybooks };
    }),
  deletePlaybook: (playbookId) =>
    set((state) => {
      const nextPlaybooks = state.playbooks.filter((playbook) => playbook.id !== playbookId);
      savePlaybooks(nextPlaybooks);
      return { playbooks: nextPlaybooks };
    })
}));
