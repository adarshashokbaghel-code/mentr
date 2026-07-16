"use client";

import { BrowserFrame } from "@/components/ui/browser-frame";
import { Button } from "@/components/ui/button";
import {
  FAQ_CATEGORIES,
  FAQS,
  faqsByCategory,
  type FaqCategoryId,
} from "@/lib/faqs";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  HelpCircle,
  LayoutDashboard,
  MessageCircle,
  Search,
  ShieldCheck,
  UserPlus,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GlobalReachMap } from "@/components/landing/global-reach-map";
import {
  hardShadow,
  hardShadowSm,
  LpBadge,
  LpBlob,
  LpFinalCta,
  LpGridBg,
  LpPill,
  LpSectionDivider,
  LpStatsBand,
  SectionHeader,
} from "./shared";

const faqStats = [
  { value: "100%", label: "Free for both sides", tint: "bg-lavender", icon: Wallet },
  { value: "₹0", label: "Platform fee", tint: "bg-butter", icon: ShieldCheck },
  { value: "Verified", label: "Every teacher", tint: "bg-sage-wash", icon: ShieldCheck },
  { value: "Direct", label: "WhatsApp contact", tint: "bg-coral-wash", icon: MessageCircle },
];

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  all: BookOpen,
  parents: Search,
  faculty: UserPlus,
  fees: Wallet,
  safety: ShieldCheck,
  general: HelpCircle,
};

