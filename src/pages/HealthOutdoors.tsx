import { useEffect, useMemo, useRef, useState } from 'react';
import { healthResearchCards } from '../data/healthResearch';
import HealthyMspShiftPanel from '../components/HealthyMspShiftPanel';
import EyeCareWorkModeToggle from '../../shared/health/EyeCareWorkModeToggle';
import {
  buildReminders,
  createEmptyDayLog,
  dateKey,
  defaultHealthSettings,
  getDueHealthReminder,
  getNextHealthReminder,
  getTodayLog,
  getWeeklyTotals,
  markReminderDone,
  setQuietMode,
  skipReminder,
  snoozeReminder,
  type HealthReminder,
  type HealthState
} from '../utils/healthOutdoors';
import type { Task } from '../types';

type HealthOutdoorsProps = {
  healthState: HealthState;
  setHealthState: (updater: (state: HealthState) => HealthState) => void;
  addTask: (task: Task) => void;
  defaultClientId: string;
};

const shiftDayOptions = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' }
];

const emailReminderText = `Subject: Avance health reset

Body: Drink water, step outside if possible, relax shoulders, then return to the next ticket.`;

const appsScriptPrompt = `Create a Google Apps Script that sends Josh a gentle "Avance health reset" email on Monday and Wednesday during 8:30am-5:00pm shifts. Use these reminders: pre-shift setup, 20-20-20 eye break, water, outdoor daylight reset, lunch away from screen, posture reset, and end-of-day shutdown. Do not include client names, ticket data, passwords, IPs, hostnames, or screenshots.`;

function updateToday(healthState: HealthState, update: (day: ReturnType<typeof getTodayLog>) => ReturnType<typeof getTodayLog>) {
  const today = getTodayLog(healthState);
  return {
    ...healthState,
    days: {
      ...healthState.days,
      [today.date]: update(today)
    }
  };
}

function copyText(text: string) {
  navigator.clipboard?.writeText(text);
}

function buildIcs(reminders: HealthReminder[]) {
  const body = reminders.map((reminder) => {
    const [hour, minute] = reminder.time.split(':');
    return [
      'BEGIN:VEVENT',
      `SUMMARY:Avance health reset - ${reminder.title}`,
      `DESCRIPTION:${reminder.notificationText}`,
      `DTSTART:20260601T${hour}${minute}00`,
      'RRULE:FREQ=WEEKLY;BYDAY=MO,WE',
      'DURATION:PT5M',
      'END:VEVENT'
    ].join('\n');
  }).join('\n');
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AvancePD//Health Outdoors//EN\n${body}\nEND:VCALENDAR`;
}

