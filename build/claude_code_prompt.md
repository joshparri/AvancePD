# Claude Code Prompt: Avance IT Work Preparation & Support App

## INITIAL BUILD PROMPT FOR CLAUDE CODE

---

### WHAT TO BUILD

Create a comprehensive, single-page web application designed to help a new part-time IT support team member prepare for and excel during work shifts at Avance Business Technology (a small managed IT services company in Dubbo, NSW).

**App Name:** "Avance Work Companion"  
**Primary User:** Part-time staff member, Mon/Wed 8:30 AM–5:00 PM shifts  
**Use Cases:** Pre-shift preparation (15–30 mins), at-work reference (quick lookups), end-of-shift learning logs (5–10 mins)

---

### CORE FEATURES (MVP)

You must include these 6 core features in the initial build. Design them as tabs/sections in a clean, professional interface.

#### 1. PRE-SHIFT CHECKLIST
A simple, checkbox-based morning prep routine:
- [ ] Review today's priorities (text area for manual entry or preset items)
- [ ] Check Datto RMM alerts (explanatory text: what this means)
- [ ] Know the team members on duty today (auto-populated list)
- [ ] Review my learning goal from last shift
- [ ] Read one reference article (links to internal knowledge base)
- Color-coded completion status (incomplete/complete)
- Motivational message on completion: "You're ready! Good luck today."

#### 2. COMPANY INTELLIGENCE HUB
A read-only reference library about Avance Business Technology:

**Section A: Quick Facts**
- Company name, trading name, ABN
- Location, office hours, phone/email
- Team size, revenue range, founding story
- Community focus / mission statement
- Key reality checks (what's marketing vs. what's real)

**Section B: Leadership Team**
A card layout with:
- Name, title, background, contact
- For each of: Andrew Johnston, James Newby, Samit Baral, Edwin Schmidt
- Add placeholder for "unknown roles" (to be filled in)

**Section C: Service Offerings**
Expandable cards (click to reveal details):
- Managed IT Services
- Cloud Migrations (Microsoft 365, Google Workspace)
- Network & Wireless Setup
- IP Phone Systems
- Cybersecurity (email filtering, MFA, hardening)
- Custom Software Development
- Community Partnerships
Each card: title, description (plain English), typical client use case, tools used

**Section D: Target Clients**
- Primary industries: Accounting, law, trades, schools, small businesses
- Geographic focus: Dubbo, Central West NSW, regional Australia
- Typical client size: 5–50 employees
- Common problems they face: legacy systems, staff IT illiteracy, security gaps

