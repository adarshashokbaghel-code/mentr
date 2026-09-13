"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import {
  SAMPLE_MCQ,
  getModuleById,
  getTrackForModule,
} from "@/lib/learn-curriculum";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Cpu,
  Gamepad2,
  Keyboard,
  Monitor,
  Play,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Stage = "watch" | "quiz" | "play";

const STAGES: { id: Stage; label: string; icon: typeof Play }[] = [
  { id: "watch", label: "Watch", icon: Play },
  { id: "quiz", label: "Quiz", icon: BookOpen },
  { id: "play", label: "Play", icon: Gamepad2 },
];

function WatchStage({ onDone }: { onDone: () => void }) {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-[#1c2434] bg-[#0e131b] shadow-[4px_4px_0_0_#ff6a1a]">
      <div className="relative aspect-[16/10] sm:aspect-video">
        <Image
          src="/learn/demo/learn-demo-watch-scene.png"
          alt=""
          fill
          className="object-cover opacity-90"
          sizes="(max-width: 768px) 100vw, 720px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e131b] via-[#0e131b]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            <Volume2 className="h-3.5 w-3.5" /> Narrated
          </span>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { icon: Keyboard, label: "Input" },
              { icon: Cpu, label: "Process" },
              { icon: Monitor, label: "Output" },
            ].map((b) => (
              <div
                key={b.label}
                className="rounded-xl border border-white/15 bg-white/10 px-2 py-2.5 text-center backdrop-blur"
              >
                <b.icon className="mx-auto h-4 w-4 text-[#ffb27a]" />
                <p className="mt-1 text-[11px] font-bold text-white">{b.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-black/40 px-3 py-2 text-[13px] font-medium text-white/90">
            A computer takes input, thinks with a processor, then shows output.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#0a0e14] px-4 py-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-[72%] rounded-full bg-[#ff6a1a]" />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[12px] font-semibold text-white/50">
            1:08 / 3:00
          </span>
          <button
            type="button"
            onClick={onDone}
            className="rounded-2xl bg-[#ff6a1a] px-4 py-2.5 text-[14px] font-extrabold text-white"
          >
            Finish · +10 XP
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizStage({ onDone }: { onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === SAMPLE_MCQ.correct;

  return (
    <div className="rounded-3xl border-2 border-[#1c2434] bg-white p-4 shadow-[4px_4px_0_0_#0d9488] sm:p-6">
      <p className="text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">
        Quiz · Question 1
      </p>
      <p className="mt-3 text-[1.15rem] font-extrabold leading-snug text-[#1c2434] sm:text-[1.25rem]">
        {SAMPLE_MCQ.question}
      </p>
      <ul className="mt-5 space-y-2.5">
        {SAMPLE_MCQ.options.map((opt, i) => {
          const selected = picked === i;
          const isRight = i === SAMPLE_MCQ.correct;
          return (
            <li key={opt}>
              <button
                type="button"
                disabled={picked !== null}
                onClick={() => setPicked(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-[15px] font-bold transition",
                  picked === null && "border-[#e8e2d8] bg-[#faf8f4] hover:border-[#1c2434]",
                  selected && isRight && "border-[#0d9488] bg-[#e6f7f4] text-[#0d9488]",
                  selected && !isRight && "border-coral bg-[#fff4e8] text-[#c2410c]",
                  picked !== null && !selected && isRight && "border-[#0d9488] bg-[#e6f7f4]",
                  picked !== null && !selected && !isRight && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[13px] font-extrabold",
                    selected && isRight
                      ? "bg-[#0d9488] text-white"
                      : "bg-white text-[#8a929c]",
                  )}
                >
                  {selected && isRight ? (
                    <Check className="h-4 w-4" strokeWidth={2.75} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null ? (
        <div className="mt-4 space-y-3">
          <p
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-[13px] font-semibold",
              correct
                ? "bg-[#e6f7f4] text-[#0d9488]"
                : "bg-[#fff4e8] text-[#c2410c]",
            )}
          >
            {correct ? "Nice!" : "Almost — "}
            {SAMPLE_MCQ.explanation}
          </p>
          <button
            type="button"
            onClick={onDone}
            className="w-full rounded-2xl bg-[#1c2434] py-3 text-[15px] font-extrabold text-white"
          >
            Next: Play
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PlayStage({ onDone }: { onDone: () => void }) {
  const slots = [
    { label: "Input", filled: "Keyboard", tint: "bg-[#fff4e8] text-[#ff6a1a]" },
    { label: "Process", filled: "CPU", tint: "bg-[#e6f7f4] text-[#0d9488]" },
    { label: "Output", filled: "Screen", tint: "bg-[#eef2ff] text-[#4f46e5]" },
  ];

  return (
    <div className="rounded-3xl border-2 border-[#1c2434] bg-white p-4 shadow-[4px_4px_0_0_#4f46e5] sm:p-6">
      <p className="text-[12px] font-bold uppercase tracking-wider text-[#0d9488]">
        Play Arena
      </p>
      <p className="mt-2 text-[1.15rem] font-extrabold text-[#1c2434]">
        Match each part to its job
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {slots.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-dashed border-[#d5cfc4] bg-[#faf8f4] p-2.5 text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a929c]">
              {s.label}
            </p>
            <span
              className={cn(
                "mt-2 flex items-center justify-center rounded-xl px-1 py-2 text-[12px] font-extrabold sm:text-[13px]",
                s.tint,
              )}
            >
              {s.filled}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[14px] font-bold text-[#0d9488]">
        3 / 3 matched · +5 XP
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-4 w-full rounded-2xl bg-[#ff6a1a] py-3 text-[15px] font-extrabold text-white"
      >
        Finish lesson
      </button>
    </div>
  );
}

function DoneStage() {
  return (
    <div className="rounded-3xl border-2 border-[#1c2434] bg-white p-6 text-center shadow-[4px_4px_0_0_#ff6a1a]">
      <LearnDino size={72} action="cheer" className="mx-auto h-16 w-16" />
      <h2 className="mt-4 text-[1.5rem] font-extrabold text-[#1c2434]">
        Module complete!
      </h2>
      <p className="mt-2 text-[14px] font-medium text-[#8a929c]">
        You earned +15 XP. Come back tomorrow for A2.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href="/learn/app"
          className="rounded-2xl bg-[#1c2434] px-5 py-3 text-[15px] font-extrabold text-white"
        >
          Back home
        </Link>
        <Link
          href="/learn/app/path"
          className="rounded-2xl border-2 border-[#1c2434] bg-white px-5 py-3 text-[15px] font-extrabold text-[#1c2434]"
        >
          See path
        </Link>
      </div>
    </div>
  );
}

export function LmsLesson({ moduleId }: { moduleId: string }) {
  const mod = useMemo(() => getModuleById(moduleId), [moduleId]);
  const track = useMemo(() => getTrackForModule(moduleId), [moduleId]);
  const [stage, setStage] = useState<Stage | "done">("watch");

  if (!mod) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[16px] font-extrabold text-[#1c2434]">
          Lesson not found
        </p>
        <Link href="/learn/app" className="font-bold text-[#ff6a1a]">
          ← Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <Link
          href="/learn/app"
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1c2434] ring-1 ring-[#e8e2d8]"
          aria-label="Back home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-[#ff6a1a]">
            {mod.id}
            {track ? ` · ${track.shortLabel}` : ""}
          </p>
          <h1 className="text-[1.35rem] font-extrabold leading-tight text-[#1c2434] sm:text-[1.5rem]">
            {mod.title}
          </h1>
        </div>
      </div>

      {stage !== "done" ? (
        <div className="grid grid-cols-3 gap-2">
          {STAGES.map((s) => {
            const Icon = s.icon;
            const active = stage === s.id;
            const done =
              (s.id === "watch" && (stage === "quiz" || stage === "play")) ||
              (s.id === "quiz" && stage === "play");
            return (
              <div
                key={s.id}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 text-[12px] font-extrabold sm:text-[13px]",
                  active && "bg-[#fff4e8] text-[#ff6a1a]",
                  done && !active && "bg-[#e6f7f4] text-[#0d9488]",
                  !active && !done && "bg-white text-[#8a929c] ring-1 ring-[#e8e2d8]",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {s.label}
              </div>
            );
          })}
        </div>
      ) : null}

      {stage === "watch" ? (
        <WatchStage onDone={() => setStage("quiz")} />
      ) : null}
      {stage === "quiz" ? (
        <QuizStage onDone={() => setStage("play")} />
      ) : null}
      {stage === "play" ? (
        <PlayStage onDone={() => setStage("done")} />
      ) : null}
      {stage === "done" ? <DoneStage /> : null}
    </div>
  );
}
