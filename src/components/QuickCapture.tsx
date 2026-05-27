import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { kbHints } from '../data/kbHints';
import type { Client, LearningItem, Task, WorkLog } from '../types';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type QuickCaptureProps = {
  clients: Client[];
  addWorkLog: (log: WorkLog) => void;
  addTask: (task: Task) => void;
  addLearningItem: (item: LearningItem) => void;
};

const captureOptions = ['work log', 'task', 'learning'] as const;

type CaptureType = (typeof captureOptions)[number];

function QuickCapture({ clients, addWorkLog, addTask, addLearningItem }: QuickCaptureProps) {
  const [captureType, setCaptureType] = useState<CaptureType>('work log');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [tags, setTags] = useState('');
  const [relatedKbTopic, setRelatedKbTopic] = useState('');
  const [ticketPreview, setTicketPreview] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  const clientOptions = useMemo(() => clients, [clients]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'q') {
        event.preventDefault();
        titleInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetForm = () => {
    setTitle('');
    setDetails('');
    setTags('');
    setRelatedKbTopic('');
    setTicketPreview('');
    setNextReviewDate('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tagList = tags.split(',').map((tag) => tag.trim()).filter(Boolean);

    if (captureType === 'work log') {
      addWorkLog({
        id: createId('worklog'),
        shiftId: undefined,
        clientId,
        title: title || 'Quick work log',
        summary: details || 'Captured during shift.',
        actions: 'Captured in quick log.',
        result: 'To be reviewed.',
        nextStep: 'Check this item in the next shift.',
        tags: tagList,
        relatedKbTopic: relatedKbTopic || undefined,
        createdAt: new Date().toISOString(),
        draft: false
      });
    }

    if (captureType === 'task') {
      addTask({
        id: createId('task'),
        title: title || 'Quick follow-up',
        status: 'open',
        dueDate: new Date().toISOString().slice(0, 10),
        priority: 'medium',
        clientId,
        workLogId: undefined,
        note: details || 'Quick task created during shift.',
        createdAt: new Date().toISOString()
      });
    }

    if (captureType === 'learning') {
      addLearningItem({
        id: createId('learn'),
        topic: title || 'New MSP note',
        confidence: 'low',
        notes: details || 'Captured during shift.',
        noteType: captureType === 'learning' ? 'learned today' : 'learning',
        seenInRealWork: true,
        askTeam: false,
        nextReviewDate: nextReviewDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      });
    }

    resetForm();
  };

  const applyPreset = (type: CaptureType, nextTitle: string, nextDetails: string, nextTags = '') => {
    setCaptureType(type);
    setTitle(nextTitle);
    setDetails(nextDetails);
    setTags(nextTags);
    window.setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  return (
    <section className="card">
      <h2>Quick capture</h2>
      <p>Capture a work log, task, or learning note fast.</p>
      <div className="status-button-row">
        <button type="button" className="small-action" onClick={() => applyPreset('task', 'Follow up next shift', 'Check this when the queue is steady.', 'follow-up')}>
          Follow-up
        </button>
        <button type="button" className="small-action" onClick={() => applyPreset('learning', 'Learned today', 'Generic MSP lesson to review later.')}>
          Learned today
        </button>
        <button type="button" className="small-action" onClick={() => applyPreset('work log', 'Quick shift note', 'Generic note captured during shift.', 'shift-note')}>
          Shift note
        </button>
        <button type="button" className="small-action" onClick={() => applyPreset('learning', 'Communication note', 'Paste a cleaned, generic summary only. Remove names, ticket text, signatures, IPs, hostnames, and screenshots.')}>
          Communication note
        </button>
      </div>
      <div className="capture-tabs">
        {captureOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={captureType === option ? 'active' : ''}
            onClick={() => setCaptureType(option)}
          >
            {option}
          </button>
        ))}
      </div>
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
          <input id="quick-capture-title" ref={titleInputRef} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Short summary" />
        </label>
        <label>
          Details
          <textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="What happened?" />
        </label>
        {captureType === 'work log' && (
          <label>
            Related KB topic
            <input
              list="kb-topics"
              value={relatedKbTopic}
              onChange={(event) => setRelatedKbTopic(event.target.value)}
              placeholder="Optional KB topic"
            />
            <datalist id="kb-topics">
              {kbHints.map((hint) => (
                <option key={hint.id} value={hint.title} />
              ))}
            </datalist>
          </label>
        )}
        {captureType === 'learning' ? (
          <label>
            Review date
            <input type="date" value={nextReviewDate} onChange={(event) => setNextReviewDate(event.target.value)} />
          </label>
        ) : (
          <label>
            Tags
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="comma-separated" />
          </label>
        )}
        {captureType === 'work log' && (
          <div className="ticket-preview-panel">
            <button
              type="button"
              className="small-action"
              onClick={() => setTicketPreview(`Summary: ${title || 'Quick work log'}\n\nWhat happened: ${details || 'Captured during shift.'}\n\nNext step: ${relatedKbTopic ? `${relatedKbTopic} follow-up` : 'Review this item next shift.'}`)}
            >
              Generate ticket note preview
            </button>
            {ticketPreview && (
              <div className="ticket-preview">
                <pre>{ticketPreview}</pre>
                <button
                  type="button"
                  className="small-action"
                  onClick={() => navigator.clipboard?.writeText(ticketPreview)}
                >
                  Copy ticket preview
                </button>
              </div>
            )}
          </div>
        )}
        <button type="submit">Capture {captureType}</button>
      </form>
    </section>
  );
}

export default QuickCapture;
