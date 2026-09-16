"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LearnDino } from "@/components/landing/lp/learn-dino";
import {
  downloadReceiptForEnrollment,
  fetchLearnEnrollment,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";
import { Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LmsMe() {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState<LearnEnrollmentDto | null>(null);

  useEffect(() => {
    void fetchLearnEnrollment().then(setEnrollment);
  }, []);

  const name =
    user?.parentProfile?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Explorer";
  const first = name.split(/\s+/)[0] || "Explorer";

  return (
    <div className="space-y-6">
      <h1 className="text-[1.65rem] font-extrabold tracking-tight text-[#1c2434]">
        Me
      </h1>

      <div className="rounded-3xl border-2 border-[#1c2434] bg-white p-6 text-center shadow-[4px_4px_0_0_#ff6a1a]">
        <LearnDino size={88} action="blink" className="mx-auto h-20 w-20" />
        <p className="mt-4 text-[1.35rem] font-extrabold text-[#1c2434]">
          {first}
        </p>
        <span className="mt-2 inline-flex rounded-full bg-[#fff4e8] px-3 py-1 text-[12px] font-bold text-[#ff6a1a]">
          Class 3–5
        </span>
        <p className="mx-auto mt-3 max-w-xs text-[13px] font-medium leading-relaxed text-[#8a929c]">
          Progress is saved on this parent account. Streak grows when you open
          Learn each day.
        </p>
      </div>

      {enrollment ? (
        <div className="rounded-2xl border border-[#e8e2d8] bg-white p-4">
          <p className="text-[14px] font-extrabold text-[#1c2434]">
            Enrollment
          </p>
          <p className="mt-1 text-[13px] font-medium text-[#8a929c]">
            {enrollment.courseName} · {enrollment.receiptNumber}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[#8a929c]">
            {enrollment.progress.xp} XP · {enrollment.progress.streakDays} day
            streak · {enrollment.progress.videosWatched?.length ?? 0} videos
          </p>
          <button
            type="button"
            onClick={() =>
              downloadReceiptForEnrollment(enrollment, {
                name: user?.parentProfile?.name || name,
                email: user?.email || "",
                userId: user?.id || "",
              })
            }
            className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#ff6a1a] hover:underline"
          >
            <Download className="h-4 w-4" />
            Download receipt
          </button>
        </div>
      ) : null}

      <div className="rounded-2xl border border-[#e8e2d8] bg-white p-4">
        <p className="text-[14px] font-extrabold text-[#1c2434]">Parents</p>
        <p className="mt-1 text-[13px] font-medium text-[#8a929c]">
          Weekly email reports come here when accounts go live.
        </p>
        <Link
          href="/learn"
          className="mt-3 inline-flex text-[14px] font-bold text-[#ff6a1a] hover:underline"
        >
          Back to Mentr Learn site →
        </Link>
      </div>
    </div>
  );
}
