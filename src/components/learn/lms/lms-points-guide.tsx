"use client";

import {
  LEARN_POINTS_RULES,
  type LearnPointsRule,
} from "@/lib/learn-points";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Flame,
  Gamepad2,
  Library,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";

function toneClass(tone: LearnPointsRule["tone"]) {
  switch (tone) {
    case "earn":
      return "bg-[#e6f7f4] text-[#0d9488]";
    case "lose":
      return "bg-[#fff4e8] text-[#c2410c]";
    case "bonus":
      return "bg-[#fff8d6] text-[#b45309]";
    case "soon":
      return "bg-[#f3f0ea] text-[#8a929c]";
  }
}

function RuleRow({ rule }: { rule: LearnPointsRule }) {
  return (
    <li className="flex items-start gap-2.5 rounded-xl border border-[#f0ebe3] bg-[#faf8f4] px-2.5 py-2.5">
      <span
        className={cn(
          "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-extrabold tabular-nums",
          toneClass(rule.tone),
        )}
      >
        {rule.points}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-extrabold text-[#1c2434]">{rule.title}</p>
        <p className="mt-0.5 text-[11px] font-medium leading-snug text-[#8a929c]">
          {rule.detail}
        </p>
      </div>
    </li>
  );
}

/** Full guide for Progress page — parents & students. */
export function LmsPointsGuide({ className }: { className?: string }) {
  const now = LEARN_POINTS_RULES.filter((r) => r.group === "now");
  const streak = LEARN_POINTS_RULES.filter((r) => r.group === "streak");
  const soon = LEARN_POINTS_RULES.filter((r) => r.group === "soon");

  return (
    <section
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#1c2434] bg-white shadow-[3px_3px_0_0_#ff6a1a]",
        className,
      )}
    >
      <div className="border-b border-[#f0ebe3] bg-[#fff4e8] px-4 py-3.5 sm:px-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#ff6a1a]">
            <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </span>
          <div>
            <h2 className="text-[15px] font-extrabold text-[#1c2434]">
              How points work
            </h2>
            <p className="mt-1 text-[12px] font-medium leading-snug text-[#5a6472]">
              <span className="font-extrabold text-[#ff6a1a]">1 point = 1 XP</span>
              . Cohort ranks by total points. Wrong quiz answers cost a little.
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3.5 sm:p-4">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0d9488]">
            <CalendarCheck className="h-3.5 w-3.5" />
            Everyday
          </p>
          <ul className="space-y-1.5">
            {now.map((rule) => (
              <RuleRow key={rule.id} rule={rule} />
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
            <Flame className="h-3.5 w-3.5" />
            Streak bonuses
          </p>
          <ul className="space-y-1.5">
            {streak.map((rule) => (
              <RuleRow key={rule.id} rule={rule} />
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8a929c]">
            <Gamepad2 className="h-3.5 w-3.5" />
            Coming soon
          </p>
          <ul className="space-y-1.5">
            {soon.map((rule) => (
              <RuleRow key={rule.id} rule={rule} />
            ))}
          </ul>
          <p className="mt-2 flex items-start gap-1.5 text-[10px] font-medium text-[#8a929c]">
            <Library className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Practice bank is live · Play arena coming soon — same points → XP flow.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-[#f0ebe3] bg-[#faf8f4] px-3.5 py-2.5 sm:px-4">
        <Trophy className="h-3.5 w-3.5 shrink-0 text-[#ff6a1a]" />
        <p className="text-[11px] font-semibold text-[#5a6472]">
          Example: POTD (+1) + sign-in (+0.5) ={" "}
          <span className="font-extrabold text-[#1c2434]">1.5 XP</span>
        </p>
      </div>
    </section>
  );
}

/** Compact home teaser linking to full guide. */
export function LmsPointsTeaser() {
  return (
    <Link
      href="/learn/app/progress#points"
      className="block rounded-3xl border border-[#e8e2d8] bg-white p-5 transition hover:border-[#1c2434] sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#ff6a1a]">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-extrabold text-[#1c2434]">
            Points & XP
          </h2>
          <p className="mt-1 text-[13px] font-medium text-[#8a929c]">
            1 point = 1 XP. POTD +1 · quiz +1 / −0.5 · daily +0.5 · streak
            bonuses at 7 / 15 / 30 days.
          </p>
          <p className="mt-3 text-[12px] font-extrabold text-[#ff6a1a]">
            See full guide →
          </p>
        </div>
      </div>
    </Link>
  );
}
