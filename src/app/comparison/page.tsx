import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { hardShadow, hardShadowSm } from "@/components/landing/lp/shared";
import { SeoBreadcrumbs } from "@/components/seo/hub-page";
import {
  JsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/components/seo/json-ld";
import {
  COMPARISON_FAQS,
  COMPARISON_PLATFORMS,
  COMPARISON_RELATED,
  COMPARISON_ROWS,
  COMPARISON_UPDATED_AT,
  COMPETITOR_DEEP_DIVES,
  COST_SCENARIO,
  type CellTone,
} from "@/lib/comparison-data";
import { SITE_BRAND, absoluteUrl, hubOpenGraph } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Minus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

const PATH = "/comparison";
const TITLE = "Mentr vs UrbanPro, Superprof, Vedantu & More: Tutor Platforms Compared (2026)";
const DESCRIPTION =
  "Honest 2026 comparison of tutor platforms in India: Mentr, UrbanPro, Superprof, Vedantu, Sulekha, Justdial and tuition agencies. Fees, commission, privacy, and who each one suits.";

export const metadata: Metadata = {
  title: { absolute: "Best Tutor Platforms in India Compared (2026) | Mentr vs UrbanPro, Vedantu" },
  description: DESCRIPTION,
  keywords: [
    "best tutor platform india",
    "urbanpro alternative",
    "mentr vs urbanpro",
    "superprof vs urbanpro",
    "vedantu alternative",
    "sulekha tutor alternative",
    "justdial home tutor",
    "tuition agency commission",
    "free home tutor website",
    "compare tutor websites india",
  ],
  alternates: { canonical: PATH },
  openGraph: { ...hubOpenGraph(TITLE, DESCRIPTION, PATH), type: "article" },
};

const UPDATED_LABEL = new Date(`${COMPARISON_UPDATED_AT}T00:00:00+05:30`).toLocaleDateString(
  "en-IN",
  { day: "numeric", month: "long", year: "numeric" },
);

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const TOC = [
  { id: "verdict", label: "Quick verdict" },
  { id: "at-a-glance", label: "Side-by-side table" },
  { id: "real-cost", label: "What it really costs" },
  { id: "platforms", label: "Platform by platform" },
  { id: "not-for-you", label: "When Mentr isn't the fit" },
  { id: "method", label: "How we compared" },
  { id: "faq", label: "FAQ" },
];

function ToneIcon({ tone }: { tone: CellTone }) {
  if (tone === "good") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-sage text-white">
        <Check className="size-3" strokeWidth={3} aria-label="Good" />
      </span>
    );
  }
  if (tone === "bad") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral">
        <X className="size-3" strokeWidth={3} aria-label="Weak" />
      </span>
    );
  }
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-butter text-ink/70">
      <Minus className="size-3" strokeWidth={3} aria-label="Mixed" />
    </span>
  );
}

function CtaButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <Link
        href="/search"
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-coral px-6 text-sm font-bold text-white transition hover:-translate-y-0.5",
          hardShadowSm,
        )}
      >
        Find a tutor free
        <ArrowRight className="size-4" />
      </Link>
      <Link
        href="/for-faculty"
        className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-ink bg-white px-6 text-sm font-bold text-ink transition hover:bg-cream"
      >
        I&apos;m a tutor, list me free
      </Link>
    </div>
  );
}

