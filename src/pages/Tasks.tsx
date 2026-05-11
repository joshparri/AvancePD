import { FormEvent, useMemo, useState } from 'react';
import type { Client, Task, TaskStatus } from '../types';

type TasksProps = {
  tasks: Task[];
  clients: Client[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
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

  const openTasks = tasks.filter((task) => task.status === 'open');

  const resetForm = () => {
    setEditingTaskId(null);
    setTitle('');
    setStatus('open');
    setPriority('medium');
    setClientId(clients[0]?.id ?? '');
    setDueDate(new Date().toISOString().slice(0, 10));
    setNote('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const task: Task = {
      id: editingTaskId || createId('task'),
      title: title || 'New follow-up',
      status,
      dueDate,
      priority,
      clientId,
      workLogId: undefined,
      note: note || 'Captured in task list.',
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
        <form onSubmit={handleSubmit} className="quick-capture-form">
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task summary" />
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
            <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </label>
          <label>
            Note
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Task detail or follow-up note" />
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button type="submit">{editingTaskId ? 'Save task' : 'Add task'}</button>
            {editingTaskId && (
              <button type="button" onClick={resetForm} style={{ background: '#64748b' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>All tasks</h2>
        {tasks.length ? (
          <ul>
            {tasks.map((task) => {
              const client = clients.find((item) => item.id === task.clientId);
              return (
                <li key={task.id} style={{ marginBottom: '16px' }}>
                  <strong>{task.title}</strong>
                  <p>
                    {task.status} — {client?.name} — due {task.dueDate} — priority {task.priority}
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
            <p>No tasks created yet.</p>
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
