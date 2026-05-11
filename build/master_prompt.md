You are Claude Code, acting as a senior product engineer, UX designer, and practical MSP workflow analyst.

I want you to build a private app for me called **Avance Work Companion**.

## Context
I start work with **Avance Business Technology** on **Monday 20 April 2026**.
I will work there every **Monday and Wednesday from 8:30am to 5:00pm**.

This app is for **me personally**, not for public customers.
It should help me:
- prepare before work
- stay organised during shifts
- capture technical knowledge quickly
- reduce cognitive load
- retain continuity between part-time days
- log my hours and invoice cleanly
- build confidence in MSP workflows

## Important product framing
This is **not** a PSA, RMM, or replacement for Avance’s existing systems.
It is my **personal work companion**.

The app should support:
1. **Pre-shift preparation**
2. **In-shift operational support**
3. **Post-shift handover and reflection**
4. **Knowledge capture**
5. **Troubleshooting playbooks**
6. **Time logging and invoice prep**
7. **Learning and ramp-up tracking**

## Known company context to design around
Use this context while designing the product:
- Avance publicly presents as a managed IT, security, cloud, backup/recovery, device management, PBX, and development provider.
- Their public support workflow includes:
  - RustDesk for remote support
  - a ticket portal
  - support email
  - phone contact
- Their website publicly lists:
  - Andrew Johnston — Managing Director
  - James Newby — Head Technician
  - Xavier Johnston — Developer
  - Edwin Schmidt — Business Development Manager
- Public site lists offices in Dubbo and Hobart.
- Public site positions Avance as serving businesses and communities across Australia, with sectors including professional services, schools, retail, hospitality/accommodation, and medical practices.
- My actual use case is likely regional MSP support, user support, onsite work, remote support, Microsoft / Google / Windows / networking / Wi-Fi / printers / accounts / general business IT, and ad hoc technical problem solving.
- I will only work there part-time, so the app must help me re-enter context fast every shift.

## Core design principles
Build the app around these principles:
- **Low cognitive load**
- **Fast re-entry after days away**
- **Capture first, organise second**
- **Searchable everything**
- **Private by default**
- **Calm, practical UI**
- **No gimmicks**
- **Strong keyboard support**
- **Good offline behaviour**
- **Safe handling of sensitive information**
- **Optimised for real MSP work, not startup fantasy workflows**

## What the app should contain

### 1. Home dashboard
A clear dashboard showing:
- whether today is an Avance work day
- next scheduled shift
- pre-shift checklist
- top follow-ups
- recent notes
- outstanding tickets/tasks I have logged manually
- quick links to common modules
- weekly learning focus
- time logged this pay/invoice cycle

### 2. Shift Prep
A dedicated pre-shift workflow:
- “Today’s shift” view
- arrive-by time
- transport/travel note
- bag/tools checklist
- open-before-start checklist
- review last shift handover
- review outstanding tasks
- set today’s 3 main priorities
- mindset / calm-start box
- recurring Monday/Wednesday templates

### 3. Work Log / Handover
A fast way to record:
- what I worked on
- who I helped
- key findings
- blockers
- follow-up needed
- next-step owner
- whether something should become a playbook
- whether something should become a client note
- end-of-shift summary

This should make re-entry easy on the next work day.

### 4. Ticket and Task Capture
Because I may not have direct integration with Avance systems, support:
- manual ticket entry
- quick-capture from notes
- priority
- client
- device/user affected
- status
- due / follow-up date
- linked knowledge entries
- linked shift logs

Make this useful even without API access.

### 5. Knowledge Base
A searchable internal knowledge space for:
- client notes
- site notes
- common fixes
- recurring issues
- device setup steps
- onboarding notes
- known quirks
- tool notes
- vendor notes
- “don’t forget this” warnings

Knowledge entries should support:
- tags
- category
- related clients
- related tickets
- confidence level
- last verified date
- draft vs trusted
- attach screenshots/files later

