import { useState } from 'react';
import { communicationScenarios } from '../data/communicationScenarios';
import { getCommunicationFeedback, type CoachFeedback, type CommunicationFeedbackRequest } from '../utils/groqClient';
import FeedbackCard from '../components/FeedbackCard';

function CommunicationPractice() {
  const [selectedId, setSelectedId] = useState(communicationScenarios[0]?.id ?? '');
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, CoachFeedback>>({});
  const [feedbackError, setFeedbackError] = useState<string>('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [roughMessage, setRoughMessage] = useState('');
  const [audience, setAudience] = useState('end user');
  const [toneTarget, setToneTarget] = useState('calm and clear');
  const [urgency, setUrgency] = useState('normal');

  const selectedScenario = communicationScenarios.find((scenario) => scenario.id === selectedId) ?? communicationScenarios[0];
  const userResponse = userResponses[selectedId] ?? '';
  const scenarioFeedback = feedbackMap[selectedId];

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
        `I will work through the next safe checks and keep the update ${toneTarget} for the ${audience}.`,
        '',
        `Next step: I will confirm the current state, avoid risky changes, and come back with either a fix or a clear escalation note.`
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
          {communicationScenarios.map((scenario) => (
            <button
              key={scenario.id}
              className={selectedId === scenario.id ? 'scenario-button active' : 'scenario-button'}
              onClick={() => setSelectedId(scenario.id)}
            >
              {scenario.title}
            </button>
          ))}
        </aside>

        <section className="scenario-detail">
          <div className="scenario-header">
            <h3>{selectedScenario.title}</h3>
            <div className="status-chip">Related skills: {selectedScenario.relatedMspSkills.join(', ')}</div>
          </div>
          <p className="context">Context: {selectedScenario.context}</p>

          <div className="training-section">
            <h4>Calm rewrite coach</h4>
            <p>Turn a rushed draft into a calmer workplace update. Keep it generic and remove private details first.</p>
            <div className="quick-capture-form">
              <label>
                Rough message
                <textarea value={roughMessage} onChange={(event) => setRoughMessage(event.target.value)} placeholder="Paste a generic rough draft only." />
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

export default CommunicationPractice;
