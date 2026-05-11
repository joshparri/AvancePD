# Product Requirements Document

## Product name
Avance Work Companion

## Summary
A private web app for Josh to prepare for, work through, and debrief from Avance IT shifts while building a personal knowledge system for MSP work and tracking professional development in IT MSP skills.

## Primary jobs to be done
### Before work
- know what today is
- know the next shift
- review prior handover
- review open tasks
- prepare mentally and practically

### During work
- capture notes quickly
- log tickets/tasks manually
- refer to playbooks
- search prior fixes
- record time

### After work
- create a handover
- mark follow-ups
- save new knowledge
- update learning items
- track professional development progress
- prep invoice data

## Core modules

### Dashboard
Must show:
- today / next shift
- outstanding follow-ups
- recent work logs
- quick capture
- current invoice-cycle hours
- today’s top priorities
- recent knowledge and playbooks

### Shift Scheduler
Must support:
- recurring Monday / Wednesday shifts
- manual exceptions
- shift status
- start/end times
- notes
- billed/unbilled/paid state

### Work Logs
Must support:
- timestamped entries
- client
- issue summary
- actions taken
- result
- next step
- tags
- related task/playbook/knowledge entry

### Tasks
Must support:
- quick capture
- due date
- priority
- client
- status
- linked work log
- carry-forward between shifts

### Knowledge Base
Must support:
- note title
- summary
- body
- category
- tags
- confidence level
- last verified
- related client
- source type: personal note / public info / assumption / tested fix

### Playbooks
Must support:
- issue type
- symptoms
- first checks
- deeper checks
- escalation threshold
- notes from field use
- linked knowledge entries

### Clients
Must support:
- client name (internal reference only)
- sector
- environment notes
- known quirks
- open items
- recent issues

### Tools & Systems
Must support:
- public company contact details
- internal notes about tools
- quick links
- caution banners for unverified assumptions

### Time Logging
Must support:
- time entry per shift or per task block
- totals by date range
- invoice-cycle summary
- billable notes
- export-ready invoice line items

### Learning Tracker
Must support:
- topic (IT MSP skills, tools, processes)
- confidence rating
- notes on progress
- seen in real work
- ask team about this
- next review date
- professional development goals and milestones

### MSP Skills Academy
Must support:
- MSP skill taxonomy across helpdesk, endpoint support, Microsoft 365, Entra ID, Intune, networking, cybersecurity, backup/DR, RMM/PSA operations, scripting, documentation, communication, escalation judgement, and service management
- readiness levels: unseen, learning, practised, work-ready, evidence-proven
- realistic ticket/scenario practice
- ticket note practice using issue, impact, checks, action, result, next step, and escalation reason
- evidence pack summaries of skills practised, scenarios completed, notes written, weak areas, next recommended study, and practical outputs
- MSP roadmap from Level 1 foundations to L2 readiness
- communication practice for frustrated users, managers, security warnings, outages, delays, escalations, and ticket closure
- rule-based next best action recommendations

## Success criteria
- Josh can understand the state of work within 1 minute of opening the app
- Josh can record a useful work log in under 30 seconds
- Josh can find a prior relevant note in under 10 seconds
- Josh can prepare an invoice draft without rebuilding the week manually
- Josh can carry context from one shift to the next without relying on memory alone
- Josh can track and demonstrate progress in IT MSP professional development
- Josh can practise MSP judgement, produce professional evidence, and identify the next best skill action

## Risks
- scope creep into full PSA territory
- storing sensitive information unsafely
- too much manual entry burden
- overdesigned dashboard
- not enough friction reduction for real use

## Risk responses
- keep v1 personal and manual-first
- add warnings around secrets
- optimise for quick capture
- prefer simple defaults
- build from realistic MSP scenarios
