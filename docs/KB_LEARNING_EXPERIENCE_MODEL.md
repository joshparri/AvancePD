# KB Learning Experience Model

AvancePD is shifting from a KB reference page to a guided learning platform.
The new model uses KB cards as source material for a lesson and pairs them with active practice, progress tracking, and evidence capture.

## Learning session flow

The guided flow is:

1. **Today’s lesson**
2. **Learn**
3. **Quiz**
4. **Recall**
5. **Practical task**
6. **Ticket note drill**
7. **AI coach feedback**
8. **Evidence**
9. **Spaced review**

This keeps the KB content from being a destination. The KB cards are the reference material that feeds a lesson.

## What this model borrows from learning platforms

### Khan Academy
- Short explanation plus active practice.
- Clear mastery progress and review steps.
- Lessons are bite-sized and build on each other.

### Coursera / edX
- Structured learning paths and skills tracks.
- Evidence-oriented practice with real-world relevance.
- Self-paced progress with clear next steps.

### Codecademy
- Interactive practice, not passive reading.
- Focus on quick tasks and immediate feedback.
- Accessible, calm tutor-like pacing.

### The Odin Project
- Learn-by-doing through practical tasks.
- Project-style prompts that encourage real work.
- A strong emphasis on doing, not just reading.

### Duolingo
- Daily habit and low-friction tasks.
- Short practice units that feel approachable.
- Avoid manipulative gamification; keep the learning honest.

### Open Culture
- Curated learning library with quality resources.
- The app should stay a trusted collection of useful topics.

## AvancePD learning design principles

- The KB page is the source material, not the final destination.
- Start with a friendly lesson card: “What are we learning today?”
- Keep explanations short and expandable.
- Offer clearly labeled practice buttons.
- Save answers locally and show progress.
- Keep the visual design calm, clear, and work-focused.
- Avoid giant walls of text and heavy dashboards.

## Safe AI coach design

- Do not expose the Groq API key in the frontend.
- Never use `VITE_GROQ_API_KEY` in client code.
- Use a server-side endpoint such as `/api/coach`.
- Store the secret as `GROQ_API_KEY` on the server.
- Send only:
  - activity type
  - KB title
  - user answer text
  - rubric guidance
- Do not send raw KB content, ticket text, client data, passwords, hostnames, IPs, or secrets.

## Notes for implementation

- Recommend a topic from due reviews first.
- Show activity buttons for learn, quiz, recall, practical task, ticket note drill, and AI coach.
- Keep KB summaries collapsed by default.
- Store local session activity in `avancepd.kbLearningActivities`.
- Preserve existing KB field cards and backup/export functionality.

## Why this matters

AvancePD should feel like a calm MSP tutor asking:

> What are we learning today, how will we practise it, and what evidence did we create?

That shift makes the app a learning machine instead of just a KB browser.
