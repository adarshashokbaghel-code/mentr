"use client";

import {
  ApiError,
  requirementsApi,
  type BoardRequirement,
} from "@/lib/api";
import { timeAgo } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCountdown, msUntilLocalMidnight } from "@/lib/utils";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Flame,
  Hourglass,
  IndianRupee,
  Loader2,
  Lock,
  MapPin,
  Megaphone,
  MessageSquare,
  MonitorSmartphone,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  X,
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
  immediately: "Starts immediately",
  within_week: "Starts within a week",
  within_month: "Starts within a month",
  flexible: "Flexible start",
};

const MODE_FILTERS = [
  { id: "online", label: "Online" },
  { id: "student_home", label: "Student's home" },
  { id: "tutor_home", label: "Your place" },
] as const;

const SUBJECT_TONES = [
  "bg-coral text-white",
  "bg-sage text-white",
  "bg-lavender-deep text-ink",
  "bg-butter-deep text-ink",
  "bg-sky text-ink",
];

function subjectTone(subject: string): string {
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
  { id: "budget", label: "Budget", icon: TrendingUp },
];

function BoardStatusToggle({
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
      className="inline-flex h-7 shrink-0 items-center rounded-full border border-hairline bg-white p-0.5 shadow-sm"
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
              "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold transition touch-manipulation",
              active
                ? "bg-ink text-white"
                : "text-muted hover:bg-cream hover:text-ink",
            )}
          >
            {id === "open" ? "Open" : "Closed"}
            {id === "closed" && (
              <span
                className={cn(
                  "min-w-[1.1rem] rounded-full px-1 text-center text-[10px] font-bold tabular-nums",
                  active ? "bg-white/20 text-white" : "bg-cream-band text-muted",
                )}
              >
                {closedCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Tutor-facing requirements board — Reddit-style feed with shadcn primitives. */
export function RequirementsFeed() {
  const [posts, setPosts] = useState<BoardRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(3);
  const [usedToday, setUsedToday] = useState(0);
  const [pitchFor, setPitchFor] = useState<BoardRequirement | null>(null);

  const [sort, setSort] = useState<SortMode>("new");
  const [subject, setSubject] = useState("All");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [hidePitched, setHidePitched] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"open" | "closed">("open");

  const reload = useCallback(() => {
    requirementsApi
      .board()
      .then((data) => {
        setPosts(data.requirements);
        setDailyLimit(data.dailyLimit);
        setUsedToday(data.usedToday);
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

  const left = Math.max(0, dailyLimit - usedToday);
  const atLimit = left <= 0;
  const newToday = posts.filter(
    (p) => p.status === "open" && isNewPost(p.postedAt),
  ).length;
  const totalResponses = posts.reduce((sum, p) => sum + p.interestCount, 0);
  const filtersActive =
    subject !== "All" || modeFilter !== "all" || hidePitched || query.trim();

  const communityLabel =
    subject === "All" ? "r/all" : `r/${subject.replace(/\s+/g, "")}`;

  return (
    <>
      {/* mobile: quota + quick stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 lg:hidden">
        <MobileQuotaCard
          left={left}
          dailyLimit={dailyLimit}
          atLimit={atLimit}
          usedToday={usedToday}
        />
        <div className="rounded-xl border border-hairline bg-white p-4">
          <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
            Board pulse
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            <PulseStat label="Open" value={openCount} />
            <PulseStat label="New" value={newToday} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:gap-8 2xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,260px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
        {/* ── left: communities (wide screens only) ── */}
        <aside className="hidden 2xl:block">
          <div className="sticky top-[5rem] space-y-4">
            <SidebarPanel title="Subjects">
              <nav className="space-y-0.5">
                <SidebarLink
                  active={subject === "All"}
                  onClick={() => setSubject("All")}
                  icon="∞"
                  label="All subjects"
                  count={pool.length}
                />
                {subjectCounts.map(([s, count]) => (
                  <SidebarLink
                    key={s}
                    active={subject === s}
                    onClick={() => setSubject(subject === s ? "All" : s)}
                    icon={s.charAt(0)}
                    label={s}
                    count={count}
                    tone={subjectTone(s)}
                  />
                ))}
              </nav>
            </SidebarPanel>

            <SidebarPanel title="Mode">
              <nav className="space-y-0.5">
                <SidebarLink
                  active={modeFilter === "all"}
                  onClick={() => setModeFilter("all")}
                  label="Any mode"
                />
                {MODE_FILTERS.map((m) => (
                  <SidebarLink
                    key={m.id}
                    active={modeFilter === m.id}
                    onClick={() =>
                      setModeFilter(modeFilter === m.id ? "all" : m.id)
                    }
                    label={m.label}
                  />
                ))}
              </nav>
              <Separator className="my-3 bg-hairline" />
              <label className="flex cursor-pointer items-center gap-2.5 px-2 py-1">
                <Checkbox
                  checked={hidePitched}
                  onCheckedChange={(v) => setHidePitched(v === true)}
                  className="border-hairline data-[state=checked]:border-coral data-[state=checked]:bg-coral"
                />
                <span className="text-[13px] font-medium text-ink">
                  Hide pitched
                </span>
              </label>
            </SidebarPanel>
          </div>
        </aside>

        {/* ── center: feed ── */}
        <div className="min-w-0">
          {/* mobile / tablet filters */}
          <div className="mb-4 space-y-3 2xl:hidden">
            <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max gap-2">
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
                  />
                ))}
              </div>
            </div>
            <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max items-center gap-2">
                <FilterChip
                  active={modeFilter === "all"}
                  onClick={() => setModeFilter("all")}
                  label="Any mode"
                />
                {MODE_FILTERS.map((m) => (
                  <FilterChip
                    key={m.id}
                    active={modeFilter === m.id}
                    onClick={() =>
                      setModeFilter(modeFilter === m.id ? "all" : m.id)
                    }
                    label={m.label}
                  />
                ))}
                <FilterChip
                  active={hidePitched}
                  onClick={() => setHidePitched((v) => !v)}
                  label="Hide pitched"
                />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_1px_0_rgba(26,35,28,0.04)]">
            <div className="flex flex-wrap items-center gap-4 border-b border-hairline px-4 py-4 sm:px-6 sm:py-5">
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold",
                  subject === "All"
                    ? "bg-ink text-white"
                    : subjectTone(subject),
                )}
              >
                {subject === "All" ? "∞" : subject.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-ink sm:text-[22px]">
                  {communityLabel}
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  {statusFilter === "open"
                    ? `${openCount} open post${openCount === 1 ? "" : "s"}`
                    : `${closedCount} closed post${closedCount === 1 ? "" : "s"}`}
                </p>
              </div>
              <Badge
                variant={atLimit ? "coral" : "sage"}
                className="shrink-0 px-3 py-1 text-xs font-bold"
              >
                {left}/{dailyLimit} left today
              </Badge>
            </div>

            {/* toolbar: search + status + sort */}
            <div className="border-b border-hairline px-4 py-4 sm:px-6">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                className="h-11 border-hairline bg-cream/50 pl-11 pr-11 text-base shadow-none touch-manipulation focus-visible:border-ink/30 focus-visible:ring-coral/20 sm:text-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted touch-manipulation hover:bg-cream"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-3 -mx-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <Tabs
                  value={sort}
                  onValueChange={(v) => setSort(v as SortMode)}
                >
                  <TabsList
                    variant="line"
                    className="h-10 min-w-max gap-0 bg-transparent p-0"
                  >
                    {SORTS.map((s) => (
                      <TabsTrigger
                        key={s.id}
                        value={s.id}
                        className="h-10 min-w-[4.25rem] rounded-lg px-3.5 text-sm font-bold text-muted touch-manipulation data-[state=active]:bg-cream data-[state=active]:text-ink data-[state=active]:after:bg-coral"
                      >
                        <s.icon className="mr-1.5 h-4 w-4" />
                        {s.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
          </div>

          {/* result meta */}
          {!loading && (
            <div className="flex items-center justify-between gap-3 border-x border-b border-hairline bg-cream/40 px-4 py-2 sm:px-6">
              <p className="text-xs font-semibold text-muted">
                {visible.length} {statusFilter}{" "}
                {visible.length === 1 ? "post" : "posts"}
                {filtersActive ? " · filtered" : ""}
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <BoardStatusToggle
                  statusFilter={statusFilter}
                  closedCount={closedCount}
                  onChange={(next) => {
                    setStatusFilter(next);
                    setSubject("All");
                  }}
                />
                {filtersActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setSubject("All");
                      setModeFilter("all");
                      setHidePitched(false);
                      setQuery("");
                    }}
                    className="text-xs font-bold text-coral hover:text-coral-dark"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* feed list — single card, divided rows (classic Reddit) */}
          <div className="overflow-hidden border-x border-b border-hairline bg-white">
            {loading ? (
              <div className="divide-y divide-hairline">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-3 p-3">
                    <Skeleton className="h-14 w-10 shrink-0 rounded-sm bg-cream-band" />
                    <div className="flex-1 space-y-2 py-1">
                      <Skeleton className="h-3 w-1/3 bg-cream-band" />
                      <Skeleton className="h-4 w-2/3 bg-cream-band" />
                      <Skeleton className="h-3 w-full bg-cream-band" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Megaphone className="mx-auto h-8 w-8 text-muted" />
                <p className="mt-4 text-base font-semibold text-ink">
                  {filtersActive
                    ? "No posts match your filters"
                    : statusFilter === "closed"
                      ? "No closed posts yet"
                      : "No open posts right now"}
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                  {filtersActive
                    ? "Try clearing filters or switching subject."
                    : "New parent requirements show up here — check back soon."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-hairline">
                {visible.map((p) => (
                  <ThreadCard
                    key={p.id}
                    post={p}
                    quotaLeft={left}
                    onRespond={() => setPitchFor(p)}
                  />
                ))}
              </ul>
            )}
          </div>
          </div>
        </div>

        {/* ── right: widgets (desktop) ── */}
        <aside className="hidden space-y-4 xl:sticky xl:top-[5rem] xl:block xl:self-start">
          <WidgetCard title="Daily quota">
            <p className="text-2xl font-bold tabular-nums text-ink">
              {left}
              <span className="text-sm font-semibold text-muted">
                /{dailyLimit}
              </span>
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-cream-band">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  left > 0 ? "bg-sage" : "bg-coral",
                )}
                style={{ width: `${(left / dailyLimit) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {atLimit ? (
                <>
                  Daily limit reached.
                  <span className="mt-1 block">
                    <MidnightCountdown />
                  </span>
                </>
              ) : (
                `${left} pitch${left === 1 ? "" : "es"} left today — resets at midnight.`
              )}
            </p>
            {usedToday > 0 && (
              <>
                <Separator className="my-3 bg-hairline" />
                <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <Send className="h-3.5 w-3.5 text-sage" />
                  {usedToday} of {dailyLimit} used today
                  {myPitchCount > usedToday && (
                    <span className="font-normal text-muted">
                      · {myPitchCount} all time
                    </span>
                  )}
                </p>
              </>
            )}
          </WidgetCard>

          <WidgetCard title="Board pulse">
            <dl className="space-y-2">
              {[
                { label: "Open", value: openCount },
                { label: "Closed", value: closedCount },
                { label: "New today", value: newToday },
                { label: "Responses", value: totalResponses },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-2"
                >
                  <dt className="text-sm text-muted">{row.label}</dt>
                  <dd className="text-sm font-bold tabular-nums text-ink">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </WidgetCard>
        </aside>
      </div>

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

function MobileQuotaCard({
  left,
  dailyLimit,
  atLimit,
  usedToday,
}: {
  left: number;
  dailyLimit: number;
  atLimit: boolean;
  usedToday: number;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-white p-4">
      <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
        Daily quota
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-ink">
        {left}
        <span className="text-sm font-semibold text-muted">/{dailyLimit}</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-band">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            left > 0 ? "bg-sage" : "bg-coral",
          )}
          style={{ width: `${(left / dailyLimit) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        {atLimit ? <MidnightCountdown /> : `${left} left today`}
      </p>
      {usedToday > 0 && (
        <p className="mt-1 text-xs font-semibold text-ink">
          {usedToday} used today
        </p>
      )}
    </div>
  );
}

function PulseStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-bold tabular-nums text-ink">{value}</span>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition touch-manipulation",
        active
          ? "border-coral bg-coral text-white"
          : "border-hairline bg-white text-ink hover:bg-cream",
      )}
    >
      {label}
      {count != null && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
            active ? "bg-white/20 text-white" : "bg-cream-band text-muted",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function SidebarPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-hairline bg-white">
      <div className="border-b border-hairline bg-cream/50 px-4 py-3">
        <p className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
          {title}
        </p>
      </div>
      <div className="p-2.5">{children}</div>
    </section>
  );
}

function SidebarLink({
  active,
  onClick,
  icon,
  label,
  count,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
  count?: number;
  tone?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition touch-manipulation",
        active
          ? "border-l-2 border-coral bg-cream-band pl-[10px] text-ink"
          : "border-l-2 border-transparent text-muted hover:bg-cream hover:text-ink",
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
            tone ?? "bg-cream-band text-ink",
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count != null && (
        <span className="text-xs font-bold tabular-nums text-muted">
          {count}
        </span>
      )}
    </button>
  );
}

function WidgetCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-hairline bg-white">
      <div className="border-b border-hairline bg-cream/50 px-4 py-3">
        <p className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
          {title}
        </p>
      </div>
      <div className="p-5">{children}</div>
    </section>
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

function interestStatusLabel(status: BoardRequirement["myInterestStatus"]) {
  switch (status) {
    case "pending":
      return "Awaiting parent";
    case "accepted":
      return "Connected on WhatsApp";
    case "declined":
      return "Declined";
    default:
      return null;
  }
}

/** Post card — scan-friendly hierarchy with a clear action footer. */
function ThreadCard({
  post: p,
  quotaLeft,
  onRespond,
}: {
  post: BoardRequirement;
  quotaLeft: number;
  onRespond: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const budget = budgetLabel(p);
  const closed = p.status === "closed";
  const expires = daysLeft(p.expiresAt);
  const closingSoon = !closed && expires <= 2;
  const urgent = !closed && p.startTimeline === "immediately";
  const fresh = !closed && isNewPost(p.postedAt);
  const clampable = p.details.length > 160;
  const location = displayLocation(p.area, p.city);
  const statusLabel = interestStatusLabel(p.myInterestStatus);
  const showPitchCta =
    !closed && p.myInterestStatus !== "pending";
  const canPitch =
    showPitchCta && (quotaLeft > 0 || p.myInterestStatus === "accepted");

  return (
    <li className="group transition-colors hover:bg-cream/30 active:bg-cream/50">
      <div className="flex flex-col sm:flex-row">
      {/* engagement rail — desktop only */}
      <div className="hidden w-16 shrink-0 flex-col items-center justify-center border-b border-hairline bg-cream/25 py-5 sm:flex sm:border-r sm:border-b-0">
        <MessageSquare
          className={cn(
            "h-4 w-4",
            p.interestCount > 0 ? "text-coral" : "text-muted/60",
          )}
        />
        <span
          className={cn(
            "mt-1.5 text-sm font-bold tabular-nums",
            p.interestCount > 0 ? "text-ink" : "text-muted",
          )}
        >
          {p.interestCount}
        </span>
        <span className="text-[10px] font-semibold text-muted uppercase">
          {p.interestCount === 1 ? "pitch" : "pitches"}
        </span>
      </div>

      {/* content */}
      <div className="flex min-w-0 flex-1 flex-col px-4 py-4 sm:px-6 sm:py-5">
        {/* 1 — scan line: what + when */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted sm:text-[13px]">
            <span
              className={cn(
                "inline-flex h-6 items-center rounded-md px-2 text-[11px] font-bold uppercase tracking-wide",
                subjectTone(p.subject),
              )}
            >
              {p.subject}
            </span>
            <span className="font-medium text-ink/70">{p.classLevel}</span>
            <span aria-hidden className="text-hairline">
              ·
            </span>
            <span>{timeAgo(p.postedAt)}</span>
            {fresh && (
              <Badge
                variant="coral"
                className="px-2 py-0.5 text-[10px] font-bold uppercase"
              >
                New
              </Badge>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-cream-band px-2 py-0.5 text-[11px] font-bold text-ink sm:hidden">
              <MessageSquare className="h-3 w-3 text-coral" />
              {p.interestCount}
            </span>
          </div>
          {closed ? (
            <Badge variant="muted" className="gap-1 px-2.5 py-1 text-[11px]">
              <Lock className="h-3 w-3" />
              Closed
            </Badge>
          ) : closingSoon ? (
            <Badge
              variant="coral"
              className="gap-1 px-2.5 py-1 text-[11px] font-bold"
            >
              <Hourglass className="h-3 w-3" />
              {expires === 0 ? "Expires today" : `${expires}d left`}
            </Badge>
          ) : (
            <span className="text-[11px] font-semibold tabular-nums text-muted">
              {expires}d left
            </span>
          )}
        </div>

        {/* 2 — headline */}
        <h3 className="mt-2.5 text-lg leading-snug font-bold text-ink group-hover:text-coral-dark sm:text-xl">
          {p.subject} tutor · {p.classLevel}
        </h3>

        {/* 3 — decision factors (budget & logistics first) */}
        <div className="mt-3 flex flex-wrap gap-2">
          {budget ? (
            <Badge variant="sage" className="gap-1.5 px-2.5 py-1 text-xs font-bold">
              <IndianRupee className="h-3 w-3" />
              {budget}
            </Badge>
          ) : null}
          <Badge variant="cream" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
            <MapPin className="h-3 w-3" />
            {location}
          </Badge>
          <Badge variant="cream" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
            <MonitorSmartphone className="h-3 w-3" />
            {p.modes.map((m) => MODE_LABELS[m]).join(" · ")}
          </Badge>
          <Badge
            variant={urgent ? "coral" : "cream"}
            className="gap-1.5 px-2.5 py-1 text-xs font-medium"
          >
            <Clock3 className="h-3 w-3" />
            {TIMELINE_LABELS[p.startTimeline] ?? "Flexible"}
          </Badge>
        </div>

        {/* 4 — details */}
        <p
          className={cn(
            "mt-3 text-[15px] leading-relaxed text-ink/80 sm:text-sm",
            !expanded && clampable && "line-clamp-3 sm:line-clamp-2",
          )}
        >
          {p.details}
        </p>
        {clampable && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1.5 inline-flex min-h-9 items-center gap-1 text-sm font-bold text-coral touch-manipulation hover:text-coral-dark"
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

        {/* 5 — action footer: status left, CTA right (stacked on mobile) */}
        <div className="mt-4 flex flex-col gap-3 border-t border-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {statusLabel ? (
              <span
                className={cn(
                  "inline-flex max-w-full items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold",
                  p.myInterestStatus === "pending" && "bg-butter/60 text-ink",
                  p.myInterestStatus === "accepted" && "bg-sage-wash text-sage",
                  p.myInterestStatus === "declined" && "bg-cream-band text-muted",
                )}
              >
                {p.myInterestStatus === "pending" && (
                  <Clock3 className="h-3.5 w-3.5 shrink-0" />
                )}
                {p.myInterestStatus === "accepted" && (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="truncate">{statusLabel}</span>
              </span>
            ) : closed ? (
              <span className="text-sm font-medium text-muted">Post closed</span>
            ) : p.interestCount > 0 ? (
              <span className="text-sm font-medium text-muted">
                {p.interestCount} tutor{p.interestCount === 1 ? "" : "s"} pitched
              </span>
            ) : (
              <span className="text-sm font-medium text-coral">
                Be first to pitch
              </span>
            )}
          </div>

          {showPitchCta && (
            <Button
              size="sm"
              onClick={onRespond}
              disabled={!canPitch}
              variant={
                p.myInterestStatus === "accepted"
                  ? "secondary"
                  : p.myInterestStatus === "declined"
                    ? "secondary"
                    : "primary"
              }
              className={cn(
                "h-11 w-full shrink-0 gap-1.5 rounded-lg px-5 text-sm font-bold touch-manipulation sm:w-auto",
                p.myInterestStatus === "accepted" || p.myInterestStatus === "declined"
                  ? "sm:min-w-[8.5rem]"
                  : "sm:min-w-[6.5rem]",
              )}
            >
              {!canPitch ? (
                "Limit reached"
              ) : p.myInterestStatus === "accepted" ? (
                "Pitch again"
              ) : p.myInterestStatus === "declined" ? (
                "Try again"
              ) : (
                <>
                  Pitch
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      </div>
    </li>
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
                  : "The parent will review your profile. If they accept, you're connected on WhatsApp — free, no fees."}
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-6 w-full" onClick={onSent}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-hairline bg-cream/30 px-6 py-5">
              <DialogTitle className="text-lg font-bold text-ink">
                Pitch this post
              </DialogTitle>
              <DialogDescription className="text-sm text-muted">
                {post?.subject} · {post?.classLevel} · {post?.area}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 bg-white px-6 py-5">
              <div className="flex items-start gap-2.5 rounded-lg bg-butter/40 px-4 py-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ink/50" />
                <p className="text-xs leading-relaxed text-ink/80">
                  Parent sees your pitch + profile. WhatsApp unlocks only if
                  they accept — no coins, ever.
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

            <DialogFooter className="border-t border-hairline bg-cream/20 px-6 py-4 sm:justify-stretch">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={onClose}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1"
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
