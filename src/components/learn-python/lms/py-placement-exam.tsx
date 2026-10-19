"use client";

import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import { PLACEMENT_PASS_RATIO } from "@/lib/python-lms/placement";
import {
  PLACEMENT_SESSION_SIZE,
  PLACEMENT_TIME_SEC,
  pickPlacementSession,
  scorePlacementSession,
  shuffledOptionOrder,
  toPublicPlacementQuestion,
  type PlacementBankItem,
} from "@/lib/python-lms/placement-bank";
import {
  appendPlacementSeenLocal,
  readPlacementSeenLocal,
  writePlacementLocal,
} from "@/lib/python-lms/placement-storage";
import { PY_LMS_INTERMEDIATE, pyTrackTheme } from "@/lib/python-lms";
import type { PyPlacement } from "@/lib/python-lms/progress";
import {
  startPyPlacementSessionApi,
  submitPyPlacementSessionApi,
  type PyPlacementPublicQuestion,
} from "@/lib/python-lms/sync-client";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Clock, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const theme = pyTrackTheme("intermediate");
const passPct = Math.round(PLACEMENT_PASS_RATIO * 100);

function blockClipboard(e: React.ClipboardEvent) {
  e.preventDefault();
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function PyPlacementExam() {
  const { savePlacement, syncNow, canAccessIntermediate } = usePyLms();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PyPlacementPublicQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    byId: Record<string, boolean>;
  } | null>(null);
  const submitting = useRef(false);
  const privateSession = useRef<PlacementBankItem[]>([]);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswers({});
    setIndex(0);
    try {
      const data = await startPyPlacementSessionApi();
      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setExpiresAt(new Date(data.expiresAt).getTime());
    } catch {
      const seen = readPlacementSeenLocal();
      const local = pickPlacementSession(seen, PLACEMENT_SESSION_SIZE);
      privateSession.current = local;
      setSessionId(`local-${Date.now()}`);
      setQuestions(local.map(toPublicPlacementQuestion));
      setExpiresAt(Date.now() + PLACEMENT_TIME_SEC * 1000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void start();
  }, [start]);

  useEffect(() => {
    if (!expiresAt || result) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [expiresAt, result]);

  const secondsLeft = useMemo(() => {
    if (!expiresAt) return PLACEMENT_TIME_SEC;
    return Math.max(0, Math.floor((expiresAt - now) / 1000));
  }, [expiresAt, now]);

  const timedOut = !result && expiresAt !== null && secondsLeft <= 0;

  const finish = useCallback(async () => {
    if (submitting.current || !sessionId || !questions.length) return;
    submitting.current = true;
    const ids = questions.map((q) => q.id);
    try {
      if (!sessionId.startsWith("local-")) {
        const res = await submitPyPlacementSessionApi(sessionId, answers);
        setResult(res);
        appendPlacementSeenLocal(ids);
        if (res.passed) {
          const placement: PyPlacement = {
            passed: true,
            score: res.score,
            total: res.total,
            at: new Date().toISOString(),
          };
          writePlacementLocal(placement);
          savePlacement(placement);
          await syncNow();
        }
      } else {
        const scored = scorePlacementSession(privateSession.current, answers, PLACEMENT_PASS_RATIO);
        appendPlacementSeenLocal(ids);
        setResult(scored);
        if (scored.passed) {
          const placement: PyPlacement = {
            passed: true,
            score: scored.score,
            total: scored.total,
            at: new Date().toISOString(),
          };
          writePlacementLocal(placement);
          savePlacement(placement);
          await syncNow();
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit");
    } finally {
      submitting.current = false;
    }
  }, [answers, questions, savePlacement, sessionId, syncNow]);

  useEffect(() => {
    if (timedOut && !result) void finish();
  }, [timedOut, result, finish]);

  const q = questions[index];
  const optionOrder = useMemo(
    () => (q ? shuffledOptionOrder(q.options.length, q.id) : []),
    [q],
  );
  const picked = q ? answers[q.id] : undefined;
  const allDone = questions.length > 0 && questions.every((item) => answers[item.id] !== undefined);

  function pick(i: number) {
    if (!q || result) return;
    setAnswers((a) => ({ ...a, [q.id]: i }));
  }

  function next() {
    if (!q || picked === undefined) return;
    if (index < questions.length - 1) setIndex((i) => i + 1);
    else if (allDone) void finish();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin" style={{ color: theme.accent }} />
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <p className="text-[15px] text-coral-dark">{error}</p>
        <button type="button" onClick={() => void start()} className="mt-4 bg-ink px-5 py-2.5 text-[14px] font-bold text-white">
          Try again
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <div
          className={cn("border p-6 text-center sm:p-8", result.passed ? "border-[#2f9e6e] bg-[#eef8f2]" : "border-coral/40 bg-coral-wash")}
        >
          {result.passed ? <Check className="mx-auto h-10 w-10 text-[#2f9e6e]" strokeWidth={2.5} /> : <X className="mx-auto h-10 w-10 text-coral-dark" strokeWidth={2.5} />}
          <h1 className="mt-3 text-2xl font-extrabold text-ink">
            {result.passed ? "Intermediate unlocked" : "Not yet — keep practicing Beginner"}
          </h1>
          <p className="mt-2 text-[15px] text-ink/80">
            {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%) · need {passPct}%
          </p>
          {result.passed ? (
            <Link href={PY_LMS_INTERMEDIATE} className="mt-6 inline-flex items-center gap-2 bg-ink px-6 py-3 text-[15px] font-bold text-white">
              Open Intermediate <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button type="button" onClick={() => void start()} className="mt-6 inline-flex items-center gap-2 border border-ink px-6 py-3 text-[15px] font-bold text-ink">
              Retry path test
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8"
      onCopy={blockClipboard}
      onCut={blockClipboard}
      onPaste={blockClipboard}
    >
      <header className="mb-6 border-b border-hairline pb-5">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: theme.accent }}>
          Test to Intermediate
        </p>
        <h1 className="mt-1 text-center text-[26px] font-extrabold tracking-tight sm:text-[32px]">Unlock Intermediate</h1>
        <p className="mt-2 text-center text-[14px] text-muted">
          {PLACEMENT_SESSION_SIZE} questions · {passPct}% to pass · no copy/paste · timer runs for the whole test
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <span
            className={cn(
              "inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[13px] font-bold",
              secondsLeft <= 60 ? "border-coral bg-coral-wash text-coral-dark" : "border-hairline bg-white text-ink",
            )}
          >
            <Clock className="h-4 w-4" />
            {formatTime(secondsLeft)}
          </span>
          <span className="font-mono text-[12px] text-muted">
            Question {index + 1} / {questions.length}
          </span>
        </div>
        <div className="mx-auto mt-3 h-1.5 max-w-md bg-[#ece8e0]">
          <div className="h-full transition-all" style={{ width: `${((index + (picked !== undefined ? 1 : 0)) / questions.length) * 100}%`, backgroundColor: theme.accent }} />
        </div>
      </header>

      {canAccessIntermediate && (
        <p className="mb-4 text-center text-[13px] font-semibold text-[#2f9e6e]">You already unlocked Intermediate — this is optional practice.</p>
      )}

      {q && (
        <div className="select-none border border-hairline bg-white p-5 sm:p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
            Question {index + 1}
          </p>
          <p className="mt-2 text-[16px] font-bold leading-snug text-ink">{q.prompt}</p>
          {q.code && (
            <pre className="mt-3 overflow-x-auto border border-hairline bg-[#141008] p-4 font-mono text-[13px] leading-relaxed text-[#ffe8a8]">
              {q.code}
            </pre>
          )}
          <ul className="mt-4 space-y-2" role="listbox" aria-label="Answer choices">
            {optionOrder.map((optIndex, rank) => {
              const opt = q.options[optIndex];
              return (
                <li key={`${q.id}-${optIndex}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={picked === optIndex}
                    onClick={() => pick(optIndex)}
                    className={cn(
                      "flex w-full items-center gap-3 border px-3 py-2.5 text-left text-[14px] font-semibold transition",
                      picked === optIndex ? "border-ink bg-ink text-white" : "border-hairline bg-cream/40 text-ink hover:border-ink/40",
                    )}
                  >
                    <span className="font-mono text-[11px] opacity-70">{String.fromCharCode(65 + rank)}</span>
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="border border-hairline px-5 py-2.5 text-[14px] font-bold text-ink disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          disabled={picked === undefined}
          onClick={next}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[14px] font-bold text-ink transition hover:brightness-95 disabled:opacity-50"
          style={{ backgroundColor: theme.accentLight }}
        >
          {index < questions.length - 1 ? "Next question" : "Submit test"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-3 text-center text-[13px] text-coral-dark">{error}</p>}
    </div>
  );
}
