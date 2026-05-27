import { FormEvent, useMemo, useState } from 'react';
import type { Client, SafeAttachment, WorkLog } from '../types';
import { attachmentPolicyText, downloadAttachment, readSafeAttachment } from '../utils/attachments';

type WorkLogsProps = {
  workLogs: WorkLog[];
  clients: Client[];
  addWorkLog: (log: WorkLog) => void;
  updateWorkLog: (log: WorkLog) => void;
  deleteWorkLog: (logId: string) => void;
};

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function WorkLogs({ workLogs, clients, addWorkLog, updateWorkLog, deleteWorkLog }: WorkLogsProps) {
  const clientOptions = useMemo(() => clients, [clients]);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
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
    </div>
  );
}

export default WorkLogs;
