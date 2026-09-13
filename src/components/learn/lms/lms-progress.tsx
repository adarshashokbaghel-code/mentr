"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import { Flame, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";

const BADGES = [
  { src: "/learn/icons/learn-badge-spark.png", label: "Spark", earned: true },
  { src: "/learn/icons/learn-badge-cub.png", label: "Cub", earned: false },
  { src: "/learn/icons/learn-badge-nova.png", label: "Nova", earned: false },
  { src: "/learn/icons/learn-badge-ace.png", label: "Ace", earned: false },
] as const;

export function LmsProgress() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <LearnDino size={52} action="cheer" className="h-[52px] w-[52px] shrink-0" />
        <div>
          <h1 className="text-[1.65rem] font-extrabold tracking-tight text-[#1c2434]">
            Progress
          </h1>
          <p className="mt-1 text-[14px] font-medium text-[#8a929c]">
            You&apos;re just getting started — nice!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Sparkles, value: "40", label: "XP", tint: "bg-[#fff4e8] text-[#ff6a1a]" },
          { icon: Flame, value: "6", label: "Streak", tint: "bg-[#fff8d6] text-[#b45309]" },
          { icon: Trophy, value: "0", label: "Bosses", tint: "bg-[#e6f7f4] text-[#0d9488]" },
        ].map(({ icon: Icon, value, label, tint }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#e8e2d8] bg-white p-3 text-center"
          >
            <span
              className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <p className="mt-2 text-[1.35rem] font-extrabold text-[#1c2434]">
              {value}
            </p>
            <p className="text-[12px] font-bold text-[#8a929c]">{label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-[#e8e2d8] bg-white p-4 sm:p-5">
        <h2 className="text-[15px] font-extrabold text-[#1c2434]">
          Modules done
        </h2>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#efe6d8]">
          <div className="h-full w-[2%] rounded-full bg-[#ff6a1a]" />
        </div>
        <p className="mt-2 text-[13px] font-semibold text-[#8a929c]">
          0 / 60 complete · finish A1 to move the bar
        </p>
      </section>

      <section>
        <h2 className="text-[15px] font-extrabold text-[#1c2434]">Badges</h2>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {BADGES.map((b) => (
            <div
              key={b.label}
              className={`text-center ${b.earned ? "" : "opacity-40 grayscale"}`}
            >
              <div className="relative mx-auto h-14 w-14">
                <Image src={b.src} alt="" fill className="object-contain" sizes="56px" />
              </div>
              <p className="mt-1 text-[11px] font-bold text-[#1c2434]">{b.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
