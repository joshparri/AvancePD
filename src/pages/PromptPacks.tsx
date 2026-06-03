import { useEffect, useMemo, useState } from 'react';
import type { LearningItem, Task, WorkLog } from '../types';

type PromptPacksProps = {
  workLogs: WorkLog[];
  tasks: Task[];
  learningItems: LearningItem[];
  onNavigate: (page: string) => void;
};

type PromptCard = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  section: 'AI prompts' | 'Future enhancements';
};

const promptCards: PromptCard[] = [
  {
    id: 'daily-briefing',
    title: 'Daily briefing',
    description: 'Draft a safe, generic shift briefing based on recent work, priorities, and health reminders.',
    actionLabel: 'Generate briefing',
    section: 'AI prompts'
  },
  {
    id: 'health-check',
    title: 'Health check',
    description: 'Create a team-friendly status check that reminds you to hydrate, take breaks, and reset focus.',
    actionLabel: 'Generate health check',
    section: 'AI prompts'
  },
  {
    id: 'repeated-issue-coach',
    title: 'Repeated issue coach',
    description: 'Review repeated tags and work logs, then suggest a generic improvement or playbook draft.',
    actionLabel: 'Create coach note',
    section: 'AI prompts'
  },
  {
    id: 'work-log-summarizer',
    title: 'Work log summarizer',
    description: 'Summarize recent safe work logs into a short learning note or ticket-note starter.',
    actionLabel: 'Summarize logs',
    section: 'AI prompts'
  },
  {
    id: 'micro-learning-booster',
    title: 'Micro-learning booster',
    description: 'Recommend a short practice card and a focus statement that links to your current queue.',
    actionLabel: 'Boost learning',
    section: 'AI prompts'
  },
  {
    id: 'backup-reminder',
    title: 'Backup reminder',
    description: 'Create a safe reminder to validate exports, backups, and sync behavior within your local workflow.',
    actionLabel: 'Draft reminder',
    section: 'AI prompts'
  },
  {
    id: 'pd-focus-overview',
    title: 'PD focus overview',
    description: 'Summarize your current professional development focus and the next skill to practice.',
    actionLabel: 'Generate review',
    section: 'AI prompts'
  },
  {
    id: 'weekly-retrospective',
    title: 'Weekly retrospective',
    description: 'Create a safe weekly reflection prompt that highlights learning, follow-ups, and wins.',
    actionLabel: 'Generate retrospective',
    section: 'AI prompts'
  },
  {
    id: 'email-to-note-import',
    title: 'Email-to-note import',
    description: 'Plan a future import flow that turns plain text or email summaries into safe working notes.',
    actionLabel: 'Plan import flow',
    section: 'Future enhancements'
  },
  {
    id: 'calendar-reminders',
    title: 'Calendar reminders',
    description: 'Outline a local reminder assistant that can create or preview calendar reminders from tasks.',
    actionLabel: 'Plan reminder flow',
    section: 'Future enhancements'
  },
  {
    id: 'attachment-support',
    title: 'Attachment support',
    description: 'Design safer local attachment handling for screenshots, links, and work references.',
    actionLabel: 'Plan attachment support',
    section: 'Future enhancements'
  },
  {
    id: 'mobile-capture',
    title: 'Mobile capture',
    description: 'Define a mobile-friendly quick capture and offline work log experience.',
    actionLabel: 'Plan mobile flow',
    section: 'Future enhancements'
  },
  {
    id: 'pwa-improvements',
    title: 'PWA improvements',
    description: 'Identify the key improvements needed to make the app feel more app-like on mobile devices.',
    actionLabel: 'Plan PWA upgrade',
    section: 'Future enhancements'
  },
  {
    id: 'sync-integrations',
    title: 'Sync & integrations',
    description: 'Capture planned sync points like Supabase, Gmail, Calendar, and PSA/RMM connectors.',
    actionLabel: 'Plan sync path',
    section: 'Future enhancements'
  }
];

