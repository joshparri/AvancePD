'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getActiveEvent, timeRemainingMs, createEvent, clearEvent, getMultiplier } from '../lib/eventEngine';

export default function EventBanner() {
  const [active, setActive] = useState(getActiveEvent());
  const [remaining, setRemaining] = useState(timeRemainingMs());

  useEffect(() => {
    const id = setInterval(() => {
      setActive(getActiveEvent());
      setRemaining(timeRemainingMs());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!active) {
    return (
      <Card className="border-sky-200/60 bg-sky-50/40 dark:border-sky-900/30">
        <CardContent className="flex items-center justify-between p-3">
          <div>
            <p className="font-semibold text-sky-800 dark:text-sky-200">No active event</p>
            <p className="text-xs text-muted-foreground">Start a short double-XP event to boost engagement.</p>
          </div>
          <div>
            <Button size="sm" onClick={() => { createEvent(2, 1.5, 'Weekend Wave'); setActive(getActiveEvent()); }}>Start 2h event</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const seconds = Math.max(0, Math.floor(remaining / 1000));
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = seconds % 60;

  return (
    <Card className="border-amber-200/80 bg-gradient-to-r from-amber-50/60 to-yellow-50/40 dark:border-amber-900/30">
      <CardContent className="flex items-center justify-between p-3">
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-200">{active.label} · {getMultiplier()}× XP</p>
          <p className="text-xs text-muted-foreground">Ends in {hh}:{String(mm).padStart(2,'0')}:{String(ss).padStart(2,'0')}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => { clearEvent(); setActive(null); }}>End</Button>
        </div>
      </CardContent>
    </Card>
  );
}
