import { useState } from 'react';
import type { HealthState, HealthDayLog } from '../utils/healthOutdoors';
import {
  defaultHealthReminders,
  getTodayLog,
  getNextHealthReminder,
  getShiftState,
  setQuietMode,
  isShiftDay,
  dateKey,
  createEmptyDayLog
} from '../utils/healthOutdoors';
import { healthResearchCards } from '../data/healthResearchCards';
import '../styles/health-outdoors.css';

const PAGE_TITLE = 'Health & Outdoors';

type HealthAndOutdoorsProps = {
  healthState: HealthState;
  setHealthState: (updater: (state: HealthState) => HealthState) => void;
};

function HealthAndOutdoors({ healthState, setHealthState }: HealthAndOutdoorsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showResearchCards, setShowResearchCards] = useState(false);
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [showWeeklyReview, setShowWeeklyReview] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const now = new Date();
  const today = getTodayLog(healthState, now);
  const nextReminder = getNextHealthReminder(now, healthState.settings, today);
  const shiftState = getShiftState(now, healthState.settings);
  const quietModeActive = healthState.settings.quietModeUntil ? new Date(healthState.settings.quietModeUntil) > now : false;

  const markBreakComplete = (reminderId: string) => {
    setHealthState((state) => {
      const todayLog = getTodayLog(state, now);
      if (!todayLog.completedBreaks.includes(reminderId)) {
        const updated = { ...todayLog, completedBreaks: [...todayLog.completedBreaks, reminderId] };
        return { ...state, days: { ...state.days, [dateKey(now)]: updated } };
      }
      return state;
    });
  };

  const markBreakSkipped = (reminderId: string) => {
    setHealthState((state) => {
      const todayLog = getTodayLog(state, now);
      if (!todayLog.skippedBreaks.includes(reminderId)) {
        const updated = { ...todayLog, skippedBreaks: [...todayLog.skippedBreaks, reminderId] };
        return { ...state, days: { ...state.days, [dateKey(now)]: updated } };
      }
      return state;
    });
  };

  const activateUrgentTicketMode = () => {
    setHealthState((state) => setQuietMode(state, 60, now));
  };

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Your browser does not support notifications.');
      return;
    }

    if (Notification.permission === 'granted') {
      setHealthState((state) => ({
        ...state,
        settings: {
          ...state.settings,
          notificationsEnabled: true,
          notificationPermissionStatus: 'granted'
        }
      }));
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      const status = permission === 'granted' ? 'granted' : 'denied';
      setHealthState((state) => ({
        ...state,
        settings: {
          ...state.settings,
          notificationsEnabled: permission === 'granted',
          notificationPermissionStatus: status
        }
      }));
    }
  };

  const getDayOfWeek = (): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[now.getDay()];
  };

  const getShiftStateColor = (state: string): string => {
    switch (state) {
      case 'before shift':
        return '#e3f2fd';
      case 'morning':
        return '#fff3e0';
      case 'lunch':
        return '#f3e5f5';
      case 'afternoon':
        return '#fff3e0';
      case 'wrap-up':
        return '#e8f5e9';
      default:
        return '#f5f5f5';
    }
  };

  return (
    <div className="health-outdoors-container">
      <section className="card health-header">
        <h1>{PAGE_TITLE}</h1>
        <p>A gentle wellbeing-support module for your Monday and Wednesday Avance shifts (8:30am–5:00pm).</p>
        <p className="disclaimer">
          This is not a medical app. It helps you stay healthy and grounded during desk-based work through research-backed reminders, movement, outdoor time, and nervous-system care.
        </p>
      </section>

      <section className="card health-shift-state" style={{ backgroundColor: getShiftStateColor(shiftState) }}>
        <h2>Today's State</h2>
        <div className="shift-info">
          <p>
            <strong>Day:</strong> {getDayOfWeek()}
          </p>
          <p>
            <strong>Shift Status:</strong> {shiftState === 'off shift' ? 'Off shift' : `${shiftState} (shift in progress)`}
          </p>
          {isShiftDay(now, healthState.settings) && (
            <p className="on-shift-note">You're on shift right now. Health reminders are active.</p>
          )}
        </div>
      </section>

      {nextReminder && !quietModeActive && (
        <section className="card health-next-break health-action-card">
          <h2>Next Recommended Break</h2>
          <div className="break-details">
            <h3>{nextReminder.title}</h3>
            <p className="break-time">📍 {nextReminder.time}</p>
            <p className="break-description">{nextReminder.action}</p>
          </div>
          <div className="break-actions">
            <button className="btn btn-primary" onClick={() => markBreakComplete(nextReminder.id)}>
              ✓ Done
            </button>
            <button className="btn btn-secondary" onClick={() => markBreakSkipped(nextReminder.id)}>
              Skip for now
            </button>
            <button className="btn btn-tertiary" onClick={() => setShowResetModal(true)}>
              2-min reset
            </button>
          </div>
        </section>
      )}

      {quietModeActive && (
        <section className="card health-quiet-mode">
          <h2>🤫 Quiet Mode Active</h2>
          <p>Reminders are paused for the next hour. Focus on your urgent ticket. You'll get a gentle nudge when quiet mode ends.</p>
        </section>
      )}

      <section className="card health-summary">
        <h2>Today's Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-label">Hydration Check-ins</div>
            <div className="summary-value">{today.hydrationCount}</div>
            <p className="summary-note">Water reminders</p>
          </div>
          <div className="summary-item">
            <div className="summary-label">Outdoor Minutes</div>
            <div className="summary-value">{today.outdoorMinutes}</div>
            <p className="summary-note">From resets and walks</p>
          </div>
          <div className="summary-item">
            <div className="summary-label">Eye Breaks</div>
            <div className="summary-value">{today.eyeBreaks}</div>
            <p className="summary-note">20-20-20 completed</p>
          </div>
          <div className="summary-item">
            <div className="summary-label">Breaks Completed</div>
            <div className="summary-value">{today.completedBreaks.length}</div>
            <p className="summary-note">Out of {defaultHealthReminders.length}</p>
          </div>
        </div>
      </section>

      <section className="card health-breaks-list">
        <h2>Today's Health Plan</h2>
        <div className="breaks-table">
          {defaultHealthReminders.map((reminder) => {
            const isCompleted = today.completedBreaks.includes(reminder.id);
            const isSkipped = today.skippedBreaks.includes(reminder.id);
            const status = isCompleted ? 'completed' : isSkipped ? 'skipped' : 'pending';

            return (
              <div key={reminder.id} className={`break-row break-status-${status}`}>
                <div className="break-time-col">{reminder.time}</div>
                <div className="break-title-col">{reminder.title}</div>
                <div className={`break-status-badge break-status-${status}`}>
                  {status === 'completed' && '✓ Done'}
                  {status === 'skipped' && '⊘ Skipped'}
                  {status === 'pending' && '○ Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card health-quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="btn btn-action" onClick={() => setShowResetModal(true)}>
            🧘 2-Minute Reset
          </button>
          <button className="btn btn-action" onClick={activateUrgentTicketMode}>
            🚨 Urgent Ticket Mode
          </button>
          <button className="btn btn-action" onClick={() => setShowResearchCards(!showResearchCards)}>
            📚 Research Cards
          </button>
          <button className="btn btn-action" onClick={() => setShowWeeklyReview(!showWeeklyReview)}>
            📊 Weekly Review
          </button>
          <button className="btn btn-action" onClick={() => setShowEmailSetup(!showEmailSetup)}>
            📧 Email Setup
          </button>
          <button className="btn btn-action" onClick={() => setShowSettings(!showSettings)}>
            ⚙️ Settings
          </button>
        </div>
      </section>

      {showResearchCards && (
        <section className="card health-research-section">
          <h2>Research: Why This Helps</h2>
          <p className="research-intro">Evidence-backed reminders for sustainable desk work. No miracle claims.</p>
          <div className="research-cards-grid">
            {healthResearchCards.map((card) => (
              <div key={card.id} className={`research-card research-${card.confidenceLevel}`}>
                <div className="research-header">
                  <h3>{card.title}</h3>
                  <span className={`confidence-badge confidence-${card.confidenceLevel}`}>{card.confidenceLevel}</span>
                </div>
                <p className="research-summary">{card.summary}</p>
                <div className="research-action">
                  <strong>Action:</strong> {card.action}
                </div>
                <div className="research-source">
                  <small>
                    📌 {card.sourceLabel}
                    {card.sourceUrl && (
                      <a href={card.sourceUrl} target="_blank" rel="noopener noreferrer">
                        (link)
                      </a>
                    )}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {showEmailSetup && (
        <section className="card health-email-setup">
          <h2>Email Reminders (Optional)</h2>
          <p className="email-intro">This web app can't send emails directly. Here are your options:</p>

          <div className="email-option">
            <h3>Option 1: Google Calendar</h3>
            <p>Create a repeating calendar event with these reminders.</p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const text = defaultHealthReminders.map((r) => `${r.time}: ${r.title}`).join('\n');
                navigator.clipboard.writeText(text);
                alert('Calendar reminder text copied!');
              }}
            >
              Copy Reminder Schedule
            </button>
          </div>

          <div className="email-option">
            <h3>Option 2: Browser Notifications</h3>
            <p>This app can send in-browser notifications.</p>
            {!healthState.settings.notificationsEnabled && (
              <button className="btn btn-primary" onClick={enableNotifications}>
                Enable Browser Notifications
              </button>
            )}
            {healthState.settings.notificationsEnabled && (
              <p className="success-message">✓ Browser notifications are enabled.</p>
            )}
          </div>
        </section>
      )}

      {showWeeklyReview && (
        <section className="card health-weekly-review">
          <h2>Weekly Health Review</h2>
          <p className="review-intro">Notice patterns. This is about sustainability, not perfection.</p>

          <div className="review-stats">
            {(() => {
              let weekCompleted = 0;
              let weekSkipped = 0;
              let weekOutdoor = 0;

              for (const dayLog of Object.values(healthState.days) as HealthDayLog[]) {
                weekCompleted += dayLog.completedBreaks.length;
                weekSkipped += dayLog.skippedBreaks.length;
                weekOutdoor += dayLog.outdoorMinutes;
              }

              return (
                <>
                  <div className="review-stat">
                    <strong>Breaks Completed:</strong> {weekCompleted}
                  </div>
                  <div className="review-stat">
                    <strong>Breaks Skipped:</strong> {weekSkipped}
                  </div>
                  <div className="review-stat">
                    <strong>Outdoor Minutes:</strong> {weekOutdoor}
                  </div>
                </>
              );
            })()}
          </div>

          <div className="review-prompts">
            <h3>Reflection Prompts</h3>
            <ul>
              <li>✨ What helped me stay calm this week?</li>
              <li>🔍 When did I overfocus?</li>
              <li>🌳 Did I get outside on Avance days?</li>
              <li>💡 What reminder was most useful?</li>
              <li>🛠️ What should be gentler next week?</li>
            </ul>
          </div>
        </section>
      )}

      {showSettings && (
        <section className="card health-settings">
          <h2>Settings</h2>

          <div className="settings-group">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={healthState.settings.mondayWednesdayOnly}
                onChange={(e) => {
                  setHealthState((state) => ({
                    ...state,
                    settings: {
                      ...state.settings,
                      mondayWednesdayOnly: e.target.checked,
                      shiftDays: e.target.checked ? [1, 3] : state.settings.shiftDays
                    }
                  }));
                }}
              />
              <span>Monday & Wednesday only</span>
            </label>
          </div>

          <div className="settings-group">
            <label>Shift Start Time:</label>
            <input
              type="time"
              value={healthState.settings.shiftStart}
              onChange={(e) => {
                setHealthState((state) => ({
                  ...state,
                  settings: {
                    ...state.settings,
                    shiftStart: e.target.value
                  }
                }));
              }}
            />
          </div>

          <div className="settings-group">
            <label>Shift End Time:</label>
            <input
              type="time"
              value={healthState.settings.shiftEnd}
              onChange={(e) => {
                setHealthState((state) => ({
                  ...state,
                  settings: {
                    ...state.settings,
                    shiftEnd: e.target.value
                  }
                }));
              }}
            />
          </div>

          <div className="settings-group">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={healthState.settings.enableFaithPrompt}
                onChange={(e) => {
                  setHealthState((state) => ({
                    ...state,
                    settings: {
                      ...state.settings,
                      enableFaithPrompt: e.target.checked
                    }
                  }));
                }}
              />
              <span>Include faith prompt in reset</span>
            </label>
          </div>

          <div className="settings-group">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={healthState.settings.reminderSound}
                onChange={(e) => {
                  setHealthState((state) => ({
                    ...state,
                    settings: {
                      ...state.settings,
                      reminderSound: e.target.checked
                    }
                  }));
                }}
              />
              <span>Sound for reminders</span>
            </label>
          </div>

          <div className="settings-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (confirm('Reset all health data for today?')) {
                  setHealthState((state) => ({
                    ...state,
                    days: { ...state.days, [dateKey(now)]: createEmptyDayLog(dateKey(now)) }
                  }));
                }
              }}
            >
              Reset Today's Data
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const json = JSON.stringify(healthState, null, 2);
                navigator.clipboard.writeText(json);
                alert('Health data copied!');
              }}
            >
              Export Data
            </button>
          </div>
        </section>
      )}

      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>2-Minute Nervous System Reset</h2>
            <div className="reset-steps">
              <div className="reset-step">
                <h3>1. Feet on the floor</h3>
                <p>Put both feet flat on the ground. Feel the contact.</p>
              </div>
              <div className="reset-step">
                <h3>2. Relax jaw and shoulders</h3>
                <p>Let jaw drop slightly. Roll shoulders back and down.</p>
              </div>
              <div className="reset-step">
                <h3>3. Breathe slowly</h3>
                <p>Breathe in 4, hold 4, breathe out 6. Do 3 times.</p>
              </div>
              <div className="reset-step">
                <h3>4. Look away from the screen</h3>
                <p>Let eyes focus far away. Look out window if possible.</p>
              </div>
              <div className="reset-step">
                <h3>5. Name the next tiny action</h3>
                <p>What's the next small thing you'll do?</p>
              </div>
              {healthState.settings.enableFaithPrompt && (
                <div className="reset-step faith-prompt">
                  <h3>Optional: A brief prayer</h3>
                  <p>"Lord, give me wisdom, patience, and peace. Help me stay present and do the next right thing."</p>
                </div>
              )}
            </div>
            <button className="btn btn-primary" onClick={() => setShowResetModal(false)}>
              ✓ Done with Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthAndOutdoors;
