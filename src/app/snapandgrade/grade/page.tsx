import { SnapGradeApp } from "@/components/landing/lp/snap-grade-app";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grade now — Snap & Grade",
  description:
    "Pick a CBSE Class 9–12 Maths, Class 9–10 Science, or Class 11–12 Physics NCERT question, upload your solution photo, and get step marks against the CBSE-style rubric.",
  robots: { index: false, follow: false },
};

export default function SnapGradeGradePage() {
  return <SnapGradeApp />;
}
