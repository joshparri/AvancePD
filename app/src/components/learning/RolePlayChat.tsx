'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export type RolePlayMessage = {
  role: 'coach' | 'learner';
  content: string;
};

interface RolePlayChatProps {
  initialPrompt: string;
  systemInstructions: string;
  previousTranscript?: RolePlayMessage[];
  onComplete: (result: { transcript: RolePlayMessage[]; confidence: 'low' | 'medium' | 'high' }) => void;
}

const buildLocalCoachReply = (turn: number) => {
  if (turn === 0) {
    return 'I get that security matters, but MFA still feels like extra friction. Can you explain why it is worth it without making it sound like my fault?';
  }
  if (turn === 1) {
    return 'That helps. What should I do if I get prompted at a bad time or I am not sure the prompt is legitimate?';
  }
  return 'Thanks. Please finish with a short, calm next step I can follow today.';
};

export function RolePlayChat({
  initialPrompt,
  systemInstructions,
  previousTranscript,
  onComplete,
}: RolePlayChatProps) {
  const [messages, setMessages] = useState<RolePlayMessage[]>(
    previousTranscript && previousTranscript.length > 0
      ? previousTranscript
      : [{ role: 'coach', content: initialPrompt }]
  );
  const [draft, setDraft] = useState('');
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [saved, setSaved] = useState(false);
  const learnerTurns = messages.filter((message) => message.role === 'learner').length;
  const maxLearnerTurns = 3;

  const sendReply = () => {
    if (!draft.trim() || learnerTurns >= maxLearnerTurns) return;
    const nextMessages: RolePlayMessage[] = [...messages, { role: 'learner', content: draft.trim() }];
    const nextLearnerTurns = learnerTurns + 1;
    if (nextLearnerTurns < maxLearnerTurns) {
      nextMessages.push({ role: 'coach', content: buildLocalCoachReply(nextLearnerTurns - 1) });
    }
    setMessages(nextMessages);
    setDraft('');
    setSaved(false);
  };

  const save = () => {
    onComplete({ transcript: messages, confidence });
    setSaved(true);
  };

  return (
    <div className="space-y-4">
      <div className="academy-inset-panel text-xs text-slate-600 dark:text-slate-300">
        {systemInstructions}
      </div>
      <div className="space-y-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-lg border p-3 text-sm ${
              message.role === 'coach'
                ? 'border-blue-200 bg-blue-50 text-slate-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-slate-100'
                : 'ml-8 border-slate-200 bg-white text-slate-800 dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-100'
            }`}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {message.role === 'coach' ? 'User / coach' : 'You'}
            </p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      {learnerTurns < maxLearnerTurns ? (
        <div className="space-y-3">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={4}
            placeholder="Write a calm, specific reply with a clear next step."
          />
          <Button onClick={sendReply} disabled={!draft.trim()}>
            Send reply
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium">Self-rate your confidence</p>
          <div className="flex flex-wrap gap-2">
            {(['low', 'medium', 'high'] as const).map((value) => (
              <Button
                key={value}
                size="sm"
                variant={confidence === value ? 'secondary' : 'outline'}
                onClick={() => setConfidence(value)}
              >
                {value}
              </Button>
            ))}
          </div>
          <Button onClick={save}>Save transcript</Button>
          {saved && <Badge variant="secondary">Saved</Badge>}
        </div>
      )}
    </div>
  );
}
