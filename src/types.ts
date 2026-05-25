export type Client = {
  id: string;
  name: string;
  sector: string;
  notes: string;
  quirks: string[];
  environmentSummary?: string;
};

export type ShiftStatus = 'scheduled' | 'in-progress' | 'completed' | 'missed';

export type Shift = {
  id: string;
  clientId: string;
  dayOfWeek: 'Monday' | 'Wednesday' | 'Other';
  startTime: string;
  endTime: string;
  recurring: boolean;
  status: ShiftStatus;
  priorities: string[];
  prepChecklist: string[];
  handoverNotes: string;
  billed: boolean;
  paid: boolean;
};

export type WorkLog = {
  id: string;
  shiftId?: string;
  clientId: string;
  title: string;
  summary: string;
  actions: string;
  result: string;
  nextStep: string;
  tags: string[];
  createdAt: string;
  draft: boolean;
};

export type TaskStatus = 'open' | 'in progress' | 'blocked' | 'done';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  clientId: string;
  workLogId?: string;
  note: string;
  createdAt: string;
};

export type KnowledgeEntry = {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  tags: string[];
  confidence: 'low' | 'medium' | 'high';
  lastVerified: string;
  clientId?: string;
  sourceType: 'personal' | 'public' | 'assumption' | 'tested fix';
  trusted: boolean;
  createdAt: string;
};

export type Playbook = {
  id: string;
  title: string;
  symptoms: string[];
  firstChecks: string[];
  deeperChecks: string[];
  escalation: string;
  notes: string;
  relatedKnowledgeIds: string[];
};

export type TimeEntry = {
  id: string;
  date: string;
  shiftId?: string;
  taskId?: string;
  hours: number;
  billable: boolean;
  description: string;
};

export type LearningItem = {
  id: string;
  topic: string;
  confidence: 'low' | 'medium' | 'high';
  notes: string;
  seenInRealWork: boolean;
  askTeam: boolean;
  nextReviewDate: string;
};

// Health & Outdoors types
export type HealthReminderType =
  | 'pre-shift'
  | 'eye-break'
  | 'outdoor-reset'
  | 'posture'
  | 'lunch'
  | 'walk'
  | 'stretch'
  | 'shutdown';

export type HealthBreakStatus = 'completed' | 'skipped' | 'snoozed' | 'due';

export type HealthBreak = {
  id: string;
  type: HealthReminderType;
  scheduledTime: string; // HH:mm
  title: string;
  description: string;
  completedAt?: string;
  skippedAt?: string;
  snoozedUntil?: string;
  status: HealthBreakStatus;
};

export type HealthSettings = {
  shiftDays: ('Monday' | 'Wednesday' | 'Tuesday' | 'Thursday' | 'Friday')[];
  shiftStartTime: string; // HH:mm
  shiftEndTime: string; // HH:mm
  notificationsEnabled: boolean;
  notificationPermissionStatus: 'default' | 'granted' | 'denied';
  quietModeUntil?: string; // ISO timestamp
  reminderCadence: 'full' | 'quiet' | 'minimal';
  includesFaithPrompt: boolean;
  enableEmailSetup: boolean;
  mondayWednesdayOnly: boolean;
  reminderSound: boolean;
};

export type HealthWeeklyReview = {
  weekStartDate: string; // YYYY-MM-DD
  waterCheckIns: number;
  outdoorMinutes: number;
  movementBreaks: number;
  eyeBreaks: number;
  lunchAwayFromScreen: number;
  endOfDayShutdowns: number;
  urgentTicketModeTriggers: number;
  totalRemindersCompleted: number;
  totalRemindersSkipped: number;
  reflectionNotes: string;
};

export type HealthResearchCard = {
  id: string;
  title: string;
  summary: string;
  action: string;
  sourceLabel: string;
  sourceUrl?: string;
  confidenceLevel: 'strong' | 'moderate' | 'emerging';
  category: 'outdoors' | 'hydration' | 'eyes' | 'movement' | 'stress' | 'sleep';
};

export type ReadinessStatus = 'unseen' | 'learning' | 'practised' | 'work-ready' | 'evidence-proven';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type MspSkill = {
  id: string;
  title: string;
  category: string;
  level: SkillLevel;
  readiness: ReadinessStatus;
  description: string;
  practicalExamples: string[];
  relatedTools: string[];
  evidenceExamples: string[];
  suggestedPractice: string[];
};

export type ScenarioDifficulty = 'easy' | 'medium' | 'hard';
export type MspScenario = {
  id: string;
  title: string;
  category: string;
  difficulty: ScenarioDifficulty;
  ticketText: string;
  userEmotion: string;
  hiddenCause: string;
  goodFirstQuestions: string[];
  expectedChecks: string[];
  unsafeActions: string[];
  escalationTriggers: string[];
  idealTicketNotes: string;
  learningPoints: string[];
  relatedSkillIds: string[];
};

export type CommunicationScenario = {
  id: string;
  title: string;
  context: string;
  poorResponse: string;
  betterResponse: string;
  excellentResponse: string;
  whyItWorks: string;
  relatedMspSkills: string[];
};
