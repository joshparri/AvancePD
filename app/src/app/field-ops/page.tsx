'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ClipboardList, Radar, ShieldCheck, Wrench } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  type PendingActionOwner,
} from '@/lib/fieldOps';

export default function FieldOpsPage() {
  const [state, setState] = useState<FieldOpsState>(loadFieldOpsState);
  const [copyMessage, setCopyMessage] = useState('');
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

  const copyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} copied.`);
    } catch {
      setCopyMessage(`Could not copy ${label}. Select the text manually if needed.`);
    }
  };

  const addPendingAction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanAction = actionRequired.trim();
    if (!cleanAction) return;

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
          createdAt: new Date().toISOString(),
        },
        ...current.pendingActions,
      ],
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
      ),
    }));
  };

  const removeAction = (actionId: string) => {
    if (!window.confirm('Remove this local pending action?')) return;
    setState((current) => ({
      ...current,
      pendingActions: current.pendingActions.filter((action) => action.id !== actionId),
    }));
  };

  const toggleChecklistItem = (itemId: string) => {
    setState((current) => ({
      ...current,
      checklistCompletions: {
        ...current.checklistCompletions,
        [itemId]: !current.checklistCompletions[itemId],
      },
    }));
  };

  const addBacklogItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanStory = safeStory.trim();
    if (!cleanStory) return;

    setState((current) => ({
      ...current,
      backlogItems: [
        {
          id: createFieldOpsId('backlog'),
          type: backlogType,
          safeStory: cleanStory,
          privacyReview: privacyReview.trim() || 'No private data required; use generic examples only.',
          buildSize,
          createdAt: new Date().toISOString(),
        },
        ...current.backlogItems,
      ],
    }));
    setBacklogType('workflow');
    setSafeStory('');
    setPrivacyReview('');
    setBuildSize('small');
  };

  const removeBacklogItem = (itemId: string) => {
    if (!window.confirm('Remove this local backlog intake item?')) return;
    setState((current) => ({
      ...current,
      backlogItems: current.backlogItems.filter((item) => item.id !== itemId),
    }));
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card className="overflow-hidden border-slate-800 bg-slate-950 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <ShieldCheck className="h-7 w-7 text-cyan-400" />
                Field Ops Cockpit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="max-w-4xl text-sm leading-6 text-slate-300">
                A privacy-safe operating surface for stalled follow-ups, monitoring alerts, onsite work, change guardrails, reusable primers, and evidence-friendly field habits.
              </p>
              <div className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 p-4 text-sm text-cyan-50">
                Local-only by design. Do not enter client names, emails, IP addresses, hostnames, passwords, internal URLs, screenshots, or copied ticket text.
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={() => document.getElementById('pending-action-text')?.focus()}>
                  Add follow-up
                </Button>
                <Button type="button" variant="outline" className="border-cyan-400/60 bg-transparent text-white hover:bg-cyan-400/10" onClick={() => document.getElementById('monitoring-alert-input')?.focus()}>
                  Sanitize alert
                </Button>
                <Button type="button" variant="outline" className="border-cyan-400/60 bg-transparent text-white hover:bg-cyan-400/10" onClick={() => copyText('Field Ops evidence', evidenceMarkdown)}>
                  Copy evidence
                </Button>
              </div>
            </CardContent>
          </Card>

          <section className="grid gap-4 md:grid-cols-4">
            <Metric label="Active pending actions" value={activeActions.length} />
            <Metric label="Completed pending actions" value={evidenceSummary.completedPendingActions.length} />
            <Metric label="Checklist items completed" value={evidenceSummary.completedChecklistItems.length} />
            <Metric label="Safe backlog ideas" value={state.backlogItems.length} />
          </section>
          {copyMessage && <p className="text-sm text-green-700 dark:text-green-300">{copyMessage}</p>}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-cyan-500" />
                Pending Action Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">Use this when a ticket is waiting on a client, vendor, teammate, senior review, or your next action.</p>
              <form onSubmit={addPendingAction} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Label className="space-y-2">
                    <span>Safe reference</span>
                    <Input value={ticketRef} onChange={(event) => setTicketRef(event.target.value)} placeholder="Ticket ID or generic local reference" />
                  </Label>
                  <Label className="space-y-2">
                    <span>Waiting on</span>
                    <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={actionOwner} onChange={(event) => setActionOwner(event.target.value as PendingActionOwner)}>
                      <option value="client">Client</option>
                      <option value="vendor">Vendor</option>
                      <option value="teammate">Teammate</option>
                      <option value="senior">Senior tech</option>
                      <option value="self">Self</option>
                    </select>
                  </Label>
                  <Label className="space-y-2">
                    <span>Follow-up due</span>
                    <Input type="datetime-local" value={followUpDue} onChange={(event) => setFollowUpDue(event.target.value)} />
                  </Label>
                </div>
                <Label className="space-y-2">
                  <span>Generic action required</span>
                  <Textarea
                    id="pending-action-text"
                    value={actionRequired}
                    onChange={(event) => setActionRequired(event.target.value)}
                    placeholder="Example: Vendor needs to confirm remote access window. No names, emails, or copied ticket text."
                    required
                  />
                </Label>
                <Button type="submit">Save pending action</Button>
              </form>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold">Active follow-ups</h3>
                  {activeActions.length ? activeActions.map((action) => (
                    <div key={action.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{action.owner}</Badge>
                        <strong>{action.ticketRef}</strong>
                      </div>
                      <p className="text-sm leading-6">{action.actionRequired}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Due {formatDateTime(action.dueAt)}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" type="button" onClick={() => markActionComplete(action.id)}>Mark complete</Button>
                        <Button size="sm" variant="outline" type="button" onClick={() => copyText('Pending action note', buildPendingActionNote(action))}>Copy note</Button>
                        <Button size="sm" variant="outline" type="button" onClick={() => removeAction(action.id)}>Remove</Button>
                      </div>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">No active pending actions. Add one when the next step leaves your hands.</p>}
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Recently completed</h3>
                  {completedActions.length ? (
                    <ul className="space-y-2 text-sm">
                      {completedActions.map((action) => (
                        <li key={action.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">{action.actionRequired}</li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-muted-foreground">No completed local pending actions yet.</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radar className="h-5 w-5 text-cyan-500" />
                Monitoring Alert Sanitizer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <Label className="space-y-2">
                  <span>Raw alert text</span>
                  <Textarea
                    id="monitoring-alert-input"
                    className="min-h-72"
                    value={rawAlert}
                    onChange={(event) => setRawAlert(event.target.value)}
                    placeholder="Paste alert text here. It stays in component state and is not saved."
                  />
                </Label>
                <div className="space-y-3">
                  <h3 className="font-semibold">Sanitized preview</h3>
                  <pre className="min-h-72 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-50">
                    {sanitizedAlert.sanitizedText || 'Sanitized alert preview will appear here.'}
                  </pre>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sanitizedAlert.replacements).map(([label, count]) => (
                      <Badge key={label} variant="outline">{label}: {count}</Badge>
                    ))}
                    {!Object.keys(sanitizedAlert.replacements).length && <Badge variant="outline">No replacements yet</Badge>}
                  </div>
                  {sanitizedAlert.remainingWarnings.length > 0 && (
                    <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-100">
                      <div className="mb-2 flex items-center gap-2 font-semibold">
                        <AlertTriangle className="h-4 w-4" />
                        Manual review needed
                      </div>
                      <ul className="list-disc space-y-1 pl-5">
                        {sanitizedAlert.remainingWarnings.map((warning) => <li key={warning}>{warning}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" disabled={!sanitizedAlert.sanitizedText} onClick={() => copyText('Sanitized alert', sanitizedAlert.sanitizedText)}>Copy sanitized text</Button>
                    <Button type="button" variant="outline" disabled={!sanitizedAlert.sanitizedText} onClick={() => setSelectedTriagePathId(recommendedTriage.id)}>Use recommended path</Button>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm">
                Recommended triage: <strong>{recommendedTriage.title}</strong> - {recommendedTriage.priority} priority. Check {recommendedTriage.firstSystem} first.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Alert Triage Paths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Label className="space-y-2">
                <span>Alert type</span>
                <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={selectedTriagePathId} onChange={(event) => setSelectedTriagePathId(event.target.value)}>
                  {alertTriagePaths.map((path) => <option key={path.id} value={path.id}>{path.title}</option>)}
                </select>
              </Label>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{selectedTriage.title}</h3>
                    <Badge variant="outline">{selectedTriage.priority} priority</Badge>
                    <Badge variant="outline">{selectedTriage.firstSystem}</Badge>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{selectedTriage.summary}</p>
                  <ol className="list-decimal space-y-2 pl-5 text-sm leading-6">
                    {selectedTriage.firstChecks.map((check) => <li key={check}>{check}</li>)}
                  </ol>
                  <div className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                    <strong>Escalation condition</strong>
                    <p>{selectedTriage.escalationCondition}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Ticket note scaffold</h3>
                  <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-50">{selectedTriage.noteScaffold}</pre>
                  <Button type="button" onClick={() => copyText('Triage note scaffold', selectedTriage.noteScaffold)}>Copy scaffold</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Field Checklists</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Use these as safe, generic workflow scaffolds. Checked items persist locally and can feed the Evidence Pack.</p>
              <div className="grid gap-4 xl:grid-cols-2">
                {fieldOpsChecklistGroups.map((group) => {
                  const completedCount = group.items.filter((item) => state.checklistCompletions[item.id]).length;
                  return (
                    <div key={group.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{group.title}</h3>
                          <p className="text-sm text-muted-foreground">{group.purpose}</p>
                        </div>
                        <Badge variant="outline">{completedCount}/{group.items.length}</Badge>
                      </div>
                      {group.warning && <div className="mb-3 rounded-md border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm">{group.warning}</div>}
                      <div className="grid gap-2">
                        {group.items.map((item) => (
                          <Label key={item.id} className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                            <input type="checkbox" checked={Boolean(state.checklistCompletions[item.id])} onChange={() => toggleChecklistItem(item.id)} className="mt-1" />
                            <span>{item.label}<br /><span className="text-xs text-muted-foreground">{item.evidenceSkill}</span></span>
                          </Label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-cyan-500" />
                Operational Primers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                {fieldOpsPrimers.map((primer) => (
                  <div key={primer.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{primer.title}</h3>
                      <Badge variant="outline">{primer.priority}</Badge>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{primer.summary}</p>
                    <ol className="list-decimal space-y-2 pl-5 text-sm leading-6">
                      {primer.steps.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                    <div className="mt-3 rounded-md border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm">{primer.guardrail}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email/Chat Backlog Intake</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={addBacklogItem} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Label className="space-y-2">
                    <span>Type</span>
                    <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={backlogType} onChange={(event) => setBacklogType(event.target.value as FieldOpsBacklogType)}>
                      <option value="workflow">Workflow</option>
                      <option value="knowledge">Knowledge</option>
                      <option value="training">Training</option>
                      <option value="privacy-risk">Privacy risk</option>
                      <option value="discard">Discard</option>
                    </select>
                  </Label>
                  <Label className="space-y-2">
                    <span>Build size</span>
                    <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={buildSize} onChange={(event) => setBuildSize(event.target.value as FieldOpsBuildSize)}>
                      <option value="tiny">Tiny</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </Label>
                </div>
                <Label className="space-y-2">
                  <span>Safe user story</span>
                  <Textarea value={safeStory} onChange={(event) => setSafeStory(event.target.value)} placeholder="As a technician, I want a generic workflow for..." required />
                </Label>
                <Label className="space-y-2">
                  <span>Privacy review</span>
                  <Textarea value={privacyReview} onChange={(event) => setPrivacyReview(event.target.value)} placeholder="What data is not allowed, what stays local, and what must be sanitized?" />
                </Label>
                <Button type="submit">Add safe backlog item</Button>
              </form>
              <div className="grid gap-4 lg:grid-cols-3">
                {state.backlogItems.length ? state.backlogItems.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge variant="outline">{item.buildSize}</Badge>
                    </div>
                    <p className="text-sm font-medium">{item.safeStory}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.privacyReview}</p>
                    <Button size="sm" variant="outline" type="button" className="mt-3" onClick={() => removeBacklogItem(item.id)}>Remove</Button>
                  </div>
                )) : (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
                    No backlog intake items yet. Add only sanitized, generic product ideas.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence-Friendly Field Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Copy this into the Evidence Pack or a manager-safe note when you want to show process growth without operational detail.</p>
              <Button type="button" onClick={() => copyText('Field Ops evidence', evidenceMarkdown)}>Copy Markdown</Button>
              <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-50">{evidenceMarkdown}</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-2xl font-bold text-slate-950 dark:text-white">{value}</div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
