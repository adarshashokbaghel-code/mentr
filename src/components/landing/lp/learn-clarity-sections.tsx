import { LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
import {
  LEARN_GEO_SEGMENTS,
  learnCopyFor,
  type LearnGeo,
} from "@/lib/learn-landing-copy";
import { cn } from "@/lib/utils";
import {
  Blocks,
  BookOpen,
  Check,
  ClipboardList,
  GraduationCap,
  Mail,
  Puzzle,
  School,
  Users,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { LearnStartButton } from "./learn-start-button";
import { LEARN_SHELL } from "./learn-shell";
import { hardShadowSm, SectionHeader } from "./shared";

const AVAILABLE_TODAY = [
  {
    title: "Narrated lessons",
    body: "Short videos kids can follow without heavy reading. New modules unlock as the free syllabus rolls out.",
    icon: Video,
    tint: "bg-coral-wash text-coral",
  },
  {
    title: "Quiz after each idea",
    body: "Practice questions with instant feedback so the concept sticks before they move on.",
    icon: ClipboardList,
    tint: "bg-sage-wash text-sage",
  },
  {
    title: "Build Arena",
    body: "Block-based missions — sequence, maze, and story builds kids can finish in one sitting.",
    icon: Blocks,
    tint: "bg-lavender text-ink",
  },
  {
    title: "Practice + POTD",
    body: "Extra question bank plus a Problem of the Day to keep a light daily habit.",
    icon: Puzzle,
    tint: "bg-butter/70 text-ink",
  },
] as const;

const FOR_ITEMS = [
  {
    title: "Class 3–5 kids (about 8–11)",
    body: "One shared foundation track in CS, AI literacy, and math-for-coding.",
    icon: GraduationCap,
  },
  {
    title: "Parents at home",
    body: "Enroll with parent email only — no card. Progress saves to the parent account.",
    icon: Users,
  },
  {
    title: "Teachers & tuition centres",
    body: "Share the free syllabus as a warm-up or homework habit — no centre kit required.",
    icon: School,
  },
] as const;

const NOT_FOR_ITEMS = [
  "Typed Python / HTML yet",
  "Competitive coding contests",
  "Replacing school textbooks",
  "Live class required every day",
] as const;

const COMPARE_ROWS: {
  label: string;
  other: string;
  mentr: string;
  highlight?: boolean;
}[] = [
  {
    label: "Price",
    other: "Trials → paid apps",
    mentr: "₹0 forever · Class 3–5",
    highlight: true,
  },
  {
    label: "What kids learn",
    other: "Skins, loot, thin “coding” games",
    mentr: "CS · AI · Math foundations",
  },
  {
    label: "Daily habit",
    other: "Open-ended play, little structure",
    mentr: "Video → quiz → Build / POTD",
  },
  {
    label: "Mentors / tutors",
    other: "Upsell live class to keep learning",
    mentr: "Self-paced free; tutor optional later",
  },
  {
    label: "UI priority",
    other: "Hi-fi flash first",
    mentr: "Clear teaching first — no fluff",
  },
];

const ENROLL_STEPS = [
  {
    title: "Open free enroll",
    body: "Go to Get started — list price shows ₹999, charged as ₹0 for Class 3–5.",
  },
  {
    title: "Verify parent email",
    body: "OTP to the parent inbox. Faculty/tutor logins are asked to continue as a parent.",
  },
  {
    title: "Open the learning app",
    body: "Kids start lessons, Build, Practice, and POTD. You can download a ₹0 enrollment receipt.",
  },
] as const;

export function LearnClaritySections({ geo = "global" }: { geo?: LearnGeo }) {
  const copy = learnCopyFor(geo);

  return (
    <>
      {/* Available today + syllabus roadmap */}
      <section id="available-today" className="border-y border-hairline bg-white py-10 sm:py-16 lg:py-20">
        <div className={LEARN_SHELL}>
          <SectionHeader
            eyebrow="Clear offer"
            title="What’s available today"
            accent="— and the full syllabus ahead."
            description={`Mentr Learn is ₹0 forever with a 60-module Class 3–5 syllabus. Below is what families can use now, while more narrated modules keep shipping. ${copy.clarityNote}`}
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AVAILABLE_TODAY.map(({ title, body, icon: Icon, tint }) => (
              <article
                key={title}
                className={cn("rounded-xl border-2 border-ink/10 bg-cream/40 p-5", hardShadowSm)}
              >
                <span
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink",
                    tint,
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-base font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </article>
            ))}
          </div>

          <div
            className={cn(
              "mt-6 flex flex-col gap-4 rounded-xl border-2 border-ink bg-butter/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
              hardShadowSm,
            )}
          >
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                Full syllabus · roadmap
              </p>
              <p className="mt-1 text-lg font-bold text-ink sm:text-xl">
                60 modules · CS · AI · Math — free for Class 3–5
              </p>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                The complete map is published for parents. Unit challenges (Boss-style) and weekly
                parent email summaries are rolling out — progress, streaks, and XP are already in the
                app.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <Link
                href="/learn/syllabus"
                className="inline-flex h-11 items-center justify-center rounded-md border-2 border-ink bg-white px-5 text-sm font-bold text-ink hover:bg-cream"
              >
                Parent syllabus
              </Link>
              <Link
                href="/blog/mentr-learn-class-3-5-syllabus-explained"
                className="text-sm font-semibold text-coral hover:underline"
              >
                Syllabus explained →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for + vs other platforms */}
      <section id="who-its-for" className="bg-cream py-10 sm:py-16 lg:py-20">
        <div className={LEARN_SHELL}>
          <SectionHeader
            eyebrow="Audience"
            title="Built for foundation,"
            accent="not flashy traps."
            description="For Class 3–5 families and educators who want clear free teaching — CS, AI, and math — not another paid kids app dressed up as coding."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {FOR_ITEMS.map(({ title, body, icon: Icon }) => (
              <article
                key={title}
                className={cn(
                  "rounded-xl border-2 border-ink bg-white p-5",
                  hardShadowSm,
                )}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-sage-wash text-sage">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-base font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </article>
            ))}
          </div>

          {/* Comparison — landing-style delta table */}
          <div
            className={cn(
              "mt-8 overflow-hidden rounded-2xl border-2 border-ink bg-white",
              hardShadowSm,
            )}
          >
            <div className="grid border-b-2 border-ink lg:grid-cols-[minmax(0,1fr)_1.15fr]">
              <div className="relative overflow-hidden bg-lavender/60 p-5 sm:p-7 lg:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  Why not another kids coding app
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Teaching first.
                  <span className="mt-1 block text-coral">No hi-fi fluff.</span>
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
                  Many platforms lead with flashy skins and soft “coding” games,
                  then push a paid live class. Mentr Learn ships a free syllabus,
                  narrated lessons, quizzes, and Build — what is taught matters
                  more than chrome. Mentors stay optional on Mentr later.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {["₹0 forever", "Syllabus published", "Tutor optional"].map(
                    (t) => (
                      <li
                        key={t}
                        className="rounded-md border border-ink/15 bg-white px-2.5 py-1 text-[11px] font-bold text-ink"
                      >
                        {t}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className="overflow-x-auto border-t-2 border-ink lg:border-l-2 lg:border-t-0">
                <table className="w-full min-w-[28rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-hairline bg-cream/80">
                      <th className="w-[24%] px-3 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted sm:px-5">
                        Parameter
                      </th>
                      <th className="w-[38%] px-3 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted sm:px-5">
                        Typical kids apps
                      </th>
                      <th className="w-[38%] px-3 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-sage sm:px-5">
                        Mentr Learn
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_ROWS.map((row, i) => (
                      <tr
                        key={row.label}
                        className={cn(
                          i < COMPARE_ROWS.length - 1 &&
                            "border-b border-hairline",
                          row.highlight && "bg-coral-wash/35",
                        )}
                      >
                        <th
                          scope="row"
                          className="align-top px-3 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-muted sm:px-5"
                        >
                          {row.label}
                        </th>
                        <td className="align-top px-3 py-4 text-sm text-muted line-through decoration-muted/50 sm:px-5">
                          {row.other}
                        </td>
                        <td className="align-top px-3 py-4 text-sm font-bold text-ink sm:px-5">
                          <span className="inline-flex items-start gap-1.5">
                            <Check
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage"
                              aria-hidden
                            />
                            {row.mentr}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div
              className={cn(
                "rounded-xl border-2 border-ink/12 bg-white/90 p-5 sm:p-6",
                hardShadowSm,
              )}
            >
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-coral" aria-hidden />
                <h3 className="text-base font-bold text-ink">Not this track if you need</h3>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {NOT_FOR_ITEMS.map((label) => (
                  <li
                    key={label}
                    className="flex items-center gap-2.5 rounded-lg bg-coral-wash/50 px-3 py-2.5 text-sm text-ink/80"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-coral">
                      <X className="h-3 w-3" aria-hidden />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Class 6–8 with deeper block-to-text coding is on the roadmap.{" "}
                <Link
                  href="/learn/syllabus"
                  className="font-semibold text-ink underline-offset-2 hover:underline"
                >
                  See what’s in / out of the syllabus
                </Link>
                .
              </p>
            </div>

            <div
              className={cn(
                "flex flex-col justify-between rounded-xl border-2 border-ink bg-butter/55 p-5 sm:p-6",
                hardShadowSm,
              )}
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  Mentors when you want them
                </p>
                <h3 className="mt-2 text-lg font-bold text-ink sm:text-xl">
                  Learn free. Tutor later — optional.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Finish the foundation alone. If your child wants a live human
                  for school or exams, browse verified tutors on Mentr — ₹0
                  platform fee. Never required to use Learn.
                </p>
              </div>
              <Link
                href="/parents"
                className="mt-5 inline-flex h-11 w-fit items-center justify-center rounded-md border-2 border-ink bg-white px-5 text-sm font-bold text-ink hover:bg-cream"
              >
                Browse tutors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How enroll works */}
      <section id="how-enroll" className="border-y border-hairline bg-white py-10 sm:py-16 lg:py-20">
        <div className={LEARN_SHELL}>
          <SectionHeader
            eyebrow="Get started"
            title="How free enroll works"
            description="Three steps. Parent email only. No credit card."
          />

          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {ENROLL_STEPS.map((step, i) => (
              <li
                key={step.title}
                className={cn("rounded-xl border-2 border-ink/10 bg-cream/50 p-5", hardShadowSm)}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-coral text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <LearnStartButton href={LEARN_SIGNUP_HREF}>Get started for free</LearnStartButton>
            <Link
              href={
                geo === "uae"
                  ? "/blog/coding-for-kids-dubai-uae-online"
                  : geo === "australia"
                    ? "/blog/coding-for-kids-australia-online"
                    : geo === "sri-lanka"
                      ? "/blog/coding-for-kids-sri-lanka-online"
                      : geo === "pakistan"
                        ? "/blog/coding-for-kids-pakistan-online"
                        : "/blog/free-coding-course-for-kids-india"
              }
              className="text-sm font-semibold text-muted hover:text-ink hover:underline"
            >
              {geo === "global" || geo === "india"
                ? "Free coding course guide (India) →"
                : `Coding for kids · ${copy.regionLabel} →`}
            </Link>
          </div>

          <nav
            aria-label="Mentr Learn regions"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <Link
              href="/learn"
              className={cn(
                "rounded-md border px-2.5 py-1 text-[11px] font-bold",
                geo === "global"
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 bg-white text-muted hover:border-ink/30 hover:text-ink",
              )}
            >
              Worldwide
            </Link>
            {LEARN_GEO_SEGMENTS.map((segment) => {
              const region = learnCopyFor(segment);
              const active = geo === segment;
              return (
                <Link
                  key={segment}
                  href={region.path}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-[11px] font-bold",
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-ink/15 bg-white text-muted hover:border-ink/30 hover:text-ink",
                  )}
                >
                  {region.regionLabel}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Soft tutor handoff */}
      <section id="optional-tutor" className="bg-[#fffdf8] py-10 sm:py-14 lg:py-16">
        <div className={LEARN_SHELL}>
          <div
            className={cn(
              "grid gap-6 rounded-2xl border-2 border-ink/10 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center",
              hardShadowSm,
            )}
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                Optional later
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Need a live tutor after the free foundation?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                Learn stays self-paced and free. When your child wants human help for school projects
                or exams, you can browse verified tutors on Mentr — no requirement to book one to use
                Learn.
              </p>
              <ul className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-muted sm:text-sm">
                <li className="inline-flex items-center gap-1.5 rounded-md bg-cream px-2.5 py-1">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  Free path first
                </li>
                <li className="inline-flex items-center gap-1.5 rounded-md bg-cream px-2.5 py-1">
                  <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                  Tutor optional
                </li>
                <li className="inline-flex items-center gap-1.5 rounded-md bg-cream px-2.5 py-1">
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  Parent-gated account
                </li>
              </ul>
            </div>
            <Link
              href="/parents"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-cream px-6 text-sm font-bold text-ink transition hover:bg-butter/60"
            >
              Browse tutors
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