function HealthOutdoors({ healthState, setHealthState, addTask, defaultClientId }: HealthOutdoorsProps) {
  const [bannerReminder, setBannerReminder] = useState<HealthReminder | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [copied, setCopied] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [testDateTime, setTestDateTime] = useState('');
  const [transition, setTransition] = useState(() => loadTransition(dateKey()));
  const notifiedKeys = useRef<Set<string>>(new Set());
  const emailedKeys = useRef<Set<string>>(new Set());
  const today = getTodayLog(healthState);
  const reminders = useMemo(() => buildReminders(healthState.settings), [healthState.settings]);
  const testNow = testDateTime ? new Date(testDateTime) : null;
  const nextReminder = getNextHealthReminder(testNow ?? new Date(), healthState.settings, testNow ? getTodayLog(healthState, testNow) : today);
  const weeklyTotals = getWeeklyTotals(healthState);
  const previousTotals = getPreviousWeekTotals(healthState);
  const notificationSupported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    const run = () => {
      const now = new Date();
      const currentToday = getTodayLog(healthState, now);
      const due = getDueHealthReminder(now, healthState.settings, currentToday);
      if (!due) return;
      const key = `${dateKey(now)}-${due.id}-${currentToday.snoozedUntil[due.id] ?? due.time}`;
      if (notifiedKeys.current.has(key)) return;
      notifiedKeys.current.add(key);

      if (healthState.settings.notificationsEnabled && healthState.settings.notificationPermissionStatus === 'granted' && notificationSupported) {
        new Notification(due.title, { body: due.notificationText, silent: !healthState.settings.reminderSound });
      } else {
        setBannerReminder(due);
      }

      if (healthState.settings.emailRemindersEnabled && healthState.settings.reminderEmailAddress && !emailedKeys.current.has(key)) {
        emailedKeys.current.add(key);
        void sendHealthEmail(due);
      }
    };

    run();
    const interval = window.setInterval(run, 60000);
    return () => window.clearInterval(interval);
  }, [healthState, notificationSupported]);

  const completeReminder = (reminder: HealthReminder) => {
    setHealthState((state) => markReminderDone(state, reminder));
    setBannerReminder(null);
  };

  const enableNotifications = async () => {
    if (!notificationSupported) {
      setHealthState((state) => ({ ...state, settings: { ...state.settings, notificationPermissionStatus: 'unsupported', notificationsEnabled: false } }));
      return;
    }
    if (Notification.permission === 'denied') {
      setHealthState((state) => ({ ...state, settings: { ...state.settings, notificationPermissionStatus: 'denied', notificationsEnabled: false } }));
      return;
    }
    const permission = await Notification.requestPermission();
    setHealthState((state) => ({
      ...state,
      settings: {
        ...state.settings,
        notificationPermissionStatus: permission,
        notificationsEnabled: permission === 'granted'
      }
    }));
  };

  const resetHealthData = () => {
    setHealthState((state) => ({ ...state, days: { [dateKey()]: createEmptyDayLog(dateKey()) } }));
  };

  const exportJson = () => {
    copyText(JSON.stringify(healthState, null, 2));
    setCopied('export');
  };

  const exportCsv = () => {
    const rows = [
      ['date', 'hydrationCount', 'outdoorMinutes', 'movementBreaks', 'eyeBreaks', 'lunchAwayFromScreenCount', 'shutdownCount', 'urgentTicketModeCount', 'skippedReminders'],
      ...Object.values(healthState.days).map((day) => [
        day.date,
        String(day.hydrationCount),
        String(day.outdoorMinutes),
        String(day.movementBreaks),
        String(day.eyeBreaks),
        String(day.lunchAwayFromScreenCount),
        String(day.shutdownCount),
        String(day.urgentTicketModeCount),
        String(day.skippedBreaks.length)
      ])
    ];
    copyText(rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n'));
    setCopied('health CSV');
  };

  const downloadIcs = () => {
    const blob = new Blob([buildIcs(reminders)], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'avance-health-reminders.ics';
    link.click();
    URL.revokeObjectURL(url);
    setCopied('ics download');
  };

  const sendHealthEmail = async (reminder: HealthReminder) => {
    try {
      const response = await fetch('/api/send-health-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: healthState.settings.reminderEmailAddress,
          subject: 'Avance health reset',
          body: reminder.notificationText
        })
      });
      const data = await response.json().catch(() => ({}));
      setEmailStatus(response.ok && data.ok ? 'Health reminder email sent.' : data.message ?? 'Email reminder could not be sent.');
    } catch {
      setEmailStatus('Email reminder could not be sent.');
    }
  };

  const saveTransition = (nextTransition = transition) => {
    window.localStorage.setItem(`avance-family-transition-${dateKey()}`, JSON.stringify(nextTransition));
    setCopied('transition');
  };

  const createTomorrowTask = () => {
    if (!transition.tomorrowAction.trim()) return;
    addTask({
      id: `task-transition-${Date.now()}`,
      title: transition.tomorrowAction,
      status: 'open',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      priority: 'medium',
      clientId: defaultClientId,
      note: 'Created from Health & Outdoors end-of-day transition.',
      createdAt: new Date().toISOString()
    });
    setCopied('tomorrow task');
  };

  return (
    <div>
      <section className="card">
        <h1>Health & Outdoors</h1>
        <p>Gentle wellbeing support for Monday and Wednesday Avance shifts. No medical records, no client data, no ticket data.</p>
        <div className="privacy-note">This is about sustainability, not perfection. It does not diagnose, prescribe, or store sensitive health information.</div>
      </section>

      {bannerReminder && (
        <section className="card health-banner" role="status" aria-live="polite">
          <h2>{bannerReminder.title}</h2>
          <p>{bannerReminder.notificationText}</p>
          <div className="health-action-row">
            <button type="button" onClick={() => completeReminder(bannerReminder)}>Done</button>
            {[15, 30, 60].map((minutes) => (
              <button key={minutes} type="button" className="small-action" onClick={() => {
                setHealthState((state) => snoozeReminder(state, bannerReminder.id, minutes));
                setBannerReminder(null);
              }}>
                Snooze {minutes} min
              </button>
            ))}
            <button type="button" className="small-action" onClick={() => {
              setHealthState((state) => skipReminder(state, bannerReminder.id));
              setBannerReminder(null);
            }}>
              Skip for now
            </button>
          </div>
        </section>
      )}

      <HealthyMspShiftPanel healthState={healthState} setHealthState={setHealthState} onReset={() => setShowReset(true)} />

      {showReset && (
        <section className="card health-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <h2 id="reset-title">2-minute reset</h2>
          <ol>
            <li>Put both feet on the floor.</li>
            <li>Relax jaw and shoulders.</li>
            <li>Breathe slowly.</li>
            <li>Look away from the screen.</li>
            <li>Name the next tiny action.</li>
            {healthState.settings.enableFaithPrompt && <li>Optional prayer: "Lord, give me wisdom, patience, and peace."</li>}
          </ol>
          <button type="button" onClick={() => setShowReset(false)}>Done</button>
        </section>
      )}

      <section className="card">
        <h2>Today's Shift Health Plan</h2>
        <div className="health-plan-grid">
          {reminders.map((reminder) => {
            const isDone = today.completedBreaks.includes(reminder.id);
            const isSkipped = today.skippedBreaks.includes(reminder.id);
            return (
              <article key={reminder.id} className="mini-card">
                <div className="skill-card-header">
                  <h3>{reminder.time} - {reminder.title}</h3>
                  <span className={isDone ? 'status-chip success' : 'status-chip info'}>{isDone ? 'done' : isSkipped ? 'reset later' : reminder.type}</span>
                </div>
                <p>{reminder.summary}</p>
                <p><strong>{reminder.action}</strong></p>
                <div className="health-action-row">
                  <button type="button" onClick={() => completeReminder(reminder)}>Done</button>
                  <button type="button" className="small-action" onClick={() => setHealthState((state) => snoozeReminder(state, reminder.id, 15))}>Snooze 15 min</button>
                  <button type="button" className="small-action" onClick={() => setHealthState((state) => skipReminder(state, reminder.id))}>Skip for now</button>
                  <button type="button" className="small-action" onClick={() => setHealthState((state) => setQuietMode(state, 60))}>Too busy / urgent ticket</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2>Next Recommended Break</h2>
        <p>{nextReminder ? `${nextReminder.time} - ${nextReminder.title}: ${nextReminder.action}` : 'No reminders due. Keep going steadily.'}</p>
      </section>

      <section className="card health-metrics-grid">
        <div className="mini-card">
          <h2>Hydration</h2>
          <p>{today.hydrationCount} water check-ins today.</p>
          <button type="button" onClick={() => setHealthState((state) => updateToday(state, (day) => ({ ...day, hydrationCount: day.hydrationCount + 1 })))}>Drink water</button>
        </div>
        <div className="mini-card">
          <h2>Outdoor / daylight time</h2>
          <p>{today.outdoorMinutes} minutes today.</p>
          <button type="button" onClick={() => setHealthState((state) => updateToday(state, (day) => ({ ...day, outdoorMinutes: day.outdoorMinutes + 5 })))}>Add 5 minutes</button>
        </div>
        <div className="mini-card">
          <h2>Eyes and posture</h2>
          <p>{today.eyeBreaks} eye breaks and {today.movementBreaks} movement breaks.</p>
          <button type="button" onClick={() => setHealthState((state) => updateToday(state, (day) => ({ ...day, eyeBreaks: day.eyeBreaks + 1, movementBreaks: day.movementBreaks + 1, lastBreakTime: new Date().toISOString() })))}>Look into the distance</button>
        </div>
        <div className="mini-card">
          <h2>Nervous-system reset</h2>
          <p>Relax your jaw and shoulders. Breathe slowly.</p>
          <button type="button" onClick={() => setShowReset(true)}>Tiny reset</button>
        </div>
        <div className="mini-card">
          <h2>End-of-day downshift</h2>
          <p>Close loops, note next actions, and let work stay at work.</p>
          <button type="button" onClick={() => setHealthState((state) => updateToday(state, (day) => ({ ...day, shutdownCount: day.shutdownCount + 1 })))}>Shutdown done</button>
        </div>
        <div className="mini-card">
          <h2>Weekly nature target</h2>
          <p>{weeklyTotals.outdoorMinutes} / 120 minutes outside this week.</p>
          <progress value={Math.min(weeklyTotals.outdoorMinutes, 120)} max={120} />
        </div>
      </section>

      <section className="card">
        <h2>Health trends without shame</h2>
        <p>Trend language stays gentle. A reset week is still useful information.</p>
        <div className="health-metrics-grid">
          <TrendCard label="Water" current={weeklyTotals.water} previous={previousTotals.water} unit="check-ins" />
          <TrendCard label="Outdoor time" current={weeklyTotals.outdoorMinutes} previous={previousTotals.outdoorMinutes} unit="minutes" />
          <TrendCard label="Eye breaks" current={weeklyTotals.eyeBreaks} previous={previousTotals.eyeBreaks} unit="breaks" />
          <TrendCard label="Shutdowns" current={weeklyTotals.shutdowns} previous={previousTotals.shutdowns} unit="times" />
        </div>
      </section>

      <section className="card">
        <h2>End-of-day family transition</h2>
        <p>Close work gently and name the next tiny action before family time.</p>
        <div className="quick-capture-form">
          <label>
            Closed loops
            <textarea value={transition.closedLoops} onChange={(event) => setTransition((current) => ({ ...current, closedLoops: event.target.value }))} placeholder="What did I close or hand over?" />
          </label>
          <label>
            Tomorrow's first action
            <input value={transition.tomorrowAction} onChange={(event) => setTransition((current) => ({ ...current, tomorrowAction: event.target.value }))} placeholder="First small work action next shift" />
          </label>
          <label>
            Transition intention
            <input value={transition.intention} onChange={(event) => setTransition((current) => ({ ...current, intention: event.target.value }))} placeholder="How do I want to arrive home?" />
          </label>
          {healthState.settings.enableFaithPrompt && <p className="health-muted">Optional prayer: Lord, help me leave work at work and be present with my family.</p>}
          <div className="status-button-row">
            <button type="button" onClick={() => saveTransition()}>Save transition</button>
            <button type="button" className="small-action" onClick={createTomorrowTask} disabled={!transition.tomorrowAction.trim()}>Create tomorrow task</button>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Why this helps</h2>
        <div className="health-research-grid">
          {healthResearchCards.map((card) => (
            <article key={card.id} className="mini-card">
              <div className="skill-card-header">
                <h3>{card.title}</h3>
                <span className="status-chip info">{card.confidenceLevel}</span>
              </div>
              <p>{card.summary}</p>
              <p><strong>Try:</strong> {card.action}</p>
              <a href={card.sourceUrl} target="_blank" rel="noreferrer">{card.sourceLabel}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Email Reminder Setup</h2>
        {healthState.settings.enableEmailSetup ? (
          <>
            <p>A static local-first app cannot reliably send scheduled email by itself. Email reminders need a backend endpoint, Google Apps Script, Gmail automation, or a scheduled service.</p>
            <div className="health-action-row">
              <button type="button" onClick={() => { copyText(reminders.map((r) => `${r.time} ${r.title}: ${r.notificationText}`).join('\n')); setCopied('schedule'); }}>Copy schedule text</button>
              <button type="button" className="small-action" onClick={() => { copyText(buildIcs(reminders)); setCopied('ics'); }}>Copy .ics calendar text</button>
              <button type="button" className="small-action" onClick={downloadIcs}>Download .ics file</button>
              <button type="button" className="small-action" onClick={() => { copyText(`${emailReminderText}\n\n${appsScriptPrompt}`); setCopied('script'); }}>Copy Apps Script prompt</button>
            </div>
            <div className="quick-capture-form">
              <label>
                Reminder email address
                <input
                  type="email"
                  value={healthState.settings.reminderEmailAddress}
                  onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, reminderEmailAddress: event.target.value } }))}
                  placeholder="you@example.com"
                />
              </label>
              <label className="checklist-item">
                <input
                  type="checkbox"
                  checked={healthState.settings.emailRemindersEnabled}
                  onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, emailRemindersEnabled: event.target.checked } }))}
                />
                Send email reminders while this app is open
              </label>
              <button type="button" className="small-action" onClick={() => nextReminder && sendHealthEmail(nextReminder)} disabled={!nextReminder}>
                Send test email for next reminder
              </button>
            </div>
            {copied && <p className="health-muted">Copied {copied}. No API keys or Gmail credentials are stored in this app.</p>}
            {emailStatus && <p className="health-muted">{emailStatus}</p>}
          </>
        ) : (
          <p>Email setup is disabled in settings.</p>
        )}
      </section>

      <section className="card">
        <h2>Weekly Health Review</h2>
        <div className="health-metrics-grid">
          <div className="mini-card"><strong>Water:</strong> {weeklyTotals.water}</div>
          <div className="mini-card"><strong>Outdoor minutes:</strong> {weeklyTotals.outdoorMinutes}</div>
          <div className="mini-card"><strong>Movement breaks:</strong> {weeklyTotals.movementBreaks}</div>
          <div className="mini-card"><strong>Eye breaks:</strong> {weeklyTotals.eyeBreaks}</div>
          <div className="mini-card"><strong>Lunch away:</strong> {weeklyTotals.lunchAway}</div>
          <div className="mini-card"><strong>Shutdowns:</strong> {weeklyTotals.shutdowns}</div>
          <div className="mini-card"><strong>Urgent ticket mode:</strong> {weeklyTotals.urgentTicketMode}</div>
          <div className="mini-card"><strong>Skipped reminders:</strong> {weeklyTotals.skipped}</div>
        </div>
        <ul className="reflection-list">
          <li>What helped me stay calm this week?</li>
          <li>When did I overfocus?</li>
          <li>Did I get outside on Avance days?</li>
          <li>What reminder was most useful?</li>
          <li>What should be gentler next week?</li>
        </ul>
        <div className="template-box">Josh used a structured wellbeing routine to support sustainable MSP work, including planned breaks, hydration prompts, screen breaks, and end-of-day shutdown habits.</div>
      </section>

      <section className="card">
        <h2>Settings</h2>
        <div className="quick-capture-form">
          <div>
            <strong>Shift days</strong>
            <div className="health-action-row">
              {shiftDayOptions.map((day) => (
                <label key={day.value} className="checklist-item">
                  <input
                    type="checkbox"
                    checked={healthState.settings.shiftDays.includes(day.value)}
                    onChange={(event) => setHealthState((state) => ({
                      ...state,
                      settings: {
                        ...state.settings,
                        mondayWednesdayOnly: false,
                        shiftDays: event.target.checked
                          ? [...state.settings.shiftDays, day.value].sort()
                          : state.settings.shiftDays.filter((value) => value !== day.value)
                      }
                    }))}
                  />
                  {day.label}
                </label>
              ))}
            </div>
          </div>
          <label>Shift start <input type="time" value={healthState.settings.shiftStart} onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, shiftStart: event.target.value } }))} /></label>
          <label>Shift end <input type="time" value={healthState.settings.shiftEnd} onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, shiftEnd: event.target.value } }))} /></label>
          <label>Reminder cadence
            <select value={healthState.settings.preferredReminderCadence} onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, preferredReminderCadence: event.target.value as typeof state.settings.preferredReminderCadence } }))}>
              <option value="default">Default</option>
              <option value="gentle">Gentle</option>
              <option value="frequent">Frequent</option>
            </select>
          </label>
          <div className="health-plan-grid">
            {reminders.map((reminder) => (
              <label key={reminder.id}>{reminder.title}
                <input type="time" value={reminder.time} onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, reminderTimes: { ...state.settings.reminderTimes, [reminder.id]: event.target.value } } }))} />
              </label>
            ))}
          </div>
          <label>Reminder test mode
            <input type="datetime-local" value={testDateTime} onChange={(event) => setTestDateTime(event.target.value)} />
          </label>
          <p className="health-muted">Test mode changes the displayed next reminder only. It does not send notifications or emails.</p>
          <div className="health-action-row">
            <button type="button" onClick={enableNotifications} disabled={healthState.settings.notificationPermissionStatus === 'denied'}>
              Enable health reminders
            </button>
            <span className="health-muted">Notification permission: {healthState.settings.notificationPermissionStatus}</span>
          </div>
          <EyeCareWorkModeToggle
            checked={healthState.settings.eyeCareWorkModeEnabled}
            onChange={(checked) => setHealthState((state) => ({
              ...state,
              settings: { ...state.settings, eyeCareWorkModeEnabled: checked }
            }))}
          />
          <label className="checklist-item"><input type="checkbox" checked={healthState.settings.enableFaithPrompt} onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, enableFaithPrompt: event.target.checked } }))} />Enable optional faith prompt</label>
          <label className="checklist-item"><input type="checkbox" checked={healthState.settings.enableEmailSetup} onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, enableEmailSetup: event.target.checked } }))} />Enable email setup section</label>
          <button type="button" className="small-action" onClick={() => setHealthState((state) => ({ ...state, settings: defaultHealthSettings }))}>Reset settings</button>
          <button type="button" className="small-action" onClick={resetHealthData}>Reset health data</button>
          <button type="button" className="small-action" onClick={exportJson}>Export health data JSON</button>
          <button type="button" className="small-action" onClick={exportCsv}>Export health data CSV</button>
        </div>
      </section>
    </div>
  );
}

