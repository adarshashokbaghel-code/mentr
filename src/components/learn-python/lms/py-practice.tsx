"use client";

import { AnswerLines, CodeView, MultilineText, OutputPanel, PyEditor, Rich, RunButton } from "@/components/learn-python/lms/py-lms-ui";
import { usePythonRun } from "@/components/learn-python/lms/use-python-run";
import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import { PY_XP } from "@/lib/python-lms/game";
import type { Level, PracticeQuestion } from "@/lib/python-lms/types";
import { preloadPython } from "@/lib/python-runner";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Flame, Lightbulb, RotateCcw, X, Zap } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export type Outcome = "first" | "solved" | "revealed";

const LEVEL_STYLE: Record<Level, string> = {
  easy: "border-[#bfe3cf] bg-[#eef8f2] text-[#2f7a55]",
  medium: "border-[#f3d39a] bg-[#fff7e6] text-[#9a5b00]",
  hard: "border-[#f0b9a6] bg-[#fff1ea] text-[#b4380a]",
};

export function PyPractice({
  slug,
  questions,
  onComplete,
  renderResults,
}: {
  slug: string;
  questions: PracticeQuestion[];
  onComplete: (score: number, total: number, outcomes: Record<string, Outcome>) => void;
  renderResults: (args: { outcomes: Record<string, Outcome>; earned: number; bestCombo: number; retake: () => void }) => ReactNode;
}) {
  const { award, unlock } = usePyLms();
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>({});
  const [finished, setFinished] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [earned, setEarned] = useState(0);
  const [lastGain, setLastGain] = useState<number | null>(null);
  const q = questions[index];
  const resolved = q ? outcomes[q.id] : undefined;
  const last = index === questions.length - 1;

  useEffect(() => {
    void preloadPython().catch(() => undefined);
  }, []);

  function resolve(outcome: Outcome) {
    if (outcomes[q.id]) return;
    setOutcomes((o) => ({ ...o, [q.id]: outcome }));
    const nextCombo = outcome === "first" ? combo + 1 : 0;
    setCombo(nextCombo);
    setBestCombo((b) => Math.max(b, nextCombo));
    if (nextCombo >= 5) unlock("on-fire");
    if (outcome === "revealed") {
      setLastGain(null);
      return;
    }
    const label = nextCombo >= 3 ? `${nextCombo} in a row` : "Correct";
    const got = award(`q:${slug}:${q.id}`, PY_XP.lessonQuestion, label);
    setEarned((e) => e + got);
    setLastGain(got);
  }

  function next() {
    document.getElementById("py-lms-main")?.scrollTo({ top: 0 });
    setLastGain(null);
    if (!last) {
      setIndex((i) => i + 1);
      return;
    }
    const score = questions.filter((x) => outcomes[x.id] && outcomes[x.id] !== "revealed").length;
    onComplete(score, questions.length, outcomes);
    setFinished(true);
  }

  function retake() {
    setOutcomes({});
    setIndex(0);
    setCombo(0);
    setBestCombo(0);
    setEarned(0);
    setFinished(false);
  }

  if (finished) return <>{renderResults({ outcomes, earned, bestCombo, retake })}</>;

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-[3px]" aria-hidden>
          {questions.map((x, i) => (
            <span
              key={x.id}
              className={cn(
                "h-[5px] flex-1",
                outcomes[x.id] === "first"
                  ? "bg-[#2f9e6e]"
                  : outcomes[x.id] === "solved"
                    ? "bg-[#8fd1ad]"
                    : outcomes[x.id] === "revealed"
                      ? "bg-coral"
                      : i === index
                        ? "bg-ink"
                        : "bg-[#e3ded4]",
              )}
            />
          ))}
        </div>
        <span className="shrink-0 font-mono text-[12px] text-muted">
          {index + 1} / {questions.length}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[12px] font-semibold transition",
            combo >= 3 ? "border-[#f3c9a8] bg-[#fff4ea] text-[#c2410c]" : "border-hairline bg-white text-muted",
          )}
        >
          <Flame className={cn("h-3.5 w-3.5", combo >= 3 && "fill-[#ffb27a]")} /> Combo {combo}
          {combo >= 3 && combo < 5 && <span className="font-normal">· {5 - combo} more for On Fire</span>}
        </span>
        <span className="inline-flex items-center gap-1.5 border border-hairline bg-white px-2.5 py-1 font-mono text-[12px] font-semibold text-ink">
          <Zap className="h-3.5 w-3.5 fill-[#5ee0a0] text-[#2f9e6e]" /> {earned} XP this round
        </span>
      </div>

      <section key={q.id} className="py-pop mt-3 border border-hairline bg-white">
        <header className="border-b border-hairline px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={cn(
                "font-mono text-[11px] uppercase tracking-[0.16em]",
                q.type === "write" && q.challenge ? "text-[#2f7a55]" : "text-coral",
              )}
            >
              {q.skill}
            </p>
            <span className={cn("border px-1.5 py-px font-mono text-[10.5px] font-semibold uppercase", LEVEL_STYLE[q.level])}>
              {q.level}
            </span>
            <span className="font-mono text-[10.5px] text-muted">+{PY_XP.lessonQuestion} XP if correct</span>
          </div>
          <MultilineText
            text={q.prompt}
            className="mt-2 text-[18px] font-bold leading-snug text-ink sm:text-[20px] [&_pre]:text-[13.5px] [&_pre]:font-normal"
          />
        </header>
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          {q.type === "mcq" && <Mcq q={q} resolved={resolved} onResolve={resolve} />}
          {q.type === "order" && <Order q={q} resolved={resolved} onResolve={resolve} />}
          {q.type === "fill" && <Fill q={q} resolved={resolved} onResolve={resolve} />}
          {q.type === "write" && <Write q={q} resolved={resolved} onResolve={resolve} />}
        </div>
        <footer className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3 sm:px-6">
          <span className="min-w-0 font-mono text-[12.5px] font-semibold text-[#2f7a55]">
            {lastGain !== null && lastGain > 0 && (
              <span className="py-pop inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 fill-[#5ee0a0]" /> +{lastGain} XP
              </span>
            )}
            {lastGain === 0 && <span className="text-muted">XP already earned for this one</span>}
          </span>
          <button
            type="button"
            onClick={next}
            disabled={!resolved}
            className="inline-flex shrink-0 items-center gap-2 bg-ink px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#d9d4ca]"
          >
            {last ? "See results" : "Next"} <ArrowRight className="h-4 w-4" />
          </button>
        </footer>
      </section>
    </div>
  );
}

