"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { learnCopyFor, type LearnGeo } from "@/lib/learn-landing-copy";
import { LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Cpu,
  CalendarDays,
  ListChecks,
  Mail,
  Play,
  Sparkles,
  Trophy,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LearnAnimatedHero } from "./learn-animated-hero";
import { LearnGuidePopup } from "./learn-guide-popup";
import { LearnHeroContent } from "./learn-hero-content";
import { LearnStatsSlider } from "./learn-stats-slider";
import { LEARN_SHELL } from "./learn-shell";
import { LearnLeadersSection } from "./learn-leaders-section";
import { LearnTracksSection } from "./learn-tracks-section";
import { LearnChooseSection } from "./learn-choose-section";
import { LearnWhySection } from "./learn-why-section";
import { LearnGamificationSection } from "./learn-gamification-section";
import { LearnSyllabusSection } from "./learn-syllabus-section";
import {
  hardShadowSm,
  LpFinalCta,
  LpStepTimeline,
  SectionHeader,
} from "./shared";
import { LearnStartButton } from "./learn-start-button";

const LEARNING_STEPS = [
  {
    title: "Watch",
    desc: "Short narrated videos — 3 to 6 minutes, ramping by unit.",
    icon: Video,
  },
  {
    title: "Practice",
    desc: "10 Play Arena questions on today’s idea — instant feedback.",
    icon: ListChecks,
  },
  {
    title: "Progress check",
    desc: "1 assessment question that marks the module done.",
    icon: BookOpen,
  },
  {
    title: "Boss Challenge",
    desc: "Every 5 modules — a bigger game or mini-project for the unit.",
    icon: Trophy,
  },
];

