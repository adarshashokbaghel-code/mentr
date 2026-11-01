"use client";

import type { Encoded, TraceStep } from "@/lib/python/trace";
import { cn } from "@/lib/utils";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type Slide = {
  line?: number;
  source: string;
  event?: string;
  state: TraceStep;
};

export function ExecutionView({
  light,
  code,
  steps,
  stale,
  onLine,
}: {
  light: boolean;
  code: string;
  steps: TraceStep[];
  stale: boolean;
  onLine: (line: number | undefined) => void;
}) {
  const slides = useMemo(() => buildSlides(code, steps), [code, steps]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = Math.max(0, slides.length - 1);
  const safeIndex = Math.min(index, last);
  const slide = slides[safeIndex];

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    onLine(slide?.line);
  }, [slide?.line, onLine]);

  useEffect(() => {
    if (!playing) return;
    if (safeIndex >= last) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setIndex(safeIndex + 1), 800);
    return () => window.clearTimeout(timer);
  }, [playing, safeIndex, last]);

  function go(next: number) {
    setPlaying(false);
    setIndex(Math.min(last, Math.max(0, next)));
  }

  if (!slide) {
    return <p className={cn("p-4 text-[13px]", light ? "text-muted" : "text-white/55")}>Nothing to step through.</p>;
  }

  const stdout = slide.state.stdout ?? "";
  const frames = (slide.state.stack_to_render ?? []).filter((frame) => !frame.is_zombie);
  const explanation = explainLine(slide.source, slide.event, slide.state);
  const ink = light ? "text-ink" : "text-white";
  const muted = light ? "text-muted" : "text-white/50";
  const box = light ? "border-hairline bg-white" : "border-white/15 bg-[#1c2836]";

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(safeIndex - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(safeIndex + 1);
        }
      }}
    >
      <div className={cn("flex shrink-0 flex-wrap items-center justify-center gap-2 border-b px-2 py-2 sm:px-3", light ? "border-hairline bg-white" : "border-white/10 bg-[#1c2836]")}>
        <Ctrl label="First step" disabled={safeIndex === 0} light={light} onClick={() => go(0)}>
          <SkipBack className="h-3.5 w-3.5" />
        </Ctrl>
        <Ctrl label={playing ? "Pause" : "Play"} disabled={safeIndex >= last && !playing} light={light} onClick={() => setPlaying((on) => !on)}>
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
        </Ctrl>
        <label className="min-w-[9.5rem] flex-1 sm:max-w-xs">
          <span className={cn("block text-center font-mono text-[12px] tabular-nums", ink)}>
            Step {safeIndex + 1} of {slides.length}
          </span>
          <input
            type="range"
            min={0}
            max={last}
            value={safeIndex}
            aria-label="Execution step"
            onChange={(e) => go(Number(e.target.value))}
            className="mt-1 h-1 w-full accent-[#3d84c6]"
          />
        </label>
        <Ctrl label="Last step" disabled={safeIndex >= last} light={light} onClick={() => go(last)}>
          <SkipForward className="h-3.5 w-3.5" />
        </Ctrl>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-auto px-3 py-3 pb-36 sm:px-4 sm:pb-4">
        {stale && (
          <p className={cn("border px-3 py-2 text-[12.5px] leading-snug", box, muted)}>
            The editor changed. Press Visualize to step through the new code.
          </p>
        )}

        <section>
          <h3 className={cn("mb-1.5 text-[12px] font-semibold", light ? "text-[#c2410c]" : "text-[#ffb27a]")}>Output</h3>
          <pre className={cn("min-h-[2.75rem] overflow-x-auto whitespace-pre-wrap break-words border px-3 py-2 font-mono text-[13px] leading-relaxed", box, ink)}>
            {stdout || <span className={muted}>No output yet</span>}
          </pre>
        </section>

        {frames.map((frame) => (
          <Block
            key={frame.frame_id}
            title={frame.func_name}
            names={frame.ordered_varnames ?? []}
            locals={frame.encoded_locals ?? {}}
            heap={slide.state.heap ?? {}}
            light={light}
          />
        ))}
        <Block
          title="Main Block"
          names={slide.state.ordered_globals ?? []}
          locals={slide.state.globals ?? {}}
          heap={slide.state.heap ?? {}}
          light={light}
        />

        <section className={cn("border border-dashed px-3 py-2.5", light ? "border-hairline" : "border-white/20")}>
          <h3 className={cn("text-[12px] font-semibold", light ? "text-[#c2410c]" : "text-[#ffb27a]")}>Explanation of this code:</h3>
          {slide.source.trim() && (
            <p className={cn("mt-1.5 overflow-x-auto font-mono text-[13px] leading-relaxed", ink)}>{slide.source.trim()}</p>
          )}
          <p className={cn("mt-2 text-[13.5px] leading-relaxed", light ? "text-ink/90" : "text-white/85")}>{explanation}</p>
        </section>

        {safeIndex === last && (
          <p className={cn("border px-3 py-2 text-[13px] font-semibold text-[#3d84c6]", light ? "border-[#3d84c6]/30 bg-[#3d84c6]/10" : "border-[#3d84c6]/40 bg-[#3d84c6]/10")}>
            All {slides.length} {slides.length === 1 ? "step" : "steps"} executed.
          </p>
        )}
      </div>
    </div>
  );
}

