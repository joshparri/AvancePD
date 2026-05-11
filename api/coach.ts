import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface CoachRequest {
  mode: 'scenario' | 'communication' | 'ticket-note';
  scenarioTitle?: string;
  scenarioContext?: string;
  idealAnswer?: string;
  userAnswer: string;
  category?: string;
  difficulty?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body: CoachRequest = req.body;

    // Validate input
    if (!body.userAnswer || body.userAnswer.length > 5000) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (body.mode) {
      case 'scenario':
        systemPrompt = "You are a mentor for MSP technicians. Compare the user's answers to the ideal answers and provide calm, practical feedback. Highlight what they did well and what could be improved. Keep feedback constructive and focused on learning.";
        userPrompt = `Scenario: ${body.scenarioTitle || 'Generic scenario'}

Ideal answers: ${body.idealAnswer || 'Follow best practices'}

User answer: ${body.userAnswer}`;
        break;

      case 'communication':
        systemPrompt = "You are a mentor for MSP technicians. Evaluate the user's communication response for tone, clarity, professionalism, and effectiveness. Provide constructive feedback on how to improve.";
        userPrompt = `Context: ${body.scenarioContext || 'Generic communication scenario'}

Ideal response: ${body.idealAnswer || 'Professional and clear response'}

User response: ${body.userAnswer}`;
        break;

      case 'ticket-note':
        systemPrompt = "You are a mentor for MSP technicians. Evaluate the user's ticket note for completeness, clarity, and usefulness. Use the standard template and provide feedback on what to improve.";
        userPrompt = `Template: ${body.idealAnswer || 'Issue / User impact / Checks / Action / Result / Next step'}

User note: ${body.userAnswer}`;
        break;

      default:
        return res.status(400).json({ error: 'Invalid mode' });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
    });

    const feedback = completion.choices[0]?.message?.content || 'No feedback available';

    return res.status(200).json({ feedback });
  } catch (error) {
    console.error('Groq API error:', error);
    return res.status(500).json({ error: 'Failed to get feedback' });
  }
}