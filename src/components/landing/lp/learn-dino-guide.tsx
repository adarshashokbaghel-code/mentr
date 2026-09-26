"use client";

import {
  DINO_FAQ_START,
  dinoFaqNext,
  dinoFaqNode,
} from "@/lib/learn-dino-faq";
import {
  LEARN_DINO_HOLD_SIZE,
  LEARN_DINO_HOLD_SRC,
  LEARN_DINO_PEEK_SIZE,
  LEARN_DINO_PEEK_SRC,
} from "@/lib/learn-assets";
import { LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
import { learnUi } from "@/lib/learn-ui";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calculator,
  Cpu,
  Gamepad2,
  ListChecks,
  Play,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { LearnDino } from "./learn-dino";
import { LearnStartButton } from "./learn-start-button";

/**
 * Floating dino is Learn-only.
 * Showing a kids mascot on the whole marketplace made AdSense reviewers treat
 * mentr.in as child-directed — keep it on /learn public pages only.
 */
const LEARN_DINO_ALLOWED = (pathname: string) => {
  if (!pathname.startsWith("/learn")) return false;
  // LMS app chrome has its own UI — no floating guide there.
  if (pathname.startsWith("/learn/app")) return false;
  return true;
};

const DINO_FAB_POS_KEY = "mentr_dino_fab_pos_v1";

type FabPos = { left: number; top: number };

function readFabPos(): FabPos | null {
  try {
    const raw = localStorage.getItem(DINO_FAB_POS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FabPos;
    if (
      typeof parsed?.left === "number" &&
      typeof parsed?.top === "number" &&
      Number.isFinite(parsed.left) &&
      Number.isFinite(parsed.top)
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeFabPos(pos: FabPos) {
  try {
    localStorage.setItem(DINO_FAB_POS_KEY, JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}

function clampFabPos(left: number, top: number, size = 72): FabPos {
  const pad = 8;
  const maxL = Math.max(pad, window.innerWidth - size - pad);
  const maxT = Math.max(pad, window.innerHeight - size - pad);
  return {
    left: Math.min(maxL, Math.max(pad, left)),
    top: Math.min(maxT, Math.max(pad, top)),
  };
}

/** Desktop grip pose — left of the card (sm+) */
const DINO_HOLD_DESKTOP =
  "pointer-events-none absolute -left-20 top-0 z-0 hidden h-[13.37rem] w-[11rem] sm:block";

/** Desktop peek pose — left of the card (sm+) */
const DINO_PEEK_DESKTOP =
  "pointer-events-none absolute -left-14 top-0 z-0 hidden h-[13.23rem] w-[10rem] sm:block";

const DINO_ART = {
  hold: { src: LEARN_DINO_HOLD_SRC, ...LEARN_DINO_HOLD_SIZE },
  peek: { src: LEARN_DINO_PEEK_SRC, ...LEARN_DINO_PEEK_SIZE },
} as const;

function DinoArt({
  pose,
  shadow = false,
}: {
  pose: keyof typeof DINO_ART;
  shadow?: boolean;
}) {
  const art = DINO_ART[pose];
  return (
    <Image
      src={art.src}
      alt=""
      width={art.width}
      height={art.height}
      className={cn(
        "h-full w-full bg-transparent object-contain",
        shadow && "drop-shadow-[0_12px_22px_rgba(28,36,52,0.18)]",
      )}
      unoptimized
      priority
    />
  );
}

const TRACKS = [
  { icon: Cpu, label: "CS", hint: "20", tint: "text-[#ff6a1a]" },
  { icon: Sparkles, label: "AI", hint: "20", tint: "text-[#7c3aed]" },
  { icon: Calculator, label: "Math", hint: "20", tint: "text-[#0d9488]" },
] as const;

const STEPS = [
  { icon: Play, label: "Watch" },
  { icon: ListChecks, label: "Quiz" },
  { icon: Gamepad2, label: "Play" },
] as const;

function useCookieOffset() {
  const [up, setUp] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setUp(!localStorage.getItem("mentr_cookie_consent"));
      } catch {
        setUp(false);
      }
    };
    read();
    window.addEventListener("mentr-cookie-accepted", read);
    return () => window.removeEventListener("mentr-cookie-accepted", read);
  }, []);

  return up;
}

export function LearnDinoGuide() {
  const pathname = usePathname() ?? "";
  const titleId = useId();
  const cookieUp = useCookieOffset();
  const [open, setOpen] = useState(false);
  const [talk, setTalk] = useState(false);
  const [faqId, setFaqId] = useState(DINO_FAQ_START);
  const [hi, setHi] = useState(false);
  const [fabPos, setFabPos] = useState<FabPos | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origLeft: number;
    origTop: number;
    moved: boolean;
  } | null>(null);

  const hidden = !LEARN_DINO_ALLOWED(pathname);
  const faq = dinoFaqNode(faqId);
  const nextQs = dinoFaqNext(faqId);

  useEffect(() => {
    setFabPos(readFabPos());
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [faqId, talk]);

  useEffect(() => {
    if (hidden) return;
    const t = window.setTimeout(() => setHi(true), 1200);
    return () => window.clearTimeout(t);
  }, [hidden]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setTalk(false);
      setFaqId(DINO_FAQ_START);
    }
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onResize() {
      setFabPos((prev) => (prev ? clampFabPos(prev.left, prev.top) : prev));
      if (window.matchMedia("(max-width: 767px)").matches) {
        setOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function onFabPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (e.button !== 0) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const left = fabPos?.left ?? rect.left;
    const top = fabPos?.top ?? rect.top;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: left,
      origTop: top,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onFabPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && dx * dx + dy * dy < 36) return;
    drag.moved = true;
    const next = clampFabPos(drag.origLeft + dx, drag.origTop + dy);
    setFabPos(next);
  }

  function onFabPointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (drag.moved) {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const next = clampFabPos(drag.origLeft + dx, drag.origTop + dy);
      setFabPos(next);
      writeFabPos(next);
      return;
    }
    setOpen(true);
  }

  if (hidden) return null;

  const usingCustomPos = Boolean(fabPos) && !open;

  return (
    <div
      className={cn(
        "learn-dino-guide pointer-events-none fixed z-[255]",
        open
          ? "inset-0 flex items-end justify-center sm:items-end sm:justify-end"
          : usingCustomPos
            ? "left-0 top-0"
            : "right-[max(0.75rem,env(safe-area-inset-right))] flex justify-end",
        !open &&
          !usingCustomPos &&
          (cookieUp
            ? "bottom-[8.25rem] sm:bottom-[5.5rem]"
            : "bottom-[5.75rem] sm:bottom-[max(1rem,env(safe-area-inset-bottom))]"),
      )}
      style={
        usingCustomPos && fabPos
          ? { left: fabPos.left, top: fabPos.top }
          : undefined
      }
    >
      {open ? (
        <button
          type="button"
          className="pointer-events-auto absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
          aria-label="Close dino guide"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          "pointer-events-auto relative",
          open &&
            "w-full max-w-none p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:w-auto sm:max-w-[30rem] sm:p-4 sm:pb-6 sm:pr-4",
        )}
      >
        {open ? (
          <div
            className="relative w-full animate-in fade-in slide-in-from-bottom-3 duration-300 sm:w-[min(100%,29.5rem)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            {/* Desktop only: grip / peek art beside the card (hidden on mobile) */}
            {talk ? (
              <div className={cn(DINO_PEEK_DESKTOP, "animate-in fade-in")}>
                <DinoArt pose="peek" shadow />
              </div>
            ) : (
              <div className={DINO_HOLD_DESKTOP}>
                <DinoArt pose="hold" shadow />
              </div>
            )}

            <div
              className={cn(
                "relative z-10 overflow-hidden rounded-3xl border border-white/80 bg-[#fffdf8]/95 shadow-[0_20px_48px_rgba(28,36,52,0.18)] backdrop-blur-xl sm:ml-[4.5rem] sm:mt-12",
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-2.5 top-2.5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#5a6472] ring-1 ring-white transition hover:bg-white hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>

              <div
                ref={scrollRef}
                className="max-h-[min(78dvh,34rem)] overflow-y-auto overscroll-contain px-4 pb-5 pt-5 sm:max-h-[min(70dvh,36rem)] sm:px-6 sm:pb-6 sm:pt-6"
              >
                {!talk ? (
                  <>
                    <p className={learnUi.label}>Mentr Learn</p>
                    <h2
                      id={titleId}
                      className="mt-1 max-w-none text-[1.2rem] font-extrabold leading-snug tracking-tight text-ink sm:max-w-[17rem] sm:text-[1.45rem]"
                    >
                      CS, AI &amp; Math —{" "}
                      <span className="text-[#ff6a1a]">free for Class 3–5</span>
                    </h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#5a6472] sm:mt-3 sm:text-[14px]">
                      60 short lessons. Watch a video, answer a quiz, then play —
                      about 15 minutes a day.
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-2">
                      {TRACKS.map((track) => (
                        <div
                          key={track.label}
                          className="rounded-xl bg-white/70 py-2.5 text-center ring-1 ring-white/80"
                        >
                          <track.icon
                            className={cn("mx-auto h-5 w-5 sm:h-7 sm:w-7", track.tint)}
                            strokeWidth={2.1}
                            aria-hidden
                          />
                          <p className="mt-1 text-[12px] font-extrabold text-ink sm:text-[13px]">
                            {track.label}
                          </p>
                          <p className="text-[10px] font-semibold text-[#8a929c] sm:text-[11px]">
                            {track.hint} mods
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-1 rounded-2xl bg-white/60 px-2.5 py-2 ring-1 ring-white/80 sm:mt-4 sm:px-3 sm:py-2.5">
                      {STEPS.map((step, i) => (
                        <div
                          key={step.label}
                          className="flex min-w-0 flex-1 items-center justify-center gap-1"
                        >
                          <step.icon
                            className="h-3.5 w-3.5 shrink-0 text-[#ff6a1a] sm:h-4 sm:w-4"
                            strokeWidth={2.3}
                          />
                          <span className="truncate text-[11px] font-bold text-ink sm:text-[12px]">
                            {step.label}
                          </span>
                          {i < STEPS.length - 1 ? (
                            <span className="hidden text-[#c5c0b6] sm:inline">→</span>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:gap-2.5">
                      <LearnStartButton
                        href="/learn"
                        onClick={() => setOpen(false)}
                        className="w-full justify-center"
                      >
                        Explore Learn
                      </LearnStartButton>
                      <button
                        type="button"
                        onClick={() => {
                          setTalk(true);
                          setFaqId(DINO_FAQ_START);
                        }}
                        className={learnUi.ctaGhost}
                      >
                        Talk to Dino
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        setTalk(false);
                        setFaqId(DINO_FAQ_START);
                      }}
                      className="inline-flex items-center gap-1 text-[12px] font-bold text-[#5a6472] transition hover:text-ink"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
                      Back
                    </button>
                    <h2
                      id={titleId}
                      className="mt-2 text-[1.2rem] font-extrabold tracking-tight text-ink sm:text-[1.45rem]"
                    >
                      Talk to <span className="text-[#ff6a1a]">Dino</span>
                    </h2>

                    <p className="mt-2.5 text-[12px] font-bold leading-snug text-[#8a929c] sm:text-[13px]">
                      {faq.question}
                    </p>
                    <div className="mt-1.5 rounded-2xl bg-white/70 px-3.5 py-3 ring-1 ring-white/80 sm:px-4 sm:py-3.5">
                      <p className="flex items-start gap-2 text-[13px] font-semibold leading-relaxed text-ink sm:text-[14px]">
                        <Volume2
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6a1a]"
                          strokeWidth={2.2}
                        />
                        <span className="min-w-0 flex-1">{faq.answer}</span>
                      </p>
                    </div>

                    {faq.cta ? (
                      <Link
                        href={faq.cta.href}
                        onClick={() => setOpen(false)}
                        className={cn(learnUi.cta, "mt-3")}
                      >
                        {faq.cta.label}
                      </Link>
                    ) : (
                      <Link
                        href={LEARN_SIGNUP_HREF}
                        onClick={() => setOpen(false)}
                        className={cn(learnUi.cta, "mt-3")}
                      >
                        Start free
                      </Link>
                    )}

                    <p className="mt-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a929c] sm:mt-4 sm:text-[11px]">
                      Ask next
                    </p>
                    <div className="mt-1.5 flex w-full flex-col gap-1.5 sm:mt-2">
                      {nextQs.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setFaqId(q.id)}
                          className="w-full rounded-xl bg-white/60 px-3 py-2.5 text-left text-[12px] font-bold leading-snug text-ink ring-1 ring-white/80 transition hover:bg-white sm:px-3.5 sm:py-3 sm:text-[13px]"
                        >
                          {q.question}
                        </button>
                      ))}
                    </div>

                    <LearnStartButton
                      href="/learn"
                      onClick={() => setOpen(false)}
                      className="mt-3 w-full justify-center"
                    >
                      Explore Learn
                    </LearnStartButton>
                  </div>
                )}
              </div>
            </div>

            {!talk ? (
              <div
                className="pointer-events-none absolute -left-20 top-0 z-20 hidden h-[13.37rem] w-[11rem] sm:block"
                style={{ clipPath: "inset(37% 0 44.7% 86.5%)" }}
                aria-hidden
              >
                <DinoArt pose="hold" />
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-end gap-2",
              usingCustomPos && "items-center",
            )}
          >
            {hi && !usingCustomPos ? (
              <p className="max-w-[10.5rem] animate-in fade-in zoom-in-95 rounded-2xl rounded-br-md bg-white/90 px-2.5 py-1.5 text-[11px] font-bold leading-snug text-ink shadow-[0_8px_20px_rgba(28,36,52,0.12)] ring-1 ring-white/80 backdrop-blur-md sm:max-w-[11.5rem] sm:px-3 sm:py-2 sm:text-[12px]">
                Learn with <span className="text-[#ff6a1a]">mentr</span>
              </p>
            ) : null}
            <button
              type="button"
              onPointerDown={onFabPointerDown}
              onPointerMove={onFabPointerMove}
              onPointerUp={onFabPointerUp}
              onPointerCancel={onFabPointerUp}
              className="inline-flex touch-none border-0 bg-transparent p-0"
              aria-expanded={open}
              aria-label="Open Mentr Learn dino guide — drag to move"
            >
              <LearnDino
                action="handshake"
                size={104}
                className="h-[4.25rem] w-[4.25rem] drop-shadow-[0_10px_18px_rgba(28,36,52,0.2)] sm:h-[5.35rem] sm:w-[5.35rem]"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
