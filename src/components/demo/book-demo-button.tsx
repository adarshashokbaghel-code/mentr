"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRoleAction } from "@/hooks/use-role-action";
import { ApiError, demoRequestsApi, profileApi, type DemoSlots } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CalendarDays, Check, Clock, Loader2, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

export const DEMO_LEVELS = [
  "Class 1–5",
  "Class 6–8",
  "Class 9–10",
  "Class 11–12",
  "JEE / NEET",
  "College",
] as const;

export const DEMO_TIMES = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "Flexible",
] as const;

export const DEMO_BOARDS = [
  "CBSE",
  "ICSE",
  "State board",
  "IGCSE",
  "IB",
] as const;

export type DemoTeacher = {
  id: string;
  name: string;
  subjects?: string[];
};

/** The parent's post the demo is booked from; it already has subject and class. */
export type DemoFromPost = {
  id: string;
  subject: string;
  classLevel: string;
};

export function formatDemoDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

let demoTeacherIds: Promise<Set<string>> | null = null;
let demoTeacherIdsFor = "";

/** Tutors with a demo still ahead (waiting, proposed or confirmed). Past and declined ones can be rebooked. */
function loadDemoTeacherIds(userId: string): Promise<Set<string>> {
  if (!demoTeacherIds || demoTeacherIdsFor !== userId) {
    demoTeacherIdsFor = userId;
    const today = isoDate(new Date());
    demoTeacherIds = demoRequestsApi
      .mine()
      .then(
        (data) =>
          new Set(
            data.demos
              .filter((demo) => {
                if (demo.status === "declined") return false;
                const date =
                  demo.status === "proposed" && demo.proposedDate
                    ? demo.proposedDate
                    : demo.preferredDate;
                return date >= today;
              })
              .map((demo) => demo.teacherId),
          ),
      )
      .catch(() => new Set());
  }
  return demoTeacherIds;
}

function rememberDemoTeacher(userId: string, teacherId: string) {
  demoTeacherIds = loadDemoTeacherIds(userId).then((ids) => {
    const next = new Set(ids);
    next.add(teacherId);
    return next;
  });
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nextDates(count: number): string[] {
  const today = new Date();
  return Array.from({ length: count }, (_, i) =>
    isoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)),
  );
}

function dayChip(iso: string): { top: string; num: number; month: string } {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const [today, tomorrow] = nextDates(2);
  return {
    top:
      iso === today
        ? "Today"
        : iso === tomorrow
          ? "Tmrw"
          : date.toLocaleDateString("en-IN", { weekday: "short" }),
    num: d,
    month: date.toLocaleDateString("en-IN", { month: "short" }),
  };
}

/** "6:00 PM" → minutes after midnight; "Flexible" → -1 */
function minutesOf(time: string): number {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(time);
  if (!match) return -1;
  const h = Number(match[1]) % 12 + (match[3] === "PM" ? 12 : 0);
  return h * 60 + Number(match[2]);
}

function timeLabel(time: string): string {
  return time === "Flexible" ? "Any time" : time;
}

export function BookDemoButton({
  teacher,
  className,
  label = "Book a demo",
  fromPost,
}: {
  teacher: DemoTeacher;
  className?: string;
  label?: string;
  fromPost?: DemoFromPost;
}) {
  const { user, openRoleChooser } = useAuth();
  const { requireParent } = useRoleAction();
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "parent") return;
    let cancelled = false;
    loadDemoTeacherIds(user.id).then((ids) => {
      if (!cancelled) setRequested(ids.has(teacher.id));
    });
    return () => {
      cancelled = true;
    };
  }, [user, teacher.id]);

  function onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openRoleChooser(`/teachers/${teacher.id}`);
      return;
    }
    if (!requireParent()) return;
    setOpen(true);
  }

  return (
    <>
      {requested ? (
        <Link href="/parent/dashboard#demos" className={className}>
          <CalendarDays className="h-[1em] w-[1em]" />
          Demo requested
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={className}>
          <CalendarDays className="h-[1em] w-[1em]" />
          {label}
        </button>
      )}
      {open ? (
        <BookDemoModal
          teacher={teacher}
          fromPost={fromPost}
          onClose={() => setOpen(false)}
          onSent={() => {
            if (user) rememberDemoTeacher(user.id, teacher.id);
            setRequested(true);
          }}
        />
      ) : null}
    </>
  );
}

