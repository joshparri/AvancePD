type ShortcutOverlayProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
};

const shortcuts = [
  { keys: '?', label: 'Open this shortcut guide' },
  { keys: 'Esc', label: 'Close dialogs or overlays' },
  { keys: 'Alt + Q', label: 'Focus Quick capture title field' }
];

function ShortcutOverlay({ open, onClose, onNavigate }: ShortcutOverlayProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="card shortcut-modal" role="dialog" aria-modal="true" aria-labelledby="shortcut-title" onClick={(event) => event.stopPropagation()}>
        <div className="skill-card-header">
          <div>
            <h2 id="shortcut-title">Keyboard shortcuts</h2>
            <p>Fast actions for busy shift moments.</p>
          </div>
          <button type="button" className="small-action" onClick={onClose}>Close</button>
        </div>
        <div className="health-plan-grid">
          {shortcuts.map((shortcut) => (
            <article key={shortcut.keys} className="mini-card">
              <h3>{shortcut.keys}</h3>
              <p>{shortcut.label}</p>
            </article>
          ))}
        </div>
        <div className="status-button-row">
          <button type="button" onClick={() => { onNavigate('dashboard'); onClose(); }}>Dashboard</button>
          <button type="button" className="small-action" onClick={() => { onNavigate('search'); onClose(); }}>Search</button>
          <button type="button" className="small-action" onClick={() => { onNavigate('fieldOps'); onClose(); }}>Field Ops</button>
          <button type="button" className="small-action" onClick={() => { onNavigate('healthOutdoors'); onClose(); }}>Health reset</button>
        </div>
      </section>
    </div>
  );
}

export default ShortcutOverlay;
