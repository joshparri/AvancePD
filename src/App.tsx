import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import ShiftScheduler from './pages/ShiftScheduler';
import Tasks from './pages/Tasks';
import WorkLogs from './pages/WorkLogs';
import Knowledge from './pages/Knowledge';
import Playbooks from './pages/Playbooks';
import Time from './pages/Time';
import PD from './pages/PD';
import MspSkills from './pages/MspSkills';
import MspScenarios from './pages/MspScenarios';
import MspQuiz from './pages/MspQuiz';
import TicketNotes from './pages/TicketNotes';
import CommunicationPractice from './pages/CommunicationPractice';
import MspRoadmap from './pages/MspRoadmap';
import AvanceWorkday from './pages/AvanceWorkday';
import EvidencePack from './pages/EvidencePack';
import MicroLearning from './pages/MicroLearning';
import HealthOutdoors from './pages/HealthOutdoors';
import Search from './pages/Search';
import ShortcutOverlay from './components/ShortcutOverlay';
import SkillTracks from './pages/SkillTracks';
import WeeklyReview from './pages/WeeklyReview';
import ShiftCommandCenter from './pages/ShiftCommandCenter';
import type { MspSkillReadiness } from './data/mspSkills';
import {
  incrementTicketNotePractice as incrementTicketNotePracticeProgress,
  loadProgress,
  markMicroCardViewed as markMicroCardViewedProgress,
  saveProgress,
  setScenarioProgress,
  setSkillReadiness,
  updateWorkdayProgress,
  type ScenarioStatus
} from './utils/progressStorage';
import { loadHealthState, saveHealthState, type HealthState } from './utils/healthOutdoors';
import {
  clients as sampleClients,
  shifts as sampleShifts,
  workLogs as sampleWorkLogs,
  tasks as sampleTasks,
  knowledgeEntries as sampleKnowledgeEntries,
  playbooks as samplePlaybooks,
  learningItems as sampleLearningItems,
  timeEntries as sampleTimeEntries
} from './data/sampleData';
import type { KnowledgeEntry, LearningItem, Playbook, Task, TimeEntry, WorkLog } from './types';
import './App.css';

const pages = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'search', label: 'Search' },
  { id: 'shifts', label: 'Shifts' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'worklogs', label: 'Work Logs' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'playbooks', label: 'Playbooks' },
  { id: 'time', label: 'Time' },
  { id: 'pd', label: 'PD' },
  { id: 'weeklyReview', label: 'Weekly Review' },
  { id: 'avanceWorkday', label: 'Avance Workday' },
  { id: 'shiftCommandCenter', label: 'Command Center' },
  { id: 'healthOutdoors', label: 'Health & Outdoors' },
  { id: 'skillTracks', label: 'Skill Tracks' },
  { id: 'mspSkills', label: 'MSP Skills' },
  { id: 'mspScenarios', label: 'MSP Scenarios' },
  { id: 'mspQuiz', label: 'Strict Quiz' },
  { id: 'ticketNotes', label: 'Ticket Notes' },
  { id: 'communicationPractice', label: 'Communication Practice' },
  { id: 'mspRoadmap', label: 'MSP Roadmap' },
  { id: 'evidencePack', label: 'Evidence Pack' },
  { id: 'microLearning', label: 'Micro-Learning' }
];

type PageId =
  | 'dashboard'
  | 'search'
  | 'shifts'
  | 'tasks'
  | 'worklogs'
  | 'knowledge'
  | 'playbooks'
  | 'time'
  | 'pd'
  | 'weeklyReview'
  | 'avanceWorkday'
  | 'shiftCommandCenter'
  | 'healthOutdoors'
  | 'skillTracks'
  | 'mspSkills'
  | 'mspScenarios'
  | 'mspQuiz'
  | 'ticketNotes'
  | 'communicationPractice'
  | 'mspRoadmap'
  | 'evidencePack'
  | 'microLearning';

