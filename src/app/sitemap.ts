import { absoluteUrl } from "@/lib/seo";
import {
  EXAM_PREP_PAGES,
  VS_PAGES,
  areaHubSlug,
  comboSlug,
  publishedCombos,
  slugify,
  subjectHubSlug,
} from "@/lib/seo-hubs";
import { LOCALITIES, SUBJECTS, TEACHERS } from "@/lib/teachers";
import type { MetadataRoute } from "next";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

function entry(
  path: string,
  priority: number,
  changeFrequency: Freq,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export async function generateSitemaps() {
  return [
    { id: "core" },
    { id: "subjects" },
    { id: "areas" },
    { id: "combos" },
    { id: "exam-prep" },
    { id: "teachers" },
  ];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;

  if (id === "core") {
    return [
      entry("/", 1, "daily"),
      entry("/search", 0.9, "daily"),
      entry("/search/bengaluru", 0.8, "weekly"),
      entry("/parents", 0.9, "weekly"),
      entry("/for-faculty", 0.9, "weekly"),
      entry("/become-a-mentor", 0.7, "monthly"),
      entry("/how-it-works", 0.8, "weekly"),
      entry("/pricing", 0.8, "weekly"),
      entry("/faq", 0.9, "weekly"),
      entry("/about", 0.7, "monthly"),
      entry("/contact", 0.5, "yearly"),
      entry("/faculty/signup", 0.7, "monthly"),
      entry("/parent/signup", 0.7, "monthly"),
      ...VS_PAGES.map((p) => entry(`/vs/${p.slug}`, 0.7, "monthly")),
      entry("/privacy", 0.2, "yearly"),
      entry("/terms", 0.2, "yearly"),
    ];
  }

  if (id === "subjects") {
    return SUBJECTS.map((s) =>
      entry(`/subjects/${subjectHubSlug(s)}`, 0.8, "weekly"),
    );
  }

  if (id === "areas") {
    return LOCALITIES.map((a) =>
      entry(`/areas/${areaHubSlug(a)}`, 0.8, "weekly"),
    );
  }

  if (id === "combos") {
    return publishedCombos().map(({ area, subject }) =>
      entry(`/${slugify(area)}/${comboSlug(subject)}`, 0.7, "weekly"),
    );
  }

  if (id === "exam-prep") {
    return EXAM_PREP_PAGES.map((p) =>
      entry(`/exam-prep/${p.slug}`, 0.7, "weekly"),
    );
  }

  if (id === "teachers") {
    return TEACHERS.map((t) =>
      entry(`/teachers/${t.id}`, 0.6, "weekly"),
    );
  }

  return [];
}
