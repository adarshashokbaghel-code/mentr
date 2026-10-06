"use client";

import { AchievementBadge, LevelMark, formatAchievedAt } from "@/components/learn-python/lms/py-badges";
import { usePyLms, type GuideTab } from "@/components/learn-python/lms/py-lms-provider";
import { XpBadgeLadder, XpRulesList } from "@/components/learn-python/lms/py-xp-rules";
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_ORDER,
  BANDS,
  LEVEL_NAMES,
  LEVEL_XP,
  PY_XP,
  achievementProgress,
  bestStreakFor,
  levelFor,
  todayKey,
} from "@/lib/python-lms/game";
import { cn } from "@/lib/utils";
import { Check, Flame, Lock, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const TABS: { id: GuideTab; label: string }[] = [
  { id: "achievements", label: "Badges" },
  { id: "levels", label: "Levels" },
  { id: "xp", label: "XP & streak" },
];

export function PyProgressGuide() {
  const { guide, closeGuide, openGuide, xp, store } = usePyLms();
  const lvl = levelFor(xp);
  const unlocked = ACHIEVEMENT_ORDER.filter((id) => store.achievements[id]).length;

  useEffect(() => {
    if (!guide.open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeGuide();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [guide.open, closeGuide]);

  if (!guide.open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="py-guide-title">
      <button type="button" aria-label="Close" onClick={closeGuide} className="py-fade absolute inset-0 bg-[#0b100d]/60 backdrop-blur-[3px]" />

      <div className="py-sheet-up relative z-10 flex max-h-[92dvh] w-full max-w-[640px] flex-col overflow-hidden border border-[#1f2a23] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="relative shrink-0 overflow-hidden bg-[#0f1612] px-5 pb-4 pt-3 text-white sm:px-6 sm:pt-5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:22px_22px]"
          />
          <span className="mx-auto mb-3 block h-1 w-10 bg-white/20 sm:hidden" aria-hidden />
          <button
            type="button"
            onClick={closeGuide}
            aria-label="Close"
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center text-white/50 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative flex items-center gap-4 pr-8">
            <LevelMark level={lvl.level} size={52} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ color: "#5ee0a0" }}>
                {lvl.band.name} band · Level {lvl.level} of 50
              </p>
              <h2 id="py-guide-title" className="mt-0.5 truncate text-[20px] font-extrabold leading-tight sm:text-[22px]">
                {lvl.title}
              </h2>
              <div className="mt-2 h-1.5 bg-white/15">
                <div className="h-full bg-[#5ee0a0] transition-all duration-500" style={{ width: `${lvl.pct}%` }} />
              </div>
              <p className="mt-1.5 font-mono text-[11.5px] text-white/60">
                {xp} XP · {lvl.max ? "Top level reached" : `${lvl.toNext} XP to Level ${lvl.level + 1} · ${lvl.nextTitle}`}
              </p>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-3 border border-white/15" role="tablist">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={guide.tab === t.id}
                onClick={() => openGuide(t.id)}
                className={cn(
                  "px-2 py-2 text-[13px] font-bold transition",
                  i > 0 && "border-l border-white/15",
                  guide.tab === t.id ? "bg-white text-ink" : "text-white/70 hover:text-white",
                )}
              >
                {t.label}
                {t.id === "achievements" && <span className="ml-1 font-mono text-[11px] opacity-60">{unlocked}/10</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pb-6">
          {guide.tab === "achievements" && <AchievementsTab />}
          {guide.tab === "levels" && <LevelsTab />}
          {guide.tab === "xp" && <XpTab />}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function AchievementsTab() {
  const { store, xp, streak, guide } = usePyLms();
  const focusRef = useRef<HTMLLIElement>(null);
  const list = [...ACHIEVEMENT_ORDER].sort((a, b) => {
    const ta = store.achievements[a];
    const tb = store.achievements[b];
    if (ta && tb) return tb.localeCompare(ta);
    if (ta || tb) return ta ? -1 : 1;
    return 0;
  });

  useEffect(() => {
    focusRef.current?.scrollIntoView({ block: "nearest" });
  }, [guide.focus]);

  return (
    <div>
      <p className="text-[14px] leading-relaxed text-muted">
        Ten badges to collect. Unlocked ones are listed first, newest on top, with the date you earned them.
      </p>
      <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
        {list.map((id) => {
          const at = store.achievements[id];
          const a = ACHIEVEMENTS[id];
          const prog = at ? null : achievementProgress(id, xp, streak);
          const focused = guide.focus === id;
          return (
            <li key={id} ref={focused ? focusRef : undefined} className={cn("flex items-center gap-4 py-3", focused && "-mx-3 bg-[#faf8f4] px-3")}>
              <AchievementBadge id={id} unlocked={Boolean(at)} size={56} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 text-[15px] font-extrabold text-ink">
                  {a.title}
                  {at && <Check className="h-4 w-4 text-[#2f9e6e]" strokeWidth={3} />}
                </p>
                <p className="mt-0.5 text-[13.5px] leading-snug text-[#3d3a35]">{at ? a.text : a.how}</p>
                {at ? (
                  <p className="mt-1 font-mono text-[11px] font-semibold text-[#2f7a55]">Unlocked {formatAchievedAt(at)}</p>
                ) : prog ? (
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="h-1 w-24 bg-[#ece8e0]">
                      <span className="block h-full bg-ink/60" style={{ width: `${(prog.have / prog.need) * 100}%` }} />
                    </span>
                    <span className="font-mono text-[11px] text-muted">
                      {prog.have} / {prog.need}
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-muted">
                    <Lock className="h-3 w-3" /> Locked
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LevelsTab() {
  const { xp } = usePyLms();
  const lvl = levelFor(xp);
  const currentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div>
      <p className="text-[14px] leading-relaxed text-[#3d3a35]">
        There are <strong className="text-ink">50 levels in 5 bands</strong>, and each band is a badge. You earn XP by logging in daily (+{PY_XP.dailyLogin}), answering
        Practice questions (+{PY_XP.practice.easy} easy, +{PY_XP.practice.medium} medium, +{PY_XP.practice.hard} hard), watching videos (+{PY_XP.video}) and
        finishing lesson examples and practice (+{PY_XP.example} each). Inside a band
        every level costs the same XP; each new band costs more per level, so early levels come fast and the top ones take real practice.
      </p>
      <div className="mt-4 overflow-x-auto border border-hairline">
        <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-ink text-white">
              {["Band", "Levels", "XP per level", "Starts at"].map((h) => (
                <th key={h} className="px-3 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BANDS.map((b, r) => (
              <tr key={b.id} className={cn(r % 2 ? "bg-[#faf8f4]" : "bg-white", lvl.band.id === b.id && "outline outline-2 -outline-offset-2 outline-ink")}>
                <td className="border-t border-hairline px-3 py-2 font-bold" style={{ color: b.color }}>
                  {b.name}
                </td>
                <td className="border-t border-hairline px-3 py-2 font-mono">
                  {b.from}–{b.to}
                </td>
                <td className="border-t border-hairline px-3 py-2 font-mono">{b.step} XP</td>
                <td className="border-t border-hairline px-3 py-2 font-mono">{LEVEL_XP[b.from - 1]} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {BANDS.map((b) => (
        <section key={b.id} className="mt-6">
          <div className="flex items-baseline justify-between gap-3 border-b-2 pb-1.5" style={{ borderColor: b.color }}>
            <h3 className="text-[16px] font-extrabold" style={{ color: b.color }}>
              {b.name}
            </h3>
            <p className="font-mono text-[11px] text-muted">{b.tagline}</p>
          </div>
          <ol className="mt-2 grid gap-x-4 sm:grid-cols-2">
            {LEVEL_NAMES.slice(b.from - 1, b.to).map((name, i) => {
              const n = b.from + i;
              const reached = n <= lvl.level;
              const current = n === lvl.level;
              return (
                <li
                  key={n}
                  ref={current ? currentRef : undefined}
                  className={cn("flex items-center gap-2.5 border-b border-hairline py-1.5", current && "-mx-1.5 px-1.5")}
                  style={current ? { background: b.wash } : undefined}
                >
                  <span className={cn(!reached && "opacity-35 grayscale")}>
                    <LevelMark level={n} size={22} />
                  </span>
                  <span className={cn("min-w-0 flex-1 truncate text-[13.5px]", reached ? "font-semibold text-ink" : "text-muted")}>
                    {name}
                    {current && <span className="ml-1.5 font-mono text-[10.5px] font-bold uppercase text-[#c2410c]">You</span>}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-muted">{LEVEL_XP[n - 1]} XP</span>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

function XpTab() {
  const { streak, store } = usePyLms();
  const best = Math.max(bestStreakFor(store.days), streak);
  const days = new Set(store.days);
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return { key: todayKey(d), label: d.toLocaleDateString(undefined, { weekday: "narrow" }), date: d.getDate() };
  });

  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">How you earn XP</h3>
      <div className="mt-2">
        <XpRulesList />
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
        Each question, example and video earns XP once. Retaking a practice set improves your stars, but questions you already got right don’t pay
        again. Your XP is saved to your account, so it follows you to any device you sign in on.
      </p>

      <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Badges you earn with XP</h3>
      <p className="mt-1 text-[13px] leading-snug text-muted">Reach the XP shown to earn each band badge. Every band has 10 levels.</p>
      <div className="mt-2">
        <XpBadgeLadder />
      </div>

      <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Daily login streak</h3>
      <div className="mt-2 grid grid-cols-2 border border-hairline">
        <div className="px-4 py-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Current</p>
          <p className={cn("mt-0.5 flex items-center gap-1.5 text-[20px] font-extrabold", streak ? "text-[#c2410c]" : "text-ink")}>
            <Flame className="h-5 w-5" /> {streak} {streak === 1 ? "day" : "days"}
          </p>
        </div>
        <div className="border-l border-hairline px-4 py-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Best</p>
          <p className="mt-0.5 text-[20px] font-extrabold text-ink">
            {best} {best === 1 ? "day" : "days"}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5 sm:grid-cols-14">
        {last14.map((d) => (
          <div key={d.key} className="text-center">
            <span
              className={cn(
                "flex aspect-square items-center justify-center border font-mono text-[11px] font-semibold",
                days.has(d.key) ? "border-[#f3c9a8] bg-[#fff4ea] text-[#c2410c]" : "border-hairline text-muted/60",
                d.key === todayKey() && "outline outline-2 outline-offset-1 outline-ink",
              )}
            >
              {days.has(d.key) ? <Flame className="h-3.5 w-3.5" /> : d.date}
            </span>
            <span className="mt-0.5 block font-mono text-[9.5px] text-muted">{d.label}</span>
          </div>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5 text-[13.5px] leading-relaxed text-[#3d3a35]">
        <li className="flex gap-2">
          <span className="text-coral">—</span> Log in and open Learn Python once a day to add a day to your streak and earn +{PY_XP.dailyLogin} XP.
        </li>
        <li className="flex gap-2">
          <span className="text-coral">—</span> Opening it more than once on the same day still counts as one day.
        </li>
        <li className="flex gap-2">
          <span className="text-coral">—</span> Miss a whole day and the streak starts again from 1.
        </li>
        <li className="flex gap-2">
          <span className="text-coral">—</span> 3 days in a row unlocks <strong className="text-ink">Regular</strong>; 7 days unlocks <strong className="text-ink">Week Warrior</strong>.
        </li>
      </ul>
    </div>
  );
}
