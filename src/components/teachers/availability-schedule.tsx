"use client";

import {
  convertSlot,
  convertedSlotLabel,
  detectTimezone,
  tzDisplayLabel,
  type WeeklySlot,
} from "@/lib/timezone";
import { cn } from "@/lib/utils";
import { Globe, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface AvailabilityScheduleProps {
  /** Pre-formatted labels — fallback for demo profiles without raw slots */
  slots: { label: string; available: boolean }[];
  /** Raw weekly slots in the tutor's own time zone (live profiles) */
  availability?: WeeklySlot[];
  /** IANA zone the tutor wrote the slots in, e.g. "Asia/Kolkata" */
  timezone?: string;
  timeFormat?: "12h" | "24h";
}

/**
 * Cross-country availability viewer. Tutors publish slots in their own
 * local time; parents anywhere can flip between the tutor's time and
 * their own — the whole point of hiring a tutor from any country.
 */
export function AvailabilitySchedule({
  slots,
  availability,
  timezone,
  timeFormat = "12h",
}: AvailabilityScheduleProps) {
  // Resolved after mount so the server render never guesses the viewer's zone
  const [viewerTz, setViewerTz] = useState("");
  const [view, setView] = useState<"tutor" | "viewer">("tutor");

  useEffect(() => {
    setViewerTz(detectTimezone());
  }, []);

  const canConvert =
    !!timezone &&
    !!viewerTz &&
    (availability?.length ?? 0) > 0 &&
    viewerTz !== timezone;

  const sameZone =
    !!timezone && !!viewerTz && viewerTz === timezone;

  const converted = useMemo(() => {
    if (!canConvert) return [];
    return availability!.map((s) => convertSlot(s, timezone!, viewerTz));
  }, [canConvert, availability, timezone, viewerTz]);

  const showingViewer = canConvert && view === "viewer";

  const chips = showingViewer
    ? converted.map((s) => ({
        label: convertedSlotLabel(s, timeFormat),
        available: !s.booked,
      }))
    : slots;

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Availability</h2>

        {canConvert && (
          <div className="flex overflow-hidden rounded-full border border-hairline bg-white text-xs font-bold">
            <button
              type="button"
              onClick={() => setView("tutor")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 transition",
                view === "tutor"
                  ? "bg-ink text-white"
                  : "text-muted hover:text-ink",
              )}
            >
              <MapPin className="h-3.5 w-3.5" />
              Tutor&apos;s time · {tzDisplayLabel(timezone!)}
            </button>
            <button
              type="button"
              onClick={() => setView("viewer")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 transition",
                view === "viewer"
                  ? "bg-ink text-white"
                  : "text-muted hover:text-ink",
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              Your time · {tzDisplayLabel(viewerTz)}
            </button>
          </div>
        )}
      </div>

      {canConvert && (
        <p className="mt-2 text-sm text-muted">
          {showingViewer ? (
            <>
              Converted to your local time ({tzDisplayLabel(viewerTz)}) from the
              tutor&apos;s {tzDisplayLabel(timezone!)} schedule.
            </>
          ) : (
            <>
              Times shown in the tutor&apos;s time zone (
              {tzDisplayLabel(timezone!)}). Toggle to see them in yours.
            </>
          )}
        </p>
      )}
      {sameZone && (
        <p className="mt-2 text-sm text-muted">
          You and this tutor are in the same time zone (
          {tzDisplayLabel(timezone!)}) — no conversion needed.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((slot, i) => (
          <span
            key={`${slot.label}-${i}`}
            className={
              slot.available
                ? "rounded-full bg-sage-wash px-3 py-1.5 text-sm font-medium text-sage"
                : "rounded-full bg-cream-band px-3 py-1.5 text-sm font-medium text-muted line-through"
            }
          >
            {slot.label}
            {slot.available ? "" : " · Booked"}
          </span>
        ))}
      </div>
    </section>
  );
}
