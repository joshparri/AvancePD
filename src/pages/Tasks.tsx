import { FormEvent, useMemo, useState } from 'react';
import type { Client, Task, TaskStatus } from '../types';

type TasksProps = {
  tasks: Task[];
  clients: Client[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
};

type FormErrors = {
  title?: string;
  dueDate?: string;
  note?: string;
};

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function Tasks({ tasks, clients, addTask, updateTask, deleteTask }: TasksProps) {
  const clientOptions = useMemo(() => clients, [clients]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('open');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const openTasks = tasks.filter((task) => task.status === 'open');

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      const client = clients.find((item) => item.id === task.clientId);
      const combined = [task.title, task.note, task.status, task.priority, client?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return combined.includes(query);
    });
  }, [search, tasks, clients]);

  const resetForm = () => {
    setEditingTaskId(null);
    setTitle('');
    setStatus('open');
    setPriority('medium');
    setClientId(clients[0]?.id ?? '');
    setDueDate(new Date().toISOString().slice(0, 10));
    setNote('');
    setErrors({});
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    if (!title.trim()) {
      nextErrors.title = 'Title is required.';
    }
    if (!dueDate.trim()) {
      nextErrors.dueDate = 'Due date is required.';
    }
    if (!note.trim()) {
      nextErrors.note = 'Note is required.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const task: Task = {
      id: editingTaskId || createId('task'),
      title: title.trim(),
      status,
      dueDate,
      priority,
      clientId,
      workLogId: undefined,
      note: note.trim(),
      createdAt: new Date().toISOString()
    };

    if (editingTaskId) {
      updateTask(task);
    } else {
      addTask(task);
    }

    resetForm();
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setStatus(task.status);
    setPriority(task.priority);
    setClientId(task.clientId);
    setDueDate(task.dueDate);
    setNote(task.note);
  };

  return (
    <div>
      <section className="card">
        <h1>Tasks</h1>
        <p>Track follow-ups across shifts so nothing is missed.</p>
      </section>
      <section className="card">
        <h2>{editingTaskId ? 'Edit task' : 'Add task'}</h2>
        <form onSubmit={handleSubmit} className="quick-capture-form" noValidate>
          <label>
            Title
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (errors.title) {
                  setErrors((current) => ({ ...current, title: undefined }));
                }
              }}
              placeholder="Task summary"
              aria-describedby={errors.title ? 'task-title-error' : undefined}
              required
            />
            {errors.title ? (
              <span id="task-title-error" style={{ color: '#b91c1c' }} role="alert">
                {errors.title}
              </span>
            ) : null}
          </label>
          <label>
            Client
            <select value={clientId} onChange={(event) => setClientId(event.target.value)}>
              {clientOptions.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
              <option value="open">open</option>
              <option value="in progress">in progress</option>
              <option value="blocked">blocked</option>
              <option value="done">done</option>
            </select>
          </label>
          <label>
            Priority
            <select value={priority} onChange={(event) => setPriority(event.target.value as Task['priority'])}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label>
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={(event) => {
                setDueDate(event.target.value);
                if (errors.dueDate) {
                  setErrors((current) => ({ ...current, dueDate: undefined }));
                }
              }}
              aria-describedby={errors.dueDate ? 'task-dueDate-error' : undefined}
              required
            />
            {errors.dueDate ? (
              <span id="task-dueDate-error" style={{ color: '#b91c1c' }} role="alert">
                {errors.dueDate}
              </span>
            ) : null}
          </label>
          <label>
            Note
            <textarea
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                if (errors.note) {
                  setErrors((current) => ({ ...current, note: undefined }));
                }
              }}
              placeholder="Task detail or follow-up note"
              aria-describedby={errors.note ? 'task-note-error' : undefined}
              required
            />
            {errors.note ? (
              <span id="task-note-error" style={{ color: '#b91c1c' }} role="alert">
                {errors.note}
              </span>
            ) : null}
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button type="submit">{editingTaskId ? 'Save task' : 'Add task'}</button>
            {editingTaskId && (
              <button type="button" onClick={resetForm} style={{ background: '#64748b' }} aria-label="Cancel task edit">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <h2>All tasks</h2>
          <label style={{ flex: '1 1 240px', minWidth: '240px' }}>
            Search tasks
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, note, client, status, priority"
              aria-label="Search tasks"
            />
          </label>
        </div>
        {filteredTasks.length ? (
          <ul>
            {filteredTasks.map((task) => {
              const client = clients.find((item) => item.id === task.clientId);
              return (
                <li key={task.id} style={{ marginBottom: '16px' }}>
                  <strong>{task.title}</strong>
                  <p>
                    {task.status} — {client?.name || 'No client'} — due {task.dueDate} — priority {task.priority}
                  </p>
                  <p>{task.note}</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => startEditing(task)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteTask(task.id)} style={{ background: '#dc2626' }}>
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>
            <p>No tasks match your search. Try a different keyword or create a new task.</p>
            <p><em>Use the form above to add follow-ups, or capture them quickly from the Dashboard.</em></p>
          </div>
        )}
      </section>
      <section className="card">
        <h2>Open follow-ups</h2>
        {openTasks.length ? (
          <ul>
            {openTasks.map((task) => (
              <li key={task.id}>{task.title} — due {task.dueDate}</li>
            ))}
          </ul>
        ) : (
          <p>Great work — no open follow-ups remaining.</p>
        )}
      </section>
    </div>
  );
}

export default Tasks;
