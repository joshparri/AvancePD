import { create } from 'zustand';
import type { WorkLog } from '../types';
import { workLogs as sampleWorkLogs } from '../data/sampleData';

const WORKLOG_STORAGE_KEY = 'avance-workLogs';

function loadPersistedWorkLogs(): WorkLog[] {
  if (typeof window === 'undefined') {
    return sampleWorkLogs;
  }

  try {
    const raw = window.localStorage.getItem(WORKLOG_STORAGE_KEY);
    if (raw === null) {
      return sampleWorkLogs;
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as WorkLog[]) : sampleWorkLogs;
  } catch {
    return sampleWorkLogs;
  }
}

function saveWorkLogs(workLogs: WorkLog[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(WORKLOG_STORAGE_KEY, JSON.stringify(workLogs));
}

type WorkLogStore = {
  workLogs: WorkLog[];
  setWorkLogs: (workLogs: WorkLog[]) => void;
  addWorkLog: (log: WorkLog) => void;
  updateWorkLog: (log: WorkLog) => void;
  deleteWorkLog: (logId: string) => void;
};

export const useWorkLogStore = create<WorkLogStore>((set) => ({
  workLogs: loadPersistedWorkLogs(),
  setWorkLogs: (workLogs) => {
    saveWorkLogs(workLogs);
    set({ workLogs });
  },
  addWorkLog: (log) =>
    set((state) => {
      const nextWorkLogs = [log, ...state.workLogs];
      saveWorkLogs(nextWorkLogs);
      return { workLogs: nextWorkLogs };
    }),
  updateWorkLog: (updatedLog) =>
    set((state) => {
      const nextWorkLogs = state.workLogs.map((log) => (log.id === updatedLog.id ? updatedLog : log));
      saveWorkLogs(nextWorkLogs);
      return { workLogs: nextWorkLogs };
    }),
  deleteWorkLog: (logId) =>
    set((state) => {
      const nextWorkLogs = state.workLogs.filter((log) => log.id !== logId);
      saveWorkLogs(nextWorkLogs);
      return { workLogs: nextWorkLogs };
    })
}));
