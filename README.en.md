# Chart Insight Assistant

Chart Insight Assistant is a portfolio-ready Next.js app for uploading chart screenshots, generating cautious scenario-based analysis with OpenAI, and reviewing saved local history in a clean dark UI.

[한국어](./README.ko.md) | [日本語](./README.ja.md) | [Language Hub](./README.md)

## Screenshots

| Home | Analyze | Analysis Result | History |
| --- | --- | --- | --- |
| ![Home](./public/readme/home.png) | ![Analyze](./public/readme/analyze.png) | ![Analysis Result](./public/readme/analysis-result.png) | ![History](./public/readme/history.png) |

## Features

- Next.js App Router with TypeScript and Tailwind CSS
- Dark, mobile-friendly UI foundation
- Drag-and-drop chart image upload with preview and file validation
- OpenAI-powered analysis route for chart screenshots
- Scenario-based result card with bias, confidence, zones, targets, and summary
- Local browser history with delete support
- Google AdSense-ready global script, ad banner component, and `ads.txt`

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI Responses API

## Project Structure

```text
app/
  api/analyze/route.ts
  analyze/page.tsx
  history/page.tsx
  layout.tsx
  page.tsx
components/
  ad-banner.tsx
  chart-upload-panel.tsx
  layout/site-header.tsx
  ui/...
lib/
  analysis-history.ts
  utils.ts
public/
  ads.txt
  readme/
```

## Getting Started

1. Install dependencies.

   ```bash
   npm install
   ```

2. Create `.env.local`.

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9057658678883484
   ```

3. Start the development server.

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

- `OPENAI_API_KEY`
  Used on the server for `/api/analyze`.
- `NEXT_PUBLIC_ADSENSE_CLIENT`
  Used by the reusable ad banner component for live AdSense slots.

## Available Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run type-check`

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add `OPENAI_API_KEY` in Vercel Environment Variables.
4. Add `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9057658678883484` if you plan to enable live AdSense slots.
5. Deploy.

## Notes

- The analysis is scenario-based and not financial advice.
- Local history is stored in `localStorage`.
- `public/ads.txt` is already included for AdSense verification.
