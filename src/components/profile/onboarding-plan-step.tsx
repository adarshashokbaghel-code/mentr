"use client";

import { cn } from "@/lib/utils";
import { Check, Crown, Sparkles } from "lucide-react";

export type OnboardingPlanId = "free" | "premium";

const FREE_PERKS = [
  "Live mentor profile in parent search",
  "Parents contact you at no cost to them",
  "Requirements board · 3 pitches / day",
  "Unlimited accepts · WhatsApp after connect",
  "Keep 100% of tutoring fees",
];

const PREMIUM_PERKS = [
  "Unlimited board pitches every day",
  "3 parent contact unlocks / day",
  "Featured on the Mentr landing page",
  "Premium badge + dedicated human SPOC",
  "Everything in Free, plus reach tools",
];

type Props = {
  selected: OnboardingPlanId | null;
  onSelect: (plan: OnboardingPlanId) => void;
  disabled?: boolean;
};

export function OnboardingPlanStep({ selected, onSelect, disabled }: Props) {
  return (
    <div className="mx-auto mt-5 w-full max-w-[720px] space-y-4">
      <div className="rounded-xl border border-hairline bg-white px-4 py-3.5 sm:px-5">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          <Sparkles className="h-4 w-4 shrink-0 text-coral" />
          Almost there — pick how you start
        </p>
        <p className="mt-1 text-[13px] leading-snug text-muted">
          Upgrade or renew Premium anytime from your dashboard. Free stays free
          forever.
        </p>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5">
        {/* Free — light */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect("free")}
          aria-pressed={selected === "free"}
          className={cn(
            "group flex min-h-[420px] w-full flex-col rounded-2xl border bg-white p-4 text-left transition sm:min-h-[480px] sm:p-6",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
            "disabled:opacity-60",
            selected === "free"
              ? "border-ink/40 shadow-[0_0_0_1px_rgba(26,35,28,0.12)]"
              : "border-hairline hover:border-ink/25",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                Classic
              </p>
              <p className="mt-1 text-lg font-bold tracking-tight text-ink sm:text-xl">
                Free
              </p>
            </div>
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
                selected === "free"
                  ? "border-ink bg-ink text-white"
                  : "border-hairline bg-cream text-transparent",
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              $0
            </span>
            <span className="text-sm font-semibold text-muted">forever</span>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-muted sm:text-[13px]">
            No card. Core mentoring stays free.
          </p>

          <div className="my-5 h-px w-full bg-hairline sm:my-6" />

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            Included
          </p>
          <ul className="mt-3 flex flex-1 flex-col gap-2.5 sm:gap-3">
            {FREE_PERKS.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-[12px] leading-snug text-muted sm:text-[13px]"
              >
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </button>

        {/* Premium — highlighted */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect("premium")}
          aria-pressed={selected === "premium"}
          className={cn(
            "group relative flex min-h-[420px] w-full flex-col overflow-hidden rounded-2xl border-2 p-4 text-left transition sm:min-h-[480px] sm:p-6",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter/60",
            "disabled:opacity-60",
            selected === "premium"
              ? "border-ink bg-ink text-white shadow-[4px_4px_0_0_#2f9e6e]"
              : "border-ink bg-ink text-white shadow-[3px_3px_0_0_rgba(47,158,110,0.55)] hover:shadow-[4px_4px_0_0_#2f9e6e]",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-sage/25 blur-3xl"
          />
          <div className="relative flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-butter">
                  <Crown className="h-3.5 w-3.5" />
                  Premium
                </p>
                <span className="rounded border border-butter bg-butter px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink">
                  Recommended
                </span>
              </div>
              <p className="mt-1 text-lg font-bold tracking-tight sm:text-xl">
                Premium
              </p>
            </div>
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
                selected === "premium"
                  ? "border-butter bg-butter text-ink"
                  : "border-white/35 bg-transparent text-transparent",
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          </div>

          <div className="relative mt-5 flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-4xl font-bold tracking-tight sm:text-5xl">
              $5
            </span>
            <span className="text-sm font-semibold text-white/55">/mo</span>
          </div>
          <p className="relative mt-2 text-[12px] leading-snug text-white/55 sm:text-[13px]">
            Billed in INR · pick 2–4 months at checkout
          </p>

          <div className="relative my-5 h-px w-full bg-white/15 sm:my-6" />

          <p className="relative text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
            Included
          </p>
          <ul className="relative mt-3 flex flex-1 flex-col gap-2.5 sm:gap-3">
            {PREMIUM_PERKS.map((line) => (
              <li
                key={line}
                className="flex gap-2 text-[12px] leading-snug text-white/80 sm:text-[13px]"
              >
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-butter" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </button>
      </div>

      <p className="text-center text-[11.5px] leading-snug text-muted">
        No commission on either plan. Renew Premium anytime from your dashboard.
      </p>
    </div>
  );
}
