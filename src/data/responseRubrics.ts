export type ResponseRubric = {
  category: string;
  good: string;
  mistake: string;
  check: string;
};

export const responseRubrics: ResponseRubric[] = [
  {
    category: 'Calm tone',
    good: 'Keeps the message steady, respectful, and unemotional even under pressure.',
    mistake: 'Sounding defensive, rushed, or too informal for a service interaction.',
    check: 'Does this read like a steady, professional update?'
  },
  {
    category: 'Clear next step',
    good: 'States what will happen next and when the user can expect an update.',
    mistake: 'Leaves the user guessing what you will do or when you will return.',
    check: 'Is the next action and timing easy to identify?'
  },
  {
    category: 'Good diagnostic question',
    good: 'Asks one or two specific facts needed to narrow the issue without blaming the user.',
    mistake: 'Asks vague, multi-part, or accusatory questions that can frustrate the requester.',
    check: 'Does this question make the next step easier and less repetitive?'
  },
  {
    category: 'No blame',
    good: 'Focuses on the issue and solution rather than assigning fault or making the user feel at fault.',
    mistake: 'Uses words like "you did" or "you should have" when describing the problem.',
    check: 'Is the response focused on fixing the issue, not finding fault?'
  },
  {
    category: 'No overpromising',
    good: 'Promises only what you can reasonably deliver, and keeps the commitment narrow and measurable.',
    mistake: 'Says "I will fix it" or "I will solve this today" before the actual cause is known.',
    check: 'Does this avoid guarantees until the situation is confirmed?'
  },
  {
    category: 'Security awareness',
    good: 'Acknowledges risk and action without alarming the user or blaming them for the situation.',
    mistake: 'Either dismisses the concern or suggests the user caused the problem.',
    check: 'Does this respect the user’s report and keep the next step safe?'
  },
  {
    category: 'Escalation judgement',
    good: 'Explains why a higher level of expertise is needed and stays involved in the handoff.',
    mistake: 'Says "I can’t fix it" or escalates without a clear reason or follow-up.',
    check: 'Does this explain why escalation is the right next step?'
  },
  {
    category: 'Ticket-note usefulness',
    good: 'Includes issue, impact, checks, actions, result, next step, and escalation reason when needed.',
    mistake: 'Records only the fix or only a vague summary without useful handover detail.',
    check: 'Would the next technician understand what happened and what to do next?'
  }
];
