"use client";

import { LevelMark } from "@/components/learn-python/lms/py-badges";
import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import { BANDS, LEVEL_XP, XP_RULES, levelFor } from "@/lib/python-lms/game";
import { cn } from "@/lib/utils";
import { Check, Lock } from "lucide-react";

export function XpRulesList({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={cn("border-hairline", compact ? "grid border sm:grid-cols-2" : "divide-y divide-hairline border-y")}>
      {XP_RULES.map((r, i) => (
        <li
          key={r.what}
          className={cn(
            "flex items-start gap-3 py-2.5",
            compact && "border-hairline px-4",
            compact && i > 0 && "border-t",
            compact && i === 1 && "sm:border-t-0",
            compact && i % 2 === 1 && "sm:border-l",
          )}
        >
          <span className="mt-0.5 w-9 shrink-0 bg-[#eef8f2] py-0.5 text-center font-mono text-[12px] font-bold text-[#2f7a55]">{r.xp}</span>
          <span className="min-w-0">
            <span className="block text-[14px] font-bold text-ink">{r.what}</span>
            <span className="block text-[13px] leading-snug text-muted">{r.note}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** The five XP badges: one per band, unlocked when total XP reaches the band's first level. */
export function XpBadgeLadder() {
  const { xp } = usePyLms();
  const lvl = levelFor(xp);
  return (
    <ol className="grid grid-cols-2 border border-hairline sm:grid-cols-5">
      {BANDS.map((b, i) => {
        const at = LEVEL_XP[b.from - 1];
        const reached = xp >= at;
        const current = lvl.band.id === b.id;
        return (
          <li
            key={b.id}
            className={cn(
              "flex flex-col items-center px-2 py-3 text-center",
              i > 0 && "border-hairline sm:border-l",
              i % 2 === 1 && "border-l",
              i > 1 && "border-t sm:border-t-0",
            )}
            style={current ? { background: b.wash } : undefined}
          >
            <span className={cn(!reached && "opacity-35 grayscale")}>
              <LevelMark level={b.from} size={34} />
            </span>
            <span className="mt-1.5 text-[13.5px] font-extrabold" style={{ color: reached ? b.color : undefined }}>
              {b.name}
            </span>
            <span className="font-mono text-[11px] text-muted">{at} XP</span>
            <span className={cn("mt-1 inline-flex items-center gap-1 font-mono text-[10.5px]", reached ? "text-[#2f7a55]" : "text-muted")}>
              {reached ? <Check className="h-3 w-3" strokeWidth={3} /> : <Lock className="h-3 w-3" />}
              {reached ? "Earned" : `${at - xp} XP to go`}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
