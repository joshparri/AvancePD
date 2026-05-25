# Health & Outdoors Module Implementation Plan

**Repository:** joshparri/AvanceProfessionalDevelopment  
**Status:** Ready for implementation  
**Date Created:** May 25, 2026  
**Version:** 1.0

---

## Executive Summary

The Health & Outdoors module will help Josh stay physically, mentally, and spiritually healthier while working ICT/MSP shifts at Avance, especially Mondays and Wednesdays (8:30am–5:00pm).

**Key Goals:**
- Encourage water intake, outdoor daylight, screen breaks, posture resets, and short walks
- Support lunch away from screen and end-of-day work shutdown
- Enable nervous-system downshifts after stressful tickets
- Provide gentle, shame-free tracking and weekly reflection

**Constraints:**
- Local-first storage only (no backend yet)
- No medical records, client data, passwords, hostnames, or IP addresses
- Gentle, practical tone; avoid medical promises
- Workplace-appropriate
- Server-side rendering safe

---

## Technical Architecture

### Repository & Context
- **Repository:** joshparri/AvanceProfessionalDevelopment (GitHub)
- **App Root:** `/app`
- **Framework:** Next.js 16.2.4 with App Router
- **Storage Pattern:** 
  - localStorage for simple state (safe with `typeof window !== 'undefined'` checks)
  - Optional Dexie for relational data
- **UI Components:** shadcn/ui (Card, Button, Badge, Dialog, Input, Textarea)
- **Icons:** lucide-react

### Key Findings from Code Inspection

**Routing Pattern:**
- Uses Next.js App Router directories
- Each route is a folder under `/src/app/` with `page.tsx`
- Example: `/src/app/msp-skills/page.tsx` accessible at `/msp-skills`

**Layout & Navigation:**
- All pages wrap with `<Layout>` component from `Layout.tsx`
- Navigation items defined as array in `Navigation.tsx`
- Supports desktop (horizontal nav with overflow scroll) + mobile (vertical list)
- Uses lucide-react icons throughout

**Data Storage Pattern:**
- **localStorage:** Simple key-value for state (see `mspProgress.ts`)
  - Safe: Check `typeof window !== 'undefined'` before accessing
  - Pattern: `canUseLocalStorage()` helper + try-catch
  - Examples: `getStoredSkillReadiness()`, `setStoredSkillReadiness()`
- **Dexie:** Relational database (already set up in `db.ts`)

**Existing Components:**
- UI: `/src/components/ui/` includes Card, Badge, Button, Input, Textarea, Dialog
- Shared: Layout, Navigation, Dashboard, DarkModeToggle
- Pages use `'use client'` directive for client-side interactivity

**Current Navigation Items:**
```
- Dashboard (Home)
- Shifts (Calendar)
- Work Logs (NotebookText)
- MSP Skills (Target)
- MSP Scenarios (ClipboardList)
- MSP Quiz (Brain)
- Learning Cockpit (Lightbulb)
- Tool Primers (Wrench)
- Ticket Notes (ClipboardCheck)
- Evidence Pack (Archive)
- MSP Roadmap (Map)
```

---

## Implementation Phases

### Phase 1: Core Route & Navigation

**Objective:** Create the route and make it navigable

**Tasks:**
1. Create `/src/app/health-outdoors/page.tsx` with basic layout
2. Add navigation item to `Navigation.tsx`
   - Name: "Health & Outdoors"
   - Icon: HeartPulse (from lucide-react)
   - href: "/health-outdoors"
3. Wrap page in existing Layout component
4. Verify build succeeds
5. Test nav link on desktop and mobile

**Files to Create:**
- `app/src/app/health-outdoors/page.tsx`

**Files to Edit:**
- `app/src/components/Navigation.tsx`

**Acceptance Criteria:**
- `/health-outdoors` loads without error
- Navigation link appears on desktop
- Navigation link appears on mobile
- No TypeScript errors
- No existing pages break

---

### Phase 2: Static Data Layer

**Objective:** Define health actions, research cards, and reminders

**Tasks:**
1. Create `/src/data/healthOutdoors.ts`
2. Define TypeScript types:
   - `HealthAction`: id, title, category, durationMinutes, shortPrompt, whyItHelps, workplaceFriendly, defaultReminderTime?
   - `ResearchCard`: id, title, summary, practicalAction, sourceLabel, sourceUrl, confidenceLevel, category
   - `ReminderTemplate`: id, category, message
   - `WeeklyReviewPrompt`: id, question, category

