"use client";

import { usePyCompiler } from "@/components/learn-python/compiler/compiler-provider";
import { COMPILER_TEMPLATES } from "@/components/learn-python/compiler/templates";
import { PyEditor } from "@/components/learn-python/lms/py-lms-ui";
import { COMPILER_TIMEOUT_MS, MAX_OUTPUT_CHARS } from "@/lib/python/config";
import { getPythonEngine, supportsInteractiveInput, type OutputChunk, type RunResult } from "@/lib/python/engine";
import { usePythonRuntime } from "@/lib/python/use-python-runtime";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  CircleHelp,
  Copy,
  Download,
  Eraser,
  Keyboard,
  Loader2,
  Play,
  RotateCcw,
  Square,
  Terminal,
  Upload,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

type Tab = "code" | "input" | "output";

const MAX_UPLOAD_BYTES = 200_000;
const USES_INPUT = /\binput\s*\(/;
const SPLIT_KEY = "mentr:pycompiler:split";
const DEFAULT_SPLIT = 55;

function mergeChunk(list: OutputChunk[], chunk: OutputChunk): OutputChunk[] {
  const last = list[list.length - 1];
  if (last && last.stream === chunk.stream) return [...list.slice(0, -1), { ...last, text: last.text + chunk.text }];
  return [...list, chunk];
}

const noopSubscribe = () => () => undefined;

function readSplit(): number {
  if (typeof window === "undefined") return DEFAULT_SPLIT;
  const saved = Number(window.localStorage.getItem(SPLIT_KEY));
  return saved >= 30 && saved <= 75 ? saved : DEFAULT_SPLIT;
}

/** Full-page compiler: code (and input) on the left, output on the right; tabs on small screens. */
export function PyCompiler({
  homeHref,
  homeLabel,
  aboutHref,
}: { homeHref?: string; homeLabel?: string; aboutHref?: string } = {}) {
  const { workspace } = usePyCompiler();
  const { code, stdin, setCode, setStdin, load } = workspace;
  const rt = usePythonRuntime();
  const interactive = useSyncExternalStore(noopSubscribe, supportsInteractiveInput, () => false);
  const [tabState, setTab] = useState<Tab>("code");
  const tab = interactive && tabState === "input" ? "code" : tabState;
  const [chunks, setChunks] = useState<OutputChunk[]>([]);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [inputOpen, setInputOpen] = useState(() => USES_INPUT.test(code));
  const [markLine, setMarkLine] = useState<number | undefined>();
  const [copied, setCopied] = useState(false);
  const [split, setSplit] = useState(readSplit);
  const outputRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const needsInput = USES_INPUT.test(code);
  const inputMissing = !interactive && needsInput && !stdin.trim();

  useEffect(() => {
    void getPythonEngine().preload().catch(() => undefined);
  }, []);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chunks, result]);

  async function run() {
    if (running) return;
    setChunks([]);
    setResult(null);
    setMarkLine(undefined);
    setRunning(true);
    setTab("output");
    const r = await getPythonEngine().run(code, {
      stdin,
      interactive: true,
      onInputRequest: () => setAwaitingInput(true),
      timeoutMs: COMPILER_TIMEOUT_MS,
      packages: true,
      onOutput: (c) => setChunks((list) => mergeChunk(list, c)),
    });
    setAwaitingInput(false);
    setResult(r);
    setMarkLine(r.error?.line);
    setRunning(false);
  }

  function submitInput(line: string | null) {
    setAwaitingInput(false);
    getPythonEngine().provideInput(line);
  }

  function clearOutput() {
    setChunks([]);
    setResult(null);
    setMarkLine(undefined);
  }

  function onCodeChange(next: string) {
    setCode(next);
    if (markLine) setMarkLine(undefined);
  }

  function pickTemplate(id: string) {
    const t = COMPILER_TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    if (code.trim() && code !== t.code && !window.confirm("Replace your code with this example?")) return;
    load(t.code, t.stdin ?? "");
    setInputOpen(Boolean(t.stdin));
    clearOutput();
    setTab("code");
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked; nothing to do.
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([code], { type: "text/x-python" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "main.py";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      window.alert("That file is too large. Pick a .py file under 200 KB.");
      return;
    }
    load(await file.text(), stdin);
    clearOutput();
    setTab("code");
    if (fileRef.current) fileRef.current.value = "";
  }

  const onSplitDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
  }, []);
  const onSplitMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    if (!dragging.current || !grid) return;
    const rect = grid.getBoundingClientRect();
    setSplit(Math.min(75, Math.max(30, ((e.clientX - rect.left) / rect.width) * 100)));
  }, []);
  const onSplitUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setSplit((s) => {
      window.localStorage.setItem(SPLIT_KEY, String(Math.round(s)));
      return s;
    });
  }, []);

  const runBtn = running ? (
    <button
      type="button"
      onClick={() => getPythonEngine().stop()}
      className="inline-flex items-center gap-2 bg-[#c2410c] px-5 py-2 text-[14px] font-bold text-white transition hover:bg-[#a83a0b]"
    >
      <Square className="h-3.5 w-3.5 fill-current" /> Stop
    </button>
  ) : (
    <button
      type="button"
      onClick={run}
      title="Run (Ctrl/⌘ + Enter)"
      className="inline-flex items-center gap-2 bg-[#2f9e6e] px-5 py-2 text-[14px] font-bold text-white transition hover:bg-[#278a5f]"
    >
      <Play className="h-3.5 w-3.5 fill-current" /> Run
    </button>
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0f1612] text-white">
      <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/10 px-3 py-2.5 sm:px-5">
        {homeHref ? (
          <a
            href={homeHref}
            aria-label={homeLabel}
            title={homeLabel}
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#2f9e6e] transition hover:bg-[#278a5f]"
          >
            <Terminal className="h-4 w-4" />
          </a>
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#2f9e6e]">
            <Terminal className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[16px] font-extrabold leading-tight">{homeHref ? "Online Python Compiler" : "Python compiler"}</h1>
          <RuntimeLabel />
        </div>
        <div className="flex items-center gap-1">
          <label className="relative flex min-w-0 items-center">
            <span className="sr-only">Load an example</span>
            <select
              value=""
              onChange={(e) => pickTemplate(e.target.value)}
              className="h-9 max-w-[132px] cursor-pointer appearance-none truncate border border-white/15 bg-transparent pl-2.5 pr-7 text-[13px] font-semibold text-white/80 outline-none transition hover:border-white/35 focus:border-white/50 sm:max-w-none"
            >
              <option value="" disabled className="text-ink">
                Examples
              </option>
              {COMPILER_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id} className="text-ink">
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-white/50" />
          </label>
          <ToolButton label="Open a .py file" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" />
          </ToolButton>
          <ToolButton label="Download main.py" onClick={download}>
            <Download className="h-4 w-4" />
          </ToolButton>
          <ToolButton label={copied ? "Copied" : "Copy code"} onClick={copyCode}>
            {copied ? <Check className="h-4 w-4 text-[#5ee0a0]" /> : <Copy className="h-4 w-4" />}
          </ToolButton>
          <ToolButton
            label="Start over"
            onClick={() => {
              if (window.confirm("Clear your code and start from the Hello, world example?")) {
                load(COMPILER_TEMPLATES[0].code);
                clearOutput();
              }
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </ToolButton>
          {aboutHref && (
            <a
              href={aboutHref}
              aria-label="About this compiler and how it works"
              title="About this compiler and how it works"
              className="flex h-9 w-9 items-center justify-center text-white/55 transition hover:bg-white/5 hover:text-white"
            >
              <CircleHelp className="h-4 w-4" />
            </a>
          )}
          <span className="ml-2 hidden sm:block">{runBtn}</span>
        </div>
        <input ref={fileRef} type="file" accept=".py,.txt,text/x-python,text/plain" className="hidden" onChange={(e) => void upload(e.target.files?.[0])} />
      </header>

      {rt.phase === "loading" && (
        <div className="h-0.5 shrink-0 bg-white/10" aria-hidden>
          <div className="h-full bg-[#5ee0a0] transition-all duration-200" style={{ width: `${Math.round((rt.progress ?? 0.1) * 100)}%` }} />
        </div>
      )}

      <div
        className={cn("grid shrink-0 border-b border-white/10 lg:hidden", interactive ? "grid-cols-2" : "grid-cols-3")}
        role="tablist"
        aria-label="Compiler views"
      >
        {(
          [
            { id: "code", label: "Code" },
            { id: "input", label: inputMissing ? "Input •" : "Input" },
            { id: "output", label: awaitingInput ? "Output •" : running ? "Output…" : "Output" },
          ] as const
        )
          .filter((t) => !(interactive && t.id === "input"))
          .map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative py-2.5 text-[13px] font-bold transition",
              tab === t.id ? "text-white" : t.id === "input" && inputMissing ? "text-[#ffb27a]" : "text-white/50",
            )}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#5ee0a0]" />}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="flex min-h-0 flex-1" style={{ ["--py-split" as string]: `${split}%` }}>
        <div className={cn("min-h-0 w-full min-w-0 flex-col lg:flex lg:w-[var(--py-split)] lg:shrink-0", tab === "output" ? "hidden" : "flex")}>
          <PaneTitle className="hidden lg:flex">
            main.py
            <span className="ml-auto normal-case tracking-normal text-white/35">Ctrl/⌘ + Enter to run</span>
          </PaneTitle>
          <section aria-label="main.py" className={cn("min-h-0 flex-1 overflow-auto overscroll-contain bg-[#141b16] lg:block", tab === "code" ? "block" : "hidden")}>
            <PyEditor value={code} onChange={onCodeChange} onRun={run} minLines={18} label="Python code (main.py)" markLine={markLine} />
          </section>

          {!interactive && (
          <section className={cn("shrink-0 border-t border-white/10 lg:block", tab === "input" ? "flex min-h-0 flex-1 flex-col" : "hidden")}>
            <button
              type="button"
              onClick={() => setInputOpen((o) => !o)}
              className="hidden w-full items-center gap-2 px-4 py-2 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/50 transition hover:text-white lg:flex"
              aria-expanded={inputOpen}
            >
              <Keyboard className="h-3.5 w-3.5" /> Input (stdin)
              {inputMissing && <span className="normal-case tracking-normal text-[#ffb27a]">· your code uses input()</span>}
              <ChevronDown className={cn("ml-auto h-3.5 w-3.5 transition", inputOpen && "rotate-180")} />
            </button>
            <div className={cn("min-h-0 flex-1 flex-col px-4 pb-3 pt-3 lg:pt-0", inputOpen ? "flex" : "flex lg:hidden")}>
              <p className="mb-2 text-[12.5px] leading-snug text-white/55">
                Each line is one answer for <code className="text-[#ffb27a]">input()</code>, in order.
              </p>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="Program input, one line per input() call"
                placeholder={"Aarav\n12"}
                className="min-h-[96px] w-full flex-1 resize-none border border-white/15 bg-[#0b100d] px-3 py-2 font-mono text-[16px] leading-[1.6] text-white outline-none placeholder:text-white/25 focus:border-white/40 sm:text-[13px] lg:h-[110px] lg:flex-none"
              />
            </div>
          </section>
          )}
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize code and output"
          onPointerDown={onSplitDown}
          onPointerMove={onSplitMove}
          onPointerUp={onSplitUp}
          onPointerCancel={onSplitUp}
          onDoubleClick={() => {
            setSplit(DEFAULT_SPLIT);
            window.localStorage.removeItem(SPLIT_KEY);
          }}
          className="group relative hidden w-[5px] shrink-0 cursor-col-resize touch-none bg-white/10 transition hover:bg-[#5ee0a0]/60 lg:block"
        />

        <section
          aria-label="Output"
          className={cn("min-h-0 min-w-0 flex-1 flex-col bg-[#0b100d] lg:flex", tab === "output" ? "flex" : "hidden")}
        >
          <PaneTitle>
            Output
            <RunStatus running={running} result={result} />
            <button
              type="button"
              onClick={clearOutput}
              disabled={running || (!chunks.length && !result)}
              className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 normal-case tracking-normal text-white/45 transition hover:text-white disabled:invisible"
            >
              <Eraser className="h-3 w-3" /> Clear
            </button>
          </PaneTitle>
          <div
            ref={outputRef}
            role="log"
            aria-live="polite"
            aria-label="Program output"
            data-py-console
            onClick={() => {
              if (awaitingInput && !window.getSelection()?.toString()) {
                outputRef.current?.querySelector<HTMLInputElement>("[data-py-stdin]")?.focus();
              }
            }}
            className="min-h-0 flex-1 overflow-auto overscroll-contain px-4 pb-6 pt-2 font-mono text-[13.5px] leading-[1.65]"
          >
            <Console
              chunks={chunks}
              result={result}
              running={running}
              interactive={interactive}
              awaitingInput={awaitingInput}
              onSubmitInput={submitInput}
              onGoToLine={(l) => {
                setMarkLine(l);
                setTab("code");
              }}
            />
          </div>
        </section>
      </div>

      <div className="shrink-0 border-t border-white/10 bg-[#141b16] px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-white/45">Runs on your device · free</p>
          {runBtn}
        </div>
      </div>
    </div>
  );
}

function PaneTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 border-b border-white/10 bg-[#0f1612] px-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/50",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center text-white/55 transition hover:bg-white/5 hover:text-white"
    >
      {children}
    </button>
  );
}

