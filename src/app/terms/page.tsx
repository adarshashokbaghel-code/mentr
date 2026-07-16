import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The rules of using Mentr — free tutor discovery and connections worldwide, with no platform fees and no commission.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "What Mentr is",
    body: [
      "Mentr is a free connector between parents and independent tutors/mentors. We verify tutor identity, host profiles, and deliver connection requests.",
      "We are not a party to any tutoring arrangement. Timing, fees, location, and quality of sessions are agreed between the parent and the tutor directly.",
    ],
  },
  {
    title: "Accounts",
    body: [
      "One account per person, tied to a verified email. An email used for a parent account can't be reused for a faculty account, and vice versa.",
      "You're responsible for activity on your account. Keep your login access to yourself.",
    ],
  },
  {
    title: "Free, with fair-use limits",
    body: [
      "Listing, search, and connections are free — no platform fee, no commission, no lead charges.",
      "To keep the platform useful, we apply fair-use limits (for example, a daily cap on pitches from the requirements board). Attempting to bypass these limits may lead to suspension.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "Provide accurate profile information. Misrepresenting qualifications or identity is grounds for removal.",
      "Use contact details only for arranging tutoring. No spam, marketing, or harassment.",
      "Don't scrape, resell, or republish profiles or contact information from the platform.",
    ],
  },
  {
    title: "Verification & safety",
    body: [
      "The Verified badge means we checked the tutor's phone and identity at onboarding. It is not a guarantee of teaching quality or an endorsement.",
      "Meet first sessions in public or supervised settings where possible, and report any concern to safety@mentr.in.",
    ],
  },
  {
    title: "Liability",
    body: [
      "Mentr provides the platform \"as is\". We're not liable for disputes, payments, or outcomes between parents and tutors.",
      "We may suspend accounts that violate these terms, and we may update the terms with notice on this page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Terms of service
          </h1>
          <p className="mt-3 text-sm font-semibold text-muted">
            Last updated: July 2026
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Short version: Mentr connects you, everything else is between you
            two, and abusing the platform gets you removed. The details:
          </p>

          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-lg font-bold text-ink">{s.title}</h2>
                <ul className="mt-3 space-y-2.5">
                  {s.body.map((line) => (
                    <li
                      key={line}
                      className="flex gap-2.5 text-[15px] leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
