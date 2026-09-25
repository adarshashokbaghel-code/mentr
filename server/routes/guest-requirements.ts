import { Router, Request, Response } from "express";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import {
  GUEST_REQUIREMENT_STATUSES,
  NotLoggedInRequirement,
  type GuestActivityAction,
  type GuestRequirementStatus,
  type INotLoggedInRequirement,
} from "../models/NotLoggedInRequirement";
import { User } from "../models/User";
import { isMentrPremiumActive } from "../services/premium-mentor-billing";
import { notifyFacultyGuestRequirement } from "../services/guest-requirement-notify";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s-]{10,15}$/;
const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_MAX = 6;
const ipHits = new Map<string, number[]>();

function ipLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (hits.length >= IP_MAX) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function pushActivity(
  row: INotLoggedInRequirement,
  action: GuestActivityAction,
) {
  row.activity.push({ action, at: new Date() });
}

function serialize(row: INotLoggedInRequirement) {
  return {
    id: row._id.toString(),
    name: row.name,
    email: row.email,
    phone: row.phone,
    requirement: row.requirement,
    description: row.description,
    status: row.status,
    teacherName: row.teacherName,
    teacherId: row.teacher.toString(),
    activity: (row.activity ?? []).map((a) => ({
      action: a.action,
      at: a.at instanceof Date ? a.at.toISOString() : String(a.at),
    })),
    respondedAt: row.respondedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** POST / — public: guest → Premium mentor requirement */
router.post("/", ensureDb, async (req: Request, res: Response) => {
  try {
    if (ipLimited(req.ip ?? "unknown")) {
      res.status(429).json({ error: "Too many submissions. Try again later." });
      return;
    }

    const teacherId = clip(req.body?.teacherId, 40);
    const name = clip(req.body?.name, 80);
    const email = clip(req.body?.email, 160).toLowerCase();
    const phone = clip(req.body?.phone, 20);
    const requirement = clip(req.body?.requirement, 120);
    const description = clip(req.body?.description, 1000);

    if (!teacherId) {
      res.status(400).json({ error: "Mentor is required" });
      return;
    }
    if (!name) {
      res.status(400).json({ error: "Add your name" });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Enter a valid email" });
      return;
    }
    if (!PHONE_RE.test(phone)) {
      res.status(400).json({ error: "Enter a valid phone number" });
      return;
    }
    if (requirement.length < 3) {
      res.status(400).json({ error: "Add a short requirement (subject / class)" });
      return;
    }
    if (description.length < 10) {
      res.status(400).json({
        error: "Add a few more details so the mentor knows what you need",
      });
      return;
    }

    const teacher = await User.findById(teacherId).select(
      "role email profile.name mentrPremium premiumMentorStatus",
    );
    if (!teacher || teacher.role !== "faculty") {
      res.status(404).json({ error: "Mentor not found" });
      return;
    }
    if (!isMentrPremiumActive(teacher)) {
      res.status(400).json({
        error: "Guest requirements are only available for Premium mentors",
      });
      return;
    }

    const teacherName = teacher.profile?.name?.trim() || "Mentor";
    const now = new Date();

    const row = await NotLoggedInRequirement.create({
      teacher: teacher._id,
      teacherName,
      name,
      email,
      phone,
      requirement,
      description,
      status: "new",
      activity: [{ action: "created", at: now }],
    });

    void notifyFacultyGuestRequirement(row);

    res.status(201).json({
      message: "Requirement sent. The mentor can reach you by phone or email.",
      requirement: serialize(row),
    });
  } catch (err) {
    console.error("guest-requirements create error:", err);
    res.status(500).json({ error: "Could not send requirement" });
  }
});

/** GET /mine — faculty Parents reached list */
router.get(
  "/mine",
  ensureDb,
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth!.role !== "faculty") {
        res.status(403).json({ error: "Faculty only" });
        return;
      }

      const rows = await NotLoggedInRequirement.find({
        teacher: req.auth!.sub,
      })
        .sort({ createdAt: -1 })
        .limit(100);

      const newCount = rows.filter((r) => r.status === "new").length;

      res.json({
        total: rows.length,
        newCount,
        requirements: rows.map((r) => serialize(r)),
      });
    } catch (err) {
      console.error("guest-requirements mine error:", err);
      res.status(500).json({ error: "Could not load requests" });
    }
  },
);

/**
 * PATCH /:id
 * body: { action: "opened" | "not_interested" | "got_hired" }
 */
router.patch(
  "/:id",
  ensureDb,
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth!.role !== "faculty") {
        res.status(403).json({ error: "Faculty only" });
        return;
      }

      const action = String(req.body?.action || "") as GuestActivityAction;
      if (
        action !== "opened" &&
        action !== "not_interested" &&
        action !== "got_hired"
      ) {
        res.status(400).json({ error: "Invalid action" });
        return;
      }

      const row = await NotLoggedInRequirement.findOne({
        _id: req.params.id,
        teacher: req.auth!.sub,
      });
      if (!row) {
        res.status(404).json({ error: "Request not found" });
        return;
      }

      // Legacy rows may still have old statuses — normalize outcomes only.
      if (action === "opened") {
        pushActivity(row, "opened");
      } else {
        const nextStatus = action as GuestRequirementStatus;
        if (!GUEST_REQUIREMENT_STATUSES.includes(nextStatus)) {
          res.status(400).json({ error: "Invalid status" });
          return;
        }
        row.status = nextStatus;
        row.respondedAt = new Date();
        pushActivity(row, action);
      }

      await row.save();
      res.json({ requirement: serialize(row) });
    } catch (err) {
      console.error("guest-requirements patch error:", err);
      res.status(500).json({ error: "Could not update request" });
    }
  },
);

export default router;
