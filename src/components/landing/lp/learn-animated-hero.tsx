"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  Check,
  ChevronRight,
  Cpu,
  Flame,
  Gamepad2,
  Keyboard,
  Monitor,
  Pause,
  Play,
  Sparkles,
  Trophy,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { LearnDino } from "./learn-dino";

const STEP_MS = 5600;

const DEMO_STEPS = [
  {
    id: "watch",
    label: "Watch",
    icon: Play,
    benefit: "Narrated lesson · 3–6 min",
  },
  {
    id: "quiz",
    label: "Quiz",
    icon: BookOpen,
    benefit: "Instant feedback · +XP",
  },
  {
    id: "play",
    label: "Play",
    icon: Gamepad2,
    benefit: "Daily arena · keep streak",
  },
  {
    id: "boss",
    label: "Boss",
    icon: Trophy,
    benefit: "Unit mastery unlock",
  },
] as const;

/** Soft product cursor — follows a CSS path per step */
function DemoCursor({ stepId }: { stepId: string }) {
  return (
    <div
      className={cn(
        "learn-demo-cursor pointer-events-none absolute z-30 hidden sm:block",
        `learn-demo-cursor--${stepId}`,
      )}
      aria-hidden
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
      >
        <path
          d="M5.5 3.2 19 11.4l-6.2 1.4 2.8 6.6-2.4 1-2.9-6.7-4.8 4.2V3.2Z"
          fill="#1c2434"
          stroke="#fff"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
      <span className="learn-demo-cursor-ring" />
    </div>
  );
}

