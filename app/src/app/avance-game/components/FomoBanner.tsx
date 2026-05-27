'use client';

import { getCurrentRotatingEvent } from '../lib/rotatingEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function FomoBanner({ onJoin }: { onJoin?: () => void }) {
  const [evt, setEvt] = useState(getCurrentRotatingEvent());

  useEffect(() => {
    const id = setInterval(() => setEvt(getCurrentRotatingEvent()), 5000);
    return () => clearInterval(id);
  }, []);

  if (!evt) return null;

  const remainingMs = Math.max(0, new Date(evt.endIso).getTime() - Date.now());
  const minutes = Math.ceil(remainingMs / 60000);

  return (
    <Card className="border-pink-200/70 bg-gradient-to-r from-pink-50/60 to-rose-50/30 dark:border-pink-900/30">
      <CardContent className="flex items-center justify-between p-3">
        <div>
          <p className="font-semibold text-rose-800 dark:text-rose-200">{evt.label} — {evt.multiplier}× XP</p>
          <p className="text-xs text-muted-foreground">{evt.description} · {minutes}m left</p>
        </div>
        <div>
          <Button size="sm" onClick={onJoin}>Join now</Button>
        </div>
      </CardContent>
    </Card>
  );
}
