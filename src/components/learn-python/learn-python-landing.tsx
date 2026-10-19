import {
  LEARN_PYTHON_FAQS,
  LEARN_PYTHON_TUTOR_HREF,
  PYTHON_ASSESSMENT,
  PYTHON_BEGINNER_LESSONS,
  PYTHON_COMPARE_COLUMNS,
  PYTHON_COMPARE_ROWS,
  PYTHON_FINAL_HINTS,
  PYTHON_LESSON_LOOP,
  PYTHON_METHOD,
  PYTHON_OFFER,
  PYTHON_OLD_VS_NEW,
  PYTHON_TRACKS,
  WHY_PYTHON,
  type CompareTone,
  type PythonLesson,
  type PythonTier,
} from "@/lib/learn-python";
import {
  PYTHON_INTERMEDIATE_CAPSTONE,
  PYTHON_INTERMEDIATE_LESSONS,
} from "@/lib/learn-python-intermediate";
import { PY_LMS_INTERMEDIATE, PY_LMS_PATH_TEST } from "@/lib/python-lms";
import { pyTrackTheme } from "@/lib/python-lms/track-theme";
import { COMPILER_PATHS, howItWorksPath } from "@/lib/compilers/paths";
import { PY_CERT_COURSE, PY_CERT_RULES, studyLessons } from "@/lib/python-lms/certificate";
import type { PyCertificate } from "@/lib/python-lms/sync-client";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Download,
  Lock,
  Minus,
  Plus,
  Share2,
  X,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CertificateArt } from "./lms/py-certificate";
import { PythonBadge } from "./python-badge";
import { PythonStartButton } from "./python-start-button";
import { PythonCode, PythonTerminal, type TerminalLine } from "./python-code";

const SHELL = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const QUIZ_RUN: TerminalLine[] = [
  { text: "PYTHON QUIZ", tone: "title" },
  { text: "" },
  { text: "Question 1: What does print() do?", tone: "muted" },
  { text: "> display text", tone: "prompt" },
  { text: "Correct!", tone: "ok" },
  { text: "" },
  { text: "Question 2: Which symbol compares two values?", tone: "muted" },
  { text: "> ==", tone: "prompt" },
  { text: "Correct!", tone: "ok" },
  { text: "" },
  { text: "Your score: 8/10" },
  { text: "Excellent work!", tone: "ok" },
];

const COMPILER_RUN: TerminalLine[] = [
  { text: "▶ Run main.py", tone: "title" },
  { text: "" },
  { text: "What is your name? Aarav", tone: "prompt" },
  { text: "How old are you? 12", tone: "prompt" },
  { text: "Hi Aarav! Next year you will be 13." },
  { text: "" },
  { text: "finished in 4 ms", tone: "ok" },
];

function ToneIcon({ tone }: { tone: CompareTone }) {
  if (tone === "yes") return <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" strokeWidth={3} aria-label="Yes" />;
  if (tone === "no") return <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral-dark" strokeWidth={3} aria-label="No" />;
  return <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={3} aria-label="Partly" />;
}

function Cta({
  children,
  href,
  variant = "coral",
}: {
  children: ReactNode;
  /** Omit to open the course (sign-in sheet for guests). */
  href?: string;
  variant?: "coral" | "ghost-dark" | "ink";
}) {
  const className = cn(
    "inline-flex h-12 items-center justify-center gap-2 px-6 text-[15px] font-bold transition",
    variant === "coral" && "bg-coral text-ink hover:bg-coral-dark hover:text-white",
    variant === "ink" && "bg-ink text-white hover:bg-black",
    variant === "ghost-dark" && "border border-white/25 text-white hover:bg-white/10",
  );
  const body = (
    <>
      {children}
      {variant !== "ghost-dark" && <ArrowRight className="h-4 w-4" />}
    </>
  );
  if (!href) return <PythonStartButton className={className}>{body}</PythonStartButton>;
  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}

