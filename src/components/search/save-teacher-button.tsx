"use client";

import { useShortlist } from "@/components/search/shortlist-context";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface SaveTeacherButtonProps {
  teacherId: string;
  className?: string;
  size?: "sm" | "md";
}

export function SaveTeacherButton({
  teacherId,
  className,
  size = "md",
}: SaveTeacherButtonProps) {
  const { isSaved, toggle } = useShortlist();
  const saved = isSaved(teacherId);
  const dim = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      data-shortlist
      aria-label={saved ? "Remove from saved tutors" : "Save tutor"}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void toggle(teacherId);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-hairline bg-white/95 shadow-sm transition hover:scale-105",
        dim,
        saved && "border-coral/30 bg-coral-wash",
        className,
      )}
    >
      <Heart
        className={cn(
          icon,
          saved ? "fill-coral text-coral" : "text-muted",
        )}
      />
    </button>
  );
}
