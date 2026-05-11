export type FeedbackVerdict = 'needs work' | 'partly correct' | 'strong';
export type FeedbackStatus = 'missing' | 'partial' | 'good';

export interface FeedbackSection {
  title: string;
  status: FeedbackStatus;
  points: string[];
}

export interface CoachFeedback {
  verdict: FeedbackVerdict;
  summary: string;
  sections: FeedbackSection[];
  nextStep: string;
}

export interface ScenarioFeedbackRequest {
  scenarioTitle: string;
  idealAnswer: string;
  userAnswer: string;
}

export interface CommunicationFeedbackRequest {
  scenarioContext: string;
  idealAnswer: string;
  userAnswer: string;
}

export interface TicketNoteFeedbackRequest {
  idealAnswer: string;
  userAnswer: string;
}

function makeFallback(text: string): CoachFeedback {
  return {
    verdict: 'partly correct',
    summary: 'Feedback received.',
    sections: [
      {
        title: 'General feedback',
        status: 'partial',
        points: [text.slice(0, 150).trim() || 'No feedback text returned.'],
      },
    ],
    nextStep: 'Try again with more specific details.',
  };
}

function isCoachFeedback(value: unknown): value is CoachFeedback {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.verdict === 'string' &&
    typeof v.summary === 'string' &&
    Array.isArray(v.sections) &&
    typeof v.nextStep === 'string'
  );
}

async function callCoachAPI(
  mode: 'scenario' | 'communication' | 'ticket-note',
  request: object,
): Promise<CoachFeedback> {
  const response = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, ...request }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as any)?.message ?? (data as any)?.error ?? 'Failed to get feedback';
    throw new Error(message);
  }

  if (isCoachFeedback(data?.feedback)) {
    return data.feedback;
  }

  if (typeof data?.feedback === 'string') {
    return makeFallback(data.feedback);
  }

  return makeFallback('Unexpected feedback format.');
}

export async function getScenarioFeedback(request: ScenarioFeedbackRequest): Promise<CoachFeedback> {
  return callCoachAPI('scenario', request);
}

export async function getCommunicationFeedback(request: CommunicationFeedbackRequest): Promise<CoachFeedback> {
  return callCoachAPI('communication', request);
}

export async function getTicketNoteFeedback(request: TicketNoteFeedbackRequest): Promise<CoachFeedback> {
  return callCoachAPI('ticket-note', request);
}
