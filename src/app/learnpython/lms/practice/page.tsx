import { PyPracticeBank } from "@/components/learn-python/lms/py-practice-bank";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice | Learn Python",
};

export default function LearnPythonPracticePage() {
  return <PyPracticeBank />;
}
