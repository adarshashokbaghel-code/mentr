import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { SeoBreadcrumbs } from "@/components/seo/hub-page";
import { Button } from "@/components/ui/button";
import { absoluteUrl, hubOpenGraph } from "@/lib/seo";
import { VS_PAGES } from "@/lib/seo-hubs";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return VS_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = VS_PAGES.find((p) => p.slug === slug);
  if (!page) return { title: "Compare", robots: { index: false } };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/vs/${slug}` },
    openGraph: hubOpenGraph(page.title, page.description, `/vs/${slug}`),
  };
}

export default async function VsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = VS_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const path = `/vs/${slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Compare", path: "/vs/urbanpro" },
            { name: page.headline, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: page.headline,
            description: page.description,
            url: absoluteUrl(path),
          },
        ]}
      />
      <Navbar />
      <main className="min-h-screen pb-16">
        <div className="mx-auto max-w-[800px] px-4 py-10 sm:px-6 lg:px-8">
          <SeoBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: page.headline },
            ]}
          />
          <p className="text-sm font-semibold text-coral">Compare</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            {page.headline}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Parents and tutors worldwide are switching from{" "}
            {page.competitor} to a free connector — no lead fees, no commission,
            direct WhatsApp after acceptance.
          </p>
          <ul className="mt-8 space-y-4">
            {page.bullets.map((b) => (
              <li
                key={b}
                className="rounded-xl border border-hairline bg-white px-4 py-3 text-sm leading-relaxed text-ink"
              >
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search">
              <Button>Find a tutor</Button>
            </Link>
            <Link href="/for-faculty">
              <Button variant="secondary">List as a tutor</Button>
            </Link>
          </div>
          <section className="mt-10">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">
              More comparisons
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {VS_PAGES.filter((p) => p.slug !== slug).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/vs/${p.slug}`}
                    className="inline-flex rounded-full border border-hairline bg-white px-3 py-1.5 text-sm font-semibold hover:text-coral"
                  >
                    {p.headline}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
