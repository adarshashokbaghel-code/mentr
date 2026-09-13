"use client";

import { LEARN_SIGNUP_HREF } from "@/lib/learn-curriculum";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LearnDino } from "./learn-dino";
import { LearnStartButton } from "./learn-start-button";
import { LEARN_SHELL } from "./learn-shell";

const NAV_OFFSET = 64;
const SLIDES = [
  {
    id: "gamified",
    tab: "Gamified learning",
    title: "Gamified learning for Class 3–5 kids",
    body: "Mentr Learn is a free gamified learning platform for kids — not another worksheet. Class 3–5 children clear a level after each short coding lesson, earn XP, keep a daily streak, and unlock badges as they master computer science, AI, and math. Play Arena games and a Problem of the Day turn practice into a game, so they want to come back tomorrow.",
    cta: "Start free",
    href: LEARN_SIGNUP_HREF,
    image: "/learn/learn-why-play.png",
    art: "bg-[#eef4ff]",
  },
  {
    id: "videos",
    tab: "Narrated videos",
    title: "Narrated coding videos — no heavy reading",
    body: "Every computer science, AI, and math lesson is a 3–6 minute narrated video built for Class 3–5. Kids listen and watch, then try 10 practice questions. Narration matters at this age: reading fluency still varies, so a free coding platform for kids should speak the idea aloud — not hide it in a long paragraph.",
    cta: "Preview a lesson",
    href: "#curriculum",
    image: "/learn/learn-offer-video.png",
    art: "bg-[#e7f7f3]",
  },
  {
    id: "paced",
    tab: "Self-paced",
    title: "Self-paced coding at home, about 15 minutes a day",
    body: "Mentr Learn is self-paced: watch the video, practise, then one progress check — on your child’s time. No live class to catch, no homework pile. Fifteen focused minutes a day is enough to move through the 60-module syllabus. Parents who want a tutor later can still book one on Mentr; the Learn track itself stays free.",
    cta: "Start free",
    href: LEARN_SIGNUP_HREF,
    image: "/learn/learn-why-signup.png",
    art: "bg-[#fff4e8]",
  },
  {
    id: "tracks",
    tab: "CS · AI · Math",
    title: "CS, AI & Math that reinforce each other",
    body: "One free syllabus, three subjects: 20 computer science modules, 20 AI modules, and 20 math-for-CS modules. The same week might cover algorithms in CS, patterns in AI, and grids in math — so ideas stick. Built for Class 3–5 families in India and online worldwide, with CBSE-friendly pacing and IGCSE-friendly foundations.",
    cta: "See the tracks",
    href: "#tracks",
    image: "/learn/learn-why-syllabus.png",
    art: "bg-[#f3eefe]",
  },
  {
    id: "progress",
    tab: "Track progress",
    title: "Track progress with a weekly parent report",
    body: "You always know where your child stands. Mentr Learn emails a weekly parent report: modules completed, streak, XP, and what’s next in the CS, AI, and math tracks. No extra app to check. Progress is saved to the parent account, so a Class 3–5 learner can pick up the next narrated lesson on any day.",
    cta: "Start free",
    href: LEARN_SIGNUP_HREF,
    image: "/learn/learn-offer-potd.png",
    art: "bg-[#e8f8f0]",
  },
  {
    id: "certificate",
    tab: "Junior certificate",
    title: "Mentr Junior Graduate certificate — 60/60",
    body: "Finish all 60 modules across computer science, AI, and math and your child earns the Mentr Junior Graduate certificate. It is a shareable record of a completed free coding syllabus for Class 3–5 — useful for school portfolios and parent groups — not a paid badge behind a paywall.",
    cta: "See the syllabus",
    href: "#curriculum",
    image: "/learn/learn-offer-boss.png",
    art: "bg-[#fff6d9]",
  },
  {
    id: "awards",
    tab: "Awards & badges",
    title: "Awards, badges, and a safe kids leaderboard",
    body: "Kids unlock unit badges, track badges, and the 60/60 certificate as they learn to code. A cohort leaderboard shows first name and avatar only, and it is parent opt-in — off by default — so younger learners are not ranked against older active kids. Rewards stay motivating without public pressure.",
    cta: "Start free",
    href: LEARN_SIGNUP_HREF,
    image: "/learn/learn-offer-quiz.png",
    art: "bg-[#ffeef2]",
  },
] as const;

