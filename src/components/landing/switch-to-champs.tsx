"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const tabs = [
  {
    id: "urbanpro",
    letter: "U",
    label: "UrbanPro",
    blurb: "Coins · pay for leads",
    tag: "UrbanPro → Mentr",
    headline: "Same parents reaching out.",
    accent: "Without buying leads.",
    description:
      "No coins. No paying for leads that never reply. No cut. Parents worldwide message you on WhatsApp — contact is always free.",
    letterBg: "bg-coral",
    cta: "Register free",
    ctaHref: "/faculty/signup",
    secondary: "Full faculty flow",
    secondaryHref: "/#faculty-dashboard",
    deltas: [
      { label: "Pay for leads / coins", other: "Yes", champs: "Never" },
      { label: "Cut on sessions", other: "Often", champs: "₹0" },
      { label: "Parent contact", other: "Via platform", champs: "WhatsApp" },
    ],
  },
  {
    id: "agencies",
    letter: "A",
    label: "Tuition agencies",
    blurb: "15–30% cut · middleman",
    tag: "Agencies → Mentr",
    headline: "Same great teachers.",
    accent: "At ₹0 flat.",
    description:
      "Agencies take a cut from every session and own the relationship. Mentr lists faculty free — parents message on WhatsApp, faculty keep every rupee.",
    letterBg: "bg-ink",
    cta: "Find a teacher",
    ctaHref: "/search",
    secondary: "How parents use it",
    secondaryHref: "/#for-parents",
    deltas: [
      { label: "Session cut", other: "15–30%", champs: "₹0" },
      { label: "Who sets the fee", other: "Agency", champs: "Faculty" },
      { label: "Direct WhatsApp", other: "Rarely", champs: "Always" },
    ],
  },
  {
    id: "whatsapp",
    letter: "W",
    label: "WhatsApp groups",
    blurb: "Scroll & hope · no profiles",
    tag: "Groups → Mentr",
    headline: "Organized listings.",
    accent: "Not chaos.",
    description:
      "Group chats bury posts and go stale. Mentr is a searchable directory — subjects, Verified profiles, live availability, one-tap WhatsApp.",
    letterBg: "bg-sage",
    cta: "Browse teachers",
    ctaHref: "/search",
    secondary: "See verification",
    secondaryHref: "/#trust",
    deltas: [
      { label: "Search by subject", other: "Scroll & hope", champs: "Built-in" },
      { label: "Verified profiles", other: "No", champs: "Yes" },
      { label: "Open slots", other: "Outdated", champs: "Live" },
    ],
  },
];

const hardShadow = "shadow-[4px_4px_0_0_#1c1a17]";
const hardShadowSm = "shadow-[3px_3px_0_0_#1c1a17]";

export function SwitchToChamps() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section id="switch" className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        {/* Header — Youform layout */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            <span className="h-px w-5 bg-muted/50" aria-hidden />
            Already using something else?
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[42px] lg:leading-[1.12]">
            Switch to Mentr{" "}
            <span className="text-coral">in one search.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Bring your search over from UrbanPro, tuition agencies, or WhatsApp
            groups — without the coins, cuts, or chaos. Pick your current tool
            to see the deltas.
          </p>
        </div>

        {/* Competitor tabs */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl border-2 bg-white px-3.5 py-3.5 text-left transition-all duration-150",
                  isActive
                    ? cn("border-ink", hardShadowSm)
                    : "border-ink/20 hover:border-ink/40",
                )}
              >
                {isActive && (
                  <span
                    className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-coral"
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white",
                    tab.letterBg,
                  )}
                >
                  {tab.letter}
                </span>
                <span className="min-w-0 pr-3">
                  <span className="block truncate text-sm font-bold text-ink">
                    {tab.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {tab.blurb}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Split comparison card */}
        <div
          className={cn(
            "mt-8 overflow-hidden rounded-2xl border-2 border-ink bg-white lg:grid lg:grid-cols-2",
            hardShadow,
          )}
        >
          {/* Left — story */}
          <div className="flex flex-col justify-between bg-butter p-7 sm:p-9 lg:p-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                {current.tag}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-[32px] sm:leading-[1.15]">
                {current.headline}
                <span className="mt-1 block text-coral">{current.accent}</span>
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">
                {current.description}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={current.ctaHref}
                className={cn(
                  "inline-flex h-11 items-center gap-1.5 rounded-lg border-2 border-ink bg-coral px-5 text-sm font-bold text-white transition hover:bg-coral-dark",
                  hardShadowSm,
                )}
              >
                {current.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={current.secondaryHref}
                className={cn(
                  "inline-flex h-11 items-center rounded-lg border-2 border-ink bg-white px-5 text-sm font-bold text-ink transition hover:bg-cream",
                  hardShadowSm,
                )}
              >
                {current.secondary}
              </Link>
            </div>
          </div>

          {/* Right — deltas */}
          <div className="flex flex-col justify-center border-t-2 border-ink bg-white lg:border-l-2 lg:border-t-0">
            {current.deltas.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "px-7 py-6 sm:px-9 sm:py-7",
                  i < current.deltas.length - 1 && "border-b border-hairline",
                )}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  {row.label}
                </p>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-lg text-muted line-through decoration-muted/50 sm:text-xl">
                    {row.other}
                  </span>
                  <span className="text-xl font-bold text-ink sm:text-2xl">
                    {row.champs}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
