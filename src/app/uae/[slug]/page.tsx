import { SeoHubPage } from "@/components/seo/hub-page";
import { hubOpenGraph } from "@/lib/seo";
import {
  UAE_CITY_PAGES,
  allOnlineTeachers,
  parseUaeCitySlug,
  uaeCityIntro,
} from "@/lib/seo-hubs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return UAE_CITY_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = UAE_CITY_PAGES.find((p) => p.slug === slug);
  if (!page) return { title: "Not found", robots: { index: false } };
  const path = `/uae/${slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: hubOpenGraph(page.title, page.description, path),
  };
}

export default async function UaeCityHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = parseUaeCitySlug(slug);
  if (!city) notFound();

  const teachers = allOnlineTeachers().slice(0, 12);

  const path = `/uae/${slug}`;

  return (
    <SeoHubPage
      eyebrow="UAE"
      title={`Online tutors in ${city}`}
      intro={uaeCityIntro(city)}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Find online tutors UAE", href: "/find-online-tutors/uae" },
        { label: city },
      ]}
      relatedLinks={[
        { label: "Find online tutors UAE", href: "/find-online-tutors/uae" },
        { label: "Verified tutors UAE", href: "/find-verified-online-tutors/uae" },
        { label: "UAE tutor guide", href: "/blog/find-tutor-online-uae" },
        { label: "Find mentors near me UAE", href: "/find-mentors-near-me/uae" },
      ]}
      ctaHref="/find-online-tutors/uae"
      ctaLabel="Find UAE tutors free"
      promoHref="/find-verified-online-tutors/uae"
      promoLabel="Find verified online tutors in UAE"
    />
  );
}
