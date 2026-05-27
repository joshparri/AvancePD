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
