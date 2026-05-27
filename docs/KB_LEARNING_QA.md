# KB Learning Machine QA

This checklist defines how to validate the KB Learning Machine shell feature.

## Setup

- Run `npm install` if dependencies are not already installed.
- Run `npm run build` to verify the app compiles successfully.
- Start the development server with `npm run dev`.

## Feature validation

- Confirm a dashboard card appears for the KB Learning Machine.
- Confirm a navigation link appears to open the KB Learning Machine page.
- Confirm the KB Learning Machine page opens when the navigation link is selected.
- Confirm demo cards are labelled `Demo`.
- Confirm a user-created field card can be added and saved locally.
- Confirm the user-created field card remains after refreshing the page.

## Privacy and repo checks

- Confirm no raw KB files or private customer data are included in committed files.
- Confirm documentation and example content only uses generic labels and safe metadata.
- Confirm no external integrations were added unless Josh explicitly asked for them.
