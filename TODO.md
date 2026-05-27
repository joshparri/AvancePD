<<<<<<< HEAD
# Avance Work Companion TODO

## 1. Product definition & validation

## 2. App architecture & data model

## 3. Core feature implementation

## 4. User experience & UI work

## 5. Documentation & onboarding

## 6. Professional development / MSP growth

## 7. Testing, validation & polish

## 8. Deployment & support

## 9. Cleanup & repo health

## 10. Future improvements

## 11. Health & Outdoors module

## 12. Prompt packs, AI coaching, and learning machine backlog
=======
# Avance Work Companion - TODO List

## Overview
This TODO list outlines all remaining tasks to build and optimize the Avance Work Companion app, making it as useful as possible for Josh's part-time MSP work at Avance Business Technology. The app focuses on preparation, knowledge capture, continuity, task management, and professional development in IT MSP skills.

## Phase 1: Project Setup & Core Infrastructure

### 1.1 Initialize Next.js Project
- [x] Create new Next.js project with TypeScript
### 1.2 Data Models & Schema
- [x] Define TypeScript interfaces for all entities:
- [x] Set up Zod schemas for validation
<<<<<<< HEAD
# Avance Work Companion TODO

## 1. Product definition & validation
- [x] Confirm the core user: Josh as a single-user MSP operator
- [x] Validate the Monday/Wednesday shift rhythm and recurring shift needs
- [x] Finalize MVP scope around dashboard, shift prep, work logs, tasks, knowledge, playbooks, time logging, and learning tracker
- [x] Define clear success metrics for the app (time-to-context, quick log speed, task follow-through, invoice prep)
- [x] Review and align on the product principles in `docs/vision.md`

## 2. App architecture & data model
- [x] Design the data model for shifts, work logs, tasks, knowledge entries, playbooks, clients, time entries, and learning items
- [x] Decide on storage strategy: local-first persistence plus optional Supabase or export/import
- [x] Define the page/section structure for dashboard, shift view, notes, tasks, knowledge, playbooks, time, and PD
- [x] Add search/index architecture to support fast retrieval of logs, notes, playbooks, and knowledge
- [x] Add security guidance to prevent storing credentials or sensitive data

## 3. Core feature implementation
- [x] Build the dashboard with today/next shift, priorities, open follow-ups, recent handover, quick capture, and invoice-cycle summary
- [x] Build the shift scheduler/prep module with recurring Mon/Wed support, exceptions, priorities, prep checklist, and handover links
- [x] Build quick work logging with timestamp, client, summary, actions, result, next step, tags, and draft support
- [x] Build task management with status, due date, priority, client link, work log link, and carry-forward behaviour
- [x] Build the knowledge base with title, body, tags, confidence, last verified, category, source type, draft/trusted states, and search
- [x] Build playbooks for issue triage, symptoms, checks, escalation, and field notes
- [x] Build time logging and invoice preview support with billable entries, totals, unbilled/billed/paid state, and export-ready line items
- [x] Build the learning tracker with topic, confidence score, "seen in real work", ask-team flag, and next review date

## 4. User experience & UI work
- [x] Implement the calm, readable UI style described in `docs/UI_UX_AND_TONE_GUIDE.md`
- [x] Add keyboard shortcuts or quick-capture affordances for busy work states
- [x] Build clear status chips and colour semantics for urgent, review, trusted, and billed states
- [x] Create empty-state guidance for all core modules
- [x] Ensure the app loads quickly and displays key context in under 60 seconds
- [x] Add explicit warnings about not storing passwords or sensitive information

## 5. Documentation & onboarding
- [x] Keep `docs/vision.md` up to date with any scope or feature changes
- [x] Create a short in-app onboarding flow for first-time use
- [x] Add a user guide or quick-start page for daily shift routine and PD habits
- [x] Build a developer-facing README describing how to run and extend the app
- [x] Add an accessible `docs/TODO.md` or project tracker for ongoing priorities

