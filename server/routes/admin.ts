import { Router } from "express";
import { ensureDb } from "../middleware/ensure-db";
import { requireAdminKey } from "../middleware/admin-auth";
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
import { getAdminStats } from "../services/admin-stats";
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

router.post("/messenger/send", async (req, res) => {
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
