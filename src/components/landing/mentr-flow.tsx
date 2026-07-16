"use client";

import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  MessageCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Role = "parents" | "mentors";

const hardShadow = "shadow-[4px_4px_0_0_#1c1a17]";
const hardShadowSm = "shadow-[3px_3px_0_0_#1c1a17]";

const tabs: {
  id: Role;
  letter: string;
  label: string;
  blurb: string;
  letterBg: string;
}[] = [
  {
    id: "parents",
    letter: "P",
    label: "Parents & students",
    blurb: "Search or post · pick · connect",
    letterBg: "bg-coral",
  },
  {
    id: "mentors",
    letter: "M",
    label: "Mentors",
    blurb: "List · pitch · approve · keep 100%",
    letterBg: "bg-sage",
  },
];

const content: Record<
  Role,
  {
    tag: string;
    headline: string;
    accent: string;
    description: string;
    steps: { title: string; desc: string }[];
    deltas: { label: string; other: string; champs: string }[];
    cta: string;
    ctaHref: string;
    secondary: string;
    secondaryHref: string;
  }
> = {
  parents: {
    tag: "Parents & students → Mentr",
    headline: "Search a tutor or post your need.",
    accent: "Pitches, connect, WhatsApp — free.",
    description:
      "Two free paths: search verified tutors by subject and send a connect request, or post your requirement on the board and let tutors pitch you. Your identity stays hidden until you accept. WhatsApp unlocks only then — no agents, no fees.",
    steps: [
      {
        title: "Search or post your requirement",
        desc: "Browse the directory, or post subject, class, area & budget anonymously.",
      },
      {
        title: "Compare options",
        desc: "Profiles with slots & credentials, or tutor pitches explaining their fit.",
      },
      {
        title: "Connect with who you like",
        desc: "Send a connect request or accept a pitch — still your choice.",
      },
      {
        title: "They accept → WhatsApp unlocks",
        desc: "Numbers stay private until the tutor accepts. Then chat directly.",
      },
      {
        title: "Arrange everything yourselves",
        desc: "Timing, fees, home or online — Mentr stays out of it. ₹0 forever.",
      },
    ],
    deltas: [
      { label: "Cost to parents", other: "Agent commissions", champs: "₹0" },
      { label: "Ways to find a tutor", other: "Search only", champs: "Search + board" },
      { label: "Middlemen involved", other: "Always", champs: "None" },
    ],
    cta: "Find a teacher",
    ctaHref: "/search",
    secondary: "Post a requirement",
    secondaryHref: "/parent/signup",
  },
  mentors: {
    tag: "Mentors → Mentr",
    headline: "Get found by parents.",
    accent: "Search listings & board pitches.",
    description:
      "List free with subjects, slots and credentials. Parents find you in search or post needs on the requirements board — pitch with your profile, they accept who they like. Your number stays private until you approve. Every rupee stays yours.",
    steps: [
      {
        title: "Create your free listing",
        desc: "Subjects, areas, weekly slots — live in minutes.",
      },
      {
        title: "Get requests two ways",
        desc: "Connect requests from search, or pitch open parent posts on the board.",
      },
      {
        title: "Review before you share",
        desc: "Every request or pitch acceptance comes with the parent's note.",
      },
      {
        title: "Accept → chat on WhatsApp",
        desc: "Your number is shared only then. You keep 100% of fees.",
      },
    ],
    deltas: [
      { label: "Cost to list", other: "₹5,000+/yr", champs: "₹0" },
      { label: "Commission on fees", other: "15–30%", champs: "0%" },
      { label: "Who sees your number", other: "Everyone", champs: "Accepted only" },
    ],
    cta: "Create free listing",
    ctaHref: "/faculty/signup",
    secondary: "Faculty login",
    secondaryHref: "/faculty",
  },
};

