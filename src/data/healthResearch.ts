export type HealthResearchCategory = 'outdoors' | 'hydration' | 'eyes' | 'movement' | 'stress' | 'sleep';
export type HealthResearchConfidence = 'strong' | 'moderate' | 'emerging';

export type HealthResearchCard = {
  id: string;
  title: string;
  summary: string;
  action: string;
  sourceLabel: string;
  sourceUrl: string;
  confidenceLevel: HealthResearchConfidence;
  category: HealthResearchCategory;
};

export const healthResearchCards: HealthResearchCard[] = [
  {
    id: 'nature-downshift',
    title: 'Nature helps your system downshift',
    summary: 'Research links nature exposure with lower stress markers and better mental wellbeing.',
    action: 'Step outside for 5-10 minutes, look at trees or sky, and let your eyes focus far away.',
    sourceLabel: 'Frontiers in Psychology: Two-hour nature dose review',
    sourceUrl: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2019.02942/full',
    confidenceLevel: 'moderate',
    category: 'outdoors'
  },
  {
    id: 'weekly-120-minutes',
    title: '120 minutes outside per week is a useful target',
    summary: 'A large observational study found that at least 120 minutes per week in nature was associated with better reported health and wellbeing.',
    action: 'Aim for small pieces of outdoor time across the week, especially on Avance days.',
    sourceLabel: 'Scientific Reports: 120 minutes in nature',
    sourceUrl: 'https://www.nature.com/articles/s41598-019-44097-3',
    confidenceLevel: 'moderate',
    category: 'outdoors'
  },
  {
    id: 'microbreaks',
    title: 'Microbreaks can reduce desk fatigue',
    summary: 'Short breaks during prolonged work are linked with less fatigue and better wellbeing in several workplace studies.',
    action: 'Take a tiny reset: stand, breathe, and move for one or two minutes.',
    sourceLabel: 'PLOS ONE: Micro-breaks meta-analysis',
    sourceUrl: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0272460',
    confidenceLevel: 'moderate',
    category: 'movement'
  },
  {
    id: 'hydration-thinking',
    title: 'Hydration supports clearer thinking',
    summary: 'Hydration is associated with attention, mood, and physical comfort, especially during long desk sessions.',
    action: 'Drink water before the next ticket. Keep it simple and steady.',
    sourceLabel: 'CDC: Water and healthier drinks',
    sourceUrl: 'https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html',
    confidenceLevel: 'moderate',
    category: 'hydration'
  },
  {
    id: 'eyes-20-20-20',
    title: 'The 20-20-20 rule gives your eyes a pause',
    summary: 'Eye-care organisations commonly recommend looking away from screens at regular intervals to ease digital eye strain.',
    action: 'Look into the distance for 20 seconds. Relax your jaw and shoulders.',
    sourceLabel: 'American Optometric Association: Computer vision syndrome',
    sourceUrl: 'https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome',
    confidenceLevel: 'moderate',
    category: 'eyes'
  },
  {
    id: 'movement-after-sitting',
    title: 'Movement breaks interrupt long sitting blocks',
    summary: 'Brief physical activity breaks during prolonged sitting may support energy, attention, and comfort.',
    action: 'Stand, stretch calves and hips, then return to one clear next action.',
    sourceLabel: 'CDC: Physical activity boosts brain health',
    sourceUrl: 'https://www.cdc.gov/physical-activity/features/boost-brain-health.html',
    confidenceLevel: 'moderate',
    category: 'movement'
  },
  {
    id: 'daylight-rhythm',
    title: 'Morning daylight supports circadian rhythm',
    summary: 'Daylight exposure is linked with circadian timing and may support daytime alertness and night-time sleep routines.',
    action: 'Get brief daylight early in the shift if possible, even from a doorway or window.',
    sourceLabel: 'Sleep Foundation: Light and sleep',
    sourceUrl: 'https://www.sleepfoundation.org/circadian-rhythm/light-and-sleep',
    confidenceLevel: 'moderate',
    category: 'sleep'
  },
  {
    id: 'lunch-away',
    title: 'Lunch away from screen creates a real pause',
    summary: 'Separating lunch from screen work may help attention recover and reduce the sense of being always on.',
    action: 'Eat away from the screen if you can. Let work stay paused for a few minutes.',
    sourceLabel: 'CDC Workplace Health: Physical activity breaks guide',
    sourceUrl: 'https://www.cdc.gov/workplace-health-promotion/media/pdfs/2024/06/Workplace-Physical-Activity-Break-Guide-508.pdf',
    confidenceLevel: 'emerging',
    category: 'movement'
  },
  {
    id: 'stress-reset',
    title: 'Slow breathing can help after intense tickets',
    summary: 'Slow, deliberate breathing is linked with lower arousal and may help the body shift out of stress mode.',
    action: 'Shoulders down, jaw soft, breathe slowly, then choose the next tiny action.',
    sourceLabel: 'Frontiers in Human Neuroscience: Slow breathing review',
    sourceUrl: 'https://www.frontiersin.org/articles/10.3389/fnhum.2018.00353/full',
    confidenceLevel: 'moderate',
    category: 'stress'
  },
  {
    id: 'shutdown-ritual',
    title: 'A shutdown ritual protects recovery time',
    summary: 'Closing loops and naming next actions can reduce mental carry-over from work into family time.',
    action: 'Write next actions, close work tabs, breathe, and let work stay at work.',
    sourceLabel: 'Cal Newport: Shutdown ritual concept',
    sourceUrl: 'https://calnewport.com/deep-habits-the-importance-of-a-shutdown-ritual/',
    confidenceLevel: 'emerging',
    category: 'stress'
  }
];
