import { useMemo, useState } from 'react';
import { mspScenarios } from '../data/mspScenarios';
import { getWeeklyTotals, type HealthState } from '../utils/healthOutdoors';
import type { AvanceProgress } from '../utils/progressStorage';
import type { LearningItem, Task, WorkLog } from '../types';

type WeeklyReviewProps = {
  progress: AvanceProgress;
  tasks: Task[];
  workLogs: WorkLog[];
  learningItems: LearningItem[];
  healthState: HealthState;
};

function isThisWeek(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return date >= weekStart && date <= now;
}

function WeeklyReview({ progress, tasks, workLogs, learningItems, healthState }: WeeklyReviewProps) {
  const [copyStatus, setCopyStatus] = useState('');
  const summary = useMemo(() => {
    const weeklyLogs = workLogs.filter((log) => isThisWeek(log.createdAt));
    const weeklyLearning = learningItems.filter((item) => item.lastReviewedDate ? isThisWeek(`${item.lastReviewedDate}T00:00:00`) : false);
    const openTasks = tasks.filter((task) => task.status !== 'done');
    const practisedScenarios = mspScenarios.filter((scenario) => {
      const status = progress.scenarioProgress[scenario.id]?.status;
      return status === 'practised' || status === 'confident' || status === 'needs-review';
    });
    const healthTotals = getWeeklyTotals(healthState);
    const confidenceCounts = learningItems.reduce(
      (counts, item) => ({ ...counts, [item.confidence]: counts[item.confidence] + 1 }),
      { low: 0, medium: 0, high: 0 }
    );
    return { weeklyLogs, weeklyLearning, openTasks, practisedScenarios, healthTotals, confidenceCounts };
  }, [healthState, learningItems, progress, tasks, workLogs]);

  const managerSummary = [
    'Weekly Avance PD summary',
    '',
    `- Work logs captured this week: ${summary.weeklyLogs.length}`,
    `- Learning notes reviewed this week: ${summary.weeklyLearning.length}`,
    `- Open follow-ups visible: ${summary.openTasks.length}`,
    `- MSP scenarios practised overall: ${summary.practisedScenarios.length}`,
    `- Health routine actions this week: ${summary.healthTotals.water + summary.healthTotals.movementBreaks + summary.healthTotals.eyeBreaks + summary.healthTotals.shutdowns}`,
    '',
    'Josh continued using structured routines for sustainable MSP work, including follow-up tracking, learning review, safe evidence capture, and wellbeing prompts.'
  ].join('\n');

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(managerSummary);
      setCopyStatus('Weekly summary copied.');
    } catch {
      setCopyStatus('Could not copy automatically. Select the text manually.');
    }
  };

  return (
    <div>
      <section className="card">
        <h1>Weekly Review</h1>
        <p>A calm review of work habits, learning, follow-ups, scenarios, and health routines.</p>
      </section>

      <section className="card">
        <h2>Weekly scorecard</h2>
        <div className="health-metrics-grid">
          <Metric label="Work logs this week" value={summary.weeklyLogs.length} />
          <Metric label="Learning notes reviewed" value={summary.weeklyLearning.length} />
          <Metric label="Open follow-ups" value={summary.openTasks.length} />
          <Metric label="Scenarios practised" value={summary.practisedScenarios.length} />
          <Metric label="Water check-ins" value={summary.healthTotals.water} />
          <Metric label="Outdoor minutes" value={summary.healthTotals.outdoorMinutes} />
          <Metric label="Movement breaks" value={summary.healthTotals.movementBreaks} />
          <Metric label="Shutdowns" value={summary.healthTotals.shutdowns} />
          <Metric label="High confidence notes" value={summary.confidenceCounts.high} />
          <Metric label="Medium confidence notes" value={summary.confidenceCounts.medium} />
          <Metric label="Low confidence notes" value={summary.confidenceCounts.low} />
        </div>
      </section>

      <section className="card">
        <h2>Reflection prompts</h2>
        <ul>
          <li>What helped me stay steady this week?</li>
          <li>Which follow-up needs the first action next shift?</li>
          <li>What skill track should I practise next?</li>
          <li>What work habit should be gentler next week?</li>
          <li>What can be safely added to Evidence Pack?</li>
        </ul>
      </section>

      <section className="card">
        <div className="skill-card-header">
          <h2>Manager-safe summary</h2>
          <button type="button" onClick={copySummary}>Copy weekly summary</button>
        </div>
        {copyStatus && <p>{copyStatus}</p>}
        <pre className="template-box">{managerSummary}</pre>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="mini-card">
      <h3>{value}</h3>
      <p>{label}</p>
    </article>
  );
}

export default WeeklyReview;
