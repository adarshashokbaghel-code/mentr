"use client";

import {
  LpBadge,
  LpBlob,
  LpGridBg,
  LpLiveDot,
  LpStatsBand,
} from "@/components/landing/lp/shared";
import { NcertChapterPdfSection } from "@/components/landing/lp/ncert-chapter-pdfs";
import {
  SnapGradeFinalCta,
  SnapGradeSubjectsCta,
} from "@/components/landing/lp/snap-grade-convert";
import { WaveSeparator } from "@/components/landing/wave-separator";
import {
  SNAP_GRADE_CLUSTERS,
  SNAP_GRADE_FACT_SHEET,
  SNAP_GRADE_FAQS,
  SNAP_GRADE_GUIDES,
  SNAP_GRADE_TESTIMONIALS,
  snapGradeClusterPath,
} from "@/lib/snap-grade-seo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/ui/browser-frame";
import {
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const SHELL = "mx-auto w-full min-w-0 max-w-[1400px] px-4 sm:px-6 lg:px-8";

const MARQUEE = [
  "Class 9 Maths",
  "Class 10 Science",
  "Class 11 Maths",
  "Class 12 Maths",
  "Class 11 Physics",
  "Class 12 Physics",
  "Class 11 Chemistry",
  "Class 12 Chemistry",
  "Class 11 Biology",
  "Class 12 Biology",
  "NCERT exercises",
  "Board papers",
  "PYQ",
  "Sample papers",
  "CBSE step marking",
  "Writing tips",
];

const HOW_STEPS = [
  {
    n: "01",
    title: "Pick the question",
    body: "Class 9–12 → subject → chapter → the exact NCERT, PYQ or sample-paper item. The CBSE-style key is already on it.",
  },
  {
    n: "02",
    title: "Snap the answer you wrote",
    body: "Photograph the page in your notebook. No retyping the sum. One clear photo is enough.",
  },
  {
    n: "03",
    title: "See marks — and how to write it",
    body: "Formula, working, units, final line — scored like the board. Plus a short tip so the next attempt keeps those marks.",
  },
] as const;

const RESULT_LINES = [
  "Step scores against a CBSE-style key",
  "Personalized tip on the line you missed",
  "Full history: question, marks, your text — no photos stored",
  `Usually under ${SNAP_GRADE_FACT_SHEET.latencyTargetSec} seconds`,
];

const VS_ROWS = [
  {
    point: "Marking scheme",
    chatgpt: "You find a PDF and upload it. The AI guesses the steps.",
    mentr: "Every question already has a CBSE-style key.",
  },
  {
    point: "What you get back",
    chatgpt: "A paragraph that “looks right”.",
    mentr: "Marks by step — formula, working, units, final answer.",
  },
  {
    point: "Writing for the exam",
    chatgpt: "Rarely tells you the line the examiner wants.",
    mentr: "A short tip on how to write it so those marks stick.",
  },
  {
    point: "Question bank",
    chatgpt: "Whatever you type that day.",
    mentr: `${SNAP_GRADE_FACT_SHEET.questionCount} NCERT + PYQ + sample papers in one place.`,
  },
  {
    point: "History",
    chatgpt: "Lost in a chat.",
    mentr: "Question, marks, your text, tips — saved on your account.",
  },
] as const;

const STATS = [
  {
    value: SNAP_GRADE_FACT_SHEET.questionCount,
    label: "Questions",
    tint: "bg-lavender",
    icon: BookOpen,
    sub: "NCERT + board practice",
  },
  {
    value: "9–12",
    label: "Classes",
    tint: "bg-butter",
    icon: ClipboardList,
    sub: "CBSE desk",
  },
  {
    value: String(SNAP_GRADE_FACT_SHEET.freeCredits),
    label: "Free credits",
    tint: "bg-sage-wash",
    icon: Sparkles,
    sub: "On new accounts",
  },
  {
    value: `₹${SNAP_GRADE_FACT_SHEET.minTopUpInr}`,
    label: "Min top-up",
    tint: "bg-coral-wash",
    icon: CreditCard,
    sub: "₹1 = 1 credit",
  },
];

function GradeMock() {
  return (
    <BrowserFrame url="mentr.in / snapandgrade / grade">
      <div className="bg-white">
        <div className="flex items-center justify-between border-b border-hairline bg-cream px-4 py-2.5">
          <LpLiveDot label="CBSE key loaded" />
          <span className="text-[10px] font-bold text-muted">Ex 2.3 · Q4</span>
        </div>
        <div className="grid sm:grid-cols-[1fr_1.1fr]">
          <div className="relative min-h-[180px] border-b border-hairline sm:min-h-[260px] sm:border-b-0 sm:border-r">
            <Image
              src="/snapandgrade/hero.png"
              alt="Student photographing a handwritten CBSE NCERT solution to grade"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 360px"
            />
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              As the board marks it
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-ink">
              3<span className="text-muted">/</span>5
            </p>
            <ul className="mt-3 space-y-1.5 text-[12px] font-semibold">
              <li className="flex justify-between rounded-md bg-sage-wash px-2.5 py-1.5 text-sage">
                Formula <span>1/1</span>
              </li>
              <li className="flex justify-between rounded-md bg-sage-wash px-2.5 py-1.5 text-sage">
                Working <span>1/1</span>
              </li>
              <li className="flex justify-between rounded-md bg-coral-wash px-2.5 py-1.5 text-coral-dark">
                Units &amp; last line <span>0/1</span>
              </li>
            </ul>
            <p className="mt-3 border-t border-hairline pt-3 text-[12px] leading-snug text-muted">
              Tip: write the unit next to the final value. That’s the missing
              mark.
            </p>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

export function SnapGradeLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { user, loading: authLoading } = useAuth();
  const gradeHref = "/snapandgrade/grade";
  const primaryLabel = user ? "Grade now" : "Grade a practice answer";

  return (
    <div className="w-full max-w-full overflow-x-clip">
      {/* Hero — same bones as / */}
      <section className="relative overflow-hidden border-b border-hairline bg-cream">
        <LpGridBg />
        <LpBlob
          color="rgba(235,228,255,0.7)"
          size={360}
          className="-left-32 -top-20"
        />
        <LpBlob
          color="rgba(255,241,228,0.8)"
          size={300}
          className="-right-24 bottom-0"
        />

        <div
          className={cn(
            SHELL,
            "relative grid items-center gap-8 py-10 sm:gap-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14 lg:py-24",
          )}
        >
          <div className="space-y-5 text-center sm:space-y-7 lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <LpBadge>
                <ClipboardList className="h-3.5 w-3.5 text-sage" />
                CBSE step marking
              </LpBadge>
              <LpBadge variant="coral">
                <Sparkles className="h-3.5 w-3.5" />
                {SNAP_GRADE_FACT_SHEET.freeCredits} free credits
              </LpBadge>
            </div>

            <p className="text-sm font-semibold text-coral">
              Snap &amp; Grade by Mentr
            </p>
            <h1 className="text-balance text-[1.75rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-[52px] lg:leading-[1.05]">
              Practised the chapter.
              <br />
              <span className="text-coral">Still unsure about marks?</span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
              Grade the answers you already wrote — as per CBSE. Class 9–12
              Maths, Science, Physics, Chemistry and Biology NCERT, plus board
              papers, PYQs and
              sample papers. See the step that lost the mark, and how to write
              it in the exam.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href={gradeHref}>
                <Button size="lg">
                  {authLoading ? "…" : primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#what-it-is">
                <Button size="lg" variant="secondary">
                  What it is
                </Button>
              </a>
            </div>
          </div>

          <GradeMock />
        </div>
      </section>

      <LpStatsBand stats={STATS} />

      <section>
        <div className="relative overflow-hidden border-b border-hairline bg-cream-band">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream-band to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream-band to-transparent sm:w-24" />
          <div className="flex w-max animate-marquee items-center py-3.5">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="inline-flex shrink-0 items-center gap-4 px-4 text-[13px] font-semibold tracking-wide text-ink/80 sm:text-sm"
              >
                {item}
                <span className="h-1 w-1 rounded-full bg-coral/70" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What / how / benefits — awareness for a product nobody knows yet */}
      <section
        id="what-it-is"
        className="scroll-mt-24 border-b border-hairline bg-white py-10 sm:py-16 lg:py-24"
      >
        <div className={SHELL}>
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-3xl lg:text-left">
            <p className="text-sm font-semibold text-coral">What Snap &amp; Grade is</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[40px]">
              A CBSE-style mark sheet{" "}
              <span className="text-coral">for the page you already wrote.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Snap &amp; Grade by Mentr is a paid practice tool (100 free credits
              to start). It is not a tutor. It is not ChatGPT with a PDF. You
              pick a Class 9–12 question, photograph your notebook, and see
              marks the way a board key splits them — plus a short tip on how
              to write it next time.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <article className="rounded-lg border border-hairline bg-cream p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wide text-coral">
                What it is
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">
                Photo in. Step marks out.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
                Every question already has a CBSE-style key — formula, working,
                units, last line. You do not hunt a marking-scheme PDF. You
                grade the answer you practised at home.
              </p>
            </article>
            <article className="rounded-lg border border-hairline bg-lavender p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wide text-coral">
                How to use it
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">
                Three steps on your phone.
              </h3>
              <ol className="mt-3 space-y-2 text-sm leading-relaxed text-muted sm:text-[15px]">
                <li>
                  <span className="font-semibold text-ink">1.</span> Pick class,
                  subject, chapter, then the exact question.
                </li>
                <li>
                  <span className="font-semibold text-ink">2.</span> Snap a
                  clear photo of your working. Confirm the text.
                </li>
                <li>
                  <span className="font-semibold text-ink">3.</span> See which
                  step kept the mark — and how to write it in the exam.
                </li>
              </ol>
            </article>
            <article className="rounded-lg border border-hairline bg-sage-wash p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wide text-sage">
                How it helps
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">
                Know the score tonight.
              </h3>
              <ul className="mt-3 space-y-2 text-sm font-medium text-ink sm:text-[15px]">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  Stop guessing marks before boards
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  See the step that lost easy marks
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  Learn the sentence the examiner wants
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  {SNAP_GRADE_FACT_SHEET.questionCount} questions ·{" "}
                  {SNAP_GRADE_FACT_SHEET.freeCredits} free credits
                </li>
              </ul>
            </article>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-cream px-5 py-5 sm:flex-row sm:px-7">
            <p className="text-center text-[15px] font-bold text-ink sm:text-left">
              New to this?{" "}
              <span className="text-coral">
                Start with {SNAP_GRADE_FACT_SHEET.freeCredits} free credits.
              </span>
            </p>
            <Link href={gradeHref} className="shrink-0">
              <Button size="lg">
                {authLoading ? "…" : primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why marks — lavender band like / how-it-works */}
      <section id="why-marks" className="scroll-mt-24 py-10 sm:py-16 lg:py-24">
        <div className={SHELL}>
          <div className="overflow-hidden rounded-lg bg-lavender">
            <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <div className="border-b border-hairline/60 p-6 sm:p-10 lg:border-b-0 lg:border-r">
                <span className="inline-flex rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral">
                  The quiet mark leak
                </span>
                <p className="mt-5 text-5xl font-bold tracking-tight text-ink sm:text-6xl">
                  3 in 10
                </p>
                <p className="mt-4 text-lg font-semibold leading-snug text-ink">
                  students lose marks because they don’t know{" "}
                  <span className="text-coral">how to write</span> the answer —
                  not because they don’t know the idea.
                </p>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <p className="text-base leading-relaxed text-muted sm:text-lg">
                  You solved it at home. In the paper, a step, a unit, or the
                  last line is missing — and the examiner cuts it. Snap &amp;
                  Grade grades your practice the CBSE way, then shows the
                  sentence that would have kept the mark. Don’t worry about
                  marks first. Learn how to write them.
                </p>
                <Link href={gradeHref} className="mt-6 inline-block">
                  <Button size="sm">
                    Grade a practice answer
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How — numbered path, not 3 hover cards */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-y border-hairline bg-white py-10 sm:py-16 lg:py-24"
      >
        <div className={SHELL}>
          <div className="flex flex-col gap-4 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <p className="text-sm font-semibold text-coral">
                Study · practise · grade
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[40px]">
                From your notebook{" "}
                <span className="text-coral">to a mark sheet.</span>
              </h2>
            </div>
            <p className="mx-auto max-w-md text-base text-muted lg:mx-0 lg:text-right">
              Solve on paper like the exam. Snap it. We mark the steps — and
              tell you how to write the next one.
            </p>
          </div>

          <ol className="mt-12 grid gap-0 overflow-hidden rounded-lg border border-hairline bg-cream lg:grid-cols-3">
            {HOW_STEPS.map((step, i) => (
              <li
                key={step.n}
                className={cn(
                  "p-6 sm:p-8",
                  i < HOW_STEPS.length - 1 &&
                    "border-b border-hairline lg:border-b-0 lg:border-r",
                )}
              >
                <span className="font-mono text-xs font-bold text-coral">
                  {step.n}
                </span>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-cream px-5 py-5 sm:flex-row sm:px-7">
            <p className="text-center text-[15px] font-bold text-ink sm:text-left">
              Have a chapter done?{" "}
              <span className="text-coral">Grade it in under a minute.</span>
            </p>
            <Link href={gradeHref} className="shrink-0">
              <Button size="lg">
                {authLoading ? "…" : primaryLabel}
                <Camera className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SnapGradeSubjectsCta />

      {/* Result — sage band + browser, home faculty style */}
      <section className="bg-sage-wash py-10 sm:py-16 lg:py-24">
        <div
          className={cn(SHELL, "grid items-center gap-10 lg:grid-cols-2 lg:gap-14")}
        >
          <div>
            <span className="inline-flex rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-sage">
              What comes back
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[40px]">
              Marks the way{" "}
              <span className="text-coral">the board awards them.</span>
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Not a green tick. A split of the question — and a tip written for
              your attempt, so the next paper doesn’t leak the same mark.
            </p>
            <ul className="mt-6 space-y-3">
              {RESULT_LINES.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm font-medium text-ink">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-sage">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <BrowserFrame
            url="mentr.in / snapandgrade / result"
            headerClassName="bg-sage-wash"
          >
            <Image
              src="/snapandgrade/result-ui.png"
              alt="Snap & Grade result with CBSE step marks and a writing tip"
              width={960}
              height={720}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 640px"
            />
          </BrowserFrame>
        </div>
      </section>

      <WaveSeparator className="bg-sage-wash" />

      {/* Coverage — ink like Zero Fees */}
      <section
        id="coverage"
        className="scroll-mt-24 bg-ink py-10 text-white sm:py-16 lg:py-24"
      >
        <div className={cn(SHELL, "grid gap-10 lg:grid-cols-2 lg:gap-16")}>
          <div>
            <p className="text-sm font-semibold text-butter">
              One place for exam practice
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
              NCERT, PYQ, sample papers.{" "}
              <span className="text-coral">Full marking.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              Class 9–12. Study the chapter PDF, practise the question, grade
              the page you wrote. Board papers and sample papers sit next to
              NCERT — same CBSE step keys.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/85">
              <li className="flex gap-2">
                <span className="text-coral">→</span>
                NCERT first — Maths and Science live for Class 9–12.
              </li>
              <li className="flex gap-2">
                <span className="text-coral">→</span>
                Class 10–12 papers and sample questions in the same grader.
              </li>
              <li className="flex gap-2">
                <span className="text-coral">→</span>
                We show the step the examiner wants on the page — so confidence
                isn’t a guess.
              </li>
            </ul>
          </div>
          <BrowserFrame
            url="mentr.in / snapandgrade / bank"
            headerClassName="bg-white/10"
            className="border-white/20 bg-ink shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          >
            <Image
              src="/snapandgrade/marking-key.png"
              alt="CBSE-style marking key next to an NCERT chapter list"
              width={960}
              height={720}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 640px"
            />
          </BrowserFrame>
        </div>
      </section>

      {/* vs AI — BrowserFrame table like / zero fees */}
      <section
        id="vs-ai"
        className="scroll-mt-24 border-b border-hairline bg-cream py-10 sm:py-16 lg:py-24"
      >
        <div className={cn(SHELL, "grid items-center gap-10 lg:grid-cols-2 lg:gap-16")}>
          <div>
            <p className="text-sm font-semibold text-coral">ChatGPT vs Mentr</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px]">
              Don’t upload a marking scheme.{" "}
              <span className="text-coral">We already have it.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Other AI needs you to find a key, photograph it, and hope. Snap
              &amp; Grade marks against the CBSE split already on the question.
            </p>
          </div>
          <BrowserFrame url="mentr.in / snapandgrade / vs-chatgpt">
            <div className="overflow-x-auto bg-white text-ink">
              <div className="grid min-w-[520px] grid-cols-3 border-b border-hairline bg-cream text-center text-[12px] font-semibold">
                <div className="px-2 py-3 text-muted">Compare</div>
                <div className="border-x border-hairline px-2 py-3 text-muted">
                  ChatGPT &amp; other AI
                </div>
                <div className="px-2 py-3 text-coral">Snap &amp; Grade</div>
              </div>
              {VS_ROWS.map((row) => (
                <div
                  key={row.point}
                  className="grid min-w-[520px] grid-cols-3 border-b border-hairline last:border-b-0"
                >
                  <div className="px-3 py-3.5 text-sm font-semibold">
                    {row.point}
                  </div>
                  <div className="flex items-start gap-2 border-x border-hairline px-3 py-3.5 text-[13px] text-muted">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                    {row.chatgpt}
                  </div>
                  <div className="flex items-start gap-2 px-3 py-3.5 text-[13px] font-medium">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    {row.mentr}
                  </div>
                </div>
              ))}
            </div>
          </BrowserFrame>
        </div>
      </section>

      {/* Confidence — one line list, no icon cards */}
      <section className="bg-white py-10 sm:py-16">
        <div className={SHELL}>
          <div className="rounded-lg border border-hairline bg-cream px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-sm font-semibold text-coral">
              Confidence, not guesswork
            </p>
            <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
              You won’t lose marks{" "}
              <span className="text-coral">just because of steps.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted">
              Everything in one place: the question, the key, your attempt, the
              mark, the tip. Practise until the writing is as sure as the
              method.
            </p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink">
              <span>Know the score tonight</span>
              <span className="text-coral">·</span>
              <span>Learn the exam sentence</span>
              <span className="text-coral">·</span>
              <span>Tips on your attempt</span>
              <span className="text-coral">·</span>
              <span>History you can reopen</span>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials — no review schema; early-user quotes */}
      <section
        id="testimonials"
        className="scroll-mt-24 border-t border-hairline bg-cream py-10 sm:py-16 lg:py-24"
      >
        <div className={SHELL}>
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="text-sm font-semibold text-coral">
              What students and parents say
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[40px]">
              “I knew the method.{" "}
              <span className="text-coral">I still lost the mark.”</span>
            </h2>
            <p className="mt-3 text-base text-muted">
              Simple English from Class 9–12 desks across India — the same
              worry Snap &amp; Grade is built for.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SNAP_GRADE_TESTIMONIALS.map((t) => (
              <li
                key={t.name}
                className="flex flex-col rounded-lg border border-hairline bg-white p-5 sm:p-6"
              >
                <p className="flex-1 text-[15px] leading-relaxed text-ink">
                  “{t.quote}”
                </p>
                <p className="mt-5 text-sm font-bold text-ink">{t.name}</p>
                <p className="text-xs font-medium text-muted">{t.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing — home CTA two-panel, not 3 twin cards */}
      <section
        id="credits"
        className="scroll-mt-24 border-t border-hairline bg-cream-band py-10 sm:py-16 lg:py-24"
      >
        <div className={SHELL}>
          <div className="mb-8 max-w-2xl text-center sm:mb-10 lg:text-left">
            <p className="text-sm font-semibold text-coral">Simple credits</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Start free. <span className="text-coral">Top up from ₹1.</span>
            </h2>
            <p className="mt-3 text-base text-muted sm:text-lg">
              {SNAP_GRADE_FACT_SHEET.freeCredits} free credits once. Then ₹1 = 1
              credit — even a single rupee. A full grade uses about{" "}
              {SNAP_GRADE_FACT_SHEET.creditsPerEval} credits.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col rounded-lg border border-hairline bg-white p-5 sm:p-7 lg:p-9">
              <span className="text-xs font-bold uppercase tracking-wider text-coral">
                Start free
              </span>
              <p className="mt-3 text-4xl font-bold tracking-tight text-ink">
                ₹0
              </p>
              <p className="mt-1 text-sm font-semibold text-muted">
                {SNAP_GRADE_FACT_SHEET.freeCredits} credits · once per account
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Enough to see how CBSE splits marks on your own notebook. ~
                {Math.floor(
                  SNAP_GRADE_FACT_SHEET.freeCredits /
                    SNAP_GRADE_FACT_SHEET.creditsPerEval,
                )}{" "}
                full grades.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink">
                <li className="flex gap-2">
                  <span className="text-coral">→</span> NCERT + board-style
                  questions
                </li>
                <li className="flex gap-2">
                  <span className="text-coral">→</span> Step marks + writing
                  tips
                </li>
                <li className="flex gap-2">
                  <span className="text-coral">→</span> History saved on your
                  account
                </li>
              </ul>
              <Link href={gradeHref} className="mt-8">
                <Button size="lg" className="w-full sm:w-auto">
                  Grade a practice answer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-col rounded-lg border border-ink bg-ink p-5 text-white sm:p-7 lg:p-9">
              <span className="text-xs font-bold uppercase tracking-wider text-butter">
                Most used · Practice
              </span>
              <p className="mt-3 text-4xl font-bold tracking-tight">₹100</p>
              <p className="mt-1 text-sm font-semibold text-white/60">
                100 credits · ₹1 each · ~20 full grades
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                The pack most students top up when free credits run out. Same
                CBSE step keys. Personalized tips on each grade.
              </p>
              <div className="mt-5 space-y-3 border-t border-white/15 pt-5 text-sm text-white/80">
                <p>
                  <span className="font-bold text-white">Board season · ₹200</span>
                  {" — "}
                  200 credits for the weeks before boards. PYQ, sample paper,
                  NCERT, same place.
                </p>
                <p className="flex items-center gap-2 text-white/55">
                  <CreditCard className="h-4 w-4" />
                  Razorpay · any amount from ₹1
                </p>
              </div>
              <Link href={gradeHref} className="mt-8">
                <Button
                  size="lg"
                  className="w-full bg-butter text-ink hover:bg-butter-deep sm:w-auto"
                >
                  Get 100 credits
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — home lavender accordion */}
      <section
        id="faq"
        className="scroll-mt-24 bg-lavender py-10 sm:py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-coral">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Straight answers{" "}
              <span className="text-coral">before you start.</span>
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {SNAP_GRADE_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-lg border border-hairline bg-white shadow-sm"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-cream"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-ink">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen ? (
                    <div className="border-t border-hairline bg-butter/40 px-5 py-4">
                      <p className="text-base leading-relaxed text-muted">
                        {faq.answer}
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Class / subject landings + blogs */}
      <section
        id="practice-pages"
        className="scroll-mt-24 border-b border-hairline bg-white py-10 sm:py-16 lg:py-24"
      >
        <div className={SHELL}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-coral">
                Class and subject pages
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[40px]">
                Same tool.{" "}
                <span className="text-coral">Your paper.</span>
              </h2>
              <p className="mt-3 text-base text-muted">
                Short pages for Class 9–12 Maths, Science, Physics, CBSE
                marking, and NCERT photo grading — then open the grader.
              </p>
            </div>
            <Link href="/blog/category/exam-prep" className="shrink-0">
              <Button variant="secondary">Exam-prep guides</Button>
            </Link>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SNAP_GRADE_CLUSTERS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={snapGradeClusterPath(p.slug)}
                  className="flex h-full flex-col rounded-lg border border-hairline bg-cream px-4 py-4 hover:border-ink/30"
                >
                  <span className="text-xs font-semibold text-coral">
                    {p.eyebrow.replace("Snap & Grade · ", "")}
                  </span>
                  <span className="mt-1 text-sm font-bold leading-snug text-ink">
                    {p.h1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-hairline pt-10">
            <p className="text-sm font-semibold text-coral">Guides</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              Read first.{" "}
              <span className="text-coral">Then grade a page.</span>
            </h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {SNAP_GRADE_GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/blog/${g.slug}`}
                    className="flex h-full flex-col rounded-lg border border-hairline bg-white px-4 py-4 hover:border-coral/40"
                  >
                    <span className="text-sm font-bold leading-snug text-ink">
                      {g.title}
                    </span>
                    <span className="mt-2 text-xs leading-relaxed text-muted">
                      {g.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <NcertChapterPdfSection />

      <SnapGradeFinalCta
        primaryLabel={authLoading ? "…" : primaryLabel}
        primaryHref={gradeHref}
        secondaryLabel="See credits"
        secondaryHref="#credits"
      />
    </div>
  );
}
