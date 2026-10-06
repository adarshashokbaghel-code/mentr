"use client";

import { usePyLms } from "@/components/learn-python/lms/py-lms-provider";
import { ACHIEVEMENTS, bandFor, type AchievementId } from "@/lib/python-lms/game";
import { cn } from "@/lib/utils";
import { Bug, CalendarCheck, Egg, Eye, Flame, Gem, Lock, NotebookPen, Swords, Terminal, type LucideIcon } from "lucide-react";
import { useId } from "react";

type Frame = "hex" | "shield" | "seal";

type BadgeStyle = {
  frame: Frame;
  rim: [string, string, string];
  face: [string, string];
  ink: string;
  icon: LucideIcon | "snake";
  ribbon: string;
};

const BADGES: Record<AchievementId, BadgeStyle> = {
  "first-run": { frame: "hex", rim: ["#b5f2d0", "#2f9e6e", "#0f4a31"], face: ["#237a55", "#0a2b1e"], ink: "#e9fff3", icon: Terminal, ribbon: "FIRST RUN" },
  "note-master": { frame: "hex", rim: ["#cdeeff", "#2b8fbf", "#0d3d5c"], face: ["#1f6f99", "#0a2536"], ink: "#eaf7ff", icon: NotebookPen, ribbon: "NOTES" },
  "sharp-eye": { frame: "hex", rim: ["#e6defe", "#7c6ad6", "#2f2280"], face: ["#40349a", "#120e33"], ink: "#f1eeff", icon: Eye, ribbon: "SHARP EYE" },
  "bug-hunter": { frame: "shield", rim: ["#ffd9cc", "#e2674a", "#7a2410"], face: ["#a8391c", "#3a1206"], ink: "#fff1ea", icon: Bug, ribbon: "BUG HUNTER" },
  "on-fire": { frame: "shield", rim: ["#ffe1c2", "#ff9a4d", "#a4470b"], face: ["#b0561a", "#401b07"], ink: "#fff4e8", icon: Flame, ribbon: "ON FIRE" },
  flawless: { frame: "shield", rim: ["#fff3cf", "#f0b429", "#7a4d00"], face: ["#b07a10", "#3d2800"], ink: "#fff8e1", icon: Gem, ribbon: "FLAWLESS" },
  "lesson-1": { frame: "hex", rim: ["#d8ffe9", "#3fcf8e", "#0b5a38"], face: ["#1d6b49", "#06231a"], ink: "#e9fff3", icon: "snake", ribbon: "LESSON 1" },
  "streak-3": { frame: "seal", rim: ["#fff0c2", "#f5a524", "#8a4b00"], face: ["#a0600a", "#3a2100"], ink: "#fff6dc", icon: CalendarCheck, ribbon: "3 DAYS" },
  "streak-7": { frame: "seal", rim: ["#ffd0d0", "#e0484f", "#6e0f17"], face: ["#a3232c", "#33060a"], ink: "#fff0f0", icon: Swords, ribbon: "7 DAYS" },
  "level-10": { frame: "shield", rim: ["#c9fbf2", "#14b8a6", "#0b4f47"], face: ["#0f7c70", "#032a26"], ink: "#e6fffb", icon: Egg, ribbon: "LEVEL 10" },
};

const HEX_OUTER = "60,6 106.77,33 106.77,87 60,114 13.23,87 13.23,33";
const HEX_INNER = "60,15 98.97,37.5 98.97,82.5 60,105 21.03,82.5 21.03,37.5";
const SHIELD_OUTER = "M60 5 L106 20 V58 C106 88 86 106 60 117 C34 106 14 88 14 58 V20 Z";
const SHIELD_INNER = "M60 14 L98 26.5 V58 C98 83 81 98.5 60 108 C39 98.5 22 83 22 58 V26.5 Z";

