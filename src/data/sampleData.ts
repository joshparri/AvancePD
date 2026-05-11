import type {
  Client,
  Shift,
  WorkLog,
  Task,
  KnowledgeEntry,
  Playbook,
  TimeEntry,
  LearningItem
} from '../types';

export const clients: Client[] = [
  {
    id: 'demo-client',
    name: 'Demo Client',
    sector: 'Demo support',
    notes: 'Generic demo environment for practising MSP support workflows.',
    quirks: ['shared printer', 'Wi-Fi coverage', 'Microsoft 365 access']
  },
  {
    id: 'example-site',
    name: 'Example Site',
    sector: 'Example business',
    notes: 'Fictional site used for ticket triage, follow-ups, and documentation examples.',
    quirks: ['remote support', 'slow device reports', 'printer reliability']
  },
  {
    id: 'sample-office',
    name: 'Sample Office',
    sector: 'Office support',
    notes: 'Demo office with common endpoint, email, and collaboration support needs.',
    quirks: ['Teams audio', 'OneDrive sync', 'user training']
  }
];

export const shifts: Shift[] = [
  {
    id: 'shift-1',
    clientId: 'demo-client',
    dayOfWeek: 'Monday',
    startTime: '08:30',
    endTime: '17:00',
    recurring: true,
    status: 'scheduled',
    priorities: ['Review open demo follow-ups', 'Check generic ticket queue', 'Practise one ticket note'],
    prepChecklist: ['Open dashboard', 'Review outstanding tasks', 'Pick one PD focus area'],
    handoverNotes: 'Demo handover: follow up on a generic email sync issue and a printer queue example.',
    billed: false,
    paid: false
  },
  {
    id: 'shift-2',
    clientId: 'example-site',
    dayOfWeek: 'Wednesday',
    startTime: '08:30',
    endTime: '17:00',
    recurring: true,
    status: 'scheduled',
    priorities: ['Review endpoint follow-ups', 'Practise escalation notes', 'Document one repeat issue'],
    prepChecklist: ['Review recent work logs', 'Check learning reminders', 'Choose a scenario to practise'],
    handoverNotes: 'Demo handover: sample device performance issue needs a clear next step.',
    billed: false,
    paid: false
  }
];

export const workLogs: WorkLog[] = [
  {
    id: 'log-1',
    shiftId: 'shift-1',
    clientId: 'demo-client',
    title: 'Demo Ticket: Email app not updating',
    summary: 'Sample user reported that desktop email was not showing recent messages while webmail worked.',
    actions: 'Compared webmail and desktop app, checked offline mode, reviewed add-ins, and restarted the app.',
    result: 'Demo resolution: desktop email synced successfully after correcting the app state.',
    nextStep: 'Monitor for repeat sync symptoms and document if it recurs.',
    tags: ['Email', 'Microsoft 365', 'Demo Ticket'],
    createdAt: '2026-05-05T14:02:00Z',
    draft: false
  },
  {
    id: 'log-2',
    clientId: 'example-site',
    title: 'Demo Ticket: Wi-Fi slow in one area',
    summary: 'Sample users reported slow wireless access in one part of the demo site.',
    actions: 'Checked scope, compared wired and wireless symptoms, and reviewed access point status.',
    result: 'Demo resolution: issue documented for escalation to network support.',
    nextStep: 'Confirm whether the issue affects one area or the whole site.',
    tags: ['Wi-Fi', 'Networking', 'Demo Ticket'],
    createdAt: '2026-05-03T10:18:00Z',
    draft: false
  }
];

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Demo follow-up: write a clear ticket note',
    status: 'open',
    dueDate: '2026-05-08',
    priority: 'medium',
    clientId: 'demo-client',
    workLogId: 'log-1',
    note: 'Use the ticket note trainer structure: issue, impact, checks, action, result, next step.',
    createdAt: '2026-05-05T15:00:00Z'
  }
];

export const knowledgeEntries: KnowledgeEntry[] = [
  {
    id: 'kn-1',
    title: 'Demo: desktop email not syncing',
    summary: 'Compare webmail and desktop app before rebuilding a profile.',
    body: 'Check whether webmail has current mail, confirm desktop app connection state, inspect add-ins, and record what changed.',
    category: 'Email',
    tags: ['email', 'Microsoft 365', 'demo'],
    confidence: 'medium',
    lastVerified: '2026-05-03',
    sourceType: 'tested fix',
    trusted: true,
    clientId: 'demo-client',
    createdAt: '2026-05-03T09:30:00Z'
  },
  {
    id: 'kn-2',
    title: 'Demo: printer queue appears stuck',
    summary: 'Check selected printer, queue status, and test page before changing device settings.',
    body: 'Confirm whether the issue affects one user or many. Avoid changing shared print services for a single-user symptom.',
    category: 'Printer',
    tags: ['printer', 'queue', 'demo'],
    confidence: 'medium',
    lastVerified: '2026-05-04',
    sourceType: 'personal',
    trusted: false,
    createdAt: '2026-05-04T11:15:00Z'
  }
];

export const playbooks: Playbook[] = [
  {
    id: 'pb-1',
    title: 'Demo: internet or network access issue',
    symptoms: ['Multiple users report no access', 'One area has poor connectivity', 'A single device cannot browse'],
    firstChecks: ['Confirm scope', 'Check wired versus wireless', 'Test a known safe website', 'Record error messages'],
    deeperChecks: ['Review gateway/DNS symptoms', 'Check recent changes', 'Escalate infrastructure changes to the right owner'],
    escalation: 'Escalate when multiple users are affected, infrastructure changes are needed, or business impact is high.',
    notes: 'Start with scope and impact before changing settings.',
    relatedKnowledgeIds: []
  }
];

export const learningItems: LearningItem[] = [
  {
    id: 'learn-1',
    topic: 'Microsoft 365 admin essentials',
    confidence: 'medium',
    notes: 'Demo learning focus: shared mailboxes, MFA support, licensing basics, and clear ticket notes.',
    seenInRealWork: true,
    askTeam: false,
    nextReviewDate: '2026-05-20'
  }
];

export const timeEntries: TimeEntry[] = [
  {
    id: 'time-1',
    date: '2026-05-05',
    shiftId: 'shift-1',
    hours: 1,
    billable: false,
    description: 'Demo PD practice and sample work log review'
  }
];