3. Create data arrays:
   - **Health actions** (9 categories): hydration, outdoors, eyes, movement, posture, stress, lunch, shutdown, sleep
     - Example actions: "Drink water", "Step outside for daylight", "Look 20 feet away for 20 seconds", "Relax jaw and shoulders", "Walk for 3–5 minutes", "Eat lunch away from screen", etc.
   - **Research cards** (8+ themes) with "may support", "is associated with" language
     - Themes: Nature exposure, 120 min/week nature, microbreaks & fatigue, daylight & circadian rhythm, movement after sitting, hydration & attention, eye strain & 20-20-20, end-of-day shutdown
   - **Reminder templates** for each category
   - **Weekly review prompts** for reflection

**Files to Create:**
- `app/src/data/healthOutdoors.ts`

**Acceptance Criteria:**
- File exports typed health actions
- All actions have required fields
- Research cards use careful language (no "guarantees")
- No TypeScript errors

---

### Phase 3: Local Storage & Progress Helpers

**Objective:** Implement storage layer for settings and daily logs

**Tasks:**
1. Create `/src/types/healthOutdoors.ts` with types:
   - `HealthOutdoorsSettings`
   - `DailyHealthLog`
   - Export `HealthAction` from data

2. Create `/src/lib/healthOutdoorsStorage.ts` with helper functions:
   - `getTodayHealthLog()` — returns or initializes today's log
   - `saveTodayHealthLog(log)`
   - `incrementWater()` — increments water count
   - `addOutdoorMinutes(minutes)`
   - `completeHealthAction(actionId)` — marks action done
   - `snoozeReminder(minutes)`
   - `enableQuietMode(minutes)`
   - `resetTodayHealthLog()`
   - `exportHealthOutdoorsJson()` — exports all data
   - `getHealthOutdoorsSettings()` and `setHealthOutdoorsSettings()`

3. Pattern after `mspProgress.ts`:
   - `canUseLocalStorage()` helper
   - Try-catch in all functions
   - Validate data on read
   - Default settings if none exist

**Files to Create:**
- `app/src/types/healthOutdoors.ts`
- `app/src/lib/healthOutdoorsStorage.ts`

**Acceptance Criteria:**
- Refreshing page keeps today's progress
- Reset today works
- Export JSON works
- No storage errors during SSR
- All browser-only access guarded safely

---

### Phase 4: Reminder Engine

**Objective:** Implement scheduling and reminder logic

**Tasks:**
1. Create `/src/lib/healthReminderEngine.ts` with functions:
   - `isHealthShiftDay(date, settings)` — checks if Monday/Wednesday
   - `getShiftPhase(date, settings)` — returns phase: "off-shift" | "pre-shift" | "morning" | "lunch" | "afternoon" | "wrap-up"
   - `getDueReminder(now, settings, dailyLog)` — current due reminder or null
   - `getNextReminder(now, settings, dailyLog)` — next upcoming reminder
   - `shouldSuppressReminder(now, settings)` — checks quiet mode, urgent ticket mode
   - `applySnooze(settings, minutes)` — updates snoozeUntil
   - `applyQuietMode(settings, minutes)` — updates quietModeUntil

2. Default schedule (Monday/Wednesday, 8:30–5:00):
   - 08:20: pre-shift water + daylight
   - 09:20: eye break + water
   - 10:30: outdoor reset
   - 11:30: posture + water
   - 12:30: lunch reset
   - 14:15: outdoor walk
   - 15:30: water + stretch + eyes
   - 16:45: shutdown ritual

3. Rules:
   - Reminders are Monday/Wednesday only by default
   - Configurable later
   - Quiet mode suppresses non-essential reminders
   - Urgent ticket mode quiets reminders for 60 minutes
   - Missed reminders do not create shame/failure states
   - Return calm copy for each reminder

**Files to Create:**
- `app/src/lib/healthReminderEngine.ts`

**Acceptance Criteria:**
- Monday 10:30 returns outdoor reminder
- Tuesday returns off-shift
- Quiet mode suppresses reminders
- Snooze updates next reminder time correctly
- All functions are pure and testable

---

### Phase 5: Dashboard Health Card

