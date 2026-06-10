Original prompt: Under micro learning, add a section of the app that is the AvancePDGames, make that section of the app as addictive as possible, I want to get addicted to learning more about IT concepts and IT skills. Use game retention concepts from strategy games, deck-builders, live-service games, resource loops, roguelikes, action RPGs, dopamine feedback, variable rewards, compulsion loops, progress goals, FOMO/social pull, flow, and instant feedback. Then push changes to github.

Update: User clarified AvancePDGames should be a new standalone section of the app, not under Micro Learning.

TODO:
- Added a standalone AvancePDGames page with persistent XP, streaks, rewards, upgrades, missions, and IT learning prompts.
- Wired the page into App navigation/routing.
- Styled the page responsively.
- Fixed the pre-existing KBLearning helper syntax/import issue.
- Build passes with `npm run build`.
- Playwright client captured AvancePDGames successfully, and a bundled Playwright interaction test confirmed answer selection, XP, credits, streak, badge, and outcome feedback. Mobile screenshot checked at 390px width.
- Committed intended app changes as `4490cab` on `codex/avance-pd-games` and pushed the branch to GitHub.
- GitHub CLI is not installed. GitHub connector PR creation returned 403, so PR was not opened automatically.
- PR creation URL from push: https://github.com/joshparri/AvancePD/pull/new/codex/avance-pd-games

Update: Applying QA feedback to improve learning effectiveness.

TODO:
- Added answer-specific feedback so incorrect choices explain why that option failed.
- Added a troubleshooting-flow panel to make each contract feel more like a multi-step support path.
- Added a full "Review this concept" panel after mission completion with concept, why it matters, common mistake, and practice task.
- Added exact navigation hooks from AvancePDGames to the matching Micro-Learning card and linked MSP Scenario.
- Added focus props to MicroLearning and MspScenarios so linked study opens the exact item.
- Added a visible Concept Mastery dashboard.
- `npm run build` passes after the improvement pass.
- Playwright game client captured the improved AvancePDGames page with troubleshooting flow and mastery dashboard.
- Bundled Playwright interaction check confirmed wrong-answer feedback, concept review panel, exact linked scenario focus, and exact Micro-Learning card focus.
- Commit and push the improvement pass.
