import { FormEvent, useMemo, useState } from 'react';
import type { KnowledgeEntry } from '../types';

type KnowledgeProps = {
  entries: KnowledgeEntry[];
  addEntry: (entry: KnowledgeEntry) => void;
  updateEntry: (entry: KnowledgeEntry) => void;
  deleteEntry: (entryId: string) => void;
};

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function Knowledge({ entries, addEntry, updateEntry, deleteEntry }: KnowledgeProps) {
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [noteType, setNoteType] = useState<KnowledgeEntry['noteType']>('reference');
  const [tags, setTags] = useState('');
  const [confidence, setConfidence] = useState<KnowledgeEntry['confidence']>('medium');
  const [sourceType, setSourceType] = useState<KnowledgeEntry['sourceType']>('personal');
  const [trusted, setTrusted] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter((entry) => {
    const haystack = [
      entry.title,
      entry.summary,
      entry.body,
      entry.category,
      entry.noteType ?? '',
      entry.tags.join(' ')
    ].join(' ').toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  const resetForm = () => {
    setEditingEntryId(null);
    setTitle('');
    setSummary('');
    setBody('');
    setCategory('');
    setNoteType('reference');
    setTags('');
    setConfidence('medium');
    setSourceType('personal');
    setTrusted(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tagList = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    const normalizedTags = noteType === 'learned today' && !tagList.includes('learned today')
      ? ['learned today', ...tagList]
      : tagList;

    const entry: KnowledgeEntry = {
      id: editingEntryId || createId('kn'),
      title: title || 'New knowledge entry',
      summary: summary || 'Captured during shift.',
      body: body || 'Detailed notes about this issue.',
      category: category || 'General',
      noteType,
      tags: normalizedTags,
      confidence,
      lastVerified: new Date().toISOString().slice(0, 10),
      clientId: undefined,
      sourceType,
      trusted,
      createdAt: new Date().toISOString()
    };

    if (editingEntryId) {
      updateEntry(entry);
    } else {
      addEntry(entry);
    }

    resetForm();
  };

  const startEditing = (entry: KnowledgeEntry) => {
    setEditingEntryId(entry.id);
    setTitle(entry.title);
    setSummary(entry.summary);
    setBody(entry.body);
    setCategory(entry.category);
    setNoteType(entry.noteType ?? 'reference');
    setTags(entry.tags.join(', '));
    setConfidence(entry.confidence);
    setSourceType(entry.sourceType);
    setTrusted(entry.trusted);
  };

  return (
    <div>
      <section className="card">
        <h1>Knowledge</h1>
        <p>Capture trusted notes and recurring issue references.</p>
      </section>
      <section className="card">
        <h2>{editingEntryId ? 'Edit knowledge entry' : 'Add knowledge entry'}</h2>
        <form onSubmit={handleSubmit} className="quick-capture-form">
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Issue or solution title" />
          </label>
          <label>
            Summary
            <input value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Brief description" />
          </label>
          <label>
            Body
            <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Detailed notes and steps" />
          </label>
          <label>
            Category
            <input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Email, Printer, Wi-Fi, etc." />
          </label>
          <label>
            Note type
            <select value={noteType} onChange={(event) => setNoteType(event.target.value as KnowledgeEntry['noteType'])}>
              <option value="reference">reference</option>
              <option value="learned today">learned today</option>
            </select>
          </label>
          <label>
            Tags
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="comma-separated" />
          </label>
          <label>
            Confidence
            <select value={confidence} onChange={(event) => setConfidence(event.target.value as KnowledgeEntry['confidence'])}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label>
            Source type
            <select value={sourceType} onChange={(event) => setSourceType(event.target.value as KnowledgeEntry['sourceType'])}>
              <option value="personal">personal</option>
              <option value="public">public</option>
              <option value="assumption">assumption</option>
              <option value="tested fix">tested fix</option>
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={trusted} onChange={(event) => setTrusted(event.target.checked)} />
            Trusted
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button type="submit">{editingEntryId ? 'Save entry' : 'Add entry'}</button>
            {editingEntryId && (
              <button type="button" onClick={resetForm} style={{ background: '#64748b' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>All knowledge entries</h2>
        <label className="inline-control">
          Search knowledge
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search title, tag, category, or note type" />
        </label>
        {filteredEntries.length ? (
          <ul>
            {filteredEntries.map((entry) => (
              <li key={entry.id} style={{ marginBottom: '16px' }}>
                <strong>{entry.title}</strong>
                <p>
                  {entry.confidence} confidence — last verified {entry.lastVerified} — {entry.category}
                </p>
                {entry.noteType === 'learned today' && <span className="status-chip success">learned today</span>}
                <p>{entry.summary}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => startEditing(entry)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteEntry(entry.id)} style={{ background: '#dc2626' }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p>{entries.length ? 'No knowledge entries match that search.' : 'No knowledge entries yet.'}</p>
            <p><em>Add trusted notes about recurring issues, fixes, and MSP insights using the form above.</em></p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Knowledge;
