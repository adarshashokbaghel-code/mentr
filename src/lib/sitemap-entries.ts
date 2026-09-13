import { BLOG_PILLARS, BLOG_POSTS } from "@/lib/blog-posts";
import { LEARN_PUBLIC } from "@/lib/learn-flags";
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
import {
  BOARD_COMBO_PAGES,
  BOARDS,
  CITY_SUBJECT_PAGES,
  SEO_CITIES,
  SUBJECT_CLASS_PAGES,
  boardComboPath,
  boardPath,
  cityPath,
  citySubjectPath,
  classSubjectPath,
} from "@/lib/seo-programmatic";
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
    entry("/parents", 0.9, "weekly"),
    ...(LEARN_PUBLIC
      ? [
          entry("/learn", 0.9, "weekly"),
          entry("/learn/india", 0.88, "weekly"),
          entry("/learn/uae", 0.88, "weekly"),
          entry("/learn/syllabus", 0.8, "weekly"),
          entry("/learn/start", 0.85, "weekly"),
        ]
      : []),
    entry("/for-faculty", 0.9, "weekly"),
    entry("/online-tutor-jobs", 0.9, "weekly"),
    ...MONEY_LANDING_PAGES.filter((p) => p.basePath !== "/online-tutor-jobs").map(
      (p) => entry(landingPagePath(p), 0.9, "weekly"),
    ),
    entry("/how-it-works", 0.8, "weekly"),
    entry("/pricing", 0.75, "monthly"),
    entry("/faq", 0.85, "weekly"),
    entry("/blog", 0.85, "weekly"),
    entry("/llms.txt", 0.4, "monthly"),
    entry("/search", 0.9, "daily"),
    ...BLOG_PILLARS.map((p) =>
      entry(`/blog/category/${p.id}`, 0.75, "weekly"),
    ),
    ...BLOG_POSTS.map((p) => entry(`/blog/${p.slug}`, 0.7, "monthly")),
    entry("/about", 0.7, "monthly"),
    entry("/open-source", 0.75, "monthly"),
    entry("/editorial-policy", 0.6, "monthly"),
    entry("/contact", 0.7, "monthly"),
    entry("/request-feature", 0.7, "monthly"),
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

export function classSubjectSitemapEntries(): MetadataRoute.Sitemap {
  return SUBJECT_CLASS_PAGES.map((p) =>
    entry(classSubjectPath(p.level, p.subject), 0.82, "weekly"),
  );
}

export function boardSitemapEntries(): MetadataRoute.Sitemap {
  return [
    ...BOARDS.map((b) => entry(boardPath(b.id), 0.8, "weekly")),
    ...BOARD_COMBO_PAGES.map((p) =>
      entry(boardComboPath(p.board, p.level, p.subject), 0.78, "weekly"),
    ),
  ];
}

export function cityTutorSitemapEntries(): MetadataRoute.Sitemap {
  return [
    ...SEO_CITIES.map((c) => entry(cityPath(c.slug), 0.85, "weekly")),
    ...CITY_SUBJECT_PAGES.map((p) =>
      entry(citySubjectPath(p.city, p.subject), 0.8, "weekly"),
    ),
  ];
}
