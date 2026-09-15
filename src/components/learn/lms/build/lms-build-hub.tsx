"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import {
  readBuildProgressLocal,
  type BuildLocalProgress,
} from "@/lib/learn-build-client";
import {
  BUILD_MISSIONS,
  type BuildDifficulty,
  type BuildMission,
} from "@/lib/learn-build-missions";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Lock, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DiffFilter = "all" | BuildDifficulty;

function MissionCard({
  mission,
  cleared,
}: {
  mission: BuildMission;
  cleared: boolean;
}) {
  const locked = !mission.playable;

  const body = (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition",
        "min-h-[220px]",
        locked
          ? "border-dashed border-[#e8e2d8] opacity-85"
          : cleared
            ? "border-[#0d9488]/35 hover:border-[#0d9488]/60"
            : "border-[#e8e2d8] hover:border-[#1c2434]/40",
      )}
    >
      <Image
        src={mission.coverSrc}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={cn(
          "object-cover transition duration-400",
          locked ? "grayscale-[0.3]" : "group-hover:scale-[1.03]",
        )}
        priority={mission.number <= 3}
      />

      {/* Stronger bottom wash so title + CTA stay readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      <div className="relative flex h-full min-h-[220px] flex-col justify-end p-4">
        <h2 className="text-[1.05rem] font-bold leading-snug text-white drop-shadow-sm">
          {mission.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-[12px] font-medium leading-snug text-white/90">
          {mission.blurb}
        </p>

        <div className="mt-3 flex items-center gap-2">
          {locked ? (
            <span className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/20 text-[13px] font-bold text-white">
              <Lock className="h-3.5 w-3.5" />
              Soon
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold transition",
                cleared
                  ? "bg-white text-[#0d9488] group-hover:bg-[#e6f7f4]"
                  : "bg-[#ff6a1a] text-white group-hover:brightness-110",
              )}
            >
              {cleared ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Replay
                </>
              ) : (
                <>
                  Solve · +{mission.xp} XP
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </>
              )}
            </span>
          )}
          {!locked && !cleared ? (
            <span className="hidden items-center gap-1 rounded-xl bg-white/15 px-2.5 py-2 text-[11px] font-semibold text-white/90 sm:inline-flex">
              <Sparkles className="h-3 w-3" />
              {mission.minutes}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (locked) return body;

  return <Link href={`/learn/app/build/${mission.id}`}>{body}</Link>;
}

export function LmsBuildHub() {
  const [progress, setProgress] = useState<BuildLocalProgress>({
    completed: [],
    firstTry: [],
    attempts: {},
  });
  const [query, setQuery] = useState("");
  const [diff, setDiff] = useState<DiffFilter>("all");

  useEffect(() => {
    setProgress(readBuildProgressLocal());
  }, []);

  const done = progress.completed.length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUILD_MISSIONS.filter((m) => {
      if (diff !== "all" && m.difficulty !== diff) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.blurb.toLowerCase().includes(q) ||
        m.concept.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
      );
    });
  }, [query, diff]);

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <LearnDino size={40} action="cheer" className="h-10 w-10 shrink-0" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a1a]">
              Build arena
            </p>
            <h1 className="mt-0.5 text-[1.35rem] font-bold tracking-tight text-[#1c2434] sm:text-[1.5rem]">
              Pick a mission
            </h1>
            <p className="mt-0.5 text-[13px] font-medium text-[#8a929c]">
              Drag · drop · run · Dino hints · first-try XP
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-[#e8e2d8] bg-white px-3 py-1.5">
            <p className="text-[13px] font-bold tabular-nums text-[#1c2434]">
              {done}/{BUILD_MISSIONS.length}
              <span className="ml-1.5 text-[11px] font-semibold text-[#8a929c]">
                cleared
              </span>
            </p>
          </div>
          <Link
            href="/learn/app/practice"
            className="inline-flex items-center gap-1 rounded-xl border border-[#e8e2d8] bg-white px-3 py-1.5 text-[12px] font-bold text-[#5a6472] transition hover:border-[#1c2434] hover:text-[#1c2434]"
          >
            Question bank
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a89f91]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search missions…"
            className="h-10 w-full rounded-xl border border-[#e8e2d8] bg-white pl-9 pr-3 text-[13px] font-medium text-[#1c2434] outline-none transition placeholder:text-[#b0b6be] focus:border-[#1c2434]"
          />
        </label>

        <div className="inline-flex self-start rounded-xl bg-[#efebe3] p-0.5">
          {(
            [
              { id: "all", label: "All" },
              { id: "easy", label: "Easy" },
              { id: "medium", label: "Medium" },
              { id: "moderate", label: "Harder" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setDiff(t.id)}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition",
                diff === t.id
                  ? "bg-white text-[#1c2434] shadow-sm"
                  : "text-[#8a929c] hover:text-[#1c2434]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e8e2d8] bg-white px-5 py-12 text-center">
          <p className="text-[14px] font-bold text-[#1c2434]">No missions match</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDiff("all");
            }}
            className="mt-3 text-[12px] font-bold text-[#ff6a1a]"
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              cleared={progress.completed.includes(m.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
