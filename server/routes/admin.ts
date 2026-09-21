import { Router } from "express";
import { ensureDb } from "../middleware/ensure-db";
import { requireAdminKey } from "../middleware/admin-auth";
import { requireAdminPass } from "../middleware/admin-pass";
import {
  listAdminConnections,
  listAdminOtpActivity,
  listAdminProfileViews,
  listAdminRequirements,
} from "../services/admin-details";
import {
  getMessengerTemplates,
  listAdminUsers,
  previewMessengerEmail,
  searchAdminUsers,
  sendMessengerEmails,
} from "../services/admin-messenger";
import { listAdminInteractions } from "../services/admin-interactions";
import { getAdminMarketing } from "../services/admin-marketing";
import {
  createMarketingLink,
  deleteMarketingLink,
} from "../services/marketing-links";
import { getAdminStats } from "../services/admin-stats";
import { deleteAdminUser } from "../services/admin-delete-user";
import {
  getAdminLearnEnrollmentDetail,
  getAdminLearnTrack,
} from "../services/admin-learn";
import {
  getAdminFeaturedState,
  searchFacultyForFeatured,
  setFeaturedTeacherIds,
} from "../services/featured-tutors";
import {
  LEARN_TRACKS,
  type LearnTrackId,
} from "../lib/learn-course";
import type { MessengerTemplateId } from "../services/email-templates";

const router = Router();

router.use(ensureDb);
router.use(requireAdminKey);

router.get("/featured-tutors", async (_req, res) => {
  try {
    const data = await getAdminFeaturedState();
    res.json(data);
  } catch (err) {
    console.error("Admin featured tutors get error:", err);
    res.status(500).json({ error: "Failed to load featured tutors" });
  }
});

router.get("/featured-tutors/search", async (req, res) => {
  try {
    const q = String(req.query.q || "");
    const teachers = await searchFacultyForFeatured(q, 30);
    res.json({ teachers });
  } catch (err) {
    console.error("Admin featured tutors search error:", err);
    res.status(500).json({ error: "Failed to search faculty" });
  }
});

router.put("/featured-tutors", requireAdminPass, async (req, res) => {
  try {
    const ids = await setFeaturedTeacherIds(req.body?.ids);
    const data = await getAdminFeaturedState();
    res.json({ ...data, ids });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save featured tutors";
    console.error("Admin featured tutors save error:", err);
    res.status(400).json({ error: message });
  }
});

router.get("/stats", async (_req, res) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
});

router.get("/users/search", async (req, res) => {
  try {
    const q = String(req.query.q || "");
    const limit = Math.min(
      parseInt(String(req.query.limit || "1000"), 10) || 1000,
      5000,
    );
    const roleParam = String(req.query.role || "");
    const role =
      roleParam === "faculty" || roleParam === "parent"
        ? (roleParam as "faculty" | "parent")
        : undefined;
    const users = await searchAdminUsers(q, limit, role);
    res.json({ users });
  } catch (err) {
    console.error("Admin user search error:", err);
    res.status(500).json({ error: "Failed to search users" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const q = String(req.query.q || "");
    const limit = Math.min(
      parseInt(String(req.query.limit || "1000"), 10) || 1000,
      5000,
    );
    const users = await listAdminUsers(q, limit);
    res.json({ users, total: users.length });
  } catch (err) {
    console.error("Admin users list error:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

router.delete("/users/:id", requireAdminPass, async (req, res) => {
  try {
    const id = String(req.params.id || "");
    const result = await deleteAdminUser(id);
    if ("error" in result) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.json(result);
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/requirements", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "200"), 10) || 200, 500);
    const posts = await listAdminRequirements(limit);
    res.json({ posts, total: posts.length });
  } catch (err) {
    console.error("Admin requirements list error:", err);
    res.status(500).json({ error: "Failed to load board posts" });
  }
});

router.get("/connections", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "200"), 10) || 200, 500);
    const connections = await listAdminConnections(limit);
    res.json({ connections, total: connections.length });
  } catch (err) {
    console.error("Admin connections list error:", err);
    res.status(500).json({ error: "Failed to load connections" });
  }
});

router.get("/engagement/profile-views", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "200"), 10) || 200, 500);
    const views = await listAdminProfileViews(limit);
    res.json({ views, total: views.length });
  } catch (err) {
    console.error("Admin profile views error:", err);
    res.status(500).json({ error: "Failed to load profile views" });
  }
});

router.get("/engagement/otp", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "100"), 10) || 100, 300);
    const sessions = await listAdminOtpActivity(limit);
    res.json({ sessions, total: sessions.length });
  } catch (err) {
    console.error("Admin OTP activity error:", err);
    res.status(500).json({ error: "Failed to load OTP activity" });
  }
});

