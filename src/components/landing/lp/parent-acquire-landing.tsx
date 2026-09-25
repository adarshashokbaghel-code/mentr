"use client";

/**
 * Parent-only acquisition landing — simple, no Premium.
 * Used by /parents, /find-tutor, /instant-connect.
 */

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import {
  getParentNeed,
  parentNeedSearchHref,
  PARENT_NEED_CITIES,
  PARENT_NEED_LEVELS,
  PARENT_NEED_SUBJECTS,
  saveParentNeed,
  type ParentNeed,
} from "@/lib/parent-need";
import { SITE_BRAND } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  MapPin,
  Search,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type ParentAcquireIntent = "default" | "browse" | "instant";

const INSTANT_HREF =
  "/parent/signup?next=/parent/dashboard%23instant-connect";

const POPULAR_LINKS = [
  { label: "Tutors in Bengaluru", href: "/tutors/bengaluru" },
  { label: "Maths tutors", href: "/tutors/bengaluru/maths" },
  { label: "Physics tutors", href: "/tutors/bengaluru/physics" },
  { label: "Chemistry tutors", href: "/tutors/bengaluru/chemistry" },
  { label: "English tutors", href: "/tutors/bengaluru/english" },
  { label: "Coding tutors", href: "/tutors/bengaluru/coding" },
  { label: "Hyderabad tutors", href: "/tutors/hyderabad" },
  { label: "Delhi tutors", href: "/tutors/delhi" },
  { label: "Mumbai tutors", href: "/tutors/mumbai" },
] as const;

const field =
  "h-12 w-full min-w-0 rounded-lg border border-ink/15 bg-white px-3.5 text-sm font-medium text-ink outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20";

