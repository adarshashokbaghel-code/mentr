"use client";

import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import { AnswerLines, CodeView, OutputPanel, PyEditor, Rich, RunButton } from "@/components/learn-python/lms/py-lms-ui";
import { usePythonRun } from "@/components/learn-python/lms/use-python-run";
import { PY_XP, type AchievementId } from "@/lib/python-lms/game";
import type { ExampleItem } from "@/lib/python-lms/types";
import { preloadPython } from "@/lib/python-runner";
import { cn } from "@/lib/utils";
import { usePyCompiler } from "@/components/learn-python/compiler/compiler-provider";
import { ArrowLeft, ArrowRight, Check, CircleDot, RotateCcw, SquareTerminal, StepForward } from "lucide-react";
import { useEffect, useState } from "react";

export function PyExamples({ slug, examples, onFinish }: { slug: string; examples: ExampleItem[]; onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const ex = examples[index];
  const last = index === examples.length - 1;

  useEffect(() => {
    void preloadPython().catch(() => undefined);
  }, []);

  function go(to: number) {
    setIndex(to);
    document.getElementById("py-lms-main")?.scrollTo({ top: 0 });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Examples">
        {examples.map((e, i) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => go(i)}
            className={cn(
              "border px-3 py-1.5 font-mono text-[12px] transition",
              i === index ? "border-ink bg-ink text-white" : "border-hairline bg-white text-muted hover:text-ink",
            )}
          >
            Example {i + 1}
          </button>
        ))}
      </div>

      <section key={ex.id} className="py-pop mt-4 border border-hairline bg-white">
        <header className="border-b border-hairline px-5 py-5 sm:px-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-coral">
            {ex.type === "trace" ? "Step through" : "Try it yourself"}
          </p>
          <h2 className="mt-1.5 text-[21px] font-extrabold leading-tight sm:text-[24px]">{ex.title}</h2>
          <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted">
            <Rich text={ex.intro} />
          </p>
        </header>
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          {ex.type === "trace" ? <Trace slug={slug} example={ex} /> : <Playground slug={slug} example={ex} />}
        </div>
        <footer className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="inline-flex items-center gap-1.5 px-2 py-2 text-[14px] font-semibold text-muted transition hover:text-ink disabled:invisible"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            type="button"
            onClick={() => (last ? onFinish() : go(index + 1))}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-bold text-white transition",
              last ? "bg-[#2f9e6e] hover:bg-[#278a5f]" : "bg-ink hover:bg-black",
            )}
          >
            {last ? "Start practice" : "Next example"} <ArrowRight className="h-4 w-4" />
          </button>
        </footer>
      </section>
    </div>
  );
}

