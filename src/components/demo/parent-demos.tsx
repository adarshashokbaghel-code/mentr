"use client";

import { DemoTimeline, googleCalendarHref, slotText } from "@/components/demo/demo-timeline";
import { ApiError, demoRequestsApi, type ParentDemoRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronRight,
  Clock,
  Loader2,
  MessageCircle,
  Search,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function todayKey(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function slotOf(demo: ParentDemoRequest): { date: string; time: string } {
  return demo.status === "proposed" && demo.proposedDate && demo.proposedTime
    ? { date: demo.proposedDate, time: demo.proposedTime }
    : { date: demo.preferredDate, time: demo.preferredTime };
}

function statusOf(demo: ParentDemoRequest, past: boolean): { label: string; cls: string } {
  const tutor = demo.teacherName.split(" ")[0];
  switch (demo.status) {
    case "proposed":
      return past
        ? { label: "Expired", cls: "bg-cream-band text-muted" }
        : { label: "New time proposed", cls: "bg-coral text-white" };
    case "accepted":
      return past
        ? { label: "Done", cls: "bg-cream-band text-muted" }
        : { label: "Confirmed", cls: "bg-sage-wash text-sage" };
    case "declined":
      return {
        label: demo.declinedBy === "parent" ? "You declined" : `${tutor} can't make it`,
        cls: "bg-cream-band text-muted",
      };
    default:
      return past
        ? { label: "No reply", cls: "bg-cream-band text-muted" }
        : { label: `Waiting for ${tutor}`, cls: "bg-butter/70 text-ink" };
  }
}

export function ParentDemos({
  onWaiting,
}: {
  onWaiting?: (count: number) => void;
}) {
  const [demos, setDemos] = useState<ParentDemoRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demoRequestsApi
      .mine()
      .then((data) => setDemos(data.demos))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    onWaiting?.(demos.filter((d) => d.status === "pending" || d.status === "proposed").length);
  }, [demos, onWaiting]);

  const groups = useMemo(() => {
    const today = todayKey();
    const needs: ParentDemoRequest[] = [];
    const upcoming: ParentDemoRequest[] = [];
    const past: ParentDemoRequest[] = [];
    for (const d of demos) {
      const isPast = slotOf(d).date < today;
      if (d.status === "declined" || isPast) past.push(d);
      else if (d.status === "proposed") needs.push(d);
      else upcoming.push(d);
    }
    const byDate = (a: ParentDemoRequest, b: ParentDemoRequest) =>
      slotOf(a).date.localeCompare(slotOf(b).date);
    return {
      needs: needs.sort(byDate),
      upcoming: upcoming.sort(byDate),
      past: past.sort((a, b) => byDate(b, a)),
    };
  }, [demos]);

  function replace(demo: ParentDemoRequest) {
    setDemos((prev) => prev.map((d) => (d.id === demo.id ? demo : d)));
  }

  if (loading) {
    return (
      <ul className="space-y-2.5">
        {[0, 1].map((i) => (
          <li key={i} className="h-[68px] animate-pulse rounded-xl border border-hairline bg-white" />
        ))}
      </ul>
    );
  }

  if (demos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-white px-4 py-10 text-center">
        <CalendarDays className="mx-auto h-5 w-5 text-muted" />
        <p className="mt-2 text-sm font-semibold text-ink">No demos yet</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
          Book a free online demo from a tutor&apos;s profile or a pitch on your
          post. You&apos;ll track every reply here.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg border border-hairline bg-white px-3 text-sm font-semibold text-ink hover:bg-cream"
        >
          <Search className="h-3.5 w-3.5" />
          Find a tutor
        </Link>
      </div>
    );
  }

  return (
    <section id="demos" className="space-y-5">
      {(
        [
          ["Needs your answer", groups.needs, false],
          ["Upcoming", groups.upcoming, false],
          ["Past", groups.past, true],
        ] as const
      ).map(([title, list, past]) =>
        list.length ? (
          <div key={title}>
            <h2 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">
              {title}
              <span className="rounded-full bg-cream-band px-1.5 text-[10px] tabular-nums">
                {list.length}
              </span>
            </h2>
            <ul className="mt-2 space-y-2">
              {list.map((demo) => (
                <DemoCard key={demo.id} demo={demo} past={past} onChange={replace} />
              ))}
            </ul>
          </div>
        ) : null,
      )}
    </section>
  );
}

