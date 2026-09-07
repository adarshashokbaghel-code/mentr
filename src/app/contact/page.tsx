import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import {
  PARENT_COMPANY_NAME,
  PARENT_COMPANY_URL,
  SITE_BRAND,
  SITE_URL,
} from "@/lib/seo";
import { Mail, MessageSquare, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact us — Mentr by Paprly",
  description:
    "Questions about finding a tutor, listing as faculty, verification, or editorial corrections on Mentr? Email hello@mentr.in — we reply within one working day.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Mail,
    title: "General questions",
    body: "Anything about how Mentr works, accounts, profiles, or using the platform.",
    action: "hello@mentr.in",
    href: "mailto:hello@mentr.in",
  },
  {
    icon: ShieldAlert,
    title: "Report a profile",
    body: "Spotted something off about a listing or a message? Tell us — verification is our core promise.",
    action: "safety@mentr.in",
    href: "mailto:safety@mentr.in",
  },
  {
    icon: MessageSquare,
    title: "Partnerships & press",
    body: "Schools, communities, media, or open-source contributors — we'd love to talk.",
    action: "team@mentr.in",
    href: "mailto:team@mentr.in",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Talk to the Mentr team
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            We&apos;re a small distributed team at{" "}
            <a
              href={PARENT_COMPANY_URL}
              className="font-semibold text-coral hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              <PaprlyWordmark className="align-middle" />
            </a>{" "}
            and we read every message. Expect a reply within one working day
            (Monday–Friday, IST business hours).
          </p>

          <div className="mt-10 space-y-4">
            {channels.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="flex items-start gap-4 rounded-xl border border-hairline bg-white p-5 transition hover:border-ink/25 hover:shadow-[0_4px_14px_rgba(28,26,23,0.07)]"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral-wash">
                  <c.icon className="h-5 w-5 text-coral-dark" />
                </span>
                <span>
                  <span className="block text-base font-bold text-ink">
                    {c.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {c.body}
                  </span>
                  <span className="mt-2 inline-block text-sm font-bold text-coral">
                    {c.action}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-hairline bg-cream p-6">
            <h2 className="text-lg font-bold text-ink">Publisher information</h2>
            <dl className="mt-4 space-y-3 text-sm text-muted">
              <div>
                <dt className="font-semibold text-ink">Product</dt>
                <dd>{SITE_BRAND}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Operated by</dt>
                <dd>
                  {PARENT_COMPANY_NAME} —{" "}
                  <a
                    href={PARENT_COMPANY_URL}
                    className="font-semibold text-coral hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {PARENT_COMPANY_URL.replace(/^https:\/\//, "")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Website</dt>
                <dd>
                  <a
                    href={SITE_URL}
                    className="font-semibold text-coral hover:underline"
                  >
                    {SITE_URL.replace(/^https:\/\//, "")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Content corrections</dt>
                <dd>
                  See something wrong in a guide? Email{" "}
                  <a
                    href="mailto:hello@mentr.in"
                    className="font-semibold text-coral hover:underline"
                  >
                    hello@mentr.in
                  </a>{" "}
                  with the page URL. See our{" "}
                  <Link
                    href="/editorial-policy"
                    className="font-semibold text-coral hover:underline"
                  >
                    editorial policy
                  </Link>
                  .
                </dd>
              </div>
            </dl>
          </div>

          <p className="mt-8 text-sm text-muted">
            Before writing in, you may find answers in our{" "}
            <Link href="/faq" className="font-semibold text-coral hover:underline">
              FAQ
            </Link>
            ,{" "}
            <Link href="/how-it-works" className="font-semibold text-coral hover:underline">
              how it works
            </Link>
            , or{" "}
            <Link href="/blog" className="font-semibold text-coral hover:underline">
              blog guides
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
