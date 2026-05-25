import FocusModePanel from '../components/FocusModePanel';
import HealthyMspShiftPanel from '../components/HealthyMspShiftPanel';
import { getNextHealthReminder, getShiftState, getTodayLog, type HealthState } from '../utils/healthOutdoors';
import type { LearningItem, Task, WorkLog } from '../types';

type ShiftCommandCenterProps = {
  tasks: Task[];
  workLogs: WorkLog[];
  learningItems: LearningItem[];
  healthState: HealthState;
  setHealthState: (updater: (state: HealthState) => HealthState) => void;
  onNavigate: (page: string) => void;
};

function ShiftCommandCenter({ tasks, workLogs, learningItems, healthState, setHealthState, onNavigate }: ShiftCommandCenterProps) {
  const now = new Date();
  const today = getTodayLog(healthState, now);
  const nextHealth = getNextHealthReminder(now, healthState.settings, today);
  const openTasks = tasks.filter((task) => task.status !== 'done').slice(0, 5);
  const dueLearning = learningItems.filter((item) => item.nextReviewDate <= now.toISOString().slice(0, 10)).slice(0, 5);
  const recentLogs = workLogs.slice(0, 3);

  return (
    <div>
      <section className="card">
        <h1>Shift Command Center</h1>
        <p>One focused view for now, next, later, and shutdown.</p>
        <span className="status-chip info">{getShiftState(now, healthState.settings)}</span>
      </section>

      <section className="card">
        <h2>Now</h2>
        <div className="health-plan-grid">
          <article className="mini-card">
            <h3>Next health action</h3>
            <p>{nextHealth ? `${nextHealth.title}: ${nextHealth.action}` : 'No reminders due. Keep going steadily.'}</p>
            <button type="button" onClick={() => onNavigate('healthOutdoors')}>Open Health & Outdoors</button>
          </article>
          <article className="mini-card">
            <h3>First follow-up</h3>
            <p>{openTasks[0] ? `${openTasks[0].title} - due ${openTasks[0].dueDate}` : 'No open follow-ups.'}</p>
            <button type="button" onClick={() => onNavigate('tasks')}>Open Tasks</button>
          </article>
          <article className="mini-card">
            <h3>Learning due</h3>
            <p>{dueLearning[0] ? dueLearning[0].topic : 'No learning notes due today.'}</p>
            <button type="button" onClick={() => onNavigate('pd')}>Open PD</button>
          </article>
        </div>
      </section>

      <FocusModePanel />

      <HealthyMspShiftPanel
        healthState={healthState}
        setHealthState={setHealthState}
        onNavigate={() => onNavigate('healthOutdoors')}
        onReset={() => onNavigate('healthOutdoors')}
      />

      <section className="card">
        <h2>Later</h2>
        <div className="health-plan-grid">
          <article className="mini-card">
            <h3>Open follow-ups</h3>
            <p>{openTasks.length ? `${openTasks.length} visible follow-up(s).` : 'Clear for now.'}</p>
          </article>
          <article className="mini-card">
            <h3>Recent logs</h3>
            <p>{recentLogs.length ? recentLogs.map((log) => log.title).join(', ') : 'No recent logs.'}</p>
          </article>
        </div>
      </section>

      <section className="card">
        <h2>Shutdown</h2>
        <p>Close loops, note tomorrow's first action, breathe, and let work stay at work.</p>
        <div className="status-button-row">
          <button type="button" onClick={() => onNavigate('weeklyReview')}>Weekly Review</button>
          <button type="button" className="small-action" onClick={() => onNavigate('evidencePack')}>Evidence Pack</button>
        </div>
      </section>
    </div>
  );
}

export default ShiftCommandCenter;
