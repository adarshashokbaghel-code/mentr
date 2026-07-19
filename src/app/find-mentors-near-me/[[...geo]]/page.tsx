import { KeywordLandingPage } from "@/components/seo/keyword-landing-page";
import { getLandingPage } from "@/lib/seo-landing-pages";
import { hubOpenGraph } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const BASE = "/find-mentors-near-me";

function parseGeo(raw?: string | string[]): "global" | "india" | "uae" | null {
  if (!raw || (Array.isArray(raw) && raw.length === 0)) return "global";
  const segment = Array.isArray(raw) ? raw[0] : raw;
  if (segment === "india" || segment === "uae") return segment;
  return null;
}

export function generateStaticParams() {
  return [{ geo: [] }, { geo: ["india"] }, { geo: ["uae"] }];
}

function configFor(raw?: string | string[]) {
  const geo = parseGeo(raw);
  if (geo === null) return undefined;
  return getLandingPage(BASE, geo);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ geo?: string | string[] }>;
}): Promise<Metadata> {
  const { geo } = await params;
  const config = configFor(geo);
  if (!config) return { title: "Not found", robots: { index: false } };
  const parsed = parseGeo(geo);
  const path = parsed === "global" ? BASE : `${BASE}/${parsed}`;
  return {
    title: config.title,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: { canonical: path },
    openGraph: hubOpenGraph(config.title, config.metaDescription, path),
  };
}

export default async function FindMentorsNearMePage({
  params,
}: {
  params: Promise<{ geo?: string | string[] }>;
}) {
  const { geo } = await params;
  const config = configFor(geo);
  if (!config) notFound();
  return <KeywordLandingPage config={config} />;
}