export default function ComparisonPage() {
  const platformIds = COMPARISON_PLATFORMS.map((p) => p.id);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tutor platform comparison", path: PATH },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: TITLE,
            description: DESCRIPTION,
            url: absoluteUrl(PATH),
            datePublished: "2026-09-29",
            dateModified: COMPARISON_UPDATED_AT,
            author: { "@type": "Organization", name: "Mentr Editorial Team", url: absoluteUrl("/") },
            publisher: { "@type": "Organization", name: SITE_BRAND, url: absoluteUrl("/") },
            about: COMPARISON_PLATFORMS.map((p) => ({ "@type": "Thing", name: p.name })),
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Tutor platforms in India compared",
            itemListElement: COMPARISON_PLATFORMS.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${p.name}: ${p.kind}`,
            })),
          },
          faqJsonLd(COMPARISON_FAQS),
        ]}
      />
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* Hero */}
        <header className="border-b-2 border-ink/10 bg-gradient-to-br from-butter/50 via-cream to-sage-wash/40">
          <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-6 sm:pb-14 lg:px-8">
            <SeoBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare tutor platforms" }]} />
            <p className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral">
              <Sparkles className="size-3.5" />
              2026 comparison · updated {UPDATED_LABEL}
            </p>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Best tutor platforms in India, compared honestly
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
              Mentr vs UrbanPro, Superprof, Vedantu, Sulekha, Justdial and local tuition agencies.
              What each one costs you, what it costs the tutor, who gets your phone number, and
              which one actually fits your child.
            </p>
            <CtaButtons className="mt-7" />

            <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
              {TOC.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="rounded-full border border-hairline bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink/30 hover:text-coral"
                >
                  {t.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-[1200px] space-y-14 px-4 py-10 sm:space-y-20 sm:px-6 sm:py-14 lg:px-8">
          {/* Verdict */}
          <section id="verdict" className="scroll-mt-24">
            <div className={cn("rounded-2xl border-2 border-ink bg-white p-5 sm:p-7", hardShadow)}>
              <h2 className="text-xl font-bold text-ink sm:text-2xl">The short answer</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/85 sm:text-base">
                If you want a school tutor (CBSE, ICSE, state board or IGCSE) at home or online,{" "}
                <strong>start with Mentr</strong>. It&apos;s the only option here that is free for
                parents, doesn&apos;t make tutors pay to reply, takes no commission, and keeps your
                number private until you say yes.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { k: "Pick Mentr if", v: "You want to choose your tutor yourself, pay them directly, and avoid spam calls." },
                  { k: "Pick UrbanPro if", v: "You need a very niche subject in a city where Mentr is still small." },
                  { k: "Pick Vedantu if", v: "Your child is self-driven and does well in live group classes." },
                ].map((x) => (
                  <li key={x.k} className="rounded-xl bg-cream px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-coral">{x.k}</p>
                    <p className="mt-1 text-sm leading-snug text-ink">{x.v}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Table */}
          <section id="at-a-glance" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Side by side: 7 ways to find a tutor
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              Ten things that matter when you&apos;re hiring someone to teach your child. Swipe the
              table sideways on mobile.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-ink bg-white">
              <table className="w-full min-w-[980px] border-collapse text-left text-[13px]">
                <caption className="sr-only">
                  Comparison of Mentr, UrbanPro, Superprof, Vedantu, Sulekha, Justdial and tuition agencies
                </caption>
                <thead>
                  <tr className="border-b-2 border-ink">
                    <th scope="col" className="sticky left-0 z-10 w-44 bg-white px-4 py-4 text-xs font-bold uppercase tracking-wide text-muted">
                      What matters
                    </th>
                    {COMPARISON_PLATFORMS.map((p) => (
                      <th
                        key={p.id}
                        scope="col"
                        className={cn(
                          "px-3 py-4 align-bottom",
                          p.id === "mentr" && "bg-sage-wash/70",
                        )}
                      >
                        <span className="block text-sm font-bold text-ink">{p.name}</span>
                        <span className="mt-0.5 block text-[11px] font-medium text-muted">{p.kind}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.label} className="align-top">
                      <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3.5 text-[13px] font-semibold text-ink">
                        {row.label}
                        {row.hint ? (
                          <span className="mt-0.5 block text-[11px] font-normal text-muted">{row.hint}</span>
                        ) : null}
                      </th>
                      {platformIds.map((id) => {
                        const cell = row.cells[id]!;
                        return (
                          <td
                            key={id}
                            className={cn(
                              "px-3 py-3.5",
                              id === "mentr" && "bg-sage-wash/40 font-semibold",
                            )}
                          >
                            <span className="flex items-start gap-2 leading-snug text-ink/90">
                              <ToneIcon tone={cell.tone} />
                              <span>{cell.text}</span>
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">
              Based on how each service publicly describes its model as of {UPDATED_LABEL}. Pricing
              and features change, so check each site before you pay.
            </p>
          </section>

          {/* Cost */}
          <section id="real-cost" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              What finding one tutor really costs
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              An example: a Class 9 maths tutor at {inr(COST_SCENARIO.monthlyFee)} a month for a{" "}
              {COST_SCENARIO.months}-month school year ({inr(COST_SCENARIO.monthlyFee * COST_SCENARIO.months)} in
              fees). Here&apos;s how much of that goes to someone other than the teacher.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {COST_SCENARIO.rows.map((r) => {
                const isMentr = r.id === "mentr";
                return (
                  <div
                    key={r.id}
                    className={cn(
                      "flex flex-col rounded-2xl border-2 bg-white p-4",
                      isMentr ? cn("border-ink", hardShadowSm) : "border-hairline",
                    )}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">{r.name}</p>
                    <p
                      className={cn(
                        "mt-2 text-2xl font-bold tabular-nums",
                        isMentr ? "text-sage" : r.platformCost ? "text-coral" : "text-ink/60",
                      )}
                    >
                      {r.platformCost === null ? "Varies" : inr(r.platformCost)}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                      extra over the year
                    </p>
                    <p className="mt-3 text-[13px] leading-snug text-ink/80">{r.note}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted">
              Agency figures use common local rates (one month&apos;s fee, or 10–30% monthly). Your
              agency may charge differently, so ask them directly.
            </p>
          </section>

          {/* Deep dives */}
          <section id="platforms" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Platform by platform
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              How each option works, where it&apos;s genuinely good, and where Mentr does things
              differently.
            </p>

            <div className="mt-8 space-y-6">
              {COMPETITOR_DEEP_DIVES.map((c) => (
                <article
                  key={c.id}
                  id={`vs-${c.id}`}
                  className="scroll-mt-24 rounded-2xl border border-hairline bg-white p-5 sm:p-7"
                >
                  <h3 className="text-xl font-bold text-ink sm:text-2xl">{c.headline}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{c.howItWorks}</p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-cream/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-sage">
                        Where {c.name} is good
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {c.strengths.map((s) => (
                          <li key={s} className="flex gap-2 text-sm leading-snug text-ink/85">
                            <Check className="mt-0.5 size-4 shrink-0 text-sage" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-coral-wash/40 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-coral">
                        What to watch out for
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {c.drawbacks.map((s) => (
                          <li key={s} className="flex gap-2 text-sm leading-snug text-ink/85">
                            <CircleAlert className="mt-0.5 size-4 shrink-0 text-coral" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border-2 border-ink/80 bg-sage-wash/50 p-4">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink">
                      <ShieldCheck className="size-4 text-sage" />
                      How Mentr is different
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink">{c.mentrDifference}</p>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted">
                      <span className="font-semibold text-ink">{c.name} suits: </span>
                      {c.bestFor}
                    </p>
                    {c.readMore ? (
                      <Link
                        href={c.readMore.href}
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-coral hover:underline"
                      >
                        {c.readMore.label}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Mid CTA */}
          <section className={cn("rounded-2xl border-2 border-ink bg-ink p-6 text-white sm:p-9", hardShadow)}>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Try it yourself. It takes two minutes and costs nothing
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              Search tutors by subject, class, board and area, or post what your child needs and let
              verified tutors come to you. No sign-up fee, no commission, no spam calls.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/search"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-butter px-6 text-sm font-bold text-ink transition hover:-translate-y-0.5"
              >
                Browse tutors
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/instant-connect"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white/30 px-6 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Get a tutor to call in minutes
              </Link>
            </div>
          </section>

          {/* Honesty */}
          <section id="not-for-you" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              When Mentr isn&apos;t the right fit
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              We&apos;d rather you find the right teacher than pick us for the wrong reason.
            </p>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                {
                  t: "You live in a small town and need home tuition",
                  d: "Our home-tutor network is strongest in Bengaluru. Online tutoring works everywhere, but for in-person classes a larger directory may have more names near you right now.",
                },
                {
                  t: "You want a fixed course with recorded lectures",
                  d: "Mentr connects you with a person, not a curriculum product. If your child wants a packaged JEE/NEET programme with mock tests, an edtech course may suit better.",
                },
                {
                  t: "You want the platform to handle payments and refunds",
                  d: "You pay your tutor directly on Mentr. That's why there's no commission, but it also means no in-app refunds. Agree terms and take a trial class first.",
                },
                {
                  t: "You want someone else to choose for you",
                  d: "If you'd rather hand the whole search to someone, an agency does that for a fee. Instant Connect is the closest thing on Mentr: a tutor calls you, but you still decide.",
                },
              ].map((x) => (
                <li key={x.t} className="rounded-2xl border border-hairline bg-white p-5">
                  <p className="font-bold text-ink">{x.t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{x.d}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Method */}
          <section id="method" className="scroll-mt-24 rounded-2xl border border-hairline bg-white p-5 sm:p-7">
            <h2 className="text-xl font-bold text-ink sm:text-2xl">How we compared</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/80">
              <p>
                We looked at each service the way a parent would: posting a requirement, browsing
                profiles, and checking what happens to your contact details. We also read how each
                business publicly explains its pricing to parents and tutors. Where prices change often
                (subscriptions, lead packs, course fees), we describe the model instead of quoting a
                number that may be out of date.
              </p>
              <p>
                Mentr is our product, and we&apos;ve said so openly. That&apos;s why this page includes
                where other platforms do better and when Mentr isn&apos;t the right choice. If
                something here is out of date, email{" "}
                <a href="mailto:hello@mentr.in" className="font-semibold text-coral hover:underline">
                  hello@mentr.in
                </a>{" "}
                and we&apos;ll correct it.
              </p>
              <p className="text-xs text-muted">
                UrbanPro, Superprof, Vedantu, Sulekha and Justdial are trademarks of their respective
                owners. Mentr is not affiliated with them. Last reviewed {UPDATED_LABEL}.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Frequently asked questions
            </h2>
            <div className="mt-6 divide-y divide-hairline rounded-2xl border border-hairline bg-white">
              {COMPARISON_FAQS.map((f) => (
                <details key={f.question} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    <h3>{f.question}</h3>
                    <ChevronDown className="size-4 shrink-0 text-muted transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related + final CTA */}
          <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-hairline bg-white p-5 sm:p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Keep reading</h2>
              <ul className="mt-3 space-y-1">
                {COMPARISON_RELATED.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-ink hover:text-coral"
                    >
                      <ArrowRight className="size-3.5 text-coral" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn("rounded-2xl border-2 border-ink bg-butter/60 p-6 sm:p-8", hardShadowSm)}>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Find a tutor without the fees, the spam or the middleman
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                Free for parents. Free for tutors to list. The full fee goes to the person who teaches
                your child.
              </p>
              <CtaButtons className="mt-5" />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
