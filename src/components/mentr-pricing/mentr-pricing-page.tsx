"use client";

import { PremiumCheckoutDialog } from "@/components/dashboard/premium-checkout-dialog";
import {
  LpBadge,
  LpBlob,
  LpGridBg,
} from "@/components/landing/lp/shared";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Crown,
  Headphones,
  Infinity as InfinityIcon,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Full-bleed shell — edges breathe on phone, wide on desktop. */
const SHELL =
  "mx-auto w-full min-w-0 max-w-[1400px] px-4 sm:px-6 lg:px-10 xl:px-12";

type PlanLine = {
  title: string;
  detail: string;
};

const FREE_LINES: PlanLine[] = [
  {
    title: "Your mentor profile, live forever",
    detail: "Parents can find you in search. No listing fee, ever.",
  },
  {
    title: "Parents can contact you for free",
    detail: "They never need Premium. You accept connects when ready.",
  },
  {
    title: "Requirements board access",
    detail: "Browse parent posts and pitch up to 3 times every day.",
  },
  {
    title: "Unlimited accepts",
    detail: "Accept as many parent connection requests as you want.",
  },
  {
    title: "WhatsApp after you accept",
    detail: "Talk directly. Keep 100% of your tutoring fees.",
  },
  {
    title: "Dashboard & profile basics",
    detail: "Schedule, profile, and simple analytics included.",
  },
];

const PREMIUM_LINES: PlanLine[] = [
  {
    title: "Unlimited pitches every day",
    detail: "No 3-a-day cap — pitch every parent post that fits you.",
  },
  {
    title: "3 parent contact unlocks / day",
    detail: "Open listing details and reach parents directly.",
  },
  {
    title: "Featured on the Mentr landing page",
    detail: "Extra discoverability up front for Premium mentors.",
  },
  {
    title: "Dedicated SPOC (real human)",
    detail: "One person for onboarding, process, and product issues.",
  },
  {
    title: "Premium badge on your profile",
    detail: "Signal seriousness to parents scanning mentors.",
  },
  {
    title: "Priority help when things break",
    detail: "Faster guidance than the Free self-serve path.",
  },
];

const COMPARE: {
  label: string;
  why: string;
  free: string | boolean;
  premium: string | boolean;
}[] = [
  {
    label: "Appear in parent search",
    why: "Can parents find your profile?",
    free: true,
    premium: true,
  },
  {
    label: "Parents contact you",
    why: "Do they need to pay to reach you?",
    free: "Yes — free for parents",
    premium: "Yes — free for parents",
  },
  {
    label: "Board pitches / day",
    why: "How often can you reply to parent posts?",
    free: "3 / day",
    premium: "Unlimited",
  },
  {
    label: "Accept connections",
    why: "Cap on accepting parent requests?",
    free: "Unlimited",
    premium: "Unlimited",
  },
  {
    label: "Parent contact unlocks",
    why: "Open listing details & message first?",
    free: false,
    premium: "3 unlocks / day",
  },
  {
    label: "Featured on landing page",
    why: "Extra placement on mentr.in home",
    free: false,
    premium: true,
  },
  {
    label: "Dedicated SPOC",
    why: "Named human for help & onboarding",
    free: false,
    premium: true,
  },
  {
    label: "Premium badge",
    why: "Shown on your mentor profile",
    free: false,
    premium: true,
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is Mentr Premium for mentors?",
    a: "Premium is an optional upgrade for mentors who want more reach: unlimited daily pitches, special access to parent listings with contact and requirement details, three parent contact unlocks every day, a dedicated support contact (SPOC), and featured placement on the Mentr landing page. The Free plan stays free forever for core mentoring.",
  },
  {
    q: "Do parents need Premium to contact mentors?",
    a: "No. Parents can search, shortlist, and send connection requests without paying. Mentors on Free still receive and can accept those requests. Premium unlocks extra mentor-side tools to find and reach parents faster — it does not block parents from contacting Free mentors.",
  },
  {
    q: "Is the Free plan really free forever?",
    a: "Yes. Listing your profile, accepting unlimited parent connections, viewing the requirements board, and pitching up to 3 times a day stay free. We do not charge a platform commission on your tutoring fees.",
  },
  {
    q: "How much is Premium?",
    a: "Premium is $5 per month (about ₹449). The price you see is the price you pay — we do not add GST on top of the listed plan price.",
  },
  {
    q: "Do you charge GST? Will I get a GST invoice?",
    a: "We do not collect GST on top of the displayed Premium price. Payments are processed through Razorpay on an individual merchant account. Because of that setup, we currently do not issue GST tax invoices. You will receive a Razorpay payment confirmation for your records. This is not tax advice — if your organisation needs a GST invoice before buying, email hello@mentr.in first.",
  },
  {
    q: "How do payments work?",
    a: "Checkout is handled securely via Razorpay (UPI, cards, and other methods Razorpay supports in India). Mentr does not store your full card details. After a successful payment, Premium features activate on your mentor account once verification is complete.",
  },
  {
    q: "What happens when my Premium period ends?",
    a: "When the paid months run out, Premium tools pause and you return to Free features. Your profile stays live. Open Explore (or Renew on your dashboard) to buy another 2–4 month period.",
  },
  {
    q: "How do cancellations and refunds work?",
    a: "Premium is charged for access to the features in your plan for the months you select (directory tools, unlocks, pitches, and related Premium benefits). Once that period is active, fees are not refunded for how outreach or conversations go on your side. If you were charged but Premium never activated, or you were charged twice, email hello@mentr.in with your Razorpay receipt and we’ll sort it out.",
  },
  {
    q: "What does the SPOC do?",
    a: "Your SPOC is a real person on the Mentr team who can walk you through Premium tools, help with profile or pitch issues, and escalate technical problems. Think of them as your short-cut when you are stuck — not a sales bot.",
  },
  {
    q: "Will Free mentors still appear in search?",
    a: "Yes. Free mentors remain fully discoverable. Premium adds featured slots on the landing page and stronger outreach tools; it does not hide Free mentors from parents.",
  },
];

