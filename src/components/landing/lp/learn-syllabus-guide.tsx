"use client";

import { LEARN_SIGNUP_HREF, type LearnTrackId } from "@/lib/learn-curriculum";
import {
  PARENT_GUIDE,
  SYLLABUS_COUNTS,
  SYLLABUS_DOWNLOAD_HREF,
  SYLLABUS_PREAMBLE,
  SYLLABUS_SUBTITLE,
  SYLLABUS_TITLE,
  getSyllabusTracks,
  type SyllabusModule,
  type SyllabusTrack,
  type SyllabusUnit,
} from "@/lib/learn-syllabus-doc";
import { cn } from "@/lib/utils";
import { ChevronDown, Download } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { LearnDino } from "./learn-dino";
import { LearnStartButton } from "./learn-start-button";
import { LEARN_SHELL } from "./learn-shell";

const SUBJECT_UI: Record<
  LearnTrackId,
  { name: string; tint: string; chip: string; bar: string }
> = {
  cs: {
    name: "CS Basics",
    tint: "bg-coral-wash",
    chip: "bg-coral-wash text-coral-dark",
    bar: "bg-coral",
  },
  ai: {
    name: "AI Basics",
    tint: "bg-lavender",
    chip: "bg-lavender text-ink",
    bar: "bg-[#7c6ad6]",
  },
  math: {
    name: "Math for CS",
    tint: "bg-sage-wash",
    chip: "bg-sage-wash text-sage",
    bar: "bg-sage",
  },
};

function levelClass(level: string) {
  if (level === "Easy") return "bg-sage-wash text-sage";
  if (level === "Building") return "bg-butter/70 text-ink";
  if (level === "Stretch") return "bg-lavender text-ink";
  return "bg-coral-wash text-coral-dark";
}

function LessonRow({ mod }: { mod: SyllabusModule }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-hairline">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
      >
        <span className="min-w-0">
          <span className="text-[11px] font-bold text-muted">
            Chapter · {mod.id}
          </span>
          <span className="mt-0.5 block text-[15px] font-bold text-ink">{mod.title}</span>
          <span className="mt-0.5 block text-[13px] text-muted">{mod.concept}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2 pt-0.5">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[10px] font-bold",
              levelClass(mod.detail.level),
            )}
          >
            {mod.detail.level}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted transition", open && "rotate-180")}
          />
        </span>
      </button>
      {open && (
        <div className="space-y-3 px-4 pb-4 sm:px-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-cream/80 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                What they watch
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-ink">
                {mod.detail.teach.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md bg-cream/80 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                What they can do after
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-ink">
                {mod.detail.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-ink">
            <span className="font-bold">They practise (10):</span> {mod.detail.practice}
          </p>
          <p className="text-[13px] leading-relaxed text-ink">
            <span className="font-bold">You’ll know they got it when they can answer:</span>{" "}
            {mod.detail.checkpoint}
          </p>
        </div>
      )}
    </div>
  );
}

