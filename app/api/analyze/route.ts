import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const MODEL = "gpt-4.1-mini";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

type AnalyzeApiResponse = {
  bias: "long" | "short" | "neutral";
  entry_zone: string;
  invalidation_zone: string;
  take_profit: string[];
  confidence: "low" | "medium" | "high";
  summary: string;
};

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    bias: {
      type: "string",
      enum: ["long", "short", "neutral"],
    },
    entry_zone: {
      type: "string",
      minLength: 1,
    },
    invalidation_zone: {
      type: "string",
      minLength: 1,
    },
    take_profit: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
      minItems: 1,
      maxItems: 4,
    },
    confidence: {
      type: "string",
      enum: ["low", "medium", "high"],
    },
    summary: {
      type: "string",
      minLength: 1,
    },
  },
  required: [
    "bias",
    "entry_zone",
    "invalidation_zone",
    "take_profit",
    "confidence",
    "summary",
  ],
  additionalProperties: false,
} as const;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isAnalyzeApiResponse(value: unknown): value is AnalyzeApiResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    (candidate.bias === "long" || candidate.bias === "short" || candidate.bias === "neutral") &&
    typeof candidate.entry_zone === "string" &&
    typeof candidate.invalidation_zone === "string" &&
    Array.isArray(candidate.take_profit) &&
    candidate.take_profit.every((item) => typeof item === "string") &&
    (candidate.confidence === "low" ||
      candidate.confidence === "medium" ||
      candidate.confidence === "high") &&
    typeof candidate.summary === "string"
  );
}

function extractTextOutput(payload: unknown) {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const response = payload as { output?: unknown[]; output_text?: unknown };

  if (typeof response.output_text === "string" && response.output_text.length > 0) {
    return response.output_text;
  }

  if (!Array.isArray(response.output)) {
    return null;
  }

  for (const item of response.output) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const content = (item as { content?: unknown[] }).content;

    if (!Array.isArray(content)) {
      continue;
    }

    for (const part of content) {
      if (typeof part !== "object" || part === null) {
        continue;
      }

      const typedPart = part as { type?: string; text?: string };

      if (typedPart.type === "output_text" && typeof typedPart.text === "string") {
        return typedPart.text;
      }
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonError("Server configuration is missing OPENAI_API_KEY.", 500);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonError("Please upload a chart image.", 400);
  }

  if (!ACCEPTED_TYPES.has(file.type)) {
    return jsonError("Only PNG, JPG, JPEG, and WEBP images are supported.", 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    return jsonError("Please upload an image smaller than 5 MB.", 400);
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const imageDataUrl = `data:${file.type};base64,${fileBuffer.toString("base64")}`;

  const analysisPrompt = [
    "You are a cautious chart-analysis assistant.",
    "Analyze the uploaded chart screenshot and provide a scenario-based market interpretation.",
    "Do not provide financial advice or guarantee future price movement.",
    "Return only valid JSON.",
    "",
    "Required fields:",
    "- bias: long, short, or neutral",
    "- entry_zone: string",
    "- invalidation_zone: string",
    "- take_profit: array of strings",
    "- confidence: low, medium, or high",
    "- summary: string",
    "",
    "Rules:",
    "- Be conservative",
    "- If the chart is unclear, use neutral bias and low confidence",
    "- Avoid certainty",
    "- Keep the summary short and practical",
  ].join("\n");

  let openAIResponse: Response;

  try {
    openAIResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        store: false,
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: analysisPrompt },
              { type: "input_image", image_url: imageDataUrl },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "chart_analysis",
            strict: true,
            schema: ANALYSIS_SCHEMA,
          },
        },
      }),
    });
  } catch (error) {
    console.error("OpenAI analyze request threw before receiving a response", error);
    return jsonError("We couldn't reach the analysis service. Please try again.", 502);
  }

  if (!openAIResponse.ok) {
    const errorPayload = await openAIResponse.json().catch(() => null);
    const apiMessage =
      typeof errorPayload?.error?.message === "string" ? errorPayload.error.message : null;

    console.error("OpenAI analyze request failed", apiMessage ?? openAIResponse.statusText);

    return jsonError("We couldn't analyze this chart right now. Please try again.", 502);
  }

  const responsePayload = await openAIResponse.json();
  const outputText = extractTextOutput(responsePayload);

  if (!outputText) {
    console.error("OpenAI analyze response missing text output", responsePayload);
    return jsonError("The analysis response was incomplete. Please try again.", 502);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(outputText);
  } catch (error) {
    console.error("Failed to parse OpenAI analysis JSON", error);
    return jsonError("The analysis response could not be parsed. Please try again.", 502);
  }

  if (!isAnalyzeApiResponse(parsed)) {
    console.error("OpenAI analysis JSON did not match expected schema", parsed);
    return jsonError("The analysis response was invalid. Please try again.", 502);
  }

  return NextResponse.json(parsed);
}
