"use client";

import { PythonBadge } from "@/components/learn-python/python-badge";
import { PyExamples } from "@/components/learn-python/lms/py-examples";
import { AchievementButton } from "@/components/learn-python/lms/py-badges";
import { Stars } from "@/components/learn-python/lms/py-game-ui";
import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import { PyNotesDeck } from "@/components/learn-python/lms/py-notes-deck";
import { PyPractice, type Outcome } from "@/components/learn-python/lms/py-practice";
import { PY_LESSON_INDEX, PY_LMS_BASE, getPyLesson, isPyEntryOpen, pyLessonHref } from "@/lib/python-lms";
import { downloadPythonNotesPdf } from "@/lib/python-lms/notes-pdf";
import { ACHIEVEMENT_ORDER, levelFor, starsFor } from "@/lib/python-lms/game";
import { PY_STAGES, resumeStage, stageDone } from "@/lib/python-lms/progress";
import type { LessonStage, PythonLmsLesson } from "@/lib/python-lms/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Clock, Download, Loader2, Lock, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function PyLessonPlayer({ slug }: { slug: string }) {
  const lesson = getPyLesson(slug);
  const entry = PY_LESSON_INDEX.find((l) => l.slug === slug);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-[620px] px-5 py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-coral">Coming soon</p>
        <h1 className="mt-2 text-[26px] font-extrabold">
          {entry ? `Lesson ${entry.number}: ${entry.title}` : "Lesson not found"}
        </h1>
        <p className="mt-3 text-[15px] text-muted">
          {entry ? "This lesson is being written. Lesson 1 is ready now." : "Pick a lesson from the course home."}
        </p>
        <Link href={PY_LMS_BASE} className="mt-6 inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[14px] font-bold text-white">
          Course home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return <Gate lesson={lesson} />;
}