function BookDemoModal({
  teacher,
  fromPost,
  onClose,
  onSent,
}: {
  teacher: DemoTeacher;
  fromPost?: DemoFromPost;
  onClose: () => void;
  onSent: () => void;
}) {
  const { user, setUser } = useAuth();
  const firstName = teacher.name.split(" ")[0];
  const subjects = (teacher.subjects ?? []).filter(Boolean);
  const needsIdentity =
    !user?.parentProfile?.name || !user?.parentProfile?.phoneNumber;

  const [name, setName] = useState(user?.parentProfile?.name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.parentProfile?.phoneNumber ?? "",
  );
  const [city, setCity] = useState(user?.parentProfile?.city || "Bengaluru");
  const [subjectChoice, setSubjectChoice] = useState(
    subjects.length === 1 ? subjects[0] : "",
  );
  const [otherSubject, setOtherSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [board, setBoard] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [slotsKey, setSlotsKey] = useState(0);

  const subject =
    subjects.length === 0
      ? otherSubject.trim()
      : subjectChoice === "Other"
        ? otherSubject.trim()
        : subjectChoice;

  const visiblePhone = (
    needsIdentity ? phoneNumber : user?.parentProfile?.phoneNumber || ""
  ).trim();

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
  }, [onClose]);

  async function handleSend() {
    if (needsIdentity) {
      if (!name.trim()) {
        setError("Add your name so the tutor knows who is booking");
        return;
      }
      if (!/^\+?[\d\s-]{10,15}$/.test(phoneNumber.trim())) {
        setError("Enter a valid phone number");
        return;
      }
      if (!city.trim()) {
        setError("Add your city");
        return;
      }
    }
    if (!fromPost && subject.length < 2) {
      setError("Choose the subject for this demo");
      return;
    }
    if (!fromPost && !classLevel) {
      setError("Choose the class or level");
      return;
    }
    if (!preferredDate || !preferredTime) {
      setError("Pick a day and time");
      return;
    }

    setError("");
    setSending(true);
    try {
      if (needsIdentity) {
        const { user: updated } = await profileApi.saveParent({
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          country: user?.parentProfile?.country || "India",
          city: city.trim(),
          area: user?.parentProfile?.area,
        });
        setUser(updated);
      }
      await demoRequestsApi.create(
        fromPost
          ? { teacherId: teacher.id, requirementId: fromPost.id, preferredDate, preferredTime }
          : {
              teacherId: teacher.id,
              subject,
              classLevel,
              board: board || undefined,
              preferredDate,
              preferredTime,
              note: note.trim(),
            },
      );
      setSent(true);
      onSent();
    } catch (err) {
      if (err instanceof ApiError && err.data?.code === "ALREADY_PENDING") {
        setSent(true);
        onSent();
      } else if (err instanceof ApiError && err.data?.code === "SLOT_TAKEN") {
        setError(err.message);
        setPreferredTime("");
        setSlotsKey((k) => k + 1);
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not send the demo request. Try again.",
        );
      }
    } finally {
      setSending(false);
    }
  }

  const field =
    "mt-1 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none focus:border-ink";
  const control = cn(field, "h-11");

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-demo-title"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[min(92dvh,100%)] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-2xl border border-hairline bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl sm:max-h-[90vh] sm:rounded-2xl sm:p-6 sm:pb-6">
        {sent ? (
          <div className="py-4 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-wash">
              <Check className="h-6 w-6 text-sage" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-ink">Demo request sent</h2>
            <p className="mt-1 text-sm font-semibold text-ink">
              {formatDemoDate(preferredDate)} · {timeLabel(preferredTime)}
            </p>
            <p className="mx-auto mt-1.5 max-w-[320px] text-sm leading-relaxed text-muted">
              {firstName} can see your name and phone number now. Track the
              request under Demos on your dashboard.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                href="/parent/dashboard#demos"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-ink px-5 text-sm font-semibold text-white"
              >
                Track this demo
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-hairline px-5 text-sm font-semibold text-ink"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Online demo
                </p>
                <h2 id="book-demo-title" className="text-lg font-bold text-ink">
                  Book a demo with {firstName}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-cream hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl border border-butter bg-butter/40 px-3 py-2.5 text-[13px] leading-snug text-ink">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Your phone number
                {visiblePhone ? (
                  <span className="font-semibold"> {visiblePhone}</span>
                ) : null}{" "}
                will be visible to {firstName} as soon as you send this.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {needsIdentity ? (
                <>
                  <label className="block text-xs font-semibold text-ink">
                    Your name
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={control}
                      autoComplete="name"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-ink">
                    Phone number
                    <input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={control}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="10-digit mobile"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-ink">
                    City
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={control}
                      autoComplete="address-level2"
                    />
                  </label>
                </>
              ) : null}

              {fromPost ? (
                <div className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5">
                  <Check className="h-4 w-4 shrink-0 text-sage" strokeWidth={3} />
                  <p className="min-w-0 text-[13px] leading-snug text-ink">
                    <span className="font-semibold">
                      {fromPost.subject} · {fromPost.classLevel}
                    </span>
                    <span className="text-muted"> · details from your post</span>
                  </p>
                </div>
              ) : (
              <>
              <label className="block text-xs font-semibold text-ink">
                Subject
                {subjects.length > 0 ? (
                  <select
                    value={subjectChoice}
                    onChange={(e) => setSubjectChoice(e.target.value)}
                    className={control}
                  >
                    <option value="">Choose a subject</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    value={otherSubject}
                    onChange={(e) => setOtherSubject(e.target.value)}
                    className={control}
                    placeholder="e.g. Class 10 Physics"
                  />
                )}
              </label>
              {subjects.length > 0 && subjectChoice === "Other" ? (
                <label className="block text-xs font-semibold text-ink">
                  Which subject?
                  <input
                    value={otherSubject}
                    onChange={(e) => setOtherSubject(e.target.value)}
                    className={control}
                  />
                </label>
              ) : null}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-ink">
                  Class
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className={control}
                  >
                    <option value="">Choose</option>
                    {DEMO_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-ink">
                  Board
                  <span className="font-medium text-muted"> · optional</span>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className={control}
                  >
                    <option value="">Any</option>
                    {DEMO_BOARDS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              </>
              )}

              <SlotPicker
                teacherId={teacher.id}
                firstName={firstName}
                date={preferredDate}
                time={preferredTime}
                refreshKey={slotsKey}
                onPick={(date, time) => {
                  setPreferredDate(date);
                  setPreferredTime(time);
                  setError("");
                }}
              />

              {!fromPost && (
                <label className="block text-xs font-semibold text-ink">
                  Note to {firstName}
                  <span className="font-medium text-muted"> · optional</span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 500))}
                    rows={3}
                    placeholder="What should they cover in the demo?"
                    className={cn(field, "py-2.5")}
                  />
                </label>
              )}
            </div>

            {error ? (
              <p className="mt-3 text-sm font-medium text-coral-dark">{error}</p>
            ) : null}

            <button
              type="button"
              disabled={sending}
              onClick={() => void handleSend()}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink text-sm font-semibold text-white transition hover:bg-ink/85 disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CalendarDays className="h-4 w-4" />
              )}
              {preferredDate && preferredTime
                ? `Request ${formatDemoDate(preferredDate)} · ${timeLabel(preferredTime)}`
                : "Send demo request"}
            </button>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-muted">
              Online only · free on Mentr · you arrange the class on WhatsApp
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}