function loadTransition(dayKey: string) {
  try {
    const raw = window.localStorage.getItem(`avance-family-transition-${dayKey}`);
    return raw ? JSON.parse(raw) as { closedLoops: string; tomorrowAction: string; intention: string } : { closedLoops: '', tomorrowAction: '', intention: '' };
  } catch {
    return { closedLoops: '', tomorrowAction: '', intention: '' };
  }
}

function getPreviousWeekTotals(healthState: HealthState) {
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  const previousWeekStart = new Date(thisWeekStart);
  previousWeekStart.setDate(thisWeekStart.getDate() - 7);

  return Object.values(healthState.days).reduce(
    (totals, day) => {
      const dayDate = new Date(`${day.date}T00:00:00`);
      if (dayDate < previousWeekStart || dayDate >= thisWeekStart) return totals;
      return {
        water: totals.water + day.hydrationCount,
        outdoorMinutes: totals.outdoorMinutes + day.outdoorMinutes,
        eyeBreaks: totals.eyeBreaks + day.eyeBreaks,
        shutdowns: totals.shutdowns + day.shutdownCount
      };
    },
    { water: 0, outdoorMinutes: 0, eyeBreaks: 0, shutdowns: 0 }
  );
}

function TrendCard({ label, current, previous, unit }: { label: string; current: number; previous: number; unit: string }) {
  const trend = current > previous ? 'more than last week' : current === previous ? 'steady' : 'reset week';
  return (
    <article className="mini-card">
      <h3>{label}</h3>
      <p>{current} {unit}</p>
      <span className="status-chip info">{trend}</span>
    </article>
  );
}

export default HealthOutdoors;
