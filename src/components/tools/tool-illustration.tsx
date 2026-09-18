import type { ToolAccent, ToolDef } from "@/lib/tools-catalog";
import { cn } from "@/lib/utils";

const ACCENT_BG: Record<ToolAccent, string> = {
  coral: "from-[#ff8a4c] via-[#ff6a1a] to-[#e85d04]",
  sage: "from-[#6db5a0] via-[#3d8f7a] to-[#2a6b5a]",
  butter: "from-[#f5d76e] via-[#e8b923] to-[#d4a017]",
  lavender: "from-[#b8a4e8] via-[#8b6fd4] to-[#6b4fc0]",
  sky: "from-[#7eb8e8] via-[#4a90c8] to-[#2d6fa0]",
  ink: "from-[#3d4a5c] via-[#1c2434] to-[#0f1419]",
};

/** Decorative SVG “placeholder” art for each tool — crisp, brand-aligned, no stock photos. */
export function ToolIllustration({
  tool,
  className,
}: {
  tool: ToolDef;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        ACCENT_BG[tool.accent],
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/25 blur-2xl" />
        <div className="absolute -bottom-8 left-4 h-24 w-24 rounded-full bg-black/10 blur-xl" />
      </div>
      <svg
        viewBox="0 0 160 100"
        className="relative h-full w-full p-4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {tool.icon === "merge" && <MergeArt />}
        {tool.icon === "split" && <SplitArt />}
        {tool.icon === "compress" && <CompressArt />}
        {tool.icon === "image" && <ImageArt />}
        {tool.icon === "organize" && <OrganizeArt />}
        {tool.icon === "text" && <TextArt />}
        {tool.icon === "worksheet" && <WorksheetArt />}
        {tool.icon === "tags" && <TagsArt />}
        {tool.icon === "counter" && <CounterArt />}
        {tool.icon === "timetable" && <TimetableArt />}
        {!["merge","split","compress","image","organize","text","worksheet","tags","counter","timetable"].includes(tool.icon) && (
          <GenericArt label={tool.shortTitle} />
        )}
      </svg>
    </div>
  );
}

function Doc({
  x,
  y,
  w = 36,
  h = 46,
  opacity = 1,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill="white"
        fillOpacity={0.95}
      />
      <path
        d={`M${x + w - 10} ${y} L${x + w} ${y + 10} L${x + w - 10} ${y + 10} Z`}
        fill="white"
        fillOpacity={0.7}
      />
      <rect
        x={x + 6}
        y={y + 14}
        width={w - 12}
        height={3}
        rx={1}
        fill="#1c2434"
        fillOpacity={0.2}
      />
      <rect
        x={x + 6}
        y={y + 22}
        width={w - 16}
        height={3}
        rx={1}
        fill="#1c2434"
        fillOpacity={0.15}
      />
      <rect
        x={x + 6}
        y={y + 30}
        width={w - 14}
        height={3}
        rx={1}
        fill="#1c2434"
        fillOpacity={0.12}
      />
    </g>
  );
}

function MergeArt() {
  return (
    <>
      <Doc x={18} y={28} opacity={0.85} />
      <Doc x={42} y={20} opacity={0.9} />
      <path
        d="M88 50 H108"
        stroke="white"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M102 42 L112 50 L102 58"
        stroke="white"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Doc x={118} y={24} w={40} h={52} />
    </>
  );
}

function SplitArt() {
  return (
    <>
      <Doc x={28} y={22} w={40} h={52} />
      <path
        d="M78 50 H96"
        stroke="white"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M90 42 L100 50 L90 58"
        stroke="white"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Doc x={108} y={18} w={28} h={28} opacity={0.95} />
      <Doc x={108} y={52} w={28} h={28} opacity={0.85} />
    </>
  );
}

