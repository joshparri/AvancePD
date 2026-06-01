import { useEffect, useMemo, useState } from 'react';
import { mspSkills } from '../data/mspSkills';
import { mspScenarios } from '../data/mspScenarios';
import { getFieldOpsEvidenceSummary, loadFieldOpsState, type FieldOpsState } from '../utils/fieldOps';
import { getEffectiveSkillReadiness, getRecommendedStudyAreas, getWeakSkills } from '../utils/nextBestAction';
import type { AvanceProgress } from '../utils/progressStorage';

type EvidencePackProps = {
  progress: AvanceProgress;
};

function EvidencePack({ progress }: EvidencePackProps) {
  const [copyStatus, setCopyStatus] = useState('');
  const [healthStatus, setHealthStatus] = useState('Checking AI coach...');
  const [healthModel, setHealthModel] = useState('');
  const [emailStatus, setEmailStatus] = useState('Checking health reminders...');
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>({
    skills: true,
    scenarios: true,
    fieldOps: true,
    weakAreas: true,
    studyAreas: true,
    outputs: true,
    healthRoutine: true
  });
  const [fieldOpsState] = useState<FieldOpsState>(loadFieldOpsState);
  const fieldOpsEvidence = useMemo(() => getFieldOpsEvidenceSummary(fieldOpsState), [fieldOpsState]);
  const summary = useMemo(() => buildEvidenceSummary(progress, fieldOpsEvidence), [fieldOpsEvidence, progress]);
  const markdown = useMemo(() => buildMarkdownSummary(summary, selectedSections), [summary, selectedSections]);
  const plainText = useMemo(() => buildPlainTextSummary(summary, selectedSections), [summary, selectedSections]);
  const jsonSummary = useMemo(() => JSON.stringify({ generatedAt: new Date().toISOString(), summary, selectedSections }, null, 2), [summary, selectedSections]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        if (response.ok && data.ok) {
          setHealthStatus(data.hasGroqKey ? 'AI Coach: Online' : 'AI Coach: Not configured');
          setEmailStatus(data.hasHealthReminderEmail ? 'Health email: Configured' : 'Health email: Not configured');
          setHealthModel(data.model || 'unknown model');
        } else {
          setHealthStatus('AI Coach: Error');
          setEmailStatus('Health email: Unknown');
          setHealthModel(data?.message || 'unknown');
        }
      } catch (err) {
        setHealthStatus('AI Coach: Error');
        setEmailStatus('Health email: Unable to check');
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

  const copyPlainText = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopyStatus('Copied plain text summary.');
    } catch {
      setCopyStatus('Could not copy automatically. Select the summary text manually.');
    }
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonSummary);
      setCopyStatus('Copied JSON summary.');
    } catch {
      setCopyStatus('Could not copy automatically. Select the JSON manually.');
    }
  };

  const toggleSection = (section: string) => {
    setSelectedSections((current) => ({ ...current, [section]: !current[section] }));
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
          <Metric label="Field ops checklist items" value={summary.fieldOps.completedChecklistItems.length} />
          <Metric label="Weak areas" value={summary.weakAreas.length} />
        </div>
      </section>

      <section className="card">
        <h2>Deployment status</h2>
        <div className="health-status-card">
          <p>{healthStatus}</p>
          <p>{emailStatus}</p>
          {healthModel && <p>Model: {healthModel}</p>}
        </div>
      </section>

      <section className="card">
        <h2>Evidence Pack builder</h2>
        <p>Choose safe sections to include before copying. Keep private details out of exports.</p>
        <div className="checklist-grid">
          {[
            ['skills', 'Skills practised'],
            ['scenarios', 'Scenarios practised'],
            ['fieldOps', 'Field ops patterns'],
            ['weakAreas', 'Weak areas'],
            ['studyAreas', 'Recommended study areas'],
            ['outputs', 'Practical outputs'],
            ['healthRoutine', 'Sustainable work routine']
          ].map(([key, label]) => (
            <label key={key} className="checklist-item">
              <input type="checkbox" checked={selectedSections[key]} onChange={() => toggleSection(key)} />
              {label}
            </label>
          ))}
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
          <h2>Manager-safe export</h2>
          <div className="status-button-row">
            <button type="button" onClick={copyMarkdown}>Copy Markdown</button>
            <button type="button" className="small-action" onClick={copyPlainText}>Copy Plain Text</button>
            <button type="button" className="small-action" onClick={copyJson}>Copy JSON</button>
          </div>
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

function buildEvidenceSummary(progress: AvanceProgress, fieldOps: ReturnType<typeof getFieldOpsEvidenceSummary>) {
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
    skillsPractised.length > 0 ? `${skillsPractised.length} skills moved to practised or stronger readiness` : 'Skill readiness updates not yet recorded',
    ...fieldOps.practicalOutputs
  ];

  return {
    skillsPractised,
    scenariosPractised,
    scenariosConfident,
    scenariosNeedsReview,
    weakAreas,
    recommendedStudyAreas,
    practicalOutputs,
    fieldOps
  };
}

function buildMarkdownSummary(summary: ReturnType<typeof buildEvidenceSummary>, selectedSections: Record<string, boolean>) {
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
    ...optionalSection(selectedSections.skills, '## Skills Practised', summary.skillsPractised.map((skill) => `${skill.title} (${skill.category})`)),
    ...optionalSection(selectedSections.scenarios, '## Scenarios Practised', summary.scenariosPractised.map((scenario) => `${scenario.title} (${scenario.category})`)),
    ...optionalSection(selectedSections.fieldOps, '## Field Ops Patterns', [
      `${summary.fieldOps.completedPendingActions.length} pending action(s) completed`,
      `${summary.fieldOps.completedChecklistItems.length} field checklist item(s) completed`,
      `${summary.fieldOps.backlogItems.length} safe backlog idea(s) triaged`,
      ...summary.fieldOps.completedChecklistItems.map((item) => `${item.evidenceSkill} (${item.group})`)
    ]),
    ...optionalSection(selectedSections.weakAreas, '## Weak Areas', summary.weakAreas.map((skill) => `${skill.title} (${skill.category})`)),
    ...optionalSection(selectedSections.studyAreas, '## Recommended Next Study Areas', summary.recommendedStudyAreas),
    ...optionalSection(selectedSections.outputs, '## Practical Outputs', summary.practicalOutputs),
    ...optionalSection(selectedSections.healthRoutine, '## Sustainable Work Routine', [
      'Josh uses structured wellbeing routines to support sustainable MSP work, including planned breaks, hydration prompts, screen breaks, and end-of-day shutdown habits.'
    ])
  ].filter((line) => line !== null).join('\n');
}

function buildPlainTextSummary(summary: ReturnType<typeof buildEvidenceSummary>, selectedSections: Record<string, boolean>) {
  return buildMarkdownSummary(summary, selectedSections)
    .replace(/^# /gm, '')
    .replace(/^## /gm, '')
    .replace(/^- /gm, '- ');
}

function optionalSection(include: boolean, title: string, items: string[]) {
  return include ? ['', title, ...toList(items)] : [];
}

function toList(items: string[]) {
  return items.length ? items.map((item) => `- ${item}`) : ['- No evidence recorded yet'];
}

export default EvidencePack;