function RuntimeLabel() {
  const rt = usePythonRuntime();
  let text: string;
  let tone = "text-white/45";
  if (rt.phase === "loading") {
    text = `${rt.detail ?? "Loading Python"}${rt.progress !== null && rt.progress < 1 ? ` · ${Math.round(rt.progress * 100)}%` : "…"}`;
    tone = "text-[#ffb27a]";
  } else if (rt.phase === "error") {
    text = rt.error ?? "Python failed to load";
    tone = "text-[#ff9b8a]";
  } else if (rt.pythonVersion) {
    text = `Python ${rt.pythonVersion} · runs in your browser${rt.phase === "running" && rt.detail ? ` · ${rt.detail}` : ""}`;
  } else {
    text = "Python 3 · runs in your browser";
  }
  return (
    <p className={cn("truncate font-mono text-[11px]", tone)}>
      {rt.phase === "ready" && <span className="mr-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] bg-[#5ee0a0]" aria-hidden />}
      {text}
      {rt.phase === "error" && (
        <button type="button" onClick={() => void getPythonEngine().retry().catch(() => undefined)} className="ml-2 underline underline-offset-2">
          Retry
        </button>
      )}
    </p>
  );
}

function RunStatus({ running, result }: { running: boolean; result: RunResult | null }) {
  if (running) {
    return (
      <span className="inline-flex items-center gap-1 normal-case tracking-normal text-white/55">
        <Loader2 className="h-3 w-3 animate-spin" /> running
      </span>
    );
  }
  if (!result) return null;
  const map: Record<RunResult["status"], [string, string]> = {
    ok: [`finished in ${formatMs(result.durationMs)}`, "text-[#5ee0a0]"],
    error: [result.error?.type ?? "error", "text-[#ff9b8a]"],
    timeout: ["timed out", "text-[#ffb27a]"],
    stopped: ["stopped", "text-white/55"],
    "load-failed": ["couldn't load Python", "text-[#ff9b8a]"],
  };
  const [label, tone] = map[result.status];
  return <span className={cn("normal-case tracking-normal", tone)}>· {label}</span>;
}

