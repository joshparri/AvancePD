// Core data types for the Avance Work Companion App

export interface PrepChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: Date;
  category: 'preparation' | 'equipment' | 'knowledge' | 'communication';
}

export interface Shift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  location?: string;
  notes?: string;
  prepChecklist: PrepChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkLog {
  id: string;
  shiftId?: string;
  date: Date;
  description: string;
  category: WorkCategory;
  duration: number; // in minutes
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  category: TaskCategory;
  tags: string[];
  assignedTo?: string; // for future team features
  createdAt: Date;
  updatedAt: Date;
}

export interface PDAchievement {
  id: string;
  title: string;
  description: string;
  category: PDCategory;
  dateAchieved: Date;
  evidence?: string; // URL or file path
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PDGoal {
  id: string;
  title: string;
  description: string;
  category: PDCategory;
  targetDate: Date;
  status: PDGoalStatus;
  progress: number; // 0-100
  milestones: PDGoalMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PDGoalMilestone {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  completed: boolean;
  completedDate?: Date;
}

export interface Client {
  id: string;
  name: string;
  contactInfo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum WorkCategory {
  SUPPORT = 'support',
  DEVELOPMENT = 'development',
  MAINTENANCE = 'maintenance',
  CONSULTING = 'consulting',
  TRAINING = 'training',
  ADMIN = 'admin',
  OTHER = 'other'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskCategory {
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  PERSONAL = 'personal',
  PD = 'pd'
}

export enum PDCategory {
  CERTIFICATION = 'certification',
  TRAINING = 'training',
  SKILL_DEVELOPMENT = 'skill_development',
  NETWORKING = 'networking',
  CONFERENCE = 'conference',
  EDUCATION = 'education',
  OTHER = 'other'
}

export enum PDGoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Additional enums
export enum KnowledgeCategory {
  TROUBLESHOOTING = 'troubleshooting',
  CONFIGURATION = 'configuration',
  PROCEDURE = 'procedure',
  CLIENT_INFO = 'client_info',
  SYSTEM_INFO = 'system_info',
  OTHER = 'other'
}

export enum PlaybookCategory {
  SETUP = 'setup',
  MAINTENANCE = 'maintenance',
  TROUBLESHOOTING = 'troubleshooting',
  UPGRADE = 'upgrade',
  SECURITY = 'security',
  OTHER = 'other'
}

export enum LearningCategory {
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  SOFT_SKILLS = 'soft_skills',
  CERTIFICATION = 'certification',
  TOOL = 'tool',
  OTHER = 'other'
}

export enum LearningStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum LearningPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

// Settings and preferences
export interface AppSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoBackup: boolean;
  defaultWorkCategory: WorkCategory;
  workingHours: {
    start: string;
    end: string;
  };
  updatedAt: Date;
}

// Search and filter types
export interface SearchFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  tags?: string[];
  status?: string[];
  priority?: string[];
}

// Analytics types
export interface WorkSummary {
  totalHours: number;
  totalShifts: number;
  averageShiftLength: number;
  categoryBreakdown: Record<WorkCategory, number>;
  monthlyHours: Record<string, number>; // YYYY-MM -> hours
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  clientId?: string;
  projectId?: string;
  relatedTasks: string[]; // task IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Playbook {
  id: string;
  title: string;
  description: string;
  category: PlaybookCategory;
  steps: PlaybookStep[];
  tags: string[];
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime?: number; // in minutes
  completed: boolean;
}

export interface LearningItem {
  id: string;
  title: string;
  description: string;
  category: LearningCategory;
  status: LearningStatus;
  priority: LearningPriority;
  dueDate?: Date;
  resources: string[]; // URLs or file paths
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  clientId: string;
  period: {
    start: Date;
    end: Date;
  };
  hours: number;
  rate: number;
  total: number;
  status: InvoiceStatus;
  issuedDate?: Date;
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}