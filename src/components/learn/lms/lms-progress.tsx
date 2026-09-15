"use client";

import {
  LmsBadgesPanel,
  LmsCohortLeaderboard,
  previewYourRank,
} from "@/components/learn/lms/lms-cohort-board";
import { LmsPointsGuide } from "@/components/learn/lms/lms-points-guide";
import { LearnDino } from "@/components/landing/lp/learn-dino";
import {
  fetchLearnEnrollment,
  readLearnEnrollmentLocal,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";
import {
  fetchPotdMonth,
} from "@/lib/learn-progress-client";
import {
  countAllPotdCorrect,
  countRecentPotdCorrect,
  ensureWeekSnap,
  weekDeltas,
} from "@/lib/learn-week-stats";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  Clapperboard,
  Minus,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";

type Period = "week" | "overall";

function useCountUp(target: number, active: boolean, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 900;
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      setValue(decimals > 0 ? Math.round(next * 10 ** decimals) / 10 ** decimals : Math.round(next));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, decimals]);

  return value;
}

function AnimatedStat({
  label,
  value,
  suffix,
  prefix,
  icon: Icon,
  glow,
  tint,
  delayMs,
  footer,
  decimals = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: typeof Sparkles;
  glow: string;
  tint: string;
  delayMs: number;
  footer?: ReactNode;
  decimals?: number;
}) {
  const [ready, setReady] = useState(false);
  const shown = useCountUp(value, ready, decimals);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs, value]);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white p-3.5 animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both sm:p-4"
      style={{ animationDelay: `${delayMs}ms`, animationDuration: "550ms" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-35 blur-2xl transition group-hover:opacity-65"
        style={{ background: glow }}
      />
      <div className="relative flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            tint,
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
        {footer}
      </div>
      <p className="relative mt-3 text-[1.55rem] font-extrabold tabular-nums tracking-tight text-[#1c2434] sm:text-[1.75rem]">
        {prefix}
        {decimals > 0 ? shown.toFixed(decimals) : shown}
        {suffix ? (
          <span className="ml-1 text-[13px] font-bold text-[#8a929c]">{suffix}</span>
        ) : null}
      </p>
      <p className="relative mt-0.5 text-[12px] font-bold text-[#8a929c]">{label}</p>
    </div>
  );
}

