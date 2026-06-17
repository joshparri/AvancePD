// @ts-nocheck
// App-local coordinator shim that interoperates with the shared coordinator via BroadcastChannel/localStorage events

const CHANNEL = 'avance-eye-care';

class BroadcastChannelShim {
  bc = null;
  onmessage = null;
  name: string;
  constructor(name: string) {
    this.name = name;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        // @ts-ignore
        this.bc = new BroadcastChannel(name);
        if (this.bc) {
          // @ts-ignore
          (this.bc as any).onmessage = (ev: any) => { if (this.onmessage) this.onmessage(ev); };
        }
      } catch (e) {
        this.bc = null;
      }
    }
    if (!this.bc && typeof window !== 'undefined') {
      window.addEventListener('storage', (ev) => {
        if (ev.key === `bc:${this.name}` && ev.newValue) {
          try {
            const data = JSON.parse(ev.newValue);
            if (this.onmessage) this.onmessage({ data });
          } catch {}
        }
      });
    }
  }
  postMessage(message) {
    if (this.bc) return this.bc.postMessage(message);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`bc:${this.name}`, JSON.stringify(message));
        setTimeout(() => { try { localStorage.removeItem(`bc:${this.name}`); } catch {} }, 1000);
      }
    } catch {}
  }
  close() { try { if (this.bc) this.bc.close(); } catch {} }
}

let channel = null;
export function initEyeCareCoordinator() {
  if (typeof window === 'undefined') return;
  if (!channel) channel = new BroadcastChannelShim(CHANNEL);
  if (channel) {
    channel.onmessage = (ev) => {
      const msg = ev.data;
      // no-op here; UI components can subscribe via localStorage polling
    };
  }
}

export function triggerReminderNow(reminderId) {
  if (!channel) channel = new BroadcastChannelShim(CHANNEL);
  channel.postMessage({ type: 'trigger-reminder', payload: { reminderId } });
}

export function notifyStateUpdated() {
  if (!channel) channel = new BroadcastChannelShim(CHANNEL);
  channel.postMessage({ type: 'state-updated' });
}

