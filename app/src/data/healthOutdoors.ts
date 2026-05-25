/**
 * Static health action data for the Health & Outdoors module
 * 
 * All language is research-informed and carefully chosen to avoid medical claims.
 * This module tracks simple wellness practices, not medical conditions or treatments.
 */

// Categories for health actions
export type HealthCategory = 
  | 'hydration' 
  | 'outdoors' 
  | 'eyes' 
  | 'movement' 
  | 'posture' 
  | 'stress' 
  | 'lunch' 
  | 'shutdown' 
  | 'sleep';

// Confidence levels for research claims
export type ConfidenceLevel = 'strong' | 'moderate' | 'emerging';

/**
 * A single health action that can be tracked and reminded
 */
export interface HealthAction {
  id: string;
  title: string;
  category: HealthCategory;
  durationMinutes: number;
  shortPrompt: string; // e.g., "Drink water"
  whyItHelps: string; // Short explanation
  workplaceFriendly: boolean; // Can be done during work
  defaultReminderTime?: string; // HH:MM format (optional)
  emoji?: string;
}

/**
 * Research-backed information card with sources
 */
export interface ResearchCard {
  id: string;
  title: string;
  summary: string; // Research summary (careful language)
  practicalAction: string; // What Josh can do about it
  sourceLabel: string; // e.g., "Research suggests" or "Some studies show"
  sourceUrl?: string; // Optional link for context
  confidenceLevel: ConfidenceLevel;
  category: HealthCategory;
  emoji?: string;
}

/**
 * Template for in-app reminder messages
 */
export interface ReminderTemplate {
  id: string;
  category: HealthCategory;
  message: string; // Calm, encouraging message
  actionButton: string; // Button text
  emoji?: string;
}

/**
 * Weekly reflection prompts for the review
 */
export interface WeeklyReviewPrompt {
  id: string;
  question: string;
  category: HealthCategory;
  optional?: boolean;
}

// ============================================================================
// HEALTH ACTIONS
// ============================================================================

