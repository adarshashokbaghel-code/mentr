"use client";

import { ToolCard } from "@/components/tools/tool-card";
import { ToolsSoftCta } from "@/components/tools/tools-soft-cta";
import {
  TOOLS,
  popularTools,
  searchTools,
  type ToolAudience,
  type ToolDef,
} from "@/lib/tools-catalog";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  GraduationCap,
  LayoutGrid,
  Search,
  Shield,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FilterId = "all" | ToolAudience | "popular";

function filterFromHash(hash: string): FilterId | null {
  const id = hash.replace(/^#/, "");
  if (id === "teachers" || id === "students" || id === "pdf") return id;
  return null;
}

const FILTERS: {
  id: FilterId;
  label: string;
  hint: string;
  icon: typeof LayoutGrid;
}[] = [
  { id: "all", label: "All tools", hint: "Full library", icon: LayoutGrid },
  { id: "popular", label: "Popular", hint: "Highest intent", icon: Sparkles },
  {
    id: "teachers",
    label: "Teachers",
    hint: "Papers · worksheets · plans",
    icon: GraduationCap,
  },
  {
    id: "students",
    label: "Students",
    hint: "CGPA · timetable",
    icon: Users,
  },
  {
    id: "pdf",
    label: "PDF",
    hint: "Merge · compress · convert",
    icon: FileText,
  },
];

function filterList(query: string, filter: FilterId): ToolDef[] {
  let list = searchTools(query).filter((t) => {
    if (filter === "popular") return !!t.popular && !t.deEmphasized;
    if (filter === "all") return true;
    return t.audience.includes(filter);
  });
  if (!query.trim() && filter === "all") {
    list = [...list].sort((a, b) => {
      const ap = Number(!!a.popular && !a.deEmphasized);
      const bp = Number(!!b.popular && !b.deEmphasized);
      return bp - ap;
    });
  }
  return list;
}

export function ToolsHubClient() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    const apply = () => {
      const fromHash = filterFromHash(window.location.hash);
      if (fromHash) setFilter(fromHash);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const results = useMemo(() => filterList(query, filter), [query, filter]);
  const popular = useMemo(() => popularTools().slice(0, 4), []);

  const activeLabel =
    FILTERS.find((f) => f.id === filter)?.label ?? "All tools";

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
      <span id="teachers" className="sr-only">
        Teacher tools
      </span>
      <span id="students" className="sr-only">
        Student tools
      </span>
      <span id="pdf" className="sr-only">
        PDF tools
      </span>
      <div className="flex gap-2 overflow-x-auto pb-1 pt-6 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "shrink-0 rounded-full border-2 px-3.5 py-2 text-[12px] font-extrabold transition",
              filter === f.id
                ? "border-ink bg-ink text-white"
                : "border-hairline bg-white text-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8 lg:py-10 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <nav
              aria-label="Tool categories"
              className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[3px_3px_0_0_#1c2434]"
            >
              <p className="border-b border-hairline bg-cream/60 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted">
                Browse
              </p>
              <ul className="p-2">
                {FILTERS.map((f) => {
                  const Icon = f.icon;
                  const active = filter === f.id;
                  const count = filterList("", f.id).length;
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => setFilter(f.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                          active ? "bg-ink text-white" : "text-ink hover:bg-cream",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            active ? "bg-white/15" : "bg-cream",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4",
                              active ? "text-white" : "text-coral",
                            )}
                            strokeWidth={2.25}
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-extrabold">
                            {f.label}
                          </span>
                          <span
                            className={cn(
                              "block text-[11px] font-medium",
                              active ? "text-white/70" : "text-muted",
                            )}
                          >
                            {f.hint}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "tabular-nums text-[11px] font-bold",
                            active ? "text-white/80" : "text-muted",
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="rounded-2xl border border-hairline bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Quick open
              </p>
              <ul className="mt-2 space-y-1">
                {popular.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[13px] font-bold text-ink transition hover:bg-cream hover:text-coral"
                    >
                      {t.shortTitle}
                      <Sparkles className="h-3 w-3 text-coral/70" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-sage/30 bg-sage-wash/40 p-4">
              <p className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-sage">
                <Shield className="h-3.5 w-3.5" />
                Private by design
              </p>
              <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-muted">
                Browser-side tools keep classroom data on your device.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-ink bg-ink p-4 text-white shadow-[3px_3px_0_0_#ff6a1a]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                After the tool
              </p>
              <p className="mt-1 text-[14px] font-extrabold leading-snug">
                Need a real tutor?
              </p>
              <Link
                href="/search"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-coral px-3 py-2.5 text-[13px] font-extrabold text-white transition hover:brightness-110"
              >
                Find a tutor
              </Link>
              <Link
                href="/learn/start"
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/20 px-3 py-2 text-[12px] font-bold text-white/90 transition hover:bg-white/10"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Free Learn Class 3–5
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search — question paper, worksheet, CGPA…"
              className="h-14 w-full rounded-2xl border-2 border-ink bg-white py-3.5 pl-12 pr-12 text-[15px] font-semibold text-ink shadow-[3px_3px_0_0_#1c2434] outline-none placeholder:font-medium placeholder:text-muted focus:ring-2 focus:ring-coral/40"
              aria-label="Search tools"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:bg-cream hover:text-ink"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {!query && filter === "all" ? (
            <section className="mt-8">
              <h2 className="text-[1.15rem] font-extrabold text-ink">Popular</h2>
              <p className="mt-0.5 text-[13px] font-medium text-muted">
                Highest-intent tools for teachers and students
              </p>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {popular.map((tool) => (
                  <li key={tool.slug}>
                    <ToolCard tool={tool} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-8 flex items-baseline justify-between gap-3">
            <h2 className="text-[1.15rem] font-extrabold text-ink sm:text-[1.25rem]">
              {query ? `Results for “${query}”` : activeLabel}
            </h2>
            <p className="text-[12px] font-bold text-muted">
              {results.length} tool{results.length === 1 ? "" : "s"}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="mt-5 rounded-2xl border-2 border-dashed border-hairline bg-white/70 px-6 py-16 text-center">
              <p className="text-[15px] font-extrabold text-ink">No tools matched</p>
              <button
                type="button"
                className="mt-2 font-bold text-coral underline"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {results.map((tool) => (
                <li key={tool.slug}>
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          )}

          <section className="mt-12 rounded-2xl border border-hairline bg-white p-6 sm:p-8">
            <h2 className="text-[1.2rem] font-extrabold text-ink">
              Education utilities — not a generic tool farm
            </h2>
            <div className="mt-4 grid gap-6 text-[14px] font-medium leading-relaxed text-muted lg:grid-cols-2">
              <p>
                Mentr Tools focuses on real teacher and student workflows:
                worksheets, sample question papers, lesson plans, CGPA checks and
                private PDF helpers. No signup wall. Browser-side processing
                where possible.
              </p>
              <p>
                When you need a person after the PDF,{" "}
                <Link href="/search" className="font-bold text-coral hover:underline">
                  find a verified tutor
                </Link>{" "}
                or{" "}
                <Link href="/learn" className="font-bold text-coral hover:underline">
                  explore Mentr Learn
                </Link>
                .
              </p>
            </div>
          </section>

          <div className="mt-8 pb-10">
            <ToolsSoftCta slug="tools-hub" />
          </div>
        </div>
      </div>
    </div>
  );
}
