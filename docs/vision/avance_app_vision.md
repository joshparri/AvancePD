# Avance IT Work Preparation & Performance App
## Product Vision Document

**Version:** 1.0  
**Date:** April 17, 2026  
**Target User:** New part-time team member at Avance Business Technology  
**Work Schedule:** Mondays & Wednesdays, 8:30 AM – 5:00 PM  
**Role:** General IT Support / Technical Assistant

---

## Executive Summary

This application is a personalized work companion designed to prepare you for, and enhance your performance during, your role at Avance Business Technology in Dubbo, NSW. The app combines company intelligence, technical reference materials, daily task management, and real-time support workflows to ensure you show up informed, capable, and confident on your Mon/Wed shifts.

**Key Outcome:** Transform your first weeks from "where do I start?" to "I'm ready to help clients."

---

## 1. Product Overview

### What This App Does
- **Pre-shift preparation:** Review company info, team bios, client focus areas, and daily priorities before you arrive
- **At-work reference:** Quick lookup tools for Avance's service offerings, tools, and common client scenarios
- **Task management:** Organize daily tickets, action items, and learning goals
- **Knowledge building:** Track what you learn each shift and build personal reference notes
- **Client quick-reference:** Instant access to client names, industries, common issues, and contacts
- **Tool primers:** Quick-start guides for Datto RMM, RustDesk, and other key platforms
- **Glossary:** Plain-English translations of IT terms, abbreviations, and Avance-specific jargon

### Who It Serves
- **You:** A new part-time team member joining Avance for Mon/Wed shifts
- **Secondary:** Can be extended to serve other team members or new hires in future

### When It's Used
- **Before work:** 15–30 mins on Monday/Wednesday mornings, or the night before
- **During work:** Quick reference during client calls, ticket handling, or knowledge gaps
- **After work:** 5–10 mins to log what you learned and prepare for the next shift

---

## 2. Avance Business Technology: Context & Reality Check

### Company Overview
- **Legal Name:** System State IT Pty Ltd (ABN 19 621 910 950)
- **Trading Name:** Avance Business Technology
- **Location:** Unit 10/36 Darling Street, Dubbo NSW 2830 (Riverview Business Park)
- **Size:** 2–10 employees (very small team)
- **Revenue:** <$5M annually
- **Focus:** Managed IT Services (MSP) + Custom Software Development

### Leadership Team (4 named roles)
1. **Andrew Johnston** – Managing Director
   - Background: Quoted in 2019 CRN article about Dubbo IT market
   - Interests: Enterprise & education tech experience
2. **James Newby** – Head Technician
3. **Samit Baral** – Head Developer
4. **Edwin Schmidt** – Business Development Manager
   - Education: BSc from University of Tasmania

### Service Offerings
Avance serves small-to-medium businesses (SMBs) primarily in:
- **Managed IT Services** (proactive monitoring, support, helpdesk)
- **Cloud Migrations** (Google Workspace, Microsoft 365, etc.)
- **Network & Wireless** (Ubiquiti, Cisco infrastructure)
- **IP Phone Systems** (Next-gen hosted PBX, Fusion Broadband)
- **Cybersecurity** (Email filtering, MFA, security hardening)
- **Custom Software Development** (Web solutions, mobile apps)
- **Community Partnerships** (Non-profits, schools, local initiatives)

### Target Client Base
From 2019 CRN article:
- **Primary verticals:** Accounting firms, law firms, construction/trades, schools
- **Geographic focus:** Dubbo, Central West NSW, regional Australia
- **Client type:** "Just the right size to need external IT support but too small to hire full-time staff"

### Key Concerns & Reality Checks
⚠️ **What you should know:**
- **Very small team** (likely only 4–6 people) → you'll wear multiple hats
- **Staffing vs. 24/7 claim:** Directory shows closed Fridays (contradicts "24/7 support" marketing)
- **Zero customer reviews** visible online → no public validation of service quality
- **Limited social media presence** → dormant Twitter, no LinkedIn company page
- **Privacy policy outdated** (still references "System State IT" with template text) → governance not a strength
- **Limited portfolio** (only ~3 website projects found) → dev work may be selective/limited

**Bottom line for you:** You're joining a **small, bootstrapped, local MSP** with genuine services but limited online presence. Expect pragmatism over process. Your actual work experience will be vastly more informative than any marketing claim.

---

## 3. Core Tools & Technology Stack