**Objective:** Add a compact health card to the main dashboard

**Tasks:**
1. Create or update Dashboard component to include Health card
2. Shows: shift phase, next health action, water count, outdoor minutes
3. Quick buttons:
   - Drink Water
   - 2-minute Reset
   - Urgent Ticket Mode
   - Open Health & Outdoors

4. Styled with existing UI components (Card, Badge, Button)
5. Responsive on mobile

**Files to Edit:**
- `app/src/components/Dashboard.tsx`

**Acceptance Criteria:**
- Dashboard still loads without error
- Health card appears below or alongside existing cards
- Drink Water button increments count
- Buttons are accessible and clickable

---

### Phase 6: Health Page UI with Reminder Banner

**Objective:** Build the main Health & Outdoors page with reminder panel and action cards

**Tasks:**
1. Expand `/src/app/health-outdoors/page.tsx` with:
   - **Reminder banner** showing:
     - Current reminder (if any)
     - Why it helps
     - Action buttons: Done, Snooze 15 min, Snooze 30 min, Skip for now, Urgent Ticket Mode
   - **Card grid** with 8 cards:
     - Today's Health Plan
     - Next Tiny Reset
     - Hydration
     - Outdoor Time
     - Eyes & Posture
     - Nervous System Reset
     - Weekly Nature Target
     - End-of-Day Shutdown
   - **Settings panel** (collapsible):
     - Toggle notifications
     - Toggle faith prompts
     - Configure shift days/times
     - Export data

2. Use existing UI components: Card, CardHeader, CardTitle, CardContent, Button, Badge
3. Keep copy encouraging and calm
4. Support dark mode
5. Mobile responsive

**Files to Edit:**
- `app/src/app/health-outdoors/page.tsx`

**Acceptance Criteria:**
- Page loads without error
- Reminder panel displays current/next action
- Action buttons work
- Cards update in real-time
- Responsive on mobile
- Dark mode readable

---

### Phase 7: Browser Notifications

**Objective:** Add optional browser notification support

**Tasks:**
1. Add "Enable browser notifications" button in Health page settings
2. Only request Notification permission after user clicks button (not on load)
3. Check if Notification API available; show fallback message if not
4. Store `notificationsEnabled` in settings
5. If permission denied:
   - Store permission state
   - Do not ask repeatedly
   - Fall back to in-app banners
6. When reminder becomes due (if enabled):
   - Show browser notification with calm copy
   - Examples:
     - "Tiny reset: drink water and look away from the screen."
     - "Step outside if possible. A few minutes of daylight can help you reset."
     - "Shoulders down, jaw soft, breathe slowly, then return to the next ticket."
7. Prevent spam:
   - Track `lastNotificationId` and `lastNotificationTime`
   - Respect quiet mode and snooze

**Important:** Do NOT implement push notifications yet; do NOT add service worker complexity

**Files to Edit:**
- `app/src/app/health-outdoors/page.tsx`
- `app/src/lib/healthOutdoorsStorage.ts`

**Acceptance Criteria:**
- Permission prompt only appears after button click
- Denied permission handled gracefully
- Granted permission shows test notification
- Due reminders can trigger notifications
- No console errors

---

### Phase 8: 2-Minute Reset Flow

**Objective:** Implement a grounded nervous-system reset for stressful moments

**Tasks:**
1. Create reset flow with steps:
   1. Put both feet on the floor
   2. Relax jaw and shoulders
   3. Look away from the screen
   4. Take three slow breaths
   5. Name what you are feeling in one word
   6. Name the next tiny action
   7. Optional faith prompt: "Lord, give me wisdom, patience, and peace for the next step."

2. Features:
   - Triggered from Dashboard and Health page
   - Modal or card layout
   - Faith prompt toggleable in settings
   - Workplace-appropriate
   - Takes 2 minutes or less
   - Buttons: Start, Done, Skip faith prompt, I need quiet mode
   - Calm, grounded, direct copy

3. Tracking:
   - Increment `nervousSystemResets` count
   - Store `lastResetAt` timestamp

**Files to Create (optional):**
- `app/src/components/ResetFlow.tsx` (or inline in page)

**Files to Edit:**
- `app/src/app/health-outdoors/page.tsx`
- `app/src/components/Dashboard.tsx`
- `app/src/lib/healthOutdoorsStorage.ts`

