import { LmsMe } from "@/components/learn/lms/lms-me";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Me — Mentr Learn",
  robots: { index: false, follow: false },
};

export default function LearnAppMePage() {
  return <LmsMe />;
}
