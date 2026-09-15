"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import type { LearnDinoAction } from "@/lib/learn-assets";
import { cn } from "@/lib/utils";

export function LmsBuildCoach({
  message,
  action = "wave",
  className,
}: {
  message: string;
  action?: LearnDinoAction;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-[#e8e2d8] bg-white px-2.5 py-2",
        className,
      )}
    >
      <LearnDino
        size={36}
        action={action}
        className="h-9 w-9 shrink-0"
      />
      <p className="min-w-0 flex-1 text-[12px] font-bold leading-snug text-[#1c2434] sm:text-[13px]">
        {message}
      </p>
    </div>
  );
}
