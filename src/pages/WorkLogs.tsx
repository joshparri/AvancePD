import { FormEvent, useMemo, useState } from 'react';
import type { Client, WorkLog } from '../types';

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
  const [draft, setDraft] = useState(false);

  const resetForm = () => {
    setEditingLogId(null);
    setTitle('');
    setSummary('');
    setActions('');
    setResult('');
    setNextStep('');
    setClientId(clients[0]?.id ?? '');
    setTags('');
    setDraft(false);
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
      createdAt: new Date().toISOString(),
      draft
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
    setDraft(log.draft);
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
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => startEditing(log)}>
                      Edit
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