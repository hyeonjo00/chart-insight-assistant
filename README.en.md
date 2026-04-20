# Chart Insight Assistant

Chart Insight Assistant is a portfolio-ready Next.js application for chart screenshot analysis. It combines a polished dark UI, image upload, OpenAI-powered structured analysis, browser-based history, and AdSense-ready placement into one clean project foundation.

[한국어](./README.ko.md) | [日本語](./README.ja.md) | [Language Hub](./README.md)

## Screenshots

| Home | Analyze | Analysis Result | History |
| --- | --- | --- | --- |
| ![Home](./public/readme/home.png) | ![Analyze](./public/readme/analyze.png) | ![Analysis Result](./public/readme/analysis-result.png) | ![History](./public/readme/history.png) |

## Overview

The app lets a user upload a chart screenshot, preview it, run a cautious AI interpretation, and store the completed result in local browser history. The result is not free-form text. It is rendered from structured JSON so the UI can reliably show bias, confidence, entry zone, invalidation zone, take-profit targets, and a short practical summary.

This project is built to feel like a real product starting point. It includes server-side API handling, image validation, local persistence, deployment notes, AdSense preparation, multilingual documentation, and screenshots for portfolio presentation.

## Technical Whitepaper

The full technical whitepaper explains the architecture, API pipeline, OpenAI prompting strategy, structured output contract, local history model, AdSense preparation, security decisions, limitations, and roadmap.

- [Read the English technical whitepaper](./docs/technical-whitepaper-en.md)
- [한국어 기술 백서](./docs/technical-whitepaper-ko.md)
- [日本語 技術ホワイトペーパー](./docs/technical-whitepaper-ja.md)

## Feature Highlights

- Clean dark interface with responsive layouts
- Home, Analyze, and History pages using the Next.js App Router
- Drag-and-drop image upload with click-to-select support
- Image preview for uploaded chart screenshots
- Client-side and server-side image validation
- OpenAI-powered chart interpretation through `/api/analyze`
- Structured JSON analysis response
- Result card with visual emphasis for bias and confidence
- Local history saved with `localStorage`
- Delete support for individual history items
- AdSense-ready ad banner component
- Global AdSense script integration
- `ads.txt` included for Google AdSense verification

## How It Works

1. Upload a chart screenshot on the Analyze page.
2. The frontend validates the image format and file size.
3. A preview appears in the upload area.
4. The user clicks `Analyze Chart`.
5. The frontend sends the file to `/api/analyze`.
6. The API route validates the file again on the server.
7. The server sends the image to OpenAI with a cautious scenario-based prompt.
8. OpenAI returns structured JSON.
9. The app renders the result card and saves it to local history.

## Analysis Output

```json
{
  "bias": "long | short | neutral",
  "entry_zone": "string",
  "invalidation_zone": "string",
  "take_profit": ["string"],
  "confidence": "low | medium | high",
  "summary": "string"
}
```

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI | React |
| AI | OpenAI Responses API |
| Persistence | Browser `localStorage` |
| Ads | Google AdSense-ready setup |

## Project Structure

```text
app/
  api/analyze/route.ts      OpenAI-powered chart analysis route
  analyze/page.tsx          Analyze page
  history/page.tsx          Local analysis history page
  layout.tsx                Root layout and global AdSense script
  page.tsx                  Home page
components/
  ad-banner.tsx             Reusable AdSense-ready ad slot
  chart-upload-panel.tsx    Upload, preview, analysis, result, and save flow
  layout/site-header.tsx    Top navigation
  ui/                       Reusable UI primitives
lib/
  analysis-history.ts       localStorage helpers
  utils.ts                  Shared utility helpers
docs/
  technical-whitepaper-en.md
  technical-whitepaper-ko.md
  technical-whitepaper-ja.md
public/
  ads.txt                   AdSense verification file
  readme/                   README screenshots
```

## Getting Started

1. Install dependencies.

   ```bash
   npm install
   ```

2. Create a local `.env.local` file.

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

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Server-side key used by `/api/analyze` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Optional | Public AdSense client ID for ad slot rendering |

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start local development |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run linting |
| `npm run type-check` | Run TypeScript checks |

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add `OPENAI_API_KEY` in Vercel Environment Variables.
4. Add `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9057658678883484` if you plan to enable AdSense.
5. Deploy.

## Security Notes

- The OpenAI API key is never exposed to the browser.
- The API key is read from `process.env.OPENAI_API_KEY`.
- The server route validates uploaded image type and size before calling OpenAI.
- `.env.local` should stay out of version control.
- If a real key was ever committed, rotate it before deploying.

## AdSense Notes

- `app/layout.tsx` loads the global AdSense script.
- `components/ad-banner.tsx` renders reusable ad slots.
- `public/ads.txt` is included for AdSense verification.
- Real ad placements need valid `adSlot` values from Google AdSense.

## Roadmap

- Add authentication
- Persist history in a database
- Add chart metadata such as symbol, exchange, and timeframe
- Add saved analysis presets
- Add rate limiting for the analysis API
- Add production logging and monitoring

## Disclaimer

This project is for educational and portfolio purposes. AI-generated chart analysis is scenario-based only and is not financial advice.