function Chapter({
  number,
  label,
  title,
  intro,
  dark,
}: {
  number: string;
  label: string;
  title: string;
  intro?: ReactNode;
  dark?: boolean;
}) {
  return (
    <header className="grid gap-4 lg:grid-cols-[180px_1fr] lg:gap-10">
      <p
        className={cn(
          "font-mono text-[12px] font-semibold uppercase tracking-[0.12em]",
          dark ? "text-coral" : "text-coral-dark",
        )}
      >
        {number} <span className={dark ? "text-white/30" : "text-muted/60"}>/</span> {label}
      </p>
      <div className="max-w-3xl">
        <h2
          className={cn(
            "text-[28px] font-extrabold leading-[1.12] tracking-tight sm:text-[40px]",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        {intro && (
          <div
            className={cn(
              "mt-4 space-y-3 text-[15.5px] leading-relaxed sm:text-[17px]",
              dark ? "text-white/70" : "text-ink/70",
            )}
          >
            {intro}
          </div>
        )}
      </div>
    </header>
  );
}

function LessonDetail({ lesson, initialOpen }: { lesson: PythonLesson; initialOpen?: boolean }) {
  const final = Boolean(lesson.requirements);
  const pad = String(lesson.number).padStart(2, "0");
  return (
    <details
      open={initialOpen ?? lesson.number === 1}
      className={cn("group border-t border-hairline", final && "bg-coral-wash/40")}
    >
      <summary className="grid cursor-pointer list-none grid-cols-[52px_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[72px_1fr_auto] [&::-webkit-details-marker]:hidden">
        <span
          className={cn(
            "font-mono text-[26px] font-bold leading-none sm:text-[34px]",
            final ? "text-coral-dark" : "text-ink/25 group-open:text-ink",
          )}
        >
          {pad}
        </span>
        <span className="min-w-0">
          <span className="block text-[17px] font-extrabold leading-snug text-ink sm:text-[19px]">
            {lesson.title}
          </span>
          <span className="block text-[14px] text-muted">{lesson.subtitle}</span>
        </span>
        <Plus className="h-5 w-5 text-muted transition group-open:rotate-45" />
      </summary>

      <div className="grid gap-8 pb-10 sm:pl-[88px] lg:grid-cols-[1fr_1fr] lg:gap-10 [&>*]:min-w-0">
        <div className="space-y-7">
          <p className="border-l-2 border-ink pl-4 text-[16px] leading-relaxed text-ink">
            {lesson.hook}
          </p>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Concepts
            </h4>
            <ul className="mt-2.5 grid gap-x-6 sm:grid-cols-2">
              {lesson.concepts.map((c) => (
                <li
                  key={c}
                  className="border-b border-hairline py-2 font-mono text-[12.5px] text-ink"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {final ? (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                The program must
              </h4>
              <ol className="mt-2.5 space-y-1.5">
                {lesson.requirements!.map((r, i) => (
                  <li key={r} className="flex gap-3 text-[14px] text-ink">
                    <span className="w-5 shrink-0 font-mono text-[12px] text-muted">{i + 1}.</span>
                    {r}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                Practice set
              </h4>
              <ol className="mt-2.5 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {lesson.practice.map((p, i) => (
                  <li key={p} className="flex gap-3 text-[14px] text-ink">
                    <span className="w-5 shrink-0 font-mono text-[12px] text-muted">{i + 1}.</span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="grid gap-px bg-hairline sm:grid-cols-2">
            <div className="bg-white px-4 py-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-coral-dark">
                Watch out
              </h4>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink">{lesson.watchOut}</p>
            </div>
            <div className="bg-white px-4 py-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-sage">
                By the end
              </h4>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink">{lesson.canDo}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              {final ? "Starter structure" : "Guided build"} · {lesson.build}
            </h4>
            <PythonCode code={lesson.code} filename={`lesson_${pad}.py`} />
          </div>

          {lesson.predict && (
            <div className="border border-hairline bg-white">
              <div className="border-b border-hairline px-4 py-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  Predict before you run
                </h4>
              </div>
              <pre className="overflow-x-auto bg-cream px-4 py-3 font-mono text-[12.5px] leading-[1.7] text-ink">
                {lesson.predict.code}
              </pre>
              <p className="px-4 pt-3 text-[14px] font-semibold text-ink">
                {lesson.predict.question}
              </p>
              <details className="group/a px-4 pb-3.5 pt-1.5">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[13px] font-bold text-coral-dark [&::-webkit-details-marker]:hidden">
                  Show answer
                  <ChevronDown className="h-3.5 w-3.5 transition group-open/a:rotate-180" />
                </summary>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/80">
                  {lesson.predict.answer}
                </p>
              </details>
            </div>
          )}

          <div className="bg-ink px-4 py-3.5 text-white">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-coral">
              {final ? "Your task" : "Mini challenge"}
            </h4>
            <p className="mt-1 text-[14.5px] font-semibold leading-snug">{lesson.challenge}</p>
          </div>
        </div>
      </div>
    </details>
  );
}

function TrackPathCard({
  tier,
  name,
  summary,
  meta,
  covers,
  outcome,
  syllabusHref,
  primary,
  footnote,
  floatDelay,
}: {
  tier: PythonTier;
  name: string;
  summary: string;
  meta: string;
  covers: string[];
  outcome: string;
  syllabusHref: string;
  primary: { label: string; href?: string };
  footnote: ReactNode;
  floatDelay?: number;
}) {
  const theme = pyTrackTheme(tier === "intermediate" ? "intermediate" : "beginner");
  const tierLabel = tier === "intermediate" ? "Intermediate" : "Beginner";

  return (
    <article className="flex min-h-[420px] flex-col border-2 border-ink bg-white shadow-[4px_4px_0_0_#1c1a17] sm:min-h-[440px]">
      <div className="h-1.5 shrink-0" style={{ backgroundColor: theme.accent }} aria-hidden />
      <div className="flex flex-1 flex-col p-5 sm:p-6" style={{ backgroundColor: theme.accentWash }}>
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
            {tierLabel}
          </p>
          <span className="shrink-0 bg-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
            Live
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="w-[72px] shrink-0 sm:w-[80px]">
            <PythonBadge tier={tier} idSuffix="-path" floatDelay={floatDelay} still />
          </div>
          <div className="min-w-0">
            <h3 className="text-[19px] font-extrabold leading-tight text-ink sm:text-[21px]">{name}</h3>
            <p className="mt-1.5 font-mono text-[11px] text-muted">{meta}</p>
          </div>
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-ink/80">{summary}</p>

        <ul className="mt-4 space-y-1.5 border-t border-ink/10 pt-4">
          {covers.slice(0, 4).map((line) => (
            <li key={line} className="flex gap-2 text-[13px] leading-snug text-ink/75">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: theme.accent }} strokeWidth={3} aria-hidden />
              {line}
            </li>
          ))}
        </ul>

        <p
          className="mt-4 border-l-[3px] py-2 pl-3 text-[13px] font-semibold leading-snug text-ink"
          style={{ borderColor: theme.accent, backgroundColor: "rgba(255,255,255,0.55)" }}
        >
          {outcome}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {primary.href ? (
            <Cta href={primary.href} variant="ink">
              {primary.label}
            </Cta>
          ) : (
            <Cta variant="ink">{primary.label}</Cta>
          )}
          <Cta href={syllabusHref} variant="coral">
            Syllabus
          </Cta>
        </div>
        <p className="mt-3 text-[12.5px] leading-snug text-ink/65">{footnote}</p>
      </div>
    </article>
  );
}

/** Compact Beginner + Intermediate — matching cards, track-colored accents. */
function TrackPathCards() {
  const beginner = PYTHON_TRACKS.find((t) => t.tier === "beginner")!;
  const intermediate = PYTHON_TRACKS.find((t) => t.tier === "intermediate")!;

  return (
    <section id="tracks" className="scroll-mt-20 border-b border-hairline bg-cream/40 py-12 sm:py-16">
      <div className={SHELL}>
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-coral-dark">
            Choose a path
          </p>
          <h2 className="mt-2 text-[26px] font-extrabold tracking-tight text-ink sm:text-[30px]">
            Beginner or Intermediate — both live
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
            Same browser compiler and lesson loop. Beginner is open to everyone. Intermediate unlocks
            after a short <Link href={PY_LMS_PATH_TEST} className="font-semibold text-ink underline underline-offset-2">test</Link>{" "}
            or Beginner Lesson 9.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <TrackPathCard
            tier="beginner"
            name={beginner.name}
            summary={beginner.summary}
            meta={`${beginner.lessons} lessons · ~8 hr · certificate`}
            covers={beginner.covers}
            outcome={beginner.outcome}
            syllabusHref="#beginner"
            primary={{ label: "Start Beginner" }}
            footnote="Free forever · certificate when you finish all lessons and the Final Challenge."
          />
          <TrackPathCard
            tier="intermediate"
            name={intermediate.name}
            summary={intermediate.summary}
            meta={`${intermediate.lessons} lessons · job & internship · capstone`}
            covers={intermediate.covers}
            outcome={intermediate.outcome}
            syllabusHref="#intermediate"
            primary={{ label: "Open course", href: PY_LMS_INTERMEDIATE }}
            footnote={
              <>
                Unlock with{" "}
                <Link href={PY_LMS_PATH_TEST} className="font-semibold text-ink underline underline-offset-2">
                  Test to Intermediate
                </Link>{" "}
                or Beginner Lesson 9.
              </>
            }
            floatDelay={0.6}
          />
        </div>

        <p className="mt-6 text-center text-[13px] text-muted sm:text-left">
          <Lock className="mr-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden />
          Python Advanced — coming soon · Intermediate locked until test or Lesson 9
        </p>
      </div>
    </section>
  );
}

const ON_THIS_PAGE = [
  { href: "#tracks", label: "Beginner & Intermediate" },
  { href: "#new-way", label: "No 60-hour course needed" },
  { href: "#what-you-get", label: "What you get" },
  { href: "#compare", label: "Compare with other courses" },
  { href: "#what-is-python", label: "What is Python?" },
  { href: "#why-python", label: "Why learn Python first?" },
  { href: "#how-lessons-work", label: "How lessons work" },
  { href: "#beginner", label: "Beginner syllabus" },
  { href: "#intermediate", label: "Intermediate syllabus" },
  { href: "#final-challenge", label: "Final project" },
  { href: "#certificate", label: "Your certificate" },
  { href: "#who-its-for", label: "Who it’s for" },
  { href: "#faq", label: "FAQ" },
];

const SAMPLE_CERT: PyCertificate = {
  id: "MPY-7K2D-QX9M",
  name: "Winni",
  course: PY_CERT_COURSE,
  issuedAt: "2026-02-04T12:00:00.000Z",
  stats: {
    xp: 2480,
    lessonsStudied: studyLessons().length,
    practiceSolved: 64,
    examplesSolved: 58,
    projectsCompleted: 1,
    projects: ["quiz-game"],
  },
};

const CERT_STEPS = [
  { title: "Finish every lesson’s Study", text: "Go through the Study slides in all the lessons." },
  { title: `Solve ${PY_CERT_RULES.practice}+ practice problems`, text: "Answers you reveal don’t count — only the ones you get right." },
  { title: `Solve ${PY_CERT_RULES.examples}+ examples`, text: "Step through programs to the last line, or hit a playground’s goal." },
  { title: `Build ${PY_CERT_RULES.projects} Final Challenge project`, text: "Write it, press Run. A working program is marked complete." },
];

const CERT_PERKS = [
  { Icon: BadgeCheck, label: "Unique ID anyone can verify" },
  { Icon: Download, label: "Download as a print-ready PDF" },
  { Icon: Share2, label: "Add it to LinkedIn or your résumé" },
];

function CertificatePreview() {
  return (
    <div className="group relative mx-auto w-full max-w-[920px] pb-8 pt-5 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-12 bottom-0 rounded-full bg-[#2f9e6e]/25 blur-[90px]"
      />
      <div className="py-cert-float relative">
        <div className="py-cert-tilt relative">
          <div
            aria-hidden
            className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] bg-[#efe6d2] shadow-sm"
          />
          <div
            aria-hidden
            className="absolute inset-0 -translate-x-2 translate-y-2 -rotate-[1.5deg] bg-[#f6efe0] shadow-sm"
          />
          <div className="relative overflow-hidden">
            <CertificateArt cert={SAMPLE_CERT} />
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="py-cert-sheen absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            </div>
          </div>
        </div>
      </div>
      <span className="py-cert-stamp absolute -left-1 top-0 z-10 inline-flex items-center gap-1.5 bg-coral px-3 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink shadow-[3px_3px_0_0_#1c1a17] sm:left-0 sm:px-4 sm:py-2 sm:text-[12px]">
        Sample
      </span>
      <div className="absolute -bottom-3 -right-2 z-10 w-[72px] sm:-right-2 sm:w-[110px] lg:w-[128px]">
        <PythonBadge tier="beginner" idSuffix="-cert" floatDelay={1.6} />
      </div>
    </div>
  );
}

const AUDIENCES = [
  {
    tag: "College students",
    title: "Placements, internships, electives",
    text: "Get comfortable with Python before your data, AI or programming courses — and have a project and a certificate to show for it.",
  },
  {
    tag: "Career switchers",
    title: "Your first step into tech",
    text: "Automation, analytics and AI work all start with Python. Learn the fundamentals properly, at your own pace, around your job.",
  },
  {
    tag: "School students",
    title: "Class 6 and up",
    text: "Python is the language of CBSE Computer Science in Class 11–12. Every lesson ends with a program you can run and show.",
  },
];

const PYTHON_USES = [
  { title: "Games and quizzes", text: "Score counters, guessing games, quiz apps — the kind of thing you build in this course." },
  { title: "Websites and apps", text: "Parts of apps you use every day, like YouTube and Instagram, run on Python." },
  { title: "Data and AI", text: "Most AI and machine learning tools are built with Python. So is a lot of science research." },
];

export function LearnPythonLanding() {
  const lessons = PYTHON_BEGINNER_LESSONS;
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-10 h-[460px] w-[460px] rounded-full bg-sage/20 blur-[120px]"
        />

        <div
          className={cn(
            SHELL,
            "relative grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24 [&>*]:min-w-0",
          )}
        >
          <div>
            <nav aria-label="Breadcrumb" className="font-mono text-[12px] text-white/45">
              <Link href="/learn" className="hover:text-white">
                mentr learn
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white/75">python</span>
            </nav>
            <h1 className="mt-6 text-[40px] font-extrabold leading-[1.04] tracking-tight sm:text-[58px] lg:text-[66px]">
              Learn Python by building.
              <span className="mt-3 block text-[0.6em] leading-[1.12] text-white/55">
                The language behind AI, data and the apps you use.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/75 sm:text-[17px]">
              Two free tracks: <strong className="font-semibold text-white/90">Beginner</strong> from
              your first line of code, and <strong className="font-semibold text-white/90">Intermediate</strong>{" "}
              for placements and internships. Browser compiler, instant practice, no card.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Cta>Start Beginner</Cta>
              <Cta href={PY_LMS_PATH_TEST} variant="ghost-dark">
                Test to Intermediate
              </Cta>
              <Cta href="#tracks" variant="ghost-dark">
                Compare paths
              </Cta>
            </div>
            <dl className="mt-10 grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
              {[
                ["Beginner", "10 lessons"],
                ["Intermediate", "12 lessons"],
                ["Practice", "500+ checks"],
                ["Price", "₹0 forever"],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-white/10 py-4 pr-4 sm:border-b-0">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
                    {k}
                  </dt>
                  <dd className="mt-1 text-[15px] font-bold text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div className="mb-6 flex items-end justify-center gap-4 sm:gap-6">
              <div className="w-[96px] sm:w-[124px]">
                <PythonBadge tier="beginner" idSuffix="-hero" />
              </div>
              <div className="w-[78px] sm:w-[98px]">
                <PythonBadge tier="intermediate" idSuffix="-hero" floatDelay={1.2} />
              </div>
              <div className="w-[78px] sm:w-[98px]">
                <PythonBadge tier="advanced" idSuffix="-hero" locked floatDelay={2.4} />
              </div>
            </div>
            <PythonTerminal lines={QUIZ_RUN} animated />
            <p className="mt-3 font-mono text-[11.5px] text-white/40">
              ↑ Beginner capstone (Lesson 10). Intermediate ships a JSON expense tracker.
            </p>
          </div>
        </div>
      </section>

      <TrackPathCards />

      {/* Quick answer + on this page */}
      <section className="border-b border-hairline bg-cream/40">
        <div className={cn(SHELL, "grid gap-8 py-10 lg:grid-cols-[1fr_280px] lg:gap-16")}>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-coral-dark">
              In short
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-ink sm:text-[17px]">
              <strong>Mentr Learn Python</strong> is hands-on, not video-heavy:{" "}
              <strong className="text-ink">Beginner</strong> (10 lessons to a quiz-game project + certificate) and{" "}
              <strong className="text-ink">Intermediate</strong> (12 job-focused lessons — dicts, JSON, OOP, shipping).
              Unlock Intermediate with Test to Intermediate or after Beginner Lesson 9. Free compiler, ₹0.
            </p>
          </div>
          <nav aria-label="On this page" className="border-l-2 border-ink pl-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              On this page
            </p>
            <ul className="mt-3 space-y-2">
              {ON_THIS_PAGE.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-[14.5px] font-semibold text-ink hover:text-coral-dark">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* 01 — Positioning */}
      <section id="new-way" className="scroll-mt-20 bg-cream py-20 sm:py-28">
        <div className={SHELL}>
          <Chapter
            number="01"
            label="A new way"
            title="You don’t need another 60-hour Python course."
            intro={
              <>
                <p>
                  <strong className="text-ink">
                    Most beginners buy a long video course, watch a few hours and quietly stop.
                  </strong>{" "}
                  Nobody learns to code by watching. You learn by writing code, getting it wrong
                  and fixing it.
                </p>
                <p>
                  Mentr gives you two live paths — <strong className="text-ink">Beginner</strong> (10
                  lessons to a quiz game + certificate) and <strong className="text-ink">Intermediate</strong>{" "}
                  (12 job-focused lessons + capstone). Same loop: short lessons, instant checks and a
                  compiler in your browser. No paid program, nothing to install.
                </p>
              </>
            }
          />

          <div className="mt-12 border border-hairline bg-white lg:ml-[220px]">
            <div className="grid grid-cols-2 border-b border-hairline">
              <p className="flex items-center gap-2 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted sm:px-6">
                <X className="h-3.5 w-3.5 text-coral-dark" /> The usual way
              </p>
              <p className="flex items-center gap-2 border-l border-hairline bg-ink px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:px-6">
                <Check className="h-3.5 w-3.5 text-[#5ee0a0]" /> Mentr Learn Python
              </p>
            </div>
            {PYTHON_OLD_VS_NEW.map((row) => (
              <div key={row.old} className="grid grid-cols-2 border-b border-hairline last:border-b-0">
                <p className="px-4 py-4 text-[14px] leading-snug text-ink/50 line-through decoration-ink/20 sm:px-6 sm:text-[15px]">
                  {row.old}
                </p>
                <p className="border-l border-hairline bg-sage/[0.06] px-4 py-4 text-[14px] font-semibold leading-snug text-ink sm:px-6 sm:text-[15px]">
                  {row.now}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mt-14 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted lg:ml-[220px]">
            A researched path, not a playlist
          </h3>
          <div className="mt-3 grid border-t border-ink/80 sm:grid-cols-2 lg:ml-[220px] lg:grid-cols-4">
            {PYTHON_METHOD.map((m, i) => (
              <div key={m.title} className="border-b border-hairline py-5 pr-5 lg:border-b-0">
                <span className="font-mono text-[12px] text-coral-dark">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="mt-1 text-[16px] font-extrabold text-ink">{m.title}</h4>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/70">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — What you get */}
      <section id="what-you-get" className="scroll-mt-20 border-t border-hairline bg-white py-20 sm:py-28">
        <div className={SHELL}>
          <Chapter
            number="02"
            label="What you get"
            title="Everything you need for Beginner and Intermediate, in one place."
            intro={
              <p>
                <strong className="text-ink">
                  500+ auto-checked exercises, an in-browser Python compiler, 22 lessons with notes
                  and runnable examples
                </strong>{" "}
                — shared across both tracks, built for first-time coders and placement prep, on any
                laptop or phone.
              </p>
            }
          />
          <div className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {PYTHON_OFFER.map((o) => (
              <article key={o.title} className="bg-white p-6 sm:p-7">
                <p className="font-mono text-[34px] font-bold leading-none tracking-tight text-coral-dark sm:text-[40px]">
                  {o.stat}
                </p>
                <h3 className="mt-3 text-[17px] font-extrabold text-ink">{o.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{o.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-8 border border-hairline bg-ink p-6 text-white sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center [&>*]:min-w-0">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-coral">
                In-browser Python compiler
              </p>
              <h3 className="mt-2 text-[24px] font-extrabold leading-tight tracking-tight sm:text-[28px]">
                Write any program. Press Run. It works, even on your phone.
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                Real Python 3 for Beginner lessons, Intermediate capstone work and anything you
                write on your own. When your program uses{" "}
                <code className="bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em]">input()</code>, you
                type answers in the output like a real terminal. Errors point to the line and explain
                the fix in plain English.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={COMPILER_PATHS.python}
                  className="inline-flex h-12 items-center justify-center gap-2 bg-coral px-6 text-[15px] font-bold text-ink transition hover:bg-coral-dark hover:text-white"
                >
                  Open the online Python compiler <ArrowRight className="h-4 w-4" />
                </a>
                <Link href={howItWorksPath("python")} className="text-[14px] font-semibold text-white/70 underline underline-offset-4 hover:text-white">
                  How we built it
                </Link>
              </div>
            </div>
            <PythonTerminal lines={COMPILER_RUN} title="mentr python compiler" />
          </div>
        </div>
      </section>

      {/* 03 — Comparison */}
      <section id="compare" className="scroll-mt-20 border-t border-hairline bg-cream-band/50 py-20 sm:py-28">
        <div className={SHELL}>
          <Chapter
            number="03"
            label="Compare"
            title="How is this different from other ways to learn Python?"
            intro={
              <p>
                <strong className="text-ink">It’s not a video loop, and it’s not a paid program.</strong>{" "}
                Here’s how Mentr Learn Python compares with the usual options, row by row.
              </p>
            }
          />
          <div className="mt-12 overflow-x-auto overscroll-x-contain border border-hairline bg-white">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <caption className="sr-only">Mentr Learn Python compared with other ways to learn Python</caption>
              <thead>
                <tr className="border-b border-hairline">
                  <th scope="col" className="sticky left-0 z-10 w-[170px] bg-white px-4 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    <span className="sr-only">Feature</span>
                  </th>
                  {PYTHON_COMPARE_COLUMNS.map((col, i) => (
                    <th
                      key={col}
                      scope="col"
                      className={cn(
                        "px-4 py-4 align-bottom text-[13.5px] font-extrabold leading-tight",
                        i === 0 ? "bg-ink text-white" : "text-ink",
                      )}
                    >
                      {i === 0 && (
                        <span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-coral">
                          This course
                        </span>
                      )}
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PYTHON_COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-hairline last:border-b-0">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-4 py-3.5 text-[13.5px] font-bold leading-snug text-ink shadow-[1px_0_0_var(--color-hairline)]"
                    >
                      {row.label}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={cn(
                          "px-4 py-3.5 align-top text-[13.5px] leading-snug",
                          i === 0 ? "bg-sage/[0.08] font-semibold text-ink" : "text-ink/70",
                        )}
                      >
                        <span className="flex gap-2">
                          <ToneIcon tone={cell.tone} />
                          <span>{cell.text}</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[11.5px] text-muted sm:hidden">← Swipe to see all columns</p>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
            Compares typical formats, not specific brands. Prices and course lengths vary.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] font-semibold text-ink">
              Pick Beginner or Intermediate — same tools, same compiler.
            </p>
            <Cta href="#tracks" variant="ink">
              Compare both tracks
            </Cta>
          </div>
        </div>
      </section>

      {/* 04 — What is Python */}
      <section id="what-is-python" className="scroll-mt-20 border-t border-hairline bg-cream py-20 sm:py-28">
        <div className={SHELL}>
          <Chapter
            number="04"
            label="The basics"
            title="What is Python?"
            intro={
              <>
                <p>
                  <strong className="text-ink">
                    Python is a programming language — a way to give a computer instructions it
                    can follow.
                  </strong>{" "}
                  It’s known for being easy to read, which is why it’s the most popular first
                  language for beginners.
                </p>
                <p>
                  You write a line like{" "}
                  <code className="bg-cream-band px-1.5 py-0.5 font-mono text-[0.88em] text-ink">
                    print(&quot;Hello&quot;)
                  </code>
                  , run it, and the computer shows <em>Hello</em>. Every app, game and website is
                  made of instructions like this — just many more of them.
                </p>
              </>
            }
          />
          <h3 className="mt-14 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted lg:ml-[220px]">
            What can you make with Python?
          </h3>
          <div className="mt-3 grid border-t border-ink/80 lg:ml-[220px] lg:grid-cols-3">
            {PYTHON_USES.map((use) => (
              <div
                key={use.title}
                className="border-b border-hairline py-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
              >
                <h4 className="text-[16px] font-extrabold text-ink">{use.title}</h4>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink/70">{use.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — Why Python */}
      <section id="why-python" className="scroll-mt-20 border-t border-hairline bg-white py-20 sm:py-28">
        <div className={SHELL}>
          <Chapter
            number="05"
            label="Why Python"
            title="Why learn Python first?"
            intro={
              <p>
                <strong className="text-ink">
                  Because it’s the easiest real programming language to start with.
                </strong>{" "}
                Python code is short and reads almost like English. Here’s the same program —
                show the word Hello — in Java and in Python.
              </p>
            }
          />

          <div className="mt-12 grid gap-px border border-hairline bg-hairline lg:ml-[220px] md:grid-cols-2 [&>*]:min-w-0">
            <div className="bg-white p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                Java · 5 lines
              </p>
              <PythonCode
                className="mt-3"
                filename="Main.java"
                code={`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`}
              />
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65">
                Five lines, and a lot of extra words, before anything shows on screen.
              </p>
            </div>
            <div className="bg-white p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-sage">
                Python · 1 line
              </p>
              <PythonCode className="mt-3" filename="main.py" code={`print("Hello")`} />
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65">
                One line. You can read it out loud and know exactly what it does.
              </p>
            </div>
          </div>

          <div className="mt-14 grid border-t border-ink/80 sm:grid-cols-2 lg:ml-[220px]">
            {WHY_PYTHON.map((item, i) => (
              <div
                key={item.title}
                className={cn(
                  "border-b border-hairline py-6 sm:pr-8",
                  i % 2 === 1 && "sm:border-l sm:pl-8 sm:pr-0",
                )}
              >
                <span className="font-mono text-[12px] text-coral-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-[17px] font-extrabold text-ink">{item.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink/70">
                  {item.code && (
                    <>
                      <code className="bg-cream-band px-1.5 py-0.5 font-mono text-[13px] text-ink">
                        {item.code}
                      </code>{" "}
                    </>
                  )}
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — How a lesson works */}
      <section id="how-lessons-work" className="scroll-mt-20 border-t border-hairline bg-cream-band/50 py-20 sm:py-24">
        <div className={SHELL}>
          <Chapter
            number="06"
            label="Inside a lesson"
            title="How does each lesson work?"
            intro={
              <p>
                <strong className="text-ink">Every Beginner and Intermediate lesson uses the same steps</strong>, so
                you always know what comes next. Practice ends with real code — not just
                multiple choice.
              </p>
            }
          />
          <ol className="mt-12 grid border-t border-ink/80 sm:grid-cols-2 lg:ml-[220px] lg:grid-cols-5">
            {PYTHON_LESSON_LOOP.map((item, i) => (
              <li key={item.step} className="border-b border-hairline py-5 pr-5 lg:border-b-0">
                <span className="font-mono text-[12px] text-coral-dark">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 text-[16px] font-extrabold text-ink">{item.step}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/70">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 07 — Syllabus */}
      <section id="beginner" className="scroll-mt-20 border-t border-hairline bg-white py-20 sm:py-28">
        <div className={SHELL}>
          <Chapter
            number="07"
            label="Syllabus"
            title="Python Beginner syllabus"
            intro={
              <p>
                <strong className="text-ink">New to coding? Start here.</strong> Ten lessons to your
                first full project. Already comfortable? Use the{" "}
                <Link href={PY_LMS_PATH_TEST} className="font-semibold text-coral-dark hover:underline">
                  Test to Intermediate
                </Link>{" "}
                and jump to{" "}
                <Link href={PY_LMS_INTERMEDIATE} className="font-semibold text-coral-dark hover:underline">
                  Intermediate
                </Link>
                .
              </p>
            }
          />
          <div className="mt-12 border-b border-hairline">
            {lessons.map((lesson) => (
              <LessonDetail key={lesson.number} lesson={lesson} initialOpen={lesson.number === 1} />
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] font-semibold text-ink">
              All 10 lessons are open. Start with Lesson 1 today.
            </p>
            <Cta variant="ink">Start Lesson 1</Cta>
          </div>
        </div>
      </section>

      {/* 08 — Intermediate syllabus */}
      <section id="intermediate" className="scroll-mt-20 border-t border-hairline bg-white py-20 sm:py-28">
        <div className={SHELL}>
          <Chapter
            number="08"
            label="Syllabus"
            title="Python Intermediate syllabus"
            intro={
              <p>
                <strong className="text-ink">For placements and internships.</strong> Twelve lessons
                on problem-solving, data in Python, JSON, OOP and shipping — same Study → Examples →
                Practice loop as Beginner.{" "}
                <Link href={PY_LMS_PATH_TEST} className="font-semibold text-coral-dark hover:underline">
                  Test to Intermediate
                </Link>{" "}
                or finish Beginner through Functions to unlock.
              </p>
            }
          />
          <div className="mt-12 border-b border-hairline">
            {PYTHON_INTERMEDIATE_LESSONS.map((lesson) => (
              <LessonDetail key={lesson.number} lesson={lesson} initialOpen={lesson.number === 1} />
            ))}
            <details className="group border-t border-hairline bg-coral-wash/40">
              <summary className="grid cursor-pointer list-none grid-cols-[52px_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[72px_1fr_auto] [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-[26px] font-bold leading-none text-coral-dark sm:text-[34px]">
                  13
                </span>
                <span className="min-w-0">
                  <span className="block text-[17px] font-extrabold leading-snug text-ink sm:text-[19px]">
                    Capstone · {PYTHON_INTERMEDIATE_CAPSTONE.title}
                  </span>
                  <span className="block text-[14px] text-muted">Portfolio project</span>
                </span>
                <Plus className="h-5 w-5 text-muted transition group-open:rotate-45" />
              </summary>
              <div className="grid gap-8 pb-10 sm:pl-[88px] lg:grid-cols-[1fr_1fr] lg:gap-10 [&>*]:min-w-0">
                <div className="space-y-7">
                  <p className="border-l-2 border-ink pl-4 text-[16px] leading-relaxed text-ink">
                    {PYTHON_INTERMEDIATE_CAPSTONE.summary}
                  </p>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                      The program must
                    </h4>
                    <ol className="mt-2.5 space-y-1.5">
                      {[
                        "Add and list expenses with categories",
                        "Filter and summarize totals",
                        "Persist data as JSON export",
                        "Pass hidden tests in the LMS compiler",
                      ].map((r, i) => (
                        <li key={r} className="flex gap-3 text-[14px] text-ink">
                          <span className="w-5 shrink-0 font-mono text-[12px] text-muted">{i + 1}.</span>
                          {r}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="bg-ink px-4 py-3.5 text-white">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-coral">
                    Your task
                  </h4>
                  <p className="mt-1 text-[14.5px] font-semibold leading-snug">
                    Ship a working expense tracker you can walk through in an internship interview.
                  </p>
                </div>
              </div>
            </details>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] font-semibold text-ink">
              Lesson 1 is live; more lessons ship weekly. Unlock with placement or Beginner L9.
            </p>
            <div className="flex flex-wrap gap-2">
              <Cta href={PY_LMS_PATH_TEST} variant="ink">
                Test to Intermediate
              </Cta>
              <Cta href={PY_LMS_INTERMEDIATE} variant="coral">
                Open Intermediate
              </Cta>
            </div>
          </div>
        </div>
      </section>

      {/* 09 — Final challenge */}
      <section id="final-challenge" className="scroll-mt-20 bg-ink py-20 text-white sm:py-28">
        <div className={SHELL}>
          <Chapter
            dark
            number="09"
            label="Final project"
            title="What do you build at the end of each track?"
            intro={
              <p>
                <strong className="text-white">Beginner:</strong> a quiz game you write yourself (Lesson
                10). <strong className="text-white">Intermediate:</strong> a JSON expense tracker you can
                demo in interviews. Both use hints, hidden tests and the same in-browser compiler.
              </p>
            }
          />
          <div className="mt-14 grid gap-10 lg:ml-[220px] lg:grid-cols-2 [&>*]:min-w-0">
            <div className="border border-white/15 bg-white/[0.04] p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5ee0a0]">Beginner · Lesson 10</p>
              <h3 className="mt-2 text-[20px] font-extrabold">Quiz game capstone</h3>
              <ol className="mt-4 border-t border-white/10">
                {PYTHON_FINAL_HINTS.slice(0, 4).map((hint, i) => (
                  <li key={hint} className="flex gap-3 border-b border-white/10 py-3 text-[14px] text-white/85">
                    <span className="font-mono text-[12px] text-coral">{i + 1}</span>
                    {hint}
                  </li>
                ))}
              </ol>
              <PythonTerminal lines={QUIZ_RUN} className="mt-4" />
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">
                Variables, input, if/else, loops, lists and functions — then the Python Beginner badge
                and certificate path.
              </p>
            </div>
            <div className="border border-white/15 bg-white/[0.04] p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ffd96a]">Intermediate · Capstone</p>
              <h3 className="mt-2 text-[20px] font-extrabold">{PYTHON_INTERMEDIATE_CAPSTONE.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/75">{PYTHON_INTERMEDIATE_CAPSTONE.summary}</p>
              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-[14px] text-white/85">
                {[
                  "Add and list expenses with categories",
                  "Filter and summarize totals",
                  "Persist data as JSON export",
                  "Pass hidden tests in the LMS compiler",
                ].map((r) => (
                  <li key={r} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ffd96a]" strokeWidth={3} />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">
                Dicts, parsing, errors, JSON and OOP from the 12 Intermediate lessons — portfolio-ready
                for placements.
              </p>
              <Link
                href="#intermediate"
                className="mt-4 inline-flex text-[14px] font-bold text-coral underline underline-offset-4"
              >
                Intermediate syllabus
              </Link>
            </div>
          </div>
          <ul className="mt-10 border-t border-white/10 lg:ml-[220px]">
            {PYTHON_ASSESSMENT.map((row) => (
              <li key={row.part} className="grid grid-cols-[28px_96px_1fr] gap-2 border-b border-white/10 py-3 text-[14px] text-white/80">
                <span className="font-mono text-coral">{row.part}</span>
                <span className="font-bold text-white">{row.name}</span>
                <span className="text-white/60">{row.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10 — Certificate */}
      <section
        id="certificate"
        className="relative scroll-mt-20 overflow-hidden border-t border-hairline bg-white py-20 sm:py-28"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(#1c1a17_0.6px,transparent_0.6px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_70%)]"
        />
        <div className={cn(SHELL, "relative")}>
          <Chapter
            number="10"
            label="Certificate"
            title="Finish Beginner. Get a certificate with your name on it."
            intro={
              <p>
                <strong className="text-ink">Verifiable, and earned — not handed out.</strong>{" "}
                Complete the Beginner track and you get a Python Beginner certificate with your name,
                what you built and a unique ID recruiters can check online. Intermediate focuses on
                a portfolio capstone for interviews. Here’s a sample Beginner certificate.
              </p>
            }
          />

          <div className="mt-14 sm:mt-16">
            <CertificatePreview />
          </div>

          <h3 className="mt-16 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            How to earn it
          </h3>
          <ol className="mt-3 grid border-t border-ink/80 sm:grid-cols-2 lg:grid-cols-4">
            {CERT_STEPS.map((step, i) => (
              <li
                key={step.title}
                className={cn(
                  "border-b border-hairline py-6 sm:pr-6",
                  i % 2 === 1 && "sm:border-l sm:pl-6",
                  i > 0 && "lg:border-l lg:pl-6",
                )}
              >
                <span className="font-mono text-[12px] text-coral-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-1 text-[16px] font-extrabold text-ink">{step.title}</h4>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/70">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
              {CERT_PERKS.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-[14.5px] font-semibold text-ink">
                  <Icon className="h-4 w-4 shrink-0 text-sage" />
                  {label}
                </li>
              ))}
            </ul>
            <Cta variant="ink">Start earning yours</Cta>
          </div>
        </div>
      </section>

      {/* 11 — Who it's for */}
      <section id="who-its-for" className="scroll-mt-20 border-t border-hairline bg-white py-20 sm:py-28">
        <div className={SHELL}>
          <Chapter
            number="11"
            label="Who it’s for"
            title="Beginners and placement prep — same platform."
            intro={
              <p>
                <strong className="text-ink">Beginner</strong> if you’ve never coded.{" "}
                <strong className="text-ink">Intermediate</strong> if you’re aiming at internships,
                projects on your résumé, or interview-style problem solving.
              </p>
            }
          />
          <div className="mt-12 grid border-t border-ink/80 lg:ml-[220px] lg:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div
                key={a.title}
                className="border-b border-hairline py-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
              >
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-coral-dark">
                  {a.tag}
                </p>
                <h3 className="mt-1.5 text-[17px] font-extrabold text-ink">{a.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink/70">{a.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-10 lg:ml-[220px] lg:grid-cols-2">
            <p className="text-[14.5px] leading-relaxed text-ink/70">
              <strong className="text-ink">Younger learner?</strong> For Class 3–5, start with{" "}
              <Link href="/learn" className="font-semibold text-coral-dark hover:underline">
                Mentr Learn
              </Link>{" "}
              — coding, AI and maths with no typing.
            </p>
            <aside className="self-start border-l-2 border-coral pl-6">
              <p className="text-[15px] font-bold text-ink">Want a mentor as well?</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink/70">
                Find a Python tutor on Mentr and book an online demo from their profile. The
                course stays fully open either way.
              </p>
              <Link
                href={LEARN_PYTHON_TUTOR_HREF}
                className="mt-4 inline-flex items-center gap-2 text-[14px] font-bold text-coral-dark hover:underline"
              >
                Find a Python tutor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* 12 — FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-hairline bg-cream py-20 sm:py-28">
        <div className={SHELL}>
          <Chapter number="12" label="FAQ" title="Learn Python online: questions people ask" />
          <div className="mt-12 border-b border-hairline lg:ml-[220px]">
            {LEARN_PYTHON_FAQS.map((faq, i) => (
              <details key={faq.question} open={i < 2} className="group border-t border-hairline py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[16px] font-bold text-ink">{faq.question}</h3>
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="bg-ink text-white">
        <div className={cn(SHELL, "grid gap-10 py-20 sm:py-24 md:grid-cols-[1fr_auto] md:items-center")}>
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-coral">Lesson 01</p>
            <h2 className="mt-3 max-w-2xl text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px]">
              Ready to write your first line of Python?
            </h2>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/65">
              It takes about a minute to start. Every lesson, the compiler and the certificate
              are open to you from day one.
            </p>
            <div className="mt-8">
              <Cta>Start the course</Cta>
            </div>
          </div>
          <div className="mx-auto w-[150px] md:w-[180px]">
            <PythonBadge tier="beginner" idSuffix="-close" />
          </div>
        </div>
      </section>
    </>
  );
}