function loadPersisted<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [workLogs, setWorkLogs] = useState<WorkLog[]>(() => loadPersisted('avance-workLogs', sampleWorkLogs));
  const [tasks, setTasks] = useState<Task[]>(() => loadPersisted('avance-tasks', sampleTasks));
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>(() => loadPersisted('avance-knowledgeEntries', sampleKnowledgeEntries));
  const [playbooks, setPlaybooks] = useState<Playbook[]>(() => loadPersisted('avance-playbooks', samplePlaybooks));
  const [learningItems, setLearningItems] = useState<LearningItem[]>(() => loadPersisted('avance-learningItems', sampleLearningItems));
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => loadPersisted('avance-timeEntries', sampleTimeEntries));
  const [progress, setProgress] = useState(loadProgress);
  const [healthState, setHealthState] = useState<HealthState>(loadHealthState);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('avance-onboarded') !== 'true';
  });

  useEffect(() => {
    window.localStorage.setItem('avance-workLogs', JSON.stringify(workLogs));
  }, [workLogs]);

  useEffect(() => {
    window.localStorage.setItem('avance-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    window.localStorage.setItem('avance-knowledgeEntries', JSON.stringify(knowledgeEntries));
  }, [knowledgeEntries]);

  useEffect(() => {
    window.localStorage.setItem('avance-playbooks', JSON.stringify(playbooks));
  }, [playbooks]);

  useEffect(() => {
    window.localStorage.setItem('avance-learningItems', JSON.stringify(learningItems));
  }, [learningItems]);

  useEffect(() => {
    window.localStorage.setItem('avance-timeEntries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveHealthState(healthState);
  }, [healthState]);

  useEffect(() => {
    window.localStorage.setItem('avance-onboarded', showOnboarding ? 'false' : 'true');
  }, [showOnboarding]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT';
        if (!isTyping) {
          event.preventDefault();
          setShowShortcuts(true);
        }
      }
      if (event.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addWorkLog = (log: WorkLog) => setWorkLogs((current) => [log, ...current]);
  const updateWorkLog = (updatedLog: WorkLog) => setWorkLogs((current) => current.map((log) => (log.id === updatedLog.id ? updatedLog : log)));
  const deleteWorkLog = (logId: string) => {
    if (window.confirm('Remove this local work log?')) {
      setWorkLogs((current) => current.filter((log) => log.id !== logId));
    }
  };
  const addTask = (task: Task) => setTasks((current) => [task, ...current]);
  const updateTask = (updatedTask: Task) => setTasks((current) => current.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  const deleteTask = (taskId: string) => {
    if (window.confirm('Remove this local task?')) {
      setTasks((current) => current.filter((task) => task.id !== taskId));
    }
  };
  const addKnowledgeEntry = (entry: KnowledgeEntry) => setKnowledgeEntries((current) => [entry, ...current]);
  const updateKnowledgeEntry = (updatedEntry: KnowledgeEntry) => setKnowledgeEntries((current) => current.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
  const deleteKnowledgeEntry = (entryId: string) => {
    if (window.confirm('Remove this local knowledge entry?')) {
      setKnowledgeEntries((current) => current.filter((entry) => entry.id !== entryId));
    }
  };
  const addPlaybook = (playbook: Playbook) => setPlaybooks((current) => [playbook, ...current]);
  const updatePlaybook = (updatedPlaybook: Playbook) => setPlaybooks((current) => current.map((playbook) => (playbook.id === updatedPlaybook.id ? updatedPlaybook : playbook)));
  const deletePlaybook = (playbookId: string) => {
    if (window.confirm('Remove this local playbook?')) {
      setPlaybooks((current) => current.filter((playbook) => playbook.id !== playbookId));
    }
  };
  const addLearningItem = (item: LearningItem) => setLearningItems((current) => [item, ...current]);
  const updateLearningItem = (updatedItem: LearningItem) => setLearningItems((current) => current.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  const deleteLearningItem = (itemId: string) => {
    if (window.confirm('Remove this local learning note?')) {
      setLearningItems((current) => current.filter((item) => item.id !== itemId));
    }
  };
  const addTimeEntry = (entry: TimeEntry) => setTimeEntries((current) => [entry, ...current]);
  const updateTimeEntry = (updatedEntry: TimeEntry) => setTimeEntries((current) => current.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
  const deleteTimeEntry = (entryId: string) => {
    if (window.confirm('Remove this local time entry?')) {
      setTimeEntries((current) => current.filter((entry) => entry.id !== entryId));
    }
  };
  const updateScenarioStatus = (scenarioId: string, status: ScenarioStatus, reflection?: string) => {
    setProgress((current) => setScenarioProgress(current, scenarioId, status, reflection));
  };
  const updateSkillReadiness = (skillId: string, readiness: MspSkillReadiness) => {
    setProgress((current) => setSkillReadiness(current, skillId, readiness));
  };
  const incrementTicketNotePractice = () => {
    setProgress((current) => incrementTicketNotePracticeProgress(current));
  };
  const updateWorkday = (workdayFocus: string, quickSupportMode: string) => {
    setProgress((current) => updateWorkdayProgress(current, workdayFocus, quickSupportMode));
  };
  const markMicroCardViewed = (cardId: string) => {
    setProgress((current) => markMicroCardViewedProgress(current, cardId));
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Avance Work Companion</div>
        <nav>
          {pages.map((page) => (
            <button
              key={page.id}
              className={currentPage === page.id ? 'active' : ''}
              onClick={() => setCurrentPage(page.id as PageId)}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <ShortcutOverlay open={showShortcuts} onClose={() => setShowShortcuts(false)} onNavigate={(page) => setCurrentPage(page as PageId)} />
        {currentPage === 'dashboard' && (
          <Dashboard
            shifts={sampleShifts}
            clients={sampleClients}
            tasks={tasks}
            workLogs={workLogs}
            timeEntries={timeEntries}
            learningItems={learningItems}
            addWorkLog={addWorkLog}
            addTask={addTask}
            addLearningItem={addLearningItem}
            showOnboarding={showOnboarding}
            completeOnboarding={() => setShowOnboarding(false)}
            healthState={healthState}
            setHealthState={setHealthState}
            onNavigateHealth={() => setCurrentPage('healthOutdoors')}
            onNavigate={(page) => setCurrentPage(page as PageId)}
          />
        )}
        {currentPage === 'search' && (
          <Search
            tasks={tasks}
            workLogs={workLogs}
            knowledgeEntries={knowledgeEntries}
            playbooks={playbooks}
            learningItems={learningItems}
            timeEntries={timeEntries}
            onNavigate={(page) => setCurrentPage(page as PageId)}
          />
        )}
        {currentPage === 'shifts' && <ShiftScheduler shifts={sampleShifts} clients={sampleClients} />}
        {currentPage === 'tasks' && (
          <Tasks
            tasks={tasks}
            clients={sampleClients}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        )}
        {currentPage === 'worklogs' && (
          <WorkLogs
            workLogs={workLogs}
            clients={sampleClients}
            addWorkLog={addWorkLog}
            updateWorkLog={updateWorkLog}
            deleteWorkLog={deleteWorkLog}
          />
        )}
        {currentPage === 'knowledge' && (
          <Knowledge
            entries={knowledgeEntries}
            addEntry={addKnowledgeEntry}
            updateEntry={updateKnowledgeEntry}
            deleteEntry={deleteKnowledgeEntry}
          />
        )}
        {currentPage === 'playbooks' && (
          <Playbooks
            playbooks={playbooks}
            addPlaybook={addPlaybook}
            updatePlaybook={updatePlaybook}
            deletePlaybook={deletePlaybook}
          />
        )}
        {currentPage === 'time' && (
          <Time
            timeEntries={timeEntries}
            addTimeEntry={addTimeEntry}
            updateTimeEntry={updateTimeEntry}
            deleteTimeEntry={deleteTimeEntry}
          />
        )}
        {currentPage === 'pd' && (
          <PD
            learningItems={learningItems}
            addLearningItem={addLearningItem}
            updateLearningItem={updateLearningItem}
            deleteLearningItem={deleteLearningItem}
          />
        )}
        {currentPage === 'weeklyReview' && (
          <WeeklyReview
            progress={progress}
            tasks={tasks}
            workLogs={workLogs}
            learningItems={learningItems}
            healthState={healthState}
          />
        )}
        {currentPage === 'avanceWorkday' && (
          <AvanceWorkday
            progress={progress}
            updateWorkday={updateWorkday}
            onNavigate={(page) => setCurrentPage(page as PageId)}
            healthState={healthState}
            setHealthState={setHealthState}
            onNavigateHealth={() => setCurrentPage('healthOutdoors')}
          />
        )}
        {currentPage === 'shiftCommandCenter' && (
          <ShiftCommandCenter
            tasks={tasks}
            workLogs={workLogs}
            learningItems={learningItems}
            healthState={healthState}
            setHealthState={setHealthState}
            onNavigate={(page) => setCurrentPage(page as PageId)}
          />
        )}
        {currentPage === 'healthOutdoors' && <HealthOutdoors healthState={healthState} setHealthState={setHealthState} />}
        {currentPage === 'skillTracks' && <SkillTracks progress={progress} onNavigate={(page) => setCurrentPage(page as PageId)} />}
        {currentPage === 'mspSkills' && <MspSkills progress={progress} updateSkillReadiness={updateSkillReadiness} />}
        {currentPage === 'mspScenarios' && <MspScenarios progress={progress} updateScenarioProgress={updateScenarioStatus} />}
        {currentPage === 'mspQuiz' && (
          <MspQuiz
            progress={progress}
            onNavigate={(page) => setCurrentPage(page as PageId)}
          />
        )}
        {currentPage === 'ticketNotes' && (
          <TicketNotes
            ticketNotePracticeCount={progress.ticketNotePracticeCount}
            incrementTicketNotePractice={incrementTicketNotePractice}
          />
        )}
        {currentPage === 'communicationPractice' && <CommunicationPractice />}
        {currentPage === 'mspRoadmap' && <MspRoadmap />}
        {currentPage === 'evidencePack' && <EvidencePack progress={progress} />}
        {currentPage === 'microLearning' && (
          <MicroLearning
            progress={progress}
            markMicroCardViewed={markMicroCardViewed}
            onNavigate={(page) => setCurrentPage(page as PageId)}
          />
        )}
      </main>
    </div>
  );
}

export default App;