## 6. Professional development / MSP growth
- [x] Add PD-specific workflows in the app for learning goals and shift review
- [x] Integrate the PD checklist from `docs/PROFESSIONAL_DEVELOPMENT.md` into shift wrap-up or dashboard prompts
- [x] Add a "learned today" tag or note type in the knowledge base
- [x] Add a review cadence for learning entries and confidence updates
- [x] Include communication, security, endpoint, and network troubleshooting guidance as reference templates

## 7. Testing, validation & polish
- [x] Populate the app with sample seed data for early testing (`docs/SAMPLE_SEED_DATA.md`)
- [x] Test that the dashboard surfaces the right context after a gap between shifts
- [x] Validate that follow-ups and tasks survive shift transitions
- [x] Verify that knowledge and playbooks are searchable and discoverable
- [x] Test invoice preview generation and time tracking summaries
- [x] Run usability checks for quick capture under pressure
- [x] Fix any UI/UX friction that prevents fast note capture or task creation

## 8. Deployment & support
- [x] Choose a runnable deployment method for a private web app (local static site, desktop wrapper, or simple hosted app)
- [x] Document launch instructions for Josh and how to open the app each shift
- [x] Add backup/export functionality so app data can be preserved
- [x] Add an optional sync plan only if it stays low-risk and optional

## 9. Cleanup & repo health
- [x] Keep the repo organized with the current folder structure and doc index files
- [x] Remove any remaining duplicate or unused draft files
- [x] Archive legacy ZIPs and raw downloads in `archives/`
- [x] Keep `references/` as read-only raw source materials only
- [x] Review the root `README.md` and `docs/README.md` for accuracy

## 10. Future improvements
- [x] Document email-to-note import guardrails in `docs/ROADMAP.md`
- [x] Document calendar sync / shift reminder guardrails in `docs/ROADMAP.md`
- [x] Document file attachment guardrails in `docs/ROADMAP.md`
- [x] Add local repeated-issue suggestions from safe tags and categories
- [x] Add mobile-friendly quick-capture presets and tap targets
- [x] Document optional Supabase/cloud sync guardrails in `docs/SYNC_PLAN.md`

## 11. Health & Outdoors module
- [x] Add a local-first Health & Outdoors module for Monday/Wednesday Avance shifts
- [x] Add gentle reminders for hydration, 20-20-20 eye breaks, posture, movement, outdoor daylight, lunch away from screen, stressful-ticket reset, and end-of-day shutdown
- [x] Add editable reminder schedule, shift days, quiet mode, snooze, skip, and notification permission handling
- [x] Add browser notification support with in-app banner fallback and no repeated permission prompts after denial
- [x] Add a research-backed "Why this helps" card library with plain-English summaries and source links
- [x] Add a Healthy MSP Shift panel to Dashboard and Avance Workday
- [x] Add optional 2-minute reset with optional faith prompt
- [x] Add weekly review, manager-safe evidence summary, export JSON, and reset health data actions
- [x] Add email reminder setup copy/export helpers without storing API keys or Gmail credentials
- [x] Add `/api/send-health-reminder` with server-side secrets only

