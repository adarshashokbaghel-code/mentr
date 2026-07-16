"use client";

import { MentrLogo } from "@/components/ui/mentr-logo";
import { Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const facultyTestimonials = [
  {
    quote:
      "Listed my slots in a few minutes. Parents message me on WhatsApp now — I keep what I earn.",
    name: "Dr. Aris Smith",
    role: "Maths & Physics · Koramangala",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "I left platforms that charged for leads. Here parents just find me and call.",
    name: "Prof. Meera Kapoor",
    role: "Career mentoring · Indiranagar",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "Dashboard is basic in a good way — open or taken. That's all I need.",
    name: "Rajesh Verma",
    role: "Coding · HSR Layout",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
  },
];

const parentTestimonials = [
  {
    quote:
      "Found a physics tutor two streets away and messaged her on WhatsApp the same evening.",
    name: "Anita Rao",
    role: "Parent · Koramangala",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "No middlemen, no lead fees baked into the rate. We talk directly and agree on everything.",
    name: "Suresh Iyer",
    role: "Parent · Indiranagar",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "The open-slots view is honest. If someone is booked, I just pick the next tutor nearby.",
    name: "Farah Khan",
    role: "Parent · HSR Layout",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
  },
];

function AuthTestimonials({
  testimonials,
}: {
  testimonials: typeof facultyTestimonials;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      5500,
    );
    return () => clearInterval(t);
  }, [testimonials.length]);

  const current = testimonials[index];

  return (
    <div className="relative z-10 w-full ">
      <div className="w-full border border-hairline rounded-lg bg-white p-5">
        <Quote className="h-5 w-5 text-coral/50" />
        <blockquote className="mt-3 text-[15px] leading-relaxed text-ink">
          &ldquo;{current.quote}&rdquo;
        </blockquote>
        <div className="mt-4 flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-cream-band">
            <Image
              src={current.image}
              alt={current.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{current.name}</p>
            <p className="text-xs text-muted">{current.role}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-5 bg-coral" : "w-1.5 bg-hairline"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function FacultyAuthShell({
  children,
  footerNote,
  variant = "faculty",
}: {
  children: React.ReactNode;
  footerNote?: React.ReactNode;
  variant?: "faculty" | "parent";
}) {
  const isParent = variant === "parent";
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="relative hidden w-[46%] flex-col overflow-hidden border-r border-hairline bg-cream-band px-10 py-10 lg:flex xl:px-12">
        <Link href="/" className="relative z-10 flex shrink-0 items-center">
          <MentrLogo className="h-6" />
        </Link>

        <div className="relative z-10 flex flex-1 flex-col justify-center gap-8 py-10">
          <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-ink xl:text-[36px] xl:leading-[1.15]">
            {isParent ? (
              <>
                Find the right teacher.{" "}
                <span className="text-coral">Contact free on WhatsApp.</span>
              </>
            ) : (
              <>
                Get listed. Get contacted.{" "}
                <span className="text-coral">Keep every rupee.</span>
              </>
            )}
          </h2>
          <AuthTestimonials
            testimonials={isParent ? parentTestimonials : facultyTestimonials}
          />
        </div>

        <p className="relative z-10 shrink-0 text-xs text-muted">
          © {new Date().getFullYear()} Mentr
        </p>
      </aside>

      <div className="relative flex flex-1 flex-col bg-white">
        <header className="flex items-center justify-between px-5 py-4 sm:px-8 lg:justify-end">
          <Link href="/" className="flex items-center lg:hidden">
            <MentrLogo className="h-6" />
          </Link>
          <Link
            href={isParent ? "/faculty" : "/parent"}
            className="text-sm text-muted hover:text-ink"
          >
            {isParent ? "Are you a tutor? List free" : "Need a teacher? Parent login"}
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-5 py-6 sm:px-8">
          <div className="w-full max-w-[380px]">{children}</div>
          {footerNote && (
            <div className="mt-6 max-w-[380px] text-center text-sm text-muted">
              {footerNote}
            </div>
          )}
        </main>

        <footer className="px-5 py-4 text-center text-xs text-muted sm:px-8 lg:text-left">
          <Link href="/" className="hover:text-ink">
            Back to home
          </Link>
        </footer>
      </div>
    </div>
  );
}
