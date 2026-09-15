import { emptyLearnProgress } from "../lib/learn-course";
import { User } from "../models/User";
import { getParentStarterEnrollment } from "./learn-enroll";

function uniqPush(list: string[] | undefined, id: string): string[] {
  const next = [...(list ?? [])];
  if (!next.includes(id)) next.push(id);
  return next;
}

export async function recordLearnProgressEvent(
  userId: string,
  input: {
    moduleId: string;
    event: "video_complete" | "quiz_complete";
    quizScore?: { correct: number; total: number };
  },
) {
  const enrollment = await getParentStarterEnrollment(userId);
  if (!enrollment) {
    throw Object.assign(new Error("Enroll in Mentr Learn first"), {
      status: 403,
    });
  }

  const user = await User.findById(userId);
  if (!user?.learn?.starter) {
    throw Object.assign(new Error("Enrollment missing"), { status: 404 });
  }

  const moduleId = input.moduleId.trim().toUpperCase();
  const progress = {
    ...emptyLearnProgress(),
    ...(user.learn.starter.progress || {}),
  };

  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const lastDay = progress.lastActivityAt?.slice(0, 10);
  if (lastDay && lastDay !== today) {
    progress.streakDays = (progress.streakDays || 0) + 1;
  } else if (!lastDay) {
    progress.streakDays = Math.max(progress.streakDays || 0, 1);
  }

  progress.lastActivityAt = now;
  progress.currentModuleId = moduleId;

  if (input.event === "video_complete") {
    progress.videosWatched = uniqPush(progress.videosWatched, moduleId);
    progress.xp = (progress.xp || 0) + 10;
  }

  if (input.event === "quiz_complete") {
    progress.quizzesCompleted = uniqPush(progress.quizzesCompleted, moduleId);
    progress.modulesCompleted = uniqPush(progress.modulesCompleted, moduleId);
    const bonus =
      input.quizScore && input.quizScore.total > 0
        ? Math.round((input.quizScore.correct / input.quizScore.total) * 20)
        : 10;
    progress.xp = (progress.xp || 0) + 15 + bonus;
  }

  user.learn.starter.progress = progress;
  user.markModified("learn");
  await user.save();

  return getParentStarterEnrollment(userId);
}
