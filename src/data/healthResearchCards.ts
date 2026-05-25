import type { HealthResearchCard } from '../types';

export const healthResearchCards: HealthResearchCard[] = [
  {
    id: 'nature-exposure',
    title: 'Nature helps your system downshift',
    summary: 'Research links nature exposure with lower stress markers and better mental wellbeing. Even brief outdoor time can calm your nervous system.',
    action: 'Step outside for 5–10 minutes, look at trees or sky, and let your eyes focus far away.',
    sourceLabel: 'Nature reviews, wellbeing research',
    sourceUrl: 'https://www.nature.com/articles/ncomms8619',
    confidenceLevel: 'strong',
    category: 'outdoors'
  },
  {
    id: 'outdoor-minutes-weekly',
    title: '120 minutes outside per week',
    summary: 'Studies suggest that 120 minutes of outdoor time per week is linked with better physical and mental health outcomes.',
    action: 'Spread outdoor time across the week. Even short 5–10 minute breaks help. On Avance days, aim for outdoor resets at 10:30am and 2:15pm.',
    sourceLabel: 'Wellbeing study',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5047279/',
    confidenceLevel: 'strong',
    category: 'outdoors'
  },
  {
    id: 'microbreaks-fatigue',
    title: 'Microbreaks reduce fatigue and improve focus',
    summary: 'Brief, frequent breaks (2–5 minutes) are more effective than occasional long breaks for sustaining attention and reducing mental fatigue.',
    action: 'Use the scheduled reminders as your prompt for a 2–5 minute reset. Step away from your desk, move, or look at something far away.',
    sourceLabel: 'Fatigue and breaks research',
    sourceUrl: 'https://www.apa.org/monitor/2016/02/breaks',
    confidenceLevel: 'strong',
    category: 'movement'
  },
  {
    id: 'hydration-thinking',
    title: 'Hydration and clearer thinking',
    summary: 'Even mild dehydration can affect concentration, mood, and energy. Drinking water throughout your shift supports sustained mental performance.',
    action: 'Drink water at each reminder. Use the hydration counter to notice the pattern. A bottle at your desk helps.',
    sourceLabel: 'Hydration and cognition',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3519356/',
    confidenceLevel: 'strong',
    category: 'hydration'
  },
  {
    id: 'eye-20-20-20',
    title: 'The 20–20–20 rule for screen fatigue',
    summary: 'Every 20 minutes, look at something 20 feet away for 20 seconds. This reduces eye strain and prevents digital fatigue.',
    action: 'Use the 9:20am reminder to make this a habit. Look out a window or across the room. Blink slowly.',
    sourceLabel: 'Optometry and eye health',
    sourceUrl: 'https://www.aoa.org/healthy-eyes/caring-for-your-eyes/protecting-your-vision-from-digital-screens',
    confidenceLevel: 'strong',
    category: 'eyes'
  },
  {
    id: 'movement-sitting',
    title: 'Movement after sitting breaks fatigue cycle',
    summary: 'Prolonged sitting is linked with fatigue, discomfort, and reduced alertness. Even 1–2 minutes of light movement helps.',
    action: 'At each reminder, stand and stretch. Roll shoulders. Walk a few steps. This resets your posture and energy.',
    sourceLabel: 'Sitting and health research',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4840599/',
    confidenceLevel: 'strong',
    category: 'movement'
  },
  {
    id: 'daylight-circadian',
    title: 'Morning daylight and circadian rhythm',
    summary: 'Exposure to natural light, especially in the morning, supports your circadian rhythm and improves sleep quality later.',
    action: 'Before your shift starts or during the 8:20am pre-shift setup, get 5–10 minutes of outdoor daylight if possible.',
    sourceLabel: 'Circadian biology',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3835297/',
    confidenceLevel: 'strong',
    category: 'outdoors'
  },
  {
    id: 'lunch-screen',
    title: 'Lunch away from the screen',
    summary: 'Taking a true lunch break away from your screen helps reset your mental state, prevents afternoon slump, and improves afternoon focus.',
    action: 'At 12:30pm, step away from your desk. Eat somewhere else if possible. Your nervous system gets a real reset.',
    sourceLabel: 'Break and recovery research',
    sourceUrl: 'https://psycnet.apa.org/doiLanding?doi=10.1037%2F0021-9010.88.3.516',
    confidenceLevel: 'strong',
    category: 'stress'
  },
  {
    id: 'nervous-system-reset',
    title: 'Nervous-system reset after intense tickets',
    summary: 'After stressful or high-intensity work, deliberately slowing your breath and relaxing your body helps your nervous system downshift. This prevents stress accumulation.',
    action: 'After handling an urgent or difficult ticket, pause. Relax your jaw and shoulders. Breathe slowly for 30 seconds. Optional: brief prayer or grounding.',
    sourceLabel: 'Polyvagal theory, nervous system regulation',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1544521/',
    confidenceLevel: 'moderate',
    category: 'stress'
  },
  {
    id: 'end-of-day-ritual',
    title: 'End-of-day shutdown ritual',
    summary: 'A brief ritual at the end of work—closing loops, noting next actions, and consciously leaving work at work—supports mental separation and prevents stress carryover.',
    action: 'At 4:45pm, spend 2–3 minutes noting what you did, any next actions, and what to pick up tomorrow. Then consciously close your laptop. Optional: breathe or pray.',
    sourceLabel: 'Work-life balance and ritual research',
    sourceUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8159966/',
    confidenceLevel: 'moderate',
    category: 'stress'
  }
];

export function getResearchCardsByCategory(category: HealthResearchCard['category']): HealthResearchCard[] {
  return healthResearchCards.filter((card) => card.category === category);
}

export function getResearchCardsByConfidence(level: HealthResearchCard['confidenceLevel']): HealthResearchCard[] {
  return healthResearchCards.filter((card) => card.confidenceLevel === level);
}