## 12. Prompt packs, AI coaching, and learning machine backlog
- [x] Convert the local prompt-pack source into repo-safe docs in `docs/VIBE_CODER_PROMPT_PACKS.md`
- [x] Add implementation-sized TODOs in `docs/LEARNING_MACHINE_TODO.md`
- [x] Add prompt guidance for Avance Work Companion and Avance PD without committing raw private prompt exports
- [x] Add prompt-driven features for Daily Briefing, Health Check, Repeated Issue Coach, Micro-Learning Booster, and Backup Reminder
- [x] Add prompt-driven features for PD Focus Overview, Weekly Retrospective, Task Breakdown, Follow-Up Triage, Learning Cockpit Navigator, and Shift Health Monitor
- [x] App 2: create the KB Learning Machine shell with navigation and dashboard card
- [x] App 2: build KB Map and editable field cards
- [x] App 2: add spaced repetition reviews and active recall flashcards
- [x] App 1: upgrade Evidence Pack around learning proof and weekly PD review
- [x] App 1: upgrade Quick Capture with ticket-note builder and learning-seed fields
- [x] App 1: add After Action Review on work logs
- [x] App 1: add local KB hints without scraping private Drive or KB content
- [x] App 1: add Change Guardrail for risky work
- [x] App 1/App 2: add local privacy/safety linting for user-entered notes and evidence
- [x] Use the prompt packs to guide small UI improvements in dashboard visibility, follow-up triage, and PD progress flows
- [x] Add `docs/KB_LEARNING_GUIDE.md` to explain how the local Avance KB supports App 1 and App 2 without publishing private content
- [x] Update `docs/USER_GUIDE.md` with a KB workflow section
- [x] Keep AI prompt features aligned with local-first privacy and avoid overbuilding into a full PSA
# Avance Work Companion - TODO List

This file includes the core TODOs and a more detailed phased plan pulled from upstream AvancePD. Keep this list as the single source of truth for implementation priorities.

## Phase 1: Project Setup & Core Infrastructure

### 1.1 Initialize Next.js Project
- [x] Create new Next.js project with TypeScript
- [x] Configure Tailwind CSS and shadcn/ui
- [x] Set up project structure (app/, components/, lib/, types/)
- [x] Configure local storage (IndexedDB/Dexie) for data persistence
- [x] Set up PWA capabilities for offline use
- [x] Configure dark mode support

### 1.2 Data Models & Schema
- [x] Define TypeScript interfaces for all entities:
  - Shift, WorkLog, Task, KnowledgeEntry, Playbook, Client, LearningItem, Invoice
- [x] Set up Zod schemas for validation
- [x] Implement local database layer with Dexie
- [x] Create seed data based on `docs/guides/sample_seed_data.md`

... (detailed phased plan continues in file)

### 4.1 PD-Focused Features
- [ ] Add PD progress dashboard widget
- [ ] Implement skill gap analysis
- [ ] Build learning path recommendations
- [ ] Add certification tracking
- [ ] Create PD goal reminders and notifications

### 4.2 MSP Skill Development
- [ ] Add predefined MSP skill categories
- [ ] Implement skill assessment tools
- [ ] Build progress visualization (charts/graphs)
- [ ] Add peer learning integration (future)
- [ ] Create PD milestone celebrations

### 4.3 MSP Skills Academy Expansion
- [x] Document MSP Skills Academy specification in `docs/professional_development/msp_skills_academy.md`
- [x] Document MSP PD implementation checklist in `docs/professional_development/msp_pd_growth_todo.md`
- [x] Document two-app prompt-pack roadmap in `docs/implementation-plans/two-app-prompt-pack-roadmap.md`
- [ ] Create MSP skill taxonomy data file (`app/src/data/mspSkills.ts`)
- [ ] Create realistic MSP scenario data file (`app/src/data/mspScenarios.ts`)
- [ ] Add MSP Skills Matrix page (`/msp-skills`)
- [ ] Add MSP Scenario Trainer page (`/msp-scenarios`)
- [ ] Add Ticket Notes Trainer page (`/ticket-notes`)
- [ ] Add Evidence Pack page (`/evidence-pack`)
- [ ] Add MSP Roadmap page (`/msp-roadmap`)
- [ ] Add client communication practice prompts and model responses
- [ ] Add simple rule-based next best action recommendations
- [ ] Connect completed scenarios, notes, and evidence outputs to existing learning/PD records where practical
- [ ] Update app navigation with MSP professional development sections

