import {
  LEARN_PYTHON_PATH,
  PYTHON_BEGINNER_LESSONS,
} from "@/lib/learn-python";
import { cn } from "@/lib/utils";
import { ArrowRight, Code2, ListChecks, Terminal } from "lucide-react";
import Link from "next/link";

const hardShadow = "shadow-[4px_4px_0_0_#1c1a17]";
const hardShadowSm = "shadow-[3px_3px_0_0_#1c1a17]";

const highlights = [
  {
    Icon: Code2,
    label: "10 short lessons",
    blurb: "print() to a quiz game",
    bg: "bg-coral",
  },
  {
    Icon: ListChecks,
    label: "500+ questions",
    blurb: "Instant feedback",
    bg: "bg-ink",
  },
  {
    Icon: Terminal,
    label: "Free compiler",
    blurb: "Runs in your browser",
    bg: "bg-sage",
  },
];

export function LearnPythonSpotlight() {
  return (
    <section
      id="learn-python"
      aria-labelledby="learn-python-heading"
      className="bg-cream py-10 short:py-6 shorter:py-4 sm:py-16 short:sm:py-8 lg:py-24 short:lg:py-10"
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            <span className="h-px w-5 bg-muted/50" aria-hidden />
            New on Mentr Learn
          </p>
          <h2
            id="learn-python-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[42px] lg:leading-[1.12]"
          >
            Learn Python{" "}
            <span className="text-coral">free, from line one.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            A beginner Python course for students and first-time coders. No
            60-hour videos — you write code every minute. ₹0, no card.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          {highlights.map(({ Icon, label, blurb, bg }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border-2 border-ink/20 bg-white px-3.5 py-3.5"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white",
                  bg,
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">
                  {label}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted">
                  {blurb}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "mt-8 overflow-hidden rounded-2xl border-2 border-ink bg-white lg:grid lg:grid-cols-2",
            hardShadow,
          )}
        >
          <div className="flex flex-col justify-between bg-butter p-7 sm:p-9 lg:p-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                Python Beginner · live now
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-[32px] sm:leading-[1.15]">
                No coding background needed.
                <span className="mt-1 block text-coral">
                  Build your own quiz game.
                </span>
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">
                Predict what code does, run it, fix it, then write your own.
                Python is what CBSE Class 11–12 Computer Science uses — and
                what real apps, data and AI tools are built with.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={LEARN_PYTHON_PATH}
                className={cn(
                  "inline-flex h-11 items-center gap-1.5 rounded-lg border-2 border-ink bg-coral px-5 text-sm font-bold text-white transition hover:bg-coral-dark",
                  hardShadowSm,
                )}
              >
                Start learning Python
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/openpythoncompiler"
                className={cn(
                  "inline-flex h-11 items-center rounded-lg border-2 border-ink bg-white px-5 text-sm font-bold text-ink transition hover:bg-cream",
                  hardShadowSm,
                )}
              >
                Try the compiler
              </Link>
            </div>
          </div>

          <div className="border-t-2 border-ink bg-white lg:border-l-2 lg:border-t-0">
            <ol className="grid sm:grid-cols-2">
              {PYTHON_BEGINNER_LESSONS.map((lesson) => (
                <li
                  key={lesson.number}
                  className="flex items-center gap-3 border-b border-hairline px-6 py-3.5 sm:px-7 sm:odd:border-r"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cream text-xs font-bold text-ink">
                    {lesson.number}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-ink">
                      {lesson.title}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {lesson.subtitle}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <Link
              href={LEARN_PYTHON_PATH}
              className="flex items-center justify-between px-6 py-4 text-sm font-semibold text-coral hover:underline sm:px-7"
            >
              See the full course
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