export function MentrFlow() {
  const [role, setRole] = useState<Role>("parents");
  const c = content[role];

  return (
    <section id="how-mentr-works" className="bg-white py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        {/* Header — matches "Switch to Mentr" */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            <span className="h-px w-5 bg-muted/50" aria-hidden />
            How Mentr works
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[42px] lg:leading-[1.12]">
            One flow. <span className="text-coral">Both sides win.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Parents search tutors directly or post requirements and review
            pitches — faculty list, pitch, and approve who connects. Numbers
            stay private until a mentor accepts.
          </p>
        </div>

        {/* Role tabs */}
        <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
          {tabs.map((tab) => {
            const isActive = role === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRole(tab.id)}
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

        {/* Split flow card */}
        <div
          className={cn(
            "mt-8 overflow-hidden rounded-2xl border-2 border-ink bg-white lg:grid lg:grid-cols-2",
            hardShadow,
          )}
        >
          {/* Left — story + steps */}
          <div
            className={cn(
              "flex flex-col justify-between p-7 sm:p-9 lg:p-10",
              role === "parents" ? "bg-butter" : "bg-lavender",
            )}
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                {c.tag}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-[32px] sm:leading-[1.15]">
                {c.headline}
                <span className="mt-1 block text-coral">{c.accent}</span>
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">
                {c.description}
              </p>

              <ol className="mt-7">
                {c.steps.map((step, i) => (
                  <li
                    key={step.title}
                    className="relative flex gap-3.5 pb-5 last:pb-0"
                  >
                    {i < c.steps.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[15px] top-9 h-[calc(100%-36px)] w-0.5 bg-ink/20"
                      />
                    )}
                    <span
                      className={cn(
                        "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-white text-xs font-bold text-ink",
                        "shadow-[2px_2px_0_0_#1c1a17]",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="pt-0.5">
                      <p className="text-sm font-bold text-ink">{step.title}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-ink/70">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={c.ctaHref}
                className={cn(
                  "inline-flex h-11 items-center gap-1.5 rounded-lg border-2 border-ink bg-coral px-5 text-sm font-bold text-white transition hover:bg-coral-dark",
                  hardShadowSm,
                )}
              >
                {c.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={c.secondaryHref}
                className={cn(
                  "inline-flex h-11 items-center rounded-lg border-2 border-ink bg-white px-5 text-sm font-bold text-ink transition hover:bg-cream",
                  hardShadowSm,
                )}
              >
                {c.secondary}
              </Link>
            </div>
          </div>

          {/* Right — product mock + deltas */}
          <div className="flex flex-col border-t-2 border-ink bg-white lg:border-l-2 lg:border-t-0">
            <div className="flex flex-1 items-center bg-cream-band/60 p-6 sm:p-8">
              {role === "parents" ? <ParentMock /> : <MentorMock />}
            </div>
            <div className="border-t-2 border-ink">
              {c.deltas.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-6 py-4 sm:px-8",
                    i < c.deltas.length - 1 && "border-b border-hairline",
                  )}
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                    {row.label}
                  </p>
                  <p className="flex items-baseline gap-x-3">
                    <span className="text-base text-muted line-through decoration-muted/50">
                      {row.other}
                    </span>
                    <span className="text-lg font-bold text-ink sm:text-xl">
                      {row.champs}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Product mocks                                                       */
/* ------------------------------------------------------------------ */

function MockShell({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border-2 border-ink bg-white",
        hardShadowSm,
      )}
    >
      <div className="flex items-center gap-2 border-b-2 border-ink bg-cream px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full border border-ink/40 bg-coral" />
        <span className="h-2.5 w-2.5 rounded-full border border-ink/40 bg-butter-deep" />
        <span className="h-2.5 w-2.5 rounded-full border border-ink/40 bg-sage" />
        <span className="ml-2 truncate text-[11px] font-bold text-muted">
          {url}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ParentMock() {
  return (
    <MockShell url="mentr.in / teachers / priya-nair">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink bg-lavender text-sm font-bold text-ink">
          PN
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
            Priya Nair
            <BadgeCheck className="h-4 w-4 text-sage" />
          </p>
          <p className="text-xs font-medium text-muted">
            Mathematics · Class 9–12 · Koramangala
          </p>
        </div>
        <span className="rounded-md border border-ink/20 bg-sage-wash px-2 py-1 text-[10px] font-bold text-sage">
          3 open slots
        </span>
      </div>

      <div className="mt-3.5 rounded-lg border-2 border-ink/15 bg-cream p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
          Your message · required
        </p>
        <p className="mt-1.5 text-[13px] font-medium leading-snug text-ink">
          Hi Priya, looking for Class 10 maths for my daughter — weekends,
          near HSR. Board exam focus.
        </p>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted">98/500</span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border-2 border-ink bg-coral px-3 py-1.5 text-[11px] font-bold text-white",
              "shadow-[2px_2px_0_0_#1c1a17]",
            )}
          >
            <Send className="h-3 w-3" />
            Send connect request
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2.5 rounded-lg border-2 border-ink/15 bg-butter/60 px-3 py-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-white">
            <Check className="h-3.5 w-3.5 text-ink" />
          </span>
          <p className="text-xs font-bold text-ink">
            Request sent{" "}
            <span className="font-medium text-ink/60">
              — Priya is reviewing your note
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border-2 border-ink bg-sage-wash px-3 py-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-sage">
            <MessageCircle className="h-3.5 w-3.5 text-white" />
          </span>
          <p className="text-xs font-bold text-ink">
            Accepted! WhatsApp unlocked —{" "}
            <span className="font-bold text-sage">+91 98•••• ••41</span>
          </p>
        </div>
      </div>
    </MockShell>
  );
}

function MentorMock() {
  return (
    <MockShell url="mentr.in / dashboard / requests">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-ink">Connection requests</p>
        <span className="rounded-md border border-ink/20 bg-coral-wash px-2 py-1 text-[10px] font-bold text-coral">
          2 new
        </span>
      </div>

      <div className="mt-3 rounded-lg border-2 border-ink/15 bg-cream p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-sky text-xs font-bold text-ink">
            RK
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-ink">Rohit Kulkarni</p>
            <p className="text-[11px] font-medium text-muted">
              Parent · HSR Layout · 2h ago
            </p>
          </div>
        </div>
        <p className="mt-2.5 rounded-md border border-ink/15 bg-white px-3 py-2 text-xs font-medium leading-snug text-ink">
          &ldquo;Hi, looking for Class 10 maths for my daughter — weekends,
          board exam focus. Are Saturdays open?&rdquo;
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border-2 border-ink bg-sage px-3 py-2 text-[11px] font-bold text-white",
              "shadow-[2px_2px_0_0_#1c1a17]",
            )}
          >
            <Check className="h-3.5 w-3.5" />
            Accept
          </span>
          <span className="inline-flex flex-1 items-center justify-center rounded-md border-2 border-ink/30 bg-white px-3 py-2 text-[11px] font-bold text-muted">
            Decline
          </span>
        </div>
        <p className="mt-2 text-center text-[10px] font-bold text-muted">
          Accepting shares your WhatsApp number with Rohit only.
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-lg border-2 border-ink bg-sage-wash px-3 py-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-sage">
          <Check className="h-3.5 w-3.5 text-white" />
        </span>
        <p className="text-xs font-bold text-ink">
          Accepted{" "}
          <span className="font-medium text-ink/60">
            — Rohit can reach you on WhatsApp. You keep 100% of fees.
          </span>
        </p>
      </div>
    </MockShell>
  );
}
