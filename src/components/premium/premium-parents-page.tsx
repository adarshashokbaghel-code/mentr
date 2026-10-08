"use client";

/**
 * Layout plan — /parentslist (Premium parent directory)
 *
 * 1. Compact header — brand + title left, reveal quota meter right
 * 2. Sticky controls — Search (Input) · Tabs (All / Hiring)
 * 3. Card grid — photo-first shadcn Avatar cards, soft hover lift, stagger fade-in
 * 4. Card body — name, location, need chip, locked contact strip → Reveal / WhatsApp
 * 5. Gate — non-premium full-bleed upgrade state
 *
 * Stack: Avatar, Badge, Button, Input, Tabs, Skeleton, Separator, Tooltip (shadcn)
 */

import { useAuth } from "@/components/auth/auth-provider";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ApiError,
  premiumMentorApi,
  type ParentBoard,
  type PremiumParentRow,
  type PremiumRevealQuota,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Crown,
  Eye,
  Globe2,
  GraduationCap,
  Info,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldAlert,
  Sparkles,
  Unlock,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type FilterTab = "all" | "hiring";
type BoardFilter = "all" | ParentBoard;

const BOARD_FILTERS: Array<{ id: BoardFilter; label: string; hint?: string }> = [
  { id: "all", label: "All boards" },
  { id: "CBSE", label: "CBSE", hint: "India" },
  { id: "IGCSE", label: "IGCSE", hint: "Foreign" },
];

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function msUntilNextIstMidnight(now = Date.now()): number {
  const istNow = now + IST_OFFSET_MS;
  return DAY_MS - (istNow % DAY_MS);
}

