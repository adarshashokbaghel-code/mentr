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
import { getAdminLearnTrack } from "../services/admin-learn";
import {
  LEARN_TRACKS,
  type LearnTrackId,
} from "../lib/learn-course";
import type { MessengerTemplateId } from "../services/email-templates";

const router = Router();

router.use(ensureDb);
router.use(requireAdminKey);

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
    const limit = Math.min(parseInt(String(req.query.limit || "40"), 10) || 40, 100);
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
    const limit = Math.min(parseInt(String(req.query.limit || "500"), 10) || 500, 1000);
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

export default router;