function RankDeltaChip({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-[#e6f7f4] px-2 py-0.5 text-[11px] font-extrabold text-[#0d9488]">
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        +{delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fff4e8] px-2 py-0.5 text-[11px] font-extrabold text-[#c2410c]">
        <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        {delta}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#f3f0ea] px-2 py-0.5 text-[11px] font-extrabold text-[#8a929c]">
      <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
      0
    </span>
  );
}

export function LmsProgress() {
  const [enrollment, setEnrollment] = useState<LearnEnrollmentDto | null>(null);
  const [period, setPeriod] = useState<Period>("week");
  const [potdWeek, setPotdWeek] = useState(0);
  const [potdAll, setPotdAll] = useState(0);
  const [statsKey, setStatsKey] = useState(0);
  const filterId = useId();

  useEffect(() => {
    setEnrollment(readLearnEnrollmentLocal());
    void fetchLearnEnrollment().then(setEnrollment);

    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    void Promise.all([
      fetchPotdMonth(y, m),
      now.getDate() <= 7
        ? fetchPotdMonth(m === 1 ? y - 1 : y, m === 1 ? 12 : m - 1).catch(
            () => null,
          )
        : Promise.resolve(null),
    ])
      .then(([cur, prev]) => {
        if (!cur) {
          setPotdWeek(0);
          setPotdAll(0);
          return;
        }
        const weekDays = prev ? [...prev.days, ...cur.days] : cur.days;
        setPotdWeek(countRecentPotdCorrect(weekDays, 7));
        setPotdAll(countAllPotdCorrect(cur.days));
      })
      .catch(() => {
        setPotdWeek(0);
        setPotdAll(0);
      });
  }, []);

  const xp = enrollment?.progress?.xp ?? 0;
  const done = enrollment?.progress?.modulesCompleted?.length ?? 0;
  const videos = enrollment?.progress?.videosWatched?.length ?? 0;
  const quizzes = enrollment?.progress?.quizzesCompleted?.length ?? 0;
  const rank = previewYourRank(xp);

  const [weekly, setWeekly] = useState({
    videos: 0,
    xp: 0,
    potd: 0,
    rankDelta: 0,
    rankNow: rank,
  });

  useEffect(() => {
    if (!enrollment) return;
    const snap = ensureWeekSnap({ videos, xp, rank, potd: potdAll });
    setWeekly(weekDeltas({ videos, xp, rank, potd: potdAll }, snap));
  }, [enrollment, videos, xp, rank, potdAll]);

  const display =
    period === "week"
      ? {
          videos: weekly.videos,
          xp: weekly.xp,
          potd: potdWeek,
          rank,
          rankDelta: weekly.rankDelta,
          rankLabel: "Rank this week",
        }
      : {
          videos,
          xp,
          potd: potdAll,
          rank,
          rankDelta: 0,
          rankLabel: "Overall rank",
        };

  useEffect(() => {
    setStatsKey((k) => k + 1);
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <LearnDino size={52} action="cheer" className="h-[52px] w-[52px] shrink-0" />
          <div>
            <h1 className="text-[1.65rem] font-extrabold tracking-tight text-[#1c2434]">
              Progress
            </h1>
            <p className="mt-1 text-[14px] font-medium text-[#8a929c]">
              Points, XP, streak, badges, and cohort leaderboard.
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Progress period"
          className="inline-flex shrink-0 self-start rounded-2xl border border-[#e8e2d8] bg-[#faf8f4] p-1"
        >
          {(
            [
              { id: "week" as const, label: "This week" },
              { id: "overall" as const, label: "Overall" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="tab"
              id={`${filterId}-${opt.id}`}
              aria-selected={period === opt.id}
              onClick={() => setPeriod(opt.id)}
              className={cn(
                "rounded-xl px-3.5 py-2 text-[12px] font-extrabold transition",
                period === opt.id
                  ? "bg-[#1c2434] text-white shadow-sm"
                  : "text-[#8a929c] hover:text-[#1c2434]",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div key={statsKey} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AnimatedStat
          label={period === "week" ? "Videos this week" : "Videos watched"}
          value={display.videos}
          icon={Clapperboard}
          glow="#818cf8"
          tint="bg-[#eef2ff] text-[#4f46e5]"
          delayMs={40}
        />
        <AnimatedStat
          label={period === "week" ? "Points this week" : "Total points"}
          value={display.xp}
          suffix="XP"
          decimals={display.xp % 1 !== 0 ? 1 : 0}
          icon={Sparkles}
          glow="#ff6a1a"
          tint="bg-[#fff4e8] text-[#ff6a1a]"
          delayMs={120}
        />
        <AnimatedStat
          label={period === "week" ? "POTDs this week" : "POTDs this month"}
          value={display.potd}
          icon={CalendarCheck}
          glow="#14b8a6"
          tint="bg-[#e6f7f4] text-[#0d9488]"
          delayMs={200}
        />
        <AnimatedStat
          label={display.rankLabel}
          value={display.rank}
          prefix="#"
          icon={Trophy}
          glow="#f59e0b"
          tint="bg-[#fff8d6] text-[#b45309]"
          delayMs={280}
          footer={
            period === "week" ? (
              <RankDeltaChip delta={display.rankDelta} />
            ) : (
              <span className="rounded-full bg-[#f3f0ea] px-2 py-0.5 text-[11px] font-extrabold text-[#8a929c]">
                All time
              </span>
            )
          }
        />
      </div>

      {period === "week" ? (
        <p className="text-[12px] font-medium text-[#8a929c]">
          Weekly gains since Monday · rank chip shows climbs (+) or drops (−)
          vs week start.
        </p>
      ) : null}

      <div id="points" className="scroll-mt-4 grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <LmsPointsGuide className="min-h-[520px] lg:max-h-[640px]" />
        <LmsCohortLeaderboard xp={xp} className="min-h-[520px] lg:max-h-[640px]" />
      </div>

      <section className="rounded-2xl border border-[#e8e2d8] bg-white p-4 sm:p-5">
        <h2 className="text-[15px] font-extrabold text-[#1c2434]">
          Course completion
        </h2>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#efe6d8]">
          <div
            className="h-full rounded-full bg-[#ff6a1a] transition-all duration-700"
            style={{ width: `${Math.max(2, Math.round((done / 60) * 100))}%` }}
          />
        </div>
        <p className="mt-2 text-[13px] font-semibold text-[#8a929c]">
          {done} / 60 chapters · {videos} videos watched · {quizzes} quizzes done
        </p>
      </section>

      <LmsBadgesPanel xp={xp} />
    </div>
  );
}
