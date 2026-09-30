import { A1_LESSON_SEED, A1_QUIZ_SEED, A1_VIDEO_ID } from "../lib/learn-a1-quiz-seed";
import { A2_LESSON_SEED, A2_QUIZ_SEED, A2_VIDEO_ID } from "../lib/learn-a2-quiz-seed";
import { A3_LESSON_SEED, A3_QUIZ_SEED, A3_VIDEO_ID } from "../lib/learn-a3-quiz-seed";
import { A4_LESSON_SEED, A4_QUIZ_SEED, A4_VIDEO_ID } from "../lib/learn-a4-quiz-seed";
import { getLessonContent, getLessonMeta } from "../../src/lib/learn-content";
import { hasLessonVideo } from "../../src/lib/learn-curriculum";
import { LearnLesson } from "../models/LearnLesson";
import {
  LearnQuizQuestion,
  type LearnQuizDifficulty,
} from "../models/LearnQuizQuestion";
import { getParentStarterEnrollment } from "./learn-enroll";

export type QuizQuestionDto = {
  questionId: string;
  videoId: string;
  moduleId: string;
  difficulty: LearnQuizDifficulty;
  type: "mcq" | "true_false";
  prompt: string;
  options: string[];
  /** Included for enrolled LMS feedback; still validated server-side on submit. */
  correctIndex: number;
  explanation: string;
  sortOrder: number;
};

export type LessonQuizPayload = {
  lesson: {
    videoId: string;
    moduleId: string;
    title: string;
    unitTitle: string;
    chapterLabel: string;
    videoSrc: string;
    captionsSrc: string;
    durationSec: number;
  };
  questions: QuizQuestionDto[];
  counts: { total: number; easy: number; medium: number; hard: number };
};

export async function ensureA1LessonSeeded() {
  const lesson = await LearnLesson.findOneAndUpdate(
    { moduleId: "A1" },
    { $set: A1_LESSON_SEED },
    { upsert: true, returnDocument: "after" },
  );

  const keepIds = A1_QUIZ_SEED.map((q) => q.questionId);

  for (const q of A1_QUIZ_SEED) {
    await LearnQuizQuestion.findOneAndUpdate(
      { questionId: q.questionId },
      {
        $set: {
          ...q,
          videoId: A1_VIDEO_ID,
          moduleId: "A1",
          lesson: lesson!._id,
          active: true,
        },
      },
      { upsert: true },
    );
  }

  await LearnQuizQuestion.updateMany(
    { moduleId: "A1", questionId: { $nin: keepIds } },
    { $set: { active: false } },
  );

  return lesson!;
}

export async function ensureA2LessonSeeded() {
  const lesson = await LearnLesson.findOneAndUpdate(
    { moduleId: "A2" },
    { $set: A2_LESSON_SEED },
    { upsert: true, returnDocument: "after" },
  );

  const keepIds = A2_QUIZ_SEED.map((q) => q.questionId);

  for (const q of A2_QUIZ_SEED) {
    await LearnQuizQuestion.findOneAndUpdate(
      { questionId: q.questionId },
      {
        $set: {
          ...q,
          videoId: A2_VIDEO_ID,
          moduleId: "A2",
          lesson: lesson!._id,
          active: true,
        },
      },
      { upsert: true },
    );
  }

  await LearnQuizQuestion.updateMany(
    { moduleId: "A2", questionId: { $nin: keepIds } },
    { $set: { active: false } },
  );

  return lesson!;
}

export async function ensureA3LessonSeeded() {
  const lesson = await LearnLesson.findOneAndUpdate(
    { moduleId: "A3" },
    { $set: A3_LESSON_SEED },
    { upsert: true, returnDocument: "after" },
  );

  const keepIds = A3_QUIZ_SEED.map((q) => q.questionId);

  for (const q of A3_QUIZ_SEED) {
    await LearnQuizQuestion.findOneAndUpdate(
      { questionId: q.questionId },
      {
        $set: {
          ...q,
          videoId: A3_VIDEO_ID,
          moduleId: "A3",
          lesson: lesson!._id,
          active: true,
        },
      },
      { upsert: true },
    );
  }

  await LearnQuizQuestion.updateMany(
    { moduleId: "A3", questionId: { $nin: keepIds } },
    { $set: { active: false } },
  );

  return lesson!;
}

export async function ensureA4LessonSeeded() {
  const lesson = await LearnLesson.findOneAndUpdate(
    { moduleId: "A4" },
    { $set: A4_LESSON_SEED },
    { upsert: true, returnDocument: "after" },
  );

  const keepIds = A4_QUIZ_SEED.map((q) => q.questionId);

  for (const q of A4_QUIZ_SEED) {
    await LearnQuizQuestion.findOneAndUpdate(
      { questionId: q.questionId },
      {
        $set: {
          ...q,
          videoId: A4_VIDEO_ID,
          moduleId: "A4",
          lesson: lesson!._id,
          active: true,
        },
      },
      { upsert: true },
    );
  }

  await LearnQuizQuestion.updateMany(
    { moduleId: "A4", questionId: { $nin: keepIds } },
    { $set: { active: false } },
  );

  return lesson!;
}

/** Durations of published lesson videos beyond the hand-seeded A1–A4. */
const PUBLISHED_VIDEO_SECONDS: Record<string, number> = { A5: 211 };

