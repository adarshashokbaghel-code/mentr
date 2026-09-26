"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { ConnectButton } from "@/components/connect/connect-button";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { PremiumMentorBadge } from "@/components/ui/mentor-status-badges";
import {
  EXPERIENCE_STEPS,
  fetchPremiumTeachers,
  formatHourlyRate,
  LOCALITIES,
  modeLabels,
  SUBJECTS,
  type Teacher,
} from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Globe2,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const SIGNUP_HREF =
  "/parent/signup?next=" + encodeURIComponent("/premiummentors");

type ModeFilter = "all" | "online" | "home";
type SortKey = "relevance" | "rate_low" | "rate_high" | "experience" | "newest";

const SUBJECT_CHIPS = ["All", ...SUBJECTS.slice(0, 8)] as const;

function displayName(name: string): string {
  const cleaned = name.replace(/\s+/g, " ").trim();
  const parts = cleaned.split(" ");
  if (parts.length >= 4) {
    const mid = Math.floor(parts.length / 2);
    const a = parts.slice(0, mid).join(" ").toLowerCase();
    const b = parts.slice(mid).join(" ").toLowerCase();
    if (a === b) return parts.slice(0, mid).join(" ");
  }
  return cleaned;
}

function shortBio(bio: string, max = 110): string {
  const one = bio.replace(/\s+/g, " ").trim();
  if (!one) return "Verified Premium tutor ready to teach.";
  if (one.length <= max) return one;
  return `${one.slice(0, max - 1).trim()}…`;
}

function primarySubject(teacher: Teacher): string {
  return (
    teacher.subjects[0] ||
    teacher.subjectLine.split("&")[0]?.trim() ||
    "Tutor"
  );
}

function matchesMode(t: Teacher, mode: ModeFilter): boolean {
  if (mode === "all") return true;
  const modes = t.modes || [];
  if (modes.length === 0) return true;
  if (mode === "online") return modes.includes("online");
  return modes.includes("student_home") || modes.includes("tutor_home");
}

function PremiumListCard({ teacher }: { teacher: Teacher }) {
  const name = displayName(teacher.name);
  const subject = primarySubject(teacher);
  const rate = formatHourlyRate(teacher.hourlyRate);
  const modes = modeLabels(teacher).slice(0, 2);
  const profileHref = `/teachers/${teacher.id}`;
  const place = teacher.locality || teacher.area || "India";

  return (
    <article
      className={cn(
        "flex gap-3 rounded-2xl border border-hairline bg-white p-3",
        "shadow-[0_1px_2px_rgba(28,26,23,0.04)] transition",
        "hover:border-ink/15 hover:shadow-[0_8px_24px_rgba(28,26,23,0.07)]",
        "sm:gap-4 sm:p-4",
      )}
    >
      <Link
        href={profileHref}
        className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-cream-band sm:h-[112px] sm:w-[112px]"
      >
        <MentorPhoto
          name={name}
          imageUrl={teacher.imageUrl}
          size="fill"
          rounded="xl"
          className="!absolute !inset-0 !h-full !w-full !rounded-none object-cover"
          showInitials
        />
        <span className="absolute left-1.5 top-1.5">
          <PremiumMentorBadge size="sm" />
        </span>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={profileHref} className="group block min-w-0">
              <h3 className="flex items-center gap-1 truncate text-[15px] font-bold tracking-tight text-ink group-hover:text-[#5b7cfa] sm:text-base">
                <span className="truncate">{name}</span>
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#5b7cfa]" />
              </h3>
            </Link>
            <p className="mt-0.5 truncate text-[12px] font-semibold text-[#6b87f5] sm:text-[13px]">
              {subject}
              {teacher.experienceYears > 0
                ? ` · ${teacher.experienceYears}+ yrs`
                : ""}
            </p>
          </div>
          {rate ? (
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-bold tabular-nums text-ink sm:text-base">
                {rate}
              </p>
              <p className="text-[10px] font-medium text-muted">indicative</p>
            </div>
          ) : null}
        </div>

        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted sm:mt-2 sm:text-[13px]">
          {shortBio(teacher.bio)}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex max-w-[160px] items-center gap-0.5 truncate rounded-full border border-hairline bg-cream px-2 py-0.5 text-[10px] font-semibold text-muted sm:max-w-none">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{place}</span>
          </span>
          {modes.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-0.5 rounded-full border border-hairline bg-cream px-2 py-0.5 text-[10px] font-semibold text-ink"
            >
              {m === "Online" ? (
                <Globe2 className="h-2.5 w-2.5 text-[#6b87f5]" />
              ) : (
                <Home className="h-2.5 w-2.5 text-[#c4a574]" />
              )}
              {m}
            </span>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <ConnectButton
            teacher={{
              id: teacher.id,
              name: teacher.name,
              subjectLine: teacher.subjectLine,
              phone: teacher.phone,
              connectionStatus: teacher.connectionStatus,
              live: teacher.live !== false,
              premium: true,
            }}
            label="Connect"
            className={cn(
              "inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl",
              "bg-gradient-to-r from-[#5b7cfa] to-[#c4a574]",
              "text-[13px] font-bold text-white",
              "shadow-[0_6px_16px_rgba(91,124,250,0.25)]",
              "transition hover:brightness-105 active:scale-[0.99]",
              "sm:flex-none sm:px-6",
            )}
            requestedClassName={cn(
              "inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl",
              "border border-hairline bg-cream text-[13px] font-semibold text-muted",
              "sm:flex-none sm:px-6",
            )}
          />
          <Link
            href={profileHref}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-xl border border-hairline bg-white",
              "px-3 text-[12px] font-semibold text-ink transition hover:bg-cream",
              "sm:px-4 sm:text-[13px]",
            )}
          >
            Profile
          </Link>
        </div>
      </div>
    </article>
  );
}

