"use client";

import { useLmsPotd } from "@/components/learn/lms/lms-potd-context";
import {
  fetchLearnEnrollment,
  readLearnEnrollmentLocal,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";
import {
  fetchPotdMonth,
  type PotdMonthDto,
} from "@/lib/learn-progress-client";
import { SYLLABUS_VIEW_HREF } from "@/lib/learn-syllabus-doc";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Gamepad2,
  Library,
  Loader2,
  Lock,
  Map,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
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
  if (day.isFuture) {
    return "bg-[#f3f0ea] text-[#b0b6be] hover:bg-[#efebe3]";
  }
  if (day.attempted && day.correct === true) {
    return "bg-[#0d9488] text-white hover:brightness-95";
  }
  if (day.attempted && day.correct === false) {
    return "bg-[#ea580c] text-white hover:brightness-95";
  }
  if (day.isToday) {
    return "bg-[#ff6a1a] text-white hover:brightness-95";
  }
  return "bg-[#faf8f4] text-[#1c2434] hover:bg-[#fff4e8]";
}

function PotdSideRail({
  monthLabel,
  solved,
  missed,
  streak,
  xp,
}: {
  monthLabel: string;
  solved: number;
  missed: number;
  streak: number;
  xp: number;
}) {
  const { openPotd, today } = useLmsPotd();
  const potdSolved = Boolean(today?.attempted && today.attempt?.correct);
  const potdMissed = Boolean(today?.attempted && today.attempt && !today.attempt.correct);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[#e8e2d8] bg-white p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a929c]">
          Today&apos;s status
        </p>
        <p className="mt-1 text-[15px] font-extrabold text-[#1c2434]">
          {potdSolved ? "Solved" : potdMissed ? "Missed" : "Open to solve"}
        </p>
        <p className="mt-1 text-[13px] font-medium text-[#8a929c]">
          {streak}-day streak · {xp} XP
        </p>
        <button
          type="button"
          onClick={() => openPotd()}
          className={cn(
            "mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-extrabold transition",
            potdSolved
              ? "bg-[#e6f7f4] text-[#0d9488] hover:brightness-95"
              : potdMissed
                ? "bg-[#fff4e8] text-[#c2410c] hover:brightness-95"
                : "bg-[#ff6a1a] text-white hover:brightness-95",
          )}
        >
          {potdSolved ? "Review today" : potdMissed ? "See answer" : "Solve today"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="rounded-2xl border border-[#e8e2d8] bg-white p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a929c]">
          {monthLabel}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#e6f7f4] px-3 py-2.5">
            <p className="text-[1.15rem] font-extrabold text-[#0d9488]">{solved}</p>
            <p className="text-[11px] font-bold text-[#0d9488]/80">Solved</p>
          </div>
          <div className="rounded-xl bg-[#fff4e8] px-3 py-2.5">
            <p className="text-[1.15rem] font-extrabold text-[#c2410c]">{missed}</p>
            <p className="text-[11px] font-bold text-[#c2410c]/80">Missed</p>
          </div>
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-[#8a929c]">
          <Flame className="h-3.5 w-3.5 text-[#b45309]" />
          Correct POTD = +1 XP
        </p>
      </div>

      <nav className="space-y-2" aria-label="POTD shortcuts">
        <Link
          href="/learn/app/path"
          className="group flex items-start gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-3.5 transition hover:border-[#1c2434]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#ff6a1a]">
            <Map className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[14px] font-extrabold text-[#1c2434]">
              Continue path
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
            </span>
            <span className="mt-0.5 block text-[12px] font-medium leading-snug text-[#8a929c]">
              Lessons, videos &amp; quizzes
            </span>
          </span>
        </Link>

        <Link
          href={SYLLABUS_VIEW_HREF}
          className="group flex items-start gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-3.5 transition hover:border-[#1c2434]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef2ff] text-[#4f46e5]">
            <BookOpen className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[14px] font-extrabold text-[#1c2434]">
              Full syllabus
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
            </span>
            <span className="mt-0.5 block text-[12px] font-medium leading-snug text-[#8a929c]">
              All 60 lessons for parents
            </span>
          </span>
        </Link>

        <Link
          href="/learn/app/progress#points"
          className="group flex items-start gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-3.5 transition hover:border-[#1c2434]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6f7f4] text-[#0d9488]">
            <Sparkles className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[14px] font-extrabold text-[#1c2434]">
              Points &amp; badges
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
            </span>
            <span className="mt-0.5 block text-[12px] font-medium leading-snug text-[#8a929c]">
              Streaks · XP · leaderboard
            </span>
          </span>
        </Link>

        <Link
          href="/learn/app/practice"
          className="group flex items-start gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-3.5 transition hover:border-[#1c2434]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3efe7] text-[#5a6472]">
            <Library className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[14px] font-extrabold text-[#1c2434]">
              Practice arena
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
            </span>
            <span className="mt-0.5 block text-[12px] font-medium leading-snug text-[#8a929c]">
              200 syllabus questions · MCQ &amp; T/F
            </span>
          </span>
        </Link>

        <div className="rounded-2xl border border-dashed border-[#e8e2d8] bg-[#faf8f4] p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#a89f91]">
            Coming soon
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#8a929c]">
              <Gamepad2 className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-extrabold text-[#5a6472]">
                Play arena
              </span>
              <span className="block text-[11px] font-medium text-[#a89f91]">
                10 games on today’s idea
              </span>
            </span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-[#a89f91]">
              Soon
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
}

function PotdMobileShortcuts() {
  const { openPotd, today } = useLmsPotd();
  const potdDone = Boolean(today?.attempted);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
      <button
        type="button"
        onClick={() => openPotd()}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e8e2d8] bg-white px-3.5 py-2 text-[12px] font-extrabold text-[#1c2434]"
      >
        <Flame className="h-3.5 w-3.5 text-[#b45309]" />
        {potdDone ? "Review today" : "Solve today"}
      </button>
      <Link
        href="/learn/app/path"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e8e2d8] bg-white px-3.5 py-2 text-[12px] font-extrabold text-[#1c2434]"
      >
        <Map className="h-3.5 w-3.5 text-[#ff6a1a]" />
        Path
      </Link>
      <Link
        href={SYLLABUS_VIEW_HREF}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e8e2d8] bg-white px-3.5 py-2 text-[12px] font-extrabold text-[#1c2434]"
      >
        <BookOpen className="h-3.5 w-3.5 text-[#4f46e5]" />
        Syllabus
      </Link>
      <Link
        href="/learn/app/progress#points"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e8e2d8] bg-white px-3.5 py-2 text-[12px] font-extrabold text-[#1c2434]"
      >
        <Sparkles className="h-3.5 w-3.5 text-[#0d9488]" />
        Points
      </Link>
      <Link
        href="/learn/app/practice"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e8e2d8] bg-white px-3.5 py-2 text-[12px] font-extrabold text-[#1c2434]"
      >
        <Library className="h-3.5 w-3.5 text-[#5a6472]" />
        Practice
      </Link>
    </div>
  );
}

export function LmsPotdPage() {
  const { openPotd, attemptPatches, today, refreshToday } = useLmsPotd();
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month, setMonth] = useState(now.getUTCMonth() + 1);
  const [monthData, setMonthData] = useState<PotdMonthDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [enrollment, setEnrollment] = useState<LearnEnrollmentDto | null>(null);

  const loadMonth = useCallback(async (y: number, m: number) => {
    setLoadingMonth(true);
    setError(null);
    try {
      setMonthData(await fetchPotdMonth(y, m));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load calendar");
    } finally {
      setLoadingMonth(false);
    }
  }, []);

  useEffect(() => {
    void loadMonth(year, month);
  }, [year, month, loadMonth]);

  useEffect(() => {
    setEnrollment(readLearnEnrollmentLocal());
    void fetchLearnEnrollment().then(setEnrollment);
    if (!today) void refreshToday();
  }, [today, refreshToday]);

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
      return {
        ...d,
        attempted: true,
        correct: patch.correct,
      };
    });
    return [...pad, ...days];
  }, [monthData, attemptPatches]);

  const monthStats = useMemo(() => {
    if (!monthData) return { solved: 0, missed: 0 };
    let solved = 0;
    let missed = 0;
    for (const d of monthData.days) {
      const patch = attemptPatches[d.dateKey];
      const attempted = patch ? true : d.attempted;
      const correct = patch ? patch.correct : d.correct;
      if (!attempted) continue;
      if (correct) solved += 1;
      else missed += 1;
    }
    return { solved, missed };
  }, [monthData, attemptPatches]);

  const streak = enrollment?.progress?.streakDays ?? 0;
  const xp = enrollment?.progress?.xp ?? 0;
  const monthLabel = `${MONTHS[month - 1]} ${year}`;

  if (error && !monthData) {
    return (
      <p className="rounded-2xl bg-[#fff4e8] px-4 py-3 text-[14px] font-bold text-[#c2410c]">
        {error}
      </p>
    );
  }

  return (
    <div className="w-full pb-8">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_272px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-10">
        <div className="min-w-0 space-y-5">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#0d9488]">
              Daily challenge
            </p>
            <h1 className="mt-1 text-[1.65rem] font-extrabold text-[#1c2434] sm:text-[1.85rem]">
              Problem of the Day
            </h1>
            <p className="mt-1 text-[14px] font-medium text-[#8a929c]">
              Click any date to open that day&apos;s problem. Green = solved,
              orange = missed.
            </p>
          </div>

          <PotdMobileShortcuts />

          <div className="flex flex-wrap gap-3 text-[11px] font-bold text-[#5a6472]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff6a1a]" /> Today
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#0d9488]" /> Solved
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ea580c]" /> Missed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#e8e2d8]" /> Locked
            </span>
          </div>

          <section className="rounded-3xl border border-[#e8e2d8] bg-white p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="rounded-xl border border-[#e8e2d8] p-2 text-[#1c2434] hover:bg-[#faf8f4]"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-[1.1rem] font-extrabold text-[#1c2434]">
                {monthLabel}
              </h2>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="rounded-xl border border-[#e8e2d8] p-2 text-[#1c2434] hover:bg-[#faf8f4]"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {loadingMonth && !monthData ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-[#ff6a1a]" />
              </div>
            ) : (
              <>
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {WEEKDAYS.map((d) => (
                    <div
                      key={d}
                      className="py-1 text-center text-[11px] font-bold uppercase tracking-wide text-[#8a929c]"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
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
                          "relative flex aspect-square flex-col items-center justify-center rounded-xl text-[13px] font-extrabold transition sm:rounded-2xl sm:text-[15px]",
                          dayTone(day),
                        )}
                      >
                        {day.day}
                        {day.attempted ? (
                          <Check className="absolute bottom-1 h-2.5 w-2.5 opacity-90" />
                        ) : null}
                        {day.isFuture ? (
                          <Lock className="absolute bottom-1 h-2.5 w-2.5 opacity-60" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>

        <aside className="relative hidden lg:block">
          <div className="sticky top-4 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain">
            <PotdSideRail
              monthLabel={monthLabel}
              solved={monthStats.solved}
              missed={monthStats.missed}
              streak={streak}
              xp={xp}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
