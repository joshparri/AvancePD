# Sample Seed Data

Seed data exists to make the app understandable during local testing.

## Rules

- Use generic clients and safe example work only.
- Do not include real client names, ticket text, hostnames, IP addresses, screenshots, credentials, or private operational notes.
- Keep sample data small enough that the app stays fast.
- Prefer examples that demonstrate workflows: follow-ups, learning, playbooks, time entries, and evidence.

## Current Location

Seed data is defined in:

- `src/data/sampleData.ts`

Training content is defined in:

- `src/data/mspSkills.ts`
- `src/data/mspScenarios.ts`
- `src/data/mspQuiz.ts`
- `src/data/microLearning.ts`
- `src/data/communicationScenarios.ts`

## Validation

Before adding seed data, check:

- Is it generic?
- Is it safe to publish?
- Does it help test a real workflow?
- Does it avoid sensitive or identifiable operational details?
