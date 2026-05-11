# MSP Professional Development Growth TODO

This checklist turns the MSP Skills Academy specification into practical build work. The goal is to grow the professional development side of the Avance app without bloating it into a fake PSA or generic quiz site.

## Current baseline
- [x] App vision includes professional development as a core purpose.
- [x] Existing TypeScript models include `LearningItem`, `PDGoal`, and `PDAchievement`.
- [x] Existing Dexie database includes `learningItems`, `pdGoals`, and `pdAchievements`.
- [x] Navigation includes a generic `Learning` entry.
- [ ] Dedicated MSP skill taxonomy exists in app data.
- [ ] Dedicated MSP scenario bank exists in app data.
- [ ] MSP Skills Matrix page exists.
- [ ] MSP Scenario Trainer page exists.
- [ ] Ticket Notes Trainer exists.
- [ ] Evidence Pack page exists.
- [ ] MSP Roadmap page exists.
- [ ] Next best action recommendations exist.

## Phase 0: Product alignment
- [x] Create MSP Skills Academy specification.
- [x] Create MSP PD growth TODO.
- [ ] Review this plan against existing `docs/requirements/prd.md`.
- [ ] Decide whether the generic `Learning` nav should become a group or remain a single page with links to MSP sections.
- [ ] Decide whether MSP progress gets its own Dexie tables or maps into existing `LearningItem`, `PDGoal`, and `PDAchievement` records first.
- [ ] Add acceptance criteria for each MSP Academy page to the PRD.

## Phase 1: Data foundation
- [ ] Create `app/src/types/msp.ts`.
- [ ] Add `MspSkill`, `MspReadinessStatus`, and `MspSkillLevel` types.
- [ ] Add `MspScenario`, `MspScenarioDifficulty`, and `MspScenarioAttempt` types.
- [ ] Add `MspRoadmapStage` type.
- [ ] Add `CommunicationPrompt` type.
- [ ] Create `app/src/data/mspSkills.ts`.
- [ ] Seed categories:
  - Helpdesk and triage.
  - Endpoint support.
  - Windows troubleshooting.
  - Microsoft 365 support.
  - Entra ID and identity.
  - Intune and endpoint management.
  - Networking.
  - Cybersecurity.
  - Backup and disaster recovery.
  - RMM and PSA operations.
  - Scripting and automation.
  - Documentation.
  - Client communication.
  - Escalation and professional judgement.
  - Service management and ITIL-style process.
- [ ] Create `app/src/data/mspScenarios.ts`.
- [ ] Add at least 15 scenario records from the specification.
- [ ] Create `app/src/data/mspRoadmap.ts`.
- [ ] Create `app/src/data/communicationPrompts.ts`.
- [ ] Keep all data fictional, generic, and safe for a personal learning app.

## Phase 2: MSP Skills Matrix
- [ ] Create route `app/src/app/msp-skills/page.tsx`.
- [ ] Create `MspSkillCard` component.
- [ ] Create `ReadinessBadge` component.
- [ ] Add search by skill title, category, tools, and examples.
- [ ] Add filters for category and level.
- [ ] Add readiness status display.
- [ ] Add "what to practise next" suggestions.
- [ ] Add weak-area summary using simple rules.
- [ ] Link relevant skills to matching scenarios where possible.
- [ ] Add empty states for no search/filter results.
- [ ] Ensure page works on mobile.

## Phase 3: MSP Scenario Trainer
- [ ] Create route `app/src/app/msp-scenarios/page.tsx`.
- [ ] Create `ScenarioPicker` component.
- [ ] Show ticket text, category, difficulty, and user emotion.
- [ ] Add free-text field for first questions.
- [ ] Add check selection list with expected checks and plausible distractors.
- [ ] Add decision control:
  - Resolve.
  - Gather more information.
  - Escalate.
- [ ] Add ticket note writing field.
- [ ] Add feedback comparison against ideal answer.
- [ ] Score or tag feedback across:
  - First questions.
  - Checks.
  - Unsafe actions avoided.
  - Escalation judgement.
  - Ticket note quality.
  - Communication tone.
- [ ] Save completion status locally if storage is ready.
- [ ] If storage is not ready, clearly stub progress persistence for later.

## Phase 4: Ticket Notes Trainer
- [ ] Create route `app/src/app/ticket-notes/page.tsx`.
- [ ] Teach note structure:
  - Issue.
  - User impact.
  - Checks performed.
  - Action taken.
  - Result.
  - Next step.
  - Escalation reason if applicable.
- [ ] Add poor, okay, and excellent examples.
- [ ] Add note writing text area.
- [ ] Add rubric checklist.
- [ ] Add self-review prompts.
- [ ] Add "convert this into a KB article" future placeholder.
- [ ] Add downloadable or copyable Markdown summary later.

## Phase 5: Communication practice
- [ ] Add communication prompts to `app/src/data/communicationPrompts.ts`.
- [ ] Include:
  - Frustrated user.
  - Non-technical manager.
  - Security warning.
  - Outage update.
  - Saying "I need to escalate this".
  - Asking for more information.
  - Explaining a delay.
  - Closing a ticket professionally.
- [ ] Add model responses that are calm, clear, brief, and professional.
- [ ] Add "rewrite this response" interaction.
- [ ] Add tone checklist:
  - Calm.
  - Specific.
  - No blame.
  - No overpromising.
  - Clear next step.

