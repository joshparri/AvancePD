import type { Client, LearningItem, Task, TimeEntry, WorkLog, Shift } from '../types';
import QuickCapture from '../components/QuickCapture';
import HealthyMspShiftPanel from '../components/HealthyMspShiftPanel';
import type { HealthState } from '../utils/healthOutdoors';

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
  onNavigateHealth
}: DashboardProps) {
  const nextShift = shifts[0];
  const nextClient = clients.find((client) => client.id === nextShift?.clientId);
  const openTasks = tasks.filter((task) => task.status === 'open');
  const recentLogs = workLogs.slice(0, 3);
  const invoiceHours = timeEntries.reduce((sum, entry) => sum + (entry.billable ? entry.hours : 0), 0);

  const hasData = tasks.length > 0 || workLogs.length > 0 || timeEntries.length > 0;

  return (
    <div>
      <section className="card">
        <h1>{PAGE_TITLE}</h1>
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
          <p>Use quick capture to log work, create follow-ups, and capture MSP learning from every shift.</p>
          <button onClick={completeOnboarding}>Got it — hide this tip</button>
        </section>
      )}

      <HealthyMspShiftPanel
        healthState={healthState}
        setHealthState={setHealthState}
        onNavigate={onNavigateHealth}
        onReset={onNavigateHealth}
      />

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
    </div>
  );
}

export default Dashboard;
