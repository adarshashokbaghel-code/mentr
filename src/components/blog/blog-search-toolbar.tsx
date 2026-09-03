"use client";

import type { FunnelStage } from "@/lib/blog-posts";
import { FUNNEL_LABELS } from "@/lib/blog-posts";
import { hardShadowSm } from "@/components/landing/lp/shared";
import { cn } from "@/lib/utils";
import { ArrowDownAZ, Search, SlidersHorizontal, X } from "lucide-react";

export type BlogSort = "newest" | "oldest";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  sort: BlogSort;
  onSortChange: (value: BlogSort) => void;
  funnel: FunnelStage | "all";
  onFunnelChange: (value: FunnelStage | "all") => void;
  resultCount: number;
  totalCount: number;
};

const FUNNEL_OPTIONS: { id: FunnelStage | "all"; label: string }[] = [
  { id: "all", label: "All stages" },
  { id: "top", label: FUNNEL_LABELS.top },
  { id: "mid", label: FUNNEL_LABELS.mid },
  { id: "bottom", label: FUNNEL_LABELS.bottom },
];

export function BlogSearchToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  funnel,
  onFunnelChange,
  resultCount,
  totalCount,
}: Props) {
  const hasFilters = query.trim() !== "" || funnel !== "all" || sort !== "newest";

  return (
    <div className="mb-6 space-y-4 sm:mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search guides — JEE, UrbanPro, AI study, Bengaluru…"
            className={cn(
              "h-12 w-full rounded-xl border-2 border-ink bg-white pl-10 pr-10 text-sm font-medium text-ink outline-none transition placeholder:text-muted/80 focus:border-coral focus:ring-2 focus:ring-coral/20",
              hardShadowSm,
            )}
            aria-label="Search blog guides"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-cream hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          <label className="relative flex min-w-0 items-center">
            <span className="sr-only">Sort by date</span>
            <ArrowDownAZ
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as BlogSort)}
              className={cn(
                "h-12 min-w-[140px] appearance-none rounded-xl border-2 border-ink bg-white py-2 pl-9 pr-8 text-sm font-semibold text-ink outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 sm:min-w-[160px]",
                hardShadowSm,
              )}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Stage
        </span>
        {FUNNEL_OPTIONS.map((opt) => {
          const active = funnel === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onFunnelChange(opt.id)}
              className={cn(
                "inline-flex min-h-9 items-center rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98]",
                active
                  ? "border-ink bg-ink text-white shadow-[2px_2px_0_0_#1c1a17]"
                  : "border-ink/15 bg-white text-ink hover:border-ink/35 hover:bg-cream",
              )}
            >
              {opt.label}
            </button>
          );
        })}

        <span className="ml-auto text-xs text-muted">
          {resultCount === totalCount
            ? `${totalCount} guides`
            : `${resultCount} of ${totalCount} guides`}
        </span>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              onFunnelChange("all");
              onSortChange("newest");
            }}
            className="text-xs font-semibold text-coral hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
