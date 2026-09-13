"use client";

import { LEARN_SIGNUP_HREF, LEARN_TRACKS } from "@/lib/learn-curriculum";
import { cn } from "@/lib/utils";
import { LEARN_SHELL } from "./learn-shell";
import { LearnDino } from "./learn-dino";
import { LearnStartButton } from "./learn-start-button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type CohortId = "3-5" | "6-8" | "9-12";

const COHORTS: { id: CohortId; label: string; live: boolean }[] = [
  { id: "3-5", label: "Class 3–5", live: true },
  { id: "6-8", label: "Class 6–8", live: false },
  { id: "9-12", label: "Class 9–12", live: false },
];

const SUBJECT_ART: Record<string, string> = {
  cs: "/learn/learn-track-cs.png",
  ai: "/learn/learn-track-ai.png",
  math: "/learn/learn-track-math.png",
};

const SUBJECT_BLURB: Record<string, string> = {
  cs: "How computers work, algorithms, and block coding — 20 modules from “What is a computer?” to a first program.",
  ai: "Kids learn where AI shows up, how machines learn, and how to stay safe with it.",
  math: "Binary, logic, grids, and puzzles that line up with CS and AI in the same week.",
};

export function LearnTracksSection() {
  const [cohort, setCohort] = useState<CohortId>("3-5");
  const live = COHORTS.find((c) => c.id === cohort)?.live ?? false;

  return (
    <section id="tracks" className="scroll-mt-20 bg-white py-10 sm:py-16 lg:py-20">
      <div className={LEARN_SHELL}>
        <div className="mx-auto max-w-2xl text-center">
          <LearnDino size={56} action="cheer" className="mx-auto h-12 w-12 sm:h-14 sm:w-14" />
          <p className="mt-2 text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">Three subjects</p>
          <h2 className="mt-1 text-[1.5rem] font-extrabold tracking-tight text-[#1c2434] sm:text-[2.1rem]">
            CS, AI &amp; Math that reinforce each other
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#5a6472] sm:text-[16px]">
            Same ideas from three angles in the same week — not three disconnected subjects. Live now for Class 3–5.
          </p>
        </div>

        <div className="relative mx-auto mt-6 flex max-w-xl items-center justify-center">
          <div className="pointer-events-none absolute inset-x-6 top-1/2 hidden h-px border-t border-dashed border-[#d8d2c8] sm:block" />
          <div className="relative flex w-full justify-center gap-1.5 sm:gap-2">
            {COHORTS.map((c) => {
              const active = cohort === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCohort(c.id)}
                  className={cn(
                    "flex-1 rounded-md px-2 py-2 text-[12px] font-bold transition sm:flex-none sm:px-5 sm:py-2.5 sm:text-[13px]",
                    active ? "bg-[#1c2434] text-white" : "bg-[#f6f4f0] text-[#5a6472]",
                  )}
                >
                  {c.label}
                  {!c.live && (
                    <span className={cn("ml-1 text-[10px]", active ? "text-white/70" : "text-[#8a929c]")}>
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          {live ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {LEARN_TRACKS.map((t) => {
                const moduleCount = t.units.reduce((n, u) => n + u.modules.length, 0);
                return (
                  <article key={t.id} className="overflow-hidden rounded-2xl bg-[#f6f4f0]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#efe6d8]">
                      <Image
                        src={SUBJECT_ART[t.id]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[1.15rem] font-extrabold leading-tight text-[#1c2434]">{t.shortLabel}</h3>
                        <span className="shrink-0 pt-0.5 text-[11px] font-semibold text-[#8a929c]">
                          4 modules · {moduleCount} chapters
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] font-semibold text-[#ff6a1a]">{t.tagline}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a6472] sm:text-[14px]">
                        {SUBJECT_BLURB[t.id]}
                      </p>
                      <Link
                        href="#curriculum"
                        className="mt-4 flex h-11 items-center justify-center gap-2 rounded-md bg-[#1c2434] text-[13px] font-bold text-white hover:bg-[#2a3344]"
                      >
                        Know more
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#f6f4f0] px-5 py-10 text-center sm:py-14">
              <p className="text-lg font-extrabold text-[#1c2434]">
                {cohort === "6-8" ? "Class 6–8" : "Class 9–12"} is next
              </p>
              <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[#5a6472]">
                {cohort === "6-8"
                  ? "Deeper block-to-text coding — same three subjects, next level. Join Class 3–5 now to get early access."
                  : "Exam- and career-oriented CS, AI, and Math. Join free today and we’ll email you when this opens."}
              </p>
              <Link
                href={LEARN_SIGNUP_HREF}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#1c2434] px-6 text-[14px] font-bold text-white"
              >
                Notify me
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <LearnStartButton href={LEARN_SIGNUP_HREF}>
            Get started for free
          </LearnStartButton>
        </div>
      </div>
    </section>
  );
}
