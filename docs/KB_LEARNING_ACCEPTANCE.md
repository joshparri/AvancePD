# KB Learning Acceptance Criteria

This checklist defines the expected behavior for the KB Learning Machine feature.

## Conversational entry

- [ ] A conversational greeting opens the KB Learning Machine.
- [ ] The greeting clearly states today’s topic or learning focus.
- [ ] Activity buttons are visible for core modes such as `Start quiz`, `Quick recall`, `Practical task`, and `Ticket-note drill`.

## KB summaries

- [ ] KB summaries appear in collapsible panels.
- [ ] Collapsible summaries prevent wall-of-text fatigue.
- [ ] Users can expand and collapse sections to read only what they need.

## Practice loading

- [ ] Quiz questions load for each KB card.
- [ ] Quick-recall text areas load for each KB card.

## Local answer storage and feedback

- [ ] User answers are stored locally in the browser.
- [ ] LLM-style feedback appears when the Groq key is present.
- [ ] Feedback display is optional and does not break the experience when the Groq key is absent.

## Learning progress updates

- [ ] Confidence values update after each task or review.
- [ ] Review stage updates after each task or review.

## Privacy and safety

- [ ] No sensitive KB content is included in the app or committed docs.
- [ ] No API keys are exposed to the client.
- [ ] The feature works without requiring raw KB imports or private data.

## Build validation

- [ ] `npm run build` passes successfully.

## Notes

- Validate the flow using the demo site or local app.
- For any external link references, keep content generic and privacy-safe.
- Example app endpoint to review: `avance-pd.vercel.app`.
