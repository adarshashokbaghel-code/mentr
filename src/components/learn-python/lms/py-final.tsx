"use client";

import { CodeView, PyEditor } from "@/components/learn-python/lms/py-lms-ui";
import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import { PY_CERT_RULES } from "@/lib/python-lms/certificate";
import { PY_FINAL_PATH, PY_PROFILE_PATH, pyProjectHref } from "@/lib/python-lms";
import { readProjectDraft, writeProjectDraft } from "@/lib/python-lms/progress";
import { projectStatus, type ProjectStatus } from "@/lib/python-lms/project-progress";
import { PY_PROJECTS, getPyProject, type PyProject } from "@/lib/python-lms/projects";
import { PY_XP } from "@/lib/python-lms/rules";
import { COMPILER_TIMEOUT_MS } from "@/lib/python/config";
import { getPythonEngine, supportsInteractiveInput, type OutputChunk, type RunResult } from "@/lib/python/engine";
import { preloadPython, runPython } from "@/lib/python-runner";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  ShieldAlert,
  Square,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

const STATUS: Record<ProjectStatus, { label: string; className: string }> = {
  "not-started": { label: "Not started", className: "border-hairline text-muted" },
  "in-progress": { label: "In progress", className: "border-[#e0a83a] bg-[#fff7e6] text-[#8a5a00]" },
  completed: { label: "Completed", className: "border-[#2f9e6e] bg-[#eef8f2] text-[#1d6b49]" },
  "solution-viewed": { label: "Solution viewed", className: "border-[#d9cfc0] bg-[#f6f2ea] text-[#6b6255]" },
};

function StatusPill({ status }: { status: ProjectStatus }) {
  const s = STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em]", s.className)}>
      {status === "completed" && <Check className="h-3 w-3" strokeWidth={3} />}
      {status === "solution-viewed" && <Eye className="h-3 w-3" />}
      {s.label}
    </span>
  );
}

function LevelTag({ level }: { level: PyProject["level"] }) {
  return (
    <span
      className={cn(
        "border px-1.5 py-0.5 font-mono text-[10.5px] font-bold uppercase",
        level === "hard" ? "border-[#d4532f]/40 text-[#b2401f]" : "border-[#c98a12]/40 text-[#8a5a00]",
      )}
    >
      {level}
    </span>
  );
}

function useHasDraft() {
  const { userId } = usePyLms();
  return (id: string) => {
    const d = readProjectDraft(userId, id);
    const p = getPyProject(id);
    return Boolean(d && p && d.trim() !== p.starter.trim());
  };
}

