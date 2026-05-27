import { useEffect, useState } from 'react';
import { microLearningCards, type MicroLearningCard } from '../data/microLearning';
import { mspScenarios } from '../data/mspScenarios';
import { mspSkills } from '../data/mspSkills';
import type { AvanceProgress } from '../utils/progressStorage';

type MicroLearningProps = {
  progress: AvanceProgress;
  markMicroCardViewed: (cardId: string) => void;
  focusCardId?: string;
  onNavigate?: (page: string, focusId?: string) => void;
};

const allCategories = ['All', ...Array.from(new Set(microLearningCards.map((c) => c.category)))];

function MicroLearning({ progress, markMicroCardViewed, focusCardId, onNavigate }: MicroLearningProps) {
  const [selectedId, setSelectedId] = useState(microLearningCards[0]?.id ?? '');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const viewed = new Set(progress.viewedMicroCardIds ?? []);
  const filtered = categoryFilter === 'All'
    ? microLearningCards
    : microLearningCards.filter((c) => c.category === categoryFilter);

  const selected = microLearningCards.find((c) => c.id === selectedId) ?? microLearningCards[0];

  useEffect(() => {
    const focusedCard = microLearningCards.find((card) => card.id === focusCardId);
    if (!focusedCard) return;
    setSelectedId(focusedCard.id);
    setCategoryFilter('All');
    window.setTimeout(() => {
      document.getElementById('micro-learning-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [focusCardId]);

  const handleSelect = (card: MicroLearningCard) => {
    setSelectedId(card.id);
  };

  const scenarioTitlesFor = (ids: string[]) =>
    ids.map((id) => mspScenarios.find((s) => s.id === id)?.title ?? id);

  const skillTitlesFor = (ids: string[]) =>
    ids.map((id) => mspSkills.find((s) => s.id === id)?.title ?? id);

  return (
    <div>
      <section className="card">
        <h1>Micro-Learning</h1>
        <p>
          Short concept cards built around real MSP situations. Each card takes under five minutes and links to
          the scenarios and skills where that knowledge gets applied.
        </p>
        <div className="metric-row">
          <span className="status-chip info">{viewed.size} of {microLearningCards.length} reviewed</span>
        </div>
      </section>

      <section className="card">
        <div className="ml-filter-bar">
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={categoryFilter === cat ? 'ml-filter-btn active' : 'ml-filter-btn'}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ml-layout">
          <aside>
            <div className="ml-card-list">
              {filtered.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={card.id === selectedId ? 'ml-card-item active' : 'ml-card-item'}
                  onClick={() => handleSelect(card)}
                >
                  <strong>{card.topic}</strong>
                  <span className="ml-card-meta">{card.category}</span>
                  {viewed.has(card.id) && (
                    <span className="ml-viewed-badge">reviewed</span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {selected && (
            <div className="ml-detail" id="micro-learning-detail">
              <div>
                <div className="metric-row">
                  <span className="status-chip info">{selected.category}</span>
                  {viewed.has(selected.id) && (
                    <span className="status-chip success">reviewed</span>
                  )}
                </div>
                <h2>{selected.topic}</h2>
              </div>

              <div className="ml-field">
                <div className="ml-field-label">Concept</div>
                <p>{selected.concept}</p>
              </div>

              <div className="ml-field">
                <div className="ml-field-label">Why it matters</div>
                <p>{selected.whyItMatters}</p>
              </div>

              <div className="ml-field">
                <div className="ml-field-label">Common mistake</div>
                <p>{selected.commonMistake}</p>
              </div>

              <div className="ml-field">
                <div className="ml-field-label">Example</div>
                <p>{selected.example}</p>
              </div>

              <div className="ml-field">
                <div className="ml-field-label">Practice task</div>
                <p>{selected.practiceTask}</p>
              </div>

              {(selected.linkedScenarioIds.length > 0 || selected.linkedSkillIds.length > 0) && (
                <div className="ml-field">
                  <div className="ml-field-label">Related training</div>
                  {selected.linkedScenarioIds.length > 0 && (
                    <div>
                      <p className="ml-linked-heading">Scenarios</p>
                      <div className="ml-linked-row">
                        {scenarioTitlesFor(selected.linkedScenarioIds).map((title) => (
                          <span key={title} className="ml-tag ml-tag-scenario">{title}</span>
                        ))}
                        {onNavigate && (
                          <button
                            type="button"
                            className="ml-goto-btn"
                            onClick={() => onNavigate('mspScenarios', selected.linkedScenarioIds[0])}
                          >
                            Open Scenarios →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {selected.linkedSkillIds.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <p className="ml-linked-heading">Skills</p>
                      <div className="ml-linked-row">
                        {skillTitlesFor(selected.linkedSkillIds).map((title) => (
                          <span key={title} className="ml-tag ml-tag-skill">{title}</span>
                        ))}
                        {onNavigate && (
                          <button
                            type="button"
                            className="ml-goto-btn"
                            onClick={() => onNavigate('mspSkills')}
                          >
                            Open Skills →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!viewed.has(selected.id) && (
                <button
                  type="button"
                  onClick={() => markMicroCardViewed(selected.id)}
                >
                  Mark as reviewed
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MicroLearning;
