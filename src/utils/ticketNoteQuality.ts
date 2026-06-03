import type { TicketNoteDrillScore, WorkLog } from '../types';

export const ticketNoteTemplate = `Issue:
User impact:
Checks performed:
Action taken:
Result:
Next step:
Escalation reason if applicable:`;

export type TicketNoteQualityResult = {
  rating: TicketNoteDrillScore;
  score: number;
  total: number;
  passed: string[];
  missing: string[];
  suggestions: string[];
};

const sectionLabels = [
  'Issue',
  'User impact',
  'Checks performed',
  'Action taken',
  'Result',
  'Next step',
  'Escalation reason if applicable',
  'Escalation reason',
  'Escalation'
];

const placeholderPatterns = [
  /not captured/i,
  /not recorded/i,
  /capture the/i,
  /add the/i,
  /write the/i,
  /to be confirmed/i,
  /unknown/i,
  /tbd/i
];

const sensitivePatterns = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
  /\bpassword\s*[:=]/i,
  /\btoken\s*[:=]/i,
  /\bsecret\s*[:=]/i,
  /\b[A-Z]:\\[^\s]+/i
];

const impactKeywords = ['affected', 'blocked', 'cannot', 'degraded', 'failed', 'impact', 'risk', 'unable', 'unavailable'];
const checkKeywords = ['checked', 'confirmed', 'diagnosed', 'reviewed', 'tested', 'verified', 'validated'];
const actionKeywords = ['action', 'changed', 'cleared', 'configured', 'escalated', 'guided', 'restarted', 'reset', 'updated'];
const resultKeywords = ['confirmed', 'failed', 'fixed', 'restored', 'resolved', 'result', 'successful', 'tested', 'working'];
const nextStepKeywords = ['confirm', 'escalate', 'follow', 'monitor', 'next', 'owner', 'retry', 'review'];

export function buildTicketNoteFromWorkLog(log: WorkLog) {
  return [
    `Issue: ${safeLine(log.title, 'Not captured yet; add the symptom or request.')}`,
    `User impact: ${inferImpact(log)}`,
    `Checks performed: ${inferChecks(log)}`,
    `Action taken: ${safeLine(log.actions, 'Not captured yet; separate checks from changes made.')}`,
    `Result: ${safeLine(log.result, 'Not captured yet; add what improved, failed, or remains open.')}`,
    `Next step: ${safeLine(log.nextStep, 'Not captured yet; add owner, timing, or monitoring.')}`,
    `Escalation reason if applicable: ${inferEscalation(log)}`
  ].join('\n');
}

export function scoreTicketNote(note: string): TicketNoteQualityResult {
  const criteria = [
    {
      label: 'Issue',
      passed: hasConcreteSection(note, ['Issue']),
      suggestion: 'State the symptom or request in plain language.'
    },
    {
      label: 'User impact',
      passed: hasConcreteSection(note, ['User impact']) && containsAny(getSection(note, ['User impact']), impactKeywords),
      suggestion: 'Explain what work was blocked, degraded, or at risk.'
    },
    {
      label: 'Checks performed',
      passed: hasConcreteSection(note, ['Checks performed']) && containsAny(getSection(note, ['Checks performed']), checkKeywords),
      suggestion: 'List useful checks so the next technician does not repeat work.'
    },
    {
      label: 'Action taken',
      passed: hasConcreteSection(note, ['Action taken']) && containsAny(getSection(note, ['Action taken']), actionKeywords),
      suggestion: 'Record what you changed, guided, restarted, reset, or escalated.'
    },
    {
      label: 'Result',
      passed: hasConcreteSection(note, ['Result']) && containsAny(getSection(note, ['Result']), resultKeywords),
      suggestion: 'Say what was restored, confirmed, still failing, or still open.'
    },
    {
      label: 'Next step',
      passed: hasConcreteSection(note, ['Next step']) && containsAny(getSection(note, ['Next step']), nextStepKeywords),
      suggestion: 'Name the follow-up, owner, timing, or monitoring needed.'
    },
    {
      label: 'Escalation reason',
      passed: hasEscalationCoverage(note),
      suggestion: 'Add an escalation reason, or state that escalation is not required yet.'
    },
    {
      label: 'Enough detail',
      passed: wordCount(note) >= 35,
      suggestion: 'Aim for enough detail that another technician can continue without asking what happened.'
    },
    {
      label: 'Safe wording',
      passed: !sensitivePatterns.some((pattern) => pattern.test(note)),
      suggestion: 'Remove emails, IPs, file paths, passwords, tokens, private hostnames, and client-identifying detail.'
    }
  ];

  const passed = criteria.filter((item) => item.passed).map((item) => item.label);
  const missingItems = criteria.filter((item) => !item.passed);
  const score = passed.length;
  const total = criteria.length;
  const hasSensitiveDetail = missingItems.some((item) => item.label === 'Safe wording');

  return {
    rating: getRating(score, total, hasSensitiveDetail),
    score,
    total,
    passed,
    missing: missingItems.map((item) => item.label),
    suggestions: missingItems.map((item) => item.suggestion)
  };
}

