import { SeoHubPage } from "@/components/seo/hub-page";
import { SITE_NAME, hubOpenGraph } from "@/lib/seo";
import { slugify, subjectHubSlug } from "@/lib/seo-hubs";
import { SUBJECTS } from "@/lib/teachers";
import {
  CITY_SUBJECT_PAGES,
  REQUIREMENT_CTA,
  SEO_CITIES,
  cityFaqs,
  citySubjectPath,
  teachersForCitySubject,
} from "@/lib/seo-programmatic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  const description = `Find ${parsed.subject} tutors in ${parsed.city.name} on ${SITE_NAME}. Verified profiles — home and online. Connect free or post your requirement.`;
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

  const teachers = teachersForCitySubject(parsed.city.slug, parsed.subject);
  const path = citySubjectPath(parsed.city.slug, parsed.subject);

  return (
    <SeoHubPage
      eyebrow={`${parsed.subject} · ${parsed.city.name}`}
      title={`${parsed.subject} tutors in ${parsed.city.name}`}
      intro={`Searching "${parsed.subject} tutors in ${parsed.city.name}"? Browse verified ${parsed.subject} tutors below — filter by open slots, read bios, and send a free connect request. Or post your requirement and let ${parsed.subject} tutors pitch you.`}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: parsed.city.name, href: `/tutors/${parsed.city.slug}` },
        { label: parsed.subject },
      ]}
      ctaHref={`/search?subject=${encodeURIComponent(parsed.subject)}&q=${encodeURIComponent(parsed.city.name)}`}
      ctaLabel={`Search ${parsed.subject} in ${parsed.city.name}`}
      faqs={cityFaqs(parsed.city.name, parsed.city.local)}
      requirementHref={REQUIREMENT_CTA.href}
      requirementLabel={REQUIREMENT_CTA.label}
      requirementBlurb={REQUIREMENT_CTA.blurb}
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
      ]}
    />
  );
}
