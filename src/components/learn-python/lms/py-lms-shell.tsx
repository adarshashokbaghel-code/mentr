"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { PythonBadge } from "@/components/learn-python/python-badge";
import { PyToasts, Stars, XpChip } from "@/components/learn-python/lms/py-game-ui";
import { PyProgressGuide } from "@/components/learn-python/lms/py-progress-guide";
import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import { LEARN_PYTHON_PATH } from "@/lib/learn-python";
import {
  PY_COMPILER_PATH,
  PY_FINAL_PATH,
  PY_LESSON_INDEX,
  PY_LMS_BASE,
  PY_PRACTICE_PATH,
  PY_PROFILE_PATH,
  isPyEntryOpen,
  pyLessonHref,
} from "@/lib/python-lms";
import { PY_STAGES, resumeStage, stageDone } from "@/lib/python-lms/progress";
import { completedProjects } from "@/lib/python-lms/project-progress";
import { PY_PROJECTS, getPyProject } from "@/lib/python-lms/projects";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Check, LayoutGrid, ListChecks, Lock, Menu, Terminal, Trophy, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";

export function PyLmsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeLesson = PY_LESSON_INDEX.find((l) => !l.final && pathname === pyLessonHref(l.slug));
  const onFinal = pathname === PY_FINAL_PATH || pathname.startsWith(`${PY_FINAL_PATH}/`);
  const activeProject = pathname.startsWith(`${PY_FINAL_PATH}/`) ? getPyProject(pathname.slice(PY_FINAL_PATH.length + 1)) : null;

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#f7f5f0] text-ink lg:flex-row">
      <aside className="hidden h-full w-[288px] shrink-0 flex-col border-r border-hairline bg-white lg:flex">
        <Sidebar id="desk" onNavigate={() => undefined} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Course menu">
          <button
            type="button"
            className="absolute inset-0 bg-ink/45"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="py-slide-prev absolute inset-y-0 left-0 flex w-[86%] max-w-[320px] flex-col bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-2 top-3 z-10 flex h-9 w-9 items-center justify-center text-muted hover:text-ink"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar id="drawer" onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-hairline bg-white px-3 sm:px-5 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center border border-hairline text-ink lg:hidden"
            aria-label="Open course menu"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted">
            <Link href={PY_LMS_BASE} className="hover:text-ink">
              Python Beginner
            </Link>
            {activeLesson && (
              <>
                <span className="mx-1.5 text-hairline">/</span>
                <span className="text-ink">Lesson {activeLesson.number}</span>
              </>
            )}
            {pathname === PY_PRACTICE_PATH && (
              <>
                <span className="mx-1.5 text-hairline">/</span>
                <span className="text-ink">Practice</span>
              </>
            )}
            {pathname === PY_COMPILER_PATH && (
              <>
                <span className="mx-1.5 text-hairline">/</span>
                <span className="text-ink">Compiler</span>
              </>
            )}
            {onFinal && (
              <>
                <span className="mx-1.5 text-hairline">/</span>
                {activeProject ? (
                  <>
                    <Link href={PY_FINAL_PATH} className="hover:text-ink">
                      Final Challenge
                    </Link>
                    <span className="mx-1.5 text-hairline">/</span>
                    <span className="text-ink">{activeProject.title}</span>
                  </>
                ) : (
                  <span className="text-ink">Final Challenge</span>
                )}
              </>
            )}
            {pathname === PY_PROFILE_PATH && (
              <>
                <span className="mx-1.5 text-hairline">/</span>
                <span className="text-ink">Profile</span>
              </>
            )}
          </nav>
          <CompilerHeaderButton />
          <XpChip />
          <Link
            href={LEARN_PYTHON_PATH}
            className="hidden items-center gap-1 text-[13px] font-semibold text-muted transition hover:text-ink xl:inline-flex"
          >
            Course page <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </header>

        <main id="py-lms-main" className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          {children}
        </main>
      </div>
      <PyToasts />
      <PyProgressGuide />
    </div>
  );
}