function Feedback({ tone, title, children }: { tone: "good" | "bad" | "info"; title: string; children?: ReactNode }) {
  return (
    <div
      role="status"
      className={cn(
        "py-pop mt-4 border-l-[3px] px-4 py-3",
        tone === "good" && "border-[#2f9e6e] bg-[#eef8f2]",
        tone === "bad" && "border-[#c2410c] bg-[#fff1ea]",
        tone === "info" && "border-ink bg-[#f3f0e9]",
      )}
    >
      <p className="flex items-center gap-2 text-[15px] font-bold text-ink">
        {tone === "good" ? (
          <Check className="h-4 w-4 text-[#2f9e6e]" strokeWidth={3} />
        ) : tone === "bad" ? (
          <X className="h-4 w-4 text-[#c2410c]" strokeWidth={3} />
        ) : (
          <Lightbulb className="h-4 w-4" />
        )}
        {title}
      </p>
      {children && <div className="mt-1 text-[14.5px] leading-relaxed text-[#3d3a35]">{children}</div>}
    </div>
  );
}

type QProps<T extends PracticeQuestion["type"]> = {
  q: Extract<PracticeQuestion, { type: T }>;
  resolved?: Outcome;
  onResolve: (o: Outcome) => void;
};

function Mcq({ q, resolved, onResolve }: QProps<"mcq">) {
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const [shake, setShake] = useState(0);
  const correctShown = resolved !== undefined;

  function check() {
    if (picked === null) return;
    if (picked === q.answer) {
      onResolve(wrong.length ? "solved" : "first");
      return;
    }
    const nextWrong = [...wrong, picked];
    setWrong(nextWrong);
    setShake((s) => s + 1);
    setPicked(null);
    if (nextWrong.length >= 2) onResolve("revealed");
  }

  return (
    <div>
      {q.code && (
        <div className="mb-5 border border-[#2a332d]">
          <CodeView code={q.code} />
        </div>
      )}
      <div
        key={shake}
        className={cn("grid gap-2", q.codeOptions && "sm:grid-cols-2", shake > 0 && "py-shake")}
        role="radiogroup"
      >
        {q.options.map((opt, i) => {
          const isAnswer = correctShown && i === q.answer;
          const isWrong = wrong.includes(i);
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={picked === i}
              disabled={correctShown || isWrong}
              onClick={() => setPicked(i)}
              className={cn(
                "flex items-start gap-3 border px-4 py-3 text-left transition",
                isAnswer
                  ? "border-[#2f9e6e] bg-[#eef8f2]"
                  : isWrong
                    ? "border-[#e8c4b4] bg-[#fff6f1] opacity-70"
                    : picked === i
                      ? "border-ink bg-[#f3f0e9]"
                      : "border-hairline hover:border-ink/40",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[11.5px] font-semibold",
                  isAnswer
                    ? "border-[#2f9e6e] bg-[#2f9e6e] text-white"
                    : picked === i
                      ? "border-ink bg-ink text-white"
                      : "border-hairline text-muted",
                )}
              >
                {isAnswer ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : isWrong ? <X className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
              </span>
              {q.codeOptions ? (
                <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-[13.5px] leading-[1.6] text-ink">
                  {opt}
                </pre>
              ) : (
                <span className="text-[15px] leading-snug text-ink">{opt}</span>
              )}
            </button>
          );
        })}
      </div>

      {!correctShown && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={check}
            disabled={picked === null}
            className="bg-[#2f9e6e] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#278a5f] disabled:cursor-not-allowed disabled:bg-[#d9d4ca]"
          >
            Check answer
          </button>
          {wrong.length === 1 && <span className="text-[14px] font-semibold text-[#c2410c]">Not quite. Try once more.</span>}
        </div>
      )}
      {(resolved === "first" || resolved === "solved") && (
        <Feedback tone="good" title={wrong.length ? "Got it." : "Correct!"}>
          <Rich text={q.explain} />
        </Feedback>
      )}
      {resolved === "revealed" && (
        <Feedback tone="info" title={`The answer is ${String.fromCharCode(65 + q.answer)}.`}>
          <Rich text={q.explain} />
        </Feedback>
      )}
    </div>
  );
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const out = items.map((v, i) => ({ v, i }));
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.every((x, i) => x.i === i)) out.reverse();
  return out.map((x) => x.v);
}

