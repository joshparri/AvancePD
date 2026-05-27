'use client';

import { Card, CardContent } from '@/components/ui/card';
import { topFriends } from '../lib/socialEngine';

const avatarColors: Record<string, string> = {
  amber: 'bg-amber-400',
  sky: 'bg-sky-400',
  emerald: 'bg-emerald-400',
};

export default function FriendLeaderboard() {
  const friends = topFriends().slice(0, 5);

  return (
    <Card>
      <CardContent className="p-3">
        <p className="font-semibold text-sm">Friends Leaderboard</p>
        <ol className="mt-2 space-y-2 text-sm">
          {friends.map((f) => (
            <li key={f.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full ${avatarColors[f.avatarColor ?? ''] ?? 'bg-slate-400'}`} />
                <span>{f.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{f.xp} XP</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
