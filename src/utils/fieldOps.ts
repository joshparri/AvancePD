export type PendingActionOwner = 'client' | 'vendor' | 'teammate' | 'senior' | 'self';
export type PendingActionStatus = 'active' | 'completed';

export type PendingAction = {
  id: string;
  ticketRef: string;
  owner: PendingActionOwner;
  actionRequired: string;
  dueAt: string;
  status: PendingActionStatus;
  createdAt: string;
  completedAt?: string;
};

export type FieldOpsBacklogType = 'workflow' | 'knowledge' | 'training' | 'privacy-risk' | 'discard';
export type FieldOpsBuildSize = 'tiny' | 'small' | 'medium' | 'large';

export type FieldOpsBacklogItem = {
  id: string;
  type: FieldOpsBacklogType;
  safeStory: string;
  privacyReview: string;
  buildSize: FieldOpsBuildSize;
  createdAt: string;
};

export type FieldOpsState = {
  pendingActions: PendingAction[];
  checklistCompletions: Record<string, boolean>;
  backlogItems: FieldOpsBacklogItem[];
};

export type SanitizedAlertResult = {
  sanitizedText: string;
  replacements: Record<string, number>;
  remainingWarnings: string[];
};

export type AlertTriagePath = {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  firstSystem: string;
  summary: string;
  firstChecks: string[];
  escalationCondition: string;
  noteScaffold: string;
};

export type FieldOpsChecklistGroup = {
  id: string;
  title: string;
  purpose: string;
  warning?: string;
  items: {
    id: string;
    label: string;
    evidenceSkill: string;
  }[];
};

export type FieldOpsPrimer = {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  summary: string;
  steps: string[];
  guardrail: string;
};

export const fieldOpsStorageKey = 'avance-field-ops-v1';

export const defaultFieldOpsState: FieldOpsState = {
  pendingActions: [],
  checklistCompletions: {},
  backlogItems: []
};

