import { mspSkills } from '../data/mspSkills';
import { mspScenarios } from '../data/mspScenarios';
import type { AvanceProgress } from './progressStorage';

export type NextBestAction = {
  title: string;
  reason: string;
  action: string;
  category: string;
};

const criticalCategories = ['Cybersecurity', 'Networking', 'Escalation and professional judgement'];

export function getEffectiveSkillReadiness(progress: AvanceProgress, skillId: string) {
  const skill = mspSkills.find((item) => item.id === skillId);
  return progress.skillReadinessOverrides[skillId] ?? skill?.readiness ?? 'unseen';
}

export function getWeakSkills(progress: AvanceProgress) {
  return mspSkills.filter((skill) => {
    const readiness = getEffectiveSkillReadiness(progress, skill.id);
    return readiness === 'unseen' || readiness === 'learning';
  });
}

export function getNextBestAction(progress: AvanceProgress): NextBestAction {
  const reviewScenario = mspScenarios.find((scenario) => progress.scenarioProgress[scenario.id]?.status === 'needs-review');
  if (reviewScenario) {
    return {
      title: `Review scenario: ${reviewScenario.title}`,
      reason: 'You marked this scenario as needing review, so it is the highest-value quiet-time practice.',
      action: 'Re-read the unsafe actions and write a privacy-safe ticket note from memory.',
      category: reviewScenario.category
    };
  }

  if (progress.ticketNotePracticeCount < 3) {
    return {
      title: 'Practise one ticket note',
      reason: 'Clear notes are one of the fastest ways to become useful in Level 1 and Level 2 support.',
      action: 'Use the Ticket Notes template for a generic scenario. Do not include client names or copied ticket text.',
      category: 'Documentation'
    };
  }

  const criticalGap = getWeakSkills(progress).find((skill) => criticalCategories.includes(skill.category));
  if (criticalGap) {
    return {
      title: `Strengthen ${criticalGap.title}`,
      reason: `${criticalGap.category} gaps can affect escalation quality, outage response, and security judgement.`,
      action: criticalGap.suggestedPractice[0],
      category: criticalGap.category
    };
  }

  const foundationalGap = getWeakSkills(progress).find((skill) => skill.level === 'beginner');
  if (foundationalGap) {
    return {
      title: `Build foundation: ${foundationalGap.title}`,
      reason: 'Beginner gaps compound during real tickets, especially on busy Avance workdays.',
      action: foundationalGap.suggestedPractice[0],
      category: foundationalGap.category
    };
  }

  const unpractisedScenario = mspScenarios.find((scenario) => {
    const status = progress.scenarioProgress[scenario.id]?.status ?? 'not-started';
    return status === 'not-started';
  });
  if (unpractisedScenario) {
    return {
      title: `Practise scenario: ${unpractisedScenario.title}`,
      reason: 'Scenario reps build judgement before the same pattern appears in the queue.',
      action: 'Read the ticket, choose first questions, then compare your thinking against the ideal notes.',
      category: unpractisedScenario.category
    };
  }

  return {
    title: 'Create one evidence item',
    reason: 'Your current tracked progress is broad enough to turn into a manager-safe PD summary.',
    action: 'Copy the Evidence Pack markdown and add one practical output you created this week.',
    category: 'Evidence'
  };
}

export function getRecommendedStudyAreas(progress: AvanceProgress, limit = 5) {
  return getWeakSkills(progress)
    .slice(0, limit)
    .map((skill) => `${skill.title} (${skill.category})`);
}
