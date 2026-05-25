import { FormEvent, useState } from 'react';
import type { KnowledgeEntry, LearningItem } from '../types';

type PDProps = {
  learningItems: LearningItem[];
  addLearningItem: (item: LearningItem) => void;
  updateLearningItem: (item: LearningItem) => void;
  deleteLearningItem: (itemId: string) => void;
  addKnowledgeEntry: (entry: KnowledgeEntry) => void;
};

function PD({ learningItems, addLearningItem, updateLearningItem, deleteLearningItem, addKnowledgeEntry }: PDProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [noteType, setNoteType] = useState<LearningItem['noteType']>('learning');
  const [confidence, setConfidence] = useState<LearningItem['confidence']>('low');
  const [notes, setNotes] = useState('');
  const [seenInRealWork, setSeenInRealWork] = useState(true);
  const [askTeam, setAskTeam] = useState(false);
  const [evidenceWorthy, setEvidenceWorthy] = useState(false);
  const [nextReviewDate, setNextReviewDate] = useState('');

  const resetForm = () => {
    setEditingItemId(null);
    setTopic('');
    setNoteType('learning');
    setConfidence('low');
    setNotes('');
    setSeenInRealWork(true);
    setAskTeam(false);
    setEvidenceWorthy(false);
    setNextReviewDate('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const item: LearningItem = {
      id: editingItemId || `learn-${Date.now()}`,
      topic: topic || 'New MSP note',
      noteType,
      confidence,
      notes: notes || 'Captured during shift.',
      seenInRealWork,
      askTeam,
      evidenceWorthy,
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
    setNoteType(item.noteType ?? 'learning');
    setConfidence(item.confidence);
    setNotes(item.notes);
    setSeenInRealWork(item.seenInRealWork);
    setAskTeam(item.askTeam);
    setEvidenceWorthy(item.evidenceWorthy ?? false);
    setNextReviewDate(item.nextReviewDate);
  };

  const dueForReview = learningItems.filter((item) => item.nextReviewDate <= new Date().toISOString().slice(0, 10));

  const nextReviewForConfidence = (itemConfidence: LearningItem['confidence']) => {
    const days = itemConfidence === 'high' ? 30 : itemConfidence === 'medium' ? 14 : 7;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  };

  const markReviewed = (item: LearningItem) => {
    updateLearningItem({
      ...item,
      lastReviewedDate: new Date().toISOString().slice(0, 10),
      nextReviewDate: nextReviewForConfidence(item.confidence)
    });
  };

  const startShiftReview = () => {
    setEditingItemId(null);
    setTopic('Avance shift review');
    setNoteType('shift review');
    setConfidence('medium');
    setNotes([
      'What did I practise today?',
      'What did I handle more independently than last time?',
      'What did I need help with?',
      'What should I review before the next shift?',
      'What is safe to include in my Evidence Pack?'
    ].join('\n'));
    setSeenInRealWork(true);
    setAskTeam(false);
    setEvidenceWorthy(true);
    setNextReviewDate(nextReviewForConfidence('medium'));
  };

  const convertToKnowledge = (item: LearningItem) => {
    addKnowledgeEntry({
      id: `kn-from-${item.id}-${Date.now()}`,
      title: item.topic,
      summary: item.notes.slice(0, 160) || 'Converted from learning note.',
      body: item.notes || 'Converted from learning note.',
      category: 'Professional development',
      noteType: item.noteType === 'learned today' ? 'learned today' : 'reference',
      tags: ['learning', item.confidence],
      confidence: item.confidence,
      lastVerified: new Date().toISOString().slice(0, 10),
      sourceType: 'personal',
      trusted: item.confidence !== 'low',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div>
      <section className="card">
        <h1>Professional Development</h1>
        <p>Turn shift work into MSP skill growth and review.</p>
        <button type="button" onClick={startShiftReview}>Start shift review</button>
      </section>
      <section className="card">
        <h2>Due for review</h2>
        {dueForReview.length ? (
          <ul>
            {dueForReview.map((item) => (
              <li key={item.id}>
                <strong>{item.topic}</strong>
                <p>Next review was {item.nextReviewDate}. Review the note, then set the next date based on confidence.</p>
                <button type="button" onClick={() => markReviewed(item)}>Mark reviewed</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No learning notes due today. Keep going steadily.</p>
        )}
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
            Note type
            <select value={noteType} onChange={(event) => setNoteType(event.target.value as LearningItem['noteType'])}>
              <option value="learning">learning</option>
              <option value="learned today">learned today</option>
              <option value="shift review">shift review</option>
            </select>
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
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={evidenceWorthy} onChange={(event) => setEvidenceWorthy(event.target.checked)} />
            Mark as evidence-worthy
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
                {item.noteType && <span className="status-chip info">{item.noteType}</span>}
                {item.evidenceWorthy && <span className="status-chip success">evidence-worthy</span>}
                <p>{item.notes}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => startEditing(item)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => convertToKnowledge(item)}>
                    Convert to knowledge
                  </button>
                  <button type="button" className="small-action" onClick={() => navigator.clipboard?.writeText(`${item.topic}\n\n${item.notes}`)}>
                    Copy safe summary
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