export const alertTriagePaths: AlertTriagePath[] = [
  {
    id: 'foreign-access',
    title: 'Anomalous foreign access',
    priority: 'high',
    firstSystem: 'Microsoft Entra sign-in logs',
    summary: 'Use when a sign-in appears to come from an unexpected country, impossible travel pattern, unfamiliar IP, or unusual device.',
    firstChecks: [
      'Confirm whether the alert describes a successful sign-in or only an attempted sign-in.',
      'Check recent sign-in logs for the sanitized user placeholder and compare location, device, and MFA result.',
      'Confirm whether there is a documented travel or remote-work reason before treating it as benign.',
      'If suspicious, preserve notes, avoid risky tenant-wide changes, and escalate with the evidence already checked.'
    ],
    escalationCondition: 'Escalate immediately if the sign-in was successful, MFA looks bypassed or changed, or the activity is outside expected geography with no known business reason.',
    noteScaffold: [
      'Issue reported: Monitoring alert for anomalous sign-in activity.',
      'What I checked: Sign-in result, location pattern, MFA result, device context, and whether there was an expected reason.',
      'What I found: [generic finding only]',
      'Action taken: [safe verification or escalation step]',
      'Outcome: [contained, escalated, or awaiting confirmation]',
      'Next step: [specific generic follow-up]'
    ].join('\n')
  },
  {
    id: 'app-consent',
    title: 'User consent to third-party application',
    priority: 'medium',
    firstSystem: 'Entra Enterprise Applications',
    summary: 'Use when an alert says a user or admin consented to an application, OAuth permission, or external productivity tool.',
    firstChecks: [
      'Identify the sanitized app placeholder and permission category without storing the real app or user details.',
      'Check whether the application is known, approved, or already documented as part of the client environment.',
      'Review consent scope and whether it grants mail, file, calendar, or offline access.',
      'Escalate before revoking broad permissions unless there is clear malicious activity or senior direction.'
    ],
    escalationCondition: 'Escalate if the app requests broad mailbox/file access, admin consent, offline access, or is unknown to the business owner.',
    noteScaffold: [
      'Issue reported: Application consent alert.',
      'What I checked: App category, permission scope, approval status, and risk level.',
      'What I found: [generic finding only]',
      'Action taken: [documented, queried, escalated, or blocked with approval]',
      'Outcome: [pending approval or resolved]',
      'Next step: [business-owner or senior-tech confirmation]'
    ].join('\n')
  },
  {
    id: 'admin-security-change',
    title: 'Administrator security information change',
    priority: 'medium',
    firstSystem: 'Microsoft 365 admin and Entra audit logs',
    summary: 'Use when an administrator registers, changes, or disables security information such as MFA methods or strong authentication.',
    firstChecks: [
      'Check whether the change was performed by the expected admin role or automation path.',
      'Review audit logs around the timestamp for other suspicious changes.',
      'Confirm whether the location and timing fit normal work patterns.',
      'Document the procedural check before escalating as an incident.'
    ],
    escalationCondition: 'Escalate if the change is unexplained, follows a suspicious sign-in, disables MFA, or affects multiple privileged accounts.',
    noteScaffold: [
      'Issue reported: Administrator security information change alert.',
      'What I checked: Actor, timestamp, change type, location pattern, and related audit events.',
      'What I found: [generic finding only]',
      'Action taken: [verified, documented, or escalated]',
      'Outcome: [confirmed expected or requires review]',
      'Next step: [owner confirmation or senior review]'
    ].join('\n')
  },
  {
    id: 'backup-failure',
    title: 'Backup or monitoring failure',
    priority: 'high',
    firstSystem: 'Backup console or monitoring dashboard',
    summary: 'Use when a backup job, monitoring probe, alert board, or health check indicates missed protection or stale visibility.',
    firstChecks: [
      'Confirm whether the alert is a failed job, warning, missed schedule, or stale agent.',
      'Check the most recent successful backup or healthy monitoring result.',
      'Record the affected system as a generic placeholder and avoid copying hostnames.',
      'Escalate if there is no recent successful backup or the failure affects critical systems.'
    ],
    escalationCondition: 'Escalate if backups have failed repeatedly, no successful restore point exists, or monitoring visibility has been stale for more than one expected cycle.',
    noteScaffold: [
      'Issue reported: Backup or monitoring alert.',
      'What I checked: Alert type, latest successful run, affected generic system category, and repeat count.',
      'What I found: [generic finding only]',
      'Action taken: [retry, documented, escalated, or awaiting senior review]',
      'Outcome: [healthy, unresolved, or monitoring]',
      'Next step: [next verification time or escalation owner]'
    ].join('\n')
  },
  {
    id: 'endpoint-agent',
    title: 'Endpoint agent health warning',
    priority: 'medium',
    firstSystem: 'RMM or endpoint protection console',
    summary: 'Use when endpoint protection, RMM, or security agent health is degraded, noisy, or affecting device performance.',
    firstChecks: [
      'Confirm whether the alert is health, detection, isolation, update failure, or performance related.',
      'Check whether the issue affects one endpoint or a broader group.',
      'Avoid disabling security tooling without senior direction and a rollback plan.',
      'Document first checks and escalation reason if agent removal or policy change is being considered.'
    ],
    escalationCondition: 'Escalate before disabling protection, changing policy, or acting on a detection that may indicate compromise.',
    noteScaffold: [
      'Issue reported: Endpoint agent health alert.',
      'What I checked: Alert category, affected scope, current agent state, and user impact.',
      'What I found: [generic finding only]',
      'Action taken: [safe check or escalation]',
      'Outcome: [monitoring, resolved, or escalated]',
      'Next step: [next safe action]'
    ].join('\n')
  }
];

