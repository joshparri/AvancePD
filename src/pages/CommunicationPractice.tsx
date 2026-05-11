import { useState } from 'react';
import { communicationScenarios } from '../data/communicationScenarios';

function CommunicationPractice() {
  const [selectedId, setSelectedId] = useState(communicationScenarios[0]?.id ?? '');
  const selectedScenario = communicationScenarios.find((scenario) => scenario.id === selectedId) ?? communicationScenarios[0];

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
