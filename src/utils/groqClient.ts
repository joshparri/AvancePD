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

async function callCoachAPI(mode: 'scenario' | 'communication' | 'ticket-note', request: any): Promise<string> {
  const response = await fetch('/api/coach', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode,
      ...request,
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || 'Failed to get feedback';
    const code = data?.code ? ` (${data.code})` : '';
    throw new Error(`${message}${code}`);
  }

  return data.feedback;
}

export async function getScenarioFeedback(request: ScenarioFeedbackRequest): Promise<string> {
  return callCoachAPI('scenario', request);
}

export async function getCommunicationFeedback(request: CommunicationFeedbackRequest): Promise<string> {
  return callCoachAPI('communication', request);
}

export async function getTicketNoteFeedback(request: TicketNoteFeedbackRequest): Promise<string> {
  return callCoachAPI('ticket-note', request);
}