function DemoCard({
  demo,
  past,
  onChange,
}: {
  demo: ParentDemoRequest;
  past: boolean;
  onChange: (demo: ParentDemoRequest) => void;
}) {
  const [busy, setBusy] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState("");
  const tutorFirst = demo.teacherName.split(" ")[0];
  const slot = slotOf(demo);
  const status = statusOf(demo, past);
  const proposed = demo.status === "proposed" && !past;
  const muted = past || demo.status === "declined";
  const [y, m, d] = slot.date.split("-").map(Number);
  const day = new Date(y, (m || 1) - 1, d || 1);
  const calendar =
    demo.status === "accepted" && !past
      ? googleCalendarHref({
          title: `${demo.subject} demo with ${demo.teacherName}`,
          details: `Online demo booked on Mentr. ${demo.teacherName} will share the class link on WhatsApp.`,
          date: demo.preferredDate,
          time: demo.preferredTime,
        })
      : null;

  async function answer(action: "accept" | "decline") {
    setBusy(action);
    setError("");
    try {
      const { demo: next } = await demoRequestsApi.parentRespond(demo.id, action);
      onChange(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <li
      className={cn(
        "overflow-hidden rounded-xl border bg-white",
        proposed ? "border-coral/40 shadow-[0_6px_20px_-12px_rgba(255,122,61,0.5)]" : "border-hairline",
      )}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div
          className={cn(
            "flex w-10 shrink-0 flex-col items-center rounded-lg py-1 leading-none",
            past || demo.status === "declined"
              ? "bg-cream text-muted"
              : demo.status === "accepted"
                ? "bg-sage-wash text-sage"
                : "bg-coral-wash text-coral-dark",
          )}
        >
          <span className="text-[9px] font-bold uppercase tracking-wide">
            {day.toLocaleDateString("en-IN", { month: "short" })}
          </span>
          <span className="my-0.5 text-[17px] font-extrabold tabular-nums text-ink">
            {day.getDate()}
          </span>
          <span className="text-[9px] font-semibold">
            {day.toLocaleDateString("en-IN", { weekday: "short" })}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/teachers/${demo.teacherId}`}
              className="truncate text-[13.5px] font-bold text-ink hover:text-coral"
            >
              {demo.teacherName}
            </Link>
            <span
              className={cn(
                "ml-auto shrink-0 rounded-full px-1.5 py-px text-[10px] font-bold",
                status.cls,
              )}
            >
              {status.label}
            </span>
          </div>
          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11.5px]">
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 font-bold tabular-nums",
                muted ? "bg-cream text-muted" : "bg-coral-wash text-coral-dark",
              )}
            >
              <Clock className="h-3 w-3" />
              {slot.time === "Flexible" ? "Any time" : slot.time}
            </span>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold",
                muted ? "bg-cream text-muted" : "bg-sky-50 text-sky-700",
              )}
            >
              <Video className="h-3 w-3" />
              Online
            </span>
            {proposed ? (
              <span className="truncate text-muted">
                was{" "}
                <span className="line-through">{slotText(demo.preferredDate, demo.preferredTime)}</span>
              </span>
            ) : null}
          </div>
          <p className="mt-1 flex min-w-0 items-center gap-1 text-[11.5px] text-muted">
            <BookOpen className={cn("h-3 w-3 shrink-0", muted ? "text-muted" : "text-sage")} />
            <span className="truncate">
              <span className="font-semibold text-ink/85">{demo.subject}</span>
              {` · ${demo.classLevel}`}
              {demo.board ? ` · ${demo.board}` : ""}
            </span>
          </p>
        </div>
      </div>

      {demo.tutorNote ? (
        <p className="mx-3 mb-2.5 rounded-md bg-cream px-2.5 py-1.5 text-[12px] leading-snug text-ink/85">
          <span className="font-semibold text-ink">{tutorFirst}: </span>“{demo.tutorNote}”
        </p>
      ) : null}

      {proposed ? (
        <div className="border-t border-coral/20 bg-coral-wash/40 px-3 py-2">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
            <CalendarClock className="h-3.5 w-3.5 text-coral-dark" />
            {tutorFirst} can do {slotText(demo.proposedDate, demo.proposedTime)} instead
          </p>
          {error ? <p className="mt-1.5 text-[12px] font-medium text-coral-dark">{error}</p> : null}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void answer("accept")}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-sage text-[12.5px] font-bold text-white disabled:opacity-60"
            >
              {busy === "accept" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Accept new time
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void answer("decline")}
              className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-hairline bg-white px-3 text-[12.5px] font-semibold text-muted hover:text-ink disabled:opacity-60"
            >
              {busy === "decline" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
              Decline
            </button>
          </div>
        </div>
      ) : demo.status === "accepted" && !past ? (
        <div className="flex items-center gap-2 border-t border-hairline/70 px-3 py-1.5">
          <p className="flex min-w-0 flex-1 items-center gap-1.5 text-[11.5px] text-muted">
            <MessageCircle className="h-3 w-3 shrink-0 text-sage" />
            <span className="truncate">Class link from {tutorFirst} on WhatsApp</span>
          </p>
          {calendar ? (
            <a
              href={calendar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-1.5 text-[11.5px] font-semibold text-coral-dark hover:bg-coral-wash"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Calendar
            </a>
          ) : null}
        </div>
      ) : null}

      {demo.history.length > 1 ? (
        <details className="group border-t border-hairline/70 px-3 py-1.5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[11.5px] font-semibold text-muted">
            Activity
            <ChevronRight className="h-3.5 w-3.5 transition group-open:rotate-90" />
          </summary>
          <div className="mt-2.5 pl-1.5">
            <DemoTimeline
              history={demo.history}
              viewer="parent"
              parentName="You"
              tutorName={demo.teacherName}
            />
          </div>
        </details>
      ) : null}
    </li>
  );
}
