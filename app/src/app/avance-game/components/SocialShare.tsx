'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { inviteLinkFor, recordInvite } from '../lib/socialEngine';

export default function SocialShare({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== 'undefined' ? inviteLinkFor(userId) : '';

  const onCopy = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onInvite = () => {
    const email = prompt('Enter email to invite');
    if (email) {
      recordInvite(userId, email);
      alert('Invite recorded — share the link with them too.');
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={onCopy}>{copied ? 'Copied' : 'Copy invite'}</Button>
      <Button size="sm" variant="outline" onClick={onInvite}>Invite</Button>
    </div>
  );
}
