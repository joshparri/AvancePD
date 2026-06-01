import { create } from 'zustand';
import type { Task } from '../types';
import { tasks as sampleTasks } from '../data/sampleData';

const TASK_STORAGE_KEY = 'avance-tasks';

function loadPersistedTasks(): Task[] {
  if (typeof window === 'undefined') {
    return sampleTasks;
  }

  try {
    const raw = window.localStorage.getItem(TASK_STORAGE_KEY);
    if (raw === null) {
      return sampleTasks;
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Task[]) : sampleTasks;
  } catch {
    return sampleTasks;
  }
}

function saveTasks(tasks: Task[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}

type TaskStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: loadPersistedTasks(),
  setTasks: (tasks) => {
    saveTasks(tasks);
    set({ tasks });
  },
  addTask: (task) =>
    set((state) => {
      const nextTasks = [task, ...state.tasks];
      saveTasks(nextTasks);
      return { tasks: nextTasks };
    }),
  updateTask: (updatedTask) =>
    set((state) => {
      const nextTasks = state.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      saveTasks(nextTasks);
      return { tasks: nextTasks };
    }),
  deleteTask: (taskId) =>
    set((state) => {
      const nextTasks = state.tasks.filter((task) => task.id !== taskId);
      saveTasks(nextTasks);
      return { tasks: nextTasks };
    })
}));
