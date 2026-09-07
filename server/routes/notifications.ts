import { Router, Response } from "express";
import { Notification } from "../models/Notification";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";

const router = Router();

router.use(ensureDb);
router.use(requireAuth);

function serialize(n: {
  _id: { toString(): string };
  type: string;
  title: string;
  body: string;
  href?: string;
  meta: Record<string, unknown>;
  readAt?: Date;
  createdAt: Date;
}) {
  return {
    id: n._id.toString(),
    type: n.type,
    title: n.title,
    body: n.body,
    href: n.href ?? "/parent/dashboard",
    meta: n.meta,
    read: Boolean(n.readAt),
    createdAt: n.createdAt,
  };
}

/** Parent: in-app notification feed */
router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Only parent accounts have notifications" });
      return;
    }

    const limit = Math.min(Number(req.query.limit) || 30, 50);
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: req.auth!.sub })
        .sort({ createdAt: -1 })
        .limit(limit),
      Notification.countDocuments({
        user: req.auth!.sub,
        readAt: { $exists: false },
      }),
    ]);

    res.json({
      notifications: notifications.map(serialize),
      unreadCount,
    });
  } catch (error) {
    console.error("list notifications error:", error);
    res.status(500).json({ error: "Failed to load notifications" });
  }
});

router.post("/read-all", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Only parent accounts have notifications" });
      return;
    }

    const now = new Date();
    await Notification.updateMany(
      { user: req.auth!.sub, readAt: { $exists: false } },
      { $set: { readAt: now } },
    );

    res.json({ message: "All notifications marked read", unreadCount: 0 });
  } catch (error) {
    console.error("read all notifications error:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

router.post("/:id/read", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Only parent accounts have notifications" });
      return;
    }

    const id = String(req.params.id || "");
    if (!/^[a-f\d]{24}$/i.test(id)) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.auth!.sub },
      { $set: { readAt: new Date() } },
      { new: true },
    );

    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    const unreadCount = await Notification.countDocuments({
      user: req.auth!.sub,
      readAt: { $exists: false },
    });

    res.json({ notification: serialize(notification), unreadCount });
  } catch (error) {
    console.error("read notification error:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

export default router;
