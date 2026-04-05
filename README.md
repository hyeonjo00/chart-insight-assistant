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

Create a local `.env.local` file in the project root with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
```

Required:

- `OPENAI_API_KEY`: used only on the server by the `/api/analyze` route

Optional:

- `NEXT_PUBLIC_ADSENSE_CLIENT`: reserved for future AdSense integration

Notes:

- Do not commit `.env.local` or any real API keys to the repository
- If a real key was ever committed, rotate it in the OpenAI dashboard before deploying

## Deploying to Vercel

1. Push the repository to GitHub without `.env.local`.
2. Import the project into Vercel.
3. In Vercel Project Settings -> Environment Variables, add:
   - `OPENAI_API_KEY` for Production, Preview, and Development as needed
   - `NEXT_PUBLIC_ADSENSE_CLIENT` only if you plan to use ads later
4. Deploy normally. The existing `/api/analyze` route reads `process.env.OPENAI_API_KEY` at runtime and does not use any hardcoded or fallback demo key.

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
