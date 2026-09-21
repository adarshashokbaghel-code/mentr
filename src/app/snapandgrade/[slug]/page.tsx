import { SnapGradeClusterLanding } from "@/components/landing/lp/snap-grade-cluster-page";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/seo/json-ld";
import { PageMarketing } from "@/components/marketing/page-marketing";
import {
  SNAP_GRADE_CLUSTERS,
  SNAP_GRADE_FACT_SHEET,
  SNAP_GRADE_FAQS,
  snapGradeClusterPath,
  snapGradeHowToJsonLd,
} from "@/lib/snap-grade-seo";
import { hubOpenGraph, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SNAP_GRADE_CLUSTERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = SNAP_GRADE_CLUSTERS.find((p) => p.slug === slug);
  if (!page) return { title: "Snap & Grade", robots: { index: false } };
  const path = snapGradeClusterPath(page.slug);
  return {
    title: { absolute: `${page.title} | ${SITE_BRAND}` },
    description: page.metaDescription,
    keywords: [...page.keywords, "Snap & Grade", "Mentr"],
    alternates: { canonical: path },
    openGraph: hubOpenGraph(page.title, page.metaDescription, path),
    robots: { index: true, follow: true },
  };
}

export default async function SnapGradeClusterRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SNAP_GRADE_CLUSTERS.find((p) => p.slug === slug);
  if (!page) notFound();
  const path = snapGradeClusterPath(page.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: SNAP_GRADE_FACT_SHEET.productName, path: SNAP_GRADE_FACT_SHEET.path },
            { name: page.h1, path },
          ]),
          faqJsonLd([...SNAP_GRADE_FAQS.slice(0, 6)]),
          snapGradeHowToJsonLd(),
        ]}
      />
      <PageMarketing slug={`snapandgrade-${page.slug}`} path={path} />
      <SnapGradeClusterLanding page={page} />
    </>
  );
}
