# Avance Game Learning Model

This document describes the learning effectiveness changes added to the Avance game: mastery tracking, attempt logs, and spaced-repetition selection.

## What was added

- Per-challenge attempt logging (`challengeStats`) stored in `AvanceGameProgress` (localStorage).
  - Fields: `attempts`, `correct`, `lastSeen`, `lastCorrect`.
- Mastery heuristics.
  - Mastery is tracked per-skill (aggregated across challenges). A skill is considered `mastered` when either:
    - `correct >= 5`, or
    - `attempts >= 5` and `correct / attempts >= 0.8`.
- Spaced-repetition selection in `pickChallenge`.
  - The system prefers `reviewsDue` items first (items answered incorrectly earlier).
  - Then it prioritizes "weak" items (low attempts or low success rate).
  - Otherwise falls back to original selection logic.
- UI surface: `SkillTree` shows per-node activity counts and will display mastery stats (mastered / total) when available.
- Attempt logs and reviews are stored in localStorage under the existing progress key: `avance:game-progress`.
- AB testing for FOMO copy and other engagement metrics are recorded in localStorage as `ab_metrics_*` keys.

## Why this improves learning

- Prioritising reviews and weak items increases retention via retrieval practice.
- Mastery tracking gives explicit goals and more meaningful progress than raw XP alone.
- Attempt logs make it possible to identify weak areas to remediate.

## How to inspect metrics locally

- Open browser DevTools → Application → Local Storage → origin.
- Check `avance:game-progress` for `challengeStats` and `reviewsDue`.
- Check `ab_metrics_fomo_copy` for A/B impressions and clicks.

## Next steps (suggested)

- Replace localStorage-based metrics with a server-backed store for cross-user aggregation.
- Add remediation workflows that queue tailored follow-up questions for weak items.
- Provide an analytics dashboard that visualises accuracy, mastery, and event performance.

