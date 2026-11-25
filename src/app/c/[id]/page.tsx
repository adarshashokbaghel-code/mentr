import { SharedCompilerLoader } from "@/components/learn-python/compiler/shared-compiler-loader";
import { absoluteUrl, SITE_BRAND } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const title = "Shared Python program";
  return {
    title,
    description: `Open a shared Python workspace on ${SITE_BRAND}. Run it in your browser, then fork to edit.`,
    alternates: { canonical: `/c/${id}` },
    openGraph: {
      title,
      url: absoluteUrl(`/c/${id}`),
      type: "website",
    },
    robots: { index: false, follow: false },
  };
}

export default async function SharedCompilerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[A-Za-z0-9_-]{6,16}$/.test(id)) notFound();
  return (
    <main>
      <SharedCompilerLoader shareId={id} />
    </main>
  );
}
