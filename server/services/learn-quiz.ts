import { A1_LESSON_SEED, A1_QUIZ_SEED, A1_VIDEO_ID } from "../lib/learn-a1-quiz-seed";
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

  return {
    videoId: quiz.lesson.videoId,
    moduleId: quiz.lesson.moduleId,
    total: quiz.questions.length,
    answered: answers.length,
    correct,
    scorePercent: quiz.questions.length
      ? Math.round((correct / quiz.questions.length) * 100)
      : 0,
    details,
  };
}
