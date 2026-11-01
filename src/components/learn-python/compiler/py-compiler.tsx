"use client";

import { CompilerPromo } from "@/components/learn-python/compiler/compiler-promo";
import { ExecutionView } from "@/components/learn-python/compiler/execution-view";
import { usePyCompiler } from "@/components/learn-python/compiler/compiler-provider";
import { COMPILER_TEMPLATES } from "@/components/learn-python/compiler/templates";
import { PyEditor } from "@/components/learn-python/lms/py-lms-ui";
import { COMPILER_TIMEOUT_MS, MAX_OUTPUT_CHARS } from "@/lib/python/config";
import { trackPythonRun } from "@/lib/python-compiler-track";
import type { TraceStep } from "@/lib/python/trace";
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
  Moon,
  Square,
  Sun,
  Terminal,
  Upload,
  Workflow,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
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
const THEME_KEY = "mentr:pycompiler:theme";
const DEFAULT_SPLIT = 55;

const CompilerLightContext = createContext(false);

function useCompilerLight() {
  return useContext(CompilerLightContext);
}

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
  surface = "lms",
}: {
  homeHref?: string;
  homeLabel?: string;
  aboutHref?: string;
  surface?: "open" | "lms";
} = {}) {
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
  const [view, setView] = useState<"output" | "viz">("output");
  const [trace, setTrace] = useState<TraceStep[] | null>(null);
  const [traceCode, setTraceCode] = useState("");
  const [traceStdin, setTraceStdin] = useState("");
  const [vizLine, setVizLine] = useState<number | undefined>();
  const [tracing, setTracing] = useState(false);
  const [traceError, setTraceError] = useState<string | null>(null);
  const vizGen = useRef(0);
  const [copied, setCopied] = useState(false);
  const [split, setSplit] = useState(readSplit);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const light = theme === "light";

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  function toggleTheme() {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      window.localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }
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
    vizGen.current += 1;
    setView("output");
    setTracing(false);
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
    trackPythonRun({
      surface,
      ok: r.ok,
      status: r.status,
      errorType: r.error?.type,
      errorMessage: r.error?.message,
      line: r.error?.line,
      durationMs: r.durationMs,
      chars: code.length,
    });
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

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked; nothing to do.
    }
  }

  async function visualize() {
    const gen = ++vizGen.current;
    setView("viz");
    setTab("output");
    setMarkLine(undefined);
    if (!code.trim()) {
      setTracing(false);
      setTrace(null);
      setTraceError("Write some Python in the editor, then visualize it.");
      return;
    }
    setTracing(true);
    setTraceError(null);
    const result = await getPythonEngine().traceCode(code, stdin);
    if (gen !== vizGen.current) return;
    setTracing(false);
    if (!result.ok) {
      if (result.error === "Cancelled") return;
      setTrace(null);
      setTraceError(result.error);
      return;
    }
    setTrace(result.data.trace);
    setTraceCode(code);
    setTraceStdin(stdin);
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
      className="inline-flex items-center gap-2 bg-[#3d84c6] px-5 py-2 text-[14px] font-bold text-white transition hover:bg-[#2f6fad]"
    >
      <Play className="h-3.5 w-3.5 fill-current" /> Run
    </button>
  );

  const activeLine =
    view === "viz" && !tracing && code === traceCode && stdin === traceStdin ? vizLine : undefined;

  const vizBtn = (
    <button
      type="button"
      onClick={() => void visualize()}
      disabled={tracing}
      title="Step through this program in the output pane"
      className={cn(
        "inline-flex items-center gap-1.5 border px-3 py-2 text-[13px] font-bold transition disabled:opacity-60",
        view === "viz"
          ? "border-[#3d84c6] text-[#3d84c6]"
          : light
            ? "border-hairline bg-white text-ink hover:bg-[#e7f1fb]"
            : "border-white/15 bg-transparent text-white hover:bg-white/10",
        light && view === "viz" && "bg-white",
      )}
    >
      {tracing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Workflow className="h-3.5 w-3.5" />} Visualize
    </button>
  );

  return (
    <CompilerLightContext.Provider value={light}>
    <div data-theme={theme} className={cn("py-compiler py-ide relative flex h-full min-h-0 flex-col", light ? "bg-[#eef4fb] text-ink" : "bg-[#15202c] text-white")}>
      <header className={cn("flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-2.5 sm:px-5", light ? "border-hairline bg-white" : "border-white/10")}>
        {homeHref ? (
          <a
            href={homeHref}
            aria-label={homeLabel}
            title={homeLabel}
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#3d84c6] text-white transition hover:bg-[#2f6fad]"
          >
            <Terminal className="h-4 w-4" />
          </a>
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#3d84c6] text-white">
            <Terminal className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[16px] font-extrabold leading-tight">{homeHref ? "Online Python Compiler" : "Python compiler"}</h1>
          <RuntimeLabel />
        </div>
        <div className="flex items-center gap-1">
          <ToolButton label="Open a .py file" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" />
          </ToolButton>
          <ToolButton label="Download main.py" onClick={download}>
            <Download className="h-4 w-4" />
          </ToolButton>
          <ToolButton label={copied ? "Copied" : "Copy code"} onClick={copyCode}>
            {copied ? <Check className="h-4 w-4 text-[#7eb6ea]" /> : <Copy className="h-4 w-4" />}
          </ToolButton>
          <ToolButton
            label="Start over"
            onClick={() => {
              if (window.confirm("Clear your code and start from the visualize example?")) {
                load(COMPILER_TEMPLATES[0].code);
                clearOutput();
              }
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </ToolButton>
          <ToolButton label={light ? "Dark mode" : "Light mode"} onClick={toggleTheme}>
            {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </ToolButton>
          {aboutHref && (
            <a
              href={aboutHref}
              aria-label="About this compiler and how it works"
              title="About this compiler and how it works"
              className={cn(
                "flex h-9 w-9 items-center justify-center transition",
                light ? "text-muted hover:bg-[#e7f1fb] hover:text-ink" : "text-white/55 hover:bg-white/5 hover:text-white",
              )}
            >
              <CircleHelp className="h-4 w-4" />
            </a>
          )}
          <span className="ml-2 hidden items-center gap-2 sm:flex">{vizBtn}{runBtn}</span>
        </div>
        <input ref={fileRef} type="file" accept=".py,.txt,text/x-python,text/plain" className="hidden" onChange={(e) => void upload(e.target.files?.[0])} />
      </header>

      {rt.phase === "loading" && (
        <div className={cn("h-0.5 shrink-0", light ? "bg-hairline" : "bg-white/10")} aria-hidden>
          <div className="h-full bg-[#7eb6ea] transition-all duration-200" style={{ width: `${Math.round((rt.progress ?? 0.1) * 100)}%` }} />
        </div>
      )}

      <div
        className={cn("grid shrink-0 border-b lg:hidden", light ? "border-hairline bg-white" : "border-white/10", interactive ? "grid-cols-2" : "grid-cols-3")}
        role="tablist"
        aria-label="Compiler views"
      >
        {(
          [
            { id: "code", label: "Code" },
            { id: "input", label: inputMissing ? "Input •" : "Input" },
            { id: "output", label: view === "viz" ? (tracing ? "Visualize…" : "Visualize") : awaitingInput ? "Output •" : running ? "Output…" : "Output" },
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
              tab === t.id
                ? light
                  ? "text-ink"
                  : "text-white"
                : t.id === "input" && inputMissing
                  ? "text-[#c2410c]"
                  : light
                    ? "text-muted"
                    : "text-white/50",
            )}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7eb6ea]" />}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="flex min-h-0 flex-1" style={{ ["--py-split" as string]: `${split}%` }}>
        <div className={cn("min-h-0 w-full min-w-0 flex-col lg:flex lg:w-[var(--py-split)] lg:shrink-0", tab === "output" ? "hidden" : "flex")}>
          <PaneTitle className="hidden lg:flex">
            main.py
            <span className={cn("ml-auto normal-case tracking-normal", light ? "text-muted" : "text-white/35")}>Ctrl/⌘ + Enter to run</span>
          </PaneTitle>
          <section aria-label="main.py" className={cn("min-h-0 flex-1 overflow-auto overscroll-contain lg:block", light ? "bg-white" : "bg-[#1c2836]", tab === "code" ? "block" : "hidden")}>
            <PyEditor theme={theme} value={code} onChange={onCodeChange} onRun={run} minLines={18} label="Python code (main.py)" markLine={view === "viz" ? undefined : markLine} activeLine={activeLine} />
          </section>

          {!interactive && (
          <section className={cn("shrink-0 border-t lg:block", light ? "border-hairline bg-[#e7f1fb]" : "border-white/10", tab === "input" ? "flex min-h-0 flex-1 flex-col" : "hidden")}>
            <button
              type="button"
              onClick={() => setInputOpen((o) => !o)}
              className={cn(
                "hidden w-full items-center gap-2 px-4 py-2 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] transition lg:flex",
                light ? "text-muted hover:text-ink" : "text-white/50 hover:text-white",
              )}
              aria-expanded={inputOpen}
            >
              <Keyboard className="h-3.5 w-3.5" /> Input (stdin)
              {inputMissing && <span className="normal-case tracking-normal text-[#c2410c]">· your code uses input()</span>}
              <ChevronDown className={cn("ml-auto h-3.5 w-3.5 transition", inputOpen && "rotate-180")} />
            </button>
            <div className={cn("min-h-0 flex-1 flex-col px-4 pb-3 pt-3 lg:pt-0", inputOpen ? "flex" : "flex lg:hidden")}>
              <p className={cn("mb-2 text-[12.5px] leading-snug", light ? "text-muted" : "text-white/55")}>
                Each line is one answer for <code className="text-[#c2410c]">input()</code>, in order.
              </p>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="Program input, one line per input() call"
                placeholder={"Aarav\n12"}
                className={cn(
                  "min-h-[96px] w-full flex-1 resize-none border px-3 py-2 font-mono text-[16px] leading-[1.6] outline-none sm:text-[13px] lg:h-[110px] lg:flex-none",
                  light
                    ? "border-hairline bg-white text-ink placeholder:text-muted/50 focus:border-ink/30"
                    : "border-white/15 bg-[#121a24] text-white placeholder:text-white/25 focus:border-white/40",
                )}
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
          className={cn(
            "group relative hidden w-[5px] shrink-0 cursor-col-resize touch-none transition hover:bg-[#3d84c6]/70 lg:block",
            light ? "bg-hairline" : "bg-white/10",
          )}
        />

        <section
          aria-label={view === "viz" ? "Visualize" : "Output"}
          className={cn("min-h-0 min-w-0 flex-1 flex-col lg:flex", light ? "bg-[#e7f1fb]" : "bg-[#121a24]", tab === "output" ? "flex" : "hidden")}
        >
          <PaneTitle>
            {view === "viz" ? "Visualize" : "Output"}
            {view === "viz" ? (
              <button
                type="button"
                onClick={() => setView("output")}
                className={cn("ml-auto normal-case tracking-normal", light ? "text-muted hover:text-ink" : "text-white/45 hover:text-white")}
              >
                Output
              </button>
            ) : (
              <>
                <RunStatus running={running} result={result} />
                <button
                  type="button"
                  onClick={clearOutput}
                  disabled={running || (!chunks.length && !result)}
                  className={cn(
                    "ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 normal-case tracking-normal transition disabled:invisible",
                    light ? "text-muted hover:text-ink" : "text-white/45 hover:text-white",
                  )}
                >
                  <Eraser className="h-3 w-3" /> Clear
                </button>
              </>
            )}
          </PaneTitle>
          {view === "viz" ? (
            <div className="min-h-0 flex-1">
              {tracing ? (
                <p className={cn("flex h-full items-center justify-center gap-2 text-[13px]", light ? "text-muted" : "text-white/55")}>
                  <Loader2 className="h-4 w-4 animate-spin" /> Stepping through your code…
                </p>
              ) : traceError ? (
                <p className="p-4 text-[13px] text-[#c2410c]">{traceError}</p>
              ) : trace ? (
                <ExecutionView
                  light={light}
                  code={traceCode}
                  steps={trace}
                  stale={code !== traceCode || stdin !== traceStdin}
                  onLine={setVizLine}
                />
              ) : null}
            </div>
          ) : (
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
          )}
        </section>
      </div>

      <CompilerPromo />
      <div className={cn("shrink-0 border-t px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden", light ? "border-hairline bg-white" : "border-white/10 bg-[#1c2836]")}>
        <div className="flex items-center gap-2">
          <p className={cn("min-w-0 flex-1 truncate font-mono text-[11px]", light ? "text-muted" : "text-white/45")}>Runs on your device · free</p>
          {vizBtn}
          {runBtn}
        </div>
      </div>
    </div>
    </CompilerLightContext.Provider>
  );
}

function PaneTitle({ children, className }: { children: ReactNode; className?: string }) {
  const light = useCompilerLight();
  return (
    <div
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 border-b px-4 font-mono text-[10.5px] uppercase tracking-[0.14em]",
        light ? "border-hairline bg-[#e7f1fb] text-muted" : "border-white/10 bg-[#15202c] text-white/50",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  const light = useCompilerLight();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center transition",
        light ? "text-muted hover:bg-[#e7f1fb] hover:text-ink" : "text-white/55 hover:bg-white/5 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function RuntimeLabel() {
  const rt = usePythonRuntime();
  const light = useCompilerLight();
  let text: string;
  let tone = light ? "text-muted" : "text-white/45";
  if (rt.phase === "loading") {
    text = `${rt.detail ?? "Loading Python"}${rt.progress !== null && rt.progress < 1 ? ` · ${Math.round(rt.progress * 100)}%` : "…"}`;
    tone = "text-[#c2410c]";
  } else if (rt.phase === "error") {
    text = rt.error ?? "Python failed to load";
    tone = "text-[#c2410c]";
  } else if (rt.pythonVersion) {
    text = `Python ${rt.pythonVersion} · runs in your browser${rt.phase === "running" && rt.detail ? ` · ${rt.detail}` : ""}`;
  } else {
    text = "Python 3 · runs in your browser";
  }
  return (
    <p className={cn("truncate font-mono text-[11px]", tone)}>
      {rt.phase === "ready" && <span className="mr-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] bg-[#7eb6ea]" aria-hidden />}
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
  const light = useCompilerLight();
  if (running) {
    return (
      <span className={cn("inline-flex items-center gap-1 normal-case tracking-normal", light ? "text-muted" : "text-white/55")}>
        <Loader2 className="h-3 w-3 animate-spin" /> running
      </span>
    );
  }
  if (!result) return null;
  const map: Record<RunResult["status"], [string, string]> = {
    ok: [`finished in ${formatMs(result.durationMs)}`, light ? "text-[#1e5a94]" : "text-[#7eb6ea]"],
    error: [result.error?.type ?? "error", "text-[#c2410c]"],
    timeout: ["timed out", "text-[#c2410c]"],
    stopped: ["stopped", light ? "text-muted" : "text-white/55"],
    "load-failed": ["couldn't load Python", "text-[#c2410c]"],
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

  const light = useCompilerLight();
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
      className={cn(
        "inline max-w-full border-b bg-transparent p-0 font-mono text-[16px] outline-none sm:text-[13.5px]",
        light
          ? "border-[#1e5a94]/50 text-[#1e5a94] caret-[#1e5a94] focus:border-[#1e5a94]"
          : "border-[#7eb6ea]/50 text-[#7eb6ea] caret-[#7eb6ea] focus:border-[#7eb6ea]",
      )}
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
  const light = useCompilerLight();
  if (!chunks.length && !result && !awaitingInput) {
    return (
      <p className={cn("pt-1", light ? "text-muted" : "text-white/30")}>
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
            <span key={i} className={c.stream === "stderr" ? "py-out-err" : c.stream === "stdin" ? "py-out-in" : "py-out-out"}>
              {c.text}
            </span>
          ))}
          {awaitingInput && <ConsoleInput onSubmit={onSubmitInput} />}
        </pre>
      )}
      {result?.ok && !chunks.length && <p className={light ? "text-muted" : "text-white/40"}>(no output)</p>}
      {result?.truncated && <p className="mt-2 text-[#c2410c]">Output stopped after {MAX_OUTPUT_CHARS.toLocaleString()} characters.</p>}
      {e && result?.status !== "stopped" && (
        <div className={cn("mt-3 border-l-2 border-[#c2410c] px-3 py-2.5 font-sans", light ? "bg-[#c2410c]/[0.06]" : "bg-[#ff9b8a]/[0.07]")}>
          <p className="font-mono text-[13px] font-semibold text-[#c2410c]">
            {e.type === "TimeoutError" || e.type === "LoadError" || e.type === "RuntimeError" ? e.message : `${e.type}: ${e.message}`}
          </p>
          {e.line && (
            <button
              type="button"
              onClick={() => onGoToLine(e.line!)}
              className={cn("mt-1 font-mono text-[12px] underline underline-offset-2", light ? "text-ink/70 hover:text-ink" : "text-white/70 hover:text-white")}
            >
              Line {e.line} in main.py
            </button>
          )}
          {e.hint && <p className={cn("mt-1.5 text-[13px] leading-snug", light ? "text-ink/70" : "text-white/70")}>{e.hint}</p>}
          {e.traceback && e.traceback.includes("\n") && (
            <details className="mt-2">
              <summary className={cn("cursor-pointer font-mono text-[11.5px]", light ? "text-muted hover:text-ink" : "text-white/45 hover:text-white/70")}>
                Full traceback
              </summary>
              <pre className={cn("mt-1.5 overflow-x-auto whitespace-pre font-mono text-[12px] leading-[1.6]", light ? "text-ink/70" : "text-white/60")}>{e.traceback}</pre>
            </details>
          )}
        </div>
      )}
      {result?.status === "stopped" && <p className={cn("mt-2", light ? "text-muted" : "text-white/45")}>Program stopped.</p>}
    </>
  );
}
