"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { ConnectButton } from "@/components/connect/connect-button";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PostRequirementButton } from "@/components/requirements/post-requirement-cta";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { PremiumMentorBadge } from "@/components/ui/mentor-status-badges";
import {
  fetchPremiumTeachers,
  formatHourlyRate,
  modeLabels,
  SUBJECTS,
  type Teacher,
} from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Crown,
  Globe2,
  Home,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";

const SIGNUP_HREF =
  "/parent/signup?next=" + encodeURIComponent("/premiummentors");

const SUBJECT_TABS = ["All", ...SUBJECTS.slice(0, 8)] as const;

const FAQS = [
  {
    q: "What makes a tutor Premium?",
    a: "They've verified their identity with us, filled in a complete profile with fees and availability, and we've checked it by hand. Only then do they show up on this page.",
  },
  {
    q: "Do I pay anything to connect?",
    a: "No. Searching and connecting is free. You pay the tutor directly for classes once you decide to go ahead.",
  },
  {
    q: "Do I need an account?",
    a: "Not for Premium tutors. Tap Connect, tell them what your child needs, and they'll reach out. An account just lets you track replies in one place.",
  },
  {
    q: "How is this different from regular tutors?",
    a: "Anyone can list on Mentr for free. Premium tutors have gone through extra checks and tend to respond faster, so they're a good place to start if you want a quick, serious match.",
  },
];

const connectCls = cn(
  "inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl",
  "bg-gradient-to-r from-[#5b7cfa] to-[#c4a574] text-sm font-bold text-white",
  "shadow-[0_8px_20px_rgba(91,124,250,0.28)] transition hover:brightness-105 active:scale-[0.99]",
);

const connectRequestedCls = cn(
  "inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl",
  "border border-hairline bg-[#f6f5f2] text-sm font-semibold text-muted",
);

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

