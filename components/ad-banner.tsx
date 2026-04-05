"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdBannerProps = {
  adSlot?: string;
  className?: string;
  variant?: "default" | "compact";
  label?: "Ad" | "Sponsored";
};

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

export function AdBanner({
  adSlot,
  className,
  variant = "default",
  label = "Ad",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const hasInitializedRef = useRef(false);
  const isCompact = variant === "compact";
  const isLiveSlotReady = Boolean(adsenseClient && adSlot);

  useEffect(() => {
    if (!isLiveSlotReady || !adRef.current || hasInitializedRef.current || typeof window === "undefined") {
      return;
    }

    if (adRef.current.getAttribute("data-adsbygoogle-status")) {
      hasInitializedRef.current = true;
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      hasInitializedRef.current = true;
    } catch (error) {
      console.error("Failed to initialize AdSense slot", error);
    }
  }, [isLiveSlotReady]);

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
          {isLiveSlotReady ? "Google AdSense" : "Reserved Slot"}
        </span>
      </div>

      <div
        className={cn(
          "px-4 py-4 sm:px-5",
          isCompact ? "min-h-[152px]" : "min-h-[184px]",
        )}
      >
        <div
          className={cn(
            "flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 px-5",
            isCompact ? "min-h-[96px] py-5" : "min-h-[120px] py-6",
            !isLiveSlotReady && "border-dashed",
          )}
        >
          {isLiveSlotReady ? (
            <ins
              ref={adRef}
              className="adsbygoogle block w-full"
              style={{ display: "block" }}
              data-ad-client={adsenseClient}
              data-ad-slot={adSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          ) : (
            <div className="max-w-2xl text-center">
              <p className="text-sm font-semibold text-white">Ad space reserved</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Responsive placeholder prepared for a future Google AdSense banner without
                disrupting layout.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
