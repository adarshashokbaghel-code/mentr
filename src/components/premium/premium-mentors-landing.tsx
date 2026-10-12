"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { BookDemoButton } from "@/components/demo/book-demo-button";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PostRequirementButton } from "@/components/requirements/post-requirement-cta";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import { PremiumMentorBadge } from "@/components/ui/mentor-status-badges";
import {
  fetchPremiumTeachers,
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
  GraduationCap,
  Home,
  Languages,
  MapPin,
  Plus,
  Search,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

const SIGNUP_HREF =
  "/parent/signup?next=" + encodeURIComponent("/premiummentors");

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

const TRUST_POINTS = [
  "ID-verified tutors",
  "Free demo class",
  "No commission",
] as const;

const HOW_IT_WORKS = [
  "Compare verified tutors by subject, fee and experience — no sign-up to browse.",
  "Create a free parent account and book a demo class.",
  "Connect on WhatsApp once the tutor accepts, and pay them directly.",
];

type ModeFilter = "any" | "online" | "home";
type PriceFilter = "any" | "under500" | "500to1000" | "over1000";
type SortKey = "recommended" | "priceLow" | "priceHigh" | "experience";

const MODE_OPTIONS: { value: ModeFilter; label: string }[] = [
  { value: "any", label: "Online & home" },
  { value: "online", label: "Online" },
  { value: "home", label: "Home tuition" },
];

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "any", label: "Any fee" },
  { value: "under500", label: "Under ₹500/hr" },
  { value: "500to1000", label: "₹500 – ₹1000/hr" },
  { value: "over1000", label: "₹1000+/hr" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "priceLow", label: "Fee: low to high" },
  { value: "priceHigh", label: "Fee: high to low" },
  { value: "experience", label: "Most experienced" },
];

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

function validRate(rate: number | null | undefined): number | null {
  return rate != null && Number.isFinite(rate) && rate > 0 ? rate : null;
}

function matchesPrice(rate: number | null | undefined, price: PriceFilter) {
  if (price === "any") return true;
  const r = validRate(rate);
  if (r == null) return false;
  if (price === "under500") return r < 500;
  if (price === "500to1000") return r >= 500 && r <= 1000;
  return r > 1000;
}

function matchesMode(teacher: Teacher, mode: ModeFilter) {
  if (mode === "any") return true;
  const modes = teacher.modes || [];
  if (mode === "online") return modes.includes("online");
  return modes.includes("student_home") || modes.includes("tutor_home");
}

/* ── Filter controls ────────────────────────────────────────────── */

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  defaultValue,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  defaultValue: T;
}) {
  const active = value !== defaultValue;
  return (
    <label
      className={cn(
        "relative inline-flex h-9 shrink-0 items-center rounded-md border text-[13px] font-medium transition",
        active
          ? "border-ink bg-ink text-white"
          : "border-hairline bg-white text-ink hover:border-ink/40",
      )}
    >
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-full cursor-pointer appearance-none bg-transparent pl-3 pr-8 outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-ink">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-2.5 h-4 w-4",
          active ? "text-white/70" : "text-muted",
        )}
      />
    </label>
  );
}

/* ── Card ───────────────────────────────────────────────────────── */

function MetaItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span className="shrink-0 text-muted">{icon}</span>
      <span className="truncate">{children}</span>
    </span>
  );
}

function CardMeta({ teacher }: { teacher: Teacher }) {
  const place = titleCase(teacher.locality || teacher.area || "");
  const modes = modeLabels(teacher);
  const languages = (teacher.languages || []).slice(0, 3);
  return (
    <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[13px] text-ink/75 sm:grid-cols-2">
      {teacher.qualification ? (
        <MetaItem icon={<GraduationCap className="h-4 w-4" />}>
          {teacher.qualification}
        </MetaItem>
      ) : null}
      {place ? (
        <MetaItem icon={<MapPin className="h-4 w-4" />}>{place}</MetaItem>
      ) : null}
      <MetaItem
        icon={
          modes.includes("Online") ? (
            <Globe2 className="h-4 w-4" />
          ) : (
            <Home className="h-4 w-4" />
          )
        }
      >
        {modes.map((m) => (m === "Home" ? "Home tuition" : m)).join(" · ")}
      </MetaItem>
      {languages.length > 0 ? (
        <MetaItem icon={<Languages className="h-4 w-4" />}>
          {languages.join(", ")}
        </MetaItem>
      ) : null}
    </div>
  );
}

