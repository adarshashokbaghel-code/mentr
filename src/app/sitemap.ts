import {
  areaSitemapEntries,
  comboSitemapEntries,
  coreSitemapEntries,
  examPrepSitemapEntries,
  subjectSitemapEntries,
  teacherSitemapEntries,
} from "@/lib/sitemap-entries";
import { resolveTeacherSitemapRefs } from "@/lib/sitemap-teachers";
import type { MetadataRoute } from "next";

/** Regenerate sitemap daily so Search Console sees fresh lastmod dates. */
export const revalidate = 86400;

/** Single sitemap index at /sitemap.xml (GSC-friendly; avoids broken multi-sitemap index). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const teachers = await resolveTeacherSitemapRefs();

  return [
    ...coreSitemapEntries(),
    ...subjectSitemapEntries(),
    ...areaSitemapEntries(),
    ...comboSitemapEntries(),
    ...examPrepSitemapEntries(),
    ...teacherSitemapEntries(teachers),
  ];
}
