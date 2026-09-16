"use client";

import {
  practiceModuleMeta,
  type PracticeQuestion,
} from "@/lib/learn-practice-bank";
import { submitPracticeAnswer } from "@/lib/learn-practice-client";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Library,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  questions: PracticeQuestion[];
  startId: string | null;
  answers: Record<string, { selectedIndex: number; correct: boolean }>;
  onClose: () => void;
  onAnswered: (
    questionId: string,
    selectedIndex: number,
    correct: boolean,
  ) => void;
};

export function LmsPracticeSolvePopup({
  open,
  questions,
  startId,
  answers,
  onClose,
  onAnswered,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !startId) return;
    const i = questions.findIndex((q) => q.id === startId);
    setIndex(i >= 0 ? i : 0);
  }, [open, startId, questions]);

  const question = questions[index] ?? null;
  const prior = question ? answers[question.id] : undefined;

  useEffect(() => {
    if (!question) return;
    if (prior) {
      setPicked(prior.selectedIndex);
      setRevealed(true);
    } else {
      setPicked(null);
      setRevealed(false);
    }
  }, [question?.id, prior?.selectedIndex, prior?.correct]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const meta = useMemo(
    () => (question ? practiceModuleMeta(question.moduleId) : null),
    [question],
  );

  if (!mounted || !open || !question) return null;

  async function submit(optionIndex: number) {
    if (revealed || !question || saving) return;
    setPicked(optionIndex);
    setSaving(true);
    try {
      const result = await submitPracticeAnswer(question.id, optionIndex);
      setRevealed(true);
      setPicked(result.correct ? optionIndex : result.selectedIndex);
      // Prefer server-validated result
      onAnswered(question.id, result.selectedIndex, result.correct);
    } catch {
      // Fallback: local reveal if offline — still lock UI
      const correct = optionIndex === question.correctIndex;
      setRevealed(true);
      onAnswered(question.id, optionIndex, correct);
    } finally {
      setSaving(false);
    }
  }

  function go(delta: number) {
    setIndex((i) => Math.min(questions.length - 1, Math.max(0, i + delta)));
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-label="Practice question"
        className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border-2 border-[#1c2434] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#f0ebe3] px-4 py-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">
              <Library className="h-3.5 w-3.5" />
              Practice · {index + 1}/{questions.length}
            </p>
            <p className="mt-0.5 truncate text-[13px] font-semibold text-[#8a929c]">
              {question.moduleId}
              {meta ? ` · ${meta.moduleTitle}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#e8e2d8] p-2 text-[#1c2434] hover:bg-[#faf8f4]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold",
              question.type === "true_false"
                ? "bg-[#fff8d6] text-[#b45309]"
                : "bg-[#eef2ff] text-[#4f46e5]",
            )}
          >
            {question.type === "true_false" ? "True / False" : "Multiple choice"}
          </span>
          <h2 className="mt-3 text-[1.15rem] font-extrabold leading-snug text-[#1c2434] sm:text-[1.25rem]">
            {question.prompt}
          </h2>

          <div className="mt-4 space-y-2">
            {question.options.map((opt, i) => {
              const isPick = picked === i;
              const isCorrect = i === question.correctIndex;
              let tone =
                "border-[#e8e2d8] bg-white hover:border-[#1c2434] hover:bg-[#faf8f4]";
              if (revealed && isCorrect) {
                tone = "border-[#0d9488] bg-[#e6f7f4] text-[#0f766e]";
              } else if (revealed && isPick && !isCorrect) {
                tone = "border-[#ea580c] bg-[#fff4e8] text-[#c2410c]";
              } else if (!revealed && isPick) {
                tone = "border-[#ff6a1a] bg-[#fff4e8]";
              }
              return (
                <button
                  key={`${question.id}-${i}`}
                  type="button"
                  disabled={revealed || saving}
                  onClick={() => void submit(i)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-[14px] font-bold transition disabled:cursor-default",
                    tone,
                  )}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#f3efe7] text-[11px] font-extrabold text-[#5a6472]">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="min-w-0 flex-1 leading-snug">{opt}</span>
                  {revealed && isCorrect ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0d9488]" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {revealed ? (
            <div
              className={cn(
                "mt-4 rounded-2xl px-3.5 py-3 text-[13px] font-medium leading-relaxed",
                picked === question.correctIndex
                  ? "bg-[#e6f7f4] text-[#0f766e]"
                  : "bg-[#fff4e8] text-[#9a3412]",
              )}
            >
              <p className="font-extrabold">
                {picked === question.correctIndex ? "Nice!" : "Not quite"}
                {picked === question.correctIndex ? " · +1 practice point" : " · 0 points"}
              </p>
              <p className="mt-1">{question.explanation}</p>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[#f0ebe3] px-4 py-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            className="inline-flex items-center gap-1 rounded-xl border border-[#e8e2d8] px-3.5 py-2.5 text-[13px] font-extrabold text-[#1c2434] transition hover:bg-[#faf8f4] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#efe6d8] sm:w-32">
            <div
              className="h-full rounded-full bg-[#ff6a1a] transition-all"
              style={{
                width: `${Math.round(((index + 1) / questions.length) * 100)}%`,
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (index >= questions.length - 1) onClose();
              else go(1);
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-[#1c2434] px-3.5 py-2.5 text-[13px] font-extrabold text-white transition hover:bg-[#2a3548]"
          >
            {index >= questions.length - 1 ? "Done" : "Next"}
            {index >= questions.length - 1 ? null : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
