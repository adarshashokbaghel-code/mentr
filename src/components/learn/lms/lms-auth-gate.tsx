"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LmsShell } from "@/components/learn/lms/lms-shell";
import {
  ensureLearnEnrollment,
  LEARN_START_ENROLL_HREF,
} from "@/lib/learn-enroll";
import { recordDailyCheckIn } from "@/lib/learn-progress-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Gates /learn/app — parent must be logged in.
 * A logged-in parent with no Learn row is enrolled here, so progress
 * is stored for accounts that signed up outside the Learn page too.
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

      try {
        await ensureLearnEnrollment(user.id);
        try {
          await recordDailyCheckIn();
        } catch {
          // Row exists; the shell retries the daily check-in.
        }
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) router.replace(LEARN_START_ENROLL_HREF);
      }
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
