# Chart Insight Assistant Technical Whitepaper

## Abstract

Chart Insight Assistant is a Next.js application that turns chart screenshots into structured, scenario-based market interpretations. The product combines a polished upload experience, server-side image validation, OpenAI-powered vision analysis, structured JSON output, local browser history, and AdSense-ready monetization infrastructure.

The goal is not to provide deterministic trading signals. The system is intentionally designed to generate cautious scenario analysis that can help a user reason about a chart while avoiding guarantees about future price movement.

## Product Goals

The project was built around five practical goals:

- Provide a simple upload workflow for chart screenshots.
- Keep the OpenAI API key secure on the server.
- Return predictable structured data instead of loose text.
- Present the result in a scannable trading-oriented UI.
- Keep the architecture small enough to extend into a real SaaS product.

## System Architecture

```text
Browser
  |
  | Upload image with FormData
  v
Next.js App Router UI
  |
  | POST /api/analyze
  v
Next.js Route Handler
  |
  | Validate file, convert image, call OpenAI
  v
OpenAI Responses API
  |
  | Structured JSON
  v
Result Card + localStorage History
```

The app uses the App Router to separate UI routes from server-side API behavior. The upload and result experience lives in `components/chart-upload-panel.tsx`, while the OpenAI integration is isolated in `app/api/analyze/route.ts`.

## Frontend Design

The frontend is centered on the Analyze page. The upload panel manages file selection, drag-and-drop state, preview URLs, loading state, API errors, analysis results, and local history persistence.

Key design choices:

- File validation happens before the user sends a request.
- The preview appears immediately after a valid file is selected.
- The Analyze button remains disabled until a valid file exists.
- Loading UI uses skeleton-style surfaces rather than blocking the page.
- The result card emphasizes `Bias` and `Confidence` with clear visual badges.
- The disclaimer is always visible in the result card.

## API Route Design

The server route receives an uploaded chart image through `multipart/form-data`. The route then validates the image before sending anything to OpenAI.

Server responsibilities:

- Read `OPENAI_API_KEY` from `process.env`.
- Reject requests without a valid uploaded file.
- Accept only supported image MIME types.
- Enforce a basic file size limit.
- Convert the image into a base64 data URL.
- Send the image and prompt to OpenAI.
- Request structured JSON output.
- Validate the returned JSON before sending it to the client.

This keeps the browser free of secrets and gives the backend a single place to enforce safety rules.

## OpenAI Prompting Strategy

The analysis prompt is intentionally conservative. The assistant is instructed to analyze the uploaded chart screenshot, return only valid JSON, avoid certainty, and use neutral bias with low confidence when the chart is unclear.

This keeps the feature aligned with a scenario-analysis product rather than a signal-selling product.

## Structured Output Contract

The UI expects the API to return the following shape:

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

The frontend maps this response into display labels such as `Long`, `Short`, `Neutral`, `Low`, `Medium`, and `High`.

## Local History Persistence

Completed analysis results are stored in browser `localStorage`. This keeps the MVP simple and avoids adding account or database complexity too early.

Stored fields:

- `id`
- `createdAt`
- `bias`
- `confidence`
- `summary`
- `entryZone`
- `invalidationZone`
- `takeProfitTargets`
- optional lightweight image preview

The local history helper also limits stored items so the browser storage footprint stays small.

## AdSense Preparation

The project includes a monetization-ready foundation without forcing ads into the core product flow.

AdSense-related pieces:

- Global script loading in `app/layout.tsx`
- Reusable ad slot component in `components/ad-banner.tsx`
- `public/ads.txt` for site verification
- Stable placeholder space to reduce layout shift

Actual live ads require valid AdSense slot IDs.

## Security And Safety

Important safeguards:

- The OpenAI API key stays server-side.
- The browser never receives the OpenAI API key.
- Uploaded files are validated on both client and server.
- OpenAI output is constrained to a known JSON schema.
- The UI includes a financial advice disclaimer.
- The analysis is framed as scenario-based and non-guaranteed.

## Current Limitations

- History is stored only in the browser.
- There is no user authentication yet.
- There is no persistent database.
- There is no rate limiting yet.
- The app does not extract ticker, exchange, or timeframe metadata automatically.
- AdSense slots still need production slot IDs.

## Future Roadmap

- Add authenticated user accounts.
- Persist analysis history in a database.
- Add symbol, exchange, and timeframe metadata.
- Add saved prompt or analysis presets.
- Add API rate limiting.
- Add production logging and observability.
- Add richer history filtering and comparison tools.

## Conclusion

Chart Insight Assistant demonstrates a complete AI product workflow in a compact codebase: upload, validate, analyze, render structured results, save history, and prepare for deployment. The architecture is intentionally simple, but it leaves clear paths for product hardening, monetization, and long-term expansion.