function CellValue({
  value,
  dark,
}: {
  value: string | boolean;
  dark?: boolean;
}) {
  if (value === true) {
    return (
      <span
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full",
          dark ? "bg-sage text-white" : "bg-sage-wash text-sage",
        )}
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full",
          dark ? "bg-white/10 text-white/35" : "bg-cream text-muted/40",
        )}
      >
        <X className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "max-w-[11rem] text-center text-sm font-bold leading-snug",
        dark ? "text-white" : "text-ink",
      )}
    >
      {value}
    </span>
  );
}

function PricingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={faq.q}
            className="overflow-hidden rounded-none border-2 border-ink bg-white shadow-[4px_4px_0_0_#1a231c]"
          >
            <button
              type="button"
              className="flex w-full min-w-0 items-start justify-between gap-3 px-4 py-4 text-left transition hover:bg-cream/70 sm:px-5"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-ink sm:text-base">
                {faq.q}
              </span>
              <ChevronDown
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0 text-ink transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen ? (
              <div className="border-t-2 border-ink bg-cream px-4 py-4 sm:px-5">
                <p className="text-[15px] leading-relaxed text-muted">{faq.a}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function PlanFeatureList({
  lines,
  variant,
}: {
  lines: PlanLine[];
  variant: "free" | "premium";
}) {
  const premium = variant === "premium";
  return (
    <ul className="mt-5 flex flex-1 flex-col gap-4">
      {lines.map((line) => (
        <li key={line.title} className="flex min-w-0 gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
              premium ? "bg-sage text-white" : "bg-sage-wash text-sage",
            )}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                "text-[15px] font-bold leading-snug",
                premium ? "text-white" : "text-ink",
              )}
            >
              {line.title}
            </p>
            <p
              className={cn(
                "mt-0.5 text-sm leading-relaxed",
                premium ? "text-white/65" : "text-muted",
              )}
            >
              {line.detail}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MentrPricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function openExplore() {
    if (!user) {
      router.push("/login?next=/mentrpricing");
      return;
    }
    if (user.role !== "faculty") {
      router.push("/dashboard");
      return;
    }
    setCheckoutOpen(true);
  }

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-cream">
      {/* ── Hero — cream, brand-first, matches Mentr LPs ── */}
      <section className="relative w-full overflow-hidden border-b-2 border-ink bg-cream">
        <LpGridBg className="opacity-25" />
        <LpBlob
          color="rgba(47,158,110,0.12)"
          size={360}
          className="-right-24 -top-20"
        />
        <LpBlob
          color="rgba(255,154,77,0.1)"
          size={280}
          className="-left-20 bottom-0"
        />

        <div
          className={cn(
            SHELL,
            "relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:py-16",
          )}
        >
          <div className="min-w-0 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <LpBadge>
                <Shield className="h-3.5 w-3.5 text-sage" />
                Mentor plans
              </LpBadge>
              <LpBadge>
                <Sparkles className="h-3.5 w-3.5 text-coral" />
                No lead fees
              </LpBadge>
            </div>

            <p className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Mentr
            </p>

            <h1 className="mt-3 text-balance text-[1.65rem] font-bold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              Free forever.
              <span className="mt-1.5 block text-coral">
                Premium when you&apos;re ready to scale.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted lg:mx-0">
              Core mentoring stays free. Premium adds unlimited pitches, parent
              contact unlocks, a human SPOC, and featured listing — parents
              never pay to reach you.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold text-ink">
                Free $0
              </span>
              <span className="inline-flex items-center rounded-full border-2 border-ink bg-butter px-3 py-1 text-xs font-bold text-ink">
                Premium $5/mo · ≈ ₹449
              </span>
              <span className="inline-flex items-center rounded-full border border-hairline bg-cream-band px-3 py-1 text-xs font-semibold text-muted">
                No GST on top
              </span>
            </div>

            <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a href="#plans" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 w-full sm:min-w-[148px]">
                  See plans
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href="#compare" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 w-full border-2 border-ink sm:min-w-[148px]"
                >
                  Free vs Premium
                </Button>
              </a>
            </div>

            <p className="mt-4 text-xs text-muted">
              Razorpay checkout · billed in INR ·{" "}
              <Link
                href="/mentrpremium"
                className="font-semibold text-coral underline-offset-2 hover:underline"
              >
                Full Premium guide
              </Link>
            </p>
          </div>

          {/* Plan preview — sits beside copy on desktop */}
          <div className="mx-auto grid w-full min-w-0 max-w-md gap-3 sm:max-w-lg lg:mx-0 lg:max-w-none">
            <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_0_#1a231c] sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-ink">Free</p>
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Forever
                </span>
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight text-ink">
                $0
              </p>
              <p className="mt-1 text-sm text-muted">
                Profile, board, 3 pitches/day, WhatsApp after accept
              </p>
            </div>
            <div className="border-2 border-ink bg-ink p-4 text-white shadow-[4px_4px_0_0_#2f9e6e] sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-sm font-bold">
                  <Crown className="h-4 w-4 text-butter" />
                  Premium
                </p>
                <span className="border border-butter bg-butter px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                  Popular
                </span>
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                $5
                <span className="ml-1 text-sm font-semibold text-white/55">
                  /mo
                </span>
              </p>
              <p className="mt-1 text-sm text-white/65">
                Unlimited pitches · 3 unlocks/day · SPOC · featured
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip — full width ── */}
      <section className="w-full border-b-2 border-ink bg-cream-band">
        <div
          className={cn(
            SHELL,
            "grid gap-0 divide-y-2 divide-ink sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0",
          )}
        >
          {[
            {
              icon: Shield,
              title: "Parents stay free",
              body: "Premium is mentor-side only. Parents always contact Free mentors.",
            },
            {
              icon: InfinityIcon,
              title: "No commission",
              body: "Keep 100% of session fees. Mentr never takes a cut.",
            },
            {
              icon: Headphones,
              title: "Human SPOC on Premium",
              body: "A real person for onboarding and sticky issues — not a chatbot.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex min-w-0 gap-3 px-0 py-5 sm:px-5 sm:py-7 lg:px-8"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-white text-sage shadow-[3px_3px_0_0_#1a231c]">
                <item.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Plans — full width cards ── */}
      <section id="plans" className="scroll-mt-20 w-full py-12 sm:py-16 lg:py-20">
        <div className={SHELL}>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-coral">
              Plans
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Choose how you grow on Mentr
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Two options. No hidden lead fees. Your tutoring rates stay between
              you and the parent.
            </p>
          </div>

          <div className="mt-10 grid w-full min-w-0 gap-5 lg:grid-cols-2 lg:gap-8">
            {/* Free */}
            <article className="flex min-w-0 flex-col border-2 border-ink bg-white p-5 shadow-[6px_6px_0_0_#1a231c] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-ink">Free</p>
                  <p className="mt-1 text-sm text-muted">
                    For every mentor & tutor
                  </p>
                </div>
                <span className="shrink-0 border-2 border-ink bg-cream px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
                  Forever
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-5xl font-bold tracking-tight text-ink sm:text-6xl">
                  $0
                </span>
                <span className="text-sm font-bold text-muted">/ forever</span>
              </div>
              <p className="mt-2 text-sm text-muted">
                No card. Core mentoring stays free.
              </p>

              <div className="my-6 h-0.5 w-full bg-ink/10" />

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                What you can do on Free
              </p>
              <PlanFeatureList lines={FREE_LINES} variant="free" />

              <Link href="/faculty/signup" className="mt-8 block w-full">
                <Button
                  variant="secondary"
                  className="h-12 w-full border-2 border-ink"
                  size="lg"
                >
                  Start free
                </Button>
              </Link>
            </article>

            {/* Premium */}
            <article className="relative flex min-w-0 flex-col overflow-hidden border-2 border-ink bg-ink p-5 text-white shadow-[6px_6px_0_0_#2f9e6e] sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-sage/30 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -left-12 h-52 w-52 rounded-full bg-coral/25 blur-3xl"
              />

              <div className="relative flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-lg font-bold text-white">
                    <Crown className="h-5 w-5 shrink-0 text-butter" />
                    Premium
                  </p>
                  <p className="mt-1 text-sm text-white/65">
                    For mentors ready to pitch more
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 border-2 border-butter bg-butter px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
                  <Sparkles className="h-3 w-3" />
                  Most chosen
                </span>
              </div>

              <div className="relative mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                  $5
                </span>
                <span className="text-sm font-bold text-white/55">/ month</span>
              </div>
              <p className="relative mt-2 text-sm text-white/65">
                ≈ ₹449 / month · price as shown · no GST added on top
              </p>

              <div className="relative my-6 h-px w-full bg-white/15" />

              <p className="relative text-xs font-bold uppercase tracking-[0.14em] text-butter">
                Everything in Free, plus
              </p>
              <PlanFeatureList lines={PREMIUM_LINES} variant="premium" />

              <button
                type="button"
                onClick={openExplore}
                className="relative mt-8 block w-full"
              >
                <Button
                  size="lg"
                  className="h-12 w-full bg-butter text-ink hover:bg-butter-deep"
                >
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </button>
              <p className="relative mt-3 text-center text-[11px] text-white/40">
                Choose duration and pay securely with Razorpay
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Compare — mobile cards, desktop table ── */}
      <section
        id="compare"
        className="scroll-mt-20 w-full border-y-2 border-ink bg-white py-12 sm:py-16 lg:py-20"
      >
        <div className={SHELL}>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-coral">
              Compare
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Free vs Premium — in plain English
            </h2>
            <p className="mt-3 text-base text-muted">
              Each row is one decision mentors actually make. Not jargon.
            </p>
          </div>

          {/* Mobile: stacked feature cards */}
          <div className="mt-8 space-y-4 md:hidden">
            {COMPARE.map((row) => (
              <div
                key={row.label}
                className="min-w-0 border-2 border-ink bg-cream p-4 shadow-[4px_4px_0_0_#1a231c]"
              >
                <p className="text-base font-bold text-ink">{row.label}</p>
                <p className="mt-1 text-sm text-muted">{row.why}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="min-w-0 border-2 border-ink/15 bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Free
                    </p>
                    <div className="mt-2 flex justify-center">
                      <CellValue value={row.free} />
                    </div>
                  </div>
                  <div className="min-w-0 border-2 border-sage bg-ink p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-butter">
                      Premium
                    </p>
                    <div className="mt-2 flex justify-center">
                      <CellValue value={row.premium} dark />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: full-width table */}
          <div className="mt-8 hidden w-full min-w-0 overflow-hidden border-2 border-ink shadow-[6px_6px_0_0_#1a231c] md:block">
            <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] border-b-2 border-ink bg-cream-band px-5 py-4 text-xs font-bold uppercase tracking-wide text-muted">
              <span>What you care about</span>
              <span className="text-center">Free</span>
              <span className="text-center text-sage">Premium</span>
            </div>
            {COMPARE.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] items-center gap-3 px-5 py-4",
                  i % 2 === 1 && "bg-cream/60",
                  i < COMPARE.length - 1 && "border-b border-hairline",
                )}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-bold text-ink">{row.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{row.why}</p>
                </div>
                <div className="flex justify-center">
                  <CellValue value={row.free} />
                </div>
                <div className="flex justify-center">
                  <CellValue value={row.premium} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Premium helps — outcome cards ── */}
      <section className="w-full bg-cream py-12 sm:py-16 lg:py-20">
        <div className={SHELL}>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-coral">
              Why Premium
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Four upgrades that change your week
            </h2>
          </div>

          <div className="mt-10 grid w-full min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: MessageCircle,
                title: "Pitch without a daily ceiling",
                body: "Free caps you at 3 board pitches/day. Premium removes that limit so active mentors can reply to every fit.",
              },
              {
                icon: Users,
                title: "Reach parents first",
                body: "Unlock up to 5 parent listings a day — see contact details and start the conversation yourself.",
              },
              {
                icon: Star,
                title: "Show up on the homepage",
                body: "Featured Premium mentors get landing-page placement so parents discover you without searching.",
              },
              {
                icon: Headphones,
                title: "Talk to a real SPOC",
                body: "Stuck on profile, pitches, or unlocks? A human on the Mentr team walks you through it.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex min-w-0 flex-col border-2 border-ink bg-white p-5 shadow-[4px_4px_0_0_#1a231c]"
              >
                <span className="flex h-11 w-11 items-center justify-center border-2 border-ink bg-coral-wash text-coral">
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold leading-snug text-ink">
                  {card.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — full bleed ── */}
      <section
        id="get-premium"
        className="scroll-mt-20 w-full border-y-2 border-ink bg-ink py-12 sm:py-16"
      >
        <div className={cn(SHELL, "text-center")}>
          <BadgeCheck className="mx-auto h-9 w-9 text-butter" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready for Premium?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-white/65">
            Tap Explore on the Premium plan above to pick 2–4 months and pay.
            Or open your dashboard anytime.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <a href="#plans" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-12 w-full bg-butter text-ink hover:bg-butter-deep sm:min-w-[200px]"
              >
                Back to plans
              </Button>
            </a>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 w-full border-white/25 bg-white/10 text-white hover:bg-white/15 sm:min-w-[200px]"
              >
                Open mentor dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        className="scroll-mt-20 w-full bg-cream py-12 sm:py-16 lg:py-20"
      >
        <div className={cn(SHELL, "flex flex-col items-center")}>
          <div className="w-full max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-coral">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Questions, answered plainly
            </h2>
          </div>
          <div className="mt-8 w-full max-w-3xl">
            <PricingFaq />
          </div>
        </div>
      </section>

      {/* ── Billing / legal ── */}
      <section
        id="legal"
        className="w-full border-t-2 border-ink bg-white py-12 sm:py-16"
      >
        <div className={cn(SHELL, "max-w-4xl space-y-10")}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
              Billing & taxes
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              How we charge — in plain English
            </h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted">
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                <span>
                  Listed Premium price is{" "}
                  <strong className="font-semibold text-ink">$5 / month</strong>{" "}
                  (about ₹449). We do{" "}
                  <strong className="font-semibold text-ink">
                    not add GST on top
                  </strong>{" "}
                  of that displayed amount.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                <span>
                  Payments run through{" "}
                  <strong className="font-semibold text-ink">Razorpay</strong> on
                  an individual merchant account. Mentr does not store your full
                  card or UPI credentials.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                <span>
                  We{" "}
                  <strong className="font-semibold text-ink">
                    do not issue GST tax invoices
                  </strong>
                  . You get a Razorpay payment confirmation for your records.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                <span>
                  Not tax advice. Need a GST invoice for your organisation?
                  Contact{" "}
                  <a
                    href="mailto:hello@mentr.in"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    hello@mentr.in
                  </a>{" "}
                  before you pay.
                </span>
              </li>
            </ul>
          </div>

          <div className="h-0.5 w-full bg-ink/10" />

          <div>
            <h2 className="text-xl font-bold text-ink">Privacy (Premium)</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              We use your account email, mentor profile, and payment status to
              activate and support Premium. Parent contact unlocks are for
              arranging tutoring only — not for spam or resale. Payment data is
              handled by Razorpay. Read the{" "}
              <Link
                href="/privacy"
                className="font-semibold text-coral underline-offset-2 hover:underline"
              >
                Privacy policy
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ink">
              Terms for Premium mentors
            </h2>
            <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-muted">
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                Premium is optional. Free mentors keep core access.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                Fair-use and anti-abuse rules still apply.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                Featured placement is best-effort and may rotate — not a
                guarantee of student volume.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                Premium lasts for the months you paid. When it ends, Free
                features stay; renew anytime from Explore or your dashboard.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                Your plan covers access to the Premium features listed for the
                months you buy. Details live in our{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-coral underline-offset-2 hover:underline"
                >
                  Terms of service
                </Link>{" "}
                and the refund FAQ above.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                Platform rules in our{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-coral underline-offset-2 hover:underline"
                >
                  Terms of service
                </Link>{" "}
                still apply.
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted">
            Last updated: September 2026 · Mentr by Paprly ·{" "}
            <a
              href="mailto:hello@mentr.in"
              className="font-medium text-ink hover:underline"
            >
              hello@mentr.in
            </a>
          </p>
        </div>
      </section>

      <PremiumCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
    </main>
  );
}
