"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { PythonBadge } from "@/components/learn-python/python-badge";
import { AchievementButton, LevelMark } from "@/components/learn-python/lms/py-badges";
import { Stars } from "@/components/learn-python/lms/py-game-ui";
import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import {
  PY_FINAL_PATH,
  PY_LESSON_INDEX,
  PY_PRACTICE_PATH,
  PY_PROFILE_PATH,
  getPyLesson,
  isPyEntryOpen,
  pyLessonHref,
} from "@/lib/python-lms";
import { certificateProgress } from "@/lib/python-lms/certificate";
import { completedProjects } from "@/lib/python-lms/project-progress";
import { PY_PROJECTS } from "@/lib/python-lms/projects";
import { XpBadgeLadder, XpRulesList } from "@/components/learn-python/lms/py-xp-rules";
import { ACHIEVEMENT_ORDER, PY_XP, levelFor } from "@/lib/python-lms/game";
import { resumeStage } from "@/lib/python-lms/progress";
import { cn } from "@/lib/utils";
import { ArrowRight, Award, BookOpen, Check, Code2, Flame, FlaskConical, Lock, PlayCircle, Shuffle } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const STEPS = [
  { icon: BookOpen, title: "Study", text: "Interactive slides with tables, flowcharts, quick checks and exam flashcards." },
  { icon: PlayCircle, title: "Examples", text: "Step through programs line by line and run real Python in your browser." },
  { icon: Code2, title: "Practice", text: "Easy to hard: MCQ, fill the blank, put in order, fix the bug, write your own." },
];

