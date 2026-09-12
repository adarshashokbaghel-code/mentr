"use client";

import { LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
import type { LearnLandingCopy } from "@/lib/learn-landing-copy";
import { BookOpen, Flame, ListChecks } from "lucide-react";
import Link from "next/link";
import { LearnDino } from "./learn-dino";
import { LearnStartButton } from "./learn-start-button";

const PERKS = [
  {
    icon: BookOpen,
    label: "60-module syllabus",
    tint: "bg-[#fff4e8] text-[#ff6a1a]",
  },
  {
    icon: ListChecks,
    label: "10 practice + 1 check",
    tint: "bg-[#e6f7f4] text-[#0d9488]",
  },
  {
    icon: Flame,
    label: "Streaks, XP & ranks",
    tint: "bg-[#fff8d6] text-[#d97706]",
  },
] as const;

function renderAccent(accent: string) {
  const parts = accent.split(/(Class 3–5 kids\.?|3–5 kids\.?)/);
  return parts.map((part, i) => {
    if (!part || part === ".") return null;
    if (/^(Class )?3–5 kids\.?$/.test(part)) {
      return (
        <span key={i} className="text-[#1c2434]">
          {part.replace(/\.$/, "")}.
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function LearnHeroContent({ copy }: { copy: LearnLandingCopy }) {
  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:gap-7">
      {copy.heroEyebrow ? (
        <div className="learn-hero-reveal">
          <span className="rounded-md bg-[#fff4e8] px-3 py-1.5 text-[13px] font-semibold text-[#ff6a1a]">
            {copy.heroEyebrow}
          </span>
        </div>
      ) : null}

      <div className="learn-hero-reveal learn-hero-reveal-delay-1 flex items-start gap-3 sm:gap-4">
        <LearnDino
          size={64}
          action="blink"
          className="mt-0.5 h-10 w-10 shrink-0 sm:mt-1 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
        />
        <h1 className="min-w-0 text-balance text-[1.45rem] font-extrabold leading-[1.18] tracking-tight break-words text-[#1c2434] sm:text-[2.35rem] lg:text-[2.75rem]">
          {copy.heroTitle}{" "}
          <span className="text-[#ff6a1a]">{renderAccent(copy.heroAccent)}</span>
        </h1>
      </div>

      <p className="learn-hero-reveal learn-hero-reveal-delay-2 max-w-xl text-[14px] leading-relaxed text-[#5a6472] sm:text-[17px]">
        {copy.heroSub}
      </p>

      <div className="learn-hero-reveal learn-hero-reveal-delay-2 grid grid-cols-3 gap-2 sm:gap-3">
        {PERKS.map(({ icon: Icon, label, tint }) => (
          <div
            key={label}
            className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-[#efe6d8] bg-white px-2.5 py-2 sm:gap-2.5 sm:px-3 sm:py-2.5"
          >
            <div className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md sm:h-8 sm:w-8 ${tint}`}>
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
            </div>
            <p className="min-w-0 text-[11px] font-bold leading-tight text-[#1c2434] sm:text-[13px]">{label}</p>
          </div>
        ))}
      </div>

      <div className="learn-hero-reveal learn-hero-reveal-delay-3 flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <LearnStartButton href={LEARN_SIGNUP_HREF} className="w-full sm:w-auto">
          Get started for free
        </LearnStartButton>
        <Link
          href="#curriculum"
          className="inline-flex h-11 w-full items-center justify-center rounded-md border border-[#e4dccf] bg-white px-6 text-[14px] font-bold text-[#1c2434] sm:h-[50px] sm:w-auto sm:text-[15px]"
        >
          See modules
        </Link>
      </div>
    </div>
  );
}