function LoopStepMock({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border-[3px] border-ink bg-ink shadow-[5px_5px_0_0_#1c1a17]">
        <div className="relative aspect-video bg-gradient-to-br from-coral-wash via-lavender/30 to-sage-wash">
          <div className="learn-video-scan pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="learn-play-pulse flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink bg-coral text-white">
              <Play className="h-7 w-7 fill-current" />
            </div>
            <p className="mt-3 text-sm font-bold text-ink">What Is a Computer?</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-2 pt-5">
            <div className="h-1.5 overflow-hidden rounded-full bg-ink/15">
              <div className="learn-video-progress h-full rounded-full bg-coral" />
            </div>
            <p className="mt-1 text-[10px] font-bold text-muted">3 min · narrated · +10 XP</p>
          </div>
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="rounded-xl border-2 border-ink bg-white p-4">
        <p className="text-sm font-bold text-ink">Which is an INPUT device?</p>
        <ul className="mt-3 space-y-2">
          {["Keyboard ✓", "Monitor", "Speaker"].map((o, i) => (
            <li
              key={o}
              className={cn(
                "rounded-lg border-2 px-3 py-2 text-sm font-medium",
                i === 0 ? "border-sage bg-sage-wash text-sage" : "border-hairline text-muted",
              )}
            >
              {o}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="rounded-xl border-2 border-ink bg-butter/40 p-4">
        <p className="text-[10px] font-bold uppercase text-coral">Progress check</p>
        <p className="mt-2 text-sm font-bold text-ink">
          Is a speaker input or output? Explain in one sentence.
        </p>
        <p className="mt-2 text-xs text-muted">1 question · marks the module done</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border-2 border-ink bg-lavender p-4 text-center">
      <Trophy className="mx-auto h-10 w-10 text-ink" />
      <p className="mt-2 text-sm font-bold text-ink">Build-a-Computer</p>
      <p className="text-xs text-muted">Boss Challenge · Unit 1</p>
    </div>
  );
}

function LearnLoggedInBanner() {
  const { user, loading } = useAuth();
  if (loading || !user || user.role !== "parent") return null;
  return (
    <div className="border-b-2 border-sage/30 bg-sage-wash px-4 py-3 sm:px-6">
      <div className={cn(LEARN_SHELL, "flex flex-wrap items-center justify-between gap-3")}>
        <p className="text-sm font-medium text-ink">
          <strong>You&apos;re on the list</strong> — Mentr Learn launches soon. We&apos;ll email you
          when Module 1 is live.
        </p>
        <Link href="/parent/dashboard" className="text-sm font-bold text-coral hover:underline">
          Parent dashboard →
        </Link>
      </div>
    </div>
  );
}

export function LearnLanding({ geo }: { geo: LearnGeo }) {
  const copy = learnCopyFor(geo);
  const [loopStep, setLoopStep] = useState(0);

  const stats = [
    {
      value: "60",
      label: "Modules",
      tint: "bg-lavender",
      icon: BookOpen,
      sub: copy.statsSub,
    },
    {
      value: "3",
      label: "Tracks",
      tint: "bg-coral-wash",
      icon: Cpu,
      sub: "CS · AI · Math",
    },
    {
      value: "₹0",
      label: "Forever free",
      tint: "bg-butter/60",
      icon: Sparkles,
      sub: "Launch cohort",
    },
    {
      value: "4.5h",
      label: "Core video",
      tint: "bg-sage-wash",
      icon: Video,
      sub: "Narrated · Class 3–5",
    },
    {
      value: "600+",
      label: "Practice questions",
      tint: "bg-coral-wash",
      icon: ListChecks,
      sub: "10 after every lesson",
    },
    {
      value: "Daily",
      label: "POTDs",
      tint: "bg-sage-wash",
      icon: CalendarDays,
      sub: "Problem of the Day · +5 XP",
    },
    {
      value: "12",
      label: "Boss challenges",
      tint: "bg-lavender",
      icon: Trophy,
      sub: "One after every 5 modules",
    },
    {
      value: "Weekly",
      label: "Parent reports",
      tint: "bg-butter/60",
      icon: Mail,
      sub: "Weekly email progress summary",
    },
  ];

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-butter/25 via-cream to-cream">
      <LearnGuidePopup />
      <LearnLoggedInBanner />

      {/* Hero — light HackerKid-style ed-tech */}
      <section className="learn-hk-hero relative overflow-hidden">
        <div className="relative mx-auto grid w-full min-w-0 max-w-[1400px] items-center gap-6 px-4 py-10 sm:gap-8 sm:px-5 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,540px)] lg:gap-8 lg:px-6 lg:py-20 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,580px)]">
          <LearnHeroContent copy={copy} />
          <LearnAnimatedHero />
        </div>
      </section>

      <LearnStatsSlider stats={stats} />

      <LearnChooseSection />

      <LearnWhySection />

      <LearnTracksSection />

      <LearnLeadersSection />

      {/* Learning loop */}
      <section className="border-y border-hairline bg-cream py-10 sm:py-16 lg:py-20">
        <div className={cn(LEARN_SHELL, "grid gap-8 lg:grid-cols-2")}>
          <div>
            <SectionHeader
              align="left"
              eyebrow="Every module"
              title="Watch → Practice → Check"
              accent="→ Boss."
            />
            <div className="mt-6">
              <LpStepTimeline
                steps={LEARNING_STEPS}
                activeIndex={loopStep}
                onSelect={setLoopStep}
                accent="sage"
              />
            </div>
        
          </div>
          <LoopStepMock step={loopStep} />
        </div>
      </section>

      <LearnGamificationSection />

      <LearnSyllabusSection />

      {/* FAQ */}
      <section className={cn(LEARN_SHELL, "py-10 sm:py-16 lg:py-20")}>
        <SectionHeader eyebrow="FAQ" title="Common questions" />
        <dl className="mt-8 space-y-6">
          {copy.faqs.map((faq) => (
            <div
              key={faq.question}
              className={cn("rounded-xl border-2 border-ink/10 bg-white p-5", hardShadowSm)}
            >
              <dt className="font-bold text-ink">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <LpFinalCta
        innerClassName={LEARN_SHELL + " max-w-[1400px]"}
        eyebrow="Mentr Learn"
        title="Start Mentr Learn free today"
        description="Class 3–5 · 60 modules · CS, AI & Math. Preview free — parent account saves progress."
        primaryLabel="Get started for free"
        primaryHref={LEARN_SIGNUP_HREF}
        primarySlot={<LearnStartButton href={LEARN_SIGNUP_HREF}>Get started for free</LearnStartButton>}
        secondaryLabel="Find a tutor"
        secondaryHref="/parents"
        perks={["₹0 forever", "Weekly parent reports", "Mentr Junior Graduate certificate"]}
      />
    </div>
  );
}