function Gate({ lesson }: { lesson: PythonLmsLesson }) {
  const { ready, isLessonUnlocked } = usePyLms();
  if (isLessonUnlocked(lesson.slug)) return <Player lesson={lesson} />;
  if (!ready) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-coral" />
      </div>
    );
  }
  const prev = PY_LESSON_INDEX.find((l) => l.number === lesson.number - 1);
  return (
    <div className="mx-auto max-w-[620px] px-5 py-16 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center border border-hairline bg-white">
        <Lock className="h-5 w-5 text-muted" />
      </span>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-coral">Locked</p>
      <h1 className="mt-2 text-[26px] font-extrabold">
        Lesson {lesson.number}: {lesson.title}
      </h1>
      <p className="mt-3 text-[15px] text-muted">
        {prev
          ? `Go through every Study slide in Lesson ${prev.number}: ${prev.title} to open this lesson.`
          : "Finish the lesson before this one to open it."}
      </p>
      {prev && (
        <Link
          href={`${pyLessonHref(prev.slug)}?stage=notes`}
          className="mt-6 inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[14px] font-bold text-white"
        >
          Study Lesson {prev.number} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Player({ lesson }: { lesson: PythonLmsLesson }) {
  const { progress, store, updateLesson, resetPractice, unlock, isLessonUnlocked } = usePyLms();
  const router = useRouter();
  const params = useSearchParams();
  const p = progress[lesson.slug];
  const requested = params?.get("stage") as LessonStage | null;
  const stage: LessonStage = requested && PY_STAGES.some((s) => s.id === requested) ? requested : resumeStage(p);

  const goStage = useCallback(
    (s: LessonStage) => {
      router.replace(`${pyLessonHref(lesson.slug)}?stage=${s}`, { scroll: false });
      document.getElementById("py-lms-main")?.scrollTo({ top: 0 });
    },
    [router, lesson.slug],
  );

  const lastSlide = lesson.notes.length - 1;
  const onSlide = useCallback(
    (i: number) => {
      const slidesSeen = Math.max(i, store.lessons[lesson.slug]?.slidesSeen ?? 0);
      updateLesson(lesson.slug, {
        notesSlide: i,
        slidesSeen,
        ...(slidesSeen >= lastSlide ? { notesDone: true } : {}),
      });
    },
    [updateLesson, lesson.slug, store.lessons, lastSlide],
  );

  const nextEntry = PY_LESSON_INDEX.find((l) => l.number === lesson.number + 1);
  const [pdfBusy, setPdfBusy] = useState(false);

  async function downloadNotes() {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      await downloadPythonNotesPdf(lesson);
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[11.5px] text-muted">
            <span className="text-coral">Lesson {String(lesson.number).padStart(2, "0")}</span>
            <span aria-hidden>·</span>
            <Clock className="h-3.5 w-3.5" /> {lesson.minutes} min
          </p>
          <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]">{lesson.title}</h1>
          <p className="mt-1 text-[15px] text-muted">{lesson.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => void downloadNotes()}
          disabled={pdfBusy}
          className="inline-flex shrink-0 items-center gap-1.5 border border-ink bg-white px-3 py-2 text-[12.5px] font-bold text-ink transition hover:bg-ink hover:text-white disabled:opacity-60"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{pdfBusy ? "Preparing…" : "Notes PDF"}</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>

      <ol className="mt-5 grid grid-cols-3 border border-hairline bg-white" aria-label="Lesson steps">
        {PY_STAGES.map((s, i) => {
          const done = stageDone(p, s.id);
          const current = stage === s.id;
          return (
            <li key={s.id} className={cn(i > 0 && "border-l border-hairline")}>
              <button
                type="button"
                onClick={() => goStage(s.id)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "relative flex w-full items-center justify-center gap-2 px-2 py-3 text-[13px] font-bold transition sm:justify-start sm:px-4 sm:text-[14px]",
                  current ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[11px]",
                    done
                      ? "border-[#2f9e6e] bg-[#2f9e6e] text-white"
                      : current
                        ? "border-ink bg-ink text-white"
                        : "border-hairline",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                {s.label}
                {current && <span className="absolute inset-x-0 -bottom-px h-[3px] bg-coral" />}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-6">
        {stage === "notes" && (
          <PyNotesDeck
            slug={lesson.slug}
            slides={lesson.notes}
            startAt={p?.notesDone ? 0 : (p?.notesSlide ?? 0)}
            seenUpTo={p?.notesDone ? lesson.notes.length - 1 : (p?.slidesSeen ?? 0)}
            onSlide={onSlide}
            onFinish={() => {
              updateLesson(lesson.slug, { notesDone: true, slidesSeen: lastSlide });
              unlock("note-master");
              const checkIds = lesson.notes.flatMap((sl) => sl.blocks.filter((b) => b.type === "check").map((b) => (b as { id: string }).id));
              const checks = store.lessons[lesson.slug]?.checks ?? {};
              if (checkIds.length && checkIds.every((id) => checks[id] === true)) unlock("sharp-eye");
              goStage("examples");
            }}
          />
        )}
        {stage === "examples" && (
          <PyExamples
            slug={lesson.slug}
            examples={lesson.examples}
            onFinish={() => {
              updateLesson(lesson.slug, { examplesDone: true });
              goStage("practice");
            }}
          />
        )}
        {stage === "practice" && (
          <PyPractice
            slug={lesson.slug}
            questions={lesson.practice}
            onComplete={(score, total) => {
              const stars = starsFor(score, total);
              updateLesson(lesson.slug, {
                practice: { score, total },
                bestScore: Math.max(score, p?.bestScore ?? 0),
                stars: Math.max(stars, p?.stars ?? 0),
                completedAt: p?.completedAt ?? new Date().toISOString(),
              });
              if (score === total) unlock("flawless");
              if (lesson.number === 1) unlock("lesson-1");
            }}
            renderResults={({ outcomes, earned, bestCombo, retake }) => (
              <Results
                lesson={lesson}
                outcomes={outcomes}
                earned={earned}
                bestCombo={bestCombo}
                nextHref={nextEntry && isPyEntryOpen(nextEntry, isLessonUnlocked) ? pyLessonHref(nextEntry.slug) : null}
                nextLabel={nextEntry ? `Lesson ${nextEntry.number}: ${nextEntry.title}` : null}
                nextLockedReason={nextEntry?.available && !isLessonUnlocked(nextEntry.slug) ? "finish every Study slide first" : "coming soon"}
                onRetake={() => {
                  resetPractice(lesson.slug);
                  retake();
                }}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}

function Results({
  lesson,
  outcomes,
  earned,
  bestCombo,
  nextHref,
  nextLabel,
  nextLockedReason,
  onRetake,
}: {
  lesson: PythonLmsLesson;
  outcomes: Record<string, Outcome>;
  earned: number;
  bestCombo: number;
  nextHref: string | null;
  nextLabel: string | null;
  nextLockedReason: string;
  onRetake: () => void;
}) {
  const { store, xp, openGuide } = usePyLms();
  const total = lesson.practice.length;
  const score = lesson.practice.filter((q) => outcomes[q.id] && outcomes[q.id] !== "revealed").length;
  const firstTry = lesson.practice.filter((q) => outcomes[q.id] === "first").length;
  const stars = starsFor(score, total);
  const lvl = levelFor(xp);
  const verdict =
    stars === 3 ? "Outstanding. Three stars." : stars === 2 ? "Great work. Aim for 90% to get the third star." : "Lesson done. Retake to earn more stars.";

  return (
    <section className="py-pop border border-hairline bg-white">
      <div className="grid gap-6 border-b border-hairline bg-[#0f1612] px-5 py-7 text-white sm:grid-cols-[auto_1fr] sm:items-center sm:px-8">
        <PythonBadge tier="beginner" idSuffix="results" className="mx-auto w-24 sm:mx-0" />
        <div className="text-center sm:text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5ee0a0]">Lesson {lesson.number} complete</p>
          <div className="mt-2 flex flex-wrap items-end justify-center gap-x-4 gap-y-2 sm:justify-start">
            <p className="text-[42px] font-extrabold leading-none">
              {score}
              <span className="text-white/40"> / {total}</span>
            </p>
            <Stars count={stars} size={26} className="pb-1 text-white" />
          </div>
          <p className="mt-2 text-[15.5px] font-semibold text-white/80">{verdict}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 border-b border-hairline sm:grid-cols-4">
        {[
          { k: "XP earned", v: `+${earned}` },
          { k: "First try", v: `${firstTry} / ${total}` },
          { k: "Best combo", v: String(bestCombo) },
          { k: `Level · ${lvl.band.name}`, v: `${lvl.level} · ${lvl.title}` },
        ].map((s, i) => (
          <div key={s.k} className={cn("px-5 py-3.5", i % 2 && "border-l border-hairline", i >= 2 && "border-t border-hairline sm:border-t-0", i === 2 && "sm:border-l")}>
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{s.k}</dt>
            <dd className="mt-1 text-[17px] font-extrabold text-ink">{s.v}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 px-5 py-6 sm:px-8 md:grid-cols-2 [&>*]:min-w-0">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Your answers</p>
          <ul className="mt-3 divide-y divide-hairline border-y border-hairline">
            {lesson.practice.map((q, i) => (
              <li key={q.id} className="flex items-center gap-3 py-2 text-[13.5px]">
                <span className="w-6 font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 truncate">{q.skill}</span>
                {outcomes[q.id] === "first" ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#2f7a55]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} /> First try
                  </span>
                ) : outcomes[q.id] === "solved" ? (
                  <span className="font-mono text-[11px] font-semibold text-[#2f7a55]">Solved</span>
                ) : (
                  <span className="font-mono text-[11px] font-semibold text-[#c2410c]">Review this</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">You can now</p>
          <p className="mt-3 text-[16px] font-semibold leading-relaxed text-ink">{lesson.canDo}</p>
          <ul className="mt-4 space-y-1.5">
            {lesson.goals.map((g) => (
              <li key={g} className="flex gap-2 text-[14px] text-[#3d3a35]">
                <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#2f9e6e]" strokeWidth={3} /> {g}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-baseline justify-between gap-3">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
              Badges · {ACHIEVEMENT_ORDER.filter((id) => store.achievements[id]).length}/{ACHIEVEMENT_ORDER.length}
            </p>
            <button type="button" onClick={() => openGuide("achievements")} className="text-[12.5px] font-semibold text-ink underline underline-offset-4">
              See all
            </button>
          </div>
          <ul className="mt-3 grid grid-cols-5 gap-2">
            {ACHIEVEMENT_ORDER.map((id) => (
              <li key={id}>
                <AchievementButton id={id} size={46} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-hairline px-5 py-4 sm:px-8">
        {nextHref ? (
          <Link href={nextHref} className="inline-flex items-center gap-2 bg-[#2f9e6e] px-5 py-2.5 text-[14px] font-bold text-white hover:bg-[#278a5f]">
            Next: {nextLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          nextLabel && (
            <span className="inline-flex items-center gap-2 border border-dashed border-hairline px-4 py-2.5 text-[13.5px] font-semibold text-muted">
              <Lock className="h-3.5 w-3.5" /> {nextLabel}: {nextLockedReason}
            </span>
          )
        )}
        <Link href={PY_LMS_BASE} className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[14px] font-bold text-white hover:bg-black">
          Course home
        </Link>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-1.5 px-2 py-2.5 text-[14px] font-semibold text-muted hover:text-ink"
        >
          <RotateCcw className="h-4 w-4" /> Retake for more stars
        </button>
      </div>
    </section>
  );
}
