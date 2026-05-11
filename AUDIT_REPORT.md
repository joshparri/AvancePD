# Avance PD Current App Audit

## Audit date
May 11, 2026

## Executive summary
Avance PD is a comprehensive MSP technician training platform with AI-powered coaching, scenario practice, skill tracking, and evidence collection. The app provides structured learning paths through micro-learning cards, interactive scenarios, communication practice, and ticket note training with real-time AI feedback.

## Current live app
- **Live app:** https://avance-pd.vercel.app/
- **GitHub repo:** https://github.com/joshparri/AvancePD

## Build status
✅ **Build passes:** `npm run build` completed successfully in 2.14s
- No TypeScript errors
- No build warnings
- Production bundle: 287.62 kB (86.82 kB gzipped)

## Current pages and features

### Core Training Pages
- **Avance Workday** - Daily workflow dashboard with quiet-window suggestions and overwhelmed mode
- **Micro-Learning** - Concept cards with improved readability (recently fixed)
- **MSP Skills** - Skills matrix with readiness tracking and filtering
- **MSP Scenarios** - Interactive scenario practice with AI coaching
- **Communication Practice** - Professional messaging training with AI feedback
- **Ticket Notes** - Template-based ticket writing with AI coaching
- **Evidence Pack** - Manager-safe PD evidence export

### Supporting Pages
- **Dashboard** - Main hub with onboarding and quick stats
- **MSP Roadmap** - Career progression stages and readiness indicators
- **PD** - General learning log
- **Tasks/WorkLogs/Knowledge/Playbooks/Time** - Work management tools

## Current data files
- **mspSkills.ts** - 65+ skills across 8 categories with readiness levels
- **mspScenarios.ts** - 25+ realistic MSP scenarios with ideal answers
- **microLearning.ts** - 50+ concept cards with practice tasks
- **communicationScenarios.ts** - Professional communication scenarios
- **responseRubrics.ts** - Assessment rubrics for feedback
- **sampleData.ts** - Sample work data for dashboard

## AI coaching architecture

### Server-side API
- **/api/coach** - Main coaching endpoint with structured JSON feedback
- **/api/health** - Service health check and configuration status
- **Model:** llama-3.3-70b-versatile (configurable via GROQ_MODEL)
- **API Key:** Server-side only via GROQ_API_KEY environment variable

### Frontend integration
- **src/utils/groqClient.ts** - Type-safe API client with fallback handling
- **FeedbackCard.tsx** - Structured feedback display component
- **No direct groq-sdk imports** in frontend code
- **No API key exposure** in client-side code

### Feedback structure
```typescript
{
  verdict: 'needs work' | 'partly correct' | 'strong',
  summary: string,
  sections: [{ title, status, points }],
  nextStep: string
}
```

## Progress/localStorage architecture

### Storage keys
- `avance-msp-progress` - Main progress object
- `avance-workLogs` - Work log entries
- `avance-tasks` - Task management
- `avance-knowledgeEntries` - Knowledge base
- `avance-playbooks` - Troubleshooting playbooks
- `avance-learningItems` - General learning logs
- `avance-timeEntries` - Time tracking
- `avance-onboarded` - Onboarding status

### Progress tracking
- **Scenario progress:** status, lastPractisedDate, reflection
- **Skill readiness:** overrides for default readiness levels
- **Ticket note practice:** count with legacy migration
- **Micro-learning:** viewed card IDs
- **Workday focus:** current focus and support mode
- **Weak areas:** automatically identified skill gaps

### Migration logic
- Safe legacy ticket note count migration
- No data loss during schema updates
- Graceful fallback for corrupted storage

## Teaching modes currently implemented

### ✅ Fully Implemented
- **Learn** - Micro-Learning concept cards with tracking
- **Practise** - MSP Scenarios with AI coaching
- **Roleplay** - Communication Practice with AI feedback
- **Reflect** - Evidence Pack with markdown export
- **Review** - Skills matrix and gap analysis

### ❌ Not Implemented
- **Quiz** - Disabled in teaching mode grid (marked as unavailable)

## UX/readability status

### ✅ Recent Improvements
- **Micro-Learning cards** - Fixed low contrast, improved hover states
- **Card readability** - White backgrounds, dark text, better contrast
- **Interactive states** - Clear hover/focus/selected states
- **Status chips** - Enhanced contrast and readability

