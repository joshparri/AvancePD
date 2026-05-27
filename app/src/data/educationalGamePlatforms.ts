export type EducationalGameCategory =
  | 'language'
  | 'geography'
  | 'math-logic'
  | 'brain-training'
  | 'academics'
  | 'it-gamified';

export type EducationalGamePlatform = {
  id: string;
  name: string;
  provider: string;
  url: string;
  /** Internal Avance PD route; when set, tile links in-app instead of opening url in new tab */
  internalPath?: string;
  isBuiltIn?: boolean;
  category: EducationalGameCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  gameplayHighlights: string[];
  bestFor: string;
  platforms: string[];
  costNote: string;
  caution?: string;
};

export const educationalGameCategoryLabels: Record<EducationalGameCategory, string> = {
  language: 'Language learning',
  geography: 'Geography & world trivia',
  'math-logic': 'Math & logic',
  'brain-training': 'Brain training',
  academics: 'Academic subjects',
  'it-gamified': 'IT gamified learning',
};

export const educationalGamePlatforms: EducationalGamePlatform[] = [
  {
    id: 'duolingo',
    name: 'Duolingo',
    provider: 'Duolingo Inc.',
    url: 'https://www.duolingo.com/',
    category: 'language',
    categoryLabel: educationalGameCategoryLabels.language,
    tagline: 'Bite-sized language games that build daily habit',
    description:
      'Turns vocabulary and grammar practice into short, streak-driven sessions on mobile and desktop. Lessons feel like levels: listen, speak, translate, and review until patterns stick.',
    gameplayHighlights: [
      'Daily streaks and XP to keep momentum',
      'Listening, speaking, and translation drills',
      'Structured paths from beginner to intermediate topics',
    ],
    bestFor: 'Building a language habit in 5–15 minute breaks between shifts.',
    platforms: ['Web', 'iOS', 'Android'],
    costNote: 'Core learning is free; Super removes ads and adds extras (paid).',
  },
  {
    id: 'geoguessr',
    name: 'GeoGuessr',
    provider: 'GeoGuessr AB',
    url: 'https://www.geoguessr.com/',
    category: 'geography',
    categoryLabel: educationalGameCategoryLabels.geography,
    tagline: 'Guess where you are from real-world Street View clues',
    description:
      'Drops you into real Google Street View locations and challenges you to infer country, region, or city from road signs, vegetation, architecture, and driving side.',
    gameplayHighlights: [
      'Solo challenges and competitive duels',
      'Map-based scoring by distance from the true location',
      'Trains observation, cultural cues, and spatial reasoning',
    ],
    bestFor: 'Geography trivia fans who like detective-style deduction.',
    platforms: ['Web'],
    costNote: 'Free daily challenges; full maps and modes may require a subscription.',
    caution: 'Uses Street View imagery; play on personal time, not client networks if policy restricts.',
  },
  {
    id: 'coolmath-games',
    name: 'Coolmath Games',
    provider: 'Coolmath.com LLC',
    url: 'https://www.coolmathgames.com/',
    category: 'math-logic',
    categoryLabel: educationalGameCategoryLabels['math-logic'],
    tagline: 'Hundreds of free puzzles for strategy and number skills',
    description:
      'A large library of browser games focused on logic, spatial reasoning, and light math—less formal than a course, more playful than flashcards.',
    gameplayHighlights: [
      'Logic, pathfinding, and pattern puzzles',
      'Quick sessions that do not need installs',
      'Good warm-up for analytical thinking',
    ],
    bestFor: 'Short logic breaks when you want something low-friction and fun.',
    platforms: ['Web'],
    costNote: 'Free to play in the browser; some titles include optional ads.',
  },
  {
    id: 'elevate',
    name: 'Elevate',
    provider: 'Elevate Labs',
    url: 'https://www.elevateapp.com/',
    category: 'brain-training',
    categoryLabel: educationalGameCategoryLabels['brain-training'],
    tagline: 'Personalised workouts for reading, focus, and analysis',
    description:
      'Game-like daily drills adapt to your performance across reading comprehension, mental math, focus, and precision—framed as skill workouts rather than lectures.',
    gameplayHighlights: [
      'Personalised difficulty based on your results',
      'Short sessions designed for consistency',
      'Tracks progress across communication and processing skills',
    ],
    bestFor: 'Sharpening reading speed, attention, and verbal reasoning off the ticket queue.',
    platforms: ['iOS', 'Android'],
    costNote: 'Free trial with limited daily training; full programme is subscription-based.',
  },
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    provider: 'Khan Academy',
    url: 'https://www.khanacademy.org/',
    category: 'academics',
    categoryLabel: educationalGameCategoryLabels.academics,
    tagline: 'Free video lessons with gamified practice exercises',
    description:
      'High-quality courses from math and science to computing and humanities, with mastery points, quizzes, and progress dashboards that feel like structured games.',
    gameplayHighlights: [
      'Mastery challenges and unit tests',
      'Computer science, math, science, economics, and more',
      'Completely free core library—no paywall on learning content',
    ],
    bestFor: 'Structured depth when you want academic foundations, not just trivia.',
    platforms: ['Web', 'iOS', 'Android'],
    costNote: 'Learning content is free; optional donations support the nonprofit.',
  },
  {
    id: 'avance-game',
    name: 'AvanceGame',
    provider: 'Avance Business Technology',
    url: '/avance-game',
    internalPath: '/avance-game',
    isBuiltIn: true,
    category: 'it-gamified',
    categoryLabel: educationalGameCategoryLabels['it-gamified'],
    tagline: 'Live-service style MSP practice inside Avance PD',
    description:
      'Built-in sub-app combining daily events, just-one-more challenge loops, variable mystery drops, cohort ranking, IT skill trees, streaks, XP, and modes inspired by Duolingo, GeoGuessr, Elevate, Khan Academy, Coolmath, CMD Challenge, and SadServers.',
    gameplayHighlights: [
      'XP bar, levels, variable mystery drops, and streak shields',
      'Gated skill tree with boss challenges and daily 6-mode chain',
      'Ghost leaderboard, cohort pressure, and six MSP game modes',
      'Limited daily event hooks and one-more-turn prompts',
      'External labs unlock after your first boss victory',
    ],
    bestFor: 'Daily 5-minute IT habit loops without leaving Avance Professional Development.',
    platforms: ['Built into Avance PD'],
    costNote: 'Free — runs in your browser; progress saved locally.',
  },
];
