import { useState } from 'react';
import { responseRubrics } from '../data/responseRubrics';
import { getTicketNoteFeedback, type CoachFeedback, type TicketNoteFeedbackRequest } from '../utils/groqClient';
import FeedbackCard from '../components/FeedbackCard';

type TicketNotesProps = {
  ticketNotePracticeCount: number;
  incrementTicketNotePractice: () => void;
};

const ticketNoteTemplate = `Issue:
User impact:
Checks performed:
Action taken:
Result:
Next step:
Escalation reason if applicable:`;

const examples = [
  {
    label: 'Poor',
    tone: 'error',
    text: 'Fixed Outlook. User happy.'
  },
  {
    label: 'Okay',
    tone: 'warn',
    text: 'Issue: Outlook not syncing. I restarted it and it worked, but I did not write down what changed.'
  },
  {
    label: 'Better',
    tone: 'info',
    text: 'Issue: Outlook desktop not syncing. User impact: unable to see customer mail. Checked online mailbox, verified Outlook sync status, and restarted Outlook. Result: mail returned.'
  },
  {
    label: 'Password/MFA issue',
    tone: 'info',
    text: 'Issue: user could not sign in after a password reset. User impact: email and Teams unavailable. Checked account status, reviewed MFA prompt, and guided user through approved re-registration. Result: sign-in successful. Next step: confirm access on desktop and mobile.'
  },
  {
    label: 'OneDrive sync issue',
    tone: 'info',
    text: 'Issue: OneDrive showed red status icons and user could not confirm file save. User impact: concern about lost work. Checked sync status, OneDrive online copy, and local path length. Result: resumed sync and corrected a long path. Next step: verify files on another device.'
  },
  {
    label: 'Printer issue',
    tone: 'info',
    text: 'Issue: user could not print to the office printer. User impact: unable to produce important documents. Checked current printer queue and test page. Action taken: set the correct active printer and cleared the stuck job. Result: print completed. Next step: ask the user to retry if the issue returns.'
  },
  {
    label: 'Suspected phishing email',
    tone: 'info',
    text: 'Issue: user reported a suspicious email and clicked the link without entering credentials. User impact: possible account risk. Preserved the message, checked sign-in activity, and reported it to security. Result: security team is reviewing the email. Next step: follow any remediation guidance and monitor the account.'
  },
  {
    label: 'Backup failure escalation',
    tone: 'info',
    text: 'Issue: overnight backup job failed. User impact: latest recoverable restore point missing. Checked the job error and repository capacity. Action taken: escalated to backup owner with error details. Result: remediation ticket opened. Next step: confirm next successful backup and recovery readiness.'
  },
  {
    label: 'Excellent',
    tone: 'success',
    text: 'Issue: intermittent file share access failure. User impact: the user could not open files needed for scheduled work. Checks performed: verified network reachability, confirmed share permissions, reviewed recent server alerts, and checked user session state. Action taken: reset the server connection, cleared stale sessions, and validated access on the user device. Result: file access was restored and the user confirmed they could open files. Next step: monitor the share for repeated disconnects and escalate to storage support if it recurs. Escalation reason if applicable: recurring storage connection failures may need server-side investigation.'
  }
] as const;

function TicketNotes({ ticketNotePracticeCount, incrementTicketNotePractice }: TicketNotesProps) {
  const [userNote, setUserNote] = useState('');
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [feedbackError, setFeedbackError] = useState('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const handleGetFeedback = async () => {
    if (!userNote.trim()) return;
    setIsLoadingFeedback(true);
    setFeedbackError('');
    try {
      const request: TicketNoteFeedbackRequest = {
        idealAnswer: ticketNoteTemplate,
        userAnswer: userNote,
      };
      const result = await getTicketNoteFeedback(request);
      setFeedback(result);
    } catch (err: unknown) {
      setFeedbackError(err instanceof Error ? err.message : 'Unable to get feedback.');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  return (
    <div>
      <section className="card">
        <h1>Ticket Notes Trainer</h1>
        <p>Practise notes that help the user, the next technician, and your future self understand what happened.</p>
        <div className="metric-row">
          <span className="status-chip info">{ticketNotePracticeCount} practice notes recorded</span>
          <button type="button" onClick={incrementTicketNotePractice}>Record practice note</button>
        </div>
      </section>

      <section className="card">
        <h2>Reliable ticket note structure</h2>
        <div className="card-grid">
          {['Issue', 'User impact', 'Checks performed', 'Action taken', 'Result', 'Next step', 'Escalation reason if applicable'].map((part) => (
            <article key={part} className="mini-card">
              <h3>{part}</h3>
              <p>{copyForPart(part)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Examples</h2>
        <div className="card-grid">
          {examples.map((example) => (
            <article key={example.label} className="mini-card">
              <span className={`status-chip ${example.tone}`}>{example.label}</span>
              <p>{example.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Response evaluation rubric</h2>
        <p>Use this checklist to review whether your wording is calm, clear, and useful.</p>
        <div className="card-grid">
          {responseRubrics.map((item) => (
            <article key={item.category} className="mini-card">
              <h3>{item.category}</h3>
              <p><strong>Good:</strong> {item.good}</p>
              <p><strong>Common mistake:</strong> {item.mistake}</p>
              <p><strong>Self-check:</strong> {item.check}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Template</h2>
        <p>Use this as a starting point when writing or reviewing a ticket.</p>
        <pre className="template-box">{ticketNoteTemplate}</pre>
      </section>

      <section className="card">
        <h2>Practice writing a ticket note</h2>
        <p>Write a ticket note based on a hypothetical scenario, then get AI feedback.</p>
        <textarea
          value={userNote}
          onChange={(event) => setUserNote(event.target.value)}
          placeholder="Write your ticket note here…"
          rows={8}
        />
        <p className="privacy-reminder">Use generic training answers only. Do not include client names, passwords, hostnames, private ticket text, or sensitive data.</p>
        {!userNote.trim() ? (
          <p className="feedback-empty-hint">Write your ticket note first, then I can coach it.</p>
        ) : (
          <button type="button" onClick={handleGetFeedback} disabled={isLoadingFeedback}>
            {isLoadingFeedback ? 'Getting feedback…' : feedback ? 'Get fresh feedback' : 'Get AI Feedback'}
          </button>
        )}
        {feedbackError && (
          <div className="error-panel">
            <h3>Feedback unavailable</h3>
            <p>{feedbackError}</p>
          </div>
        )}
        {feedback && (
          <FeedbackCard feedback={feedback} onClear={() => setFeedback(null)} />
        )}
      </section>
    </div>
  );
}

function copyForPart(part: string) {
  switch (part) {
    case 'Issue':
      return 'State the symptom or request in plain language.';
    case 'User impact':
      return 'Explain what work is blocked, degraded, or at risk.';
    case 'Checks performed':
      return 'List useful diagnostics so nobody repeats the same work.';
    case 'Action taken':
      return 'Record what you changed, guided, tested, or avoided.';
    case 'Result':
      return 'Say what improved, what failed, and what was confirmed.';
    case 'Next step':
      return 'Name the follow-up, owner, timing, or monitoring needed.';
    default:
      return 'Use this when another person or team needs to take over.';
  }
}

export default TicketNotes;