export const fieldOpsChecklistGroups: FieldOpsChecklistGroup[] = [
  {
    id: 'onsite',
    title: 'Onsite visit checklist',
    purpose: 'Use for physical visits where preparation, vendor coordination, sign-off, and closure all matter.',
    warning: 'Do not store addresses, access details, passwords, serial numbers, or client names here.',
    items: [
      { id: 'onsite-hardware', label: 'Confirm required hardware, cables, adapters, and tools are present.', evidenceSkill: 'Onsite preparation' },
      { id: 'onsite-playbooks', label: 'Review relevant playbooks before leaving the office.', evidenceSkill: 'Preparation discipline' },
      { id: 'onsite-arrival', label: 'Record arrival/status update in the work system using safe wording.', evidenceSkill: 'Ticket workflow' },
      { id: 'onsite-vendor', label: 'Confirm vendor access or support path before attempting setup steps.', evidenceSkill: 'Vendor coordination' },
      { id: 'onsite-exceptions', label: 'Capture any out-of-scope work as a generic exception for follow-up.', evidenceSkill: 'Scope control' },
      { id: 'onsite-signoff', label: 'Obtain user confirmation that the agreed work is complete.', evidenceSkill: 'Closure discipline' },
      { id: 'onsite-close', label: 'Create structured notes and set the correct follow-up or invoice status.', evidenceSkill: 'Documentation' }
    ]
  },
  {
    id: 'device-setup',
    title: 'Device setup and handover',
    purpose: 'Use for Windows, Mac, or shared-device setup where the same categories repeat.',
    warning: 'Never store passwords, licence keys, usernames, recovery codes, serial numbers, or screenshots.',
    items: [
      { id: 'device-account', label: 'Confirm account access method and broad identity platform.', evidenceSkill: 'Identity basics' },
      { id: 'device-office', label: 'Install and verify productivity apps and browser profile requirements.', evidenceSkill: 'Endpoint setup' },
      { id: 'device-sync', label: 'Confirm cloud sync approach and avoid copying private file paths.', evidenceSkill: 'Cloud storage support' },
      { id: 'device-rmm', label: 'Confirm required RMM and endpoint protection posture.', evidenceSkill: 'MSP tooling' },
      { id: 'device-handover', label: 'Record handover confirmation and known limitations in safe wording.', evidenceSkill: 'Client communication' },
      { id: 'device-billable', label: 'Clarify billable/non-billable status and next admin handoff.', evidenceSkill: 'Commercial awareness' }
    ]
  },
  {
    id: 'change-management',
    title: 'Change-management guardrail',
    purpose: 'Use before security, identity, remote access, or tenant-wide changes.',
    warning: 'If a step changes policy, licensing, security state, or multiple users, stop and confirm senior approval.',
    items: [
      { id: 'change-approval', label: 'Record who approved the change or that approval is still required.', evidenceSkill: 'Change control' },
      { id: 'change-scope', label: 'Define affected systems, users, billing, and business impact generically.', evidenceSkill: 'Risk assessment' },
      { id: 'change-rollback', label: 'Write the rollback plan before making the change.', evidenceSkill: 'Operational safety' },
      { id: 'change-communication', label: 'Prepare a safe update for affected users or senior technicians.', evidenceSkill: 'Communication' },
      { id: 'change-evidence', label: 'Capture before/after verification without private screenshots.', evidenceSkill: 'Verification' }
    ]
  },
  {
    id: 'daily-monitoring',
    title: 'Daily monitoring discipline',
    purpose: 'Use at shift start or steady moments to make monitoring visible.',
    items: [
      { id: 'monitoring-board', label: 'Check monitoring board or alert queue for high-severity items.', evidenceSkill: 'Alert triage' },
      { id: 'monitoring-stale', label: 'Identify stale, repeated, or unresolved alerts.', evidenceSkill: 'Pattern recognition' },
      { id: 'monitoring-followup', label: 'Create a pending action for anything waiting on someone else.', evidenceSkill: 'Follow-up discipline' },
      { id: 'monitoring-note', label: 'Record a safe summary of what was checked and what remains open.', evidenceSkill: 'Documentation' }
    ]
  }
];