function Order({ q, resolved, onResolve }: QProps<"order">) {
  const shuffled = useMemo(() => seededShuffle(q.lines, q.id), [q.lines, q.id]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const pool = shuffled.filter((l) => !placed.includes(l));
  const finished = resolved !== undefined;
  const shown = resolved === "revealed" ? q.lines : placed;
  const rightCount = placed.filter((l, i) => q.lines[i] === l).length;

  function check() {
    setChecked(true);
    if (placed.every((l, i) => q.lines[i] === l)) {
      onResolve(attempts ? "solved" : "first");
      return;
    }
    const n = attempts + 1;
    setAttempts(n);
    if (n >= 2) onResolve("revealed");
  }

  const lineCls = q.code ? "whitespace-pre font-mono text-[13.5px]" : "text-[15px]";

  return (
    <div className="grid gap-5 md:grid-cols-2 [&>*]:min-w-0">
      <div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Tap to add, in order</p>
        <div className="mt-2 space-y-2">
          {pool.length === 0 && !finished && (
            <p className="border border-dashed border-hairline px-4 py-3 text-[14px] text-muted">All placed. Check your order.</p>
          )}
          {pool.map((l) => (
            <button
              key={l}
              type="button"
              disabled={finished}
              onClick={() => {
                setPlaced((p) => [...p, l]);
                setChecked(false);
              }}
              className={cn(
                "block w-full border border-hairline bg-[#faf8f4] px-4 py-2.5 text-left text-ink transition hover:border-ink/40",
                lineCls,
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Your order</p>
        <ol className="mt-2 space-y-2">
          {q.lines.map((_, i) => {
            const l = shown[i];
            const state = !l ? "empty" : finished ? "right" : checked ? (q.lines[i] === l ? "right" : "wrong") : "placed";
            return (
              <li key={i} className="flex items-stretch gap-2">
                <span className="flex w-7 shrink-0 items-center justify-center font-mono text-[12px] text-muted">{i + 1}</span>
                {l ? (
                  <button
                    type="button"
                    disabled={finished}
                    onClick={() => {
                      setPlaced((p) => p.filter((x) => x !== l));
                      setChecked(false);
                    }}
                    title="Tap to remove"
                    className={cn(
                      "flex-1 border px-4 py-2.5 text-left text-ink transition",
                      lineCls,
                      state === "right" && "border-[#2f9e6e] bg-[#eef8f2]",
                      state === "wrong" && "border-[#e8a58a] bg-[#fff1ea]",
                      state === "placed" && "border-ink/30 bg-white hover:border-ink",
                    )}
                  >
                    {l}
                  </button>
                ) : (
                  <span className="flex-1 border border-dashed border-hairline px-4 py-2.5" />
                )}
              </li>
            );
          })}
        </ol>

        {!finished && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={check}
              disabled={placed.length !== q.lines.length}
              className="bg-[#2f9e6e] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#278a5f] disabled:cursor-not-allowed disabled:bg-[#d9d4ca]"
            >
              Check order
            </button>
            {placed.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setPlaced([]);
                  setChecked(false);
                }}
                className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-muted hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
        )}
        {checked && !finished && (
          <p className="mt-3 text-[14px] font-semibold text-[#c2410c]">
            {rightCount} of {q.lines.length} in the right place. Tap the red ones to move them, then check again.
          </p>
        )}
        {(resolved === "first" || resolved === "solved") && (
          <Feedback tone="good" title="Right order!">
            <Rich text={q.explain} />
          </Feedback>
        )}
        {resolved === "revealed" && (
          <Feedback tone="info" title="Here’s the right order.">
            <Rich text={q.explain} />
          </Feedback>
        )}
      </div>
    </div>
  );
}

const normalise = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

function Write({ q, resolved, onResolve }: QProps<"write">) {
  const [code, setCode] = useState(q.starter);
  const { result, running, firstLoad, run } = usePythonRun();
  const [fails, setFails] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  async function check() {
    const r = await run(code, q.inputs);
    if (!r) return;
    let problem: string | null = null;
    if (!r.ok) problem = "Your code has an error. Read the last line of the output, fix it and try again.";
    else if (q.expected !== undefined && normalise(r.stdout) !== normalise(q.expected))
      problem = "It runs, but the output doesn’t match yet. Compare your output with the one asked for.";
    else if (q.check) problem = q.check(r, code);

    if (!problem) {
      setMessage(null);
      onResolve(fails ? "solved" : "first");
      return;
    }
    setMessage(problem);
    setFails((f) => f + 1);
  }

  function reveal() {
    setCode(q.solution);
    setMessage(null);
    onResolve("revealed");
  }

  return (
    <div>
      <div className="border border-[#2a332d]">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#141b16] px-3 py-2">
          <span className="font-mono text-[11px] text-white/45">main.py</span>
          <RunButton
            onClick={resolved ? () => void run(code, q.inputs) : check}
            running={running}
            label={resolved ? "Run" : "Run & check"}
          />
        </div>
        <PyEditor
          value={code}
          onChange={setCode}
          onRun={resolved ? () => void run(code, q.inputs) : check}
          minLines={q.challenge ? 7 : 4}
        />
        {q.inputs && <AnswerLines value={q.inputs.join("\n")} readOnly />}
        <OutputPanel result={result} running={running} firstLoad={firstLoad} />
      </div>

      {resolved === undefined && (
        <>
          {message && <Feedback tone="bad" title="Not yet">{message}</Feedback>}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {fails >= 1 && !showHint && (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink underline underline-offset-4"
              >
                <Lightbulb className="h-4 w-4" /> Show a hint
              </button>
            )}
            {fails >= 2 && (
              <button
                type="button"
                onClick={reveal}
                className="text-[14px] font-semibold text-muted underline underline-offset-4 hover:text-ink"
              >
                Show the solution
              </button>
            )}
          </div>
          {showHint && (
            <Feedback tone="info" title="Hint">
              <Rich text={q.hint} />
            </Feedback>
          )}
        </>
      )}
      {(resolved === "first" || resolved === "solved") && (
        <Feedback tone="good" title={q.challenge ? "Challenge complete!" : "It works!"}>
          {q.challenge ? "You wrote a complete program on your own." : "Your output matches. Well done."}
        </Feedback>
      )}
      {resolved === "revealed" && (
        <Feedback tone="info" title="Here’s one way to solve it.">
          Read through the solution in the editor, then run it to see the output.
        </Feedback>
      )}
    </div>
  );
}

function normaliseFill(s: string, mode: "code" | "text") {
  const unified = s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  return mode === "code" ? unified.replace(/\s+/g, "") : unified.trim().replace(/\s+/g, " ");
}

function Fill({ q, resolved, onResolve }: QProps<"fill">) {
  const [value, setValue] = useState("");
  const [fails, setFails] = useState(0);
  const [shake, setShake] = useState(0);
  const done = resolved !== undefined;
  const [before, after] = q.code ? q.code.split("___") : ["", ""];

  function check() {
    const ok = q.answers.some((a) => normaliseFill(a, q.mode) === normaliseFill(value, q.mode));
    if (ok) {
      onResolve(fails ? "solved" : "first");
      return;
    }
    const n = fails + 1;
    setFails(n);
    setShake((s) => s + 1);
    if (n >= 2) onResolve("revealed");
  }

  const input = (
    <input
      value={done && resolved === "revealed" ? q.answers[0] : value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && value.trim() && !done) check();
      }}
      disabled={done}
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      placeholder={q.placeholder ?? "type here"}
      aria-label="Your answer"
      className={cn(
        "border-b-2 bg-transparent px-1 font-mono text-[16px] outline-none sm:text-[14px]",
        q.code ? "w-[9ch] text-[#ffb27a] placeholder:text-white/30" : "w-full py-2 text-ink placeholder:text-muted/60",
        done ? (resolved === "revealed" ? "border-[#ffb27a]" : "border-[#2f9e6e]") : q.code ? "border-white/40 focus:border-[#ffb27a]" : "border-ink/30 focus:border-ink",
      )}
    />
  );

  return (
    <div>
      <div key={shake} className={cn(shake > 0 && "py-shake")}>
        {q.code ? (
          <div className="overflow-x-auto border border-[#2a332d] bg-[#141b16] px-4 py-4 font-mono text-[14px] leading-[1.9] text-[#e8ece9]">
            <span className="whitespace-pre">{before}</span>
            {input}
            <span className="whitespace-pre">{after}</span>
          </div>
        ) : (
          <div className="border border-hairline bg-[#faf8f4] px-4 py-3">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Your answer</p>
            {input}
          </div>
        )}
      </div>
      {!done && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={check}
            disabled={!value.trim()}
            className="bg-[#2f9e6e] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#278a5f] disabled:cursor-not-allowed disabled:bg-[#d9d4ca]"
          >
            Check answer
          </button>
          {fails === 1 && <span className="text-[14px] font-semibold text-[#c2410c]">Not quite. One more try.</span>}
        </div>
      )}
      {(resolved === "first" || resolved === "solved") && (
        <Feedback tone="good" title="Correct!">
          <Rich text={q.explain} />
        </Feedback>
      )}
      {resolved === "revealed" && (
        <Feedback tone="info" title={`Answer: ${q.answers[0]}`}>
          <Rich text={q.explain} />
        </Feedback>
      )}
    </div>
  );
}
