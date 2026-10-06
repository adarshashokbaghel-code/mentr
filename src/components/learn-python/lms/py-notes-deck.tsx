"use client";

import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import { AnswerLines, CodeView, OutputPanel, Rich, RunButton } from "@/components/learn-python/lms/py-lms-ui";
import { usePythonRun } from "@/components/learn-python/lms/use-python-run";
import { PY_XP } from "@/lib/python-lms/game";
import type { NoteBlock, NoteSlide, QuickCheck } from "@/lib/python-lms/types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Lightbulb,
  ListOrdered,
  RotateCw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function PyNotesDeck({
  slug,
  slides,
  startAt,
  seenUpTo,
  onSlide,
  onFinish,
}: {
  slug: string;
  slides: NoteSlide[];
  startAt: number;
  seenUpTo: number;
  onSlide: (index: number) => void;
  onFinish: () => void;
}) {
  const clamp = (n: number) => Math.min(Math.max(n, 0), slides.length - 1);
  const [index, setIndex] = useState(() => clamp(startAt));
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [seen, setSeen] = useState(() => clamp(Math.max(seenUpTo, startAt)));
  const [tocOpen, setTocOpen] = useState(false);
  const touchX = useRef<number | null>(null);
  const last = index === slides.length - 1;
  const slide = slides[index];

  const parts = useMemo(() => {
    const out: { part: string; items: { i: number; title: string }[] }[] = [];
    slides.forEach((s, i) => {
      const g = out[out.length - 1];
      if (g && g.part === s.part) g.items.push({ i, title: s.title });
      else out.push({ part: s.part, items: [{ i, title: s.title }] });
    });
    return out;
  }, [slides]);

  const go = useCallback(
    (to: number) => {
      if (to < 0 || to >= slides.length) return;
      setDir(to > index ? "next" : "prev");
      setIndex(to);
      setSeen((s) => Math.max(s, to));
      setTocOpen(false);
      onSlide(to);
      document.getElementById("py-lms-main")?.scrollTo({ top: 0 });
    },
    [index, slides.length, onSlide],
  );

  const next = useCallback(() => (last ? onFinish() : go(index + 1)), [last, onFinish, go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-[3px]" role="tablist" aria-label="Note slides">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${s.title}`}
              disabled={i > seen}
              onClick={() => go(i)}
              className="group flex-1 py-2 disabled:cursor-not-allowed"
            >
              <span
                className={cn(
                  "block h-[3px] transition-colors",
                  i === index ? "bg-coral" : i <= seen ? "bg-ink/70 group-hover:bg-ink" : "bg-[#e3ded4]",
                )}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTocOpen((o) => !o)}
          aria-expanded={tocOpen}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-[12.5px] font-semibold transition",
            tocOpen ? "border-ink bg-ink text-white" : "border-hairline bg-white text-muted hover:text-ink",
          )}
        >
          <ListOrdered className="h-3.5 w-3.5" /> Contents
        </button>
      </div>

      {tocOpen && (
        <nav className="py-pop mt-2 grid gap-x-6 gap-y-4 border border-hairline bg-white p-4 sm:grid-cols-2 sm:p-5" aria-label="Study contents">
          {parts.map((g) => (
            <div key={g.part}>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-coral">{g.part}</p>
              <ol className="mt-1.5 space-y-0.5">
                {g.items.map(({ i, title }) => (
                  <li key={i}>
                    <button
                      type="button"
                      disabled={i > seen}
                      onClick={() => go(i)}
                      className={cn(
                        "flex w-full items-baseline gap-2 py-1 text-left text-[13.5px] transition disabled:cursor-not-allowed",
                        i === index ? "font-bold text-ink" : i <= seen ? "text-[#3d3a35] hover:text-ink" : "text-muted/50",
                      )}
                    >
                      <span className="w-5 shrink-0 font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                      {title}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </nav>
      )}

      <div
        className="mt-3 overflow-hidden border border-hairline bg-white"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const target = e.target as HTMLElement;
          if (target.closest("pre, table, .no-swipe")) {
            touchX.current = null;
            return;
          }
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < 70) return;
          if (dx < 0) next();
          else prev();
        }}
      >
        <article key={slide.id} className={cn("min-h-[440px] px-5 py-6 sm:px-9 sm:py-9", `py-slide-${dir}`)}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-coral">{slide.part}</p>
            <p className="shrink-0 font-mono text-[11.5px] text-muted">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
          </div>
          <h2 className="mt-2 text-[24px] font-extrabold leading-[1.15] tracking-tight sm:text-[30px]">{slide.title}</h2>
          <div className="mt-5 space-y-4 text-[15.5px] leading-[1.7] text-[#3d3a35] sm:text-[16px]">
            {slide.blocks.map((b, i) => (
              <Block key={i} block={b} slug={slug} />
            ))}
          </div>
        </article>

        <div className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            className="inline-flex items-center gap-1.5 px-2 py-2 text-[14px] font-semibold text-muted transition hover:text-ink disabled:invisible"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <p className="hidden font-mono text-[11px] text-muted sm:block">Use ← → keys</p>
          <button
            type="button"
            onClick={next}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-bold text-white transition",
              last ? "bg-[#2f9e6e] hover:bg-[#278a5f]" : "bg-ink hover:bg-black",
            )}
          >
            {last ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckBlock({ block, slug }: { block: QuickCheck; slug: string }) {
  const { progress, updateLesson, award } = usePyLms();
  const prior = progress[slug]?.checks?.[block.id];
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null || prior !== undefined;
  const right = picked !== null ? picked === block.answer : prior;

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === block.answer;
    if (prior === undefined) {
      updateLesson(slug, { checks: { ...progress[slug]?.checks, [block.id]: ok } });
      if (ok) award(`check:${slug}:${block.id}`, PY_XP.quickCheck, "Quick check");
    }
  }

  return (
    <div className="no-swipe border-2 border-ink bg-[#fbfaf7]">
      <p className="flex items-center gap-2 border-b border-ink/15 px-4 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink">
        <Zap className="h-3.5 w-3.5 fill-[#f6b73c] text-[#e0a83a]" /> Quick check
        <span className="ml-auto font-normal normal-case tracking-normal text-muted">+{PY_XP.quickCheck} XP if right first time</span>
      </p>
      <div className="px-4 py-3.5">
        <p className="text-[15.5px] font-bold text-ink">
          <Rich text={block.question} />
        </p>
        {block.code && (
          <div className="mt-3 border border-[#2a332d]">
            <CodeView code={block.code} />
          </div>
        )}
        <div className={cn("mt-3 grid gap-2", block.codeOptions ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
          {block.options.map((opt, i) => {
            const isAnswer = answered && i === block.answer;
            const isWrongPick = picked === i && i !== block.answer;
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => pick(i)}
                className={cn(
                  "flex items-start gap-2.5 border px-3 py-2 text-left text-[14.5px] transition",
                  isAnswer
                    ? "border-[#2f9e6e] bg-[#eef8f2]"
                    : isWrongPick
                      ? "border-[#e8a58a] bg-[#fff1ea]"
                      : answered
                        ? "border-hairline opacity-60"
                        : "border-hairline bg-white hover:border-ink",
                )}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-current/30 font-mono text-[10.5px]">
                  {isAnswer ? <Check className="h-3 w-3" strokeWidth={3} /> : isWrongPick ? <X className="h-3 w-3" /> : String.fromCharCode(65 + i)}
                </span>
                {block.codeOptions ? (
                  <code className="whitespace-pre-wrap font-mono text-[13px]">{opt}</code>
                ) : (
                  <span>
                    <Rich text={opt} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {answered && (
          <p className={cn("py-pop mt-3 text-[14px] leading-relaxed", right ? "text-[#2f7a55]" : "text-[#3d3a35]")}>
            <strong className={right ? "text-[#2f7a55]" : "text-[#c2410c]"}>{right ? "Correct. " : "Not quite. "}</strong>
            <Rich text={block.explain} />
          </p>
        )}
      </div>
    </div>
  );
}

function Flashcards({ cards }: { cards: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <div className="no-swipe space-y-2">
      {cards.map((c, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
          aria-expanded={Boolean(open[i])}
          className={cn(
            "block w-full border text-left transition",
            open[i] ? "border-ink bg-white" : "border-hairline bg-[#faf8f4] hover:border-ink/40",
          )}
        >
          <span className="flex items-start gap-3 px-4 py-3">
            <span className="mt-0.5 shrink-0 font-mono text-[11.5px] font-semibold text-coral">Q{i + 1}</span>
            <span className="flex-1 text-[15px] font-semibold text-ink">
              <Rich text={c.q} />
            </span>
            <RotateCw className={cn("mt-1 h-3.5 w-3.5 shrink-0 text-muted transition", open[i] && "rotate-180")} />
          </span>
          {open[i] && (
            <span className="py-pop block border-t border-hairline px-4 py-3 pl-12 text-[14.5px] leading-relaxed text-[#3d3a35]">
              <Rich text={c.a} />
            </span>
          )}
        </button>
      ))}
      <p className="font-mono text-[11px] text-muted">Tap a question to see the model answer. Try answering out loud first.</p>
    </div>
  );
}

function Flow({ title, steps }: Extract<NoteBlock, { type: "flow" }>) {
  return (
    <figure className="border border-hairline bg-[#faf8f4] px-4 py-5">
      {title && (
        <figcaption className="mb-4 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{title}</figcaption>
      )}
      <ol className="mx-auto flex max-w-[300px] flex-col items-center">
        {steps.map((s, i) => (
          <li key={i} className="flex w-full flex-col items-center">
            {i > 0 && (
              <span aria-hidden className="flex flex-col items-center">
                <span className="h-4 w-px bg-ink/50" />
                <span className="h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-ink/50" />
              </span>
            )}
            <span
              className={cn(
                "flex min-h-[42px] w-full items-center justify-center px-5 py-2 text-center text-[13.5px] font-semibold text-ink",
                s.kind === "terminal" && "rounded-full border-2 border-ink bg-white",
                s.kind === "process" && "border-2 border-ink bg-white",
                s.kind === "io" && "bg-ink text-white [clip-path:polygon(9%_0,100%_0,91%_100%,0_100%)]",
                s.kind === "decision" &&
                  "min-h-[64px] bg-[#f6c95b] [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]",
              )}
            >
              {s.text}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function StaticCode({ block }: { block: Extract<NoteBlock, { type: "code" }> }) {
  return (
    <div className="border border-[#2a332d]">
      {block.shell && (
        <p className="border-b border-white/10 bg-[#141b16] px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
          Python shell (interactive mode)
        </p>
      )}
      <CodeView code={block.code} />
      {block.output !== undefined && (
        <div className="border-t border-white/10 bg-[#0f1411] px-4 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Output</p>
          <pre className="mt-1 overflow-x-auto whitespace-pre font-mono text-[13px] leading-[1.7] text-[#5ee0a0]">
            {block.output || " "}
          </pre>
        </div>
      )}
    </div>
  );
}

function LiveCode({ code, shell, inputs }: { code: string; shell?: boolean; inputs?: string[] }) {
  const { result, running, firstLoad, run } = usePythonRun();
  const [typed, setTyped] = useState(() => inputs?.join("\n") ?? "");
  return (
    <div className="border border-[#2a332d]">
      {shell && (
        <p className="border-b border-white/10 bg-[#141b16] px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
          Python shell (interactive mode)
        </p>
      )}
      <CodeView code={code} />
      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#141b16] px-3 py-2">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">Run this on the slide</p>
        <RunButton onClick={() => void run(code, inputs ? typed.split("\n") : undefined)} running={running} />
      </div>
      {inputs && <AnswerLines value={typed} onChange={setTyped} />}
      <OutputPanel result={result} running={running} firstLoad={firstLoad} placeholder="Press Run. The result appears here." />
    </div>
  );
}

function Block({ block, slug }: { block: NoteBlock; slug: string }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="text-[17px] font-semibold leading-[1.6] text-ink sm:text-[18px]">
          <Rich text={block.text} />
        </p>
      );
    case "p":
      return (
        <p>
          <Rich text={block.text} />
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-[3px] w-5 shrink-0 font-mono text-[12.5px] font-semibold text-coral">
                {block.ordered ? `${i + 1}.` : "—"}
              </span>
              <span>
                <Rich text={item} />
              </span>
            </li>
          ))}
        </Tag>
      );
    }
    case "code":
      return block.live ? <LiveCode code={block.code} shell={block.shell} inputs={block.inputs} /> : <StaticCode block={block} />;
    case "callout": {
      const Icon =
        block.tone === "warn" ? AlertTriangle : block.tone === "fact" ? Sparkles : block.tone === "exam" ? GraduationCap : Lightbulb;
      return (
        <div
          className={cn(
            "flex gap-3 border-l-[3px] px-4 py-3 text-[14.5px]",
            block.tone === "warn" && "border-coral bg-coral-wash/60",
            block.tone === "tip" && "border-[#2f9e6e] bg-[#eef8f2]",
            block.tone === "fact" && "border-ink bg-[#f3f0e9]",
            block.tone === "exam" && "border-[#6a5acd] bg-[#f1effc]",
          )}
        >
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink/70" />
          <p>
            {(block.title || block.tone === "exam") && (
              <strong className="mr-1.5 font-bold text-ink">{block.title ?? "In exams"}:</strong>
            )}
            <Rich text={block.text} />
          </p>
        </div>
      );
    }
    case "compare":
      return (
        <div className="grid gap-3 sm:grid-cols-2 [&>*]:min-w-0">
          {[block.left, block.right].map((side, i) => (
            <div key={i} className="border border-[#2a332d]">
              <p
                className={cn(
                  "px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em]",
                  side.tone === "good" && "bg-[#2f9e6e] text-white",
                  side.tone === "bad" && "bg-[#c2410c] text-white",
                  side.tone === "neutral" && "bg-ink text-white",
                )}
              >
                {side.label}
              </p>
              <CodeView code={side.code} />
              <pre
                className={cn(
                  "whitespace-pre-wrap border-t border-white/10 bg-[#0f1411] px-4 py-2.5 font-mono text-[12.5px] leading-[1.6]",
                  side.tone === "bad" ? "text-[#ff9b8a]" : "text-[#5ee0a0]",
                )}
              >
                {side.output}
              </pre>
            </div>
          ))}
        </div>
      );
    case "anatomy":
      return (
        <div className="border border-hairline bg-[#faf8f4] p-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Parts of the line</p>
          <ul className="mt-3 space-y-2.5">
            {block.parts.map((p) => (
              <li key={p.token} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <code className="min-w-[132px] bg-[#141b16] px-2.5 py-1 font-mono text-[13px] text-[#ffb27a]">{p.token}</code>
                <span className="text-[14.5px]">
                  <Rich text={p.label} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto border border-hairline">
          <table className="w-full min-w-[480px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-ink text-white">
                {block.head.map((h) => (
                  <th key={h} className="px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className={r % 2 ? "bg-[#faf8f4]" : "bg-white"}>
                  {row.map((cell, c) => (
                    <td key={c} className={cn("border-t border-hairline px-3.5 py-2.5 align-top", c === 0 && "font-semibold text-ink")}>
                      <Rich text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "flow":
      return <Flow {...block} />;
    case "terms":
      return (
        <dl className="divide-y divide-hairline border-y border-hairline">
          {block.items.map((t) => (
            <div key={t.term} className="grid gap-1 py-2.5 sm:grid-cols-[170px_1fr] sm:gap-4">
              <dt className="font-mono text-[13px] font-semibold text-ink">{t.term}</dt>
              <dd className="text-[14.5px]">
                <Rich text={t.meaning} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case "flashcards":
      return <Flashcards cards={block.cards} />;
    case "check":
      return <CheckBlock block={block} slug={slug} />;
  }
}
