import { useMemo, useState } from 'react';
import { getQuietWindowSuggestion, type QuietWindowDuration } from '../utils/nextBestAction';
import type { AvanceProgress } from '../utils/progressStorage';

const startChecklist = ['HaloPSA', '3CX', 'Datto RMM', 'Google Chat', 'Gmail', 'Keeper / Google Drive where needed'];
const supportModes = ['triage ticket', 'take phone call', 'remote support', 'document fix', 'escalate', 'follow up'];
const quietDurations: QuietWindowDuration[] = ['5min', '10min', '15min', '20min'];
const durationLabels: Record<QuietWindowDuration, string> = {
  '5min': '5 min',
  '10min': '10 min',
  '15min': '15 min',
  '20min': '20 min',
};

const overwhelmedOptions = [
  {
    label: 'Read one concept card',
    description: 'Pick any Micro-Learning card and read the concept and example. Takes under 5 minutes.',
    pageId: 'microLearning'
  },
  {
    label: 'Review the ticket note template',
    description: 'Open Ticket Notes and read the six-field structure. Reinforces the habit in 2 minutes.',
    pageId: 'ticketNotes'
  },
  {
    label: 'Check one scenario\'s unsafe actions',
    description: 'Open MSP Scenarios, pick any scenario, and just read the "unsafe actions" list.',
    pageId: 'mspScenarios'
  }
];

const teachingModes = [
  { label: 'Learn', description: 'Read a concept card', pageId: 'microLearning', available: true },
  { label: 'Practise', description: 'Work a scenario', pageId: 'mspScenarios', available: true },
  { label: 'Quiz', description: 'Test your knowledge', pageId: 'mspSkills', available: false },
  { label: 'Roleplay', description: 'Practise communication', pageId: 'communicationPractice', available: true },
  { label: 'Reflect', description: 'Log your evidence', pageId: 'evidencePack', available: true },
  { label: 'Review', description: 'Check your skill gaps', pageId: 'mspSkills', available: true },
];

type AvanceWorkdayProps = {
  progress: AvanceProgress;
  updateWorkday: (workdayFocus: string, quickSupportMode: string) => void;
  onNavigate: (page: string) => void;
};

function AvanceWorkday({ progress, updateWorkday, onNavigate }: AvanceWorkdayProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [workdayFocus, setWorkdayFocus] = useState(progress.workdayFocus ?? '');
  const [quickSupportMode, setQuickSupportMode] = useState(progress.quickSupportMode ?? supportModes[0]);
  const [selectedDuration, setSelectedDuration] = useState<QuietWindowDuration>('10min');
  const [overwhelmedMode, setOverwhelmedMode] = useState(false);

  const quietSuggestion = useMemo(
    () => getQuietWindowSuggestion(progress, selectedDuration),
    [progress, selectedDuration]
  );

  const saveWorkday = () => {
    updateWorkday(workdayFocus, quickSupportMode);
  };

  return (
    <div>
      <section className="card">
        <h1>Avance Workday</h1>
        <p>A calm Monday/Wednesday start point for support readiness, safe focus tracking, and quiet-time PD.</p>
        <div className="privacy-note">Keep client data out of this app. Use generic focus areas, broad categories, and ticket IDs only.</div>
      </section>

      <section className="card">
        <h2>Start-of-day checklist</h2>
        <div className="checklist-grid">
          {startChecklist.map((item) => (
            <label key={item} className="checklist-item">
              <input
                type="checkbox"
                checked={checkedItems[item] ?? false}
                onChange={(event) => setCheckedItems((current) => ({ ...current, [item]: event.target.checked }))}
              />
              {item}
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Today I am working on</h2>
        <div className="quick-capture-form">
          <label>
            Generic focus
            <input
              value={workdayFocus}
              onChange={(event) => setWorkdayFocus(event.target.value)}
              placeholder="Example: triage queue, follow-ups, documentation, M365 access requests"
            />
          </label>
          <label>
            Quick support mode
            <select value={quickSupportMode} onChange={(event) => setQuickSupportMode(event.target.value)}>
              {supportModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={saveWorkday}>Save workday focus</button>
        </div>
      </section>

      <section className="card">
        <h2>Quiet time PD</h2>
        <p>How much time do you have?</p>
        <div className="duration-selector">
          {quietDurations.map((d) => (
            <button
              key={d}
              type="button"
              className={selectedDuration === d ? 'duration-btn active' : 'duration-btn'}
              onClick={() => setSelectedDuration(d)}
            >
              {durationLabels[d]}
            </button>
          ))}
        </div>

        {overwhelmedMode ? (
          <div className="overwhelmed-card">
            <strong>Three small things you can do right now:</strong>
            <div className="overwhelmed-actions">
              {overwhelmedOptions.map((opt) => (
                <button
                  key={opt.pageId}
                  type="button"
                  className="overwhelmed-action-btn"
                  onClick={() => onNavigate(opt.pageId)}
                >
                  <strong>{opt.label}</strong>
                  <span>{opt.description}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="overwhelmed-toggle"
              onClick={() => setOverwhelmedMode(false)}
            >
              Back to normal suggestion
            </button>
          </div>
        ) : (
          <>
            <article className="mini-card">
              <div className="skill-card-header">
                <h3>{quietSuggestion.title}</h3>
                <span className="status-chip info">{quietSuggestion.category}</span>
              </div>
              <p>{quietSuggestion.reason}</p>
              <p><strong>Next action:</strong> {quietSuggestion.action}</p>
              <button
                type="button"
                onClick={() => onNavigate(quietSuggestion.suggestedPageId)}
              >
                Go there now →
              </button>
            </article>
            <button
              type="button"
              className="overwhelmed-toggle"
              onClick={() => setOverwhelmedMode(true)}
            >
              Feeling overwhelmed? Give me 3 small things instead
            </button>
          </>
        )}
      </section>

      <section className="card">
        <h2>What would you like to do?</h2>
        <p>Choose a teaching mode to jump straight into the right kind of practice.</p>
        <div className="teaching-mode-grid">
          {teachingModes.map((mode) => (
            <button
              key={mode.label}
              type="button"
              className={mode.available ? 'teaching-mode-btn' : 'teaching-mode-btn teaching-mode-btn--disabled'}
              onClick={() => mode.available && onNavigate(mode.pageId)}
              disabled={!mode.available}
            >
              <strong>{mode.label}</strong>
              <span>{mode.description}</span>
              {!mode.available && <span className="coming-soon-label">coming soon</span>}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AvanceWorkday;