function MentorCard({ teacher }: { teacher: Teacher }) {
  const name = displayName(teacher.name);
  const subject = primarySubject(teacher);
  const otherSubjects = teacher.subjects.slice(1, 3);
  const rate = validRate(teacher.hourlyRate);
  const profileHref = `/teachers/${teacher.id}`;
  const bio = teacher.bio.replace(/\s+/g, " ").trim();
  const hasRating = teacher.reviewCount > 0 && teacher.rating > 0;

  const price = rate ? (
    <>
      <span className="text-xl font-bold tabular-nums text-ink lg:text-2xl">
        ₹{Math.round(rate)}
      </span>
      <span className="text-xs text-muted"> / hour</span>
    </>
  ) : (
    <span className="text-sm font-medium text-muted">Fee on request</span>
  );

  return (
    <article className="border border-hairline bg-white p-4 transition-colors hover:border-ink/25 sm:rounded-lg sm:p-5 -mx-4 border-x-0 sm:mx-0 sm:border-x">
      <div className="flex gap-4 sm:gap-5">
        <Link
          href={profileHref}
          aria-label={`View ${name}'s profile`}
          className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[#eef1ff] sm:h-28 sm:w-28 lg:h-32 lg:w-32"
        >
          <MentorPhoto
            name={name}
            imageUrl={teacher.imageUrl}
            size="fill"
            rounded="xl"
            className="!absolute !inset-0 !h-full !w-full !rounded-none object-cover object-top"
            showInitials
            alt={`${name}, ${subject} tutor`}
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="text-base font-semibold text-ink sm:text-lg">
                  <Link href={profileHref} className="hover:underline">
                    {name}
                  </Link>
                </h3>
                <BadgeCheck
                  aria-label="Verified"
                  className="h-4 w-4 shrink-0 text-[#3d4f9c]"
                />
                <PremiumMentorBadge size="sm" />
              </div>
              <p className="mt-0.5 truncate text-[13px] text-ink/80 sm:text-sm">
                <span className="font-medium">{subject} tutor</span>
                {otherSubjects.length > 0 ? (
                  <span className="text-muted">
                    {" "}
                    · also {otherSubjects.join(", ")}
                  </span>
                ) : null}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[13px] text-muted">
                {hasRating ? (
                  <span className="inline-flex items-center gap-1 font-medium text-ink">
                    <Star className="h-3.5 w-3.5 fill-[#f5b301] text-[#f5b301]" />
                    {teacher.rating.toFixed(1)}
                    <span className="font-normal text-muted">
                      ({teacher.reviewCount})
                    </span>
                  </span>
                ) : null}
                {teacher.experienceYears > 0 ? (
                  <span>{teacher.experienceYears}+ yrs experience</span>
                ) : null}
              </div>
            </div>

            <p className="hidden shrink-0 text-right lg:block">{price}</p>
          </div>

          <div className="hidden sm:block">
            <CardMeta teacher={teacher} />
            {bio ? (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                {bio}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="sm:hidden">
        <CardMeta teacher={teacher} />
        {bio ? (
          <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {bio}
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-hairline pt-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
        <p className="lg:hidden">{price}</p>
        <div className="grid grid-cols-[1fr_auto] gap-2 sm:flex">
          <BookDemoButton
            teacher={{
              id: teacher.id,
              name: teacher.name,
              subjects: teacher.subjects,
            }}
            label="Book free demo"
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/85 sm:w-auto"
          />
          <Link
            href={profileHref}
            className="inline-flex h-10 items-center justify-center rounded-md border border-hairline px-4 text-sm font-semibold text-ink transition hover:border-ink/40"
          >
            View profile
          </Link>
        </div>
      </div>
    </article>
  );
}

function CardSkeleton() {
  return (
    <div className="-mx-4 border border-x-0 border-hairline bg-white p-4 sm:mx-0 sm:rounded-lg sm:border-x sm:p-5">
      <div className="flex gap-4 sm:gap-5">
        <div className="h-20 w-20 shrink-0 animate-pulse rounded-md bg-[#eef1ff] sm:h-28 sm:w-28" />
        <div className="flex-1 space-y-2.5 pt-1">
          <div className="h-5 w-1/2 animate-pulse rounded bg-[#f1efe9]" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-[#f1efe9]" />
          <div className="h-4 w-full animate-pulse rounded bg-[#f1efe9]" />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2 border-t border-hairline pt-4">
        <div className="h-10 w-36 animate-pulse rounded-md bg-[#eef1ff]" />
        <div className="h-10 w-28 animate-pulse rounded-md bg-[#f1efe9]" />
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
  const [mode, setMode] = useState<ModeFilter>("any");
  const [price, setPrice] = useState<PriceFilter>("any");
  const [sort, setSort] = useState<SortKey>("recommended");

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

  const recommended = useMemo(
    () =>
      [...mentors].sort(
        (a, b) => Number(!!b.imageUrl) - Number(!!a.imageUrl),
      ),
    [mentors],
  );

  const subjectTabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of mentors) {
      for (const s of SUBJECTS) {
        if (t.subjects.some((ts) => ts.includes(s))) {
          counts.set(s, (counts.get(s) ?? 0) + 1);
        }
      }
    }
    return [
      "All",
      ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s),
    ];
  }, [mentors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = recommended.filter((t) => {
      if (subject !== "All" && !t.subjects.some((s) => s.includes(subject))) {
        return false;
      }
      if (!matchesMode(t, mode)) return false;
      if (!matchesPrice(t.hourlyRate, price)) return false;
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

    if (sort === "priceLow") {
      list.sort(
        (a, b) =>
          (validRate(a.hourlyRate) ?? Infinity) -
          (validRate(b.hourlyRate) ?? Infinity),
      );
    } else if (sort === "priceHigh") {
      list.sort(
        (a, b) =>
          (validRate(b.hourlyRate) ?? -1) - (validRate(a.hourlyRate) ?? -1),
      );
    } else if (sort === "experience") {
      list.sort((a, b) => b.experienceYears - a.experienceYears);
    }
    return list;
  }, [recommended, query, subject, mode, price, sort]);

  const hasFilters =
    !!query || subject !== "All" || mode !== "any" || price !== "any";

  const clearAll = () => {
    setQuery("");
    setSubject("All");
    setMode("any");
    setPrice("any");
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
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#2f3d7a] via-[#3a4a8f] to-[#5a4c3a]">
          <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e8d5b5]">
              Premium tutors · Mentr
            </p>
            <h1 className="mt-3 max-w-3xl text-[1.875rem] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Verified home &amp; online tutors, checked one by one
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75 sm:text-base">
              Hire ID-verified tutors for Maths, Science, English and more.
              Compare fees and experience, then book a free demo class — no
              sign-up, no commission.
            </p>

            <form
              onSubmit={onSearchSubmit}
              role="search"
              className="mt-6 flex max-w-xl items-stretch overflow-hidden rounded-md bg-white"
            >
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search Premium tutors</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Subject, tutor name or area"
                  className="h-12 w-full appearance-none bg-transparent pl-9 pr-9 text-[15px] text-ink outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:appearance-none"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-muted hover:text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </label>
              <button
                type="submit"
                aria-label="Search tutors"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink/85 sm:px-6"
              >
                <span className="hidden sm:inline">Search</span>
                <ArrowRight className="h-4 w-4 sm:hidden" />
              </button>
            </form>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-white/80">
              {TRUST_POINTS.map((label) => (
                <li key={label} className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-[#e8d5b5]" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Filters */}
        <div className="sticky top-12 z-40 border-b border-hairline bg-white sm:top-14 lg:top-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Filter by subject"
              className="-mx-4 flex min-w-0 gap-5 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
            >
              {subjectTabs.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSubject(name)}
                  aria-pressed={subject === name}
                  className={cn(
                    "shrink-0 border-b-2 py-3 text-sm font-medium transition",
                    subject === name
                      ? "border-ink text-ink"
                      : "border-transparent text-muted hover:text-ink",
                  )}
                >
                  {name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Results */}
        <section
          id="premium-grid"
          aria-labelledby="premium-results-heading"
          className="mx-auto max-w-[1200px] scroll-mt-32 px-4 pt-6 sm:px-6 lg:px-8"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2
                  id="premium-results-heading"
                  className="text-base font-semibold text-ink"
                >
                  {loading && mentors.length === 0 ? (
                    "Loading tutors…"
                  ) : (
                    <>
                      {count} verified{" "}
                      {subject !== "All" ? `${subject} ` : ""}tutor
                      {count === 1 ? "" : "s"}
                      {query ? (
                        <span className="font-normal text-muted">
                          {" "}
                          for “{query.trim()}”
                        </span>
                      ) : null}
                    </>
                  )}
                </h2>
                <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
                  <FilterSelect
                    label="Teaching mode"
                    value={mode}
                    options={MODE_OPTIONS}
                    onChange={setMode}
                    defaultValue="any"
                  />
                  <FilterSelect
                    label="Fee per hour"
                    value={price}
                    options={PRICE_OPTIONS}
                    onChange={setPrice}
                    defaultValue="any"
                  />
                  <FilterSelect
                    label="Sort by"
                    value={sort}
                    options={SORT_OPTIONS}
                    onChange={setSort}
                    defaultValue="recommended"
                  />
                  {hasFilters ? (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="h-9 shrink-0 px-2 text-[13px] font-medium text-[#3d4f9c] hover:underline"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>

              {loading && mentors.length === 0 ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : count === 0 ? (
                <div className="rounded-lg border border-hairline bg-white px-6 py-12 text-center">
                  <p className="font-semibold text-ink">
                    No Premium tutors match these filters.
                  </p>
                  <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
                    Try another subject or fee range, or browse every tutor on
                    Mentr.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={clearAll}
                      className="h-10 rounded-md border border-hairline px-4 text-sm font-semibold text-ink hover:border-ink/40"
                    >
                      Clear filters
                    </button>
                    <Link
                      href="/search"
                      className="inline-flex h-10 items-center gap-1.5 rounded-md bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/85"
                    >
                      See all tutors
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((t) => (
                    <MentorCard key={t.id} teacher={t} />
                  ))}
                </div>
              )}

              {isGuest ? (
                <p className="mt-6 text-sm text-muted">
                  Want to track replies in one place?{" "}
                  <Link
                    href={SIGNUP_HREF}
                    className="font-semibold text-[#3d4f9c] hover:underline"
                  >
                    Create a free parent account
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
            </div>

            <aside className="lg:sticky lg:top-36 lg:self-start">
              <div className="rounded-lg border border-hairline bg-white p-5">
                <h2 className="text-sm font-semibold text-ink">
                  How it works
                </h2>
                <ol className="mt-3 space-y-2.5">
                  {HOW_IT_WORKS.map((step, i) => (
                    <li
                      key={step}
                      className="flex gap-2.5 text-[13px] leading-relaxed text-muted"
                    >
                      <span className="font-semibold tabular-nums text-ink">
                        {i + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="mt-5 border-t border-hairline pt-5">
                  <p className="text-sm font-semibold text-ink">
                    Can&apos;t find the right tutor?
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    Post your child&apos;s subject, class and area — tutors
                    will reach out to you.
                  </p>
                  <PostRequirementButton
                    label="Post a tuition requirement"
                    variant="secondary"
                    className="mt-3 h-10 w-full rounded-md border-0 bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/85"
                  />
                  <Link
                    href="/search"
                    className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#3d4f9c] hover:underline"
                  >
                    Browse all tutors
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16 border-t border-hairline bg-white">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Premium tutors: FAQs
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                More questions?{" "}
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
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    <h3>{item.q}</h3>
                    <Plus className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-45" />
                  </summary>
                  <p className="pb-4 pr-8 text-sm leading-relaxed text-muted">
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
