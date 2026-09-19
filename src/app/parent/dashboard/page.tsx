"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { timeAgo } from "@/components/dashboard/widgets";
import { ParentRequirementsSection } from "@/components/requirements/parent-requirements";
import { InstantConnectParentSection } from "@/components/instant-connect/instant-connect-parent-section";
import { PitchMessageDialog } from "@/components/requirements/pitch-message-dialog";
import { HiringChecklist } from "@/components/parent/hiring-checklist";
import { InfoTip } from "@/components/dashboard/info-tip";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { MentorPhoto } from "@/components/ui/mentor-photo";
import {
  connectionsApi,
  type ParentConnection,
} from "@/lib/api";
import { whatsappLink } from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Clock3,
  ClipboardList,
  Inbox,
  MessageCircle,
  Search,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STATUS_META: Record<
  ParentConnection["status"],
  { label: string; cls: string }
> = {
  pending: { label: "Waiting", cls: "bg-butter/70 text-ink" },
  accepted: { label: "Connected", cls: "bg-sage-wash text-sage" },
  declined: { label: "Declined", cls: "bg-cream-band text-muted" },
};

type HistoryTab = "all" | "accepted" | "pending" | "declined";
type DashTab = "connections" | "instant" | "posts";

const HISTORY_TABS: { id: HistoryTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "accepted", label: "Connected" },
  { id: "pending", label: "Waiting" },
  { id: "declined", label: "Declined" },
];

