"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

type Size = "sm" | "md";

const sizeCls: Record<Size, string> = {
  sm: "gap-0.5 px-1.5 py-0.5 text-[9px]",
  md: "gap-1 px-2 py-0.5 text-[10px]",
};

const iconCls: Record<Size, string> = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
};

const PREMIUM_PERKS = [
  {
    icon: Sparkles,
    text: "Hand-picked for parents — not a random listing",
  },
  {
    icon: ShieldCheck,
    text: "100% identity verified by Mentr",
  },
  {
    icon: Star,
    text: "Complete profiles with clear fees & availability",
  },
  {
    icon: Check,
    text: "Priority placement — serious mentors, shown first",
  },
] as const;

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

function PremiumBadgeChip({
  size,
  className,
  label,
}: {
  size: Size;
  className?: string;
  label: string;
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
      {label}
    </span>
  );
}

function PremiumMentorTooltipBody() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 border-b border-ink/10 pb-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#e8c84a]/70 bg-gradient-to-br from-butter to-[#ffe08a]">
          <Crown className="h-3.5 w-3.5 text-ink" />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-bold tracking-tight text-ink">
            Premium mentor
          </p>
          <p className="text-[10px] font-medium text-muted">
            Why parents trust this badge
          </p>
        </div>
      </div>
      <ul className="space-y-1.5">
        {PREMIUM_PERKS.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-start gap-2 text-[11px] leading-snug text-ink/85"
          >
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Premium mentor chip — butter/ink with crown + parent explainer tooltip. */
export function PremiumMentorBadge({
  size = "sm",
  className,
  label = "Premium",
  showTooltip = true,
}: {
  size?: Size;
  className?: string;
  /** Chip text — e.g. "Premium" or "Premium mentor" */
  label?: string;
  showTooltip?: boolean;
}) {
  const chip = (
    <PremiumBadgeChip size={size} className={className} label={label} />
  );

  if (!showTooltip) return chip;

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="What Premium mentor means"
            className="inline-flex cursor-help rounded outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {chip}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          className={cn(
            "z-[80] w-[min(18.5rem,calc(100vw-1.5rem))] rounded-xl border-2 border-ink/10 bg-white p-3 text-left text-ink shadow-[0_12px_32px_rgba(28,26,23,0.14)]",
            "animate-in fade-in-0 zoom-in-95",
            "[&>svg]:hidden",
          )}
        >
          <PremiumMentorTooltipBody />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