function Ctrl({
  label,
  disabled,
  light,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  light: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center border transition disabled:opacity-30",
        light ? "border-hairline bg-white text-ink hover:bg-cream-band" : "border-white/15 text-white hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}

function Block({
  title,
  names,
  locals,
  heap,
  light,
}: {
  title: string;
  names: string[];
  locals: Record<string, Encoded>;
  heap: Record<string, Encoded>;
  light: boolean;
}) {
  const shown = names.filter((name) => name === "__return__" || !name.startsWith("__"));
  return (
    <fieldset className={cn("min-w-0 border border-dashed px-3 py-2", light ? "border-ink/25" : "border-white/25")}>
      <legend className={cn("px-1.5 text-[12px]", light ? "text-muted" : "text-white/55")}>{title}</legend>
      {shown.length === 0 ? (
        <div className="min-h-10" />
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {shown.map((name) => (
            <div key={name} className={cn("min-w-0 border px-2.5 py-1.5 sm:max-w-full", light ? "border-hairline bg-[#eef4fb]" : "border-white/10 bg-[#121a24]")}>
              <div className={cn("truncate font-mono text-[11px]", light ? "text-muted" : "text-white/45")}>{name === "__return__" ? "return" : name}</div>
              <div className={cn("break-words font-mono text-[13px] leading-snug", light ? "text-ink" : "text-white")}>{reprValue(locals[name], heap)}</div>
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
}

function buildSlides(code: string, steps: TraceStep[]): Slide[] {
  const lines = code.split("\n");
  const slides: Slide[] = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.event !== "step_line" && step.event !== "exception" && step.event !== "uncaught_exception" && step.event !== "instruction_limit_reached") continue;
    const state = steps[i + 1] ?? step;
    slides.push({
      line: step.line,
      source: step.line ? (lines[step.line - 1] ?? "") : "",
      event: step.event,
      state,
    });
  }
  return slides;
}

function explainLine(source: string, event: string | undefined, state: TraceStep): string {
  if (event === "instruction_limit_reached") return "Stopped after 1,000 steps. Shorten the program to see the rest.";
  if (event === "exception" || event === "uncaught_exception" || state.exception_msg) {
    return state.exception_msg || "This line raised an error, so the program stops here.";
  }
  const src = source.trim();
  if (!src) return "Python moves on to the next line.";
  if (src.startsWith("#")) return "This line is a comment. Python skips it.";
  if (/^print\s*\(/.test(src)) return "The print() function displays the output, which can be viewed in the output panel.";
  if (/^(import|from)\s+/.test(src)) return "This loads a module so the names inside it can be used.";
  const defined = /^(?:def|class)\s+([A-Za-z_]\w*)/.exec(src);
  if (defined) {
    return src.startsWith("def")
      ? `This defines the function ${defined[1]}. The lines inside it run only when the function is called.`
      : `This defines the class ${defined[1]}.`;
  }
  if (/^return\b/.test(src)) return "This sends a value back to the line that called the function.";
  if (/^if\b/.test(src)) return "Python checks this condition. When it is true, the indented lines under it run.";
  if (/^elif\b/.test(src)) return "Python checks this condition only because the earlier ones were false.";
  if (/^else\s*:/.test(src)) return "These indented lines run because the conditions above were false.";
  if (/^while\b/.test(src)) return "Python checks this condition. While it stays true, the indented lines run again.";
  const loop = /^for\s+([A-Za-z_]\w*)\s+in\b/.exec(src);
  if (loop) {
    const value = lookup(loop[1], state);
    return value !== undefined ? `The loop sets ${loop[1]} to ${value}, then runs the indented lines.` : "The loop takes the next item, then runs the indented lines.";
  }
  const assigned = /^([A-Za-z_]\w*)\s*(?:\+=|-=|\*=|\/\/=|\/=|%=|\*\*=|=)(?!=)/.exec(src);
  if (assigned) {
    const value = lookup(assigned[1], state);
    return value !== undefined ? `${assigned[1]} now holds ${value}.` : `The value is stored in ${assigned[1]}.`;
  }
  if (src.includes("input(")) return "input() reads the next line from the input box and the program continues with that text.";
  return "Python runs this line, then moves to the next one.";
}

function lookup(name: string, state: TraceStep): string | undefined {
  const heap = state.heap ?? {};
  const frame = (state.stack_to_render ?? []).find((item) => item.is_highlighted && !item.is_zombie);
  const local = frame?.encoded_locals?.[name];
  if (local !== undefined) return reprValue(local, heap);
  const global = state.globals?.[name];
  if (global !== undefined) return reprValue(global, heap);
  return undefined;
}

function reprValue(value: Encoded, heap: Record<string, Encoded>, seen = new Set<string>()): string {
  if (Array.isArray(value) && value[0] === "REF") {
    const id = String(value[1]);
    if (seen.has(id)) return "...";
    const next = new Set(seen);
    next.add(id);
    return reprValue(heap[id], heap, next);
  }
  if (Array.isArray(value) && value[0] === "SPECIAL_FLOAT") return String(value[1]);
  if (Array.isArray(value) && (value[0] === "LIST" || value[0] === "TUPLE" || value[0] === "SET")) {
    const open = value[0] === "LIST" ? "[" : value[0] === "TUPLE" ? "(" : "{";
    const close = value[0] === "LIST" ? "]" : value[0] === "TUPLE" ? ")" : "}";
    const parts = value.slice(1).map((item) => reprValue(item as Encoded, heap, seen));
    if (value[0] === "TUPLE" && parts.length === 1) return `(${parts[0]},)`;
    return `${open}${parts.join(", ")}${close}`;
  }
  if (Array.isArray(value) && value[0] === "DICT") {
    const parts = value.slice(1).map((pair) => {
      const [key, item] = Array.isArray(pair) ? pair : [pair, null];
      return `${reprValue(key as Encoded, heap, seen)}: ${reprValue(item as Encoded, heap, seen)}`;
    });
    return `{${parts.join(", ")}}`;
  }
  if (Array.isArray(value) && value[0] === "FUNCTION") return `function ${String(value[1] ?? "")}`;
  if (Array.isArray(value) && value[0] === "CLASS") return `class ${String(value[1] ?? "")}`;
  if (Array.isArray(value) && (value[0] === "INSTANCE" || value[0] === "INSTANCE_PPRINT")) return String(value[1] ?? "object");
  if (value === null || value === undefined) return "None";
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  return String(value);
}
