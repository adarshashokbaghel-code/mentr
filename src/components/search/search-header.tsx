"use client";

import {
  EXPERIENCE_STEPS,
  FILTER_LANGUAGES,
  LOCALITIES,
  type ModeFilter,
  type SearchSort,
} from "@/lib/teachers";
import { RADIUS_OPTIONS_KM } from "@/lib/geo";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  List,
  Map as MapIcon,
  Search as SearchIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SearchView = "list" | "map";
export type KindFilter = "all" | "tutor" | "mentor";

export interface SearchFiltersState {
  query: string;
  subject?: string;
  locality?: string;
  onlyOpen: boolean;
  onlyVerified: boolean;
  kind: KindFilter;
  /** Delivery mode: online, in person, or teachers offering both */
  mode: ModeFilter;
  /** Language the teacher must speak */
  language?: string;
  /** Minimum years of experience (0 = any) */
  minExp: number;
  sort: SearchSort;
  view: SearchView;
  /** Max distance from user lat/lng (km) */
  radiusKm: number;
}

interface SearchHeaderProps {
  filters: SearchFiltersState;
  resultCount: number;
  mobileFiltersOpen: boolean;
  onMobileFiltersOpenChange: (open: boolean) => void;
  onChange: (patch: Partial<SearchFiltersState>) => void;
  onClear: () => void;
  nearbyActive?: boolean;
  userLocation?: { lat: number; lng: number } | null;
}

const MODE_OPTIONS: { value: ModeFilter; label: string; hint: string }[] = [
  { value: "all", label: "All", hint: "Any way of teaching" },
  { value: "online", label: "Online", hint: "Video call classes" },
  { value: "inperson", label: "In person", hint: "At your or their home" },
  { value: "both", label: "Hybrid", hint: "Offers online + in person" },
];

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
  { value: "relevance", label: "Best match" },
  { value: "distance", label: "Nearest" },
  { value: "rating", label: "Top rated" },
  { value: "open", label: "Most open" },
  { value: "experience", label: "Experience" },
];

/** Subjects shown only in the Filters sidebar */
const FILTER_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Coding",
  "Biology",
  "Exam Prep",
] as const;

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition",
        active
          ? "border-ink bg-ink text-white"
          : "border-hairline bg-white text-muted hover:border-ink/20 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-3 text-left text-sm text-ink",
        className,
      )}
    >
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition",
          checked ? "bg-sage" : "bg-hairline",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition",
            checked ? "left-4" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

