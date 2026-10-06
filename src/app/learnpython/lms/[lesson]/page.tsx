import { PyLessonPlayer } from "@/components/learn-python/lms/py-lesson-player";
import { PY_FINAL_PATH, PY_FINAL_SLUG, PY_LESSON_INDEX } from "@/lib/python-lms";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = { params: Promise<{ lesson: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const entry = PY_LESSON_INDEX.find((l) => l.slug === lesson);
  return { title: entry ? `Lesson ${entry.number}: ${entry.title} | Learn Python` : "Lesson | Learn Python" };
}

export default async function LearnPythonLessonPage({ params }: Props) {
  const { lesson } = await params;
  if (lesson === PY_FINAL_SLUG) redirect(PY_FINAL_PATH);
  return (
    <Suspense fallback={null}>
      <PyLessonPlayer slug={lesson} />
    </Suspense>
  );
}
