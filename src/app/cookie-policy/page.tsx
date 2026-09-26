import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie policy — Mentr by Paprly",
  description:
    "How Mentr uses cookies and similar technologies for sessions, analytics, and advertising on public pages.",
  alternates: { canonical: "/cookie-policy" },
};

const sections = [
  {
    title: "What are cookies?",
    body: [
      "Cookies are small text files stored on your device when you visit a website. Similar technologies include local storage and pixels used by analytics or advertising partners.",
      `${SITE_BRAND} uses these only where needed to run accounts, understand public-page traffic, and (on public pages) show ads.`,
    ],
  },
  {
    title: "Essential / session cookies",
    body: [
      "When you log in, we use a session cookie so you stay signed in while using parent or faculty dashboards.",
      "These cookies are required for the logged-in product to work. If you block them, you will not be able to stay signed in.",
    ],
  },
  {
    title: "Analytics",
    body: [
      "On public adult/parent marketing and guide pages we use Google Analytics (gtag.js) to understand which guides and tools people use. Analytics may set cookies such as _ga.",
      "We do not load Google Analytics on Mentr Learn (/learn) or inside the Learn app.",
      "We use this data in aggregate to improve the site. We do not sell personal profile data from analytics to data brokers.",
    ],
  },
  {
    title: "Advertising cookies",
    body: [
      "Public marketing, tool, and guide pages aimed at parents and tutors may show Google AdSense ads. Google and its partners may use cookies to serve and measure ads, including personalised ads where applicable.",
      "We do not load AdSense on Mentr Learn (/learn), the Learn app, or logged-in dashboards and private account areas.",
      "You can manage ad personalisation in Google’s Ad Settings (https://adssettings.google.com/). You can also block or delete cookies in your browser settings.",
    ],
  },
  {
    title: "Cookie notice",
    body: [
      "On first visit to public pages we may show a short cookie notice. Dismissing it stores your preference in local storage on your device so we do not repeat the same banner every page load.",
      "For a full description of personal data we collect (accounts, profiles, connect requests), see our Privacy Policy.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "Browser settings: block or delete cookies at any time. Note that essential cookies are needed for login.",
      "Google Ad Settings: control personalised ads from Google.",
      "Privacy requests: email hello@mentr.in from your registered address for access or deletion requests related to your account.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Cookie policy
          </h1>
          <p className="mt-3 text-sm font-semibold text-muted">
            Last updated: September 2026
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted">
            This page explains cookies and similar technologies on mentr.in. It
            complements our{" "}
            <Link
              href="/privacy"
              className="font-semibold text-coral hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              className="font-semibold text-coral hover:underline"
            >
              Terms of Service
            </Link>
            .
          </p>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-ink">{section.title}</h2>
                <ul className="mt-3 space-y-3">
                  {section.body.map((p) => (
                    <li
                      key={p.slice(0, 48)}
                      className="text-base leading-relaxed text-muted"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-muted">
            Questions?{" "}
            <Link
              href="/contact"
              className="font-semibold text-coral hover:underline"
            >
              Contact us
            </Link>{" "}
            or email{" "}
            <a
              href="mailto:hello@mentr.in"
              className="font-semibold text-coral hover:underline"
            >
              hello@mentr.in
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
