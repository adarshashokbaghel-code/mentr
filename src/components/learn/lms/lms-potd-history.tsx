"use client";

import { useLmsPotd } from "@/components/learn/lms/lms-potd-context";
import {
  fetchPotdMonth,
  type PotdMonthDto,
} from "@/lib/learn-progress-client";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Flame, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
  return "bg-white text-[#1c2434] ring-1 ring-[#e8e2d8] hover:bg-[#fff4e8]";
}

/** Course completion and the monthly POTD calendar, one card. */
export function LmsPotdHistory({
  streak,
  chaptersDone,
  videos,
  quizzes,
}: {
  streak: number;
  chaptersDone: number;
  videos: number;
  quizzes: number;
}) {
  const { openPotd, attemptPatches } = useLmsPotd();
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

  const days = useMemo(() => {
    if (!monthData) return [];
    return monthData.days.map((d) => {
      const patch = attemptPatches[d.dateKey];
      if (!patch) return d;
      return { ...d, attempted: true, correct: patch.correct };
    });
  }, [monthData, attemptPatches]);

  const cells = useMemo(() => {
    if (!monthData) return [];
    const pad = Array.from({ length: monthData.firstDow }, () => null);
    return [...pad, ...days];
  }, [monthData, days]);

  const stats = useMemo(() => {
    let solved = 0;
    let missed = 0;
    for (const d of days) {
      if (!d.attempted || d.isFuture) continue;
      if (d.correct) solved += 1;
      else missed += 1;
    }
    return { solved, missed };
  }, [days]);

  const monthLabel = `${MONTHS[month - 1]} ${year}`;
  const chapterPct = Math.max(2, Math.round((chaptersDone / 60) * 100));

  return (
    <section
      id="potd"
      className="scroll-mt-4 rounded-2xl border border-[#e8e2d8] bg-white p-3 sm:p-4"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-0">
        <div className="flex min-w-0 flex-col justify-center lg:pr-5">
          <h2 className="text-[15px] font-extrabold text-[#1c2434]">
            Course completion
          </h2>
          <p className="mt-2 text-[1.65rem] font-extrabold tabular-nums tracking-tight text-[#1c2434]">
            {chaptersDone}
            <span className="text-[1rem] font-bold text-[#8a929c]"> / 60</span>
          </p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#efe6d8]">
            <div
              className="h-full rounded-full bg-[#ff6a1a] transition-all duration-700"
              style={{ width: `${chapterPct}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] font-semibold text-[#8a929c]">
            {chaptersDone} / 60 chapters · {videos} videos watched · {quizzes}{" "}
            quizzes done
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Chapters", value: `${chaptersDone}/60` },
              { label: "Videos", value: String(videos) },
              { label: "Quizzes", value: String(quizzes) },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-[#faf8f4] px-2 py-2.5 text-center"
              >
                <p className="text-[15px] font-extrabold tabular-nums text-[#1c2434]">
                  {item.value}
                </p>
                <p className="text-[11px] font-bold text-[#8a929c]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#f0ebe3] pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-[15px] font-extrabold text-[#1c2434]">POTD history</h2>
          <p className="text-[11px] font-medium text-[#8a929c]">
            Green solved · orange missed · tap a day
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff8d6] px-2 py-0.5 text-[11px] font-extrabold text-[#b45309]">
            <Flame className="h-3 w-3" />
            {streak}d
          </span>
          <span className="rounded-full bg-[#e6f7f4] px-2 py-0.5 text-[11px] font-extrabold text-[#0d9488]">
            {stats.solved} solved
          </span>
          <span className="rounded-full bg-[#fff4e8] px-2 py-0.5 text-[11px] font-extrabold text-[#c2410c]">
            {stats.missed} missed
          </span>
        </div>
      </div>

      <div className="mt-3 w-full max-w-[280px]">
        <div className="mb-1.5 flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-lg p-1 text-[#5a6472] hover:bg-[#faf8f4]"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <p className="text-[12px] font-extrabold text-[#1c2434]">{monthLabel}</p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-lg p-1 text-[#5a6472] hover:bg-[#faf8f4]"
            aria-label="Next month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
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
                if (!day) return <div key={`pad-${i}`} className="aspect-square" />;
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
      </div>
        </div>
      </div>
    </section>
  );
}
