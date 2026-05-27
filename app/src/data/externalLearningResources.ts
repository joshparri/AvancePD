export type ExternalResourceCostModel =
  | 'free'
  | 'free-audit'
  | 'free-preview'
  | 'free-with-paid-certificate'
  | 'unknown';

export type ExternalLearningResource = {
  id: string;
  title: string;
  provider: string;
  url: string;
  costModel: ExternalResourceCostModel;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  domains: string[];
  skills: string[];
  relevantTo: string[];
  bestUsedWhen: string;
  whyItHelps: string;
  certificateNote?: string;
  caution?: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const includesAny = (haystack: string, needles: string[]) =>
  needles.some((needle) => haystack.includes(needle));

export const externalLearningResources: ExternalLearningResource[] = [
  {
    id: 'ms-learn-ms102',
    title: 'Course MS-102T00: Microsoft 365 Administrator',
    provider: 'Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/training/courses/ms-102t00',
    costModel: 'free',
    level: 'intermediate',
    estimatedTime: '40+ hours',
    domains: ['microsoft 365 admin', 'tenant management', 'identity', 'security', 'compliance'],
    skills: ['m365 admin', 'licensing', 'groups', 'roles', 'tenant operations'],
    relevantTo: ['m365 admin', 'user accounts', 'licensing', 'shared mailbox', 'outlook'],
    bestUsedWhen: 'You keep touching Microsoft 365 admin tasks and need structured depth.',
    whyItHelps: 'Builds repeatable admin judgement across users, licensing, and service operations.',
    certificateNote: 'Training content is free; certification exams are separate paid items.',
  },
  {
    id: 'ms-learn-entra-training',
    title: 'Microsoft Entra Training',
    provider: 'Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/training/entra/',
    costModel: 'free',
    level: 'beginner',
    domains: ['identity', 'access', 'mfa', 'entra', 'conditional access'],
    skills: ['mfa troubleshooting', 'identity lifecycle', 'access control'],
    relevantTo: ['mfa', 'identity troubleshooting', 'account access', 'security'],
    bestUsedWhen: 'Sign-in and MFA issues are becoming common in daily tickets.',
    whyItHelps: 'Strengthens first-check patterns for user, group, and authentication issues.',
  },
  {
    id: 'ms-learn-intune-fundamentals',
    title: 'Microsoft Intune Fundamentals Learning Path',
    provider: 'Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/training/paths/endpoint-manager-fundamentals/',
    costModel: 'free',
    level: 'beginner',
    domains: ['intune', 'endpoint management', 'device management'],
    skills: ['intune enrolment', 'device compliance', 'app management'],
    relevantTo: ['intune enrolment', 'device compliance', 'policy troubleshooting'],
    bestUsedWhen: 'You are handling endpoint enrolment and compliance blockers.',
    whyItHelps: 'Connects policy intent to practical endpoint troubleshooting decisions.',
  },
  {
    id: 'ms-learn-defender-training',
    title: 'Microsoft Defender Training',
    provider: 'Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/training/defender/',
    costModel: 'free',
    level: 'intermediate',
    domains: ['security', 'defender', 'phishing', 'endpoint protection'],
    skills: ['security triage', 'threat response', 'defender signals'],
    relevantTo: ['suspicious email', 'malware', 'endpoint security', 'security alerts'],
    bestUsedWhen: 'Security tickets start needing better evidence and safer first response.',
    whyItHelps: 'Improves your ability to triage threats without overreacting or missing risk.',
  },
  {
    id: 'ms-learn-md102',
    title: 'Course MD-102T00: Microsoft 365 Endpoint Administrator',
    provider: 'Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/training/courses/md-102t00',
    costModel: 'free',
    level: 'advanced',
    estimatedTime: '40+ hours',
    domains: ['endpoint admin', 'intune', 'windows', 'compliance', 'app deployment'],
    skills: ['endpoint lifecycle', 'compliance policy', 'deployment'],
    relevantTo: ['intune enrolment', 'windows support', 'endpoint management'],
    bestUsedWhen: 'You want deeper endpoint admin capability beyond basic Intune checks.',
    whyItHelps: 'Provides structured endpoint operations and support escalation context.',
    certificateNote: 'Training content is free; formal certification requires a paid exam.',
  },
  {
    id: 'cisco-networking-basics',
    title: 'Networking Basics',
    provider: 'Cisco Networking Academy',
    url: 'https://www.netacad.com/courses/networking-basics',
    costModel: 'free',
    level: 'beginner',
    domains: ['networking', 'troubleshooting', 'fundamentals'],
    skills: ['dns', 'dhcp', 'lan wan', 'connectivity testing'],
    relevantTo: ['internet down', 'wi-fi issues', 'lan wan basics', 'connectivity checks'],
    bestUsedWhen: 'Network tickets feel messy and hard to scope quickly.',
    whyItHelps: 'Builds layered troubleshooting so you isolate fault domains faster.',
  },
  {
    id: 'cisco-intro-cybersecurity',
    title: 'Introduction to Cybersecurity',
    provider: 'Cisco Networking Academy',
    url: 'https://www.netacad.com/courses/introduction-to-cybersecurity',
    costModel: 'free',
    level: 'beginner',
    domains: ['cybersecurity', 'threat awareness', 'security basics'],
    skills: ['phishing awareness', 'security hygiene', 'user coaching'],
    relevantTo: ['phishing', 'mfa', 'suspicious email', 'safe user explanations'],
    bestUsedWhen: 'You need stronger baseline security language for user-facing support.',
    whyItHelps: 'Improves risk communication and practical first-response judgement.',
  },
  {
    id: 'google-skillshop',
    title: 'Google Skillshop',
    provider: 'Google',
    url: 'https://skillshop.withgoogle.com/',
    costModel: 'free',
    level: 'beginner',
    domains: ['google tools', 'workplace tools', 'productivity'],
    skills: ['google workspace basics', 'gmail admin awareness'],
    relevantTo: ['google workspace', 'gmail', 'drive', 'user support'],
    bestUsedWhen: 'You need official Google learning for common Workspace support tasks.',
    whyItHelps: 'Gives platform-authored modules for workflows you support directly.',
  },
  {
    id: 'google-workspace-training',
    title: 'Google Workspace Training',
    provider: 'Google Cloud Skills',
    url: 'https://cloud.google.com/learn/training/workspace',
    costModel: 'free',
    level: 'intermediate',
    domains: ['google workspace', 'gmail', 'calendar', 'drive', 'meet'],
    skills: ['workspace administration', 'support workflows'],
    relevantTo: ['google workspace support', 'google admin', 'user onboarding'],
    bestUsedWhen: 'You are supporting business users in Google Workspace environments.',
    whyItHelps: 'Helps translate day-to-day user requests into safer admin actions.',
  },
  {
    id: 'khan-computing',
    title: 'Khan Academy Computing',
    provider: 'Khan Academy',
    url: 'https://www.khanacademy.org/computing',
    costModel: 'free',
    level: 'beginner',
    domains: ['computing', 'programming', 'internet basics'],
    skills: ['foundations', 'algorithms', 'web basics'],
    relevantTo: ['general tech foundations', 'coding confidence', 'internet basics'],
    bestUsedWhen: 'You want low-friction computing fundamentals with short lessons.',
    whyItHelps: 'Builds confidence for technical reasoning before deeper MSP topics.',
  },
  {
    id: 'harvard-cs50x',
    title: 'Harvard CS50x',
    provider: 'Harvard University',
    url: 'https://cs50.harvard.edu/x/2026/',
    costModel: 'free-with-paid-certificate',
    level: 'intermediate',
    estimatedTime: '12+ weeks',
    domains: ['computer science', 'programming', 'algorithms', 'security', 'web'],
    skills: ['structured coding foundations', 'problem solving'],
    relevantTo: ['long-term growth', 'coding', 'app building'],
    bestUsedWhen: 'You are ready for a rigorous and structured coding foundation.',
    whyItHelps: 'Develops deeper engineering thinking that transfers to automation and tooling.',
    certificateNote: 'Course content is free; verified certificates are typically paid.',
  },
  {
    id: 'mit-ocw-python-intro',
    title: 'MIT OCW 6.0001: Introduction to CS and Programming in Python',
    provider: 'MIT OpenCourseWare',
    url: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/',
    costModel: 'free',
    level: 'intermediate',
    domains: ['computer science', 'python', 'problem solving'],
    skills: ['scripting', 'automation', 'python fundamentals'],
    relevantTo: ['automation', 'python fundamentals', 'technical depth'],
    bestUsedWhen: 'You want stronger Python thinking for scripting and automation.',
    whyItHelps: 'Builds durable programming habits useful for MSP operations tooling.',
  },
  {
    id: 'mit-ocw-catalog',
    title: 'MIT OpenCourseWare Catalog',
    provider: 'MIT OpenCourseWare',
    url: 'https://ocw.mit.edu/',
    costModel: 'free',
    level: 'advanced',
    domains: ['university-level computing', 'engineering', 'systems'],
    skills: ['deeper technical study', 'systems thinking'],
    relevantTo: ['deeper study', 'long-term technical foundations'],
    bestUsedWhen: 'You want to branch into deeper technical domains over time.',
    whyItHelps: 'Offers broad, official MIT materials without paywalls.',
  },
  {
    id: 'freecodecamp-home',
    title: 'freeCodeCamp',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/',
    costModel: 'free',
    level: 'beginner',
    domains: ['coding', 'web development', 'data', 'projects'],
    skills: ['javascript', 'react', 'portfolio projects'],
    relevantTo: ['app building', 'react foundations', 'web development'],
    bestUsedWhen: 'You want practical coding reps with projects and guided tracks.',
    whyItHelps: 'Turns concepts into buildable outputs you can show as evidence.',
  },
  {
    id: 'freecodecamp-data-python',
    title: 'freeCodeCamp Data Analysis with Python',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
    costModel: 'free',
    level: 'intermediate',
    domains: ['python', 'data analysis', 'automation'],
    skills: ['reporting scripts', 'data handling', 'analysis'],
    relevantTo: ['reports', 'scripts', 'operational reporting'],
    bestUsedWhen: 'You want to automate spreadsheet/reporting workflows with Python.',
    whyItHelps: 'Builds practical data and automation skills for MSP evidence workflows.',
  },
  {
    id: 'w3schools',
    title: 'W3Schools',
    provider: 'W3Schools',
    url: 'https://www.w3schools.com/',
    costModel: 'free',
    level: 'beginner',
    domains: ['html', 'css', 'javascript', 'sql', 'quick reference'],
    skills: ['syntax lookup', 'web edits', 'sql basics'],
    relevantTo: ['quick syntax lookup', 'app edits', 'web basics'],
    bestUsedWhen: 'You need a fast reminder while actively building or debugging.',
    whyItHelps: 'Provides quick examples that shorten context-switch time.',
  },
  {
    id: 'codecademy',
    title: 'Codecademy',
    provider: 'Codecademy',
    url: 'https://www.codecademy.com/',
    costModel: 'free-preview',
    level: 'beginner',
    domains: ['coding basics', 'interactive programming'],
    skills: ['python drills', 'html css js practice'],
    relevantTo: ['beginner coding drills', 'python', 'html', 'css', 'javascript'],
    bestUsedWhen: 'You want interactive beginner drills before doing larger projects.',
    whyItHelps: 'Structured exercises can improve confidence quickly for new coders.',
    caution: 'Free tier and lesson access vary by course.',
  },
  {
    id: 'edx-free-courses',
    title: 'edX Free Online Courses',
    provider: 'edX',
    url: 'https://www.edx.org/free-online-courses',
    costModel: 'free-audit',
    level: 'intermediate',
    domains: ['university-level courses'],
    skills: ['structured study', 'domain depth'],
    relevantTo: ['broader structured learning', 'university-level topics'],
    bestUsedWhen: 'You want structured academic content in a broad topic area.',
    whyItHelps: 'Lets you access quality course content without immediate payment.',
    certificateNote: 'Audit access usually excludes verified certificates.',
    caution: 'Audit access and content windows can vary by course and partner.',
  },
  {
    id: 'harvard-free-courses',
    title: 'Harvard Free Course Catalog',
    provider: 'Harvard University',
    url: 'https://pll.harvard.edu/catalog/free',
    costModel: 'free',
    level: 'intermediate',
    domains: ['free university courses', 'computer science', 'data', 'humanities'],
    skills: ['structured learning', 'academic foundations'],
    relevantTo: ['cs50', 'databases', 'general academic growth'],
    bestUsedWhen: 'You want trusted university options across technical and non-technical topics.',
    whyItHelps: 'Provides curated Harvard options without paywalled entry for many courses.',
  },
  {
    id: 'openlearn-full-catalog',
    title: 'OpenLearn Free Courses Full Catalogue',
    provider: 'Open University',
    url: 'https://www.open.edu/openlearn/free-courses/full-catalogue',
    costModel: 'free-with-paid-certificate',
    level: 'beginner',
    domains: ['digital skills', 'workplace skills', 'general learning'],
    skills: ['digital confidence', 'study habits', 'workplace learning'],
    relevantTo: ['digital confidence', 'study habits', 'workplace learning'],
    bestUsedWhen: 'You want shorter guided courses with practical workplace outcomes.',
    whyItHelps: 'Good pacing for consistent learning habits and confidence building.',
    certificateNote: 'Many courses are free; badges/statements availability varies.',
  },
  {
    id: 'openlearn-digital',
    title: 'OpenLearn Digital & Computing',
    provider: 'Open University',
    url: 'https://www.open.edu/openlearn/digital/free-courses',
    costModel: 'free-with-paid-certificate',
    level: 'beginner',
    domains: ['digital skills', 'cyber basics', 'ai fluency'],
    skills: ['beginner computing', 'cyber awareness', 'digital confidence'],
    relevantTo: ['beginner computing', 'cyber awareness', 'digital confidence'],
    bestUsedWhen: 'You need lightweight digital confidence and cyber fundamentals.',
    whyItHelps: 'Offers beginner-friendly pathways for confidence and practical literacy.',
    certificateNote: 'Many learning materials are free; credential options vary by course.',
  },
  {
    id: 'coursera-catalog',
    title: 'Coursera Catalog',
    provider: 'Coursera',
    url: 'https://www.coursera.org/',
    costModel: 'free-preview',
    level: 'intermediate',
    domains: ['mixed course catalog'],
    skills: ['topic exploration'],
    relevantTo: ['optional exploration when specific free access is confirmed'],
    bestUsedWhen: 'You have verified a specific course has accessible free content.',
    whyItHelps: 'Can provide strong content, but access terms must be checked carefully.',
    caution:
      'Preview model is common; do not assume full free access unless the specific course clearly states it.',
  },
];

const scoreResource = (resource: ExternalLearningResource, query: string) => {
  const normalized = normalize(query);
  if (!normalized) return 0;

  let score = 0;
  const searchable = [
    ...resource.domains,
    ...resource.skills,
    ...resource.relevantTo,
    resource.title,
    resource.provider,
    resource.bestUsedWhen,
    resource.whyItHelps,
  ]
    .map(normalize)
    .join(' ');

  if (searchable.includes(normalized)) score += 3;
  if (includesAny(normalized, resource.domains.map(normalize))) score += 4;
  if (includesAny(normalized, resource.skills.map(normalize))) score += 3;
  if (includesAny(normalized, resource.relevantTo.map(normalize))) score += 3;
  return score;
};

const dedupeAndSort = (resources: ExternalLearningResource[]) =>
  Array.from(new Map(resources.map((resource) => [resource.id, resource])).values());

export const getExternalResourcesForDomain = (domain: string) =>
  externalLearningResources
    .map((resource) => ({ resource, score: scoreResource(resource, domain) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.resource);

export const getExternalResourcesForSkill = (skill: string) =>
  externalLearningResources
    .map((resource) => ({ resource, score: scoreResource(resource, skill) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.resource);

export const getExternalResourcesForActivity = (activity: string) => {
  const normalized = normalize(activity);
  const direct = externalLearningResources
    .map((resource) => ({ resource, score: scoreResource(resource, normalized) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.resource);

  if (direct.length > 0) {
    return direct;
  }

  if (includesAny(normalized, ['outlook', 'mailbox', 'm365', 'onedrive', 'sharepoint', 'teams'])) {
    return getExternalResourcesForDomain('microsoft 365 admin');
  }
  if (includesAny(normalized, ['mfa', 'identity', 'entra', 'sign-in', 'access'])) {
    return getExternalResourcesForDomain('identity');
  }
  if (includesAny(normalized, ['intune', 'endpoint', 'device', 'autopilot', 'windows'])) {
    return getExternalResourcesForDomain('intune');
  }
  if (includesAny(normalized, ['network', 'dns', 'dhcp', 'wifi', 'vpn', 'printer'])) {
    return getExternalResourcesForDomain('networking');
  }
  if (includesAny(normalized, ['code', 'script', 'python', 'automation', 'app'])) {
    return getExternalResourcesForDomain('coding');
  }
  if (includesAny(normalized, ['google', 'gmail', 'workspace'])) {
    return getExternalResourcesForDomain('google workspace');
  }

  return getTopExternalResources(5);
};

export const getTopExternalResources = (limit = 6) =>
  externalLearningResources
    .slice()
    .sort((a, b) => {
      const costWeight = (model: ExternalResourceCostModel) => {
        if (model === 'free') return 5;
        if (model === 'free-audit') return 4;
        if (model === 'free-with-paid-certificate') return 3;
        if (model === 'free-preview') return 2;
        return 1;
      };

      return costWeight(b.costModel) - costWeight(a.costModel);
    })
    .slice(0, limit);

export const getFreeOnlyResources = () =>
  externalLearningResources.filter((resource) => resource.costModel === 'free');

export const getResourceCaveatLabel = (resource: ExternalLearningResource) => {
  if (resource.costModel === 'free-audit') return 'Audit access only (certificate usually paid)';
  if (resource.costModel === 'free-preview') return 'Preview only - verify full free access';
  if (resource.costModel === 'free-with-paid-certificate') {
    return 'Learning is free; certificate may be paid';
  }
  if (resource.caution) return resource.caution;
  return '';
};

export const getMatchedExternalResources = ({
  domain,
  skill,
  activity,
  limit = 3,
}: {
  domain?: string;
  skill?: string;
  activity?: string;
  limit?: number;
}) => {
  const matches = dedupeAndSort([
    ...(domain ? getExternalResourcesForDomain(domain) : []),
    ...(skill ? getExternalResourcesForSkill(skill) : []),
    ...(activity ? getExternalResourcesForActivity(activity) : []),
  ]);

  if (matches.length === 0) {
    return getTopExternalResources(limit);
  }

  return matches.slice(0, limit);
};