function isDesktopPin() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LearnChooseSection() {
  const n = SLIDES.length;
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const jumping = useRef(false);
  const activeRef = useRef(0);
  const targetP = useRef(0);
  const visualP = useRef(0);
  const lerpId = useRef(0);
  const [active, setActive] = useState(0);
  const [pin, setPin] = useState<"before" | "pin" | "after">("before");

  function paint(p: number) {
    const tabs = tabRefs.current;
    const first = tabs[0];
    const lineEl = lineRef.current;
    const dinoEl = dinoRef.current;
    const rail = railRef.current;
    if (!first || !lineEl || !dinoEl || !rail) return;

    const scaled = p * (n - 1);
    const i0 = Math.floor(scaled);
    const i1 = Math.min(n - 1, i0 + 1);
    const t = scaled - i0;
    const x0 = tabs[i0]?.offsetLeft ?? 0;
    const x1 = tabs[i1]?.offsetLeft ?? x0;
    const x = x0 + (x1 - x0) * t;
    const width = rail.scrollWidth || rail.clientWidth;
    const lineW = Math.max(x + 8, (width / n) * 0.55);

    lineEl.style.width = `${Math.min(width, lineW)}px`;
    dinoEl.style.transform = `translate3d(${x}px, -50%, 0) translateX(-100%)`;
  }

  function syncActive(p: number) {
    const idx = Math.min(n - 1, Math.round(p * (n - 1)));
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }

  function setProgress(p: number, instant = false) {
    const next = Math.min(1, Math.max(0, p));
    targetP.current = next;
    if (instant || prefersReducedMotion()) {
      visualP.current = next;
      paint(next);
      syncActive(next);
      return;
    }
    if (!lerpId.current) {
      const tick = () => {
        const visual = visualP.current;
        const target = targetP.current;
        const eased = visual + (target - visual) * 0.14;
        visualP.current = eased;
        paint(eased);
        syncActive(target);
        if (Math.abs(target - eased) > 0.0015) {
          lerpId.current = requestAnimationFrame(tick);
        } else {
          visualP.current = target;
          paint(target);
          lerpId.current = 0;
        }
      };
      lerpId.current = requestAnimationFrame(tick);
    }
  }

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      if (!isDesktopPin()) {
        setPin("before");
        return;
      }
      const rect = section.getBoundingClientRect();
      const view = window.innerHeight;
      if (rect.top > NAV_OFFSET) {
        setPin("before");
        if (!jumping.current) setProgress(0);
        return;
      }
      if (rect.bottom <= view) {
        setPin("after");
        if (!jumping.current) setProgress(1);
        return;
      }
      setPin("pin");
      if (jumping.current) return;
      const usable = rect.height - (view - NAV_OFFSET);
      const p = usable > 0 ? (NAV_OFFSET - rect.top) / usable : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    requestAnimationFrame(() => paint(visualP.current));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      if (lerpId.current) cancelAnimationFrame(lerpId.current);
    };
  }, [n]);

  useEffect(() => {
    const rail = railRef.current;
    const tab = tabRefs.current[active];
    if (!rail || !tab) return;
    const left = tab.offsetLeft - rail.clientWidth / 2 + tab.offsetWidth / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  function goTo(index: number) {
    setProgress(index / Math.max(1, n - 1));
    const section = sectionRef.current;
    if (!section || !isDesktopPin()) return;
    const usable = section.offsetHeight - (window.innerHeight - NAV_OFFSET);
    const top =
      window.scrollY +
      section.getBoundingClientRect().top -
      NAV_OFFSET +
      (index / Math.max(1, n - 1)) * Math.max(0, usable);
    jumping.current = true;
    window.scrollTo({ top, behavior: "smooth" });
    window.setTimeout(() => {
      jumping.current = false;
    }, 700);
  }

  const slide = SLIDES[active];

  return (
    <section
      id="why-choose"
      ref={sectionRef}
      className="learn-choose-track relative min-w-0 overflow-x-hidden bg-white"
      style={{ "--choose-slides": n } as CSSProperties}
      data-active={slide.id}
    >
      <div
        data-pin={pin}
        className={cn(
          "learn-choose-sticky flex min-w-0 flex-col justify-center overflow-x-hidden bg-white py-10 sm:py-12",
          pin === "pin" && "learn-choose-sticky-pin",
          pin === "after" && "learn-choose-sticky-after",
        )}
      >
        <div className={LEARN_SHELL}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.6rem] font-extrabold tracking-tight text-[#1c2434] sm:text-[2.15rem]">
              Why choose Mentr Learn?
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#5a6472] sm:text-[16px]">
              India&apos;s free gamified learning platform for Class 3–5 kids — narrated coding
              videos, CS, AI &amp; Math, streaks, and a weekly parent report. Load of benefits. Zero
              hassle.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <div
              ref={railRef}
              className="relative min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="relative w-max min-w-full overflow-visible pt-6 md:w-auto md:min-w-0">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-6 border-t border-dashed border-[#d8d2c8]"
                />
                <div
                  ref={lineRef}
                  aria-hidden
                  className="absolute top-6 h-[3px] w-[14%] -translate-y-1/2 rounded-full bg-[#ff6a1a] will-change-[width]"
                />
                <div
                  ref={dinoRef}
                  aria-hidden
                  className="learn-choose-dino absolute top-6 left-0 z-10 will-change-transform"
                >
                  <LearnDino size={40} action="peek" className="h-9 w-9 sm:h-10 sm:w-10" />
                </div>
                <div
                  role="tablist"
                  aria-label="Why choose Mentr Learn"
                  className="flex w-max min-w-full gap-3 pl-11 pt-10 sm:w-auto sm:gap-0 sm:pl-12"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      goTo(Math.min(n - 1, active + 1));
                    } else if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      goTo(Math.max(0, active - 1));
                    } else if (e.key === "Home") {
                      e.preventDefault();
                      goTo(0);
                    } else if (e.key === "End") {
                      e.preventDefault();
                      goTo(n - 1);
                    }
                  }}
                >
                  {SLIDES.map((item, i) => {
                    const selected = i === active;
                    return (
                      <button
                        key={item.id}
                        ref={(el) => {
                          tabRefs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`learn-choose-tab-${item.id}`}
                        aria-selected={selected}
                        aria-controls="learn-choose-panel"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => goTo(i)}
                        className={cn(
                          "w-[7.25rem] shrink-0 px-1.5 text-left text-[12px] font-bold leading-snug transition-colors duration-300 sm:w-auto sm:min-w-0 sm:flex-1 sm:px-2 sm:text-[13px] lg:text-[14px]",
                          selected ? "text-[#1c2434]" : "text-[#b0b6be] hover:text-[#7b8490]",
                        )}
                      >
                        {item.tab}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div
            id="learn-choose-panel"
            role="tabpanel"
            aria-labelledby={`learn-choose-tab-${slide.id}`}
            className="mt-8 grid items-center gap-6 sm:mt-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12"
          >
            <div key={slide.id} className="learn-choose-copy">
              <h3 className="text-[1.35rem] font-extrabold tracking-tight text-[#1c2434] sm:text-[1.75rem]">
                {slide.title}
              </h3>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[#5a6472] sm:text-[16px]">
                {slide.body}
              </p>
              <LearnStartButton href={slide.href} className="mt-5">
                {slide.cta === "Start free" ? "Get started for free" : slide.cta}
              </LearnStartButton>
            </div>

            <div
              key={`${slide.id}-art`}
              className={cn(
                "learn-choose-art relative overflow-hidden rounded-[28px] sm:rounded-[32px]",
                slide.art,
              )}
            >
              <div className="relative aspect-[16/10] w-full sm:aspect-[5/3]">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="(min-width: 1024px) 640px, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
