import { useEffect, useMemo, useState } from 'react';
import {
  communicationCategories,
  communicationScenarios,
  toneChecklistByCategory,
  type CommunicationCategory
} from '../data/communicationScenarios';
import { getCommunicationFeedback, type CoachFeedback, type CommunicationFeedbackRequest } from '../utils/groqClient';
import FeedbackCard from '../components/FeedbackCard';

function CommunicationPractice() {
  const [selectedId, setSelectedId] = useState(communicationScenarios[0]?.id ?? '');
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, CoachFeedback>>({});
  const [feedbackError, setFeedbackError] = useState<string>('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CommunicationCategory | 'all'>('all');
  const [roughMessage, setRoughMessage] = useState('');
  const [audience, setAudience] = useState('end user');
  const [messageCategory, setMessageCategory] = useState<CommunicationCategory>('client update');
  const [toneTarget, setToneTarget] = useState('calm and clear');
  const [urgency, setUrgency] = useState('normal');

  const visibleScenarios = useMemo(
    () => categoryFilter === 'all'
      ? communicationScenarios
      : communicationScenarios.filter((scenario) => scenario.category === categoryFilter),
    [categoryFilter]
  );
  const selectedScenario = visibleScenarios.find((scenario) => scenario.id === selectedId) ?? visibleScenarios[0] ?? communicationScenarios[0];
  const scenarioToneChecklist = toneChecklistByCategory[selectedScenario.category];
  const rewriteToneChecklist = toneChecklistByCategory[messageCategory];
  const userResponse = userResponses[selectedId] ?? '';
  const scenarioFeedback = feedbackMap[selectedId];

  useEffect(() => {
    if (visibleScenarios.some((scenario) => scenario.id === selectedId)) return;
    if (visibleScenarios[0]) {
      setSelectedId(visibleScenarios[0].id);
    }
  }, [selectedId, visibleScenarios]);

  const handleGetFeedback = async () => {
    if (!userResponse.trim()) return;
    setIsLoadingFeedback(true);
    setFeedbackError('');
    try {
      const request: CommunicationFeedbackRequest = {
        scenarioContext: selectedScenario.context,
        idealAnswer: selectedScenario.excellentResponse,
        userAnswer: userResponse,
      };
      const result = await getCommunicationFeedback(request);
      setFeedbackMap((current) => ({ ...current, [selectedId]: result }));
    } catch (err: unknown) {
      setFeedbackError(err instanceof Error ? err.message : 'Unable to get feedback.');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleClearFeedback = () => {
    setFeedbackMap((c) => { const n = { ...c }; delete n[selectedId]; return n; });
    setFeedbackError('');
  };

  const rewrittenMessage = roughMessage.trim()
    ? [
        `Hi, thanks for flagging this. I understand this is ${urgency === 'urgent' ? 'time-sensitive' : 'important'}.`,
        '',
        `Category: ${messageCategory}. I will keep the update ${toneTarget} for the ${audience}.`,
        '',
        `Next step: ${nextStepForCommunicationCategory(messageCategory)}`
      ].join('\n')
    : '';

  return (
    <div className="page-card communication-page">
      <header>
        <h2>Communication Practice</h2>
        <p>
          Train calm, professional messaging for client updates, escalation, and sensitive service conversations.
          Choose a scenario, read the sample approaches, and notice how strong responses set expectations and reduce risk.
        </p>
      </header>

      <div className="split-layout">
        <aside className="scenario-list">
          <strong>Scenario bank</strong>
          <label>
            Category
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as CommunicationCategory | 'all')}>
              <option value="all">all</option>
              {communicationCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          {visibleScenarios.map((scenario) => (
            <button
              key={scenario.id}
              className={selectedId === scenario.id ? 'scenario-button active' : 'scenario-button'}
              onClick={() => setSelectedId(scenario.id)}
            >
              {scenario.title}
              <span>{scenario.category}</span>
            </button>
          ))}
        </aside>

        <section className="scenario-detail">
          <div className="scenario-header">
            <h3>{selectedScenario.title}</h3>
            <div className="status-chip">{selectedScenario.category}</div>
            <div className="status-chip">Related skills: {selectedScenario.relatedMspSkills.join(', ')}</div>
          </div>
          <p className="context">Context: {selectedScenario.context}</p>

          <div className="training-section">
            <h4>Tone checklist</h4>
            <ul>
              {scenarioToneChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="training-section">
            <h4>Calm rewrite coach</h4>
            <p>Turn a rushed draft into a calmer workplace update. Keep it generic and remove private details first.</p>
            <div className="quick-capture-form">
              <label>
                Rough message
                <textarea value={roughMessage} onChange={(event) => setRoughMessage(event.target.value)} placeholder="Paste a generic rough draft only." />
              </label>
              <label>
                Message category
                <select value={messageCategory} onChange={(event) => setMessageCategory(event.target.value as CommunicationCategory)}>
                  {communicationCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Audience
                <select value={audience} onChange={(event) => setAudience(event.target.value)}>
                  <option value="end user">end user</option>
                  <option value="manager">manager</option>
                  <option value="senior technician">senior technician</option>
                </select>
              </label>
              <label>
                Tone target
                <select value={toneTarget} onChange={(event) => setToneTarget(event.target.value)}>
                  <option value="calm and clear">calm and clear</option>
                  <option value="brief and professional">brief and professional</option>
                  <option value="warm and reassuring">warm and reassuring</option>
                </select>
              </label>
              <label>
                Urgency
                <select value={urgency} onChange={(event) => setUrgency(event.target.value)}>
                  <option value="normal">normal</option>
                  <option value="urgent">urgent</option>
                </select>
              </label>
            </div>
            <div className="mini-card" style={{ marginTop: '12px' }}>
              <strong>Rewrite checklist</strong>
              <ul>
                {rewriteToneChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {rewrittenMessage ? <pre className="template-box">{rewrittenMessage}</pre> : <p className="feedback-empty-hint">Write a generic rough draft to generate a calmer version.</p>}
          </div>

          <div className="training-section">
            <h4>Your response</h4>
            <textarea
              value={userResponse}
              onChange={(event) => setUserResponses((current) => ({ ...current, [selectedId]: event.target.value }))}
              placeholder="Write your professional response to this scenario…"
              rows={4}
            />
            <p className="privacy-reminder">Use generic training answers only. Do not include client names, passwords, hostnames, private ticket text, or sensitive data.</p>
            {!userResponse.trim() ? (
              <p className="feedback-empty-hint">Write your response first, then I can coach it.</p>
            ) : (
              <button type="button" onClick={handleGetFeedback} disabled={isLoadingFeedback}>
                {isLoadingFeedback ? 'Getting feedback…' : scenarioFeedback ? 'Get fresh feedback' : 'Get AI Feedback'}
              </button>
            )}
            {feedbackError && (
              <div className="error-panel">
                <h4>Feedback unavailable</h4>
                <p>{feedbackError}</p>
              </div>
            )}
            {scenarioFeedback && (
              <FeedbackCard feedback={scenarioFeedback} onClear={handleClearFeedback} />
            )}
          </div>

          <div className="training-section">
            <h4>Poor response</h4>
            <p>{selectedScenario.poorResponse}</p>
          </div>

          <div className="training-section">
            <h4>Better response</h4>
            <p>{selectedScenario.betterResponse}</p>
          </div>

          <div className="training-section strong-response">
            <h4>Excellent response</h4>
            <p>{selectedScenario.excellentResponse}</p>
          </div>

          <div className="training-section summary-box">
            <h4>Why this works</h4>
            <p>{selectedScenario.whyItWorks}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function nextStepForCommunicationCategory(category: CommunicationCategory) {
  switch (category) {
    case 'client update':
      return 'I will confirm the current status, record the impact, and provide the next update time.';
    case 'escalation':
      return 'I will collect the checks already completed, explain the risk, and hand this to the right owner.';
    case 'change approval':
      return 'I will confirm the requested change, timing, approval path, and rollback plan before action.';
    case 'follow-up':
      return 'I will confirm what has changed since the last update and set the next owner or time.';
    case 'closure':
      return 'I will summarise the fix, confirmation result, and what to do if the issue returns.';
    case 'investigation':
      return 'I will gather the missing details, run safe checks, and avoid guessing before evidence is clear.';
    default:
      return 'I will confirm the current state and provide a clear next step.';
  }
}

export default CommunicationPractice;
