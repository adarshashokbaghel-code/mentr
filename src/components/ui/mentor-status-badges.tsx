import { cn } from "@/lib/utils";
import { BadgeCheck, Crown } from "lucide-react";

type Size = "sm" | "md";

const sizeCls: Record<Size, string> = {
  sm: "gap-0.5 px-1.5 py-0.5 text-[9px]",
  md: "gap-1 px-2 py-0.5 text-[10px]",
};

const iconCls: Record<Size, string> = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
};

/** Verified (email) chip — sage. */
export function VerifiedMentorBadge({
  size = "sm",
  className,
}: {
  size?: Size;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded font-bold uppercase tracking-wide",
        "bg-sage-wash text-sage",
        sizeCls[size],
        className,
      )}
    >
      <BadgeCheck className={iconCls[size]} />
      Verified
    </span>
  );
}

/** Premium mentor chip — butter/ink with crown. */
export function PremiumMentorBadge({
  size = "sm",
  className,
}: {
  size?: Size;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded font-bold uppercase tracking-wide",
        "border border-ink/15 bg-gradient-to-r from-butter to-[#ffe08a] text-ink shadow-[1px_1px_0_0_rgba(26,35,28,0.15)]",
        sizeCls[size],
        className,
      )}
    >
      <Crown className={cn(iconCls[size], "text-ink")} />
      Premium
    </span>
  );
}

/** Side-by-side verified + premium when present. */
export function MentorStatusBadges({
  verified,
  premium,
  size = "sm",
  className,
}: {
  verified?: boolean;
  premium?: boolean;
  size?: Size;
  className?: string;
}) {
  if (!verified && !premium) return null;
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1", className)}>
      {verified ? <VerifiedMentorBadge size={size} /> : null}
      {premium ? <PremiumMentorBadge size={size} /> : null}
    </span>
  );
}