function formatMs(ms: number): string {
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(2)} s`;
}

/** Inline answer box for input(): sits right after the prompt, Enter sends the line, Ctrl+D sends end of input. */
function ConsoleInput({ onSubmit }: { onSubmit: (line: string | null) => void }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    ref.current?.scrollIntoView({ block: "nearest" });
  }, []);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "d" && e.ctrlKey && !value) {
      e.preventDefault();
      onSubmit(null);
    }
  }

  return (
    <form
      className="inline"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
    <input
      ref={ref}
      data-py-stdin
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onKeyDown}
      enterKeyHint="send"
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      aria-label="Type your input and press Enter"
      style={{ width: `${Math.max(value.length + 2, 3)}ch` }}
      className="inline max-w-full border-b border-[#5ee0a0]/50 bg-transparent p-0 font-mono text-[16px] text-[#5ee0a0] caret-[#5ee0a0] outline-none focus:border-[#5ee0a0] sm:text-[13.5px]"
    />
    </form>
  );
}

function Console({
  chunks,
  result,
  running,
  interactive,
  awaitingInput,
  onSubmitInput,
  onGoToLine,
}: {
  chunks: OutputChunk[];
  result: RunResult | null;
  running: boolean;
  interactive: boolean;
  awaitingInput: boolean;
  onSubmitInput: (line: string | null) => void;
  onGoToLine: (line: number) => void;
}) {
  if (!chunks.length && !result && !awaitingInput) {
    return (
      <p className="pt-1 text-white/30">
        {running
          ? ""
          : interactive
            ? "Press Run to see your program's output here. When it asks for input(), type the answer here and press Enter."
            : "Press Run to see your program's output here."}
      </p>
    );
  }
  const e = result?.error;
  return (
    <>
      {(chunks.length > 0 || awaitingInput) && (
        <pre className="whitespace-pre-wrap break-words">
          {chunks.map((c, i) => (
            <span key={i} className={c.stream === "stderr" ? "text-[#ff9b8a]" : c.stream === "stdin" ? "text-[#5ee0a0]" : "text-[#e8ece9]"}>
              {c.text}
            </span>
          ))}
          {awaitingInput && <ConsoleInput onSubmit={onSubmitInput} />}
        </pre>
      )}
      {result?.ok && !chunks.length && <p className="text-white/40">(no output)</p>}
      {result?.truncated && <p className="mt-2 text-[#ffb27a]">Output stopped after {MAX_OUTPUT_CHARS.toLocaleString()} characters.</p>}
      {e && result?.status !== "stopped" && (
        <div className="mt-3 border-l-2 border-[#ff9b8a] bg-[#ff9b8a]/[0.07] px-3 py-2.5 font-sans">
          <p className="font-mono text-[13px] font-semibold text-[#ff9b8a]">
            {e.type === "TimeoutError" || e.type === "LoadError" || e.type === "RuntimeError" ? e.message : `${e.type}: ${e.message}`}
          </p>
          {e.line && (
            <button type="button" onClick={() => onGoToLine(e.line!)} className="mt-1 font-mono text-[12px] text-white/70 underline underline-offset-2 hover:text-white">
              Line {e.line} in main.py
            </button>
          )}
          {e.hint && <p className="mt-1.5 text-[13px] leading-snug text-white/70">{e.hint}</p>}
          {e.traceback && e.traceback.includes("\n") && (
            <details className="mt-2">
              <summary className="cursor-pointer font-mono text-[11.5px] text-white/45 hover:text-white/70">Full traceback</summary>
              <pre className="mt-1.5 overflow-x-auto whitespace-pre font-mono text-[12px] leading-[1.6] text-white/60">{e.traceback}</pre>
            </details>
          )}
        </div>
      )}
      {result?.status === "stopped" && <p className="mt-2 text-white/45">Program stopped.</p>}
    </>
  );
}
