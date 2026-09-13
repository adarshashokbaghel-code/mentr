import { LmsProgress } from "@/components/learn/lms/lms-progress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress — Mentr Learn",
  robots: { index: false, follow: false },
};

export default function LearnAppProgressPage() {
  return <LmsProgress />;
}
