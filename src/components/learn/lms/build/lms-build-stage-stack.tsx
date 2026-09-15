"use client";

import type { BuildMission, BuildStepDef } from "@/lib/learn-build-missions";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function stepById(mission: BuildMission, id: string): BuildStepDef | undefined {
  return (
    mission.steps.find((s) => s.id === id) ||
    mission.distractors?.find((s) => s.id === id)
  );
}

export function LmsBuildStageStack({
  mission,
  playingOrder,
  status,
}: {
  mission: BuildMission;
  playingOrder: string[] | null;
  status: "idle" | "running" | "success" | "fail";
}) {
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    if (!playingOrder || playingOrder.length === 0) {
      setVisible([]);
      return;
    }
    setVisible([]);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setVisible(playingOrder.slice(0, i));
      if (i >= playingOrder.length) window.clearInterval(id);
    }, 380);
    return () => window.clearInterval(id);
  }, [playingOrder]);

  const layers = visible
    .map((id) => stepById(mission, id))
    .filter(Boolean) as BuildStepDef[];

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[180px] flex-col items-center justify-end overflow-hidden rounded-2xl bg-gradient-to-b from-[#fff8f0] via-[#fff4e8] to-[#efe6d8] p-3",
        status === "success" && "ring-2 ring-[#0d9488]",
        status === "fail" && "ring-2 ring-[#ea580c]",
      )}
    >
      <p className="absolute left-2.5 top-2.5 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold text-[#8a929c]">
        {mission.stackTitle ?? "Stage"}
      </p>

      {status === "success" ? (
        <p className="absolute right-2.5 top-2.5 rounded-full bg-[#e6f7f4] px-2 py-0.5 text-[10px] font-extrabold text-[#0d9488]">
          Done ✓
        </p>
      ) : null}
      {status === "fail" ? (
        <p className="absolute right-2.5 top-2.5 rounded-full bg-[#fff4e8] px-2 py-0.5 text-[10px] font-extrabold text-[#c2410c]">
          Retry
        </p>
      ) : null}

      <div className="relative z-[1] mb-2 flex w-full max-w-[180px] flex-col-reverse items-center gap-1">
        {layers.length === 0 ? (
          <div className="flex h-20 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#e8e2d8] bg-white/50">
            <p className="text-[12px] font-extrabold text-[#a89f91]">
              {mission.stackEmpty ?? "Empty"}
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-[#c4b8a5]">
              Run to build
            </p>
          </div>
        ) : (
          layers.map((step, idx) => (
            <div
              key={`${step.id}-${idx}`}
              className="flex w-full animate-in fade-in-0 slide-in-from-top-1 items-center justify-center gap-1.5 rounded-lg border border-[#1c2434]/10 px-2.5 py-1.5 text-[11px] font-extrabold text-[#1c2434] shadow-sm duration-300"
              style={{
                background: `linear-gradient(180deg, ${step.color}55, ${step.color}99)`,
              }}
            >
              <span className="text-[13px] leading-none">{step.glyph}</span>
              {step.label}
            </div>
          ))
        )}
      </div>

      <div className="h-2 w-[65%] rounded-full bg-[#d6cbb8]" />
    </div>
  );
}