function FilterSheet({
  open,
  onClose,
  mode,
  setMode,
  locality,
  setLocality,
  minExp,
  setMinExp,
  onClear,
}: {
  open: boolean;
  onClose: () => void;
  mode: ModeFilter;
  setMode: (m: ModeFilter) => void;
  locality: string;
  setLocality: (v: string) => void;
  minExp: number;
  setMinExp: (n: number) => void;
  onClear: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl border border-hairline bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <section className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            Teaching mode
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: "all", label: "Any" },
                { id: "online", label: "Online" },
                { id: "home", label: "At home" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMode(opt.id)}
                className={cn(
                  "rounded-xl border py-2.5 text-xs font-semibold transition",
                  mode === opt.id
                    ? "border-ink bg-ink text-white"
                    : "border-hairline bg-white text-ink hover:bg-cream",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            Area
          </p>
          <select
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="h-11 w-full rounded-xl border border-hairline bg-cream px-3 text-sm font-medium outline-none focus:border-ink/30"
          >
            <option value="">All areas</option>
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </section>

        <section className="mt-5 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            Experience
          </p>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_STEPS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setMinExp(y)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  minExp === y
                    ? "border-ink bg-ink text-white"
                    : "border-hairline bg-white text-ink hover:bg-cream",
                )}
              >
                {y === 0 ? "Any" : `${y}+ yrs`}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => {
              onClear();
              onClose();
            }}
            className="h-11 flex-1 rounded-xl border border-hairline text-sm font-semibold text-ink"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-xl bg-ink text-sm font-bold text-white"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

