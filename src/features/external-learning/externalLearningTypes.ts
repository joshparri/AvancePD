export type ExternalLearningProvider =
  | 'Microsoft Learn'
  | 'Google Workspace'
  | 'Cisco Networking Academy'
  | 'Harvard CS50'
  | 'MIT OpenCourseWare'
  | 'freeCodeCamp'
  | 'Codecademy'
  | 'W3Schools'
  | 'The Odin Project'
  | 'OpenLearn'
  | 'Open Culture'
  | 'Coursera'
  | 'edX';

export type ExternalLearningCostLabel =
  | 'free'
  | 'free audit'
  | 'free with paid certificate option'
  | 'reference';

export type ExternalLearningLevel = 'beginner' | 'intermediate' | 'advanced';
export type ExternalLearningFormat = 'course' | 'module' | 'reference' | 'project path' | 'documentation' | 'curated library';

export type ExternalLearningResource = {
  id: string;
  title: string;
  provider: ExternalLearningProvider;
  url: string;
  costLabel: ExternalLearningCostLabel;
  level: ExternalLearningLevel;
  format: ExternalLearningFormat;
  estimatedTime: string;
  skillAreas: string[];
  relatedKbKeywords: string[];
  bestUse: string;
  whyItHelps: string;
  cautionNote?: string;
};

export type ExternalLearningMatchInput = {
  skillArea?: string;
  kbTitle?: string;
  kbCategory?: string;
  relatedSkill?: string;
  searchText?: string;
};

export type ExternalLearningProgress = {
  savedExternalResourceIds: string[];
  startedExternalResourceIds: string[];
  completedExternalResourceIds: string[];
};
