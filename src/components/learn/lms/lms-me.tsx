"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import Link from "next/link";

export function LmsMe() {
  return (
    <div className="space-y-6">
      <h1 className="text-[1.65rem] font-extrabold tracking-tight text-[#1c2434]">
        Me
      </h1>

      <div className="rounded-3xl border-2 border-[#1c2434] bg-white p-6 text-center shadow-[4px_4px_0_0_#ff6a1a]">
        <LearnDino size={88} action="blink" className="mx-auto h-20 w-20" />
        <p className="mt-4 text-[1.35rem] font-extrabold text-[#1c2434]">
          Explorer
        </p>
        <span className="mt-2 inline-flex rounded-full bg-[#fff4e8] px-3 py-1 text-[12px] font-bold text-[#ff6a1a]">
          Class 3–5
        </span>
        <p className="mx-auto mt-3 max-w-xs text-[13px] font-medium leading-relaxed text-[#8a929c]">
          Ask a parent to edit your name and photo later.
        </p>
      </div>

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
