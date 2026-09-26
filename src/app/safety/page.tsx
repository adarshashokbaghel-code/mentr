import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import {
  PARENT_COMPANY_NAME,
  PUBLISHER_LOCATION,
  PUBLISHER_SAFETY_EMAIL,
  PUBLISHER_SUPPORT_EMAIL,
  SITE_BRAND,
} from "@/lib/seo";
import { LEARN_PUBLIC } from "@/lib/learn-flags";
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ShieldCheck, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety & trust — verification, reporting, child safety",
  description:
    "How Mentr verifies tutors, keeps contacts private until both sides accept, and handles safety reports. Child learning products are parent-enrolled with no ads on Learn.",
  alternates: { canonical: "/safety" },
};

export default function SafetyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-hairline bg-white">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
              Trust &amp; safety
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Safety on Mentr
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted">
              {SITE_BRAND} is built for parents, guardians, adult students, and
              tutors. We verify faculty before profiles go live, keep phone
              numbers private until both sides accept a connect, and take
              reports seriously. This page summarises how safety works.
            </p>
          </div>
        </section>

        <section className="border-b border-hairline bg-cream py-10 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-wash text-sage">
                <UserCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-ink">Tutor verification</h2>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  Faculty profiles are reviewed before going live. Live listings
                  show a Verified badge after identity checks. Verification
                  reduces anonymous spam; it does not guarantee teaching quality.
                  Always run a trial session and trust your judgement. Read{" "}
                  <Link
                    href="/blog/how-mentr-verifies-tutors"
                    className="font-semibold text-coral hover:underline"
                  >
                    how verification works
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-wash text-sage">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-ink">
                  Contact privacy
                </h2>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  WhatsApp numbers stay hidden until a tutor accepts a parent
                  request (or a parent accepts a pitch). That consent step cuts
                  spam without charging either side for unlocks.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral-wash text-coral-dark">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-ink">Report a problem</h2>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  Something wrong with a profile, message, or behaviour? Email{" "}
                  <a
                    href={`mailto:${PUBLISHER_SAFETY_EMAIL}`}
                    className="font-semibold text-coral hover:underline"
                  >
                    {PUBLISHER_SAFETY_EMAIL}
                  </a>{" "}
                  with the URL or name involved. We aim to review within one
                  working day and may suspend accounts while investigating.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-hairline bg-white py-10 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-xl font-bold text-ink">
              Children &amp; learning products
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Accounts on Mentr are for adults. If you enroll a child in{" "}
              {LEARN_PUBLIC ? (
                <Link href="/learn" className="font-semibold text-coral hover:underline">
                  Mentr Learn
                </Link>
              ) : (
                "Mentr Learn"
              )}
              , you use a parent email and supervise their use. We do not show
              Google AdSense or other third-party display ads on Learn pages.
              See our{" "}
              <Link href="/privacy" className="font-semibold text-coral hover:underline">
                Privacy policy
              </Link>{" "}
              for children under 13.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Meeting tips: prefer public or supervised first sessions for
              younger students; keep early online sessions with a parent nearby;
              never pay large advances to unverified contacts outside Mentr.
            </p>
          </div>
        </section>

        <section className="bg-cream py-10 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-xl font-bold text-ink">Publisher</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {SITE_BRAND} is operated by {PARENT_COMPANY_NAME},{" "}
              {PUBLISHER_LOCATION}. General support:{" "}
              <a
                href={`mailto:${PUBLISHER_SUPPORT_EMAIL}`}
                className="font-semibold text-coral hover:underline"
              >
                {PUBLISHER_SUPPORT_EMAIL}
              </a>
              . More options on{" "}
              <Link href="/contact" className="font-semibold text-coral hover:underline">
                Contact
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
