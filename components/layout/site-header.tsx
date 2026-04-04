"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/history", label: "History" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="panel sticky top-4 z-20 flex flex-col gap-4 px-4 py-4 shadow-lg shadow-slate-950/20 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div>
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          Chart Insight Assistant
        </Link>
        <p className="mt-1 text-sm text-slate-400">
          Scaffold for a future AI-powered stock chart workflow.
        </p>
      </div>
      <nav className="flex flex-wrap gap-2">
        {navigation.map((item) => {
          const isActive =
            item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sky-400 text-slate-950"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
