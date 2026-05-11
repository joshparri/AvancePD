import { useMemo, useState } from 'react';
import { mspSkillCategories, mspSkills, type MspSkillLevel, type MspSkillReadiness } from '../data/mspSkills';
import type { AvanceProgress } from '../utils/progressStorage';
import { getEffectiveSkillReadiness } from '../utils/nextBestAction';

const levels: Array<'all' | MspSkillLevel> = ['all', 'beginner', 'intermediate', 'advanced'];
const readinessOptions: MspSkillReadiness[] = ['unseen', 'learning', 'practised', 'work-ready', 'evidence-proven'];

type MspSkillsProps = {
  progress: AvanceProgress;
  updateSkillReadiness: (skillId: string, readiness: MspSkillReadiness) => void;
};

function MspSkills({ progress, updateSkillReadiness }: MspSkillsProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState<'all' | MspSkillLevel>('all');

  const filteredSkills = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return mspSkills.filter((skill) => {
      const matchesSearch = !searchText || [skill.title, skill.category, skill.description].join(' ').toLowerCase().includes(searchText);
      const matchesCategory = category === 'all' || skill.category === category;
      const matchesLevel = level === 'all' || skill.level === level;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [category, level, search]);

  const nextPractice = useMemo(
    () => mspSkills.filter((skill) => {
      const readiness = getEffectiveSkillReadiness(progress, skill.id);
      return readiness === 'unseen' || readiness === 'learning';
    }).slice(0, 5),
    [progress]
  );

  const weakSkillCount = useMemo(
    () => mspSkills.filter((skill) => {
      const readiness = getEffectiveSkillReadiness(progress, skill.id);
      return readiness === 'unseen' || readiness === 'learning';
    }).length,
    [progress]
  );

  const groupedSkills = useMemo(() => {
    return filteredSkills.reduce<Record<string, typeof filteredSkills>>((groups, skill) => {
      groups[skill.category] = groups[skill.category] || [];
      groups[skill.category].push(skill);
      return groups;
    }, {});
  }, [filteredSkills]);

  return (
    <div>
      <section className="card">
        <h1>MSP Skills Matrix</h1>
        <p>Track practical service desk, cloud, networking, security, process, and communication skills.</p>
        <p className="page-help">Use search and filters to focus on the next skill you want to practise. Update readiness as you build confidence.</p>
        <div className="metric-row">
          <span className="status-chip info">{mspSkills.length} skills</span>
          <span className="status-chip warn">{weakSkillCount} weak or early-stage skills</span>
          <span className="status-chip success">{mspSkillCategories.length} categories</span>
        </div>
      </section>

      <section className="card">
        <h2>Find a skill</h2>
        <div className="filter-bar">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="DNS, Outlook, escalation..." />
          </label>
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {mspSkillCategories.map((skillCategory) => (
                <option key={skillCategory} value={skillCategory}>
                  {skillCategory}
                </option>
              ))}
            </select>
          </label>
          <label>
            Level
            <select value={level} onChange={(event) => setLevel(event.target.value as 'all' | MspSkillLevel)}>
              {levels.map((skillLevel) => (
                <option key={skillLevel} value={skillLevel}>
                  {skillLevel === 'all' ? 'All levels' : skillLevel}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h2>What to practise next</h2>
        <p>These skills are worth reviewing if you want to strengthen your practical MSP judgement.</p>
        <div className="card-grid">
          {nextPractice.length > 0 ? nextPractice.map((skill) => (
            <article key={skill.id} className="mini-card">
              <div className="skill-card-header">
                <h3>{skill.title}</h3>
                <span className="status-chip warn">{getEffectiveSkillReadiness(progress, skill.id)}</span>
              </div>
              <p>{skill.suggestedPractice[0]}</p>
            </article>
          )) : (
            <article className="mini-card">
              <p>All skills are at a later readiness stage. Keep practising or update your readiness as you learn.</p>
            </article>
          )}
        </div>
      </section>

      {filteredSkills.length === 0 ? (
        <section className="card">
          <h2>No matching skills</h2>
          <p>Try broadening your search or clearing the category and level filters.</p>
        </section>
      ) : Object.entries(groupedSkills).map(([groupName, skills]) => (
        <section key={groupName} className="card">
          <h2>{groupName}</h2>
          <div className="skill-grid">
            {skills.map((skill) => {
              const effectiveReadiness = getEffectiveSkillReadiness(progress, skill.id);
              const isWeak = effectiveReadiness === 'unseen' || effectiveReadiness === 'learning';
              return (
                <article key={skill.id} className="mini-card skill-card">
                  <div className="skill-card-header">
                    <h3>{skill.title}</h3>
                    <span className="status-chip info">{skill.level}</span>
                  </div>
                  <p>{skill.description}</p>
                  <div className="metric-row">
                    <span className="status-chip info">base: {skill.readiness}</span>
                    <span className={`status-chip ${isWeak ? 'warn' : 'success'}`}>mine: {effectiveReadiness}</span>
                    <span className="status-chip warn">{skill.relatedTools.slice(0, 2).join(', ')}</span>
                  </div>
                  <label className="inline-control">
                    Readiness
                    <select value={effectiveReadiness} onChange={(event) => updateSkillReadiness(skill.id, event.target.value as MspSkillReadiness)}>
                      {readinessOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <h4>Suggested practice</h4>
                  <ul>
                    {skill.suggestedPractice.slice(0, 2).map((practice) => (
                      <li key={practice}>{practice}</li>
                    ))}
                  </ul>
                  <h4>Evidence examples</h4>
                  <ul>
                    {skill.evidenceExamples.slice(0, 2).map((evidence) => (
                      <li key={evidence}>{evidence}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default MspSkills;
