# Deployment

The preferred deployment path is a private or access-controlled Vercel deployment connected to the GitHub repository.

## Recommended Option

Use Vercel for the React/Vite frontend and serverless API routes in `api/`.

Required environment variables:

- `GROQ_API_KEY` for AI coaching, stored server-side only
- `GROQ_MODEL` optionally, if the default model should be changed

## Build Settings

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## Privacy Notes

- Do not add client data, credentials, screenshots, hostnames, or IP addresses to source control.
- Keep environment variables in the hosting provider settings, not in the repo.
- Keep Health & Outdoors email reminders copy/export only unless a server-side email endpoint is explicitly added later.

## Local Static Option

For a private local-only deployment:

```bash
npm install
npm run build
npm run preview
```

Use this when the app should remain on one trusted machine.
