# Avance Work Companion & Avance PD - Implementation Backlog

**Status**: Two-app system with core features complete. This backlog covers remaining enhancements and integrations.

---

## Priority 1: Critical App Shell & Foundation

### 1.1 App Branding & Metadata
- [x] **Work Companion**: Fix browser title to "Avance Work Companion" consistently
- [x] **Work Companion**: Update all metadata and dashboard subtitle
- [x] **Avance PD**: Ensure browser title is "Avance PD"
- [x] **Avance PD**: Verify app branding separation from Work Companion

### 1.2 Resolve TODO.md Merge Conflict
- [x] Clean and consolidate TODO files

---

## Priority 2: Work Companion Core Enhancements

### 2.1 Learning Integration
- [x] Add learning-seed fields to Work Logs (skill area, confidence, review flag, etc)
- [x] Implement "After Action Review" prompts for selected work logs
- [x] Mark work logs as learning-worthy
- [x] Extract learning queue items from work logs
- [x] Link work logs to KB cards and scenarios

### 2.2 Quick Capture Upgrades
- [x] Upgrade Quick Capture to structured ticket-note builder
- [x] Add note-quality checklist (summary, what happened, action, status, follow-up, tags)
- [x] Implement "Convert to ticket note" action with copyable preview
- [x] Add ticket-note templates for common scenarios

### 2.3 Follow-up Triage
- [x] Add status field (waiting, needs-action, blocked)
- [x] Add due date and next-nudge scheduling
- [x] Create editable follow-up wording templates
- [x] Add dashboard summary of stale follow-ups
- [x] Implement follow-up discipline training

### 2.4 Playbook Generation
- [x] Auto-convert repeated issue tags into editable playbook drafts
- [x] Suggest from safe local data only (no client-specific data)
- [x] Add UI for approving/editing suggested playbooks

### 2.5 Change Guardrails
- [ ] Add approval/confirmation for risky work (migrations, deletions, policies, firewall, DNS, backups, MFA, Conditional Access, scripts, production)
- [ ] Track before-state for changes
- [ ] Implement senior-check prompts

### 2.6 Ticket-Note Practice from Real Work
- [ ] Score real work-log ticket notes deterministically (needs-work, usable, strong)
- [ ] Link scoring to KB cards and scenarios
- [ ] Track improvement over time

### 2.7 Local KB Hints
- [ ] Add static KB hints without scraping Drive or importing private content
- [ ] Show hints contextually during work-log capture

---

## Priority 3: Avance PD Learning Machine

### 3.1 KB Card Management
- [x] Implement create/edit/delete UI for KB field cards (currently seeded only)
- [x] Add manual card management interface
- [ ] Support private KB PDF import (future, design safe import first)
- [ ] Show card metadata (title, category, prerequisites, when to use, escalation, confidence, review due date)

### 3.2 Skill Mastery Map
- [x] Build skill tree/mastery map view
- [ ] Link skills to KB cards, scenarios, flashcards, ticket-note drills, and evidence
- [ ] Show confidence levels and evidence count per skill
- [x] Recommend next skill to practice

### 3.3 Scenario-to-Ticket-Note Flow
- [ ] Implement scenario-to-ticket-note practice flow
- [ ] End scenarios with rubric-checked ticket notes
- [ ] Score notes and store results
- [ ] Link to KB field cards

### 3.4 PD Focus Intelligence
- [ ] Upgrade from static to deterministic next-best-action engine
- [ ] Recommend based on current tasks, skill gaps, and learning queue
- [ ] Link recommendations to KB, scenarios, and practice activities

### 3.5 Evidence Pack Enhancements
- [ ] Add skill-tree section to Evidence Pack
- [ ] Link KB evidence to proof-of-learning
- [ ] Create manager-ready weekly PD review
- [ ] Improve export formats (Markdown, JSON, plain text)

### 3.6 Communication & Discipline Training
- [ ] Add communication practice categories (client update, escalation, change approval, follow-up, closure, investigation)
- [ ] Add tone checklist for professional communication
- [ ] Improve follow-up area with templates and stale indicators
- [ ] Add next-action guidance for follow-ups

### 3.7 Demo Data & Privacy
- [ ] Add onboarding-safe demo data badges and reset controls
- [ ] Implement privacy/safety linting for user-entered notes
- [ ] Warn on obvious emails, phone numbers, passwords, tokens, private details
- [ ] Add linting to Evidence Pack export flows

