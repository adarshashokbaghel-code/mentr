import { LmsHome } from "@/components/learn/lms/lms-home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home — Mentr Learn",
  robots: { index: false, follow: false },
};

export default function LearnAppHomePage() {
  return <LmsHome />;
}
