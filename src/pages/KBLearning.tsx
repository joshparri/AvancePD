import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  advanceKbCardProgress,
  getAllKbCards,
  getKbLearningMetrics,
  loadKbActivityProgress,
  saveKbActivityProgress,
  saveKbCards,
  todayIso,
  updateKbActivityProgress
} from '../features/kb-learning/kbLearningStorage';
import {
  kbConfidenceLevels,
  kbFieldCardCategories,
  type KbAssessmentResult,
  type KbCardActivityProgress,
  type KbConfidence,
  type KbFieldCard,
  type KbFieldCardCategory,
  type KbLearningActivity,
  type KbQuizAttempt
} from '../features/kb-learning/kbLearningTypes';
import { buildKbQuiz, scoreQuiz } from '../features/kb-learning/kbQuiz';
import ExternalLearningLinks from '../features/external-learning/ExternalLearningLinks';
import type { ExternalLearningProgress } from '../features/external-learning/externalLearningTypes';
import { getResourcesForKbCard } from '../features/external-learning/externalLearningMatcher';
import {
  loadExternalLearningProgress,
  markResourceCompleted,
  markResourceSaved,
  markResourceStarted
} from '../features/external-learning/externalLearningProgress';
import type { AvanceProgress } from '../utils/progressStorage';
import type { LearningItem } from '../types';

type KBLearningProps = {
  progress: AvanceProgress;
  learningItems: LearningItem[];
  onNavigate: (page: string) => void;
};

type FieldCardForm = {
  title: string;
  category: KbFieldCardCategory;
  whenToUse: string;
  prerequisites: string;
  firstChecks: string;
  coreSteps: string;
  commonMistake: string;
  escalateIf: string;
  relatedSkill: string;
  confidence: KbConfidence;
};

const blankForm: FieldCardForm = {
  title: '',
  category: 'General Troubleshooting',
  whenToUse: '',
  prerequisites: '',
  firstChecks: '',
  coreSteps: '',
  commonMistake: '',
  escalateIf: '',
  relatedSkill: '',
  confidence: 'low'
};

const activityLabels: Record<KbLearningActivity, string> = {
  quiz: 'Start multiple-choice quiz',
  recall: 'Quick recall',
  practical: 'Practical task',
  'ticket-note': 'Ticket note drill',
  reflect: 'Reflect'
};

function sanitizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function hasSensitiveContent(value: string) {
  const lower = value.toLowerCase();
  const patterns = [/@[a-z0-9.-]+\.[a-z]{2,}/, /\b\d{1,3}(?:\.\d{1,3}){3}\b/, /\b(password|pwd|secret|token|ssh|credential|credentials|login|passphrase|ssn|api key)\b/i];
  return patterns.some((pattern) => pattern.test(value)) || /\b(?:user|admin|root)\b/.test(lower) && /\b(?:\d|@|\.|:|\/|\\)\b/.test(value);
}

function simpleContains(text: string, phrase: string) {
  return phrase && text.toLowerCase().includes(phrase.toLowerCase());
}

