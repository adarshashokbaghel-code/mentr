import { SeoHubPage } from "@/components/seo/hub-page";
import { SITE_NAME, hubOpenGraph } from "@/lib/seo";
import { slugify, subjectHubSlug } from "@/lib/seo-hubs";
import { SUBJECTS } from "@/lib/teachers";
import {
  CITY_SUBJECT_PAGES,
  INSTANT_CONNECT_CTA,
  REQUIREMENT_CTA,
  SEO_CITIES,
  citySubjectFaqs,
  citySubjectPath,
} from "@/lib/seo-programmatic";
import { liveTeachersForCitySubject } from "@/lib/seo-live-teachers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

function parseCitySubject(
  citySlug: string,
  subjectSlug: string,
): { city: (typeof SEO_CITIES)[number]; subject: string } | null {
  const city = SEO_CITIES.find((c) => c.slug === citySlug);
  if (!city) return null;
  const raw = subjectSlug.replace(/-tutors$/, "").replace(/-/g, " ");
  const subject =
    SUBJECTS.find((s) => slugify(s) === slugify(raw)) ??
    SUBJECTS.find((s) => raw.toLowerCase().includes(s.toLowerCase()));
  if (!subject) return null;
  const allowed = CITY_SUBJECT_PAGES.some(
    (p) => p.city === city.slug && p.subject === subject,
  );
  if (!allowed) return null;
  return { city, subject };
}

export function generateStaticParams() {
  return CITY_SUBJECT_PAGES.map((p) => ({
    city: p.city,
    subject: `${slugify(p.subject)}-tutors`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; subject: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const parsed = parseCitySubject(resolved.city, resolved.subject);
  if (!parsed) return { title: "Not found", robots: { index: false } };
  const title = `${parsed.subject} Tutors in ${parsed.city.name}`;
  const description = `Find verified ${parsed.subject} tutors in ${parsed.city.name} on ${SITE_NAME}. Compare rates, home & online modes, and bios — connect free or try Instant Connect.`;
  const path = citySubjectPath(parsed.city.slug, parsed.subject);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: hubOpenGraph(title, description, path),
  };
}

export default async function CitySubjectHubPage({
  params,
}: {
  params: Promise<{ city: string; subject: string }>;
}) {
  const resolved = await params;
  const parsed = parseCitySubject(resolved.city, resolved.subject);
  if (!parsed) notFound();

  const teachers = await liveTeachersForCitySubject(
    parsed.city.slug,
    parsed.subject,
  );
  const path = citySubjectPath(parsed.city.slug, parsed.subject);
  const searchHref = `/search?subject=${encodeURIComponent(parsed.subject)}&q=${encodeURIComponent(parsed.city.name)}`;
  const mapHref = `${searchHref}&view=map`;

  return (
    <SeoHubPage
      eyebrow={`${parsed.subject} · ${parsed.city.name}`}
      title={`${parsed.subject} tutors in ${parsed.city.name}`}
      intro={`Looking for ${parsed.subject} tutors in ${parsed.city.name}? Browse verified profiles below — see rates, home vs online, experience, and areas. Connect free, post a requirement, or try Instant Connect for a fast match.`}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: parsed.city.name, href: `/tutors/${parsed.city.slug}` },
        { label: parsed.subject },
      ]}
      ctaHref={searchHref}
      ctaLabel={`Browse all ${parsed.subject}`}
      mapHref={mapHref}
      faqs={citySubjectFaqs(
        parsed.subject,
        parsed.city.name,
        parsed.city.local,
      )}
      requirementHref={REQUIREMENT_CTA.href}
      requirementLabel={REQUIREMENT_CTA.label}
      requirementBlurb={REQUIREMENT_CTA.blurb}
      instantHref={INSTANT_CONNECT_CTA.href}
      instantLabel={INSTANT_CONNECT_CTA.label}
      instantBlurb={INSTANT_CONNECT_CTA.blurb}
      relatedLinks={[
        {
          label: `All tutors in ${parsed.city.name}`,
          href: `/tutors/${parsed.city.slug}`,
        },
        {
          label: `${parsed.subject} tutors in Bengaluru`,
          href: `/subjects/${subjectHubSlug(parsed.subject)}`,
        },
        { label: "Find tutors near you", href: "/find-tutors-near-me" },
        { label: "CBSE tutors", href: "/boards/cbse-tutors" },
        { label: "Try Instant Connect", href: INSTANT_CONNECT_CTA.href },
      ]}
    />
  );
}