### 6. Troubleshooting Playbooks
A playbook builder and runner for common MSP issues such as:
- no internet
- printer offline
- Outlook not sending/receiving
- password / account lockout
- Wi-Fi weirdness
- Teams / Zoom audio issues
- shared drive / OneDrive / Google Drive confusion
- slow PC
- browser issue
- display / dock / monitor issue
- Microsoft 365 sign-in issue
- backup warning follow-up
- RustDesk remote support prep
- onsite visit checklist

Each playbook should support:
- symptoms
- quick triage questions
- probable causes
- step-by-step checks
- escalation conditions
- notes from actual field use
- “worked last time” shortcuts

### 7. Tools & Systems Reference
Create a section for Avance-related public workflow references and my own notes for:
- RustDesk
- ticket portal
- support email
- phone numbers
- office details
- key teammates
- common tool stack notes
- common categories of work
- client sectors

This section should clearly separate:
- public info
- my personal notes
- assumptions / unverified items

### 8. Time Logging & Invoice Support
This is important.

I want:
- recurring Monday/Wednesday shift schedule
- quick time logging
- manual adjustments
- notes per shift
- total hours per invoice cycle
- simple invoice export data
- contractor-style summary
- ability to mark shifts billed / unbilled / paid

Use an initial example based on:
- 8.5-hour day
- $65/hour
- Monday + Wednesday shifts

### 9. Learning Tracker
I want to ramp up intentionally.
Build:
- topics to learn
- tools to learn
- confidence score
- notes
- “seen in real work” toggle
- “need help from Andrew / James / team” queue
- spaced review or revisit prompts

### 10. Search
Global search across:
- notes
- playbooks
- clients
- tasks
- shift logs
- learning items

### 11. Settings / Security
Include:
- private local storage mode
- optional Supabase mode later
- export / import JSON
- backup reminders
- redaction warnings
- “don’t store passwords here” warnings
- optional lock screen / PIN for local use

## Must-have implementation requirements
Build this as:
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- App Router
- clean, production-grade structure
- simple but solid data model
- PWA-friendly
- mobile-friendly but desktop-first
- dark mode
- excellent empty states
- strong form UX
- keyboard shortcuts where sensible

## Data model recommendations
Include models such as:
- Shift
- ShiftTemplate
- WorkLog
- Task
- TicketNote
- KnowledgeEntry
- Playbook
- PlaybookRun
- Client
- Contact
- ToolReference
- LearningItem
- Invoice
- InvoiceLine
- AppSetting
- Tag

## Important constraints
- Do **not** store real passwords or sensitive client secrets in v1
- Do **not** claim integration with Avance systems unless implemented cleanly
- Do **not** scrape or automate against systems that may violate terms
- Do **not** make the UI noisy or “gamified”
- Do **not** build a generic fake startup SaaS dashboard
- Do **not** optimise for teams first; optimise for one operator first

## UX tone
The app should feel:
- calm
- trustworthy
- practical
- lightly technical
- low-friction
- clear under stress
- made for real work

## Deliverables I want from you
In the repo, create:
1. A working app scaffold
2. Seed data
3. A README
4. A short architecture doc
5. A “first week setup” guide
6. A “how to extend later” guide
7. Sensible sample playbooks
8. Sensible sample client cards
9. A time logging and invoice workflow
10. A polished dashboard and navigation

## Build order
Please work in this order:
1. Define product structure and folders
2. Define schema/types
3. Build navigation and layout
4. Build dashboard
5. Build shifts / time logging
6. Build work logs and tasks
7. Build knowledge base
8. Build playbooks
9. Build learning tracker
10. Add search
11. Add import/export
12. Polish UI and docs

## Output style
Do not just discuss.
Actually scaffold the project and implement the first usable version.

At the end, provide:
- what you built
- what is real vs mocked
- what still needs manual setup
- the fastest next 5 improvements

Now start by:
1. creating the project structure
2. generating the core types/schema
3. building the app shell
4. implementing the dashboard and shift log first
