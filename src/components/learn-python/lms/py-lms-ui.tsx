"use client";

import { highlight } from "@/components/learn-python/python-code";
import type { PythonRunResult } from "@/lib/python-runner";
import { usePythonRuntime } from "@/lib/python/use-python-runtime";
import { cn } from "@/lib/utils";
import { Loader2, Play } from "lucide-react";
import { Fragment, useRef, type KeyboardEvent, type ReactNode } from "react";

/** Renders `code` spans and **bold** inside plain strings. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="border border-hairline bg-[#f3f0e9] px-1 py-px font-mono text-[0.88em] text-ink">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function MultilineText({ text, className }: { text: string; className?: string }) {
  const [first, ...rest] = text.split("\n");
  return (
    <div className={className}>
      <p>
        <Rich text={first} />
      </p>
      {rest.length > 0 && (
        <pre className="mt-2 border-l-2 border-coral bg-[#f3f0e9] px-3 py-2 font-mono text-[13px] leading-relaxed text-ink">
          {rest.join("\n")}
        </pre>
      )}
    </div>
  );
}

export function CodeView({
  code,
  activeLine,
  className,
}: {
  code: string;
  activeLine?: number;
  className?: string;
}) {
  const lines = code.split("\n");
  return (
    <pre
      className={cn(
        "overflow-x-auto bg-[#141b16] py-3 font-mono text-[13px] leading-[1.75] text-[#e8ece9] sm:text-[13.5px]",
        className,
      )}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className={cn(
            "block whitespace-pre border-l-2 pl-3 pr-4 transition-colors",
            activeLine === i + 1 ? "border-[#ffb27a] bg-white/[0.08]" : "border-transparent",
          )}
        >
          <span className="mr-4 inline-block w-4 select-none text-right text-white/25">{i + 1}</span>
          {highlight(line, i)}
        </span>
      ))}
    </pre>
  );
}

const INDENT = "    ";

export function PyEditor({
  value,
  onChange,
  onRun,
  minLines = 4,
  label = "Code editor",
  markLine,
}: {
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  minLines?: number;
  label?: string;
  /** 1-based line to flag, e.g. where an error was raised. */
  markLine?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const lines = value.split("\n");
  const rows = Math.max(minLines, lines.length);

  function edit(next: string, caret: number) {
    onChange(next);
    requestAnimationFrame(() => {
      ref.current?.setSelectionRange(caret, caret);
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: end } = el;
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onRun?.();
      return;
    }
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      edit(value.slice(0, s) + INDENT + value.slice(end), s + INDENT.length);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      const current = value.slice(lineStart, s);
      const indent = /^\s*/.exec(current)?.[0] ?? "";
      const extra = current.trimEnd().endsWith(":") ? INDENT : "";
      if (indent || extra) {
        e.preventDefault();
        const insert = `\n${indent}${extra}`;
        edit(value.slice(0, s) + insert + value.slice(end), s + insert.length);
      }
    }
  }

  return (
    <div className="flex bg-[#141b16] font-mono text-[16px] leading-[1.7] sm:text-[13.5px]">
      <div aria-hidden className="select-none py-3 pl-3 pr-2 text-right text-white/25">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={cn(markLine === i + 1 && "font-bold text-[#ff9b8a]")}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1 overflow-x-auto">
        <div className="grid min-w-full w-max">
          <pre
            aria-hidden
            className="pointer-events-none m-0 whitespace-pre px-3 py-3 text-[#e8ece9] [grid-area:1/1]"
            style={{ minHeight: `calc(${rows} * 1.7em + 1.5rem)` }}
          >
            {lines.map((line, i) => (
              <div key={i} className={cn(markLine === i + 1 && "-mx-3 bg-[#ff9b8a]/15 px-3 shadow-[inset_2px_0_0_#ff9b8a]")}>
                {line ? highlight(line, i) : " "}
              </div>
            ))}
          </pre>
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label={label}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            className="m-0 h-full w-full resize-none overflow-hidden whitespace-pre bg-transparent px-3 py-3 text-transparent caret-[#ffb27a] outline-none selection:bg-white/20 [grid-area:1/1]"
          />
        </div>
      </div>
    </div>
  );
}

export function RunButton({ onClick, running, label = "Run" }: { onClick: () => void; running: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={running}
      className="inline-flex items-center gap-2 bg-[#2f9e6e] px-4 py-2 text-[13.5px] font-bold text-white transition hover:bg-[#278a5f] disabled:opacity-70"
    >
      {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
      {label}
    </button>
  );
}

/** One line per input() call. Editable in lessons; read-only when a practice check supplies the answers. */
export function AnswerLines({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  const lines = Math.min(5, Math.max(2, value.split("\n").length + 1));
  return (
    <div className="border-t border-white/10 bg-[#101610] px-3 py-2.5">
      <label className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#ffb27a]">
        Keyboard
        <span className="ml-2 normal-case tracking-normal text-white/40">one line for each input()</span>
      </label>
      <textarea
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={lines}
        aria-label="Answers typed for input()"
        className="mt-1.5 w-full resize-y bg-transparent font-mono text-[13.5px] leading-[1.6] text-[#5ee0a0] outline-none placeholder:text-white/30"
        placeholder="Type what the person at the keyboard answers"
      />
    </div>
  );
}

export function OutputPanel({
  result,
  running,
  firstLoad,
  placeholder = "Press Run to see the output here.",
}: {
  result: PythonRunResult | null;
  running: boolean;
  firstLoad: boolean;
  placeholder?: string;
}) {
  let body: ReactNode;
  if (running) {
    body = firstLoad ? <LoadingLine /> : <span className="text-white/50">Running…</span>;
  } else if (!result) {
    body = <span className="text-white/35">{placeholder}</span>;
  } else {
    body = (
      <>
        {result.stdout && <span className="block whitespace-pre-wrap text-[#e8ece9]">{result.stdout}</span>}
        {!result.stdout && result.ok && <span className="text-white/40">(no output)</span>}
        {result.error && (
          <span className="mt-1 block whitespace-pre-wrap text-[#ff9b8a]">
            {result.errorLine ? `Line ${result.errorLine}: ` : ""}
            {result.error}
          </span>
        )}
      </>
    );
  }
  return (
    <div className="border-t border-white/10 bg-[#0f1411]">
      <p className="border-b border-white/10 px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
        Output
      </p>
      <pre data-py-output className="min-h-[64px] overflow-x-auto px-4 py-3 font-mono text-[13px] leading-[1.7]">
        {body}
      </pre>
    </div>
  );
}

function LoadingLine() {
  const rt = usePythonRuntime();
  const pct = rt.progress !== null ? Math.round(rt.progress * 100) : null;
  return (
    <span className="block text-white/55">
      {rt.detail ?? "Loading Python"}
      {pct !== null && rt.phase === "loading" ? ` · ${pct}%` : "…"}
      <span className="mt-2 block h-1 w-40 max-w-full bg-white/10">
        <span className="block h-full bg-[#5ee0a0] transition-all duration-200" style={{ width: `${pct ?? 15}%` }} />
      </span>
    </span>
  );
}

export function StepHeading({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-coral">{kicker}</p>
      <h2 className="mt-1.5 text-[22px] font-extrabold leading-tight tracking-tight sm:text-[26px]">{title}</h2>
      {children && <div className="mt-2 text-[15px] leading-relaxed text-muted">{children}</div>}
    </div>
  );
}