function FilterPanel({
  filters,
  resultCount,
  hasActiveFilters,
  nearbyActive,
  onChange,
  onClear,
  onClose,
}: {
  filters: SearchFiltersState;
  resultCount: number;
  hasActiveFilters: boolean;
  nearbyActive?: boolean;
  onChange: (patch: Partial<SearchFiltersState>) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-ink/30"
        aria-label="Close filters"
        onClick={onClose}
      />

      {/* Mobile: bottom sheet · Desktop: right panel */}
      <div
        className={cn(
          "absolute flex flex-col bg-cream shadow-xl",
          "inset-x-0 bottom-0 max-h-[88vh] rounded-t-lg border-t border-hairline",
          "sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[360px] sm:rounded-none sm:border-l sm:border-t-0",
        )}
      >
        {/* Header — fixed */}
        <div className="flex shrink-0 items-center justify-between border-b border-hairline bg-white px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">Filters</h2>
            <p className="text-[11px] text-muted">
              {resultCount} result{resultCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-semibold text-coral hover:underline"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline bg-white text-ink hover:bg-cream"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body — scrolls */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-cream px-4 py-4">
          {nearbyActive && (
            <section className="mb-5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Distance (lat / lng)
              </p>
              <p className="text-[11px] text-muted">
                Match teachers by real coordinates within this radius of you.
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {RADIUS_OPTIONS_KM.map((km) => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => onChange({ radiusKm: km, sort: "distance" })}
                    className={cn(
                      "rounded-md border py-2 text-center text-xs font-semibold transition",
                      filters.radiusKm === km
                        ? "border-coral bg-coral text-white"
                        : "border-hairline bg-white text-ink hover:border-ink/20",
                    )}
                  >
                    {km} km
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              {nearbyActive ? "Area (optional)" : "Area"}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ locality: undefined })}
                className={cn(
                  "rounded-md border px-2.5 py-2 text-left text-xs font-medium transition",
                  !filters.locality
                    ? "border-ink bg-ink text-white"
                    : "border-hairline bg-white text-ink hover:border-ink/20",
                )}
              >
                All Bengaluru
              </button>
              {LOCALITIES.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() =>
                    onChange({
                      locality: loc === filters.locality ? undefined : loc,
                    })
                  }
                  className={cn(
                    "rounded-md border px-2.5 py-2 text-left text-xs font-medium transition",
                    filters.locality === loc
                      ? "border-ink bg-ink text-white"
                      : "border-hairline bg-white text-ink hover:border-ink/20",
                  )}
                >
                  {loc}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Subject
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Chip
                active={!filters.subject}
                onClick={() => onChange({ subject: undefined })}
              >
                All
              </Chip>
              {FILTER_SUBJECTS.map((s) => (
                <Chip
                  key={s}
                  active={filters.subject === s}
                  onClick={() =>
                    onChange({
                      subject: s === filters.subject ? undefined : s,
                    })
                  }
                >
                  {s}
                </Chip>
              ))}
            </div>
          </section>

          <section className="mt-5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Type
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "tutor", label: "Tutors" },
                  { value: "mentor", label: "Mentors" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ kind: opt.value })}
                  className={cn(
                    "rounded-md border py-2 text-xs font-semibold transition",
                    filters.kind === opt.value
                      ? "border-coral bg-coral text-white"
                      : "border-hairline bg-white text-ink hover:border-ink/20",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Teaching mode
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ mode: opt.value })}
                  className={cn(
                    "rounded-md border px-2.5 py-2 text-left transition",
                    filters.mode === opt.value
                      ? "border-coral bg-coral text-white"
                      : "border-hairline bg-white hover:border-ink/20",
                  )}
                >
                  <span
                    className={cn(
                      "block text-xs font-semibold",
                      filters.mode === opt.value ? "text-white" : "text-ink",
                    )}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={cn(
                      "block text-[10px]",
                      filters.mode === opt.value
                        ? "text-white/80"
                        : "text-muted",
                    )}
                  >
                    {opt.hint}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Language
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Chip
                active={!filters.language}
                onClick={() => onChange({ language: undefined })}
              >
                Any
              </Chip>
              {FILTER_LANGUAGES.map((lang) => (
                <Chip
                  key={lang}
                  active={filters.language === lang}
                  onClick={() =>
                    onChange({
                      language: lang === filters.language ? undefined : lang,
                    })
                  }
                >
                  {lang}
                </Chip>
              ))}
            </div>
          </section>

          <section className="mt-5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Minimum experience
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {EXPERIENCE_STEPS.map((yrs) => (
                <button
                  key={yrs}
                  type="button"
                  onClick={() => onChange({ minExp: yrs })}
                  className={cn(
                    "rounded-md border py-2 text-center text-xs font-semibold transition",
                    filters.minExp === yrs
                      ? "border-ink bg-ink text-white"
                      : "border-hairline bg-white text-ink hover:border-ink/20",
                  )}
                >
                  {yrs === 0 ? "Any" : `${yrs}+ yrs`}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5 space-y-0 overflow-hidden rounded-md border border-hairline bg-white">
            <div className="border-b border-hairline px-3 py-2.5">
              <Toggle
                checked={filters.onlyOpen}
                onChange={(v) => onChange({ onlyOpen: v })}
                label="Open slots only"
              />
            </div>
            <div className="px-3 py-2.5">
              <Toggle
                checked={filters.onlyVerified}
                onChange={(v) => onChange({ onlyVerified: v })}
                label="Verified faculty only"
              />
            </div>
          </section>

          <section className="mt-5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Sort by
            </p>
            <div className="overflow-hidden rounded-md border border-hairline bg-white">
              {(nearbyActive
                ? SORT_OPTIONS
                : SORT_OPTIONS.filter((o) => o.value !== "distance")
              ).map((opt, i) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ sort: opt.value })}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-cream",
                    i > 0 && "border-t border-hairline",
                    filters.sort === opt.value && "bg-coral-wash",
                  )}
                >
                  <span
                    className={cn(
                      "font-medium",
                      filters.sort === opt.value ? "text-coral-dark" : "text-ink",
                    )}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border",
                      filters.sort === opt.value
                        ? "border-coral bg-coral"
                        : "border-hairline bg-white",
                    )}
                  >
                    {filters.sort === opt.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer — fixed */}
        <div className="shrink-0 border-t border-hairline bg-white px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-full items-center justify-center rounded-md bg-coral text-sm font-semibold text-white transition hover:bg-coral-dark"
          >
            Show {resultCount} teacher{resultCount === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SearchHeader({
  filters,
  resultCount,
  mobileFiltersOpen,
  onMobileFiltersOpenChange,
  onChange,
  onClear,
  nearbyActive,
  userLocation,
}: SearchHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasActiveFilters = Boolean(
    !!filters.subject ||
      !!filters.locality ||
      !!filters.query.trim() ||
      filters.onlyVerified ||
      filters.kind !== "all" ||
      filters.mode !== "all" ||
      !!filters.language ||
      filters.minExp > 0 ||
      !filters.onlyOpen ||
      (filters.sort !== "relevance" && filters.sort !== "distance") ||
      (nearbyActive && filters.radiusKm !== 25),
  );

  const activeFilterCount = [
    filters.subject,
    filters.locality,
    filters.onlyVerified,
    filters.kind !== "all",
    filters.mode !== "all",
    !!filters.language,
    filters.minExp > 0,
    !filters.onlyOpen,
    filters.sort !== "relevance" && filters.sort !== "distance",
    nearbyActive && filters.radiusKm !== 25,
  ].filter(Boolean).length;

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-hairline bg-cream/95 backdrop-blur-md">
        <div
          className={cn(
            "mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8",
            scrolled ? "py-2" : "py-3",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={filters.query}
                onChange={(e) => onChange({ query: e.target.value })}
                placeholder="Search subject — e.g. Class 10 Physics"
                className="h-10 w-full rounded-md border border-hairline bg-white pl-9 pr-3 text-sm outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-ink/5"
              />
            </div>

            {nearbyActive ? (
              <select
                value={filters.radiusKm}
                onChange={(e) =>
                  onChange({
                    radiusKm: Number(e.target.value),
                    sort: "distance",
                  })
                }
                className="hidden h-10 w-[140px] shrink-0 rounded-md border border-hairline bg-white px-2.5 text-sm font-medium text-ink outline-none focus:border-ink/30 md:block"
              >
                {RADIUS_OPTIONS_KM.map((km) => (
                  <option key={km} value={km}>
                    Within {km} km
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={filters.locality || ""}
                onChange={(e) =>
                  onChange({ locality: e.target.value || undefined })
                }
                className="hidden h-10 w-[140px] shrink-0 rounded-md border border-hairline bg-white px-2.5 text-sm font-medium text-ink outline-none focus:border-ink/30 md:block"
              >
                <option value="">All areas</option>
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => onMobileFiltersOpenChange(true)}
              className="relative inline-flex h-10 items-center gap-1.5 rounded-md border border-hairline bg-white px-3 text-xs font-semibold text-ink transition hover:bg-cream-band"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded bg-coral px-1 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="hidden h-10 items-center gap-0.5 rounded-md border border-hairline bg-white p-0.5 sm:flex">
              <button
                type="button"
                onClick={() => onChange({ view: "list" })}
                className={cn(
                  "inline-flex h-8 items-center gap-1 rounded px-2.5 text-[11px] font-semibold transition",
                  filters.view === "list"
                    ? "bg-ink text-white"
                    : "text-muted hover:text-ink",
                )}
              >
                <List className="h-3.5 w-3.5" />
                Grid
              </button>
              <button
                type="button"
                onClick={() => onChange({ view: "map" })}
                className={cn(
                  "inline-flex h-8 items-center gap-1 rounded px-2.5 text-[11px] font-semibold transition",
                  filters.view === "map"
                    ? "bg-ink text-white"
                    : "text-muted hover:text-ink",
                )}
              >
                <MapIcon className="h-3.5 w-3.5" />
                Map
              </button>
            </div>
          </div>

          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out",
              scrolled
                ? "mt-0 grid-rows-[0fr] opacity-0"
                : "mt-2.5 grid-rows-[1fr] opacity-100",
            )}
            aria-hidden={scrolled}
          >
            <div className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={filters.onlyOpen}
                    tabIndex={scrolled ? -1 : 0}
                    onClick={() => onChange({ onlyOpen: !filters.onlyOpen })}
                    className="flex items-center gap-2 text-xs font-medium text-muted"
                  >
                    <span
                      className={cn(
                        "relative h-5 w-9 rounded-full transition",
                        filters.onlyOpen ? "bg-sage" : "bg-hairline",
                      )}
                      aria-hidden
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition",
                          filters.onlyOpen ? "left-4" : "left-0.5",
                        )}
                      />
                    </span>
                    Open slots only
                  </button>
                  <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
                    <BadgeCheck className="h-3.5 w-3.5 text-sage" />
                    {nearbyActive
                      ? userLocation
                        ? `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}`
                        : "Near you"
                      : "Verified faculty"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-7 items-center gap-0.5 rounded-md border border-hairline bg-white p-0.5 sm:hidden">
                    <button
                      type="button"
                      tabIndex={scrolled ? -1 : 0}
                      onClick={() => onChange({ view: "list" })}
                      className={cn(
                        "rounded px-2 text-[10px] font-semibold",
                        filters.view === "list"
                          ? "bg-ink text-white"
                          : "text-muted",
                      )}
                    >
                      Grid
                    </button>
                    <button
                      type="button"
                      tabIndex={scrolled ? -1 : 0}
                      onClick={() => onChange({ view: "map" })}
                      className={cn(
                        "rounded px-2 text-[10px] font-semibold",
                        filters.view === "map"
                          ? "bg-ink text-white"
                          : "text-muted",
                      )}
                    >
                      Map
                    </button>
                  </div>

                  <p className="text-xs text-muted">
                    {resultCount} teacher{resultCount === 1 ? "" : "s"}
                    {filters.locality ? ` · ${filters.locality}` : ""}
                  </p>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      tabIndex={scrolled ? -1 : 0}
                      onClick={onClear}
                      className="text-xs font-semibold text-coral hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <FilterPanel
          filters={filters}
          resultCount={resultCount}
          hasActiveFilters={hasActiveFilters}
          nearbyActive={!!nearbyActive}
          onChange={onChange}
          onClear={onClear}
          onClose={() => onMobileFiltersOpenChange(false)}
        />
      )}
    </>
  );
}
