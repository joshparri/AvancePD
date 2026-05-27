# KB Learning Machine QA

This checklist defines how to validate the KB Learning Machine learning experience.

## Setup

- Run `npm install` if dependencies are not already installed.
- Run `npm run build` to verify the app compiles successfully.
- Start the development server with `npm run dev`.

## Feature validation

- Confirm the KB Learning Machine opens without overwhelming walls of text.
- Confirm a “What are we learning today?” hero card appears.
- Confirm a recommended topic appears when there are due reviews or available KB cards.
- Confirm activity buttons appear:
  - Learn
  - Multiple-choice quiz
  - Quick recall
  - Practical task
  - Ticket note drill
  - AI coach feedback
- Confirm KB details are collapsed by default and expandable.
- Confirm quiz questions load and a score is shown.
- Confirm quick recall saves answers locally.
- Confirm practical task responses save locally.
- Confirm ticket note drill lets the user generate a copyable note.
- Confirm evidence can be saved locally.
- Confirm progress indicators update after activity attempts.
- Confirm KB learning activity state is stored locally.
- Confirm backup/export still includes KB learning data.

## Privacy and implementation checks

- Confirm no raw KB content, private ticket text, or client data is committed.
- Confirm the Groq API key is not exposed in frontend code.
- Confirm AI coach feedback uses server-side `GROQ_API_KEY` only.
- Confirm missing API key shows a safe fallback message.
- Confirm external integration or API calls are not added unless explicitly requested.

## Build validation

- Run `npm run build` and confirm it passes.

## Experience note

AvancePD should feel like a calm MSP tutor asking:

> What are we learning today, how will we practise it, and what evidence did we create?