## Phase 6: Evidence Pack
- [ ] Create route `app/src/app/evidence-pack/page.tsx`.
- [ ] Summarise:
  - Skills practised.
  - Scenarios completed.
  - Modules completed.
  - Notes written.
  - Weak areas identified.
  - Next recommended study areas.
  - Practical outputs created.
- [ ] Pull from existing `LearningItem`, `PDGoal`, and `PDAchievement` where possible.
- [ ] Add simple manual evidence entries if automated data is not ready.
- [ ] Add Markdown export.
- [ ] Keep export professional and manager-safe.
- [ ] Avoid inflated wording or confidential client details.

## Phase 7: MSP Roadmap
- [ ] Create route `app/src/app/msp-roadmap/page.tsx`.
- [ ] Add eight stages:
  - Stage 1: Level 1 Helpdesk Foundations.
  - Stage 2: Endpoint and Windows Confidence.
  - Stage 3: Microsoft 365 Admin Basics.
  - Stage 4: Networking Fundamentals.
  - Stage 5: Security and Essential Eight Basics.
  - Stage 6: Intune / Cloud Endpoint Management.
  - Stage 7: Automation and PowerShell.
  - Stage 8: L2 Readiness and Client Ownership.
- [ ] Each stage should show:
  - Target skills.
  - Practice tasks.
  - Suggested evidence.
  - Readiness indicators.
  - Linked scenarios or app modules.
- [ ] Highlight current recommended stage.
- [ ] Add "next action" callout.

## Phase 8: Recommendation system
- [ ] Create `app/src/lib/mspRecommendations.ts`.
- [ ] Recommend next actions from incomplete skills.
- [ ] Recommend Ticket Notes Trainer when note quality is weak.
- [ ] Recommend foundational networking when DNS/DHCP scenarios are missed.
- [ ] Recommend security/professional judgement when unsafe actions are chosen.
- [ ] Recommend evidence creation when practice is completed but no output exists.
- [ ] Keep rules readable and easy to adjust.
- [ ] Add tests for recommendation rules once test tooling exists.

## Phase 9: Navigation and IA
- [ ] Update navigation to include MSP sections in a way that fits the existing layout:
  - MSP Skills.
  - MSP Scenarios.
  - MSP Roadmap.
  - Evidence Pack.
  - Ticket Notes.
- [ ] Consider grouping these under Learning if the top nav becomes crowded.
- [ ] Add mobile-friendly links.
- [ ] Update `docs/architecture/information_architecture.md` after implementation.

## Phase 10: Storage and progress tracking
- [ ] Decide on versioned Dexie migration for MSP tables.
- [ ] Add `mspScenarioAttempts` table if needed.
- [ ] Add `mspSkillProgress` table if needed.
- [ ] Add `ticketNoteDrafts` or map notes to work logs/learning items.
- [ ] Ensure export/import includes new records.
- [ ] Add migration notes to technical architecture.
- [ ] Keep all records local-first and private.

## Phase 11: Testing and quality
- [ ] Run `npm run lint` in `app/`.
- [ ] Run `npm run build` in `app/`.
- [ ] Manually test:
  - Desktop layout.
  - Mobile layout.
  - Dark mode.
  - Filters/search.
  - Scenario feedback.
  - Evidence export.
- [ ] Check for broken links in documentation.
- [ ] Check for placeholder text leaking into the UI.
- [ ] Check that no real client-sensitive information is seeded.

## Content backlog
- [ ] Add more Microsoft 365 scenarios:
  - Mailbox delegation delay.
  - Distribution group membership issue.
  - Calendar permission mismatch.
  - External sharing blocked.
- [ ] Add more endpoint scenarios:
  - BitLocker recovery prompt.
  - Roaming profile problem.
  - Laptop battery swelling report.
  - App blocked by security policy.
- [ ] Add more networking scenarios:
  - DHCP scope exhausted.
  - VLAN mispatch.
  - VPN connects but cannot reach file share.
  - Intermittent packet loss.
- [ ] Add more cybersecurity scenarios:
  - MFA fatigue prompt.
  - Impossible travel alert.
  - Suspicious mailbox forwarding rule.
  - EDR alert for unknown executable.
- [ ] Add more backup/DR scenarios:
  - Restore requested for deleted folder.
  - Backup repository nearly full.
  - Missed backup alert after server reboot.
  - Client asks whether Microsoft 365 is automatically backed up.
- [ ] Add more communication scenarios:
  - User angry about repeated password prompts.
  - Manager wants risky shortcut.
  - Client asks for admin rights.
  - Outage has no ETA yet.

## Acceptance criteria for the PD upgrade
- [ ] The app helps Josh see the MSP skill landscape at a glance.
- [ ] The app trains first questions, checks, safety, escalation, notes, and communication.
- [ ] The app produces tangible evidence, not just completion percentages.
- [ ] The app keeps professional development connected to real work logs, knowledge, and playbooks.
- [ ] The app remains calm, private, local-first, and low cognitive load.
- [ ] The app avoids fake confidence by showing weak areas and next practice steps.

## Suggested first implementation sprint
Build a thin but real vertical slice:

- [ ] `mspSkills.ts` with 30 to 45 skills.
- [ ] `mspScenarios.ts` with 10 scenarios.
- [ ] `/msp-skills` page with search/filter/readiness cards.
- [ ] `/msp-scenarios` page with one complete practice flow.
- [ ] `/ticket-notes` page with examples and rubric.
- [ ] Add navigation links.
- [ ] Run lint/build.

This would make the Academy useful immediately while keeping deeper progress tracking, evidence export, and recommendations for the next pass.