function ParentNeedForm({
  emphasize,
}: {
  emphasize: "browse" | "instant" | "balanced";
}) {
  const [need, setNeed] = useState<ParentNeed>({
    subject: "Mathematics",
    level: "Class 9–10",
    city: "Bengaluru",
    mode: "home",
  });

  useEffect(() => {
    const stored = getParentNeed();
    if (stored) setNeed(stored);
  }, []);

  useEffect(() => {
    saveParentNeed(need);
  }, [need]);

  const searchHref = parentNeedSearchHref(need);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block min-w-0">
          <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <BookOpen className="h-3 w-3 text-coral" />
            Subject
          </span>
          <select
            className={field}
            value={need.subject}
            onChange={(e) =>
              setNeed((n) => ({ ...n, subject: e.target.value }))
            }
          >
            {PARENT_NEED_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">
            Class
          </span>
          <select
            className={field}
            value={need.level}
            onChange={(e) => setNeed((n) => ({ ...n, level: e.target.value }))}
          >
            {PARENT_NEED_LEVELS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <MapPin className="h-3 w-3 text-coral" />
            Location
          </span>
          <select
            className={field}
            value={need.city}
            onChange={(e) => setNeed((n) => ({ ...n, city: e.target.value }))}
          >
            {PARENT_NEED_CITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="block min-w-0">
          <legend className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">
            Preferred mode
          </legend>
          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                ["home", "At home"],
                ["online", "Online"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setNeed((n) => ({ ...n, mode: value }))}
                className={cn(
                  "h-12 min-w-0 rounded-lg border text-sm font-bold transition",
                  need.mode === value
                    ? "border-ink bg-ink text-white"
                    : "border-ink/15 bg-white text-muted hover:border-ink/30",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <Link
          href={searchHref}
          className={cn(
            "block w-full sm:w-auto",
            emphasize === "instant" && "sm:order-2",
          )}
        >
          <Button
            size="lg"
            variant={emphasize === "instant" ? "secondary" : "primary"}
            className={cn(
              "h-12 w-full gap-2 px-6 text-[15px] font-bold sm:w-auto",
              emphasize !== "instant" &&
                "shadow-[3px_3px_0_0_#1a231c]",
            )}
          >
            <Search className="h-4 w-4" />
            Find a Tutor
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          href={INSTANT_HREF}
          className={cn(
            "block w-full sm:w-auto",
            emphasize === "instant" && "sm:order-1",
          )}
        >
          <Button
            size="lg"
            variant={emphasize === "instant" ? "primary" : "secondary"}
            className={cn(
              "h-12 w-full gap-2 border-2 border-ink px-6 text-[15px] font-bold sm:w-auto",
              emphasize === "instant" &&
                "border-0 shadow-[3px_3px_0_0_#1a231c]",
            )}
          >
            <Zap className="h-4 w-4" />
            Get Matched Instantly
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function ParentAcquireLanding({
  intent = "default",
}: {
  intent?: ParentAcquireIntent;
}) {
  const formEmphasize =
    intent === "instant"
      ? "instant"
      : intent === "browse"
        ? "browse"
        : "balanced";

  const headline =
    intent === "instant"
      ? "Get matched with a verified tutor"
      : "Find a verified tutor";

  const sub =
    intent === "instant"
      ? "Tell us what you need — we'll match you with relevant mentors fast."
      : "Free for parents. No commission. No agency fee.";

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-clip bg-cream">
        {/* Hero — one composition, full-bleed visual */}
        <section className="relative isolate min-h-[min(92dvh,780px)] overflow-hidden border-b border-hairline">
          <Image
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[#fffaf5]/97 via-[#fffaf5]/88 to-[#fffaf5]/55 sm:to-[#fffaf5]/40"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-[#fffaf5]/50"
          />

          <div className="relative mx-auto flex min-h-[min(92dvh,780px)] max-w-[1200px] flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              <p className="text-base font-bold tracking-tight text-ink sm:text-lg">
                {SITE_BRAND}
              </p>
              <h1 className="mt-3 max-w-[14ch] text-[2.5rem] font-bold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
                {headline}
              </h1>
              <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-ink/75 sm:text-lg">
                {sub}
              </p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="#tell-us"
                  className={cn(intent === "instant" && "sm:order-2")}
                >
                  <Button
                    size="lg"
                    variant={intent === "instant" ? "secondary" : "primary"}
                    className={cn(
                      "h-12 w-full gap-2 px-7 text-[15px] font-bold sm:w-auto",
                      intent !== "instant" &&
                        "shadow-[4px_4px_0_0_#1a231c]",
                    )}
                  >
                    <Search className="h-4 w-4" />
                    Find a Tutor
                  </Button>
                </Link>
                <Link
                  href={INSTANT_HREF}
                  className={cn(intent === "instant" && "sm:order-1")}
                >
                  <Button
                    size="lg"
                    variant={intent === "instant" ? "primary" : "secondary"}
                    className={cn(
                      "h-12 w-full gap-2 border-2 border-ink bg-white/90 px-7 text-[15px] font-bold backdrop-blur-sm sm:w-auto",
                      intent === "instant" &&
                        "border-0 bg-coral shadow-[4px_4px_0_0_#1a231c]",
                    )}
                  >
                    <Zap className="h-4 w-4" />
                    Get Matched Instantly
                  </Button>
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink/80">
                {[
                  "Verified tutors",
                  "₹0 for parents",
                  "Direct WhatsApp on accept",
                ].map((item) => (
                  <li key={item} className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-sage" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Need form */}
        <section
          id="tell-us"
          className="scroll-mt-20 border-b border-hairline bg-white"
        >
          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
            <h2 className="max-w-[28ch] text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Tell us the subject, class, location and preferred mode
            </h2>
            <p className="mt-2 max-w-[48ch] text-base leading-relaxed text-muted">
              We&apos;ll help you find relevant mentors — browse matches, or get
              matched instantly if you&apos;re in a hurry.
            </p>
            <div className="mt-8">
              <ParentNeedForm emphasize={formEmphasize} />
            </div>
          </div>
        </section>

        {/* How it works — one job */}
        <section className="border-b border-hairline bg-cream-band/60">
          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              How it works
            </h2>
            <p className="mt-2 max-w-[40ch] text-base text-muted">
              Three steps. No agency in the middle.
            </p>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                {
                  n: "1",
                  t: "Tell us what you need",
                  d: "Subject, class, location, and home or online.",
                },
                {
                  n: "2",
                  t: "See verified tutors",
                  d: "Browse profiles — or get matched instantly when you're short on time.",
                },
                {
                  n: "3",
                  t: "Connect on WhatsApp",
                  d: "After the tutor accepts, WhatsApp unlocks. Fees stay between you.",
                },
              ].map((step) => (
                <li key={step.n} className="min-w-0">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">
                    {step.n}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-ink">{step.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {step.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Popular searches */}
        <section className="border-b border-hairline bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Popular searches
            </h2>
            <p className="mt-2 text-base text-muted">
              Start with a city or subject — free for parents.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {POPULAR_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex h-10 items-center rounded-lg border border-ink/12 bg-cream px-4 text-sm font-semibold text-ink transition hover:border-coral hover:bg-coral-wash"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-ink text-white">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-14 lg:px-8">
            <div>
              <p className="text-sm font-bold text-coral">{SITE_BRAND}</p>
              <h2 className="mt-2 max-w-[20ch] text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to find a tutor?
              </h2>
              <p className="mt-2 text-sm text-white/65 sm:text-base">
                Free for parents. No commission. No agency fee.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link href="/search">
                <Button
                  size="lg"
                  className="h-12 w-full gap-2 bg-coral px-6 font-bold text-ink hover:bg-coral-dark sm:w-auto"
                >
                  Find a Tutor
                </Button>
              </Link>
              <Link href={INSTANT_HREF}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 w-full gap-2 border-white/25 bg-transparent px-6 font-bold text-white hover:bg-white/10 sm:w-auto"
                >
                  Get Matched Instantly
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
