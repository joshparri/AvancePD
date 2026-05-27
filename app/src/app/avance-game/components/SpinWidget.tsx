'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { mysteryMeterProgress, type RewardState } from '../lib/rewardEngine';

type Props = { onSpin: () => Promise<void> | void; disabled?: boolean; rewardState?: RewardState };

type WindowWithWebkitAudio = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

export default function SpinWidget({ onSpin, disabled, rewardState }: Props) {
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!spinning) return;
    const id = setTimeout(() => setSpinning(false), 900);
    return () => clearTimeout(id);
  }, [spinning]);

  const playSound = () => {
    try {
      const AudioContextCtor = window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = new AudioContextCtor();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(880, ctx.currentTime);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.02);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      setTimeout(() => { o.stop(); ctx.close(); }, 300);
    } catch {
      // ignore audio errors
    }
  };

  const handle = async () => {
    if (disabled || spinning) return;
    setSpinning(true);
    playSound();
    try {
      await onSpin();
    } finally {
      // keep spinner visible for animation
    }
  };

  const meter = rewardState ? mysteryMeterProgress(rewardState) : { percent: 0, current: 0, max: 5 };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div
          ref={wheelRef}
          className={`h-10 w-10 rounded-full border-2 border-yellow-400 flex items-center justify-center ${spinning ? 'animate-spin' : ''}`}
          aria-hidden
        >
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
        </div>
        <div className="w-36">
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 transition-all" style={{ width: `${meter.percent}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Mystery meter: {meter.current}/{meter.max}</p>
        </div>
      </div>
      <Button size="sm" onClick={handle} disabled={disabled || spinning}>{spinning ? 'Spinning...' : 'Spin'}</Button>
    </div>
  );
}
