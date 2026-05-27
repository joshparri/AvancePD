'use client';

import { getCurrentRotatingEvent } from '../lib/rotatingEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { assignVariant, recordImpression, recordClick } from '../lib/abTest';

export default function FomoBanner({ onJoin }: { onJoin?: () => void }) {
  const [evt, setEvt] = useState(getCurrentRotatingEvent());
  const [remainingMs, setRemainingMs] = useState(0);
  const [variant, setVariant] = useState('A');

  useEffect(() => {
    const v = assignVariant('fomo_copy', ['A', 'B']);
    setVariant(v);
  }, []);

  useEffect(() => {
    const update = () => {
      const current = getCurrentRotatingEvent();
      setEvt(current);
      setRemainingMs(current ? Math.max(0, new Date(current.endIso).getTime() - Date.now()) : 0);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (evt) recordImpression('fomo_copy', variant);
  }, [evt, variant]);

  if (!evt) return null;

  const minutes = Math.ceil(remainingMs / 60000);

  const copyA = `${evt.label} — ${evt.multiplier}× XP for a short time. Jump in and get ahead of your peers!`;
  const copyB = `Limited-time ${evt.multiplier}× XP: complete quick sessions to earn the boost. ${minutes} minutes left.`;

  const onClick = () => {
    recordClick('fomo_copy', variant);
    if (onJoin) onJoin();
  };

  return (
    <Card className="border-pink-200/70 bg-gradient-to-r from-pink-50/60 to-rose-50/30 dark:border-pink-900/30">
      <CardContent className="flex items-center justify-between p-3">
        <div>
          <p className="font-semibold text-rose-800 dark:text-rose-200">{evt.label} · {evt.multiplier}× XP</p>
          <p className="text-xs text-muted-foreground">{variant === 'A' ? copyA : copyB}</p>
        </div>
        <div>
          <Button size="sm" onClick={onClick}>Join now</Button>
        </div>
      </CardContent>
    </Card>
  );
}
