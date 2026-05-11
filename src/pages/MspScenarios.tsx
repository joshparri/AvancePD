import { useMemo, useState } from 'react';
import { mspScenarios } from '../data/mspScenarios';
import type { AvanceProgress, ScenarioStatus } from '../utils/progressStorage';

const scenarioStatuses: ScenarioStatus[] = ['not-started', 'practised', 'confident', 'needs-review'];

type MspScenariosProps = {
  progress: AvanceProgress;
  updateScenarioProgress: (scenarioId: string, status: ScenarioStatus, reflection?: string) => void;
};

function MspScenarios({ progress, updateScenarioProgress }: MspScenariosProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(mspScenarios[0]?.id ?? '');
  const [reflectionDrafts, setReflectionDrafts] = useState<Record<string, string>>({});

  const selectedScenario = useMemo(
    () => mspScenarios.find((scenario) => scenario.id === selectedScenarioId) ?? mspScenarios[0],
    [selectedScenarioId]
  );

  if (!selectedScenario) {
    return null;
  }

  const selectedProgress = progress.scenarioProgress[selectedScenario.id];
  const selectedStatus = selectedProgress?.status ?? 'not-started';
  const reflection = reflectionDrafts[selectedScenario.id] ?? selectedProgress?.reflection ?? '';

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
