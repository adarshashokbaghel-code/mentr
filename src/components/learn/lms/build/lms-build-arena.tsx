"use client";

import { LmsBuildCoach } from "@/components/learn/lms/build/lms-build-coach";
import {
  LmsBuildHintModal,
  LmsBuildResultModal,
} from "@/components/learn/lms/build/lms-build-modals";
import { LmsBuildStagePath } from "@/components/learn/lms/build/lms-build-stage-path";
import { LmsBuildStageStack } from "@/components/learn/lms/build/lms-build-stage-stack";
import { LmsBuildStageStory } from "@/components/learn/lms/build/lms-build-stage-story";
import type { LearnDinoAction } from "@/lib/learn-assets";
import {
  noteBuildAttemptLocal,
  readBuildProgressLocal,
  submitBuildComplete,
} from "@/lib/learn-build-client";
import {
  expandBuildOrder,
  getNextBuildMission,
  matchesBuildSolution,
  simulateMaze,
  type BuildDir,
  type BuildMission,
} from "@/lib/learn-build-missions";
import {
  ArrowLeft,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

const BlocklyLazy = dynamic(
  () =>
    import("@/components/learn/lms/build/lms-build-blockly").then(
      (m) => m.LmsBuildBlockly,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] items-center justify-center bg-[#faf8f4] text-[12px] font-bold text-[#8a929c]">
        Loading blocks…
      </div>
    ),
  },
);

type Status = "idle" | "running" | "success" | "fail";

function evaluateRun(mission: BuildMission, order: string[]) {
  const expanded = expandBuildOrder(order);

  if ((mission.stage === "maze" || mission.stage === "path") && mission.maze) {
    const onlyMoves = expanded.every(
      (c) => c === "forward" || c === "left" || c === "right" || c === "water",
    );
    if (mission.stage === "maze" || onlyMoves) {
      const sim = simulateMaze(mission.maze, expanded);
      // Maze: reaching the flag is enough (any valid path).
      // Path gardens still also accept exact recipe matches (e.g. B5).
      const ok =
        mission.stage === "maze"
          ? sim.ok
          : sim.ok || matchesBuildSolution(order, mission);
      return { ok, trail: sim.trail, hitWall: sim.hitWall };
    }
  }

  return {
    ok: matchesBuildSolution(order, mission),
    trail: null as { x: number; y: number; dir: BuildDir }[] | null,
    hitWall: false,
  };
}

function labelFor(mission: BuildMission, id: string) {
  return (
    mission.steps.find((s) => s.id === id)?.label ||
    mission.distractors?.find((s) => s.id === id)?.label ||
    id
  );
}

