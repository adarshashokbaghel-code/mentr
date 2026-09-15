"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import type { BuildDir, BuildMission } from "@/lib/learn-build-missions";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

const DIR_ROT: Record<BuildDir, string> = {
  0: "rotate-90", // east
  1: "rotate-180", // south
  2: "-rotate-90", // west
  3: "rotate-0", // north
};

export function LmsBuildStagePath({
  mission,
  trail,
  status,
  watered = 0,
}: {
  mission: BuildMission;
  trail: { x: number; y: number; dir: BuildDir }[] | null;
  status: "idle" | "running" | "success" | "fail";
  watered?: number;
}) {
  const maze = mission.maze;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!trail || trail.length === 0) {
      setFrame(0);
      return;
    }
    setFrame(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setFrame(Math.min(i, trail.length - 1));
      if (i >= trail.length - 1) window.clearInterval(id);
    }, 360);
    return () => window.clearInterval(id);
  }, [trail]);

  const pos = useMemo(() => {
    if (!maze) return { x: 0, y: 0, dir: 0 as BuildDir };
    if (!trail || trail.length === 0) return maze.start;
    return trail[Math.min(frame, trail.length - 1)];
  }, [maze, trail, frame]);

  if (!maze) return null;

  const cells = [];
  for (let y = 0; y < maze.height; y++) {
    for (let x = 0; x < maze.width; x++) {
      cells.push({ x, y });
    }
  }

  const wall = new Set(maze.walls);
  const markMap = new Map(
    (maze.marks ?? []).map((m) => [`${m.x},${m.y}`, m.glyph]),
  );

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[180px] flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-b from-[#eef2ff] via-[#f8fafc] to-[#efe6d8] p-3",
        status === "success" && "ring-2 ring-[#0d9488]",
        status === "fail" && "ring-2 ring-[#ea580c]",
      )}
    >
      <p className="absolute left-2.5 top-2.5 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold text-[#8a929c]">
        {mission.stage === "maze" ? "Maze" : "Path"}
      </p>
      {status === "success" ? (
        <p className="absolute right-3 top-3 rounded-full bg-[#e6f7f4] px-2.5 py-1 text-[11px] font-extrabold text-[#0d9488]">
          Goal ✓
        </p>
      ) : null}

      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${maze.width}, minmax(0, 2.5rem))`,
        }}
      >
        {cells.map((c) => {
          const key = `${c.x},${c.y}`;
          const isWall = wall.has(key);
          const isGoal = c.x === maze.goal.x && c.y === maze.goal.y;
          const isHere = c.x === pos.x && c.y === pos.y;
          const mark = markMap.get(key);
          const flowerIdx = maze.marks?.findIndex(
            (m) => m.x === c.x && m.y === c.y,
          );
          const isWatered =
            typeof flowerIdx === "number" &&
            flowerIdx >= 0 &&
            watered > flowerIdx;

          return (
            <div
              key={key}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-lg border-2 sm:h-10 sm:w-10",
                isWall
                  ? "border-[#1c2434]/20 bg-[#1c2434]"
                  : isGoal
                    ? "border-[#f5c542] bg-[#fff8d6]"
                    : "border-[#e8e2d8] bg-white",
                isWatered && "border-[#0d9488]/40 bg-[#e6f7f4]",
              )}
            >
              {isWall ? (
                <span className="text-[9px] font-extrabold text-white/70">■</span>
              ) : mark && !isHere ? (
                <span className="text-[13px]">{isWatered ? "💧" : mark}</span>
              ) : null}
              {isHere ? (
                <LearnDino
                  size={28}
                  action={status === "success" ? "cheer" : "wave"}
                  className={cn(
                    "h-7 w-7 transition-transform duration-300",
                    DIR_ROT[pos.dir],
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