router.get("/interactions", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "300"), 10) || 300, 500);
    const data = await listAdminInteractions(limit);
    res.json(data);
  } catch (err) {
    console.error("Admin interactions error:", err);
    res.status(500).json({ error: "Failed to load user interactions" });
  }
});

router.get("/marketing", async (_req, res) => {
  try {
    const marketing = await getAdminMarketing();
    res.json(marketing);
  } catch (err) {
    console.error("Admin marketing error:", err);
    res.status(500).json({ error: "Failed to load marketing stats" });
  }
});

router.post("/marketing/links", requireAdminPass, async (req, res) => {
  try {
    const link = await createMarketingLink({
      channel: req.body?.channel,
      label: req.body?.label,
      path: req.body?.path,
      slug: req.body?.slug,
      note: req.body?.note,
    });
    res.status(201).json({ link });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create marketing link";
    console.error("Admin marketing link create error:", err);
    res.status(400).json({ error: message });
  }
});

router.delete("/marketing/links/:id", requireAdminPass, async (req, res) => {
  try {
    const ok = await deleteMarketingLink(String(req.params.id || ""));
    if (!ok) {
      res.status(404).json({ error: "Link not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Admin marketing link delete error:", err);
    res.status(500).json({ error: "Failed to delete marketing link" });
  }
});

router.get("/learn/:track", async (req, res) => {
  try {
    const track = String(req.params.track || "") as LearnTrackId;
    if (!LEARN_TRACKS.includes(track)) {
      res.status(400).json({
        error: "Unknown track. Use class-3-5, class-6-8, or class-9-12.",
      });
      return;
    }
    const data = await getAdminLearnTrack(track);
    res.json(data);
  } catch (err) {
    console.error("Admin learn track error:", err);
    res.status(500).json({ error: "Failed to load Learn enrollments" });
  }
});

router.get("/learn/:track/user/:userId", async (req, res) => {
  try {
    const track = String(req.params.track || "") as LearnTrackId;
    const userId = String(req.params.userId || "");
    if (!LEARN_TRACKS.includes(track) || !userId) {
      res.status(400).json({ error: "Invalid track or user" });
      return;
    }
    const data = await getAdminLearnEnrollmentDetail(track, userId);
    res.json(data);
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Admin learn detail error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load detail",
    });
  }
});

router.get("/messenger/templates", (_req, res) => {
  res.json({ templates: getMessengerTemplates() });
});

router.post("/messenger/preview", (req, res) => {
  try {
    const templateId = String(req.body.templateId || "") as MessengerTemplateId;
    const name = req.body.name ? String(req.body.name) : undefined;
    const referralUrl = req.body.referralUrl ? String(req.body.referralUrl) : undefined;
    const role =
      req.body.role === "parent" || req.body.role === "faculty"
        ? req.body.role
        : undefined;
    const preview = previewMessengerEmail(templateId, { name, referralUrl, role });
    res.json(preview);
  } catch (err) {
    console.error("Admin messenger preview error:", err);
    res.status(400).json({
      error: err instanceof Error ? err.message : "Preview failed",
    });
  }
});

router.post("/messenger/send", requireAdminPass, async (req, res) => {
  try {
    const templateId = String(req.body.templateId || "") as MessengerTemplateId;
    const userIds = Array.isArray(req.body.userIds)
      ? req.body.userIds.map(String).filter(Boolean)
      : [];

    if (userIds.length === 0) {
      res.status(400).json({ error: "Select at least one user" });
      return;
    }

    const result = await sendMessengerEmails(templateId, userIds);
    res.json(result);
  } catch (err) {
    console.error("Admin messenger send error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Send failed",
    });
  }
});

/* ── Snap & Grade ─────────────────────────────────────────────── */

router.get("/snap-grade/questions", async (_req, res) => {
  try {
    const { ensureSnapGradeSeed } = await import("../services/snap-grade-seed");
    const { SnapGradeQuestion, SnapGradeEvaluation } = await import(
      "../models/SnapGrade"
    );
    try {
      await ensureSnapGradeSeed();
    } catch (seedErr) {
      console.warn("[admin snap-grade] seed skipped/failed:", seedErr);
    }
    const [questions, evalCount] = await Promise.all([
      SnapGradeQuestion.find().sort({ sortOrder: 1 }),
      SnapGradeEvaluation.countDocuments(),
    ]);
    res.json({
      evalCount,
      questions: questions.map((q) => ({
        id: q._id.toString(),
        board: q.board,
        classLevel: q.classLevel,
        subject: q.subject,
        chapterNumber: q.chapterNumber,
        chapterName: q.chapterName,
        exercise: q.exercise,
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        referenceNotes: q.referenceNotes || "",
        maxMarks: q.maxMarks,
        rubric: q.rubric,
        markingSchemeNotes: q.markingSchemeNotes,
        weightSource: q.weightSource || "practice_cbse",
        adminLocked: Boolean(q.adminLocked),
        creditsCost: q.creditsCost,
        active: q.active,
        sortOrder: q.sortOrder,
        updatedAt: q.updatedAt,
      })),
    });
  } catch (err) {
    console.error("Admin snap-grade list error:", err);
    res.status(500).json({ error: "Failed to load Snap & Grade bank" });
  }
});

