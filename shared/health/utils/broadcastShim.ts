export class BroadcastChannelShim {
  private bc: BroadcastChannel | null = null;
  public onmessage: ((ev: MessageEvent) => void) | null = null;
  private name: string;

  constructor(name: string) {
    this.name = name;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.bc = new BroadcastChannel(name);
        this.bc.onmessage = (ev) => {
          if (this.onmessage) this.onmessage(ev as MessageEvent);
        };
      } catch (e) {
        this.bc = null;
      }
    }

    if (!this.bc && typeof window !== 'undefined') {
      window.addEventListener('storage', (ev) => {
        if (ev.key === `bc:${this.name}` && ev.newValue) {
          try {
            const data = JSON.parse(ev.newValue);
            if (this.onmessage) this.onmessage({ data } as MessageEvent);
          } catch (e) {
            // ignore
          }
        }
      });
    }
  }

  postMessage(message: any) {
    if (this.bc) {
      this.bc.postMessage(message);
      return;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`bc:${this.name}`, JSON.stringify(message));
        // cleanup quickly
        setTimeout(() => {
          try {
            localStorage.removeItem(`bc:${this.name}`);
          } catch {}
        }, 1000);
      }
    } catch (e) {
      // ignore
    }
  }

  close() {
    try {
      if (this.bc) this.bc.close();
    } catch {}
  }
}
