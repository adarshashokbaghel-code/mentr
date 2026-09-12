"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type LearnStat = {
  value: string;
  label: string;
  tint: string;
  icon?: LucideIcon;
  sub?: string;
};

export function LearnStatsSlider({ stats }: { stats: LearnStat[] }) {
  const loop = [...stats, ...stats];

  return (
    <section
      className="relative overflow-hidden border-y border-hairline bg-white"
      aria-label="Mentr Learn features"
    >
      <div className="learn-stats-track flex w-max">
        {loop.map((stat, i) => {
          const n = (i % stats.length) + 1;
          return (
            <div
              key={`${stat.label}-${i}`}
              className={cn(
                "group relative w-[min(50vw,280px)] shrink-0 overflow-hidden border-r border-hairline px-4 py-6 text-center sm:w-[min(33.33vw,320px)] sm:px-6 sm:py-10 md:w-[min(25vw,350px)] lg:px-8",
                stat.tint,
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md border-2 border-ink/15 bg-white/80 text-xs font-bold text-ink/50"
              >
                {String(n).padStart(2, "0")}
              </span>
              {stat.icon && <stat.icon className="mx-auto mb-3 h-5 w-5 text-ink/40" />}
              <p className="relative text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[40px]">
                {stat.value}
              </p>
              <p className="relative mt-2 text-sm font-semibold text-ink/80">{stat.label}</p>
              {stat.sub && <p className="relative mt-1 text-xs text-muted">{stat.sub}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
