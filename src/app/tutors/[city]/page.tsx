import { SeoHubPage } from "@/components/seo/hub-page";
import { hubOpenGraph } from "@/lib/seo";
import { cityGuide } from "@/lib/seo-city-copy";
import {
  CITY_SUBJECT_PAGES,
  INSTANT_CONNECT_CTA,
  REQUIREMENT_CTA,
  SEO_CITIES,
  cityFaqs,
  cityPath,
  citySubjectPath,
} from "@/lib/seo-programmatic";
import { liveTeachersForCity } from "@/lib/seo-live-teachers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

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
  const description = `Find a verified tutor in ${city.name}. Free for parents — no commission, no agency fee. Browse profiles or get matched instantly.`;
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

  const teachers = await liveTeachersForCity(city.slug);
  const path = cityPath(city.slug);
  const guide = cityGuide(city.slug, city.name, city.local);
  const subjects = [
    ...new Set(
      CITY_SUBJECT_PAGES.filter((p) => p.city === city.slug).map(
        (p) => p.subject,
      ),
    ),
  ];
  const searchHref = `/search?q=${encodeURIComponent(city.name)}`;

  return (
    <SeoHubPage
      eyebrow={city.name}
      title={`Find a verified tutor in ${city.name}`}
      intro={
        city.local
          ? `Free for parents. No commission. No agency fee. Browse verified tutors across ${city.name} — home visits and online. Tell us the subject and class, or get matched instantly.`
          : `Free for parents. No commission. No agency fee. ${city.name} families browse verified online tutors — or get matched instantly when you need someone fast.`
      }
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "For parents", href: "/parents" },
        { label: city.name },
      ]}
      ctaHref="/find-tutor"
      ctaLabel="Find a Tutor"
      mapHref={`${searchHref}&view=map`}
      promoHref="/find-tutor"
      promoLabel="Find a Tutor"
      faqs={cityFaqs(city.name, city.local)}
      requirementHref={REQUIREMENT_CTA.href}
      requirementLabel={REQUIREMENT_CTA.label}
      requirementBlurb={REQUIREMENT_CTA.blurb}
      instantHref={INSTANT_CONNECT_CTA.href}
      instantLabel={INSTANT_CONNECT_CTA.label}
      instantBlurb={INSTANT_CONNECT_CTA.blurb}
      guideSections={guide.sections}
      pricingContext={guide.pricing}
      modesContext={guide.modes}
      verificationContext={guide.verification}
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
        { label: "Find a Tutor", href: "/find-tutor" },
        { label: "Get Matched Instantly", href: "/instant-connect" },
        ...(city.slug !== "bengaluru"
          ? [{ label: "Tutors in Bengaluru", href: "/tutors/bengaluru" }]
          : []),
      ]}
    />
  );
}
