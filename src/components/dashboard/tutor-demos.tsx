"use client";

import { timeAgo } from "@/components/dashboard/widgets";
import { SlotPicker } from "@/components/demo/book-demo-button";
import { DemoTimeline, googleCalendarHref, slotText } from "@/components/demo/demo-timeline";
import { useAuth } from "@/components/auth/auth-provider";
import {
  ApiError,
  demoRequestsApi,
  type DemoPostContext,
  type TutorDemoRequest,
} from "@/lib/api";

type RespondBody = Parameters<typeof demoRequestsApi.respond>[1];
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronRight,
  Loader2,
  Mail,
  Megaphone,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type View = "requests" | "upcoming" | "past";

const VIEWS: { id: View; label: string }[] = [
  { id: "requests", label: "Requests" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
];

function todayKey(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** The slot currently on the table: the tutor's proposal, else the agreed/requested one. */
function slotOf(demo: TutorDemoRequest): { date: string; time: string } {
  return demo.status === "proposed" && demo.proposedDate && demo.proposedTime
    ? { date: demo.proposedDate, time: demo.proposedTime }
    : { date: demo.preferredDate, time: demo.preferredTime };
}

function viewOf(demo: TutorDemoRequest, today: string): View {
  const isPast = slotOf(demo).date < today;
  if (demo.status === "declined" || isPast) return "past";
  return demo.status === "pending" ? "requests" : "upcoming";
}

export function TutorDemos({
  onAttentionChange,
}: {
  onAttentionChange?: (count: number) => void;
}) {
  const [demos, setDemos] = useState<TutorDemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View | null>(null);
  const [popup, setPopup] = useState<TutorDemoRequest | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(() => {
    demoRequestsApi
      .inbox()
      .then((data) => setDemos(data.demos))
      .catch(() => setError("Could not load your demos."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  useEffect(() => {
    if (loading || typeof window === "undefined") return;
    if (["#demos", "#inbox"].includes(window.location.hash)) {
      document.getElementById("demos")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading]);

  const grouped = useMemo(() => {
    const today = todayKey();
    const out: Record<View, TutorDemoRequest[]> = {
      requests: [],
      upcoming: [],
      past: [],
    };
    for (const d of demos) out[viewOf(d, today)].push(d);
    const byDate = (a: TutorDemoRequest, b: TutorDemoRequest) =>
      slotOf(a).date.localeCompare(slotOf(b).date);
    out.requests.sort(byDate);
    out.upcoming.sort(byDate);
    out.past.sort((a, b) => byDate(b, a));
    return out;
  }, [demos]);

  const attention = grouped.requests.length;
  useEffect(() => {
    onAttentionChange?.(attention);
  }, [attention, onAttentionChange]);

  const active: View =
    view ??
    (grouped.requests.length
      ? "requests"
      : grouped.upcoming.length
        ? "upcoming"
        : grouped.past.length
          ? "past"
          : "requests");
  const list = grouped[active];

  async function respond(body: RespondBody): Promise<boolean> {
    if (!popup) return false;
    setBusyId(popup.id);
    setError("");
    try {
      const { demo } = await demoRequestsApi.respond(popup.id, body);
      setDemos((prev) => prev.map((r) => (r.id === demo.id ? demo : r)));
      setPopup(demo);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update the demo — try again.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section id="demos" className="scroll-mt-24">
      <div
        role="tablist"
        aria-label="Demo filter"
        className="inline-flex w-full gap-0.5 rounded-full bg-cream-band p-0.5 sm:w-auto"
      >
        {VIEWS.map((v) => {
          const count = grouped[v.id].length;
          const on = active === v.id;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setView(v.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition sm:flex-none",
                on ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              {v.label}
              {count ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10.5px] font-bold tabular-nums",
                    v.id === "requests" && count
                      ? "bg-coral text-white"
                      : "bg-cream text-muted",
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {error && !popup ? (
        <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
          {error}
        </p>
      ) : null}

      {loading ? (
        <ul className="mt-3 space-y-2.5">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl border border-hairline bg-white p-3"
            >
              <Skeleton className="h-14 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            </li>
          ))}
        </ul>
      ) : list.length === 0 ? (
        <EmptyState view={active} />
      ) : (
        <ul className="mt-3 space-y-2.5">
          {list.map((demo) => (
            <DemoRow
              key={demo.id}
              demo={demo}
              view={active}
              onOpen={() => {
                setError("");
                setPopup(demo);
              }}
            />
          ))}
        </ul>
      )}

      {popup ? (
        <DemoPopup
          demo={popup}
          busy={busyId === popup.id}
          error={error}
          onClose={() => setPopup(null)}
          onRespond={respond}
        />
      ) : null}
    </section>
  );
}

function EmptyState({ view }: { view: View }) {
  const copy: Record<View, { title: string; body: string }> = {
    requests: {
      title: "No new demo requests",
      body: "When a parent books a free demo with you — from your profile or your pitch — it lands here.",
    },
    upcoming: {
      title: "Nothing scheduled",
      body: "Demos you accept show up here with the parent's number.",
    },
    past: {
      title: "No past demos yet",
      body: "Finished and declined demos are kept here.",
    },
  };
  return (
    <div className="mt-3 rounded-2xl border border-dashed border-hairline bg-white px-4 py-8 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cream">
        <CalendarDays className="h-4 w-4 text-muted" />
      </span>
      <p className="mt-2.5 text-sm font-semibold text-ink">{copy[view].title}</p>
      <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted">
        {copy[view].body}
      </p>
    </div>
  );
}

function DateTile({ iso, dim }: { iso: string; dim?: boolean }) {
  const d = new Date(`${iso}T00:00:00`);
  const valid = !Number.isNaN(d.getTime());
  return (
    <div
      className={cn(
        "flex w-12 shrink-0 flex-col items-center justify-center rounded-xl py-1.5 sm:w-14",
        dim ? "bg-cream text-muted" : "bg-coral-wash text-coral-dark",
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wide">
        {valid ? d.toLocaleDateString("en-IN", { month: "short" }) : "—"}
      </span>
      <span className="text-lg font-extrabold leading-none tabular-nums text-ink sm:text-xl">
        {valid ? d.getDate() : "?"}
      </span>
      <span className="text-[10px] font-semibold">
        {valid ? d.toLocaleDateString("en-IN", { weekday: "short" }) : ""}
      </span>
    </div>
  );
}

function StatusPill({ demo, view }: { demo: TutorDemoRequest; view: View }) {
  const [label, cls] =
    demo.status === "pending"
      ? view === "past"
        ? ["Missed", "bg-cream text-muted"]
        : ["New", "bg-coral text-white"]
      : demo.status === "proposed"
        ? view === "past"
          ? ["No reply", "bg-cream text-muted"]
          : ["Awaiting parent", "bg-butter text-ink"]
      : demo.status === "accepted"
        ? view === "past"
          ? ["Done", "bg-cream text-muted"]
          : ["Confirmed", "bg-sage-wash text-sage"]
        : ["Declined", "bg-cream text-muted"];
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-bold", cls)}>
      {label}
    </span>
  );
}

function DemoRow({
  demo,
  view,
  onOpen,
}: {
  demo: TutorDemoRequest;
  view: View;
  onOpen: () => void;
}) {
  const place = demo.parentArea || demo.parentCity;
  const dim = view === "past";

  return (
    <li
      className={cn(
        "group relative flex items-stretch gap-3 rounded-2xl border bg-white p-2.5 transition hover:shadow-[0_4px_14px_rgba(28,26,23,0.07)] sm:p-3",
        view === "requests" ? "border-coral/30" : "border-hairline",
      )}
    >
      <DateTile iso={slotOf(demo).date} dim={dim} />
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 text-left after:absolute after:inset-0 after:content-['']"
      >
        <div className="flex items-center gap-1.5">
          <p className={cn("truncate text-sm font-bold", dim ? "text-ink/70" : "text-ink")}>
            {demo.parentName}
          </p>
          <StatusPill demo={demo} view={view} />
        </div>
        <p className="mt-0.5 truncate text-[12.5px] text-ink/80">
          {slotOf(demo).time === "Flexible" ? "Any time" : slotOf(demo).time} · {demo.subject} ·{" "}
          {demo.classLevel}
        </p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-muted">
          {demo.fromPost ? (
            <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-coral-dark">
              <Megaphone className="h-3 w-3" />
              {demo.fromPost.pitch ? "Your pitch" : "Their post"}
              <span className="text-muted">·</span>
            </span>
          ) : null}
          <span className="truncate">
            {place ? `${place} · ` : ""}sent {timeAgo(demo.sentAt)}
          </span>
        </p>
      </button>
      <div className="relative z-10 flex shrink-0 items-center gap-1.5">
        {view === "upcoming" ? (
          <a
            href={`https://wa.me/${waPhone(demo.parentPhone)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${demo.parentName}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sage text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </a>
        ) : null}
        {view === "requests" ? (
          <button
            type="button"
            onClick={onOpen}
            className="hidden h-8 items-center rounded-full bg-ink px-3 text-[11.5px] font-bold text-white sm:inline-flex"
          >
            Review
          </button>
        ) : null}
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted transition group-hover:translate-x-0.5",
            view === "requests" && "sm:hidden",
          )}
        />
      </div>
    </li>
  );
}

const POST_MODE_LABELS: Record<string, string> = {
  online: "Online",
  student_home: "At their home",
  tutor_home: "At your place",
};

function postMeta(post: DemoPostContext): string {
  const budget =
    post.budgetMin != null && post.budgetMax != null
      ? `₹${post.budgetMin}–${post.budgetMax}/hr`
      : post.budgetMax != null
        ? `Up to ₹${post.budgetMax}/hr`
        : post.budgetMin != null
          ? `₹${post.budgetMin}+/hr`
          : "";
  return [
    post.modes.map((m) => POST_MODE_LABELS[m]).filter(Boolean).join(" or "),
    post.area,
    budget,
  ]
    .filter(Boolean)
    .join(" · ");
}

function FromPostBanner({ post }: { post: DemoPostContext }) {
  const [showPitch, setShowPitch] = useState(false);
  const pitch = post.pitch;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-coral/25 bg-coral-wash/60">
      <div className="flex items-center gap-2 px-3 py-2">
        <Megaphone className="h-3.5 w-3.5 shrink-0 text-coral-dark" />
        <p className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-coral-dark">
          {pitch ? "Booked from your pitch" : "Booked from their post"}
        </p>
        <span className="shrink-0 text-[11px] text-coral-dark/70">
          {pitch ? `you pitched ${timeAgo(pitch.sentAt)}` : `posted ${timeAgo(post.postedAt)}`}
        </span>
      </div>
      {pitch ? (
        <button
          type="button"
          onClick={() => setShowPitch((v) => !v)}
          aria-expanded={showPitch}
          className="block w-full border-t border-coral/15 bg-white/60 px-3 py-2 text-left"
        >
          <span
            className={cn(
              "block text-[12px] leading-relaxed text-ink/75",
              !showPitch && "line-clamp-2",
            )}
          >
            <span className="font-semibold text-ink">You: </span>
            {pitch.message}
          </span>
        </button>
      ) : (
        <p className="border-t border-coral/15 bg-white/60 px-3 py-2 text-[12px] leading-relaxed text-ink/75">
          They found you as a match for their post.
        </p>
      )}
    </div>
  );
}

function waPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function DemoPopup({
  demo,
  busy,
  error,
  onClose,
  onRespond,
}: {
  demo: TutorDemoRequest;
  busy: boolean;
  error: string;
  onClose: () => void;
  onRespond: (body: RespondBody) => Promise<boolean>;
}) {
  const { user } = useAuth();
  const place = demo.parentArea || demo.parentCity;
  const parentFirst = demo.parentName.split(" ")[0];
  const [proposing, setProposing] = useState(false);
  const [pDate, setPDate] = useState("");
  const [pTime, setPTime] = useState("");
  const [message, setMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const onPick = useCallback((date: string, time: string) => {
    setPDate(date);
    setPTime(time);
    setLocalError("");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function sendProposal() {
    if (!pDate || !pTime) {
      setLocalError("Pick a day and time to propose");
      return;
    }
    const ok = await onRespond({
      action: "propose",
      proposedDate: pDate,
      proposedTime: pTime,
      tutorNote: message.trim(),
    });
    if (ok) {
      setProposing(false);
      setMessage("");
    }
  }

  const calendar =
    demo.status === "accepted"
      ? googleCalendarHref({
          title: `${demo.subject} demo with ${demo.parentName}`,
          details: `Online demo booked on Mentr. Parent: ${demo.parentName}, ${demo.parentPhone}.`,
          date: demo.preferredDate,
          time: demo.preferredTime,
          timezone: user?.profile?.timezone,
        })
      : null;
  const open = demo.status === "pending" || demo.status === "proposed";

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
              Free demo · Online
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

        {demo.fromPost ? <FromPostBanner post={demo.fromPost} /> : null}

        <SlotCard demo={demo} parentFirst={parentFirst} />

        {demo.fromPost ? (
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
              Their post
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink/85">
              {demo.fromPost.details}
            </p>
            {postMeta(demo.fromPost) ? (
              <p className="mt-1 text-xs text-muted">{postMeta(demo.fromPost)}</p>
            ) : null}
          </div>
        ) : null}

        {demo.note && demo.note !== demo.fromPost?.details ? (
          <div className="mt-3">
            {demo.fromPost ? (
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                Note from the parent
              </p>
            ) : null}
            <p
              className={cn(
                "rounded-lg bg-cream px-3 py-2 text-sm leading-relaxed text-ink/85",
                demo.fromPost && "mt-1",
              )}
            >
              {demo.note}
            </p>
          </div>
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
          {calendar ? (
            <a
              href={calendar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-white px-2.5 py-1.5 font-semibold text-ink"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-coral" />
              Add to calendar
            </a>
          ) : null}
        </div>

        {proposing ? (
          <div className="mt-4 rounded-2xl border border-coral/30 bg-coral-wash/30 p-3">
            <SlotPicker
              teacherId={user?.id ?? ""}
              firstName="You"
              date={pDate}
              time={pTime}
              onPick={onPick}
              label="Propose a new slot"
              allowAnyTime={false}
              hoursTag="Your hours"
              fallbackHint="You haven't set weekly hours yet, so any hour is open. Add hours under Schedule."
            />
            <label className="mt-3 block text-xs font-semibold text-ink">
              Message to {parentFirst}
              <span className="font-medium text-muted"> · optional</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                rows={2}
                placeholder="e.g. I'm teaching then — could we do this instead?"
                className="mt-1 w-full rounded-lg border border-hairline bg-white px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </label>
            {localError || error ? (
              <p className="mt-2 text-sm font-medium text-coral-dark">{localError || error}</p>
            ) : null}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setProposing(false)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-hairline bg-white px-4 text-sm font-semibold text-ink"
              >
                Back
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void sendProposal()}
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {pDate && pTime ? `Propose ${slotText(pDate, pTime)}` : "Send new time"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {error ? (
              <p className="mt-2 text-sm font-medium text-coral-dark">{error}</p>
            ) : null}
            {open ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {demo.status === "pending" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void onRespond({ action: "accept" })}
                    className="col-span-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-sage text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Accept {slotText(demo.preferredDate, demo.preferredTime)}
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setProposing(true)}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-ink/20 bg-white text-sm font-semibold text-ink disabled:opacity-50"
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  {demo.status === "proposed" ? "Change time" : "Propose new time"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void onRespond({ action: "decline" })}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-hairline text-sm font-semibold text-muted hover:text-ink disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                  {demo.status === "proposed" ? "Cancel demo" : "Decline"}
                </button>
              </div>
            ) : null}
          </>
        )}

        {demo.history.length > 0 ? (
          <details className="group mt-4 rounded-xl border border-hairline px-3 py-2">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-semibold text-ink">
              Activity
              <ChevronRight className="h-3.5 w-3.5 text-muted transition group-open:rotate-90" />
            </summary>
            <div className="mt-2.5 pl-1.5">
              <DemoTimeline
                history={demo.history}
                viewer="tutor"
                parentName={demo.parentName}
                tutorName="You"
              />
            </div>
          </details>
        ) : null}
      </div>
    </div>
  );
}

/** The slot on the table, with what it replaced and where it stands. */
function SlotCard({ demo, parentFirst }: { demo: TutorDemoRequest; parentFirst: string }) {
  const proposed = demo.status === "proposed" && demo.proposedDate && demo.proposedTime;
  const tone =
    demo.status === "accepted"
      ? { box: "border-sage/30 bg-sage-wash/50", icon: "text-sage", line: "Confirmed" }
      : demo.status === "declined"
        ? {
            box: "border-hairline bg-cream/60",
            icon: "text-muted",
            line: demo.declinedBy === "parent" ? `${parentFirst} declined your new time` : "You declined",
          }
        : proposed
          ? {
              box: "border-butter bg-butter/30",
              icon: "text-ink",
              line: `Waiting for ${parentFirst} to accept`,
            }
          : { box: "border-hairline", icon: "text-coral", line: "Requested by the parent" };

  return (
    <div className={cn("mt-3 flex items-center gap-2.5 rounded-xl border px-3 py-2.5", tone.box)}>
      <CalendarDays className={cn("h-4 w-4 shrink-0", tone.icon)} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">
          {proposed
            ? slotText(demo.proposedDate, demo.proposedTime)
            : slotText(demo.preferredDate, demo.preferredTime)}
        </p>
        {proposed ? (
          <p className="text-[11.5px] text-muted">
            They asked for{" "}
            <span className="line-through">{slotText(demo.preferredDate, demo.preferredTime)}</span>
          </p>
        ) : null}
        <p className="truncate text-xs text-muted">
          {tone.line} · {demo.subject} · {demo.classLevel}
          {demo.board ? ` · ${demo.board}` : ""}
        </p>
      </div>
    </div>
  );
}
