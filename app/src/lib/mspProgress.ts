import { MspReadiness, MspSkill } from '@/data/mspSkills';

const skillReadinessKey = 'avance:msp-skill-readiness';
const scenarioStatusKey = 'avance:msp-scenario-status';

export type MspSkillReadinessById = Record<string, MspReadiness>;

export type MspScenarioStatus = 'not-started' | 'reviewed' | 'practised' | 'confident';

export type MspScenarioStatusById = Record<string, MspScenarioStatus>;

export const mspReadinessOptions: MspReadiness[] = [
  'unseen',
  'learning',
  'practised',
  'work-ready',
  'evidence-proven',
];

export const mspScenarioStatusOptions: MspScenarioStatus[] = [
  'not-started',
  'reviewed',
  'practised',
  'confident',
];

export const mspScenarioStatusLabels: Record<MspScenarioStatus, string> = {
  'not-started': 'Not started',
  reviewed: 'Reviewed',
  practised: 'Practised',
  confident: 'Confident',
};

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const isMspReadiness = (value: unknown): value is MspReadiness =>
  typeof value === 'string' && mspReadinessOptions.includes(value as MspReadiness);

const isMspScenarioStatus = (value: unknown): value is MspScenarioStatus =>
  typeof value === 'string' && mspScenarioStatusOptions.includes(value as MspScenarioStatus);

const readJsonRecord = (key: string): Record<string, unknown> => {
  if (!canUseLocalStorage()) {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)
      ? (parsedValue as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
};

const writeJsonRecord = (key: string, value: Record<string, unknown>) => {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getStoredSkillReadiness = (): MspSkillReadinessById => {
  const storedValue = readJsonRecord(skillReadinessKey);

  return Object.fromEntries(
    Object.entries(storedValue).filter((entry): entry is [string, MspReadiness] =>
      isMspReadiness(entry[1])
    )
  );
};

export const setStoredSkillReadiness = (
  skillId: string,
  readiness: MspReadiness
): MspSkillReadinessById => {
  const nextValue = {
    ...getStoredSkillReadiness(),
    [skillId]: readiness,
  };

  writeJsonRecord(skillReadinessKey, nextValue);
  return nextValue;
};

export const getStoredScenarioStatuses = (): MspScenarioStatusById => {
  const storedValue = readJsonRecord(scenarioStatusKey);

  return Object.fromEntries(
    Object.entries(storedValue).filter((entry): entry is [string, MspScenarioStatus] =>
      isMspScenarioStatus(entry[1])
    )
  );
};

export const setStoredScenarioStatus = (
  scenarioId: string,
  status: MspScenarioStatus
): MspScenarioStatusById => {
  const nextValue = {
    ...getStoredScenarioStatuses(),
    [scenarioId]: status,
  };

  writeJsonRecord(scenarioStatusKey, nextValue);
  return nextValue;
};

export const getScenarioProgressStatus = (
  scenarioStatuses: MspScenarioStatusById,
  scenarioId: string
): MspScenarioStatus => scenarioStatuses[scenarioId] ?? 'not-started';

export const mergeSkillsWithProgress = (
  skills: MspSkill[],
  skillReadiness: MspSkillReadinessById
): MspSkill[] =>
  skills.map((skill) => ({
    ...skill,
    readiness: skillReadiness[skill.id] ?? skill.readiness,
  }));

