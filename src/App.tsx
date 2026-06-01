import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate
} from 'react-router-dom';
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
import KBLearning from './pages/KBLearning';
import MspRoadmap from './pages/MspRoadmap';
import AvanceWorkday from './pages/AvanceWorkday';
import EvidencePack from './pages/EvidencePack';
import MicroLearning from './pages/MicroLearning';
import AvancePDGames from './pages/AvancePDGames';
import HealthOutdoors from './pages/HealthOutdoors';
import Search from './pages/Search';
import ShortcutOverlay from './components/ShortcutOverlay';
import MobileBottomActions from './components/MobileBottomActions';
import SkillTracks from './pages/SkillTracks';
import WeeklyReview from './pages/WeeklyReview';
import ShiftCommandCenter from './pages/ShiftCommandCenter';
import QuickTools from './pages/QuickTools';
import FieldOps from './pages/FieldOps';
import { useTaskStore } from './store/taskStore';
import { useKnowledgeStore } from './store/knowledgeStore';
import { useWorkLogStore } from './store/workLogStore';
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
  knowledgeEntries as sampleKnowledgeEntries,
  playbooks as samplePlaybooks,
  learningItems as sampleLearningItems,
  timeEntries as sampleTimeEntries
} from './data/sampleData';
import type { KnowledgeEntry, LearningItem, Playbook, Task, TimeEntry, WorkLog } from './types';
import './App.css';

const pages: Array<{ id: PageId; label: string; path: string }> = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'search', label: 'Search', path: '/search' },
  { id: 'quickTools', label: 'Quick Tools', path: '/quick-tools' },
  { id: 'fieldOps', label: 'Field Ops', path: '/field-ops' },
  { id: 'shifts', label: 'Shifts', path: '/shifts' },
  { id: 'tasks', label: 'Tasks', path: '/tasks' },
  { id: 'worklogs', label: 'Work Logs', path: '/worklogs' },
  { id: 'knowledge', label: 'Knowledge', path: '/knowledge' },
  { id: 'playbooks', label: 'Playbooks', path: '/playbooks' },
  { id: 'time', label: 'Time', path: '/time' },
  { id: 'pd', label: 'PD', path: '/pd' },
  { id: 'kbLearning', label: 'KB Learning Machine', path: '/kb-learning' },
  { id: 'weeklyReview', label: 'Weekly Review', path: '/weekly-review' },
  { id: 'avanceWorkday', label: 'Avance Workday', path: '/avance-workday' },
  { id: 'shiftCommandCenter', label: 'Command Center', path: '/shift-command-center' },
  { id: 'healthOutdoors', label: 'Health & Outdoors', path: '/health-outdoors' },
  { id: 'skillTracks', label: 'Skill Tracks', path: '/skill-tracks' },
  { id: 'mspSkills', label: 'MSP Skills', path: '/msp-skills' },
  { id: 'mspScenarios', label: 'MSP Scenarios', path: '/msp-scenarios' },
  { id: 'mspQuiz', label: 'Strict Quiz', path: '/msp-quiz' },
  { id: 'ticketNotes', label: 'Ticket Notes', path: '/ticket-notes' },
  { id: 'communicationPractice', label: 'Communication Practice', path: '/communication-practice' },
  { id: 'mspRoadmap', label: 'MSP Roadmap', path: '/msp-roadmap' },
  { id: 'evidencePack', label: 'Evidence Pack', path: '/evidence-pack' },
  { id: 'microLearning', label: 'Micro-Learning', path: '/micro-learning' },
  { id: 'avancePDGames', label: 'AvancePD Games', path: '/avance-pd-games' }
];

type PageId =
  | 'dashboard'
  | 'search'
  | 'quickTools'
  | 'fieldOps'
  | 'shifts'
  | 'tasks'
  | 'worklogs'
  | 'knowledge'
  | 'playbooks'
  | 'time'
  | 'pd'
  | 'kbLearning'
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
  | 'microLearning'
  | 'avancePDGames';

const pageIdToPath: Record<PageId, string> = pages.reduce((acc, page) => {
  acc[page.id] = page.path;
  return acc;
}, {} as Record<PageId, string>);

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

