import { cn } from "@/lib/utils";

type AdBannerProps = {
  className?: string;
  variant?: "default" | "compact";
  label?: "Ad" | "Sponsored";
};

export function AdBanner({
  className,
  variant = "default",
  label = "Sponsored",
}: AdBannerProps) {
  const isCompact = variant === "compact";

  return (
    <section
      aria-label={`${label} placement`}
      className={cn(
        "overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-slate-950/40 shadow-lg shadow-slate-950/10",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
          {label}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
          Reserved Slot
        </span>
      </div>

      <div
        className={cn(
          "flex items-center justify-center px-4 py-4 sm:px-5",
          isCompact ? "min-h-[152px]" : "min-h-[184px]",
        )}
      >
        {/* Replace this placeholder block with the real Google AdSense <ins /> code later. */}
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-5 text-center",
            isCompact ? "min-h-[96px] py-5" : "min-h-[120px] py-6",
          )}
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-white">Ad space reserved</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Responsive placeholder prepared for a future Google AdSense banner without
              disrupting layout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
