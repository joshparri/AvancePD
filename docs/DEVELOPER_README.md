# Developer Guide

This guide explains how to run and extend the Avance PD app.

## Setup

1. Open a terminal in the repository root.
2. Install dependencies:

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Project Structure

- `src/` - application source code
- `src/main.tsx` - app entrypoint
- `src/App.tsx` - main shell and navigation
- `src/pages/` - page components for core workflows
- `src/data/sampleData.ts` - generic demo seed data
- `src/types.ts` - app data model types
- `src/styles.css` and `src/App.css` - styles

## Notes

This app is intentionally small and local-first. Keep core flows simple and avoid storing sensitive operational data.
