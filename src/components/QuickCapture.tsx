import { FormEvent, useMemo, useState } from 'react';
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
  const [nextReviewDate, setNextReviewDate] = useState('');

  const clientOptions = useMemo(() => clients, [clients]);

  const resetForm = () => {
    setTitle('');
    setDetails('');
    setTags('');
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
        seenInRealWork: true,
        askTeam: false,
        nextReviewDate: nextReviewDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      });
    }

    resetForm();
  };

  return (
    <section className="card">
      <h2>Quick capture</h2>
      <p>Capture a work log, task, or learning note fast.</p>
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
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Short summary" />
        </label>
        <label>
          Details
          <textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="What happened?" />
        </label>
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
        <button type="submit">Capture {captureType}</button>
      </form>
    </section>
  );
}

export default QuickCapture;
