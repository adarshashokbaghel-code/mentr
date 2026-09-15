"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import type { BuildMission, BuildStepDef } from "@/lib/learn-build-missions";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function stepById(mission: BuildMission, id: string): BuildStepDef | undefined {
  return (
    mission.steps.find((s) => s.id === id) ||
    mission.distractors?.find((s) => s.id === id)
  );
}

export function LmsBuildStageStory({
  mission,
  playingOrder,
  status,
}: {
  mission: BuildMission;
  playingOrder: string[] | null;
  status: "idle" | "running" | "success" | "fail";
}) {
  const [visible, setVisible] = useState<string[]>([]);
  const [speech, setSpeech] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!playingOrder || playingOrder.length === 0) {
      setVisible([]);
      setSpeech(null);
      setScore(null);
      return;
    }
    setVisible([]);
    setSpeech(null);
    setScore(null);
    let i = 0;
    let sc = 0;
    const id = window.setInterval(() => {
      i += 1;
      const slice = playingOrder.slice(0, i);
      setVisible(slice);
      const last = slice[slice.length - 1];
      if (last === "say") setSpeech("Hello!");
      if (last === "set_score_0") sc = 0;
      if (last === "change_score_1") sc += 1;
      if (last === "set_score_0" || last === "change_score_1") setScore(sc);
      if (last === "if_gold_take_else_jump") setSpeech("Gold! ✨");
      if (last === "if_else") setSpeech("The end!");
      if (i >= playingOrder.length) window.clearInterval(id);
    }, 420);
    return () => window.clearInterval(id);
  }, [playingOrder]);

  const chips = visible
    .map((id) => stepById(mission, id))
    .filter(Boolean) as BuildStepDef[];

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-[#e8e2d8] bg-gradient-to-br from-[#fff4e8] via-white to-[#e6f7f4] p-4",
        status === "success" && "ring-2 ring-[#0d9488]",
        status === "fail" && "ring-2 ring-[#ea580c]",
      )}
    >
      <p className="text-[11px] font-extrabold text-[#8a929c]">Story stage</p>

      <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-2">
        <div className="relative">
          <LearnDino
            size={48}
            action={status === "success" ? "cheer" : "wave"}
            className={cn(
              "h-12 w-12 transition-transform duration-500",
              visible.includes("move") && "translate-x-4",
            )}
          />
          {speech ? (
            <div className="absolute -right-1 -top-2 max-w-[100px] rounded-xl rounded-bl-md border border-[#1c2434] bg-white px-2 py-1 text-[11px] font-extrabold text-[#1c2434]">
              {speech}
            </div>
          ) : null}
        </div>

        {score != null ? (
          <p className="rounded-full bg-[#eef2ff] px-3 py-1 text-[13px] font-extrabold text-[#4f46e5]">
            score = {score}
          </p>
        ) : null}

        <div className="flex max-w-full flex-wrap justify-center gap-1.5">
          {chips.length === 0 ? (
            <p className="text-[12px] font-bold text-[#a89f91]">
              Run to play your story
            </p>
          ) : (
            chips.map((s, i) => (
              <span
                key={`${s.id}-${i}`}
                className="inline-flex animate-in fade-in-0 zoom-in-95 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold text-[#1c2434] duration-300"
                style={{ background: `${s.color}55` }}
              >
                {s.glyph} {s.label}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
