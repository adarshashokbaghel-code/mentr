import { cn } from "@/lib/utils";

/**
 * Scalloped wave divider — filled band above, ink-outlined wavy bottom edge.
 * Use `flip` to point the filled band downward (leading into a section).
 */
export function WaveSeparator({
  className,
  fill = "var(--butter)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  // 9 smooth cycles across 1440 — crest/trough of ±22 around midline y=26
  const wave =
    "M0 26" +
    "c40 -22 40 -22 80 0 c40 22 40 22 80 0".repeat(9).replace(/c/g, " c");

  return (
    <div
      aria-hidden
      className={cn(
        "w-full overflow-hidden leading-[0]",
        flip && "rotate-180",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 52"
        preserveAspectRatio="none"
        className="block h-8 w-full sm:h-11"
      >
        <path d={`${wave} L1440 0 L0 0 Z`} fill={fill} />
        <path
          d={wave}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