export function PyLmsHome() {
  const { user } = useAuth();
  const { progress, store, xp, streak, openGuide, isLessonUnlocked, certificateId } = usePyLms();
  const lvl = levelFor(xp);
  const unlockedCount = ACHIEVEMENT_ORDER.filter((id) => store.achievements[id]).length;
  const cert = useMemo(
    () => certificateProgress({ lessons: store.lessons, awardKeys: Object.keys(store.awarded), projects: store.projects }),
    [store.lessons, store.awarded, store.projects],
  );
  const projectsDone = completedProjects(store.projects).length;
  const entryDone = (l: (typeof PY_LESSON_INDEX)[number]) => (l.final ? projectsDone > 0 : Boolean(progress[l.slug]?.completedAt));

  const firstName =
    (user?.role === "parent" ? user.parentProfile?.name : user?.profile?.name)?.trim().split(/\s+/)[0] ?? "";
  const done = PY_LESSON_INDEX.filter(entryDone).length;
  const current =
    PY_LESSON_INDEX.find(
      (l) => !l.final && l.available && isLessonUnlocked(l.slug) && !(progress[l.slug]?.notesDone && progress[l.slug]?.completedAt),
    ) ?? null;
  const currentP = current ? progress[current.slug] : undefined;
  const started = Boolean(currentP?.notesSlide || currentP?.notesDone);
  const currentLesson = current ? getPyLesson(current.slug) : null;

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <p className="font-mono text-[11.5px] text-muted">{firstName ? `Welcome, ${firstName}` : "Welcome"}</p>
      <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">Python Beginner</h1>
      <p className="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed text-muted">
        Ten lessons from your first line of code to a quiz game you build yourself. Free, self-paced, one lesson at a time.
      </p>

      <section className="mt-6 grid gap-6 border border-[#1f2a23] bg-[#0f1612] px-5 py-6 text-white sm:grid-cols-[auto_1fr] sm:items-center sm:px-7">
        <PythonBadge tier="beginner" idSuffix="home" className="mx-auto w-24 sm:mx-0" />
        <div className="min-w-0">
          {current && currentLesson ? (
            <>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5ee0a0]">
                {started ? "Continue where you left off" : "Up next"}
              </p>
              <h2 className="mt-1.5 text-[22px] font-extrabold leading-tight sm:text-[24px]">
                Lesson {current.number}: {current.title}
              </h2>
              <p className="mt-1 text-[14.5px] text-white/60">
                {currentLesson.minutes} min · {currentLesson.notes.length} slides · {currentLesson.examples.length} examples ·{" "}
                {currentLesson.practice.length} questions
              </p>
              <Link
                href={`${pyLessonHref(current.slug)}?stage=${resumeStage(currentP)}`}
                className="mt-4 inline-flex items-center gap-2 bg-coral px-5 py-2.5 text-[14px] font-bold text-ink transition hover:brightness-105"
              >
                {started ? "Continue lesson" : `Start Lesson ${current.number}`} <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5ee0a0]">Every lesson finished</p>
              <h2 className="mt-1.5 text-[22px] font-extrabold leading-tight">
                {projectsDone > 0 ? "Build another project, or claim your certificate." : "Time for the Final Challenge."}
              </h2>
              <p className="mt-1 text-[14.5px] text-white/60">
                {PY_PROJECTS.length} projects that use everything you learned. Complete one to meet the certificate&apos;s project rule.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={PY_FINAL_PATH}
                  className="inline-flex items-center gap-2 bg-coral px-5 py-2.5 text-[14px] font-bold text-ink transition hover:brightness-105"
                >
                  Final Challenge <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`${PY_PROFILE_PATH}?tab=certificate`}
                  className="inline-flex items-center gap-2 border border-white/30 px-5 py-2.5 text-[14px] font-bold text-white transition hover:border-white"
                >
                  Certificate progress
                </Link>
              </div>
            </>
          )}
          <div className="mt-5 flex items-center gap-3">
            <div className="grid flex-1 grid-cols-10 gap-[3px]" aria-hidden>
              {PY_LESSON_INDEX.map((l) => (
                <span key={l.slug} className={cn("h-1.5", entryDone(l) ? "bg-[#5ee0a0]" : "bg-white/15")} />
              ))}
            </div>
            <span className="shrink-0 font-mono text-[12px] text-white/60">
              {done} of {PY_LESSON_INDEX.length} done
            </span>
          </div>
        </div>
      </section>

      <section className="mt-4 grid border border-hairline bg-white md:grid-cols-[1.25fr_0.75fr]">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <LevelMark level={lvl.level} size={40} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: lvl.band.color }}>
                {lvl.band.name} · Level {lvl.level} of 50
              </p>
              <p className="truncate text-[18px] font-extrabold">{lvl.title}</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-[#ece8e0]">
            <div className="h-full transition-all duration-500" style={{ width: `${lvl.pct}%`, background: lvl.band.color }} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="font-mono text-[11.5px] text-muted">
              {xp} XP · {lvl.max ? "top level" : `${lvl.toNext} XP to Level ${lvl.level + 1} · ${lvl.nextTitle}`}
            </p>
            <button type="button" onClick={() => openGuide("levels")} className="text-[12.5px] font-semibold text-ink underline underline-offset-4">
              How levels work
            </button>
          </div>
          <p className="mt-2 text-[12.5px] leading-snug text-muted">
            Daily login +{PY_XP.dailyLogin} · Practice +{PY_XP.practice.easy} / +{PY_XP.practice.medium} / +{PY_XP.practice.hard} · Video +{PY_XP.video} · Lesson
            examples and practice +{PY_XP.example} each · Final Challenge project +{PY_XP.project}.
          </p>
        </div>
        <div className="border-t border-hairline px-5 py-4 md:border-l md:border-t-0">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Daily login streak</p>
          <p className={cn("mt-0.5 flex items-center gap-1.5 text-[20px] font-extrabold", streak > 0 ? "text-[#c2410c]" : "text-ink")}>
            <Flame className="h-5 w-5" /> {streak} {streak === 1 ? "day" : "days"}
          </p>
          <p className="mt-1 text-[12.5px] leading-snug text-muted">Log in once a day to keep it going. Miss a day and it restarts.</p>
          <button type="button" onClick={() => openGuide("xp")} className="mt-1.5 text-[12.5px] font-semibold text-ink underline underline-offset-4">
            Streak details
          </button>
        </div>
        <div className="border-t border-hairline px-5 py-4 md:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
              Badges · {unlockedCount}/{ACHIEVEMENT_ORDER.length}
            </p>
            <button type="button" onClick={() => openGuide("achievements")} className="text-[12.5px] font-semibold text-ink underline underline-offset-4">
              See all
            </button>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10">
            {ACHIEVEMENT_ORDER.map((id) => (
              <AchievementButton key={id} id={id} size={52} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">How you earn XP</h2>
          <button type="button" onClick={() => openGuide("xp")} className="text-[12.5px] font-semibold text-ink underline underline-offset-4">
            Streak & rules
          </button>
        </div>
        <div className="mt-3 bg-white">
          <XpRulesList compact />
        </div>
        <h3 className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Badges you earn with XP</h3>
        <div className="mt-3 bg-white">
          <XpBadgeLadder />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Every lesson has three steps</h2>
        <p className="mt-1 text-[13.5px] text-muted">
          All three open together. Go through every Study slide to mark the lesson studied and unlock the next lesson.
        </p>
        <ol className="mt-3 grid border border-hairline bg-white sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className={cn("px-5 py-4", i > 0 && "border-t border-hairline sm:border-l sm:border-t-0")}>
              <p className="flex items-center gap-2 text-[15px] font-bold">
                <span className="font-mono text-[12px] text-coral">{i + 1}</span>
                <s.icon className="h-4 w-4 text-ink/70" /> {s.title}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Lessons</h2>
        <ol className="mt-3 divide-y divide-hairline border border-hairline bg-white">
          {PY_LESSON_INDEX.map((l) => {
            const p = progress[l.slug];
            const lessonDone = entryDone(l);
            const open = isPyEntryOpen(l, isLessonUnlocked);
            const body = (
              <>
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center border font-mono text-[13px] font-semibold",
                    lessonDone
                      ? "border-[#2f9e6e] bg-[#2f9e6e] text-white"
                      : open
                        ? "border-ink text-ink"
                        : "border-hairline text-muted/60",
                  )}
                >
                  {lessonDone ? <Check className="h-4 w-4" strokeWidth={3} /> : String(l.number).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-[15.5px] font-bold", !open && "text-ink/55")}>{l.title}</span>
                  <span className="block text-[13.5px] text-muted">{l.subtitle}</span>
                  <span className="mt-1.5 hidden flex-wrap gap-1.5 sm:flex">
                    {l.concepts.slice(0, 4).map((c) => (
                      <span key={c} className="border border-hairline bg-[#faf8f4] px-1.5 py-0.5 font-mono text-[10.5px] text-muted">
                        {c}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="shrink-0">
                  {!l.available ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted/70">
                      <Lock className="h-3.5 w-3.5" /> Soon
                    </span>
                  ) : !open ? (
                    <span className="inline-flex max-w-[140px] items-center gap-1.5 text-right font-mono text-[11px] leading-tight text-muted/80">
                      <Lock className="h-3.5 w-3.5 shrink-0" /> Finish Lesson {l.number - 1} study
                    </span>
                  ) : l.final ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] font-semibold text-ink">
                      <FlaskConical className="h-3.5 w-3.5" /> {projectsDone}/{PY_PROJECTS.length}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  ) : lessonDone ? (
                    <span className="flex flex-col items-end gap-0.5">
                      <Stars count={p?.stars ?? 0} size={14} className="text-[#e0a83a]" />
                      {p?.practice && (
                        <span className="font-mono text-[11px] font-semibold text-[#2f7a55]">
                          Best {p.bestScore ?? p.practice.score}/{p.practice.total}
                        </span>
                      )}
                    </span>
                  ) : (
                    <ArrowRight className="h-4 w-4 text-ink transition group-hover:translate-x-0.5" />
                  )}
                </span>
              </>
            );
            return (
              <li key={l.slug}>
                {open ? (
                  <Link href={pyLessonHref(l.slug)} className="group flex items-center gap-4 px-4 py-4 transition hover:bg-[#faf8f4] sm:px-5">
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-center gap-4 px-4 py-4 sm:px-5">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <Link
        href={PY_PRACTICE_PATH}
        className="mt-4 flex items-center gap-4 border border-hairline bg-white px-5 py-4 transition hover:border-ink"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-white">
          <Shuffle className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-ink">Practice · 500 questions</span>
          <span className="block text-[13px] leading-snug text-muted">
            True or false, multiple choice, and code for all 10 lessons. Easy, medium, and hard. Code questions open the compiler here.
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink" />
      </Link>

      <Link
        href={`${PY_PROFILE_PATH}?tab=certificate`}
        className="mt-3 flex items-center gap-4 border border-hairline bg-white px-5 py-4 transition hover:border-ink"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#c98a12] text-white">
          <Award className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-ink">
            {certificateId ? "Your certificate" : `Certificate · ${cert.requirements.filter((r) => r.done).length}/${cert.requirements.length} rules met`}
          </span>
          <span className="block text-[13px] leading-snug text-muted">
            {certificateId
              ? "Download the PDF or share its verify link."
              : "Study every lesson, solve 20+ practice problems and 50+ examples, and complete one Final Challenge project."}
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink" />
      </Link>
    </div>
  );
}
