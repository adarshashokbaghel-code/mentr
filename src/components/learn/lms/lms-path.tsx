"use client";

import { useLmsPotd } from "@/components/learn/lms/lms-potd-context";
import {
  LEARN_TRACKS,
  SAMPLE_MODULE_ID,
  type LearnTrackId,
} from "@/lib/learn-curriculum";
import type { LearnEnrollmentDto } from "@/lib/learn-enroll";
import {
  fetchLearnEnrollment,
  readLearnEnrollmentLocal,
} from "@/lib/learn-enroll";
import {
  hasCompletedQuiz,
  hasWatchedVideo,
} from "@/lib/learn-progress-client";
import { hasLessonNotes } from "@/lib/learn-lesson-notes";
import { downloadLessonNotes } from "@/lib/learn-lesson-notes-pdf";
import {
  SYLLABUS_DOWNLOAD_HREF,
  SYLLABUS_VIEW_HREF,
} from "@/lib/learn-syllabus-doc";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Blocks,
  BookOpen,
  CalendarDays,
  Check,
  Download,
  Gamepad2,
  Library,
  Lock,
  Play,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function PathSideRail({
  done,
  xp,
  trackLabel,
}: {
  done: number;
  xp: number;
  trackLabel: string;
}) {
  const { openPotd, today } = useLmsPotd();
  const potdDone = Boolean(today?.attempted);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[#e8e2d8] bg-white p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a929c]">
          This path
        </p>
        <p className="mt-1 text-[15px] font-extrabold text-[#1c2434]">
          {trackLabel}
        </p>
        <p className="mt-1 text-[13px] font-medium text-[#8a929c]">
          {done}/60 chapters · {xp} XP
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#efe6d8]">
          <div
            className="h-full rounded-full bg-[#ff6a1a]"
            style={{
              width: `${Math.max(2, Math.min(100, Math.round((done / 60) * 100)))}%`,
            }}
          />
        </div>
      </div>

      <nav className="space-y-2" aria-label="Path shortcuts">
        <Link
          href={SYLLABUS_VIEW_HREF}
          className="group flex items-start gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-3.5 transition hover:border-[#1c2434]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#ff6a1a]">
            <BookOpen className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[14px] font-extrabold text-[#1c2434]">
              Full syllabus
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
            </span>
            <span className="mt-0.5 block text-[12px] font-medium leading-snug text-[#8a929c]">
              All 60 lessons for parents — what they watch &amp; practise
            </span>
          </span>
        </Link>

        <Link
          href={SYLLABUS_DOWNLOAD_HREF}
          className="group flex items-start gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-3.5 transition hover:border-[#1c2434]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef2ff] text-[#4f46e5]">
            <Download className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[14px] font-extrabold text-[#1c2434]">
              Syllabus PDF
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
            </span>
            <span className="mt-0.5 block text-[12px] font-medium leading-snug text-[#8a929c]">
              One-page download to share at home
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => openPotd()}
          className="group flex w-full items-start gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-3.5 text-left transition hover:border-[#1c2434]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff8d6] text-[#b45309]">
            <CalendarDays className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 text-[14px] font-extrabold text-[#1c2434]">
              Today&apos;s POTD
              {potdDone ? (
                <span className="rounded-full bg-[#e6f7f4] px-2 py-0.5 text-[10px] font-extrabold text-[#0d9488]">
                  Done
                </span>
              ) : (
                <span className="rounded-full bg-[#fff4e8] px-2 py-0.5 text-[10px] font-extrabold text-[#ff6a1a]">
                  +1 XP
                </span>
              )}
            </span>
            <span className="mt-0.5 block text-[12px] font-medium leading-snug text-[#8a929c]">
              {potdDone
                ? "Solved for today — keep the streak going"
                : "Quick daily problem · keep your streak"}
            </span>
          </span>
        </button>

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
              How XP works · cohort leaderboard
            </span>
          </span>
        </Link>

        <Link
          href="/learn/app/build"
          className="group flex items-start gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-3.5 transition hover:border-[#1c2434]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#ff6a1a]">
            <Blocks className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[14px] font-extrabold text-[#1c2434]">
              Build arena
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
            </span>
            <span className="mt-0.5 block text-[12px] font-medium leading-snug text-[#8a929c]">
              Blockly missions · drag, drop, run
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

function PathMobileShortcuts() {
  const { openPotd, today } = useLmsPotd();
  const potdDone = Boolean(today?.attempted);

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
      <Link
        href={SYLLABUS_VIEW_HREF}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e8e2d8] bg-white px-3.5 py-2 text-[12px] font-extrabold text-[#1c2434]"
      >
        <BookOpen className="h-3.5 w-3.5 text-[#ff6a1a]" />
        Syllabus
      </Link>
      <button
        type="button"
        onClick={() => openPotd()}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e8e2d8] bg-white px-3.5 py-2 text-[12px] font-extrabold text-[#1c2434]"
      >
        <CalendarDays className="h-3.5 w-3.5 text-[#b45309]" />
        {potdDone ? "POTD done" : "Today’s POTD"}
      </button>
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

export function LmsPath() {
  const [trackId, setTrackId] = useState<LearnTrackId>("cs");
  const [enrollment, setEnrollment] = useState<LearnEnrollmentDto | null>(null);
  const track = LEARN_TRACKS.find((t) => t.id === trackId)!;

  useEffect(() => {
    setEnrollment(readLearnEnrollmentLocal());
    void fetchLearnEnrollment().then(setEnrollment);
  }, []);

  const stats = useMemo(() => {
    const done = enrollment?.progress?.modulesCompleted?.length ?? 0;
    const xp = enrollment?.progress?.xp ?? 0;
    return { done, xp, pct: Math.min(100, Math.round((done / 60) * 100)) };
  }, [enrollment]);

  return (
    <div className="w-full pb-8">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_272px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-10">
        <div className="min-w-0">
          <header className="relative sticky top-0 z-30 -mx-4 mb-4 space-y-3 border-b border-[#efe6d8] bg-[#f6f4f0] px-4 pb-3 pt-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {/* Solid covers so scrolled content cannot show through */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-[#f6f4f0]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 top-0 -z-10 bg-[#f6f4f0]"
            />
            <div className="relative space-y-2.5">
              <div className="flex items-baseline justify-between gap-4">
                <h1 className="text-[1.5rem] font-extrabold tracking-tight text-[#1c2434]">
                  Path
                </h1>
                <p className="truncate text-[13px] font-medium text-[#8a929c]">
                  {stats.done}/60 · {stats.xp} XP
                  <span className="hidden sm:inline"> · scroll for next units</span>
                </p>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#efe6d8]">
                <div
                  className="h-full rounded-full bg-[#ff6a1a] transition-[width] duration-300"
                  style={{ width: `${Math.max(stats.pct, 2)}%` }}
                />
              </div>
            </div>

            <div className="relative grid w-full grid-cols-3 gap-1 rounded-2xl bg-[#efebe3] p-1">
              {LEARN_TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTrackId(t.id)}
                  className={cn(
                    "rounded-xl py-2.5 text-[13px] font-extrabold transition",
                    trackId === t.id
                      ? "bg-white text-[#1c2434] shadow-sm"
                      : "text-[#8a929c] hover:text-[#5a6472]",
                  )}
                >
                  {t.id === "cs" ? "CS" : t.id === "ai" ? "AI" : "Math"}
                </button>
              ))}
            </div>
          </header>

          <PathMobileShortcuts />

          <div className="space-y-10">
            {track.units.map((unit, ui) => (
              <section
                key={unit.id}
                id={`unit-${unit.id}`}
                className="scroll-mt-40"
              >
                <div className="mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a1a]">
                    Unit {String(ui + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-1 text-[1.2rem] font-extrabold text-[#1c2434]">
                    {unit.title}
                  </h2>
                  <p className="mt-1 text-[12px] font-semibold text-[#8a929c]">
                    Boss later · {unit.bossChallenge.split("—")[0]?.trim()}
                  </p>
                </div>
                <ol className="relative">
                  <div
                    className="absolute bottom-8 left-[19px] top-8 w-0.5 bg-[#efe6d8]"
                    aria-hidden
                  />
                  {unit.modules.map((m, idx) => {
                    const canOpen =
                      m.id === SAMPLE_MODULE_ID ||
                      hasWatchedVideo(enrollment, m.id) ||
                      hasCompletedQuiz(enrollment, m.id);
                    const videoDone = hasWatchedVideo(enrollment, m.id);
                    const quizDone = hasCompletedQuiz(enrollment, m.id);
                    const done = videoDone && quizDone;

                    return (
                      <li key={m.id} className="relative flex gap-3 pb-4">
                        <div
                          className={cn(
                            "relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-[12px] font-extrabold",
                            done
                              ? "border-[#0d9488] bg-[#0d9488] text-white"
                              : canOpen
                                ? "border-[#ff6a1a] bg-[#fff4e8] text-[#ff6a1a]"
                                : "border-[#e8e2d8] bg-white text-[#a89f91]",
                          )}
                        >
                          {done ? <Check className="h-4 w-4" /> : idx + 1}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border border-[#e8e2d8] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-[#a89f91]">
                              {m.id}
                            </p>
                            <p className="mt-0.5 text-[15px] font-extrabold leading-snug text-[#1c2434]">
                              {m.title}
                            </p>
                          </div>

                          <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                            {canOpen ? (
                              <Link
                                href={`/learn/app/lesson/${m.id}?stage=watch`}
                                className={cn(
                                  "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-[12px] font-extrabold sm:w-[4.75rem] sm:flex-none",
                                  videoDone
                                    ? "bg-[#e6f7f4] text-[#0d9488]"
                                    : "bg-[#fff4e8] text-[#ff6a1a]",
                                )}
                              >
                                {videoDone ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                )}
                                Video
                              </Link>
                            ) : (
                              <span className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f3efe7] text-[12px] font-extrabold text-[#a89f91] sm:w-[4.75rem] sm:flex-none">
                                <Lock className="h-3.5 w-3.5" />
                                Video
                              </span>
                            )}

                            {videoDone ? (
                              <Link
                                href={`/learn/app/lesson/${m.id}?stage=quiz`}
                                className={cn(
                                  "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-[12px] font-extrabold sm:w-[4.75rem] sm:flex-none",
                                  quizDone
                                    ? "bg-[#e6f7f4] text-[#0d9488]"
                                    : "bg-[#eef2ff] text-[#4f46e5]",
                                )}
                              >
                                {quizDone ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <BookOpen className="h-3.5 w-3.5" />
                                )}
                                Quiz
                              </Link>
                            ) : (
                              <span className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f3efe7] text-[12px] font-extrabold text-[#a89f91] sm:w-[4.75rem] sm:flex-none">
                                <Lock className="h-3.5 w-3.5" />
                                Quiz
                              </span>
                            )}

                            <button
                              type="button"
                              disabled={!hasLessonNotes(m.id)}
                              onClick={() => downloadLessonNotes(m.id)}
                              title={
                                hasLessonNotes(m.id)
                                  ? "Download notes"
                                  : "Notes coming soon"
                              }
                              aria-label={
                                hasLessonNotes(m.id)
                                  ? "Download notes"
                                  : "Notes coming soon"
                              }
                              className={cn(
                                "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl px-2.5 text-[12px] font-extrabold transition sm:px-3",
                                hasLessonNotes(m.id)
                                  ? "bg-[#faf8f4] text-[#1c2434] ring-1 ring-[#e8e2d8] hover:bg-[#fff4e8] hover:text-[#ff6a1a]"
                                  : "cursor-not-allowed bg-[#f3efe7] text-[#a89f91]",
                              )}
                            >
                              <Download className="h-3.5 w-3.5" />
                              Notes
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {ui < track.units.length - 1 ? (
                  <p className="mt-2 text-center text-[11px] font-bold text-[#c4b8a5]">
                    ↓ Next unit
                  </p>
                ) : null}
              </section>
            ))}
          </div>
        </div>

        <aside className="relative hidden lg:block">
          <div className="sticky top-4 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain">
            <PathSideRail
              done={stats.done}
              xp={stats.xp}
              trackLabel={track.shortLabel || track.label}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
