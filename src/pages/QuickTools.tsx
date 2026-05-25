import { useState } from 'react';

const phraseBank = [
  'Thanks for the detail. I will check the safest next step and keep you updated.',
  'I am going to confirm the scope first so we do not make a risky change too early.',
  'I have enough detail to escalate this cleanly with what was checked and what remains unknown.',
  'I will document the next action so this can be picked up smoothly if needed.'
];

function QuickTools() {
  const [symptom, setSymptom] = useState('');
  const [checks, setChecks] = useState('');
  const [risk, setRisk] = useState('');
  const [copied, setCopied] = useState('');

  const escalationNote = [
    `Symptom: ${symptom || '[generic symptom]'}`,
    `Checks completed: ${checks || '[safe first checks]'}`,
    `Risk or blocker: ${risk || '[why escalation is appropriate]'}`,
    'Request: Please review next diagnostic or remediation step.'
  ].join('\n');

  const safeWordingChecklist = [
    'No client names',
    'No passwords, tokens, or recovery codes',
    'No IP addresses or hostnames',
    'No copied ticket text',
    'No screenshots or private medical details'
  ];

  const copyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(`${label} copied.`);
    } catch {
      setCopied(`Could not copy ${label}.`);
    }
  };

  return (
    <div>
      <section className="card">
        <h1>Quick Tools</h1>
        <p>Small privacy-safe helpers for communication, escalation, calls, ticket notes, and decompression.</p>
      </section>

      <section className="card">
        <h2>Communication phrase bank</h2>
        <div className="health-plan-grid">
          {phraseBank.map((phrase) => (
            <article key={phrase} className="mini-card">
              <p>{phrase}</p>
              <button type="button" className="small-action" onClick={() => copyText('Phrase', phrase)}>Copy phrase</button>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Escalation note builder</h2>
        <div className="quick-capture-form">
          <label>Symptom <input value={symptom} onChange={(event) => setSymptom(event.target.value)} placeholder="Generic symptom only" /></label>
          <label>Checks completed <textarea value={checks} onChange={(event) => setChecks(event.target.value)} placeholder="Safe checks already completed" /></label>
          <label>Risk or blocker <textarea value={risk} onChange={(event) => setRisk(event.target.value)} placeholder="Why escalation is appropriate" /></label>
        </div>
        <pre className="template-box">{escalationNote}</pre>
        <button type="button" onClick={() => copyText('Escalation note', escalationNote)}>Copy escalation note</button>
      </section>

      <section className="card">
        <h2>Ticket note quality checklist</h2>
        <ul>
          <li>Issue and impact are clear.</li>
          <li>Checks performed are specific.</li>
          <li>Action taken is stated.</li>
          <li>Result is recorded.</li>
          <li>Next step or escalation is clear.</li>
        </ul>
      </section>

      <section className="card">
        <h2>Phone call prep</h2>
        <ul>
          <li>Confirm the user and broad issue category.</li>
          <li>Ask permission before remote control.</li>
          <li>Start with scope, impact, and recent change.</li>
          <li>Keep a short note of checks and next action.</li>
        </ul>
      </section>

      <section className="card">
        <h2>Post-call decompression</h2>
        <p>Relax your jaw and shoulders. Breathe slowly. Look away from the screen. Name the next tiny action.</p>
      </section>

      <section className="card">
        <h2>Safe wording checker</h2>
        <ul>
          {safeWordingChecklist.map((item) => <li key={item}>{item}</li>)}
        </ul>
        {copied && <p className="health-muted">{copied}</p>}
      </section>
    </div>
  );
}

export default QuickTools;
