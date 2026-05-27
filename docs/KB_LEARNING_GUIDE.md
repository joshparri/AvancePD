# Avance KB Learning Guide

This guide explains the KB Learning Machine flow in Avance PD. It describes the guided conversation, active review practice, and how to keep learning safe and local.

> Important: Raw KB files in `docs/Avance KB_s` are local reference material only. Do not copy private customer data, internal case notes, or raw ticket text into GitHub-tracked docs.

## What the KB Learning Machine does

The KB Learning Machine is built to turn real work into repeatable learning.
It guides you through a conversational learning session, helps you practise concepts from safe KB topics, and tracks review readiness without exposing private source material.

## What are we learning today?

When you open the KB Learning Machine, it begins with a friendly, guided greeting:

- "What are we learning today?"
- It suggests today’s topic and the most relevant learning activity.
- It may offer buttons for quick review, a quiz, a task, a ticket-note drill, or a reflection.

The idea is to make learning feel like a short guided conversation rather than a long manual.

## The guided flow

### 1. Start with a conversational prompt

The first screen is a quick check-in:

- It names the current topic or skill area.
- It explains the next learning activity.
- It provides buttons like `Start quiz`, `Quick recall`, `Practice task`, and `Ticket-note drill`.

This keeps the session focused and helps avoid fatigue from long blocks of text.

### 2. Open a KB summary

KB summaries are presented in a collapsible format:

- Each summary contains the key idea, when to use it, and the core steps.
- You can expand only the parts you need.
- This avoids a wall of text and keeps the learning flow fast.

### 3. Start quizzes and quick recalls

The KB Learning Machine offers two main practice modes:

- **Quizzes**
  - Quiz questions load for each KB card.
  - Questions focus on the topic’s core steps, checks, and common mistakes.
- **Quick recalls**
  - Quick-recall text areas appear with prompts like `Explain the best next step`.
  - You type a brief answer in your own words.

Both modes help solidify your understanding without needing a formal instructor.

### 4. Practical tasks and ticket-note drills

After the summary and recall work:

- **Practical tasks** offer a field-style checklist or scenario prompt.
- **Ticket-note drills** help you practise writing a concise, manager-safe note.
- The ticket-note drill is designed to build reusable communication habits without copying real ticket text.

### 5. Reflection and review

At the end of the session, the learning flow asks you to reflect:

- What was the key takeaway?
- What would you do differently next time?
- What should you review again?

This reflection is stored locally and helps turn one session into a repeated learning habit.

## How Groq assessment works

The KB Learning Machine uses a Groq-style assessment model when the Groq key is present.

- User answers are stored locally.
- The app may display automated feedback based on the answer quality.
- Feedback is designed to be generic and safe, not a source of private data leakage.
- If no Groq key is available, the learning machine still works locally with self-review prompts.

This means the feature works as a local learning coach first, with optional enhanced feedback when allowed.

## What to expect in the guide

This guide is intentionally focused on process and safe practices:

- Use the KB Learning Machine for guided practice, not raw KB ingestion.
- Keep the KB summaries generic and privacy-safe.
- Treat user answers as local notes.
- Do not paste real customer or ticket-sensitive content into the app.

## Practical usage

1. Choose a KB topic from the KB Learning Machine dashboard.
2. Read the collapsible summary and highlight important checks.
3. Start a quiz or quick recall for the same card.
4. Do a practical task or ticket-note drill.
5. Write a short reflection and save it locally.
6. Repeat the session later based on review prompts.

## QA checklist

See `docs/KB_LEARNING_ACCEPTANCE.md` for the acceptance criteria and validation steps.
