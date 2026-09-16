import { Router } from "express";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import {
  enrollParentInStarter,
  getParentStarterEnrollment,
} from "../services/learn-enroll";
import { getPotdCalendar, getPotdForDateKey, getPotdMonth, getTodayPotd, recordPotdAttempt } from "../services/learn-potd";
import { recordBuildComplete } from "../services/learn-build";
import {
  recordDailyCheckIn,
  recordLearnProgressEvent,
} from "../services/learn-progress";
import {
  getLessonQuizForParent,
  submitLessonQuiz,
} from "../services/learn-quiz";
import {
  getPracticeAnswersForUser,
  submitPracticeAttempt,
} from "../services/learn-practice";
import { getLearnLeaderboard } from "../services/learn-leaderboard";
import { getLearnStats } from "../services/learn-stats";
import { serializeUser } from "./auth";

const router = Router();

router.use(ensureDb);
router.use(requireAuth);

function requireParent(
  req: AuthenticatedRequest,
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  if (req.auth!.role !== "parent") {
    res.status(403).json({ error: "Parent account required" });
    return false;
  }
  return true;
}

router.get("/enrollment", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const enrollment = await getParentStarterEnrollment(req.auth!.sub);
    res.json({ enrollment });
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn enrollment get error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load enrollment",
    });
  }
});

router.post("/enroll", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const { enrollment, created, user } = await enrollParentInStarter(
      req.auth!.sub,
    );
    res.status(created ? 201 : 200).json({
      enrollment,
      created,
      user: serializeUser(user),
      message: created
        ? "Enrolled in Mentr Starter"
        : "Already enrolled in Mentr Starter",
    });
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn enroll error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Enrollment failed",
    });
  }
});

/** Daily login check-in — drives streak +0.5 XP once per IST day. */
router.post("/check-in", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const result = await recordDailyCheckIn(req.auth!.sub);
    res.json(result);
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn check-in error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Check-in failed",
    });
  }
});

router.get("/stats", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    res.json(await getLearnStats(req.auth!.sub));
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn stats error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load stats",
    });
  }
});

router.get("/leaderboard", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const limit = Math.min(100, Math.max(10, Number(req.query.limit) || 100));
    res.json(await getLearnLeaderboard(req.auth!.sub, limit));
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn leaderboard error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load leaderboard",
    });
  }
});

router.post("/progress", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const moduleId = String(req.body?.moduleId || "");
    const event = req.body?.event;
    if (event !== "video_complete" && event !== "quiz_complete") {
      res.status(400).json({ error: "Invalid progress event" });
      return;
    }
    const enrollment = await recordLearnProgressEvent(req.auth!.sub, {
      moduleId,
      event,
      quizScore: req.body?.quizScore,
    });
    res.json({ enrollment });
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn progress error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to save progress",
    });
  }
});

router.get("/practice/answers", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    res.json(await getPracticeAnswersForUser(req.auth!.sub));
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Practice answers error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load practice",
    });
  }
});

router.post("/practice/attempt", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const questionId = String(req.body?.questionId || "");
    const selectedIndex = Number(req.body?.selectedIndex);
    if (!questionId || !Number.isFinite(selectedIndex)) {
      res.status(400).json({ error: "questionId and selectedIndex required" });
      return;
    }
    res.json(
      await submitPracticeAttempt(req.auth!.sub, {
        questionId,
        selectedIndex,
      }),
    );
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Practice attempt error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to save practice",
    });
  }
});

router.get("/lessons/:moduleId/quiz", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const moduleId = String(req.params.moduleId || "");
    const quiz = await getLessonQuizForParent(req.auth!.sub, moduleId);
    res.json(quiz);
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn quiz get error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load quiz",
    });
  }
});

router.post(
  "/lessons/:moduleId/quiz/submit",
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!requireParent(req, res)) return;
      const moduleId = String(req.params.moduleId || "");
      const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
      const result = await submitLessonQuiz(req.auth!.sub, moduleId, answers);
      const enrollment = await recordLearnProgressEvent(req.auth!.sub, {
        moduleId,
        event: "quiz_complete",
        quizScore: {
          correct: result.correct,
          total: result.total,
          wrong: result.wrong,
        },
      });
      res.json({ ...result, enrollment });
    } catch (err) {
      const status = (err as { status?: number }).status || 500;
      console.error("Learn quiz submit error:", err);
      res.status(status).json({
        error: err instanceof Error ? err.message : "Failed to submit quiz",
      });
    }
  },
);

router.get("/potd/today", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    res.json(await getTodayPotd(req.auth!.sub));
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("POTD today error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load POTD",
    });
  }
});

router.get("/potd/date", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const dateKey = String(req.query.date || "");
    res.json(await getPotdForDateKey(dateKey, req.auth!.sub));
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("POTD date error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load POTD",
    });
  }
});

router.get("/potd/month", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const now = new Date();
    const year = Number(req.query.year || now.getUTCFullYear());
    const month = Number(req.query.month || now.getUTCMonth() + 1);
    res.json(await getPotdMonth(req.auth!.sub, year, month));
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("POTD month error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load calendar",
    });
  }
});

router.get("/potd/calendar", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    res.json(await getPotdCalendar(req.auth!.sub));
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("POTD calendar error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load calendar",
    });
  }
});

router.post("/potd/attempt", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const dateKey = String(req.body?.dateKey || "");
    const selectedIndex = Number(req.body?.selectedIndex);
    if (!dateKey || !Number.isFinite(selectedIndex)) {
      res.status(400).json({ error: "dateKey and selectedIndex required" });
      return;
    }
    res.json(
      await recordPotdAttempt(req.auth!.sub, { dateKey, selectedIndex }),
    );
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("POTD attempt error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to save attempt",
    });
  }
});

router.post("/build/complete", async (req: AuthenticatedRequest, res) => {
  try {
    if (!requireParent(req, res)) return;
    const missionId = String(req.body?.missionId || "");
    const firstTry = Boolean(req.body?.firstTry);
    const attempts = Number(req.body?.attempts) || 1;
    const result = await recordBuildComplete(req.auth!.sub, {
      missionId,
      firstTry,
      attempts,
    });
    res.json(result);
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn build complete error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to save build",
    });
  }
});

export default router;
