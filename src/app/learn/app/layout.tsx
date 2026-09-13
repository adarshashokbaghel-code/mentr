import { LmsAuthGate } from "@/components/learn/lms/lms-auth-gate";
import type { Metadata } from "next";
import type { ReactNode } from "react";

/** LMS is auth + enrollment gated — never index. */
export const metadata: Metadata = {
  title: "Learning app | Mentr Learn",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function LearnAppLayout({ children }: { children: ReactNode }) {
  return <LmsAuthGate>{children}</LmsAuthGate>;
}
