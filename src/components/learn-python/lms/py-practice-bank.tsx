"use client";

import { CodeView, PyEditor, RunButton } from "@/components/learn-python/lms/py-lms-ui";
import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import {
  PRACTICE_BANK,
  PRACTICE_UNITS,
  type PracticeItem,
  type PracticeKind,
  type PracticeLevel,
} from "@/lib/python-lms/practice-bank";
import { PY_XP, bankAwardKey as awardKey } from "@/lib/python-lms/rules";
import { preloadPython, runPython } from "@/lib/python-runner";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const LEVEL_STYLE: Record<PracticeLevel, string> = {
  easy: "border-[#bfe3cf] bg-[#eef8f2] text-[#2f7a55]",
  medium: "border-[#f3d39a] bg-[#fff7e6] text-[#9a5b00]",
  hard: "border-[#f0b9a6] bg-[#fff1ea] text-[#b4380a]",
};

const KIND_LABEL: Record<PracticeKind, string> = {
  tf: "True / False",
  mcq: "Multiple choice",
  code: "Code",
};

type CaseResult = {
  label: string;
  ok: boolean;
  got: string;
  expected: string;
  error?: string;
};

function norm(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\s+$/g, "");
}

function stdinLines(stdin?: string): string[] {
  if (stdin == null) return [];
  return stdin.split("\n");
}

function showStdin(stdin?: string) {
  if (stdin == null) return "No input";
  if (stdin.split("\n").every((line) => line === "")) return "(blank line)";
  return stdin;
}

function preview(prompt: string) {
  const line = prompt.split("\n").find((row) => row.trim()) ?? prompt;
  return line.replace(/\s+/g, " ").trim();
}

