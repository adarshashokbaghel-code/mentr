"use client";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { LearnDino } from "@/components/landing/lp/learn-dino";
import { LearnStartButton } from "@/components/landing/lp/learn-start-button";
import { LEARN_SHELL } from "@/components/landing/lp/learn-shell";
import {
  LEARN_MODULE_COUNT,
  LEARN_TRACKS,
  type LearnTrack,
} from "@/lib/learn-curriculum";
import { SUBJECT_SCOPE, SYLLABUS_VIEW_HREF, UNIT_GOALS } from "@/lib/learn-syllabus-doc";
import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  Flame,
  Gamepad2,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LearnEnrollModal } from "@/components/learn/learn-enroll-modal";
import { useAuth } from "@/components/auth/auth-provider";
import {
  fetchLearnEnrollment,
  LEARN_APP_HREF,
} from "@/lib/learn-enroll";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const INCLUDES = [
  {
    icon: BookOpen,
    title: `${LEARN_MODULE_COUNT} modules`,
    body: "CS, AI & Math for Class 3–5",
  },
  {
    icon: Play,
    title: "Watch → Quiz → Play",
    body: "Short narrated lessons every day",
  },
  {
    icon: Trophy,
    title: "Boss challenges",
    body: "Every 5 modules unlock the next unit",
  },
  {
    icon: Flame,
    title: "Streaks & XP",
    body: "Keep a daily habit without pressure",
  },
] as const;

const OUTCOME_UNITS: Record<string, { id: string; label: string }[]> = {
  cs: [
    { id: "cs-u1", label: "How computers work" },
    { id: "cs-u2", label: "Algorithms & logic" },
    { id: "cs-u3", label: "Block coding" },
    { id: "cs-u4", label: "Apps, robots & projects" },
  ],
  ai: [
    { id: "ai-u1", label: "AI is patterns" },
    { id: "ai-u2", label: "Training & labels" },
    { id: "ai-u3", label: "See / hear / chat" },
    { id: "ai-u4", label: "Fairness & privacy" },
  ],
  math: [
    { id: "math-u1", label: "Patterns & number sense" },
    { id: "math-u2", label: "Logic & sorting" },
    { id: "math-u3", label: "Grids & turns" },
    { id: "math-u4", label: "Estimate & decompose" },
  ],
};

