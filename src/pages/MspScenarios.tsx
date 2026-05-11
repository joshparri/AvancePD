import { useMemo, useState } from 'react';
import { mspScenarios } from '../data/mspScenarios';
import { getScenarioFeedback, type CoachFeedback, type ScenarioFeedbackRequest } from '../utils/groqClient';
import FeedbackCard from '../components/FeedbackCard';
import type { AvanceProgress, ScenarioStatus } from '../utils/progressStorage';

const scenarioStatuses: ScenarioStatus[] = ['not-started', 'practised', 'confident', 'needs-review'];

type MspScenariosProps = {
  progress: AvanceProgress;
  updateScenarioProgress: (scenarioId: string, status: ScenarioStatus, reflection?: string) => void;
};

function MspScenarios({ progress, updateScenarioProgress }: MspScenariosProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(mspScenarios[0]?.id ?? '');
  const [reflectionDrafts, setReflectionDrafts] = useState<Record<string, string>>({});
  const [userInputs, setUserInputs] = useState<Record<string, { firstQuestions: string; checks: string; escalationDecision: string; ticketNote: string }>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, CoachFeedback>>({});
  const [showHiddenCause, setShowHiddenCause] = useState<Record<string, boolean>>({});
  const [feedbackError, setFeedbackError] = useState<Record<string, string>>({});
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const selectedScenario = useMemo(
    () => mspScenarios.find((scenario) => scenario.id === selectedScenarioId) ?? mspScenarios[0],
    [selectedScenarioId]
  );

  if (!selectedScenario) {
    return null;
  }

  const selectedProgress = progress.scenarioProgress[selectedScenarioId];
  const selectedStatus = selectedProgress?.status ?? 'not-started';
  const reflection = reflectionDrafts[selectedScenarioId] ?? selectedProgress?.reflection ?? '';
  const userInput = userInputs[selectedScenarioId] ?? {
    firstQuestions: '',
    checks: '',
    escalationDecision: '',
    ticketNote: '',
  };
  const scenarioFeedback = feedbackMap[selectedScenarioId];
  const hiddenCauseVisible = showHiddenCause[selectedScenarioId] ?? false;

  const allBlank =
    !userInput.firstQuestions.trim() &&
    !userInput.checks.trim() &&
    !userInput.escalationDecision.trim() &&
    !userInput.ticketNote.trim();

  const handleGetFeedback = async () => {
    if (allBlank) return;
    setIsLoadingFeedback(true);
    setFeedbackError((c) => ({ ...c, [selectedScenario.id]: '' }));
    const idealAnswer = `
First questions: ${selectedScenario.goodFirstQuestions.join(', ')}
Expected checks: ${selectedScenario.expectedChecks.join(', ')}
Escalation triggers: ${selectedScenario.escalationTriggers.join(', ')}
Ticket note: ${selectedScenario.idealTicketNotes}
    `.trim();
    const userAnswer = `
First questions: ${userInput.firstQuestions || '(blank)'}
Checks: ${userInput.checks || '(blank)'}
Escalation decision: ${userInput.escalationDecision || '(blank)'}
Ticket note: ${userInput.ticketNote || '(blank)'}
    `.trim();
    const request: ScenarioFeedbackRequest = {
      scenarioTitle: selectedScenario.title,
      idealAnswer,
      userAnswer,
    };
    try {
      const result = await getScenarioFeedback(request);
      setFeedbackMap((current) => ({ ...current, [selectedScenario.id]: result }));
      setShowHiddenCause((current) => ({ ...current, [selectedScenario.id]: true }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to get feedback.';
      setFeedbackError((current) => ({ ...current, [selectedScenario.id]: msg }));
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleClearFeedback = () => {
    setFeedbackMap((c) => { const n = { ...c }; delete n[selectedScenario.id]; return n; });
    setFeedbackError((c) => ({ ...c, [selectedScenario.id]: '' }));
    setShowHiddenCause((c) => ({ ...c, [selectedScenario.id]: false }));
  };

  const setField = (field: keyof typeof userInput, value: string) => {
    setUserInputs((c) => ({ ...c, [selectedScenario.id]: { ...userInput, [field]: value } }));
  };

  return (
    <div>
      <section className="card">
        <h1>MSP Scenario Trainer</h1>
        <p>Practise real ticket judgement: ask useful questions, check safely, avoid risky shortcuts, and escalate cleanly.</p>
        <p className="page-help">This trainer saves your progress locally. Use the reflection field to capture what you learned from each scenario.</p>
      </section>

      <div className="scenario-layout">
        <section className="card">
          <h2>Scenario bank</h2>
          <div className="scenario-list">
            {mspScenarios.map((scenario) => {
              const scenarioStatus = progress.scenarioProgress[scenario.id]?.status ?? 'not-started';
              return (
                <button
                  type="button"
                  key={scenario.id}
                  className={selectedScenario.id === scenario.id ? 'active scenario-button' : 'scenario-button'}
                  onClick={() => setSelectedScenarioId(scenario.id)}
                >
                  <strong>{scenario.title}</strong>
                  <span>{scenario.category} | {scenario.difficulty}</span>
                  <span>Status: {scenarioStatus}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="card">
          <div className="skill-card-header">
            <div>
              <h2>{selectedScenario.title}</h2>
              <p>{selectedScenario.ticketText}</p>
            </div>
            <span className="status-chip warn">{selectedScenario.difficulty}</span>
          </div>
          <div className="metric-row">
            <span className="status-chip info">{selectedScenario.category}</span>
            <span className="status-chip success">{selectedScenario.userEmotion}</span>
            <span className={selectedStatus === 'needs-review' ? 'status-chip warn' : 'status-chip info'}>{selectedStatus}</span>
            {selectedProgress?.lastPractisedDate && <span className="status-chip success">last practised {selectedProgress.lastPractisedDate}</span>}
          </div>

          <div className="training-section">
            <h3>Progress</h3>
            <div className="status-button-row">
              {scenarioStatuses.map((status) => (
                <button
                  type="button"
                  key={status}
                  className={selectedStatus === status ? 'active small-action' : 'small-action'}
                  onClick={() => updateScenarioProgress(selectedScenario.id, status, reflection)}
                >
                  {status}
                </button>
              ))}
            </div>
            <label className="quick-capture-form reflection-field">
              Reflection
              <textarea
                value={reflection}
                onChange={(event) => setReflectionDrafts((current) => ({ ...current, [selectedScenario.id]: event.target.value }))}
                onBlur={() => updateScenarioProgress(selectedScenario.id, selectedStatus, reflection)}
                placeholder="Privacy-safe note: what judgement, check, or escalation trigger should I remember?"
              />
            </label>
          </div>

          <div className="training-section">
            <h3>Interactive Practice</h3>
            <p>Enter your approach to this scenario, then get AI feedback.</p>
            <div className="quick-capture-form">
              <label>
                First questions you'd ask:
                <textarea
                  value={userInput.firstQuestions}
                  onChange={(e) => setField('firstQuestions', e.target.value)}
                  placeholder="List 2–3 questions to clarify the issue…"
                />
              </label>
              <label>
                Checks you'd perform:
                <textarea
                  value={userInput.checks}
                  onChange={(e) => setField('checks', e.target.value)}
                  placeholder="List safe diagnostic steps…"
                />
              </label>
              <label>
                Escalation decision:
                <textarea
                  value={userInput.escalationDecision}
                  onChange={(e) => setField('escalationDecision', e.target.value)}
                  placeholder="When would you escalate and why?"
                />
              </label>
              <label>
                Draft ticket note:
                <textarea
                  value={userInput.ticketNote}
                  onChange={(e) => setField('ticketNote', e.target.value)}
                  placeholder="Write a brief ticket note…"
                />
              </label>
            </div>
            <p className="privacy-reminder">Use generic training answers only. Do not include client names, passwords, hostnames, private ticket text, or sensitive data.</p>
            {allBlank ? (
              <p className="feedback-empty-hint">Add your answer first, then I can coach it.</p>
            ) : (
              <button type="button" onClick={handleGetFeedback} disabled={isLoadingFeedback}>
                {isLoadingFeedback ? 'Getting feedback…' : scenarioFeedback ? 'Get fresh feedback' : 'Get AI Feedback'}
              </button>
            )}
            {feedbackError[selectedScenario.id] && (
              <div className="error-panel">
                <h4>Feedback unavailable</h4>
                <p>{feedbackError[selectedScenario.id]}</p>
              </div>
            )}
            {scenarioFeedback && (
              <FeedbackCard feedback={scenarioFeedback} onClear={handleClearFeedback} />
            )}
            {hiddenCauseVisible && (
              <div className="hidden-cause-panel">
                <h4>Hidden Cause</h4>
                <p>{selectedScenario.hiddenCause}</p>
              </div>
            )}
          </div>

          <div className="training-section">
            <h3>Good first questions</h3>
            <ul>
              {selectedScenario.goodFirstQuestions.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="training-section">
            <h3>Expected checks</h3>
            <ul>
              {selectedScenario.expectedChecks.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="training-section warning-panel">
            <h3>Unsafe actions to avoid</h3>
            <ul>
              {selectedScenario.unsafeActions.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="training-section">
            <h3>Escalation triggers</h3>
            <ul>
              {selectedScenario.escalationTriggers.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="training-section">
            <h3>Ideal ticket notes</h3>
            <p>{selectedScenario.idealTicketNotes}</p>
          </div>

          <div className="training-section">
            <h3>Learning points</h3>
            <ul>
              {selectedScenario.learningPoints.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MspScenarios;
