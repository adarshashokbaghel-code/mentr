"use client";

import { timeAgo } from "@/components/dashboard/widgets";
import { formatDemoDate } from "@/components/demo/book-demo-button";
import type { DemoHistoryEntry } from "@/lib/api";
import { cn } from "@/lib/utils";

const DEMO_MINUTES = 60;

/** Google Calendar "add event" link; null when the time isn't a fixed hour. */
export function googleCalendarHref(input: {
  title: string;
  details: string;
  date: string;
  time: string;
  timezone?: string;
}): string | null {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(input.time);
  const [y, m, d] = input.date.split("-").map(Number);
  if (!match || !y || !m || !d) return null;
  const start = ((Number(match[1]) % 12) + (match[3] === "PM" ? 12 : 0)) * 60 + Number(match[2]);
  const stamp = (minutes: number) => {
    const at = new Date(Date.UTC(y, m - 1, d, 0, minutes));
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${at.getUTCFullYear()}${pad(at.getUTCMonth() + 1)}${pad(at.getUTCDate())}T${pad(at.getUTCHours())}${pad(at.getUTCMinutes())}00`;
  };
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    details: input.details,
    dates: `${stamp(start)}/${stamp(start + DEMO_MINUTES)}`,
    ctz: input.timezone || "Asia/Kolkata",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function slotText(date: string | null, time: string | null): string {
  if (!date || !time) return "";
  return `${formatDemoDate(date)} · ${time === "Flexible" ? "Any time" : time}`;
}

/**
 * Who did what, oldest first. `viewer` decides whether entries read
 * "You" or the other person's name.
 */
export function DemoTimeline({
  history,
  viewer,
  parentName,
  tutorName,
}: {
  history: DemoHistoryEntry[];
  viewer: "parent" | "tutor";
  parentName: string;
  tutorName: string;
}) {
  if (history.length === 0) return null;
  const who = (by: DemoHistoryEntry["by"]) =>
    by === viewer ? "You" : (by === "parent" ? parentName : tutorName).split(" ")[0];
  const verb: Record<DemoHistoryEntry["action"], string> = {
    requested: "requested",
    accepted: "accepted",
    declined: "declined",
    proposed: "proposed",
    parent_accepted: "accepted the new time",
    parent_declined: "declined the new time",
  };
  const done = (a: DemoHistoryEntry["action"]) =>
    a === "accepted" || a === "parent_accepted";
  const stop = (a: DemoHistoryEntry["action"]) =>
    a === "declined" || a === "parent_declined";

  return (
    <ol className="relative space-y-2.5 border-l border-hairline pl-4">
      {history.map((h, i) => (
        <li key={`${h.at}-${i}`} className="relative">
          <span
            className={cn(
              "absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white",
              done(h.action) ? "bg-sage" : stop(h.action) ? "bg-muted" : "bg-coral",
            )}
          />
          <p className="text-[12.5px] leading-snug text-ink">
            <span className="font-semibold">{who(h.by)}</span> {verb[h.action]}
            {h.date && h.time && (h.action === "requested" || h.action === "proposed") ? (
              <span className="font-semibold"> {slotText(h.date, h.time)}</span>
            ) : null}
          </p>
          {h.note ? (
            <p className="mt-0.5 text-[12px] italic leading-snug text-ink/70">“{h.note}”</p>
          ) : null}
          <p className="text-[10.5px] text-muted">{timeAgo(h.at)}</p>
        </li>
      ))}
    </ol>
  );
}