function getTextActivityAssessment(
  activity: KbLearningActivity,
  answer: string,
  card: KbFieldCard
): KbAssessmentResult {
  const clean = sanitizeText(answer);
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const summaryNotes: string[] = [];
  let score = 0;
  const warning = hasSensitiveContent(clean);

  if (wordCount >= 30) {
    score += 1;
    summaryNotes.push('Includes enough detail.');
  } else {
    summaryNotes.push('Add more detail to hit a stronger learning note.');
  }

  const firstCheck = card.firstChecks[0] ?? '';
  const coreStep = card.coreSteps[0] ?? '';
  const escalation = card.escalateIf ?? '';

  if (activity === 'recall') {
    if (simpleContains(clean, card.whenToUse)) {
      score += 1;
      summaryNotes.push('Mentions when to use this KB.');
    }
    if (firstCheck && simpleContains(clean, firstCheck)) {
      score += 1;
      summaryNotes.push('Includes a first check or safe first step.');
    }
    if (escalation && /(escalat|risk|review|approval)/i.test(clean)) {
      score += 1;
      summaryNotes.push('Acknowledges escalation or risk.');
    }
  } else if (activity === 'practical') {
    if (firstCheck && simpleContains(clean, firstCheck)) {
      score += 1;
      summaryNotes.push('References a safe first check.');
    }
    if (coreStep && simpleContains(clean, coreStep)) {
      score += 1;
      summaryNotes.push('Includes a safe next step.');
    }
    if (escalation && /(escalat|risk|approval|manager)/i.test(clean)) {
      score += 1;
      summaryNotes.push('Mentions risk, approval, or escalation.');
    }
  } else if (activity === 'ticket-note') {
    if (/(summary|summar)/i.test(clean)) {
      score += 1;
      summaryNotes.push('Contains a summary.');
    }
    if (/(check|verify|confirmed|performed)/i.test(clean)) {
      score += 1;
      summaryNotes.push('Notes checks or verification.');
    }
    if (/(action|did|performed|took)/i.test(clean)) {
      score += 1;
      summaryNotes.push('States the action taken.');
    }
    if (/(result|status|resolved|completed)/i.test(clean)) {
      score += 1;
      summaryNotes.push('Mentions result or status.');
    }
    if (/(follow[- ]?up|next|none)/i.test(clean)) {
      score += 1;
      summaryNotes.push('Includes follow-up or notes none.');
    }
    if (escalation && /(escalat|risk|manager|supervisor|lead)/i.test(clean)) {
      summaryNotes.push('Also mentions escalation guidance.');
    }
  } else if (activity === 'reflect') {
    if (/(learn|understand|realized|remember)/i.test(clean)) {
      score += 1;
      summaryNotes.push('Describes what was learned.');
    }
    if (/(unclear|still|confusing|question|need to)/i.test(clean)) {
      score += 1;
      summaryNotes.push('Identifies what is still unclear.');
    }
    if (/(next|again|repeat|practice|review)/i.test(clean)) {
      score += 1;
      summaryNotes.push('Includes a next practice step.');
    }
  }

  const normalizedScore = Math.min(score, 5);
  const tip = normalizedScore >= 4
    ? 'Good work. Keep the note clear and focused on safe steps.'
    : 'Try mentioning the KB trigger, safe first checks, and escalation clearly next time.';

  return {
    score: normalizedScore,
    tip,
    summary: `${summaryNotes.join(' ')}${warning ? ' This may contain sensitive information. Consider replacing it with a generic reference.' : ''}`,
    assessedAt: new Date().toISOString(),
    source: 'local'
  };
}

function getActivityButtonStatus(activity: KbLearningActivity, progress?: KbCardActivityProgress) {
  if (!progress) return 'not-started';
  if (activity === 'quiz' && progress.quizAttempt) return 'completed';
  if (activity !== 'quiz' && progress.textResponses?.[activity]) return 'completed';
  return 'not-started';
}

