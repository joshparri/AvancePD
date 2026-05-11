# Vercel Deployment Guide

## GitHub Repository
Deploy from: https://github.com/joshparri/AvanceProfessionalDevelopment

## Vercel Configuration
- **Root Directory**: app
- **Framework Preset**: Next.js
- **Build Command**: npm run build
- **Install Command**: npm install

## Important Notes
- Do not commit `.env` files, `node_modules`, `.next`, or any Vercel-generated local files to the repository.
- The app uses browser localStorage for saving progress and preferences. No server-side storage is required.
- Ensure the repository is set to deploy from the `main` branch.

## Current Deployment Status
The app is successfully deployed at https://avance-professional-development.vercel.app/ with the MSP Professional Development features working. Some planned features (Work Logs, Tasks, etc.) are not yet implemented and will show 404 errors. See `docs/qa/msp_pd_smoke_test.md` for known issues.

## Troubleshooting 404 Errors
If you encounter a 404 NOT_FOUND error after deployment:

1. **Verify Repository Structure**: Ensure the `app/` folder containing `package.json` is pushed to GitHub. The root directory in Vercel must point to where `package.json` is located.

2. **Check Build Logs**: In Vercel dashboard, check the build logs for errors. The build should complete successfully as it does locally with `npm run build`.

3. **Confirm Root Directory**: **CRITICAL**: The root directory must be set to `app` (not the repository root). This tells Vercel to look for `package.json` in the `app/` folder. If not set, Vercel may not detect the Next.js project and fail to build.

4. **Framework Detection**: Vercel should automatically detect Next.js once the root directory is set to `app`. If not, manually set the framework preset to Next.js.

5. **Build Output**: Next.js builds to `.next/` folder. Ensure no custom output directory is set unless necessary.

6. **Routes**: The app has a root page at `/` (dashboard). If accessing other routes like `/msp-skills`, ensure they are implemented.

7. **Redeploy**: After changing settings, trigger a new deployment in Vercel.

If issues persist, check Vercel's documentation for Next.js deployments or contact Vercel support.