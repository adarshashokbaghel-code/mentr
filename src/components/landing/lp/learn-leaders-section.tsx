"use client";

import {
  ELON_PHYSICS_QUOTE,
  LEADER_FACTS,
  LEADER_THREAD_IMAGE,
  PAVEL_CS_FOLLOWUP,
  PAVEL_MATH_QUOTE,
  SUPPORT_QUOTES,
} from "@/lib/learn-leader-proof";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { LearnDino } from "./learn-dino";
import { LEARN_SHELL } from "./learn-shell";

export function LearnLeadersSection() {
  const factLoop = [...LEADER_FACTS, ...LEADER_FACTS];

  return (
    <section className="bg-[#fffdf8] py-10 sm:py-16 lg:py-20">
      <div className={LEARN_SHELL}>
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-3.5 sm:text-left">
          <LearnDino size={56} action="handshake" className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
          <h2 className="min-w-0 text-balance text-[1.35rem] font-extrabold tracking-tight text-[#1c2434] sm:text-[2.1rem]">
            They told students to learn this.{" "}
            <span className="text-[#ff6a1a]">We start it in Class 3–5.</span>
          </h2>
        </div>

        <div className="mt-8 grid items-start gap-6 md:grid-cols-[260px_minmax(0,1fr)] lg:mt-10 lg:gap-8">
          <a
            href={PAVEL_MATH_QUOTE.sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto block w-full max-w-[260px] overflow-hidden rounded-lg bg-[#0b0f14] md:mx-0 md:max-w-none"
          >
            <Image
              src={LEADER_THREAD_IMAGE}
              alt="Pavel Durov and Elon Musk posts on math and physics, 11 Jul 2025."
              width={387}
              height={516}
              className="h-auto w-full object-contain"
            />
          </a>

          <div className="rounded-lg border border-[#efe6d8] bg-white p-5 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3">
              <Image
                src={PAVEL_CS_FOLLOWUP.image}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-[16px] font-extrabold text-[#1c2434]">{PAVEL_CS_FOLLOWUP.name}</p>
                <p className="text-[13px] text-[#8a929c]">{PAVEL_CS_FOLLOWUP.handle} · 11 Jul 2025</p>
              </div>
            </div>
            <p className="mt-4 text-[16px] leading-relaxed text-[#1c2434] sm:text-[17px]">
              “{PAVEL_CS_FOLLOWUP.quote}”
            </p>
            <a
              href={PAVEL_CS_FOLLOWUP.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-0.5 text-[13px] font-bold text-[#ff6a1a] hover:underline"
            >
              {PAVEL_CS_FOLLOWUP.sourceLabel}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#f0ebe3] pt-6">
              <Image
                src={ELON_PHYSICS_QUOTE.image}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
              <p className="min-w-0 flex-1 text-[16px] font-bold leading-relaxed text-[#1c2434]">
                {ELON_PHYSICS_QUOTE.name}: “{ELON_PHYSICS_QUOTE.quote}”
              </p>
              <a
                href={ELON_PHYSICS_QUOTE.sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[13px] font-bold text-[#ff6a1a] hover:underline"
              >
                {ELON_PHYSICS_QUOTE.sourceLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-8 lg:gap-6">
          {SUPPORT_QUOTES.map((q) => (
            <a
              key={q.id}
              href={q.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#efe6d8] bg-white p-5 hover:border-[#ff6a1a]/40 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <Image
                  src={q.image}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <p className="text-[15px] font-extrabold text-[#1c2434]">{q.name}</p>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5a6472]">“{q.quote}”</p>
              <p className="mt-3 text-[12px] font-bold text-[#ff6a1a]">{q.sourceLabel}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden border-y border-[#efe6d8] bg-white lg:mt-10" aria-label="Sourced facts">
        <div className="learn-facts-track flex w-max">
          {factLoop.map((f, i) => (
            <a
              key={`${f.id}-${i}`}
              href={f.sourceHref}
              target={f.sourceHref.startsWith("#") ? undefined : "_blank"}
              rel={f.sourceHref.startsWith("#") ? undefined : "noopener noreferrer"}
              className="flex w-[220px] shrink-0 items-center gap-3 border-r border-[#efe6d8] px-4 py-4 sm:w-[240px] sm:py-5"
            >
              <p className="text-[1.25rem] font-extrabold text-[#ff6a1a]">{f.value}</p>
              <p className="text-[12px] font-semibold leading-snug text-[#1c2434]">{f.label}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
