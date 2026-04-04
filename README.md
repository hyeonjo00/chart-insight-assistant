# Chart Insight Assistant

Chart Insight Assistant is a portfolio-ready Next.js starter for a future stock chart analysis experience. This repository focuses on clean structure, a dark UI foundation, and responsive page scaffolding so future AI and chart features can be added without reworking the app shell.

## What is included

- Next.js App Router with TypeScript
- Tailwind CSS setup for a dark-themed responsive UI
- Three starter pages: Home, Analyze, and History
- Reusable layout and UI component structure
- Professional project organization for future growth

## What is intentionally not included yet

- Database or persisted history
- Authentication

## Project structure

```text
app/
  api/analyze/route.ts
  analyze/page.tsx
  history/page.tsx
  layout.tsx
  page.tsx
components/
  chart-upload-panel.tsx
  layout/site-header.tsx
  ui/empty-state.tsx
  ui/feature-card.tsx
  ui/page-header.tsx
  ui/section-card.tsx
lib/
  analysis-history.ts
  utils.ts
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` file in the project root with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

The `/api/analyze` route uses this key server-side to analyze uploaded chart screenshots with OpenAI.

## Available scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` starts the production server
- `npm run lint` runs ESLint
- `npm run type-check` runs TypeScript without emitting files

## Future development ideas

- Add a chart upload and preview flow
- Integrate AI-powered analysis summaries
- Persist analysis history in a database
- Support user accounts and saved workspaces

## Notes

This scaffold is designed to stay simple and well-organized. The current UI is intentionally minimal so future product decisions can be layered in cleanly.
