"use client";

import {
  fetchLearnLeaderboard,
  type LearnLeaderboardRow,
} from "@/lib/learn-progress-client";
import { cn } from "@/lib/utils";
import { Crown, Lock, Medal, Trophy, X } from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type BoardRow = {
  name: string;
  xp: number;
  you: boolean;
};

type BadgeDef = {
  src: string;
  label: string;
  xp: number;
  blurb: string;
  ring: string;
  glow: string;
  chip: string;
};

export const LEARN_BADGES: BadgeDef[] = [
  {
    src: "/learn/icons/learn-badge-spark.png",
    label: "Byte Spark",
    xp: 40,
    blurb: "Earn your first 40 XP from a quiz, POTD, or practice.",
    ring: "from-[#fde047] to-[#eab308]",
    glow: "rgba(234, 179, 8, 0.45)",
    chip: "bg-[#fef9c3] text-[#a16207]",
  },
  {
    src: "/learn/icons/learn-badge-nova.png",
    label: "Quiz Nova",
    xp: 80,
    blurb: "Keep practicing — hit 80 XP to light up Quiz Nova.",
    ring: "from-[#ffd56a] to-[#f59e0b]",
    glow: "rgba(245, 158, 11, 0.45)",
    chip: "bg-[#fff6d9] text-[#b45309]",
  },
  {
    src: "/learn/icons/learn-badge-ember.png",
    label: "Ember Run",
    xp: 120,
    blurb: "A warm streak of lessons. Unlock at 120 XP.",
    ring: "from-[#ff8a3d] to-[#ff6a1a]",
    glow: "rgba(255, 106, 26, 0.4)",
    chip: "bg-[#fff4e8] text-[#c2410c]",
  },
  {
    src: "/learn/icons/learn-badge-cub.png",
    label: "Circuit Cub",
    xp: 160,
    blurb: "You're building circuits in your head. 160 XP.",
    ring: "from-[#67e8f9] to-[#0891b2]",
    glow: "rgba(8, 145, 178, 0.4)",
    chip: "bg-[#ecfeff] text-[#0e7490]",
  },
  {
    src: "/learn/icons/learn-badge-pop.png",
    label: "Brain Pop",
    xp: 200,
    blurb: "Pop those practice questions. Unlocks at 200 XP.",
    ring: "from-[#f9a8d4] to-[#db2777]",
    glow: "rgba(219, 39, 119, 0.4)",
    chip: "bg-[#fdf2f8] text-[#be185d]",
  },
  {
    src: "/learn/icons/learn-badge-boss.png",
    label: "Boss Bite",
    xp: 250,
    blurb: "Take a bigger bite of the syllabus — 250 XP.",
    ring: "from-[#2dd4bf] to-[#0d9488]",
    glow: "rgba(13, 148, 136, 0.4)",
    chip: "bg-[#e6f7f4] text-[#0f766e]",
  },
  {
    src: "/learn/icons/learn-badge-ace.png",
    label: "Pixel Ace",
    xp: 300,
    blurb: "Ace your quizzes and climb to 300 XP.",
    ring: "from-[#86efac] to-[#16a34a]",
    glow: "rgba(22, 163, 74, 0.4)",
    chip: "bg-[#f0fdf4] text-[#15803d]",
  },
  {
    src: "/learn/icons/learn-badge-orbit.png",
    label: "Orbit Rank",
    xp: 380,
    blurb: "Orbit the cohort leaderboard. Needs 380 XP.",
    ring: "from-[#a78bfa] to-[#4f46e5]",
    glow: "rgba(79, 70, 229, 0.4)",
    chip: "bg-[#eef2ff] text-[#4338ca]",
  },
  {
    src: "/learn/icons/learn-badge-mage.png",
    label: "Math Mage",
    xp: 440,
    blurb: "Cast math spells daily. Unlocks at 440 XP.",
    ring: "from-[#c4b5fd] to-[#7c3aed]",
    glow: "rgba(124, 58, 237, 0.4)",
    chip: "bg-[#f5f3ff] text-[#6d28d9]",
  },
  {
    src: "/learn/icons/learn-badge-apex.png",
    label: "Apex Crown",
    xp: 500,
    blurb: "Top of the mountain — the 500 XP crown.",
    ring: "from-[#fcd34d] to-[#d97706]",
    glow: "rgba(217, 119, 6, 0.45)",
    chip: "bg-[#fffbeb] text-[#b45309]",
  },
];

