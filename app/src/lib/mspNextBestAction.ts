import { mspScenarios, MspScenario } from '@/data/mspScenarios';
import { mspSkills, MspReadiness, MspSkill } from '@/data/mspSkills';
import { MspScenarioStatusById } from '@/lib/mspProgress';

export type MspNextBestActionPriority = 'high' | 'medium' | 'low';

export interface MspNextBestAction {
  id: string;
  title: string;
  reason: string;
  action: string;
  priority: MspNextBestActionPriority;
  relatedSkillIds: string[];
  relatedScenarioCategories: string[];
}

const lowReadiness: MspReadiness[] = ['unseen', 'learning'];

const foundationalSkillIds = [
  'helpdesk-ticket-triage',
  'helpdesk-diagnostic-questions',
  'helpdesk-password-mfa',
  'psa-ticket-discipline',
  'service-incident-request',
  'service-sla-priority',
];

const securitySkillIds = [
  'cyber-phishing-analysis',
  'cyber-security-baselines',
  'cyber-incident-first-response',
  'endpoint-security-basics',
  'backup-monitoring',
];

const networkingSkillIds = [
  'networking-dns-dhcp',
  'networking-wifi-troubleshooting',
  'networking-internet-outage',
  'networking-ports-protocols',
];

const ticketNoteSkillIds = [
  'psa-ticket-discipline',
  'docs-handover-notes',
  'docs-kb-writing',
  'judgement-escalation',
];

const getSkillsByIds = (skills: MspSkill[], ids: string[]) =>
  ids
    .map((id) => skills.find((skill) => skill.id === id))
    .filter((skill): skill is MspSkill => Boolean(skill));

const getLowReadinessSkills = (skills: MspSkill[]) =>
  skills.filter((skill) => lowReadiness.includes(skill.readiness));

const hasScenarioCategory = (scenarios: MspScenario[], category: string) =>
  scenarios.some((scenario) => scenario.category === category);

export function getMspNextBestActions(
  skills: MspSkill[] = mspSkills,
  scenarios: MspScenario[] = mspScenarios,
  scenarioStatuses: MspScenarioStatusById = {}
): MspNextBestAction[] {
  const actions: MspNextBestAction[] = [];
  const lowSkills = getLowReadinessSkills(skills);
  const unseenSkills = skills.filter((skill) => skill.readiness === 'unseen');
  const reviewedScenarios = scenarios.filter((scenario) => {
    const status = scenarioStatuses[scenario.id] ?? 'not-started';
    return status !== 'not-started';
  });

  if (reviewedScenarios.length === 0) {
    actions.push({
      id: 'review-first-scenario',
      title: 'Mark the first scenario as reviewed',
      reason: 'No scenario progress has been saved yet, so the evidence pack cannot show scenario practice.',
      action: 'Open MSP Scenarios, review one ticket end to end, and mark it as reviewed or practised.',
      priority: 'high',
      relatedSkillIds: ['helpdesk-diagnostic-questions', 'psa-ticket-discipline', 'judgement-escalation'],
      relatedScenarioCategories: [...new Set(scenarios.map((scenario) => scenario.category))].slice(0, 3),
    });
  }

  const foundationalGaps = getSkillsByIds(skills, foundationalSkillIds).filter((skill) =>
    lowReadiness.includes(skill.readiness)
  );
  if (foundationalGaps.length > 0) {
    actions.push({
      id: 'foundation-first',
      title: 'Strengthen Level 1 support foundations',
      reason: `${foundationalGaps.length} foundational support skills are still unseen or learning.`,
      action: 'Practise triage, first questions, ticket discipline, and SLA priority before deeper technical topics.',
      priority: 'high',
      relatedSkillIds: foundationalGaps.map((skill) => skill.id),
      relatedScenarioCategories: ['Helpdesk and triage', 'Service management'],
    });
  }

  const networkingGaps = getSkillsByIds(skills, networkingSkillIds).filter((skill) =>
    lowReadiness.includes(skill.readiness)
  );
  if (networkingGaps.length >= 2 && hasScenarioCategory(scenarios, 'Networking')) {
    actions.push({
      id: 'networking-layering',
      title: 'Practise networking fault isolation',
      reason: 'Networking scenarios exist, but multiple DNS, Wi-Fi, outage, or port skills are still early-stage.',
      action: 'Review DNS, DHCP, Wi-Fi scope, and internet outage scenarios, then write one ISP escalation note.',
      priority: 'high',
      relatedSkillIds: networkingGaps.map((skill) => skill.id),
      relatedScenarioCategories: ['Networking'],
    });
  }

  const securityGaps = getSkillsByIds(skills, securitySkillIds).filter((skill) =>
    lowReadiness.includes(skill.readiness)
  );
  if (securityGaps.length >= 2) {
    actions.push({
      id: 'security-judgement',
      title: 'Build security judgement evidence',
      reason: 'Security, backup, and endpoint protection gaps create higher-risk support decisions.',
      action: 'Review phishing, backup failure, and compliance scenarios, then write a manager-safe risk explanation.',
      priority: 'high',
      relatedSkillIds: securityGaps.map((skill) => skill.id),
      relatedScenarioCategories: ['Cybersecurity', 'Backup and disaster recovery', 'Intune and endpoint management'],
    });
  }

  const ticketNoteGaps = getSkillsByIds(skills, ticketNoteSkillIds).filter((skill) =>
    lowReadiness.includes(skill.readiness)
  );
  if (ticketNoteGaps.length > 0) {
    actions.push({
      id: 'ticket-note-quality',
      title: 'Produce stronger ticket note evidence',
      reason: 'Documentation and escalation notes are still building toward work-ready evidence.',
      action: 'Use the Ticket Notes Trainer to write one excellent note from a scenario and one escalation-ready handover.',
      priority: 'medium',
      relatedSkillIds: ticketNoteGaps.map((skill) => skill.id),
      relatedScenarioCategories: ['Documentation', 'Escalation and professional judgement'],
    });
  }

  if (unseenSkills.length >= 8) {
    actions.push({
      id: 'reduce-unseen-map',
      title: 'Reduce the unseen skill backlog',
      reason: `${unseenSkills.length} skills have not been started yet.`,
      action: 'Pick one unseen skill from endpoint, identity, networking, and security, then create a short note for each.',
      priority: 'medium',
      relatedSkillIds: unseenSkills.slice(0, 6).map((skill) => skill.id),
      relatedScenarioCategories: [...new Set(scenarios.map((scenario) => scenario.category))].slice(0, 4),
    });
  }

  const scenarioBasis = reviewedScenarios.length > 0 ? reviewedScenarios : scenarios;
  const scenarioCategories = new Set(scenarioBasis.map((scenario) => scenario.category));
  if (scenarioCategories.size >= 5 && lowSkills.length > 0) {
    actions.push({
      id: 'scenario-coverage',
      title: 'Use scenarios to connect weak areas',
      reason: `The scenario bank covers ${scenarioCategories.size} categories, which is enough to practise judgement across layers.`,
      action: 'Review one scenario from each weak category and record the first questions, unsafe actions, and escalation triggers.',
      priority: 'low',
      relatedSkillIds: lowSkills.slice(0, 8).map((skill) => skill.id),
      relatedScenarioCategories: [...scenarioCategories],
    });
  }

  return actions;
}
