import type { PythonTier } from "@/lib/learn-python";
import { cn } from "@/lib/utils";

const TIER_STYLE: Record<
  PythonTier,
  {
    label: string;
    pips: number;
    rim: [string, string, string];
    face: [string, string];
    snakeA: string;
    snakeB: string;
    ribbon: [string, string];
    glow: string;
  }
> = {
  beginner: {
    label: "BEGINNER",
    pips: 1,
    rim: ["#b5f2d0", "#2f9e6e", "#0f4a31"],
    face: ["#237a55", "#0a2b1e"],
    snakeA: "#e9fff3",
    snakeB: "#8fe3b8",
    ribbon: ["#2f9e6e", "#145c3d"],
    glow: "#3fcf8e",
  },
  intermediate: {
    label: "INTERMEDIATE",
    pips: 2,
    rim: ["#ffe1c2", "#ff9a4d", "#a4470b"],
    face: ["#b0561a", "#401b07"],
    snakeA: "#fff4e8",
    snakeB: "#ffc58f",
    ribbon: ["#ef7a28", "#a4470b"],
    glow: "#ff9a4d",
  },
  advanced: {
    label: "ADVANCED",
    pips: 3,
    rim: ["#e6defe", "#7c6ad6", "#2f2280"],
    face: ["#40349a", "#120e33"],
    snakeA: "#f1eeff",
    snakeB: "#b9acff",
    ribbon: ["#6a57cc", "#2f2280"],
    glow: "#8f7dff",
  },
};

const OUTER = "60,6 106.77,33 106.77,87 60,114 13.23,87 13.23,33";
const INNER = "60,15 98.97,37.5 98.97,82.5 60,105 21.03,82.5 21.03,37.5";
const RING = "60,20 94.6,40 94.6,80 60,100 25.4,80 25.4,40";
const BEVEL_TOP = "13.23,33 60,6 106.77,33 98.97,37.5 60,15 21.03,37.5";
const BEVEL_BOTTOM = "106.77,87 60,114 13.23,87 21.03,82.5 60,105 98.97,82.5";

/** One snake of the two-tone mark; the second is the same shape rotated 180°. */
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

type Props = {
  tier: PythonTier;
  /** Distinguishes gradient ids when the same tier renders twice on a page. */
  idSuffix?: string;
  locked?: boolean;
  className?: string;
  /** Seconds to offset the float so a row of badges doesn't move in lockstep. */
  floatDelay?: number;
  still?: boolean;
};

export function PythonBadge({
  tier,
  idSuffix = "",
  locked,
  className,
  floatDelay = 0,
  still,
}: Props) {
  const s = TIER_STYLE[tier];
  const id = `py-${tier}${idSuffix}`;
  const pipStart = 60 - ((s.pips - 1) * 9) / 2;

  return (
    <span
      className={cn("group block [perspective:700px]", !still && "py-badge-float", className)}
      style={floatDelay ? { animationDelay: `${floatDelay}s` } : undefined}
    >
      <svg
        viewBox="0 0 120 124"
        role="img"
        aria-label={`Python ${tier} badge${locked ? " (locked)" : ""}`}
        className={cn(
          "py-badge block h-auto w-full drop-shadow-[0_12px_16px_rgba(10,20,14,0.35)] group-hover:[transform:rotateY(16deg)_rotateX(5deg)_scale(1.04)]",
          locked && "grayscale-[0.9] opacity-75",
        )}
      >
        <defs>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={s.rim[0]} />
            <stop offset="48%" stopColor={s.rim[1]} />
            <stop offset="100%" stopColor={s.rim[2]} />
          </linearGradient>
          <radialGradient id={`${id}-face`} cx="0.38" cy="0.3" r="0.85">
            <stop offset="0%" stopColor={s.face[0]} />
            <stop offset="100%" stopColor={s.face[1]} />
          </radialGradient>
          <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.ribbon[0]} />
            <stop offset="100%" stopColor={s.ribbon[1]} />
          </linearGradient>
          <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={s.glow} stopOpacity="0.55" />
            <stop offset="100%" stopColor={s.glow} stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}-clip`}>
            <polygon points={OUTER} />
          </clipPath>
        </defs>

        {!locked && <circle className="py-glow" cx="60" cy="60" r="60" fill={`url(#${id}-glow)`} />}

        <polygon points={OUTER} fill={`url(#${id}-rim)`} />
        <polygon points={BEVEL_TOP} fill="#ffffff" opacity="0.28" />
        <polygon points={BEVEL_BOTTOM} fill="#000000" opacity="0.22" />
        <polygon points={INNER} fill={`url(#${id}-face)`} />
        <polygon points={RING} fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="0.8" />

        {Array.from({ length: s.pips }, (_, i) => {
          const cx = pipStart + i * 9;
          return (
            <polygon
              key={i}
              points={`${cx},27 ${cx + 3},30 ${cx},33 ${cx - 3},30`}
              fill={s.snakeA}
              opacity="0.9"
            />
          );
        })}

        <g transform="translate(60 61) scale(1.15)">
          <Snake fill={s.snakeA} eye={s.face[1]} />
          <g transform="rotate(180)">
            <Snake fill={s.snakeB} eye={s.face[1]} />
          </g>
        </g>

        {!locked && (
          <g clipPath={`url(#${id}-clip)`}>
            <rect className="py-shine" x="0" y="0" width="34" height="124" fill={`url(#${id}-shine)`} />
          </g>
        )}

        <path d="M4 98 L14 98 L14 112 L4 112 L9 105 Z" fill={s.ribbon[1]} />
        <path d="M116 98 L106 98 L106 112 L116 112 L111 105 Z" fill={s.ribbon[1]} />
        <path d="M12 94 H108 V110 H12 Z" fill={`url(#${id}-ribbon)`} />
        <path d="M12 94 H108" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.8" />
        <text
          x="60"
          y="105"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
          fontSize={s.label.length > 9 ? 7.6 : 8.6}
          fontWeight="800"
          letterSpacing="1.6"
          fill="#ffffff"
        >
          {s.label}
        </text>
      </svg>
    </span>
  );
}
