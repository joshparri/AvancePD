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

export type TicketNoteDrillScore = 'needs work' | 'usable' | 'strong';

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
  relatedKbTopic?: string;
  relatedScenarioId?: string;
  createdAt: string;
  draft: boolean;
  attachments?: SafeAttachment[];
  // Learning seed fields (optional)
  workType?: string; // e.g., "ticket", "client-call", "documentation", "troubleshooting"
  skillArea?: string; // e.g., "Microsoft 365", "Endpoint Management", "Network"
  confidence?: 'low' | 'medium' | 'high'; // Confidence before addressing the issue
  needsReview?: boolean; // Mark for After Action Review
  relatedKbId?: string; // Link to KB card
  reviewDueAt?: string; // When to review this learning
  learningNote?: string; // Free-text reflection on what was learned
  confirmedRiskReview?: boolean; // Confirmed approval or safe capture for risky work
  ticketNoteDrillScore?: TicketNoteDrillScore;
  ticketNoteDrillNote?: string;
  ticketNoteDrillPractisedAt?: string;
};

export type TaskStatus = 'open' | 'in progress' | 'blocked' | 'done';
export type FollowUpStage =
  | 'needs action'
  | 'waiting on client'
  | 'waiting on vendor'
  | 'waiting on teammate'
  | 'blocked'
  | 'monitoring';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  clientId: string;
  workLogId?: string;
  note: string;
  followUpStage?: FollowUpStage;
  nextNudgeDate?: string;
  followUpTemplate?: string;
  lastNudgedAt?: string;
  createdAt: string;
};

export type KnowledgeEntry = {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  noteType?: 'reference' | 'learned today';
  tags: string[];
  confidence: 'low' | 'medium' | 'high';
  lastVerified: string;
  clientId?: string;
  sourceType: 'personal' | 'public' | 'assumption' | 'tested fix';
  trusted: boolean;
  createdAt: string;
  attachments?: SafeAttachment[];
};

export type SafeAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  addedAt: string;
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
  draft?: boolean;
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
  noteType?: 'learning' | 'learned today' | 'shift review';
  confidence: 'low' | 'medium' | 'high';
  notes: string;
  seenInRealWork: boolean;
  askTeam: boolean;
  sourceWorkLogId?: string;
  nextReviewDate: string;
  lastReviewedDate?: string;
  evidenceWorthy?: boolean;
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
