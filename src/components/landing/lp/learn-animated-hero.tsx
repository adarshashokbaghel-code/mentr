"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  Check,
  Cpu,
  Flame,
  Gamepad2,
  Keyboard,
  type LucideIcon,
  Monitor,
  Play,
  Trophy,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { LearnDino } from "./learn-dino";

const STEP_MS = 4800;

const DEMO_STEPS = [
  { id: "watch", label: "Watch", icon: Play },
  { id: "quiz", label: "Quiz", icon: BookOpen },
  { id: "play", label: "Play", icon: Gamepad2 },
  { id: "boss", label: "Boss", icon: Trophy },
] as const;

function FlatIcon({
  icon: Icon,
  className,
  iconClass,
}: {
  icon: LucideIcon;
  className?: string;
  iconClass?: string;
}) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      <Icon className={cn("h-4 w-4", iconClass)} strokeWidth={2.25} aria-hidden />
    </span>
  );
}

function WatchStep() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#1c2434]">
      <div className="relative min-h-[168px] flex-1 overflow-hidden sm:min-h-0">
        <div className="learn-video-scan pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a3548] via-[#1c2434] to-[#0f3d38]" />

        <div className="relative z-10 flex h-full flex-col justify-between gap-3 p-2.5 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#ffb27a]">
                Lesson 1 of 5 · CS Basics
              </p>
              <p className="mt-0.5 text-[14px] font-bold text-white sm:text-[15px]">What Is a Computer?</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold text-white/80">
              <Volume2 className="h-3 w-3" strokeWidth={2.25} /> Narrated
            </span>
          </div>

          <div className="mx-auto grid w-full max-w-[340px] grid-cols-3 gap-1.5 sm:gap-2">
            {[
              { icon: Keyboard, label: "Input", ex: "Keyboard" },
              { icon: Cpu, label: "Process", ex: "CPU" },
              { icon: Monitor, label: "Output", ex: "Screen" },
            ].map((box) => (
              <div
                key={box.label}
                className="min-w-0 rounded-md border border-white/15 bg-white/10 px-1 py-2 text-center sm:px-2 sm:py-3"
              >
                <box.icon className="mx-auto h-4 w-4 text-[#ffb27a] sm:h-5 sm:w-5" strokeWidth={2.25} />
                <p className="mt-1 text-[10px] font-bold text-white sm:mt-1.5 sm:text-[11px]">{box.label}</p>
                <p className="truncate text-[9px] text-white/55 sm:text-[10px]">{box.ex}</p>
              </div>
            ))}
          </div>

          <p className="rounded-md bg-black/35 px-2.5 py-1.5 text-[11px] font-medium leading-snug text-white/90 sm:px-3 sm:py-2 sm:text-[12px]">
            A computer takes input, thinks with a processor, then shows output.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#151b28] px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="h-1 overflow-hidden rounded-sm bg-white/15">
          <div className="learn-video-progress h-full rounded-sm bg-[#ff6a1a]" />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] font-semibold text-white/55 sm:text-[11px]">
          <span>1:08 / 3:00</span>
          <span>Finish video · +10 XP</span>
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
    <div className="flex h-full min-h-0 flex-col bg-[#faf8f4] p-2.5 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 text-[10px] font-bold uppercase tracking-wider text-[#ff6a1a] sm:text-[11px]">
          Quiz · Question 1 of 5
        </p>
        <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-[#1c2434] ring-1 ring-[#efe6d8] sm:text-[11px]">
          +10 XP
        </span>
      </div>
      <p className="mt-2 text-[14px] font-bold leading-snug text-[#1c2434] sm:mt-3 sm:text-[16px]">
        Which device sends data <em className="not-italic text-[#ff6a1a]">into</em> the computer?
      </p>
      <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
        {options.map((o) => (
          <li
            key={o.key}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-semibold sm:gap-3 sm:px-3 sm:py-2.5",
              o.ok
                ? "learn-quiz-correct bg-[#e6f7f4] text-[#0d9488] ring-1 ring-[#0d9488]/30"
                : "bg-white text-[#5a6472] ring-1 ring-[#efe6d8]",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px] font-bold sm:h-7 sm:w-7",
                o.ok ? "bg-[#0d9488] text-white" : "bg-[#f7f5f1] text-[#8a929c]",
              )}
            >
              {o.ok ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : o.key}
            </span>
            {o.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 rounded-md bg-[#fff4e8] px-2.5 py-2 text-[11px] font-medium leading-snug text-[#8a4b1a] sm:mt-auto sm:px-3 sm:text-[12px]">
        Keyboard is an input device — it sends letters and clicks in.
      </p>
    </div>
  );
}

function PlayStep() {
  const slots = [
    { label: "Input", filled: "Keyboard", icon: Keyboard, tint: "bg-[#fff4e8] text-[#ff6a1a]" },
    { label: "Process", filled: "CPU", icon: Cpu, tint: "bg-[#e6f7f4] text-[#0d9488]" },
    { label: "Output", filled: "Screen", icon: Monitor, tint: "bg-[#eef2ff] text-[#4f46e5]" },
  ];
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#faf8f4] p-2.5 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488] sm:text-[11px]">
            Play Arena · Daily
          </p>
          <p className="mt-0.5 text-[14px] font-bold text-[#1c2434] sm:text-[15px]">Match each part to its job</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#fff8d6] px-1.5 py-1 text-[10px] font-bold text-[#b45309] sm:px-2 sm:text-[11px]">
          <Flame className="h-3.5 w-3.5" strokeWidth={2.25} />
          6-day
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2">
        {slots.map((s) => (
          <div key={s.label} className="min-w-0 rounded-md border border-dashed border-[#d8d2c8] bg-white p-1.5 text-center sm:p-2">
            <p className="text-[9px] font-bold uppercase tracking-wide text-[#8a929c] sm:text-[10px]">{s.label}</p>
            <span
              className={cn(
                "mt-1 flex items-center justify-center gap-1 rounded-md px-1 py-1 text-[10px] font-bold sm:mt-1.5 sm:px-1.5 sm:py-1.5 sm:text-[12px]",
                s.tint,
              )}
            >
              <s.icon className="hidden h-3.5 w-3.5 sm:block" strokeWidth={2.25} />
              {s.filled}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
        {["RAM", "Speaker"].map((p) => (
          <span
            key={p}
            className="rounded-md border border-[#efe6d8] bg-white px-2.5 py-1 text-[11px] font-bold text-[#1c2434] sm:px-3 sm:py-1.5 sm:text-[12px]"
          >
            {p}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[11px] font-semibold text-[#0d9488] sm:mt-auto sm:text-[12px]">
        3 / 3 matched · streak kept · +5 XP
      </p>
    </div>
  );
}

function BossStep() {
  const parts = [
    { name: "Keyboard", job: "Input", icon: Keyboard },
    { name: "CPU", job: "Process", icon: Cpu },
    { name: "Screen", job: "Output", icon: Monitor },
  ];
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#faf8f4] p-2.5 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff6a1a] sm:text-[11px]">
            Boss challenge · Unit 1
          </p>
          <p className="mt-0.5 text-[15px] font-bold text-[#1c2434] sm:text-[16px]">Build-a-Computer</p>
        </div>
        <FlatIcon
          icon={Trophy}
          className="h-8 w-8 shrink-0 rounded-md bg-[#fff4e8] sm:h-9 sm:w-9"
          iconClass="h-4 w-4 text-[#ff6a1a] sm:h-5 sm:w-5"
        />
      </div>

      <p className="mt-2 text-[11px] leading-snug text-[#5a6472] sm:text-[12px]">
        After modules A1–A5, assemble input, processor, and output to unlock the next unit.
      </p>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
        {parts.map((part) => (
          <div
            key={part.name}
            className="min-w-0 rounded-md border border-[#efe6d8] bg-white px-1 py-1.5 text-center sm:px-2 sm:py-2"
          >
            <part.icon className="mx-auto h-3.5 w-3.5 text-[#0d9488] sm:h-4 sm:w-4" strokeWidth={2.25} />
            <p className="mt-1 truncate text-[10px] font-bold text-[#1c2434]">{part.name}</p>
            <p className="text-[9px] text-[#8a929c]">{part.job}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-md border border-[#efe6d8] bg-white px-2.5 py-2 sm:mt-auto sm:gap-3 sm:px-3 sm:py-2.5">
        <FlatIcon
          icon={Trophy}
          className="h-8 w-8 shrink-0 rounded-md bg-[#fff4e8] sm:h-10 sm:w-10"
          iconClass="h-4 w-4 text-[#ff6a1a] sm:h-5 sm:w-5"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold leading-snug text-[#1c2434] sm:text-[13px]">
            Unit 1 badge unlocked
          </p>
          <p className="text-[10px] leading-snug text-[#5a6472] sm:text-[11px]">
            CS Basics complete · next: Algorithms
          </p>
        </div>
        <span className="shrink-0 text-[10px] font-bold text-[#0d9488] sm:text-[11px]">Done</span>
      </div>
    </div>
  );
}

const STEP_VIEWS = [WatchStep, QuizStep, PlayStep, BossStep] as const;

export function LearnAnimatedHero() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = useCallback(() => setStep((s) => (s + 1) % DEMO_STEPS.length), []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(goNext, STEP_MS);
    return () => window.clearInterval(id);
  }, [paused, goNext]);

  const StepView = STEP_VIEWS[step];

  return (
    <div
      className="learn-hero-reveal learn-hero-reveal-delay-1 relative w-full min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-lg border border-[#efe6d8] bg-white shadow-[0_20px_48px_rgba(28,36,52,0.08)]">
        <div className="flex items-center gap-2 border-b border-[#f0ebe3] bg-white px-2.5 py-2 sm:gap-3 sm:px-3.5 sm:py-2.5">
          <LearnDino size={36} className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" priority />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[13px] font-bold text-[#1c2434]">Mentr Learn</p>
              <span className="shrink-0 rounded-md bg-[#fff4e8] px-2 py-0.5 text-[10px] font-bold text-[#ff6a1a]">
                Module A1
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-[#efe6d8]">
                <div className="h-full w-[68%] rounded-sm bg-[#ff6a1a]" />
              </div>
              <span className="shrink-0 text-[10px] font-bold text-[#8a929c]">340 XP</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 border-b border-[#f0ebe3] bg-[#faf8f4]">
          {DEMO_STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === i;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-0.5 px-0.5 py-2 text-[10px] font-bold transition sm:text-[12px]",
                  active
                    ? "bg-white text-[#ff6a1a] shadow-[inset_0_-2px_0_0_#ff6a1a]"
                    : "text-[#8a929c] hover:text-[#1c2434]",
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="relative min-h-[240px] sm:aspect-[16/10] sm:min-h-[340px]">
          <div key={step} className="learn-step-enter sm:absolute sm:inset-0">
            <div className="sm:h-full">
              <StepView />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
