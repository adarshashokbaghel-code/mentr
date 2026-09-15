import { LmsPracticeArena } from "@/components/learn/lms/lms-practice-arena";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Arena — Mentr Learn",
  robots: { index: false, follow: false },
};

export default function LearnAppPracticePage() {
  return <LmsPracticeArena />;
}
