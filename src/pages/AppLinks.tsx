const appLinks = [
  {
    category: 'Josh Hub',
    items: [
      { label: 'Josh Hub dashboard', href: 'https://josh-hub-two.vercel.app/dashboard' }
    ]
  },
  {
    category: 'Realms Atlas',
    items: [
      { label: 'v1 - readable map patch', href: 'https://realms-atlas-readable-map-patch.vercel.app/' },
      { label: 'v1 - GitHub Pages', href: 'https://joshuaparris-max.github.io/realms-atlas/' },
      { label: 'v2 - GitHub Pages', href: 'https://joshualparris.github.io/realms-atlas/' }
    ]
  },
  {
    category: 'Shared docs',
    items: [
      { label: 'App Links Doc', href: 'https://docs.google.com/document/d/1rYeeXqK6QBZx1upwHdtzzoXSwxNLHz7_omcooqhUKIM/edit?tab=t.0' }
    ]
  },
  {
    category: 'JoshDashboard',
    items: [
      { label: 'v1 - Streamlit', href: 'https://joshdashboard2-3d63fzekflg2wlakjmrakz.streamlit.app/' },
      { label: 'v2 - Vercel', href: 'https://josh-dashboard-black.vercel.app/app/dashboard.html' }
    ]
  },
  {
    category: 'Faith & reading',
    items: [
      { label: 'FaithHub', href: 'https://joshualparris.github.io/FaithHub/' },
      { label: 'EbookReader Online', href: 'https://josh-books-online.vercel.app/library' }
    ]
  },
  {
    category: 'Research',
    items: [
      { label: 'Research Atlas', href: 'https://research-atlas-phi.vercel.app/' },
      { label: 'Research Gems', href: 'https://joshualparris.github.io/ResearchGems/' }
    ]
  },
  {
    category: 'Tools & work apps',
    items: [
      { label: 'Waypoint', href: 'https://waypoint-azure.vercel.app/' },
      { label: 'Upskill App', href: 'https://upskillapp.vercel.app/' },
      { label: 'WorkApp', href: 'https://work-app-pearl.vercel.app/' },
      { label: 'DCS census Avance transition', href: 'https://work-planner-nine.vercel.app/' },
      { label: 'Interviewpre', href: 'https://interview-ten-wine.vercel.app/' },
      { label: 'Interviewpre v2', href: 'https://interview2-six.vercel.app/' },
      { label: 'MoneyApp', href: 'https://moneyapp1.vercel.app/' }
    ]
  },
  {
    category: 'Dubbo / DCS apps',
    items: [
      { label: 'DCSPD App', href: 'https://dcspd.vercel.app/' },
      { label: 'DCS Professional Development', href: 'https://dcs-professional-development.vercel.app/' },
      { label: 'DCS Companion', href: 'https://joshuaparris-max.github.io/DCSCompanion' },
      { label: 'DCS Prep App', href: 'https://dcs-prep.vercel.app/' },
      { label: 'Avance PD', href: 'https://avance-professional-development.vercel.app/' },
      { label: 'Avance PD alt', href: 'https://avance-pd.vercel.app/' },
      { label: 'ParrisDubboMover', href: 'https://parris-dubbo-mover-app-main-client.vercel.app/' }
    ]
  },
  {
    category: 'AI & games',
    items: [
      { label: 'AI Dungeon Master', href: 'https://ai-dungeon-master-azure.vercel.app/' },
      { label: 'Campaign Copilot', href: 'https://joshuaparrisdadlan-stack.github.io/campaign-copilot/' },
      { label: 'Field Notes', href: 'https://field-notes-two.vercel.app/' }
    ]
  },
  {
    category: 'Sylvie & ideas',
    items: [
      { label: 'Sylvie Sleepytime', href: 'https://joshualparris.github.io/Sleepy/' },
      { label: 'Sylvie phonics app', href: 'https://joshualparris.github.io/SylviePhonetics/' },
      { label: 'SylvieApp', href: 'https://sylvie-app-five.vercel.app/' },
      { label: 'Ideas', href: 'https://sylvie-elias-ideas.vercel.app/' },
      { label: 'Ideas v2', href: 'https://ideas2-gold.vercel.app/' },
      { label: 'EliasApp', href: 'https://elias-app2.vercel.app/' }
    ]
  },
  {
    category: 'App Factory',
    items: [
      { label: 'App Factory', href: 'https://appfactory-inky.vercel.app/' },
      { label: 'App Factory gamma', href: 'https://app-factory-gamma.vercel.app/' },
      { label: 'App Factory project', href: 'https://app-factory-77522izch-joshualparris-projects.vercel.app' },
      { label: 'App Factory GitHub Pages', href: 'https://joshuaparris-max.github.io/AppFactory/' },
      { label: '3 Layers DND - Alfie', href: 'https://3layers-puce.vercel.app/' }
    ]
  },
  {
    category: 'Whispering Wilds & related',
    items: [
      { label: 'Whispering Wilds (GitHub Pages)', href: 'https://joshuaparris-max.github.io/WhirringWilderness/' },
      { label: 'Whispering Wilds (dadlan)', href: 'https://joshuaparrisdadlan-stack.github.io/whispering-wilds/' },
      { label: 'Whispering Wilds (itch.io)', href: 'https://joshualparris.itch.io/whisperingwilds' },
      { label: 'King Killer Chronicle Adventure (GitHub Pages)', href: 'https://joshualparris.github.io/kkc-adventure/' },
      { label: 'King Killer Chronicle Adventure (Railway)', href: 'https://rothfuss-kkc-adventure-production.up.railway.app/' }
    ]
  },
  {
    category: 'PowerApp',
    items: [
      { label: 'PowerApp GitHub', href: 'https://github.com/joshuaparris-max/PowerApp' },
      { label: 'PowerApp Vercel', href: 'https://power-app-delta.vercel.app/' },
      { label: 'PowerApp GitHub Pages', href: 'https://joshuaparris-max.github.io/PowerApp/' },
      { label: 'PartyAI Dungeon Master', href: 'https://party-ai-mu.vercel.app/play' }
    ]
  },
  {
    category: 'RPG worlds & maps',
    items: [
      { label: 'Rothfuss - University Maps', href: 'https://joshualparris.github.io/RothfussMaps/university-atlas/' },
      { label: 'Aetheria', href: 'https://skill-deploy-fs1ircxjkn.vercel.app/' },
      { label: 'Neverwinter RPG', href: 'https://skill-deploy-dwxq7kw5pa.vercel.app/' },
      { label: 'Neverwinter RPG alternate', href: 'https://skill-deploy-wbzruert4j-codex-agent-deploys.vercel.app' },
      { label: 'Forbidden Lands Lite', href: 'https://skill-deploy-7tfaq44eli-codex-agent-deploys.vercel.app' },
      { label: 'Serenity - Firefly RPG', href: 'http://skill-deploy-ubokv1ax71.vercel.app/' }
    ]
  },
  {
    category: 'Chess & roguelike',
    items: [
      { label: 'Chess (joshuaparris-max)', href: 'https://chess-kappa-five.vercel.app/' },
      { label: 'Chess (dadlan)', href: 'https://chess-rho-gilt.vercel.app/' },
      { label: 'Chess GitHub', href: 'https://github.com/joshuaparris-max/Chess' },
      { label: 'Mystery Depths', href: 'https://joshualparris.itch.io/mysterydepths' },
      { label: 'Mystery Depths GitHub Pages', href: 'https://joshuaparrisdadlan-stack.github.io/MysteriousDepths/' },
      { label: 'Grey Realms', href: 'https://a7d7c8d4-f588-4e1a-a1eb-23f46fa50d0b-00-2qe90krr96xo5.janeway.replit.dev/' },
      { label: 'Grey March', href: 'https://joshualparris.github.io/Marsh/' },
      { label: 'Ashfaller', href: 'https://joshualparris.github.io/ashfaller/' },
      { label: 'AshFallen', href: 'https://joshualparris.github.io/AshFallen/' },
      { label: 'StarHaven', href: 'https://skill-deploy-kkckqq5c2j.vercel.app/' }
    ]
  },
  {
    category: 'Simple RPG / office games',
    items: [
      { label: 'Simple RPG itch.io', href: 'https://joshualparris.itch.io/simplerpg' },
      { label: 'Let’s Play DnD', href: 'https://joshuaparrisdadlan-stack.github.io/LetsPlayDnd/' },
      { label: 'Infinite Office itch.io', href: 'https://joshualparris.itch.io/infiniteoffice' },
      { label: 'OrgScape', href: 'https://joshuaparrisdadlan-stack.github.io/OrgScape/' },
      { label: 'Null HTML game', href: 'https://joshualparris.itch.io/null-html-game' },
      { label: 'Null GitHub Pages', href: 'https://joshuaparrisdadlan-stack.github.io/Null/' }
    ]
  },
  {
    category: 'Chronicles',
    items: [
      { label: 'Chronicles of Sword Coast', href: 'https://htmlpreview.github.io/?https://raw.githubusercontent.com/joshualparris/JoshHub/3de1a67/public/games/dndgame/index.html' },
      { label: 'CANONRPG API', href: 'https://canon-rpg-api-server.vercel.app/' }
    ]
  },
  {
    category: 'Wilds & Delve',
    items: [
      { label: 'Wilds - Sail West', href: 'https://htmlpreview.github.io/?https://raw.githubusercontent.com/joshualparris/JoshHub/41dfcef/public/games/wilds-sail-west/index.html' },
      { label: 'Wilds Main', href: 'https://htmlpreview.github.io/?https://raw.githubusercontent.com/joshualparris/JoshHub/d7521ab/public/games/wilds-main/index.html' },
      { label: 'Delve', href: 'https://joshualparris.github.io/delve/' },
      { label: 'Breach Command', href: 'https://joshuaparris.github.io/breach-command/' },
      { label: 'Echo Vault', href: 'https://joshuaparris.github.io/Echo/' }
    ]
  },
  {
    category: 'Vercel app deploys',
    items: [
      { label: 'Takeaway tonight', href: 'https://skill-deploy-gzaqtty7hb-codex-agent-deploys.vercel.app' },
      { label: 'JoshSim - Life Simulator', href: 'https://skill-deploy-wn74y0trpc-codex-agent-deploys.vercel.app' },
      { label: 'Parris Budget App', href: 'https://parris-budget-app.vercel.app/' },
      { label: 'JoshHealthHub', href: 'https://skill-deploy-ibq7zs9hn6-codex-agent-deploys.vercel.app' },
      { label: 'DrunkJoshGuardian', href: 'https://skill-deploy-oww33mfjrh-codex-agent-deploys.vercel.app' },
      { label: 'Josh Hub apps', href: 'https://josh-hub-96no.vercel.app/apps' },
      { label: 'Hug Coach', href: 'https://hug-coach.vercel.app/' },
      { label: 'ClearCore', href: 'https://clearcore.vercel.app/' },
      { label: 'LifeHubDashboard', href: 'https://lifehubdashboard.vercel.app/' },
      { label: 'Parris Piano', href: 'https://parris-piano.vercel.app/' },
      { label: 'Parris Tech App', href: 'https://parris-tech-app.vercel.app/' },
      { label: 'Parris Tech Services App', href: 'https://parris-tech-services-app.vercel.app/' }
    ]
  },
  {
    category: 'Preview pages & games',
    items: [
      { label: 'Boundary Road Panos', href: 'https://htmlpreview.github.io/?https://raw.githubusercontent.com/joshualparris/JoshHub/3de1a67/public/games/boundary-road/index.html' },
      { label: 'Neverwinter tales', href: 'https://htmlpreview.github.io/?https://raw.githubusercontent.com/joshualparris/JoshHub/8d02ac4/public/games/neverwinter-tales/index.html' },
      { label: 'Elodin Lore', href: 'https://joshualparris.github.io/ElodinDeepLore/' },
      { label: 'Elodin Dossier', href: 'https://joshualparris.github.io/ElodinDeepLore/ElodinDeepLore.html' },
      { label: 'Elodin Lore alternate', href: 'https://joshualparris.github.io/elodin-deep-lore/' },
      { label: 'Elodin Atlas', href: 'https://joshualparris.github.io/elodin-deep-lore/atlas.html' },
      { label: 'Elodin Compendium', href: 'https://joshualparris.github.io/elodin-deep-lore/ElodinDeepLore.html' }
    ]
  },
  {
    category: 'Misc and quick access',
    items: [
      { label: 'Josh Hub home', href: 'https://josh-hub-96no.vercel.app/' },
      { label: 'Wastes Courier Roguelike', href: 'https://joshualparris.github.io/wastes-courier-roguelike/' },
      { label: 'Health Lens Rust', href: 'https://health-lens-rust.vercel.app/' },
      { label: 'HealthLens GitHub', href: 'https://github.com/joshualparris/HealthLens' },
      { label: 'JoshHealth Cyan', href: 'https://josh-health-cyan.vercel.app/' },
      { label: 'JoshHealth GitHub', href: 'https://github.com/joshuaparris-max/JoshHealth' }
    ]
  }
];

function LinkCard({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="block rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm font-medium text-slate-900 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-blue-950">
      {label}
    </a>
  );
}

export default function AppLinks() {
  return (
    <div>
      <section className="card">
        <h1>App Links</h1>
        <p>All of your linked apps, dashboards, games, and quick references in one place.</p>
      </section>

      <div className="space-y-10">
        {appLinks.map((section) => (
          <section key={section.category} className="card">
            <div className="mb-4">
              <h2>{section.category}</h2>
            </div>
            <div className="card-grid">
              {section.items.map((item) => (
                <article key={`${section.category}-${item.href}`} className="mini-card">
                  <h3>{item.label}</h3>
                  <p>
                    <a href={item.href} target="_blank" rel="noreferrer noopener">
                      Open link
                    </a>
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