/** Seed lesson + quiz for any module in the shared content bank (A5+, B*, C*). */
export async function ensureBankLessonSeeded(moduleId: string) {
  const id = moduleId.trim().toUpperCase();
  const content = getLessonContent(id);
  const meta = getLessonMeta(id);
  if (!content?.quiz.length || !meta) return null;

  const videoSeconds = PUBLISHED_VIDEO_SECONDS[id] ?? 0;
  const hasVideo = hasLessonVideo(id) && videoSeconds > 0;
  const videoId = `vid_${id.toLowerCase()}_${meta.slug}`;

  const lesson = await LearnLesson.findOneAndUpdate(
    { moduleId: id },
    {
      $set: {
        videoId,
        moduleId: id,
        title: meta.title,
        unitId: meta.unitId,
        unitTitle: meta.unitTitle,
        trackId: meta.trackId,
        chapterLabel: meta.chapterLabel,
        level: meta.level,
        videoSrc: hasVideo ? `/learn/lessons/${id}.mp4` : "",
        captionsSrc: hasVideo ? `/learn/lessons/${id}.vtt` : "",
        durationSec: videoSeconds,
        status: "published",
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  const keepIds: string[] = [];
  for (const [i, q] of content.quiz.entries()) {
    const questionId = `${id}-Q${String(i + 1).padStart(2, "0")}`;
    keepIds.push(questionId);
    await LearnQuizQuestion.findOneAndUpdate(
      { questionId },
      {
        $set: {
          ...q,
          questionId,
          sortOrder: i + 1,
          videoId,
          moduleId: id,
          lesson: lesson!._id,
          active: true,
        },
      },
      { upsert: true },
    );
  }

  await LearnQuizQuestion.updateMany(
    { moduleId: id, questionId: { $nin: keepIds } },
    { $set: { active: false } },
  );

  return lesson!;
}

export async function getLessonQuizForParent(
  userId: string,
  moduleId: string,
): Promise<LessonQuizPayload> {
  const enrollment = await getParentStarterEnrollment(userId);
  if (!enrollment) {
    throw Object.assign(new Error("Enroll in Mentr Learn to take quizzes"), {
      status: 403,
    });
  }

  const id = moduleId.trim().toUpperCase();
  if (id === "A1") {
    await ensureA1LessonSeeded();
  } else if (id === "A2") {
    await ensureA2LessonSeeded();
  } else if (id === "A3") {
    await ensureA3LessonSeeded();
  } else if (id === "A4") {
    await ensureA4LessonSeeded();
  } else {
    await ensureBankLessonSeeded(id);
  }

  const lesson = await LearnLesson.findOne({
    moduleId: id,
    status: "published",
  }).lean();
  if (!lesson) {
    throw Object.assign(new Error("Lesson not found"), { status: 404 });
  }

  const rows = await LearnQuizQuestion.find({
    moduleId: id,
    videoId: lesson.videoId,
    active: true,
  })
    .sort({ sortOrder: 1 })
    .lean();

  if (rows.length === 0) {
    throw Object.assign(new Error("Quiz not ready for this lesson yet"), {
      status: 404,
    });
  }

  const questions: QuizQuestionDto[] = rows.map((q) => ({
    questionId: q.questionId,
    videoId: q.videoId,
    moduleId: q.moduleId,
    difficulty: q.difficulty,
    type: q.type,
    prompt: q.prompt,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    sortOrder: q.sortOrder,
  }));

  const counts = {
    total: questions.length,
    easy: questions.filter((q) => q.difficulty === "easy").length,
    medium: questions.filter((q) => q.difficulty === "medium").length,
    hard: questions.filter((q) => q.difficulty === "hard").length,
  };

  return {
    lesson: {
      videoId: lesson.videoId,
      moduleId: lesson.moduleId,
      title: lesson.title,
      unitTitle: lesson.unitTitle,
      chapterLabel: lesson.chapterLabel,
      videoSrc: lesson.videoSrc,
      captionsSrc: lesson.captionsSrc,
      durationSec: lesson.durationSec,
    },
    questions,
    counts,
  };
}

export async function submitLessonQuiz(
  userId: string,
  moduleId: string,
  answers: { questionId: string; selectedIndex: number }[],
) {
  const enrollment = await getParentStarterEnrollment(userId);
  if (!enrollment) {
    throw Object.assign(new Error("Enroll in Mentr Learn to take quizzes"), {
      status: 403,
    });
  }

  const id = moduleId.trim().toUpperCase();
  if ((enrollment.progress.quizzesCompleted ?? []).includes(id)) {
    throw Object.assign(new Error("Quiz already completed — no retakes"), {
      status: 409,
    });
  }

  const quiz = await getLessonQuizForParent(userId, moduleId);
  const byId = new Map(quiz.questions.map((q) => [q.questionId, q]));

  let correct = 0;
  const details = answers.map((a) => {
    const q = byId.get(a.questionId);
    if (!q) {
      return {
        questionId: a.questionId,
        correct: false,
        selectedIndex: a.selectedIndex,
        correctIndex: -1,
        explanation: "Unknown question",
        difficulty: "easy" as LearnQuizDifficulty,
      };
    }
    const ok = a.selectedIndex === q.correctIndex;
    if (ok) correct += 1;
    return {
      questionId: q.questionId,
      correct: ok,
      selectedIndex: a.selectedIndex,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      difficulty: q.difficulty,
    };
  });

  const total = quiz.questions.length;
  const wrong = Math.max(0, total - correct);

  return {
    videoId: quiz.lesson.videoId,
    moduleId: quiz.lesson.moduleId,
    total,
    answered: answers.length,
    correct,
    wrong,
    scorePercent: total ? Math.round((correct / total) * 100) : 0,
    details,
  };
}
