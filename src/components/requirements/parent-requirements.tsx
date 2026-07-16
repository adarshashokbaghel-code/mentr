"use client";

import {
  ApiError,
  requirementsApi,
  type MyRequirement,
  type NewRequirement,
  type RequirementInterest,
  type StartTimeline,
} from "@/lib/api";
import { connectionsApi } from "@/lib/api";
import { timeAgo } from "@/components/dashboard/widgets";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Clock3,
  Hourglass,
  IndianRupee,
  Loader2,
  Lock,
  MapPin,
  Megaphone,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  Plus,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PitchMessageDialog } from "@/components/requirements/pitch-message-dialog";

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Coding",
  "Science",
  "Hindi",
  "Kannada",
  "Social Science",
  "Exam Prep",
  "Music",
];

const LEVEL_OPTIONS = [
  "Class 1–5",
  "Class 6–8",
  "Class 9–10",
  "Class 11–12",
  "JEE / NEET",
  "College",
  "Working professionals",
];

const MODE_OPTIONS = [
  { id: "online", label: "Online" },
  { id: "student_home", label: "At my home" },
  { id: "tutor_home", label: "At tutor's place" },
] as const;

/** How soon classes should start — also decides how long the post stays up */
const TIMELINE_OPTIONS: {
  id: StartTimeline;
  label: string;
  ttl: string;
}[] = [
  { id: "immediately", label: "Immediately", ttl: "post live 3 days" },
  { id: "within_week", label: "Within a week", ttl: "post live 7 days" },
  { id: "within_month", label: "Within a month", ttl: "post live 14 days" },
  { id: "flexible", label: "Flexible", ttl: "post live 14 days" },
];

export const TIMELINE_LABELS: Record<StartTimeline, string> = {
  immediately: "Starts immediately",
  within_week: "Starts within a week",
  within_month: "Starts within a month",
  flexible: "Flexible start",
};

const DETAILS_MIN = 20;
const DETAILS_MAX = 500;

/**
 * "Post your need, tutors come to you" — the parent side of the
 * requirements board. Owns its own data; notifies the dashboard when a
 * pitch is accepted so the connections list refreshes too.
 */
export function ParentRequirementsSection({
  onConnectionsChanged,
}: {
  onConnectionsChanged?: () => void;
}) {
  const [requirements, setRequirements] = useState<MyRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const reload = useCallback(() => {
    requirementsApi
      .mine()
      .then((data) => setRequirements(data.requirements))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">My requirements</h2>
          <p className="mt-0.5 text-sm text-muted">
            Post what you need — verified tutors reach out, you pick who to
            connect with. Your identity stays hidden until you accept.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-coral px-4 text-[13px] font-semibold text-white transition hover:bg-coral-dark"
        >
          <Plus className="h-3.5 w-3.5" />
          Post a requirement
        </button>
      </div>

      {loading ? (
        <div className="mt-4 rounded-lg border border-hairline bg-white px-5 py-8 text-center text-sm text-muted">
          Loading…
        </div>
      ) : requirements.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-hairline bg-white px-5 py-8 text-center">
          <Megaphone className="mx-auto h-5 w-5 text-muted" />
          <p className="mt-2 text-sm font-medium text-ink">
            Don&apos;t want to search? Let tutors come to you
          </p>
          <p className="mx-auto mt-1 max-w-[360px] text-sm text-muted">
            Post your need — subject, class, area and budget. Verified tutors
            send you a pitch, and their WhatsApp unlocks only when you accept.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {requirements.map((r) => (
            <RequirementCard
              key={r.id}
              requirement={r}
              onChanged={() => {
                reload();
                onConnectionsChanged?.();
              }}
            />
          ))}
        </ul>
      )}

      {modalOpen && (
        <PostRequirementModal
          onClose={() => setModalOpen(false)}
          onPosted={() => {
            setModalOpen(false);
            reload();
          }}
        />
      )}
    </section>
  );
}

const MODE_LABELS: Record<string, string> = {
  online: "Online",
  student_home: "At my home",
  tutor_home: "At tutor's place",
};

function daysLeft(expiresAt: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000),
  );
}

