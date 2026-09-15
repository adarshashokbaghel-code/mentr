"use client";

import { LmsPointsTeaser } from "@/components/learn/lms/lms-points-guide";
import { LearnDino } from "@/components/landing/lp/learn-dino";
import { useLmsPotd } from "@/components/learn/lms/lms-potd-context";
import { LmsPotdSolve } from "@/components/learn/lms/lms-potd-solve";
import {
  SAMPLE_MODULE,
  SAMPLE_MODULE_ID,
  getModuleById,
} from "@/lib/learn-curriculum";
import {
  fetchLearnEnrollment,
  readLearnEnrollmentLocal,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";
import {
  hasCompletedQuiz,
  hasWatchedVideo,
} from "@/lib/learn-progress-client";
import {
  ArrowRight,
  BookOpen,
  Flame,
  Lock,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const UP_NEXT = ["A2", "A3", "A4"] as const;

const BADGES = [
  { src: "/learn/icons/learn-badge-spark.png", label: "Spark", earned: true },
  { src: "/learn/icons/learn-badge-cub.png", label: "Cub", earned: false },
  { src: "/learn/icons/learn-badge-nova.png", label: "Nova", earned: false },
  { src: "/learn/icons/learn-badge-ace.png", label: "Ace", earned: false },
] as const;

export function LmsHome() {
  const { openPotd, today, setToday, refreshToday, noteAttempt } = useLmsPotd();
  const [enrollment, setEnrollment] = useState<LearnEnrollmentDto | null>(null);
  const potdSolved = Boolean(today?.attempted && today.attempt?.correct);
  const potdMissed = Boolean(today?.attempted && today.attempt && !today.attempt.correct);

  const videoDone = hasWatchedVideo(enrollment, SAMPLE_MODULE_ID);
  const quizDone = hasCompletedQuiz(enrollment, SAMPLE_MODULE_ID);
  const xp = enrollment?.progress?.xp ?? 0;
  const streak = enrollment?.progress?.streakDays ?? 0;
  const videos = enrollment?.progress?.videosWatched?.length ?? 0;
  const quizzes = enrollment?.progress?.quizzesCompleted?.length ?? 0;

  useEffect(() => {
    setEnrollment(readLearnEnrollmentLocal());
    void fetchLearnEnrollment().then(setEnrollment);
    if (!today) void refreshToday();
  }, [today, refreshToday]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-start gap-3">
        <LearnDino size={56} action="wave" className="h-14 w-14 shrink-0" />
        <div>
          <p className="text-[13px] font-bold text-[#ff6a1a]">Welcome back</p>
          <h1 className="mt-0.5 text-[1.7rem] font-extrabold leading-tight tracking-tight text-[#1c2434] sm:text-[2rem]">
            Learning dashboard
          </h1>
          <p className="mt-1 text-[14px] font-medium text-[#8a929c]">
            Continue lessons, keep your streak, solve today&apos;s problem.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "XP",
            value: String(xp),
            icon: Sparkles,
            tint: "bg-[#fff4e8] text-[#ff6a1a]",
            onClick: () => openPotd(),
          },
          {
            label: "Streak",
            value: `${streak}d`,
            icon: Flame,
            tint: "bg-[#fff8d6] text-[#b45309]",
            onClick: () => openPotd(),
          },
          {
            label: "Videos",
            value: String(videos),
            icon: Play,
            tint: "bg-[#eef2ff] text-[#4338ca]",
            href: "/learn/app/path",
          },
          {
            label: "Quizzes",
            value: String(quizzes),
            icon: BookOpen,
            tint: "bg-[#e6f7f4] text-[#0d9488]",
            href: "/learn/app/progress",
          },
        ].map((s) => {
          const Icon = s.icon;
          const className =
            "flex items-center gap-3 rounded-2xl border border-[#e8e2d8] bg-white px-4 py-3.5 text-left transition hover:border-[#1c2434]";
          const body = (
            <>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.tint}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a929c]">
                  {s.label}
                </p>
                <p className="text-[1.2rem] font-extrabold text-[#1c2434]">
                  {s.value}
                </p>
              </div>
            </>
          );
          if ("onClick" in s && s.onClick) {
            return (
              <button
                key={s.label}
                type="button"
                onClick={s.onClick}
                className={className}
              >
                {body}
              </button>
            );
          }
          return (
            <Link key={s.label} href={s.href!} className={className}>
              {body}
            </Link>
          );
        })}
      </div>

      {/* Continue + POTD — equal height */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={`/learn/app/lesson/${SAMPLE_MODULE_ID}?stage=watch`}
          className="group relative mx-auto block h-[440px] w-full max-w-md overflow-hidden rounded-[1.75rem] shadow-[3px_3px_0_0_#ff6a1a] ring-2 ring-[#1c2434] transition hover:-translate-y-0.5 md:mx-0 md:max-w-none"
        >
          <Image
            src="/learn/learn-offer-video.png"
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c2434]/95 via-[#1c2434]/55 to-[#1c2434]/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-7 text-center text-white">
            <p className="text-[13px] font-bold uppercase tracking-wider text-[#ffb27a]">
              Continue · {SAMPLE_MODULE_ID}
            </p>
            <p className="mt-3 max-w-[15ch] text-[1.45rem] font-extrabold leading-snug sm:text-[1.55rem]">
              {SAMPLE_MODULE.title}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ff6a1a] px-5 py-2.5 text-[15px] font-extrabold">
              <Play className="h-4 w-4 fill-current" />
              {videoDone ? "Resume" : "Start"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
            <p className="mt-3 text-[13px] font-semibold text-white/75">
              {videoDone
                ? quizDone
                  ? "Video + quiz done"
                  : "Quiz unlocked"
                : "Watch, then quiz"}
            </p>
          </div>
        </Link>

        <section
          className={`mx-auto flex h-[440px] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] border-2 bg-white p-3.5 md:mx-0 md:max-w-none ${
            potdSolved
              ? "border-[#0d9488] shadow-[3px_3px_0_0_#0d9488]"
              : potdMissed
                ? "border-[#ea580c] shadow-[3px_3px_0_0_#ea580c]"
                : "border-[#1c2434] shadow-[3px_3px_0_0_#0d9488]"
          }`}
        >
          <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
            <p className="text-[13px] font-extrabold text-[#1c2434]">
              POTD
              <span
                className={`ml-2 text-[11px] font-bold ${
                  potdSolved
                    ? "text-[#0d9488]"
                    : potdMissed
                      ? "text-[#c2410c]"
                      : "text-[#ff6a1a]"
                }`}
              >
                {potdSolved ? "Solved" : potdMissed ? "Attempted" : "Today"}
              </span>
            </p>
            <Link
              href="/learn/app/potd"
              className="text-[11px] font-bold text-[#8a929c] hover:text-[#0d9488]"
            >
              Calendar →
            </Link>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
            <LmsPotdSolve
              data={today}
              loading={!today}
              compact
              onAttempted={(next) => {
                setToday(next);
                if (next.attempt) {
                  noteAttempt(next.dateKey, next.attempt.correct);
                }
              }}
            />
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#e8e2d8] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold text-[#1c2434]">
              Up next
            </h2>
            <Link
              href="/learn/app/path"
              className="text-[12px] font-bold text-[#ff6a1a] hover:underline"
            >
              Full path
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {UP_NEXT.map((id) => {
              const mod = getModuleById(id);
              if (!mod) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-2xl border border-[#f0ebe3] bg-[#faf8f4] px-3.5 py-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#8a929c]">
                    <Lock className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-[#8a929c]">{id}</p>
                    <p className="truncate text-[14px] font-bold text-[#1c2434]">
                      {mod.title}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-3xl border border-[#e8e2d8] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[16px] font-extrabold text-[#1c2434]">
              Your badges
            </h2>
            <Link
              href="/learn/app/progress"
              className="inline-flex items-center gap-1 text-[12px] font-bold text-[#ff6a1a] hover:underline"
            >
              <Trophy className="h-3.5 w-3.5" />
              Progress
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {BADGES.map((b) => (
              <div
                key={b.label}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 ${
                  b.earned
                    ? "border-[#ff6a1a]/40 bg-[#fff4e8]"
                    : "border-[#f0ebe3] bg-[#faf8f4] opacity-55"
                }`}
              >
                <Image
                  src={b.src}
                  alt={b.label}
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                />
                <p className="text-[11px] font-extrabold text-[#1c2434]">
                  {b.label}
                </p>
                <p className="text-[10px] font-bold text-[#8a929c]">
                  {b.earned ? "Earned" : "Locked"}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] font-medium text-[#8a929c]">
            Finish lessons and POTDs to unlock Cub, Nova, and Ace.
          </p>
        </section>
      </div>

      <LmsPointsTeaser />
    </div>
  );
}