router.put(
  "/snap-grade/questions/:id",
  requireAdminPass,
  async (req, res) => {
    try {
      const { SnapGradeQuestion } = await import("../models/SnapGrade");
      const q = await SnapGradeQuestion.findById(req.params.id);
      if (!q) {
        res.status(404).json({ error: "Question not found" });
        return;
      }

      if (Array.isArray(req.body?.rubric)) {
        q.rubric = req.body.rubric.map(
          (s: {
            id?: string;
            label?: string;
            marks?: number;
            criteria?: string;
          }) => ({
            id: String(s.id || "").trim() || "s1",
            label: String(s.label || "").trim(),
            marks: Number(s.marks) || 0,
            criteria: String(s.criteria || "").trim(),
          }),
        );
        q.maxMarks = q.rubric.reduce(
          (a: number, s: { marks: number }) => a + s.marks,
          0,
        );
        q.weightSource = "admin_curated";
        q.adminLocked = true;
      }
      if (typeof req.body?.markingSchemeNotes === "string") {
        q.markingSchemeNotes = req.body.markingSchemeNotes.trim();
        q.adminLocked = true;
        if (q.weightSource === "practice_cbse") q.weightSource = "admin_curated";
      }
      if (typeof req.body?.referenceNotes === "string") {
        q.referenceNotes = req.body.referenceNotes.trim();
      }
      if (typeof req.body?.questionText === "string") {
        q.questionText = req.body.questionText.trim();
      }
      if (typeof req.body?.creditsCost === "number") {
        q.creditsCost = Math.max(1, Math.floor(req.body.creditsCost));
      }
      if (typeof req.body?.active === "boolean") {
        q.active = req.body.active;
      }
      if (typeof req.body?.adminLocked === "boolean") {
        q.adminLocked = req.body.adminLocked;
        if (!req.body.adminLocked && q.weightSource === "admin_curated") {
          q.weightSource = "practice_cbse";
        }
      }

      await q.save();
      res.json({
        message: "Rubric updated",
        question: {
          id: q._id.toString(),
          maxMarks: q.maxMarks,
          rubric: q.rubric,
          markingSchemeNotes: q.markingSchemeNotes,
          referenceNotes: q.referenceNotes,
          questionText: q.questionText,
          creditsCost: q.creditsCost,
          active: q.active,
          weightSource: q.weightSource,
          adminLocked: q.adminLocked,
        },
      });
    } catch (err) {
      console.error("Admin snap-grade update error:", err);
      res.status(500).json({ error: "Failed to update question" });
    }
  },
);

router.get("/snap-grade/evaluations", async (req, res) => {
  try {
    const { SnapGradeEvaluation } = await import("../models/SnapGrade");
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const rows = await SnapGradeEvaluation.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "email role")
      .populate(
        "question",
        "classLevel chapterNumber chapterName exercise questionNumber subject maxMarks",
      );
    res.json({
      evaluations: rows.map((e) => {
        const user = e.user as unknown as {
          email?: string;
          role?: string;
        } | null;
        const question = e.question as unknown as {
          classLevel?: number;
          chapterNumber?: number;
          exercise?: string;
          questionNumber?: string;
          subject?: string;
          chapterName?: string;
          maxMarks?: number;
        } | null;
        return {
          id: e._id.toString(),
          marksAwarded: e.marksAwarded,
          maxMarks: e.maxMarks,
          creditsDeducted: e.creditsDeducted,
          overallFeedback: e.overallFeedback,
          steps: e.steps,
          imageUrl: e.imageUrl,
          model: e.aiModel,
          createdAt: e.createdAt,
          userEmail: user?.email || "—",
          userRole: user?.role || "—",
          classLevel: question?.classLevel ?? null,
          chapterNumber: question?.chapterNumber ?? null,
          exercise: question?.exercise ?? null,
          questionLabel: question
            ? `Class ${question.classLevel} · Ch${question.chapterNumber} · Ex ${question.exercise} Q${question.questionNumber}`
            : "—",
        };
      }),
    });
  } catch (err) {
    console.error("Admin snap-grade evaluations error:", err);
    res.status(500).json({ error: "Failed to load evaluations" });
  }
});

export default router;
