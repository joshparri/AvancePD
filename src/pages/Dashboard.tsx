import type { Client, LearningItem, Task, TimeEntry, WorkLog, Shift } from '../types';
import QuickCapture from '../components/QuickCapture';
import HealthyMspShiftPanel from '../components/HealthyMspShiftPanel';
import DataBackupPanel from '../components/DataBackupPanel';
import type { HealthState } from '../utils/healthOutdoors';
import { getTodayLog } from '../utils/healthOutdoors';
import { mspScenarios } from '../data/mspScenarios';
import { microLearningCards } from '../data/microLearning';

const PAGE_TITLE = 'Dashboard';

type DashboardProps = {
  shifts: Shift[];
  clients: Client[];
  tasks: Task[];
  workLogs: WorkLog[];
  timeEntries: TimeEntry[];
  learningItems: LearningItem[];
  addWorkLog: (log: WorkLog) => void;
  addTask: (task: Task) => void;
  addLearningItem: (item: LearningItem) => void;
  showOnboarding: boolean;
  completeOnboarding: () => void;
  healthState: HealthState;
  setHealthState: (updater: (state: HealthState) => HealthState) => void;
  onNavigateHealth: () => void;
  onNavigate: (page: string) => void;
};

function Dashboard({
  shifts,
  clients,
  tasks,
  workLogs,
  timeEntries,
  addWorkLog,
  addTask,
  addLearningItem,
  showOnboarding,
  completeOnboarding,
  healthState,
  setHealthState,
  onNavigateHealth,
  onNavigate
}: DashboardProps) {
  const nextShift = shifts[0];
  const nextClient = clients.find((client) => client.id === nextShift?.clientId);
  const openTasks = tasks.filter((task) => task.status === 'open');
  const recentLogs = workLogs.slice(0, 3);
  const invoiceHours = timeEntries.reduce((sum, entry) => sum + (entry.billable ? entry.hours : 0), 0);
  const repeatedTags = getRepeatedTags(workLogs);

  const hasData = tasks.length > 0 || workLogs.length > 0 || timeEntries.length > 0;
  const isAvanceDay = [1, 3].includes(new Date().getDay());
  const scenarioOfWeek = mspScenarios[getWeekNumber() % mspScenarios.length];
  const microCardOfDay = microLearningCards[new Date().getDay() % microLearningCards.length];

  return (
    <div>
      <section className="card">
        <h1>{PAGE_TITLE}</h1>
        {isAvanceDay && <div className="privacy-note">Today is an Avance day. Keep notes generic, protect client details, and use tiny resets.</div>}
        {hasData ? (
          <p>Welcome back, Josh. Your next shift is:</p>
        ) : (
          <p>Welcome to your Avance Work Companion! Start by capturing your first work log or task below.</p>
        )}
        <div className="card-grid">
          <div className="card">
            <h2>Next shift</h2>
            {nextShift ? (
              <>
                <p>{nextShift.dayOfWeek} {nextShift.startTime}–{nextShift.endTime}</p>
                <p>{nextClient?.name}</p>
                <p>{nextShift.priorities[0]}</p>
              </>
            ) : (
              <p>No upcoming shifts scheduled. Add shifts in the Shifts section.</p>
            )}
          </div>
          <div className="card">
            <h2>Invoice cycle</h2>
            {timeEntries.length > 0 ? (
              <p>{invoiceHours.toFixed(1)} billable hours logged</p>
            ) : (
              <p>No time entries yet. Track your hours in the Time section.</p>
            )}
          </div>
        </div>
      </section>

      {showOnboarding && (
        <section className="card">
          <h2>Getting started</h2>
          <p>Use this short setup flow to make the app useful before the next shift.</p>
          <div className="health-plan-grid">
            <article className="mini-card">
              <h3>1. Set today's focus</h3>
              <p>Open Avance Workday and choose a generic work mode.</p>
              <button type="button" onClick={() => onNavigate('avanceWorkday')}>Open Workday</button>
            </article>
            <article className="mini-card">
              <h3>2. Capture one follow-up</h3>
              <p>Use Quick capture below for tasks, work logs, and learned-today notes.</p>
              <button type="button" onClick={() => document.getElementById('quick-capture-title')?.focus()}>Go to capture</button>
            </article>
            <article className="mini-card">
              <h3>3. Practise one skill</h3>
              <p>Pick a micro-learning card or scenario when the queue is steady.</p>
              <button type="button" onClick={() => onNavigate('microLearning')}>Open Micro-Learning</button>
            </article>
            <article className="mini-card">
              <h3>4. Keep work sustainable</h3>
              <p>Use Health & Outdoors for water, eye breaks, outdoor time, and shutdown.</p>
              <button type="button" onClick={onNavigateHealth}>Open Health & Outdoors</button>
            </article>
          </div>
          <button onClick={completeOnboarding}>Hide onboarding</button>
        </section>
      )}

      <HealthyMspShiftPanel
        healthState={healthState}
        setHealthState={setHealthState}
        onNavigate={onNavigateHealth}
        onReset={onNavigateHealth}
      />

      <section className="card">
        <h2>Today's tiny practice</h2>
        <div className="health-plan-grid">
          <article className="mini-card">
            <h3>Scenario of the week</h3>
            <p>{scenarioOfWeek.title}</p>
            <button type="button" onClick={() => onNavigate('mspScenarios')}>Practise scenario</button>
          </article>
          <article className="mini-card">
            <h3>Micro-learning card</h3>
            <p>{microCardOfDay.topic}</p>
            <button type="button" onClick={() => onNavigate('microLearning')}>Read card</button>
          </article>
          <article className="mini-card">
            <h3>Lunch away from screen</h3>
            <p>Mark lunch as a real pause if you can.</p>
            <button type="button" onClick={() => setHealthState((state) => {
              const today = getTodayLog(state);
              return { ...state, days: { ...state.days, [today.date]: { ...today, lunchAwayFromScreenCount: today.lunchAwayFromScreenCount + 1 } } };
            })}>Lunch reset done</button>
          </article>
        </div>
      </section>

      <QuickCapture
        clients={clients}
        addWorkLog={addWorkLog}
        addTask={addTask}
        addLearningItem={addLearningItem}
      />

      <section className="card">
        <h2>Open follow-ups</h2>
        {openTasks.length ? (
          <ul>
            {openTasks.map((task) => (
              <li key={task.id}>{task.title} — due {task.dueDate}</li>
            ))}
          </ul>
        ) : (
          <div>
            <p>🎉 No open follow-ups! All caught up.</p>
            <p><em>Tasks you create will appear here to keep work visible across shifts.</em></p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Recent work logs</h2>
        {recentLogs.length ? (
          <ul>
            {recentLogs.map((log) => (
              <li key={log.id}>{log.title}</li>
            ))}
          </ul>
        ) : (
          <div>
            <p>No work logs yet.</p>
            <p><em>Use quick capture above or visit the Work Logs page to document troubleshooting and fixes.</em></p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Repeated issue suggestions</h2>
        {repeatedTags.length ? (
          <div className="health-plan-grid">
            {repeatedTags.map((tag) => (
              <article key={tag.label} className="mini-card">
                <h3>{tag.label}</h3>
                <p>Seen {tag.count} times in local work logs. Consider turning this into a generic playbook or knowledge note.</p>
                <div className="status-button-row">
                  <button type="button" onClick={() => onNavigate('playbooks')}>Open Playbooks</button>
                  <button type="button" className="small-action" onClick={() => onNavigate('knowledge')}>Open Knowledge</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No repeated safe tags yet. Add generic tags in Quick capture to surface patterns over time.</p>
        )}
      </section>

      <DataBackupPanel />
    </div>
  );
}

function getRepeatedTags(workLogs: WorkLog[]) {
  const counts = workLogs.reduce<Record<string, number>>((acc, log) => {
    log.tags.forEach((tag) => {
      const normalized = tag.trim().toLowerCase();
      if (!normalized) return;
      acc[normalized] = (acc[normalized] ?? 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(counts)
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));
}

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.floor(((now.getTime() - start.getTime()) / 86400000 + start.getDay()) / 7);
}

export default Dashboard;
