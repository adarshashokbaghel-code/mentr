"use client";

import { GUIDE_LINES } from "@/lib/learn-assets";
import { cn } from "@/lib/utils";
import { Flame, Lock, Play, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { LearnDino } from "./learn-dino";
import { LEARN_SHELL } from "./learn-shell";

const BUDDY_XP = 340;
const NEXT_LEVEL_XP = 500;

const XP_BADGES = [
  {
    src: "/learn/icons/learn-badge-spark.png",
    label: "Byte Spark",
    xp: 40,
    ring: "from-[#fde047] to-[#eab308]",
    glow: "rgba(234, 179, 8, 0.45)",
    chip: "bg-[#fef9c3] text-[#a16207]",
  },
  {
    src: "/learn/icons/learn-badge-nova.png",
    label: "Quiz Nova",
    xp: 80,
    ring: "from-[#ffd56a] to-[#f59e0b]",
    glow: "rgba(245, 158, 11, 0.45)",
    chip: "bg-[#fff6d9] text-[#b45309]",
  },
  {
    src: "/learn/icons/learn-badge-ember.png",
    label: "Ember Run",
    xp: 120,
    ring: "from-[#ff8a3d] to-[#ff6a1a]",
    glow: "rgba(255, 106, 26, 0.4)",
    chip: "bg-[#fff4e8] text-[#c2410c]",
  },
  {
    src: "/learn/icons/learn-badge-cub.png",
    label: "Circuit Cub",
    xp: 160,
    ring: "from-[#67e8f9] to-[#0891b2]",
    glow: "rgba(8, 145, 178, 0.4)",
    chip: "bg-[#ecfeff] text-[#0e7490]",
  },
  {
    src: "/learn/icons/learn-badge-pop.png",
    label: "Brain Pop",
    xp: 200,
    ring: "from-[#f9a8d4] to-[#db2777]",
    glow: "rgba(219, 39, 119, 0.4)",
    chip: "bg-[#fdf2f8] text-[#be185d]",
  },
  {
    src: "/learn/icons/learn-badge-boss.png",
    label: "Boss Bite",
    xp: 250,
    ring: "from-[#2dd4bf] to-[#0d9488]",
    glow: "rgba(13, 148, 136, 0.4)",
    chip: "bg-[#e6f7f4] text-[#0f766e]",
  },
  {
    src: "/learn/icons/learn-badge-ace.png",
    label: "Pixel Ace",
    xp: 300,
    ring: "from-[#86efac] to-[#16a34a]",
    glow: "rgba(22, 163, 74, 0.4)",
    chip: "bg-[#f0fdf4] text-[#15803d]",
  },
  {
    src: "/learn/icons/learn-badge-orbit.png",
    label: "Orbit Rank",
    xp: 380,
    ring: "from-[#a78bfa] to-[#4f46e5]",
    glow: "rgba(79, 70, 229, 0.4)",
    chip: "bg-[#eef2ff] text-[#4338ca]",
  },
  {
    src: "/learn/icons/learn-badge-mage.png",
    label: "Math Mage",
    xp: 440,
    ring: "from-[#c4b5fd] to-[#7c3aed]",
    glow: "rgba(124, 58, 237, 0.4)",
    chip: "bg-[#f5f3ff] text-[#6d28d9]",
  },
  {
    src: "/learn/icons/learn-badge-apex.png",
    label: "Apex Crown",
    xp: 500,
    ring: "from-[#fcd34d] to-[#d97706]",
    glow: "rgba(217, 119, 6, 0.45)",
    chip: "bg-[#fffbeb] text-[#b45309]",
  },
] as const;

const LEADERS = [
  { name: "Aarav", xp: 420, rank: 1, you: false },
  { name: "Diya", xp: 390, rank: 2, you: false },
  { name: "Kabir", xp: 340, rank: 3, you: true },
  { name: "Anaya", xp: 310, rank: 4, you: false },
  { name: "Vihaan", xp: 280, rank: 5, you: false },
] as const;

function VideoModuleCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#efe6d8] bg-[#1c2434]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
            <Video className="h-4 w-4 text-[#ffb27a]" strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#ffb27a]">
              Gamified video module
            </p>
            <p className="text-[14px] font-bold text-white">What Is a Computer?</p>
          </div>
        </div>
        <span className="learn-play-pulse rounded-full bg-[#ff6a1a] px-2.5 py-1 text-[11px] font-bold text-white">
          +10 XP
        </span>
      </div>
      <div className="relative mx-4 mb-3 aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-[#2a3548] via-[#1c2434] to-[#0f3d38]">
        <div className="learn-video-scan pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="learn-play-pulse flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6a1a] text-white">
            <Play className="h-5 w-5 fill-current" />
          </div>
          <p className="mt-3 text-[12px] font-semibold text-white/80">Narrated · 3 min</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-8">
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
            <div className="learn-video-progress h-full rounded-full bg-[#ff6a1a]" />
          </div>
          <p className="mt-1.5 text-[11px] font-bold text-white/55">Finish video · +10 XP</p>
        </div>
      </div>
      <p className="px-4 pb-4 text-[13px] leading-relaxed text-white/65">
        Every CS, AI, and Math lesson is a short narrated video. Finish it and XP lands — then 10
        practice questions keep the streak.
      </p>
    </div>
  );
}

function PotdCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#efe6d8] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#d97706]">Daily POTD</p>
          <h3 className="mt-0.5 text-[1.15rem] font-extrabold text-[#1c2434]">Problem of the Day</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-[#fff8d6] px-2 py-1 text-[11px] font-bold text-[#b45309]">
          <Flame className="h-3.5 w-3.5" strokeWidth={2.25} />
          6-day streak
        </span>
      </div>
      <p className="mt-3 text-[14px] font-bold leading-snug text-[#1c2434]">
        A speaker plays sound. Is it <span className="text-[#ff6a1a]">input</span> or{" "}
        <span className="text-[#0d9488]">output</span>?
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className="rounded-lg border border-[#efe6d8] bg-[#faf8f4] px-3 py-2.5 text-center text-[13px] font-bold text-[#5a6472]">
          Input
        </span>
        <span className="rounded-lg bg-[#e6f7f4] px-3 py-2.5 text-center text-[13px] font-bold text-[#0d9488] ring-1 ring-[#0d9488]/25">
          Output ✓ · +5 XP
        </span>
      </div>
      <p className="mt-auto pt-4 text-[13px] leading-relaxed text-[#5a6472]">
        One new puzzle every day. Finish it to keep the streak and earn +5 XP — even on days with no
        full module.
      </p>
    </div>
  );
}

function LeaderboardCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#efe6d8] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#4f46e5]">
            Daily leaderboard
          </p>
          <h3 className="mt-0.5 text-[1.15rem] font-extrabold text-[#1c2434]">Class 3–5 cohort</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-[#f3f0ff] px-2 py-1 text-[11px] font-bold text-[#4f46e5]">
          <Lock className="h-3.5 w-3.5" strokeWidth={2.25} />
          Opt-in
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {LEADERS.map((row) => (
          <li
            key={row.name}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2",
              row.you ? "bg-[#fff4e8] ring-1 ring-[#ff6a1a]/20" : "bg-[#faf8f4]",
            )}
          >
            <span className="w-4 text-center text-[12px] font-bold text-[#8a929c]">{row.rank}</span>
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold",
                row.you ? "bg-[#ff6a1a] text-white" : "bg-white text-[#1c2434] ring-1 ring-[#efe6d8]",
              )}
            >
              {row.name[0]}
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-bold text-[#1c2434]">
              {row.you ? "You" : row.name}
            </span>
            <span className="text-[12px] font-bold text-[#8a929c]">{row.xp} XP</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-4 text-[12px] font-semibold text-[#8a929c]">Demo data only</p>
    </div>
  );
}

