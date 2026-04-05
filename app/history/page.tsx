"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { AdBanner } from "@/components/ad-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { deleteAnalysisHistoryItem, getAnalysisHistory } from "@/lib/analysis-history";
import type {
  AnalysisBias,
  AnalysisConfidence,
  AnalysisHistoryItem,
} from "@/lib/analysis-history";

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

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function HistoryPage() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setItems(getAnalysisHistory());
    setHasLoaded(true);
  }, []);

  function handleDelete(id: string) {
    deleteAnalysisHistoryItem(id);
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="History"
        title="Saved local analysis history"
        description="Completed mock analyses are stored locally in this browser so you can review, compare, and remove them anytime."
      />

      <AdBanner />

      <SectionCard>
        {!hasLoaded ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-5 py-6 text-sm text-slate-400">
            Loading local history...
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No analysis history yet"
            description="Run a mock chart analysis on the Analyze page and it will appear here in local browser storage."
          />
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    {item.imagePreview ? (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
                        <Image
                          src={item.imagePreview}
                          alt={`Saved preview for ${item.bias} mock analysis`}
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                            getBiasClasses(item.bias),
                          ].join(" ")}
                        >
                          {item.bias} Bias
                        </span>
                        <span
                          className={[
                            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                            getConfidenceClasses(item.confidence),
                          ].join(" ")}
                        >
                          {item.confidence} Confidence
                        </span>
                      </div>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {formatCreatedAt(item.createdAt)}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Entry Zone
                    </p>
                    <p className="mt-2 text-sm text-slate-200">{item.entryZone}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Invalidation Zone
                    </p>
                    <p className="mt-2 text-sm text-slate-200">{item.invalidationZone}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Take Profit Targets
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.takeProfitTargets.map((target) => (
                      <span
                        key={target}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
                      >
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
