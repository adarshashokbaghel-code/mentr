import { SeoHubPage } from "@/components/seo/hub-page";
import { hubOpenGraph } from "@/lib/seo";
import {
  MENTOR_TOPICS,
  parseMentorTopicSlug,
  teachersForMentorTopic,
} from "@/lib/seo-hubs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return MENTOR_TOPICS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = MENTOR_TOPICS.find((p) => p.slug === slug);
  if (!page) return { title: "Not found", robots: { index: false } };
  const path = `/find-mentors/${slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: hubOpenGraph(page.title, page.description, path),
  };
}

export default async function MentorTopicHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = parseMentorTopicSlug(slug);
  if (!topic) notFound();

  const teachers = teachersForMentorTopic(topic.subjects);
  const path = `/find-mentors/${slug}`;

  return (
    <SeoHubPage
      eyebrow="Mentors"
      title={`Find ${topic.topic} online`}
      intro={`Search verified ${topic.topic.toLowerCase()} on Mentr — local or online in your time zone. Send a free connect request with your goal; WhatsApp unlocks after the mentor accepts.`}
      teachers={teachers}
      schemaPath={path}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Find mentors near me", href: "/find-mentors-near-me" },
        { label: topic.topic },
      ]}
      relatedLinks={[
        { label: "Find mentors near me", href: "/find-mentors-near-me" },
        { label: "Find online tutors", href: "/find-online-tutors" },
        { label: "Programming mentor guide", href: "/blog/find-programming-mentor-worldwide" },
        { label: "Career mentor guide", href: "/blog/how-to-find-career-mentor-free" },
      ]}
      ctaHref="/find-mentors-near-me"
      ctaLabel="Find mentors free"
      promoHref="/find-verified-online-tutors"
      promoLabel="Find verified tutors online"
    />
  );
}