export const fieldOpsPrimers: FieldOpsPrimer[] = [
  {
    id: 'rdp-remoteapps',
    title: 'RDP and RemoteApps',
    priority: 'high',
    summary: 'Remote access issues often sit between VPN/RDG access, RemoteApp feeds, local certificate trust, and server-side RDS configuration.',
    steps: [
      'Capture the exact error and access path before changing anything.',
      'Check whether the user is on the expected VPN, gateway, or work resources feed.',
      'Refresh the RemoteApp feed from the client side as a safe first action.',
      'Compare one-user versus many-user impact before assuming a local issue.',
      'Escalate certificate binding, private key, and server-side RDP settings.'
    ],
    guardrail: 'Do not change server-side RDP encryption, certificate bindings, or security settings without senior direction.'
  },
  {
    id: 'vendor-coordination',
    title: 'Vendor coordination',
    priority: 'high',
    summary: 'Industry-specific software often requires the client, vendor, and MSP to coordinate access and next actions cleanly.',
    steps: [
      'Separate what the client must do, what the vendor must do, and what Avance must do.',
      'Prepare a short call/email note with the generic issue, impact, and requested action.',
      'Record whether access is waiting on the client, vendor, or internal team.',
      'Set a follow-up reminder when the next action leaves your hands.'
    ],
    guardrail: 'Do not store vendor case numbers, contact details, or client-sensitive product screenshots in public sample data.'
  },
  {
    id: 'identity-provider-migration',
    title: 'Identity-provider migration',
    priority: 'medium',
    summary: 'Small-business identity changes need device readiness, profile migration planning, rollback, and approval before action.',
    steps: [
      'Confirm the target identity platform and whether each device supports the move.',
      'Check Windows edition, local profile impact, and business disruption risk.',
      'Plan profile migration as a controlled method, not a blind recipe.',
      'Record senior approval and rollback before touching live devices.'
    ],
    guardrail: 'Treat this as planning guidance only; never perform live identity migration without senior approval.'
  },
  {
    id: 'psa-workflow',
    title: 'PSA workflow knowledge',
    priority: 'medium',
    summary: 'Good ticket workflow includes the correct status, assignment, closure readiness, and invoice handoff.',
    steps: [
      'Choose status based on who owns the next action.',
      'Use safe notes that clearly show issue, checks, result, and next step.',
      'Before resolving, confirm user outcome, follow-up state, and billing or invoice handoff.',
      'Assign back to the right person when the next step is outside your lane.'
    ],
    guardrail: 'Do not store internal PSA URLs, screenshots, mailbox details, or copied ticket text in public docs or sample data.'
  },
  {
    id: 'creative-research',
    title: 'Creative AI research notes',
    priority: 'low',
    summary: 'Creative prompting can teach structure and exploration, but it should not crowd out high-impact MSP workflows.',
    steps: [
      'Keep creative notes in a clearly marked low-priority bucket.',
      'Record the prompt pattern, output shape, and what it teaches.',
      'Separate creative examples from operational primers.'
    ],
    guardrail: 'Do not let creative experiments displace urgent workflow, triage, documentation, or privacy work.'
  }
];

export function loadFieldOpsState(): FieldOpsState {
  if (typeof window === 'undefined') {
    return defaultFieldOpsState;
  }

  try {
    const raw = window.localStorage.getItem(fieldOpsStorageKey);
    const parsed = raw ? (JSON.parse(raw) as Partial<FieldOpsState>) : {};
    return {
      pendingActions: Array.isArray(parsed.pendingActions) ? parsed.pendingActions : [],
      checklistCompletions: parsed.checklistCompletions && typeof parsed.checklistCompletions === 'object' ? parsed.checklistCompletions : {},
      backlogItems: Array.isArray(parsed.backlogItems) ? parsed.backlogItems : []
    };
  } catch {
    return defaultFieldOpsState;
  }
}