function formatJoined(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function initialsOf(name: string, fallback?: string) {
  if (fallback?.trim()) return fallback.trim().slice(0, 2).toUpperCase();
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export function PremiumParentsPage() {
  const { user, loading: authLoading, openRoleChooser } = useAuth();
  const router = useRouter();
  const [parents, setParents] = useState<PremiumParentRow[]>([]);
  const [quota, setQuota] = useState<PremiumRevealQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notPremium, setNotPremium] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [board, setBoard] = useState<BoardFilter>("all");
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 280);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotPremium(false);
    try {
      const data = await premiumMentorApi.parents({
        q: debouncedQuery || undefined,
        limit: 200,
      });
      setParents(data.parents || []);
      setQuota(data.quota || null);
    } catch (e) {
      if (
        e instanceof ApiError &&
        (e.status === 403 || e.data?.code === "NOT_PREMIUM")
      ) {
        setNotPremium(true);
        setParents([]);
        setQuota(null);
      } else {
        setError(e instanceof Error ? e.message : "Failed to load");
        setParents([]);
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      openRoleChooser("/parentslist");
      return;
    }
    if (user.role !== "faculty") {
      router.replace(user.role === "parent" ? "/parent/dashboard" : "/");
      return;
    }
    void load();
  }, [authLoading, user, router, load, openRoleChooser]);

  // Quota resets at midnight IST — refresh when the tab regains focus and at
  // the next IST midnight so a tab left open overnight doesn't stay at 0.
  useEffect(() => {
    if (authLoading || user?.role !== "faculty") return;
    const refresh = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    const midnight = window.setTimeout(() => void load(), msUntilNextIstMidnight() + 5_000);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      window.clearTimeout(midnight);
    };
  }, [authLoading, user, load]);

  // The API returns parents already ranked; filtering keeps that order.
  const filtered = useMemo(() => {
    let list = board === "all" ? parents : parents.filter((p) => p.board === board);
    if (filter === "hiring") list = list.filter((p) => p.hasPosted);
    return list;
  }, [parents, filter, board]);

  const counts = useMemo(() => {
    const inBoard =
      board === "all" ? parents : parents.filter((p) => p.board === board);
    const inTab =
      filter === "hiring" ? parents.filter((p) => p.hasPosted) : parents;
    return {
      all: inBoard.length,
      hiring: inBoard.filter((p) => p.hasPosted).length,
      boards: {
        all: inTab.length,
        CBSE: inTab.filter((p) => p.board === "CBSE").length,
        IGCSE: inTab.filter((p) => p.board === "IGCSE").length,
      } satisfies Record<BoardFilter, number>,
    };
  }, [parents, filter, board]);

  async function reveal(parentId: string) {
    setRevealingId(parentId);
    setError(null);
    try {
      const res = await premiumMentorApi.revealParent(parentId);
      if (res.quota) setQuota(res.quota);
      setParents((prev) =>
        prev.map((p) =>
          p.id === parentId
            ? {
                ...p,
                contactRevealed: true,
                previouslyRevealed: true,
                name: res.reveal.parentName || "Parent",
                phone: res.reveal.parentPhone,
                email: res.reveal.parentEmail,
                whatsappUrl: res.reveal.whatsappUrl,
                revealedAt: res.reveal.revealedAt,
              }
            : p,
        ),
      );
      setJustUnlocked(parentId);
      window.setTimeout(() => setJustUnlocked(null), 1600);
      // Photo and other unlocked fields come from the server on refresh.
      void load();
    } catch (e) {
      const errQuota =
        e instanceof ApiError
          ? (e.data as { quota?: PremiumRevealQuota } | undefined)?.quota
          : undefined;
      if (errQuota) setQuota(errQuota);
      setError(e instanceof Error ? e.message : "Could not reveal contact");
    } finally {
      setRevealingId(null);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-sm text-muted">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  }

  if (notPremium) {
    return (
      <>
        <Navbar />
        <UpgradeGate />
        <Footer />
      </>
    );
  }

  const quotaLoaded = quota !== null;
  const used = quota?.usedToday ?? 0;
  const limit = quota?.dailyLimit ?? 3;
  const remaining = quota?.remaining ?? 0;
  const limitReached = quotaLoaded && remaining === 0;
  const quotaPct = Math.min(100, Math.round((used / limit) * 100));

  return (
    <TooltipProvider>
      <Navbar />
      <main className="min-h-screen w-full bg-cream">
        {/* ── 1. Compact header ── */}
        <header className="w-full border-b border-hairline bg-gradient-to-br from-butter/40 via-cream to-sage-wash/30">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-4 py-6 sm:px-6 sm:py-7 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="cream"
                  className="gap-1 border-2 border-ink bg-butter px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_0_#1a231c]"
                >
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
                <Badge variant="muted" className="gap-1 text-[11px]">
                  <Users className="h-3 w-3" />
                  Parent directory
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Find parents to reach
              </h1>
              
            </div>

            <div className="flex w-full max-w-xs flex-col gap-2 rounded-2xl border border-hairline bg-white/90 p-4 shadow-[0_1px_3px_rgba(26,35,28,0.06)] backdrop-blur sm:max-w-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                  <Eye className="h-3.5 w-3.5 text-coral" />
                  Today&apos;s reveals
                </p>
                <p className="text-sm font-bold tabular-nums text-ink">
                  {quotaLoaded ? `${remaining} left` : "…"}
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-cream-band">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    limitReached ? "bg-coral" : "bg-sage",
                  )}
                  style={{ width: `${quotaPct}%` }}
                />
              </div>
              <p className="text-[11px] text-muted">
                {used} of {limit} used · resets midnight IST
              </p>
            </div>
          </div>
        </header>

        {/* ── 2. Sticky controls ── */}
        <div className="sticky top-0 z-30 w-full border-b border-hairline bg-cream/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city or area…"
                className="h-11 rounded-xl border-hairline bg-white pl-9 shadow-none focus-visible:border-ink/30"
              />
            </div>

            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as FilterTab)}
              className="w-full shrink-0 lg:w-auto"
            >
              <TabsList className="h-11 w-full rounded-xl bg-white p-1 shadow-sm ring-1 ring-hairline lg:w-auto">
                <TabsTrigger
                  value="all"
                  className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-ink data-[state=active]:text-white lg:flex-none lg:px-4"
                >
                  All
                  <span className="tabular-nums opacity-70">{counts.all}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="hiring"
                  className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-ink data-[state=active]:text-white lg:flex-none lg:px-4"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Hiring
                  <span className="tabular-nums opacity-70">
                    {counts.hiring}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div
              role="radiogroup"
              aria-label="Filter by board"
              className="flex h-11 w-full shrink-0 items-center gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-hairline lg:w-auto"
            >
              {BOARD_FILTERS.map((b) => {
                const active = board === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setBoard(b.id)}
                    className={cn(
                      "inline-flex h-full flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition lg:flex-none",
                      active ? "bg-ink text-white" : "text-muted hover:text-ink",
                    )}
                  >
                    {b.id === "all" ? <GraduationCap className="h-3.5 w-3.5" /> : null}
                    {b.label}
                    {b.hint ? (
                      <span
                        className={cn(
                          "hidden text-[11px] sm:inline",
                          active ? "text-white/60" : "text-muted/80",
                        )}
                      >
                        {b.hint}
                      </span>
                    ) : null}
                    <span className="tabular-nums opacity-70">
                      {counts.boards[b.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 3. Grid ── */}
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-5 space-y-3 rounded-2xl border border-hairline bg-white p-4 sm:p-5">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-wash text-sage">
                <Info className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">How this list works</p>
                <ul className="mt-2 space-y-1.5 text-[13px] leading-snug text-muted">
                  <li>
                    We list parents who registered on Mentr or enquired about
                    our portal — everyone who has come through so far, not a
                    paid lead dump.
                  </li>
                  <li>
                    Reveal a contact to see phone and email. You get{" "}
                    <span className="font-semibold text-ink">
                      {limit} reveals per day
                    </span>
                    . Reveal parent on the requirements board counts toward
                    this same daily limit. When you hit the limit, new reveals
                    open again at{" "}
                    <span className="font-semibold text-ink">
                      midnight IST
                    </span>
                    .
                  </li>
                  
                </ul>
              </div>
            </div>

            <Separator className="bg-hairline" />

            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-butter/80 text-ink">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">Disclaimer</p>
                <p className="mt-1.5 text-[13px] leading-snug text-muted">
                  Email IDs on these profiles are verified (OTP). Mobile numbers
                  are provided by the parent — we do{" "}
                  <span className="font-semibold text-ink">
                    not guarantee 100% authenticity
                  </span>{" "}
                  of every phone number. Please introduce yourself politely and
                  confirm interest before sharing fees or personal details.
                </p>
              </div>
            </div>
          </div>

          {error ? (
            <p className="mb-4 animate-in fade-in slide-in-from-top-1 rounded-xl border border-coral/30 bg-coral-wash/40 px-4 py-3 text-sm text-coral duration-200">
              {error}
            </p>
          ) : null}

          {limitReached ? (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-ink/10 bg-butter/60 px-4 py-3.5 text-sm text-ink animate-in fade-in duration-200">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">
                  Daily reveal limit reached
                </p>
                <p className="mt-0.5 text-[13px] text-ink/80">
                  You&apos;ve used all {limit} reveals for today. New reveals
                  reset at midnight IST. You can still browse the list and open
                  contacts you already unlocked.
                </p>
              </div>
            </div>
          ) : null}

          {loading && parents.length === 0 ? (
            <CardGridSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState
              filter={filter}
              board={board}
              hasQuery={Boolean(debouncedQuery)}
            />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((p, i) => (
                <li
                  key={p.id}
                  className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300"
                  style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                >
                  <ParentCard
                    parent={p}
                    revealing={revealingId === p.id}
                    canReveal={!limitReached || p.contactRevealed}
                    celebrating={justUnlocked === p.id}
                    onReveal={() => void reveal(p.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </TooltipProvider>
  );
}

function ParentCard({
  parent: p,
  revealing,
  canReveal,
  celebrating,
  onReveal,
}: {
  parent: PremiumParentRow;
  revealing: boolean;
  canReveal: boolean;
  celebrating: boolean;
  onReveal: () => void;
}) {
  const locked = !p.contactRevealed;
  const pending = Boolean(p.detailsPending);
  const alreadyUsed = locked && Boolean(p.previouslyRevealed);
  const location = [p.area, p.city].filter(Boolean).join(", ") || "Location N/A";
  const joined = formatJoined(p.joinedAt);
  const initials = p.name ? initialsOf(p.name, p.initials) : "";
  const genericTitle = `Parent in ${p.city || p.country || "India"}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-white",
        "shadow-[0_1px_3px_rgba(26,35,28,0.04)] transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-ink/15 hover:shadow-[0_12px_28px_rgba(26,35,28,0.1)]",
        celebrating && "ring-2 ring-sage scale-[1.01]",
        p.contactRevealed && "border-sage/35",
      )}
    >
      {/* Photo */}
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-band sm:aspect-[5/4]">
        {p.name ? (
          <Avatar className="absolute inset-0 size-full rounded-none">
            {p.imageUrl ? (
              <AvatarImage
                src={p.imageUrl}
                alt={p.name}
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            ) : null}
            <AvatarFallback className="rounded-none bg-gradient-to-br from-cream-band to-lavender/40 text-2xl font-bold text-ink/50">
              {initials || "P"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream-band via-lavender/30 to-sage-wash"
          >
            <div className="flex size-20 items-center justify-center rounded-full bg-white/60 blur-[2px]">
              <UserRound className="size-10 text-ink/30" />
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/35 to-transparent" />

        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {p.hasPosted ? (
            <Badge
              variant="sage"
              className="gap-1 border-0 bg-sage px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm"
            >
              <Sparkles className="h-2.5 w-2.5" />
              Hiring
            </Badge>
          ) : (
            <Badge
              variant="muted"
              className="border-0 bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted shadow-sm"
            >
              Browsing
            </Badge>
          )}
          <Badge
            variant="muted"
            className="border-0 bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink shadow-sm"
          >
            {p.board}
          </Badge>
          {p.overseas ? (
            <Badge
              variant="muted"
              className="gap-1 border-0 bg-[#2f3d7a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm"
            >
              <Globe2 className="h-2.5 w-2.5" />
              Foreign
            </Badge>
          ) : null}
        </div>

        {pending && !p.contactRevealed ? (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-butter px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink shadow-sm">
            <Clock className="h-2.5 w-2.5" />
            Just joined
          </span>
        ) : p.contactRevealed ? (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage shadow-sm">
            <Unlock className="h-2.5 w-2.5" />
            Open
          </span>
        ) : alreadyUsed ? (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            <Eye className="h-2.5 w-2.5" />
            Used
          </span>
        ) : (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            <Lock className="h-2.5 w-2.5" />
            Locked
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {p.name ? (
            <h2 className="truncate text-base font-bold tracking-tight text-ink">
              {p.name}
            </h2>
          ) : (
            <h2 className="flex items-center gap-2 text-base font-bold tracking-tight text-ink">
              <span className="truncate">{genericTitle}</span>
              <span
                aria-hidden
                className="h-3.5 w-16 shrink-0 select-none rounded bg-ink/15 blur-[3px]"
              />
            </h2>
          )}
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3 shrink-0 text-coral" />
            <span className="truncate">{location}</span>
          </p>
        </div>

        {p.latestPost ? (
          <div className="rounded-xl bg-cream-band/70 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
              Latest need
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-ink">
              {p.latestPost.subject}
              <span className="font-medium text-muted">
                {" "}
                · {p.latestPost.classLevel}
              </span>
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-hairline px-3 py-2">
            <p className="text-xs text-muted">No tutoring need posted yet</p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {p.hasPosted ? (
            <Badge variant="sage" className="text-[11px]">
              {p.openPosts} open · {p.totalPosts} post
              {p.totalPosts === 1 ? "" : "s"}
            </Badge>
          ) : null}
          {joined ? (
            <Badge variant="muted" className="text-[11px]">
              Joined {joined}
            </Badge>
          ) : null}
        </div>

        <Separator className="bg-hairline" />

        {/* Contact */}
        <div className="relative mt-auto overflow-hidden rounded-xl bg-cream/80">
          <div
            className={cn(
              "space-y-1 px-3 py-2.5 transition duration-300",
              locked && "select-none blur-[5px]",
            )}
          >
            <p className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-ink">
              <Phone className="h-3.5 w-3.5 text-muted" />
              {locked ? "+91 00000 00000" : pending ? "N/A" : p.phone || "N/A"}
            </p>
            <p className="truncate pl-5 text-xs text-muted">
              {locked ? "••••••••@•••••.com" : p.email || "N/A"}
            </p>
          </div>

          {locked ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 px-3 backdrop-blur-[1.5px] transition group-hover:bg-white/40">
              {pending ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex h-9 cursor-default items-center gap-1.5 rounded-full border border-ink/15 bg-butter/70 px-4 text-xs font-bold text-ink shadow-sm">
                      <Clock className="h-3.5 w-3.5" />
                      Details pending
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-center">
                    Email verified — this parent is still adding their name and
                    phone. Reveal opens once they finish; no credit is used.
                  </TooltipContent>
                </Tooltip>
              ) : alreadyUsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex h-9 cursor-default items-center gap-1.5 rounded-full border border-ink/15 bg-cream-band px-4 text-xs font-bold text-muted shadow-sm">
                      <Eye className="h-3.5 w-3.5" />
                      Already revealed
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-center">
                    Already revealed — contact was unlocked for 2 hours and is
                    locked again.
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="h-9 gap-1.5 rounded-full bg-ink px-4 text-white shadow-md transition hover:bg-ink/90 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={!canReveal || revealing}
                  onClick={onReveal}
                >
                  {revealing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5" />
                  )}
                  Reveal contact
                </Button>
              )}
            </div>
          ) : null}
        </div>

        {!locked && p.whatsappUrl ? (
          <a
            href={p.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              size="sm"
              className="h-10 w-full gap-1.5 rounded-xl bg-sage hover:bg-sage/90"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </a>
        ) : null}
      </div>
    </article>
  );
}

function CardGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <li
          key={i}
          className="overflow-hidden rounded-2xl border border-hairline bg-white"
        >
          <Skeleton className="aspect-[5/4] w-full rounded-none" />
          <div className="space-y-2.5 p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({
  filter,
  board,
  hasQuery,
}: {
  filter: FilterTab;
  board: BoardFilter;
  hasQuery: boolean;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-white px-6 py-16 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-band text-muted">
        <Users className="h-7 w-7" />
      </div>
      <p className="mt-4 text-base font-bold text-ink">No parents here</p>
      <p className="mt-1 max-w-sm text-sm text-muted">
        {hasQuery
          ? "Try a different search."
          : board !== "all"
            ? `No ${board} parents${filter === "hiring" ? " with open needs" : ""} right now. Try another board.`
            : filter === "hiring"
            ? "No parents with open needs match right now."
            : "Parents will show up as they join Mentr."}
      </p>
    </div>
  );
}

function UpgradeGate() {
  return (
    <main className="relative flex min-h-[75vh] w-full items-center justify-center overflow-hidden border-b border-hairline bg-gradient-to-br from-cream via-butter/30 to-sage-wash/40 px-4 py-20">
      <div className="relative w-full max-w-lg rounded-3xl border border-hairline bg-white p-8 text-center shadow-[0_16px_40px_rgba(26,35,28,0.08)] animate-in fade-in zoom-in-95 duration-300 sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-butter text-ink shadow-sm">
          <Lock className="h-5 w-5" />
        </span>
        <Badge
          variant="cream"
          className="mt-4 gap-1 border border-ink/10 bg-butter/70 text-[11px] font-bold uppercase tracking-wide"
        >
          <Crown className="h-3 w-3" />
          Premium only
        </Badge>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Unlock the parent directory
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Photo cards, hiring signals, and 3 contact reveals a day — built for
          mentors ready to scale.
        </p>
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link href="/mentrpricing" className="w-full sm:w-auto">
            <Button size="lg" className="h-11 w-full gap-2 rounded-xl sm:min-w-[180px]">
              Upgrade
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="h-11 w-full rounded-xl sm:min-w-[140px]"
            >
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
