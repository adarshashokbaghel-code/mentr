"use client";

import { AchievementBadge, LevelMark } from "@/components/learn-python/lms/py-badges";
import { usePyLms, type PyToast } from "@/components/learn-python/lms/py-lms-provider";
import { ACHIEVEMENTS, levelFor } from "@/lib/python-lms/game";
import { cn } from "@/lib/utils";
import { Flame, Sparkles, Star, Zap } from "lucide-react";
import { useEffect } from "react";

export function Stars({ count, size = 16, className }: { count: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i < count ? "fill-[#f6b73c] text-[#e0a83a]" : "fill-transparent text-current opacity-30"}
          strokeWidth={2}
        />
      ))}
    </span>
  );
}

export function XpChip() {
  const { xp, streak, openGuide } = usePyLms();
  const lvl = levelFor(xp);
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={() => openGuide("xp")}
        title={`${streak}-day login streak`}
        className={cn(
          "inline-flex items-center gap-1 border px-2 py-1 font-mono text-[12px] font-semibold transition hover:border-ink",
          streak > 0 ? "border-[#f3c9a8] bg-[#fff4ea] text-[#c2410c]" : "border-hairline text-muted",
        )}
      >
        <Flame className="h-3.5 w-3.5" /> {streak}
      </button>
      <button
        type="button"
        onClick={() => openGuide("levels")}
        className="flex items-center gap-2 border border-hairline bg-white px-2 py-1 transition hover:border-ink"
        title={`Level ${lvl.level} · ${lvl.title} (${lvl.band.name}). ${lvl.max ? "Top level" : `${lvl.toNext} XP to next level`}`}
      >
        <LevelMark level={lvl.level} size={20} />
        <span className="hidden min-w-0 text-left md:block">
          <span className="block max-w-[120px] truncate text-[11.5px] font-bold leading-tight text-ink">{lvl.title}</span>
          <span className="mt-0.5 block h-1 w-[120px] bg-[#ece8e0]">
            <span className="block h-full transition-all duration-500" style={{ width: `${lvl.pct}%`, background: lvl.band.color }} />
          </span>
        </span>
        <span className="font-mono text-[12px] font-semibold text-ink">
          {xp}
          <span className="text-muted"> XP</span>
        </span>
      </button>
    </div>
  );
}

function ToastItem({ t, onDone }: { t: PyToast; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, t.kind === "xp" ? 1600 : 4200);
    return () => clearTimeout(timer);
  }, [t, onDone]);

  if (t.kind === "xp") {
    return (
      <div className="py-pop flex max-w-full items-center gap-1.5 border border-[#1f2a23] bg-[#0f1612] px-2.5 py-1.5 text-white shadow-lg sm:gap-2 sm:px-3 sm:py-2">
        <Zap className="h-3.5 w-3.5 shrink-0 fill-[#5ee0a0] text-[#5ee0a0] sm:h-4 sm:w-4" />
        <span className="shrink-0 font-mono text-[12px] font-bold text-[#5ee0a0] sm:text-[13px]">+{t.xp} XP</span>
        {t.label && <span className="min-w-0 truncate text-[11.5px] text-white/70 sm:text-[12.5px]">{t.label}</span>}
      </div>
    );
  }
  if (t.kind === "level") {
    return (
      <div className="py-pop flex max-w-full items-center gap-2.5 border border-[#1f2a23] bg-[#0f1612] px-3 py-2 text-white shadow-xl sm:gap-3 sm:py-2.5">
        <LevelMark level={t.level} size={26} />
        <div className="min-w-0">
          <p className="truncate font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#5ee0a0] sm:text-[10px]">Level up · {t.band}</p>
          <p className="truncate text-[13px] font-extrabold sm:text-[14px]">
            Level {t.level} · {t.title}
          </p>
        </div>
      </div>
    );
  }
  const a = ACHIEVEMENTS[t.achievement];
  return (
    <div className="py-pop flex max-w-full items-center gap-2.5 border border-[#e0a83a] bg-white px-3 py-2 shadow-xl sm:gap-3 sm:py-2.5">
      <AchievementBadge id={t.achievement} unlocked size={32} />
      <div className="min-w-0">
        <p className="flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#b07a10] sm:text-[10px]">
          <Sparkles className="h-3 w-3 shrink-0" /> Badge unlocked
        </p>
        <p className="truncate text-[13px] font-extrabold text-ink sm:text-[14px]">{a.title}</p>
        <p className="hidden text-[12px] leading-snug text-muted sm:line-clamp-2 sm:block">{a.text}</p>
      </div>
    </div>
  );
}

export function PyToasts() {
  const { toasts, dismissToast } = usePyLms();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] flex flex-col items-center gap-1.5 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[320px] sm:items-end sm:gap-2"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} t={t} onDone={() => dismissToast(t.id)} />
      ))}
    </div>
  );
}
