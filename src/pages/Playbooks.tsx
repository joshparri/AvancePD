import { FormEvent, useState } from 'react';
import type { KnowledgeEntry, Playbook, WorkLog } from '../types';

type PlaybooksProps = {
  playbooks: Playbook[];
  workLogs: WorkLog[];
  knowledgeEntries: KnowledgeEntry[];
  addPlaybook: (playbook: Playbook) => void;
  updatePlaybook: (playbook: Playbook) => void;
  deletePlaybook: (playbookId: string) => void;
};

function Playbooks({ playbooks, workLogs, knowledgeEntries, addPlaybook, updatePlaybook, deletePlaybook }: PlaybooksProps) {
  const [editingPlaybookId, setEditingPlaybookId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [firstChecks, setFirstChecks] = useState('');
  const [deeperChecks, setDeeperChecks] = useState('');
  const [escalation, setEscalation] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlaybooks = playbooks.filter((playbook) => {
    const haystack = [
      playbook.title,
      playbook.symptoms.join(' '),
      playbook.firstChecks.join(' '),
      playbook.deeperChecks.join(' '),
      playbook.escalation,
      playbook.notes
    ].join(' ').toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });
  const generatedDrafts = getPlaybookDrafts(workLogs, knowledgeEntries);

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
        <h2>Suggested playbook drafts</h2>
        {generatedDrafts.length ? (
          <div className="health-plan-grid">
            {generatedDrafts.map((draft) => (
              <article key={draft.title} className="mini-card">
                <h3>{draft.title}</h3>
                <p>{draft.notes}</p>
                <button type="button" onClick={() => addPlaybook(draft)}>Create draft playbook</button>
              </article>
            ))}
          </div>
        ) : (
          <p>No repeated safe tags yet. Add generic work log tags to generate draft playbook ideas.</p>
        )}
      </section>

      <section className="card">
        <h2>All playbooks</h2>
        <label className="inline-control">
          Search playbooks
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search issue, symptom, check, or escalation" />
        </label>
        {filteredPlaybooks.length ? (
          <ul>
            {filteredPlaybooks.map((playbook) => (
              <li key={playbook.id} style={{ marginBottom: '16px' }}>
                <strong>{playbook.title}</strong>
                {playbook.draft && <span className="status-chip warn">draft</span>}
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
            <p>{playbooks.length ? 'No playbooks match that search.' : 'No playbooks created yet.'}</p>
            <p><em>Document repeatable troubleshooting processes and generic troubleshooting procedures using the form above.</em></p>
          </div>
        )}
      </section>
    </div>
  );
}

function getPlaybookDrafts(workLogs: WorkLog[], knowledgeEntries: KnowledgeEntry[]): Playbook[] {
  const counts = workLogs.reduce<Record<string, number>>((acc, log) => {
    log.tags.forEach((tag) => {
      const normalized = tag.trim().toLowerCase();
      if (!normalized) return;
      acc[normalized] = (acc[normalized] ?? 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(counts)
    .filter(([, count]) => count > 1)
    .slice(0, 3)
    .map(([tag]) => {
      const relatedKnowledge = knowledgeEntries.filter((entry) => entry.tags.map((item) => item.toLowerCase()).includes(tag));
      return {
        id: `pb-draft-${tag}-${Date.now()}`,
        title: `${tag} triage draft`,
        symptoms: [`Repeated local tag: ${tag}`],
        firstChecks: relatedKnowledge.length ? relatedKnowledge.map((entry) => entry.summary).slice(0, 3) : ['Confirm scope and impact', 'Collect safe symptoms', 'Check known playbooks or public docs'],
        deeperChecks: ['Review related knowledge entries', 'Escalate if security, data loss, or broad impact is suspected'],
        escalation: 'Escalate when safe first checks do not explain the issue or risk increases.',
        notes: 'Generated from repeated safe local tags. Review before relying on this playbook.',
        relatedKnowledgeIds: relatedKnowledge.map((entry) => entry.id),
        draft: true
      };
    });
}

export default Playbooks;
