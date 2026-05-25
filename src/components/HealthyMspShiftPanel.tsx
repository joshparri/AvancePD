import {
  getNextHealthReminder,
  getShiftState,
  getTodayLog,
  setQuietMode,
  type HealthState
} from '../utils/healthOutdoors';

type HealthyMspShiftPanelProps = {
  healthState: HealthState;
  setHealthState: (updater: (state: HealthState) => HealthState) => void;
  onNavigate?: () => void;
  onReset?: () => void;
};

function formatLastBreak(value?: string) {
  if (!value) return 'Not yet today';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function HealthyMspShiftPanel({ healthState, setHealthState, onNavigate, onReset }: HealthyMspShiftPanelProps) {
  const now = new Date();
  const today = getTodayLog(healthState, now);
  const nextReminder = getNextHealthReminder(now, healthState.settings, today);
  const quietUntil = healthState.settings.quietModeUntil ? new Date(healthState.settings.quietModeUntil) : null;
  const quietActive = quietUntil ? quietUntil > now : false;

  return (
    <section className="card health-panel">
      <div className="skill-card-header">
        <div>
          <h2>Healthy MSP Shift</h2>
          <p>This is about sustainability, not perfection.</p>
        </div>
        <span className="status-chip info">{getShiftState(now, healthState.settings)}</span>
      </div>

      <div className="health-metrics-grid">
        <div className="mini-card">
          <h3>Next health action</h3>
          <p>{nextReminder ? `${nextReminder.title}: ${nextReminder.action}` : 'No reminders due. Keep going steadily.'}</p>
        </div>
        <div className="mini-card">
          <h3>Water</h3>
          <p>{today.hydrationCount} check-ins today</p>
        </div>
        <div className="mini-card">
          <h3>Outdoor time</h3>
          <p>{today.outdoorMinutes} minutes today</p>
        </div>
        <div className="mini-card">
          <h3>Last eye break</h3>
          <p>{formatLastBreak(today.lastBreakTime)}</p>
        </div>
      </div>

      {quietActive && <p className="health-muted">Quiet mode until {quietUntil?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</p>}

      <div className="health-action-row">
        <button type="button" onClick={() => setHealthState((state) => setQuietMode(state, 60))}>
          I'm in urgent ticket mode
        </button>
        <button type="button" className="small-action" onClick={onReset}>
          I need a 2-minute reset
        </button>
        {onNavigate && (
          <button type="button" className="small-action" onClick={onNavigate}>
            Open Health & Outdoors
          </button>
        )}
      </div>
    </section>
  );
}

export default HealthyMspShiftPanel;
