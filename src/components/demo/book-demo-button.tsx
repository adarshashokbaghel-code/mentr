"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRoleAction } from "@/hooks/use-role-action";
import { ApiError, demoRequestsApi, profileApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CalendarDays, Check, Loader2, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
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

function loadDemoTeacherIds(): Promise<Set<string>> {
  if (!demoTeacherIds) {
    demoTeacherIds = demoRequestsApi
      .mine()
      .then(
        (data) =>
          new Set(
            data.demos
              .filter((demo) => demo.status !== "declined")
              .map((demo) => demo.teacherId),
          ),
      )
      .catch(() => new Set());
  }
  return demoTeacherIds;
}

function rememberDemoTeacher(teacherId: string) {
  demoTeacherIds = loadDemoTeacherIds().then((ids) => {
    const next = new Set(ids);
    next.add(teacherId);
    return next;
  });
}

function todayInputValue(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function BookDemoButton({
  teacher,
  className,
  label = "Book a demo",
}: {
  teacher: DemoTeacher;
  className?: string;
  label?: string;
}) {
  const { user, openRoleChooser } = useAuth();
  const { requireParent } = useRoleAction();
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "parent") return;
    let cancelled = false;
    loadDemoTeacherIds().then((ids) => {
      if (!cancelled && ids.has(teacher.id)) setRequested(true);
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

  if (requested) {
    return (
      <Link href="/parent/dashboard#demos" className={className}>
        <CalendarDays className="h-[1em] w-[1em]" />
        Demo requested
      </Link>
    );
  }

  return (
    <>
      <button type="button" onClick={onClick} className={className}>
        <CalendarDays className="h-[1em] w-[1em]" />
        {label}
      </button>
      {open ? (
        <BookDemoModal
          teacher={teacher}
          onClose={() => setOpen(false)}
          onSent={() => {
            rememberDemoTeacher(teacher.id);
            setRequested(true);
          }}
        />
      ) : null}
    </>
  );
}

function BookDemoModal({
  teacher,
  onClose,
  onSent,
}: {
  teacher: DemoTeacher;
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
    if (subject.length < 2) {
      setError("Choose the subject for this demo");
      return;
    }
    if (!classLevel) {
      setError("Choose the class or level");
      return;
    }
    if (!preferredDate) {
      setError("Pick a date");
      return;
    }
    if (!preferredTime) {
      setError("Pick a time");
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
      await demoRequestsApi.create({
        teacherId: teacher.id,
        subject,
        classLevel,
        board: board || undefined,
        preferredDate,
        preferredTime,
        note: note.trim(),
      });
      setSent(true);
      onSent();
    } catch (err) {
      if (err instanceof ApiError && err.data?.code === "ALREADY_PENDING") {
        setSent(true);
        onSent();
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-ink">
                  Date
                  <input
                    type="date"
                    value={preferredDate}
                    min={todayInputValue()}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className={control}
                  />
                </label>
                <label className="block text-xs font-semibold text-ink">
                  Time
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className={control}
                  >
                    <option value="">Choose</option>
                    {DEMO_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

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
              Send demo request
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
