import Dexie, { Table } from 'dexie';
import {
  Shift,
  WorkLog,
  Task,
  PDAchievement,
  PDGoal,
  Client,
  Project,
  AppSettings,
  KnowledgeEntry,
  Playbook,
  LearningItem,
  Invoice,
} from '@/types';

const touchUpdatedAt = (modifications: object) => {
  (modifications as { updatedAt?: Date }).updatedAt = new Date();
};

// Extend Dexie to include our tables
export class AvanceDatabase extends Dexie {
  shifts!: Table<Shift>;
  workLogs!: Table<WorkLog>;
  tasks!: Table<Task>;
  pdAchievements!: Table<PDAchievement>;
  pdGoals!: Table<PDGoal>;
  clients!: Table<Client>;
  projects!: Table<Project>;
  appSettings!: Table<AppSettings>;
  knowledgeEntries!: Table<KnowledgeEntry>;
  playbooks!: Table<Playbook>;
  learningItems!: Table<LearningItem>;
  invoices!: Table<Invoice>;

  constructor() {
    super('AvanceWorkCompanion');

    this.version(1).stores({
      shifts: 'id, date, startTime, endTime, duration, location, createdAt, updatedAt',
      workLogs: 'id, shiftId, date, description, category, duration, *tags, createdAt, updatedAt',
      tasks: 'id, title, status, priority, dueDate, category, *tags, createdAt, updatedAt',
      pdAchievements: 'id, title, category, dateAchieved, createdAt, updatedAt',
      pdGoals: 'id, title, category, targetDate, status, progress, createdAt, updatedAt',
      clients: 'id, name, createdAt, updatedAt',
      projects: 'id, name, clientId, status, startDate, endDate, *tags, createdAt, updatedAt',
      appSettings: 'id, theme, notifications, autoBackup, updatedAt',
      knowledgeEntries: 'id, title, category, *tags, clientId, projectId, *relatedTasks, createdAt, updatedAt',
      playbooks: 'id, title, category, *tags, clientId, createdAt, updatedAt',
      learningItems: 'id, title, category, status, priority, dueDate, createdAt, updatedAt',
      invoices: 'id, clientId, period.start, period.end, status, issuedDate, paidDate, createdAt, updatedAt',
    });

    // Version 2: Add prep checklist to shifts
    this.version(2).stores({
      shifts: 'id, date, startTime, endTime, duration, location, createdAt, updatedAt, prepChecklist',
    });

    // Add hooks for automatic timestamp updates
    this.shifts.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.shifts.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.workLogs.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.workLogs.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.tasks.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.tasks.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.pdAchievements.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.pdAchievements.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.pdGoals.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.pdGoals.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.clients.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.clients.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.projects.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.projects.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.appSettings.hook('creating', (primKey, obj, trans) => {
      obj.updatedAt = new Date();
    });

    this.appSettings.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.knowledgeEntries.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.knowledgeEntries.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.playbooks.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.playbooks.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.learningItems.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.learningItems.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });

    this.invoices.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.invoices.hook('updating', (modifications) => {
      touchUpdatedAt(modifications);
    });
  }
}

// Create and export a singleton instance
export const db = new AvanceDatabase();

// Initialize the database
export const initDatabase = async () => {
  try {
    await db.open();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Utility functions for database operations
export const clearAllData = async () => {
  await db.transaction('rw', [db.shifts, db.workLogs, db.tasks, db.pdAchievements, db.pdGoals, db.clients, db.projects, db.appSettings, db.knowledgeEntries, db.playbooks, db.learningItems, db.invoices], async () => {
    await db.shifts.clear();
    await db.workLogs.clear();
    await db.tasks.clear();
    await db.pdAchievements.clear();
    await db.pdGoals.clear();
    await db.clients.clear();
    await db.projects.clear();
    await db.appSettings.clear();
    await db.knowledgeEntries.clear();
    await db.playbooks.clear();
    await db.learningItems.clear();
    await db.invoices.clear();
  });
};

export const exportData = async () => {
  const data = {
    shifts: await db.shifts.toArray(),
    workLogs: await db.workLogs.toArray(),
    tasks: await db.tasks.toArray(),
    pdAchievements: await db.pdAchievements.toArray(),
    pdGoals: await db.pdGoals.toArray(),
    clients: await db.clients.toArray(),
    projects: await db.projects.toArray(),
    appSettings: await db.appSettings.toArray(),
    knowledgeEntries: await db.knowledgeEntries.toArray(),
    playbooks: await db.playbooks.toArray(),
    learningItems: await db.learningItems.toArray(),
    invoices: await db.invoices.toArray(),
  };
  return data;
};

export const importData = async (data: Awaited<ReturnType<typeof exportData>>) => {
  await db.transaction('rw', [db.shifts, db.workLogs, db.tasks, db.pdAchievements, db.pdGoals, db.clients, db.projects, db.appSettings, db.knowledgeEntries, db.playbooks, db.learningItems, db.invoices], async () => {
    await db.shifts.bulkAdd(data.shifts);
    await db.workLogs.bulkAdd(data.workLogs);
    await db.tasks.bulkAdd(data.tasks);
    await db.pdAchievements.bulkAdd(data.pdAchievements);
    await db.pdGoals.bulkAdd(data.pdGoals);
    await db.clients.bulkAdd(data.clients);
    await db.projects.bulkAdd(data.projects);
    await db.appSettings.bulkAdd(data.appSettings);
    await db.knowledgeEntries.bulkAdd(data.knowledgeEntries);
    await db.playbooks.bulkAdd(data.playbooks);
    await db.learningItems.bulkAdd(data.learningItems);
    await db.invoices.bulkAdd(data.invoices);
  });
};
