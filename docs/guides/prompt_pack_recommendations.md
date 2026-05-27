# Prompt Pack Recommendations for Avance Apps

This document captures the prompt pack recommendations and product enhancement ideas for both Avance apps, based on the live dashboard experience and the current app structure.

## Purpose
These prompt packs are designed to help the Avance apps become more useful as dynamic coaching systems, not just dashboards. They should guide users through:
- daily planning and focus
- healthy shift habits
- knowledge capture and follow-up
- professional development progress
- task and learning alignment

## App 1 — Avance Work Companion (`avance-pd.vercel.app`)

### Key prompt pack opportunities
1. **Codex/VScode prompt — Rename and improve the dashboard title**
   - Update the app shell and document title from the placeholder label to `Avance Work Companion`.
   - Ensure the browser tab shows the product name clearly.

2. **Daily Briefing**
   - Summarise next shift info, invoice cycle, open follow-ups, pending tasks, and recent work logs.
   - Flag overdue or high-priority items.

3. **Health Check**
   - Review Healthy MSP Shift stats for water intake, outdoor minutes, and eye breaks.
   - Suggest a quick reset or break when metrics are low.

4. **Repeat-Issue Coach**
   - Scan recent work logs for recurring problems.
   - Draft a short troubleshooting playbook or knowledge note for future reuse.

5. **Work Log Summariser**
   - Convert quick-capture work logs into concise ticket notes.
   - Extract key actions, decisions, and tags for skills or playbooks.

6. **Micro-Learning Booster**
   - Recommend the most relevant micro-learning card or scenario for current tasks.
   - Explain why it is useful and how long it takes.

7. **Backup Reminder**
   - Remind users to export data or sync with Supabase if it has been more than a week.
   - Explain why backups matter.

### Small product improvements
- Update the page title to `Avance Work Companion`.
- Add visual indicators for overdue follow-ups and pending tasks.
- Add quick-add buttons for common log types: ticket note, client call, learning action.
- Use the app’s existing health and learning sections to surface AI coaching suggestions.

## App 2 — Avance PD (`avance-professional-development.vercel.app`)

### Key prompt pack opportunities
1. **Codex/VScode prompt — Fix page title and branding**
   - Change the document title from `Create Next App` to `Avance PD`.
   - Ensure the app header uses the `Avance PD` branding.

2. **PD Focus Overview**
   - Summarise learning progress, hours worked this month, remaining targets, and the Next Best Move.
   - Explain why the recommended move is important.

3. **Weekly Retrospective**
   - Review recent work logs and pending tasks from the last week.
   - Identify patterns, bottlenecks, and recommended improvements.

4. **Task Breakdown**
   - Turn each pending task into smaller actionable steps with estimated durations.
   - Highlight dependencies or risks.

5. **Learning Cockpit Navigator**
   - Recommend a Learning Cockpit module aligned with current tasks or skill gaps.
   - Explain why it is a good fit.

6. **Follow-Up Triage**
   - Review follow-ups waiting on clients or third parties.
   - Suggest concise action steps or follow-up message templates.

7. **Shift Health Monitor**
   - Use Healthy MSP Shift stats to show whether water intake, outdoor minutes, and eye breaks are on track.
   - Recommend a short exercise or mindfulness activity if needed.

8. **Progress Analytics**
   - Generate a simple report showing hours worked, tasks completed, and skills practised.
   - Use charts or bullet points to show trends.

### Additional product ideas
- Add a weekly calendar view of shifts and training sessions.
- Link learning modules to specific tasks or logs for explicit knowledge transfer.
- Build simple analytics for hours per category and skills practised.
- Use the PD Focus and Next Best Move cards to guide AI-driven daily planning.

## General prompt pack guidance
- Make coder prompts specific to the actual stack and app area.
- Include context so the assistant knows this is an operational MSP coaching app, not a full PSA.
- Define success criteria in the prompt so the AI does not overbuild.
- Use app data and dashboard widgets as sources for the prompts.

## Next actions
- Use this prompt pack as a guide for implementation tasks.
- Add AI coaching flows into the dashboards and prompt-based helpers.
- Keep the app focused on structured operational work, handover, learning, and healthy shift habits.
