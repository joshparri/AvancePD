import type { KbAssessmentResult, KbLearningActivity } from './kbLearningTypes';

export interface KbAssessmentRequest {
  kbTitle: string;
  activity: KbLearningActivity;
  userAnswer: string;
}

type GroqChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export async function assessKbResponseWithGroq(request: KbAssessmentRequest): Promise<KbAssessmentResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  if (!apiKey) {
    return localAssessment(request.userAnswer, 'Set VITE_GROQ_API_KEY to enable Groq assessment.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: (import.meta.env.VITE_GROQ_MODEL as string | undefined) || 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_tokens: 120,
      messages: [
        {
          role: 'system',
          content: [
            'You assess safe MSP learning practice.',
            'Do not request or reveal credentials, client details, hostnames, IPs, screenshots, or copied ticket text.',
            'Return exactly: Score: <1-5>. Tip: <one short improvement tip>. Summary: <one short sentence>.'
          ].join(' ')
        },
        {
          role: 'user',
          content: `KB title: ${request.kbTitle}\nActivity: ${request.activity}\nLearner answer:\n${request.userAnswer}`
        }
      ]
    })
  });

  if (!response.ok) {
    return localAssessment(request.userAnswer, 'Groq assessment was unavailable. Try again later.');
  }

  const data = await response.json().catch(() => null) as GroqChatResponse | null;
  const content = data?.choices?.[0]?.message?.content ?? '';
  return parseGroqAssessment(content);
}

function parseGroqAssessment(content: string): KbAssessmentResult {
  const scoreMatch = content.match(/score:\s*([1-5])/i);
  const tipMatch = content.match(/tip:\s*(.*?)(?:summary:|$)/is);
  const summaryMatch = content.match(/summary:\s*(.*)$/is);

  return {
    score: scoreMatch ? Number(scoreMatch[1]) : 3,
    tip: cleanText(tipMatch?.[1]) || 'Add clearer first checks and escalation criteria.',
    summary: cleanText(summaryMatch?.[1]) || 'Assessment received.',
    assessedAt: new Date().toISOString(),
    source: 'groq'
  };
}

function localAssessment(answer: string, tip: string): KbAssessmentResult {
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const score = wordCount >= 45 ? 4 : wordCount >= 20 ? 3 : 2;
  return {
    score,
    tip,
    summary: wordCount ? 'Local assessment saved with basic completeness scoring.' : 'Add an answer before assessment.',
    assessedAt: new Date().toISOString(),
    source: 'local'
  };
}

function cleanText(value?: string) {
  return value?.replace(/\s+/g, ' ').trim() ?? '';
}
