"use client";

import { LearnDino } from "@/components/landing/lp/learn-dino";
import {
  SAMPLE_MODULE,
  SAMPLE_MODULE_ID,
  getModuleById,
} from "@/lib/learn-curriculum";
import { ArrowRight, Play, Lock } from "lucide-react";
import Link from "next/link";

const UP_NEXT = ["A2", "A3", "A4"] as const;

export function LmsHome() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <LearnDino size={56} action="wave" className="h-14 w-14 shrink-0" />
        <div>
          <p className="text-[14px] font-bold text-[#ff6a1a]">Hi explorer!</p>
          <h1 className="mt-0.5 text-[1.65rem] font-extrabold leading-tight tracking-tight text-[#1c2434] sm:text-[1.85rem]">
            Ready for today?
          </h1>
        </div>
      </div>

      <Link
        href={`/learn/app/lesson/${SAMPLE_MODULE_ID}`}
        className="group relative block overflow-hidden rounded-3xl border-2 border-[#1c2434] bg-[#1c2434] p-5 text-white shadow-[4px_4px_0_0_#ff6a1a] transition hover:-translate-y-0.5 sm:p-6"
      >
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#ffb27a]">
          Continue · Module {SAMPLE_MODULE_ID}
        </p>
        <p className="mt-2 text-[1.35rem] font-extrabold leading-snug sm:text-[1.5rem]">
          {SAMPLE_MODULE.title}
        </p>
        <p className="mt-2 max-w-md text-[14px] font-medium text-white/65">
          {SAMPLE_MODULE.concept}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#ff6a1a] px-4 py-2.5 text-[15px] font-extrabold text-white">
          <Play className="h-4 w-4 fill-current" />
          Start lesson
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </Link>

      <section>
        <h2 className="text-[16px] font-extrabold text-[#1c2434]">Up next</h2>
        <ul className="mt-3 space-y-2">
          {UP_NEXT.map((id) => {
            const mod = getModuleById(id);
            if (!mod) return null;
            return (
              <li
                key={id}
                className="flex items-center gap-3 rounded-2xl border border-[#e8e2d8] bg-white px-4 py-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f0ea] text-[#8a929c]">
                  <Lock className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-[#8a929c]">{id}</p>
                  <p className="truncate text-[14px] font-bold text-[#1c2434]">
                    {mod.title}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <Link
        href="/learn/app/path"
        className="inline-flex items-center gap-1 text-[14px] font-bold text-[#ff6a1a] hover:underline"
      >
        See full path
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