export const healthActions: HealthAction[] = [
  // Hydration category
  {
    id: 'hydration-water-drink',
    title: 'Drink water',
    category: 'hydration',
    durationMinutes: 2,
    shortPrompt: 'Drink water',
    whyItHelps: 'Even mild dehydration can reduce focus and increase fatigue. Regular hydration supports sustained attention.',
    workplaceFriendly: true,
    emoji: '💧',
  },
  {
    id: 'hydration-morning-water',
    title: 'Morning water reset',
    category: 'hydration',
    durationMinutes: 3,
    shortPrompt: 'Start with water and daylight',
    whyItHelps: 'Hydrating after sleep and getting morning light can help regulate energy and mood.',
    workplaceFriendly: true,
    emoji: '💧☀️',
  },

  // Outdoors category
  {
    id: 'outdoors-daylight-break',
    title: 'Step outside for daylight',
    category: 'outdoors',
    durationMinutes: 5,
    shortPrompt: 'Step outside for daylight',
    whyItHelps: 'Daylight exposure helps regulate circadian rhythm, supports mood, and can improve focus after screen time.',
    workplaceFriendly: true,
    emoji: '☀️',
  },
  {
    id: 'outdoors-short-walk',
    title: 'Short walk (3–5 min)',
    category: 'outdoors',
    durationMinutes: 5,
    shortPrompt: 'Walk for a few minutes',
    whyItHelps: 'Movement after sitting improves blood flow, reduces mental fatigue, and can help reset after stress.',
    workplaceFriendly: true,
    emoji: '🚶',
  },
  {
    id: 'outdoors-extended-walk',
    title: 'Outdoor walk or nature time',
    category: 'outdoors',
    durationMinutes: 15,
    shortPrompt: 'Get outside for a longer walk',
    whyItHelps: 'Research suggests 120 minutes per week in nature is associated with improved wellbeing and mental clarity.',
    workplaceFriendly: false,
    emoji: '🌳',
  },

  // Eyes category
  {
    id: 'eyes-20-20-20',
    title: '20-20-20 eye reset',
    category: 'eyes',
    durationMinutes: 1,
    shortPrompt: 'Look 20 feet away for 20 seconds',
    whyItHelps: 'The 20-20-20 rule (look 20 feet away for 20 seconds every 20 minutes) helps reduce eye strain from screens.',
    workplaceFriendly: true,
    emoji: '👀',
  },
  {
    id: 'eyes-blink-focus',
    title: 'Conscious blinking',
    category: 'eyes',
    durationMinutes: 1,
    shortPrompt: 'Blink slowly and deliberately',
    whyItHelps: 'Focused blinking lubricates eyes and can reduce strain. Many people blink less when concentrating on screens.',
    workplaceFriendly: true,
    emoji: '👁️',
  },

  // Movement category
  {
    id: 'movement-stretch',
    title: 'Stretch and move',
    category: 'movement',
    durationMinutes: 3,
    shortPrompt: 'Stand and stretch',
    whyItHelps: 'Short movement breaks reduce stiffness, improve circulation, and can help refocus attention.',
    workplaceFriendly: true,
    emoji: '🤸',
  },
  {
    id: 'movement-desk-walk',
    title: 'Walk around the desk',
    category: 'movement',
    durationMinutes: 2,
    shortPrompt: 'Walk around',
    whyItHelps: 'Movement after sitting improves blood flow and mental clarity.',
    workplaceFriendly: true,
    emoji: '🚶‍♂️',
  },

  // Posture category
  {
    id: 'posture-shoulders-jaw',
    title: 'Relax shoulders and jaw',
    category: 'posture',
    durationMinutes: 1,
    shortPrompt: 'Shoulders down, jaw soft',
    whyItHelps: 'Tension in shoulders and jaw often accumulates during focused work. Releasing it can reduce stress and headaches.',
    workplaceFriendly: true,
    emoji: '😌',
  },
  {
    id: 'posture-alignment',
    title: 'Posture check',
    category: 'posture',
    durationMinutes: 1,
    shortPrompt: 'Check your posture',
    whyItHelps: 'Periodic posture checks help prevent back pain and reduce tension.',
    workplaceFriendly: true,
    emoji: '🧍',
  },
  {
    id: 'posture-neck-reset',
    title: 'Neck and shoulder reset',
    category: 'posture',
    durationMinutes: 2,
    shortPrompt: 'Gentle neck circles and shoulder rolls',
    whyItHelps: 'Gentle movement can reduce neck and shoulder tension from prolonged desk work.',
    workplaceFriendly: true,
    emoji: '🔄',
  },

  // Stress category
  {
    id: 'stress-breathing',
    title: 'Slow breathing (3–5 breaths)',
    category: 'stress',
    durationMinutes: 2,
    shortPrompt: 'Breathe slowly and deliberately',
    whyItHelps: 'Slow breathing activates the parasympathetic nervous system, which can help reduce stress and anxiety.',
    workplaceFriendly: true,
    emoji: '🌬️',
  },
  {
    id: 'stress-name-feeling',
    title: 'Name your feeling',
    category: 'stress',
    durationMinutes: 2,
    shortPrompt: 'Notice and name what you\'re feeling',
    whyItHelps: 'Naming emotions (e.g., "frustrated," "overwhelmed") can help reduce their intensity and regain clarity.',
    workplaceFriendly: true,
    emoji: '💭',
  },
  {
    id: 'stress-next-action',
    title: 'Identify the next tiny action',
    category: 'stress',
    durationMinutes: 2,
    shortPrompt: 'What is the next small step?',
    whyItHelps: 'After stress, focusing on the next concrete action (not the whole problem) can reduce overwhelm and build momentum.',
    workplaceFriendly: true,
    emoji: '→',
  },

  // Lunch category
  {
    id: 'lunch-away-from-screen',
    title: 'Lunch away from screen',
    category: 'lunch',
    durationMinutes: 30,
    shortPrompt: 'Eat lunch away from your screen',
    whyItHelps: 'A true break from screens can help reset attention and energy for the afternoon.',
    workplaceFriendly: true,
    emoji: '🍽️',
  },
  {
    id: 'lunch-outdoor-lunch',
    title: 'Outdoor lunch',
    category: 'lunch',
    durationMinutes: 30,
    shortPrompt: 'Eat outside if possible',
    whyItHelps: 'Combining lunch break with outdoor time doubles the benefits of both practices.',
    workplaceFriendly: false,
    emoji: '🌞',
  },

  // Shutdown category
  {
    id: 'shutdown-close-loops',
    title: 'Close open loops',
    category: 'shutdown',
    durationMinutes: 5,
    shortPrompt: 'Note any unfinished tasks for tomorrow',
    whyItHelps: 'Writing down what\'s incomplete helps your brain let go and transition out of work mode.',
    workplaceFriendly: true,
    emoji: '📝',
  },
  {
    id: 'shutdown-next-actions',
    title: 'Note next actions',
    category: 'shutdown',
    durationMinutes: 3,
    shortPrompt: 'Write your next actions for tomorrow',
    whyItHelps: 'Clarity on tomorrow\'s first steps helps your brain relax and improves startup energy.',
    workplaceFriendly: true,
    emoji: '📋',
  },
  {
    id: 'shutdown-intention-reset',
    title: 'Shutdown ritual',
    category: 'shutdown',
    durationMinutes: 5,
    shortPrompt: 'Close your laptop and transition out of work mode',
    whyItHelps: 'A deliberate shutdown ritual signals to your nervous system that work is complete, supporting evening recovery.',
    workplaceFriendly: true,
    emoji: '🏁',
  },

  // Sleep category
  {
    id: 'sleep-afternoon-light',
    title: 'Afternoon daylight (before 3pm)',
    category: 'sleep',
    durationMinutes: 10,
    shortPrompt: 'Get daylight in the afternoon',
    whyItHelps: 'Afternoon light helps maintain a healthy circadian rhythm and can improve evening sleep quality.',
    workplaceFriendly: true,
    emoji: '🌤️',
  },
];