function FaqAccordion({ category }: { category: FaqCategoryId }) {
  const items = faqsByCategory(category);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-ink/20 bg-cream py-12 text-center text-muted">
        No questions in this category yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <article
            key={faq.question}
            className={cn(
              "overflow-hidden rounded-2xl border-2 bg-white transition-all duration-200",
              isOpen
                ? cn("border-ink", hardShadowSm)
                : "border-ink/10 hover:border-ink/30",
            )}
          >
            <button
              type="button"
              className="flex w-full items-start gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-bold transition",
                  isOpen
                    ? "border-ink bg-coral text-white shadow-[2px_2px_0_0_#1c1a17]"
                    : "border-ink/20 bg-cream text-ink",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-coral">
                  {faq.category}
                </span>
                <p className="mt-0.5 text-base font-bold text-ink sm:text-lg">{faq.question}</p>
              </div>
              <ChevronDown
                className={cn(
                  "mt-1 h-5 w-5 shrink-0 text-coral transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-200",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t-2 border-ink/10 bg-butter/25 px-5 py-5 sm:px-6 sm:pl-[4.5rem]">
                  <p className="text-[15px] leading-relaxed text-ink/80">{faq.answer}</p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function FaqHero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-lavender">
      <LpGridBg className="opacity-30" />
      <LpBlob color="rgba(217,208,255,0.6)" size={320} className="-left-24 top-0" />
      <LpBlob color="rgba(255,241,228,0.7)" size={280} className="-right-20 bottom-0" />

      <div className="relative mx-auto max-w-[900px] px-4 py-10 text-center sm:px-6 sm:py-16 lg:py-24 lg:px-8">
        <LpBadge className="mx-auto">
          <HelpCircle className="h-3.5 w-3.5 text-coral" />
          Help center
        </LpBadge>

        <h1 className="mt-7 text-4xl font-bold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
          Everything you
          <br />
          need to know.
          <span className="mt-3 block text-[1.5rem] font-semibold leading-snug text-coral sm:text-[1.85rem]">
            Verification, fees & how Mentr works.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {FAQS.length} answers on connect requests, WhatsApp contact, tutor
          verification, and why Mentr stays 100% free for parents and faculty
          worldwide.
        </p>

        <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-2">
          <LpPill tint="lavender">{FAQS.length} answers</LpPill>
          <LpPill tint="sage">100% free</LpPill>
          <LpPill tint="butter">No hidden fees</LpPill>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/parents">
            <Button size="lg" className="gap-2 shadow-[3px_3px_0_0_#1c1a17]">
              <Search className="h-4 w-4" />
              For parents
            </Button>
          </Link>
          <Link href="/for-faculty">
            <Button size="lg" variant="secondary" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              For faculty
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="ghost">Contact support</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AudienceCards() {
  const cards = [
    {
      tag: "For parents",
      tagColor: "text-coral",
      bg: "bg-lavender",
      title: "Find a tutor in one search.",
      desc: "Search verified tutors locally or online worldwide, send a connect request, and chat on WhatsApp once they accept. Or post your requirement — tutors pitch with their profile.",
      perks: ["Search local or online", "WhatsApp unlocks on accept", "₹0 fees · free forever", "Post requirements free"],
      href: "/parents",
      cta: "Parents — full guide",
      icon: Search,
      step: "P",
    },
    {
      tag: "For faculty",
      tagColor: "text-sage",
      bg: "bg-butter",
      title: "List free. Keep 100%.",
      desc: "No coins, no lead packs, no commission. Create a profile, set availability, review connect requests, and pitch on the requirements board.",
      perks: ["Free to list & get contacted", "Number private until accept", "0% cut on tuition fees", "Requirements board access"],
      href: "/for-faculty",
      cta: "Faculty — full guide",
      icon: UserPlus,
      step: "F",
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <SectionHeader number="02" eyebrow="Pick your path" title="Parents and faculty." accent="Both completely free." />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.tag}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border-2 border-ink p-7 sm:p-9",
                card.bg,
                hardShadow,
                "transition-transform duration-200 hover:-translate-y-1",
              )}
            >
              <div className="relative flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-white text-lg font-bold text-coral shadow-[2px_2px_0_0_#1c1a17]">
                  {card.step}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-white">
                  <card.icon className="h-5 w-5 text-ink" />
                </span>
                <span className={cn("text-xs font-bold uppercase tracking-wider", card.tagColor)}>{card.tag}</span>
              </div>
              <h3 className="relative mt-5 text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{card.title}</h3>
              <p className="relative mt-3 flex-1 text-base leading-relaxed text-muted">{card.desc}</p>
              <ul className="relative mt-6 space-y-2.5">
                {card.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-ink bg-white text-[9px] font-bold">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link href={card.href} className="relative mt-8">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  <card.icon className="h-4 w-4" />
                  {card.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowPreview() {
  const flows = [
    {
      label: "Parent flow",
      color: "coral",
      url: "mentr.in / parents / connect",
      steps: [
        "Search by subject & area",
        "Send connect request with note",
        "Tutor accepts → WhatsApp unlocks",
        "Arrange timing & fees directly",
      ],
    },
    {
      label: "Faculty flow",
      color: "sage",
      url: "mentr.in / faculty / dashboard",
      steps: [
        "Register & pass verification",
        "Set open slots on dashboard",
        "Review connect requests",
        "Accept → share WhatsApp · keep 100%",
      ],
    },
  ];

  return (
    <section className="bg-cream-band py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <SectionHeader number="03" eyebrow="How it works" title="One connector." accent="Both sides win." />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {flows.map((flow) => (
            <div key={flow.label} className={cn("overflow-hidden rounded-2xl border-2 border-ink bg-white", hardShadowSm)}>
              <BrowserFrame url={flow.url} headerClassName="bg-cream" className="rounded-none border-0 shadow-none">
                <div className="space-y-2.5 bg-cream p-4 sm:p-5">
                  <p
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.14em]",
                      flow.color === "coral" ? "text-coral" : "text-sage",
                    )}
                  >
                    {flow.label}
                  </p>
                  {flow.steps.map((step, i) => (
                    <div
                      key={step}
                      className="flex items-center gap-3.5 rounded-xl border-2 border-ink/10 bg-white px-4 py-3 transition hover:border-ink/25"
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink text-sm font-bold text-white shadow-[2px_2px_0_0_#1c1a17]",
                          flow.color === "coral" ? "bg-coral" : "bg-sage",
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-bold text-ink">{step}</span>
                    </div>
                  ))}
                </div>
              </BrowserFrame>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const rows = [
    { label: "Cost to parents", mentr: "₹0", other: "Agent fees", win: true },
    { label: "Cost to tutors", mentr: "₹0", other: "Coins / leads", win: true },
    { label: "Session commission", mentr: "0%", other: "15–30%", win: true },
    { label: "WhatsApp contact", mentr: "Free", other: "Gated", win: false },
    { label: "Verified profiles", mentr: "Every listing", other: "Mixed", win: false },
  ];

  return (
    <section className="relative overflow-hidden bg-ink py-12 text-white sm:py-20 lg:py-28">
      <LpBlob color="rgba(255,154,77,0.12)" size={280} className="-left-16 top-1/4" />
      <div className="relative mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <LpBadge variant="dark" className="mx-auto mb-6">Why Mentr?</LpBadge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px]">
            Mentr vs paid platforms
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/75">
            Everything you need to find or become a tutor — without the fees
            UrbanPro, agencies, and others charge.
          </p>
        </div>

        <div className={cn("mt-12 overflow-hidden rounded-2xl border-2 border-white/20 bg-white text-ink", hardShadow)}>
          <div className="grid grid-cols-3 border-b-2 border-ink bg-cream text-center text-[11px] font-bold">
            <div className="px-3 py-4 text-muted">Feature</div>
            <div className="border-x-2 border-ink bg-coral-wash px-3 py-4 text-coral">Mentr</div>
            <div className="px-3 py-4 text-muted">UrbanPro / Agencies</div>
          </div>
          {rows.map((row) => (
            <div
              key={row.label}
              className={cn(
                "grid grid-cols-3 border-b border-hairline last:border-b-0",
                row.win && "bg-sage-wash/20",
              )}
            >
              <div className="flex items-center px-4 py-4 text-sm font-medium">{row.label}</div>
              <div className="flex items-center justify-center border-x border-hairline px-3 py-4">
                <span className="rounded-lg border-2 border-ink bg-sage-wash px-3 py-1 text-sm font-bold text-sage">{row.mentr}</span>
              </div>
              <div className="flex items-center justify-center px-3 py-4 text-sm text-muted line-through decoration-muted/50">
                {row.other}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqLanding() {
  const [category, setCategory] = useState<FaqCategoryId>("all");
  const filtered = faqsByCategory(category);

  return (
    <main>
      <FaqHero />
      <LpStatsBand stats={faqStats} />
      <GlobalReachMap />

      <section className="py-12 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
          <SectionHeader
            number="01"
            eyebrow={`${FAQS.length} answers`}
            title="Frequently asked"
            accent="questions."
            description="Filter by topic or browse everything. Every answer you need — no need to search elsewhere."
          />

          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {FAQ_CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.id] ?? HelpCircle;
              const count = cat.id === "all" ? FAQS.length : FAQS.filter((f) => f.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all duration-200",
                    category === cat.id
                      ? cn("border-ink bg-coral text-white -translate-y-0.5", hardShadowSm)
                      : "border-ink/15 bg-white text-ink hover:border-ink/35 hover:bg-cream",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                      category === cat.id ? "bg-white/20 text-white" : "bg-cream text-muted",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Showing <strong className="text-ink">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "answer" : "answers"}
          </p>

          <div className="mt-8">
            <FaqAccordion category={category} />
          </div>
        </div>
      </section>

      <LpSectionDivider className="bg-white" bandClass="bg-lavender" />
      <AudienceCards />
      <FlowPreview />
      <ComparisonSection />
      <LpFinalCta
        eyebrow="Still have a question?"
        title="Try it — searching and listing are both free."
        description="Browse verified tutors worldwide or create a free faculty profile. No credit card, no coins, no commission."
        primaryLabel="Find a teacher — free"
        primaryHref="/search"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
        perks={["Free forever", "Verified tutors", "Direct WhatsApp", "No commission"]}
      />
    </main>
  );
}