---

## Priority 4: AI Prompt Packs (Requires API Keys)

### 4.1 Work Companion Prompts
- [ ] Daily Briefing: Summarize next shift, overdue items, priorities
- [ ] Health Check: Review hydration/breaks, suggest reset
- [ ] Repeated Issue Coach: Scan logs, draft playbooks
- [ ] Work Log Summarizer: Convert to ticket notes, extract actions/skills
- [ ] Micro-Learning Booster: Recommend scenarios based on tasks
- [ ] Backup Reminder: Track export/sync cadence

### 4.2 Avance PD Prompts
- [ ] PD Focus Overview: Summarize learning progress, hours, targets, next move
- [ ] Weekly Retrospective: Identify patterns, suggest skill practice
- [ ] Task Breakdown: Convert tasks to actionable steps with durations
- [ ] Follow-up Triage: Draft follow-up messages for stalled work
- [ ] Learning Cockpit Navigator: Personalize module recommendations
- [ ] Progress Analytics: Hours, tasks completed, skills practiced

### 4.3 Implementation Guardrails
- [ ] Use server-side API keys only (Groq SDK already available)
- [ ] Implement privacy/safety linting before API calls
- [ ] Never send client names, credentials, IPs, hostnames, or copied ticket text
- [ ] Add opt-in settings for AI features
- [ ] Keep local-first as fallback when APIs unavailable

---

## Priority 5: Future Enhancements (Deferred)

### 5.1 Mobile & PWA
- [ ] Email-to-note import (cleaned communication-note presets)
- [ ] Calendar reminders (downloadable `.ics` — partially done)
- [ ] Attachment support improvements
- [ ] Mobile capture optimization
- [ ] PWA enhancements

### 5.2 Advanced Analytics (Future)
- [ ] Supabase cloud sync (optional, gated behind settings)
- [ ] Gmail/Calendar API integrations (design safe import first)
- [ ] PSA/RMM integrations (future, design safe integrations first)
- [ ] Unattended email scheduler (requires server cron)
- [ ] Usage analytics (local only)
- [ ] Productivity insights and trend analysis

### 5.3 Known Issues to Address
- [ ] MSP Scenario Trainer dropdown shows dark background (fix styling)
- [ ] Ticket Notes Trainer needs navigation link update
- [ ] KB Learning Machine lacks create/edit/delete UI
- [ ] KB import from private sources not yet supported

---

## Completed Milestones

### Core Features ✅
- [x] Dashboard with shift context, follow-ups, quick capture
- [x] Work Logs, Tasks, Knowledge Base, Playbooks
- [x] Time tracking & invoice preview
- [x] Learning Tracker with confidence scoring
- [x] Health & Outdoors module with local notifications
- [x] MSP Skills Matrix, Scenario Trainer, Ticket Notes Trainer
- [x] Evidence Pack builder (manager-safe summaries)
- [x] Field Ops cockpit (pending actions, alert sanitizing, security triage)
- [x] Weekly Review with scorecard
- [x] Focus Mode timer with health integration
- [x] Mobile-friendly UI
- [x] Data export/import
- [x] Keyboard shortcut overlay
- [x] Search across all entities
- [x] Dark mode toggle

### Documentation ✅
- [x] Vision & product principles
- [x] Architecture & technical approach
- [x] Two-app prompt pack roadmap
- [x] Health & Outdoors implementation guide
- [x] Learning Machine TODO with detailed specs
- [x] QA checklist
- [x] Developer guide
- [x] Deployment guide (Vercel)

---

## Implementation Notes

- **Local-First**: All features must work offline with browser localStorage/IndexedDB
- **Privacy**: No client names, credentials, IPs, hostnames, or sensitive data in storage
- **Build Verification**: Run `npm run build` before each git push
- **QA Process**: Test each feature before shipping (see QA_CHECKLIST.md)
- **Two-App Strategy**: Keep Work Companion (capture) and Avance PD (learning) separate but aligned

---

## How to Use This Backlog

1. Pick a priority 1, 2, or 3 item above
2. Create a feature branch from main
3. Implement with full build verification
4. Run QA tests (see QA_CHECKLIST.md)
5. Push to main after successful build
6. Mark item as done in this file

**Next steps**: Start with Priority 1 (app branding), then Priority 2 (learning integration), then Priority 3 (KB management).
