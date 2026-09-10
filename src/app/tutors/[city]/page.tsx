import { SeoHubPage } from "@/components/seo/hub-page";
import { SITE_NAME, hubOpenGraph } from "@/lib/seo";
import {
  CITY_SUBJECT_PAGES,
  REQUIREMENT_CTA,
  SEO_CITIES,
  cityFaqs,
  cityPath,
  citySubjectPath,
  teachersForCity,
} from "@/lib/seo-programmatic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = SEO_CITIES.find((c) => c.slug === citySlug);
  if (!city) return { title: "Not found", robots: { index: false } };
  const title = `Tutors in ${city.name} — Verified Home & Online`;
  const description = `Find tutors in ${city.name} on ${SITE_NAME}. Browse verified profiles by subject, connect free, or post your requirement and let tutors come to you.`;
  const path = cityPath(city.slug);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: hubOpenGraph(title, description, path),
  };
}

export default async function CityTutorsHubPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = SEO_CITIES.find((c) => c.slug === citySlug);
  if (!city) notFound();

  const teachers = teachersForCity(city.slug);
  const path = cityPath(city.slug);
  const subjects = [
    ...new Set(
      CITY_SUBJECT_PAGES.filter((p) => p.city === city.slug).map(
        (p) => p.subject,
      ),
    ),
  ];

  return (
    <SeoHubPage
      eyebrow={city.name}
      title={`Tutors in ${city.name}`}
      intro={
        city.local
          ? `Browse verified tutors across ${city.name} — home visits and online sessions for CBSE, ICSE, and IGCSE. Every profile shows subjects, experience, and open slots. Can't find the right fit? Post your requirement and let tutors pitch you.`
          : `${city.name} families use Mentr for verified online tutors in their time zone — plus home tutors where available. Browse subject specialists below or post a requirement naming ${city.name}, class, and board.`
      }
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Cities", href: "/find-tutors-near-me" },
        { label: city.name },
      ]}
      ctaHref={`/search?q=${encodeURIComponent(city.name)}`}
      ctaLabel={`Search tutors in ${city.name}`}
      promoHref="/find-tutors-near-me"
      promoLabel="Find tutors near you"
      faqs={cityFaqs(city.name, city.local)}
      requirementHref={REQUIREMENT_CTA.href}
      requirementLabel={REQUIREMENT_CTA.label}
      requirementBlurb={REQUIREMENT_CTA.blurb}
      emptyMessage={
        city.local
          ? undefined
          : `Showing online tutors who work with ${city.name} families — post a requirement for a closer match.`
      }
      relatedLinks={[
        ...subjects.map((s) => ({
          label: `${s} tutors in ${city.name}`,
          href: citySubjectPath(city.slug, s),
        })),
        { label: "CBSE tutors", href: "/boards/cbse-tutors" },
        { label: "Find tutors near you", href: "/find-tutors-near-me" },
        ...(city.slug !== "bengaluru"
          ? [{ label: "Tutors in Bengaluru", href: "/tutors/bengaluru" }]
          : []),
      ]}
    />
  );
}