function WatchStep() {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#0e131b]">
      <div className="relative min-h-[200px] flex-1 sm:min-h-0">
        <Image
          src="/learn/demo/learn-demo-watch-scene.png"
          alt=""
          fill
          className="object-cover object-center opacity-90"
          sizes="(max-width: 768px) 100vw, 560px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e131b] via-[#0e131b]/55 to-[#0e131b]/25" />
        <div className="learn-video-scan pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/80 backdrop-blur-md ring-1 ring-white/15">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff6a1a]" />
                Lesson 1 of 5 · CS Basics
              </div>
              <h3 className="mt-2 text-[15px] font-semibold tracking-tight text-white sm:text-[17px]">
                What Is a Computer?
              </h3>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold text-white/75 backdrop-blur-md ring-1 ring-white/10">
              <Volume2 className="h-3 w-3" strokeWidth={2.25} />
              Narrated
            </span>
          </div>

          <div className="mx-auto grid w-full max-w-[380px] grid-cols-3 gap-2 sm:gap-2.5">
            {[
              {
                icon: Keyboard,
                label: "Input",
                ex: "Keyboard",
                delay: "learn-demo-card-1",
              },
              {
                icon: Cpu,
                label: "Process",
                ex: "CPU",
                delay: "learn-demo-card-2",
              },
              {
                icon: Monitor,
                label: "Output",
                ex: "Screen",
                delay: "learn-demo-card-3",
              },
            ].map((box) => (
              <div
                key={box.label}
                className={cn(
                  "learn-demo-flow-card min-w-0 rounded-xl border border-white/12 bg-white/[0.08] px-2 py-2.5 text-center backdrop-blur-md sm:px-2.5 sm:py-3",
                  box.delay,
                )}
              >
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 sm:h-9 sm:w-9">
                  <box.icon
                    className="h-3.5 w-3.5 text-[#ffb27a] sm:h-4 sm:w-4"
                    strokeWidth={2.25}
                  />
                </span>
                <p className="mt-1.5 text-[10px] font-semibold text-white sm:text-[11px]">
                  {box.label}
                </p>
                <p className="truncate text-[9px] text-white/50 sm:text-[10px]">
                  {box.ex}
                </p>
              </div>
            ))}
          </div>

          <div className="learn-demo-caption rounded-xl border border-white/10 bg-black/45 px-3 py-2.5 backdrop-blur-md sm:px-3.5">
            <p className="text-[11px] font-medium leading-relaxed text-white/90 sm:text-[12px]">
              A computer takes input, thinks with a processor, then shows
              output.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/8 bg-[#0a0e14]/95 px-3 py-2.5 backdrop-blur-md sm:px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            tabIndex={-1}
            className="learn-demo-watch-play flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#0e131b]"
            aria-hidden
          >
            <Pause className="h-3.5 w-3.5 fill-current" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="h-1 overflow-hidden rounded-full bg-white/12">
              <div className="learn-video-progress h-full rounded-full bg-[#ff6a1a]" />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] font-medium text-white/45 sm:text-[11px]">
              <span>1:08 / 3:00</span>
              <span className="learn-demo-watch-cta inline-flex items-center gap-1 text-[#ffb27a]">
                Finish video · +10 XP
                <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizStep() {
  const options = [
    { key: "A", label: "Keyboard", ok: true },
    { key: "B", label: "Monitor", ok: false },
    { key: "C", label: "Speaker", ok: false },
  ];

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#f6f4ef]">
      <Image
        src="/learn/demo/learn-demo-canvas.png"
        alt=""
        fill
        className="object-cover opacity-40"
        sizes="(max-width: 768px) 100vw, 560px"
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col p-3.5 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff6a1a] sm:text-[11px]">
            Check · Q1 of 5
          </p>
          <span className="learn-demo-xp-chip inline-flex items-center gap-1 rounded-full bg-[#fff4e8] px-2.5 py-1 text-[10px] font-semibold text-[#ff6a1a] ring-1 ring-[#ff6a1a]/15 sm:text-[11px]">
            <Sparkles className="h-3 w-3" strokeWidth={2.25} />
            +10 XP
          </span>
        </div>

        <p className="mt-3 max-w-[28rem] text-[15px] font-semibold leading-snug tracking-tight text-[#1c2434] sm:mt-4 sm:text-[17px]">
          Which device sends data{" "}
          <span className="text-[#ff6a1a]">into</span> the computer?
        </p>

        <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
          {options.map((o, i) => (
            <li
              key={o.key}
              className={cn(
                "learn-demo-quiz-option flex items-center gap-3 rounded-xl bg-white/90 px-3 py-2.5 text-[13px] font-medium text-[#1c2434] shadow-[0_1px_2px_rgba(28,36,52,0.04)] ring-1 ring-[#e8e2d8] backdrop-blur-sm sm:px-3.5 sm:py-3 sm:text-[14px]",
                o.ok && "learn-demo-quiz-hit learn-quiz-correct",
                `learn-demo-quiz-opt-${i}`,
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold",
                  o.ok
                    ? "bg-[#0d9488] text-white"
                    : "bg-[#f3f0ea] text-[#8a929c]",
                )}
              >
                {o.ok ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
                ) : (
                  o.key
                )}
              </span>
              {o.label}
              {o.ok ? (
                <span className="ml-auto text-[11px] font-semibold text-[#0d9488]">
                  Correct
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="learn-demo-quiz-explain mt-auto rounded-xl border border-[#ffe0c2] bg-[#fff7ef]/95 px-3 py-2.5 sm:mt-5">
          <p className="text-[11px] font-medium leading-relaxed text-[#8a4b1a] sm:text-[12px]">
            Keyboard is an input device — it sends letters and clicks into the
            system.
          </p>
        </div>
      </div>
    </div>
  );
}

function PlayStep() {
  const slots = [
    {
      label: "Input",
      filled: "Keyboard",
      icon: Keyboard,
      tint: "bg-[#fff4e8] text-[#ff6a1a]",
      slotClass: "learn-demo-play-slot-1",
    },
    {
      label: "Process",
      filled: "CPU",
      icon: Cpu,
      tint: "bg-[#e6f7f4] text-[#0d9488]",
      slotClass: "learn-demo-play-slot-2",
    },
    {
      label: "Output",
      filled: "Screen",
      icon: Monitor,
      tint: "bg-[#eef2ff] text-[#4f46e5]",
      slotClass: "learn-demo-play-slot-3",
    },
  ];

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#f6f4ef]">
      <Image
        src="/learn/demo/learn-demo-canvas.png"
        alt=""
        fill
        className="object-cover opacity-35"
        sizes="(max-width: 768px) 100vw, 560px"
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0d9488] sm:text-[11px]">
              Play Arena · Daily
            </p>
            <p className="mt-1 text-[15px] font-semibold tracking-tight text-[#1c2434] sm:text-[16px]">
              Match each part to its job
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#fff8d6] px-2.5 py-1 text-[10px] font-semibold text-[#b45309] ring-1 ring-[#f5d78e]/80 sm:text-[11px]">
            <Flame className="h-3.5 w-3.5" strokeWidth={2.25} />
            6-day streak
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-2.5">
          {slots.map((s) => (
            <div
              key={s.label}
              className={cn(
                "min-w-0 rounded-xl border border-dashed border-[#d5cfc4] bg-white/70 p-2 text-center backdrop-blur-sm sm:p-2.5",
                s.slotClass,
              )}
            >
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8a929c] sm:text-[10px]">
                {s.label}
              </p>
              <span
                className={cn(
                  "learn-demo-play-chip mt-2 flex items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[10px] font-semibold sm:mt-2.5 sm:px-2 sm:py-2 sm:text-[12px]",
                  s.tint,
                )}
              >
                <s.icon className="hidden h-3.5 w-3.5 sm:block" strokeWidth={2.25} />
                {s.filled}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
          {["RAM", "Speaker"].map((p) => (
            <span
              key={p}
              className="rounded-lg border border-[#e8e2d8] bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#5a6472] shadow-[0_1px_2px_rgba(28,36,52,0.04)] sm:text-[12px]"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="learn-demo-play-success mt-auto flex items-center justify-between gap-2 rounded-xl bg-[#e6f7f4]/90 px-3 py-2.5 ring-1 ring-[#0d9488]/20 sm:mt-5">
          <p className="text-[11px] font-semibold text-[#0d9488] sm:text-[12px]">
            3 / 3 matched · streak kept
          </p>
          <span className="text-[11px] font-semibold text-[#0d9488]">+5 XP</span>
        </div>
      </div>
    </div>
  );
}

function BossStep() {
  const parts = [
    { name: "Keyboard", job: "Input", icon: Keyboard, cls: "learn-demo-boss-part-1" },
    { name: "CPU", job: "Process", icon: Cpu, cls: "learn-demo-boss-part-2" },
    { name: "Screen", job: "Output", icon: Monitor, cls: "learn-demo-boss-part-3" },
  ];

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#0e131b]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,106,26,0.18),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(13,148,136,0.14),transparent_50%)]" />

      <div className="relative z-10 flex h-full min-h-0 flex-col p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ffb27a] sm:text-[11px]">
              Boss challenge · Unit 1
            </p>
            <p className="mt-1 text-[16px] font-semibold tracking-tight text-white sm:text-[18px]">
              Build-a-Computer
            </p>
            <p className="mt-1.5 max-w-sm text-[11px] leading-relaxed text-white/55 sm:text-[12px]">
              After modules A1–A5, assemble the system to unlock Algorithms.
            </p>
          </div>
          <div className="learn-demo-boss-badge relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
            <Image
              src="/learn/demo/learn-demo-boss-badge.png"
              alt=""
              fill
              className="object-contain drop-shadow-[0_8px_24px_rgba(255,106,26,0.35)]"
              sizes="64px"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-2.5">
          {parts.map((part) => (
            <div
              key={part.name}
              className={cn(
                "min-w-0 rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2.5 text-center backdrop-blur-md sm:px-2.5 sm:py-3",
                part.cls,
              )}
            >
              <part.icon
                className="mx-auto h-4 w-4 text-[#ffb27a]"
                strokeWidth={2.25}
              />
              <p className="mt-1.5 truncate text-[10px] font-semibold text-white sm:text-[11px]">
                {part.name}
              </p>
              <p className="text-[9px] text-white/45">{part.job}</p>
            </div>
          ))}
        </div>

        <div className="learn-demo-boss-unlock mt-auto flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5 backdrop-blur-md sm:mt-5 sm:px-3.5 sm:py-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg sm:h-11 sm:w-11">
            <Image
              src="/learn/demo/learn-demo-boss-badge.png"
              alt=""
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-white sm:text-[13px]">
              Unit 1 badge unlocked
            </p>
            <p className="text-[10px] text-white/50 sm:text-[11px]">
              CS Basics complete · next: Algorithms
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#0d9488]/20 px-2.5 py-1 text-[10px] font-semibold text-[#5eead4] ring-1 ring-[#0d9488]/30 sm:text-[11px]">
            Done
          </span>
        </div>
      </div>
    </div>
  );
}

const STEP_VIEWS = [WatchStep, QuizStep, PlayStep, BossStep] as const;

export function LearnAnimatedHero() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = useCallback(
    () => setStep((s) => (s + 1) % DEMO_STEPS.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(goNext, STEP_MS);
    return () => window.clearInterval(id);
  }, [paused, goNext]);

  const StepView = STEP_VIEWS[step];
  const active = DEMO_STEPS[step];

  return (
    <div
      className="learn-hero-reveal learn-hero-reveal-delay-1 relative w-full min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white shadow-[0_24px_64px_rgba(28,36,52,0.1)]">
        {/* Product chrome */}
        <div className="flex items-center gap-3 border-b border-[#f0ebe3] bg-gradient-to-b from-white to-[#faf8f4] px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
          <LearnDino
            size={40}
            className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
            priority
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold tracking-tight text-[#1c2434]">
                  Mentr Learn
                </p>
                <p className="truncate text-[10px] font-medium text-[#8a929c] sm:text-[11px]">
                  {active.benefit}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#fff4e8] px-2.5 py-1 text-[10px] font-semibold text-[#ff6a1a] ring-1 ring-[#ff6a1a]/12">
                Module A1
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#efe6d8]">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#ff8a3d] to-[#ff6a1a]" />
              </div>
              <span className="shrink-0 text-[10px] font-semibold tabular-nums text-[#8a929c]">
                340 XP
              </span>
            </div>
          </div>
        </div>

        {/* Stage tabs */}
        <div className="relative grid grid-cols-4 border-b border-[#f0ebe3] bg-[#faf8f4]">
          {DEMO_STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === i;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "relative flex min-w-0 flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold transition sm:gap-1.5 sm:py-3 sm:text-[12px]",
                  isActive
                    ? "bg-white text-[#ff6a1a]"
                    : "text-[#8a929c] hover:text-[#1c2434]",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8",
                    isActive ? "bg-[#fff4e8]" : "bg-transparent",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
                {s.label}
                {isActive ? (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 overflow-hidden rounded-full bg-[#ffe0c2]">
                    <span
                      key={`${step}-${paused}`}
                      className={cn(
                        "block h-full bg-[#ff6a1a]",
                        paused ? "w-full" : "learn-step-progress",
                      )}
                      style={
                        paused
                          ? undefined
                          : { animationDuration: `${STEP_MS}ms` }
                      }
                    />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Stage body */}
        <div className="relative min-h-[280px] sm:aspect-[16/10] sm:min-h-[360px]">
          <div key={step} className="learn-step-enter relative sm:absolute sm:inset-0">
            <div className="relative sm:h-full">
              <StepView />
              <DemoCursor stepId={active.id} />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] font-medium text-[#8a929c] sm:text-[12px]">
        Hover to pause · tap Watch, Quiz, Play, or Boss to explore the loop
      </p>
    </div>
  );
}
