"use client";

import {
  ApiError,
  premiumMentorApi,
  requirementsApi,
  type BoardRequirement,
  type PremiumRevealQuota,
  type PremiumRevealRow,
} from "@/lib/api";
import { timeAgo } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCountdown, msUntilLocalMidnight } from "@/lib/utils";
import {
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  DoorOpen,
  Download,
  Flame,
  GraduationCap,
  Hourglass,
  House,
  Inbox,
  Laptop,
  Loader2,
  Lock,
  MapPin,
  Megaphone,
  Repeat,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function MidnightCountdown() {
  const [remaining, setRemaining] = useState(msUntilLocalMidnight);

  useEffect(() => {
    const tick = () => setRemaining(msUntilLocalMidnight());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-coral">
      <Clock3 className="h-3.5 w-3.5" />
      Resumes in {formatCountdown(remaining)}
    </span>
  );
}

const PITCH_MIN = 10;
const PITCH_MAX = 500;

const MODE_LABELS: Record<string, string> = {
  online: "Online",
  student_home: "At student's home",
  tutor_home: "At your place",
};

const TIMELINE_LABELS: Record<string, string> = {
  immediately: "Immediately",
  within_week: "Within a week",
  within_month: "Within a month",
  flexible: "Flexible",
};

const MODE_ICONS: Record<string, LucideIcon> = {
  online: Laptop,
  student_home: House,
  tutor_home: DoorOpen,
};

const MODE_FILTERS = [
  { id: "online", label: "Online" },
  { id: "student_home", label: "Student's home" },
  { id: "tutor_home", label: "Your place" },
] as const;

const SUBJECT_TONES = [
  { tile: "bg-coral-wash text-coral-dark", dot: "bg-coral" },
  { tile: "bg-sage-wash text-sage", dot: "bg-sage" },
  { tile: "bg-lavender text-ink", dot: "bg-lavender-deep" },
  { tile: "bg-butter text-ink", dot: "bg-butter-deep" },
  { tile: "bg-sky text-ink", dot: "bg-sky" },
];

function subjectTone(subject: string): (typeof SUBJECT_TONES)[number] {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = (hash * 31 + subject.charCodeAt(i)) | 0;
  }
  return SUBJECT_TONES[Math.abs(hash) % SUBJECT_TONES.length];
}

function budgetLabel(p: BoardRequirement): string | null {
  if (p.budgetMin == null && p.budgetMax == null) return null;
  const parts = [
    p.budgetMin != null ? `₹${p.budgetMin}` : null,
    p.budgetMax != null ? `₹${p.budgetMax}` : null,
  ].filter(Boolean);
  return `${parts.join("–")}/hr`;
}

function daysLeft(expiresAt: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000),
  );
}

function isNewPost(postedAt: string): boolean {
  return Date.now() - new Date(postedAt).getTime() < 24 * 3600_000;
}

type SortMode = "new" | "top" | "closing" | "budget";

const SORTS: { id: SortMode; label: string; icon: typeof Sparkles }[] = [
  { id: "new", label: "New", icon: Sparkles },
  { id: "top", label: "Top", icon: Flame },
  { id: "closing", label: "Closing", icon: Hourglass },
  { id: "budget", label: "Top budget", icon: TrendingUp },
];