### 4.4 Two-App Prompt Pack Backlog
- [ ] Keep App 1 (`avance-pd.vercel.app`) positioned as the Avance Work Companion capture engine.
- [ ] Keep App 2 (`avance-professional-development.vercel.app`) positioned as the Avance PD learning machine.
- [ ] App 1: set title/metadata to `Avance Work Companion` and add the dashboard subtitle.
- [ ] App 1: upgrade Quick Capture into a structured ticket note builder with quality checklist and copyable preview.
- [ ] App 1: add follow-up triage statuses, due dates, next nudges, priorities, and editable wording templates.
- [ ] App 1: turn repeated issue suggestions into editable playbook drafts.
- [ ] App 1: improve Healthy MSP Shift into a mode-based rhythm coach with reset logging.
- [ ] App 1: add change-management guardrails for risky work.
- [ ] App 1: add learning seed fields to work logs.
- [ ] App 1: add After Action Review for selected work logs.
- [ ] App 1: add ticket-note drills from real work logs.
- [ ] App 1: add local KB hints without scraping Drive or importing private KB content.
- [ ] App 2: set title/metadata to `Avance PD` and clarify app purpose.
- [ ] App 2: upgrade PD Focus Today into a deterministic next-best-action engine.
- [ ] App 2: add scenario-to-ticket-note practice flow.
- [x] App 2: build manager-safe Evidence Pack copy/export.
- [ ] App 2: add MSP skill map / mastery map.
- [ ] App 2: improve follow-up area into operational discipline training.
- [ ] App 2: add communication practice templates and tone checklist.
- [ ] App 2: add onboarding-safe demo data badges and reset controls.
- [ ] App 2: add privacy and safety linting for entries.
- [ ] App 2: create manager-ready weekly PD review.
- [x] App 2: build KB Learning Machine shell.
- [x] App 2: build KB Map and field cards.
- [x] App 2: add spaced repetition scheduling.
- [x] App 2: build active recall flashcards from field cards.
- [x] App 2: build scenario-first learning mode.
- [x] App 2: add ticket-note drill practice.
- [x] App 2: connect evidence to KB reviews, scenarios, notes, field cards, and reflections.
- [x] App 2: add Daily Learning Plan.
- [x] App 2: add reflection-based Teach-back Mode.

### 4.5 Prompt Pack & Coaching Improvements
- [x] Create `docs/guides/prompt_pack_recommendations.md` to capture AI prompt packs and enhancement ideas for both Avance apps
- [ ] Update the browser title for Avance Work Companion from the placeholder label to `Avance Work Companion`
- [x] Update the browser title for Avance PD from `Create Next App` to `Avance PD`
- [ ] Add visual overdue indicators for follow-ups and pending tasks across dashboards
- [ ] Add quick-add buttons for common log types such as ticket notes, client calls, and learning actions
- [ ] Add a daily briefing flow summarising next shift, open follow-ups, pending tasks, and recent work logs
- [ ] Add a healthy-shift coaching flow for water, eye breaks, outdoor minutes, and quick reset suggestions
- [ ] Add a repeat-issue coach flow to identify recurring problems and propose playbooks or knowledge notes
- [ ] Add a work log summariser to convert raw capture into concise ticket notes with actions and tags
- [ ] Add a micro-learning booster to recommend relevant learning content based on current tasks
- [ ] Add a backup reminder flow for export and Supabase sync with weekly prompts
- [ ] Add a PD focus overview flow summarising learning progress, hours, targets, and the next best move
- [ ] Add a weekly retrospective flow that reviews recent logs, pending tasks, and improvement suggestions
- [ ] Add a task breakdown flow that turns pending tasks into smaller steps with estimated durations
- [ ] Add a follow-up triage flow for client/third-party tickets with concise action suggestions or message templates
- [ ] Add a learning cockpit navigator to recommend modules aligned with current tasks or gaps
- [ ] Add a progress analytics flow showing hours worked, tasks completed, and skills practised
- [ ] Add feature ideas for weekly calendar view, task-to-learning linking, and simple analytics

