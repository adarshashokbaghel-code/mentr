"use client";

import { LpStatsBand } from "@/components/landing/lp/shared";
import {
  formatMentorCount,
  formatSubjectCount,
  usePlatformStats,
} from "@/lib/mentor-stats";
import type { LucideIcon } from "lucide-react";
import { BookOpen, MessageCircle, Sparkles, Users } from "lucide-react";
import { useMemo } from "react";

type Stat = {
  value: string;
  label: string;
  tint: string;
  icon?: LucideIcon;
  sub?: string;
};

/**
 * Homepage trust stats — mentor count is live from DB (auto-updates).
 */
export function HomeMentorStatsBand() {
  const platform = usePlatformStats();
  const mentorCount = platform?.mentors ?? null;
  const subjectCount = platform?.subjects ?? null;

  const stats = useMemo<Stat[]>(
    () => [
      {
        value: formatMentorCount(mentorCount),
        label: "Tutors & mentors",
        tint: "bg-lavender",
        icon: Users,
        sub: "Verified profiles",
      },
      {
        value: formatSubjectCount(subjectCount),
        label: "Subjects offered",
        tint: "bg-butter",
        icon: BookOpen,
        sub: "School · exams · skills",
      },
      {
        value: "₹0",
        label: "Platform fee",
        tint: "bg-sage-wash",
        icon: Sparkles,
        sub: "Parents & faculty",
      },
      {
        value: "2 ways",
        label: "To connect",
        tint: "bg-coral-wash",
        icon: MessageCircle,
        sub: "Search or Instant Connect",
      },
    ],
    [mentorCount, subjectCount],
  );

  return <LpStatsBand stats={stats} />;
}