function CompressArt() {
  return (
    <>
      <Doc x={48} y={12} w={44} h={56} opacity={0.55} />
      <Doc x={56} y={28} w={36} h={44} />
      <path
        d="M50 78 H90 M70 68 V88 M62 74 L70 68 L78 74"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function ImageArt() {
  return (
    <>
      <rect
        x={28}
        y={22}
        width={48}
        height={36}
        rx={5}
        fill="white"
        fillOpacity={0.95}
      />
      <circle cx={40} cy={34} r={5} fill="#ff6a1a" fillOpacity={0.7} />
      <path
        d="M32 50 L44 40 L52 46 L68 32 L72 50 Z"
        fill="#1c2434"
        fillOpacity={0.25}
      />
      <path
        d="M86 50 H104"
        stroke="white"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Doc x={112} y={24} />
    </>
  );
}

function OrganizeArt() {
  return (
    <>
      <Doc x={30} y={18} opacity={0.7} />
      <Doc x={52} y={28} opacity={0.85} />
      <Doc x={74} y={22} />
      <path
        d="M118 30 V70 M110 38 L118 30 L126 38 M110 62 L118 70 L126 62"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function TextArt() {
  return (
    <>
      <Doc x={36} y={20} w={42} h={54} />
      <rect
        x={92}
        y={28}
        width={48}
        height={40}
        rx={4}
        fill="white"
        fillOpacity={0.9}
      />
      <text
        x={100}
        y={48}
        fill="#1c2434"
        fontSize={11}
        fontFamily="system-ui,sans-serif"
        fontWeight={700}
      >
        Aa
      </text>
      <text
        x={100}
        y={60}
        fill="#1c2434"
        fillOpacity={0.45}
        fontSize={7}
        fontFamily="system-ui,sans-serif"
      >
        text
      </text>
    </>
  );
}

function WorksheetArt() {
  return (
    <>
      <rect
        x={40}
        y={14}
        width={80}
        height={72}
        rx={5}
        fill="white"
        fillOpacity={0.95}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={52}
          y1={32 + i * 9}
          x2={108}
          y2={32 + i * 9}
          stroke="#1c2434"
          strokeOpacity={0.2}
          strokeWidth={1.5}
        />
      ))}
    </>
  );
}

function TagsArt() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${28 + i * 38}, ${28 + (i % 2) * 8})`}>
          <rect
            width={34}
            height={40}
            rx={4}
            fill="white"
            fillOpacity={0.95}
          />
          <circle cx={17} cy={14} r={6} fill="#ff6a1a" fillOpacity={0.35} />
          <rect
            x={8}
            y={26}
            width={18}
            height={3}
            rx={1}
            fill="#1c2434"
            fillOpacity={0.2}
          />
        </g>
      ))}
    </>
  );
}

function CounterArt() {
  return (
    <>
      <rect
        x={30}
        y={22}
        width={100}
        height={56}
        rx={8}
        fill="white"
        fillOpacity={0.95}
      />
      <text
        x={48}
        y={58}
        fill="#1c2434"
        fontSize={28}
        fontFamily="ui-monospace,monospace"
        fontWeight={800}
      >
        248
      </text>
      <text
        x={108}
        y={48}
        fill="#1c2434"
        fillOpacity={0.4}
        fontSize={8}
        fontFamily="system-ui,sans-serif"
        fontWeight={700}
      >
        words
      </text>
    </>
  );
}

function TimetableArt() {
  return (
    <>
      <rect
        x={28}
        y={18}
        width={104}
        height={64}
        rx={5}
        fill="white"
        fillOpacity={0.95}
      />
      {[0, 1, 2, 3].map((c) =>
        [0, 1, 2].map((r) => (
          <rect
            key={`${c}-${r}`}
            x={36 + c * 24}
            y={28 + r * 16}
            width={20}
            height={12}
            rx={2}
            fill={r === 0 || c === 0 ? "#ff6a1a" : "#1c2434"}
            fillOpacity={r === 0 || c === 0 ? 0.35 : 0.08}
          />
        )),
      )}
    </>
  );
}

function GenericArt({ label }: { label: string }) {
  return (
    <>
      <rect
        x={36}
        y={18}
        width={88}
        height={64}
        rx={8}
        fill="white"
        fillOpacity={0.95}
      />
      <text
        x={80}
        y={55}
        textAnchor="middle"
        fill="#1c2434"
        fontSize={11}
        fontFamily="system-ui,sans-serif"
        fontWeight={800}
      >
        {label.slice(0, 12)}
      </text>
    </>
  );
}