function PromptPacks({ workLogs, tasks, learningItems, onNavigate }: PromptPacksProps) {
  const [activePromptId, setActivePromptId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('avance-prompt-packs-active') ?? '';
  });
  const [generatedText, setGeneratedText] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('avance-prompt-packs-text') ?? '';
  });

  const dueLearningCount = learningItems.filter((item) => new Date(item.nextReviewDate) <= new Date()).length;
  const openTasksCount = tasks.filter((task) => task.status !== 'done').length;
  const highPriorityTasks = tasks.filter((task) => task.priority === 'high' && task.status !== 'done').length;
  const recentLogSummaries = useMemo(
    () => workLogs.slice(0, 3).map((log) => `• ${log.title} (${log.tags.join(', ') || 'no tags'})`).join('\n'),
    [workLogs]
  );

  const buildSampleText = (id: string) => {
    switch (id) {
      case 'daily-briefing':
        return `Daily briefing:\n- Focus on ${highPriorityTasks ? 'high-priority tasks and the current incident queue' : 'steady follow-up discipline and safe handover notes'}.\n- Review ${openTasksCount} open follow-up${openTasksCount === 1 ? '' : 's'}.\n- Keep notes generic and evidence-safe.\n- Check health resets and hydration during the shift.`;
      case 'health-check':
        return `Health check:\n- Take a short break every 60 minutes.\n- Drink water before the next task.\n- Pause for a stretch or outdoor step if you have more than 2 hours of screen time.\n- Confirm the next task is clear and the next nudge date is set.`;
      case 'repeated-issue-coach':
        return `Repeated issue coach:\n- There are repeated issues with work log themes such as ${recentLogSummaries || 'no repeated safe issues yet'}.\n- Capture the pattern in a generic playbook entry.\n- Focus on steps, result, and when to escalate to avoid repeat service impact.`;
      case 'work-log-summarizer':
        return `Work log summarizer:\n${recentLogSummaries || 'No recent logs available to summarize.'}`;
      case 'micro-learning-booster':
        return `Micro-learning booster:\n- Review one card related to your current work.\n- Pick a quick concept to practise in 5 minutes.\n- Aim for one recall or scenario review before the next shift.`;
      case 'backup-reminder':
        return `Backup reminder:\n- Check local exports and save your work log snapshot.\n- If you have used the app for more than one day, export the current notes.\n- Confirm the last backup or data sync is complete.`;
      case 'pd-focus-overview':
        return `PD focus overview:\n- ${learningItems.length} learning items in progress.\n- ${dueLearningCount} item${dueLearningCount === 1 ? '' : 's'} due for review.\n- Pick a note to review and convert into a safe evidence item if it is manager-ready.`;
      case 'weekly-retrospective':
        return `Weekly retrospective:\n- What went well this week?\n- Which follow-ups were resolved and which are still waiting?\n- What skill did you make progress on?\n- What should you practise next week?`;
      case 'email-to-note-import':
        return `This feature would let you import email summaries and turn them into safe note drafts without client-sensitive data. It should keep the import flow local and optional.`;
      case 'calendar-reminders':
        return `This feature would let you generate calendar reminder drafts for tasks and follow-ups, then preview them before saving to your local calendar or external calendar service.`;
      case 'attachment-support':
        return `This feature would let you attach safe files, screenshots, and reference notes to a work log while keeping private content out of the shared summary.`;
      case 'mobile-capture':
        return `This feature would make quick capture easier on small screens. It should support fast text entry, voice prompts, and offline save until the next sync.`;
      case 'pwa-improvements':
        return `This feature would improve the app shell with offline loading, install prompts, and a home-screen friendly experience for mobile usage.`;
      case 'sync-integrations':
        return `This feature would document how Supabase sync, Gmail/Calendar connectors, and PSA/RMM integration points join the local-first workflow.`;
      default:
        return 'Select a card to generate a prompt or feature plan.';
    }
  };

  const handleGenerate = (id: string) => {
    setActivePromptId(id);
    const text = buildSampleText(id);
    setGeneratedText(text);
  };

  const selectedPrompt = promptCards.find((card) => card.id === activePromptId);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('avance-prompt-packs-active', activePromptId);
    window.localStorage.setItem('avance-prompt-packs-text', generatedText);
  }, [activePromptId, generatedText]);

  return (
    <div>
      <section className="card">
        <h1>AI Prompt Packs</h1>
        <p>Use these safe prompt templates to turn local work into shift summaries, health checks, learning boosters, and planning notes.</p>
        <div className="metric-row">
          <span className="status-chip info">{workLogs.length} work logs</span>
          <span className="status-chip warn">{openTasksCount} open tasks</span>
          <span className="status-chip success">{learningItems.length} PD notes</span>
        </div>
      </section>

      <section className="card">
        <h2>AI prompt pack ideas</h2>
        <div className="card-grid">
          {promptCards.filter((card) => card.section === 'AI prompts').map((card) => (
            <article key={card.id} className="mini-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <button type="button" onClick={() => handleGenerate(card.id)}>{card.actionLabel}</button>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Future enhancements</h2>
        <p>Design notes for features you can add later, organized around safe extensions and local-first workflows.</p>
        <div className="card-grid">
          {promptCards.filter((card) => card.section === 'Future enhancements').map((card) => (
            <article key={card.id} className="mini-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <button type="button" onClick={() => handleGenerate(card.id)}>{card.actionLabel}</button>
            </article>
          ))}
        </div>
      </section>

      {activePromptId && (
        <section className="card">
          <h2>Generated draft{selectedPrompt ? ` for ${selectedPrompt.title}` : ''}</h2>
          <p>Use this as a starting point or capture it as a safe note.</p>
          <pre className="template-box">{generatedText}</pre>
          <div className="status-button-row">
            <button type="button" onClick={() => navigator.clipboard?.writeText(generatedText)}>
              Copy draft
            </button>
            <button type="button" onClick={() => onNavigate('kbLearning')}>Open KB Learning Machine</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default PromptPacks;
