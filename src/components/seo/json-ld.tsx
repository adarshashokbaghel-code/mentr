import { absoluteUrl } from "@/lib/seo";
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