**Section E: Reality Check**
Honest assessment (flagged with ⚠️ icons):
- Very small team (you'll wear many hats)
- Limited portfolio (only ~3 known projects)
- Zero public customer reviews (unusual; worth noting)
- Privacy policy outdated (governance not a strength)
- How 24/7 support is actually delivered (unknown—flag for investigation)

#### 3. DAILY TASK MANAGER
A simple ticket/task tracker for your shift:

**Add New Task:**
- Task name (short description)
- Task type (dropdown): Ticket, Learning, Admin, Follow-up, Escalation
- Priority (Low, Medium, High)
- Client name (if applicable)
- Status (New, In Progress, Waiting for Client, Resolved)
- Notes (text area for commands, error messages, blockers)

**Task List Display:**
- Group by status (New | In Progress | Waiting | Resolved)
- Color coding: Red (high priority), Orange (medium), Green (low)
- Sort by priority or client
- Quick-edit inline (click to change status)
- Delete button

**End-of-Shift Logging:**
- "Daily Wrap-up" section
- How many tickets did you resolve? (number input)
- What was the hardest task today? (text area)
- What did you learn? (text area)
- One thing to practice next shift? (text area)
- Date/time auto-logged

**Persistence:** Store all tasks in browser's local storage (survives page reload)

#### 4. TOOL PRIMERS & HOW-TOS
Quick-start guides for key tools (accordion-style, expandable sections):

**Datto RMM** (Remote Monitoring and Management)
- What it is (short paragraph)
- Why we use it
- Key dashboard widgets explained (alerts, device health, patch status)
- How to interpret alert severity (green/yellow/red)
- How to run a simple script (step-by-step)
- Common alert types and what they mean
- Troubleshooting common issues
- Key terminology (agent, component monitor, escalation)

**RustDesk** (Remote Support Tool)
- What it is
- Why we use it (secure remote access)
- How to initiate a support session
- Security etiquette (asking permission, session logging)
- Troubleshooting connection failures
- When to use web remote vs. native client

**Microsoft 365** (Cloud productivity)
- Quick wins: reset password, create user, enable MFA
- Common issues and fixes
- Where to find help (support portal link)

**Google Workspace** (Cloud productivity)
- Quick wins: reset password, create user
- Common issues and fixes
- Where to find help

**Ubiquiti UniFi** (WiFi & networking)
- Dashboard overview
- How to check AP health
- Reset a WiFi password
- Troubleshoot no-WiFi issues

**Each section should include:**
- 1–2 screenshot placeholders (for you to add later)
- 3–5 bullet-point steps
- Common pitfalls
- Link to official docs

#### 5. GLOSSARY & PLAIN-ENGLISH DICTIONARY
A searchable glossary of IT terms and Avance-specific jargon:

**Format:** Searchable list (filter by text input)
- Term (e.g., "RMM")
- Definition (1–2 sentences, plain English)
- Example or context
- Related terms

**Sample entries (at minimum 30–40):**
- RMM, Agent, Alert, Ticket, Escalation
- EDR, MDR, MFA, VPN, Phishing
- Patch, Update, Vulnerability, Zero-day
- Cloud, SaaS, Azure, Microsoft 365
- Endpoint, Device, Server, Workstation
- Active Directory, DNS, IP, MAC address
- Firewall, Switch, Router, WiFi, Access Point
- Backup, Restore, Disaster Recovery, RTO, RPO
- Incident, Troubleshooting, Diagnostics
- PSA, Autotask, Kaseya
- And more as you add them

**Make it searchable:** User types "rmt" and sees "RMM" in results (fuzzy match)

#### 6. EMERGENCY REFERENCE & QUICK LOOKUP
Critical info you might need fast:

**Quick Contact Info:**
- Avance office phone: 1800 AVANCE / (02) 6837 1555
- Support email: support@avance.technology
- Andrew Johnston (MD) – context when to call
- James Newby (Head Tech) – when to escalate
- Out-of-hours procedure (if any)

**Common Error Codes & Fixes:**
- Windows Update failed (common causes + fixes)
- Network connectivity issues (troubleshooting tree)
- "Access Denied" errors (permissions checks)
- Datto RMM agent offline (reconnection steps)
- Printer not connecting (WiFi/network checks)

**Escalation Decision Tree:**
Interactive yes/no tree:
- Can I fix this in < 30 mins? → No → Escalate to James
- Is it a client data issue? → Yes → Escalate to James
- Does it involve security/malware? → Yes → Escalate immediately
- Is it just a password reset? → No → Try first, then escalate

**Common Support Scripts / Email Templates:**
- "Ticket received, we're investigating"
- "Issue resolved, confirming with client"
- "Need more information from client"
- "Escalated to senior tech, you'll hear from us by EOD"

---

### DESIGN & UX REQUIREMENTS

#### Visual Design
- **Color scheme:** Professional and calm (blues, grays, greens)
  - Primary: Deep blue (#2C3E50 or similar)
  - Accent: Orange/amber for alerts and actions (#E67E22)
  - Success: Green (#27AE60)
  - Warning: Red (#E74C3C)
- **Responsive layout:** Looks good on desktop (primary), tablet, mobile
- **Icons:** Use simple, clear icons (FontAwesome or similar) for navigation and sections
- **Font:** Clean sans-serif (System stack preferred for performance)

#### Navigation
- **Top nav bar:** App logo/title + current user + time of day
- **Side nav (collapsible on mobile):** 6 main tabs
  1. Pre-Shift Checklist
  2. Company Intel
  3. Task Manager
  4. Tool Primers
  5. Glossary
  6. Emergency Ref
- **Footer:** Last updated time, version, feedback link

#### Interaction Patterns
- **Expandable sections:** Click to reveal, chevron icon indicates state
- **Tabs:** Seamless switching between major sections
- **Modals:** Use for "add new task" and "daily wrap-up" forms
- **Inline editing:** Click status to change; auto-saves
- **Search:** Real-time filtering in glossary (no page refresh)
- **Keyboard shortcuts (optional):** Alt+T = Task Manager, Alt+G = Glossary, etc.

#### Accessibility
- WCAG 2.1 AA compliant (as much as feasible)
- Good color contrast (4.5:1 for text)
- Semantic HTML (proper headings, labels, ARIA where needed)
- Keyboard navigable
- Mobile-friendly touch targets (min 48px)

#### Mobile Optimization
- Collapsible side nav (hamburger menu)
- Task list on mobile: show status badges more prominently
- Form fields: full-width, touch-friendly
- Glossary: search-first experience on mobile

---

### DATA STRUCTURE & STORAGE

#### Local Storage Schema
```json
{
  "user": {
    "name": "Your Name (optional)",
    "joinDate": "2026-04-20",
    "shiftsLogged": 0
  },
  "tasks": [
    {
      "id": "unique-id",
      "name": "Reset user password",
      "type": "ticket",
      "priority": "high",
      "client": "ABC Accounting",
      "status": "in-progress",
      "notes": "User forgot pwd; using temp pwd reset in M365",
      "createdAt": "2026-04-20T08:45:00Z",
      "completedAt": null
    }
    // ... more tasks
  ],
  "shiftLogs": [
    {
      "date": "2026-04-20",
      "ticketsResolved": 5,
      "hardestTask": "Network switch config for new office",
      "learned": "Ubiquiti PoE calculations; need to review docs",
      "practiceGoal": "RMM scripting basics"
    }
    // ... more shift logs
  ],
  "glossaryCustom": [
    {
      "term": "PoE",
      "definition": "Power over Ethernet—network cables that deliver both data and power",
      "context": "Used for WiFi APs and IP phones",
      "source": "learned-on-shift"
    }
    // ... custom entries user adds
  ]
}
```

#### Defaults & Preloaded Data
On first load, populate:
- **Pre-shift checklist:** Standard items (can be edited)
- **Company Intel:** All sections pre-filled with content from vision doc
- **Tool Primers:** All 6 tools with template content
- **Glossary:** 40+ standard IT terms + Avance-specific ones
- **Emergency Ref:** Contact info, common error codes, templates
- **Tasks:** Empty initially (user populates during shifts)

---

### INTERACTIVE ELEMENTS & BEHAVIORS

#### Pre-Shift Checklist
- Checkboxes are **interactive** (toggle state with click)
- Completed items **visually fade** or show checkmark
- When all boxes checked → banner appears: "✅ You're ready! Have a great shift!"
- "Review priorities" text area persists across sessions
- Button: "Reset for tomorrow" (unchecks all)

#### Company Intel
- **Accordion sections:** Click section header to expand/collapse (smooth animation)
- **Reality Check items:** Show ⚠️ icon + yellow background for warnings
- **Team cards:** Hover reveals more context (email, phone if available)
- **Service cards:** Expand on click to show related tools and client use cases
- **No external links in MVP** (all content internal)

#### Task Manager
- **Add Task:** Modal form with dropdown for type, priority, status
- **List view:** Drag-to-reorder (optional, nice-to-have)
- **Status change:** Click badge (New/In Progress/etc.) to cycle through status
- **Delete task:** Confirm dialog before deletion
- **Daily Wrap-up:** Button to open modal (date/time auto-filled)
- **Clear completed:** Option to archive/hide resolved tasks
- **Persistence:** Save to local storage on every change

#### Tool Primers
- **Expandable sections:** Headers are clickable
- **Step-by-step:** Use numbered lists or callout boxes
- **Code snippets:** Monospace font, copy-to-clipboard button
- **Screenshot placeholders:** `[Screenshot: Dashboard view]` until images added
- **Link to docs:** Each section should link to tool vendor's official docs

#### Glossary
- **Search box:** Real-time filtering (debounced, ~200ms)
- **Filter results:** Display count ("Showing 3 of 42")
- **Related terms:** Clickable links within definitions
- **Add custom entry:** Button to create personal glossary additions
- **Sort:** By term (A–Z) or by date added
- **Export:** (Optional) button to export glossary as CSV

#### Emergency Reference
- **Escalation tree:** Yes/No buttons that advance tree (visual progress bar)
- **Decision path:** Shows "You've arrived at: Escalate to James immediately"
- **Copy templates:** One-click copy email templates to clipboard
- **Contact buttons:** Click to reveal full contact info (obfuscated by default for security)

---

### TECHNICAL IMPLEMENTATION

#### Technology Stack
- **Framework:** React (functional components, hooks)
- **Styling:** Tailwind CSS (for rapid, responsive design) OR CSS Modules (if preferred)
- **Storage:** Browser `localStorage` API (no backend needed)
- **Search/Filter:** Native JavaScript (Array.filter, Array.find)
- **Icons:** FontAwesome or Heroicons (SVG)
- **Date handling:** JavaScript `Date` object or lightweight library (date-fns)
- **State management:** React hooks (useState, useReducer, useContext) — keep it simple

#### File Structure (Suggested)
```
src/
├── components/
│   ├── PreShiftChecklist.jsx
│   ├── CompanyIntel.jsx
│   ├── TaskManager.jsx
│   ├── ToolPrimers.jsx
│   ├── Glossary.jsx
│   ├── EmergencyRef.jsx
│   └── Navigation.jsx
├── data/
│   ├── companyData.js (team, services, reality checks)
│   ├── toolPrimers.js (Datto, RustDesk, etc.)
│   ├── glossary.js (40+ terms)
│   └── emergencyRef.js (contacts, error codes, templates)
├── hooks/
│   ├── useLocalStorage.js (persist to localStorage)
│   └── useSearch.js (for glossary filtering)
├── styles/
│   ├── tailwind.css (or styles.css if CSS Modules)
│   └── variables.css (colors, spacing)
├── App.jsx (main component, routing/tabs)
├── App.css
└── index.js
```

#### Key Functional Requirements
1. **Offline-first:** App works completely without internet
2. **Data persistence:** All user data saved to localStorage automatically
3. **Responsive:** Works on desktop, tablet, mobile
4. **Fast:** No external API calls in MVP (all data preloaded)
5. **Secure:** No credentials stored; use password manager
6. **Searchable:** Glossary and maybe task list searchable
7. **Keyboard accessible:** Navigation, task entry, all interactive elements

#### Performance Notes
- Keep bundle size under 500KB (React + Tailwind)
- No heavy dependencies (no moment.js, use Date or date-fns)
- Lazy-load if needed (but probably not necessary for MVP)
- Images: Keep as placeholders in MVP (can add screenshots later)

---

### CONTENT TO PREPOPULATE

You must include this content in the build (reference the AVANCE_APP_VISION.md document for full details):

#### Company Intel
- **Quick Facts:** Legal name, ABN, location, office hours, team size, revenue, mission
- **Team:** Andrew Johnston (MD), James Newby (Head Tech), Samit Baral (Head Dev), Edwin Schmidt (BDM)
- **Services:** MSP, cloud migration, networking, phones, security, custom dev, community partnerships
- **Target clients:** Accounting, law, trades, schools in Dubbo/Central West NSW
- **Reality checks:** Small team, limited portfolio, zero reviews, outdated privacy policy, 24/7 claim unclear

#### Tool Primers (Starter Content)
- **Datto RMM:** Overview, dashboard, alerts, scripting, common issues
- **RustDesk:** What it is, how to connect, security, troubleshooting
- **Microsoft 365:** User reset, MFA, common issues
- **Google Workspace:** User reset, common issues
- **Ubiquiti UniFi:** AP health, WiFi reset, troubleshooting
- **General:** When to escalate, decision tree

#### Glossary (Min 40 terms)
RMM, Agent, Alert, Ticket, Escalation, EDR, MDR, MFA, VPN, Phishing, Patch, Update, Vulnerability, Zero-day, Cloud, SaaS, Azure, Microsoft 365, Endpoint, Device, Server, Workstation, Active Directory, DNS, IP, MAC address, Firewall, Switch, Router, WiFi, Access Point, Backup, Restore, DR, RTO, RPO, Incident, PSA, Autotask, Kaseya, and more

#### Emergency Reference
- **Contacts:** Office, support email, Andrew, James
- **Common errors:** Windows Update, connectivity, access denied, agent offline, printer
- **Escalation tree:** Interactive decision path
- **Email templates:** 4–5 standard support responses

---

### SUCCESS CRITERIA

The app is **complete** when:

✅ User can navigate between all 6 main sections smoothly  
✅ Pre-shift checklist completes and saves state  
✅ Company intel is readable, organized, and informative  
✅ Tasks can be added, edited, deleted, and marked complete  
✅ Shift wrap-up form works and saves log  
✅ Glossary is searchable (type to filter)  
✅ Tool primers are well-organized and accessible  
✅ Emergency ref shows contacts and escalation tree  
✅ All data persists after page reload (localStorage works)  
✅ App looks professional and is responsive on mobile  
✅ No console errors or warnings  
✅ Load time is fast (< 2 seconds)  

---

### FUTURE ENHANCEMENTS (NOT MVP)

Once MVP is working, consider:
- Real-time Datto RMM alert feed (API integration)
- Live ticket queue from Avance support portal
- Spaced repetition quizzing (glossary terms)
- Analytics dashboard (your progress, tickets per week, etc.)
- Cloud backup of notes (user-controlled)
- Dark mode
- Custom color themes
- Integration with calendar (shifts, client maintenance windows)
- Mobile app (React Native)

---

### TONE & VOICE

The app should feel:
- **Professional but friendly** – This is work, but we're not stuffy
- **Clear and jargon-free** – Explain IT concepts simply (use glossary to reinforce)
- **Encouraging** – Celebrate completion of checklist, milestone task counts
- **Honest** – Reality checks call out what's unknown or tricky
- **Practical** – Focus on what helps you do your job, not fluff

#### Example messaging:
- ✅ "You're ready! Have a great shift."
- ❌ ❌ "This is a hard problem. Escalate to James."
- 📚 "You've resolved 10 tickets this week—great progress!"
- ⚠️ "That client has a legacy system; check the task notes for context."
- 🎯 "Let's master RMM scripting next week—want to practice?"

---

### FINAL NOTES

**This app is for you.** Use it to:
- Show up informed
- Work more independently (fewer questions)
- Build confidence quickly
- Document your learning
- Become invaluable to the team

**You own it.** Add custom entries, edit content, make it yours. The vision doc is a starting point, not a constraint.

**Keep it real.** As you learn more about Avance, update the app with real info. That "Reality Check" section should evolve as you discover gaps between marketing and reality.

---

### BUILD STARTING NOW

Ready to build? Use this prompt with Claude Code (terminal: `claude code` in repo directory) and start with:

1. Set up React component structure
2. Build main App.jsx with tab navigation
3. Create CompanyIntel.jsx first (mostly content, good test)
4. Add TaskManager.jsx (most complex, involves state management)
5. Add Glossary.jsx (searchable, good UX test)
6. Wire up localStorage persistence
7. Test on mobile, refine responsive design
8. Deploy to GitHub Pages or similar

**You've got this! 🚀**

---

**Document Version:** 1.0  
**Date:** April 17, 2026  
**For:** Claude Code Build System
