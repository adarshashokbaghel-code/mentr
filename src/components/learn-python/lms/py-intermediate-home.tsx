"use client";

import { PythonBadge } from "@/components/learn-python/python-badge";
import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import {
  PY_INT_LESSON_INDEX,
  PY_LMS_PATH_TEST,
  getPyLesson,
  isPyEntryOpen,
  pyLessonHref,
} from "@/lib/python-lms";
import { PYTHON_INTERMEDIATE_CAPSTONE } from "@/lib/learn-python-intermediate";
import { pyTrackTheme } from "@/lib/python-lms/track-theme";
import { resumeStage } from "@/lib/python-lms/progress";
import { cn } from "@/lib/utils";
import { ArrowRight, Lock, Target } from "lucide-react";
import Link from "next/link";

const theme = pyTrackTheme("intermediate");

export function PyIntermediateHome() {
  const { progress, canAccessIntermediate, isLessonUnlocked, ready } = usePyLms();

  if (!ready) {
    return (
      <div className="flex justify-center py-24">
        <p className="font-mono text-[12px] text-muted">Loading course…</p>
      </div>
    );
  }

  if (!canAccessIntermediate) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <Lock className="mx-auto h-10 w-10 text-muted" />
        <h1 className="mt-4 text-[26px] font-extrabold">Python Intermediate is locked</h1>
        <p className="mt-2 text-[15px] text-muted">
          Pass the placement quiz (70%+) or finish Beginner through Functions (Lesson 9).
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href={PY_LMS_PATH_TEST} className="inline-flex items-center justify-center gap-2 bg-coral px-5 py-2.5 text-[14px] font-bold text-ink">
            Test to Intermediate <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/learnpython/lms" className="inline-flex items-center justify-center border border-ink px-5 py-2.5 text-[14px] font-bold text-ink">
            Beginner course
          </Link>
        </div>
      </div>
    );
  }

  const current =
    PY_INT_LESSON_INDEX.find(
      (l) => l.available && isLessonUnlocked(l.slug) && !progress[l.slug]?.completedAt,
    ) ?? PY_INT_LESSON_INDEX.find((l) => l.available && isLessonUnlocked(l.slug));

  const currentLesson = current ? getPyLesson(current.slug) : null;
  const currentP = current ? progress[current.slug] : undefined;

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <p className="font-mono text-[11.5px] text-muted">Job & internship prep</p>
      <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">Python Intermediate</h1>
      <p className="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed text-muted">
        Twelve structured lessons — specs, data structures, JSON, OOP and shipping — same Study → Examples → Practice loop.
      </p>

      <section
        className="mt-6 grid gap-6 border px-5 py-6 text-white sm:grid-cols-[auto_1fr] sm:items-center sm:px-7"
        style={{ borderColor: theme.heroBorder, background: theme.heroGradient }}
      >
        <PythonBadge tier="intermediate" idSuffix="home" className="mx-auto w-24 sm:mx-0" />
        <div className="min-w-0">
          {current && currentLesson ? (
            <>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: theme.accentLight }}>
                Continue
              </p>
              <h2 className="mt-1.5 text-[22px] font-extrabold leading-tight">
                Lesson {current.number}: {current.title}
              </h2>
              <p className="mt-1 text-[14.5px] text-white/60">
                {currentLesson.minutes} min · {currentLesson.notes.length} slides · {currentLesson.practice.length} questions
              </p>
              <Link
                href={`${pyLessonHref(current.slug)}?stage=${resumeStage(currentP)}`}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-bold text-ink transition hover:brightness-95"
                style={{ backgroundColor: theme.accentLight }}
              >
                {currentP?.notesSlide || currentP?.notesDone ? "Continue lesson" : "Start lesson"} <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <p className="text-[15px] text-white/70">More lessons rolling out weekly — Lesson 1 is live now.</p>
          )}
        </div>
      </section>

      <div className="mt-8 flex items-start gap-3 border border-hairline bg-cream/60 p-4">
        <Target className="mt-0.5 h-5 w-5 shrink-0" style={{ color: theme.accent }} />
        <div>
          <p className="text-[14px] font-bold text-ink">Capstone: {PYTHON_INTERMEDIATE_CAPSTONE.title}</p>
          <p className="mt-0.5 text-[13px] text-muted">{PYTHON_INTERMEDIATE_CAPSTONE.summary}</p>
        </div>
      </div>

      <ol className="mt-10 space-y-0 border border-hairline">
        {PY_INT_LESSON_INDEX.map((entry) => {
          const open = isPyEntryOpen(entry, isLessonUnlocked);
          const done = Boolean(progress[entry.slug]?.completedAt);
          const live = entry.available;
          return (
            <li key={entry.slug} className="border-b border-hairline last:border-b-0">
              {open && live ? (
                <Link
                  href={pyLessonHref(entry.slug)}
                  className="flex items-center justify-between gap-4 bg-white px-4 py-4 transition hover:bg-cream/50 sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[11px]" style={{ color: theme.accent }}>
                      Lesson {String(entry.number).padStart(2, "0")}
                    </p>
                    <p className="font-bold text-ink">{entry.title}</p>
                    <p className="truncate text-[13px] text-muted">{entry.subtitle}</p>
                  </div>
                  <span
                    className={cn("shrink-0 text-[12px] font-bold", !done && "text-ink")}
                    style={done ? { color: theme.accent } : undefined}
                  >
                    {done ? "Done" : "Open"} <ArrowRight className="inline h-3.5 w-3.5" />
                  </span>
                </Link>
              ) : (
                <div className="flex items-center justify-between gap-4 bg-cream/30 px-4 py-4 sm:px-5">
                  <div className="min-w-0 opacity-70">
                    <p className="font-mono text-[11px] text-muted">Lesson {String(entry.number).padStart(2, "0")}</p>
                    <p className="font-bold text-ink">{entry.title}</p>
                    <p className="truncate text-[13px] text-muted">{live ? "Finish previous lesson first" : "Coming soon"}</p>
                  </div>
                  <Lock className="h-4 w-4 shrink-0 text-muted" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
