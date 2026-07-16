"use client";

import { requirementsApi, type TutorPitch } from "@/lib/api";
import { timeAgo } from "@/components/dashboard/widgets";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Megaphone,
  MessageCircle,
  Phone,
  Send,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 5;

const TIMELINE_LABELS: Record<string, string> = {
  immediately: "starts immediately",
  within_week: "starts within a week",
  within_month: "starts within a month",
  flexible: "flexible start",
};

const STATUS_META: Record<
  TutorPitch["status"],
  { label: string; cls: string; icon: typeof Clock3 }
> = {
  pending: {
    label: "Awaiting parent",
    cls: "bg-butter/70 text-ink",
    icon: Clock3,
  },
  accepted: {
    label: "Accepted",
    cls: "bg-sage-wash text-sage",
    icon: BadgeCheck,
  },
  declined: {
    label: "Declined",
    cls: "bg-cream-band text-muted",
    icon: XCircle,
  },
};

/**
 * The tutor's sent pitches from the requirements board, with a
 * sent → responded timeline per pitch.
 */
export function PitchesSection() {
  const [pitches, setPitches] = useState<TutorPitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    requirementsApi
      .pitches()
      .then((data) => {
        setPitches(data.pitches);
        setPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(pitches.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagePitches = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return pitches.slice(start, start + PAGE_SIZE);
  }, [pitches, safePage]);

  const rangeStart = pitches.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, pitches.length);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Your pitches</h2>
          <p className="mt-0.5 text-sm text-muted">
            Requirements you responded to on the board. Parents stay anonymous
            until they accept.
          </p>
        </div>
        <Link
          href="/board"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline bg-white px-4 text-[13px] font-semibold text-ink transition hover:bg-cream"
        >
          <Megaphone className="h-3.5 w-3.5 text-coral" />
          Open board
        </Link>
      </div>

      {loading ? (
        <div className="mt-4 rounded-lg border border-hairline bg-white px-5 py-8 text-center text-sm text-muted">
          Loading…
        </div>
      ) : pitches.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-hairline bg-white px-5 py-8 text-center">
          <Send className="mx-auto h-5 w-5 text-muted" />
          <p className="mt-2 text-sm font-medium text-ink">No pitches yet</p>
          <p className="mx-auto mt-1 max-w-[360px] text-sm text-muted">
            Parents post what they need on the requirements board — send a
            free pitch and connect with the ones that fit.
          </p>
          <Link
            href="/board"
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md bg-coral px-4 text-[13px] font-semibold text-white transition hover:bg-coral-dark"
          >
            Browse requirements
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {pagePitches.map((p) => (
              <PitchRow key={p.id} pitch={p} />
            ))}
          </ul>

          {pitches.length > PAGE_SIZE && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hairline bg-white px-4 py-3">
              <p className="text-[13px] text-muted">
                Showing{" "}
                <span className="font-semibold text-ink tabular-nums">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-ink tabular-nums">
                  {pitches.length}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-hairline bg-cream px-3 text-[12px] font-semibold text-ink transition hover:bg-cream-band disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </button>
                <span className="min-w-[4.5rem] text-center text-[12px] font-semibold tabular-nums text-muted">
                  {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-hairline bg-cream px-3 text-[12px] font-semibold text-ink transition hover:bg-cream-band disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function PitchRow({ pitch: p }: { pitch: TutorPitch }) {
  const meta = STATUS_META[p.status];
  const StatusIcon = meta.icon;
  const r = p.requirement;
  const title = r ? `${r.subject} · ${r.classLevel}` : "Requirement";
  const who =
    p.status === "accepted" && p.parentName
      ? p.parentName
      : `Parent in ${p.parentArea || r?.area || "your area"}`;

  return (
    <li className="rounded-lg border border-hairline bg-white p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral-wash text-sm font-bold text-coral-dark">
            {(r?.subject || "R").charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-ink">{title}</p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                  meta.cls,
                )}
              >
                <StatusIcon className="h-3 w-3" />
                {meta.label}
              </span>
              {r && !r.open && p.status === "pending" && (
                <span className="rounded-md bg-cream-band px-2 py-0.5 text-[11px] font-semibold text-muted">
                  Post closed
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted">
              {who}
              {r ? ` · ${r.area}, ${r.city}` : ""}
              {r ? ` · ${TIMELINE_LABELS[r.startTimeline] ?? ""}` : ""}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-2.5 line-clamp-2 rounded-md bg-cream px-3 py-2 text-[13px] leading-relaxed text-ink/80">
        {p.message}
      </p>

      {/* sent → responded timeline */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-muted">
        <span className="inline-flex items-center gap-1">
          <Send className="h-3 w-3" />
          Pitch sent {timeAgo(p.sentAt)}
        </span>
        <span
          aria-hidden
          className={cn(
            "h-px w-6",
            p.respondedAt ? "bg-sage/50" : "bg-hairline",
          )}
        />
        {p.respondedAt ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-semibold",
              p.status === "accepted" ? "text-sage" : "text-muted",
            )}
          >
            {p.status === "accepted" ? (
              <Check className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {p.status === "accepted" ? "Accepted" : "Declined"}{" "}
            {timeAgo(p.respondedAt)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3" />
            Waiting for the parent to respond
          </span>
        )}
      </div>

      {p.status === "accepted" && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-sage/25 bg-sage-wash px-3 py-2.5">
          <p className="min-w-0 flex-1 text-[12px] font-medium leading-snug text-sage">
            Connected — you can now reach{" "}
            <span className="font-bold">{p.parentName || "this parent"}</span>{" "}
            directly.
          </p>
          {p.parentPhone && (
            <>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white px-3 text-xs font-bold tabular-nums text-ink">
                <Phone className="h-3.5 w-3.5 text-sage" />+{p.parentPhone}
              </span>
              <a
                href={`https://wa.me/${p.parentPhone}?text=${encodeURIComponent(
                  `Hi ${(p.parentName || "there").split(" ")[0]}, thanks for accepting my pitch on Mentr${
                    r ? ` for ${r.subject} (${r.classLevel})` : ""
                  } — when is a good time to talk?`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-sage px-3.5 text-xs font-bold text-white transition hover:opacity-90"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat on WhatsApp
              </a>
            </>
          )}
        </div>
      )}
    </li>
  );
}