### ⚠️ Areas for improvement
- **Mobile responsiveness** - Basic responsive layout exists but could be enhanced
- **Empty states** - Some pages lack helpful empty state messaging
- **Loading states** - AI feedback loading could be more polished

## Privacy/security status

### ✅ Strong protections
- **API key safety** - Server-side only, no client exposure
- **Privacy reminders** - Multiple warnings against client data entry
- **Generic training data** - All scenarios use fictional/safe examples
- **No credentials stored** - No password/hostname collection

### ✅ Safe .gitignore
- Excludes `.env` files and local state
- Blocks private docs (`docs/`, `archives/`, `references/`)
- Prevents sensitive file uploads

### ✅ Sample data safety
- All client names are generic ("Sample Client", "Test Org")
- No real IPs, hostnames, or credentials
- All scenarios are privacy-safe

## Known limitations

### Technical limitations
- **Quiz mode** - Not implemented (teaching mode disabled)
- **Spaced review** - No automated review scheduling
- **Hidden cause reveal** - Scenarios show all content at once
- **Model answer gating** - No progressive reveal system
- **Evidence Pack export** - Markdown only, no PDF/Word options

### Feature gaps
- **Command/tool lab** - No interactive tool training
- **Skill notes** - No per-skill note-taking
- **Advanced filtering** - Basic search only in skills matrix
- **Progress analytics** - No detailed progress charts

## Remaining TODOs

### Quick fixes (safe to implement)
- Remove placeholder text in form inputs (already handled by HTML5 placeholders)
- Add empty state messaging to sparse pages
- Enhance mobile responsive breakpoints

### Medium features
- Implement Strict Quiz Mode with timed assessments
- Add spaced review scheduling for micro-learning
- Create scenario step trainer with progressive reveal
- Build Command/Tool Lab for interactive training
- Enhance Evidence Pack with multiple export formats

### Major features
- Advanced progress analytics and dashboards
- Skill assessment and certification system
- Team/organization progress tracking
- Integration with real PSA systems (careful with privacy)

## Recommended next build sequence

### Phase 1: Strict Quiz Mode
- Timed assessments for skill categories
- Randomized question pools
- Immediate feedback and scoring
- Progress tracking for quiz performance

### Phase 2: Spaced Review
- Automated review scheduling based on forgetting curve
- Daily review suggestions in Avance Workday
- Review session tracking and completion

### Phase 3: Scenario Step Trainer
- Progressive reveal of scenario information
- Hidden cause reveal mechanics
- Step-by-step validation with AI coaching
- Model answer gating system

### Phase 4: Command/Tool Lab
- Interactive command-line training
- Safe sandbox environments for common tools
- Step-by-step tool usage guidance
- Tool proficiency tracking

### Phase 5: Evidence Pack Enhancements
- Multiple export formats (PDF, Word)
- Template customization
- Automated evidence gathering
- Manager review workflow

## Files changed during this audit

### No code changes required
- Build already passed
- All TODO searches completed
- Privacy/security already properly implemented
- Architecture already sound

### Documentation created
- `AUDIT_REPORT.md` - This comprehensive audit document

## What not to touch casually

### High-risk files
- `api/coach.ts` - Core AI coaching logic
- `src/utils/progressStorage.ts` - Data migration and storage
- `.gitignore` - Privacy and security protections

### Complex integration points
- AI feedback flow and error handling
- Progress migration logic
- localStorage key management

### Privacy-sensitive areas
- Any scenario content creation
- Client data handling in work management
- API key and environment configuration

---

## Summary

The Avance PD app is in excellent condition with a solid architecture, proper security practices, and comprehensive training features. The recent micro-learning readability improvements have addressed the main UX concerns. The app is ready for continued development with the recommended focus on implementing Quiz Mode and Spaced Review features next.

**Biggest remaining risks:**
1. Quiz mode not implemented (teaching mode grid shows disabled)
2. No automated review scheduling (missed learning reinforcement)
3. Limited evidence export options (manager usability)

**Recommended next task:** Implement Strict Quiz Mode as it provides immediate value for skill assessment and creates foundation for spaced review system.
