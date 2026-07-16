"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { timeAgo } from "@/components/dashboard/widgets";
import { ParentRequirementsSection } from "@/components/requirements/parent-requirements";
import { PitchMessageDialog } from "@/components/requirements/pitch-message-dialog";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { connectionsApi, type ParentConnection } from "@/lib/api";
import { whatsappLink } from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Clock3,
  Inbox,
  MessageCircle,
  Search,
  Send,
  UserCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STATUS_META: Record<
  ParentConnection["status"],
  { label: string; cls: string }
> = {
  pending: { label: "Waiting for tutor", cls: "bg-butter/70 text-ink" },
  accepted: { label: "Connected", cls: "bg-sage-wash text-sage" },
  declined: { label: "Declined", cls: "bg-cream-band text-muted" },
};

const AVATAR_TONES = [
  "bg-sage text-white",
  "bg-coral text-white",
  "bg-lavender-deep text-ink",
  "bg-butter-deep text-ink",
  "bg-sky text-ink",
];

type HistoryTab = "all" | "accepted" | "pending" | "declined";

const HISTORY_TABS: { id: HistoryTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "accepted", label: "Connected" },
  { id: "pending", label: "Waiting" },
  { id: "declined", label: "Declined" },
];

function ParentDashboardHero({
  firstName,
  connectionsLoading,
  connected,
  waiting,
  sent,
}: {
  firstName: string;
  connectionsLoading: boolean;
  connected: number;
  waiting: number;
  sent: number;
}) {
  const stats = [
    { label: "Connected", value: connected, icon: UserCheck, tone: "text-sage" },
    { label: "Waiting", value: waiting, icon: Clock3, tone: "text-ink" },
    { label: "Sent", value: sent, icon: Send, tone: "text-ink" },
  ] as const;

  return (
    <section className="overflow-hidden rounded-xl border border-hairline bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
            {firstName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-ink sm:text-lg">
              Hi, {firstName}
            </h1>
            <p className="truncate text-xs text-muted sm:text-[13px]">
              My connections · tutors share WhatsApp once they accept
            </p>
          </div>
        </div>
        <Link href="/search" className="shrink-0">
          <Button size="sm" className="h-9 gap-1.5 px-3.5 text-xs font-bold">
            <Search className="h-3.5 w-3.5" />
            Find a mentor
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 divide-x divide-hairline border-t border-hairline">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-2.5 px-3 py-3 sm:gap-3 sm:px-4"
          >
            <stat.icon className={cn("h-3.5 w-3.5 shrink-0 opacity-70", stat.tone)} />
            <div className="min-w-0">
              {connectionsLoading ? (
                <span className="block h-6 w-8 animate-pulse rounded bg-cream-band" />
              ) : (
                <p className="text-lg font-bold leading-none tabular-nums text-ink sm:text-xl">
                  {stat.value}
                </p>
              )}
              <p className="mt-0.5 truncate text-[11px] font-medium text-muted">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ParentDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [connections, setConnections] = useState<ParentConnection[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [historyTab, setHistoryTab] = useState<HistoryTab>("all");
  const [viewMessage, setViewMessage] = useState<ParentConnection | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/parent");
      return;
    }
    if (user.role !== "parent") {
      router.replace("/dashboard");
      return;
    }
    if (!user.profileCompleted) router.replace("/parent/profiling");
  }, [loading, user, router]);

  const reloadConnections = useCallback(() => {
    connectionsApi
      .mine()
      .then((data) => setConnections(data.connections))
      .catch(() => {})
      .finally(() => setConnectionsLoading(false));
  }, []);

  useEffect(() => {
    if (!user || user.role !== "parent") return;
    reloadConnections();
  }, [user, reloadConnections]);

  if (loading || !user || user.role !== "parent") {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-[1400px] px-4 py-20 text-center text-muted">
          Loading…
        </main>
      </>
    );
  }

  const name = user.parentProfile?.name || "there";
  const firstName = name.split(" ")[0];
  const accepted = connections.filter((c) => c.status === "accepted");
  const pending = connections.filter((c) => c.status === "pending");
  const declined = connections.filter((c) => c.status === "declined");
  const updates = connections
    .filter((c) => c.respondedAt)
    .sort(
      (a, b) =>
        new Date(b.respondedAt!).getTime() - new Date(a.respondedAt!).getTime(),
    )
    .slice(0, 5);

  const tabCounts: Record<HistoryTab, number> = {
    all: connections.length,
    accepted: accepted.length,
    pending: pending.length,
    declined: declined.length,
  };
  const historyList =
    historyTab === "all"
      ? connections
      : connections.filter((c) => c.status === historyTab);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <ParentDashboardHero
            firstName={firstName}
            connectionsLoading={connectionsLoading}
            connected={accepted.length}
            waiting={pending.length}
            sent={connections.length}
          />

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)] lg:items-start">
            <div className="space-y-8">
              {/* ------------------------- requirements ------------------------- */}
              <ParentRequirementsSection
                onConnectionsChanged={reloadConnections}
              />
            </div>

            {/* --------------------------- right column --------------------------- */}
            <div className="space-y-4">
              {/* -------------------------- connections ------------------------- */}
              <section>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Connection history</h2>
                  {connections.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {HISTORY_TABS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setHistoryTab(t.id)}
                          className={cn(
                            "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition",
                            historyTab === t.id
                              ? "bg-ink text-white"
                              : "bg-white text-muted ring-1 ring-inset ring-hairline hover:text-ink",
                          )}
                        >
                          {t.label}
                          <span
                            className={cn(
                              "rounded-full px-1.5 text-[10px] tabular-nums",
                              historyTab === t.id
                                ? "bg-white/20 text-white"
                                : "bg-cream-band text-muted",
                            )}
                          >
                            {tabCounts[t.id]}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {connectionsLoading ? (
                  <ul className="mt-4 space-y-3">
                    {[0, 1].map((i) => (
                      <li
                        key={i}
                        className="animate-pulse rounded-xl border border-hairline bg-white p-5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-10 w-10 rounded-full bg-cream-band" />
                          <div className="flex-1">
                            <div className="h-3.5 w-1/3 rounded bg-cream-band" />
                            <div className="mt-2 h-3 w-1/4 rounded bg-cream-band" />
                          </div>
                        </div>
                        <div className="mt-4 h-3 w-2/3 rounded bg-cream-band" />
                      </li>
                    ))}
                  </ul>
                ) : connections.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-hairline bg-white px-5 py-12 text-center">
                    <Inbox className="mx-auto h-6 w-6 text-muted" />
                    <p className="mt-3 text-sm font-semibold text-ink">
                      No requests yet
                    </p>
                    <p className="mx-auto mt-1 max-w-[320px] text-sm text-muted">
                      Find a tutor you like and send them a connect request —
                      their number unlocks once they accept.
                    </p>
                    <Link href="/search">
                      <Button variant="secondary" size="sm" className="mt-4">
                        <Search className="h-3.5 w-3.5" />
                        Browse tutors
                      </Button>
                    </Link>
                  </div>
                ) : historyList.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-hairline bg-white px-5 py-10 text-center text-sm text-muted">
                    Nothing under &ldquo;
                    {HISTORY_TABS.find((t) => t.id === historyTab)?.label}
                    &rdquo; yet.
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {historyList.map((c, idx) => (
                      <li
                        key={c.id}
                        className="rounded-xl border border-hairline bg-white p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)] transition hover:border-ink/20 sm:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                              AVATAR_TONES[idx % AVATAR_TONES.length],
                            )}
                          >
                            {c.teacherName.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <Link
                                href={`/teachers/${c.teacherId}`}
                                className="text-[15px] font-bold text-ink hover:text-coral"
                              >
                                {c.teacherName}
                              </Link>
                              <span
                                className={cn(
                                  "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                                  STATUS_META[c.status].cls,
                                )}
                              >
                                {STATUS_META[c.status].label}
                              </span>
                              {c.requestedBy === "teacher" && (
                                <span className="rounded-md bg-lavender px-2 py-0.5 text-[11px] font-semibold text-ink">
                                  Answered your post
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-muted">
                              {c.teacherArea ? `${c.teacherArea} · ` : ""}
                              sent {timeAgo(c.sentAt)}
                              {c.respondedAt
                                ? ` · replied ${timeAgo(c.respondedAt)}`
                                : ""}
                            </p>
                            <p className="mt-2 line-clamp-2 rounded-lg bg-cream px-3 py-2 text-[13px] leading-relaxed text-ink/80">
                              {c.message}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 sm:justify-end">
                          <button
                            type="button"
                            onClick={() => setViewMessage(c)}
                            className="inline-flex h-9 items-center rounded-md border border-hairline bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-cream"
                          >
                            View message
                          </button>
                          {c.status === "accepted" && c.phone ? (
                            <a
                              href={whatsappLink({
                                name: c.teacherName,
                                subjectLine: "classes",
                                phone: c.phone,
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-sage px-4 text-[13px] font-semibold text-white transition hover:opacity-90"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              Chat on WhatsApp
                            </a>
                          ) : c.status === "pending" ? (
                            <span className="inline-flex h-9 items-center gap-1.5 rounded-md bg-cream px-4 text-[13px] font-semibold text-muted">
                              <Clock3 className="h-3.5 w-3.5" />
                              Awaiting response
                            </span>
                          ) : (
                            <Link
                              href={`/teachers/${c.teacherId}`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-cream"
                            >
                              Request again
                            </Link>
                          )}
                          <Link
                            href={`/teachers/${c.teacherId}`}
                            className="inline-flex h-9 items-center rounded-md border border-hairline bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-cream"
                          >
                            View profile
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="overflow-hidden rounded-xl border border-hairline bg-white">
                <div className="border-b border-hairline bg-cream/60 px-5 py-3">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                    Updates
                  </h2>
                </div>
                <div className="p-4">
                  {updates.length === 0 ? (
                    <p className="px-1 py-2 text-sm leading-relaxed text-muted">
                      When a tutor accepts or declines your request, you&apos;ll
                      see it here.
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {updates.map((c) => (
                        <li
                          key={`update-${c.id}`}
                          className="flex items-start gap-2.5 rounded-md px-1.5 py-2 transition hover:bg-cream/60"
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                              c.status === "accepted"
                                ? "bg-sage-wash text-sage"
                                : "bg-cream-band text-muted",
                            )}
                          >
                            {c.status === "accepted" ? (
                              <BadgeCheck className="h-3.5 w-3.5" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium leading-snug text-ink">
                              {c.status === "accepted"
                                ? `${c.teacherName} accepted — you can now view their number`
                                : `${c.teacherName} declined your request`}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted">
                              {c.respondedAt ? timeAgo(c.respondedAt) : ""}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <PitchMessageDialog
        open={viewMessage !== null}
        onClose={() => setViewMessage(null)}
        teacherName={viewMessage?.teacherName ?? ""}
        message={viewMessage?.message ?? ""}
        subtitle={
          viewMessage
            ? [
                viewMessage.teacherArea,
                viewMessage.requestedBy === "teacher"
                  ? "Answered your post"
                  : "Your request",
                viewMessage.sentAt ? `sent ${timeAgo(viewMessage.sentAt)}` : null,
              ]
                .filter(Boolean)
                .join(" · ")
            : undefined
        }
      />
    </>
  );
}
