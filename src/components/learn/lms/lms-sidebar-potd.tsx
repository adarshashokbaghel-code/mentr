"use client";

import { useLmsPotd } from "@/components/learn/lms/lms-potd-context";
import {
  fetchPotdMonth,
  type PotdMonthDto,
} from "@/lib/learn-progress-client";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function dayTone(day: {
  isFuture: boolean;
  isToday: boolean;
  attempted: boolean;
  correct: boolean | null;
}) {
  if (day.isFuture) return "bg-[#f3f0ea] text-[#b0b6be]";
  if (day.attempted && day.correct === true) return "bg-[#0d9488] text-white";
  if (day.attempted && day.correct === false) return "bg-[#ea580c] text-white";
  if (day.isToday) return "bg-[#ff6a1a] text-white";
  return "bg-[#faf8f4] text-[#1c2434] hover:bg-[#fff4e8]";
}

/** Compact POTD month — lives in the LMS sidebar on wide desktop. */
export function LmsSidebarPotd() {
  const { openPotd, attemptPatches, today } = useLmsPotd();
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month, setMonth] = useState(now.getUTCMonth() + 1);
  const [monthData, setMonthData] = useState<PotdMonthDto | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMonth = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      setMonthData(await fetchPotdMonth(y, m));
    } catch {
      setMonthData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMonth(year, month);
  }, [year, month, loadMonth]);

  function shiftMonth(delta: number) {
    const d = new Date(Date.UTC(year, month - 1 + delta, 1));
    setYear(d.getUTCFullYear());
    setMonth(d.getUTCMonth() + 1);
  }

  const cells = useMemo(() => {
    if (!monthData) return [];
    const pad = Array.from({ length: monthData.firstDow }, () => null);
    const days = monthData.days.map((d) => {
      const patch = attemptPatches[d.dateKey];
      if (!patch) return d;
      return { ...d, attempted: true, correct: patch.correct };
    });
    return [...pad, ...days];
  }, [monthData, attemptPatches]);

  const potdSolved = Boolean(today?.attempted && today.attempt?.correct);
  const potdMissed = Boolean(
    today?.attempted && today.attempt && !today.attempt.correct,
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-1">
        <Link
          href="/learn/app/potd"
          className="flex min-w-0 items-center gap-1.5 text-[12px] font-extrabold text-[#1c2434] hover:text-[#ff6a1a]"
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-[#0d9488]" />
          <span className="truncate">POTD</span>
        </Link>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-lg p-1 text-[#5a6472] hover:bg-[#faf8f4]"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[4.5rem] text-center text-[10px] font-bold text-[#5a6472]">
            {MONTHS[month - 1]} {year}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-lg p-1 text-[#5a6472] hover:bg-[#faf8f4]"
            aria-label="Next month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {loading && !monthData ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-[#ff6a1a]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((d, i) => (
              <div
                key={`${d}-${i}`}
                className="py-0.5 text-center text-[9px] font-bold text-[#a89f91]"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) {
                return <div key={`pad-${i}`} className="aspect-square" />;
              }
              return (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() => openPotd(day.dateKey)}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-md text-[10px] font-extrabold transition",
                    dayTone(day),
                  )}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => openPotd()}
        className={cn(
          "w-full rounded-xl py-2 text-[11px] font-extrabold transition",
          potdSolved
            ? "bg-[#e6f7f4] text-[#0d9488]"
            : potdMissed
              ? "bg-[#fff4e8] text-[#c2410c]"
              : "bg-[#ff6a1a] text-white hover:brightness-95",
        )}
      >
        {potdSolved
          ? "Review today"
          : potdMissed
            ? "See today’s answer"
            : "Solve today’s POTD"}
      </button>

      <Link
        href="/learn/app/potd"
        className="block text-center text-[10px] font-bold text-[#8a929c] hover:text-[#1c2434]"
      >
        Full calendar →
      </Link>
    </div>
  );
}
