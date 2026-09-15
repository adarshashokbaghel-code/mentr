"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import { getModuleById, getTrackForModule } from "@/lib/learn-curriculum";
import {
  fetchLessonQuiz,
  submitLessonQuiz,
  type LearnQuizDifficulty,
  type LearnQuizQuestionDto,
} from "@/lib/learn-quiz";
import { hasLessonNotes } from "@/lib/learn-lesson-notes";
import { downloadLessonNotes } from "@/lib/learn-lesson-notes-pdf";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Download, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  hasWatchedVideo,
  recordVideoComplete,
  refreshLearnEnrollment,
} from "@/lib/learn-progress-client";
import type { LearnEnrollmentDto } from "@/lib/learn-enroll";

const DIFF_STYLES: Record<LearnQuizDifficulty, string> = {
  easy: "bg-[#e6f7f4] text-[#0d9488]",
  medium: "bg-[#fff4e8] text-[#ff6a1a]",
  hard: "bg-[#eef2ff] text-[#4f46e5]",
};

function WatchStage({
  onDone,
  videoSrc,
  captionsSrc,
  title,
  moduleId,
  saving,
}: {
  onDone: () => void;
  videoSrc?: string;
  captionsSrc?: string;
  title: string;
  moduleId: string;
  saving?: boolean;
}) {
  const [ended, setEnded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const notesAvailable = hasLessonNotes(moduleId);

  function formatTime(sec: number) {
    if (!Number.isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const progress =
    duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  if (videoSrc) {
    return (
      <div className="overflow-hidden rounded-3xl border border-[#e8e2d8] bg-[#0e131b]">
        <div className="relative aspect-video bg-black">
          <video
            key={videoSrc}
            className="h-full w-full"
            controls
            playsInline
            preload="metadata"
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => setEnded(true)}
          >
            <source src={videoSrc} type="video/mp4" />
            {captionsSrc ? (
              <track
                kind="captions"
                srcLang="en-IN"
                label="English (India)"
                src={captionsSrc}
                default
              />
            ) : null}
          </video>
        </div>
        <div className="space-y-3 border-t border-white/10 bg-[#0a0e14] px-4 py-3">
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#ff6a1a] transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12px] font-semibold text-white/50">
              {formatTime(current)} / {formatTime(duration)}
              {ended ? " · finished" : " · playing"}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {notesAvailable ? (
                <button
                  type="button"
                  onClick={() => downloadLessonNotes(moduleId)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[13px] font-extrabold text-white transition hover:bg-white/15"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download notes
                </button>
              ) : null}
              <button
                type="button"
                onClick={onDone}
                disabled={saving}
                className="rounded-full bg-[#ff6a1a] px-4 py-2 text-[13px] font-extrabold text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Mark complete → Quiz"}
              </button>
            </div>
          </div>
          <p className="text-[11px] font-medium text-white/40">
            {notesAvailable
              ? "Class notes PDF · simple words from this lesson script."
              : "You can mark complete anytime while watching."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8e2d8] bg-white p-5">
      <p className="text-[14px] font-bold text-[#1c2434]">{title}</p>
      <p className="mt-1 text-[13px] text-[#8a929c]">
        Video coming soon for this chapter.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {notesAvailable ? (
          <button
            type="button"
            onClick={() => downloadLessonNotes(moduleId)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e2d8] bg-[#faf8f4] px-4 py-2.5 text-[13px] font-extrabold text-[#1c2434]"
          >
            <Download className="h-3.5 w-3.5" />
            Download notes
          </button>
        ) : null}
        <button
          type="button"
          onClick={onDone}
          disabled={saving}
          className="rounded-full bg-[#ff6a1a] px-4 py-2.5 text-[13px] font-extrabold text-white"
        >
          {saving ? "Saving…" : "Mark complete → Quiz"}
        </button>
      </div>
    </div>
  );
}

function QuizStage({
  moduleId,
  onDone,
}: {
  moduleId: string;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string>("");
  const [questions, setQuestions] = useState<LearnQuizQuestionDto[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedIndex: number }[]
  >([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLessonQuiz(moduleId);
        if (cancelled) return;
        setQuestions(data.questions);
        setVideoId(data.lesson.videoId);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load quiz");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  const q = questions[index];
  const correct = picked !== null && q ? picked === q.correctIndex : false;

  async function goNext() {
    if (!q || picked === null) return;
    const nextAnswers = [
      ...answers.filter((a) => a.questionId !== q.questionId),
      { questionId: q.questionId, selectedIndex: picked },
    ];
    setAnswers(nextAnswers);

    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setPicked(null);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitLessonQuiz(moduleId, nextAnswers);
      setScore({ correct: result.correct, total: result.total });
    } catch {
      const localCorrect = nextAnswers.reduce((n, a) => {
        const item = questions.find((x) => x.questionId === a.questionId);
        return n + (item && item.correctIndex === a.selectedIndex ? 1 : 0);
      }, 0);
      setScore({ correct: localCorrect, total: questions.length });
    } finally {
      setSubmitting(false);
      setFinished(true);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-[#1c2434] bg-white px-4 py-16 shadow-[4px_4px_0_0_#0d9488]">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff6a1a]" />
        <p className="text-[14px] font-bold text-[#5a6472]">
          Loading quiz from lesson video…
        </p>
      </div>
    );
  }

  if (error || !q) {
    return (
      <div className="rounded-3xl border-2 border-[#1c2434] bg-white p-6 shadow-[4px_4px_0_0_#0d9488]">
        <p className="text-[15px] font-bold text-[#c2410c]">
          {error || "Quiz not available"}
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-4 rounded-2xl bg-[#1c2434] px-4 py-2.5 text-[14px] font-extrabold text-white"
        >
          Skip quiz
        </button>
      </div>
    );
  }

  if (finished && score) {
    return (
      <div className="rounded-3xl border-2 border-[#1c2434] bg-white p-5 shadow-[4px_4px_0_0_#0d9488] sm:p-6">
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#0d9488]">
          Quiz complete
        </p>
        <h2 className="mt-2 text-[1.35rem] font-extrabold text-[#1c2434]">
          You got {score.correct} / {score.total}
        </h2>
        <p className="mt-2 text-[14px] font-semibold text-[#5a6472]">
          Linked to video <span className="font-mono text-[12px]">{videoId}</span>
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-5 w-full rounded-2xl bg-[#1c2434] py-3 text-[15px] font-extrabold text-white"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-2 border-[#1c2434] bg-white p-4 shadow-[4px_4px_0_0_#0d9488] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">
          Quiz · Question {index + 1} / {questions.length}
        </p>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase",
            DIFF_STYLES[q.difficulty],
          )}
        >
          {q.difficulty}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0ebe3]">
        <div
          className="h-full rounded-full bg-[#0d9488] transition-all"
          style={{
            width: `${((index + (picked !== null ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>
      <p className="mt-4 text-[1.15rem] font-extrabold leading-snug text-[#1c2434] sm:text-[1.25rem]">
        {q.prompt}
      </p>
      <ul className="mt-5 space-y-2.5">
        {q.options.map((opt, i) => {
          const selected = picked === i;
          const isRight = i === q.correctIndex;
          return (
            <li key={`${q.questionId}-${i}`}>
              <button
                type="button"
                disabled={picked !== null}
                onClick={() => setPicked(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-[15px] font-bold transition",
                  picked === null &&
                    "border-[#e8e2d8] bg-[#faf8f4] hover:border-[#1c2434]",
                  selected && isRight && "border-[#0d9488] bg-[#e6f7f4] text-[#0d9488]",
                  selected && !isRight && "border-coral bg-[#fff4e8] text-[#c2410c]",
                  picked !== null && !selected && isRight && "border-[#0d9488] bg-[#e6f7f4]",
                  picked !== null && !selected && !isRight && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[13px] font-extrabold",
                    selected && isRight
                      ? "bg-[#0d9488] text-white"
                      : "bg-white text-[#8a929c]",
                  )}
                >
                  {selected && isRight ? (
                    <Check className="h-4 w-4" strokeWidth={2.75} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null ? (
        <div className="mt-4 space-y-3">
          <p
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-[13px] font-semibold",
              correct
                ? "bg-[#e6f7f4] text-[#0d9488]"
                : "bg-[#fff4e8] text-[#c2410c]",
            )}
          >
            {correct ? "Nice! " : "Almost — "}
            {q.explanation}
          </p>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void goNext()}
            className="w-full rounded-2xl bg-[#1c2434] py-3 text-[15px] font-extrabold text-white disabled:opacity-60"
          >
            {submitting
              ? "Saving…"
              : index + 1 < questions.length
                ? "Next question"
                : "Finish quiz"}
          </button>
        </div>
      ) : null}
    </div>
  );
}


function DoneStage({ moduleId }: { moduleId: string }) {
  return (
    <div className="rounded-3xl border border-[#e8e2d8] bg-white px-5 py-10 text-center">
      <LearnDino size={72} action="cheer" className="mx-auto h-[72px] w-[72px]" />
      <h2 className="mt-4 text-[1.35rem] font-extrabold text-[#1c2434]">
        Chapter complete
      </h2>
      <p className="mt-2 text-[14px] font-medium text-[#8a929c]">
        Video + quiz done for {moduleId}. Nice work!
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          href="/learn/app/path"
          className="rounded-full bg-[#1c2434] px-4 py-2.5 text-[14px] font-extrabold text-white"
        >
          Back to path
        </Link>
        <Link
          href="/learn/app"
          className="rounded-full bg-[#fff4e8] px-4 py-2.5 text-[14px] font-extrabold text-[#ff6a1a]"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

export function LmsLesson({ moduleId }: { moduleId: string }) {
  const mod = useMemo(() => getModuleById(moduleId), [moduleId]);
  const track = useMemo(() => getTrackForModule(moduleId), [moduleId]);
  const search = useSearchParams();
  const [enrollment, setEnrollment] = useState<LearnEnrollmentDto | null>(null);
  const [stage, setStage] = useState<"watch" | "quiz" | "done">("watch");
  const [savingVideo, setSavingVideo] = useState(false);
  const [localVideoDone, setLocalVideoDone] = useState(false);

  const videoDone =
    localVideoDone || hasWatchedVideo(enrollment, moduleId);

  useEffect(() => {
    void refreshLearnEnrollment().then(setEnrollment);
  }, []);

  useEffect(() => {
    const q = search.get("stage");
    if (q === "quiz") {
      if (videoDone || localVideoDone) setStage("quiz");
      else setStage("watch");
      return;
    }
    if (q === "watch") setStage("watch");
  }, [search, videoDone, localVideoDone]);

  async function finishVideo() {
    setSavingVideo(true);
    setLocalVideoDone(true);
    try {
      const next = await recordVideoComplete(moduleId);
      setEnrollment(next);
    } catch {
      /* local unlock */
    } finally {
      setSavingVideo(false);
      setStage("quiz");
    }
  }

  function goStage(next: "watch" | "quiz") {
    if (next === "quiz" && !videoDone) return;
    setStage(next);
  }

  if (!mod) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[16px] font-extrabold text-[#1c2434]">
          Lesson not found
        </p>
        <Link href="/learn/app" className="font-bold text-[#ff6a1a]">
          ← Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="flex items-start gap-3">
        <Link
          href="/learn/app/path"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#1c2434] ring-1 ring-[#e8e2d8]"
          aria-label="Back to curriculum"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#a89f91]">
            {mod.id}
            {track ? ` · ${track.shortLabel}` : ""}
          </p>
          <h1 className="text-[1.25rem] font-extrabold leading-tight text-[#1c2434] sm:text-[1.4rem]">
            {mod.title}
          </h1>
        </div>
      </div>

      {stage !== "done" ? (
        <div className="flex items-center gap-2">
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-1 rounded-full bg-[#f3efe7] p-1">
            <button
              type="button"
              onClick={() => goStage("watch")}
              className={cn(
                "rounded-full py-2.5 text-[13px] font-extrabold transition",
                stage === "watch"
                  ? "bg-white text-[#1c2434] shadow-sm"
                  : "text-[#8a929c]",
              )}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => goStage("quiz")}
              disabled={!videoDone}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-extrabold transition",
                stage === "quiz"
                  ? "bg-white text-[#1c2434] shadow-sm"
                  : "text-[#8a929c]",
                !videoDone && "opacity-50",
              )}
            >
              {!videoDone ? <Lock className="h-3.5 w-3.5" /> : null}
              Quiz
            </button>
          </div>
          <button
            type="button"
            disabled={!hasLessonNotes(moduleId)}
            onClick={() => downloadLessonNotes(moduleId)}
            title={
              hasLessonNotes(moduleId)
                ? "Download class notes"
                : "Notes coming soon"
            }
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[12px] font-extrabold transition sm:px-4 sm:text-[13px]",
              hasLessonNotes(moduleId)
                ? "border-[#e8e2d8] bg-white text-[#1c2434] hover:border-[#1c2434]"
                : "cursor-not-allowed border-[#efe6d8] bg-[#f3efe7] text-[#a89f91]",
            )}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Notes</span>
          </button>
        </div>
      ) : null}

      {stage === "watch" ? (
        <WatchStage
          title={mod.title}
          moduleId={moduleId}
          videoSrc={moduleId === "A1" ? "/learn/lessons/A1.mp4" : undefined}
          captionsSrc={moduleId === "A1" ? "/learn/lessons/A1.vtt" : undefined}
          saving={savingVideo}
          onDone={() => void finishVideo()}
        />
      ) : null}

      {stage === "quiz" ? (
        videoDone ? (
          <QuizStage moduleId={moduleId} onDone={() => setStage("done")} />
        ) : (
          <div className="rounded-2xl bg-white px-5 py-8 text-center ring-1 ring-[#ebe4d8]">
            <Lock className="mx-auto h-7 w-7 text-[#a89f91]" />
            <p className="mt-3 text-[15px] font-extrabold text-[#1c2434]">
              Quiz locked
            </p>
            <p className="mt-1 text-[13px] text-[#8a929c]">
              Mark the video complete first.
            </p>
            <button
              type="button"
              onClick={() => setStage("watch")}
              className="mt-4 rounded-full bg-[#ff6a1a] px-4 py-2 text-[13px] font-extrabold text-white"
            >
              Back to video
            </button>
          </div>
        )
      ) : null}

      {stage === "done" ? <DoneStage moduleId={moduleId} /> : null}
    </div>
  );
}
