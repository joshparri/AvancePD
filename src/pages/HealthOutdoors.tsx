import { useEffect, useMemo, useRef, useState } from 'react';
import { healthResearchCards } from '../data/healthResearch';
import HealthyMspShiftPanel from '../components/HealthyMspShiftPanel';
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

type HealthOutdoorsProps = {
  healthState: HealthState;
  setHealthState: (updater: (state: HealthState) => HealthState) => void;
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

function HealthOutdoors({ healthState, setHealthState }: HealthOutdoorsProps) {
  const [bannerReminder, setBannerReminder] = useState<HealthReminder | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [copied, setCopied] = useState('');
  const notifiedKeys = useRef<Set<string>>(new Set());
  const today = getTodayLog(healthState);
  const reminders = useMemo(() => buildReminders(healthState.settings), [healthState.settings]);
  const nextReminder = getNextHealthReminder(new Date(), healthState.settings, today);
  const weeklyTotals = getWeeklyTotals(healthState);
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
              <button type="button" className="small-action" onClick={() => { copyText(`${emailReminderText}\n\n${appsScriptPrompt}`); setCopied('script'); }}>Copy Apps Script prompt</button>
            </div>
            {copied && <p className="health-muted">Copied {copied}. No API keys or Gmail credentials are stored in this app.</p>}
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
          <div className="health-action-row">
            <button type="button" onClick={enableNotifications} disabled={healthState.settings.notificationPermissionStatus === 'denied'}>
              Enable health reminders
            </button>
            <span className="health-muted">Notification permission: {healthState.settings.notificationPermissionStatus}</span>
          </div>
          <label className="checklist-item"><input type="checkbox" checked={healthState.settings.enableFaithPrompt} onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, enableFaithPrompt: event.target.checked } }))} />Enable optional faith prompt</label>
          <label className="checklist-item"><input type="checkbox" checked={healthState.settings.enableEmailSetup} onChange={(event) => setHealthState((state) => ({ ...state, settings: { ...state.settings, enableEmailSetup: event.target.checked } }))} />Enable email setup section</label>
          <button type="button" className="small-action" onClick={() => setHealthState((state) => ({ ...state, settings: defaultHealthSettings }))}>Reset settings</button>
          <button type="button" className="small-action" onClick={resetHealthData}>Reset health data</button>
          <button type="button" className="small-action" onClick={exportJson}>Export health data JSON</button>
        </div>
      </section>
    </div>
  );
}

export default HealthOutdoors;