function rankMedal(rank: number) {
  if (rank === 1) return { tone: "gold" as const, label: "Gold", Icon: Crown };
  if (rank === 2) return { tone: "silver" as const, label: "Silver", Icon: Medal };
  if (rank === 3) return { tone: "bronze" as const, label: "Bronze", Icon: Medal };
  return null;
}

function ModalShell({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border-2 border-[#1c2434] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#f0ebe3] bg-white px-4 py-3">
          <div>
            <p id={titleId} className="text-[14px] font-extrabold text-[#1c2434]">
              {title}
            </p>
            {subtitle ? (
              <p className="text-[11px] font-semibold text-[#8a929c]">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[#8a929c] hover:bg-[#faf8f4]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

function AvatarBubble({
  name,
  you,
  size = "md",
  tone,
}: {
  name: string;
  you?: boolean;
  size?: "sm" | "md" | "lg";
  tone?: "gold" | "silver" | "bronze";
}) {
  const sizes = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-11 w-11 text-[13px]",
    lg: "h-14 w-14 text-[16px] sm:h-16 sm:w-16 sm:text-[18px]",
  };
  const rings = {
    gold: "ring-[#f5c542] bg-gradient-to-br from-[#fff6d9] to-[#ffe08a] text-[#92400e]",
    silver: "ring-[#c5ced8] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-[#334155]",
    bronze: "ring-[#d6a07a] bg-gradient-to-br from-[#fff1e6] to-[#f0c7a0] text-[#9a3412]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-extrabold ring-2",
        sizes[size],
        tone
          ? rings[tone]
          : you
            ? "bg-[#ff6a1a] text-white ring-[#ff6a1a]/40"
            : "bg-white text-[#1c2434] ring-[#efe6d8]",
      )}
    >
      {you ? "Y" : name[0]}
    </span>
  );
}

function PodiumBlock({
  row,
  rank,
}: {
  row: BoardRow;
  rank: 1 | 2 | 3;
}) {
  const medal = rankMedal(rank)!;
  const Icon = medal.Icon;
  const heights = {
    1: "h-[88px] sm:h-[100px]",
    2: "h-[68px] sm:h-[78px]",
    3: "h-[56px] sm:h-[64px]",
  };
  const fills = {
    1: "from-[#ffe08a] via-[#f5c542] to-[#d97706]",
    2: "from-[#e8eef5] via-[#c5ced8] to-[#94a3b8]",
    3: "from-[#f3d0b0] via-[#d6a07a] to-[#b45309]",
  };
  const faces = {
    1: "border-[#f5c542]/80 bg-gradient-to-b from-[#fffbeb] to-[#fff4d6]",
    2: "border-[#c5ced8]/80 bg-gradient-to-b from-[#f8fafc] to-[#eef2f7]",
    3: "border-[#d6a07a]/80 bg-gradient-to-b from-[#fff7ed] to-[#fde8d4]",
  };
  const order = { 1: "order-2", 2: "order-1", 3: "order-3" };
  const widths = {
    1: "w-[100px] sm:w-[112px]",
    2: "w-[92px] sm:w-[100px]",
    3: "w-[92px] sm:w-[100px]",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2",
        widths[rank],
        order[rank],
      )}
    >
      <div className="flex min-h-[118px] w-full flex-col items-center sm:min-h-[128px]">
        <span
          className={cn(
            "mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
            rank === 1 && "bg-[#fff8d6] text-[#b45309]",
            rank === 2 && "bg-[#f1f5f9] text-[#475569]",
            rank === 3 && "bg-[#fff1e6] text-[#9a3412]",
          )}
        >
          <Icon className="h-3 w-3" strokeWidth={2.5} />
          {medal.label}
        </span>
        <AvatarBubble name={row.name} you={row.you} size="lg" tone={medal.tone} />
        <p className="mt-2 w-full truncate px-0.5 text-center text-[13px] font-extrabold text-[#1c2434] sm:text-[14px]">
          {row.name}
        </p>
        <p className="text-[12px] font-bold text-[#ff6a1a]">{row.xp} XP</p>
      </div>

      <div className="relative w-full">
        <div
          className={cn(
            "relative flex w-full flex-col items-center justify-start overflow-hidden rounded-t-xl border-2 border-b-0 border-[#1c2434]/15 bg-gradient-to-b shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
            heights[rank],
            fills[rank],
          )}
        >
          <div
            className={cn(
              "mt-2 flex h-8 w-8 items-center justify-center rounded-lg border-2 text-[14px] font-black text-[#1c2434] shadow-sm",
              faces[rank],
            )}
          >
            {rank}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent" />
        </div>
        <div
          className={cn(
            "h-2 w-full rounded-b-md border-2 border-t-0 border-[#1c2434]/20 bg-gradient-to-b",
            fills[rank],
            "brightness-90",
          )}
        />
      </div>
    </div>
  );
}

function RankRow({ row, rank }: { row: BoardRow; rank: number }) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5",
        row.you ? "bg-[#fff4e8] ring-1 ring-[#ff6a1a]/25" : "bg-[#faf8f4]",
      )}
    >
      <span className="w-6 text-center text-[13px] font-extrabold text-[#8a929c]">{rank}</span>
      <AvatarBubble name={row.name} you={row.you} size="sm" />
      <span className="min-w-0 flex-1 truncate text-[14px] font-extrabold text-[#1c2434]">
        {row.name}
      </span>
      <span className="text-[13px] font-bold text-[#ff6a1a]">{row.xp} XP</span>
    </li>
  );
}