export function PyFinalHome() {
  const { projects } = usePyLms();
  const hasDraft = useHasDraft();
  const done = PY_PROJECTS.filter((p) => projects[p.id]?.completedAt).length;

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <p className="font-mono text-[11.5px] text-coral">Lesson 10 · Final Challenge</p>
      <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">Build five real programs</h1>
      <p className="mt-1.5 max-w-[64ch] text-[15px] leading-relaxed text-muted">
        Everything from the course in one place: input, decisions, loops, strings, lists and functions. Pick any project. They are all open.
      </p>

      <section className="mt-6 grid border border-[#1f2a23] bg-[#0f1612] text-white md:grid-cols-[1fr_auto]">
        <div className="px-5 py-5 sm:px-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5ee0a0]">How projects are marked</p>
          <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-white/80">
            <li className="flex gap-2.5">
              <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-[#5ee0a0]" />
              <span>
                Press <b className="text-white">Run</b>. When the program is correct, it is marked complete on the spot.
              </span>
            </li>
            <li className="flex gap-2.5">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb27a]" />
              <span>Hints are free. Use as many as you need. They never stop a project counting.</span>
            </li>
            <li className="flex gap-2.5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9b8a]" />
              <span>
                Opening the <b className="text-white">full solution</b> still lets you finish the project. Run a correct program and it is marked complete.
              </span>
            </li>
            <li className="flex gap-2.5">
              <Award className="mt-0.5 h-4 w-4 shrink-0 text-[#e0c36a]" />
              <span>
                Each completed project is +{PY_XP.project} XP. The certificate needs {PY_CERT_RULES.projects} completed project.
              </span>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-4 border-t border-white/10 px-5 py-5 sm:px-7 md:flex-col md:justify-center md:border-l md:border-t-0">
          <p className="text-[40px] font-extrabold leading-none">
            {done}
            <span className="text-[20px] text-white/40">/{PY_PROJECTS.length}</span>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/55">completed</p>
          <Link href={`${PY_PROFILE_PATH}?tab=certificate`} className="ml-auto text-[13px] font-semibold text-[#5ee0a0] underline underline-offset-4 md:ml-0">
            Certificate progress
          </Link>
        </div>
      </section>

      <ol className="mt-6 grid gap-4 md:grid-cols-2">
        {PY_PROJECTS.map((p) => {
          const status = projectStatus(projects[p.id], hasDraft(p.id));
          return (
            <li key={p.id}>
              <Link
                href={pyProjectHref(p.id)}
                className="group flex h-full flex-col border border-hairline bg-white px-5 py-5 transition hover:border-ink"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center bg-ink font-mono text-[13px] font-bold text-white">{p.number}</span>
                  <LevelTag level={p.level} />
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted">
                    <Clock className="h-3 w-3" /> {p.minutes} min
                  </span>
                  <span className="ml-auto">
                    <StatusPill status={status} />
                  </span>
                </div>
                <h2 className="mt-3 text-[19px] font-extrabold leading-tight">{p.title}</h2>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{p.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.concepts.map((c) => (
                    <span key={c} className="border border-hairline bg-[#faf8f4] px-1.5 py-0.5 font-mono text-[10.5px] text-muted">
                      {c}
                    </span>
                  ))}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[14px] font-bold text-ink">
                  {status === "completed" ? "Open again" : status === "not-started" ? "Start project" : "Continue"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const sampleLines = (sample: string) =>
  sample.split("\n").map((line) => (line.startsWith("> ") ? { typed: true, text: line.slice(2) } : { typed: false, text: line }));

export function PyProjectWorkspace({ id }: { id: string }) {
  const project = getPyProject(id);
  if (!project) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-16 text-center">
        <p className="text-[18px] font-bold">That project does not exist.</p>
        <Link href={PY_FINAL_PATH} className="mt-3 inline-block font-semibold underline underline-offset-4">
          Back to the Final Challenge
        </Link>
      </div>
    );
  }
  return <Workspace key={project.id} project={project} />;
}

const SPARKS = [
  { x: "-30px", y: "-24px", color: "#5ee0a0", delay: "0ms" },
  { x: "32px", y: "-20px", color: "#e0c36a", delay: "50ms" },
  { x: "-36px", y: "10px", color: "#ffb27a", delay: "90ms" },
  { x: "34px", y: "14px", color: "#5ee0a0", delay: "30ms" },
  { x: "2px", y: "-36px", color: "#e0c36a", delay: "70ms" },
  { x: "6px", y: "30px", color: "#ffb27a", delay: "110ms" },
];

function CompletePopup({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Project complete"
    >
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/55" onClick={onClose} />
      <div className="py-celebrate-card relative w-full max-w-[360px] border border-ink bg-white px-5 py-5 text-center shadow-2xl sm:px-6 sm:py-7">
        <div className="relative mx-auto h-12 w-12 sm:h-14 sm:w-14">
          {SPARKS.map((spark) => (
            <span
              key={`${spark.x}${spark.y}`}
              className="py-celebrate-spark absolute left-1/2 top-1/2 h-1.5 w-1.5"
              style={{ background: spark.color, animationDelay: spark.delay, ["--x" as string]: spark.x, ["--y" as string]: spark.y }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center bg-[#eef8f2]">
            <Check className="h-6 w-6 text-[#1d6b49] sm:h-7 sm:w-7" strokeWidth={3} />
          </div>
        </div>
        <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#1d6b49] sm:mt-4">Correct</p>
        <h2 className="mt-1 text-[19px] font-extrabold leading-tight tracking-tight sm:text-[22px]">{title}</h2>
        <p className="mt-1 text-[13.5px] text-muted sm:text-[14px]">Marked complete</p>
        <p className="mt-2 font-mono text-[13px] font-bold text-[#1d6b49]">+{PY_XP.project} XP</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full bg-ink px-6 py-2.5 text-[14px] font-bold text-white hover:bg-ink-soft sm:mt-5 sm:w-auto"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Workspace({ project }: { project: PyProject }) {
  const { userId, projects, completeProject, viewProjectSolution, recordProjectHint } = usePyLms();
  const p = projects[project.id];
  const [code, setCode] = useState(() => readProjectDraft(userId, project.id) ?? project.starter);
  const interactive = useSyncExternalStore(noopSubscribe, supportsInteractiveInput, () => false);
  const [chunks, setChunks] = useState<OutputChunk[]>([]);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [markLine, setMarkLine] = useState<number | undefined>();
  const [judging, setJudging] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [hintsShown, setHintsShown] = useState(p?.hintsUsed ?? 0);
  const [confirmSolution, setConfirmSolution] = useState(false);
  const [solutionRequested, setSolutionOpen] = useState(false);
  const solutionOpen = solutionRequested || Boolean(p?.solutionViewedAt);
  const consoleRef = useRef<HTMLDivElement>(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [ranOnce, setRanOnce] = useState(false);
  const [mobilePane, setMobilePane] = useState<"brief" | "code">("brief");
  const status = projectStatus(p, code.trim() !== project.starter.trim());
  const shown = Math.max(hintsShown, p?.hintsUsed ?? 0);

  useEffect(() => {
    void preloadPython();
  }, []);

  useEffect(() => {
    if (supportsInteractiveInput()) return;
    const key = "mentr-py-final-iso";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    window.location.reload();
  }, []);

  useEffect(() => {
    const el = consoleRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chunks, runResult, awaitingInput]);

  useEffect(() => {
    const t = setTimeout(() => writeProjectDraft(userId, project.id, code), 400);
    return () => clearTimeout(t);
  }, [userId, project.id, code]);

  async function programPasses(source: string) {
    if (project.codeRules.some((rule) => !rule.test(source))) return false;
    for (const t of project.tests) {
      const r = await runPython(source, t.inputs);
      if (t.check(r)) return false;
    }
    return true;
  }

  async function runFree() {
    setConsoleOpen(true);
    setRanOnce(true);
    setMobilePane("code");
    if (running) {
      getPythonEngine().stop();
      return;
    }
    if (judging) return;
    setChunks([]);
    setRunResult(null);
    setAwaitingInput(false);
    setMarkLine(undefined);
    if (!p?.completedAt) {
      setJudging(true);
      setChunks([{ stream: "stdout", text: "Checking your program…\n" }]);
      const ok = await programPasses(code);
      setJudging(false);
      setChunks([]);
      if (ok) {
        completeProject(project.id, code);
        setCelebrate(true);
      }
    }
    setRunning(true);
    const r = await getPythonEngine().run(code, {
      stdin: "",
      interactive: true,
      timeoutMs: COMPILER_TIMEOUT_MS,
      onInputRequest: () => setAwaitingInput(true),
      onOutput: (c) => setChunks((list) => mergeChunk(list, c)),
    });
    setAwaitingInput(false);
    setRunning(false);
    setRunResult(r);
    setMarkLine(r.error?.line);
  }

  function submitInput(line: string | null) {
    setAwaitingInput(false);
    getPythonEngine().provideInput(line);
  }

  function nextHint() {
    const n = Math.min(project.hints.length, shown + 1);
    setHintsShown(n);
    recordProjectHint(project.id, n);
  }

  function openSolution() {
    if (!p?.completedAt) viewProjectSolution(project.id);
    setConfirmSolution(false);
    setSolutionOpen(true);
  }

  return (
    <div className="absolute inset-0 flex min-h-0 flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-hairline px-3 sm:gap-3 sm:px-4">
        <Link href={PY_FINAL_PATH} className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold text-muted hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Projects</span>
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-[15px] font-extrabold tracking-tight sm:text-[17px]">
          <span className="mr-2 font-mono text-[12px] font-bold text-coral">{project.number}</span>
          {project.title}
        </h1>
        <StatusPill status={status} />
      </header>

      <div className="flex shrink-0 border-b border-hairline md:hidden">
        <button
          type="button"
          onClick={() => setMobilePane("brief")}
          className={cn("flex-1 py-2.5 text-[13px] font-bold", mobilePane === "brief" ? "border-b-2 border-ink text-ink" : "text-muted")}
        >
          Brief
        </button>
        <button
          type="button"
          onClick={() => setMobilePane("code")}
          className={cn("flex-1 py-2.5 text-[13px] font-bold", mobilePane === "code" ? "border-b-2 border-ink text-ink" : "text-muted")}
        >
          Code
        </button>
        <button
          type="button"
          onClick={() => void runFree()}
          disabled={judging}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 px-4 text-[12.5px] font-bold text-[#0b100d] disabled:opacity-70",
            running ? "bg-[#ffb27a]" : "bg-[#5ee0a0]",
          )}
        >
          {running ? <Square className="h-3 w-3 fill-current" /> : <span className="font-mono">▶</span>}
          {judging ? "Checking…" : running ? "Stop" : "Run"}
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden md:grid-cols-[minmax(0,1.15fr)_minmax(280px,1fr)] xl:grid-cols-[minmax(420px,1.25fr)_minmax(360px,1fr)]">
        <section className={cn("h-full min-h-0 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 md:border-r md:border-hairline lg:px-8", mobilePane === "brief" ? "block" : "hidden md:block")}>
          <div className="border border-hairline bg-white px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">The brief</h2>
              <LevelTag level={project.level} />
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted">
                <Clock className="h-3 w-3" /> {project.minutes} min
              </span>
              <StatusPill status={status} />
            </div>
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-ink sm:text-[17px]">{project.tagline}</p>
            <p className="mt-3 text-[15.5px] leading-[1.7] text-ink sm:text-[16.5px]">{project.brief}</p>
            <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Your program must</h3>
            <ol className="mt-3 space-y-3">
              {project.requirements.map((req, i) => (
                <li key={req} className="flex gap-3 text-[15px] leading-relaxed sm:text-[15.5px]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-ink/20 font-mono text-[12px] font-semibold">
                    {i + 1}
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.concepts.map((c) => (
                <span key={c} className="border border-hairline bg-[#faf8f4] px-1.5 py-0.5 font-mono text-[10.5px] text-muted">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <details className="group border border-[#2a332d] bg-[#0f1411]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
              Sample run <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <pre className="max-h-[340px] overflow-auto border-t border-white/10 px-4 py-3 font-mono text-[12.5px] leading-[1.65]">
              {sampleLines(project.sample).map((l, i) =>
                l.typed ? (
                  <span key={i} className="block text-[#5ee0a0]">
                    <span className="select-none text-white/30">› </span>
                    {l.text}
                  </span>
                ) : (
                  <span key={i} className="block text-[#e8ece9]">
                    {l.text}
                  </span>
                ),
              )}
            </pre>
            <p className="border-t border-white/10 px-4 py-2 text-[11.5px] text-white/45">Green lines are what the player types.</p>
          </details>

          <div className="border border-hairline bg-white px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-[15px] font-bold">
                <Lightbulb className="h-4 w-4 text-[#c98a12]" /> Hints
              </h2>
              <span className="font-mono text-[11px] text-muted">
                {shown} of {project.hints.length} shown
              </span>
            </div>
            {shown > 0 && (
              <ol className="mt-3 space-y-2">
                {project.hints.slice(0, shown).map((h, i) => (
                  <li key={i} className="border-l-2 border-[#e0a83a] bg-[#fffaf0] px-3 py-2 text-[13.5px] leading-relaxed">
                    <span className="mr-1.5 font-mono text-[11px] font-bold text-[#8a5a00]">{i + 1}.</span>
                    {h}
                  </li>
                ))}
              </ol>
            )}
            {shown < project.hints.length ? (
              <button
                type="button"
                onClick={nextHint}
                className="mt-3 inline-flex items-center gap-1.5 border border-ink px-3 py-1.5 text-[13px] font-bold transition hover:bg-ink hover:text-white"
              >
                {shown === 0 ? "Show the first hint" : "Show the next hint"}
              </button>
            ) : (
              <p className="mt-3 text-[13px] text-muted">That is every hint. Hints never stop a project counting.</p>
            )}
          </div>

          <div className="border border-hairline bg-white px-5 py-4">
            <h2 className="flex items-center gap-2 text-[15px] font-bold">
              <Eye className="h-4 w-4" /> Full solution
            </h2>
            {solutionOpen ? (
              <>
                <p className="mt-1 text-[13px] text-muted">One way to solve it. Yours can look different and still pass.</p>
                <CodeView code={project.solution} className="mt-3 max-h-[420px] overflow-auto border border-[#2a332d]" />
                <button
                  type="button"
                  onClick={() => setCode(project.solution)}
                  className="mt-3 text-[13px] font-semibold underline underline-offset-4"
                >
                  Copy into the editor
                </button>
              </>
            ) : (
              <>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {p?.completedAt
                    ? "You already completed this project, so opening the solution changes nothing."
                    : "You can still mark this project complete after reading it. Run a correct program."}
                </p>
                <button
                  type="button"
                  onClick={() => (p?.completedAt ? openSolution() : setConfirmSolution(true))}
                  className="mt-3 text-[13px] font-semibold text-muted underline underline-offset-4 hover:text-ink"
                >
                  Show the full solution
                </button>
              </>
            )}
          </div>
        </section>

        <section className={cn("h-full min-h-0 min-w-0 flex-col overflow-hidden bg-[#141b16]", mobilePane === "code" ? "flex" : "hidden md:flex")}>
          <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-1.5">
            <span className="mr-auto font-mono text-[11px] text-white/45">main.py</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Replace your code with the starter? Your current code will be lost.")) setCode(project.starter);
              }}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-[12px] font-semibold text-white/55 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
            <button
              type="button"
              onClick={() => void runFree()}
              disabled={judging}
              className={cn(
                "hidden items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-bold text-[#0b100d] disabled:opacity-70 md:inline-flex",
                running ? "bg-[#ffb27a]" : "bg-[#5ee0a0] hover:bg-[#7aebc0]",
              )}
            >
              {running ? <Square className="h-3 w-3 fill-current" /> : <span className="font-mono">▶</span>}
              {judging ? "Checking…" : running ? "Stop" : "Run"}
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <PyEditor value={code} onChange={setCode} onRun={() => void runFree()} minLines={22} markLine={markLine} />
          </div>

          <div className={cn("shrink-0 overflow-hidden transition-[max-height] duration-300 ease-out", consoleOpen ? "max-h-[min(46dvh,18rem)]" : "max-h-0")}>
            <div className="flex h-[min(46dvh,18rem)] flex-col border-t border-white/10 bg-[#0b100d] text-[#e8ece9]">
              <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/10 px-3">
                <span className="font-mono text-[11px] text-white/45">Console</span>
                {awaitingInput && <span className="min-w-0 truncate font-mono text-[11px] text-[#5ee0a0]">type, then Enter</span>}
                <button
                  type="button"
                  onClick={() => setConsoleOpen(false)}
                  className="ml-auto inline-flex h-8 items-center gap-1 px-2 text-[12px] font-semibold text-white/55 hover:text-white"
                  aria-label="Hide console"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div ref={consoleRef} className="min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-[16px] leading-[1.65] sm:text-[13.5px]">
                <ProjectConsole chunks={chunks} result={runResult} running={running} interactive={interactive} awaitingInput={awaitingInput} onSubmitInput={submitInput} />
              </div>
            </div>
          </div>

          {!consoleOpen && ranOnce && (
            <button
              type="button"
              onClick={() => setConsoleOpen(true)}
              className="flex h-10 shrink-0 items-center gap-2 border-t border-white/10 bg-[#0b100d] px-3 text-left font-mono text-[12px] text-white/70 hover:text-white"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              Console
              {awaitingInput && <span className="text-[#5ee0a0]">waiting for input</span>}
            </button>
          )}
        </section>
      </div>

      {celebrate && <CompletePopup title={project.title} onClose={() => setCelebrate(false)} />}

      {confirmSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Open the full solution?">
          <button type="button" aria-label="Cancel" className="absolute inset-0 bg-ink/50" onClick={() => setConfirmSolution(false)} />
          <div className="relative w-full max-w-[440px] border border-ink bg-white px-6 py-5 shadow-xl">
            <p className="flex items-center gap-2 text-[17px] font-extrabold">
              <ShieldAlert className="h-5 w-5 text-[#d4532f]" /> Open the full solution?
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              <b className="text-ink">{project.title}</b> will show its finished program. You can still run your own code afterwards, and a correct Run marks the project complete.
            </p>
            {shown < project.hints.length && (
              <p className="mt-2 text-[13px] text-[#8a5a00]">
                You still have {project.hints.length - shown} hint{project.hints.length - shown === 1 ? "" : "s"} left.
              </p>
            )}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setConfirmSolution(false)} className="border border-hairline px-4 py-2 text-[13.5px] font-bold">
                Keep trying
              </button>
              <button type="button" onClick={openSolution} className="bg-[#d4532f] px-4 py-2 text-[13.5px] font-bold text-white">
                Show solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const noopSubscribe = () => () => undefined;

function mergeChunk(list: OutputChunk[], chunk: OutputChunk): OutputChunk[] {
  const last = list[list.length - 1];
  if (last && last.stream === chunk.stream) return [...list.slice(0, -1), { ...last, text: last.text + chunk.text }];
  return [...list, chunk];
}

function ConsoleInput({ onSubmit }: { onSubmit: (line: string | null) => void }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "d" && e.ctrlKey && !value) {
      e.preventDefault();
      onSubmit(null);
    }
  }

  return (
    <form
      className="inline"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <input
        ref={ref}
        data-py-stdin
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        enterKeyHint="send"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        aria-label="Type your input and press Enter"
        style={{ width: `${Math.max(value.length + 2, 3)}ch` }}
        className="inline max-w-full border-b border-[#5ee0a0]/50 bg-transparent p-0 font-mono text-[16px] text-[#5ee0a0] caret-[#5ee0a0] outline-none focus:border-[#5ee0a0] sm:text-[13.5px]"
      />
    </form>
  );
}

function ProjectConsole({
  chunks,
  result,
  running,
  interactive,
  awaitingInput,
  onSubmitInput,
}: {
  chunks: OutputChunk[];
  result: RunResult | null;
  running: boolean;
  interactive: boolean;
  awaitingInput: boolean;
  onSubmitInput: (line: string | null) => void;
}) {
  if (!chunks.length && !result && !awaitingInput) {
    return (
      <p className="text-white/30">
        {running
          ? ""
          : interactive
            ? "Press Run. When the program asks for input(), type the answer on this line and press Enter."
            : "Press Run to see your program's output here."}
      </p>
    );
  }
  const e = result?.error;
  return (
    <>
      {(chunks.length > 0 || awaitingInput) && (
        <pre className="whitespace-pre-wrap break-words">
          {chunks.map((c, i) => (
            <span key={i} className={c.stream === "stderr" ? "text-[#ff9b8a]" : c.stream === "stdin" ? "text-[#5ee0a0]" : "text-[#e8ece9]"}>
              {c.text}
            </span>
          ))}
          {awaitingInput && <ConsoleInput onSubmit={onSubmitInput} />}
        </pre>
      )}
      {result?.ok && !chunks.length && <p className="text-white/40">(no output)</p>}
      {e && result?.status !== "stopped" && (
        <p className="mt-3 border-l-2 border-[#ff9b8a] pl-3 font-mono text-[13px] text-[#ff9b8a]">
          {e.type === "TimeoutError" || e.type === "LoadError" || e.type === "RuntimeError" ? e.message : `${e.type}: ${e.message}`}
          {e.line ? ` (line ${e.line})` : ""}
        </p>
      )}
      {result?.status === "stopped" && <p className="mt-2 text-white/45">Program stopped.</p>}
    </>
  );
}
