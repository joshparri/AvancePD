import { BroadcastChannelShim } from './utils/broadcastShim';
import { loadHealthState, saveHealthState, buildReminders, dateKey, getTodayLog, markReminderDone } from './healthOutdoors';

type Subscriber = (state: ReturnType<typeof loadHealthState>) => void;

const CHANNEL = 'avance-eye-care';
const LOCK_KEY = 'avance-eye-care-coordinator-lock';

let channel: any = null;
let subscribers: Subscriber[] = [];
let intervalId: number | null = null;

function broadcast(message: any) {
  try {
    if (!channel) channel = new BroadcastChannelShim(CHANNEL);
    channel.postMessage(message);
  } catch (e) {
    // best-effort
  }
}

function notifySubscribers() {
  const state = loadHealthState();
  subscribers.forEach((s) => s(state));
}

export function subscribe(fn: Subscriber) {
  subscribers.push(fn);
  fn(loadHealthState());
  return () => {
    subscribers = subscribers.filter((s) => s !== fn);
  };
}

export function initEyeCareCoordinator() {
  if (typeof window === 'undefined') return;

  if (!channel) channel = new BroadcastChannelShim(CHANNEL);

  if (channel) {
    channel.onmessage = (ev: MessageEvent) => {
    const msg = ev.data;
    if (!msg) return;
    if (msg.type === 'state-updated') {
      notifySubscribers();
    }
    if (msg.type === 'trigger-reminder') {
      showNotification(msg.payload.title, msg.payload.body, msg.payload.reminderId);
    }
  };

  }

  // periodic check every 30s for due reminders
  if (intervalId == null) {
    intervalId = window.setInterval(() => {
      try {
        const state = loadHealthState();
        const today = getTodayLog(state, new Date());
        const reminders = buildReminders(state.settings);
        const now = new Date();
        reminders.forEach((rem) => {
          const reminderTime = new Date();
          const [h, m] = rem.time.split(':').map(Number);
          reminderTime.setHours(h, m, 0, 0);
          if (reminderTime.getTime() <= now.getTime()) {
            // if not completed
            if (!today.completedBreaks.includes(rem.id) && !today.skippedBreaks.includes(rem.id)) {
              // send a broadcast to show notification
              broadcast({ type: 'trigger-reminder', payload: { title: rem.title, body: rem.notificationText, reminderId: rem.id } });
            }
          }
        });
      } catch (e) {
        // ignore errors
      }
    }, 30 * 1000);
  }
}

async function ensureNotificationPermission() {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const p = await Notification.requestPermission();
    return p;
  } catch {
    return Notification.permission;
  }
}

export async function showNotification(title: string, body: string, reminderId?: string) {
  if (typeof window === 'undefined') return;
  const perm = await ensureNotificationPermission();
  if (perm !== 'granted') return;
  try {
    const n = new Notification(title, { body });
    n.onclick = () => window.focus();
  } catch (e) {
    // ignore
  }
}

export function triggerReminderNow(reminderId: string) {
  const state = loadHealthState();
  const reminders = buildReminders(state.settings);
  const rem = reminders.find((r) => r.id === reminderId);
  if (!rem) return;
  broadcast({ type: 'trigger-reminder', payload: { title: rem.title, body: rem.notificationText, reminderId } });
}

export function markDone(reminderId: string) {
  const state = loadHealthState();
  const rem = buildReminders(state.settings).find((r) => r.id === reminderId);
  if (!rem) return;
  const updated = markReminderDone(state, rem, new Date());
  saveHealthState(updated);
  broadcast({ type: 'state-updated' });
  notifySubscribers();
}

export function disposeCoordinator() {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (channel) {
    try {
      channel.close();
    } catch {}
    channel = null;
  }
  subscribers = [];
}

export function notifyStateUpdated() {
  broadcast({ type: 'state-updated' });
}