function DinoGuideCard() {
  const [line, setLine] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setLine((i) => (i + 1) % GUIDE_LINES.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#efe6d8] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0d9488]">
            Study guide dino
          </p>
          <h3 className="mt-0.5 text-[1.15rem] font-extrabold text-[#1c2434]">
            A buddy that levels with XP
          </h3>
        </div>
        <span className="rounded-md bg-[#e6f7f4] px-2 py-1 text-[11px] font-bold text-[#0d9488]">
          Lv. 2
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <LearnDino size={88} action="blink" className="learn-float h-[72px] w-[72px] shrink-0 sm:h-[88px] sm:w-[88px]" />
        <div
          key={line}
          className="learn-bubble-in relative min-w-0 flex-1 rounded-2xl rounded-bl-md bg-[#fff4e8] px-3.5 py-3"
        >
          <p className="text-[14px] font-bold leading-snug text-[#1c2434]">{GUIDE_LINES[line]}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-[#8a929c]">{BUDDY_XP} XP</span>
          <span className="text-[#0d9488]">{NEXT_LEVEL_XP} XP · Level 3</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#efe6d8]">
          <div
            className="h-full rounded-full bg-[#0d9488]"
            style={{ width: `${Math.min(100, (BUDDY_XP / NEXT_LEVEL_XP) * 100)}%` }}
          />
        </div>
      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-[#8a929c]">
        Badges unlock with XP
      </p>
      <div className="mt-2.5 grid grid-cols-5 gap-1.5 sm:gap-2.5">
        {XP_BADGES.map((badge) => {
          const unlocked = BUDDY_XP >= badge.xp;
          return (
            <div key={badge.label} className="min-w-0 text-center">
              <div
                className={cn(
                  "relative mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br p-[2px] sm:h-14 sm:w-14 sm:rounded-2xl",
                  badge.ring,
                  unlocked ? "learn-xp-badge" : "learn-xp-badge-lock opacity-70",
                )}
                style={{ "--learn-badge-glow": badge.glow } as CSSProperties}
              >
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-white sm:rounded-[14px]">
                  <Image
                    src={badge.src}
                    alt=""
                    width={72}
                    height={72}
                    className={cn(
                      "h-8 w-8 object-contain sm:h-10 sm:w-10",
                      !unlocked && "opacity-55 grayscale",
                    )}
                  />
                </div>
                {!unlocked ? (
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1c2434] text-white sm:h-4 sm:w-4">
                    <Lock className="h-2 w-2 sm:h-2.5 sm:w-2.5" strokeWidth={2.5} />
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[9px] font-extrabold leading-tight text-[#1c2434] sm:mt-1.5 sm:text-[11px]">
                {badge.label}
              </p>
              <p
                className={cn(
                  "mt-0.5 inline-flex rounded-full px-1 py-0.5 text-[8px] font-bold sm:px-1.5 sm:text-[10px]",
                  unlocked ? badge.chip : "bg-[#f4f1ea] text-[#8a929c]",
                )}
              >
                {unlocked ? `${badge.xp} XP` : `${BUDDY_XP}/${badge.xp}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LearnGamificationSection() {
  return (
    <section id="gamification" className="scroll-mt-20 bg-[#fffdf8] py-10 sm:py-16 lg:py-20">
      <div className={LEARN_SHELL}>
        <div className="mx-auto max-w-2xl text-center">
          <LearnDino size={56} className="mx-auto h-12 w-12 sm:h-14 sm:w-14" />
          <p className="mt-2 text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">
            Gamification
          </p>
          <h2 className="mt-1 text-[1.5rem] font-extrabold tracking-tight text-[#1c2434] sm:text-[2.1rem]">
            XP, streaks, badges &amp; a buddy
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#5a6472] sm:text-[16px]">
            Videos, practice, and a daily POTD all earn XP. A dino study guide cheers them on. The
            leaderboard is first-name only — and off until a parent opts in.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <VideoModuleCard />
          </div>
          <div className="lg:col-span-5">
            <PotdCard />
          </div>
          <div className="lg:col-span-5">
            <LeaderboardCard />
          </div>
          <div className="lg:col-span-7">
            <DinoGuideCard />
          </div>
        </div>

      </div>
    </section>
  );
}