export function saveFieldOpsState(state: FieldOpsState) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(fieldOpsStorageKey, JSON.stringify(state));
}

export function createFieldOpsId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function defaultFollowUpDueValue() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setSeconds(0, 0);
  return toDateTimeInputValue(date.toISOString());
}

export function toDateTimeInputValue(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function fromDateTimeInputValue(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  }
  return parsed.toISOString();
}

export function sanitizeAlert(rawText: string): SanitizedAlertResult {
  const replacements: Record<string, number> = {};
  const tokenMap = new Map<string, string>();
  let sanitizedText = rawText;

  const token = (label: string, value: string) => {
    const key = `${label}:${value.toLowerCase()}`;
    const existing = tokenMap.get(key);
    if (existing) {
      return existing;
    }
    const count = (replacements[label] ?? 0) + 1;
    replacements[label] = count;
    const next = `[${label}_${count}]`;
    tokenMap.set(key, next);
    return next;
  };

  sanitizedText = sanitizedText.replace(/^(\s*(?:tenant|client|customer|company|organisation|organization|device name|computer name|hostname|host name|workstation|server|principal name|display name|username|user)\s*[:=]\s*)([^\r\n]+)/gim, (match, prefix: string, value: string) => {
    const label = prefix.toLowerCase().includes('device') || prefix.toLowerCase().includes('host') || prefix.toLowerCase().includes('workstation') || prefix.toLowerCase().includes('server')
      ? 'Device_Name'
      : prefix.toLowerCase().includes('tenant') || prefix.toLowerCase().includes('client') || prefix.toLowerCase().includes('customer') || prefix.toLowerCase().includes('company') || prefix.toLowerCase().includes('organisation') || prefix.toLowerCase().includes('organization')
        ? 'Client_Tenant'
        : 'User_Name';
    return `${prefix}${token(label, value.trim())}`;
  });

  sanitizedText = sanitizedText.replace(/https?:\/\/[^\s)]+/gi, (match) => token('URL', match));
  sanitizedText = sanitizedText.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, (match) => token('User_Email', match));
  sanitizedText = sanitizedText.replace(/\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g, (match) => token('IP_Address', match));
  sanitizedText = sanitizedText.replace(/\b(?:\+?61\s?|0)4\d(?:[\s-]?\d){7}\b/g, (match) => token('Phone_Number', match));
  sanitizedText = sanitizedText.replace(/\b0[2378][\s-]?\d{4}[\s-]?\d{4}\b/g, (match) => token('Phone_Number', match));

  const remainingWarnings = detectRemainingSensitivePatterns(sanitizedText);

  return {
    sanitizedText,
    replacements,
    remainingWarnings
  };
}

export function detectRemainingSensitivePatterns(text: string) {
  const warnings: string[] = [];
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)) {
    warnings.push('Possible email address still present.');
  }
  if (/\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/.test(text)) {
    warnings.push('Possible IP address still present.');
  }
  if (/https?:\/\//i.test(text)) {
    warnings.push('Possible URL still present.');
  }
  if (/\b(?:\+?61\s?|0)4\d(?:[\s-]?\d){7}\b/.test(text)) {
    warnings.push('Possible phone number still present.');
  }
  return warnings;
}