const DAY_PARTS = [
  { label: "Morning", until: 12 * 60 },
  { label: "Afternoon", until: 17 * 60 },
  { label: "Evening", until: 24 * 60 },
] as const;

function tzLabel(timezone: string): string {
  if (timezone === "Asia/Kolkata") return "IST";
  try {
    return (
      new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "short" })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName")?.value || timezone
    );
  } catch {
    return timezone;
  }
}

/**
 * Day strip + time chips built from the tutor's weekly hours. Falls back to
 * open times when the tutor hasn't set hours yet.
 */
export function SlotPicker({
  teacherId,
  firstName,
  date,
  time,
  refreshKey = 0,
  onPick,
  label = "Pick a slot",
  allowAnyTime = true,
  hoursTag,
  fallbackHint,
}: {
  teacherId: string;
  firstName: string;
  date: string;
  time: string;
  refreshKey?: number;
  onPick: (date: string, time: string) => void;
  label?: string;
  /** Offer "Any time that day" when the tutor has no hours set */
  allowAnyTime?: boolean;
  /** Overrides "{firstName}'s hours" on the tag */
  hoursTag?: string;
  /** Shown above the open times when no weekly hours are set */
  fallbackHint?: ReactNode;
}) {
  const [slots, setSlots] = useState<DemoSlots | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    demoRequestsApi
      .slots(teacherId)
      .then((data) => {
        if (!cancelled) setSlots(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [teacherId, refreshKey]);

  const fromHours = Boolean(slots?.hasHours);
  const loading = !slots && !failed;
  const days = useMemo(
    () =>
      fromHours
        ? slots!.days
        : nextDates(14).map((d) => ({
            date: d,
            times: DEMO_TIMES.filter((t) => allowAnyTime || t !== "Flexible") as string[],
          })),
    [fromHours, slots, allowAnyTime],
  );
  const activeDate = days.some((d) => d.date === date) ? date : (days[0]?.date ?? "");
  const times = days.find((d) => d.date === activeDate)?.times ?? [];

  useEffect(() => {
    if (!loading && activeDate && activeDate !== date) onPick(activeDate, "");
  }, [loading, activeDate, date, onPick]);

  const groups = DAY_PARTS.map((part, i) => ({
    label: part.label,
    times: times.filter((t) => {
      const m = minutesOf(t);
      return m >= (i === 0 ? 0 : DAY_PARTS[i - 1].until) && m < part.until;
    }),
  })).filter((g) => g.times.length);
  const anyTime = times.includes("Flexible");

  const chip = (on: boolean) =>
    cn(
      "transition",
      on
        ? "border-ink bg-ink text-white shadow-sm"
        : "border-hairline bg-white text-ink hover:border-ink/30",
    );

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-ink">{label}</p>
        {slots && fromHours ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-sage-wash px-2 py-0.5 text-[10.5px] font-semibold text-sage">
            <Clock className="h-3 w-3" />
            {hoursTag ?? `${firstName}'s hours`} · {tzLabel(slots.timezone)}
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="mt-2 space-y-2" aria-busy="true">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="h-[62px] w-[54px] shrink-0 animate-pulse rounded-xl bg-cream" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="h-9 animate-pulse rounded-lg bg-cream" />
            ))}
          </div>
        </div>
      ) : fromHours && days.length === 0 ? (
        <p className="mt-2 rounded-xl border border-dashed border-hairline bg-cream/60 px-3 py-4 text-center text-[13px] leading-relaxed text-muted">
          {firstName} is fully booked for the next two weeks. Check back soon.
        </p>
      ) : (
        <>
          {!fromHours ? (
            <p className="mt-1 text-[11.5px] leading-snug text-muted">
              {fallbackHint ?? (
                <>
                  <span className="font-semibold text-ink">{firstName}</span> hasn&apos;t
                  set weekly hours yet. Pick what suits you — they&apos;ll confirm.
                </>
              )}
            </p>
          ) : null}

          <div
            role="listbox"
            aria-label="Day"
            className="-mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
          >
            {days.map((d) => {
              const c = dayChip(d.date);
              const on = d.date === activeDate;
              return (
                <button
                  key={d.date}
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => onPick(d.date, "")}
                  className={cn(
                    "flex w-[54px] shrink-0 flex-col items-center rounded-xl border py-1.5",
                    chip(on),
                  )}
                >
                  <span className={cn("text-[10.5px] font-semibold", on ? "text-white/75" : "text-muted")}>
                    {c.top}
                  </span>
                  <span className="text-[17px] font-extrabold leading-tight tabular-nums">
                    {c.num}
                  </span>
                  <span className={cn("text-[10px]", on ? "text-white/75" : "text-muted")}>
                    {fromHours ? `${d.times.length} slot${d.times.length === 1 ? "" : "s"}` : c.month}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 space-y-2.5">
            {groups.map((g) => (
              <div key={g.label}>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                  {g.label}
                </p>
                <div className="mt-1 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                  {g.times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={time === t}
                      onClick={() => onPick(activeDate, t)}
                      className={cn(
                        "h-9 rounded-lg border text-[12.5px] font-semibold tabular-nums",
                        chip(time === t),
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {anyTime ? (
              <button
                type="button"
                aria-pressed={time === "Flexible"}
                onClick={() => onPick(activeDate, "Flexible")}
                className={cn(
                  "h-9 w-full rounded-lg border text-[12.5px] font-semibold",
                  chip(time === "Flexible"),
                )}
              >
                Any time that day
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