function SyllabusTrack({ track }: { track: LearnTrack }) {
  const [open, setOpen] = useState(track.id === "cs");
  const moduleCount = track.units.reduce((n, u) => n + u.modules.length, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4"
      >
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white",
            track.letterBg,
          )}
        >
          {track.letter}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-[#1c2434]">{track.shortLabel}</p>
          <p className="text-[12px] text-[#8a929c]">
            {moduleCount} modules · {track.units.length} units
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-[#8a929c] transition",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="border-t border-[#f0ebe3] px-4 py-3 sm:px-5 sm:py-4">
          <ul className="space-y-4">
            {track.units.map((unit) => (
              <li key={unit.id}>
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">
                  {unit.title}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {unit.modules.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-start gap-2 text-[13px] text-[#5a6472]"
                    >
                      <span className="mt-0.5 font-semibold text-[#1c2434]">
                        {m.id}
                      </span>
                      <span>{m.title}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#0d9488]">
                  <Trophy className="h-3.5 w-3.5" />
                  Boss: {unit.bossChallenge}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

const COURSE_NAV = [
  { id: "included", label: "What's included" },
  { id: "outcomes", label: "Skills & outcomes" },
  { id: "lessons", label: "How lessons work" },
  { id: "syllabus", label: "Course syllabus" },
] as const;

function CourseNav({ className }: { className?: string }) {
  const [active, setActive] = useState<string>(COURSE_NAV[0].id);

  useEffect(() => {
    const syncActive = () => {
      // Highlight the last section whose top has crossed the sticky offset line
      const line = 140;
      let current: string = COURSE_NAV[0].id;
      for (const item of COURSE_NAV) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive(current);
    };

    syncActive();
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);
    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
  }, []);

  return (
    <nav
      aria-label="Course sections"
      className={cn(
        "rounded-2xl border border-[#e8e2d8] bg-white p-3 shadow-[0_8px_24px_rgba(28,36,52,0.05)]",
        className,
      )}
    >
      <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#8a929c]">
        On this page
      </p>
      <ul className="space-y-0.5">
        {COURSE_NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setActive(item.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] font-semibold transition",
                  isActive
                    ? "bg-[#fff4e8] text-[#ff6a1a] ring-1 ring-[#ff6a1a]/25"
                    : "text-[#5a6472] hover:bg-[#faf8f4] hover:text-[#1c2434]",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    isActive ? "bg-[#ff6a1a]" : "bg-[#d8d2c8]",
                  )}
                />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function EnrollCard({
  sticky,
  onEnroll,
  enrolled,
}: {
  sticky?: boolean;
  onEnroll: () => void;
  enrolled: boolean;
}) {
  return (
    <div className={cn(sticky && "lg:sticky lg:top-24 lg:space-y-3")}>
      <div className="rounded-2xl border border-[#e8e2d8] bg-white p-5 shadow-[0_16px_40px_rgba(28,36,52,0.08)] sm:p-6">
        <div className="flex items-end gap-2">
          <span className="text-[28px] font-extrabold tracking-tight text-[#1c2434] sm:text-[32px]">
            ₹0
          </span>
          <span className="mb-1.5 text-[16px] font-semibold text-[#8a929c] line-through">
            ₹999
          </span>
        </div>
        <p className="mt-1 text-[13px] font-medium text-[#0d9488]">
          {enrolled
            ? "You're enrolled · lifetime access"
            : "₹999 → ₹0 · free for Class 3–5"}
        </p>

        {enrolled ? (
          <LearnStartButton
            href={LEARN_APP_HREF}
            variant="enrolled"
            className="mt-4 w-full"
          >
            Explore course
          </LearnStartButton>
        ) : (
          <LearnStartButton asButton onClick={onEnroll} className="mt-4 w-full">
            Enroll for free
          </LearnStartButton>
        )}

        <ul className="mt-4 space-y-2">
          {(enrolled
            ? [
                "Full 60-module access unlocked",
                "Continue from Module A1",
                "Certificate path active",
              ]
            : [
                "Full 60-module access",
                "No credit card",
                "Start Module A1 today",
              ]
          ).map((line) => (
            <li
              key={line}
              className="flex items-center gap-2 text-[13px] font-medium text-[#5a6472]"
            >
              <Check className="h-4 w-4 shrink-0 text-[#0d9488]" strokeWidth={2.5} />
              {line}
            </li>
          ))}
        </ul>

        <Link
          href="/learn/syllabus"
          className="mt-4 inline-flex text-[13px] font-semibold text-[#ff6a1a] hover:underline"
        >
          See full parent syllabus →
        </Link>
      </div>

      {sticky ? <CourseNav className="hidden lg:block" /> : null}
    </div>
  );
}

export function LearnCoursePage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [checkingEnroll, setCheckingEnroll] = useState(true);

  const refreshEnrollment = useCallback(async () => {
    if (!user || user.role !== "parent") {
      setEnrolled(false);
      setCheckingEnroll(false);
      return;
    }
    setCheckingEnroll(true);
    try {
      const enrollment = await fetchLearnEnrollment();
      setEnrolled(!!enrollment);
    } finally {
      setCheckingEnroll(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void refreshEnrollment();
  }, [authLoading, refreshEnrollment]);

  useEffect(() => {
    if (authLoading || checkingEnroll) return;
    if (searchParams?.get("enroll") === "1") {
      if (enrolled) {
        router.replace(LEARN_APP_HREF);
        return;
      }
      setEnrollOpen(true);
      router.replace("/learn/start", { scroll: false });
    }
  }, [authLoading, checkingEnroll, enrolled, searchParams, router]);

  const openEnroll = () => setEnrollOpen(true);

  const closeEnroll = () => {
    setEnrollOpen(false);
    void refreshEnrollment();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8ef] via-[#faf8f4] to-[#f6f4ef]">
      <Navbar />

      <main className={cn(LEARN_SHELL, "pb-28 pt-6 sm:pb-16 sm:pt-10")}>
        <div className="mb-6 flex items-center gap-2 text-[13px] font-medium text-[#8a929c]">
          <Link href="/learn" className="hover:text-[#1c2434]">
            Mentr Learn
          </Link>
          <span>/</span>
          <span className="text-[#1c2434]">Class 3–5 course</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white shadow-[0_16px_40px_rgba(28,36,52,0.08)]">
              <div className="grid sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <div className="relative h-[200px] sm:h-[280px]">
                  <Image
                    src="/learn/demo/learn-course-hero.png"
                    alt="Mentr Learn course preview"
                    fill
                    priority
                    className="object-cover object-left"
                    sizes="(max-width: 640px) 100vw, 420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/40 sm:to-white" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <LearnDino size={32} className="h-8 w-8 shrink-0 drop-shadow" />
                    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#1c2434] shadow-sm">
                      Preview · Watch → Quiz → Play
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2.5 bg-gradient-to-br from-[#fff8ef] to-[#fff4e8] px-4 py-4 sm:px-5 sm:py-5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-[#ff6a1a] px-2.5 py-0.5 text-[11px] font-bold text-white">
                      Class 3–5
                    </span>
                    <span className="rounded-full bg-[#e6f7f4] px-2.5 py-0.5 text-[11px] font-bold text-[#0d9488]">
                      ₹0 forever
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#5a6472] ring-1 ring-[#e8e2d8]">
                      Self-paced
                    </span>
                  </div>
                  <h1 className="text-balance text-[1.25rem] font-extrabold leading-tight tracking-tight text-[#1c2434] sm:text-[1.5rem]">
                    Free course for Class 3–5 kids
                  </h1>
                  <p className="text-[13px] font-semibold leading-snug text-[#1c2434] sm:text-[14px]">
                    Three subjects:{" "}
                    <span className="text-[#ff6a1a]">Computer Science</span>,{" "}
                    <span className="text-[#7c6ad6]">AI</span> &{" "}
                    <span className="text-[#0d9488]">Math</span>
                  </p>
                  <p className="text-[12px] font-medium leading-snug text-[#5a6472] sm:text-[13px]">
                    Short narrated videos, practice games, and fun challenges —
                    about 15 minutes a day. Same free path as on{" "}
                    <Link href="/learn" className="font-bold text-[#ff6a1a] hover:underline">
                      Mentr Learn
                    </Link>
                    . Enroll once; your child starts Module 1 today.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 lg:hidden">
              <EnrollCard onEnroll={openEnroll} enrolled={enrolled} />
              <CourseNav />
            </div>

            <section id="included" className="mt-10 scroll-mt-28">
              <h2 className="text-[18px] font-bold text-[#1c2434] sm:text-[20px]">
                What&apos;s included
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {INCLUDES.map(({ icon: Icon, title, body }) => (
                  <div
                    key={title}
                    className="flex gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#ff6a1a]">
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-[#1c2434]">{title}</p>
                      <p className="mt-0.5 text-[13px] text-[#8a929c]">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="outcomes" className="mt-10 scroll-mt-28">
              <h2 className="text-[18px] font-bold text-[#1c2434] sm:text-[20px]">
                Skills your child leaves with
              </h2>
              <p className="mt-1.5 max-w-xl text-[13px] font-medium leading-relaxed text-[#5a6472] sm:text-[14px]">
                This is the Class 3–5 path from{" "}
                <Link href="/learn" className="font-bold text-[#ff6a1a] hover:underline">
                  Mentr Learn
                </Link>
                : concrete computer science, AI literacy, and math-for-coding —
                the same depth as our full syllabus, written so you can enroll with
                confidence.
              </p>

              <div className="mt-5 space-y-4">
                {SUBJECT_SCOPE.map((scope) => {
                  const track = LEARN_TRACKS.find((t) => t.id === scope.id);
                  if (!track) return null;
                  const units = OUTCOME_UNITS[scope.id] ?? [];
                  return (
                    <article
                      key={scope.id}
                      className="overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white shadow-[0_1px_3px_rgba(28,36,52,0.04)]"
                    >
                      <div
                        className={cn(
                          "flex items-start gap-3 border-b border-[#efe6d8] px-4 py-3.5 sm:px-5",
                          track.panelBg,
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white",
                            track.letterBg,
                          )}
                        >
                          {track.letter}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[15px] font-extrabold text-[#1c2434]">
                            {track.label}
                          </p>
                          <p className="mt-0.5 text-[12px] font-semibold text-[#5a6472]">
                            20 modules · 4 units · Easy → Apply
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
                        <p className="text-[13px] font-medium leading-relaxed text-[#1c2434] sm:text-[14px]">
                          {scope.howMuch}
                        </p>

                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a929c]">
                            Topics covered
                          </p>
                          <p className="mt-1.5 text-[12px] leading-relaxed text-[#5a6472] sm:text-[13px]">
                            {scope.include}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a1a]">
                            By the end, your child can
                          </p>
                          <ul className="mt-2 space-y-2">
                            {scope.outcomes.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2.5 text-[13px] font-semibold leading-snug text-[#1c2434] sm:text-[14px]"
                              >
                                <Check
                                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0d9488]"
                                  strokeWidth={2.75}
                                />
                                <span className="capitalize">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a929c]">
                            Unit milestones
                          </p>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {units.map((u, i) => {
                              const goals = UNIT_GOALS[u.id] ?? [];
                              return (
                                <div
                                  key={u.id}
                                  className="rounded-xl border border-[#efe6d8] bg-[#faf8f4] px-3 py-2.5"
                                >
                                  <p className="text-[12px] font-extrabold text-[#1c2434]">
                                    Unit {i + 1} · {u.label}
                                  </p>
                                  <ul className="mt-1.5 space-y-1">
                                    {goals.map((g) => (
                                      <li
                                        key={g}
                                        className="text-[11px] font-medium leading-snug text-[#5a6472]"
                                      >
                                        · {g}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <p className="rounded-xl bg-[#f6f4ef] px-3 py-2 text-[11px] font-medium leading-snug text-[#8a929c]">
                          Not in this course: {scope.exclude}
                        </p>
                      </div>
                    </article>
                  );
                })}

                <div className="flex gap-3 rounded-2xl border-2 border-[#1c2434] bg-white p-4 shadow-[3px_3px_0_0_#ff6a1a] sm:p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#ff6a1a]">
                    <Award className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-extrabold text-[#1c2434]">
                      Mentr Junior Graduate certificate
                    </p>
                    <p className="mt-1 text-[13px] font-medium leading-snug text-[#5a6472]">
                      Complete all 60 modules across CS, AI & Math and unlock a
                      shareable certificate — proof of a finished Class 3–5
                      foundation path, not a paywalled badge.
                    </p>
                    <Link
                      href={SYLLABUS_VIEW_HREF}
                      className="mt-2 inline-flex text-[13px] font-bold text-[#ff6a1a] hover:underline"
                    >
                      Read the full parent syllabus →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="lessons" className="mt-10 scroll-mt-28">
              <h2 className="text-[18px] font-bold text-[#1c2434] sm:text-[20px]">
                How each lesson works
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Play, label: "Watch", tint: "bg-[#fff4e8] text-[#ff6a1a]" },
                  { icon: BookOpen, label: "Quiz", tint: "bg-[#e6f7f4] text-[#0d9488]" },
                  { icon: Gamepad2, label: "Play", tint: "bg-[#eef2ff] text-[#4f46e5]" },
                  { icon: Trophy, label: "Boss", tint: "bg-[#fff8d6] text-[#b45309]" },
                ].map(({ icon: Icon, label, tint }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#e8e2d8] bg-white p-4 text-center"
                  >
                    <span
                      className={cn(
                        "mx-auto flex h-11 w-11 items-center justify-center rounded-xl",
                        tint,
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <p className="mt-2 text-[14px] font-bold text-[#1c2434]">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="syllabus" className="mt-10 scroll-mt-28">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-[18px] font-bold text-[#1c2434] sm:text-[20px]">
                  Course syllabus
                </h2>
                <p className="text-[13px] font-medium text-[#8a929c]">
                  <Sparkles className="mr-1 inline h-3.5 w-3.5 text-[#ff6a1a]" />
                  {LEARN_MODULE_COUNT} modules across 3 tracks
                </p>
              </div>
              <div className="mt-4 space-y-3">
                {LEARN_TRACKS.map((track) => (
                  <SyllabusTrack key={track.id} track={track} />
                ))}
              </div>
            </section>
          </div>

          <aside className="hidden lg:block">
            <EnrollCard sticky onEnroll={openEnroll} enrolled={enrolled} />
          </aside>
        </div>
      </main>

      {/* Mobile sticky enroll */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8e2d8] bg-white/95 p-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold text-[#1c2434]">
              ₹0{" "}
              <span className="text-[13px] font-semibold text-[#8a929c] line-through">
                ₹999
              </span>
            </p>
            <p className="text-[11px] font-medium text-[#0d9488]">
              {enrolled ? "You're enrolled" : "Free forever"}
            </p>
          </div>
          {enrolled ? (
            <LearnStartButton
              href={LEARN_APP_HREF}
              variant="enrolled"
              className="shrink-0"
            >
              Explore
            </LearnStartButton>
          ) : (
            <LearnStartButton asButton onClick={openEnroll} className="shrink-0">
              Enroll for free
            </LearnStartButton>
          )}
        </div>
      </div>

      <LearnEnrollModal
        open={enrollOpen}
        onClose={closeEnroll}
        onEnrolled={() => setEnrolled(true)}
      />
      <Footer />
    </div>
  );
}
