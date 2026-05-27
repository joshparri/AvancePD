export type KbFieldCardCategory =
  | 'Identity & Access'
  | 'Endpoint Management'
  | 'Backup & Recovery'
  | 'Email & Collaboration'
  | 'Security & Authentication'
  | 'Networking & Remote Access'
  | 'Printing & Peripherals'
  | 'General Troubleshooting';

export const kbFieldCardCategories = [
  'Identity & Access',
  'Endpoint Management',
  'Backup & Recovery',
  'Email & Collaboration',
  'Security & Authentication',
  'Networking & Remote Access',
  'Printing & Peripherals',
  'General Troubleshooting'
] as const;

export type KbConfidence = 'low' | 'medium' | 'high';

export const kbConfidenceLevels = ['low', 'medium', 'high'] as const;

export type KbFieldCard = {
  id: string;
  title: string;
  category: KbFieldCardCategory;
  whenToUse: string;
  prerequisites: string;
  firstChecks: string[];
  coreSteps: string[];
  commonMistake: string;
  escalateIf: string;
  relatedSkill: string;
  confidence: KbConfidence;
  reviewStage: number;
  createdAt: string;
  updatedAt: string;
  nextReviewAt: string;
  isDemo: boolean;
};

export type KbLearningMetrics = {
  kbCards: number;
  reviewsDue: number;
  scenariosCompleted: number;
  evidenceItems: number;
};

export type KbLearningActivity = 'quiz' | 'recall' | 'practical' | 'ticket-note' | 'reflect';

export interface KbQuizOption {
  id: string;
  text: string;
}

export interface KbQuizQuestion {
  id: string;
  stem: string;
  options: KbQuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface KbQuizAttempt {
  answers: Record<string, string>;
  score: number;
  total: number;
  completedAt: string;
}

export interface KbAssessmentResult {
  score: number;
  tip: string;
  summary: string;
  assessedAt: string;
  source: 'groq' | 'local';
}

export interface KbCardActivityProgress {
  quizAttempt?: KbQuizAttempt;
  textResponses: Partial<Record<KbLearningActivity, string>>;
  assessments: Partial<Record<KbLearningActivity, KbAssessmentResult>>;
  completedActivities: KbLearningActivity[];
  updatedAt: string;
}

export type KbActivityProgressMap = Record<string, KbCardActivityProgress>;
