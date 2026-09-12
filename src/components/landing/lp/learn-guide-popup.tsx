"use client";

import { LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
import { Mail, Trophy, Video, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LearnDino } from "./learn-dino";
import { LearnStartButton } from "./learn-start-button";

const POINTS = [
  { icon: Video, text: "60 modules · CS, AI & Math" },
  { icon: Trophy, text: "Watch → Quiz → Play → Boss" },
  { icon: Mail, text: "Weekly email for parents" },
] as const;

export function LearnGuidePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[260] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="learn-guide-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#1c2434]/40 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={() => setOpen(false)}
      />
      <div className="relative max-h-[min(86dvh,36rem)] w-full min-w-0 max-w-lg overflow-y-auto overflow-x-hidden rounded-2xl border border-[#efe6d8] bg-[#fffdf8] p-4 shadow-[0_20px_48px_rgba(28,36,52,0.18)] sm:p-6">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 rounded-md p-1.5 text-[#8a929c] hover:bg-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <LearnDino size={64} className="h-12 w-12 shrink-0 sm:h-16 sm:w-16" />
          <div className="min-w-0 flex-1 pr-7">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#ff6a1a]">Mentr Learn</p>
            <h2 id="learn-guide-title" className="mt-0.5 text-[1.1rem] font-extrabold leading-snug tracking-tight text-[#1c2434] sm:text-[1.25rem]">
              CS, AI &amp; Math — free for Class 3–5
            </h2>
          </div>
        </div>

        <p className="mt-3 text-[14px] leading-relaxed text-[#5a6472]">
          Kids watch a short narrated video, take a quiz, then play. About 15 minutes. You get a weekly email on
          modules, streak, and what’s next.
        </p>

        <ul className="mt-4 space-y-2">
          {POINTS.map((item) => (
            <li
              key={item.text}
              className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#efe6d8] bg-white px-3 py-2 text-[13px] font-semibold leading-snug text-[#1c2434]"
            >
              <item.icon className="h-4 w-4 shrink-0 text-[#ff6a1a]" strokeWidth={2.25} />
              <span className="min-w-0 break-words">{item.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <LearnStartButton
            href={LEARN_SIGNUP_HREF}
            onClick={() => setOpen(false)}
            className="w-full justify-center"
          >
            Get started for free
          </LearnStartButton>
        </div>
      </div>
    </div>
  );
}
