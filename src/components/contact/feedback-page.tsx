import { FeedbackExperience } from "@/components/contact/feedback-experience";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { hardShadowSm } from "@/components/landing/lp/shared";
import { PageMarketing } from "@/components/marketing/page-marketing";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { PaprlyWordmark } from "@/components/ui/paprly-wordmark";
import {
  LAUNCH_HUB_CITY,
  PARENT_COMPANY_NAME,
  PARENT_COMPANY_URL,
  SITE_BRAND,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Mail, MessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";

const CHANNELS = [
  {
    icon: Mail,
    title: "General questions",
    body: "Accounts, search, verification, or how Mentr works.",
    action: "hello@mentr.in",
    href: "mailto:hello@mentr.in",
    tint: "bg-sage-wash",
    iconColor: "text-sage",
  },
  {
    icon: ShieldAlert,
    title: "Report a profile",
    body: "Something off about a listing or a message? Tell us first.",
    action: "safety@mentr.in",
    href: "mailto:safety@mentr.in",
    tint: "bg-coral-wash",
    iconColor: "text-coral-dark",
  },
  {
    icon: MessageSquare,
    title: "Partnerships & press",
    body: "Schools, communities, media, or open-source contributors.",
    action: "team@mentr.in",
    href: "mailto:team@mentr.in",
    tint: "bg-lavender",
    iconColor: "text-ink",
  },
];

export function FeedbackPage({
  path,
}: {
  path: "/contact" | "/request-feature";
}) {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      {
        name: path === "/request-feature" ? "Request a feature" : "Contact",
        path,
      },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: `Contact ${SITE_BRAND} · Request a feature`,
      description:
        "Contact Mentr by Paprly, request a product feature, and leave a review. Built for parents and tutors in Bengaluru, India, the UAE, and worldwide.",
      url: absoluteUrl(path),
      isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: SITE_URL },
      about: {
        "@type": "SoftwareApplication",
        name: SITE_BRAND,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        areaServed: [
          { "@type": "City", name: LAUNCH_HUB_CITY },
          { "@type": "Country", name: "India" },
          { "@type": "Place", name: "Worldwide" },
        ],
      },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageMarketing
        slug={path === "/request-feature" ? "request-feature" : "contact"}
        path={path}
      />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <FeedbackExperience page={path} />

        <section className="border-b border-hairline bg-white">
          <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sage">
              Direct email
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">
              Prefer to write us yourself?
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {CHANNELS.map((c) => (
                <a
                  key={c.title}
                  href={c.href}
                  className={cn(
                    "flex flex-col rounded-2xl border-2 border-ink bg-cream p-5 transition hover:-translate-y-0.5",
                    hardShadowSm,
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-lg",
                      c.tint,
                    )}
                  >
                    <c.icon className={cn("h-5 w-5", c.iconColor)} />
                  </span>
                  <span className="mt-3 text-base font-bold text-ink">
                    {c.title}
                  </span>
                  <span className="mt-1 flex-1 text-sm leading-relaxed text-muted">
                    {c.body}
                  </span>
                  <span className="mt-3 text-sm font-bold text-coral">
                    {c.action}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-cream">
          <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div
              className={cn(
                "rounded-2xl border-2 border-ink bg-white p-6 sm:p-8",
                hardShadowSm,
              )}
            >
              <h2 className="text-lg font-bold text-ink">
                Publisher information
              </h2>
              <dl className="mt-4 grid gap-4 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
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
                      <PaprlyWordmark className="align-middle" />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">HQ / launch city</dt>
                  <dd>
                    {LAUNCH_HUB_CITY}, India · serving parents worldwide
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Corrections</dt>
                  <dd>
                    Guide wrong? Email hello@mentr.in or see our{" "}
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
              <p className="mt-6 text-sm text-muted">
                Looking for a tutor first?{" "}
                <Link
                  href="/search"
                  className="font-semibold text-coral hover:underline"
                >
                  Browse verified tutors
                </Link>
                {" · "}
                <Link
                  href="/faq"
                  className="font-semibold text-coral hover:underline"
                >
                  FAQ
                </Link>
                {" · "}
                <Link
                  href="/parents"
                  className="font-semibold text-coral hover:underline"
                >
                  For parents
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