function sealPoints(r1: number, r2: number, n: number, cy = 60): string {
  return Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 ? r2 : r1;
    const a = (Math.PI * i) / n - Math.PI / 2;
    return `${(60 + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}
const SEAL_OUTER = sealPoints(56, 50, 18);

function Outer({ frame, fill }: { frame: Frame; fill: string }) {
  if (frame === "hex") return <polygon points={HEX_OUTER} fill={fill} />;
  if (frame === "shield") return <path d={SHIELD_OUTER} fill={fill} />;
  return <polygon points={SEAL_OUTER} fill={fill} />;
}

function Inner({ frame, fill }: { frame: Frame; fill: string }) {
  if (frame === "hex") return <polygon points={HEX_INNER} fill={fill} />;
  if (frame === "shield") return <path d={SHIELD_INNER} fill={fill} />;
  return <circle cx="60" cy="60" r="43" fill={fill} />;
}

function Snake({ fill, eye }: { fill: string; eye: string }) {
  return (
    <g fill={fill}>
      <rect x="-8" y="-16" width="16" height="11" rx="3.5" />
      <rect x="-16" y="-7" width="23" height="6" rx="2.5" />
      <rect x="-16" y="-7" width="7" height="16" rx="3" />
      <circle cx="-3.5" cy="-11.5" r="1.6" fill={eye} />
    </g>
  );
}

/** Achievement medal drawn as SVG so it stays sharp at every size. */
export function AchievementBadge({
  id,
  unlocked,
  size = 48,
  ribbon,
  className,
}: {
  id: AchievementId;
  unlocked: boolean;
  size?: number;
  /** Show the name ribbon; only readable from about 72px wide. */
  ribbon?: boolean;
  className?: string;
}) {
  const s = BADGES[id];
  const uid = useId().replace(/:/g, "");
  const showRibbon = ribbon ?? size >= 72;
  const Icon = s.icon;

  return (
    <span className={cn("relative inline-block shrink-0", className)} style={{ width: size }}>
      <svg
        viewBox="0 0 120 124"
        role="img"
        aria-label={`${ACHIEVEMENTS[id].title} badge${unlocked ? "" : " (locked)"}`}
        className={cn(
          "block h-auto w-full transition duration-300",
          unlocked ? "drop-shadow-[0_6px_8px_rgba(10,20,14,0.28)]" : "opacity-45 grayscale",
        )}
      >
        <defs>
          <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={s.rim[0]} />
            <stop offset="50%" stopColor={s.rim[1]} />
            <stop offset="100%" stopColor={s.rim[2]} />
          </linearGradient>
          <radialGradient id={`${uid}-face`} cx="0.38" cy="0.3" r="0.85">
            <stop offset="0%" stopColor={s.face[0]} />
            <stop offset="100%" stopColor={s.face[1]} />
          </radialGradient>
          <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${uid}-clip`}>
            <Outer frame={s.frame} fill="#000" />
          </clipPath>
        </defs>

        <Outer frame={s.frame} fill={`url(#${uid}-rim)`} />
        <g clipPath={`url(#${uid}-clip)`}>
          <rect x="0" y="0" width="120" height="44" fill="#fff" opacity="0.16" />
          <rect x="0" y="86" width="120" height="40" fill="#000" opacity="0.14" />
        </g>
        <Inner frame={s.frame} fill={`url(#${uid}-face)`} />
        {s.frame === "seal" && <circle cx="60" cy="60" r="37" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 3" />}
        {s.frame === "hex" && (
          <polygon points="60,21 93.8,40.5 93.8,79.5 60,99 26.2,79.5 26.2,40.5" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="0.8" />
        )}

        {Icon === "snake" ? (
          <g transform={`translate(60 ${showRibbon ? 56 : 60}) scale(1.2)`}>
            <Snake fill={s.ink} eye={s.face[1]} />
            <g transform="rotate(180)">
              <Snake fill={s.rim[0]} eye={s.face[1]} />
            </g>
          </g>
        ) : (
          <Icon x={38} y={showRibbon ? 33 : 38} size={44} color={s.ink} strokeWidth={2} />
        )}

        {unlocked && (
          <g clipPath={`url(#${uid}-clip)`}>
            <rect className="py-shine" x="0" y="0" width="30" height="124" fill={`url(#${uid}-shine)`} />
          </g>
        )}

        {showRibbon && (
          <>
            <path d="M6 92 L15 92 L15 106 L6 106 L10.5 99 Z" fill={s.rim[2]} />
            <path d="M114 92 L105 92 L105 106 L114 106 L109.5 99 Z" fill={s.rim[2]} />
            <path d="M13 88 H107 V104 H13 Z" fill={s.rim[1]} />
            <path d="M13 88 H107" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.8" />
            <text
              x="60"
              y="99"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
              fontSize={s.ribbon.length > 8 ? 7.4 : 8.4}
              fontWeight="800"
              letterSpacing="1.3"
              fill="#fff"
            >
              {s.ribbon}
            </text>
          </>
        )}
      </svg>
      {!unlocked && (
        <span
          className="absolute right-0 top-0 flex items-center justify-center border border-hairline bg-white text-muted"
          style={{ width: Math.max(14, size * 0.3), height: Math.max(14, size * 0.3) }}
        >
          <Lock style={{ width: "60%", height: "60%" }} />
        </span>
      )}
    </span>
  );
}

export function formatAchievedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Badge that shows details on hover and opens the full achievements list on click. */
export function AchievementButton({ id, size = 44 }: { id: AchievementId; size?: number }) {
  const { store, openGuide } = usePyLms();
  const at = store.achievements[id];
  const a = ACHIEVEMENTS[id];
  return (
    <button
      type="button"
      onClick={() => openGuide("achievements", id)}
      className="group relative block outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ink"
      aria-label={`${a.title}${at ? `, unlocked ${formatAchievedAt(at)}` : ", locked"}. Open achievements`}
    >
      <AchievementBadge id={id} unlocked={Boolean(at)} size={size} />
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-56 -translate-x-1/2 border border-[#1f2a23] bg-[#0f1612] px-3 py-2.5 text-left text-white shadow-xl sm:group-hover:block sm:group-focus-visible:block"
      >
        <span className="block text-[13.5px] font-extrabold">{a.title}</span>
        <span className="mt-0.5 block text-[12px] leading-snug text-white/70">{at ? a.text : a.how}</span>
        <span className={cn("mt-1.5 block font-mono text-[10.5px]", at ? "text-[#5ee0a0]" : "text-white/45")}>
          {at ? `Unlocked ${formatAchievedAt(at)}` : "Locked · click for all badges"}
        </span>
      </span>
    </button>
  );
}

/** Small hex chip with the level number, coloured by band. */
export function LevelMark({ level, size = 22, className }: { level: number; size?: number; className?: string }) {
  const band = bandFor(level);
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center font-mono font-bold text-white", className)}
      style={{ width: size, height: size * 1.08, fontSize: size * (level >= 10 ? 0.42 : 0.5) }}
    >
      <svg viewBox="0 0 120 130" className="absolute inset-0 h-full w-full" aria-hidden>
        <polygon points="60,4 112,34 112,96 60,126 8,96 8,34" fill={band.color} />
        <polygon points="60,4 112,34 60,64 8,34" fill="#fff" opacity="0.14" />
      </svg>
      <span className="relative">{level}</span>
    </span>
  );
}
