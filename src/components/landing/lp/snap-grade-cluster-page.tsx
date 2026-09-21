import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import {
  SNAP_GRADE_CLUSTERS,
  SNAP_GRADE_FACT_SHEET,
  SNAP_GRADE_FAQS,
  SNAP_GRADE_TESTIMONIALS,
  snapGradeClusterPath,
  type SnapGradeCluster,
} from "@/lib/snap-grade-seo";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const SHELL = "mx-auto w-full min-w-0 max-w-[1400px] px-4 sm:px-6 lg:px-8";
const GRADE = "/snapandgrade/grade";

const STEPS = [
  {
    n: "1",
    t: "Pick the question",
    d: "Class, subject, chapter, then the exact item. The marking key is already on it.",
  },
  {
    n: "2",
    t: "Snap the page you wrote",
    d: "One clear photo of your notebook. Confirm the text. Then we grade.",
  },
  {
    n: "3",
    t: "See step marks + a tip",
    d: "Formula, working, units, last line — and how to write it next time.",
  },
] as const;

export function SnapGradeClusterLanding({ page }: { page: SnapGradeCluster }) {
  const others = SNAP_GRADE_CLUSTERS.filter((p) => p.slug !== page.slug);

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-hairline bg-cream py-10 sm:py-16">
          <div className={SHELL}>
            <p className="text-sm font-semibold text-coral">{page.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[44px] lg:leading-[1.08]">
              {page.h1}{" "}
              <span className="text-coral">{page.h1Accent}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={GRADE}>
                <Button size="lg">
                  Grade a practice answer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/snapandgrade">
                <Button size="lg" variant="secondary">
                  What is Snap &amp; Grade?
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm font-semibold text-ink/70">
              {SNAP_GRADE_FACT_SHEET.freeCredits} free credits · no app · Class
              9–12
            </p>
          </div>
        </section>

        <section className="border-b border-hairline bg-white py-10 sm:py-16">
          <div className={cn(SHELL, "grid gap-10 lg:grid-cols-2 lg:gap-16")}>
            <div>
              <p className="text-sm font-semibold text-coral">What it is</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                A CBSE-style mark sheet{" "}
                <span className="text-coral">for the page you already wrote.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {page.what} Snap &amp; Grade by Mentr is not a tutor and not
                ChatGPT with a PDF. You pick the question. You photograph your
                working. You see marks the way a board key splits them.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-coral">How it helps</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {page.benefit}
              </h2>
              <ul className="mt-5 space-y-3 text-sm font-medium text-ink sm:text-base">
                {[
                  "Know your marks tonight — not on result day",
                  "See the step that lost the mark",
                  "Learn the sentence the examiner wants",
                  `${SNAP_GRADE_FACT_SHEET.questionCount} questions · start with ${SNAP_GRADE_FACT_SHEET.freeCredits} free credits`,
                ].map((line) => (
                  <li key={line} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-lavender py-10 sm:py-16">
          <div className={SHELL}>
            <p className="text-sm font-semibold text-coral">How to use it</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Three steps.{" "}
              <span className="text-coral">Same as the exam desk.</span>
            </h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="rounded-lg border border-hairline bg-white p-5"
                >
                  <span className="font-mono text-xs font-bold text-coral">
                    {s.n}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-ink">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
                </li>
              ))}
            </ol>
            <Link href={GRADE} className="mt-8 inline-block">
              <Button>
                Open the grader
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-b border-hairline bg-white py-10 sm:py-16">
          <div className={SHELL}>
            <p className="text-sm font-semibold text-coral">What students say</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Simple English.{" "}
              <span className="text-coral">Real exam worries.</span>
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {SNAP_GRADE_TESTIMONIALS.slice(0, 4).map((t) => (
                <li
                  key={t.name}
                  className="rounded-lg border border-hairline bg-cream/60 p-5"
                >
                  <p className="text-[15px] leading-relaxed text-ink">
                    “{t.quote}”
                  </p>
                  <p className="mt-4 text-sm font-bold text-ink">{t.name}</p>
                  <p className="text-xs font-medium text-muted">{t.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-hairline bg-cream-band py-10 sm:py-14">
          <div className={SHELL}>
            <p className="text-sm font-semibold text-coral">More practice pages</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              Same tool.{" "}
              <span className="text-coral">Your class and subject.</span>
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={snapGradeClusterPath(p.slug)}
                    className="inline-flex rounded-full border border-hairline bg-white px-3.5 py-1.5 text-sm font-semibold text-ink hover:border-ink/30"
                  >
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white py-10 sm:py-16">
          <div className="mx-auto max-w-[900px] px-4 sm:px-6">
            <p className="text-center text-sm font-semibold text-coral">FAQ</p>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Straight answers
            </h2>
            <div className="mt-8 space-y-3">
              {SNAP_GRADE_FAQS.slice(0, 6).map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-lg border border-hairline bg-cream/50 px-5 py-4"
                >
                  <summary className="cursor-pointer text-base font-semibold text-ink">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted">
              Full list on the{" "}
              <Link href="/snapandgrade#faq" className="font-semibold text-coral hover:underline">
                Snap &amp; Grade hub
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
