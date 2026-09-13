"use client";

import {
  LEARN_TRACKS,
  SAMPLE_MODULE_ID,
  type LearnTrackId,
} from "@/lib/learn-curriculum";
import { cn } from "@/lib/utils";
import { Lock, Play, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LmsPath() {
  const [trackId, setTrackId] = useState<LearnTrackId>("cs");
  const track = LEARN_TRACKS.find((t) => t.id === trackId)!;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[1.65rem] font-extrabold tracking-tight text-[#1c2434]">
          Your path
        </h1>
        <p className="mt-1 text-[14px] font-medium text-[#8a929c]">
          Pick a track. Finish modules. Beat the boss.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#efe6d8]/60 p-1.5">
        {LEARN_TRACKS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTrackId(t.id)}
            className={cn(
              "rounded-xl px-2 py-2.5 text-[13px] font-extrabold transition sm:text-[14px]",
              trackId === t.id
                ? "bg-white text-[#1c2434] shadow-sm"
                : "text-[#8a929c]",
            )}
          >
            {t.shortLabel.replace(" Basics", "").replace(" for CS", "")}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {track.units.map((unit) => (
          <section key={unit.id}>
            <h2 className="text-[15px] font-extrabold text-[#1c2434]">
              {unit.title}
            </h2>
            <p className="mt-0.5 text-[12px] font-medium text-[#8a929c]">
              ~{unit.videoMinutes} min videos
            </p>
            <ul className="mt-3 space-y-2">
              {unit.modules.map((m) => {
                const unlocked = m.id === SAMPLE_MODULE_ID;
                return (
                  <li key={m.id}>
                    {unlocked ? (
                      <Link
                        href={`/learn/app/lesson/${m.id}`}
                        className="flex items-center gap-3 rounded-2xl border-2 border-[#1c2434] bg-white px-4 py-3 shadow-[3px_3px_0_0_#ff6a1a]"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#ff6a1a]">
                          <Play className="h-5 w-5 fill-current" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-bold text-[#ff6a1a]">
                            {m.id} · Open
                          </p>
                          <p className="truncate text-[15px] font-extrabold text-[#1c2434]">
                            {m.title}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-2xl border border-[#e8e2d8] bg-white/80 px-4 py-3 opacity-75">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3f0ea] text-[#8a929c]">
                          <Lock className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-bold text-[#8a929c]">
                            {m.id}
                          </p>
                          <p className="truncate text-[15px] font-extrabold text-[#1c2434]">
                            {m.title}
                          </p>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
              <li className="flex items-center gap-3 rounded-2xl border border-dashed border-[#d5cfc4] bg-[#fff8d6]/50 px-4 py-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8] text-[#ff6a1a]">
                  <Trophy className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-[#b45309]">Boss</p>
                  <p className="truncate text-[14px] font-extrabold text-[#1c2434]">
                    {unit.bossChallenge}
                  </p>
                </div>
                <Lock className="h-4 w-4 shrink-0 text-[#8a929c]" />
              </li>
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
