import { useMemo } from 'react';
import { skillTracks } from '../data/skillTracks';
import { mspSkills } from '../data/mspSkills';
import { mspScenarios } from '../data/mspScenarios';
import { microLearningCards } from '../data/microLearning';
import { getEffectiveSkillReadiness } from '../utils/nextBestAction';
import type { AvanceProgress } from '../utils/progressStorage';

type SkillTracksProps = {
  progress: AvanceProgress;
  onNavigate: (page: string) => void;
};

function SkillTracks({ progress, onNavigate }: SkillTracksProps) {
  const trackSummaries = useMemo(() => skillTracks.map((track) => {
    const skills = mspSkills.filter((skill) => track.categories.includes(skill.category));
    const readySkills = skills.filter((skill) => {
      const readiness = getEffectiveSkillReadiness(progress, skill.id);
      return readiness === 'practised' || readiness === 'work-ready' || readiness === 'evidence-proven';
    });
    const scenarios = mspScenarios.filter((scenario) => track.categories.includes(scenario.category));
    const cards = microLearningCards.filter((card) => card.linkedSkillIds.some((skillId) => skills.some((skill) => skill.id === skillId)));
    const nextSkill = skills.find((skill) => !readySkills.includes(skill));
    const progressPercent = skills.length ? Math.round((readySkills.length / skills.length) * 100) : 0;

    return {
      track,
      skills,
      readySkills,
      scenarios,
      cards,
      nextSkill,
      progressPercent
    };
  }), [progress]);

  return (
    <div>
      <section className="card">
        <h1>Skill Quest Tracks</h1>
        <p>Optional MSP growth paths that connect skills, scenarios, micro-learning, and evidence.</p>
        <div className="privacy-note">Tracks use generic training data only. Keep client and ticket details out of notes.</div>
      </section>

      <section className="card">
        <h2>Tracks</h2>
        <div className="health-plan-grid">
          {trackSummaries.map(({ track, skills, readySkills, scenarios, cards, nextSkill, progressPercent }) => (
            <article key={track.id} className="mini-card">
              <div className="skill-card-header">
                <h3>{track.title}</h3>
                <span className="status-chip info">{progressPercent}%</span>
              </div>
              <p>{track.description}</p>
              <progress value={progressPercent} max={100} />
              <p><strong>{readySkills.length}</strong> of {skills.length} skills practised or stronger.</p>
              <p>{scenarios.length} scenarios and {cards.length} micro-learning cards linked.</p>
              <p><strong>Next tiny practice:</strong> {nextSkill ? nextSkill.suggestedPractice[0] : 'Review evidence and keep skills warm.'}</p>
              <p><strong>Routine:</strong> {track.suggestedRoutine}</p>
              <div className="status-button-row">
                <button type="button" onClick={() => onNavigate('mspSkills')}>Open skills</button>
                <button type="button" className="small-action" onClick={() => onNavigate('mspScenarios')}>Practise scenario</button>
                <button type="button" className="small-action" onClick={() => onNavigate('microLearning')}>Read card</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SkillTracks;
