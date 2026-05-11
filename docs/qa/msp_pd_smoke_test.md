# MSP PD Smoke Test Checklist

This is a manual QA checklist to verify the Avance Professional Development app is functioning correctly before deployment.

## Checklist

### Core Pages Load
- [ ] `/msp-skills` loads and displays the MSP Skills Matrix
- [ ] `/msp-scenarios` loads and displays scenario options
- [ ] `/ticket-notes` loads and displays training content (prompts, rubric, examples)
- [ ] `/evidence-pack` loads and can generate a summary
- [ ] `/msp-roadmap` loads and displays all 8 stages

### Persistence and Functionality
- [ ] Skill readiness dropdowns on `/msp-skills` persist after page refresh
- [ ] Scenario progress on `/msp-scenarios` persists after page refresh
- [ ] Navigation links between pages work correctly

### Build and Lint
- [ ] `npm run build` completes successfully without errors
- [ ] `npm run lint` passes or only shows known, acceptable warnings

## Known Issues (To Be Fixed)
- [ ] MSP Scenario Trainer: "Scenario progress" select dropdown shows black background when opened, hiding options (selection still works via keyboard)
- [ ] Evidence Pack: Missing "Copy summary" button for Markdown textarea (users must manually select and copy)
- [ ] Navigation: Ticket Notes Trainer not accessible via nav menu (only direct URL)
- [ ] Navigation: Links to Work Logs, Tasks, Knowledge, Playbooks, Clients, Learning return 404 (should be hidden or marked "Coming soon")

## Testing Instructions
1. Run the app locally with `npm run dev` in the `/app` directory.
2. Navigate to each page and verify content loads.
3. Change settings (e.g., skill readiness) and refresh the page to confirm persistence.
4. Run build and lint commands in the terminal.