import { FormEvent, useState } from 'react';
import type { TimeEntry } from '../types';

type TimeProps = {
  timeEntries: TimeEntry[];
  addTimeEntry: (entry: TimeEntry) => void;
  updateTimeEntry: (entry: TimeEntry) => void;
  deleteTimeEntry: (entryId: string) => void;
};

function Time({ timeEntries, addTimeEntry, updateTimeEntry, deleteTimeEntry }: TimeProps) {
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [hours, setHours] = useState('');
  const [billable, setBillable] = useState(true);
  const [description, setDescription] = useState('');

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const billableHours = timeEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);

  const resetForm = () => {
    setEditingEntryId(null);
    setDate(new Date().toISOString().slice(0, 10));
    setHours('');
    setBillable(true);
    setDescription('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      return;
    }

    const entry: TimeEntry = {
      id: editingEntryId || `time-${Date.now()}`,
      date,
      shiftId: undefined,
      taskId: undefined,
      hours: hoursNum,
      billable,
      description: description || 'Time entry'
    };

    if (editingEntryId) {
      updateTimeEntry(entry);
    } else {
      addTimeEntry(entry);
    }

    resetForm();
  };

  const startEditing = (entry: TimeEntry) => {
    setEditingEntryId(entry.id);
    setDate(entry.date);
    setHours(entry.hours.toString());
    setBillable(entry.billable);
    setDescription(entry.description);
  };

  return (
    <div>
      <section className="card">
        <h1>Time & invoices</h1>
        <p>Track hours and keep an eye on invoice-ready billable time.</p>
      </section>
      <section className="card">
        <p>Total logged hours: {totalHours.toFixed(1)}</p>
        <p>Billable hours: {billableHours.toFixed(1)}</p>
      </section>
      <section className="card">
        <h2>{editingEntryId ? 'Edit time entry' : 'Add time entry'}</h2>
        <form onSubmit={handleSubmit} className="quick-capture-form">
          <label>
            Date
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label>
            Hours
            <input type="number" step="0.5" min="0" value={hours} onChange={(event) => setHours(event.target.value)} placeholder="8.5" />
          </label>
          <label>
            Description
            <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What work was done?" />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={billable} onChange={(event) => setBillable(event.target.checked)} />
            Billable
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button type="submit">{editingEntryId ? 'Save entry' : 'Add entry'}</button>
            {editingEntryId && (
              <button type="button" onClick={resetForm} style={{ background: '#64748b' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
      <section className="card">
        <h2>All time entries</h2>
        {timeEntries.length ? (
          <ul>
            {timeEntries.map((entry) => (
              <li key={entry.id} style={{ marginBottom: '16px' }}>
                <strong>{entry.date} — {entry.hours}h</strong>
                <p>{entry.description} {entry.billable ? '(billable)' : '(non-billable)'}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => startEditing(entry)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteTimeEntry(entry.id)} style={{ background: '#dc2626' }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p>No time entries logged yet.</p>
            <p><em>Track billable and non-billable hours using the form above to maintain accurate time records.</em></p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Time;
