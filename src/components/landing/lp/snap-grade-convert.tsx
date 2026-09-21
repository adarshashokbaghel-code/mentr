"use client";

import { Button } from "@/components/ui/button";
import { SNAP_GRADE_FACT_SHEET } from "@/lib/snap-grade-seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Atom,
  BookOpen,
  Camera,
  Check,
  Dna,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const SHELL =
  "mx-auto w-full min-w-0 max-w-[1400px] px-4 sm:px-6 lg:px-8";

const SUBJECTS = [
  {
    label: "Mathematics",
    detail: "Classes 9–12 · every NCERT exercise",
    icon: BookOpen,
    href: "/snapandgrade/grade",
  },
  {
    label: "Science",
    detail: "Classes 9–10 · chapter exercises",
    icon: FlaskConical,
    href: "/snapandgrade/grade",
  },
  {
    label: "Physics",
    detail: "Classes 11–12 · Part I & II",
    icon: Atom,
    href: "/snapandgrade/grade",
  },
  {
    label: "Chemistry",
    detail: "Classes 11–12 · Part I & II",
    icon: FlaskConical,
    href: "/snapandgrade/grade",
  },
  {
    label: "Biology",
    detail: "Classes 11–12 · full textbook",
    icon: Dna,
    href: "/snapandgrade/grade",
  },
] as const;

const TRUST = [
  `${SNAP_GRADE_FACT_SHEET.freeCredits} free credits once`,
  "CBSE-style step marks",
  "Writing tip on every grade",
  "PDFs on the same page",
] as const;

/**
 * Mid-funnel subject strip — used on landing + grade pages.
 */
export function SnapGradeSubjectsCta({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "border-t border-hairline bg-white",
        compact ? "py-8 sm:py-10" : "py-10 sm:py-16 lg:py-20",
        className,
      )}
    >
      <div className={SHELL}>
        <div className="flex flex-col gap-3 text-center sm:gap-4 lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="mx-auto max-w-xl lg:mx-0">
            <p className="text-sm font-semibold text-coral">Pick a bank · grade tonight</p>
            <h2
              className={cn(
                "mt-2 font-bold tracking-tight text-ink",
                compact
                  ? "text-xl sm:text-2xl"
                  : "text-2xl sm:text-3xl lg:text-[36px]",
              )}
            >
              Maths, Science, Physics, Chemistry, Biology —{" "}
              <span className="text-coral">same CBSE flow.</span>
            </h2>
          </div>
          <p className="mx-auto max-w-sm text-[14px] text-muted lg:mx-0 lg:text-right">
            Open the question you practised. Snap the page. See which step kept
            the mark.
          </p>
        </div>

        <ul className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4">
          {SUBJECTS.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                className="group flex h-full items-start gap-3 rounded-2xl border border-ink/10 bg-[#faf7f2] px-4 py-4 transition hover:border-ink/30 hover:bg-cream sm:px-5 sm:py-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-coral ring-1 ring-ink/8">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-[15px] font-extrabold text-ink">
                    {s.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-muted">
                    {s.detail}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-coral group-hover:gap-1.5">
                    Grade now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Strong conversion band — ink panel with primary CTA.
 */
export function SnapGradeFinalCta({
  primaryLabel = "Grade a practice answer",
  primaryHref = "/snapandgrade/grade",
  onPrimaryClick,
  secondaryLabel,
  secondaryHref,
  compact,
  className,
}: {
  primaryLabel?: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-hairline bg-ink text-white",
        compact ? "py-10 sm:py-12" : "py-12 sm:py-16 lg:py-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-coral/30 blur-3xl"
      />

      <div
        className={cn(
          SHELL,
          "relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10",
        )}
      >
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-butter">
            <Sparkles className="h-3.5 w-3.5" />
            {SNAP_GRADE_FACT_SHEET.freeCredits} free credits · from ₹
            {SNAP_GRADE_FACT_SHEET.minTopUpInr}
          </p>
          <h2
            className={cn(
              "mt-3 font-bold tracking-tight",
              compact
                ? "text-2xl sm:text-3xl"
                : "text-2xl sm:text-3xl lg:text-[40px] lg:leading-[1.1]",
            )}
          >
            Don’t guess your score.
            <br />
            <span className="text-coral">Grade the page you wrote.</span>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70 sm:text-base">
            CBSE-style step marks on NCERT Maths, Science, Physics, Chemistry
            and Biology — plus a short tip so the next attempt keeps those
            marks.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {TRUST.map((t) => (
              <li
                key={t}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/80"
              >
                <Check className="h-3.5 w-3.5 text-sage" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          {onPrimaryClick ? (
            <button
              type="button"
              onClick={onPrimaryClick}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-coral px-6 text-[15px] font-bold text-white hover:bg-coral-dark sm:w-auto"
            >
              {primaryLabel}
              <Camera className="h-4 w-4" />
            </button>
          ) : (
            <Link href={primaryHref} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-coral text-white hover:bg-coral-dark sm:w-auto"
              >
                {primaryLabel}
                <Camera className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {secondaryLabel && secondaryHref ? (
            <Link href={secondaryHref} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full border-white/25 bg-white/10 text-white hover:bg-white/15 sm:w-auto"
              >
                {secondaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Compact strip for Grade now — reminds guests / low-intent users to act.
 */
export function SnapGradeInlineConvert({
  loggedIn,
  onLogin,
  className,
}: {
  loggedIn: boolean;
  onLogin?: () => void;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-t border-hairline bg-gradient-to-b from-[#fff4e6] to-cream py-8 sm:py-10",
        className,
      )}
    >
      <div
        className={cn(
          SHELL,
          "flex flex-col items-start gap-4 rounded-2xl border border-ink/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
        )}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-coral">
            Ready when you are
          </p>
          <p className="mt-1 text-[16px] font-extrabold tracking-tight text-ink sm:text-lg">
            {loggedIn
              ? "Upload a clear photo of your working — credits only charge on confirm."
              : `Log in once · ${SNAP_GRADE_FACT_SHEET.freeCredits} free credits · grade tonight.`}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            Formula · working · units · final line — scored like the board.
          </p>
        </div>
        {loggedIn ? (
          <a
            href="#ncert-maths-pdfs"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-ink/15 px-4 text-[13px] font-bold text-ink hover:border-ink/30"
          >
            Open chapter PDFs
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <button
            type="button"
            onClick={onLogin}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-coral px-5 text-[13px] font-bold text-white hover:bg-coral-dark"
          >
            Log in to grade
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}