## Phase 5: Advanced Features & Integration

### 5.1 Data Management
- [ ] Implement JSON export/import
- [ ] Add data backup reminders
- [ ] Build data migration tools
- [ ] Add bulk operations for cleanup
- [ ] Implement data validation on import

### 5.2 Optional Sync (Future)
- [ ] Design Supabase integration for cloud sync
- [ ] Add selective sync options
- [ ] Implement conflict resolution
- [ ] Add offline-first sync strategy
- [ ] Build multi-device support

### 5.3 Analytics & Insights
- [ ] Add usage analytics (local only)
- [ ] Build productivity insights
- [ ] Implement trend analysis for tasks/logs
- [ ] Add PD progress analytics
- [ ] Create reporting dashboards

## Phase 6: Testing & Deployment

### 6.1 Testing
- [ ] Write unit tests for core logic
- [ ] Add integration tests for data flow
- [ ] Perform cross-browser testing
- [ ] Test offline functionality
- [ ] Conduct usability testing with target workflows

### 6.2 Deployment
- [ ] Set up build process for production
- [ ] Configure PWA manifest
- [ ] Add deployment to GitHub Pages/Netlify
- [ ] Set up CI/CD pipeline (optional)
- [ ] Create installation instructions

### 6.3 Documentation
- [ ] Update app README with setup instructions
- [ ] Create user onboarding flow
- [ ] Add in-app help and tooltips
- [ ] Build troubleshooting guide
- [ ] Create video walkthroughs (future)

## Phase 7: Launch & Iteration

### 7.1 Launch Preparation
- [ ] Populate with realistic seed data
- [ ] Test end-to-end workflows
- [ ] Add final polish and animations
- [ ] Create backup/restore testing
- [ ] Prepare for first week of use

### 7.2 Post-Launch Improvements
- [ ] Monitor usage and gather feedback
- [ ] Add most-requested features
- [ ] Optimize based on real MSP workflows
- [ ] Enhance PD tracking based on Josh's needs
- [ ] Iterate on UI/UX based on usage patterns

### 7.3 Long-term Maintenance
- [ ] Plan for Avance-specific updates
- [ ] Add new tool integrations as needed
- [ ] Maintain seed data relevance
- [ ] Update PD content regularly
- [ ] Plan for scalability if team expands

## Success Metrics
- [ ] App loads in <2 seconds
- [ ] Quick capture takes <30 seconds
- [ ] Search finds relevant results in <1 second
- [ ] PD progress is measurable and motivating
- [ ] Josh can prepare for shifts in <15 minutes
- [ ] Continuity between shifts is seamless

## Risk Mitigation
- [ ] Regular data backups
- [ ] Privacy-first design (no external data sharing)
- [ ] Offline functionality for field work
- [ ] Simple architecture to avoid complexity
- [ ] Focus on core workflows over feature creep

## Timeline Estimate
- **Phase 1-2**: 2-4 weeks (core app development)
- **Phase 3**: 1-2 weeks (polish and UX)
- **Phase 4**: 1 week (PD integration)
- **Phase 5-6**: 1-2 weeks (advanced features and deployment)
- **Phase 7**: Ongoing (iteration and maintenance)

## Priority Guidelines
1. **Must-have**: Dashboard, shift prep, work logs, tasks, knowledge base
2. **Should-have**: Playbooks, clients, time logging, search
3. **Nice-to-have**: Advanced PD features, analytics, sync
4. **Future**: Team features, external integrations

## Dependencies
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for components
- Dexie for IndexedDB
- Date-fns for date handling
- Fuse.js for search
- PWA support for offline use

This TODO list provides a comprehensive roadmap to build a highly useful Avance Work Companion that maximizes Josh's effectiveness in his MSP role while prioritizing professional development.
>>>>>>> 7dc8f7c (Initial Avance professional development app)
