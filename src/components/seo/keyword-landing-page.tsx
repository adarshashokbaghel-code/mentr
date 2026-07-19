import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { SeoBreadcrumbs } from "@/components/seo/hub-page";
import { breadcrumbJsonLd, JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import {
  landingPagePath,
  type LandingPageConfig,
} from "@/lib/seo-landing-pages";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import Link from "next/link";

function faqJsonLd(faqs: LandingPageConfig["faqs"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function serviceJsonLd(config: LandingPageConfig, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.h1,
    description: config.metaDescription,
    url: absoluteUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_BRAND, url: absoluteUrl("/") },
    about: {
      "@type": "Service",
      name: config.h1,
      provider: { "@type": "Organization", name: SITE_BRAND, url: absoluteUrl("/") },
      areaServed: [
        { "@type": "Place", name: "Worldwide" },
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "United Arab Emirates" },
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
  };
}

export function KeywordLandingPage({ config }: { config: LandingPageConfig }) {
  const path = landingPagePath(config);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...(config.geo !== "global"
      ? [
          {
            label: config.basePath.replace(/^\//, "").replace(/-/g, " "),
            href: config.basePath,
          },
        ]
      : []),
    {
      label:
        config.geo === "global"
          ? config.eyebrow
          : config.geo === "india"
            ? "India"
            : "UAE",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(
            breadcrumbs.map((b, i) => ({
              name: b.label,
              path: b.href ?? (i === breadcrumbs.length - 1 ? path : "/"),
            })),
          ),
          faqJsonLd(config.faqs),
          serviceJsonLd(config, path),
        ]}
      />
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-8">
          <SeoBreadcrumbs items={breadcrumbs} />
          <p className="text-sm font-semibold uppercase tracking-wider text-coral">
            {config.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {config.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {config.intro}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={config.primaryCta.href}>
              <Button>{config.primaryCta.label}</Button>
            </Link>
            {config.secondaryCta && (
              <Link href={config.secondaryCta.href}>
                <Button variant="secondary">{config.secondaryCta.label}</Button>
              </Link>
            )}
          </div>

          <div className="mt-12 space-y-10">
            {config.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-ink">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-3 text-base leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="mt-12 rounded-xl border border-hairline bg-cream/50 p-6">
            <h2 className="text-lg font-bold text-ink">Frequently asked questions</h2>
            <dl className="mt-4 space-y-5">
              {config.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-sm font-semibold text-ink">{faq.question}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          {config.relatedLinks.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
                Related guides
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {config.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex rounded-full border border-hairline bg-white px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-coral/40 hover:text-coral"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