### Monitoring & Management (RMM)
**Primary Tool: Datto RMM** (Remote Monitoring and Management)
- Cloud-hosted platform for monitoring client endpoints, servers, networks
- Agent-based (lightweight agents deployed on each managed device)
- Handles: patch management, alerting, scripting, remote control
- Key features: Configurable dashboards, component monitors, SNMP for network gear
- **You'll use this to:** Monitor client health, see alerts, schedule patches, run scripts

### Remote Support
**Primary Tool: RustDesk** (Open-source remote desktop)
- Secure, end-to-end encrypted remote access
- Used for attended support sessions (with client permission)
- Self-hosted or cloud-based deployment
- **You'll use this to:** Connect to client machines for troubleshooting

### Networking & Infrastructure
**Brands Avance trusts:**
- **Ubiquiti** (UniFi: WiFi, switches, routers, edge devices)
- **Cisco** (Switches, firewalls, security appliances)
- **HP** (Servers, storage)
- **Microsoft** (365, Azure, Active Directory)
- **Google** (Workspace, Gmail, Drive, authentication)

### Backup & Disaster Recovery
- **Veeam** and/or **Datto** backup solutions (confirms presence)
- Likely offering 3-2-1 backup strategy (3 copies, 2 media types, 1 offsite)

### Security & Threat Protection
- **SentinelOne** (EDR: Endpoint Detection & Response)
- **Huntress** (Threat hunting, EDR)
- **Email filtering** with AI/phishing detection
- **DNS filtering** (likely Cisco Umbrella or similar)

### Cloud & Identity
- **Microsoft 365** (Exchange, Teams, SharePoint, OneDrive)
- **Google Workspace** (Gmail, Docs, Drive, Meet)
- **Azure Active Directory** or similar for identity management
- **MFA** (Multi-factor authentication) mandatory on sensitive accounts

### Development
- **Web development stack** (unknown specifics, but modern frameworks likely)
- **Mobile apps** (claimed capability, limited portfolio evidence)
- **Custom integrations** between cloud services

---

## 4. Daily Work Reality: What to Expect

### Your Schedule
- **Monday:** 8:30 AM – 5:00 PM
- **Wednesday:** 8:30 AM – 5:00 PM
- **Office location:** Unit 10/36 Darling Street, Dubbo (professional business park)
- **Team:** You + 3–5 others on any given day

### Typical Day Breakdown
**Morning (8:30–10:30 AM)**
- Check Datto RMM for overnight alerts
- Review ticket queue (support portal)
- Stand-up with Andrew/team on priorities
- Prepare for first client calls

**Midday (10:30 AM–1:00 PM)**
- Handle support tickets (phone, email, remote sessions)
- Respond to escalations from previous week
- Patch/update client systems
- Troubleshoot reported issues

**Afternoon (1:00–5:00 PM)**
- Continue ticket resolution
- Site visits or onsite support
- Documentation and knowledge updates
- Hand off any unresolved items to James (Head Technician)

### Common Tasks You'll Do
1. **Ticket triage:** Read incoming support requests, categorize, prioritize
2. **Remote troubleshooting:** Use RustDesk to diagnose client issues
3. **Patch management:** Deploy security updates via Datto RMM
4. **Client communication:** Phone calls, emails, ticket updates (plain English)
5. **Documentation:** Log actions, solutions, and follow-ups
6. **Knowledge capture:** Document new issues/solutions for future reference

### Who You'll Talk To
- **Internal:** Andrew (MD), James (Head Tech), Samit (Dev), Edwin (BDM), possibly others
- **External:** Small-business owners, office managers, IT users, non-technical staff
- **Tone:** Professional but friendly; explain tech in plain English; community-focused

---

## 5. Critical Success Factors

### What Success Looks Like (First 4 Weeks)
✅ You understand Avance's service model and can explain it to clients  
✅ You can navigate Datto RMM and interpret alerts  
✅ You can use RustDesk to connect to clients and diagnose basic issues  
✅ You know the names and main contact of 5+ Avance clients  
✅ You've resolved 10+ support tickets independently  
✅ You can spot when a ticket needs escalation vs. can be self-resolved  
✅ You've built reference notes for common issues you see repeatedly  
✅ Team members know your strengths and weaknesses  

### What Will Be Hard (Be Ready)
❌ Avance's internal processes aren't well-documented (small company)  
❌ No formal training plan; you'll learn by doing  
❌ Work will be reactive (responding to tickets) not proactive  
❌ Regional IT skills gaps (limited local talent pool) mean you'll see diverse, unexpected issues  
❌ Dubbo economy is agriculture/trades focused; clients may not be tech-savvy  
❌ Privacy policy/governance isn't tight; this may mean fuzzy lines on data/process  