function Trace({ slug, example }: { slug: string; example: Extract<ExampleItem, { type: "trace" }> }) {
  const { award, hasAward } = usePyLms();
  const [step, setStep] = useState(-1);
  const current = step >= 0 ? example.steps[step] : null;
  const done = step === example.steps.length - 1;
  const awardKey = `trace:${slug}:${example.id}`;
  const earned = hasAward(awardKey);

  function runNext() {
    const next = step + 1;
    setStep(next);
    if (next === example.steps.length - 1) award(awardKey, PY_XP.example, "Example finished");
  }
  const output = example.steps
    .slice(0, step + 1)
    .filter((s) => s.output !== undefined)
    .map((s) => s.output + (s.inline ? "" : "\n"))
    .join("");

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] [&>*]:min-w-0">
      <div className="border border-[#2a332d]">
        <CodeView code={example.code} activeLine={current?.line} />
        <div className="border-t border-white/10 bg-[#0f1411]">
          <p className="border-b border-white/10 px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
            Output
          </p>
          <pre className="min-h-[96px] whitespace-pre-wrap px-4 py-3 font-mono text-[13px] leading-[1.7] text-[#5ee0a0]">
            {step < 0 ? <span className="text-white/35">Nothing yet. Press “Run next line”.</span> : output || " "}
          </pre>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex-1 border border-hairline bg-[#faf8f4] p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
            {current ? `Line ${current.line}` : "Ready"}
            <span className={cn("float-right normal-case tracking-normal", earned && "text-[#2f7a55]")}>
              {earned ? `+${PY_XP.example} XP earned` : `+${PY_XP.example} XP at the last line`}
            </span>
          </p>
          <p key={step} className="py-pop mt-2 text-[15.5px] leading-relaxed text-ink">
            {current ? (
              <Rich text={current.note} />
            ) : (
              "Python will run this program from the top. Press the button to run one line at a time."
            )}
          </p>
          {done && (
            <p className="py-pop mt-4 flex items-center gap-2 text-[14px] font-semibold text-[#2f7a55]">
              <Check className="h-4 w-4" /> Program finished. Every line ran in order, top to bottom.
            </p>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {!done ? (
            <button
              type="button"
              onClick={runNext}
              className="inline-flex items-center gap-2 bg-[#2f9e6e] px-4 py-2 text-[13.5px] font-bold text-white transition hover:bg-[#278a5f]"
            >
              <StepForward className="h-4 w-4" /> Run next line
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(-1)}
              className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-[13.5px] font-bold text-white transition hover:bg-black"
            >
              <RotateCcw className="h-4 w-4" /> Run again
            </button>
          )}
          {step >= 0 && !done && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="border border-hairline px-4 py-2 text-[13.5px] font-semibold text-muted transition hover:text-ink"
            >
              Step back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Playground({ slug, example }: { slug: string; example: Extract<ExampleItem, { type: "playground" }> }) {
  const { award, unlock, hasAward } = usePyLms();
  const { openCompiler } = usePyCompiler();
  const [code, setCode] = useState(example.starter);
  const [typed, setTyped] = useState(example.inputs ?? "");
  const { result, running, firstLoad, run, reset } = usePythonRun();
  const [goalMet, setGoalMet] = useState(() => hasAward(`goal:${slug}:${example.id}`));

  async function onRun() {
    const inputs = example.inputs !== undefined ? typed.split("\n") : undefined;
    const r = await run(code, inputs);
    if (!r) return;
    if (r.ok) unlock("first-run");
    if (example.goal?.check(r, code)) {
      setGoalMet(true);
      award(`goal:${slug}:${example.id}`, PY_XP.example, "Goal reached");
      if (example.achievement) unlock(example.achievement as AchievementId);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] [&>*]:min-w-0">
      <div className="border border-[#2a332d]">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#141b16] px-3 py-2">
          <span className="font-mono text-[11px] text-white/45">main.py</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCode(example.starter);
                setTyped(example.inputs ?? "");
                reset();
              }}
              className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] text-white/50 transition hover:text-white"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
            <button
              type="button"
              onClick={() => openCompiler(code)}
              title="Open this code in the Python compiler"
              className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] text-white/50 transition hover:text-white"
            >
              <SquareTerminal className="h-3 w-3" /> <span className="hidden sm:inline">Open in compiler</span>
            </button>
            <RunButton onClick={onRun} running={running} />
          </div>
        </div>
        <PyEditor value={code} onChange={setCode} onRun={onRun} />
        {example.inputs !== undefined && <AnswerLines value={typed} onChange={setTyped} />}
        <OutputPanel result={result} running={running} firstLoad={firstLoad} />
      </div>

      <div className="space-y-3">
        {example.goal && (
          <div
            className={cn(
              "border p-4 transition-colors",
              goalMet ? "border-[#2f9e6e] bg-[#eef8f2]" : "border-hairline bg-[#faf8f4]",
            )}
          >
            <p className="flex justify-between font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
              Goal <span className="normal-case tracking-normal">+{PY_XP.example} XP</span>
            </p>
            <p className="mt-1.5 flex items-start gap-2 text-[15px] font-semibold text-ink">
              {goalMet ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2f9e6e]" strokeWidth={3} />
              ) : (
                <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
              )}
              {goalMet ? example.goal.success : example.goal.text}
            </p>
          </div>
        )}
        <div className="border border-hairline p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Try this</p>
          <ul className="mt-2.5 space-y-2">
            {example.tryThis.map((t) => (
              <li key={t} className="flex gap-2.5 text-[14.5px] leading-relaxed">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 bg-coral" />
                <Rich text={t} />
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-[11px] text-muted">Tip: Ctrl/⌘ + Enter runs your code.</p>
        </div>
      </div>
    </div>
  );
}
