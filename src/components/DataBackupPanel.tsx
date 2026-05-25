import { useState } from 'react';
import SupabaseSyncPanel from './SupabaseSyncPanel';

const storageKeys = [
  'avance-workLogs',
  'avance-tasks',
  'avance-knowledgeEntries',
  'avance-playbooks',
  'avance-learningItems',
  'avance-timeEntries',
  'avance-msp-progress',
  'avance-health-outdoors',
  'avance-onboarded'
];

function DataBackupPanel() {
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState('');
  const lastBackup = window.localStorage.getItem('avance-last-backup-at');
  const backupDue = !lastBackup || Date.now() - new Date(lastBackup).getTime() > 21 * 24 * 60 * 60 * 1000;

  const buildBackup = () => {
    const data = storageKeys.reduce<Record<string, unknown>>((backup, key) => {
      const raw = window.localStorage.getItem(key);
      if (!raw) return backup;
      try {
        backup[key] = JSON.parse(raw);
      } catch {
        backup[key] = raw;
      }
      return backup;
    }, {});

    return {
      exportedAt: new Date().toISOString(),
      app: 'Avance Work Companion',
      version: 1,
      data
    };
  };

  const copyBackup = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildBackup(), null, 2));
      window.localStorage.setItem('avance-last-backup-at', new Date().toISOString());
      setStatus('Backup JSON copied.');
    } catch {
      setStatus('Could not copy automatically. Use Download backup instead.');
    }
  };

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `avance-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    window.localStorage.setItem('avance-last-backup-at', new Date().toISOString());
    setStatus('Backup downloaded.');
  };

  const copySettingsBackup = async () => {
    const settingsOnly = {
      exportedAt: new Date().toISOString(),
      app: 'Avance Work Companion',
      version: 1,
      data: Object.fromEntries(
        ['avance-health-outdoors', 'avance-onboarded', 'avance-supabase-sync-settings']
          .map((key) => [key, window.localStorage.getItem(key)])
          .filter(([, value]) => value)
          .map(([key, value]) => {
            try {
              return [key, JSON.parse(String(value))];
            } catch {
              return [key, value];
            }
          })
      )
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(settingsOnly, null, 2));
      setStatus('Settings-only backup copied.');
    } catch {
      setStatus('Could not copy settings automatically.');
    }
  };

  const importBackup = () => {
    try {
      const parsed = JSON.parse(importText) as { data?: Record<string, unknown> };
      if (!parsed.data || typeof parsed.data !== 'object') {
        setStatus('Backup import needs a data object.');
        return;
      }

      Object.entries(parsed.data).forEach(([key, value]) => {
        if (storageKeys.includes(key)) {
          window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
      });
      setStatus('Backup imported. Refresh the app to load restored data.');
    } catch {
      setStatus('Backup import failed. Check the JSON and try again.');
    }
  };

  return (
    <>
      <section className="card">
        <h2>Backup & export</h2>
        <p>Export local app data before browser changes or device moves. Keep backups private.</p>
        {backupDue && <div className="privacy-note">Backup reminder: it has been a while since the last local backup on this browser.</div>}
        <div className="status-button-row">
          <button type="button" onClick={copyBackup}>Copy backup JSON</button>
          <button type="button" className="small-action" onClick={downloadBackup}>Download backup</button>
          <button type="button" className="small-action" onClick={copySettingsBackup}>Copy settings only</button>
        </div>
        <div className="quick-capture-form">
          <label>
            Restore from backup JSON
            <textarea value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="Paste Avance backup JSON here" />
          </label>
          <button type="button" className="small-action" onClick={importBackup}>Import backup</button>
        </div>
        {status && <p className="health-muted">{status}</p>}
        <div className="privacy-note">Backups can contain your local notes and progress. Do not paste them into public tools.</div>
      </section>
      <SupabaseSyncPanel buildBackup={buildBackup} />
    </>
  );
}

export default DataBackupPanel;
