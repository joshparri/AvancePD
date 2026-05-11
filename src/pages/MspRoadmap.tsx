const roadmapStages = [
  {
    id: 'foundations',
    title: '1. Foundations & mindset',
    focus: 'Build safe thinking habits for client care and scope awareness.',
    targetSkills: ['service-minded', 'plain-english', 'ticket-triage'],
    practiceTasks: ['Review ticket summaries each day', 'Write one client update in plain language', 'Check tickets for scope and urgency'],
    readinessIndicators: ['Can separate technical detail from client language', 'Knows when a ticket is ready to escalate', 'Writes clear issue descriptions consistently']
  },
  {
    id: 'diagnosis',
    title: '2. Diagnosis & triage',
    focus: 'Use structured questions and evidence before taking action.',
    targetSkills: ['diagnostic-questions', 'incident-thinking', 'risk-awareness'],
    practiceTasks: ['Ask targeted follow-up questions', 'Verify first vs second line impact', 'Document evidence on the ticket'],
    readinessIndicators: ['Can identify missing facts quickly', 'Avoids guessing when information is incomplete', 'Chooses a safe next step or escalation path']
  },
  {
    id: 'communication',
    title: '3. Communication & updates',
    focus: 'Deliver timely, calm, and professional status updates.',
    targetSkills: ['client-updates', 'setting-expectations', 'deescalation'],
    practiceTasks: ['Write an update after every customer contact', 'Set a clear next update time', 'Use a courteous opening and closing'],
    readinessIndicators: ['Users feel informed', 'Updates are concise and specific', 'Escalations are documented with rationale']
  },
  {
    id: 'escalation',
    title: '4. Escalation & collaboration',
    focus: 'Know when to involve specialists and explain why.',
    targetSkills: ['escalation-basics', 'handover-notes', 'incidents'],
    practiceTasks: ['Review escalation criteria', 'Write handover notes that include context', 'Confirm ownership before closing tickets'],
    readinessIndicators: ['Can identify escalation-worthy risk', 'Escalation notes are clear and complete', 'Follow-up stays visible to the client']
  },
  {
    id: 'security',
    title: '5. Security & risk awareness',
    focus: 'Protect users by making safe technical decisions first.',
    targetSkills: ['phishing-analysis', 'credential-protection', 'compliance'],
    practiceTasks: ['Treat suspicious emails as real until proven safe', 'Avoid unsafe workarounds', 'Document security findings clearly'],
    readinessIndicators: ['Can explain the risk of unsafe fixes', 'Chooses approved alternatives', 'Keeps sensitive actions visible and reversible']
  },
  {
    id: 'service',
    title: '6. Service polish',
    focus: 'Use structure and clarity to improve every interaction.',
    targetSkills: ['client-facing', 'ticket-summaries', 'plain-english'],
    practiceTasks: ['Summarize outcomes in three sentences', 'Include next steps before closing', 'Mention what was verified or tested'],
    readinessIndicators: ['Ticket notes are easy to scan', 'Clients can read the next action clearly', 'Solutions are not buried in jargon']
  },
  {
    id: 'learning',
    title: '7. Reflection & learning',
    focus: 'Capture lessons from incidents and refine your workflow.',
    targetSkills: ['continuous-improvement', 'post-incident-review', 'knowledge-sharing'],
    practiceTasks: ['Note what worked and what did not', 'Share one improvement idea with the team', 'Update a knowledge entry after a tricky ticket'],
    readinessIndicators: ['Can explain how to prevent the same issue', 'Uses knowledge articles to save time', 'Shows progress across tickets']
  },
  {
    id: 'confidence',
    title: '8. Confidence with customer impact',
    focus: 'Apply safe judgment in real situations and keep users calm.',
    targetSkills: ['risk-awareness', 'service-minded', 'business-impact-thinking'],
    practiceTasks: ['Choose the safest first action for each ticket', 'Explain why the chosen path is best', 'Keep users informed while work is ongoing'],
    readinessIndicators: ['Decisions balance speed with safety', 'Clients feel informed and supported', 'Issues are resolved without unnecessary risk']
  }
];

function MspRoadmap() {
  return (
    <div className="page-card roadmap-page">
      <header>
        <h2>MSP Development Roadmap</h2>
        <p>
          A practical progression for MSP professionals. Use these stages to build safer judgement, stronger communication, and better customer outcomes.
        </p>
      </header>

      <div className="roadmap-grid">
        {roadmapStages.map((stage) => (
          <article key={stage.id} className="roadmap-stage-card">
            <h3>{stage.title}</h3>
            <p className="roadmap-focus">{stage.focus}</p>
            <div className="roadmap-section">
              <strong>Focus skills</strong>
              <ul>
                {stage.targetSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
            <div className="roadmap-section">
              <strong>Practice tasks</strong>
              <ul>
                {stage.practiceTasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </div>
            <div className="roadmap-section">
              <strong>Readiness signs</strong>
              <ul>
                {stage.readinessIndicators.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default MspRoadmap;
