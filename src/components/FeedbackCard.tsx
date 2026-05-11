import type { CoachFeedback } from '../utils/groqClient';

function verdictChipClass(verdict: CoachFeedback['verdict']) {
  if (verdict === 'strong') return 'success';
  if (verdict === 'partly correct') return 'warn';
  return 'error';
}

function statusChipClass(status: 'missing' | 'partial' | 'good') {
  if (status === 'good') return 'success';
  if (status === 'partial') return 'warn';
  return 'error';
}

interface FeedbackCardProps {
  feedback: CoachFeedback;
  onClear: () => void;
}

export default function FeedbackCard({ feedback, onClear }: FeedbackCardProps) {
  return (
    <div className="ai-feedback-card">
      <div className="ai-feedback-header">
        <span className={`status-chip ${verdictChipClass(feedback.verdict)}`}>{feedback.verdict}</span>
        <p className="feedback-summary">{feedback.summary}</p>
      </div>

      {feedback.sections.map((section) => (
        <div key={section.title} className="feedback-section">
          <div className="feedback-section-header">
            <span className="feedback-section-title">{section.title}</span>
            <span className={`status-chip feedback-status ${statusChipClass(section.status)}`}>
              {section.status}
            </span>
          </div>
          <ul className="feedback-points">
            {section.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className="feedback-next-step">
        <strong>Next step:</strong> {feedback.nextStep}
      </div>

      <button type="button" className="clear-feedback-btn" onClick={onClear}>
        Clear feedback
      </button>
    </div>
  );
}