function inferImpact(log: WorkLog) {
  const candidate = firstSentenceWithKeywords([log.summary, log.result, log.nextStep], impactKeywords);
  return candidate || 'Not captured yet; add the blocked work, urgency, or user risk.';
}

function inferChecks(log: WorkLog) {
  const candidate = firstSentenceWithKeywords([log.summary, log.actions], checkKeywords);
  return candidate || 'Not captured yet; list the checks you performed before or after the fix.';
}

function inferEscalation(log: WorkLog) {
  const combined = [log.nextStep, log.actions, log.result, log.tags.join(' ')].join(' ');
  if (/\b(escalat|vendor|senior|blocked|owner|waiting)\w*/i.test(combined)) {
    return safeLine(log.nextStep || log.actions, 'Escalation likely; add the owner, blocker, and evidence needed.');
  }
  return 'Not required at this stage; monitor and escalate if the issue recurs, risk increases, or permissions are needed.';
}

function firstSentenceWithKeywords(values: string[], keywords: string[]) {
  const sentences = values
    .join(' ')
    .split(/[.!?]\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences.find((sentence) => containsAny(sentence, keywords)) ?? '';
}

function safeLine(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

function hasConcreteSection(note: string, aliases: string[]) {
  const section = getSection(note, aliases);
  if (!section) return false;
  if (placeholderPatterns.some((pattern) => pattern.test(section))) return false;
  return wordCount(section) >= 3;
}

function hasEscalationCoverage(note: string) {
  const escalation = getSection(note, ['Escalation reason if applicable', 'Escalation reason', 'Escalation']);
  if (!escalation) return false;
  if (/\b(no escalation|not applicable|n\/a|not required|none)\b/i.test(escalation)) return true;
  if (placeholderPatterns.some((pattern) => pattern.test(escalation))) return false;
  return wordCount(escalation) >= 4;
}

function getSection(note: string, aliases: string[]) {
  const allLabelPattern = sectionLabels.map(escapeRegex).join('|');
  const aliasPattern = aliases.map(escapeRegex).join('|');
  const sectionPattern = new RegExp(
    `(?:^|\\n)\\s*(?:${aliasPattern})\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${allLabelPattern})\\s*:|$)`,
    'i'
  );
  return sectionPattern.exec(note)?.[1]?.trim() ?? '';
}

function containsAny(value: string, keywords: string[]) {
  const normalized = value.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function getRating(score: number, total: number, hasSensitiveDetail: boolean): TicketNoteDrillScore {
  if (hasSensitiveDetail) return 'needs work';
  if (score >= total - 1) return 'strong';
  if (score >= 6) return 'usable';
  return 'needs work';
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