function AppContent() {
  const navigate = useNavigate();
  const workLogs = useWorkLogStore((state) => state.workLogs);
  const addWorkLog = useWorkLogStore((state) => state.addWorkLog);
  const updateWorkLog = useWorkLogStore((state) => state.updateWorkLog);
  const deleteWorkLog = useWorkLogStore((state) => state.deleteWorkLog);
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const knowledgeEntries = useKnowledgeStore((state) => state.knowledgeEntries);
  const addKnowledgeEntry = useKnowledgeStore((state) => state.addKnowledgeEntry);
  const updateKnowledgeEntry = useKnowledgeStore((state) => state.updateKnowledgeEntry);
  const deleteKnowledgeEntry = useKnowledgeStore((state) => state.deleteKnowledgeEntry);
  const [playbooks, setPlaybooks] = useState<Playbook[]>(() => loadPersisted('avance-playbooks', samplePlaybooks));
  const [learningItems, setLearningItems] = useState<LearningItem[]>(() => loadPersisted('avance-learningItems', sampleLearningItems));
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => loadPersisted('avance-timeEntries', sampleTimeEntries));
  const [progress, setProgress] = useState(loadProgress);
  const [healthState, setHealthState] = useState<HealthState>(loadHealthState);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lowEnergyMode, setLowEnergyMode] = useState(() => window.localStorage.getItem('avance-low-energy-mode') === 'true');
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('avance-onboarded') !== 'true';
  });

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
    window.localStorage.setItem('avance-low-energy-mode', String(lowEnergyMode));
  }, [lowEnergyMode]);

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

  const navigateToPage = (page: PageId) => {
    const target = pageIdToPath[page] ?? '/dashboard';
    navigate(target);
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
    <div className={lowEnergyMode ? 'app-shell low-energy-mode' : 'app-shell'}>
      <aside className="sidebar">
        <div className="brand">Avance Work Companion</div>
        <button type="button" className="low-energy-toggle" onClick={() => setLowEnergyMode((current) => !current)}>
          {lowEnergyMode ? 'Normal mode' : 'Low energy mode'}
        </button>
        <nav>
          {pages.map((page) => (
            <NavLink
              key={page.id}
              to={page.path}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {page.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <ShortcutOverlay open={showShortcuts} onClose={() => setShowShortcuts(false)} onNavigate={(page) => navigateToPage(page as PageId)} />
        <Routes>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                shifts={sampleShifts}
                clients={sampleClients}
                tasks={tasks}
                workLogs={workLogs}
                timeEntries={timeEntries}
                learningItems={learningItems}
                progress={progress}
                addWorkLog={addWorkLog}
                addTask={addTask}
                addLearningItem={addLearningItem}
                showOnboarding={showOnboarding}
                completeOnboarding={() => setShowOnboarding(false)}
                healthState={healthState}
                setHealthState={setHealthState}
                onNavigateHealth={() => navigateToPage('healthOutdoors')}
                onNavigate={(page) => navigateToPage(page as PageId)}
              />
            }
          />
          <Route
            path="/search"
            element={
              <Search
                tasks={tasks}
                workLogs={workLogs}
                knowledgeEntries={knowledgeEntries}
                playbooks={playbooks}
                learningItems={learningItems}
                timeEntries={timeEntries}
                onNavigate={(page) => navigateToPage(page as PageId)}
              />
            }
          />
          <Route path="/quick-tools" element={<QuickTools />} />
          <Route path="/field-ops" element={<FieldOps />} />
          <Route path="/shifts" element={<ShiftScheduler shifts={sampleShifts} clients={sampleClients} />} />
          <Route
            path="/tasks"
            element={
              <Tasks
                tasks={tasks}
                clients={sampleClients}
                addTask={addTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            }
          />
          <Route
            path="/worklogs"
            element={
              <WorkLogs
                workLogs={workLogs}
                clients={sampleClients}
                addWorkLog={addWorkLog}
                updateWorkLog={updateWorkLog}
                deleteWorkLog={deleteWorkLog}
              />
            }
          />
          <Route
            path="/knowledge"
            element={
              <Knowledge
                entries={knowledgeEntries}
                addEntry={addKnowledgeEntry}
                updateEntry={updateKnowledgeEntry}
                deleteEntry={deleteKnowledgeEntry}
              />
            }
          />
          <Route
            path="/playbooks"
            element={
              <Playbooks
                playbooks={playbooks}
                workLogs={workLogs}
                knowledgeEntries={knowledgeEntries}
                addPlaybook={addPlaybook}
                updatePlaybook={updatePlaybook}
                deletePlaybook={deletePlaybook}
              />
            }
          />
          <Route
            path="/time"
            element={
              <Time
                timeEntries={timeEntries}
                addTimeEntry={addTimeEntry}
                updateTimeEntry={updateTimeEntry}
                deleteTimeEntry={deleteTimeEntry}
              />
            }
          />
          <Route
            path="/pd"
            element={
              <PD
                learningItems={learningItems}
                addLearningItem={addLearningItem}
                updateLearningItem={updateLearningItem}
                deleteLearningItem={deleteLearningItem}
                addKnowledgeEntry={addKnowledgeEntry}
              />
            }
          />
          <Route
            path="/kb-learning"
            element={
              <KBLearning
                progress={progress}
                learningItems={learningItems}
                onNavigate={(page) => navigateToPage(page as PageId)}
              />
            }
          />
          <Route
            path="/weekly-review"
            element={
              <WeeklyReview
                progress={progress}
                tasks={tasks}
                workLogs={workLogs}
                learningItems={learningItems}
                healthState={healthState}
              />
            }
          />
          <Route
            path="/avance-workday"
            element={
              <AvanceWorkday
                progress={progress}
                updateWorkday={updateWorkday}
                onNavigate={(page) => navigateToPage(page as PageId)}
                healthState={healthState}
                setHealthState={setHealthState}
                onNavigateHealth={() => navigateToPage('healthOutdoors')}
              />
            }
          />
          <Route
            path="/shift-command-center"
            element={
              <ShiftCommandCenter
                tasks={tasks}
                workLogs={workLogs}
                learningItems={learningItems}
                healthState={healthState}
                setHealthState={setHealthState}
                onNavigate={(page) => navigateToPage(page as PageId)}
              />
            }
          />
          <Route
            path="/health-outdoors"
            element={
              <HealthOutdoors
                healthState={healthState}
                setHealthState={setHealthState}
                addTask={addTask}
                defaultClientId={sampleClients[0]?.id ?? ''}
              />
            }
          />
          <Route
            path="/skill-tracks"
            element={<SkillTracks progress={progress} onNavigate={(page) => navigateToPage(page as PageId)} />}
          />
          <Route
            path="/msp-skills"
            element={<MspSkills progress={progress} updateSkillReadiness={updateSkillReadiness} />}
          />
          <Route
            path="/msp-scenarios"
            element={<MspScenarios progress={progress} updateScenarioProgress={updateScenarioStatus} />}
          />
          <Route
            path="/msp-quiz"
            element={<MspQuiz progress={progress} onNavigate={(page) => navigateToPage(page as PageId)} />}
          />
          <Route
            path="/ticket-notes"
            element={
              <TicketNotes
                ticketNotePracticeCount={progress.ticketNotePracticeCount}
                incrementTicketNotePractice={incrementTicketNotePractice}
              />
            }
          />
          <Route path="/communication-practice" element={<CommunicationPractice />} />
          <Route path="/msp-roadmap" element={<MspRoadmap />} />
          <Route path="/evidence-pack" element={<EvidencePack progress={progress} />} />
          <Route
            path="/micro-learning"
            element={
              <MicroLearning
                progress={progress}
                markMicroCardViewed={markMicroCardViewed}
                onNavigate={(page) => navigateToPage(page as PageId)}
              />
            }
          />
          <Route path="/avance-pd-games" element={<AvancePDGames onNavigate={(page) => navigateToPage(page as PageId)} />} />
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="*" element={<Navigate replace to="/dashboard" />} />
        </Routes>
      </main>
      <MobileBottomActions onNavigate={(page) => navigateToPage(page as PageId)} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