export function PremiumMentorsLanding({
  initialMentors,
}: {
  initialMentors: Teacher[];
}) {
  const { user, openRoleChooser } = useAuth();
  const [mentors, setMentors] = useState<Teacher[]>(initialMentors);
  const [loading, setLoading] = useState(initialMentors.length === 0);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [mode, setMode] = useState<ModeFilter>("all");
  const [locality, setLocality] = useState("");
  const [minExp, setMinExp] = useState(0);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchPremiumTeachers().then(({ teachers, failed }) => {
      if (cancelled) return;
      if (!failed && teachers.length > 0) setMentors(teachers);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = mentors.filter((t) => {
      if (subject !== "All" && !t.subjects.some((s) => s.includes(subject))) {
        return false;
      }
      if (!matchesMode(t, mode)) return false;
      if (locality) {
        const hay = `${t.locality} ${t.area}`.toLowerCase();
        if (!hay.includes(locality.toLowerCase())) return false;
      }
      if (minExp > 0 && t.experienceYears < minExp) return false;
      if (q) {
        const hay = [
          t.name,
          t.subjectLine,
          t.subjects.join(" "),
          t.area,
          t.locality,
          t.bio.slice(0, 200),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "rate_low") {
        return (a.hourlyRate ?? 1e9) - (b.hourlyRate ?? 1e9);
      }
      if (sort === "rate_high") {
        return (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0);
      }
      if (sort === "experience") {
        return b.experienceYears - a.experienceYears;
      }
      if (sort === "newest") {
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      }
      return 0;
    });

    return list;
  }, [mentors, query, subject, mode, locality, minExp, sort]);

  const activeFilterCount = [
    mode !== "all",
    !!locality,
    minExp > 0,
  ].filter(Boolean).length;

  const clearExtraFilters = () => {
    setMode("all");
    setLocality("");
    setMinExp(0);
  };

  const clearAll = () => {
    setQuery("");
    setSubject("All");
    clearExtraFilters();
    setSort("relevance");
  };

  const isGuest = !user;
  const isParent = user?.role === "parent";

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-ink">
      <Navbar />

      <main className="pb-24 short:pb-20 sm:pb-8">
        {/* Compact trust strip */}
        <section className="border-b border-hairline bg-gradient-to-r from-[#eef1ff] via-white to-[#f7f1e8]">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b87f5]">
                Premium mentors
              </p>
              <h1 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">
                100% verified tutors, ready to connect
              </h1>
              <p className="mt-1 max-w-[52ch] text-[13px] leading-relaxed text-muted">
                Hand-checked Premium mentors. Browse free — connect with or
                without login. No agency fee.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-muted">
              <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-white px-2.5 py-1">
                <ShieldCheck className="h-3 w-3 text-[#6b87f5]" />
                Identity verified
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-white px-2.5 py-1">
                <Sparkles className="h-3 w-3 text-[#a8895a]" />
                Premium badge
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-white px-2.5 py-1">
                <Zap className="h-3 w-3 text-[#a8895a]" />
                Fast response
              </span>
            </div>
          </div>
        </section>

        {/* Sticky search + filters — Urban Company style */}
        <div className="sticky top-0 z-40 border-b border-hairline bg-white/95 shadow-[0_1px_0_rgba(28,26,23,0.04)] backdrop-blur-md">
          <div className="mx-auto max-w-[1100px] px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search Premium mentors</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subject, name or area…"
                  className={cn(
                    "h-12 w-full rounded-2xl border border-hairline bg-[#f6f5f2] pl-10 pr-10",
                    "text-[15px] text-ink placeholder:text-muted/70 outline-none",
                    "focus:border-[#6b87f5]/45 focus:bg-white focus:ring-2 focus:ring-[#5b7cfa]/15",
                  )}
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-hairline text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </label>

              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className={cn(
                  "relative inline-flex h-12 shrink-0 items-center gap-1.5 rounded-2xl border border-hairline bg-white px-3.5",
                  "text-[13px] font-semibold text-ink transition hover:bg-cream",
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5b7cfa] px-1 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </div>

            {/* Subject chips */}
            <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
              {SUBJECT_CHIPS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition",
                    subject === s
                      ? "border-ink bg-ink text-white"
                      : "border-hairline bg-white text-ink hover:border-ink/25",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Mode + sort + count */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: "all", label: "Any mode" },
                    { id: "online", label: "Online" },
                    { id: "home", label: "At home" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMode(opt.id)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition",
                      mode === opt.id
                        ? "border-[#5b7cfa]/40 bg-[#eef1ff] text-[#3d4f9c]"
                        : "border-transparent bg-[#f6f5f2] text-muted hover:text-ink",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <p className="text-[12px] font-medium text-muted">
                  {loading
                    ? "Loading…"
                    : `${filtered.length} mentor${filtered.length === 1 ? "" : "s"}`}
                </p>
                <label className="relative">
                  <span className="sr-only">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="h-8 appearance-none rounded-lg border border-hairline bg-white py-1 pl-2.5 pr-7 text-[11px] font-semibold text-ink outline-none"
                  >
                    <option value="relevance">Best match</option>
                    <option value="rate_low">Fee: low to high</option>
                    <option value="rate_high">Fee: high to low</option>
                    <option value="experience">Most experience</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" />
                </label>
                {(query ||
                  subject !== "All" ||
                  activeFilterCount > 0 ||
                  sort !== "relevance") && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[11px] font-semibold text-[#5b7cfa] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <section
          id="premium-grid"
          className="scroll-mt-28 px-4 py-4 sm:px-6 sm:py-5 lg:px-8"
        >
          <div className="mx-auto max-w-[1100px]">
            {loading && mentors.length === 0 ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-2xl border border-hairline bg-white p-3"
                  >
                    <div className="h-[88px] w-[88px] shrink-0 animate-pulse rounded-xl bg-cream-band sm:h-[112px] sm:w-[112px]" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 w-40 animate-pulse rounded bg-cream-band" />
                      <div className="h-3 w-28 animate-pulse rounded bg-cream-band" />
                      <div className="h-3 w-full animate-pulse rounded bg-cream-band" />
                      <div className="h-9 w-28 animate-pulse rounded-xl bg-cream-band" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-hairline bg-white px-5 py-14 text-center">
                <p className="text-base font-semibold text-ink">
                  No Premium mentors match
                </p>
                <p className="mt-1.5 text-sm text-muted">
                  Try another subject, clear filters, or browse all tutors.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex h-10 items-center rounded-xl bg-ink px-4 text-sm font-semibold text-white"
                  >
                    Clear filters
                  </button>
                  <Link
                    href="/search"
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-hairline bg-white px-4 text-sm font-semibold text-ink"
                  >
                    Browse all tutors
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((t) => (
                  <PremiumListCard key={t.id} teacher={t} />
                ))}
              </div>
            )}

            {isGuest ? (
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#5b7cfa]/20 bg-gradient-to-r from-[#eef1ff] to-[#f7f1e8] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-[14px] font-semibold text-ink sm:max-w-[40ch]">
                  Prefer an account? Register free and track connects from your
                  dashboard.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={SIGNUP_HREF}
                    className={cn(
                      "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4",
                      "bg-gradient-to-r from-[#5b7cfa] to-[#c4a574]",
                      "text-[13px] font-bold text-white",
                    )}
                  >
                    Create parent account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => openRoleChooser("/premiummentors")}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-hairline bg-white px-4 text-[13px] font-semibold text-ink"
                  >
                    Log in
                  </button>
                </div>
              </div>
            ) : isParent ? (
              <p className="mt-5 text-center text-[12px] text-muted">
                You&apos;re signed in as a parent — Connect goes straight to the
                tutor.
              </p>
            ) : null}
          </div>
        </section>

        {/* Compact FAQ */}
        <section className="border-t border-hairline bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">
              Premium tutors — FAQs
            </h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                {
                  q: "Are Premium tutors 100% verified?",
                  a: "Yes. They complete identity verification and a full profile before earning the Premium badge.",
                },
                {
                  q: "Do parents pay for Premium?",
                  a: "No. Parents never pay Mentr to search or connect. You only pay the tutor after you hire them.",
                },
                {
                  q: "Connect without login?",
                  a: "Yes for Premium tutors. Tap Connect and send a requirement, or register to track replies.",
                },
              ].map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-hairline bg-[#f6f5f2] p-4"
                >
                  <dt className="text-[13px] font-bold text-ink">{item.q}</dt>
                  <dd className="mt-1.5 text-[12px] leading-relaxed text-muted">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        mode={mode}
        setMode={setMode}
        locality={locality}
        setLocality={setLocality}
        minExp={minExp}
        setMinExp={setMinExp}
        onClear={clearExtraFilters}
      />

      <Footer />
    </div>
  );
}
