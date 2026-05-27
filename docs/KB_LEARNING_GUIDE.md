# Avance KB Learning Guide

This guide explains how the Avance KB Learning Machine should work as a guided learning experience, not just a KB reference page.

> Important: The raw KB files under `docs/Avance KB_s` are local reference material only. Do not copy private customer data, ticket text, or internal-only content into GitHub-tracked docs.

## What the KB library is for

The `docs/Avance KB_s` folder contains safe reference material for MSP topics such as device enrollment, remote access, cloud migrations, security policies, phone and printer configuration, and recovery workflows.

The KB library is the source material for lessons. It is not the final destination.

## The new guided learning flow

The KB Learning Machine should present learning as a session:

1. **Today’s lesson**
2. **Learn**
3. **Quiz**
4. **Recall**
5. **Practical task**
6. **Ticket note drill**
7. **AI coach feedback**
8. **Evidence**
9. **Spaced review**

Each stage should feel like a calm guided tutor asking:

- What are we learning today?
- How will you practise it?
- What evidence did you create?

## How the apps use the KB

- **Avance Work Companion** is the capture engine.
  - Use it to log work, follow-ups, ticket notes, and learning seeds.
  - Tag captured items with the relevant KB topic or skill area.
  - Send learning-worthy captures into a local learning queue if the app supports it.

- **Avance PD** is the learning cockpit.
  - Use it to turn KB cards into lessons, quizzes, recall prompts, practical tasks, and ticket-note drills.
  - Use AI coach feedback only when server-side Groq is enabled.
  - Save evidence locally and keep it manager-safe.

## Recommended learning session pattern

- Start with a short, friendly lesson prompt.
- Show one recommended topic from due reviews or the first available KB card.
- Offer activity buttons for learning, quiz, recall, task, ticket note, and coach feedback.
- Keep card summaries short and collapsible.
- Show a learning path strip with the next steps.
- Track progress locally for the session and save it in browser storage.

## What to avoid

- Avoid long KB cards displayed as a wall of text.
- Avoid making the KB page the destination.
- Avoid exposing `VITE_GROQ_API_KEY` in the client bundle.
- Avoid copying raw KB content, ticket text, client names, hostnames, IPs, passwords, or other private data.

## Safe AI coach design

- Use a server-side endpoint such as `/api/coach` if the project supports it.
- Store the API key as `GROQ_API_KEY` on the server.
- Do not send raw KB content or private data to the AI coach.
- Send only generic KB title, user answer, and rubric guidance.
- If the key is missing, show:
  - “AI coach unavailable. Add GROQ_API_KEY server-side to enable feedback.”

## Practical usage

1. Choose a recommended lesson topic.
2. Read the short summary and expand only the details you need.
3. Take the multiple-choice quiz for that card.
4. Write a quick recall answer in your own words.
5. Describe a safe practical task for a real MSP ticket.
6. Complete a ticket-note drill with structured fields.
7. Save evidence and review progress.

## Notes on privacy and docs

- Keep raw KB content local to `docs/Avance KB_s`.
- Public docs should describe the learning model and safe usage.
- Do not publish customer data, private tickets, or sensitive operational details.

## Next documentation steps

- Keep this guide aligned with the actual KB Learning Machine UI.
- Add the learning experience model and acceptance criteria to docs.
- Keep the local KB folder private and use it as source material only.
