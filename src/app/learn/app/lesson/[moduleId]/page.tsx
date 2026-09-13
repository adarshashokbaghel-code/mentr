import { LmsLesson } from "@/components/learn/lms/lms-lesson";
import { getModuleById } from "@/lib/learn-curriculum";
import type { Metadata } from "next";

type Props = { params: Promise<{ moduleId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  return {
    title: mod ? `${mod.id} · ${mod.title} — Mentr Learn` : "Lesson — Mentr Learn",
    robots: { index: false, follow: false },
  };
}

export default async function LearnLessonPage({ params }: Props) {
  const { moduleId } = await params;
  return <LmsLesson moduleId={moduleId} />;
}
