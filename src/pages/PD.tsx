import { FormEvent, useState } from 'react';
import type { LearningItem } from '../types';

type PDProps = {
  learningItems: LearningItem[];
  addLearningItem: (item: LearningItem) => void;
  updateLearningItem: (item: LearningItem) => void;
  deleteLearningItem: (itemId: string) => void;
};

function PD({ learningItems, addLearningItem, updateLearningItem, deleteLearningItem }: PDProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [confidence, setConfidence] = useState<LearningItem['confidence']>('low');
  const [notes, setNotes] = useState('');
  const [seenInRealWork, setSeenInRealWork] = useState(true);
  const [askTeam, setAskTeam] = useState(false);
  const [nextReviewDate, setNextReviewDate] = useState('');

  const resetForm = () => {
    setEditingItemId(null);
    setTopic('');
    setConfidence('low');
    setNotes('');
    setSeenInRealWork(true);
    setAskTeam(false);
    setNextReviewDate('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const item: LearningItem = {
      id: editingItemId || `learn-${Date.now()}`,
      topic: topic || 'New MSP note',
      confidence,
      notes: notes || 'Captured during shift.',
      seenInRealWork,
      askTeam,
      nextReviewDate: nextReviewDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    };

    if (editingItemId) {
      updateLearningItem(item);
    } else {
      addLearningItem(item);
    }

    resetForm();
  };

  const startEditing = (item: LearningItem) => {
    setEditingItemId(item.id);
    setTopic(item.topic);
    setConfidence(item.confidence);
    setNotes(item.notes);
    setSeenInRealWork(item.seenInRealWork);
    setAskTeam(item.askTeam);
    setNextReviewDate(item.nextReviewDate);
  };

  return (
    <div>
      <section className="card">
        <h1>Professional Development</h1>
        <p>Turn shift work into MSP skill growth and review.</p>
      </section>
      <section className="card">
        <h2>{editingItemId ? 'Edit learning note' : 'Add learning note'}</h2>
        <form onSubmit={handleSubmit} className="quick-capture-form">
          <label>
            Topic
            <input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Example: Microsoft Teams troubleshooting" />
          </label>
          <label>
            Notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What did you learn or observe?" />
          </label>
          <label>
            Confidence
            <select value={confidence} onChange={(event) => setConfidence(event.target.value as LearningItem['confidence'])}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label>
            Review date
            <input type="date" value={nextReviewDate} onChange={(event) => setNextReviewDate(event.target.value)} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={seenInRealWork} onChange={(event) => setSeenInRealWork(event.target.checked)} />
            Seen in real work
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={askTeam} onChange={(event) => setAskTeam(event.target.checked)} />
            Ask team
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button type="submit">{editingItemId ? 'Save note' : 'Add note'}</button>
            {editingItemId && (
              <button type="button" onClick={resetForm} style={{ background: '#64748b' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
      <section className="card">
        <h2>All MSP notes</h2>
        {learningItems.length ? (
          <ul>
            {learningItems.map((item) => (
              <li key={item.id} style={{ marginBottom: '16px' }}>
                <strong>{item.topic}</strong>
                <p>
                  confidence: {item.confidence} — next review {item.nextReviewDate}
                </p>
                <p>{item.notes}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => startEditing(item)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteLearningItem(item.id)} style={{ background: '#dc2626' }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p>No learning notes yet.</p>
            <p><em>Capture MSP insights, new techniques, and professional development using the form above.</em></p>
          </div>
        )}
      </section>
    </div>
  );
}

export default PD;