**Acceptance Criteria:**
- Reset flow loads without error
- All steps display
- Faith prompt can be disabled
- Completion increments count
- No sensitive data stored

---

### Phase 9: Weekly Review & Evidence Pack Integration

**Objective:** Provide summary and reflection for manager-safe export

**Tasks:**
1. Add **Weekly Review** section to Health page showing:
   - Water check-ins (count)
   - Outdoor minutes (total)
   - Movement breaks (count)
   - Eye breaks (count)
   - Posture resets (count)
   - Nervous-system resets (count)
   - Lunch away from screen (count)
   - Shutdown completion (% this week)
   - Skipped reminders (count)
   - Urgent ticket mode count

2. Add **reflection prompts**:
   - What helped me stay calm this week?
   - When did I overfocus?
   - Did I get outside on Avance days?
   - Which reminder was most useful?
   - What should be gentler next week?
   - What is one small change for next Monday?

3. Add **manager-safe summary** (copy-to-clipboard):
   - Example: "Josh used a structured wellbeing routine to support sustainable MSP work, including planned hydration, screen breaks, movement resets, outdoor/daylight breaks, and end-of-day shutdown habits."
   - Rules:
     - Do NOT mention ADHD
     - Do NOT mention medical conditions
     - Do NOT mention personal family stress
     - Do NOT include raw health data
     - Keep professional and safe

4. Integration with Evidence Pack:
   - If safe and non-intrusive, add Health & Outdoors as optional section
   - If risky, document TODO and only export inside Health page

**Files to Edit:**
- `app/src/app/health-outdoors/page.tsx`
- `app/src/app/evidence-pack/page.tsx` (optional)

**Acceptance Criteria:**
- Weekly summary is readable and accurate
- Copy-to-clipboard works
- Manager-safe summary avoids private details
- Existing Evidence Pack functionality does not break

---

### Phase 10: Final QA & Polish

**Objective:** Ensure quality, fix errors, and verify all functionality

**Tasks:**
1. **Build & Lint:**
   ```bash
   cd app
   npm run build
   npm run lint
   ```
   - Fix TypeScript errors
   - Fix ESLint errors
   - Fix hydration warnings
   - Fix broken imports

2. **Dark Mode:**
   - Verify all cards readable in dark mode
   - Test reminder banner contrast
   - Test button visibility

3. **Responsive:**
   - Mobile layout (320px, 375px)
   - Tablet layout (768px)
   - Desktop layout (1024px+)

4. **Accessibility:**
   - Buttons have proper labels
   - Icons have alt text or aria-label
   - Forms have associated labels
   - Keyboard navigation works

5. **Manual QA Checklist:**
   - [ ] `/health-outdoors` loads
   - [ ] Navigation link works on desktop
   - [ ] Navigation link works on mobile
   - [ ] Dashboard Health card appears
   - [ ] Drink water increments today's count
   - [ ] Outdoor minutes update
   - [ ] 2-minute reset works
   - [ ] Urgent ticket mode suppresses reminders
   - [ ] Snooze works (15 min, 30 min)
   - [ ] Notification permission only requested after click
   - [ ] Denied notifications fall back to in-app reminders
   - [ ] Weekly review renders
   - [ ] Manager-safe summary copies
   - [ ] Health data export works (JSON)
   - [ ] Reset today works
   - [ ] Page refresh keeps today's data
   - [ ] All existing pages still load:
     - `/` (Dashboard)
     - `/msp-skills`
     - `/msp-scenarios`
     - `/msp-quiz`
     - `/learning-cockpit`
     - `/ticket-notes`
     - `/evidence-pack`
     - `/msp-roadmap`

6. **Performance:**
   - No console errors
   - No warnings
   - localStorage operations are fast
   - No memory leaks

**Files to Edit:** All as needed

**Acceptance Criteria:**
- `npm run build` succeeds with no errors
- `npm run lint` passes or shows only known acceptable warnings
- Manual QA checklist complete
- No regressions in existing pages
- Dark mode works
- Mobile responsive

---

## Storage Schema

### localStorage Keys

```
avance:health-outdoors-settings
avance:health-outdoors-log-<YYYY-MM-DD>
```

### HealthOutdoorsSettings

