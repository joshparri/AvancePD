import { FormEvent, useMemo, useState } from 'react';
import type { Client, SafeAttachment, WorkLog, LearningItem } from '../types';
import { attachmentPolicyText, downloadAttachment, readSafeAttachment } from '../utils/attachments';
import AfterActionReview, { type AfterActionReviewData } from '../components/AfterActionReview';

type WorkLogsProps = {
  workLogs: WorkLog[];
  clients: Client[];
  addWorkLog: (log: WorkLog) => void;
  updateWorkLog: (log: WorkLog) => void;
  deleteWorkLog: (logId: string) => void;
  addLearningItem?: (item: LearningItem) => void;
};

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function WorkLogs({ workLogs, clients, addWorkLog, updateWorkLog, deleteWorkLog, addLearningItem }: WorkLogsProps) {
  const clientOptions = useMemo(() => clients, [clients]);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [reviewingLogId, setReviewingLogId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [actions, setActions] = useState('');
  const [result, setResult] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [tags, setTags] = useState('');
  const [relatedKbTopic, setRelatedKbTopic] = useState('');
  const [draft, setDraft] = useState(false);
  const [attachments, setAttachments] = useState<SafeAttachment[]>([]);
  const [attachmentStatus, setAttachmentStatus] = useState('');
  // Learning seed fields
  const [workType, setWorkType] = useState('');
  const [skillArea, setSkillArea] = useState('');
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [needsReview, setNeedsReview] = useState(false);
  const [relatedKbId, setRelatedKbId] = useState('');
  const [reviewDueAt, setReviewDueAt] = useState('');
  const [learningNote, setLearningNote] = useState('');

  const resetForm = () => {
    setEditingLogId(null);
    setTitle('');
    setSummary('');
    setActions('');
    setResult('');
    setNextStep('');
    setClientId(clients[0]?.id ?? '');
    setTags('');
    setRelatedKbTopic('');
    setDraft(false);
    setAttachments([]);
    setAttachmentStatus('');
    setWorkType('');
    setSkillArea('');
    setConfidence('medium');
    setNeedsReview(false);
    setRelatedKbId('');
    setReviewDueAt('');
    setLearningNote('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tagList = tags.split(',').map((tag) => tag.trim()).filter(Boolean);

    const log: WorkLog = {
      id: editingLogId || createId('worklog'),
      shiftId: undefined,
      clientId,
      title: title || 'Quick work log',
      summary: summary || 'Captured during shift.',
      actions: actions || 'Captured in quick log.',
      result: result || 'To be reviewed.',
      nextStep: nextStep || 'Check this item in the next shift.',
      tags: tagList,
      relatedKbTopic: relatedKbTopic || undefined,
      draft,
      createdAt: new Date().toISOString(),
      attachments,
      // Learning seed fields
      workType: workType || undefined,
      skillArea: skillArea || undefined,
      confidence: confidence || undefined,
      needsReview,
      relatedKbId: relatedKbId || undefined,
      reviewDueAt: reviewDueAt || undefined,
      learningNote: learningNote || undefined,
    };

    if (editingLogId) {
      updateWorkLog(log);
    } else {
      addWorkLog(log);
    }

    resetForm();
  };

  const startEditing = (log: WorkLog) => {
    setEditingLogId(log.id);
    setTitle(log.title);
    setSummary(log.summary);
    setActions(log.actions);
    setResult(log.result);
    setNextStep(log.nextStep);
    setClientId(log.clientId);
    setTags(log.tags.join(', '));
    setRelatedKbTopic(log.relatedKbTopic ?? '');
    setDraft(log.draft);
    setAttachments(log.attachments ?? []);
    setWorkType(log.workType ?? '');
    setSkillArea(log.skillArea ?? '');
    setConfidence(log.confidence ?? 'medium');
    setNeedsReview(log.needsReview ?? false);
    setRelatedKbId(log.relatedKbId ?? '');
    setReviewDueAt(log.reviewDueAt ?? '');
    setLearningNote(log.learningNote ?? '');
  };

  const handleAttachment = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    try {
      const attachment = await readSafeAttachment(file);
      setAttachments((current) => [...current, attachment]);
      setAttachmentStatus(`Attached ${attachment.name}.`);
    } catch (error) {
      setAttachmentStatus(error instanceof Error ? error.message : 'Could not attach file.');
    }
  };

  const handleAfterActionReviewSave = (review: AfterActionReviewData) => {
    // Find the work log and update it to clear the needsReview flag
    const log = workLogs.find((l) => l.id === review.workLogId);
    if (log) {
      updateWorkLog({
        ...log,
        needsReview: false,
        learningNote: review.whatWelearned,
      });
    }

    // Create learning item if requested
    if (review.createLearningItem && addLearningItem) {
      addLearningItem(review.createLearningItem);
    }

    setReviewingLogId(null);
  };

  return (
    <div>
      <section className="card">
        <h1>Work Logs</h1>
        <p>Document troubleshooting, fixes, and shift activities.</p>
      </section>
      <section className="card">
        <h2>{editingLogId ? 'Edit work log' : 'Add work log'}</h2>
        <form onSubmit={handleSubmit} className="quick-capture-form">
          <label>
            Client
            <select value={clientId} onChange={(event) => setClientId(event.target.value)}>
              {clientOptions.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Issue or activity summary" />
          </label>
          <label>
            Summary
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="What happened?" />
          </label>
          <label>
            Actions taken
            <textarea value={actions} onChange={(event) => setActions(event.target.value)} placeholder="What did you do?" />
          </label>
          <label>
            Result
            <textarea value={result} onChange={(event) => setResult(event.target.value)} placeholder="What was the outcome?" />
          </label>
          <label>
            Next step
            <input value={nextStep} onChange={(event) => setNextStep(event.target.value)} placeholder="Follow-up needed?" />
          </label>
          <label>
            Tags
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="comma-separated" />
          </label>
          <label>
            Related KB topic
            <input value={relatedKbTopic} onChange={(event) => setRelatedKbTopic(event.target.value)} placeholder="Optional KB topic" />
          </label>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px' }}>
            <h3 style={{ marginBottom: '12px' }}>Learning Seed (Optional)</h3>
            <p style={{ color: '#64748b', marginBottom: '12px', fontSize: '0.9em' }}>Mark this work as a learning opportunity for After Action Review and skill tracking.</p>
            <label>
              Work type
              <select value={workType} onChange={(event) => setWorkType(event.target.value)}>
                <option value="">— none —</option>
                <option value="ticket">Ticket</option>
                <option value="client-call">Client Call</option>
                <option value="documentation">Documentation</option>
                <option value="troubleshooting">Troubleshooting</option>
                <option value="deployment">Deployment</option>
                <option value="escalation">Escalation</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Skill area
              <select value={skillArea} onChange={(event) => setSkillArea(event.target.value)}>
                <option value="">— none —</option>
                <option value="Microsoft 365">Microsoft 365</option>
                <option value="Entra ID">Entra ID</option>
                <option value="Intune">Intune</option>
                <option value="Endpoint Management">Endpoint Management</option>
                <option value="Networking">Networking</option>
                <option value="Security">Security</option>
                <option value="Backup/Recovery">Backup/Recovery</option>
                <option value="Communication">Communication</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Confidence before
              <select value={confidence} onChange={(event) => setConfidence(event.target.value as 'low' | 'medium' | 'high')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              Review due date
              <input type="date" value={reviewDueAt} onChange={(event) => setReviewDueAt(event.target.value)} />
            </label>
            <label>
              Learning note
              <textarea value={learningNote} onChange={(event) => setLearningNote(event.target.value)} placeholder="What did you learn? What would you do differently next time?" rows={3} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={needsReview} onChange={(event) => setNeedsReview(event.target.checked)} />
              Mark for After Action Review
            </label>
          </div>
          <label>
            Safe attachment
            <input type="file" accept=".txt,.md,.json,.csv,.pdf,text/plain,text/markdown,application/json,text/csv,application/pdf" onChange={(event) => handleAttachment(event.target.files)} />
          </label>
          <p className="health-muted">{attachmentPolicyText()}</p>
          {attachments.length > 0 && (
            <ul>
              {attachments.map((attachment) => (
                <li key={attachment.id}>
                  {attachment.name} ({Math.round(attachment.size / 1024)} KB, {attachment.type})
                  <button type="button" className="small-action" onClick={() => downloadAttachment(attachment)}>Download</button>
                  <button type="button" className="small-action" onClick={() => {
                    if (window.confirm('Remove this local attachment?')) {
                      setAttachments((current) => current.filter((item) => item.id !== attachment.id));
                    }
                  }}>Remove</button>
                </li>
              ))}
            </ul>
          )}
          {attachmentStatus && <p className="health-muted">{attachmentStatus}</p>}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={draft} onChange={(event) => setDraft(event.target.checked)} />
            Draft (not complete)
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button type="submit">{editingLogId ? 'Save log' : 'Add log'}</button>
            {editingLogId && (
              <button type="button" onClick={resetForm} style={{ background: '#64748b' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>All work logs</h2>
        {workLogs.length ? (
          <ul>
            {workLogs.map((log) => {
              const client = clients.find((item) => item.id === log.clientId);
              return (
                <li key={log.id} style={{ marginBottom: '16px' }}>
                  <strong>{log.title}</strong>
                  <p>
                    {client?.name} — {new Date(log.createdAt).toLocaleDateString()} {log.draft && '(draft)'}
                  </p>
                  <p>{log.summary}</p>
                  {log.relatedKbTopic ? <p><em>KB topic: {log.relatedKbTopic}</em></p> : null}
                  {(log.workType || log.skillArea || log.needsReview) && (
                    <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '4px', marginBottom: '8px', fontSize: '0.9em' }}>
                      {log.workType && <div>📚 Work type: {log.workType}</div>}
                      {log.skillArea && <div>🎯 Skill area: {log.skillArea}</div>}
                      {log.confidence && <div>💪 Confidence: {log.confidence}</div>}
                      {log.reviewDueAt && <div>📅 Review due: {new Date(log.reviewDueAt).toLocaleDateString()}</div>}
                      {log.needsReview && <div className="status-chip warn">⚠️ Needs After Action Review</div>}
                      {log.learningNote && <div style={{ marginTop: '4px', fontStyle: 'italic' }}>{log.learningNote}</div>}
                    </div>
                  )}
                  {log.attachments?.length ? (
                    <div>
                      <p>{log.attachments.length} safe attachment(s)</p>
                      <ul>
                        {log.attachments.map((attachment) => (
                          <li key={attachment.id}>
                            {attachment.name} ({Math.round(attachment.size / 1024)} KB)
                            <button type="button" className="small-action" onClick={() => downloadAttachment(attachment)}>Download</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => startEditing(log)}>
                      Edit
                    </button>
                    {(log.needsReview || log.workType || log.skillArea) && (
                      <button type="button" className="small-action" onClick={() => setReviewingLogId(log.id)} style={{ background: '#f59e0b' }}>
                        📝 After Action Review
                      </button>
                    )}
                    <button type="button" className="small-action" onClick={() => navigator.clipboard?.writeText(`${log.title}\n\nSummary: ${log.summary}\nNext step: ${log.nextStep}`)}>
                      Copy safe summary
                    </button>
                    <button type="button" onClick={() => deleteWorkLog(log.id)} style={{ background: '#dc2626' }}>
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>
            <p>No work logs yet.</p>
            <p><em>Document troubleshooting steps, fixes, and client interactions using the form above.</em></p>
          </div>
        )}
      </section>

      {reviewingLogId && (
        <AfterActionReview
          workLog={workLogs.find((l) => l.id === reviewingLogId)!}
          onSave={handleAfterActionReviewSave}
          onClose={() => setReviewingLogId(null)}
        />
      )}
    </div>
  );
}

export default WorkLogs;
