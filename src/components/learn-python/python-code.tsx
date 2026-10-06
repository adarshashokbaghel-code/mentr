import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const TOKEN =
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(def|return|if|elif|else|for|in|while|and|or|not|True|False|None)\b|\b(print|input|int|float|len|range|type|str)\b(?=\()|\b(\d+(?:\.\d+)?)\b/g;

export function highlight(line: string, lineKey: number): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(line))) {
    if (match.index > last) out.push(line.slice(last, match.index));
    const [text, comment, string, keyword, builtin] = match;
    const cls = comment
      ? "text-[#7f8a83] italic"
      : string
        ? "text-[#9be3b8]"
        : keyword
          ? "text-[#ffb27a]"
          : builtin
            ? "text-[#a9c7ff]"
            : "text-[#f3d27a]";
    out.push(
      <span key={`${lineKey}-${match.index}`} className={cls}>
        {text}
      </span>,
    );
    last = match.index + text.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function WindowBar({ title }: { title: string }) {
  return (
    <figcaption className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-2">
      <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden />
      <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden />
      <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden />
      <span className="ml-2 font-mono text-[11px] text-white/45">{title}</span>
    </figcaption>
  );
}

export function PythonCode({
  code,
  filename = "main.py",
  className,
  numbered = true,
}: {
  code: string;
  filename?: string;
  className?: string;
  numbered?: boolean;
}) {
  const lines = code.split("\n");
  return (
    <figure className={cn("overflow-hidden border border-[#2a332d] bg-[#141b16]", className)}>
      <WindowBar title={filename} />
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.7] text-[#e8ece9] sm:text-[13px]">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block whitespace-pre">
              {numbered && (
                <span className="mr-4 inline-block w-4 select-none text-right text-white/25">
                  {i + 1}
                </span>
              )}
              {highlight(line, i)}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

export type TerminalLine = { text: string; tone?: "prompt" | "ok" | "muted" | "title" };

export function PythonTerminal({
  lines,
  className,
  animated,
  title = "python quiz.py",
}: {
  lines: TerminalLine[];
  className?: string;
  animated?: boolean;
  title?: string;
}) {
  return (
    <figure className={cn("overflow-hidden border border-[#2a332d] bg-[#0f1411]", className)}>
      <WindowBar title={title} />
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.75] sm:text-[13px]">
        {lines.map((line, i) => (
          <span
            key={i}
            className={cn(
              "block whitespace-pre",
              animated && "py-line",
              line.tone === "prompt" && "text-[#ffb27a]",
              line.tone === "ok" && "text-[#5ee0a0]",
              line.tone === "muted" && "text-white/50",
              line.tone === "title" && "font-bold text-white",
              !line.tone && "text-[#e8ece9]",
            )}
            style={animated ? { animationDelay: `${0.4 + i * 0.32}s` } : undefined}
          >
            {line.text || " "}
          </span>
        ))}
        <span
          className={cn("block", animated && "py-line")}
          style={animated ? { animationDelay: `${0.4 + lines.length * 0.32}s` } : undefined}
        >
          <span className="text-white/40">$ </span>
          <span className="py-caret inline-block h-[14px] w-[7px] translate-y-[2px] bg-[#5ee0a0]" />
        </span>
      </pre>
    </figure>
  );
}