function BadgeTile({
  badge,
  unlocked,
  xp,
  compact,
  iconOnly,
}: {
  badge: BadgeDef;
  unlocked: boolean;
  xp: number;
  compact?: boolean;
  iconOnly?: boolean;
}) {
  return (
    <div className={cn("min-w-0 text-center", !unlocked && "opacity-75")}>
      <div
        className={cn(
          "relative mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br p-[2px]",
          compact || iconOnly ? "h-14 w-14" : "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
          badge.ring,
          unlocked ? "learn-xp-badge" : "learn-xp-badge-lock",
        )}
        style={{ "--learn-badge-glow": badge.glow } as CSSProperties}
      >
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-white">
          <Image
            src={badge.src}
            alt=""
            width={72}
            height={72}
            className={cn(
              "object-contain",
              compact || iconOnly ? "h-9 w-9" : "h-10 w-10 sm:h-12 sm:w-12",
              !unlocked && "opacity-55 grayscale",
            )}
          />
        </div>
        {!unlocked ? (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1c2434] text-white">
            <Lock className="h-2.5 w-2.5" strokeWidth={2.5} />
          </span>
        ) : null}
      </div>
      {iconOnly ? null : (
        <>
          <p className="mt-1.5 text-[11px] font-extrabold leading-tight text-[#1c2434]">
            {badge.label}
          </p>
          <p
            className={cn(
              "mt-0.5 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              unlocked ? badge.chip : "bg-[#f4f1ea] text-[#8a929c]",
            )}
          >
            {unlocked ? "Unlocked" : `${Math.min(xp, badge.xp)}/${badge.xp}`}
          </p>
        </>
      )}
    </div>
  );
}

function toBoardRow(r: LearnLeaderboardRow): BoardRow {
  return { name: r.you ? "You" : r.name, xp: r.xp, you: r.you };
}

