import { Router, Response } from "express";
import { ProfileView } from "../models/ProfileView";
import { User, type IUser } from "../models/User";
import {
  NO_CONNECTION,
  toPublicTeacher,
  viewerConnections,
} from "../serialize-teacher";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { isProfileComplete } from "../lib/profile-complete";

const router = Router();

router.use(ensureDb);

/** Public SEO profile — no auth, no phone number. Must stay above requireAuth. */
router.get("/public/:id", async (req, res: Response) => {
  try {
    const id = String(req.params.id || "");
    if (!/^[a-f\d]{24}$/i.test(id)) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    const user = await User.findById(id).lean();
    if (!user || user.role === "parent" || !isProfileComplete(user)) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    const teacher = toPublicTeacher(user, NO_CONNECTION);
    res.json({ teacher: JSON.parse(JSON.stringify(teacher)) });
  } catch (error) {
    console.error("public teacher error:", error);
    res.status(500).json({ error: "Failed to load teacher" });
  }
});

// Teacher data (names, phone numbers, availability) is for signed-in
// users only — the find-teachers experience is fully login-gated.
router.use(requireAuth);

/** Fire-and-forget: bump the (teacher, viewer) row when a parent looks. */
async function recordProfileView(teacherId: string, viewerId: string) {
  const viewer = await User.findById(viewerId);
  if (!viewer || viewer.role !== "parent" || !viewer.parentProfile?.name) {
    return;
  }
  await ProfileView.updateOne(
    { teacher: teacherId, viewer: viewerId },
    {
      $set: {
        viewerName: viewer.parentProfile.name,
        viewerArea:
          viewer.parentProfile.area || viewer.parentProfile.city || undefined,
        lastViewedAt: new Date(),
      },
      $inc: { count: 1 },
    },
    { upsert: true },
  );
}

router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find({
      role: { $ne: "parent" },
      "profile.name": { $exists: true, $ne: "" },
    })
      .sort({ createdAt: -1 })
      .limit(200);

    const complete = users.filter((u: IUser) => isProfileComplete(u));
    const connections = await viewerConnections(
      req.auth!.sub,
      req.auth!.role,
      complete,
    );

    const teachers = complete.map((u: IUser) =>
      toPublicTeacher(u, connections.get(u._id.toString())),
    );

    res.json({ teachers });
  } catch (error) {
    console.error("list teachers error:", error);
    res.status(500).json({ error: "Failed to load teachers" });
  }
});

router.get("/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id || "");
    if (!/^[a-f\d]{24}$/i.test(id)) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    const user = await User.findById(id);
    if (!user || user.role === "parent" || !isProfileComplete(user)) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    if (req.auth && req.auth.sub !== id) {
      recordProfileView(id, req.auth.sub).catch((err) =>
        console.error("record profile view error:", err),
      );
    }

    const connections = await viewerConnections(req.auth!.sub, req.auth!.role, [
      user,
    ]);
    res.json({
      teacher: toPublicTeacher(user, connections.get(user._id.toString())),
    });
  } catch (error) {
    console.error("get teacher error:", error);
    res.status(500).json({ error: "Failed to load teacher" });
  }
});

export default router;
