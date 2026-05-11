import { FormEvent, useState } from 'react';
import type { Playbook } from '../types';

type PlaybooksProps = {
  playbooks: Playbook[];
  addPlaybook: (playbook: Playbook) => void;
  updatePlaybook: (playbook: Playbook) => void;
  deletePlaybook: (playbookId: string) => void;
};

function Playbooks({ playbooks, addPlaybook, updatePlaybook, deletePlaybook }: PlaybooksProps) {
  const [editingPlaybookId, setEditingPlaybookId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [firstChecks, setFirstChecks] = useState('');
  const [deeperChecks, setDeeperChecks] = useState('');
  const [escalation, setEscalation] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setEditingPlaybookId(null);
    setTitle('');
    setSymptoms('');
    setFirstChecks('');
    setDeeperChecks('');
    setEscalation('');
    setNotes('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const playbook: Playbook = {
      id: editingPlaybookId || `pb-${Date.now()}`,
      title: title || 'New playbook',
      symptoms: symptoms.split('\n').map(s => s.trim()).filter(Boolean),
      firstChecks: firstChecks.split('\n').map(s => s.trim()).filter(Boolean),
      deeperChecks: deeperChecks.split('\n').map(s => s.trim()).filter(Boolean),
      escalation: escalation || 'Escalate to next level support.',
      notes: notes || 'Field-tested troubleshooting steps.',
      relatedKnowledgeIds: []
    };

    if (editingPlaybookId) {
      updatePlaybook(playbook);
    } else {
      addPlaybook(playbook);
    }

    resetForm();
  };

  const startEditing = (playbook: Playbook) => {
    setEditingPlaybookId(playbook.id);
    setTitle(playbook.title);
    setSymptoms(playbook.symptoms.join('\n'));
    setFirstChecks(playbook.firstChecks.join('\n'));
    setDeeperChecks(playbook.deeperChecks.join('\n'));
    setEscalation(playbook.escalation);
    setNotes(playbook.notes);
  };

  return (
    <div>
      <section className="card">
        <h1>Playbooks</h1>
        <p>Store repeat issue troubleshooting and field-tested responses.</p>
      </section>
      <section className="card">
        <h2>{editingPlaybookId ? 'Edit playbook' : 'Add playbook'}</h2>
        <form onSubmit={handleSubmit} className="quick-capture-form">
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Issue or scenario name" />
          </label>
          <label>
            Symptoms (one per line)
            <textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} placeholder="Signs that indicate this issue" />
          </label>
          <label>
            First checks (one per line)
            <textarea value={firstChecks} onChange={(event) => setFirstChecks(event.target.value)} placeholder="Initial troubleshooting steps" />
          </label>
          <label>
            Deeper checks (one per line)
            <textarea value={deeperChecks} onChange={(event) => setDeeperChecks(event.target.value)} placeholder="Advanced diagnostic steps" />
          </label>
          <label>
            Escalation
            <textarea value={escalation} onChange={(event) => setEscalation(event.target.value)} placeholder="When and how to escalate" />
          </label>
          <label>
            Notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Additional context and tips" />
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button type="submit">{editingPlaybookId ? 'Save playbook' : 'Add playbook'}</button>
            {editingPlaybookId && (
              <button type="button" onClick={resetForm} style={{ background: '#64748b' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>All playbooks</h2>
        {playbooks.length ? (
          <ul>
            {playbooks.map((playbook) => (
              <li key={playbook.id} style={{ marginBottom: '16px' }}>
                <strong>{playbook.title}</strong>
                <p>{playbook.notes}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => startEditing(playbook)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deletePlaybook(playbook.id)} style={{ background: '#dc2626' }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p>No playbooks created yet.</p>
            <p><em>Document repeatable troubleshooting processes and client-specific procedures using the form above.</em></p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Playbooks;
