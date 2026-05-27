import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  getKbLearningMetrics,
  kbCategories,
  kbConfidenceLevels,
  loadKbFieldCards,
  saveUserKbFieldCards,
  scheduleNextReview,
  todayIso,
  type KbFieldCard
} from '../data/kbLearning';
import type { AvanceProgress } from '../utils/progressStorage';
import type { LearningItem } from '../types';

type KBLearningProps = {
  progress: AvanceProgress;
  learningItems: LearningItem[];
  onNavigate: (page: string) => void;
};

type FieldCardForm = {
  title: string;
  category: string;
  whenToUse: string;
  prerequisites: string;
  firstChecks: string;
  coreSteps: string;
  commonMistake: string;
  escalateIf: string;
  relatedSkill: string;
  confidence: string;
};

const blankForm: FieldCardForm = {
  title: '',
  category: 'Unknown',
  whenToUse: '',
  prerequisites: '',
  firstChecks: '',
  coreSteps: '',
  commonMistake: '',
  escalateIf: '',
  relatedSkill: '',
  confidence: 'I recognise it'
};

function KBLearning({ progress, learningItems, onNavigate }: KBLearningProps) {
  const [fieldCards, setFieldCards] = useState<KbFieldCard[]>(loadKbFieldCards);
  const [form, setForm] = useState<FieldCardForm>(blankForm);
  const [filter, setFilter] = useState('all');
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    saveUserKbFieldCards(fieldCards);
  }, [fieldCards]);

  const metrics = useMemo(() => getKbLearningMetrics(fieldCards, progress, learningItems), [fieldCards, learningItems, progress]);
  const dueCards = useMemo(() => fieldCards.filter((card) => card.nextReviewAt <= todayIso()), [fieldCards]);
  const visibleCards = useMemo(
    () => filter === 'all' ? fieldCards : fieldCards.filter((card) => card.category === filter),
    [fieldCards, filter]
  );

  const updateForm = (field: keyof FieldCardForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
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
    setForm(blankForm);
  };

  const markReviewed = (card: KbFieldCard) => {
    if (card.isDemo) {
      setReviewMessage('Demo cards show the review flow. Add your own field card to save review progress.');
      return;
    }

    setFieldCards((current) => current.map((item) => item.id === card.id ? scheduleNextReview(item) : item));
    setReviewMessage(`${card.title} moved to the next review stage.`);
  };

  return (
    <div>
      <section className="card">
        <h1>KB Learning Machine</h1>
        <p>Turn KBs into recall, scenarios, ticket-note practice, and evidence.</p>
        <div className="privacy-note">Use field cards for safe summaries only. Do not import raw KB content, passwords, tickets, hostnames, IPs, screenshots, or copied internal text.</div>
        <div className="card-grid">
          <Metric label="KB cards" value={metrics.kbCards} />
          <Metric label="Reviews due" value={metrics.reviewsDue} />
          <Metric label="Scenarios completed" value={metrics.scenariosCompleted} />
          <Metric label="Evidence items" value={metrics.evidenceItems} />
        </div>
      </section>

      <section className="card">
        <h2>KB Map</h2>
        <div className="filter-bar">
          <label>
            Category
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All categories</option>
              {kbCategories.map((category) => (
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
              <h4>First checks</h4>
              <ul>
                {card.firstChecks.map((check) => <li key={check}>{check}</li>)}
              </ul>
              <h4>Core steps</h4>
              <ul>
                {card.coreSteps.map((step) => <li key={step}>{step}</li>)}
              </ul>
              <p><strong>Common mistake:</strong> {card.commonMistake}</p>
              <p><strong>Escalate if:</strong> {card.escalateIf}</p>
              <p><strong>Next review:</strong> {card.nextReviewAt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Today's Reviews</h2>
        {reviewMessage && <p className="health-muted">{reviewMessage}</p>}
        {dueCards.length ? (
          <div className="health-plan-grid">
            {dueCards.slice(0, 4).map((card) => (
              <article key={card.id} className="mini-card">
                <div className="skill-card-header">
                  <h3>{card.title}</h3>
                  {card.isDemo && <span className="status-chip info">Demo</span>}
                </div>
                <p>Explain the KB from memory, then check the field card.</p>
                <p><strong>Prompt:</strong> What would you check first, what would you do next, and when would you escalate?</p>
                <button type="button" onClick={() => markReviewed(card)}>Mark reviewed</button>
              </article>
            ))}
          </div>
        ) : (
          <p>No KB reviews due today. Add a card to begin the review rhythm.</p>
        )}
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
              <select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                {kbCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              Confidence
              <select value={form.confidence} onChange={(event) => updateForm('confidence', event.target.value)}>
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

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="mini-card">
      <h3>{value}</h3>
      <p>{label}</p>
    </article>
  );
}

function splitLines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

export default KBLearning;