function RequirementCard({
  requirement: r,
  onChanged,
}: {
  requirement: MyRequirement;
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState(
    r.interests.some((i) => i.status === "pending"),
  );
  const [closing, setClosing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingInterests = r.interests.filter((i) => i.status === "pending");

  async function handleClose() {
    setClosing(true);
    try {
      await requirementsApi.close(r.id);
      setConfirmOpen(false);
      onChanged();
    } catch {
      setClosing(false);
    }
  }

  const budget =
    r.budgetMin != null || r.budgetMax != null
      ? [
          r.budgetMin != null ? `₹${r.budgetMin}` : null,
          r.budgetMax != null ? `₹${r.budgetMax}` : null,
        ]
          .filter(Boolean)
          .join("–") + "/hr"
      : null;

  const expiresInDays = daysLeft(r.expiresAt);

  return (
    <li className="rounded-xl border border-hairline bg-white p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)] transition hover:border-ink/20 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral-wash text-sm font-bold text-coral-dark">
            {r.subject.charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[15px] font-bold text-ink">
                {r.subject} · {r.classLevel}
              </p>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                  r.status === "open"
                    ? "bg-sage-wash text-sage"
                    : "bg-cream-band text-muted",
                )}
              >
                {r.status === "open" ? "Open" : "Closed"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted">
              posted {timeAgo(r.postedAt)}
              {r.status === "open"
                ? ` · ${
                    expiresInDays === 0
                      ? "closes today"
                      : `${expiresInDays}d left`
                  }`
                : ""}
            </p>
          </div>
        </div>
        {r.status === "open" && (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-md border border-hairline bg-white px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:border-coral/40 hover:text-coral-dark"
          >
            Close post
          </button>
        )}
      </div>

      {confirmOpen && (
        <CloseConfirmModal
          subject={r.subject}
          classLevel={r.classLevel}
          closing={closing}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleClose}
        />
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 text-[11px] font-semibold text-ink/70">
          <MapPin className="h-3 w-3" />
          {r.area}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 text-[11px] font-semibold text-ink/70">
          <MonitorSmartphone className="h-3 w-3" />
          {r.modes.map((m) => MODE_LABELS[m]).join(" · ")}
        </span>
        {budget && (
          <span className="inline-flex items-center gap-1 rounded-md bg-sage-wash px-2 py-1 text-[11px] font-bold text-sage">
            <IndianRupee className="h-3 w-3" />
            {budget}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 text-[11px] font-semibold text-ink/70">
          <Clock3 className="h-3 w-3" />
          {TIMELINE_LABELS[r.startTimeline]}
        </span>
        {r.status === "open" && (
          <span className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 text-[11px] font-semibold text-ink/70">
            <Hourglass className="h-3 w-3" />
            {expiresInDays === 0 ? "closes today" : `${expiresInDays}d left`}
          </span>
        )}
      </div>

      <p className="mt-3 rounded-lg bg-cream px-3.5 py-2.5 text-[13px] leading-relaxed text-ink/80">
        {r.details}
      </p>

      {/* Tutor pitches */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 flex w-full items-center justify-between rounded-md px-1 py-1 text-left"
      >
        <span className="text-[13px] font-semibold text-ink">
          Tutor responses
          <span
            className={cn(
              "ml-2 rounded-md px-1.5 py-0.5 text-[11px] font-bold",
              pendingInterests.length > 0
                ? "bg-coral-wash text-coral"
                : "bg-cream-band text-muted",
            )}
          >
            {r.interests.length}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded &&
        (r.interests.length === 0 ? (
          <p className="mt-1 px-1 pb-1 text-[13px] text-muted">
            No responses yet — tutors matching your subject will see this post.
          </p>
        ) : (
          <ul className="mt-1 space-y-2">
            {r.interests.map((i) => (
              <InterestRow key={i.id} interest={i} onChanged={onChanged} />
            ))}
          </ul>
        ))}
    </li>
  );
}

function InterestRow({
  interest: i,
  onChanged,
}: {
  interest: RequirementInterest;
  onChanged: () => void;
}) {
  const [acting, setActing] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const longMessage = i.message.length > 120;

  async function respond(action: "accept" | "decline") {
    setActing(action);
    setError("");
    try {
      await connectionsApi.respondAsParent(i.id, action);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed — try again");
      setActing(null);
    }
  }

  return (
    <li className="rounded-md border border-hairline bg-cream/60 p-3">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-bold text-white">
          {i.teacherName.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Link
              href={`/teachers/${i.teacherId}`}
              className="text-[13px] font-bold text-ink hover:text-coral"
            >
              {i.teacherName}
            </Link>
            {i.status === "accepted" && (
              <span className="rounded-md bg-sage-wash px-1.5 py-0.5 text-[10px] font-bold text-sage">
                Connected
              </span>
            )}
            {i.status === "declined" && (
              <span className="rounded-md bg-cream-band px-1.5 py-0.5 text-[10px] font-bold text-muted">
                Declined
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted">
            {i.teacherArea ? `${i.teacherArea} · ` : ""}
            {timeAgo(i.sentAt)}
          </p>
          <p
            className={cn(
              "mt-1.5 text-[13px] leading-snug text-ink/80",
              longMessage && "line-clamp-2",
            )}
          >
            {i.message}
          </p>
        </div>
      </div>

      <PitchMessageDialog
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        teacherName={i.teacherName}
        message={i.message}
        subtitle={
          i.teacherArea
            ? `${i.teacherArea} · ${timeAgo(i.sentAt)}`
            : timeAgo(i.sentAt)
        }
      />

      {error && (
        <p className="mt-2 text-[12px] font-medium text-coral-dark">{error}</p>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMessageOpen(true)}
          className="inline-flex h-8 items-center rounded-md border border-hairline bg-white px-3.5 text-xs font-bold text-ink transition hover:bg-cream"
        >
          View message
        </button>
        {i.status === "pending" ? (
          <>
            <button
              type="button"
              onClick={() => respond("accept")}
              disabled={acting !== null}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-sage px-3.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {acting === "accept" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Accept &amp; connect
            </button>
            <button
              type="button"
              onClick={() => respond("decline")}
              disabled={acting !== null}
              className="inline-flex h-8 items-center rounded-md border border-hairline bg-white px-3.5 text-xs font-bold text-muted transition hover:bg-cream disabled:opacity-50"
            >
              {acting === "decline" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Decline"
              )}
            </button>
            <span className="text-[11px] text-muted">
              Accepting unlocks their WhatsApp for you
            </span>
          </>
        ) : i.status === "accepted" ? (
          <>
            {i.phone && (
              <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-sage-wash px-3 text-xs font-bold tabular-nums text-sage">
                <Phone className="h-3.5 w-3.5" />
                +{i.phone}
              </span>
            )}
            {i.phone && (
              <a
                href={`https://wa.me/${i.phone}?text=${encodeURIComponent(
                  `Hi ${i.teacherName.split(" ")[0]}, we connected on Mentr — when can we talk about classes?`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-sage px-3.5 text-xs font-bold text-white transition hover:opacity-90"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat on WhatsApp
              </a>
            )}
          </>
        ) : null}
        <Link
          href={`/teachers/${i.teacherId}`}
          className="ml-auto text-[12px] font-semibold text-ink underline-offset-2 hover:underline"
        >
          View profile
        </Link>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Post modal                                                          */
/* ------------------------------------------------------------------ */

function CloseConfirmModal({
  subject,
  classLevel,
  closing,
  onCancel,
  onConfirm,
}: {
  subject: string;
  classLevel: string;
  closing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="close-post-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Cancel"
        onClick={onCancel}
      />

      <div className="champs-pop relative z-10 w-full max-w-sm rounded-xl border border-hairline bg-white p-5 shadow-xl">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-coral-wash">
          <X className="h-5 w-5 text-coral-dark" />
        </span>
        <h2 id="close-post-title" className="mt-3 text-base font-bold text-ink">
          Close this post?
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          <span className="font-semibold text-ink">
            {subject} · {classLevel}
          </span>{" "}
          will stop showing to tutors on the board and won&apos;t receive new
          pitches.
        </p>
        <p className="mt-2 rounded-md bg-sage-wash px-3 py-2 text-[12px] font-medium leading-relaxed text-sage">
          Connections you already made through this post stay in your history —
          nothing is deleted.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={closing}
            className="h-10 flex-1 rounded-md border border-hairline bg-white text-sm font-semibold text-ink transition hover:bg-cream disabled:opacity-50"
          >
            Keep it open
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={closing}
            className="h-10 flex-1 rounded-md bg-coral text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {closing ? "Closing…" : "Close post"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PostRequirementModal({
  onClose,
  onPosted,
}: {
  onClose: () => void;
  onPosted: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [area, setArea] = useState("");
  const [modes, setModes] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [details, setDetails] = useState("");
  const [startTimeline, setStartTimeline] = useState<StartTimeline | "">("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleMode(id: string) {
    setModes((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  const valid =
    subject &&
    classLevel &&
    area.trim().length > 1 &&
    modes.length > 0 &&
    startTimeline !== "" &&
    details.trim().length >= DETAILS_MIN;

  async function handlePost() {
    if (!valid) {
      setError(
        "Fill in all the fields (including when you want to start) — details need 20+ characters",
      );
      return;
    }
    setError("");
    setSending(true);
    try {
      await requirementsApi.post({
        subject,
        classLevel,
        area: area.trim(),
        modes: modes as NewRequirement["modes"],
        budgetMin: budgetMin === "" ? "" : Number(budgetMin),
        budgetMax: budgetMax === "" ? "" : Number(budgetMax),
        details: details.trim(),
        startTimeline: startTimeline as StartTimeline,
      });
      onPosted();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to post. Try again.",
      );
      setSending(false);
    }
  }

  const selectCls =
    "h-10 w-full rounded-md border border-hairline bg-white px-3 text-sm text-ink outline-none transition focus:border-ink/40";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-requirement-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="champs-pop relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-hairline bg-white p-5 shadow-xl sm:rounded-xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="post-requirement-title"
              className="text-lg font-bold text-ink"
            >
              Post a requirement
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Verified tutors see this anonymously and send you a pitch.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-cream"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-butter/40 px-3.5 py-3">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/60" />
          <p className="text-xs leading-relaxed text-ink/80">
            Your name and number are never shown on the board. Tutors pitch to
            you; you decide who to connect with.
          </p>
        </div>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-ink">
              Subject
            </span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={selectCls}
            >
              <option value="">Pick a subject</option>
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-ink">
              Class level
            </span>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className={selectCls}
            >
              <option value="">Pick a level</option>
              {LEVEL_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-3.5 block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">
            Area <span className="font-medium text-muted">(locality only)</span>
          </span>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value.slice(0, 80))}
            placeholder="e.g. HSR Layout"
            className="h-10 w-full rounded-md border border-hairline bg-white px-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-ink/40"
          />
        </label>

        <div className="mt-3.5">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">
            Teaching mode
          </span>
          <div className="flex flex-wrap gap-2">
            {MODE_OPTIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMode(m.id)}
                className={cn(
                  "rounded-md border px-3.5 py-2 text-[13px] font-semibold transition",
                  modes.includes(m.id)
                    ? "border-ink bg-ink text-white"
                    : "border-hairline bg-white text-ink hover:bg-cream",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3.5">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">
            How soon do you want to start?
          </span>
          <div className="grid grid-cols-2 gap-2">
            {TIMELINE_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setStartTimeline(t.id)}
                className={cn(
                  "rounded-md border px-3 py-2 text-left transition",
                  startTimeline === t.id
                    ? "border-ink bg-ink text-white"
                    : "border-hairline bg-white text-ink hover:bg-cream",
                )}
              >
                <span className="block text-[13px] font-semibold">
                  {t.label}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[11px] font-medium",
                    startTimeline === t.id ? "text-white/70" : "text-muted",
                  )}
                >
                  {t.ttl}
                </span>
              </button>
            ))}
          </div>
          <span className="mt-1.5 block text-[11px] text-muted">
            Urgent posts are shown to tutors as closing soon — they respond
            faster.
          </span>
        </div>

        <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-ink">
              Budget min{" "}
              <span className="font-medium text-muted">(₹/hr, optional)</span>
            </span>
            <input
              value={budgetMin}
              onChange={(e) =>
                setBudgetMin(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              placeholder="300"
              className="h-10 w-full rounded-md border border-hairline bg-white px-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-ink/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-ink">
              Budget max{" "}
              <span className="font-medium text-muted">(₹/hr, optional)</span>
            </span>
            <input
              value={budgetMax}
              onChange={(e) =>
                setBudgetMax(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              placeholder="600"
              className="h-10 w-full rounded-md border border-hairline bg-white px-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-ink/40"
            />
          </label>
        </div>

        <label className="mt-3.5 block">
          <span className="mb-1.5 flex items-baseline justify-between text-[13px] font-semibold text-ink">
            What do you need?
            <span
              className={cn(
                "text-[11px] font-medium tabular-nums",
                details.length > DETAILS_MAX ? "text-coral-dark" : "text-muted",
              )}
            >
              {details.length}/{DETAILS_MAX}
            </span>
          </span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value.slice(0, DETAILS_MAX))}
            rows={3}
            placeholder="e.g. Class 10 CBSE maths for my daughter — board exam focus, weekend batches preferred. Looking to start this month."
            className="w-full resize-none rounded-md border border-hairline bg-white px-3.5 py-3 text-sm leading-relaxed text-ink outline-none transition placeholder:text-muted/70 focus:border-ink/40"
          />
          <span className="mt-1 block text-[11px] text-muted">
            Goals, timings, exam focus — the more specific, the better the
            pitches.
          </span>
        </label>

        {error && (
          <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
            {error}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="flex h-11 flex-1 items-center justify-center rounded-md border border-hairline bg-white text-sm font-semibold text-ink transition hover:bg-cream disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePost}
            disabled={sending || !valid}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-coral text-sm font-semibold text-white transition hover:bg-coral-dark disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending ? "Posting…" : "Post to tutors"}
          </button>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
          <Clock3 className="h-3 w-3" />
          Post stays live 3–14 days based on how soon you start · up to 3 open
          posts at a time
        </p>
      </div>
    </div>
  );
}