function Sidebar({ id, onNavigate }: { id: string; onNavigate: () => void }) {
  const pathname = usePathname() ?? "";
  const { user } = useAuth();
  const { progress, isLessonUnlocked, projects } = usePyLms();
  const projectsDone = completedProjects(projects).length;
  const entryDone = (l: (typeof PY_LESSON_INDEX)[number]) => (l.final ? projectsDone > 0 : Boolean(progress[l.slug]?.completedAt));
  const done = PY_LESSON_INDEX.filter(entryDone).length;
  const name =
    (user?.role === "parent" ? user.parentProfile?.name : user?.profile?.name)?.trim() || user?.email || "";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Link
        href={LEARN_PYTHON_PATH}
        onClick={onNavigate}
        className="flex shrink-0 items-center gap-3 border-b border-hairline px-5 py-4"
      >
        <PythonBadge tier="beginner" idSuffix={`sidebar-${id}`} still className="w-10 shrink-0" />
        <span className="min-w-0">
          <span className="block text-[15px] font-extrabold leading-tight">Learn Python</span>
          <span className="block font-mono text-[11px] text-muted">Beginner · free</span>
        </span>
      </Link>

      <div className="shrink-0 border-b border-hairline px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Progress</span>
          <span className="font-mono text-[12px] font-semibold">
            {done} / {PY_LESSON_INDEX.length}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-10 gap-[3px]" aria-hidden>
          {PY_LESSON_INDEX.map((l) => (
            <span
              key={l.slug}
              className={cn("h-1.5", entryDone(l) ? "bg-[#2f9e6e]" : "bg-[#ece8e0]")}
            />
          ))}
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3" aria-label="Lessons">
        <Link
          href={PY_LMS_BASE}
          onClick={onNavigate}
          className={cn(
            "mb-2 flex items-center gap-2.5 px-2.5 py-2 text-[13.5px] font-semibold transition",
            pathname === PY_LMS_BASE ? "bg-[#f3f0e9] text-ink" : "text-muted hover:text-ink",
          )}
        >
          <LayoutGrid className="h-4 w-4" /> Course home
        </Link>

        <p className="px-2.5 pb-1.5 pt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Lessons</p>
        <ol className="space-y-0.5">
          {PY_LESSON_INDEX.map((l) => {
            const href = pyLessonHref(l.slug);
            const active = l.final ? pathname === href || pathname.startsWith(`${href}/`) : pathname === href;
            const lessonDone = entryDone(l);
            const open = isPyEntryOpen(l, isLessonUnlocked);
            const rowInner = (
              <>
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-[11.5px] font-semibold",
                    lessonDone
                      ? "border-[#2f9e6e] bg-[#2f9e6e] text-white"
                      : active
                        ? "border-ink bg-ink text-white"
                        : open
                          ? "border-ink/25 text-ink"
                          : "border-hairline text-muted/70",
                  )}
                >
                  {lessonDone ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : String(l.number).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate text-[13.5px] font-semibold", !open && "text-muted/80")}>
                    {l.title}
                  </span>
                  {!open && (
                    <span className="block font-mono text-[10.5px] text-muted/70">
                      {l.available ? `Finish Lesson ${l.number - 1} study` : "Coming soon"}
                    </span>
                  )}
                  {l.final ? (
                    <span className="block font-mono text-[10.5px] text-muted">
                      {projectsDone}/{PY_PROJECTS.length} projects · all open
                    </span>
                  ) : (
                    lessonDone && <Stars count={progress[l.slug]?.stars ?? 1} size={11} className="mt-0.5 text-ink" />
                  )}
                </span>
                {!open && <Lock className="h-3.5 w-3.5 shrink-0 text-muted/50" />}
              </>
            );

            return (
              <li key={l.slug}>
                {open ? (
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 border-l-2 px-2.5 py-2 transition",
                      active ? "border-coral bg-[#fbf7f1]" : "border-transparent hover:bg-[#faf8f4]",
                    )}
                  >
                    {rowInner}
                  </Link>
                ) : (
                  <div className="flex cursor-not-allowed items-center gap-3 border-l-2 border-transparent px-2.5 py-2">
                    {rowInner}
                  </div>
                )}
                {active && !l.final && (
                  <Suspense fallback={null}>
                    <StageLinks slug={l.slug} onNavigate={onNavigate} />
                  </Suspense>
                )}
              </li>
            );
          })}
        </ol>

        <Link
          href={PY_PRACTICE_PATH}
          onClick={onNavigate}
          aria-current={pathname === PY_PRACTICE_PATH ? "page" : undefined}
          className={cn(
            "mt-2 flex items-center gap-2.5 px-2.5 py-2 text-[13.5px] font-semibold transition",
            pathname === PY_PRACTICE_PATH ? "bg-[#f3f0e9] text-ink" : "text-muted hover:text-ink",
          )}
        >
          <ListChecks className="h-4 w-4" /> Practice
        </Link>
        <a
          href={PY_COMPILER_PATH}
          onClick={onNavigate}
          aria-current={pathname === PY_COMPILER_PATH ? "page" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 text-[13.5px] font-semibold transition",
            pathname === PY_COMPILER_PATH ? "bg-[#f3f0e9] text-ink" : "text-muted hover:text-ink",
          )}
        >
          <Terminal className="h-4 w-4" /> Python compiler
        </a>
        <Link
          href={PY_PROFILE_PATH}
          onClick={onNavigate}
          aria-current={pathname === PY_PROFILE_PATH ? "page" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 text-[13.5px] font-semibold transition",
            pathname === PY_PROFILE_PATH ? "bg-[#f3f0e9] text-ink" : "text-muted hover:text-ink",
          )}
        >
          <Trophy className="h-4 w-4" /> Profile & certificate
        </Link>
      </nav>

      {name && (
        <div className="shrink-0 border-t border-hairline px-5 py-3.5">
          <p className="truncate text-[13px] font-semibold">{name}</p>
          <p className="font-mono text-[11px] text-muted">{user?.role === "faculty" ? "Tutor" : "Parent"} account</p>
        </div>
      )}
    </div>
  );
}

