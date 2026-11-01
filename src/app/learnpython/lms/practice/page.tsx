import { PyPracticeBank } from "@/components/learn-python/lms/py-practice-bank";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice | Learn Python",
};

export default async function LearnPythonPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track } = await searchParams;
  const initialTrack = track === "intermediate" || track === "all" || track === "beginner" ? track : "beginner";
  return <PyPracticeBank initialTrack={initialTrack} />;
}