```typescript
{
  enabled: boolean;
  shiftDays: number[]; // [1, 3] for Mon/Wed
  shiftStart: string; // "08:30"
  shiftEnd: string; // "17:00"
  mondayWednesdayOnly: boolean;
  notificationsEnabled: boolean;
  faithPromptEnabled: boolean;
  quietModeUntil?: string; // ISO datetime
  reminderCadenceMinutes: number;
  emailSetupEnabled: boolean; // false for now
  snoozeUntil?: string; // ISO datetime
}
```

### DailyHealthLog (per day)

```typescript
{
  date: string; // "2026-05-25"
  waterCount: number;
  outdoorMinutes: number;
  movementBreaks: number;
  eyeBreaks: number;
  postureResets: number;
  nervousSystemResets: number;
  lunchAwayFromScreen: boolean;
  shutdownCompleted: boolean;
  skippedCount: number;
  snoozedCount: number;
  urgentTicketModeCount: number;
}
```

---

## Constraints & Guardrails

✅ **Local-first storage** only (no backend yet)  
✅ **No medical records** — action tracking only  
✅ **No client/ticket data** — no hostnames, IPs, screenshots, details  
✅ **No passwords or sensitive credentials**  
✅ **Gentle, practical tone** — encourage, don't shame  
✅ **No medical promises** — use "may support", "is associated with", "research suggests"  
✅ **Workplace-appropriate** — can be shared with manager  
✅ **Server-side rendering safe** — guard localStorage with `typeof window` checks  
✅ **Use careful language** — avoid "guarantees", "cures", "treats"  
✅ **No shame for skipped reminders** — normalize missing checks  
✅ **No red/danger styling** — use calm, neutral colors  

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **localStorage** | Simple, fast, no backend needed; safe pattern already in use |
| **Icon: HeartPulse** | Professional, gentle, easily recognizable |
| **Default Shift: Mon/Wed 8:30–5:00** | Matches Avance actual shift |
| **8 Daily Reminders** | Covers pre-shift, work hours, lunch, afternoon, wrap-up |
| **2-Minute Reset** | Fits into workday; grounded, practical approach |
| **Manager-Safe Export** | Allows Josh to share progress without private details |
| **No Backend Yet** | Keeps MVP focused; enables local-first, privacy-respecting design |
| **Faith Prompt Optional** | Inclusive; respects personal beliefs while providing support |

---

## Timeline & Rollout

**Phase 1–4 (Core):** ~2 hours  
**Phase 5–6 (UI):** ~2 hours  
**Phase 7–9 (Polish):** ~1.5 hours  
**Phase 10 (QA):** ~1 hour  

**Total:** ~6.5 hours (can be parallelized if multiple developers)

---

## Next Steps

1. ✅ Code review of this plan
2. → **Phase 1:** Create route and navigation
3. → **Phase 2:** Add static data
4. → **Phase 3:** Implement storage
5. → **Phase 4:** Build reminder engine
6. → **Phase 5:** Add Dashboard card
7. → **Phase 6:** Build Health page UI
8. → **Phase 7:** Add browser notifications
9. → **Phase 8:** Implement 2-minute reset
10. → **Phase 9:** Weekly review & export
11. → **Phase 10:** QA, polish, deploy
12. → **Commit & Push to GitHub**

---

## Appendix: Research & References

### Health Themes Covered

1. **Nature exposure and mental wellbeing** — Time in nature supports mood and attention
2. **120 minutes per week in nature** — Associated with wellbeing benefits
3. **Microbreaks and fatigue** — Frequent short breaks reduce mental fatigue
4. **Daylight and circadian rhythm** — Morning light regulates sleep and energy
5. **Movement after sitting** — Short walks improve blood flow and focus
6. **Hydration and attention** — Even mild dehydration affects concentration
7. **Eye strain and 20-20-20 rule** — Looking 20 feet away for 20 seconds reduces strain
8. **End-of-day shutdown rituals** — Closing loops and noting next actions improves recovery

### Wording Guidelines

**✓ Use:**
- "is associated with"
- "may support"
- "can help"
- "research suggests"
- "some people find"
- "consider trying"

**✗ Avoid:**
- "guarantees"
- "cures"
- "treats"
- "scientifically proven to"
- "will"
- "medical"
- "condition"
- "disorder"

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-05-25 | Initial implementation plan |

---

**Owner:** Josh Parris  
**Reviewer:** [Pending]  
**Approved:** [Pending]
