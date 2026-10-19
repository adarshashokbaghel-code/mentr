"use client";

import {
  PY_LMS_BASE,
  PY_LMS_INTERMEDIATE,
  PY_LMS_PATH_TEST,
  pyTrackTheme,
} from "@/lib/python-lms";
import { cn } from "@/lib/utils";
import { BadgeCheck, BookOpen, Briefcase, FileQuestion } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const beginnerTheme = pyTrackTheme("beginner");
const intermediateTheme = pyTrackTheme("intermediate");

export function PyTrackPathNav({
  dense,
  onNavigate,
  placementPassed,
}: {
  dense?: boolean;
  onNavigate: () => void;
  placementPassed?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const onBeginner = pathname === PY_LMS_BASE;
  const onIntermediate =
    pathname === PY_LMS_INTERMEDIATE || pathname.startsWith(`${PY_LMS_BASE}/int-`);
  const onTest = pathname === PY_LMS_PATH_TEST;

  const row = cn(
    "mb-0 flex items-center gap-2 px-2 py-1.5 font-semibold transition",
    dense ? "text-[12.5px]" : "text-[13.5px]",
  );

  return (
    <div aria-label="Course tracks">
      <Link
        href={PY_LMS_BASE}
        onClick={onNavigate}
        className={cn(row, "mb-1.5", onBeginner ? "text-ink" : "text-muted hover:text-ink")}
        style={onBeginner ? { backgroundColor: beginnerTheme.accentWash } : undefined}
      >
        <BookOpen className="h-4 w-4 shrink-0" style={{ color: beginnerTheme.accent }} aria-hidden />
        Beginner home
      </Link>

      <Link
        href={PY_LMS_PATH_TEST}
        onClick={onNavigate}
        aria-current={onTest ? "page" : undefined}
        className={cn(row, "mb-1.5", onTest ? "text-ink" : "text-muted hover:text-ink")}
        style={onTest ? { backgroundColor: intermediateTheme.accentWash } : undefined}
      >
        {placementPassed ? (
          <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: beginnerTheme.accent }} aria-hidden />
        ) : (
          <FileQuestion className="h-4 w-4 shrink-0" style={{ color: intermediateTheme.accent }} aria-hidden />
        )}
        Test to Intermediate
      </Link>

      <Link
        href={PY_LMS_INTERMEDIATE}
        onClick={onNavigate}
        className={cn(row, onIntermediate ? "text-ink" : "text-muted hover:text-ink")}
        style={onIntermediate ? { backgroundColor: intermediateTheme.accentWash } : undefined}
      >
        <Briefcase className="h-4 w-4 shrink-0" style={{ color: intermediateTheme.accent }} aria-hidden />
        Intermediate home
      </Link>
    </div>
  );
}
