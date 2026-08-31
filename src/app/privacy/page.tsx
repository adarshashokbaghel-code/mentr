import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { ADSENSE_CLIENT_ID } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Mentr collects, uses, and protects your data — including cookies, Google Analytics, and Google AdSense on public pages.",
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
      "We do not sell your personal profile data to data brokers. Mentr charges no platform fees — monetisation on public pages is through advertising, described below.",
    ],
  },
  {
    title: "Cookies & sessions",
    body: [
      "We use a session cookie to keep you signed in when you log in to your account.",
      "We use Google Analytics (gtag.js) on public pages to understand traffic and improve the site. Analytics may set cookies such as _ga.",
      "We use Google AdSense on public marketing and guide pages to show ads. Google and its partners may use cookies to serve and measure ads, including personalised ads where applicable.",
      "You can manage or disable ad personalisation in Google's Ad Settings. You can also use your browser settings to block or delete cookies.",
    ],
  },
  {
    title: "Your controls",
    body: [
      "You can edit your profile details at any time from your dashboard.",
      "To delete your account and its data, email hello@mentr.in from your registered address and we'll process it within 7 days.",
      "When you first visit, we show a cookie notice on public pages. Dismissing it stores your preference in local storage on your device.",
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
            Last updated: August 2026
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Mentr exists to connect parents with tutors — not to harvest data.
            This page explains, in plain words, what we collect, how we use
            cookies and advertising on public pages, and how you stay in
            control.
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

            <section>
              <h2 className="text-lg font-bold text-ink">
                Advertising & third-party services
              </h2>
              <ul className="mt-3 space-y-2.5">
                <li className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                  />
                  Public pages (home, blog, guides, FAQ, and similar) may show
                  ads served by Google AdSense (publisher ID {ADSENSE_CLIENT_ID}
                  ).
                </li>
                <li className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                  />
                  Google may collect device and usage data for ad delivery and
                  measurement. See{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    Google&apos;s Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    How Google uses data in advertising
                  </a>
                  .
                </li>
                <li className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                  />
                  Manage personalised ads at{" "}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    Google Ad Settings
                  </a>
                  . EU/UK users can also visit{" "}
                  <a
                    href="https://www.youronlinechoices.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    Your Online Choices
                  </a>
                  .
                </li>
                <li className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                  />
                  Logged-in dashboard and account pages are not monetised with
                  third-party ads. Our ads.txt file at{" "}
                  <Link
                    href="/ads.txt"
                    className="font-semibold text-coral underline-offset-2 hover:underline"
                  >
                    mentr.in/ads.txt
                  </Link>{" "}
                  lists authorised ad sellers for this site.
                </li>
              </ul>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
