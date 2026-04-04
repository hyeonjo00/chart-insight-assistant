"use client";

import type {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  createAnalysisHistoryId,
  createHistoryImagePreview,
  saveAnalysisHistoryItem,
} from "@/lib/analysis-history";
import type {
  AnalysisBias,
  AnalysisConfidence,
  AnalysisHistoryItem,
} from "@/lib/analysis-history";

const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ACCEPTED_EXTENSIONS = /\.(png|jpe?g|webp)$/i;
const ACCEPT_ATTRIBUTE = ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type AnalysisResult = Omit<AnalysisHistoryItem, "id" | "createdAt" | "imagePreview">;

type AnalyzeApiResult = {
  bias: "long" | "short" | "neutral";
  entry_zone: string;
  invalidation_zone: string;
  take_profit: string[];
  confidence: "low" | "medium" | "high";
  summary: string;
};

function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes < 1024 * 1024) {
    return `${Math.round(sizeInBytes / 1024)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateImageFile(file: File) {
  const hasAcceptedType =
    ACCEPTED_TYPES.has(file.type) || ACCEPTED_EXTENSIONS.test(file.name);

  if (!hasAcceptedType) {
    return "Upload a PNG, JPG, JPEG, or WEBP image.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return `Use an image smaller than ${formatFileSize(MAX_FILE_SIZE)}.`;
  }

  return null;
}

function toDisplayBias(bias: AnalyzeApiResult["bias"]): AnalysisBias {
  if (bias === "long") {
    return "Long";
  }

  if (bias === "short") {
    return "Short";
  }

  return "Neutral";
}

function toDisplayConfidence(confidence: AnalyzeApiResult["confidence"]): AnalysisConfidence {
  if (confidence === "high") {
    return "High";
  }

  if (confidence === "medium") {
    return "Medium";
  }

  return "Low";
}

function isAnalyzeApiResult(value: unknown): value is AnalyzeApiResult {
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

function mapAnalyzeApiResult(result: AnalyzeApiResult): AnalysisResult {
  return {
    bias: toDisplayBias(result.bias),
    entryZone: result.entry_zone,
    invalidationZone: result.invalidation_zone,
    takeProfitTargets: result.take_profit,
    confidence: toDisplayConfidence(result.confidence),
    summary: result.summary,
  };
}

async function analyzeChart(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload?.error === "string"
        ? payload.error
        : "We couldn't analyze this chart right now. Please try again.";

    throw new Error(message);
  }

  if (!isAnalyzeApiResult(payload)) {
    throw new Error("The analysis response was invalid. Please try again.");
  }

  return mapAnalyzeApiResult(payload);
}

function getBiasClasses(bias: AnalysisBias) {
  if (bias === "Long") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (bias === "Short") {
    return "border-rose-400/20 bg-rose-400/10 text-rose-100";
  }

  return "border-slate-400/20 bg-slate-400/10 text-slate-100";
}

function getConfidenceClasses(confidence: AnalysisConfidence) {
  if (confidence === "High") {
    return "border-sky-300/20 bg-sky-400/10 text-sky-100";
  }

  if (confidence === "Medium") {
    return "border-amber-300/20 bg-amber-400/10 text-amber-100";
  }

  return "border-slate-400/20 bg-slate-400/10 text-slate-100";
}

type AnalysisResultCardProps = {
  result: AnalysisResult;
  onReset: () => void;
};

function AnalysisResultCard({ result, onReset }: AnalysisResultCardProps) {
  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-slate-950/40 shadow-lg shadow-slate-950/20">
      <div className="border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              Chart Analysis Result
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Trade setup snapshot
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Scenario-based output generated from the uploaded chart screenshot.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]",
                getBiasClasses(result.bias),
              ].join(" ")}
            >
              {result.bias} Bias
            </span>
            <span
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]",
                getConfidenceClasses(result.confidence),
              ].join(" ")}
            >
              {result.confidence} Confidence
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Entry Zone
            </p>
            <p className="mt-3 text-base font-medium leading-6 text-slate-100">
              {result.entryZone}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Invalidation Zone
            </p>
            <p className="mt-3 text-base font-medium leading-6 text-slate-100">
              {result.invalidationZone}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Take Profit Targets
            </p>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Targets
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.takeProfitTargets.map((target, index) => (
              <span
                key={target}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-100"
              >
                TP{index + 1}: {target}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Summary
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">{result.summary}</p>
        </div>

        <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">
            Disclaimer
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-100">
            This analysis is scenario-based only and is not financial advice.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-400">
            This result is saved locally in your browser history.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
          >
            Analyze Another Chart
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChartUploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileErrorMessage, setFileErrorMessage] = useState<string | null>(null);
  const [analysisErrorMessage, setAnalysisErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  function resetLoadingState() {
    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    setIsLoading(false);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function applyFile(nextFile: File) {
    const validationError = validateImageFile(nextFile);

    if (validationError) {
      setFileErrorMessage(validationError);
      return;
    }

    resetLoadingState();
    setFileErrorMessage(null);
    setAnalysisErrorMessage(null);
    setAnalysisResult(null);
    setFile(nextFile);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];

    if (nextFile) {
      applyFile(nextFile);
    }

    event.target.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const nextTarget = event.relatedTarget as Node | null;

    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      setIsDragging(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const nextFile = event.dataTransfer.files?.[0];

    if (nextFile) {
      applyFile(nextFile);
    }
  }

  function handleDropzoneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }

  async function handleAnalyzeClick() {
    if (!file || isLoading) {
      return;
    }

    const sourceFile = file;

    setFileErrorMessage(null);
    setAnalysisErrorMessage(null);
    setAnalysisResult(null);
    setIsLoading(true);

    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current);
    }

    try {
      const nextResult = await analyzeChart(sourceFile);

      setAnalysisResult(nextResult);

      const imagePreview = await createHistoryImagePreview(sourceFile);

      saveAnalysisHistoryItem({
        id: createAnalysisHistoryId(),
        createdAt: new Date().toISOString(),
        imagePreview,
        ...nextResult,
      });
    } catch (error) {
      setAnalysisErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't analyze this chart right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
      loadingTimeoutRef.current = null;
    }
  }

  function handleClearClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    resetLoadingState();
    setFileErrorMessage(null);
    setAnalysisErrorMessage(null);
    setAnalysisResult(null);
    setFile(null);
  }

  function handleResetAnalysis() {
    resetLoadingState();
    setFileErrorMessage(null);
    setAnalysisErrorMessage(null);
    setAnalysisResult(null);
    setFile(null);
  }

  const fileDetails = file
    ? [
        { label: "Filename", value: file.name },
        {
          label: "Format",
          value: (file.type.replace("image/", "") || file.name.split(".").pop() || "unknown")
            .toUpperCase(),
        },
        { label: "Size", value: formatFileSize(file.size) },
      ]
    : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="panel p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Chart Screenshot</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Drop a screenshot here or browse from your device. Accepted formats: PNG, JPG,
              JPEG, and WEBP up to {formatFileSize(MAX_FILE_SIZE)}.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          onChange={handleFileChange}
        />

        <div
          role="button"
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={handleDropzoneKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-describedby="chart-upload-hint chart-upload-error"
          className={[
            "mt-6 flex min-h-[320px] cursor-pointer items-center justify-center rounded-3xl border border-dashed p-4 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70",
            isDragging
              ? "border-sky-300 bg-sky-400/10"
              : "border-white/10 bg-slate-950/30 hover:border-sky-300/40 hover:bg-white/[0.06]",
          ].join(" ")}
        >
          {previewUrl ? (
            <div className="w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-950/60">
              <div className="relative h-[320px] w-full bg-slate-950 sm:h-[420px]">
                <Image
                  src={previewUrl}
                  alt={`Preview of ${file?.name ?? "uploaded chart screenshot"}`}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-3 border-t border-white/10 bg-slate-950/80 p-4 text-left sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Preview ready</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Click or drop another image to replace the current screenshot.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
                  Replace image
                </span>
              </div>
            </div>
          ) : (
            <div className="max-w-md space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-sky-300/20 bg-sky-400/10 text-sky-300">
                <span className="text-2xl">+</span>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-white">Drop a chart screenshot here</p>
                <p id="chart-upload-hint" className="text-sm leading-6 text-slate-400">
                  Use drag and drop or click to choose an image from your device.
                </p>
              </div>
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                Select image
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openFilePicker}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
          >
            {file ? "Choose another image" : "Select image"}
          </button>
          {file ? (
            <button
              type="button"
              onClick={handleClearClick}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900"
            >
              Remove image
            </button>
          ) : null}
        </div>

        {fileErrorMessage ? (
          <p
            id="chart-upload-error"
            className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
          >
            {fileErrorMessage}
          </p>
        ) : null}
      </section>

      <aside className="space-y-4">
        <section className="panel p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            Upload status
          </h2>

          {!fileDetails ? (
            <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/30 p-4">
              <p className="text-base font-semibold text-white">No image selected</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add a chart screenshot to unlock preview and analysis actions.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {fileDetails.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 break-all text-sm text-slate-200">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
            Analysis
          </h2>

          {!file ? (
            <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/30 p-4">
              <p className="text-base font-semibold text-white">Empty state</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                The analysis area stays inactive until a valid image is uploaded.
              </p>
            </div>
          ) : isLoading ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-base font-semibold text-white">Analyzing chart setup</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Sending the uploaded chart to OpenAI for scenario-based analysis.
              </p>
              <div className="mt-4 space-y-3">
                <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
                <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
                  <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
                </div>
              </div>
            </div>
          ) : analysisResult ? (
            <AnalysisResultCard result={analysisResult} onReset={handleResetAnalysis} />
          ) : analysisErrorMessage ? (
            <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
              <p className="text-base font-semibold text-rose-100">Analysis failed</p>
              <p className="mt-2 text-sm leading-6 text-rose-100/90">{analysisErrorMessage}</p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-base font-semibold text-white">Ready to analyze</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Submit the uploaded chart to generate a cautious scenario-based read from OpenAI.
              </p>
            </div>
          )}

          {!analysisResult ? (
            <button
              type="button"
              onClick={handleAnalyzeClick}
              disabled={!file || isLoading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
            >
              {isLoading ? "Analyzing..." : "Analyze Chart"}
            </button>
          ) : null}
        </section>
      </aside>
    </div>
  );
}
