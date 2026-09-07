import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import {
  PARENT_COMPANY_NAME,
  PARENT_COMPANY_URL,
  SITE_BRAND,
} from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial policy — how Mentr creates guides & listings",
  description:
    "How Mentr by Paprly researches, writes, and updates tutor guides, blog articles, and city listings. Our standards for accuracy, originality, and corrections.",
  alternates: { canonical: "/editorial-policy" },
};

const sections = [
  {
    title: "Who writes our content",
    body: [
      "Guides on Mentr are written and reviewed by the Mentr editorial team at Paprly. We combine firsthand product knowledge (how connect requests, verification, and the requirements board work) with research on tutoring fees, exam timelines, and platform comparisons in India and abroad.",
      "We do not publish unattributed third-party articles or pay-for-placement reviews. Comparison pages (such as Mentr vs UrbanPro) are written to help parents and tutors make informed choices — we disclose that Mentr is our own product.",
    ],
  },
  {
    title: "What we publish",
    body: [
      "Our blog covers four areas: guides for parents hiring tutors, guides for students and exam prep, guides for tutors growing their practice, and local Bengaluru / UAE tutoring resources. Each article is intended to answer a specific question (for example, “How do I verify a tutor?” or “What is a realistic CBSE Class 12 revision plan?”) rather than repeat generic definitions.",
      "City and subject listing pages show verified tutor profiles with real availability where data exists. Pages with no matching tutors are not published to the sitemap.",
    ],
  },
  {
    title: "Accuracy & updates",
    body: [
      "Fee ranges, exam dates, and platform policies change. We date-stamp articles and update them when regulations, exam calendars, or our own product changes materially. Blog posts show published and updated dates on each article page.",
      "If you spot an error — wrong fee guidance, outdated exam date, or broken link — email hello@mentr.in with the page URL. We aim to review corrections within five working days.",
    ],
  },
  {
    title: "Advertising & independence",
    body: [
      "Mentr is free for parents and tutors. Public marketing and guide pages may show Google AdSense ads. Advertising does not influence which tutors appear in search results, who receives connect requests, or the order of editorial recommendations.",
      "Sponsored content or paid partnerships, if ever introduced, will be clearly labelled. Today, all guides are editorial.",
    ],
  },
  {
    title: "AI-assisted drafting",
    body: [
      "Some drafts may use AI tools for outlines or first passes. Every published guide is edited by a human for accuracy, original examples, India/UAE context, and compliance with our policies. We do not publish mass-generated pages without editorial review.",
    ],
  },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-hairline bg-white">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">
              Transparency
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Editorial policy
            </h1>
            <p className="mt-3 text-sm font-semibold text-muted">
              Last updated: September 2026
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted">
              {SITE_BRAND} publishes free guides to help parents, students, and
              tutors find each other safely. This page explains how we create
              content, how we handle corrections, and how advertising relates to
              our editorial work.
            </p>
          </div>
        </section>

        <section className="bg-cream py-10 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
            {sections.map((s) => (
              <article key={s.title}>
                <h2 className="text-xl font-bold text-ink">{s.title}</h2>
                <div className="mt-4 space-y-4">
                  {s.body.map((p) => (
                    <p key={p.slice(0, 40)} className="text-base leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}

            <div className="rounded-xl border border-hairline bg-white p-6">
              <h2 className="text-lg font-bold text-ink">Publisher</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Mentr is operated by{" "}
                <a
                  href={PARENT_COMPANY_URL}
                  className="font-semibold text-coral hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <PaprlyWordmark className="align-middle" />
                </a>{" "}
                ({PARENT_COMPANY_NAME}). Questions about this policy:{" "}
                <a
                  href="mailto:hello@mentr.in"
                  className="font-semibold text-coral hover:underline"
                >
                  hello@mentr.in
                </a>
                .
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/about" className="font-semibold text-coral hover:underline">
                    About Mentr
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="font-semibold text-coral hover:underline">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="font-semibold text-coral hover:underline">
                    All guides &amp; blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
