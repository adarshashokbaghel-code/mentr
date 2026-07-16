"use client";

import {
  FACULTY_AUTH_TESTIMONIALS,
  PARENT_AUTH_TESTIMONIALS,
  testimonialName,
} from "@/lib/demo-users";
import { MentrBrand } from "@/components/ui/mentr-brand";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import { TestimonialAvatar } from "@/components/ui/testimonial-avatar";
import { Quote } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function AuthTestimonials({
  testimonials,
}: {
  testimonials: typeof FACULTY_AUTH_TESTIMONIALS;
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
          <TestimonialAvatar
            name={current.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-ink">
              {testimonialName(current.name)}
            </p>
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
        <MentrBrand href="/" logoClassName="h-6" className="relative z-10 shrink-0" />

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
            testimonials={isParent ? PARENT_AUTH_TESTIMONIALS : FACULTY_AUTH_TESTIMONIALS}
          />
        </div>

        <p className="relative z-10 shrink-0 text-xs text-muted">
          © {new Date().getFullYear()} <PaprlyWordmark />
        </p>
      </aside>

      <div className="relative flex flex-1 flex-col bg-white">
        <header className="flex items-center justify-between px-5 py-4 sm:px-8 lg:justify-end">
          <MentrBrand href="/" logoClassName="h-6" className="lg:hidden" />
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
