import { PyProfilePage } from "@/components/learn-python/lms/py-profile";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Profile & certificate | Learn Python",
};

export default function LearnPythonProfilePage() {
  return (
    <Suspense fallback={null}>
      <PyProfilePage />
    </Suspense>
  );
}