function KBLearning({ progress, learningItems, onNavigate }: KBLearningProps) {
  const [fieldCards, setFieldCards] = useState<KbFieldCard[]>(getAllKbCards);
  const [activityProgress, setActivityProgress] = useState(loadKbActivityProgress);
  const [form, setForm] = useState<FieldCardForm>(blankForm);
  const [filter, setFilter] = useState('all');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [activityStatus, setActivityStatus] = useState('');
  const [activeActivity, setActiveActivity] = useState<KbLearningActivity>('quiz');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [textAnswer, setTextAnswer] = useState('');
  const [externalLearningProgress, setExternalLearningProgress] = useState<ExternalLearningProgress>(loadExternalLearningProgress);

  useEffect(() => {
    saveKbCards(fieldCards);
  }, [fieldCards]);

  useEffect(() => {
    saveKbActivityProgress(activityProgress);
  }, [activityProgress]);

  const metrics = useMemo(() => getKbLearningMetrics(fieldCards, progress, learningItems), [fieldCards, learningItems, progress]);
  const dueCards = useMemo(() => fieldCards.filter((card) => card.nextReviewAt.slice(0, 10) <= todayIso()), [fieldCards]);
  const recommendedCard = useMemo(() => getRecommendedCard(fieldCards, dueCards), [dueCards, fieldCards]);
  const selectedCard = fieldCards.find((card) => card.id === selectedCardId) ?? recommendedCard ?? fieldCards[0];
  const selectedProgress = selectedCard ? activityProgress[selectedCard.id] : undefined;
  const activeTopicLabel = selectedCardId ? 'Now studying' : 'Recommended today';
  const quizQuestions = useMemo(() => selectedCard ? buildKbQuiz(selectedCard) : [], [selectedCard]);
  const externalResources = useMemo(
    () => selectedCard ? getResourcesForKbCard(selectedCard) : [],
    [selectedCard]
  );
  const topExternalResources = useMemo(() => externalResources.slice(0, 3), [externalResources]);
  const visibleCards = useMemo(
    () => filter === 'all' ? fieldCards : fieldCards.filter((card) => card.category === filter),
    [fieldCards, filter]
  );

  useEffect(() => {
    if (!selectedCardId && recommendedCard) {
      setSelectedCardId(recommendedCard.id);
    }
  }, [recommendedCard, selectedCardId]);

  useEffect(() => {
    if (!selectedCard) return;
    setQuizAnswers(selectedProgress?.quizAttempt?.answers ?? {});
    setTextAnswer(selectedProgress?.textResponses[activeActivity] ?? '');
    setActivityStatus('');
  }, [activeActivity, selectedCard, selectedProgress]);

  const updateForm = <K extends keyof FieldCardForm>(field: K, value: FieldCardForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const studyCard = (card: KbFieldCard) => {
    setSelectedCardId(card.id);
    setActivityStatus(`Now studying: ${card.title}`);
    window.setTimeout(() => {
      document.getElementById('kb-learning-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const addFieldCard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const newCard: KbFieldCard = {
      id: `kb-user-${Date.now()}`,
      title: form.title.trim() || 'Untitled KB field card',
      category: form.category,
      whenToUse: form.whenToUse.trim() || 'Add when this KB should be used.',
      prerequisites: form.prerequisites.trim() || 'Add prerequisites before using this card.',
      firstChecks: splitLines(form.firstChecks),
      coreSteps: splitLines(form.coreSteps),
      commonMistake: form.commonMistake.trim() || 'Add the mistake to avoid.',
      escalateIf: form.escalateIf.trim() || 'Add when to escalate.',
      relatedSkill: form.relatedSkill.trim() || 'Unknown',
      confidence: form.confidence,
      reviewStage: 0,
      createdAt: now,
      updatedAt: now,
      nextReviewAt: todayIso(),
      isDemo: false
    };

    setFieldCards((current) => [newCard, ...current]);
    setSelectedCardId(newCard.id);
    setForm(blankForm);
  };

  const setCardProgress = (card: KbFieldCard, scoreHint?: number) => {
    setFieldCards((current) => current.map((item) => (
      item.id === card.id ? advanceKbCardProgress(item, scoreHint) : item
    )));
  };

  const submitQuiz = () => {
    if (!selectedCard) return;
    const score = scoreQuiz(quizQuestions, quizAnswers);
    const attempt: KbQuizAttempt = {
      answers: quizAnswers,
      score,
      total: quizQuestions.length,
      completedAt: new Date().toISOString()
    };

    setActivityProgress((current) => updateKbActivityProgress(current, selectedCard.id, 'quiz', { quizAttempt: attempt }));
    setCardProgress(selectedCard, Math.max(1, Math.round((score / quizQuestions.length) * 5)));
    setActivityStatus(`Quiz saved: ${score}/${quizQuestions.length}.`);
  };

  const submitTextActivity = () => {
    if (!selectedCard) return;
    const answer = textAnswer.trim();
    if (!answer) {
      setActivityStatus('Write a short answer before saving your attempt.');
      return;
    }

    const assessment = getTextActivityAssessment(activeActivity, answer, selectedCard);
    setActivityProgress((current) => {
      const currentCardProgress = current[selectedCard.id];
      return updateKbActivityProgress(current, selectedCard.id, activeActivity, {
        textResponse: answer,
        assessments: {
          ...(currentCardProgress?.assessments ?? {}),
          [activeActivity]: assessment
        }
      });
    });
    setCardProgress(selectedCard, assessment.score);
    setActivityStatus(`Saved ${activityLabels[activeActivity]}. Score ${assessment.score}/5.`);
  };

  const markSavedResource = (resourceId: string) => setExternalLearningProgress(markResourceSaved(resourceId));
  const markStartedResource = (resourceId: string) => setExternalLearningProgress(markResourceStarted(resourceId));
  const markCompletedResource = (resourceId: string) => setExternalLearningProgress(markResourceCompleted(resourceId));

  const savedQuizAttempt = selectedProgress?.quizAttempt;
  const assessment = selectedProgress?.assessments[activeActivity];

  return (
    <div>
      <section className="card kb-session-card learning-hero-card">
        <div className="skill-card-header" id="kb-learning-hero" tabIndex={-1}>
          <div>
            <h1>What are we learning today?</h1>
            <p className="page-subtitle">Pick one MSP skill, practise it, and follow a clear learning path.</p>
            <p className="page-help">Hi Josh. Today's active topic is <strong>{selectedCard?.title ?? 'your first KB field card'}</strong>.</p>
            <div className="recommendation-callout">
              <div className="recommendation-pill">
                <span className="status-chip info">{activeTopicLabel}</span>
                <strong>{selectedCard?.title ?? 'Select a KB field card to begin'}</strong>
              </div>
              <p className="page-help">Focus your next activity on this topic and build a clear review path.</p>
            </div>
          </div>
          <div className="learning-hero-summary">
            <span className="status-chip info">{selectedCard?.relatedSkill ?? 'KB Learning'}</span>
            <span className="status-chip success">{metrics.kbCards} cards</span>
          </div>
        </div>
        <div className="learning-path-row status-button-row">
          {(Object.keys(activityLabels) as KbLearningActivity[]).map((activity) => {
            const status = getActivityButtonStatus(activity, selectedProgress);
            return (
              <button
                key={activity}
                type="button"
                className={activeActivity === activity ? 'small-action active primary-action' : 'small-action secondary-action'}
                onClick={() => setActiveActivity(activity)}
              >
                <span>{activityLabels[activity]}</span>
                {status !== 'not-started' && (
                  <span className={`activity-pill ${status}`}>{status === 'completed' ? 'Done' : 'Tried'}</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="metric-row">
          <span className="status-chip info">{metrics.reviewsDue} reviews due</span>
          <span className="status-chip success">{metrics.scenariosCompleted} scenarios completed</span>
          <span className="status-chip info">{metrics.evidenceItems} evidence items</span>
        </div>
        {topExternalResources.length > 0 && (
          <div className="mini-card learning-support-card" style={{ marginTop: '1rem' }}>
            <h3>Helpful learning support</h3>
            <p className="page-help">These resources are curated to match today’s recommended topic.</p>
            <ul>
              {topExternalResources.map((resource) => (
                <li key={resource.id} style={{ marginBottom: '0.65rem' }}>
                  <a href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a>
                  <span className="status-chip info" style={{ marginLeft: '0.6rem' }}>{resource.provider}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {selectedCard && (
        <section className="card">
          <div className="skill-card-header">
            <div>
              <h2>{selectedCard.title}</h2>
              <p className="page-help">{selectedCard.whenToUse}</p>
            </div>
            <div className="metric-row">
              {selectedCard.isDemo && <span className="status-chip info">Demo</span>}
              <span className="status-chip warn">confidence: {selectedCard.confidence}</span>
              <span className="status-chip success">stage {selectedCard.reviewStage}</span>
            </div>
          </div>
          {activeActivity === 'quiz' ? (
            <QuizActivity
              answers={quizAnswers}
              questions={quizQuestions}
              savedAttempt={savedQuizAttempt}
              onAnswer={(questionId, optionId) => setQuizAnswers((current) => ({ ...current, [questionId]: optionId }))}
              onSubmit={submitQuiz}
            />
          ) : (
            <TextActivity
              activity={activeActivity}
              assessment={assessment}
              value={textAnswer}
              onChange={setTextAnswer}
              onSubmit={submitTextActivity}
            />
          )}
          {activityStatus && <p className="health-muted">{activityStatus}</p>}
        </section>
      )}

      {selectedCard && externalResources.length > 0 && (
        <ExternalLearningLinks
          resources={externalResources}
          progress={externalLearningProgress}
          onSave={markSavedResource}
          onStart={markStartedResource}
          onComplete={markCompletedResource}
          title="Helpful external learning for this topic"
        />
      )}

      <section className="card">
        <h2>KB Map</h2>
        <div className="filter-bar">
          <label>
            Category
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All categories</option>
              {kbFieldCardCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="skill-grid">
          {visibleCards.map((card) => (
            <article key={card.id} className="mini-card skill-card">
              <div className="skill-card-header">
                <h3>{card.title}</h3>
                {card.isDemo && <span className="status-chip info">Demo</span>}
              </div>
              <p>{card.whenToUse}</p>
              <div className="metric-row">
                <span className="status-chip info">{card.category}</span>
                <span className="status-chip warn">{card.relatedSkill}</span>
                <span className="status-chip success">stage {card.reviewStage}</span>
              </div>
              <details className="kb-card-details">
                <summary>Show field card details</summary>
                <h4>Prerequisites</h4>
                <p>{card.prerequisites}</p>
                <h4>First checks</h4>
                <ul>{card.firstChecks.map((check) => <li key={check}>{check}</li>)}</ul>
                <h4>Core steps</h4>
                <ul>{card.coreSteps.map((step) => <li key={step}>{step}</li>)}</ul>
                <p><strong>Common mistake:</strong> {card.commonMistake}</p>
                <p><strong>Escalate if:</strong> {card.escalateIf}</p>
                <p><strong>Next review:</strong> {card.nextReviewAt.slice(0, 10)}</p>
              </details>
              <button type="button" className="small-action" onClick={() => studyCard(card)}>
                Study this
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Add KB field card</h2>
        <form className="quick-capture-form" onSubmit={addFieldCard}>
          <label>
            Title
            <input value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Example: Enrolling a New Computer into Intune" />
          </label>
          <div className="filter-bar">
            <label>
              Category
              <select value={form.category} onChange={(event) => updateForm('category', event.target.value as KbFieldCardCategory)}>
                {kbFieldCardCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              Confidence
              <select value={form.confidence} onChange={(event) => updateForm('confidence', event.target.value as KbConfidence)}>
                {kbConfidenceLevels.map((confidence) => (
                  <option key={confidence} value={confidence}>{confidence}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Related skill
            <input value={form.relatedSkill} onChange={(event) => updateForm('relatedSkill', event.target.value)} placeholder="Intune, Outlook, backup/recovery..." />
          </label>
          <label>
            When to use
            <textarea value={form.whenToUse} onChange={(event) => updateForm('whenToUse', event.target.value)} />
          </label>
          <label>
            Prerequisites
            <textarea value={form.prerequisites} onChange={(event) => updateForm('prerequisites', event.target.value)} />
          </label>
          <label>
            First checks
            <textarea value={form.firstChecks} onChange={(event) => updateForm('firstChecks', event.target.value)} placeholder="One check per line" />
          </label>
          <label>
            Core steps
            <textarea value={form.coreSteps} onChange={(event) => updateForm('coreSteps', event.target.value)} placeholder="One step per line" />
          </label>
          <label>
            Common mistake
            <textarea value={form.commonMistake} onChange={(event) => updateForm('commonMistake', event.target.value)} />
          </label>
          <label>
            Escalate if
            <textarea value={form.escalateIf} onChange={(event) => updateForm('escalateIf', event.target.value)} />
          </label>
          <button type="submit">Add KB field card</button>
        </form>
      </section>

      <section className="card">
        <h2>Scenario Drills</h2>
        <p>Practise generic scenarios that match the same skill area as a KB card.</p>
        <button type="button" onClick={() => onNavigate('mspScenarios')}>Open MSP Scenarios</button>
      </section>

      <section className="card">
        <h2>Ticket Note Drills</h2>
        <p>Turn a KB topic or scenario into a concise ticket-note practice entry.</p>
        <button type="button" onClick={() => onNavigate('ticketNotes')}>Open Ticket Notes</button>
      </section>
    </div>
  );
}

function QuizActivity({
  answers,
  questions,
  savedAttempt,
  onAnswer,
  onSubmit
}: {
  answers: Record<string, string>;
  questions: ReturnType<typeof buildKbQuiz>;
  savedAttempt?: KbQuizAttempt;
  onAnswer: (questionId: string, optionId: string) => void;
  onSubmit: () => void;
}) {
  const answeredCount = Object.keys(answers).length;
  return (
    <div className="kb-activity-panel">
      <div className="metric-row">
        <span className="status-chip info">{answeredCount}/{questions.length} answered</span>
        {savedAttempt && <span className="status-chip success">last score {savedAttempt.score}/{savedAttempt.total}</span>}
      </div>
      <div className="kb-quiz-list">
        {questions.map((question) => (
          <article key={question.id} className="mini-card">
            <h3>{question.stem}</h3>
            <div className="kb-quiz-options">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.id;
                const correct = option.id === question.correctOptionId;
                const selectedWrong = savedAttempt && selected && !correct;
                const showCorrect = savedAttempt && correct;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={
                      selectedWrong ? 'small-action warn' : showCorrect ? 'small-action success' : selected ? 'small-action active' : 'small-action'
                    }
                    onClick={() => onAnswer(question.id, option.id)}
                  >
                    {option.text}
                    {savedAttempt && (correct ? ' (correct)' : selectedWrong ? ' (your answer)' : '')}
                  </button>
                );
              })}
            </div>
            {savedAttempt && <p className="health-muted">{question.explanation}</p>}
          </article>
        ))}
      </div>
      <button type="button" disabled={answeredCount < questions.length} onClick={onSubmit}>
        Save quiz result
      </button>
    </div>
  );
}

function TextActivity({
  activity,
  assessment,
  value,
  onChange,
  onSubmit
}: {
  activity: KbLearningActivity;
  assessment?: KbAssessmentResult;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="kb-activity-panel">
      <label className="inline-control">
        {getTextPrompt(activity)}
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={getTextPlaceholder(activity)} />
      </label>
      <div className="metric-row">
        <span className="status-chip info">{value.trim().split(/\s+/).filter(Boolean).length} words</span>
        <span className={`status-chip ${assessment ? 'success' : 'warn'}`}>
          {assessment ? `${assessment.source} score ${assessment.score}/5` : 'not assessed yet'}
        </span>
      </div>
      <button type="button" onClick={onSubmit}>Assess and save</button>
      {assessment && (
        <div className="feedback-panel">
          <h4>Assessment</h4>
          <p>{assessment.summary}</p>
          <p><strong>Tip:</strong> {assessment.tip}</p>
        </div>
      )}
    </div>
  );
}

function getRecommendedCard(cards: KbFieldCard[], dueCards: KbFieldCard[]) {
  if (dueCards[0]) return dueCards[0];
  const confidenceRank: Record<KbConfidence, number> = { low: 0, medium: 1, high: 2 };
  return [...cards].sort((a, b) => (
    confidenceRank[a.confidence] - confidenceRank[b.confidence] || a.reviewStage - b.reviewStage
  ))[0];
}

function getTextPrompt(activity: KbLearningActivity) {
  if (activity === 'recall') return 'Quick recall';
  if (activity === 'practical') return 'Practical task';
  if (activity === 'ticket-note') return 'Ticket note drill';
  return 'Reflection';
}

function getTextPlaceholder(activity: KbLearningActivity) {
  if (activity === 'recall') return 'Summarise what you remember before looking at the field card.';
  if (activity === 'practical') return 'Describe the safe steps you would perform and what you would check first.';
  if (activity === 'ticket-note') return 'Write a concise note: summary, checks, action, result, follow-up.';
  return 'What did you understand, what still feels unclear, and what will you practise next?';
}

function splitLines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

export default KBLearning;
