import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  alertTriagePaths,
  buildFieldOpsEvidenceMarkdown,
  buildPendingActionNote,
  createFieldOpsId,
  defaultFollowUpDueValue,
  fieldOpsChecklistGroups,
  fieldOpsPrimers,
  formatDateTime,
  fromDateTimeInputValue,
  getFieldOpsEvidenceSummary,
  loadFieldOpsState,
  recommendAlertTriagePath,
  sanitizeAlert,
  saveFieldOpsState,
  type FieldOpsBacklogType,
  type FieldOpsBuildSize,
  type FieldOpsState,
  type PendingActionOwner
} from '../utils/fieldOps';

function FieldOps() {
  const [state, setState] = useState<FieldOpsState>(loadFieldOpsState);
  const [copyStatus, setCopyStatus] = useState('');
  const [ticketRef, setTicketRef] = useState('');
  const [actionOwner, setActionOwner] = useState<PendingActionOwner>('vendor');
  const [actionRequired, setActionRequired] = useState('');
  const [followUpDue, setFollowUpDue] = useState(defaultFollowUpDueValue);
  const [rawAlert, setRawAlert] = useState('');
  const [selectedTriagePathId, setSelectedTriagePathId] = useState(alertTriagePaths[0].id);
  const [backlogType, setBacklogType] = useState<FieldOpsBacklogType>('workflow');
  const [safeStory, setSafeStory] = useState('');
  const [privacyReview, setPrivacyReview] = useState('');
  const [buildSize, setBuildSize] = useState<FieldOpsBuildSize>('small');
  const [changeTitle, setChangeTitle] = useState('');
  const [changeApproval, setChangeApproval] = useState('');
  const [changeAffectedSystems, setChangeAffectedSystems] = useState('');
  const [changeBeforeState, setChangeBeforeState] = useState('');
  const [changeRollbackPlan, setChangeRollbackPlan] = useState('');
  const [changeVerificationPlan, setChangeVerificationPlan] = useState('');
  const [changeCommunicationPlan, setChangeCommunicationPlan] = useState('');
  const [changeSeniorCheck, setChangeSeniorCheck] = useState(false);

  useEffect(() => {
    saveFieldOpsState(state);
  }, [state]);

  const activeActions = state.pendingActions
    .filter((action) => action.status === 'active')
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const completedActions = state.pendingActions
    .filter((action) => action.status === 'completed')
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    .slice(0, 4);
  const sanitizedAlert = useMemo(() => sanitizeAlert(rawAlert), [rawAlert]);
  const recommendedTriage = useMemo(
    () => recommendAlertTriagePath(sanitizedAlert.sanitizedText || rawAlert),
    [rawAlert, sanitizedAlert.sanitizedText]
  );
  const selectedTriage = alertTriagePaths.find((path) => path.id === selectedTriagePathId) ?? alertTriagePaths[0];
  const evidenceSummary = useMemo(() => getFieldOpsEvidenceSummary(state), [state]);
  const evidenceMarkdown = useMemo(() => buildFieldOpsEvidenceMarkdown(state), [state]);
  const changeRiskMatches = useMemo(() => detectChangeRisk(`${changeTitle} ${changeAffectedSystems} ${changeBeforeState}`), [changeTitle, changeAffectedSystems, changeBeforeState]);
  const changeGuardrailNote = useMemo(() => buildChangeGuardrailNote({
    title: changeTitle,
    approval: changeApproval,
    affectedSystems: changeAffectedSystems,
    beforeState: changeBeforeState,
    rollbackPlan: changeRollbackPlan,
    verificationPlan: changeVerificationPlan,
    communicationPlan: changeCommunicationPlan,
    seniorCheck: changeSeniorCheck,
    riskMatches: changeRiskMatches
  }), [
    changeAffectedSystems,
    changeApproval,
    changeBeforeState,
    changeCommunicationPlan,
    changeRiskMatches,
    changeRollbackPlan,
    changeSeniorCheck,
    changeTitle,
    changeVerificationPlan
  ]);

  const copyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${label} copied.`);
    } catch {
      setCopyStatus(`Could not copy ${label}. Select the text manually if needed.`);
    }
  };

  const addPendingAction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanAction = actionRequired.trim();
    if (!cleanAction) {
      return;
    }

    setState((current) => ({
      ...current,
      pendingActions: [
        {
          id: createFieldOpsId('pending'),
          ticketRef: ticketRef.trim() || 'generic local reference',
          owner: actionOwner,
          actionRequired: cleanAction,
          dueAt: fromDateTimeInputValue(followUpDue),
          status: 'active',
          createdAt: new Date().toISOString()
        },
        ...current.pendingActions
      ]
    }));
    setTicketRef('');
    setActionOwner('vendor');
    setActionRequired('');
    setFollowUpDue(defaultFollowUpDueValue());
  };

  const markActionComplete = (actionId: string) => {
    setState((current) => ({
      ...current,
      pendingActions: current.pendingActions.map((action) =>
        action.id === actionId
          ? { ...action, status: 'completed', completedAt: new Date().toISOString() }
          : action
      )
    }));
  };

  const removeAction = (actionId: string) => {
    if (!window.confirm('Remove this local pending action?')) {
      return;
    }
    setState((current) => ({
      ...current,
      pendingActions: current.pendingActions.filter((action) => action.id !== actionId)
    }));
  };

  const toggleChecklistItem = (itemId: string) => {
    setState((current) => ({
      ...current,
      checklistCompletions: {
        ...current.checklistCompletions,
        [itemId]: !current.checklistCompletions[itemId]
      }
    }));
  };

  const addBacklogItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanStory = safeStory.trim();
    if (!cleanStory) {
      return;
    }

    setState((current) => ({
      ...current,
      backlogItems: [
        {
          id: createFieldOpsId('backlog'),
          type: backlogType,
          safeStory: cleanStory,
          privacyReview: privacyReview.trim() || 'No private data required; use generic examples only.',
          buildSize,
          createdAt: new Date().toISOString()
        },
        ...current.backlogItems
      ]
    }));
    setBacklogType('workflow');
    setSafeStory('');
    setPrivacyReview('');
    setBuildSize('small');
  };

  const removeBacklogItem = (itemId: string) => {
    if (!window.confirm('Remove this local backlog intake item?')) {
      return;
    }
    setState((current) => ({
      ...current,
      backlogItems: current.backlogItems.filter((item) => item.id !== itemId)
    }));
  };

  return (
    <div>
      <section className="card dashboard-hero-card">
        <div className="dashboard-hero">
          <div>
            <h1>Field Ops Cockpit</h1>
            <p className="page-subtitle">
              A privacy-safe operating surface for stalled follow-ups, monitoring alerts, onsite work, change guardrails, reusable primers, and evidence-friendly field habits.
            </p>
            <div className="privacy-note">
              Local-only by design. Do not enter client names, emails, IP addresses, hostnames, passwords, internal URLs, screenshots, or copied ticket text.
            </div>
          </div>
          <div className="dashboard-hero-actions">
            <button type="button" onClick={() => document.getElementById('pending-action-text')?.focus()}>Add follow-up</button>
            <button type="button" className="secondary-action" onClick={() => document.getElementById('monitoring-alert-input')?.focus()}>Sanitize alert</button>
            <button type="button" className="secondary-action" onClick={() => copyText('Field Ops evidence', evidenceMarkdown)}>Copy evidence</button>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Field ops summary</h2>
        <div className="card-grid">
          <Metric label="Active pending actions" value={activeActions.length} />
          <Metric label="Completed pending actions" value={evidenceSummary.completedPendingActions.length} />
          <Metric label="Checklist items completed" value={evidenceSummary.completedChecklistItems.length} />
          <Metric label="Safe backlog ideas" value={state.backlogItems.length} />
        </div>
        {copyStatus && <p className="health-muted">{copyStatus}</p>}
      </section>

      <section className="card">
        <div className="skill-card-header">
          <div>
            <h2>Pending action tracker</h2>
            <p>Use this when a ticket is waiting on a client, vendor, teammate, senior review, or your next action.</p>
          </div>
          <span className="status-chip info">localStorage only</span>
        </div>
        <form onSubmit={addPendingAction} className="quick-capture-form">
          <div className="field-ops-form-grid">
            <label>
              Safe reference
              <input value={ticketRef} onChange={(event) => setTicketRef(event.target.value)} placeholder="Ticket ID or generic local reference" />
            </label>
            <label>
              Waiting on
              <select value={actionOwner} onChange={(event) => setActionOwner(event.target.value as PendingActionOwner)}>
                <option value="client">Client</option>
                <option value="vendor">Vendor</option>
                <option value="teammate">Teammate</option>
                <option value="senior">Senior tech</option>
                <option value="self">Self</option>
              </select>
            </label>
            <label>
              Follow-up due
              <input type="datetime-local" value={followUpDue} onChange={(event) => setFollowUpDue(event.target.value)} />
            </label>
          </div>
          <label>
            Generic action required
            <textarea
              id="pending-action-text"
              value={actionRequired}
              onChange={(event) => setActionRequired(event.target.value)}
              placeholder="Example: Vendor needs to confirm remote access window. No names, emails, or copied ticket text."
              required
            />
          </label>
          <button type="submit">Save pending action</button>
        </form>

        <div className="health-plan-grid">
          <article className="mini-card">
            <h3>Active follow-ups</h3>
            {activeActions.length ? (
              <div className="field-ops-list">
                {activeActions.map((action) => (
                  <div key={action.id} className="field-ops-list-item">
                    <div>
                      <span className="status-chip warn">{action.owner}</span>
                      <strong>{action.ticketRef}</strong>
                      <p>{action.actionRequired}</p>
                      <p className="health-muted">Due {formatDateTime(action.dueAt)}</p>
                    </div>
                    <div className="status-button-row">
                      <button type="button" onClick={() => markActionComplete(action.id)}>Mark complete</button>
                      <button type="button" className="small-action" onClick={() => copyText('Pending action note', buildPendingActionNote(action))}>Copy note</button>
                      <button type="button" className="small-action" onClick={() => removeAction(action.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No active pending actions. Add one when the next step leaves your hands.</p>
            )}
          </article>
          <article className="mini-card">
            <h3>Recently completed</h3>
            {completedActions.length ? (
              <ul>
                {completedActions.map((action) => (
                  <li key={action.id}>{action.actionRequired} ({formatDateTime(action.completedAt ?? action.createdAt)})</li>
                ))}
              </ul>
            ) : (
              <p>No completed local pending actions yet.</p>
            )}
          </article>
        </div>
      </section>

      <section className="card">
        <div className="skill-card-header">
          <div>
            <h2>Monitoring alert sanitizer</h2>
            <p>Paste raw alert text locally, review the sanitized version, then use the generic triage plan.</p>
          </div>
          <span className="status-chip success">no API call</span>
        </div>
        <div className="field-ops-two-column">
          <label className="inline-control">
            Raw alert text
            <textarea
              id="monitoring-alert-input"
              className="field-ops-textarea"
              value={rawAlert}
              onChange={(event) => setRawAlert(event.target.value)}
              placeholder="Paste alert text here. It stays in component state and is not saved."
            />
          </label>
          <div>
            <h3>Sanitized preview</h3>
            <pre className="template-box">{sanitizedAlert.sanitizedText || 'Sanitized alert preview will appear here.'}</pre>
            <div className="metric-row">
              {Object.entries(sanitizedAlert.replacements).map(([label, count]) => (
                <span key={label} className="status-chip info">{label}: {count}</span>
              ))}
              {!Object.keys(sanitizedAlert.replacements).length && <span className="status-chip warn">No replacements yet</span>}
            </div>
            {sanitizedAlert.remainingWarnings.length > 0 && (
              <div className="warning-panel">
                <h3>Manual review needed</h3>
                <ul>
                  {sanitizedAlert.remainingWarnings.map((warning) => <li key={warning}>{warning}</li>)}
                </ul>
              </div>
            )}
            <div className="status-button-row">
              <button type="button" disabled={!sanitizedAlert.sanitizedText} onClick={() => copyText('Sanitized alert', sanitizedAlert.sanitizedText)}>Copy sanitized text</button>
              <button type="button" className="small-action" disabled={!sanitizedAlert.sanitizedText} onClick={() => setSelectedTriagePathId(recommendedTriage.id)}>Use recommended path</button>
            </div>
          </div>
        </div>
        <div className="feedback-panel">
          <h3>Recommended triage</h3>
          <p><strong>{recommendedTriage.title}</strong> - {recommendedTriage.priority} priority. Check {recommendedTriage.firstSystem} first.</p>
        </div>
      </section>

      <section className="card">
        <h2>Security alert triage paths</h2>
        <label className="inline-control">
          Alert type
          <select value={selectedTriagePathId} onChange={(event) => setSelectedTriagePathId(event.target.value)}>
            {alertTriagePaths.map((path) => (
              <option key={path.id} value={path.id}>{path.title}</option>
            ))}
          </select>
        </label>
        <div className="health-plan-grid">
          <article className="mini-card">
            <h3>{selectedTriage.title}</h3>
            <p>{selectedTriage.summary}</p>
            <div className="metric-row">
              <span className={selectedTriage.priority === 'high' ? 'status-chip error' : selectedTriage.priority === 'medium' ? 'status-chip warn' : 'status-chip info'}>{selectedTriage.priority} priority</span>
              <span className="status-chip info">{selectedTriage.firstSystem}</span>
            </div>
            <ol>
              {selectedTriage.firstChecks.map((check) => <li key={check}>{check}</li>)}
            </ol>
            <div className="warning-panel">
              <strong>Escalation condition</strong>
              <p>{selectedTriage.escalationCondition}</p>
            </div>
          </article>
          <article className="mini-card">
            <h3>Ticket note scaffold</h3>
            <pre className="template-box">{selectedTriage.noteScaffold}</pre>
            <button type="button" onClick={() => copyText('Triage note scaffold', selectedTriage.noteScaffold)}>Copy scaffold</button>
          </article>
        </div>
      </section>

      <section className="card">
        <div className="skill-card-header">
          <div>
            <h2>Change guardrail builder</h2>
            <p>Use this before policy, identity, DNS, firewall, backup, restore, script, registry, or production changes.</p>
          </div>
          <span className={changeRiskMatches.length ? 'status-chip warn' : 'status-chip info'}>
            {changeRiskMatches.length ? 'risk keywords found' : 'ready'}
          </span>
        </div>
        <div className="privacy-note">
          This is a thinking checklist, not approval. Keep details generic and confirm senior direction before live risky changes.
        </div>
        <div className="field-ops-two-column">
          <div className="quick-capture-form">
            <label>
              Change summary
              <input value={changeTitle} onChange={(event) => setChangeTitle(event.target.value)} placeholder="Example: update generic DNS setting after approval" />
            </label>
            <label>
              Approval / owner
              <input value={changeApproval} onChange={(event) => setChangeApproval(event.target.value)} placeholder="Who approved this, or what approval is still needed?" />
            </label>
            <label>
              Affected systems and scope
              <textarea value={changeAffectedSystems} onChange={(event) => setChangeAffectedSystems(event.target.value)} placeholder="Generic scope only. Avoid hostnames, IPs, tenant names, or client names." />
            </label>
            <label>
              Before-state evidence
              <textarea value={changeBeforeState} onChange={(event) => setChangeBeforeState(event.target.value)} placeholder="What is true before the change? What has been checked?" />
            </label>
            <label>
              Rollback plan
              <textarea value={changeRollbackPlan} onChange={(event) => setChangeRollbackPlan(event.target.value)} placeholder="How would you undo this safely if it fails?" />
            </label>
            <label>
              Verification plan
              <textarea value={changeVerificationPlan} onChange={(event) => setChangeVerificationPlan(event.target.value)} placeholder="What exact checks prove the change worked and did not break nearby services?" />
            </label>
            <label>
              Communication plan
              <textarea value={changeCommunicationPlan} onChange={(event) => setChangeCommunicationPlan(event.target.value)} placeholder="Who needs a safe update, and when?" />
            </label>
            <label className="checklist-item">
              <input type="checkbox" checked={changeSeniorCheck} onChange={(event) => setChangeSeniorCheck(event.target.checked)} />
              <span>Senior approval or peer check is confirmed for this change.</span>
            </label>
          </div>
          <div>
            <h3>Guardrail note</h3>
            {changeRiskMatches.length > 0 && (
              <div className="warning-panel">
                <strong>Risk keywords detected</strong>
                <p>{changeRiskMatches.join(', ')}</p>
              </div>
            )}
            <pre className="template-box">{changeGuardrailNote}</pre>
            <div className="status-button-row">
              <button type="button" onClick={() => copyText('Change guardrail note', changeGuardrailNote)}>Copy guardrail note</button>
              <button
                type="button"
                className="small-action"
                onClick={() => {
                  setChangeTitle('');
                  setChangeApproval('');
                  setChangeAffectedSystems('');
                  setChangeBeforeState('');
                  setChangeRollbackPlan('');
                  setChangeVerificationPlan('');
                  setChangeCommunicationPlan('');
                  setChangeSeniorCheck(false);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Field checklists</h2>
        <p>Use these as safe, generic workflow scaffolds. Checked items persist locally and can feed the Evidence Pack.</p>
        <div className="field-ops-checklist-grid">
          {fieldOpsChecklistGroups.map((group) => {
            const completedCount = group.items.filter((item) => state.checklistCompletions[item.id]).length;
            return (
              <article key={group.id} className="mini-card">
                <div className="skill-card-header">
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.purpose}</p>
                  </div>
                  <span className="status-chip info">{completedCount}/{group.items.length}</span>
                </div>
                {group.warning && <div className="privacy-note">{group.warning}</div>}
                <div className="checklist-grid">
                  {group.items.map((item) => (
                    <label key={item.id} className="checklist-item">
                      <input type="checkbox" checked={Boolean(state.checklistCompletions[item.id])} onChange={() => toggleChecklistItem(item.id)} />
                      <span>{item.label}<br /><small className="health-muted">{item.evidenceSkill}</small></span>
                    </label>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2>Operational primers</h2>
        <div className="health-plan-grid">
          {fieldOpsPrimers.map((primer) => (
            <article key={primer.id} className="mini-card">
              <div className="skill-card-header">
                <h3>{primer.title}</h3>
                <span className={primer.priority === 'high' ? 'status-chip error' : primer.priority === 'medium' ? 'status-chip warn' : 'status-chip info'}>{primer.priority}</span>
              </div>
              <p>{primer.summary}</p>
              <ol>
                {primer.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <div className="privacy-note">{primer.guardrail}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Email/chat backlog intake</h2>
        <p>Convert messy external suggestions into safe product ideas before they enter the build queue.</p>
        <form onSubmit={addBacklogItem} className="quick-capture-form">
          <div className="field-ops-form-grid">
            <label>
              Type
              <select value={backlogType} onChange={(event) => setBacklogType(event.target.value as FieldOpsBacklogType)}>
                <option value="workflow">Workflow</option>
                <option value="knowledge">Knowledge</option>
                <option value="training">Training</option>
                <option value="privacy-risk">Privacy risk</option>
                <option value="discard">Discard</option>
              </select>
            </label>
            <label>
              Build size
              <select value={buildSize} onChange={(event) => setBuildSize(event.target.value as FieldOpsBuildSize)}>
                <option value="tiny">Tiny</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
          </div>
          <label>
            Safe user story
            <textarea value={safeStory} onChange={(event) => setSafeStory(event.target.value)} placeholder="As a technician, I want a generic workflow for..." required />
          </label>
          <label>
            Privacy review
            <textarea value={privacyReview} onChange={(event) => setPrivacyReview(event.target.value)} placeholder="What data is not allowed, what stays local, and what must be sanitized?" />
          </label>
          <button type="submit">Add safe backlog item</button>
        </form>
        <div className="health-plan-grid">
          {state.backlogItems.length ? state.backlogItems.slice(0, 6).map((item) => (
            <article key={item.id} className="mini-card">
              <div className="metric-row">
                <span className="status-chip info">{item.type}</span>
                <span className="status-chip warn">{item.buildSize}</span>
              </div>
              <p><strong>{item.safeStory}</strong></p>
              <p>{item.privacyReview}</p>
              <button type="button" className="small-action" onClick={() => removeBacklogItem(item.id)}>Remove</button>
            </article>
          )) : (
            <article className="mini-card">
              <h3>No backlog intake items yet</h3>
              <p>Add only sanitized, generic product ideas. Keep raw source exports outside GitHub.</p>
            </article>
          )}
        </div>
      </section>

      <section className="card">
        <div className="skill-card-header">
          <div>
            <h2>Evidence-friendly field summary</h2>
            <p>Copy this into the Evidence Pack or a manager-safe note when you want to show process growth without operational detail.</p>
          </div>
          <button type="button" onClick={() => copyText('Field Ops evidence', evidenceMarkdown)}>Copy Markdown</button>
        </div>
        <pre className="template-box">{evidenceMarkdown}</pre>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="mini-card">
      <h3>{value}</h3>
      <p>{label}</p>
    </article>
  );
}

const riskyChangeKeywords = [
  'migration',
  'delete',
  'deletion',
  'policy',
  'firewall',
  'dns',
  'backup',
  'restore',
  'mfa',
  'conditional access',
  'intune',
  'registry',
  'script',
  'production',
  'tenant',
  'licensing'
];

function detectChangeRisk(text: string) {
  const normalized = text.toLowerCase();
  return riskyChangeKeywords.filter((keyword) => normalized.includes(keyword));
}

function buildChangeGuardrailNote(input: {
  title: string;
  approval: string;
  affectedSystems: string;
  beforeState: string;
  rollbackPlan: string;
  verificationPlan: string;
  communicationPlan: string;
  seniorCheck: boolean;
  riskMatches: string[];
}) {
  const approvalMissing = !input.approval.trim() || !input.seniorCheck;
  const rollbackMissing = !input.rollbackPlan.trim();
  const beforeStateMissing = !input.beforeState.trim();
  const verdict = approvalMissing || rollbackMissing || beforeStateMissing
    ? 'STOP: do not proceed until approval, before-state evidence, and rollback are clear.'
    : 'READY FOR REVIEW: all core guardrail fields are captured; confirm with senior direction before live action.';

  return [
    '# Change Guardrail Note',
    '',
    `Change: ${input.title || '[generic change summary]'}`,
    `Approval / owner: ${input.approval || '[approval not captured]'}`,
    `Senior check confirmed: ${input.seniorCheck ? 'yes' : 'no'}`,
    `Risk keywords: ${input.riskMatches.length ? input.riskMatches.join(', ') : 'none detected from generic text'}`,
    '',
    '## Scope',
    input.affectedSystems || '[affected systems, users, billing, and business impact not captured]',
    '',
    '## Before-state evidence',
    input.beforeState || '[before-state evidence not captured]',
    '',
    '## Rollback plan',
    input.rollbackPlan || '[rollback plan not captured]',
    '',
    '## Verification plan',
    input.verificationPlan || '[verification plan not captured]',
    '',
    '## Communication plan',
    input.communicationPlan || '[communication plan not captured]',
    '',
    `Decision: ${verdict}`,
    '',
    'Privacy: remove client names, private ticket text, emails, IPs, hostnames, screenshots, passwords, and internal URLs before sharing.'
  ].join('\n');
}

export default FieldOps;