export function PyPracticeBank() {
  const { award, hasAward } = usePyLms();
  const [query, setQuery] = useState("");
  const [lesson, setLesson] = useState<number | "all">("all");
  const [level, setLevel] = useState<PracticeLevel | "all">("all");
  const [kind, setKind] = useState<PracticeKind | "all">("all");
  const [round, setRound] = useState<PracticeItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [cases, setCases] = useState<CaseResult[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [markLine, setMarkLine] = useState<number | undefined>();
  const [summary, setSummary] = useState(false);

  const solved = PRACTICE_BANK.filter((item) => hasAward(awardKey(item.id))).length;
  const q = round?.[index];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PRACTICE_BANK.filter((item) => {
      if (lesson !== "all" && item.lesson !== lesson) return false;
      if (level !== "all" && item.level !== level) return false;
      if (kind !== "all" && item.kind !== kind) return false;
      if (!needle) return true;
      return `${item.prompt} ${item.unit} ${item.explain}`.toLowerCase().includes(needle);
    });
  }, [query, lesson, level, kind]);

  useEffect(() => {
    void preloadPython().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!q || q.kind !== "code") return;
    setCode(q.starter && q.starter.trim() ? q.starter : "# Write your program here\n");
    setCases([]);
    setRevealed(false);
    setMarkLine(undefined);
  }, [q]);

  function openQuestion(item: PracticeItem) {
    const at = filtered.findIndex((row) => row.id === item.id);
    setRound(filtered);
    setIndex(Math.max(0, at));
    setSelection(null);
    setCases([]);
    setRevealed(false);
    setMarkLine(undefined);
    setSummary(false);
    document.getElementById("py-lms-main")?.scrollTo({ top: 0 });
  }

  function backToBucket() {
    setRound(null);
    setSummary(false);
    document.getElementById("py-lms-main")?.scrollTo({ top: 0 });
  }

  function goNext() {
    if (!round) return;
    if (index + 1 >= round.length) {
      setSummary(true);
      document.getElementById("py-lms-main")?.scrollTo({ top: 0 });
      return;
    }
    setIndex((n) => n + 1);
    setSelection(null);
    setCases([]);
    setRevealed(false);
    setMarkLine(undefined);
    document.getElementById("py-lms-main")?.scrollTo({ top: 0 });
  }

  function choose(value: string, correct: boolean) {
    if (selection != null || !q) return;
    setSelection(value);
    if (correct) award(awardKey(q.id), PY_XP.practice[q.level], q.unit);
  }

  async function runTests() {
    if (!q || q.kind !== "code" || running) return;
    setRunning(true);
    setRevealed(false);
    const results: CaseResult[] = [];
    let firstBad: number | undefined;
    for (const test of q.tests ?? []) {
      const result = await runPython(code, stdinLines(test.stdin));
      const ok = result.ok && norm(result.stdout) === norm(test.expected);
      if (!ok && firstBad == null) firstBad = result.errorLine;
      results.push({
        label: test.label,
        ok,
        got: result.stdout,
        expected: test.expected,
        error: result.error,
      });
    }
    setCases(results);
    setMarkLine(firstBad);
    setRunning(false);
    if (results.length > 0 && results.every((item) => item.ok)) award(awardKey(q.id), PY_XP.practice[q.level], q.unit);
  }

  if (summary && round) {
    const passed = round.filter((item) => hasAward(awardKey(item.id))).length;
    return (
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <button type="button" onClick={backToBucket} className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink">
          <ChevronLeft className="h-4 w-4" /> All questions
        </button>
        <div className="mt-4 max-w-[720px] border border-hairline bg-white px-5 py-5 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#2f7a55]">Set done</p>
          <p className="mt-1 text-[28px] font-extrabold leading-none">
            {passed}<span className="text-[18px] text-muted">/{round.length} correct</span>
          </p>
        </div>
      </div>
    );
  }

  if (!round || !q) {
    return (
      <div className="w-full px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">Practice</h1>
          <p className="font-mono text-[13px] text-muted">{solved} / 500 correct</p>
        </div>
        <p className="mt-1 text-[13.5px] text-muted">
          Easy <strong className="text-ink">+{PY_XP.practice.easy} XP</strong> · Medium <strong className="text-ink">+{PY_XP.practice.medium} XP</strong> · Hard{" "}
          <strong className="text-ink">+{PY_XP.practice.hard} XP</strong>. Each question pays once.
        </p>

        <div className="sticky top-0 z-10 -mx-4 mt-4 border-b border-hairline bg-[#f7f5f0] px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions"
                className="h-11 w-full border border-hairline bg-white pl-9 pr-3 text-[14px] outline-none focus:border-ink"
              />
            </label>
            <div className="grid grid-cols-3 gap-2 lg:flex lg:shrink-0">
              <FilterSelect className="lg:w-[260px]" label="Lesson" value={lesson === "all" ? "all" : String(lesson)} onChange={(value) => setLesson(value === "all" ? "all" : Number(value))}>
                <option value="all">All lessons</option>
                {PRACTICE_UNITS.map((unit) => (
                  <option key={unit.lesson} value={unit.lesson}>
                    {String(unit.lesson).padStart(2, "0")} {unit.title}
                  </option>
                ))}
              </FilterSelect>
              <FilterSelect label="Level" value={level} onChange={(value) => setLevel(value as PracticeLevel | "all")}>
                <option value="all">All levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </FilterSelect>
              <FilterSelect label="Type" value={kind} onChange={(value) => setKind(value as PracticeKind | "all")}>
                <option value="all">All types</option>
                <option value="tf">True / False</option>
                <option value="mcq">Multiple choice</option>
                <option value="code">Code</option>
              </FilterSelect>
            </div>
          </div>
          <p className="mt-2 font-mono text-[12px] text-muted">{filtered.length} questions</p>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-8 text-[15px] text-muted">No questions match that search.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const done = hasAward(awardKey(item.id));
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openQuestion(item)}
                    className="flex h-full min-h-[148px] w-full flex-col border border-hairline bg-white p-4 text-left transition hover:border-ink"
                  >
                    <span className="flex items-center gap-2">
                      <span className={cn("border px-1.5 py-0.5 font-mono text-[10.5px] font-semibold uppercase", LEVEL_STYLE[item.level])}>
                        {item.level}
                      </span>
                      <span className="font-mono text-[11px] text-muted">{KIND_LABEL[item.kind]}</span>
                      <span className={cn("ml-auto font-mono text-[11px] font-semibold", done ? "text-[#2f7a55]" : "text-muted")}>
                        +{PY_XP.practice[item.level]} XP
                      </span>
                      {done && <Check className="h-4 w-4 text-[#2f7a55]" />}
                    </span>
                    <span className="mt-2 truncate font-mono text-[11px] text-muted">{item.unit}</span>
                    <span className="mt-1 line-clamp-3 text-[14.5px] font-semibold leading-snug">{preview(item.prompt)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  const passedCode = q.kind === "code" && cases.length > 0 && cases.every((item) => item.ok);
  const ready = q.kind === "code" ? passedCode || revealed : selection != null;

  return (
    <div className="w-full px-4 pb-16 pt-5 sm:px-6 sm:pt-7 lg:px-8">
      <div className="flex items-center gap-3">
        <button type="button" onClick={backToBucket} className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink">
          <ChevronLeft className="h-4 w-4" /> Questions
        </button>
        <div className="h-1 min-w-0 flex-1 bg-[#e7e0d6]" aria-hidden>
          <div className="h-full bg-ink" style={{ width: `${((index + 1) / round.length) * 100}%` }} />
        </div>
        <span className="font-mono text-[12px] text-muted">{index + 1}/{round.length}</span>
      </div>
      <p className="mt-5 flex flex-wrap items-center gap-2 text-[13px] text-muted">
        <span className={cn("border px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase", LEVEL_STYLE[q.level])}>{q.level}</span>
        <span>{q.unit}</span>
        <span className="text-hairline">/</span>
        <span>{KIND_LABEL[q.kind]}</span>
        <span className="text-hairline">/</span>
        <span className="font-mono font-semibold text-ink">{hasAward(awardKey(q.id)) ? "XP earned" : `+${PY_XP.practice[q.level]} XP if correct`}</span>
      </p>
      <h1 className="mt-3 whitespace-pre-wrap text-[20px] font-extrabold leading-snug sm:text-[22px]">{q.prompt}</h1>

      {q.kind === "tf" && (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {[true, false].map((value) => {
            const key = value ? "true" : "false";
            const chosen = selection === key;
            const right = q.answer === value;
            const show = selection != null;
            return (
              <button
                key={key}
                type="button"
                disabled={selection != null}
                onClick={() => choose(key, value === q.answer)}
                className={cn(
                  "border px-4 py-4 text-left text-[16px] font-bold transition",
                  !show && "border-hairline bg-white hover:border-ink",
                  show && right && "border-[#2f9e6e] bg-[#eef8f2]",
                  show && chosen && !right && "border-[#b4380a] bg-[#fff1ea]",
                  show && !chosen && !right && "border-hairline bg-white text-muted",
                )}
              >
                {value ? "True" : "False"}
              </button>
            );
          })}
        </div>
      )}

      {q.kind === "mcq" && (
        <ol className="mt-5 space-y-2">
          {q.options?.map((option, optionIndex) => {
            const key = String(optionIndex);
            const chosen = selection === key;
            const right = optionIndex === q.answerIndex;
            const show = selection != null;
            return (
              <li key={key}>
                <button
                  type="button"
                  disabled={selection != null}
                  onClick={() => choose(key, right)}
                  className={cn(
                    "flex w-full items-start gap-3 border px-4 py-3 text-left transition",
                    !show && "border-hairline bg-white hover:border-ink",
                    show && right && "border-[#2f9e6e] bg-[#eef8f2]",
                    show && chosen && !right && "border-[#b4380a] bg-[#fff1ea]",
                    show && !chosen && !right && "border-hairline bg-white text-muted",
                  )}
                >
                  <span className="font-mono text-[12px] font-semibold">{String.fromCharCode(65 + optionIndex)}</span>
                  <span className="whitespace-pre-wrap text-[15px] font-semibold">{option}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {q.kind === "code" && (
        <div className="mt-5 space-y-4">
          <div className="border border-hairline bg-white">
            <p className="border-b border-hairline px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Test cases</p>
            <ul className="divide-y divide-hairline">
              {q.tests?.map((test) => (
                <li key={test.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[120px_1fr]">
                  <p className="font-mono text-[12px] font-semibold">{test.label}</p>
                  <p className="font-mono text-[12.5px] leading-relaxed text-muted">
                    Input <span className="whitespace-pre-wrap text-ink">{showStdin(test.stdin)}</span>
                    <span className="mx-2 text-hairline">/</span>
                    Expected <span className="whitespace-pre-wrap text-ink">{test.expected}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Compiler</p>
            <PyEditor value={code} onChange={setCode} onRun={() => void runTests()} minLines={8} markLine={markLine} />
            <div className="mt-3">
              <RunButton onClick={() => void runTests()} running={running} label="Run tests" />
            </div>
          </div>
          {cases.length > 0 && (
            <ul className="space-y-2">
              {cases.map((item) => (
                <li key={item.label} className={cn("border px-4 py-3", item.ok ? "border-[#bfe3cf] bg-[#eef8f2]" : "border-[#f0b9a6] bg-[#fff1ea]")}>
                  <p className="flex items-center gap-2 text-[14px] font-bold">
                    {item.ok ? <Check className="h-4 w-4 text-[#2f7a55]" /> : <X className="h-4 w-4 text-[#b4380a]" />}
                    {item.label}
                    <span className="font-mono text-[11px] font-semibold uppercase">{item.ok ? "Pass" : "Fail"}</span>
                  </p>
                  {!item.ok && (
                    <div className="mt-2 grid gap-2 font-mono text-[12.5px] sm:grid-cols-2">
                      <p className="whitespace-pre-wrap">Expected{"\n"}{item.expected}</p>
                      <p className="whitespace-pre-wrap">Your output{"\n"}{item.error ?? (item.got || "(no output)")}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {!passedCode && (
            <button type="button" onClick={() => setRevealed(true)} className="text-[13px] font-semibold text-ink underline underline-offset-4">
              Show a solution
            </button>
          )}
          {revealed && q.solution && (
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">One solution</p>
              <CodeView code={q.solution} />
            </div>
          )}
        </div>
      )}

      {(selection != null || passedCode || revealed) && (
        <div className="mt-5 border border-hairline bg-[#faf8f4] px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Why</p>
          <p className="mt-1 text-[14.5px] leading-relaxed">{q.explain}</p>
        </div>
      )}

      {ready && (
        <button type="button" onClick={goNext} className="mt-5 inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-[14px] font-bold text-white">
          {index + 1 >= round.length ? "Finish round" : "Next"} <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block min-w-0 lg:w-[170px]", className)}>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full border border-hairline bg-white px-2.5 text-[13.5px] font-semibold outline-none focus:border-ink"
      >
        {children}
      </select>
    </label>
  );
}
