const appLinks = [
  { label: 'Avance PD', href: 'https://avance-pd.vercel.app/' },
  { label: 'Avance Professional Development', href: 'https://avance-professional-development.vercel.app/' },
  { label: 'Josh Hub dashboard', href: 'https://josh-hub-two.vercel.app/dashboard' },
  { label: 'Waypoint', href: 'https://waypoint-azure.vercel.app/' },
  { label: 'DCSPD App', href: 'https://dcspd.vercel.app/' },
  { label: 'DCS Professional Development', href: 'https://dcs-professional-development.vercel.app/' }
];

export default function AppLinks() {
  return (
    <div>
      <section className="card">
        <h1>App Links</h1>
        <p>Quick access to the main apps and tools you use most often.</p>
      </section>

      <section className="card">
        <div className="card-grid">
          {appLinks.map((link) => (
            <article key={link.href} className="mini-card">
              <h3>{link.label}</h3>
              <p>
                <a href={link.href} target="_blank" rel="noreferrer noopener">
                  Open link
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