export default function ParentDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [connections, setConnections] = useState<ParentConnection[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [historyTab, setHistoryTab] = useState<HistoryTab>("all");
  const [dashTab, setDashTab] = useState<DashTab>("connections");
  const [viewMessage, setViewMessage] = useState<ParentConnection | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  async function respondToTeacher(
    connection: ParentConnection,
    action: "accept" | "decline",
  ) {
    setRespondingId(connection.id);
    try {
      await connectionsApi.respondAsParent(connection.id, action);
      reloadConnections();
    } catch {
      // keep UI unchanged on failure
    } finally {
      setRespondingId(null);
    }
  }

  function teacherRequestLabel(c: ParentConnection): string {
    if (c.source === "board") return "Answered your post";
    if (c.source === "profile") return "Reached out to you";
    return "Sent you a request";
  }

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
        <main className="mx-auto max-w-[1400px] px-4 py-12 sm:py-20 text-center text-muted">
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

  const waitingCount = pending.length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
                {firstName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Hi, {firstName}
                </h1>
                <p className="text-xs text-muted sm:text-[13px]">
                  {connectionsLoading
                    ? "Loading your connections…"
                    : accepted.length > 0
                      ? `${accepted.length} connected · chat on WhatsApp anytime`
                      : "Find a tutor, send a request, chat after they accept"}
                </p>
              </div>
            </div>
            <Link href="/search" className="shrink-0">
              <Button size="sm" className="h-10 gap-1.5 px-4 text-[13px] font-bold">
                <Search className="h-3.5 w-3.5" />
                Find a mentor
              </Button>
            </Link>
          </div>

          {/* Compact stats */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {(
              [
                { label: "Connected", value: accepted.length, tone: "text-sage" },
                { label: "Waiting", value: pending.length, tone: "text-ink" },
                { label: "Total sent", value: connections.length, tone: "text-ink" },
              ] as const
            ).map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-hairline bg-white px-3 py-3 text-center sm:px-4"
              >
                {connectionsLoading ? (
                  <span className="mx-auto block h-6 w-8 animate-pulse rounded bg-cream-band" />
                ) : (
                  <p className={cn("text-xl font-extrabold tabular-nums", s.tone)}>
                    {s.value}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] font-semibold text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="min-w-0">
              {/* Tabs */}
              <div
                role="tablist"
                aria-label="Parent dashboard"
                className="flex gap-1 rounded-xl border border-hairline bg-white p-1"
              >
                {(
                  [
                    {
                      id: "connections" as const,
                      label: "Connections",
                      Icon: Users,
                      count: waitingCount || undefined,
                    },
                    {
                      id: "instant" as const,
                      label: "Instant connect",
                      Icon: Zap,
                      count: undefined,
                    },
                    {
                      id: "posts" as const,
                      label: "My posts",
                      Icon: ClipboardList,
                      count: undefined,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={dashTab === tab.id}
                    onClick={() => setDashTab(tab.id)}
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[12px] font-bold transition sm:text-[13px]",
                      dashTab === tab.id
                        ? "bg-ink text-white shadow-sm"
                        : "text-muted hover:bg-cream hover:text-ink",
                    )}
                  >
                    <tab.Icon className="h-3.5 w-3.5 shrink-0 opacity-90" />
                    <span className="truncate">{tab.label}</span>
                    {tab.count ? (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold tabular-nums",
                          dashTab === tab.id
                            ? "bg-coral text-white"
                            : "bg-coral-wash text-coral-dark",
                        )}
                      >
                        {tab.count}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {dashTab === "connections" ? (
                  <section>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="flex items-center gap-1.5 text-lg font-semibold text-ink">
                        Your tutors
                        <InfoTip title="How connections work">
                          <p>
                            Send a request from a tutor&apos;s profile. When they
                            accept, you unlock WhatsApp chat with them.
                          </p>
                          <p>
                            If a tutor answers your board post, you can accept or
                            decline here.
                          </p>
                        </InfoTip>
                      </h2>
                      {connections.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {HISTORY_TABS.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setHistoryTab(t.id)}
                              className={cn(
                                "inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold transition",
                                historyTab === t.id
                                  ? "bg-ink text-white"
                                  : "bg-white text-muted ring-1 ring-inset ring-hairline hover:text-ink",
                              )}
                            >
                              {t.label}
                              <span className="tabular-nums opacity-70">
                                {tabCounts[t.id]}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {connectionsLoading ? (
                      <p className="mt-4 text-sm text-muted">Loading…</p>
                    ) : connections.length === 0 ? (
                      <div className="mt-4 rounded-xl border border-dashed border-hairline bg-white px-4 py-10 text-center">
                        <Inbox className="mx-auto h-5 w-5 text-muted" />
                        <p className="mt-2 text-sm font-semibold text-ink">
                          No connections yet
                        </p>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                          Browse tutors and send a connect request — WhatsApp
                          unlocks when they accept.
                        </p>
                        <Link href="/search">
                          <Button variant="secondary" size="sm" className="mt-4">
                            <Search className="h-3.5 w-3.5" />
                            Browse tutors
                          </Button>
                        </Link>
                      </div>
                    ) : historyList.length === 0 ? (
                      <p className="mt-4 rounded-xl border border-dashed border-hairline bg-white px-4 py-8 text-center text-sm text-muted">
                        Nothing in this filter yet.
                      </p>
                    ) : (
                      <ul className="mt-4 space-y-2.5">
                        {historyList.map((c) => (
                          <ConnectionCard
                            key={c.id}
                            c={c}
                            respondingId={respondingId}
                            teacherRequestLabel={teacherRequestLabel}
                            onViewMessage={() => setViewMessage(c)}
                            onAccept={() => respondToTeacher(c, "accept")}
                            onDecline={() => respondToTeacher(c, "decline")}
                          />
                        ))}
                      </ul>
                    )}
                  </section>
                ) : null}

                {dashTab === "instant" ? (
                  <InstantConnectParentSection />
                ) : null}

                {dashTab === "posts" ? (
                  <div id="requirements">
                    <ParentRequirementsSection
                      onConnectionsChanged={reloadConnections}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="lg:sticky lg:top-20">
              <HiringChecklist />
            </aside>
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
                  ? teacherRequestLabel(viewMessage)
                  : "Your request",
                viewMessage.sentAt
                  ? `sent ${timeAgo(viewMessage.sentAt)}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")
            : undefined
        }
      />
    </>
  );
}

function ConnectionCard({
  c,
  respondingId,
  teacherRequestLabel,
  onViewMessage,
  onAccept,
  onDecline,
}: {
  c: ParentConnection;
  respondingId: string | null;
  teacherRequestLabel: (c: ParentConnection) => string;
  onViewMessage: () => void;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <li className="rounded-xl border border-hairline bg-white p-3.5 sm:p-4">
      <div className="flex items-start gap-3">
        {c.teacherName === "Deleted user" ? (
          <span className="shrink-0">
            <MentorPhoto
              name="Deleted user"
              imageUrl={null}
              size="sm"
              rounded="full"
            />
          </span>
        ) : (
          <Link href={`/teachers/${c.teacherId}`} className="shrink-0">
            <MentorPhoto
              name={c.teacherName}
              imageUrl={c.teacherImageUrl}
              size="sm"
              rounded="full"
            />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {c.teacherName === "Deleted user" ? (
              <span className="text-sm font-bold text-muted">Deleted user</span>
            ) : (
              <Link
                href={`/teachers/${c.teacherId}`}
                className="text-sm font-bold text-ink hover:text-coral"
              >
                {c.teacherName}
              </Link>
            )}
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                STATUS_META[c.status].cls,
              )}
            >
              {STATUS_META[c.status].label}
            </span>
            {c.requestedBy === "teacher" ? (
              <span className="text-[10px] font-semibold text-muted">
                {teacherRequestLabel(c)}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[11px] text-muted">
            {c.teacherArea ? `${c.teacherArea} · ` : ""}
            {timeAgo(c.sentAt)}
          </p>
          <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-ink/80">
            {c.message}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onViewMessage}
          className="inline-flex h-8 items-center rounded-md border border-hairline bg-white px-3 text-[12px] font-semibold text-ink hover:bg-cream"
        >
          Message
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
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-sage px-3 text-[12px] font-semibold text-white hover:opacity-90"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        ) : null}
        {c.status === "pending" && c.requestedBy === "teacher" ? (
          <>
            <button
              type="button"
              disabled={respondingId === c.id}
              onClick={onAccept}
              className="inline-flex h-8 items-center gap-1 rounded-md bg-sage px-3 text-[12px] font-semibold text-white disabled:opacity-50"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              Accept
            </button>
            <button
              type="button"
              disabled={respondingId === c.id}
              onClick={onDecline}
              className="inline-flex h-8 items-center rounded-md border border-hairline px-3 text-[12px] font-semibold text-ink disabled:opacity-50"
            >
              Decline
            </button>
          </>
        ) : null}
        {c.status === "pending" && c.requestedBy !== "teacher" ? (
          <span className="inline-flex h-8 items-center gap-1 rounded-md bg-cream px-3 text-[12px] font-semibold text-muted">
            <Clock3 className="h-3.5 w-3.5" />
            Awaiting tutor
          </span>
        ) : null}
        <Link
          href={`/teachers/${c.teacherId}`}
          className="inline-flex h-8 items-center rounded-md border border-hairline px-3 text-[12px] font-semibold text-ink hover:bg-cream"
        >
          Profile
        </Link>
      </div>
    </li>
  );
}
