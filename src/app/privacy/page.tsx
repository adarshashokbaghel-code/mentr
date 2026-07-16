import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Mentr collects, uses, and protects your data — including why phone numbers stay hidden until a connection request is accepted.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "What we collect",
    body: [
      "Account basics: your name, email address, and role (parent or faculty). Email is verified with a one-time code at signup.",
      "Profile details you choose to add: for tutors — subjects, experience, qualifications, availability, area, and WhatsApp number; for parents — your name, area, and WhatsApp number.",
      "Activity on the platform: connection requests, pitches on the requirements board, and profile views, which power your dashboard stats.",
    ],
  },
  {
    title: "How phone numbers are protected",
    body: [
      "Phone numbers are never shown publicly. A tutor's WhatsApp number is revealed only to a parent whose connection request that tutor has accepted.",
      "On the requirements board, parents stay anonymous to tutors. If a parent accepts a tutor's pitch, contact details unlock for both sides — acceptance is the consent.",
      "Declining a request reveals nothing to either side.",
    ],
  },
  {
    title: "How we use your data",
    body: [
      "To run the service: showing verified tutor profiles in search, delivering connection requests, and keeping your dashboard accurate.",
      "To keep the platform safe: verification checks, spam limits (like the daily pitch quota), and abuse investigation.",
      "We do not sell your data, and we do not share it with advertisers. Mentr charges no fees, and your data is not the price either.",
    ],
  },
  {
    title: "Cookies & sessions",
    body: [
      "We use a session cookie to keep you signed in. We don't use third-party advertising or tracking cookies.",
    ],
  },
  {
    title: "Your controls",
    body: [
      "You can edit your profile details at any time from your dashboard.",
      "To delete your account and its data, email hello@mentr.in from your registered address and we'll process it within 7 days.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "If we make material changes, we'll note them here with an updated date. Continued use after a change means you accept the updated policy.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Privacy policy
          </h1>
          <p className="mt-3 text-sm font-semibold text-muted">
            Last updated: July 2026
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Mentr exists to connect parents with tutors — not to harvest data.
            This page explains, in plain words, what we collect and how we use
            it.
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
