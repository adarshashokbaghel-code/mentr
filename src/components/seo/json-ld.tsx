import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Teacher } from "@/lib/teachers";

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  teachers: Teacher[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.teachers.length,
      itemListElement: opts.teachers.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/teachers/${t.id}`),
        name: t.name,
      })),
    },
  };
}

/** City tutoring page — the query Google should attach to a place. */
export function cityTutorServiceJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  city: string;
  lat: number;
  lng: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: "Private tutoring",
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_BRAND,
      url: absoluteUrl("/"),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
    areaServed: {
      "@type": "City",
      name: opts.city,
      geo: {
        "@type": "GeoCoordinates",
        latitude: opts.lat,
        longitude: opts.lng,
      },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Free for parents. Tutors keep their fees.",
    },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function personJsonLd(teacher: Teacher) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: teacher.name,
      jobTitle: teacher.designation,
      knowsAbout: teacher.subjects,
      description: teacher.bio,
      url: absoluteUrl(`/teachers/${teacher.id}`),
      areaServed: {
        "@type": "Place",
        name: teacher.area,
      },
      ...(teacher.imageUrl
        ? { image: teacher.imageUrl }
        : {}),
    },
  };
}
