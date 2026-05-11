import { z } from 'zod';

// Core schemas
export const prepChecklistItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean(),
  completedAt: z.date().optional(),
  category: z.enum(['preparation', 'equipment', 'knowledge', 'communication']),
});

export const shiftSchema = z.object({
  id: z.string(),
  date: z.date(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  duration: z.number().min(0),
  location: z.string().optional(),
  notes: z.string().optional(),
  prepChecklist: z.array(prepChecklistItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const workLogSchema = z.object({
  id: z.string(),
  shiftId: z.string().optional(),
  date: z.date(),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['support', 'development', 'maintenance', 'consulting', 'training', 'admin', 'other']),
  duration: z.number().min(0),
  tags: z.array(z.string()),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.date().optional(),
  category: z.enum(['technical', 'business', 'personal', 'pd']),
  tags: z.array(z.string()),
  assignedTo: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const pdAchievementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['certification', 'training', 'skill_development', 'networking', 'conference', 'education', 'other']),
  dateAchieved: z.date(),
  evidence: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const pdGoalMilestoneSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  targetDate: z.date(),
  completed: z.boolean(),
  completedDate: z.date().optional(),
});

export const pdGoalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['certification', 'training', 'skill_development', 'networking', 'conference', 'education', 'other']),
  targetDate: z.date(),
  status: z.enum(['active', 'completed', 'cancelled']),
  progress: z.number().min(0).max(100),
  milestones: z.array(pdGoalMilestoneSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  contactInfo: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  clientId: z.string().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  budget: z.number().optional(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const appSettingsSchema = z.object({
  id: z.string(),
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.boolean(),
  autoBackup: z.boolean(),
  defaultWorkCategory: z.enum(['support', 'development', 'maintenance', 'consulting', 'training', 'admin', 'other']),
  workingHours: z.object({
    start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }),
  updatedAt: z.date(),
});

// Form schemas (for creating/updating)
export const createShiftSchema = shiftSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateShiftSchema = shiftSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const createWorkLogSchema = workLogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateWorkLogSchema = workLogSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTaskSchema = taskSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const createPDAchievementSchema = pdAchievementSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePDAchievementSchema = pdAchievementSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const createPDGoalSchema = pdGoalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePDGoalSchema = pdGoalSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const createClientSchema = clientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateClientSchema = clientSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = projectSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const updateAppSettingsSchema = appSettingsSchema.partial().omit({
  id: true,
  updatedAt: true,
});

export const knowledgeEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['troubleshooting', 'configuration', 'procedure', 'client_info', 'system_info', 'other']),
  tags: z.array(z.string()),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  relatedTasks: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const playbookStepSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  order: z.number().min(0),
  estimatedTime: z.number().optional(),
  completed: z.boolean(),
});

export const playbookSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['setup', 'maintenance', 'troubleshooting', 'upgrade', 'security', 'other']),
  steps: z.array(playbookStepSchema),
  tags: z.array(z.string()),
  clientId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const learningItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['technical', 'business', 'soft_skills', 'certification', 'tool', 'other']),
  status: z.enum(['todo', 'in_progress', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  resources: z.array(z.string()),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const invoiceSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  period: z.object({
    start: z.date(),
    end: z.date(),
  }),
  hours: z.number().min(0),
  rate: z.number().min(0),
  total: z.number().min(0),
  status: z.enum(['draft', 'issued', 'paid', 'overdue']),
  issuedDate: z.date().optional(),
  paidDate: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createKnowledgeEntrySchema = knowledgeEntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateKnowledgeEntrySchema = knowledgeEntrySchema.partial().omit({
  id: true,
  createdAt: true,
});

export const createPlaybookSchema = playbookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePlaybookSchema = playbookSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const createLearningItemSchema = learningItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLearningItemSchema = learningItemSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const createInvoiceSchema = invoiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateInvoiceSchema = invoiceSchema.partial().omit({
  id: true,
  createdAt: true,
});

// Type exports
export type Shift = z.infer<typeof shiftSchema>;
export type WorkLog = z.infer<typeof workLogSchema>;
export type Task = z.infer<typeof taskSchema>;
export type PDAchievement = z.infer<typeof pdAchievementSchema>;
export type PDGoal = z.infer<typeof pdGoalSchema>;
export type PDGoalMilestone = z.infer<typeof pdGoalMilestoneSchema>;
export type Client = z.infer<typeof clientSchema>;
export type Project = z.infer<typeof projectSchema>;
export type AppSettings = z.infer<typeof appSettingsSchema>;

export type CreateShift = z.infer<typeof createShiftSchema>;
export type UpdateShift = z.infer<typeof updateShiftSchema>;
export type CreateWorkLog = z.infer<typeof createWorkLogSchema>;
export type UpdateWorkLog = z.infer<typeof updateWorkLogSchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type CreatePDAchievement = z.infer<typeof createPDAchievementSchema>;
export type UpdatePDAchievement = z.infer<typeof updatePDAchievementSchema>;
export type CreatePDGoal = z.infer<typeof createPDGoalSchema>;
export type UpdatePDGoal = z.infer<typeof updatePDGoalSchema>;
export type CreateClient = z.infer<typeof createClientSchema>;
export type UpdateClient = z.infer<typeof updateClientSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type UpdateAppSettings = z.infer<typeof updateAppSettingsSchema>;

export type KnowledgeEntry = z.infer<typeof knowledgeEntrySchema>;
export type Playbook = z.infer<typeof playbookSchema>;
export type PlaybookStep = z.infer<typeof playbookStepSchema>;
export type LearningItem = z.infer<typeof learningItemSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;

export type CreateKnowledgeEntry = z.infer<typeof createKnowledgeEntrySchema>;
export type UpdateKnowledgeEntry = z.infer<typeof updateKnowledgeEntrySchema>;
export type CreatePlaybook = z.infer<typeof createPlaybookSchema>;
export type UpdatePlaybook = z.infer<typeof updatePlaybookSchema>;
export type CreateLearningItem = z.infer<typeof createLearningItemSchema>;
export type UpdateLearningItem = z.infer<typeof updateLearningItemSchema>;
export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;
