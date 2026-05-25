import { useMemo, useState } from 'react';
import { mspScenarios } from '../data/mspScenarios';
import type { KnowledgeEntry, LearningItem, Playbook, Task, TimeEntry, WorkLog } from '../types';

type SearchProps = {
  tasks: Task[];
  workLogs: WorkLog[];
  knowledgeEntries: KnowledgeEntry[];
  playbooks: Playbook[];
  learningItems: LearningItem[];
  timeEntries: TimeEntry[];
  onNavigate: (page: string) => void;
};

type SearchResult = {
  id: string;
  title: string;
  type: string;
  summary: string;
  page: string;
};

function Search({ tasks, workLogs, knowledgeEntries, playbooks, learningItems, timeEntries, onNavigate }: SearchProps) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    const allResults: SearchResult[] = [
      ...tasks.map((task) => ({
        id: task.id,
        title: task.title,
        type: 'Task',
        summary: `${task.status} follow-up due ${task.dueDate}. ${task.note}`,
        page: 'tasks'
      })),
      ...workLogs.map((log) => ({
        id: log.id,
        title: log.title,
        type: 'Work log',
        summary: `${log.summary} ${log.tags.join(' ')}`,
        page: 'worklogs'
      })),
      ...knowledgeEntries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        type: 'Knowledge',
        summary: `${entry.summary} ${entry.category} ${entry.tags.join(' ')}`,
        page: 'knowledge'
      })),
      ...playbooks.map((playbook) => ({
        id: playbook.id,
        title: playbook.title,
        type: 'Playbook',
        summary: `${playbook.notes} ${playbook.symptoms.join(' ')} ${playbook.firstChecks.join(' ')}`,
        page: 'playbooks'
      })),
      ...learningItems.map((item) => ({
        id: item.id,
        title: item.topic,
        type: 'Learning',
        summary: `${item.notes} ${item.confidence} ${item.noteType ?? ''}`,
        page: 'pd'
      })),
      ...timeEntries.map((entry) => ({
        id: entry.id,
        title: `${entry.date} - ${entry.hours}h`,
        type: 'Time',
        summary: `${entry.description} ${entry.billable ? 'billable' : 'non-billable'}`,
        page: 'time'
      })),
      ...mspScenarios.map((scenario) => ({
        id: scenario.id,
        title: scenario.title,
        type: 'Scenario',
        summary: `${scenario.category} ${scenario.difficulty} ${scenario.learningPoints.join(' ')}`,
        page: 'mspScenarios'
      }))
    ];

    return allResults.filter((result) => `${result.title} ${result.type} ${result.summary}`.toLowerCase().includes(normalized)).slice(0, 40);
  }, [knowledgeEntries, learningItems, playbooks, query, tasks, timeEntries, workLogs]);

  return (
    <div>
      <section className="card">
        <h1>Search</h1>
        <p>Search local tasks, logs, knowledge, playbooks, learning notes, time entries, and scenario titles.</p>
        <div className="privacy-note">Search is local to this browser. Do not use client names, credentials, IPs, hostnames, or copied ticket text as search content.</div>
      </section>

      <section className="card">
        <label className="inline-control">
          Search everything
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: escalation, M365, follow-up, DNS" autoFocus />
        </label>
      </section>

      <section className="card">
        <h2>Results</h2>
        {!query.trim() ? (
          <p>Type a generic keyword to search local app content.</p>
        ) : results.length ? (
          <div className="health-plan-grid">
            {results.map((result) => (
              <article key={`${result.type}-${result.id}`} className="mini-card">
                <div className="skill-card-header">
                  <h3>{result.title}</h3>
                  <span className="status-chip info">{result.type}</span>
                </div>
                <p>{result.summary}</p>
                <button type="button" className="small-action" onClick={() => onNavigate(result.page)}>Open {result.type}</button>
              </article>
            ))}
          </div>
        ) : (
          <p>No local results found. Try a broader generic term.</p>
        )}
      </section>
    </div>
  );
}

export default Search;
