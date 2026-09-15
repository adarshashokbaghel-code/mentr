"use client";

import {
  submitPotdAttempt,
  type PotdTodayDto,
} from "@/lib/learn-progress-client";
import { cn } from "@/lib/utils";
import { Check, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  data: PotdTodayDto | null;
  loading?: boolean;
  error?: string | null;
  onAttempted?: (next: PotdTodayDto) => void;
  compact?: boolean;
};

export function LmsPotdSolve({
  data,
  loading,
  error,
  onAttempted,
  compact,
}: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    correct: boolean;
    correctIndex: number;
    explanation: string;
  } | null>(null);

  useEffect(() => {
    setPicked(null);
    setResult(null);
    setLocalError(null);
    if (data?.attempt) {
      setPicked(data.attempt.selectedIndex);
      setResult({
        correct: data.attempt.correct,
        correctIndex: data.potd.correctIndex ?? data.attempt.selectedIndex,
        explanation: data.potd.explanation ?? "",
      });
    }
  }, [data?.dateKey, data?.attempt?.selectedIndex, data?.attempt?.correct]);

  async function choose(index: number) {
    if (!data || data.isFuture || picked !== null || submitting) return;
    setPicked(index);
    setSubmitting(true);
    setLocalError(null);
    try {
      const res = await submitPotdAttempt(data.dateKey, index);
      setResult({
        correct: res.correct,
        correctIndex: res.correctIndex,
        explanation: res.explanation,
      });
      const next: PotdTodayDto = {
        ...data,
        attempted: true,
        attempt: {
          selectedIndex: res.selectedIndex,
          correct: res.correct,
          attemptedAt: new Date().toISOString(),
        },
        potd: {
          ...data.potd,
          correctIndex: res.correctIndex,
          explanation: res.explanation,
        },
      };
      onAttempted?.(next);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to save");
      setPicked(null);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-7 w-7 animate-spin text-[#ff6a1a]" />
      </div>
    );
  }

  if (error || localError) {
    return (
      <p className="rounded-2xl bg-[#fff4e8] px-3 py-2 text-[13px] font-semibold text-[#c2410c]">
        {error || localError}
      </p>
    );
  }

  if (!data) {
    return (
      <p className="py-6 text-center text-[13px] font-bold text-[#8a929c]">
        Loading challenge…
      </p>
    );
  }

  if (data.isFuture) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-[#faf8f4] px-4 py-4 text-[14px] font-bold text-[#8a929c]">
        <Lock className="h-4 w-4 shrink-0" />
        Locked until {data.dateKey}.
      </div>
    );
  }

  const q = data.potd;
  const options = q.options ?? [];
  const correctIndex = result?.correctIndex ?? q.correctIndex;
  const explanation = result?.explanation ?? q.explanation;
  const showAnswer = Boolean(result || data.attempted);

  return (
    <div className={cn("space-y-4", compact && "space-y-2.5")}>
      {!compact ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#e6f7f4] px-2.5 py-0.5 text-[11px] font-bold text-[#0d9488]">
            {q.moduleId} · {q.trackId.toUpperCase()}
          </span>
          <span className="rounded-full bg-[#fff4e8] px-2.5 py-0.5 text-[11px] font-bold capitalize text-[#ff6a1a]">
            {q.difficulty}
          </span>
          {data.attempted ? (
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                data.attempt?.correct
                  ? "bg-[#e6f7f4] text-[#0d9488]"
                  : "bg-[#fff4e8] text-[#c2410c]",
              )}
            >
              {data.attempt?.correct ? "Solved" : "Attempted"}
            </span>
          ) : (
            <span className="rounded-full bg-[#fff4e8] px-2.5 py-0.5 text-[11px] font-bold text-[#ff6a1a]">
              Not attempted
            </span>
          )}
        </div>
      ) : null}

      <div>
        {!compact ? (
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">
            {q.title}
          </p>
        ) : null}
        <p
          className={cn(
            "font-extrabold leading-snug text-[#1c2434]",
            compact ? "text-[14px]" : "mt-1 text-[1.15rem]",
          )}
        >
          {q.prompt}
        </p>
      </div>

      <ul className={cn("space-y-2", compact && "space-y-1.5")}>
        {options.map((opt, i) => {
          const selected = picked === i;
          const isRight = correctIndex !== undefined && i === correctIndex;
          return (
            <li key={`${opt}-${i}`}>
              <button
                type="button"
                disabled={showAnswer || submitting}
                onClick={() => void choose(i)}
                className={cn(
                  "flex w-full items-center gap-2.5 text-left font-bold transition",
                  compact
                    ? "rounded-xl border px-2.5 py-2 text-[13px]"
                    : "rounded-2xl border-2 px-3 py-2.5 text-[14px]",
                  !showAnswer &&
                    "border-[#e8e2d8] bg-[#faf8f4] hover:border-[#1c2434]",
                  showAnswer &&
                    selected &&
                    isRight &&
                    "border-[#0d9488] bg-[#e6f7f4]",
                  showAnswer &&
                    selected &&
                    !isRight &&
                    "border-[#ea580c] bg-[#fff4e8]",
                  showAnswer &&
                    !selected &&
                    isRight &&
                    "border-[#0d9488] bg-[#e6f7f4]/70",
                  showAnswer && !selected && !isRight && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-lg bg-white font-extrabold text-[#8a929c]",
                    compact ? "h-6 w-6 text-[11px]" : "h-7 w-7 text-[12px]",
                  )}
                >
                  {showAnswer && isRight ? (
                    <Check className="h-3.5 w-3.5 text-[#0d9488]" />
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

      {explanation && showAnswer ? (
        <p
          className={cn(
            "rounded-xl px-2.5 py-1.5 font-semibold",
            compact ? "text-[12px]" : "rounded-2xl px-3 py-2 text-[13px]",
            (result?.correct ?? data.attempt?.correct)
              ? "bg-[#e6f7f4] text-[#0d9488]"
              : "bg-[#fff4e8] text-[#c2410c]",
          )}
        >
          {(result?.correct ?? data.attempt?.correct) ? "Nice! " : "Almost — "}
          {explanation}
        </p>
      ) : null}
    </div>
  );
}
