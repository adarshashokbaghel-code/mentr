"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LmsShell } from "@/components/learn/lms/lms-shell";
import {
  fetchLearnEnrollment,
  LEARN_START_ENROLL_HREF,
} from "@/lib/learn-enroll";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Gates /learn/app — parent must be logged in and enrolled in Mentr Starter.
 * Otherwise redirects to /learn/start?enroll=1 (popup opens).
 */
export function LmsAuthGate({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function gate() {
      if (!user) {
        router.replace(LEARN_START_ENROLL_HREF);
        return;
      }
      if (user.role !== "parent") {
        router.replace(LEARN_START_ENROLL_HREF);
        return;
      }
      const enrollment = await fetchLearnEnrollment();
      if (cancelled) return;
      if (!enrollment) {
        router.replace(LEARN_START_ENROLL_HREF);
        return;
      }
      setReady(true);
    }

    void gate();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, router]);

  if (authLoading || !ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#fff8ef]">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff6a1a]" />
        <p className="text-[13px] font-semibold text-[#5a6472]">
          Opening learning app…
        </p>
      </div>
    );
  }

  return <LmsShell>{children}</LmsShell>;
}
