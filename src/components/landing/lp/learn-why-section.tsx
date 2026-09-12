"use client";

import { LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
import { LEARN_SHELL } from "./learn-shell";
import { LearnDino } from "./learn-dino";
import { LearnStartButton } from "./learn-start-button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const OFFERS = [
  {
    id: "videos",
    title: "Short videos",
    tag: "3–6 min",
    body: "Kids watch a narrated lesson. No heavy reading — just listen and learn.",
    href: "#curriculum",
    cta: "Preview a video",
    image: "/learn/learn-offer-video.png",
  },
  {
    id: "quizzes",
    title: "Practice + check",
    tag: "10 + 1",
    body: "Ten practice questions on the idea, then one progress-check that marks the lesson done.",
    href: "#curriculum",
    cta: "Try a sample quiz",
    image: "/learn/learn-offer-quiz.png",
  },
  {
    id: "play",
    title: "Play Arena",
    tag: "Games",
    body: "A small game to practise the same idea — drag, match, or build.",
    href: LEARN_SIGNUP_HREF,
    cta: "See how play works",
    image: "/learn/learn-offer-play.png",
  },
  {
    id: "potd",
    title: "Daily puzzle",
    tag: "POTD",
    body: "One new Problem of the Day. Finish it to keep the streak and earn XP.",
    href: LEARN_SIGNUP_HREF,
    cta: "Know more",
    image: "/learn/learn-offer-potd.png",
  },
  {
    id: "boss",
    title: "Boss challenge",
    tag: "Every 5 lessons",
    body: "A bigger game after five modules — like Build-a-Computer — then a badge.",
    href: "#curriculum",
    cta: "See the syllabus",
    image: "/learn/learn-offer-boss.png",
  },
] as const;

export function LearnWhySection() {
  const scroller = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 16 : 280;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section className="bg-[#fffdf8] py-10 sm:py-16 lg:py-20">
      <div className={LEARN_SHELL}>
        <div className="mx-auto max-w-2xl text-center">
          <LearnDino size={56} className="mx-auto h-12 w-12 sm:h-14 sm:w-14" />
          <h2 className="mt-3 text-[1.5rem] font-extrabold tracking-tight text-[#1c2434] sm:text-[2.1rem]">
            What kids do each day
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#5a6472] sm:text-[16px]">
            Watch a video, try 10 practice questions, then one progress check. About 15 minutes. Parents get the streak by email.
          </p>
        </div>

        <div
          ref={scroller}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {OFFERS.map((card) => (
            <article
              key={card.id}
              className="w-[min(100%,300px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#f6f4f0] sm:w-[300px] lg:w-[calc((100%-4rem)/3)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#efe6d8]">
                <Image src={card.image} alt="" fill className="object-cover" sizes="320px" />
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[1.15rem] font-extrabold leading-tight text-[#1c2434]">{card.title}</h3>
                  <span className="shrink-0 pt-0.5 text-[11px] font-semibold text-[#8a929c]">{card.tag}</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a6472] sm:text-[14px]">{card.body}</p>
                <Link
                  href={card.href}
                  className="mt-4 flex h-11 items-center justify-center gap-2 rounded-md bg-[#1c2434] text-[13px] font-bold text-white hover:bg-[#2a3344]"
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollByCard(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#1c2434] ring-1 ring-[#efe6d8]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByCard(1)}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#1c2434] ring-1 ring-[#efe6d8]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <LearnStartButton href={LEARN_SIGNUP_HREF}>
            Get started for free
          </LearnStartButton>
        </div>
      </div>
    </section>
  );
}
