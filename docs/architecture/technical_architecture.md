# Technical Architecture Recommendation

## Recommended stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- local database first:
  - simplest path: IndexedDB via Dexie or local persistence layer
  - optional later: Supabase for sync
- Zod for schema validation
- date-fns for date logic
- Fuse.js or equivalent for simple client-side search
- PWA support for installable local use

## Why local-first first
This app is personal and operational.
Local-first gives:
- privacy
- speed
- offline usefulness
- no setup friction
- lower risk

## Suggested folder structure
/app
  /(app)/dashboard
  /(app)/shifts
  /(app)/work-log
  /(app)/tasks
  /(app)/knowledge
  /(app)/playbooks
  /(app)/clients
  /(app)/tools
  /(app)/time
  /(app)/learning
  /(app)/search
  /(app)/settings

/components
  /layout
  /dashboard
  /shifts
  /forms
  /knowledge
  /playbooks
  /time
  /shared

/lib
  /db
  /schema
  /seed
  /search
  /utils
  /constants

/types
  app.ts

/docs
  architecture.md
  first-week-setup.md
  extension-guide.md

## Suggested data entities
### Shift
- id
- scheduledDate
- startTime
- endTime
- actualStart
- actualEnd
- status
- billedStatus
- rate
- note
- priorities[]
- prepChecklist[]

### WorkLog
- id
- createdAt
- shiftId
- clientId
- title
- summary
- actionsTaken
- result
- nextStep
- tags[]

### Task
- id
- title
- details
- status
- priority
- dueDate
- clientId
- linkedWorkLogIds[]

### KnowledgeEntry
- id
- title
- body
- category
- tags[]
- confidence
- verifiedAt
- state
- clientIds[]

### Playbook
- id
- title
- issueType
- symptoms[]
- quickChecks[]
- deepChecks[]
- escalationRules[]
- notes
- relatedKnowledgeIds[]

### Client
- id
- name
- sector
- summary
- quirks
- contacts[]
- notes

### LearningItem
- id
- topic
- confidence
- seenInRealWork
- askTeam
- notes
- nextReview

### Invoice
- id
- periodStart
- periodEnd
- lineItems[]
- total
- status

## Sensible v1 boundaries
Implement in v1:
- CRUD for major entities
- dashboard
- search
- seed data
- invoice preview

Defer:
- real email ingestion
- real PSA integrations
- attachment handling
- OCR
- AI summarisation
- multi-user auth