function shortBio(bio: string, max = 120): string {
  const one = bio.replace(/\s+/g, " ").trim();
  if (!one) return "";
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

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Hero visuals ───────────────────────────────────────────────── */

const FAN_MAX = 5;
const FAN_INTERVAL_MS = 2800;

function HeroPhotoFan({ mentors }: { mentors: Teacher[] }) {
  const picks = mentors.slice(0, FAN_MAX);
  const n = picks.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (n < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % n),
      FAN_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [n, paused]);

  if (n === 0) return null;

  return (
    <div
      className="relative mx-auto h-[420px] w-full max-w-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {picks.map((t, i) => {
        const name = displayName(t.name);
        let offset = (i - active + n) % n;
        if (offset > n / 2) offset -= n;
        const dist = Math.abs(offset);
        return (
          <Link
            key={t.id}
            href={`/teachers/${t.id}`}
            tabIndex={offset === 0 ? 0 : -1}
            aria-hidden={offset !== 0}
            style={{
              transform: `translateX(-50%) translateX(${offset * 58}%) translateY(${dist * 20}px) rotate(${offset * 7}deg) scale(${1 - dist * 0.1})`,
              zIndex: 10 - dist,
              opacity: dist >= 2 ? 0 : dist === 1 ? 0.9 : 1,
            }}
            className={cn(
              "absolute left-1/2 top-0 w-[44%] rounded-2xl bg-white p-2 pb-3",
              "shadow-[0_24px_48px_rgba(10,14,40,0.35)]",
              "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              dist >= 2 && "pointer-events-none",
            )}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#eef1ff]">
              <MentorPhoto
                name={name}
                imageUrl={t.imageUrl}
                size="fill"
                rounded="xl"
                className="!absolute !inset-0 !h-full !w-full !rounded-none object-cover object-top"
                showInitials
                alt=""
              />
            </div>
            <p className="mt-2.5 truncate px-1 text-[13px] font-bold text-ink">
              {name}
            </p>
            <p className="truncate px-1 text-[11px] font-semibold text-[#6b87f5]">
              {primarySubject(t)}
            </p>
          </Link>
        );
      })}

      {n > 1 ? (
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5">
          {picks.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Show ${displayName(t.name)}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === active
                  ? "w-6 bg-[#e8d5b5]"
                  : "w-1.5 bg-white/35 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AvatarStack({ mentors }: { mentors: Teacher[] }) {
  const picks = mentors.slice(0, 5);
  if (picks.length === 0) return null;
  return (
    <div className="flex -space-x-2.5">
      {picks.map((t) => (
        <span
          key={t.id}
          className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-[#3a4688] bg-[#eef1ff]"
        >
          <MentorPhoto
            name={displayName(t.name)}
            imageUrl={t.imageUrl}
            size="fill"
            rounded="full"
            className="!absolute !inset-0 !h-full !w-full object-cover"
            showInitials
            alt=""
          />
        </span>
      ))}
    </div>
  );
}

/* ── Card ───────────────────────────────────────────────────────── */

function MentorCard({ teacher }: { teacher: Teacher }) {
  const name = displayName(teacher.name);
  const subject = primarySubject(teacher);
  const rate = formatHourlyRate(teacher.hourlyRate);
  const modes = modeLabels(teacher).slice(0, 2);
  const profileHref = `/teachers/${teacher.id}`;
  const place = titleCase(teacher.locality || teacher.area || "");
  const bio = shortBio(teacher.bio);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white",
        "ring-1 ring-[#c4a574]/30 shadow-[0_10px_30px_rgba(20,28,60,0.08)]",
        "transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(20,28,60,0.16)]",
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-[#eef1ff]">
        <Link href={profileHref} className="absolute inset-0 block">
          <MentorPhoto
            name={name}
            imageUrl={teacher.imageUrl}
            size="fill"
            rounded="xl"
            className="!absolute !inset-0 !h-full !w-full !rounded-none object-cover object-top transition duration-500 group-hover:scale-[1.04]"
            showInitials
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14182a]/85 via-[#14182a]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="truncate text-xl font-bold tracking-tight text-white">
              {name}
            </h3>
            <p className="mt-0.5 truncate text-[13px] font-semibold text-[#e8d5b5]">
              {subject}
              {teacher.experienceYears > 0
                ? ` · ${teacher.experienceYears}+ yrs`
                : ""}
            </p>
          </div>
        </Link>

        <span className="absolute left-3 top-3 z-10">
          <PremiumMentorBadge size="md" />
        </span>
        {rate ? (
          <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg bg-white/95 px-2 py-1 text-[13px] font-bold tabular-nums text-ink shadow-sm">
            {rate}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {bio ? (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">
            {bio}
          </p>
        ) : null}

        <div className="mb-4 mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-ink/70">
          {place ? (
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#c4a574]" />
              <span className="truncate">{place}</span>
            </span>
          ) : null}
          {modes.map((m) => (
            <span key={m} className="inline-flex items-center gap-1">
              {m === "Online" ? (
                <Globe2 className="h-3.5 w-3.5 text-[#6b87f5]" />
              ) : (
                <Home className="h-3.5 w-3.5 text-[#c4a574]" />
              )}
              {m}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-2">
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
            className={connectCls}
            requestedClassName={connectRequestedCls}
          />
          <Link
            href={profileHref}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-hairline bg-white px-4 text-sm font-semibold text-ink transition hover:border-[#5b7cfa]/40 hover:text-[#3d4f9c]"
          >
            Profile
          </Link>
        </div>
      </div>
    </article>
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#c4a574]/20">
      <div className="aspect-[5/4] animate-pulse bg-[#eef1ff]" />
      <div className="space-y-2.5 p-4">
        <div className="h-4 w-full animate-pulse rounded bg-[#f1efe9]" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#f1efe9]" />
        <div className="flex gap-2 pt-3">
          <div className="h-11 flex-1 animate-pulse rounded-xl bg-[#eef1ff]" />
          <div className="h-11 w-20 animate-pulse rounded-xl bg-[#f1efe9]" />
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */

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

  const heroMentors = useMemo(
    () => [...mentors].sort((a, b) => Number(!!b.imageUrl) - Number(!!a.imageUrl)),
    [mentors],
  );

  const subjectCount = useMemo(
    () => new Set(mentors.flatMap((t) => t.subjects)).size,
    [mentors],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mentors.filter((t) => {
      if (subject !== "All" && !t.subjects.some((s) => s.includes(subject))) {
        return false;
      }
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
  }, [mentors, query, subject]);

  const hasFilters = !!query || subject !== "All";

  const clearAll = () => {
    setQuery("");
    setSubject("All");
  };

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    document
      .getElementById("premium-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isGuest = !user;
  const count = filtered.length;

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-ink">
      <Navbar />

      <main>
        {/* Hero — same palette as the homepage Premium strip */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-[#2f3d7a] via-[#4556a0] to-[#6a5740]"
          />
          <div
            aria-hidden
            className="absolute -left-24 -top-10 h-80 w-80 rounded-full bg-[#9eb4ff]/30 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -right-10 h-96 w-96 rounded-full bg-[#c4a574]/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 home-premium-glass-shine opacity-40"
          />

          <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-8 lg:py-20">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#e8d5b5]">
                <Crown className="h-3.5 w-3.5" />
                Premium mentors
              </p>
              <h1 className="mt-3 text-[2.25rem] font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                Tutors we&apos;ve checked,
                <br />
                <span className="text-[#e8d5b5]">one by one.</span>
              </h1>
             

              <form
                onSubmit={onSearchSubmit}
                className="mt-7 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_rgba(10,14,40,0.3)]"
              >
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Search Premium tutors</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Maths, Physics, Pimple Saudagar…"
                    className="h-11 w-full appearance-none rounded-xl bg-transparent pl-9 pr-8 text-[15px] text-ink outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                  />
                  {query ? (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                      className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-[#f6f5f2] hover:text-ink"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </label>
                <button
                  type="submit"
                  aria-label="Find a tutor"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#5b7cfa] to-[#c4a574] text-white transition hover:brightness-105"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              {mentors.length > 0 ? (
                <div className="mt-6 flex items-center gap-3">
                  <AvatarStack mentors={heroMentors} />
                  <p className="text-[13px] text-white/75">
                  
                    {subjectCount > 0 ? ` across ${subjectCount} subjects` : ""}
                    <span className="mx-2 text-white/35">·</span>
                    <span className="font-semibold text-[#e8d5b5]">
                      ₹0 to connect
                    </span>
                  </p>
                </div>
              ) : null}
            </div>

            <div className="hidden lg:block">
              <HeroPhotoFan mentors={heroMentors} />
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="sticky top-0 z-40 border-b border-hairline bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Subjects"
              className="-mx-4 flex min-w-0 gap-6 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
            >
              {SUBJECT_TABS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={cn(
                    "shrink-0 border-b-2 py-3.5 text-sm font-semibold transition lg:py-4",
                    subject === s
                      ? "border-[#5b7cfa] text-ink"
                      : "border-transparent text-muted hover:text-ink",
                  )}
                >
                  {s}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Results */}
        <section
          id="premium-grid"
          className="mx-auto max-w-[1200px] scroll-mt-28 px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8"
        >
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <p className="text-sm text-muted">
              {loading ? (
                "Loading tutors…"
              ) : (
                <>
                  <span className="font-bold text-ink">{count}</span> Premium
                  tutor{count === 1 ? "" : "s"}
                  {subject !== "All" ? ` for ${subject}` : ""}
                  {query ? ` matching “${query.trim()}”` : ""}
                </>
              )}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-semibold text-[#5b7cfa] hover:underline"
              >
                Reset
              </button>
            ) : null}
          </div>

          {loading && mentors.length === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : count === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-[#c4a574]/25">
              <p className="text-lg font-bold text-ink">
                No Premium tutors match that yet.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Try another subject, or look through all tutors on Mentr —
                there are plenty more.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={clearAll}
                  className="h-10 rounded-xl border border-hairline bg-white px-4 text-sm font-semibold text-ink hover:bg-[#f6f5f2]"
                >
                  Reset filters
                </button>
                <Link
                  href="/search"
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#5b7cfa] to-[#c4a574] px-4 text-sm font-bold text-white"
                >
                  See all tutors
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {filtered.map((t) => (
                <MentorCard key={t.id} teacher={t} />
              ))}
            </div>
          )}

          {isGuest ? (
            <p className="mt-8 text-center text-sm text-muted">
              Want to keep track of who replied?{" "}
              <Link
                href={SIGNUP_HREF}
                className="font-semibold text-[#3d4f9c] hover:underline"
              >
                Make a free parent account
              </Link>{" "}
              or{" "}
              <button
                type="button"
                onClick={() => openRoleChooser("/premiummentors")}
                className="font-semibold text-[#3d4f9c] hover:underline"
              >
                log in
              </button>
              .
            </p>
          ) : null}

          {/* Fallback CTA */}
          <div className="relative mt-12 overflow-hidden rounded-3xl sm:mt-16">
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-[#2f3d7a] via-[#4556a0] to-[#6a5740]"
            />
            <div
              aria-hidden
              className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-[#c4a574]/30 blur-3xl"
            />
            <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-lg">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[1.75rem]">
                  Didn&apos;t find the right fit?
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-white/75">
                  Post what your child needs — subject, class, area — and
                  tutors will come to you with their profiles.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <PostRequirementButton
                  label="Post your need"
                  variant="secondary"
                  className="h-11 rounded-xl border-0 bg-white px-5 text-sm font-bold text-ink hover:bg-white/90"
                />
                <Link
                  href="/search"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Browse all tutors
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16 border-t border-hairline bg-white sm:mt-20">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:px-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#a8895a]">
                FAQ
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Questions parents ask
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                Anything else?{" "}
                <Link
                  href="/faq"
                  className="font-semibold text-[#3d4f9c] hover:underline"
                >
                  Read the full FAQ
                </Link>
                .
              </p>
            </div>
            <div className="divide-y divide-hairline border-y border-hairline">
              {FAQS.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef1ff] text-[#5b7cfa] transition group-open:rotate-45 group-open:bg-[#2f3d7a] group-open:text-white">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="-mt-1 pb-5 pr-10 text-[15px] leading-relaxed text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
