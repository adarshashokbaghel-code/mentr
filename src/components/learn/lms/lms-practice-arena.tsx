"use client";

import { LmsPracticeSolvePopup } from "@/components/learn/lms/lms-practice-solve";
import type { LearnTrackId } from "@/lib/learn-curriculum";
import {
  PRACTICE_BANK_TOTAL,
  PRACTICE_QUESTIONS,
  getPracticeQuestions,
  practiceModuleMeta,
  practiceTrackCounts,
  type PracticeQuestion,
  type PracticeQuestionType,
} from "@/lib/learn-practice-bank";
import {
  readPracticeAnswers,
  type PracticeAnswerMap,
} from "@/lib/learn-practice-client";
import { cn } from "@/lib/utils";
import {
  Blocks,
  Check,
  CircleHelp,
  Library,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TrackFilter = "all" | LearnTrackId;
type TypeFilter = "all" | PracticeQuestionType;

const TRACK_TABS: { id: TrackFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cs", label: "CS" },
  { id: "ai", label: "AI" },
  { id: "math", label: "Math" },
];

function trackTint(trackId: LearnTrackId) {
  switch (trackId) {
    case "cs":
      return "bg-[#fff4e8] text-[#c2410c]";
    case "ai":
      return "bg-[#eef2ff] text-[#4f46e5]";
    case "math":
      return "bg-[#e6f7f4] text-[#0d9488]";
  }
}

export function LmsPracticeArena() {
  const [track, setTrack] = useState<TrackFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [answers, setAnswers] = useState<PracticeAnswerMap>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setAnswers(readPracticeAnswers());
  }, []);

  const counts = useMemo(() => practiceTrackCounts(), []);

  const filtered = useMemo(
    () => getPracticeQuestions({ trackId: track, type }),
    [track, type],
  );

  const solved = useMemo(() => {
    let n = 0;
    for (const q of PRACTICE_QUESTIONS) {
      if (answers[q.id]) n += 1;
    }
    return n;
  }, [answers]);

  const correctCount = useMemo(() => {
    let n = 0;
    for (const q of PRACTICE_QUESTIONS) {
      if (answers[q.id]?.correct) n += 1;
    }
    return n;
  }, [answers]);

  function openQuestion(q: PracticeQuestion) {
    setActiveId(q.id);
  }

  return (
    <div className="w-full space-y-5 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">
            Practice arena
          </p>
          <h1 className="mt-1 text-[1.65rem] font-extrabold tracking-tight text-[#1c2434] sm:text-[1.85rem]">
            Question bank
          </h1>
          <p className="mt-1 max-w-xl text-[14px] font-medium text-[#8a929c]">
            {PRACTICE_BANK_TOTAL} questions from the full CS · AI · Math syllabus.
            Tap a card to solve — next and back slide through the set.
          </p>
        </div>

        <div className="inline-flex self-start rounded-2xl bg-[#efebe3] p-1 sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-[13px] font-extrabold text-[#1c2434] shadow-sm">
            <Library className="h-4 w-4" />
            Question bank
          </span>
          <Link
            href="/learn/app/build"
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[13px] font-extrabold text-[#8a929c] transition hover:text-[#1c2434]"
          >
            <Blocks className="h-4 w-4" />
            Build
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total",
            value: String(PRACTICE_BANK_TOTAL),
            tint: "bg-[#fff4e8] text-[#ff6a1a]",
            icon: Library,
          },
          {
            label: "Tried",
            value: String(solved),
            tint: "bg-[#eef2ff] text-[#4f46e5]",
            icon: CircleHelp,
          },
          {
            label: "Correct",
            value: String(correctCount),
            tint: "bg-[#e6f7f4] text-[#0d9488]",
            icon: Check,
          },
          {
            label: "Points",
            value: String(correctCount),
            tint: "bg-[#fff8d6] text-[#b45309]",
            icon: Sparkles,
          },
        ].map(({ label, value, tint, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#e8e2d8] bg-white px-3.5 py-3"
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                tint,
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <p className="mt-2 text-[1.25rem] font-extrabold text-[#1c2434]">
              {value}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a929c]">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold text-[#8a929c]">
        <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-[#e8e2d8]">
          CS {counts.cs}
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-[#e8e2d8]">
          AI {counts.ai}
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-[#e8e2d8]">
          Math {counts.math}
        </span>
        <span className="text-[#c4b8a5]">·</span>
        <span>Equal split across the full syllabus</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-2xl bg-[#efebe3] p-1">
          {TRACK_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrack(t.id)}
              className={cn(
                "rounded-xl px-3.5 py-2 text-[13px] font-extrabold transition",
                track === t.id
                  ? "bg-white text-[#1c2434] shadow-sm"
                  : "text-[#8a929c]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-2xl bg-[#efebe3] p-1">
          {(
            [
              { id: "all", label: "All types" },
              { id: "mcq", label: "MCQ" },
              { id: "true_false", label: "T/F" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={cn(
                "rounded-xl px-3.5 py-2 text-[13px] font-extrabold transition",
                type === t.id
                  ? "bg-white text-[#1c2434] shadow-sm"
                  : "text-[#8a929c]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((q, i) => {
          const ans = answers[q.id];
          const meta = practiceModuleMeta(q.moduleId);
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => openQuestion(q)}
              className={cn(
                "group flex flex-col rounded-2xl border bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:border-[#1c2434]",
                ans?.correct
                  ? "border-[#0d9488]/40 shadow-[2px_2px_0_0_#0d9488]"
                  : ans
                    ? "border-[#ea580c]/35 shadow-[2px_2px_0_0_#ea580c]"
                    : "border-[#e8e2d8] shadow-[2px_2px_0_0_#efe6d8]",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold text-[#a89f91]">
                  #{String(i + 1).padStart(3, "0")} · {q.id}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase",
                    trackTint(q.trackId),
                  )}
                >
                  {q.trackId}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[14px] font-extrabold leading-snug text-[#1c2434]">
                {q.prompt}
              </p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                <span className="text-[11px] font-bold text-[#8a929c]">
                  {q.moduleId}
                  {meta ? ` · ${meta.moduleTitle}` : ""}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                    q.type === "true_false"
                      ? "bg-[#fff8d6] text-[#b45309]"
                      : "bg-[#f3efe7] text-[#5a6472]",
                    ans?.correct && "bg-[#e6f7f4] text-[#0d9488]",
                    ans && !ans.correct && "bg-[#fff4e8] text-[#c2410c]",
                  )}
                >
                  {ans?.correct
                    ? "Correct"
                    : ans
                      ? "Retry"
                      : q.type === "true_false"
                        ? "T/F"
                        : "MCQ"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-8 text-center text-[14px] font-bold text-[#8a929c]">
          No questions match these filters.
        </p>
      ) : null}

      <LmsPracticeSolvePopup
        open={Boolean(activeId)}
        questions={filtered.length ? filtered : PRACTICE_QUESTIONS}
        startId={activeId}
        answers={answers}
        onClose={() => setActiveId(null)}
        onAnswered={(questionId, selectedIndex, correct) => {
          setAnswers((prev) => ({
            ...prev,
            [questionId]: {
              selectedIndex,
              correct,
              at: new Date().toISOString(),
            },
          }));
        }}
      />
    </div>
  );
}
