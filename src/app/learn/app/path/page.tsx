import { LmsPath } from "@/components/learn/lms/lms-path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Path — Mentr Learn",
  robots: { index: false, follow: false },
};

export default function LearnAppPathPage() {
  return <LmsPath />;
}