export function LmsCohortLeaderboard({
  xp,
  className,
}: {
  xp: number;
  className?: string;
}) {
  const [listOpen, setListOpen] = useState(false);
  const [board, setBoard] = useState<BoardRow[]>([]);
  const [yourRank, setYourRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchLearnLeaderboard(100)
      .then((data) => {
        if (cancelled) return;
        setBoard(data.rows.map(toBoardRow));
        setYourRank(data.yourRank);
      })
      .catch(() => {
        if (cancelled) return;
        setBoard([{ name: "You", xp, you: true }]);
        setYourRank(1);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [xp]);

  const top3 = board.slice(0, 3);
  const next3 = board.slice(3, 6);

  return (
    <>
      <section
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#1c2434] bg-white shadow-[3px_3px_0_0_#ff6a1a]",
          className,
        )}
      >
        <div className="flex shrink-0 items-start gap-2.5 border-b border-[#f0ebe3] px-4 py-3.5 sm:px-5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff4e8]">
            <Trophy className="h-[18px] w-[18px] text-[#ff6a1a]" strokeWidth={2.25} />
          </span>
          <div>
            <h2 className="text-[15px] font-extrabold text-[#1c2434]">
              Cohort leaderboard
            </h2>
            <p className="mt-0.5 text-[12px] font-semibold text-[#8a929c]">
              You&apos;re #{yourRank ?? "—"} · Class 3–5 · first name only
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <p className="px-5 py-10 text-center text-[13px] font-semibold text-[#8a929c]">
              Loading ranks…
            </p>
          ) : board.length === 0 ? (
            <p className="px-5 py-10 text-center text-[13px] font-semibold text-[#8a929c]">
              Be the first on the board — earn XP to climb.
            </p>
          ) : (
            <>
              <div className="relative px-3 pb-3 pt-5 sm:px-5">
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-3 h-20 w-52 -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,106,26,0.12),transparent_70%)]"
                />
                <div className="relative mx-auto flex w-full max-w-[320px] items-end justify-center gap-2.5 sm:gap-4">
                  {top3[1] ? <PodiumBlock row={top3[1]} rank={2} /> : null}
                  {top3[0] ? <PodiumBlock row={top3[0]} rank={1} /> : null}
                  {top3[2] ? <PodiumBlock row={top3[2]} rank={3} /> : null}
                </div>
                <div className="mx-auto mt-1 h-2 w-[260px] max-w-full rounded-b-xl bg-gradient-to-b from-[#1c2434]/10 to-[#1c2434]/04 sm:w-[300px]" />
                <div className="mx-auto h-1 w-[220px] max-w-full rounded-b-md bg-[#1c2434]/08 sm:w-[260px]" />
              </div>

              <ul className="space-y-2 px-4 pb-3 pt-3 sm:px-5">
                {next3.map((row, i) => (
                  <RankRow key={`${row.name}-${i}`} row={row} rank={i + 4} />
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-[#f0ebe3] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-[11px] font-semibold text-[#8a929c]">
            Live ranks · updates every few minutes
          </p>
          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="inline-flex items-center justify-center rounded-xl bg-[#1c2434] px-3.5 py-2 text-[12px] font-extrabold text-white transition hover:bg-[#2a3548]"
          >
            View full list
          </button>
        </div>
      </section>

      <ModalShell
        open={listOpen}
        onClose={() => setListOpen(false)}
        title="Cohort top 100"
        subtitle="Class 3–5 · first name + XP only"
      >
        <ul className="space-y-1.5 p-3 sm:p-4">
          {board.map((row, i) => (
            <RankRow key={`${row.name}-${i}`} row={row} rank={i + 1} />
          ))}
        </ul>
      </ModalShell>
    </>
  );
}

export function LmsBadgesPanel({ xp }: { xp: number }) {
  const [open, setOpen] = useState(false);
  const preview = LEARN_BADGES.slice(0, 5);
  const unlockedCount = LEARN_BADGES.filter((b) => xp >= b.xp).length;
  const next = LEARN_BADGES.find((b) => xp < b.xp);

  return (
    <>
      <section className="rounded-2xl border border-[#e8e2d8] bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-extrabold text-[#1c2434]">Badges</h2>
            <p className="mt-0.5 text-[12px] font-semibold text-[#8a929c]">
              {unlockedCount}/{LEARN_BADGES.length} unlocked
              {next ? ` · next at ${next.xp} XP` : " · Apex complete!"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-xl border border-[#e8e2d8] bg-[#faf8f4] px-3 py-2 text-[12px] font-extrabold text-[#1c2434] transition hover:border-[#ff6a1a]/40 hover:bg-[#fff4e8]"
          >
            See full badges
          </button>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
          {preview.map((badge) => (
            <BadgeTile
              key={badge.label}
              badge={badge}
              unlocked={xp >= badge.xp}
              xp={xp}
              compact
            />
          ))}
        </div>
      </section>

      <ModalShell
        open={open}
        onClose={() => setOpen(false)}
        title="All badges"
        subtitle={`Earn XP from quizzes, POTD & practice · you have ${xp} XP`}
      >
        <div className="space-y-3 p-3 sm:p-4">
          {LEARN_BADGES.map((badge) => {
            const unlocked = xp >= badge.xp;
            const progress = Math.min(100, Math.round((xp / badge.xp) * 100));
            return (
              <div
                key={badge.label}
                className={cn(
                  "flex gap-3 rounded-2xl border p-3",
                  unlocked
                    ? "border-[#ff6a1a]/35 bg-[#fff4e8]"
                    : "border-[#f0ebe3] bg-[#faf8f4]",
                )}
              >
                <div className="shrink-0">
                  <BadgeTile badge={badge} unlocked={unlocked} xp={xp} iconOnly />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-extrabold text-[#1c2434]">
                      {badge.label}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
                        unlocked ? badge.chip : "bg-white text-[#8a929c] ring-1 ring-[#efe6d8]",
                      )}
                    >
                      {unlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#5a6472]">
                    {badge.blurb}
                  </p>
                  <div className="mt-2.5">
                    <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-[#8a929c]">
                      <span>Need {badge.xp} XP</span>
                      <span>
                        {unlocked ? "Done" : `${xp}/${badge.xp}`}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#efe6d8]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          unlocked ? "bg-[#0d9488]" : "bg-[#ff6a1a]",
                        )}
                        style={{ width: `${Math.max(unlocked ? 100 : 2, progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ModalShell>
    </>
  );
}
