import { LmsLesson } from "@/components/learn/lms/lms-lesson";
import { getModuleById } from "@/lib/learn-curriculum";
import { Suspense } from "react";

type Props = { params: Promise<{ moduleId: string }> };

export async function generateMetadata({ params }: Props) {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  return {
    title: mod ? `${mod.title} | Mentr Learn` : "Lesson | Mentr Learn",
  };
}

export default async function LearnLessonPage({ params }: Props) {
  const { moduleId } = await params;
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-[14px] font-semibold text-[#8a929c]">
          Loading lesson…
        </div>
      }
    >
      <LmsLesson moduleId={moduleId} />
    </Suspense>
  );
}
