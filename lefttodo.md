I'll read through the documentation to understand what's left to do in the app. Let me explore the key docs systematically.   

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/TODO.md#1-1), lines 1 to 100

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/VISION.md)

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/docs/ROADMAP.md)

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/docs/implementation-plans/health-outdoors-implementation-plan.md#1-1), lines 1 to 200

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/docs/HEALTH_OUTDOORS_IMPLEMENTATION.md)

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/docs/LEARNING_MACHINE_TODO.md)

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/docs/AWESOME_IDEAS_AND_VIBE_CODER_PLAN.md#1-1), lines 1 to 250

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/docs/PROMPT_PACKS.md#1-1), lines 1 to 100

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/docs/QA_CHECKLIST.md)

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/docs/implementation-plans/two-app-prompt-pack-roadmap.md#1-1), lines 1 to 150

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/docs/DEVELOPER_README.md)

Now let me check the current app structure to understand what's actually implemented:  

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/src)

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/app/src)

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/README.md)

Read [](file:///c%3A/Users/joshua.parris/OneDrive%20-%20Dubbo%20Christian%20School/Documents/02_Personal/AvancePD/app/README.md)

Based on my review of all the documentation, here's a comprehensive summary of **what's left to do** in this app:

## Current Status Overview

You have **two apps**:
1. **Avance Work Companion** (Vite, root directory) - operational/shift work capture
2. **Avance PD** (Next.js, app folder) - professional development & learning

Both are **local-first, privacy-focused** and **largely feature-complete** for MVP, but there's a backlog of enhancements and integrations.

---

## 🔴 Critical Issues

### 1. **TODO.md Merge Conflict**
The main TODO.md has a git merge conflict (HEAD vs previous commit). This needs to be resolved.

### 2. **Todo.md Blockers**
The root TODO.md is incomplete/conflicted. It lists sections like:
- Cleanup & repo health
- Future improvements  
- Health & Outdoors module
- Prompt packs, AI coaching, and learning machine backlog

---

## ✅ What's Already Done

### Core Features Implemented:
- Dashboard with shift context, follow-ups, quick capture
- Work Logs, Tasks, Knowledge Base, Playbooks
- Time tracking & invoice preview
- Learning Tracker with confidence scoring
- Health & Outdoors module with reminders (local notifications, email, `.ics` export)
- MSP Skills Matrix, Scenario Trainer, Ticket Notes Trainer
- Evidence Pack builder (manager-safe summaries)
- Field Ops cockpit (pending actions, alert sanitizing, security triage)
- Weekly Review with scorecard
- Focus Mode timer with health integration
- Mobile-friendly bottom action bar
- Data export/import and Supabase sync (optional)
- Keyboard shortcut overlay
- Search across all entities
- Dark mode toggle

---

## 📋 What's Left to Do

### **App 1: Work Companion** - Priority Backlog

1. **App Shell Identity** 
   - Fix browser title to "Avance Work Companion" consistently
   - Verify all metadata aligns

2. **Quick Capture Enhancements**
   - Upgrade to ticket-note builder with quality checklist
   - Add "Convert to ticket note" action
   - Improve placeholder templates

3. **Follow-up Triage**
   - Add status (waiting, needs action, blocked)
   - Add next-nudge scheduling
   - Create follow-up wording templates

4. **Playbook Generation**
   - Auto-convert repeated issue tags into draft playbooks
   - Suggest from safe local data only

5. **Learning Integration**
   - Add learning-seed fields to Work Logs
   - Add "After Action Review" (AAR) prompts
   - Mark work logs as learning-worthy
   - Extract learning queue items

6. **Change Guardrails**
   - Add approval/confirmation for risky work (migrations, deletions, policy changes, firewall/DNS, backups, MFA, Conditional Access, scripts, production systems)
   - Track before-state

7. **Ticket-Note Drill from Real Work**
   - Score real work-log ticket notes deterministically
   - Link to KB & scenarios

---

### **App 2: Avance PD** - Priority Backlog

1. **App Shell Identity**
   - Ensure browser title is "Avance PD"
   - Separate branding from App 1

2. **KB Learning Machine**
   - ✅ Seeded field cards exist locally
   - ✅ Spaced review scheduling implemented
   - ❌ **Missing:** Create/edit/delete UI for manual card management
   - ❌ **Missing:** Import from private KB sources (PDFs)
   - ❌ **Missing:** Skill tree/mastery map

3. **Learning Flows**
   - ❌ Scenario-to-ticket-note practice flow (end scenarios with rubric-checked notes)
   - ✅ Active recall flashcards (implemented)
   - ❌ Skill map view for MSP growth
   - ❌ Build mastery map (linking skills → KB cards → scenarios → evidence)

4. **PD Focus Today**
   - ❌ Upgrade from static to deterministic next-best-action engine
   - Link recommendations to current tasks/gaps

5. **Evidence Pack Enhancements**
   - ❌ Add skill-tree section to Evidence Pack
   - ❌ Link KB evidence to proof-of-learning
   - ✅ Manager-safe export (Markdown, JSON, plain text) — partially done

6. **Communication Practice**
   - ✅ Basic rewrite coach implemented
   - ❌ Add categories (client update, escalation, change approval, follow-up, closure, investigation)
   - ❌ Add tone checklist

7. **Follow-up Discipline Training**
   - ❌ Add categories & templates
   - ❌ Stale follow-up indicators
   - ❌ Next-action guidance

8. **Weekly PD Review**
   - ❌ Manager-ready weekly review generation
   - Link to Evidence Pack

---

### **AI/Prompt Packs** - Deferred Features

These require **server-side API keys** (Groq SDK is already available):

1. **Daily Briefing** — Summarize shift priorities, overdue items
2. **Health Check** — Review hydration/breaks and suggest reset
3. **Repeated Issue Coach** — Scan logs, draft playbooks
4. **Work Log Summarizer** — Convert logs to ticket notes, extract actions/skills
5. **Micro-Learning Booster** — Recommend relevant scenarios based on tasks
6. **Backup Reminder** — Track export/sync cadence
7. **PD Focus Overview** — Summarize learning progress & next move
8. **Weekly Retrospective** — Identify patterns, suggest skill practice
9. **Task Breakdown** — Convert tasks to actionable steps
10. **Follow-up Triage** — Draft follow-up messages for stalled work
11. **Learning Cockpit Navigator** — Personalized module recommendations

---

### **Roadmap/Future Work** (Lower Risk)

- Email-to-note import (cleaned communication-note presets)
- Calendar reminders (downloadable `.ics` — already done)
- Attachment support (small safe local files — partially done)
- Smarter suggestions from local tags
- Mobile capture optimization
- PWA enhancements
- Scenario step trainer (reveal clues one at a time) — ✅ partially done
- Skill quest tracks — ✅ partially done
- Personal playbook generator — ✅ partially done
- Weekly scorecard
- Improved mobile bottom actions — ✅ done
- Settings export/import — ✅ done
- Better attachment viewer — ✅ done
- Health reminder test mode — ✅ done

---

### **Higher-Risk Future Work** (Deferred)

- Supabase cloud sync (optional, gated behind settings)
- Gmail/Calendar API integrations
- PSA/RMM integrations
- Unattended email scheduler (needs server cron job)
- External AI coaching APIs

---

## 🎯 Recommended Next Steps

**Priority 1 (Quick wins):**
1. Fix TODO.md merge conflict
2. Fix app title/branding (Work Companion vs PD)
3. Implement Learning Seed fields in Work Logs
4. Add After Action Review prompts

**Priority 2 (High-value):**
1. KB card create/edit/delete UI
2. Scenario-to-ticket-note practice flow
3. Change Guardrails for risky work
4. Skill mastery map view

**Priority 3 (Polish/Integration):**
1. AI prompt packs (requires API keys)
2. Private KB import
3. Advanced Evidence Pack features
4. Communication/follow-up discipline training

---
