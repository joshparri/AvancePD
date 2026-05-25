import { useState } from 'react';

type SupabaseSyncPanelProps = {
  buildBackup: () => unknown;
};

const syncSettingsKey = 'avance-supabase-sync-settings';

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(syncSettingsKey);
    return raw ? JSON.parse(raw) as { url: string; anonKey: string; table: string } : { url: '', anonKey: '', table: 'avance_backups' };
  } catch {
    return { url: '', anonKey: '', table: 'avance_backups' };
  }
}

function SupabaseSyncPanel({ buildBackup }: SupabaseSyncPanelProps) {
  const [settings, setSettings] = useState(loadSettings);
  const [status, setStatus] = useState('');

  const saveSettings = () => {
    window.localStorage.setItem(syncSettingsKey, JSON.stringify(settings));
    setStatus('Supabase sync settings saved locally.');
  };

  const pushBackup = async () => {
    if (!settings.url || !settings.anonKey || !settings.table) {
      setStatus('Add Supabase URL, anon key, and table name first.');
      return;
    }

    try {
      const endpoint = `${settings.url.replace(/\/$/, '')}/rest/v1/${settings.table}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          apikey: settings.anonKey,
          Authorization: `Bearer ${settings.anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          payload: buildBackup(),
          source: 'avance-work-companion',
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        setStatus(`Supabase sync failed: ${response.status}. Check table permissions and columns.`);
        return;
      }
      setStatus('Backup pushed to Supabase.');
    } catch {
      setStatus('Supabase sync failed. Check network and settings.');
    }
  };

  return (
    <section className="card">
      <h2>Optional Supabase sync</h2>
      <p>Opt-in backup sync for a Supabase table. Use a table with `payload jsonb`, `source text`, and `created_at timestamptz` columns.</p>
      <div className="quick-capture-form">
        <label>
          Supabase project URL
          <input value={settings.url} onChange={(event) => setSettings((current) => ({ ...current, url: event.target.value }))} placeholder="https://project.supabase.co" />
        </label>
        <label>
          Supabase anon key
          <input value={settings.anonKey} onChange={(event) => setSettings((current) => ({ ...current, anonKey: event.target.value }))} placeholder="Public anon key only" />
        </label>
        <label>
          Table
          <input value={settings.table} onChange={(event) => setSettings((current) => ({ ...current, table: event.target.value }))} />
        </label>
      </div>
      <div className="status-button-row">
        <button type="button" className="small-action" onClick={saveSettings}>Save sync settings</button>
        <button type="button" onClick={pushBackup}>Push backup to Supabase</button>
      </div>
      {status && <p className="health-muted">{status}</p>}
      <div className="privacy-note">Only use a project you control. Do not sync client data, credentials, screenshots, ticket exports, or private health notes.</div>
    </section>
  );
}

export default SupabaseSyncPanel;