function UnitBlock({ bundle, defaultOpen }: { bundle: SyllabusUnit; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const { unit, goals, modules } = bundle;
  return (
    <div className="overflow-hidden rounded-lg border border-[#efe6d8] bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
      >
        <span>
          <span className="block text-[11px] font-bold uppercase tracking-wide text-[#ff6a1a]">
            Module
          </span>
          <span className="mt-0.5 block text-[16px] font-extrabold text-ink sm:text-[17px]">
            {unit.title}
          </span>
          <span className="mt-1 block text-[13px] text-muted">{unit.description}</span>
          <span className="mt-1.5 block text-[12px] font-semibold text-ink/70">
            5 chapters · about {unit.videoMinutes} min each · then a boss
          </span>
        </span>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-muted transition", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="border-t border-hairline">
          {goals.length > 0 && (
            <div className="px-4 py-3 sm:px-5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                After this unit, your child can
              </p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[13px] text-ink">
                {goals.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
              <p className="mt-2 text-[13px] text-muted">
                <span className="font-semibold text-ink">Unit boss:</span> {unit.bossChallenge}
              </p>
            </div>
          )}
          {modules.map((mod) => (
            <LessonRow key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubjectOverview({ bundle }: { bundle: SyllabusTrack }) {
  const ui = SUBJECT_UI[bundle.track.id];
  return (
    <div className="rounded-lg border border-[#efe6d8] bg-white p-5">
      <p className={cn("inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold", ui.chip)}>
        {ui.name}
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-ink">
        <strong>Included:</strong> {bundle.scope.include}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        <strong className="text-ink">Not included:</strong> {bundle.scope.exclude}
      </p>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-muted">
        Your child will be able to
      </p>
      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[14px] text-ink">
        {bundle.scope.outcomes.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
    </div>
  );
}

export function LearnSyllabusGuide() {
  const tracks = useMemo(() => getSyllabusTracks(), []);
  const [subject, setSubject] = useState<LearnTrackId>("cs");
  const active = tracks.find((t) => t.track.id === subject) ?? tracks[0];

  return (
    <div className={cn(LEARN_SHELL, "py-10 sm:py-14")}>
      <div className="print:hidden mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link href="/learn#curriculum" className="text-sm font-semibold text-coral hover:underline">
          ← Back to Learn
        </Link>
        <div className="flex flex-wrap gap-2">
          <a
            href={SYLLABUS_DOWNLOAD_HREF}
            download
            className="inline-flex h-10 items-center gap-2 rounded-md border border-hairline bg-white px-4 text-sm font-semibold text-ink hover:bg-cream"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
          <Link
            href={LEARN_SIGNUP_HREF}
            className="inline-flex h-10 items-center rounded-md bg-coral px-4 text-sm font-semibold text-white hover:bg-coral-dark"
          >
            Create a free parent account
          </Link>
        </div>
      </div>

      <header className="max-w-3xl">
        <LearnDino size={56} className="h-12 w-12 print:hidden" />
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#ff6a1a]">
          {PARENT_GUIDE.eyebrow}
        </p>
        <h1 className="mt-2 text-[1.7rem] font-extrabold leading-tight text-ink sm:text-[2.35rem]">
          {SYLLABUS_TITLE}
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted sm:text-[17px]">
          {PARENT_GUIDE.lead}
        </p>
        <p className="mt-2 text-[15px] text-muted">{SYLLABUS_SUBTITLE}</p>
        <p className="mt-4 text-[14px] font-semibold text-ink">
          {SYLLABUS_COUNTS.modules} lessons · {SYLLABUS_COUNTS.practiceTotal} practice questions ·{" "}
          {SYLLABUS_COUNTS.checksTotal} parent-visible checks · {SYLLABUS_COUNTS.bosses} bosses
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-[1.15rem] font-extrabold text-ink">What each lesson gives your child</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PARENT_GUIDE.provided.map((item, i) => (
            <div key={item.title} className="rounded-lg border border-[#efe6d8] bg-white p-4">
              <p className="text-[12px] font-bold text-[#ff6a1a]">{i + 1}</p>
              <p className="mt-1 text-[15px] font-extrabold text-ink">{item.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {(
          [
            ["Who it’s for", SYLLABUS_PREAMBLE.audience],
            ["How long a sitting takes", SYLLABUS_PREAMBLE.pacing],
            ["How it gets a little harder", SYLLABUS_PREAMBLE.progression],
            ["The loop you’ll see at home", SYLLABUS_PREAMBLE.lessonModel],
          ] as const
        ).map(([title, body]) => (
          <div key={title} className="rounded-lg border border-[#efe6d8] bg-white p-5">
            <h2 className="text-[15px] font-extrabold text-ink">{title}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-[1.15rem] font-extrabold text-ink">What’s in each subject — and what isn’t</h2>
        <p className="mt-2 max-w-2xl text-[14px] text-muted">
          Same path for Class 3, 4, and 5. Later units stretch. We don’t jump to Class 6 algebra or
          typed code.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {tracks.map((bundle) => (
            <SubjectOverview key={bundle.track.id} bundle={bundle} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-[1.15rem] font-extrabold text-ink">Lesson list — pick a subject</h2>
        <p className="mt-2 max-w-2xl text-[14px] text-muted">
          Open a unit, then a lesson, to see what they watch, what they practise, and the check
          question you can ask them.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(SUBJECT_UI) as LearnTrackId[]).map((id) => {
            const ui = SUBJECT_UI[id];
            const on = subject === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSubject(id)}
                className={cn(
                  "h-10 rounded-md px-4 text-sm font-bold",
                  on ? "bg-[#1c2434] text-white" : "border border-hairline bg-white text-ink hover:bg-cream",
                )}
              >
                {ui.name}
              </button>
            );
          })}
        </div>
        <div className={cn("mt-3 h-1 w-24 rounded-full", SUBJECT_UI[active.track.id].bar)} />
        <p className="mt-4 text-[14px] text-muted">{active.track.tagline}</p>
        {active.track.crossLink ? (
          <p className="mt-1 text-[13px] text-muted">{active.track.crossLink}</p>
        ) : null}
        <div className="mt-5 space-y-3">
          {active.units.map((unit, i) => (
            <UnitBlock key={unit.unit.id} bundle={unit} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#1c2434] px-5 py-5">
        <p className="text-[15px] font-bold text-white">
          Free for the Class 3–5 cohort. Save progress with a parent account.
        </p>
        <LearnStartButton href={LEARN_SIGNUP_HREF}>
          Get started for free
        </LearnStartButton>
      </div>
    </div>
  );
}
