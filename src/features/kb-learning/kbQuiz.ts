import type { KbFieldCard, KbQuizQuestion } from './kbLearningTypes';

export function buildKbQuiz(card: KbFieldCard): KbQuizQuestion[] {
  const firstCheck = card.firstChecks[0] ?? 'Confirm the starting state.';
  const coreStep = card.coreSteps[0] ?? 'Follow the approved procedure.';
  const escalation = card.escalateIf || 'Escalate when risk or access is unclear.';

  return [
    {
      id: `${card.id}-when`,
      stem: `When should you use "${card.title}"?`,
      options: [
        { id: 'a', text: card.whenToUse },
        { id: 'b', text: 'Whenever a ticket looks urgent, before checking impact.' },
        { id: 'c', text: 'Only after copying raw ticket text into the learning app.' }
      ],
      correctOptionId: 'a',
      explanation: 'Use the KB only when the scenario matches the safe field-card summary.'
    },
    {
      id: `${card.id}-first-check`,
      stem: 'What is the best first check?',
      options: [
        { id: 'a', text: 'Make the biggest likely change immediately.' },
        { id: 'b', text: firstCheck },
        { id: 'c', text: 'Skip checks and write a completion note.' },
        { id: 'd', text: 'Ask for private credentials.' }
      ],
      correctOptionId: 'b',
      explanation: 'The first check should reduce risk before action.'
    },
    {
      id: `${card.id}-safe-step`,
      stem: 'Which action best matches the safe next step?',
      options: [
        { id: 'a', text: coreStep },
        { id: 'b', text: 'Change production settings without approval.' },
        { id: 'c', text: 'Store screenshots and copied ticket text in the app.' }
      ],
      correctOptionId: 'a',
      explanation: 'A good next step follows the field card without adding private data.'
    },
    {
      id: `${card.id}-escalate`,
      stem: 'When should you escalate?',
      options: [
        { id: 'a', text: 'Never; finish every task alone.' },
        { id: 'b', text: escalation },
        { id: 'c', text: 'Only after deleting the original notes.' }
      ],
      correctOptionId: 'b',
      explanation: 'Escalation protects the client, the system, and your learning.'
    }
  ];
}

export function scoreQuiz(questions: KbQuizQuestion[], answers: Record<string, string>) {
  return questions.reduce((score, question) => (
    answers[question.id] === question.correctOptionId ? score + 1 : score
  ), 0);
}
