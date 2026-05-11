import { useMemo, useState } from 'react';
import { getNextBestAction } from '../utils/nextBestAction';
import type { AvanceProgress } from '../utils/progressStorage';

const startChecklist = ['HaloPSA', '3CX', 'Datto RMM', 'Google Chat', 'Gmail', 'Keeper / Google Drive where needed'];
const supportModes = ['triage ticket', 'take phone call', 'remote support', 'document fix', 'escalate', 'follow up'];

type AvanceWorkdayProps = {
  progress: AvanceProgress;
  updateWorkday: (workdayFocus: string, quickSupportMode: string) => void;
};

function AvanceWorkday({ progress, updateWorkday }: AvanceWorkdayProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [workdayFocus, setWorkdayFocus] = useState(progress.workdayFocus ?? '');
  const [quickSupportMode, setQuickSupportMode] = useState(progress.quickSupportMode ?? supportModes[0]);
  const nextAction = useMemo(() => getNextBestAction(progress), [progress]);

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
        <h2>Quiet time PD suggestion</h2>
        <article className="mini-card">
          <div className="skill-card-header">
            <h3>{nextAction.title}</h3>
            <span className="status-chip info">{nextAction.category}</span>
          </div>
          <p>{nextAction.reason}</p>
          <p><strong>Next action:</strong> {nextAction.action}</p>
        </article>
      </section>
    </div>
  );
}

export default AvanceWorkday;
