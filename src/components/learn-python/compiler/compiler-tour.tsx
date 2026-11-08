"use client";

import { DEMO_MAIN } from "@/components/learn-python/compiler/use-python-files";
import { cn } from "@/lib/utils";
import { ChevronRight, FileCode, Folder, FolderOpen, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Beat = {
  target: string;
  title: string;
  body: string;
  greetings: boolean;
  maths: boolean;
  press: boolean;
  ms: number;
};

const BEATS: Beat[] = [
  {
    target: "preview-demo",
    title: "Preview demo",
    body: "This button builds two folders on your account. You can delete them later.",
    greetings: false,
    maths: false,
    press: true,
    ms: 1600,
  },
  {
    target: "greetings",
    title: "greetings and maths",
    body: "Both folders appear in the sidebar, with the same icons as your own files.",
    greetings: false,
    maths: false,
    press: true,
    ms: 1600,
  },
  {
    target: "hello",
    title: "greetings/hello.py",
    body: "hello.py defines hello(name). The cursor opens that file.",
    greetings: true,
    maths: false,
    press: true,
    ms: 1700,
  },
  {
    target: "score",
    title: "maths/score.py",
    body: "score.py defines average(marks) in the second folder.",
    greetings: true,
    maths: true,
    press: true,
    ms: 1700,
  },
  {
    target: "editor",
    title: "main.py imports both",
    body: "main.py uses the two folders. Run still uses the file you have open.",
    greetings: true,
    maths: true,
    press: false,
    ms: 2200,
  },
  {
    target: "run",
    title: "The program prints",
    body: "Hello, Aarav, then the average of the marks. Preview adds these folders to your account.",
    greetings: true,
    maths: true,
    press: true,
    ms: 2600,
  },
];

function boxIn(stage: HTMLElement, el: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== stage) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function TourFile({
  name,
  depth,
  selected,
  tour,
  light,
}: {
  name: string;
  depth: number;
  selected?: boolean;
  tour: string;
  light: boolean;
}) {
  return (
    <div
      data-tour={tour}
      className={cn(
        "flex items-center gap-1.5 py-1 pr-1",
        selected && (light ? "bg-white/80 shadow-[inset_0_0_0_1px_rgba(61,132,198,0.35)]" : "bg-white/10 shadow-[inset_0_0_0_1px_rgba(126,182,234,0.45)]"),
      )}
      style={{ paddingLeft: 8 + depth * 12 }}
    >
      <span className="w-4" />
      <FileCode className="h-3.5 w-3.5 shrink-0 text-[#3d84c6]" />
      <span className={cn("truncate font-mono text-[12px]", light ? "text-ink" : "text-white")}>{name}</span>
    </div>
  );
}

function TourFolder({
  name,
  open,
  tour,
  light,
  depth = 0,
}: {
  name: string;
  open: boolean;
  tour: string;
  light: boolean;
  depth?: number;
}) {
  return (
    <div
      data-tour={tour}
      className="flex items-center gap-1 py-1 pr-1"
      style={{ paddingLeft: 8 + depth * 12 }}
    >
      <ChevronRight className={cn("h-3 w-3 transition", open && "rotate-90", light ? "text-[#6b7c90]" : "text-white/45")} />
      {open ? <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#c2410c]" /> : <Folder className="h-3.5 w-3.5 shrink-0 text-[#c2410c]" />}
      <span className={cn("truncate font-mono text-[12px]", light ? "text-ink" : "text-white")}>{name}</span>
    </div>
  );
}

export function CompilerTour({ light, onClose, onPreview }: { light: boolean; onClose: () => void; onPreview: () => void }) {
  const [beat, setBeat] = useState(0);
  const [pressing, setPressing] = useState(false);
  const [cam, setCam] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 48, y: 36 });
  const [spot, setSpot] = useState({ x: 16, y: 12, w: 140, h: 36 });
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const step = BEATS[beat] ?? BEATS[0];
  const showTree = beat > 0;
  const showOutput = beat >= BEATS.length - 1;
  const activeFile = beat >= 4 ? "main.py" : beat >= 3 ? "maths/score.py" : beat >= 2 ? "greetings/hello.py" : "main.py";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    const el = stage?.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!frame || !stage || !el) return;
    const box = boxIn(stage, el);
    const scale = 1.38;
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const minX = frame.clientWidth - stage.offsetWidth * scale;
    const minY = frame.clientHeight - stage.offsetHeight * scale;
    setCam({
      x: Math.max(minX, Math.min(8, frame.clientWidth / 2 - cx * scale)),
      y: Math.max(minY, Math.min(8, frame.clientHeight / 2 - cy * scale)),
    });
    setCursor({ x: box.x + Math.min(box.w * 0.72, box.w - 6), y: box.y + box.h * 0.55 });
    setSpot({ x: box.x - 4, y: box.y - 4, w: box.w + 8, h: box.h + 8 });
  }, [beat, step.target, showTree, step.greetings, step.maths, showOutput]);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    setPressing(false);
    const later = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms));
    };
    if (step.press) later(680, () => {
      setPressing(true);
      later(160, () => setPressing(false));
    });
    if (beat < BEATS.length - 1) {
      later(step.ms + (step.press ? 700 : 240), () => setBeat((n) => Math.min(BEATS.length - 1, n + 1)));
    }
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [beat, step]);

  const motion = "motion-safe:duration-700 motion-safe:ease-[cubic-bezier(.22,.8,.24,1)]";
  const editor = activeFile === "greetings/hello.py"
    ? "def hello(name):\n    return f\"Hello, {name}\""
    : activeFile === "maths/score.py"
      ? "def average(marks):\n    return sum(marks) / len(marks)"
      : DEMO_MAIN.trimEnd();

  return (
    <div className={cn("fixed inset-0 z-[280] flex items-end justify-center p-0 backdrop-blur-[2px] sm:items-center sm:p-4", light ? "bg-[#101820]/45" : "bg-black/60")} role="dialog" aria-modal="true" aria-labelledby="py-tour-title">
      <div className={cn(
        "flex max-h-[min(94dvh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:rounded-3xl",
        light ? "border-white/70 bg-white/80" : "border-white/10 bg-[#15202c]/88",
      )}>
        <div className={cn("flex shrink-0 items-center gap-2 border-b px-3 py-2.5 sm:px-4", light ? "border-white/50" : "border-white/10")}>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] sm:h-3 sm:w-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] sm:h-3 sm:w-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] sm:h-3 sm:w-3" />
          <p className={cn("ml-1 min-w-0 flex-1 truncate text-[12px] font-semibold sm:ml-2", light ? "text-[#3a4553]" : "text-white/80")}>Screen recording · Python compiler</p>
          <button type="button" onClick={onClose} aria-label="Close tour" className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", light ? "text-[#6b7c90] hover:bg-white/70 hover:text-ink" : "text-white/50 hover:bg-white/10 hover:text-white")}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="shrink-0 px-3 pb-1 pt-3 sm:px-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7eb6ea]">{beat + 1} of {BEATS.length}</p>
          <h2 id="py-tour-title" className={cn("text-[17px] font-extrabold leading-tight sm:text-[18px]", light ? "text-ink" : "text-white")}>{step.title}</h2>
          <p className={cn("mt-1 max-w-full text-[13px] leading-relaxed break-words", light ? "text-[#5d6b7c]" : "text-white/60")}>{step.body}</p>
        </div>
        <div ref={frameRef} className={cn("relative mx-3 mb-3 mt-2 h-[min(42dvh,220px)] min-h-[180px] overflow-hidden rounded-2xl border shadow-inner sm:mx-4 sm:h-[340px]", light ? "border-white/70 bg-[#e7eef6]/80" : "border-white/10 bg-[#101820]")}>
          <div
            ref={stageRef}
            className={cn("absolute left-0 top-0 h-[520px] w-[820px] motion-safe:transition-transform", motion)}
            style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(1.38)`, transformOrigin: "0 0" }}
          >
            <div className={cn("flex h-12 items-center gap-2 border-b px-3 backdrop-blur-xl", light ? "border-white/60 bg-white/55" : "border-white/10 bg-white/5")}>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3d84c6] text-[11px] font-bold text-white">Py</span>
              <span className={cn("text-[13px] font-extrabold", light ? "text-ink" : "text-white")}>Python compiler</span>
              <button type="button" className={cn("ml-2 inline-flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-[12px] font-bold shadow-sm", light ? "border-white/80 bg-white/70 text-ink" : "border-white/15 bg-white/10 text-white")}>
                Create folder
              </button>
              <button type="button" data-tour="preview-demo" className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-[#3d84c6]/30 bg-[#3d84c6]/90 px-2.5 text-[12px] font-bold text-white shadow-sm">
                Preview demo
              </button>
              <button type="button" data-tour="run" className="ml-auto inline-flex h-8 items-center rounded-xl bg-[#163e66] px-3 text-[12px] font-bold text-white">
                Run
              </button>
            </div>
            <div className="flex h-[468px]">
              <aside className={cn("w-56 shrink-0 border-r backdrop-blur-xl transition-opacity", showTree ? "opacity-100" : "opacity-40", light ? "border-white/50 bg-white/45" : "border-white/10 bg-white/[0.04]")}>
                <div className={cn("flex h-8 items-center border-b px-2", light ? "border-white/50" : "border-white/10")}>
                  <span className={cn("font-mono text-[10px] uppercase tracking-[0.14em]", light ? "text-[#6b7c90]" : "text-white/45")}>Explorer</span>
                </div>
                {showTree ? (
                  <div className="py-1">
                    <TourFolder name="greetings" open={step.greetings} tour="greetings" light={light} />
                    {step.greetings && (
                      <>
                        <TourFile name="__init__.py" depth={1} tour="init-hello" light={light} />
                        <TourFile name="hello.py" depth={1} tour="hello" light={light} selected={activeFile === "greetings/hello.py"} />
                      </>
                    )}
                    <TourFolder name="maths" open={step.maths} tour="maths" light={light} />
                    {step.maths && (
                      <>
                        <TourFile name="__init__.py" depth={1} tour="init-score" light={light} />
                        <TourFile name="score.py" depth={1} tour="score" light={light} selected={activeFile === "maths/score.py"} />
                      </>
                    )}
                    <TourFile name="main.py" depth={0} tour="main" light={light} selected={activeFile === "main.py"} />
                  </div>
                ) : (
                  <p className={cn("px-3 py-2 text-[12px]", light ? "text-[#6b7c90]" : "text-white/45")}>No files yet.</p>
                )}
              </aside>
              <div className={cn("flex min-w-0 flex-1 flex-col", light ? "bg-white/70" : "bg-[#1c2836]")}>
                <div data-tour="editor" className="min-h-0 flex-1">
                  <div className={cn("flex h-8 items-center border-b px-3 font-mono text-[10px] uppercase tracking-[0.14em]", light ? "border-white/60 bg-white/50 text-[#6b7c90]" : "border-white/10 bg-white/5 text-white/45")}>
                    {activeFile}
                  </div>
                  <pre className={cn("px-4 py-3 font-mono text-[13px] leading-7", light ? "text-ink" : "text-white")}>{editor}</pre>
                </div>
                <div className={cn("border-t px-4 py-3 font-mono text-[13px] transition-opacity", showOutput ? "opacity-100" : "opacity-0", light ? "border-white/60 bg-[#f7fbff]/80 text-ink" : "border-white/10 bg-black/20 text-white")}>
                  <p>Hello, Aarav</p>
                  <p>Average 18.0</p>
                </div>
              </div>
            </div>
            <div
              className="pointer-events-none absolute rounded-xl ring-2 ring-[#3d84c6]/80 motion-safe:transition-all"
              style={{ left: spot.x, top: spot.y, width: spot.w, height: spot.h }}
            />
            <div
              className={cn("pointer-events-none absolute z-10 motion-safe:transition-all", motion, pressing && "scale-90")}
              style={{ left: cursor.x, top: cursor.y }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
                <path d="M5.2 2.4 L5.2 18.2 L9.1 14.6 L12.2 21.2 L14.6 20.2 L11.4 13.6 L17.6 13.2 Z" fill="#fff" stroke="#172033" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
              {pressing && <span className="absolute left-0 top-0 h-4 w-4 animate-ping rounded-full bg-[#3d84c6]/50" />}
            </div>
          </div>
        </div>
        <div className={cn("flex shrink-0 flex-col gap-3 border-t px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-4", light ? "border-white/50" : "border-white/10")}>
          <div className="flex gap-1" aria-hidden>
            {BEATS.map((item, i) => (
              <span key={item.target + i} className={cn("h-1.5 rounded-full", i === beat ? "w-6 bg-[#3d84c6]" : i < beat ? "w-2 bg-[#3d84c6]/70" : light ? "w-2 bg-[#d7e4f0]" : "w-2 bg-white/20")} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button type="button" onClick={onClose} className={cn("rounded-xl px-3 py-2 text-[13px] font-semibold", light ? "text-[#6b7c90] hover:bg-white/70" : "text-white/70 hover:bg-white/10")}>
              Cancel
            </button>
            {beat < BEATS.length - 1 ? (
              <button type="button" onClick={() => setBeat((n) => Math.min(BEATS.length - 1, n + 1))} className="rounded-xl bg-[#3d84c6] px-3 py-2 text-[13px] font-bold text-white">
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onPreview();
                  onClose();
                }}
                className="rounded-xl bg-[#3d84c6] px-3 py-2 text-[13px] font-bold text-white"
              >
                Preview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