// ============================================================================
// RESEARCH CARDS
// ============================================================================

export const researchCards: ResearchCard[] = [
  {
    id: 'research-nature-wellbeing',
    title: 'Nature exposure and mental wellbeing',
    summary:
      'Time spent in natural environments is associated with reduced stress markers and improved mood and attention.',
    practicalAction:
      'Aim for short outdoor breaks during work shifts. Even 5 minutes outside can provide benefits.',
    sourceLabel: 'Research suggests',
    confidenceLevel: 'strong',
    category: 'outdoors',
    emoji: '🌳',
  },
  {
    id: 'research-120-minutes-nature',
    title: '120 minutes per week in nature',
    summary:
      'Some research indicates that 120 minutes of nature exposure per week may be associated with improved wellbeing.',
    practicalAction:
      'Spread outdoor time across your week: short breaks during shifts plus longer time on days off.',
    sourceLabel: 'Some studies suggest',
    confidenceLevel: 'moderate',
    category: 'outdoors',
    emoji: '📊',
  },
  {
    id: 'research-microbreaks-fatigue',
    summary:
      'Frequent short breaks are associated with reduced mental fatigue and sustained attention throughout the day.',
    title: 'Microbreaks reduce fatigue',
    practicalAction:
      'Set reminders for brief 2–5 minute breaks every 30–60 minutes of focused work.',
    sourceLabel: 'Research suggests',
    confidenceLevel: 'strong',
    category: 'movement',
    emoji: '⏸️',
  },
  {
    id: 'research-daylight-circadian',
    title: 'Daylight and circadian rhythm',
    summary:
      'Morning and afternoon daylight exposure helps regulate circadian rhythm, which supports sleep quality, mood, and energy levels.',
    practicalAction:
      'Get daylight in the morning (8–10am) and again in the afternoon (before 3pm) on work days.',
    sourceLabel: 'Research shows',
    confidenceLevel: 'strong',
    category: 'outdoors',
    emoji: '🕐',
  },
  {
    id: 'research-movement-sitting',
    title: 'Movement after sitting',
    summary:
      'Short walks and stretches after prolonged sitting improve blood flow, reduce stiffness, and can improve focus and mood.',
    practicalAction:
      'Stand and move for 2–3 minutes at least every hour during work shifts.',
    sourceLabel: 'Research suggests',
    confidenceLevel: 'strong',
    category: 'movement',
    emoji: '🚶',
  },
  {
    id: 'research-hydration-attention',
    title: 'Hydration and attention',
    summary:
      'Even mild dehydration (1–2% of body weight) is associated with reduced attention, increased fatigue, and difficulty concentrating.',
    practicalAction:
      'Drink regular small amounts of water throughout your shift, rather than large amounts at once.',
    sourceLabel: 'Research indicates',
    confidenceLevel: 'strong',
    category: 'hydration',
    emoji: '💧',
  },
  {
    id: 'research-eye-strain-20-20-20',
    title: 'Eye strain and the 20-20-20 rule',
    summary:
      'Looking at screens continuously causes eye strain. Looking 20 feet away for 20 seconds every 20 minutes may help reduce strain.',
    practicalAction:
      'Every 20 minutes, look at something 20 feet away for at least 20 seconds.',
    sourceLabel: 'Research supports',
    confidenceLevel: 'moderate',
    category: 'eyes',
    emoji: '👀',
  },
  {
    id: 'research-shutdown-rituals',
    title: 'End-of-day shutdown rituals',
    summary:
      'Deliberate shutdown rituals help transition from work mode to rest mode, supporting evening recovery and sleep quality.',
    practicalAction:
      'Spend 5–10 minutes at end of shift noting open loops, next actions, and intentionally closing your work tools.',
    sourceLabel: 'Some research suggests',
    confidenceLevel: 'moderate',
    category: 'shutdown',
    emoji: '🏁',
  },
  {
    id: 'research-slow-breathing',
    title: 'Slow breathing and nervous system',
    summary:
      'Deliberately slow breathing (5–6 breaths per minute) activates the parasympathetic nervous system, which may help reduce stress and anxiety.',
    practicalAction:
      'During stressful moments, try breathing in for 4 counts, holding for 4, and out for 4.',
    sourceLabel: 'Research shows',
    confidenceLevel: 'strong',
    category: 'stress',
    emoji: '🌬️',
  },
  {
    id: 'research-emotion-naming',
    title: 'Naming emotions reduces intensity',
    summary:
      'Putting feelings into words (emotion labeling) may help reduce their intensity and increase ability to cope.',
    practicalAction:
      'When overwhelmed, pause and name the emotion in one word (e.g., "frustrated," "scattered," "anxious").',
    sourceLabel: 'Some research suggests',
    confidenceLevel: 'moderate',
    category: 'stress',
    emoji: '💭',
  },
];

