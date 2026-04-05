import Link from "next/link";

import { AdBanner } from "@/components/ad-banner";
import { FeatureCard } from "@/components/ui/feature-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

const highlights = [
  {
    title: "Focused Workspace",
    description:
      "A calm, dark interface designed for future chart uploads, signal summaries, and assistant-driven workflows.",
  },
  {
    title: "Scalable Structure",
    description:
      "App router pages, reusable UI components, and shared data models are separated for easier iteration.",
  },
  {
    title: "Portfolio Ready",
    description:
      "This starter keeps the experience polished without prematurely wiring in OpenAI or image analysis logic.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <SectionCard className="overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <PageHeader
              eyebrow="Next.js starter"
              title="Chart Insight Assistant"
              description="A professional foundation for a future stock chart analysis product with room for AI, uploads, and session history."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300"
              >
                Explore Analyze
              </Link>
              <Link
                href="/history"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                View History
              </Link>
            </div>
          </div>
          <div className="panel p-5 shadow-glow">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-300">
              Planned modules
            </p>
            <div className="mt-6 space-y-4">
              {["Chart upload", "AI insight engine", "Prompt presets", "Saved sessions"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      <AdBanner />

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </section>
    </div>
  );
}
