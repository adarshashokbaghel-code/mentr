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
  type LearnDinoAction,
} from "@/lib/learn-assets";
import { LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
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
import { useEffect, useId, useRef, useState } from "react";
import { LearnDino } from "./learn-dino";
import { LearnStartButton } from "./learn-start-button";

const HIDDEN_PREFIXES = [
  "/admin",
  "/admintestingistrueonlyman134hsydsudy4",
  "/learn/app",
];

/**
 * Both copies of the holding dino use this exact box, so the clipped front layer
 * lines up with the layer behind the glass. Each box keeps its artwork's ratio
 * (783:952 for the grip, 707:935 for the peek) so the clip percentages in
 * `.learn-dino-grip-front` map onto the drawing.
 *
 * Solved so the card's left edge lands at 0.865 of the dino width: 0.865 × 5.4 =
 * 4.67rem on mobile, 0.865 × 11 − 4.96 = 4.56rem from sm up — which is the card's
 * left margin below. Both sit flush with the dialog top so the card starts lower
 * than the dino's head and it reads as standing behind the panel.
 */
const DINO_HOLD_BOX =
  "learn-dino-grip pointer-events-none absolute left-0 top-0 h-[6.57rem] w-[5.4rem] sm:-left-[4.96rem] sm:h-[13.37rem] sm:w-[11rem]";

/**
 * Same card margins, solved so the edge lands at 0.82 of the peek artwork: that
 * clears the whole face and the waving paw, and tucks the lowered right arm and
 * foot behind the glass.
 */
const DINO_PEEK_BOX =
  "learn-dino-peek-bob pointer-events-none absolute left-[0.24rem] top-0 h-[7.14rem] w-[5.4rem] sm:-left-[3.64rem] sm:h-[13.23rem] sm:w-[10rem]";

const DINO_ART = {
  hold: { src: LEARN_DINO_HOLD_SRC, ...LEARN_DINO_HOLD_SIZE },
  peek: { src: LEARN_DINO_PEEK_SRC, ...LEARN_DINO_PEEK_SIZE },
} as const;

/**
 * The clipped front copy skips the drop shadow: the filter runs over the whole
 * drawing before the clip is applied, so its shadow would land on the panel as a
 * grey rectangle.
 */
function DinoArt({ pose, shadow = false }: { pose: keyof typeof DINO_ART; shadow?: boolean }) {
  const art = DINO_ART[pose];
  return (
    <Image
      src={art.src}
      alt=""
      width={art.width}
      height={art.height}
      className={cn(
        "h-full w-full bg-transparent object-contain",
        shadow && "drop-shadow-[0_16px_26px_rgba(28,36,52,0.2)]",
      )}
      unoptimized
      priority
    />
  );
}

const TRACKS = [
  { icon: Cpu, label: "CS", hint: "20 modules", tint: "text-[#ff6a1a]" },
  { icon: Sparkles, label: "AI", hint: "20 modules", tint: "text-[#7c3aed]" },
  { icon: Calculator, label: "Math", hint: "20 modules", tint: "text-[#0d9488]" },
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const hidden = HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const faq = dinoFaqNode(faqId);
  const nextQs = dinoFaqNext(faqId);
  const action = (faq.action ?? "handshake") as LearnDinoAction;
  const onLearn = pathname === "/learn" || pathname.startsWith("/learn/");

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
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setTalk(false);
      setFaqId(DINO_FAQ_START);
    }
  }, [open]);

  if (hidden) return null;

  return (
    <div
      className={cn(
        "learn-dino-guide pointer-events-none fixed z-[255] flex justify-end",
        cookieUp
          ? "bottom-[7.5rem] sm:bottom-[5.5rem]"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))]",
        "right-[max(0.75rem,env(safe-area-inset-right))]",
      )}
    >
      {open ? (
        <button
          type="button"
          className="pointer-events-auto fixed inset-0 z-0 bg-[#1c2434]/25 backdrop-blur-[3px]"
          aria-label="Close dino guide"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="pointer-events-auto relative">
        {open ? (
          <div
            className="learn-dino-guide-in relative w-[min(calc(100vw-1.5rem),29.5rem)] sm:w-[29.5rem]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            {/* On the intro view the dino grips the card by its left edge: this copy sits
                behind the glass, and the clipped copy after the card lifts only its upper
                arm in front, so one paw holds the panel from the front and the lower one
                stays behind it. On the chat view the dino swaps pose and drops fully
                behind the glass. */}
            {talk ? (
              <div className={cn(DINO_PEEK_BOX, "z-0")}>
                <DinoArt pose="peek" shadow />
              </div>
            ) : (
              <div className={cn(DINO_HOLD_BOX, "z-0")}>
                <DinoArt pose="hold" shadow />
              </div>
            )}

            <div className="learn-dino-glass relative z-10 ml-[4.67rem] mt-[1.7rem] overflow-hidden rounded-[1.75rem] sm:ml-[4.56rem] sm:mt-[3.2rem]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[#5a6472] ring-1 ring-white/80 transition hover:bg-white hover:text-[#1c2434]"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.4} />
              </button>

              <div
                ref={scrollRef}
                className="max-h-[min(70dvh,36rem)] overflow-y-auto overscroll-contain px-5 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7"
              >
                {!talk ? (
                  <>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1c2434]">
                      Mentr Learn
                    </p>
                    <h2
                      id={titleId}
                      className="mt-1.5 max-w-[16.5rem] text-[1.35rem] font-extrabold leading-snug tracking-tight text-[#1c2434] sm:text-[1.5rem]"
                    >
                      CS, AI &amp; Math —{" "}
                      <span className="text-[#ff6a1a]">free for Class 3–5</span>
                    </h2>
                    <p className="mt-3 text-[14px] leading-relaxed text-[#5a6472]">
                      60 short lessons in coding, AI and maths for Class 3–5. Your child watches
                      a video, answers 10 questions, then plays a game — about 15 minutes a day.
                      Every week we email you what they finished.
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {TRACKS.map((track) => (
                        <div key={track.label} className="text-center">
                          <track.icon
                            className={cn("mx-auto h-7 w-7 sm:h-8 sm:w-8", track.tint)}
                            strokeWidth={2.1}
                            aria-hidden
                          />
                          <p className="mt-2 text-[13px] font-extrabold text-[#1c2434]">
                            {track.label}
                          </p>
                          <p className="text-[11px] font-semibold text-[#8a929c]">{track.hint}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-1 rounded-2xl bg-white/55 px-3 py-2.5 ring-1 ring-white/80">
                      {STEPS.map((step, i) => (
                        <div
                          key={step.label}
                          className="flex min-w-0 flex-1 items-center justify-center gap-1.5"
                        >
                          <step.icon
                            className="h-4 w-4 shrink-0 text-[#ff6a1a]"
                            strokeWidth={2.3}
                          />
                          <span className="truncate text-[12px] font-bold text-[#1c2434]">
                            {step.label}
                          </span>
                          {i < STEPS.length - 1 ? (
                            <span className="hidden text-[#c5c0b6] sm:inline">→</span>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-2.5">
                      <LearnStartButton
                        href={onLearn ? "#curriculum" : "/learn"}
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
                        className="inline-flex h-12 items-center justify-center rounded-full bg-white/75 px-4 text-[14px] font-bold text-[#1c2434] ring-1 ring-white/85 transition hover:bg-white"
                      >
                        Talk to Dino
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full min-w-0 pr-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTalk(false);
                        setFaqId(DINO_FAQ_START);
                      }}
                      className="inline-flex items-center gap-1 text-[12px] font-bold text-[#5a6472] transition hover:text-[#1c2434]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
                      Back
                    </button>
                    <h2
                      id={titleId}
                      className="mt-2.5 w-full text-[1.35rem] font-extrabold tracking-tight text-[#1c2434] sm:text-[1.5rem]"
                    >
                      Talk to <span className="text-[#ff6a1a]">Dino</span>
                    </h2>

                    <p className="mt-3 w-full text-[13px] font-bold leading-snug text-[#8a929c]">
                      {faq.question}
                    </p>
                    <div className="mt-1.5 w-full rounded-2xl bg-white/70 px-4 py-3.5 ring-1 ring-white/80">
                      <p className="flex w-full items-start gap-2 text-[14px] font-semibold leading-relaxed text-[#1c2434]">
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
                        className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#ff6a1a] px-4 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(255,106,26,0.28)] transition hover:bg-[#e85f14]"
                      >
                        {faq.cta.label}
                      </Link>
                    ) : (
                      <Link
                        href={LEARN_SIGNUP_HREF}
                        onClick={() => setOpen(false)}
                        className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#ff6a1a] px-4 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(255,106,26,0.28)] transition hover:bg-[#e85f14]"
                      >
                        Start free
                      </Link>
                    )}

                    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a929c]">
                      Ask next
                    </p>
                    <div className="mt-2 flex w-full flex-col gap-1.5">
                      {nextQs.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setFaqId(q.id)}
                          className="w-full rounded-xl bg-white/60 px-3.5 py-3 text-left text-[13px] font-bold leading-snug text-[#1c2434] ring-1 ring-white/80 transition hover:bg-white"
                        >
                          {q.question}
                        </button>
                      ))}
                    </div>

                    <LearnStartButton
                      href={onLearn ? "#curriculum" : "/learn"}
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
              <div className={cn(DINO_HOLD_BOX, "learn-dino-grip-front z-20")} aria-hidden>
                <DinoArt pose="hold" />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-end gap-2">
            {hi ? (
              <p className="learn-dino-hi max-w-[11.5rem] rounded-2xl rounded-br-md bg-white/90 px-3 py-2 text-[12px] font-bold leading-snug text-[#1c2434] shadow-[0_10px_24px_rgba(28,36,52,0.14)] ring-1 ring-white/80 backdrop-blur-md">
                Learn with <span className="text-[#ff6a1a]">mentr</span>
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="learn-dino-launcher"
              aria-expanded={open}
              aria-label="Open Mentr Learn dino guide"
            >
              <LearnDino
                action="handshake"
                size={104}
                className="h-[4.6rem] w-[4.6rem] drop-shadow-[0_12px_20px_rgba(28,36,52,0.22)] sm:h-[5.35rem] sm:w-[5.35rem]"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
