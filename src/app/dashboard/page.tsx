"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import {
  NotificationsBell,
  StatCard,
  WhoViewedCard,
  timeAgo,
} from "@/components/dashboard/widgets";
import { ConnectionRequestsSection } from "@/components/dashboard/connection-requests";
import { PitchesSection } from "@/components/requirements/pitches-section";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import {
  connectionsApi,
  profileApi,
  type AvailabilitySlot,
  type ConnectionRequest,
  type ProfileViewsResponse,
} from "@/lib/api";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CalendarCheck,
  CalendarDays,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Loader2,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DAY_SHORT: Record<AvailabilitySlot["day"], string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const DAYS = Object.keys(DAY_SHORT) as AvailabilitySlot["day"][];

const DAY_LABEL: Record<AvailabilitySlot["day"], string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** 06:00 → 22:30 in 30-minute steps */
const TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 6; h <= 22; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(t: string, fmt: "12h" | "24h"): string {
  if (fmt === "24h") return t;
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0
    ? `${hour12} ${suffix}`
    : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function slotLabel(s: AvailabilitySlot, fmt: "12h" | "24h"): string {
  return `${DAY_SHORT[s.day]} ${formatTime(s.start, fmt)}–${formatTime(s.end, fmt)}`;
}

export default function DashboardPage() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [slotsError, setSlotsError] = useState("");

  // Add-slot modal
  const [addOpen, setAddOpen] = useState(false);
  const [newDay, setNewDay] = useState<AvailabilitySlot["day"]>("monday");
  const [newStart, setNewStart] = useState("16:00");
  const [newEnd, setNewEnd] = useState("18:00");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  // Who saw my profile + notifications data
  const [views, setViews] = useState<ProfileViewsResponse | null>(null);
  const [viewsLoading, setViewsLoading] = useState(true);

  // Incoming parent connection requests
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const [copied, setCopied] = useState(false);

  async function copyListingLink() {
    if (!user) return;
    try {
      await navigator.clipboard.writeText(
        absoluteUrl(`/teachers/${user.id}`),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — nothing to do
    }
  }

  useEffect(() => {
    setSlots(user?.profile?.availability ?? []);
  }, [user]);

  useEffect(() => {
    if (!user || user.role === "parent") return;
    let cancelled = false;
    profileApi
      .views()
      .then((data) => {
        if (!cancelled) setViews(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setViewsLoading(false);
      });
    connectionsApi
      .requests()
      .then((data) => {
        if (!cancelled) setRequests(data.requests);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setRequestsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!addOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAddOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [addOpen]);

  async function toggleSlot(index: number) {
    const nextSlots = slots.map((s, i) =>
      i === index ? { ...s, booked: !s.booked } : s,
    );
    setSlots(nextSlots);
    setSlotsError("");
    try {
      const { user: saved } = await profileApi.updateAvailability(nextSlots);
      setUser(saved);
    } catch {
      setSlots(slots);
      setSlotsError("Couldn't save — try again.");
    }
  }

  function openAddSlot() {
    setAddError("");
    setAddOpen(true);
  }

  async function handleAddSlot() {
    if (toMinutes(newStart) >= toMinutes(newEnd)) {
      setAddError("End time must be after start time");
      return;
    }
    if (
      slots.some(
        (s) => s.day === newDay && s.start === newStart && s.end === newEnd,
      )
    ) {
      setAddError("You already have this slot");
      return;
    }
    setAddError("");
    setAdding(true);
    const nextSlots = [
      ...slots,
      { day: newDay, start: newStart, end: newEnd, booked: false },
    ].sort(
      (a, b) =>
        DAYS.indexOf(a.day) - DAYS.indexOf(b.day) ||
        toMinutes(a.start) - toMinutes(b.start),
    );
    try {
      const { user: saved } = await profileApi.updateAvailability(nextSlots);
      setUser(saved);
      setAddOpen(false);
    } catch {
      setAddError("Couldn't save — try again.");
    } finally {
      setAdding(false);
    }
  }

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/faculty");
      return;
    }
    // Dashboard is faculty-only; parents go straight to search
    if (user.role === "parent") {
      router.replace("/search");
      return;
    }
    if (!user.profileCompleted) router.replace("/profiling");
  }, [loading, user, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[1400px] px-4 py-12 sm:py-20 text-center text-muted">
          Loading…
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-md px-4 py-12 sm:py-20 text-center">
          <h1 className="text-2xl font-bold">Faculty dashboard</h1>
          <p className="mt-2 text-muted">
            Sign in with your email OTP to manage your profile and slots.
          </p>
          <Link href="/faculty">
            <Button className="mt-6">Faculty login</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const name = user.profile?.name || "Faculty";
  const firstName = name.split(" ")[0];
  const timeFormat = user.profile?.timeFormat || "12h";
  const openCount = slots.filter((s) => !s.booked).length;
  const bookedCount = slots.length - openCount;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Credibility checklist — optional extras that make parents pick a tutor
  const p = user.profile;
  const hasSocials = Object.values(p?.socials ?? {}).some(Boolean);
  const strengthItems = [
    {
      label: "Detailed bio (100+ characters)",
      done: (p?.bio?.length ?? 0) >= 100,
      hint: "Say who you teach, how, and what results to expect.",
      href: "/profiling?step=review",
    },
    {
      label: "Workplace / institution",
      done: Boolean(p?.workplace),
      hint: "Where you currently teach or work.",
      href: "/profiling?step=links",
    },
    {
      label: "Certifications",
      done: (p?.certifications?.length ?? 0) > 0,
      hint: "CTET, B.Ed, degrees — anything parents can verify.",
      href: "/profiling?step=links",
    },
    {
      label: "Achievements & results",
      done: (p?.achievements?.length ?? 0) > 0,
      hint: "e.g. \u201C12 students scored 95%+ in boards\u201D.",
      href: "/profiling?step=links",
    },
    {
      label: "Intro video",
      done: Boolean(p?.introVideo),
      hint: "A 1–2 min clip of you teaching builds instant trust.",
      href: "/profiling?step=links",
    },
    {
      label: "Social / web links",
      done: hasSocials,
      hint: "LinkedIn, YouTube or a website parents can look up.",
      href: "/profiling?step=links",
    },
    {
      label: "Hourly rate shown",
      done: p?.hourlyRate != null,
      hint: "Listings with a rate get fewer dead-end chats.",
      href: "/profiling?step=teaching",
    },
    {
      label: "3+ weekly slots",
      done: slots.length >= 3,
      hint: "More open windows means more parents reach out.",
      href: null, // handled by the Add-slot modal right here
    },
  ];
  const strengthDone = strengthItems.filter((i) => i.done).length;
  const strengthPct = Math.round((strengthDone / strengthItems.length) * 100);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          {/* ------------------------------ header ------------------------------ */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-coral">Dashboard</p>
              <h1 className="mt-0.5 text-[26px] font-bold tracking-tight sm:text-3xl">
                {greeting}, {firstName}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <span className="inline-flex items-center gap-1 rounded-md bg-sage-wash px-1.5 py-0.5 text-xs font-semibold text-sage">
                  <BadgeCheck className="h-3 w-3" />
                  Live
                </span>
                {user.profile?.designation} · {user.profile?.area}
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <NotificationsBell data={views} requests={requests} />
              <Link href="/profiling">
                <Button variant="secondary" size="sm">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit profile
                </Button>
              </Link>
              <Link href={`/teachers/${user.id}`} className="hidden sm:block">
                <Button variant="secondary" size="sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View listing
                </Button>
              </Link>
            </div>
          </div>

          {/* ------------------------------ stats ------------------------------- */}
          <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <WhoViewedCard data={views} loading={viewsLoading} />

            <StatCard
              label="Parents reached"
              value={viewsLoading ? null : (views?.totalViewers ?? 0)}
              icon={UsersRound}
              tone="bg-lavender text-ink"
              footer={
                (views?.totalViewers ?? 0) > 0
                  ? "unique parents, all time"
                  : "grows as parents open your listing"
              }
            />

            <StatCard
              label="Open slots"
              value={openCount}
              icon={CalendarDays}
              tone="bg-sage-wash text-sage"
              footer={
                slots.length > 0 ? (
                  <span className="flex w-full items-center gap-2">
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-cream-band">
                      <span
                        className="block h-full rounded-full bg-sage"
                        style={{
                          width: `${Math.round((openCount / slots.length) * 100)}%`,
                        }}
                      />
                    </span>
                    <span className="shrink-0 text-xs text-muted tabular-nums">
                      of {slots.length} weekly
                    </span>
                  </span>
                ) : (
                  "add availability to get contacted"
                )
              }
            />

            <StatCard
              label="Booked slots"
              value={bookedCount}
              icon={CalendarCheck}
              tone="bg-butter/70 text-ink"
              footer={
                bookedCount > 0
                  ? `${Math.round((bookedCount / slots.length) * 100)}% of your week is filled`
                  : "mark a slot booked after a WhatsApp confirmation"
              }
            />
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-8">
          <ConnectionRequestsSection
            requests={requests}
            loading={requestsLoading}
            onUpdated={(updated) =>
              setRequests((prev) =>
                prev.map((r) => (r.id === updated.id ? updated : r)),
              )
            }
          />

          <PitchesSection />

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your slots</h2>
              <Button variant="secondary" size="sm" onClick={openAddSlot}>
                <Plus className="h-4 w-4" />
                Add slot
              </Button>
            </div>
            {slotsError && (
              <p className="mt-3 text-sm font-medium text-coral-dark">
                {slotsError}
              </p>
            )}
            {slots.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-hairline bg-white px-5 py-8 text-center">
                <p className="text-sm text-muted">
                  No weekly slots yet — add your availability so parents know
                  when to reach you.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={openAddSlot}
                >
                  <Plus className="h-4 w-4" />
                  Add availability
                </Button>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-hairline overflow-hidden rounded-lg border border-hairline bg-white">
                {slots.map((slot, i) => {
                  const available = !slot.booked;
                  return (
                    <li
                      key={`${slot.day}-${slot.start}-${slot.end}`}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <span className="font-medium text-ink">
                        {slotLabel(slot, timeFormat)}
                        <span
                          className={cn(
                            "ml-2.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
                            available
                              ? "bg-sage-wash text-sage"
                              : "bg-cream-band text-muted",
                          )}
                        >
                          {available ? "Open" : "Booked"}
                        </span>
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={available}
                        onClick={() => toggleSlot(i)}
                        className={cn(
                          "relative h-8 w-14 rounded-full transition-colors duration-150",
                          available ? "bg-sage" : "bg-cream-band",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-150",
                            available ? "left-7" : "left-1",
                          )}
                        />
                        <span className="sr-only">
                          {available ? "Available" : "Booked"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 text-sm text-muted">
              When a parent books through WhatsApp, mark the slot booked so it
              won&apos;t show as open. Changes save automatically and update
              your public listing.
            </p>

            {/* --------------------------- recent activity --------------------------- */}
            <div className="mt-7">
              <h2 className="text-xl font-semibold">Recent activity</h2>
              {viewsLoading ? (
                <div className="mt-4 rounded-lg border border-hairline bg-white px-5 py-8 text-center text-sm text-muted">
                  Loading…
                </div>
              ) : (views?.views?.length ?? 0) === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-hairline bg-white px-5 py-8 text-center">
                  <Eye className="mx-auto h-5 w-5 text-muted" />
                  <p className="mt-2 text-sm font-medium text-ink">
                    No visits yet
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    When a parent opens your listing, you&apos;ll see them
                    here. Share your link to get the first ones in.
                  </p>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-hairline overflow-hidden rounded-lg border border-hairline bg-white">
                  {views!.views.slice(0, 6).map((v) => (
                    <li
                      key={`${v.id}-${v.lastViewedAt}`}
                      className="flex items-center gap-3.5 px-5 py-3.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lavender text-sm font-bold text-ink">
                        {v.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          <span className="font-semibold">{v.name}</span>{" "}
                          viewed your profile
                          {v.count > 1 ? ` ${v.count} times` : ""}
                        </p>
                        <p className="text-xs text-muted">
                          {v.area ? `${v.area} · ` : ""}
                          {timeAgo(String(v.lastViewedAt))}
                        </p>
                      </div>
                      <Eye className="h-4 w-4 shrink-0 text-muted" />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* --------------------------- share listing --------------------------- */}
            <div className="mt-7 rounded-lg border border-hairline bg-lavender/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-ink">
                    Share your listing
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Parents you already know are your best first reviews — send
                    them your Mentr page.
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={copyListingLink}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline bg-white px-3.5 text-[13px] font-semibold text-ink transition hover:bg-cream"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-sage" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy link"}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `I'm on Mentr — you can see my subjects and free slots here: ${absoluteUrl(`/teachers/${user.id}`)}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-sage px-3.5 text-[13px] font-semibold text-white transition hover:opacity-90"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
          </div>

          {/* --------------------------- right column --------------------------- */}
          <div className="space-y-5">
            <section className="rounded-lg border border-hairline bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                  <ShieldCheck className="h-4 w-4 text-sage" />
                  Profile strength
                </h2>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-bold",
                    strengthPct >= 75
                      ? "bg-sage-wash text-sage"
                      : strengthPct >= 40
                        ? "bg-butter/70 text-ink"
                        : "bg-coral-wash text-coral-dark",
                  )}
                >
                  {strengthPct}%
                </span>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream-band">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    strengthPct >= 75 ? "bg-sage" : "bg-coral",
                  )}
                  style={{ width: `${strengthPct}%` }}
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {strengthPct === 100
                  ? "Complete — your listing has everything parents look for."
                  : "Stronger profiles show up better and get contacted more. All of these are optional but worth it."}
              </p>

              <ul className="mt-4 space-y-1">
                {strengthItems.map((item) => {
                  const inner = (
                    <>
                      <span
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          item.done
                            ? "bg-sage text-white"
                            : "border border-hairline bg-white",
                        )}
                      >
                        {item.done && <Check className="h-2.5 w-2.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-[13px] font-medium leading-tight",
                            item.done ? "text-muted line-through" : "text-ink",
                          )}
                        >
                          {item.label}
                        </span>
                        {!item.done && (
                          <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                            {item.hint}
                          </span>
                        )}
                      </span>
                      {!item.done && (
                        <span className="mt-0.5 rounded bg-cream px-1.5 py-0.5 text-[10px] font-bold text-coral-dark">
                          ADD
                        </span>
                      )}
                    </>
                  );
                  const itemCls =
                    "flex w-full items-start gap-2.5 rounded-md px-1.5 py-1.5 text-left transition";
                  if (item.done) {
                    return (
                      <li key={item.label} className={itemCls}>
                        {inner}
                      </li>
                    );
                  }
                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className={cn(itemCls, "hover:bg-cream")}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={openAddSlot}
                          className={cn(itemCls, "hover:bg-cream")}
                        >
                          {inner}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>

              {strengthPct < 100 && (
                <Link
                  href="/profiling?step=links"
                  className="mt-4 flex h-9 items-center justify-center rounded-md bg-ink text-[13px] font-semibold text-white transition hover:bg-ink/85"
                >
                  Add missing details
                </Link>
              )}
            </section>

            <section className="rounded-lg border border-hairline bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-ink">Your profile</h2>
                <Link
                  href="/profiling"
                  className="text-xs font-semibold text-coral hover:underline"
                >
                  Edit
                </Link>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-base font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{name}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>

              <dl className="mt-4 space-y-2.5 border-t border-hairline pt-4 text-sm">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-muted" />
                  <dd className="font-medium text-ink">
                    {user.profile?.phoneNumber || "—"}
                  </dd>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted" />
                  <dd className="truncate font-medium text-ink">
                    {[user.profile?.area, user.profile?.city]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </dd>
                </div>
              </dl>

              {(user.profile?.subjects?.length ?? 0) > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {user.profile!.subjects!.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-cream px-2 py-1 text-xs font-medium text-ink"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-3.5 text-xs leading-relaxed text-muted">
                {user.profile?.experienceYears != null
                  ? `${user.profile.experienceYears} yrs experience`
                  : ""}
                {user.profile?.qualification
                  ? ` · ${user.profile.qualification}`
                  : ""}
              </p>
            </section>

            <section className="rounded-lg border border-dashed border-hairline bg-coral-wash/40 p-5">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 shrink-0 text-coral" />
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Be found first — feature your profile
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Coming soon. Phase 1 is free for everyone — this upgrade
                    slot is designed in for later.
                  </p>
                </div>
              </div>
            </section>
          </div>
          </div>
        </div>
      </main>
      <Footer />

      {addOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-slot-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close dialog"
            onClick={() => setAddOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-hairline bg-white p-5 shadow-xl sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 id="add-slot-title" className="text-lg font-bold text-ink">
                  Add a weekly slot
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Saves instantly and shows on your public listing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-cream"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {addError && (
              <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
                {addError}
              </p>
            )}

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                  Day
                </span>
                <select
                  value={newDay}
                  onChange={(e) =>
                    setNewDay(e.target.value as AvailabilitySlot["day"])
                  }
                  className="h-11 w-full appearance-none rounded-md border border-hairline bg-white px-3 text-[15px] text-ink outline-none transition focus:border-ink/40"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {DAY_LABEL[d]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                    From
                  </span>
                  <select
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="h-11 w-full appearance-none rounded-md border border-hairline bg-white px-3 text-[15px] text-ink outline-none transition focus:border-ink/40"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t, timeFormat)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                    To
                  </span>
                  <select
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="h-11 w-full appearance-none rounded-md border border-hairline bg-white px-3 text-[15px] text-ink outline-none transition focus:border-ink/40"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t, timeFormat)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                disabled={adding}
                className="flex h-11 flex-1 items-center justify-center rounded-md border border-hairline bg-white text-sm font-semibold text-ink transition hover:bg-cream disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSlot}
                disabled={adding}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-coral text-sm font-semibold text-white transition hover:bg-coral-dark disabled:opacity-60"
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {adding ? "Saving…" : "Add slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