// ============================================================================
// REMINDER TEMPLATES
// ============================================================================

export const reminderTemplates: ReminderTemplate[] = [
  {
    id: 'reminder-pre-shift-water',
    category: 'hydration',
    message:
      'Start your shift with water and a moment of calm. Fill your cup and step outside if possible.',
    actionButton: 'Done',
    emoji: '💧',
  },
  {
    id: 'reminder-eye-break',
    category: 'eyes',
    message:
      'Time for an eye reset. Look 20 feet away for 20 seconds, then sip some water.',
    actionButton: 'Done',
    emoji: '👀',
  },
  {
    id: 'reminder-outdoor-reset',
    category: 'outdoors',
    message:
      'Step outside if you can. Even 5 minutes of daylight helps reset your focus and mood.',
    actionButton: 'Done',
    emoji: '☀️',
  },
  {
    id: 'reminder-posture',
    category: 'posture',
    message:
      'Tiny reset: Shoulders down, jaw soft, take a slow breath. Notice what you\'re feeling.',
    actionButton: 'Done',
    emoji: '😌',
  },
  {
    id: 'reminder-lunch',
    category: 'lunch',
    message:
      'Lunch break: Step away from your screen. Eat somewhere else if possible.',
    actionButton: 'Done',
    emoji: '🍽️',
  },
  {
    id: 'reminder-afternoon-walk',
    category: 'outdoors',
    message:
      'Afternoon reset: A short walk or a few minutes outside can help you finish strong.',
    actionButton: 'Done',
    emoji: '🚶',
  },
  {
    id: 'reminder-stress-reset',
    category: 'stress',
    message:
      'After a stressful ticket: Put your feet on the floor, breathe slowly, and name the next tiny action.',
    actionButton: 'Done',
    emoji: '🌬️',
  },
  {
    id: 'reminder-shutdown',
    category: 'shutdown',
    message:
      'Shutdown ritual: Note what\'s incomplete, write your next actions, then close your work tools.',
    actionButton: 'Done',
    emoji: '🏁',
  },
];

// ============================================================================
// WEEKLY REVIEW PROMPTS
// ============================================================================

export const weeklyReviewPrompts: WeeklyReviewPrompt[] = [
  {
    id: 'prompt-calm-week',
    question: 'What helped me stay calm this week?',
    category: 'stress',
  },
  {
    id: 'prompt-overfocus',
    question: 'When did I overfocus or get too deep in a problem?',
    category: 'movement',
  },
  {
    id: 'prompt-outdoors',
    question: 'Did I get outside on Avance days? What did that feel like?',
    category: 'outdoors',
  },
  {
    id: 'prompt-useful-reminder',
    question: 'Which reminder was most useful this week?',
    category: 'hydration',
  },
  {
    id: 'prompt-gentler-week',
    question: 'What should be gentler next week?',
    category: 'stress',
    optional: true,
  },
  {
    id: 'prompt-one-change',
    question: 'What is one small change I\'d like to try next Monday?',
    category: 'stress',
    optional: true,
  },
];
