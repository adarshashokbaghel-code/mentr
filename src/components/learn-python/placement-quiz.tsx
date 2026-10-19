"use client";

import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import {
  PLACEMENT_PASS_RATIO,
  PLACEMENT_QUESTIONS,
  scorePlacement,
  type PlacementQuestion,
} from "@/lib/python-lms/placement";
import { PY_LMS_INTERMEDIATE, PY_PLACEMENT_PATH } from "@/lib/python-lms";
import { writePlacementLocal } from "@/lib/python-lms/placement-storage";
import type { PyPlacement } from "@/lib/python-lms/progress";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function QuestionCard({
  q,
  index,
  value,
  onPick,
  disabled,
}: {
  q: PlacementQuestion;
  index: number;
  value: number | undefined;
  onPick: (i: number) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="border border-hairline bg-white p-5 sm:p-6">
      <legend className="px-1 font-mono text-[11px] uppercase tracking-[0.14em] text-coral">
        Question {index + 1}
      </legend>
      <p className="mt-2 text-[16px] font-bold leading-snug text-ink">{q.prompt}</p>
      {q.code && (
        <pre className="mt-3 overflow-x-auto border border-hairline bg-[#0f1612] p-4 font-mono text-[13px] leading-relaxed text-[#e8fff4]">
          {q.code}
        </pre>
      )}
      <ul className="mt-4 space-y-2">
        {q.options.map((opt, i) => (
          <li key={`${q.id}-${i}`}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(i)}
              className={cn(
                "flex w-full items-center gap-3 border px-3 py-2.5 text-left text-[14px] font-semibold transition",
                value === i ? "border-ink bg-ink text-white" : "border-hairline bg-cream/40 text-ink hover:border-ink/40",
              )}
            >
              <span className="font-mono text-[11px] opacity-70">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export function PlacementQuiz({ embedded }: { embedded?: boolean }) {
  const lms = useOptionalPyLms();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<ReturnType<typeof scorePlacement> | null>(null);

  const allAnswered = PLACEMENT_QUESTIONS.every((q) => answers[q.id] !== undefined);

  const result = submitted;

  function submit() {
    if (!allAnswered) return;
    const scored = scorePlacement(answers);
    setSubmitted(scored);
    const placement: PyPlacement = {
      passed: scored.passed,
      score: scored.score,
      total: scored.total,
      at: new Date().toISOString(),
    };
    writePlacementLocal(placement);
    lms?.savePlacement(placement);
    void lms?.syncNow();
  }

  const passPct = Math.round(PLACEMENT_PASS_RATIO * 100);

  if (result) {
    return (
      <div className={cn("mx-auto max-w-xl", embedded ? "" : "px-5 py-10")}>
        <div
          className={cn(
            "border p-6 text-center sm:p-8",
            result.passed ? "border-sage bg-sage-wash" : "border-coral/40 bg-coral-wash",
          )}
        >
          {result.passed ? (
            <Check className="mx-auto h-10 w-10 text-sage" strokeWidth={2.5} />
          ) : (
            <X className="mx-auto h-10 w-10 text-coral-dark" strokeWidth={2.5} />
          )}
          <h1 className="mt-3 text-2xl font-extrabold text-ink">
            {result.passed ? "You’re in — Intermediate unlocked" : "Not yet — keep building basics"}
          </h1>
          <p className="mt-2 text-[15px] text-ink/80">
            Score: {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%) · need {passPct}%
          </p>
          {result.passed ? (
            <Link
              href={PY_LMS_INTERMEDIATE}
              className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-[15px] font-bold text-white"
            >
              Open Python Intermediate <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/learnpython/lms" className="inline-flex items-center justify-center bg-ink px-6 py-3 text-[15px] font-bold text-white">
                Start Beginner course
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(null);
                  setAnswers({});
                }}
                className="inline-flex items-center justify-center border border-ink px-6 py-3 text-[15px] font-bold text-ink"
              >
                Retry quiz
              </button>
            </div>
          )}
        </div>
        {!result.passed && (
          <ul className="mt-6 space-y-2 text-left text-[13px] text-muted">
            {PLACEMENT_QUESTIONS.map((q) => (
              <li key={q.id} className={result.byId[q.id] ? "text-sage" : "text-coral-dark"}>
                {result.byId[q.id] ? "✓" : "✗"} {q.explain}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className={cn("mx-auto max-w-2xl", embedded ? "" : "px-5 pb-16 pt-8")}>
      {!embedded && (
        <header className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-coral">Placement</p>
          <h1 className="mt-1 text-[28px] font-extrabold tracking-tight sm:text-[34px]">Skip to Intermediate?</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {PLACEMENT_QUESTIONS.length} questions · ~12 minutes · {passPct}% to unlock job-focused Intermediate without
            redoing Beginner.
          </p>
        </header>
      )}
      <div className="space-y-4">
        {PLACEMENT_QUESTIONS.map((q, i) => (
          <QuestionCard
            key={q.id}
            q={q}
            index={i}
            value={answers[q.id]}
            onPick={(pick) => setAnswers((a) => ({ ...a, [q.id]: pick }))}
            disabled={false}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={!allAnswered}
        onClick={submit}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-coral text-[15px] font-bold text-ink transition hover:bg-coral-dark hover:text-white disabled:opacity-50 sm:w-auto sm:px-10"
      >
        Submit answers <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-4 text-center text-[13px] text-muted sm:text-left">
        Or finish{" "}
        <Link href="/learnpython/lms" className="font-semibold text-ink underline">
          Beginner Lesson 9
        </Link>{" "}
        to unlock Intermediate without the quiz.
      </p>
    </div>
  );
}

function useOptionalPyLms() {
  try {
    return usePyLms();
  } catch {
    return null;
  }
}

export { PY_PLACEMENT_PATH };