function CompilerHeaderButton() {
  const active = (usePathname() ?? "") === PY_COMPILER_PATH;
  return (
    <a
      href={PY_COMPILER_PATH}
      aria-current={active ? "page" : undefined}
      aria-label="Python compiler"
      title="Python compiler"
      className={cn(
        "flex h-8 items-center gap-1.5 border px-2 text-[12.5px] font-bold transition",
        active ? "border-[#1f2a23] bg-[#0f1612] text-white" : "border-hairline bg-white text-ink hover:border-ink",
      )}
    >
      <Terminal className="h-3.5 w-3.5" />
      <span className="hidden 2xl:inline">Compiler</span>
    </a>
  );
}

function StageLinks({ slug, onNavigate }: { slug: string; onNavigate: () => void }) {
  const params = useSearchParams();
  const { progress } = usePyLms();
  const p = progress[slug];
  const current = params?.get("stage") ?? resumeStage(p);

  return (
    <ol className="mb-1 ml-[22px] border-l border-hairline py-1 pl-4">
      {PY_STAGES.map((s) => {
        const isDone = stageDone(p, s.id);
        const isCurrent = current === s.id;
        const cls = cn("flex items-center gap-2 py-1.5 text-[12.5px] transition", isCurrent ? "font-bold text-ink" : "text-muted hover:text-ink");
        const dot = (
          <span
            className={cn(
              "h-2 w-2 shrink-0",
              isDone ? "bg-[#2f9e6e]" : isCurrent ? "bg-coral" : "border border-muted/40",
            )}
          />
        );
        return (
          <li key={s.id}>
            <Link href={`${pyLessonHref(slug)}?stage=${s.id}`} onClick={onNavigate} className={cls} scroll={false}>
              {dot}
              {s.label}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
