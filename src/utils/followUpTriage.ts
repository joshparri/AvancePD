import type { FollowUpStage, Task } from '../types';

export const followUpStages: FollowUpStage[] = [
  'needs action',
  'waiting on client',
  'waiting on vendor',
  'waiting on teammate',
  'blocked',
  'monitoring'
];

export const followUpStageDescriptions: Record<FollowUpStage, string> = {
  'needs action': 'You own the next step.',
  'waiting on client': 'Waiting for a user or client contact to reply.',
  'waiting on vendor': 'Waiting for a third-party vendor or external provider.',
  'waiting on teammate': 'Waiting for a senior or teammate handoff.',
  blocked: 'Blocked until a dependency, approval, or access issue clears.',
  monitoring: 'Fix or workaround is in place; check again before closing.'
};

const followUpTemplates: Record<FollowUpStage, string> = {
  'needs action': 'Next action: I will review this item and update the ticket with the current status and next step.',
  'waiting on client': 'Hi [name/client], just following up on [generic issue/ticket reference]. Could you please confirm [next step]? Thanks.',
  'waiting on vendor': 'Hi [vendor/team], checking in on [generic issue/reference]. Could you please confirm the current status or the next action needed from us?',
  'waiting on teammate': 'Hi [team member], could you please confirm the next step for [generic issue/reference]? I have captured the current context and can continue once confirmed.',
  blocked: 'This item is blocked by [dependency/approval/access]. Current safe next step: wait for confirmation before making further changes.',
  monitoring: 'Monitoring note: issue appears stable after [action]. Next check: confirm no recurrence and close/update if still clear.'
};

export function buildFollowUpTemplate(task: Pick<Task, 'title' | 'note' | 'followUpStage' | 'nextNudgeDate'>) {
  const stage = task.followUpStage ?? 'needs action';
  const template = followUpTemplates[stage];
  const nextNudge = task.nextNudgeDate ? `\n\nNext nudge/check: ${task.nextNudgeDate}` : '';
  return `${template}\n\nReference: ${task.title}\nContext: ${task.note || 'Generic context only.'}${nextNudge}`;
}

export function todayDateString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function isDateOnOrBefore(dateString: string | undefined, compareTo = todayDateString()) {
  return Boolean(dateString && dateString <= compareTo);
}

export function isTaskOverdue(task: Task, compareTo = todayDateString()) {
  return task.status !== 'done' && isDateOnOrBefore(task.dueDate, compareTo);
}

export function isTaskNudgeDue(task: Task, compareTo = todayDateString()) {
  return task.status !== 'done' && isDateOnOrBefore(task.nextNudgeDate, compareTo);
}

export function daysBetween(dateString: string, compareTo = todayDateString()) {
  if (!dateString) return Infinity;
  const from = new Date(dateString).getTime();
  const to = new Date(compareTo).getTime();
  return Math.floor((to - from) / (1000 * 60 * 60 * 24));
}

export function isTaskStale(task: Task, compareTo = todayDateString()) {
  if (task.status === 'done') return false;

  const overdueDays = task.dueDate ? daysBetween(task.dueDate, compareTo) : -1;
  const lastNudgeAge = task.lastNudgedAt ? daysBetween(task.lastNudgedAt, compareTo) : Infinity;

  if (task.lastNudgedAt && lastNudgeAge >= 7) return true;
  if (task.nextNudgeDate && isTaskNudgeDue(task, compareTo)) return true;
  if (task.dueDate && overdueDays >= 7) return true;

  return false;
}

export function sortFollowUps(tasks: Task[]) {
  const priorityScore: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => {
    if (isTaskOverdue(a) !== isTaskOverdue(b)) return isTaskOverdue(a) ? -1 : 1;
    if (isTaskNudgeDue(a) !== isTaskNudgeDue(b)) return isTaskNudgeDue(a) ? -1 : 1;
    if (priorityScore[a.priority] !== priorityScore[b.priority]) return priorityScore[a.priority] - priorityScore[b.priority];
    return (a.nextNudgeDate ?? a.dueDate).localeCompare(b.nextNudgeDate ?? b.dueDate);
  });
}
