import { BLOG_PILLARS, BLOG_POSTS } from "@/lib/blog-posts";
import { MONEY_LANDING_PAGES, landingPagePath } from "@/lib/seo-landing-pages";
import { absoluteUrl } from "@/lib/seo";
import {
  EXAM_PREP_PAGES,
  VS_PAGES,
  ONLINE_SUBJECT_PAGES,
  UAE_CITY_PAGES,
  MENTOR_TOPICS,
  areaHubSlug,
  comboSlug,
  publishedCombos,
  slugify,
  subjectHubSlug,
} from "@/lib/seo-hubs";
import { LOCALITIES, SUBJECTS } from "@/lib/teachers";
import type { MetadataRoute } from "next";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

const BUILD_DATE = new Date();

function entry(
  path: string,
  priority: number,
  changeFrequency: Freq,
  lastModified: Date = BUILD_DATE,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  };
}

/** Marketing & utility pages that should be indexed. */
export function coreSitemapEntries(): MetadataRoute.Sitemap {
  return [
    entry("/", 1, "daily"),
    entry("/search/bengaluru", 0.85, "weekly"),
    entry("/parents", 0.9, "weekly"),
    entry("/for-faculty", 0.9, "weekly"),
    entry("/online-tutor-jobs", 0.9, "weekly"),
    ...MONEY_LANDING_PAGES.filter((p) => p.basePath !== "/online-tutor-jobs").map(
      (p) => entry(landingPagePath(p), 0.9, "weekly"),
    ),
    entry("/how-it-works", 0.8, "weekly"),
    entry("/pricing", 0.75, "monthly"),
    entry("/faq", 0.85, "weekly"),
    entry("/blog", 0.85, "weekly"),
    ...BLOG_PILLARS.map((p) =>
      entry(`/blog/category/${p.id}`, 0.75, "weekly"),
    ),
    ...BLOG_POSTS.map((p) => entry(`/blog/${p.slug}`, 0.7, "monthly")),
    entry("/about", 0.7, "monthly"),
    entry("/contact", 0.5, "yearly"),
    entry("/faculty/signup", 0.7, "monthly"),
    entry("/parent/signup", 0.7, "monthly"),
    ...VS_PAGES.map((p) => entry(`/vs/${p.slug}`, 0.65, "monthly")),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];
}

export function subjectSitemapEntries(): MetadataRoute.Sitemap {
  return SUBJECTS.map((s) =>
    entry(`/subjects/${subjectHubSlug(s)}`, 0.8, "weekly"),
  );
}

export function areaSitemapEntries(): MetadataRoute.Sitemap {
  return LOCALITIES.map((a) =>
    entry(`/areas/${areaHubSlug(a)}`, 0.8, "weekly"),
  );
}

export function comboSitemapEntries(): MetadataRoute.Sitemap {
  return publishedCombos().map(({ area, subject }) =>
    entry(`/${slugify(area)}/${comboSlug(subject)}`, 0.7, "weekly"),
  );
}

export function examPrepSitemapEntries(): MetadataRoute.Sitemap {
  return EXAM_PREP_PAGES.map((p) =>
    entry(`/exam-prep/${p.slug}`, 0.7, "weekly"),
  );
}

export function teacherSitemapEntries(
  teacherPaths: { path: string; lastModified?: Date }[],
): MetadataRoute.Sitemap {
  return teacherPaths.map(({ path, lastModified }) =>
    entry(path, 0.6, "weekly", lastModified ?? BUILD_DATE),
  );
}

export function onlineSubjectSitemapEntries(): MetadataRoute.Sitemap {
  return ONLINE_SUBJECT_PAGES.map((p) =>
    entry(`/online/${p.slug}`, 0.8, "weekly"),
  );
}

export function uaeCitySitemapEntries(): MetadataRoute.Sitemap {
  return UAE_CITY_PAGES.map((p) => entry(`/uae/${p.slug}`, 0.8, "weekly"));
}

export function mentorTopicSitemapEntries(): MetadataRoute.Sitemap {
  return MENTOR_TOPICS.map((p) =>
    entry(`/find-mentors/${p.slug}`, 0.75, "weekly"),
  );
}
