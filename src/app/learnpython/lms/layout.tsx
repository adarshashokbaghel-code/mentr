import { PyLmsGate } from "@/components/learn-python/lms/py-lms-gate";
import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Signed-in learning app — never index. */
export const metadata: Metadata = {
  title: "Python Beginner | Learn Python",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function LearnPythonLmsLayout({ children }: { children: ReactNode }) {
  return <PyLmsGate>{children}</PyLmsGate>;
}
