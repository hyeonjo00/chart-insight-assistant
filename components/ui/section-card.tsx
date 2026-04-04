import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export function SectionCard({ children, className }: SectionCardProps) {
  return <section className={cn("panel p-5 sm:p-6", className)}>{children}</section>;
}
