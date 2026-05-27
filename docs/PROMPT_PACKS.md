# AI Prompt Packs for Avance Apps

This document captures the prompt-pack ideas and implementation guidance for the two Avance apps:

- **Avance Work Companion** (`avance-pd.vercel.app`)
- **Avance PD** (`avance-professional-development.vercel.app`)

Use this as a source of truth for prompt-driven features, browser title fixes, app branding, and workflow improvements.

## App 1 — Avance Work Companion

### Purpose
Avance Work Companion is a lightweight MSP work companion for Josh at Avance Technology. It should help capture local work logs, follow-ups, learning notes, task reminders, shift context, and healthy-work habits without becoming a full PSA.

### Key prompt ideas

1. **Daily Briefing**
   - Prompt: "Summarise my next shift info, invoice cycle, open follow-ups, and recent work logs. Tell me what to focus on today and flag any overdue items."
   - Value: consolidates shift priorities, pending reminders, and recent ticket activity.

2. **Health Check**
   - Prompt: "Review the Healthy MSP Shift section for water intake, outdoor time and eye-break stats. Suggest a quick reset or break if any metric is low."
   - Value: nudges sustainable habits based on the current health tracker.

3. **Repeated Issue Coach**
   - Prompt: "Scan my recent work logs and repeated issue suggestions. Identify common problems and draft a short playbook or knowledge note I could save."
   - Value: turns repeated problems into structured guidance.

4. **Work Log Summariser**
   - Prompt: "I just captured a work log. Summarise it into a concise ticket note, extract key actions, and tag any related skills or playbooks."
   - Value: improves follow-up quality and saves time.

5. **Micro-Learning Booster**
   - Prompt: "Recommend the most relevant scenario or micro-learning card based on my current tasks. Explain how it will help me improve."
   - Value: keeps learning aligned with real work.

6. **Backup Reminder**
   - Prompt: "Check when I last exported a backup or synced to Supabase. If it’s been more than a week, remind me to export my data and explain how to do it safely."
   - Value: protects app data with a low-risk prompt.

### App identity and branding

- Fix the browser title to **Avance Work Companion**.
- Add metadata for title and description:
  - title: "Avance Work Companion"
  - description: "Local-first work companion for Avance shifts, tasks, follow-ups, work logs, and professional development."
- Keep the primary product name consistent in header, sidebar, and dashboard.
- Add a dashboard subtitle: "Capture work, follow up clearly, and keep the shift sustainable."

### Feature and design notes

- Make overdue follow-ups and open tasks more visible.
- Add quick-add buttons for common capture types: ticket note, client call, learning.
- Avoid overbuilding the app into a full PSA; keep it focused on local work capture, follow-up discipline, PD hints, and health reminders.

## App 2 — Avance PD

### Purpose
Avance PD is the professional development-focused app. It should emphasise learning progress, skill growth, evidence capture, and manager-safe summaries while still supporting follow-up triage and healthy shift habits.

### Key prompt ideas

1. **PD Focus Overview**
   - Prompt: "Summarise my learning progress, hours worked this month, and remaining targets. Highlight the Next Best Move from the PD Focus area and explain why it’s important."
   - Value: keeps PD goals aligned with current workload.

2. **Weekly Retrospective**
   - Prompt: "Review my recent work logs and pending tasks. Identify patterns or bottlenecks, suggest improvements, and recommend one skill or scenario to practise."
   - Value: supports continuous improvement.

3. **Task Breakdown**
   - Prompt: "For each pending task, break it into smaller actionable steps with estimated durations. Flag any dependencies or risks."
   - Value: turns high-level tasks into a manageable plan.

4. **Follow-Up Triage**
   - Prompt: "Review my follow-up area. For each ticket waiting on a client or third party, draft a concise action or follow-up message to move it forward."
   - Value: helps maintain momentum on outstanding work.

5. **Learning Cockpit Navigator**
   - Prompt: "Using the Learning Cockpit info on the dashboard, suggest a module that aligns with my current tasks or skill gaps and explain why it’s a good fit."
   - Value: personalises learning recommendations.

6. **Shift Health Monitor**
   - Prompt: "Based on my Healthy MSP Shift stats, tell me whether I’m on track with water check-ins, outdoor minutes and eye breaks. If I’m behind, propose a short exercise or mindfulness activity."
   - Value: extends health coaching to PD-centric workflows.

### App identity and branding

- Fix the browser title to **Avance PD**.
- Update generic references from "Create Next App" to "Avance PD".
- Keep the app name and header consistent across the dashboard and metadata.
- Avoid mixing the App 1 brand name into this app.

### Feature and design notes

- Add a weekly calendar view of shifts and training sessions.
- Link learning modules to specific tasks or logs to make knowledge transfer explicit.
- Add simple analytics for hours spent per category, skills practised, and progress trends.
- Add onboarding-safe demo data and reset controls.

## Prompt pack implementation guidance

These prompt packs should guide both product planning and code changes. The core work is:

- Document prompt-based features in the repo.
- Add tasks to the root and docs TODO lists.
- Fix app titles and metadata first as low-risk improvements.
- Build prompt-driven helpers around the existing dashboard sections, not new unrelated screens.

## Tracking

- Add this document to the `docs/` folder.
- Use the root `TODO.md` and `docs/TODO.md` to track the prompt-pack tasks.
- Keep the prompt-pack doc as a reference for future AI-driven enhancements.
