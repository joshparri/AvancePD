import { useMemo, useState } from 'react';

const getDefaultReviewDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

function LearningCoachCard() {
  const topicOptions = [
    'M365 admin',
    'Ticket note structure',
    'Shared mailbox troubleshooting',
    'Client onboarding',
    'Vendor coordination',
    'Policy and compliance',
    'Incident triage'
  ];
  const [topic, setTopic] = useState(topicOptions[0]);
  const [known, setKnown] = useState('');
  const [confusing, setConfusing] = useState('');
  const [goal, setGoal] = useState('');
  const [confidenceBefore, setConfidenceBefore] = useState(3);
  const [tryFirstAttempt, setTryFirstAttempt] = useState('');
  const [hintRequested, setHintRequested] = useState(false);
  const [explainItBack, setExplainItBack] = useState('');
  const [confidenceAfter, setConfidenceAfter] = useState(3);
  const [nextReviewDate, setNextReviewDate] = useState(getDefaultReviewDate());

  const tryFirstLength = tryFirstAttempt.trim().length;
  const tryFirstValid = tryFirstLength >= 40;

  const hintStatus = useMemo(() => {
    if (!tryFirstAttempt.trim()) {
      return 'Write your first attempt before requesting help.';
    }
    if (!tryFirstValid) {
      return 'Your first attempt needs at least 40 characters before hint access unlocks.';
    }
    if (hintRequested) {
      return 'Hint requested. Use the prompt below to guide your next step.';
    }
    return 'Try first before asking for help.';
  }, [hintRequested, tryFirstAttempt, tryFirstValid]);

  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h2>Learning Coach</h2>
          <p style={{ marginTop: '8px' }}>
            Use this guided practice loop to move from passive review into active learning: preflight, try first, request a hint, explain it back, then choose a review date.
          </p>
        </div>
        <span className="status-chip info" style={{ whiteSpace: 'nowrap' }}>
          Learn how to learn
        </span>
      </div>

      <div style={{ display: 'grid', gap: '18px', marginTop: '20px' }}>
        <div style={{ display: 'grid', gap: '12px' }}>
          <h3>Preflight</h3>
          <label>
            What am I practicing?
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              {topicOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
            Choose the subject you are working on so the rest of your preflight answers stay focused.
          </p>
          <label>
            What do I already know about {topic}?
            <textarea
              value={known}
              onChange={(event) => setKnown(event.target.value)}
              placeholder={`Summarize your current understanding of ${topic}`}
              rows={3}
            />
          </label>
          <label>
            What feels confusing about {topic}?
            <textarea
              value={confusing}
              onChange={(event) => setConfusing(event.target.value)}
              placeholder={`Capture the parts of ${topic} that feel unclear`}
              rows={3}
            />
          </label>
          <label>
            What am I trying to learn?
            <input
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder={`State your learning goal for ${topic}`}
            />
          </label>
          <label>
            Confidence before
            <select value={confidenceBefore} onChange={(event) => setConfidenceBefore(Number(event.target.value))}>
              <option value={1}>1 — unsure</option>
              <option value={2}>2 — a little shaky</option>
              <option value={3}>3 — somewhat confident</option>
              <option value={4}>4 — mostly sure</option>
              <option value={5}>5 — confident</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          <h3>Try First</h3>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
            The goal is not just to read, but to retrieve, explain, and apply. Write your first approach before asking for help.
          </p>
          <label>
            What would I try first, and why?
            <textarea
              value={tryFirstAttempt}
              onChange={(event) => {
                setTryFirstAttempt(event.target.value);
                if (hintRequested) {
                  setHintRequested(false);
                }
              }}
              placeholder="Describe your first attempt and reasoning"
              rows={4}
            />
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setHintRequested(true)}
              disabled={!tryFirstValid}
              style={{ width: 'fit-content' }}
            >
              Request hint
            </button>
            <p style={{ margin: 0, color: hintRequested ? '#0f172a' : '#475569' }}>{hintStatus}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          <h3>Explain It Back</h3>
          <label>
            Explain this in your own words
            <textarea
              value={explainItBack}
              onChange={(event) => setExplainItBack(event.target.value)}
              placeholder="Summarize the concept or next step yourself"
              rows={4}
            />
          </label>
          <label>
            Confidence after
            <select value={confidenceAfter} onChange={(event) => setConfidenceAfter(Number(event.target.value))}>
              <option value={1}>1 — unsure</option>
              <option value={2}>2 — a little shaky</option>
              <option value={3}>3 — somewhat confident</option>
              <option value={4}>4 — mostly sure</option>
              <option value={5}>5 — confident</option>
            </select>
          </label>
          <label>
            Next review date
            <input
              type="date"
              value={nextReviewDate}
              onChange={(event) => setNextReviewDate(event.target.value)}
            />
          </label>
        </div>
      </div>
    </section>
  );
}

export default LearningCoachCard;
