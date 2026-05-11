import type { Client, Shift } from '../types';

type ShiftSchedulerProps = {
  shifts: Shift[];
  clients: Client[];
};

function ShiftScheduler({ shifts, clients }: ShiftSchedulerProps) {
  return (
    <div>
      <section className="card">
        <h1>Shifts</h1>
        <p>Recurring Monday/Wednesday schedule with shift prep details.</p>
      </section>
      <section className="card">
        {shifts.map((shift) => {
          const client = clients.find((item) => item.id === shift.clientId);
          return (
            <div key={shift.id} className="card" style={{ marginBottom: '12px' }}>
              <h2>{shift.dayOfWeek} shift</h2>
              <p>{client?.name}</p>
              <p>{shift.startTime}–{shift.endTime}</p>
              <p>Status: {shift.status}</p>
              <p>Priority: {shift.priorities.join(', ')}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default ShiftScheduler;