export function recommendAlertTriagePath(text: string): AlertTriagePath {
  const lower = text.toLowerCase();

  if (lower.includes('foreign') || lower.includes('impossible') || lower.includes('outside') || lower.includes('sign-in') || lower.includes('signin') || lower.includes('logon ip')) {
    return alertTriagePaths.find((path) => path.id === 'foreign-access') ?? alertTriagePaths[0];
  }

  if (lower.includes('consent') || lower.includes('oauth') || lower.includes('application') || lower.includes('enterprise app')) {
    return alertTriagePaths.find((path) => path.id === 'app-consent') ?? alertTriagePaths[0];
  }

  if (lower.includes('mfa') || lower.includes('strong authentication') || lower.includes('security info') || lower.includes('registered additional')) {
    return alertTriagePaths.find((path) => path.id === 'admin-security-change') ?? alertTriagePaths[0];
  }

  if (lower.includes('backup') || lower.includes('veeam') || lower.includes('failed job') || lower.includes('monitoring')) {
    return alertTriagePaths.find((path) => path.id === 'backup-failure') ?? alertTriagePaths[0];
  }

  if (lower.includes('endpoint') || lower.includes('sentinel') || lower.includes('agent') || lower.includes('isolation')) {
    return alertTriagePaths.find((path) => path.id === 'endpoint-agent') ?? alertTriagePaths[0];
  }

  return alertTriagePaths[0];
}

export function buildPendingActionNote(action: PendingAction) {
  return [
    `Pending action: ${action.actionRequired}`,
    `Owner: ${action.owner}`,
    `Reference: ${action.ticketRef || 'generic local reference'}`,
    `Due: ${formatDateTime(action.dueAt)}`,
    'Privacy: no client names, copied ticket text, emails, IPs, hostnames, or internal URLs included.'
  ].join('\n');
}

export function getFieldOpsEvidenceSummary(state: FieldOpsState) {
  const activePendingActions = state.pendingActions.filter((action) => action.status === 'active');
  const completedPendingActions = state.pendingActions.filter((action) => action.status === 'completed');
  const completedChecklistItems = fieldOpsChecklistGroups.flatMap((group) =>
    group.items
      .filter((item) => state.checklistCompletions[item.id])
      .map((item) => ({
        group: group.title,
        item: item.label,
        evidenceSkill: item.evidenceSkill
      }))
  );
  const completedChecklistGroups = fieldOpsChecklistGroups
    .filter((group) => group.items.some((item) => state.checklistCompletions[item.id]))
    .map((group) => group.title);

  const practicalOutputs = [
    completedPendingActions.length > 0 ? `${completedPendingActions.length} pending action(s) completed with local-only reminders` : 'Pending action tracker ready for stalled workflow capture',
    completedChecklistItems.length > 0 ? `${completedChecklistItems.length} field checklist item(s) completed` : 'Field checklists available for onsite, device setup, change control, and monitoring',
    state.backlogItems.length > 0 ? `${state.backlogItems.length} safe backlog idea(s) triaged` : 'Backlog intake guardrails available for email/chat-derived ideas'
  ];

  return {
    activePendingActions,
    completedPendingActions,
    completedChecklistItems,
    completedChecklistGroups,
    backlogItems: state.backlogItems,
    practicalOutputs
  };
}

export function buildFieldOpsEvidenceMarkdown(state: FieldOpsState) {
  const summary = getFieldOpsEvidenceSummary(state);
  return [
    '# Field Ops Evidence Summary',
    '',
    'This summary is generated from local, privacy-safe field workflow activity. It does not include client names, emails, hostnames, IP addresses, screenshots, passwords, or copied ticket text.',
    '',
    `- Active pending actions: ${summary.activePendingActions.length}`,
    `- Completed pending actions: ${summary.completedPendingActions.length}`,
    `- Completed checklist items: ${summary.completedChecklistItems.length}`,
    `- Safe backlog items triaged: ${summary.backlogItems.length}`,
    '',
    '## Field Skills Practised',
    ...toMarkdownList(summary.completedChecklistItems.map((item) => `${item.evidenceSkill} - ${item.group}`)),
    '',
    '## Practical Outputs',
    ...toMarkdownList(summary.practicalOutputs),
    '',
    '## Backlog Intake',
    ...toMarkdownList(summary.backlogItems.map((item) => `${item.type}: ${item.safeStory}`))
  ].join('\n');
}

export function formatDateTime(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'No due date';
  }
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function toMarkdownList(items: string[]) {
  return items.length ? items.map((item) => `- ${item}`) : ['- No evidence recorded yet'];
}