export function LmsBuildArena({ mission }: { mission: BuildMission }) {
  const apiRef = useRef<{
    run: () => { ok: boolean; order: string[] };
    reset: () => void;
    getOrder: () => string[];
  } | null>(null);

  const [hintLevel, setHintLevel] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [playingOrder, setPlayingOrder] = useState<string[] | null>(null);
  const [lastOrder, setLastOrder] = useState<string[]>([]);
  const [hitWall, setHitWall] = useState(false);
  const [trail, setTrail] = useState<
    { x: number; y: number; dir: BuildDir }[] | null
  >(null);
  const [watered, setWatered] = useState(0);
  const [attempts, setAttempts] = useState(() => {
    const p = readBuildProgressLocal();
    return p.attempts[mission.id] ?? 0;
  });
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const [firstTryWin, setFirstTryWin] = useState(false);
  const [coachMsg, setCoachMsg] = useState(mission.coachIntro);
  const [dinoAction, setDinoAction] = useState<LearnDinoAction>("wave");
  const [runLog, setRunLog] = useState<string>("Ready. Stack blocks, then Run.");

  const onReady = useCallback((api: NonNullable<typeof apiRef.current>) => {
    apiRef.current = api;
  }, []);

  async function handleRun() {
    const api = apiRef.current;
    if (!api || status === "running") return;

    const nextAttempts = noteBuildAttemptLocal(mission.id);
    setAttempts(nextAttempts);
    setStatus("running");
    setResultOpen(false);
    setDinoAction("cheer");
    setCoachMsg("Running your algorithm…");
    setRunLog("▶ Running…");

    const raw = api.getOrder();
    const order = expandBuildOrder(raw);
    const result = evaluateRun(mission, raw);
    setPlayingOrder(order);
    setLastOrder(raw);
    setHitWall(Boolean(result.hitWall));

    const yours = raw.length
      ? raw.map((id) => labelFor(mission, id)).join(" → ")
      : "(empty)";
    setRunLog(`▶ yours: ${yours}`);

    if (result.trail) {
      setTrail(result.trail);
    } else if (mission.maze && mission.stage === "path") {
      const start = mission.maze.start;
      setTrail(
        Array.from({ length: Math.max(1, order.length) }, () => ({
          ...start,
        })),
      );
    } else {
      setTrail(null);
    }

    const waterCount = order.filter((c) => c === "water").length;
    setWatered(0);
    if (waterCount > 0) {
      let w = 0;
      const wid = window.setInterval(() => {
        w += 1;
        setWatered(w);
        if (w >= waterCount) window.clearInterval(wid);
      }, 360);
    }

    const waitMs = Math.max(
      700,
      (result.trail?.length ?? order.length) * 380 + 250,
    );
    await new Promise((r) => setTimeout(r, waitMs));

    const finalOk =
      mission.stage === "maze"
        ? result.ok
        : mission.id === "B5"
          ? matchesBuildSolution(raw, mission)
          : result.ok || matchesBuildSolution(raw, mission);

    if (finalOk) {
      const firstTry = nextAttempts === 1;
      const xpGain = mission.xp + (firstTry ? mission.firstTryBonus : 0);
      setStatus("success");
      setFirstTryWin(firstTry);
      setDinoAction("cheer");
      setCoachMsg(mission.successMsg);
      setEarnedXp(xpGain);
      setRunLog(`▶ yours: ${yours}\n→ pass · +${xpGain} XP`);
      setResultOpen(true);
      void submitBuildComplete({
        missionId: mission.id,
        firstTry,
        attempts: nextAttempts,
      });
    } else {
      setStatus("fail");
      setFirstTryWin(false);
      setDinoAction("handshake");
      setCoachMsg(
        raw.length === 0
          ? mission.emptyMsg
          : result.hitWall
            ? "Bonk! Wall hit — try another path."
            : "Not quite — open a hint or fix the stack.",
      );
      setRunLog(
        `▶ yours: ${yours}\n→ fail${result.hitWall ? " (hit wall)" : ""}`,
      );
      setResultOpen(true);
    }
  }

  function openHint() {
    if (hintLevel >= 3) {
      setHintOpen(true);
      return;
    }
    const next = hintLevel + 1;
    setHintLevel(next);
    setHintOpen(true);
    setDinoAction("peek");
  }

  function handleReset() {
    apiRef.current?.reset();
    setPlayingOrder(null);
    setTrail(null);
    setWatered(0);
    setStatus("idle");
    setEarnedXp(null);
    setResultOpen(false);
    setDinoAction("wave");
    setCoachMsg(mission.coachIntro);
    setRunLog("Ready. Stack blocks, then Run.");
    setLastOrder([]);
    setHitWall(false);
  }

  const nextMission = getNextBuildMission(mission.id)?.id ?? null;
  const currentHint =
    hintLevel > 0 ? mission.hints[Math.min(hintLevel, 3) - 1] : mission.hints[0];

  return (
    <div className="-mx-4 flex min-h-[calc(100dvh-7.5rem)] flex-col gap-2.5 pb-4 sm:-mx-6 lg:-mx-8 lg:min-h-[calc(100dvh-6.5rem)] xl:-mx-10">
      <div className="flex shrink-0 flex-wrap items-center gap-2 px-4 sm:px-6 lg:px-8 xl:px-10">
        <Link
          href="/learn/app/build"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e2d8] bg-white text-[#8a929c] transition hover:border-[#1c2434] hover:text-[#1c2434]"
          aria-label="All builds"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h1 className="truncate text-[15px] font-extrabold text-[#1c2434] sm:text-[16px]">
              {mission.id} · {mission.title}
            </h1>
            <span className="rounded-full bg-[#f3efe7] px-2 py-0.5 text-[10px] font-bold text-[#8a929c]">
              {mission.concept}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openHint}
            className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#e8e2d8] bg-white px-2.5 text-[11px] font-extrabold text-[#1c2434]"
          >
            <Lightbulb className="h-3.5 w-3.5 text-[#f59e0b]" />
            Hint {hintLevel}/3
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e2d8] bg-white text-[#1c2434]"
            aria-label="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => void handleRun()}
            disabled={status === "running"}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#ff6a1a] px-3.5 text-[12px] font-extrabold text-white shadow-[2px_2px_0_0_#1c2434] disabled:opacity-60"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {status === "running" ? "…" : "Run"}
          </button>
        </div>
      </div>

      {/* Task description + coach */}
      <div className="grid gap-2 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:px-8 xl:px-10">
        <div className="rounded-2xl border border-[#e8e2d8] bg-white px-3.5 py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#a89f91]">
            Your task
          </p>
          <p className="mt-1 text-[13px] font-bold leading-snug text-[#1c2434]">
            {mission.description}
          </p>
          <ol className="mt-2.5 space-y-1.5">
            {mission.taskSteps.map((step, i) => (
              <li
                key={`${mission.id}-step-${i}`}
                className="flex items-start gap-2 text-[12px] font-medium leading-snug text-[#5a6472]"
              >
                <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#fff4e8] text-[10px] font-extrabold text-[#ff6a1a]">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <LmsBuildCoach message={coachMsg} action={dinoAction} />
      </div>

      <div className="grid min-h-0 flex-1 gap-2.5 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.65fr)] lg:px-8 xl:px-10">
        <div className="flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white lg:min-h-0">
          <div className="min-h-0 flex-1">
            <BlocklyLazy mission={mission} onReady={onReady} className="h-full" />
          </div>
        </div>

        <div className="flex min-h-[220px] flex-col gap-2 lg:min-h-0">
          <div className="min-h-0 flex-[1.2] overflow-hidden rounded-2xl border border-[#e8e2d8] bg-white">
            {mission.stage === "stack" ? (
              <LmsBuildStageStack
                mission={mission}
                playingOrder={playingOrder}
                status={status}
              />
            ) : null}
            {mission.stage === "path" || mission.stage === "maze" ? (
              <LmsBuildStagePath
                mission={mission}
                trail={trail}
                status={status}
                watered={watered}
              />
            ) : null}
            {mission.stage === "story" ? (
              <LmsBuildStageStory
                mission={mission}
                playingOrder={playingOrder}
                status={status}
              />
            ) : null}
          </div>

          <div className="shrink-0 rounded-2xl border border-[#e8e2d8] bg-[#1c2434] p-2.5">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#a89f91]">
              <Terminal className="h-3 w-3" />
              Output
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[#e8e2d8]">
              {runLog}
            </pre>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-[#e8e2d8] bg-white px-2.5 py-2 text-[11px] font-bold text-[#8a929c]">
            <span>Try {attempts}</span>
            <span className="text-[#e8e2d8]">·</span>
            <span className="inline-flex items-center gap-0.5 text-[#ff6a1a]">
              <Sparkles className="h-3 w-3" />
              {mission.xp}
              {mission.firstTryBonus ? `+${mission.firstTryBonus}` : ""} XP
            </span>
            {earnedXp != null ? (
              <span className="font-extrabold text-[#0d9488]">
                · +{earnedXp}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <LmsBuildHintModal
        open={hintOpen}
        mission={mission}
        hintLevel={Math.max(1, hintLevel)}
        hintText={currentHint}
        onUnderstood={() => {
          setHintOpen(false);
          setCoachMsg(currentHint);
        }}
        onClose={() => setHintOpen(false)}
      />

      <LmsBuildResultModal
        open={resultOpen}
        ok={status === "success"}
        mission={mission}
        order={lastOrder}
        xpEarned={earnedXp}
        firstTry={firstTryWin}
        hitWall={hitWall}
        nextMissionId={nextMission}
        onRetry={() => {
          setResultOpen(false);
          handleReset();
        }}
        onClose={() => setResultOpen(false)}
      />
    </div>
  );
}
