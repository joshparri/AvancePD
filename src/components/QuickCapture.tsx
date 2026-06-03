import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { kbHints } from '../data/kbHints';
import type { Client, LearningItem, Task, WorkLog } from '../types';
import { buildFollowUpTemplate } from '../utils/followUpTriage';
import { scoreTicketNote } from '../utils/ticketNoteQuality';
import { detectRiskyWork, buildRiskGuardrailMessage } from '../utils/changeGuardrails';

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
  const [showQualityChecklist, setShowQualityChecklist] = useState(false);
  const [pendingWorkLog, setPendingWorkLog] = useState<WorkLog | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const clientOptions = useMemo(() => clients, [clients]);
  const ticketPreviewFeedback = useMemo(() => scoreTicketNote(ticketPreview), [ticketPreview]);

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
      const workLog: WorkLog = {
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
        draft: false,
        confirmedRiskReview: false
      };
      setPendingWorkLog(workLog);
      setShowQualityChecklist(true);
      return;
    }

    if (captureType === 'task') {
      const taskTitle = title || 'Quick follow-up';
      const taskNote = details || 'Quick task created during shift.';
      const nextNudgeDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      addTask({
        id: createId('task'),
        title: taskTitle,
        status: 'open',
        dueDate: new Date().toISOString().slice(0, 10),
        priority: 'medium',
        clientId,
        workLogId: undefined,
        note: taskNote,
        followUpStage: 'needs action',
        nextNudgeDate,
        followUpTemplate: buildFollowUpTemplate({
          title: taskTitle,
          note: taskNote,
          followUpStage: 'needs action',
          nextNudgeDate
        }),
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

  const generateTicketPreview = () => {
    setTicketPreview(buildQuickCaptureTicketPreview(title, details, relatedKbTopic));
  };

  const handleQualityChecklistSubmit = (workLog: WorkLog) => {
    addWorkLog(workLog);
    setShowQualityChecklist(false);
    setPendingWorkLog(null);
    resetForm();
  };

  const handleSkipChecklist = () => {
    if (pendingWorkLog) {
      addWorkLog(pendingWorkLog);
    }
    setShowQualityChecklist(false);
    setPendingWorkLog(null);
    resetForm();
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
              onClick={generateTicketPreview}
            >
              Generate ticket note preview
            </button>
            {ticketPreview && (
              <div className="ticket-preview">
                <div className="metric-row">
                  <span className={`status-chip ${ticketNoteRatingChip(ticketPreviewFeedback.rating)}`}>{ticketPreviewFeedback.rating}</span>
                  <span className="status-chip info">{ticketPreviewFeedback.score}/{ticketPreviewFeedback.total} checks</span>
                </div>
                <pre>{ticketPreview}</pre>
                {ticketPreviewFeedback.missing.length > 0 && (
                  <p className="health-muted">Needs: {ticketPreviewFeedback.missing.join(', ')}</p>
                )}
                {ticketPreviewFeedback.suggestions[0] && (
                  <p className="health-muted">Next edit: {ticketPreviewFeedback.suggestions[0]}</p>
                )}
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

      {showQualityChecklist && pendingWorkLog && (
        <QualityChecklistModal
          workLog={pendingWorkLog}
          onSubmit={handleQualityChecklistSubmit}
          onSkip={handleSkipChecklist}
          onCancel={() => {
            setShowQualityChecklist(false);
            setPendingWorkLog(null);
          }}
        />
      )}
    </section>
  );
}

export default QuickCapture;

function buildQuickCaptureTicketPreview(title: string, details: string, relatedKbTopic: string) {
  return [
    `Issue: ${title.trim() || 'Quick work log'}`,
    'User impact: Not captured yet; add the blocked work, urgency, or user risk.',
    'Checks performed: Not captured yet; list the checks you performed before or after the fix.',
    `Action taken: ${details.trim() || 'Captured during shift; expand this into the actual action taken.'}`,
    'Result: To be reviewed.',
    `Next step: ${relatedKbTopic.trim() ? `Review ${relatedKbTopic.trim()} and confirm the next owner or follow-up time.` : 'Review this item next shift and confirm the next owner or follow-up time.'}`,
    'Escalation reason if applicable: Not required at this stage; escalate if the issue recurs, risk increases, or permissions are needed.'
  ].join('\n');
}

function ticketNoteRatingChip(rating: string) {
  if (rating === 'strong') return 'success';
  if (rating === 'usable') return 'info';
  return 'warn';
}

type QualityChecklistModalProps = {
  workLog: WorkLog;
  onSubmit: (workLog: WorkLog) => void;
  onSkip: () => void;
  onCancel: () => void;
};

function QualityChecklistModal({ workLog, onSubmit, onSkip, onCancel }: QualityChecklistModalProps) {
  const [title, setTitle] = useState(workLog.title);
  const [summary, setSummary] = useState(workLog.summary);
  const [actions, setActions] = useState(workLog.actions);
  const [result, setResult] = useState(workLog.result);
  const [nextStep, setNextStep] = useState(workLog.nextStep);
  const [tags, setTags] = useState(workLog.tags.join(', '));
  const [riskConfirmed, setRiskConfirmed] = useState(workLog.confirmedRiskReview ?? false);

  const riskAnalysis = detectRiskyWork(`${workLog.title} ${workLog.summary} ${workLog.actions} ${workLog.result} ${workLog.nextStep} ${workLog.tags.join(' ')}`);
  const guardrailMessage = buildRiskGuardrailMessage(riskAnalysis.reasons);

  const checklist = [
    { id: 'title', label: 'Summary', value: title, filled: title.length > 0 },
    { id: 'summary', label: 'What happened', value: summary, filled: summary.length > 0 },
    { id: 'actions', label: 'Action taken', value: actions, filled: actions.length > 0 },
    { id: 'result', label: 'Status/Result', value: result, filled: result.length > 0 },
    { id: 'nextStep', label: 'Follow-up', value: nextStep, filled: nextStep.length > 0 },
    { id: 'tags', label: 'Tags', value: tags, filled: tags.length > 0 },
  ];

  const filledCount = checklist.filter((item) => item.filled).length;
  const quality = filledCount === 6 ? 'excellent' : filledCount >= 5 ? 'good' : filledCount >= 4 ? 'fair' : 'low';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedWorkLog: WorkLog = {
      ...workLog,
      title,
      summary,
      actions,
      result,
      nextStep,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      confirmedRiskReview: riskAnalysis.isRisky ? riskConfirmed : undefined,
    };
    onSubmit(updatedWorkLog);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h3>Quick Capture Quality Checklist</h3>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Review and enhance your quick capture before saving. Quality: <strong>{quality}</strong> ({filledCount}/6 fields filled)
        </p>

        <form onSubmit={handleSubmit}>
          {checklist.map((item) => (
            <label key={item.id} style={{ display: 'block', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <input type="checkbox" checked={item.filled} readOnly />
                <span style={{ fontWeight: 'bold' }}>{item.label}</span>
                {!item.filled && <span style={{ color: '#dc2626', fontSize: '11px' }}>required</span>}
              </div>
              <textarea
                value={item.id === 'title' ? title : item.id === 'summary' ? summary : item.id === 'actions' ? actions : item.id === 'result' ? result : item.id === 'nextStep' ? nextStep : tags}
                onChange={(e) => {
                  const value = e.target.value;
                  if (item.id === 'title') setTitle(value);
                  else if (item.id === 'summary') setSummary(value);
                  else if (item.id === 'actions') setActions(value);
                  else if (item.id === 'result') setResult(value);
                  else if (item.id === 'nextStep') setNextStep(value);
                  else if (item.id === 'tags') setTags(value);
                }}
                rows={2}
                style={{ width: '100%', padding: '6px', fontFamily: 'inherit' }}
              />
            </label>
          ))}

          {riskAnalysis.isRisky && (
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Risk guardrail detected</p>
              <p style={{ marginTop: '8px', color: '#92400e' }}>{guardrailMessage}</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={riskConfirmed}
                  onChange={(event) => setRiskConfirmed(event.target.checked)}
                />
                <span>I confirm this work is approved or safe to capture locally.</span>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onCancel} style={{ background: '#e5e7eb' }}>
              Cancel
            </button>
            <button type="button" onClick={onSkip} style={{ background: '#fbbf24' }}>
              Save as-is (skip checklist)
            </button>
            <button
              type="submit"
              style={{ background: filledCount === 6 ? '#10b981' : '#3b82f6' }}
              disabled={riskAnalysis.isRisky && !riskConfirmed}
            >
              Save quality note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
