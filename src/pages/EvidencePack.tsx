import { useEffect, useMemo, useState } from 'react';
import { mspSkills } from '../data/mspSkills';
import { mspScenarios } from '../data/mspScenarios';
import { getEffectiveSkillReadiness, getRecommendedStudyAreas, getWeakSkills } from '../utils/nextBestAction';
import type { AvanceProgress } from '../utils/progressStorage';

type EvidencePackProps = {
  progress: AvanceProgress;
};

function EvidencePack({ progress }: EvidencePackProps) {
  const [copyStatus, setCopyStatus] = useState('');
  const [healthStatus, setHealthStatus] = useState('Checking AI coach...');
  const [healthModel, setHealthModel] = useState('');
  const summary = useMemo(() => buildEvidenceSummary(progress), [progress]);
  const markdown = useMemo(() => buildMarkdownSummary(summary), [summary]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        if (response.ok && data.ok) {
          setHealthStatus(data.hasGroqKey ? 'AI Coach: Online' : 'AI Coach: Not configured');
          setHealthModel(data.model || 'unknown model');
        } else {
          setHealthStatus('AI Coach: Error');
          setHealthModel(data?.message || 'unknown');
        }
      } catch (err) {
        setHealthStatus('AI Coach: Error');
        setHealthModel('Unable to reach health endpoint.');
      }
    };

    checkHealth();
  }, []);

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus('Copied Markdown summary.');
    } catch {
      setCopyStatus('Could not copy automatically. Select the summary text manually.');
    }
  };

  return (
    <div>
      <section className="card">
        <h1>Evidence Pack</h1>
        <p>Manager-safe professional development evidence based on generic skills, scenarios, and practice activity.</p>
        <div className="privacy-note">Do not include client names, passwords, private notes, screenshots, or copied ticket text in evidence summaries.</div>
      </section>

      <section className="card">
        <h2>Progress summary</h2>
        <div className="card-grid">
          <Metric label="Skills practised" value={summary.skillsPractised.length} />
          <Metric label="Scenarios practised" value={summary.scenariosPractised.length} />
          <Metric label="Confident scenarios" value={summary.scenariosConfident.length} />
          <Metric label="Needs review" value={summary.scenariosNeedsReview.length} />
          <Metric label="Ticket note practices" value={progress.ticketNotePracticeCount} />
          <Metric label="Weak areas" value={summary.weakAreas.length} />
        </div>
      </section>

      <section className="card">
        <h2>AI health status</h2>
        <div className="health-status-card">
          <p>{healthStatus}</p>
          {healthModel && <p>Model: {healthModel}</p>}
        </div>
      </section>

      <section className="card">
        <h2>Recommended next study areas</h2>
        <ul>
          {summary.recommendedStudyAreas.map((area) => <li key={area}>{area}</li>)}
        </ul>
      </section>

      <section className="card">
        <h2>Practical outputs created</h2>
        <ul>
          {summary.practicalOutputs.map((output) => <li key={output}>{output}</li>)}
        </ul>
      </section>

      <section className="card">
        <div className="skill-card-header">
          <h2>Markdown summary</h2>
          <button type="button" onClick={copyMarkdown}>Copy Markdown Summary</button>
        </div>
        {copyStatus && <p>{copyStatus}</p>}
        <pre className="template-box">{markdown}</pre>
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

function buildEvidenceSummary(progress: AvanceProgress) {
  const skillsPractised = mspSkills.filter((skill) => {
    const readiness = getEffectiveSkillReadiness(progress, skill.id);
    return readiness === 'practised' || readiness === 'work-ready' || readiness === 'evidence-proven';
  });
  const scenariosPractised = mspScenarios.filter((scenario) => {
    const status = progress.scenarioProgress[scenario.id]?.status;
    return status === 'practised' || status === 'confident' || status === 'needs-review';
  });
  const scenariosConfident = mspScenarios.filter((scenario) => progress.scenarioProgress[scenario.id]?.status === 'confident');
  const scenariosNeedsReview = mspScenarios.filter((scenario) => progress.scenarioProgress[scenario.id]?.status === 'needs-review');
  const weakAreas = getWeakSkills(progress).slice(0, 8);
  const recommendedStudyAreas = getRecommendedStudyAreas(progress);
  const practicalOutputs = [
    progress.ticketNotePracticeCount > 0 ? `${progress.ticketNotePracticeCount} privacy-safe ticket note practice entries recorded` : 'Ticket note practice not yet recorded',
    scenariosPractised.length > 0 ? `${scenariosPractised.length} guided MSP scenarios reviewed` : 'Scenario practice not yet recorded',
    skillsPractised.length > 0 ? `${skillsPractised.length} skills moved to practised or stronger readiness` : 'Skill readiness updates not yet recorded'
  ];

  return {
    skillsPractised,
    scenariosPractised,
    scenariosConfident,
    scenariosNeedsReview,
    weakAreas,
    recommendedStudyAreas,
    practicalOutputs
  };
}

function buildMarkdownSummary(summary: ReturnType<typeof buildEvidenceSummary>) {
  return [
    '# MSP Professional Development Evidence Summary',
    '',
    'This summary records generic professional development activity only. It does not include client names, credentials, private notes, screenshots, or copied ticket text.',
    '',
    `- Skills practised: ${summary.skillsPractised.length}`,
    `- Scenarios practised: ${summary.scenariosPractised.length}`,
    `- Scenarios marked confident: ${summary.scenariosConfident.length}`,
    `- Scenarios needing review: ${summary.scenariosNeedsReview.length}`,
    '',
    '## Skills Practised',
    ...toList(summary.skillsPractised.map((skill) => `${skill.title} (${skill.category})`)),
    '',
    '## Scenarios Practised',
    ...toList(summary.scenariosPractised.map((scenario) => `${scenario.title} (${scenario.category})`)),
    '',
    '## Weak Areas',
    ...toList(summary.weakAreas.map((skill) => `${skill.title} (${skill.category})`)),
    '',
    '## Recommended Next Study Areas',
    ...toList(summary.recommendedStudyAreas),
    '',
    '## Practical Outputs',
    ...toList(summary.practicalOutputs)
  ].join('\n');
}

function toList(items: string[]) {
  return items.length ? items.map((item) => `- ${item}`) : ['- No evidence recorded yet'];
}

export default EvidencePack;