function StatusToggle({
  statusFilter,
  closedCount,
  onChange,
}: {
  statusFilter: "open" | "closed";
  closedCount: number;
  onChange: (next: "open" | "closed") => void;
}) {
  if (closedCount === 0) return null;

  return (
    <div
      role="tablist"
      aria-label="Post status"
      className="inline-flex h-9 shrink-0 items-center rounded-full border border-hairline bg-cream/60 p-1"
    >
      {(["open", "closed"] as const).map((id) => {
        const active = statusFilter === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition touch-manipulation",
              active ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink",
            )}
          >
            {id === "open" ? "Open" : "Closed"}
            {id === "closed" && (
              <span className="rounded-full bg-cream-band px-1.5 text-[10px] tabular-nums text-muted">
                {closedCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Tutor-facing requirements board: filter toolbar, post cards, quota sidebar. */
export function RequirementsFeed() {
  const [posts, setPosts] = useState<BoardRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyLimit, setDailyLimit] = useState<number | null>(3);
  const [usedToday, setUsedToday] = useState(0);
  const [unlimitedPitches, setUnlimitedPitches] = useState(false);
  const [premiumMentor, setPremiumMentor] = useState(false);
  const [revealLeft, setRevealLeft] = useState<number | null>(null);
  const [revealLimit, setRevealLimit] = useState(5);
  const [pitchFor, setPitchFor] = useState<BoardRequirement | null>(null);
  const [revealFor, setRevealFor] = useState<BoardRequirement | null>(null);

  const [sort, setSort] = useState<SortMode>("new");
  const [subject, setSubject] = useState("All");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [hidePitched, setHidePitched] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"open" | "closed">("open");

  const onRevealQuota = useCallback((quota: PremiumRevealQuota) => {
    setRevealLeft(quota.remaining);
    if (quota.dailyLimit > 0) setRevealLimit(quota.dailyLimit);
  }, []);

  const reload = useCallback(() => {
    requirementsApi
      .board()
      .then((data) => {
        setPosts(data.requirements);
        setDailyLimit(data.dailyLimit);
        setUsedToday(data.usedToday);
        setUnlimitedPitches(Boolean(data.unlimitedPitches || data.dailyLimit == null));
        setPremiumMentor(Boolean(data.premiumMentor));
        setRevealLeft(
          data.revealQuota ? data.revealQuota.remaining : null,
        );
        if (data.revealQuota?.dailyLimit) {
          setRevealLimit(data.revealQuota.dailyLimit);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  const pool = useMemo(
    () => posts.filter((p) => p.status === statusFilter),
    [posts, statusFilter],
  );
  const openCount = useMemo(
    () => posts.filter((p) => p.status === "open").length,
    [posts],
  );
  const closedCount = posts.length - openCount;

  const subjectCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of pool) counts.set(p.subject, (counts.get(p.subject) ?? 0) + 1);
    return [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [pool]);

  const myPitchCount = useMemo(
    () => posts.filter((p) => p.myInterestStatus !== null).length,
    [posts],
  );

  const visible = useMemo(() => {
    let list = pool;
    if (subject !== "All") list = list.filter((p) => p.subject === subject);
    if (modeFilter !== "all") {
      list = list.filter((p) => (p.modes as string[]).includes(modeFilter));
    }
    if (hidePitched) list = list.filter((p) => p.myInterestStatus === null);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.subject.toLowerCase().includes(q) ||
          p.classLevel.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.details.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "top") {
      sorted.sort((a, b) => b.interestCount - a.interestCount);
    } else if (sort === "closing") {
      sorted.sort(
        (a, b) =>
          new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime(),
      );
    } else if (sort === "budget") {
      const budget = (p: BoardRequirement) => p.budgetMax ?? p.budgetMin ?? -1;
      sorted.sort((a, b) => budget(b) - budget(a));
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      );
    }
    return sorted;
  }, [pool, subject, modeFilter, hidePitched, query, sort]);

  const left = unlimitedPitches
    ? Number.POSITIVE_INFINITY
    : Math.max(0, (dailyLimit ?? 3) - usedToday);
  const atLimit = !unlimitedPitches && left <= 0;
  const newToday = posts.filter(
    (p) => p.status === "open" && isNewPost(p.postedAt),
  ).length;
  const totalResponses = posts.reduce((sum, p) => sum + p.interestCount, 0);
  const filtersActive =
    subject !== "All" || modeFilter !== "all" || hidePitched || query.trim();

  function clearFilters() {
    setSubject("All");
    setModeFilter("all");
    setHidePitched(false);
    setQuery("");
  }

  const quota = (
    <QuotaCard
      left={left}
      limit={dailyLimit ?? 3}
      usedToday={usedToday}
      unlimited={unlimitedPitches}
      atLimit={atLimit}
      revealLeft={premiumMentor ? revealLeft : null}
      revealLimit={revealLimit}
    />
  );

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-7">
        <div className="min-w-0">
          {/* small screens: quota + pulse above the feed */}
          <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:hidden">
            {quota}
            <PulseCard
              className="hidden sm:block"
              open={openCount}
              fresh={newToday}
              mine={myPitchCount}
              responses={totalResponses}
            />
          </div>

          {/* toolbar */}
          <div className="rounded-2xl border border-hairline bg-white p-3 shadow-[0_1px_2px_rgba(28,26,23,0.04)] sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subject, class, area…"
                  className="h-11 rounded-xl border-hairline bg-cream/50 pl-10 pr-10 text-base shadow-none touch-manipulation focus-visible:border-ink/30 focus-visible:ring-coral/20 sm:text-sm"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted touch-manipulation hover:bg-cream"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div
                role="tablist"
                aria-label="Sort posts"
                className="-mx-1 flex shrink-0 gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {SORTS.map((s) => {
                  const active = sort === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSort(s.id)}
                      className={cn(
                        "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3.5 text-sm font-bold transition touch-manipulation",
                        active
                          ? "bg-ink text-white"
                          : "text-ink/70 hover:bg-cream hover:text-ink",
                      )}
                    >
                      <s.icon className={cn("h-4 w-4", active ? "text-coral" : "text-muted")} />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 border-t border-hairline pt-3">
              <p className="mb-2 text-[11px] font-bold tracking-wide text-muted uppercase">
                Subject
              </p>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
                <FilterChip
                  active={subject === "All"}
                  onClick={() => setSubject("All")}
                  label="All"
                  count={pool.length}
                />
                {subjectCounts.map(([s, count]) => (
                  <FilterChip
                    key={s}
                    active={subject === s}
                    onClick={() => setSubject(subject === s ? "All" : s)}
                    label={s}
                    count={count}
                    dot={subjectTone(s).dot}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-3 border-t border-hairline pt-3 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                <p className="mb-2 text-[11px] font-bold tracking-wide text-muted uppercase">
                  Teaching mode
                </p>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
                  <FilterChip
                    active={modeFilter === "all"}
                    onClick={() => setModeFilter("all")}
                    label="Any"
                  />
                  {MODE_FILTERS.map((m) => (
                    <FilterChip
                      key={m.id}
                      active={modeFilter === m.id}
                      onClick={() =>
                        setModeFilter(modeFilter === m.id ? "all" : m.id)
                      }
                      label={m.label}
                      icon={MODE_ICONS[m.id]}
                    />
                  ))}
                </div>
              </div>
              <label className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 self-start rounded-xl border border-hairline px-3 py-2 md:self-auto">
                <Checkbox
                  checked={hidePitched}
                  onCheckedChange={(v) => setHidePitched(v === true)}
                  className="border-ink/25 data-[state=checked]:border-coral data-[state=checked]:bg-coral"
                />
                <span className="text-[13px] font-semibold text-ink">
                  Hide posts I pitched
                </span>
              </label>
            </div>
          </div>

          {/* result meta */}
          <div className="mt-4 mb-3 flex items-center justify-between gap-3 px-1">
            <p className="text-sm font-semibold text-ink">
              {loading ? (
                "Loading posts…"
              ) : (
                <>
                  {visible.length} {statusFilter}{" "}
                  {visible.length === 1 ? "post" : "posts"}
                  {filtersActive ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-2 text-xs font-bold text-coral hover:text-coral-dark"
                    >
                      Clear filters
                    </button>
                  ) : null}
                </>
              )}
            </p>
            <StatusToggle
              statusFilter={statusFilter}
              closedCount={closedCount}
              onChange={(next) => {
                setStatusFilter(next);
                setSubject("All");
              }}
            />
          </div>

          {loading ? (
            <ul className="space-y-3">
              {[0, 1, 2].map((i) => (
                <li key={i} className="rounded-2xl border border-hairline bg-white p-5">
                  <div className="flex gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl bg-cream-band" />
                    <div className="flex-1 space-y-2 py-1">
                      <Skeleton className="h-4 w-1/2 bg-cream-band" />
                      <Skeleton className="h-3 w-1/3 bg-cream-band" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[0, 1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-14 rounded-xl bg-cream-band" />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-hairline bg-white px-4 py-12 text-center sm:py-16">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-wash">
                <Megaphone className="h-5 w-5 text-coral" />
              </span>
              <p className="mt-4 text-base font-bold text-ink">
                {filtersActive
                  ? "No posts match your filters"
                  : statusFilter === "closed"
                    ? "No closed posts yet"
                    : "No open posts right now"}
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
                {filtersActive
                  ? "Try another subject or clear the filters."
                  : "New parent requirements show up here — check back soon."}
              </p>
              {filtersActive ? (
                <Button size="sm" variant="secondary" className="mt-5" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : null}
            </div>
          ) : (
            <ul className="space-y-3">
              {visible.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  quotaLeft={left}
                  premium={premiumMentor}
                  onRespond={() => setPitchFor(p)}
                  onReveal={() => setRevealFor(p)}
                />
              ))}
            </ul>
          )}
        </div>

        <aside className="hidden space-y-4 xl:sticky xl:top-[5rem] xl:block xl:self-start">
          {quota}
          <PulseCard
            open={openCount}
            fresh={newToday}
            mine={myPitchCount}
            responses={totalResponses}
          />
          <HowItWorksCard />
        </aside>
      </div>

      <RevealParentDialog
        post={revealFor}
        onClose={() => setRevealFor(null)}
        onQuota={onRevealQuota}
      />
      <PitchDialog
        post={pitchFor}
        onClose={() => setPitchFor(null)}
        onSent={() => {
          setPitchFor(null);
          reload();
        }}
      />
    </>
  );
}

function QuotaCard({
  left,
  limit,
  usedToday,
  unlimited,
  atLimit,
  revealLeft,
  revealLimit,
}: {
  left: number;
  limit: number;
  usedToday: number;
  unlimited: boolean;
  atLimit: boolean;
  revealLeft: number | null;
  revealLimit: number;
}) {
  return (
    <section className="rounded-2xl border border-hairline bg-white p-4 shadow-[0_1px_2px_rgba(28,26,23,0.04)] sm:p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral-wash">
          <Send className="h-4 w-4 text-coral" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink">Today&apos;s pitches</p>
          <p className="text-[11.5px] text-muted">
            {unlimited ? "Premium · no daily cap" : "Resets at midnight"}
          </p>
        </div>
        <p className="ml-auto text-right text-2xl font-extrabold tabular-nums text-ink">
          {unlimited ? "∞" : left}
          {!unlimited && (
            <span className="text-sm font-semibold text-muted">/{limit}</span>
          )}
        </p>
      </div>

      {!unlimited && (
        <div className="mt-3.5 flex gap-1.5" aria-hidden>
          {Array.from({ length: limit }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 flex-1 rounded-full",
                i < left ? "bg-sage" : "bg-cream-band",
              )}
            />
          ))}
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">
        {atLimit ? (
          <MidnightCountdown />
        ) : unlimited ? (
          usedToday > 0 ? `${usedToday} sent today.` : "Pitch as many posts as you like."
        ) : (
          <>
            <span className="font-semibold text-ink">
              {left} pitch{left === 1 ? "" : "es"} left
            </span>{" "}
            · {usedToday} used today
          </>
        )}
      </p>

      {revealLeft != null && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-cream px-3 py-2 text-xs leading-relaxed text-ink/80">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral" />
          <span>
            <span className="font-semibold text-ink">
              {revealLeft} of {revealLimit} parent reveals left.
            </span>{" "}
            Shared with the parent directory.
          </span>
        </p>
      )}
    </section>
  );
}

function PulseCard({
  open,
  fresh,
  mine,
  responses,
  className,
}: {
  className?: string;
  open: number;
  fresh: number;
  mine: number;
  responses: number;
}) {
  const stats = [
    { label: "Open posts", value: open, icon: Inbox, tone: "bg-sky/50 text-ink" },
    { label: "New today", value: fresh, icon: Sparkles, tone: "bg-coral-wash text-coral" },
    { label: "You pitched", value: mine, icon: Send, tone: "bg-sage-wash text-sage" },
    { label: "All pitches", value: responses, icon: Users, tone: "bg-butter/70 text-ink" },
  ];
  return (
    <section
      className={cn(
        "rounded-2xl border border-hairline bg-white p-4 shadow-[0_1px_2px_rgba(28,26,23,0.04)] sm:p-5",
        className,
      )}
    >
      <p className="text-sm font-bold text-ink">Board at a glance</p>
      <dl className="mt-3 grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-hairline px-3 py-2.5">
            <dt className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-md", s.tone)}>
                <s.icon className="h-3 w-3" />
              </span>
              {s.label}
            </dt>
            <dd className="mt-1 text-lg font-extrabold tabular-nums text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function HowItWorksCard() {
  const steps = [
    { title: "Pitch a post", body: "A short note on why you fit." },
    { title: "Parent compares", body: "They see your pitch and profile." },
    { title: "Free demo booked", body: "You get their number and confirm a time." },
  ];
  return (
    <section className="rounded-2xl border border-hairline bg-cream/60 p-5">
      <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
        <ShieldCheck className="h-4 w-4 text-sage" />
        How it works
      </p>
      <ol className="mt-3 space-y-3">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-ink ring-1 ring-hairline">
              {i + 1}
            </span>
            <div>
              <p className="text-[13px] font-semibold text-ink">{s.title}</p>
              <p className="text-xs text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-hairline pt-3 text-[11.5px] text-muted">
        No coins, no commission.
      </p>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  dot,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  dot?: string;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition touch-manipulation",
        active
          ? "border-ink bg-ink text-white"
          : "border-hairline bg-white text-ink hover:border-ink/30",
      )}
    >
      {dot ? <span className={cn("h-2 w-2 rounded-full", dot)} /> : null}
      {Icon ? <Icon className={cn("h-3.5 w-3.5", active ? "text-white" : "text-muted")} /> : null}
      {label}
      {count != null && (
        <span
          className={cn(
            "rounded-full px-1.5 text-[11px] font-bold tabular-nums",
            active ? "bg-white/20 text-white" : "bg-cream-band text-muted",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function displayLocation(area: string, city: string): string {
  const trimmed = area.trim();
  if (
    trimmed &&
    trimmed.length <= 40 &&
    !/your name and number|tutors pitch|decide who/i.test(trimmed)
  ) {
    return trimmed;
  }
  return city.trim() || "Bengaluru";
}

const MY_STATUS: Record<
  NonNullable<BoardRequirement["myInterestStatus"]>,
  { label: string; cls: string; icon: LucideIcon }
> = {
  pending: { label: "Pitched · waiting for parent", cls: "bg-butter/60 text-ink", icon: Clock3 },
  accepted: { label: "Connected with parent", cls: "bg-sage-wash text-sage", icon: Check },
  declined: { label: "Not picked this time", cls: "bg-cream-band text-muted", icon: X },
};

function Fact({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "default" | "good" | "hot";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 sm:gap-2.5 sm:px-3 sm:py-2.5",
        tone === "good"
          ? "border-sage/25 bg-sage-wash/60"
          : tone === "hot"
            ? "border-coral/25 bg-coral-wash/60"
            : "border-hairline bg-cream/40",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_1px_2px_rgba(28,26,23,0.06)] sm:h-8 sm:w-8",
          tone === "good" ? "text-sage" : tone === "hot" ? "text-coral" : "text-ink/70",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold tracking-wide text-muted uppercase sm:text-[10.5px]">{label}</p>
        <p className="line-clamp-2 text-[12.5px] leading-snug font-bold break-words text-ink sm:text-[13px]" title={value}>
          {value}
        </p>
      </div>
    </div>
  );
}

function PostCard({
  post: p,
  quotaLeft,
  premium,
  onRespond,
  onReveal,
}: {
  post: BoardRequirement;
  quotaLeft: number;
  premium: boolean;
  onRespond: () => void;
  onReveal: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const budget = budgetLabel(p);
  const closed = p.status === "closed";
  const expires = daysLeft(p.expiresAt);
  const closingSoon = !closed && expires <= 2;
  const urgent = !closed && p.startTimeline === "immediately";
  const fresh = !closed && isNewPost(p.postedAt);
  const clampable = p.details.length > 180;
  const location = displayLocation(p.area, p.city);
  const tone = subjectTone(p.subject);
  const mine = p.myInterestStatus ? MY_STATUS[p.myInterestStatus] : null;
  const showPitchCta = !closed && p.myInterestStatus !== "pending";
  const canPitch =
    showPitchCta && (quotaLeft > 0 || p.myInterestStatus === "accepted");
  const extras = [
    p.goal ? { icon: Target, text: p.goal } : null,
    p.classesPerWeek ? { icon: Repeat, text: p.classesPerWeek } : null,
    p.preferredTime ? { icon: Sun, text: p.preferredTime } : null,
  ].filter((x): x is { icon: LucideIcon; text: string } => x !== null);

  return (
    <li>
      <article
        className={cn(
          "rounded-2xl border bg-white p-4 shadow-[0_1px_2px_rgba(28,26,23,0.04)] transition sm:p-5",
          closed
            ? "border-hairline bg-white/70"
            : p.myInterestStatus === "pending"
              ? "border-butter-deep/60"
              : "border-hairline hover:border-ink/15 hover:shadow-[0_8px_24px_-12px_rgba(28,26,23,0.18)]",
        )}
      >
        {/* header */}
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold",
              closed ? "bg-cream-band text-muted" : tone.tile,
            )}
            aria-hidden
          >
            {p.subject.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className={cn("text-base font-bold leading-snug sm:text-lg", closed ? "text-ink/70" : "text-ink")}>
              {p.subject} tutor
            </h3>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[13px] text-ink/75">
              <GraduationCap className="h-3.5 w-3.5 text-muted" />
              <span className="font-semibold">{p.classLevel}</span>
              {p.board ? (
                <>
                  <span className="text-muted">·</span>
                  <span>{p.board}</span>
                </>
              ) : null}
              <span className="hidden text-muted sm:inline">·</span>
              <span className="basis-full text-muted sm:basis-auto">
                Posted {timeAgo(p.postedAt)}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {fresh && (
              <span className="rounded-full bg-coral px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                New
              </span>
            )}
            {closed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-cream-band px-2.5 py-1 text-[11px] font-bold text-muted">
                <Lock className="h-3 w-3" />
                Closed
              </span>
            ) : closingSoon ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-coral-wash px-2.5 py-1 text-[11px] font-bold text-coral-dark">
                <Hourglass className="h-3 w-3" />
                {expires === 0 ? "Ends today" : `${expires}d left`}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold tabular-nums text-muted">
                <Hourglass className="h-3 w-3" />
                {expires}d left
              </span>
            )}
          </div>
        </div>

        {/* key facts */}
        <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Fact
            icon={Wallet}
            label="Budget"
            value={budget ?? "Open to quotes"}
            tone={budget ? "good" : "default"}
          />
          <Fact
            icon={p.modes.length === 1 ? MODE_ICONS[p.modes[0]] ?? Laptop : Laptop}
            label="Mode"
            value={p.modes.map((m) => MODE_LABELS[m]).join(", ")}
          />
          <Fact
            icon={CalendarClock}
            label="Starts"
            value={TIMELINE_LABELS[p.startTimeline] ?? "Flexible"}
            tone={urgent ? "hot" : "default"}
          />
          <Fact icon={MapPin} label="Area" value={location} />
        </div>

        {extras.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {extras.map((x) => (
              <span
                key={x.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-2.5 py-1 text-xs font-medium text-ink/80"
              >
                <x.icon className="h-3.5 w-3.5 text-muted" />
                {x.text}
              </span>
            ))}
          </div>
        )}

        {/* parent's note */}
        <div className="mt-3.5">
          <p
            className={cn(
              "text-[14px] leading-relaxed text-ink/80",
              !expanded && clampable && "line-clamp-3 sm:line-clamp-2",
            )}
          >
            {p.details}
          </p>
          {clampable && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 inline-flex min-h-8 items-center gap-1 text-[13px] font-bold text-coral touch-manipulation hover:text-coral-dark"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* footer */}
        <div className="mt-4 flex flex-col gap-3 border-t border-hairline pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-[13px] font-semibold",
                p.interestCount > 0 ? "text-ink" : closed ? "text-muted" : "text-coral-dark",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  p.interestCount > 0 ? "bg-cream-band" : "bg-coral-wash",
                )}
              >
                <Users className={cn("h-3.5 w-3.5", p.interestCount > 0 ? "text-ink/70" : "text-coral")} />
              </span>
              {p.interestCount > 0
                ? `${p.interestCount} tutor${p.interestCount === 1 ? "" : "s"} pitched`
                : closed
                  ? "No pitches"
                  : "No pitches yet — be first"}
            </span>
            {mine ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
                  mine.cls,
                )}
              >
                <mine.icon className="h-3.5 w-3.5" />
                {mine.label}
              </span>
            ) : null}
          </div>

          {(showPitchCta || (premium && p.parentId && !closed)) && (
            <div className="flex w-full items-center gap-2 sm:w-auto">
              {premium && p.parentId && !closed && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onReveal}
                  className="h-11 flex-1 gap-1.5 rounded-xl px-4 text-sm font-bold sm:flex-none"
                >
                  <Sparkles className="h-4 w-4 text-coral" />
                  Reveal parent
                </Button>
              )}
              {showPitchCta && (
                <Button
                  onClick={onRespond}
                  disabled={!canPitch}
                  variant={p.myInterestStatus ? "secondary" : "primary"}
                  className="h-11 flex-1 gap-1.5 rounded-xl px-5 text-sm font-bold whitespace-nowrap touch-manipulation sm:min-w-[9rem] sm:flex-none"
                >
                  {!canPitch ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Limit reached
                    </>
                  ) : p.myInterestStatus ? (
                    <>
                      <Send className="h-4 w-4" />
                      Pitch again
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Pitch this post
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </article>
    </li>
  );
}

function fileSlug(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return slug || "parent";
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadParentCsv(reveal: PremiumRevealRow, post: BoardRequirement) {
  const rows = [
    ["Name", reveal.parentName],
    ["Phone", reveal.parentPhone],
    ["Email", reveal.parentEmail || ""],
    ["City", reveal.parentCity || post.city],
    ["Area", reveal.parentArea || post.area],
    ["WhatsApp", reveal.whatsappUrl || ""],
    ["Requirement", `${post.subject} · Class ${post.classLevel}`],
    ["Requirement area", post.area],
    ["Revealed at", reveal.revealedAt || new Date().toISOString()],
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  saveBlob(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
    `${fileSlug(reveal.parentName)}-${fileSlug(post.subject)}.csv`,
  );
}

function pdfSafe(value: string) {
  const clean = value.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
  return clean || "-";
}

async function downloadParentPdf(reveal: PremiumRevealRow, post: BoardRequirement) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const page = doc.addPage([420, 560]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.1, 0.14, 0.11);
  const muted = rgb(0.38, 0.4, 0.38);
  page.drawText("Mentr parent contact", {
    x: 36,
    y: 520,
    size: 11,
    font,
    color: muted,
  });
  page.drawText(pdfSafe(reveal.parentName).slice(0, 28), {
    x: 36,
    y: 490,
    size: 22,
    font: bold,
    color: ink,
  });
  const lines: [string, string][] = [
    ["Phone", reveal.parentPhone || "-"],
    ["Email", reveal.parentEmail || "-"],
    ["City", reveal.parentCity || post.city || "-"],
    ["Area", reveal.parentArea || post.area || "-"],
    ["WhatsApp", reveal.whatsappUrl || "-"],
    ["Requirement", `${post.subject}, Class ${post.classLevel}`],
    ["Looking in", post.area || post.city || "-"],
    ["Saved", new Date(reveal.revealedAt || Date.now()).toLocaleString("en-IN")],
  ];
  let y = 450;
  for (const [label, value] of lines) {
    page.drawText(label, { x: 36, y, size: 9, font, color: muted });
    const text = pdfSafe(value).slice(0, 52);
    page.drawText(text, { x: 36, y: y - 14, size: 12, font: bold, color: ink });
    y -= 40;
  }
  page.drawText("Counts as one of your 5 parent reveals today.", {
    x: 36,
    y: 48,
    size: 9,
    font,
    color: muted,
  });
  const bytes = await doc.save();
  saveBlob(
    new Blob([bytes as BlobPart], { type: "application/pdf" }),
    `${fileSlug(reveal.parentName)}-${fileSlug(post.subject)}.pdf`,
  );
}

function RevealParentDialog({
  post,
  onClose,
  onQuota,
}: {
  post: BoardRequirement | null;
  onClose: () => void;
  onQuota: (quota: PremiumRevealQuota) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reveal, setReveal] = useState<PremiumRevealRow | null>(null);
  const [already, setAlready] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dailyLimit, setDailyLimit] = useState(5);
  const [saving, setSaving] = useState<"csv" | "pdf" | null>(null);

  useEffect(() => {
    if (!post?.parentId) {
      setReveal(null);
      setError("");
      setAlready(false);
      setRemaining(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    setReveal(null);
    premiumMentorApi
      .revealParent(post.parentId)
      .then((data) => {
        if (cancelled) return;
        setReveal(data.reveal);
        setAlready(Boolean(data.alreadyRevealed));
        setRemaining(data.quota.remaining);
        if (data.quota.dailyLimit > 0) setDailyLimit(data.quota.dailyLimit);
        onQuota(data.quota);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError ? err.message : "Could not reveal this parent.";
        setError(message);
        const quota = err instanceof ApiError ? err.data?.quota : undefined;
        if (
          quota &&
          typeof quota === "object" &&
          "remaining" in quota &&
          typeof (quota as PremiumRevealQuota).remaining === "number"
        ) {
          const next = quota as PremiumRevealQuota;
          setRemaining(next.remaining);
          if (next.dailyLimit > 0) setDailyLimit(next.dailyLimit);
          onQuota(next);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [post, onQuota]);

  return (
    <Dialog open={post !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-hairline px-5 py-4">
          <DialogTitle className="text-base">Parent contact</DialogTitle>
          <DialogDescription className="text-xs">
            {post
              ? `${post.subject} · Class ${post.classLevel} · ${post.area || post.city}`
              : "Reveal uses one of your 5 parent contacts today."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-4">
          {loading && (
            <div className="flex items-center gap-2 py-8 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Opening this parent…
            </div>
          )}

          {!loading && error && (
            <p className="rounded-xl bg-cream px-4 py-3 text-sm leading-relaxed text-ink">
              {error}
            </p>
          )}

          {!loading && reveal && (
            <div className="rounded-2xl border border-hairline bg-cream/40 p-4">
              <p className="text-lg font-bold text-ink">{reveal.parentName}</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Phone</dt>
                  <dd className="font-semibold text-ink">{reveal.parentPhone || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Email</dt>
                  <dd className="truncate font-semibold text-ink">
                    {reveal.parentEmail || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Area</dt>
                  <dd className="text-right font-semibold text-ink">
                    {[reveal.parentArea, reveal.parentCity].filter(Boolean).join(", ") ||
                      post?.area ||
                      "—"}
                  </dd>
                </div>
              </dl>
              {reveal.whatsappUrl && (
                <a
                  href={reveal.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-sm font-bold text-sage hover:underline"
                >
                  Open WhatsApp
                </a>
              )}
            </div>
          )}

          {!loading && remaining != null && (
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {already
                ? `This parent is already in today’s reveals, so it did not use another one. ${remaining} of ${dailyLimit} left. Download a copy to keep the details.`
                : `${remaining} of ${dailyLimit} parent reveals left today. Download the CSV or PDF now — the card stays open for 2 hours.`}
            </p>
          )}
        </div>

        <DialogFooter className="border-t border-hairline px-5 py-3 sm:justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          {reveal && post && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={saving !== null}
                onClick={() => downloadParentCsv(reveal, post)}
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={saving !== null}
                onClick={() => {
                  setSaving("pdf");
                  void downloadParentPdf(reveal, post).finally(() => setSaving(null));
                }}
              >
                {saving === "pdf" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                PDF
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PitchDialog({
  post,
  onClose,
  onSent,
}: {
  post: BoardRequirement | null;
  onClose: () => void;
  onSent: () => void;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [alreadyConnected, setAlreadyConnected] = useState(false);

  useEffect(() => {
    if (!post) {
      setMessage("");
      setError("");
      setSending(false);
      setSent(false);
      setAlreadyConnected(false);
    }
  }, [post]);

  async function handleSend() {
    if (!post) return;
    const trimmed = message.trim();
    if (trimmed.length < PITCH_MIN) {
      setError(`Write at least ${PITCH_MIN} characters.`);
      return;
    }
    setError("");
    setSending(true);
    try {
      const result = await requirementsApi.expressInterest(post.id, trimmed);
      setAlreadyConnected(!!result.alreadyConnected);
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.data?.code === "ALREADY_PENDING") {
        setSent(true);
      } else {
        setError(
          err instanceof ApiError ? err.message : "Failed to send. Try again.",
        );
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-0 overflow-hidden border-hairline bg-white p-0 shadow-[0_20px_50px_rgba(26,35,28,0.18)] sm:max-w-lg">
        {sent ? (
          <div className="bg-white p-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-wash">
              <Check className="h-6 w-6 text-sage" />
            </span>
            <DialogHeader className="mt-5 space-y-2">
              <DialogTitle className="text-lg font-bold text-ink">
                Pitch sent
              </DialogTitle>
              <DialogDescription className="text-sm text-muted">
                {alreadyConnected
                  ? "Your pitch was saved. You're already connected with this parent on WhatsApp."
                  : "The parent compares pitches. If they pick you, they book a free demo and you get their number — no fees."}
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-6 w-full" onClick={onSent}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-hairline bg-cream/40 px-6 py-5 text-left">
              <div className="flex items-center gap-3">
                {post ? (
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold",
                      subjectTone(post.subject).tile,
                    )}
                    aria-hidden
                  >
                    {post.subject.charAt(0)}
                  </span>
                ) : null}
                <div className="min-w-0">
                  <DialogTitle className="text-lg font-bold text-ink">
                    Pitch · {post?.subject} tutor
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted">
                    {post
                      ? [
                          post.classLevel,
                          displayLocation(post.area, post.city),
                          budgetLabel(post),
                        ]
                          .filter(Boolean)
                          .join(" · ")
                      : null}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 bg-white px-6 py-5">
              <div className="flex items-start gap-2.5 rounded-lg bg-butter/40 px-4 py-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ink/50" />
                <p className="text-xs leading-relaxed text-ink/80">
                  Parent sees your pitch + profile. You get their number when
                  they book a demo with you — no coins, ever.
                </p>
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-ink">
                    Your pitch
                  </span>
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      message.length > PITCH_MAX
                        ? "text-coral-dark"
                        : "text-muted",
                    )}
                  >
                    {message.length}/{PITCH_MAX}
                  </span>
                </div>
                <Textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value.slice(0, PITCH_MAX))
                  }
                  rows={5}
                  autoFocus
                  placeholder={
                    post
                      ? `I've taught ${post.subject} to ${post.classLevel} for 6+ years — available in ${post.area} on weekends.`
                      : ""
                  }
                  className="resize-none border-hairline bg-white text-sm shadow-none focus-visible:border-ink/30 focus-visible:ring-coral/20"
                />
              </div>

              {error && (
                <p className="rounded-lg border border-coral/30 bg-coral-wash px-4 py-2.5 text-sm font-medium text-coral-dark">
                  {error}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 border-t border-hairline bg-cream/20 px-6 py-4 sm:justify-stretch">
              <Button
                variant="secondary"
                className="h-11 w-full rounded-xl sm:w-auto sm:flex-1"
                onClick={onClose}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                className="h-11 w-full rounded-xl sm:w-auto sm:flex-1"
                onClick={handleSend}
                disabled={sending || message.trim().length < PITCH_MIN}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {sending ? "Sending…" : "Send pitch"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
