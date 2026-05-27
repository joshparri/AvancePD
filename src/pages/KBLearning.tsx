import { kbHints } from '../data/kbHints';

function KBLearning() {
  return (
    <div>
      <section className="card">
        <h1>KB Learning Machine</h1>
        <p>
          Use this page as a safe learning cockpit for connecting local work to KB topics, skill practice,
          and evidence capture.
        </p>
      </section>

      <section className="card">
        <h2>How to use this page</h2>
        <ul>
          <li>Capture work in the Quick Capture or Work Logs page.</li>
          <li>Choose a KB topic that matches the problem type.</li>
          <li>Use App 2 to practise related skills, scenarios, and ticket notes.</li>
          <li>Save any evidence-worthy learning as an Evidence Pack entry.</li>
        </ul>
      </section>

      <section className="card">
        <h2>Suggested KB topic categories</h2>
        <div className="kb-grid">
          {kbHints.map((hint) => (
            <div key={hint.id} className="kb-card">
              <strong>{hint.title}</strong>
              <p>{hint.category}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default KBLearning;
