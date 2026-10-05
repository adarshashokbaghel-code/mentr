"use client";

import { timeAgo } from "@/components/dashboard/widgets";
import { formatDemoDate } from "@/components/demo/book-demo-button";
import {
  demoRequestsApi,
  guestRequirementsApi,
  type ConnectionRequest,
  type GuestRequirementLead,
  type TutorDemoRequest,
} from "@/lib/api";
import {
  formatIcBudget,
  instantConnectApi,
  type IcTutorRequest,
} from "@/lib/instant-connect";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Loader2, Mail, MessageCircle, Phone, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const SOURCE_TAG = {
  connect: {
    label: "Connect request",
    cls: "bg-coral-wash text-coral-dark",
  },
  instant: {
    label: "Instant Connect",
    cls: "bg-ic-blue-wash text-ic-blue",
  },
  reached: {
    label: "Parents reached",
    cls: "bg-lavender text-ink",
  },
  demo: {
    label: "Demo request",
    cls: "bg-ink text-white",
  },
} as const;

type Source = keyof typeof SOURCE_TAG;

type InboxRow = {
  key: string;
  source: Source;
  at: string;
  name: string;
  line: string;
  needsAction: boolean;
  connect?: ConnectionRequest;
  instant?: IcTutorRequest;
  reached?: GuestRequirementLead;
  demo?: TutorDemoRequest;
};

export function TutorInbox({
  onAttentionChange,
}: {
  onAttentionChange?: (count: number) => void;
}) {
  const [instant, setInstant] = useState<IcTutorRequest[]>([]);
  const [reached, setReached] = useState<GuestRequirementLead[]>([]);
  const [demos, setDemos] = useState<TutorDemoRequest[]>([]);
  const [popup, setPopup] = useState<TutorDemoRequest | null>(null);
  const [tutorNote, setTutorNote] = useState("");
  const [extraLoading, setExtraLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const reloadExtra = useCallback(() => {
    Promise.all([
      instantConnectApi.tutorMine().then((data) => data.requests),
      guestRequirementsApi.mine().then((data) => data.requirements),
      demoRequestsApi.inbox().then((data) => data.demos),
    ])
      .then(([ic, guests, demoRows]) => {
        setInstant(ic);
        setReached(guests);
        setDemos(demoRows);
      })
      .catch(() => setError("Could not load every inbox item."))
      .finally(() => setExtraLoading(false));
  }, []);

  useEffect(reloadExtra, [reloadExtra]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash === "#inbox" || hash === "#parents-reached" || hash === "#instant-connect") {
      document.getElementById("inbox")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [extraLoading]);

  const rows = useMemo(() => {
    const list: InboxRow[] = [
      ...instant.map((r) => ({
        key: `instant-${r.id}`,
        source: "instant" as const,
        at: r.createdAt,
        name: `${r.classLevel} · ${r.subject}`,
        line: [r.board, r.mode, r.location].filter(Boolean).join(" · "),
        needsAction: r.status === "active",
        instant: r,
      })),
      ...reached.map((r) => ({
        key: `reached-${r.id}`,
        source: "reached" as const,
        at: r.createdAt,
        name: r.name,
        line: r.requirement,
        needsAction: r.status === "new",
        reached: r,
      })),
      ...demos.map((r) => ({
        key: `demo-${r.id}`,
        source: "demo" as const,
        at: r.sentAt,
        name: r.parentName,
        line: `${r.subject} · ${formatDemoDate(r.preferredDate)} ${r.preferredTime}`,
        needsAction: r.status === "pending",
        demo: r,
      })),
    ];
    list.sort((a, b) => {
      if (a.needsAction !== b.needsAction) return a.needsAction ? -1 : 1;
      return new Date(b.at).getTime() - new Date(a.at).getTime();
    });
    return list;
  }, [instant, reached, demos]);

  const attention = rows.filter((r) => r.needsAction).length;

  useEffect(() => {
    onAttentionChange?.(attention);
  }, [attention, onAttentionChange]);

  async function respondReached(
    id: string,
    action: "not_interested" | "got_hired",
  ) {
    setBusyId(id);
    setError("");
    try {
      const { requirement } = await guestRequirementsApi.action(id, action);
      setReached((prev) =>
        prev.map((r) => (r.id === requirement.id ? requirement : r)),
      );
    } catch {
      setError("Could not save — try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function respondDemo(action: "accept" | "decline") {
    if (!popup) return;
    setBusyId(popup.id);
    setError("");
    try {
      const { demo } = await demoRequestsApi.respond(popup.id, action, tutorNote);
      setDemos((prev) => prev.map((r) => (r.id === demo.id ? demo : r)));
      setPopup(demo);
    } catch {
      setError("Could not update the demo — try again.");
    } finally {
      setBusyId(null);
    }
  }

  function openDemo(row: TutorDemoRequest) {
    setTutorNote(row.tutorNote || "");
    setPopup(row);
  }

  async function openReached(row: GuestRequirementLead) {
    const key = `reached-${row.id}`;
    const opening = openId !== key;
    setOpenId(opening ? key : null);
    if (!opening || row.status !== "new") return;
    try {
      const { requirement } = await guestRequirementsApi.action(row.id, "opened");
      setReached((prev) =>
        prev.map((r) => (r.id === requirement.id ? requirement : r)),
      );
    } catch {
      // Details still open if the activity write fails.
    }
  }

  const loading = extraLoading;

  return (
    <section id="inbox" className="scroll-mt-24">
      <p className="text-xs text-muted">
        Every parent who reached you. The tag shows how.
      </p>

      {error ? (
        <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
          {error}
        </p>
      ) : null}

      {loading ? (
        <ul className="mt-3 space-y-3">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="rounded-lg border border-hairline bg-white p-4"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-4 w-1/2" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </li>
          ))}
        </ul>
      ) : rows.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-hairline bg-white px-4 py-5 text-center text-sm text-muted">
          No parents yet. Demo bookings, demo requests, Instant Connect,
          and parents reached all show up here.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {rows.map((row) => (
            <InboxCard
              key={row.key}
              row={row}
              open={openId === row.key}
              busy={busyId === (row.connect?.id || row.reached?.id || row.instant?.id || row.demo?.id)}
              onToggle={() => {
                if (row.demo) {
                  openDemo(row.demo);
                  return;
                }
                if (row.reached) void openReached(row.reached);
                else setOpenId((current) => (current === row.key ? null : row.key));
              }}
              onConnect={() => {}}
              onReached={(action) => {
                if (row.reached) void respondReached(row.reached.id, action);
              }}
            />
          ))}
        </ul>
      )}

      {popup ? (
        <DemoPopup
          demo={popup}
          note={tutorNote}
          busy={busyId === popup.id}
          error={error}
          onNote={setTutorNote}
          onClose={() => setPopup(null)}
          onRespond={(action) => void respondDemo(action)}
        />
      ) : null}
    </section>
  );
}

function waPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function DemoPopup({
  demo,
  note,
  busy,
  error,
  onNote,
  onClose,
  onRespond,
}: {
  demo: TutorDemoRequest;
  note: string;
  busy: boolean;
  error: string;
  onNote: (value: string) => void;
  onClose: () => void;
  onRespond: (action: "accept" | "decline") => void;
}) {
  const place = demo.parentArea || demo.parentCity;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-popup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[min(92dvh,100%)] w-full max-w-md overflow-y-auto rounded-t-2xl border border-hairline bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Demo request · Online
            </p>
            <h2 id="demo-popup-title" className="text-lg font-bold text-ink">
              {demo.parentName}
            </h2>
            {place ? <p className="text-xs text-muted">{place}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-cream"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-sm font-semibold text-ink">
          {demo.subject} · {demo.classLevel}
          {demo.board ? ` · ${demo.board}` : ""}
        </p>
        <p className="mt-0.5 text-sm text-muted">
          {formatDemoDate(demo.preferredDate)} · {demo.preferredTime}
        </p>
        {demo.note ? (
          <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-sm leading-relaxed text-ink/85">
            {demo.note}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
          <a
            href={`tel:${demo.parentPhone}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-2.5 py-1.5 font-semibold text-ink"
          >
            <Phone className="h-3.5 w-3.5 text-sage" />
            {demo.parentPhone}
          </a>
          <a
            href={`https://wa.me/${waPhone(demo.parentPhone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-2.5 py-1.5 font-semibold text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          {demo.parentEmail ? (
            <a
              href={`mailto:${demo.parentEmail}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-2.5 py-1.5 font-semibold text-ink"
            >
              <Mail className="h-3.5 w-3.5 text-coral" />
              Email
            </a>
          ) : null}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          This number was shared when the parent sent the demo. Accept or
          decline only records your answer.
        </p>
        {error ? (
          <p className="mt-2 text-sm font-medium text-coral-dark">{error}</p>
        ) : null}

        {demo.status === "pending" ? (
          <>
            <label className="mt-3 block text-xs font-semibold text-ink">
              Note for the parent
              <span className="font-medium text-muted"> · optional</span>
              <textarea
                value={note}
                onChange={(e) => onNote(e.target.value.slice(0, 500))}
                rows={3}
                className="mt-1 w-full rounded-lg border border-hairline px-3 py-2 text-sm outline-none focus:border-ink"
                placeholder="Timing, what you'll cover, or why you can't"
              />
            </label>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => onRespond("decline")}
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-hairline text-sm font-semibold text-ink disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Decline
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onRespond("accept")}
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-sage text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Accept
              </button>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">
            {demo.status === "accepted" ? "You accepted this demo." : "You declined this demo."}
            {demo.tutorNote ? ` Note: ${demo.tutorNote}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}

function InboxCard({
  row,
  open,
  busy,
  onToggle,
  onConnect,
  onReached,
}: {
  row: InboxRow;
  open: boolean;
  busy: boolean;
  onToggle: () => void;
  onConnect: (action: "accept" | "decline") => void;
  onReached: (action: "not_interested" | "got_hired") => void;
}) {
  const tag = SOURCE_TAG[row.source];
  const status = statusLabel(row);

  return (
    <li className="rounded-lg border border-hairline bg-white p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)]">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-[11px] font-bold",
            tag.cls,
          )}
        >
          {tag.label}
        </span>
        {status ? (
          <span className="rounded-md bg-cream px-2 py-0.5 text-[11px] font-semibold text-muted">
            {status}
          </span>
        ) : null}
        <span className="ml-auto text-[11px] font-medium text-muted">
          {timeAgo(row.at)}
        </span>
      </div>

      <div className="mt-2.5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-band text-sm font-bold text-ink">
          {row.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{row.name}</p>
          <p className="truncate text-xs text-muted">{row.line}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-hairline px-3 text-[11px] font-bold text-ink hover:bg-cream"
        >
          {open ? "Hide" : "View"}
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      {open ? (
        <div className="mt-3 border-t border-hairline pt-3">
          {row.connect ? (
            <>
              <blockquote className="rounded-md border-l-2 border-coral/60 bg-cream px-3 py-2 text-[13px] leading-relaxed text-ink/85">
                {row.connect.message}
              </blockquote>
              {row.connect.status === "pending" ? (
                <div className="mt-3 flex gap-2 sm:justify-end">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onConnect("decline")}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-hairline bg-white px-4 text-[13px] font-semibold text-ink disabled:opacity-50 sm:flex-none"
                  >
                    <X className="h-3.5 w-3.5" />
                    Decline
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onConnect("accept")}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-sage px-4 text-[13px] font-semibold text-white disabled:opacity-50 sm:flex-none"
                  >
                    {busy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Accept &amp; share number
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted">
                  Accept shares your WhatsApp with this parent only.
                </p>
              )}
            </>
          ) : null}

          {row.instant ? (
            <>
              <p className="text-sm font-semibold text-ink">
                Budget:{" "}
                {formatIcBudget(row.instant.budgetMin, row.instant.budgetMax)}
                {row.instant.preferredTime
                  ? ` · Preferred: ${row.instant.preferredTime}`
                  : ""}
              </p>
              {row.instant.message ? (
                <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-sm text-ink/80">
                  {row.instant.message}
                </p>
              ) : null}
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-ic-blue/20 bg-ic-blue-wash/60 px-3 py-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ic-blue" />
                <div className="min-w-0 text-sm">
                  {row.instant.parentContact.available ? (
                    <>
                      <p className="font-bold text-ink">
                        Parent contact: {row.instant.parentContact.phone}
                      </p>
                      <p className="text-xs text-muted">
                        Number hides when they close the request, or after 48
                        hours.
                      </p>
                    </>
                  ) : (
                    <p className="font-semibold text-muted">
                      Parent contact is no longer available.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {row.reached ? (
            <>
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink/90">
                {row.reached.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                <a
                  href={`tel:${row.reached.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-2.5 py-1.5 font-semibold text-ink"
                >
                  <Phone className="h-3.5 w-3.5 text-sage" />
                  {row.reached.phone}
                </a>
                <a
                  href={`mailto:${row.reached.email}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-2.5 py-1.5 font-semibold text-ink"
                >
                  <Mail className="h-3.5 w-3.5 text-coral" />
                  {row.reached.email}
                </a>
              </div>
              {row.reached.status === "new" ? (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onReached("not_interested")}
                    className="flex h-9 flex-1 items-center justify-center rounded-lg border border-hairline bg-white text-[12px] font-semibold text-ink disabled:opacity-50"
                  >
                    Not interested
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onReached("got_hired")}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-sage text-[12px] font-semibold text-white disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Got hired
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function statusLabel(row: InboxRow): string | null {
  if (row.connect) {
    if (row.connect.status === "pending") return "New";
    if (row.connect.status === "accepted") return "Connected";
    if (row.connect.status === "declined") return "Declined";
  }
  if (row.instant) {
    if (row.instant.status === "active") return "Open";
    if (row.instant.status === "closed") return "Closed";
    if (row.instant.status === "expired") return "Expired";
  }
  if (row.reached) {
    if (row.reached.status === "new") return "New";
    if (row.reached.status === "not_interested") return "Not interested";
    if (row.reached.status === "got_hired") return "Got hired";
  }
  if (row.demo) {
    if (row.demo.status === "pending") return "New";
    if (row.demo.status === "accepted") return "Accepted";
    if (row.demo.status === "declined") return "Declined";
  }
  return null;
}
