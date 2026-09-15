import { LmsBuildHub } from "@/components/learn/lms/build/lms-build-hub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Arena — Mentr Learn",
  robots: { index: false, follow: false },
};

export default function LearnBuildPage() {
  return <LmsBuildHub />;
}