### Key Behaviors to Develop
1. **Ask clarifying questions early** – Don't guess; it costs client trust
2. **Document everything** – Future you (or the team) will thank you
3. **Communicate status to clients** – "Working on it" beats radio silence
4. **Learn the tools deeply** – Datto RMM and RustDesk are your daily bread
5. **Know when to escalate** – James is there for a reason; use him
6. **Stay curious** – Every ticket is a chance to learn something new

---

## 6. App Feature Set

### 1. **Pre-Shift Checklist**
- [ ] Review today's client calendar (if available)
- [ ] Read overnight alerts from Datto RMM
- [ ] Check team priorities / handoff notes
- [ ] Review your learning goals from last shift
- [ ] Read 1–2 reference articles relevant to today

### 2. **Company Intelligence Hub**
- Avance org chart, bios, contact info
- Service offerings (explained plainly)
- Client list (anonymized) + industry breakdown
- Key facts: size, revenue, philosophy, community focus
- Critical reality checks (what's public vs. what's real)

### 3. **Daily Task Manager**
- Log tickets as you work through them
- Track status: New → In Progress → Waiting for Client → Resolved
- Notes field for quick reference (command used, error messages, etc.)
- Time tracking (optional; for learning about task complexity)
- At end of shift: log key learnings

### 4. **Client Quick-Reference**
- Search/filter clients by industry, location, name
- One-page profile per client: contact, main users, common issues, preferences
- Build this as you work (you'll learn what clients need)
- Link to tickets for that client (easy context)

### 5. **Tool Primers & How-Tos**
**Datto RMM**
- Dashboard layout and what each widget means
- How to interpret alerts (severity levels)
- How to run a basic script
- Patch approval workflow

**RustDesk**
- How to initiate a session
- Security best practices (permission, session logging)
- Troubleshooting connection issues
- Session etiquette (client communications)

**Cloud Platforms**
- Microsoft 365 quick-start (user creation, password reset, MFA)
- Google Workspace quick-start (similar)
- Azure AD basics (groups, roles, permissions)

**Network Gear**
- Ubiquiti UniFi overview (AP health, bandwidth)
- Cisco switch basics (port status, PoE)
- Troubleshooting connectivity

### 6. **Glossary & Plain-English Dictionary**
- **RMM** = Remote Monitoring and Management (auto-monitors client computers)
- **Agent** = Software installed on a computer that talks to RMM
- **Alert** = RMM found something that needs attention
- **Escalation** = Problem too hard for Level 1; hand off to Level 2/3
- **Ticket** = Support request from a client (tracked in support portal)
- **EDR** = Endpoint Detection & Response (security tool that watches for threats)
- **MFA** = Multi-factor authentication (password + code/biometric)
- **VPN** = Virtual private network (secure tunnel to company network)
- **Phishing** = Fake email trying to trick someone into giving up credentials
- **PSA** = Professional Services Automation (manages projects/ticketing)
- And 50+ more as you encounter them

### 7. **Learning Log**
- Daily entry (optional but encouraged)
- What issue did you tackle today?
- What did you learn?
- What was hard? What was easy?
- Link to resources that helped
- **Purpose:** Build institutional memory and track your growth

### 8. **Schedule & Calendar**
- Your Mon/Wed shifts (8:30–5:00 PM)
- Avance team availability (who's in office when)
- Known client maintenance windows
- Upcoming certifications/learning goals
- Link to Avance's public calendar (if available)

### 9. **Emergency Reference** (Quick-lookup)
- Avance contact info (office, emergency, after-hours)
- Key client emergency contacts (by contract)
- Common error codes (Windows, network, cloud)
- Escalation decision tree: "Should I call James?"
- Password/credential management (secure note field)

### 10. **Personal Notes & Snippets**
- Save command-line one-liners you use repeatedly
- Document client-specific oddities (custom setup, legacy system, etc.)
- Copy-paste templates for common support responses
- Troubleshooting flowcharts you create
- This becomes *your* knowledge base over time

---

## 7. Technical Specifications

### Platform & Architecture
- **Frontend:** React-based web app (accessible from any browser)
- **Backend:** Claude API calls + local data storage
- **Data Storage:** Browser local storage (offline-first design)
- **Sync:** Optional cloud sync (future enhancement)
- **Offline:** Fully functional without internet (critical for on-site work)

### Key Integrations (Future)
- Datto RMM API (pull real-time alerts)
- Avance support ticketing system (if API available)
- Google Calendar (sync your schedule)
- Slack/Teams (post learning logs)

### Security & Privacy
- ✅ No sensitive data (passwords, keys) stored in app
- ✅ All client data anonymized in examples
- ✅ Local-first storage (you own your notes)
- ✅ Optional cloud backup (user-controlled)
- ⚠️ Use secure password manager for credentials

### Device Support
- 💻 Desktop (primary: during work, referencing while on calls)
- 📱 Mobile (secondary: checklist, quick reference in field)
- Responsive design for all screen sizes

---

## 8. Success Metrics

### For You (Personal Growth)
- Time to resolve first ticket independently (< 2 weeks)
- Number of tickets handled per week (week 1: 3–5, week 4: 10–15)
- Escalation rate (starts high, decreases as you learn)
- Customer satisfaction on your tickets (informal feedback)
- Knowledge base entries created (aim for 1 per week)

### For the App
- Frequency of use (daily? how many times per shift?)
- Most-used sections (which features matter?)
- Completion of pre-shift checklists
- Learning log consistency
- Feedback on missing information

---

## 9. Development Roadmap

### MVP (Week 1–2): Core Essentials
- Pre-shift checklist
- Company intelligence hub
- Daily task manager
- Tool primers (Datto RMM, RustDesk basics)
- Glossary

### Phase 2 (Week 3–4): Enrichment
- Client quick-reference (you'll populate as you work)
- Learning log with templates
- Emergency reference
- Personal notes / snippets

### Phase 3 (Ongoing): Intelligence
- Datto RMM API integration (real alerts)
- Avance ticket portal integration (live ticket queue)
- Analytics dashboard (your progress over time)
- Spaced repetition learning (quiz yourself on glossary)
- Search-powered knowledge base (AI-indexed)

---

## 10. Guardrails & Principles

### What This App Is NOT
- ❌ A replacement for Avance's official systems (still use those)
- ❌ A training course (you learn by doing; this supports that)
- ❌ A cheat sheet for avoiding real work (knowledge still matters)
- ❌ A substitute for asking James/Andrew when stuck (ask!)

### What This App IS
- ✅ Your personal work companion
- ✅ A reference layer between you and confusion
- ✅ A place to document your learning
- ✅ A confidence builder for your first month
- ✅ A bridge between theory and practice

### Ethical Principles
- **Transparency:** If you don't understand something, log it and ask
- **Respect:** Follow Avance's processes; this app augments, doesn't replace
- **Security:** Protect client data; never store credentials
- **Growth:** This app is a learning tool; use it to get better, not to get by

---

## 11. Prompt for Claude Code

See the accompanying **CLAUDE_CODE_PROMPT.md** for the exact initial prompt to feed to Claude Code.

---

## Appendix: Avance Business Technology Deep Dive

### What's Publicly Known (High Confidence)
✅ Registered business, ABN 19 621 910 950  
✅ Professional office in Riverview Business Park  
✅ Tools in use: Datto RMM, RustDesk, Ubiquiti, Cisco  
✅ Claims partnerships: N-able, Microsoft, Veeam, SentinelOne, Huntress  
✅ Founded/rebranded around 2018  
✅ Small team (2–10 employees)  
✅ Regional focus (Dubbo, Central West NSW)  
✅ Target clients: SMBs in accounting, law, trades, schools  
✅ Services: Managed IT, cloud migration, networking, custom dev  

### What's Unknown (Low Confidence)
❌ Actual customer count or retention  
❌ Real profitability / financial health  
❌ How 24/7 support is staffed (closed Fridays, 2–10 people)  
❌ Customer satisfaction (zero public reviews)  
❌ True tech stack for development  
❌ Partnership tier levels (reseller vs. certified vs. solutions partner)  
❌ Reasoning behind System State IT → Avance rebrand in 2021  

### What You'll Learn Through Experience
Through your first month, you'll discover:
- Actual client personality and needs
- Real support workflow and escalation paths
- Team communication style and expectations
- Tool-specific quirks and tricks
- Client-specific custom setups
- Avance's real service quality (vs. marketing)
- Your own strengths and growth areas

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Apr 17, 2026 | Work Prep Team | Initial vision document |

---

**Last updated:** April 17, 2026  
**Next review:** April 30, 2026 (after first 2 weeks of work)
