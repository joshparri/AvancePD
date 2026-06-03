import { useState } from 'react';
import type { KnowledgeEntry, WorkLog, LearningItem } from '../types';

type AfterActionReviewProps = {
  workLog: WorkLog;
  knowledgeEntries: KnowledgeEntry[];
  onSave: (review: AfterActionReviewData) => void;
  onClose: () => void;
};

export type AfterActionReviewData = {
  workLogId: string;
  whatHappened: string;
  whatWasExpected: string;
  whatWelearned: string;
  whatDoWeDoNext: string;
  createdAt: string;
  relatedKnowledgeId?: string;
  createLearningItem?: LearningItem;
  createKnowledgeEntry?: KnowledgeEntry;
};

function AfterActionReview({ workLog, knowledgeEntries, onSave, onClose }: AfterActionReviewProps) {
  const [whatHappened, setWhatHappened] = useState('');
  const [whatWasExpected, setWhatWasExpected] = useState('');
  const [whatWelearned, setWhatWelearned] = useState('');
  const [whatDoWeDoNext, setWhatDoWeDoNext] = useState('');
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState(workLog.relatedKbId ?? '');
  const [createLearningNote, setCreateLearningNote] = useState(false);
  const [createKnowledgeEntry, setCreateKnowledgeEntry] = useState(false);
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState(`Learned from ${workLog.title}`);
  const [newKnowledgeCategory, setNewKnowledgeCategory] = useState(workLog.skillArea || 'General');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const review: AfterActionReviewData = {
      workLogId: workLog.id,
      whatHappened,
      whatWasExpected,
      whatWelearned,
      whatDoWeDoNext,
      createdAt: new Date().toISOString(),
    };

    if (selectedKnowledgeId) {
      review.relatedKnowledgeId = selectedKnowledgeId;
    }

    if (createLearningNote) {
      review.createLearningItem = {
        id: `learning-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        topic: workLog.skillArea || workLog.title,
        noteType: 'learning',
        confidence: workLog.confidence || 'medium',
        notes: whatWelearned,
        seenInRealWork: true,
        askTeam: false,
        sourceWorkLogId: workLog.id,
        nextReviewDate: workLog.reviewDueAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    if (createKnowledgeEntry) {
      review.createKnowledgeEntry = {
        id: `kn-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: newKnowledgeTitle || `Learned from ${workLog.title}`,
        summary: whatWelearned || `After Action Review from ${workLog.title}`,
        body: `What happened:\n${whatHappened}\n\nWhat was expected:\n${whatWasExpected}\n\nWhat we learned:\n${whatWelearned}\n\nNext time:\n${whatDoWeDoNext}`,
        category: newKnowledgeCategory || workLog.skillArea || 'General',
        noteType: 'learned today',
        tags: ['learned today', 'after action review'],
        confidence: workLog.confidence || 'medium',
        lastVerified: new Date().toISOString().slice(0, 10),
        sourceType: 'personal',
        trusted: true,
        createdAt: new Date().toISOString(),
        clientId: workLog.clientId,
        attachments: []
      };
    }

    onSave(review);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        <h2>After Action Review</h2>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>
          Reflect on <strong>{workLog.title}</strong> to extract learning and improve next time.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <label>
            What happened? (Describe the situation)
            <textarea
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              placeholder="Describe what occurred and the context..."
              rows={4}
              required
              style={{ minWidth: '100%' }}
            />
          </label>

          <label>
            What was expected? (What should have happened)
            <textarea
              value={whatWasExpected}
              onChange={(e) => setWhatWasExpected(e.target.value)}
              placeholder="Describe what you expected or what the ideal outcome was..."
              rows={3}
              style={{ minWidth: '100%' }}
            />
          </label>

          <label>
            What did we learn? (Key insights)
            <textarea
              value={whatWelearned}
              onChange={(e) => setWhatWelearned(e.target.value)}
              placeholder="What insights, skills, or knowledge did you gain from this experience?"
              rows={4}
              required
              style={{ minWidth: '100%' }}
            />
          </label>

          <label>
            What will we do next time? (Action for improvement)
            <textarea
              value={whatDoWeDoNext}
              onChange={(e) => setWhatDoWeDoNext(e.target.value)}
              placeholder="Specific steps you'll take differently next time..."
              rows={3}
              required
              style={{ minWidth: '100%' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={createLearningNote}
              onChange={(e) => setCreateLearningNote(e.target.checked)}
              style={{ marginTop: '2px' }}
            />
            <span>
              Save as learning note{' '}
              {workLog.skillArea && <span style={{ color: '#64748b' }}>({workLog.skillArea})</span>}
            </span>
          </label>

          <label>
            Link to existing KB entry
            <select
              value={selectedKnowledgeId}
              onChange={(event) => setSelectedKnowledgeId(event.target.value)}
            >
              <option value="">— none —</option>
              {knowledgeEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={createKnowledgeEntry}
              onChange={(e) => setCreateKnowledgeEntry(e.target.checked)}
              style={{ marginTop: '2px' }}
            />
            <span>Create knowledge entry from this review</span>
          </label>

          {createKnowledgeEntry && (
            <div style={{ display: 'grid', gap: '12px', marginLeft: '24px', marginTop: '12px' }}>
              <label>
                KB title
                <input value={newKnowledgeTitle} onChange={(e) => setNewKnowledgeTitle(e.target.value)} />
              </label>
              <label>
                Category
                <input value={newKnowledgeCategory} onChange={(e) => setNewKnowledgeCategory(e.target.value)} />
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: '#64748b' }}
            >
              Cancel
            </button>
            <button type="submit" style={{ background: '#16a34a' }}>
              Save Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AfterActionReview;
