import { Router, Response } from "express";
import { Types } from "mongoose";
import {
  IC_LOOKING_FOR,
  IC_MODES,
  IC_TTL_MS,
  InstantConnectRequest,
  type IInstantConnectRequest,
  type IcLookingFor,
  type IcMode,
} from "../models/InstantConnectRequest";
import { User } from "../models/User";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { requireAdminKey } from "../middleware/admin-auth";
import { findTopMatches } from "../services/instant-connect-match";
import {
  canViewParentPhone,
  ensureRequestFresh,
  expireDueInstantConnectRequests,
  notifyFacultyInstantConnect,
  notifyFacultyRequestEnded,
  notifyParentInstantConnectEvent,
} from "../services/instant-connect-notify";

const router = Router();
router.use(ensureDb);

type FormBody = {
  lookingFor?: string;
  classLevel?: string;
  subject?: string;
  board?: string;
  mode?: string;
  location?: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  preferredTime?: string;
  message?: string;
};

function parseForm(body: FormBody):
  | { ok: true; data: {
      lookingFor: IcLookingFor;
      classLevel: string;
      subject: string;
      board: string;
      mode: IcMode;
      location?: string;
      budgetMin?: number;
      budgetMax?: number;
      preferredTime?: string;
      message?: string;
    } }
  | { ok: false; error: string } {
  const lookingFor = String(body.lookingFor || "").toLowerCase() as IcLookingFor;
  if (!IC_LOOKING_FOR.includes(lookingFor)) {
    return { ok: false, error: "Choose tutor, mentor, or either" };
  }
  const classLevel = String(body.classLevel || "").trim();
  const subject = String(body.subject || "").trim();
  const board = String(body.board || "").trim();
  const mode = String(body.mode || "").toLowerCase() as IcMode;
  if (!classLevel) return { ok: false, error: "Class / level is required" };
  if (!subject) return { ok: false, error: "Subject is required" };
  if (!board) return { ok: false, error: "Board / curriculum is required" };
  if (!IC_MODES.includes(mode)) return { ok: false, error: "Mode is required" };

  const location = String(body.location || "").trim() || undefined;
  if ((mode === "offline" || mode === "either") && !location) {
    return { ok: false, error: "Location is required for offline / either" };
  }

  let budgetMin: number | undefined;
  let budgetMax: number | undefined;
  if (body.budgetMin != null && String(body.budgetMin) !== "") {
    const n = Number(body.budgetMin);
    if (!Number.isNaN(n)) budgetMin = n;
  }
  if (body.budgetMax != null && String(body.budgetMax) !== "") {
    const n = Number(body.budgetMax);
    if (!Number.isNaN(n)) budgetMax = n;
  }

  return {
    ok: true,
    data: {
      lookingFor,
      classLevel: classLevel.slice(0, 40),
      subject: subject.slice(0, 60),
      board: board.slice(0, 40),
      mode,
      location: location?.slice(0, 120),
      budgetMin,
      budgetMax,
      preferredTime: String(body.preferredTime || "").trim().slice(0, 40) || undefined,
      message: String(body.message || "").trim().slice(0, 500) || undefined,
    },
  };
}

function serializeParentRow(r: IInstantConnectRequest) {
  return {
    id: r._id.toString(),
    lookingFor: r.lookingFor,
    classLevel: r.classLevel,
    subject: r.subject,
    board: r.board,
    mode: r.mode,
    location: r.location || null,
    budgetMin: r.budgetMin ?? null,
    budgetMax: r.budgetMax ?? null,
    preferredTime: r.preferredTime || null,
    message: r.message || null,
    matchedCount: r.matchedTutorIds.length,
    selectedCount: r.selectedTutorIds.length,
    status: r.status,
    createdAt: r.createdAt,
    expiresAt: r.expiresAt,
    closedAt: r.closedAt || null,
    closedBy: r.closedBy || null,
  };
}

function serializeTutorRow(
  r: IInstantConnectRequest,
  mentorId: string,
  parentPhone: string | null,
) {
  const available = canViewParentPhone(r, mentorId);
  return {
    id: r._id.toString(),
    classLevel: r.classLevel,
    subject: r.subject,
    board: r.board,
    mode: r.mode,
    location: r.location || null,
    budgetMin: r.budgetMin ?? null,
    budgetMax: r.budgetMax ?? null,
    preferredTime: r.preferredTime || null,
    message: r.message || null,
    status: r.status,
    createdAt: r.createdAt,
    expiresAt: r.expiresAt,
    closedAt: r.closedAt || null,
    parentContact: available
      ? { available: true as const, phone: parentPhone || "" }
      : { available: false as const },
  };
}

/** POST /match — top 3 public cards (guest-friendly; notify still requires parent auth) */
router.post("/match", async (req, res: Response) => {
  try {
    const parsed = parseForm(req.body || {});
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    await expireDueInstantConnectRequests();
    const matches = await findTopMatches(parsed.data, 3);
    res.json({
      matches,
      noMatch: matches.length === 0,
      form: parsed.data,
    });
  } catch (err) {
    console.error("IC match error:", err);
    res.status(500).json({ error: "Matching failed" });
  }
});

/** POST / — create active request + notify selected mentors */
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth?.role !== "parent") {
      res.status(403).json({ error: "Parents only" });
      return;
    }
    const parentId = req.auth.sub;
    const parent = await User.findById(parentId);
    if (!parent || parent.role !== "parent") {
      res.status(404).json({ error: "Parent not found" });
      return;
    }
    const phone = parent.parentProfile?.phoneNumber?.trim();
    if (!phone) {
      res.status(400).json({
        error: "Add a phone number to your parent profile before Instant Connect",
        code: "PHONE_REQUIRED",
      });
      return;
    }
    if (!req.body?.consentSharedPhone) {
      res.status(400).json({ error: "Phone sharing consent is required" });
      return;
    }

    const parsed = parseForm(req.body || {});
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const matchedIds: string[] = Array.isArray(req.body?.matchedTutorIds)
      ? req.body.matchedTutorIds.map(String)
      : [];
    const selectedIds: string[] = Array.isArray(req.body?.selectedTutorIds)
      ? req.body.selectedTutorIds.map(String)
      : [];

    if (selectedIds.length < 1 || selectedIds.length > 3) {
      res.status(400).json({ error: "Select 1–3 mentors" });
      return;
    }
    if (!selectedIds.every((id) => matchedIds.includes(id))) {
      res.status(400).json({ error: "Selected mentors must be from your matches" });
      return;
    }

    // Re-verify mentors still eligible
    const mentors = await User.find({
      _id: { $in: selectedIds },
      role: "faculty",
      emailVerified: true,
      profileCompleted: true,
    });
    if (mentors.length !== selectedIds.length) {
      res.status(400).json({ error: "One or more mentors are no longer available" });
      return;
    }

    const now = new Date();
    const doc = await InstantConnectRequest.create({
      parentId,
      ...parsed.data,
      matchedTutorIds: matchedIds.map((id) => new Types.ObjectId(id)),
      selectedTutorIds: selectedIds.map((id) => new Types.ObjectId(id)),
      notifiedTutorIds: selectedIds.map((id) => new Types.ObjectId(id)),
      status: "active",
      expiresAt: new Date(now.getTime() + IC_TTL_MS),
    });

    void notifyFacultyInstantConnect(selectedIds, doc);
    void notifyParentInstantConnectEvent(parentId, {
      type: "instant_connect_submitted",
      title: "Instant Connect request sent",
      body: `${selectedIds.length} mentor${selectedIds.length === 1 ? "" : "s"} notified for ${parsed.data.subject} · ${parsed.data.classLevel}.`,
      requestId: doc._id.toString(),
    });

    res.status(201).json({ request: serializeParentRow(doc) });
  } catch (err) {
    console.error("IC create error:", err);
    res.status(500).json({ error: "Could not create Instant Connect request" });
  }
});

/** GET /mine — parent list */
router.get("/mine", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth?.role !== "parent") {
      res.status(403).json({ error: "Parents only" });
      return;
    }
    await expireDueInstantConnectRequests();
    const rows = await InstantConnectRequest.find({ parentId: req.auth.sub })
      .sort({ createdAt: -1 })
      .limit(50);
    for (const r of rows) await ensureRequestFresh(r);
    res.json({ requests: rows.map(serializeParentRow) });
  } catch (err) {
    console.error("IC mine error:", err);
    res.status(500).json({ error: "Failed to load requests" });
  }
});

/** GET /tutor/mine — faculty inbox */
router.get(
  "/tutor/mine",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth?.role !== "faculty") {
        res.status(403).json({ error: "Faculty only" });
        return;
      }
      await expireDueInstantConnectRequests();
      const mentorId = req.auth.sub;
      const rows = await InstantConnectRequest.find({
        selectedTutorIds: mentorId,
      })
        .sort({ createdAt: -1 })
        .limit(50);

      const parentIds = [...new Set(rows.map((r) => r.parentId.toString()))];
      const parents = await User.find({ _id: { $in: parentIds } }).select(
        "parentProfile.phoneNumber",
      );
      const phoneByParent = new Map(
        parents.map((p) => [
          p._id.toString(),
          p.parentProfile?.phoneNumber?.trim() || null,
        ]),
      );

      const out = [];
      for (const r of rows) {
        await ensureRequestFresh(r);
        out.push(
          serializeTutorRow(
            r,
            mentorId,
            phoneByParent.get(r.parentId.toString()) || null,
          ),
        );
      }
      res.json({ requests: out });
    } catch (err) {
      console.error("IC tutor mine error:", err);
      res.status(500).json({ error: "Failed to load Instant Connect inbox" });
    }
  },
);

/** PATCH /tutor/accepting — toggle acceptingStudents */
router.patch(
  "/tutor/accepting",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth?.role !== "faculty") {
        res.status(403).json({ error: "Faculty only" });
        return;
      }
      const accepting = Boolean(req.body?.acceptingStudents);
      const user = await User.findById(req.auth.sub);
      if (!user?.profile) {
        res.status(400).json({ error: "Complete your profile first" });
        return;
      }
      user.profile.acceptingStudents = accepting;
      user.markModified("profile");
      await user.save();
      res.json({ acceptingStudents: accepting });
    } catch (err) {
      console.error("IC accepting toggle error:", err);
      res.status(500).json({ error: "Could not update preference" });
    }
  },
);

/** GET /admin/summary — metrics (no phones) */
router.get("/admin/summary", requireAdminKey, async (_req, res: Response) => {
  try {
    await expireDueInstantConnectRequests();
    const [total, active, closed, expired, noMatchProxy] = await Promise.all([
      InstantConnectRequest.countDocuments(),
      InstantConnectRequest.countDocuments({ status: "active" }),
      InstantConnectRequest.countDocuments({ status: "closed" }),
      InstantConnectRequest.countDocuments({ status: "expired" }),
      InstantConnectRequest.countDocuments({ matchedTutorIds: { $size: 0 } }),
    ]);

    const withCounts = await InstantConnectRequest.aggregate([
      {
        $project: {
          n: { $size: "$selectedTutorIds" },
          closedAt: 1,
          createdAt: 1,
          status: 1,
        },
      },
      {
        $group: {
          _id: "$n",
          count: { $sum: 1 },
        },
      },
    ]);

    const byMentorCount: Record<string, number> = { "1": 0, "2": 0, "3": 0 };
    for (const row of withCounts) {
      const k = String(row._id);
      if (k === "1" || k === "2" || k === "3") byMentorCount[k] = row.count;
    }

    const closedDocs = await InstantConnectRequest.find({
      status: "closed",
      closedAt: { $exists: true },
    })
      .select("createdAt closedAt")
      .limit(200);
    let avgCloseMs: number | null = null;
    if (closedDocs.length > 0) {
      const sum = closedDocs.reduce(
        (acc, d) => acc + (d.closedAt!.getTime() - d.createdAt.getTime()),
        0,
      );
      avgCloseMs = Math.round(sum / closedDocs.length);
    }

    const recent = await InstantConnectRequest.find()
      .sort({ createdAt: -1 })
      .limit(40)
      .populate("parentId", "email parentProfile.name");

    res.json({
      metrics: {
        total,
        active,
        closed,
        expired,
        noMatch: noMatchProxy,
        with1: byMentorCount["1"],
        with2: byMentorCount["2"],
        with3: byMentorCount["3"],
        avgCloseHours:
          avgCloseMs != null
            ? Math.round((avgCloseMs / 36e5) * 10) / 10
            : null,
      },
      requests: recent.map((r) => {
        const parent = r.parentId as unknown as {
          email?: string;
          parentProfile?: { name?: string };
        } | null;
        return {
          id: r._id.toString(),
          parentName: parent?.parentProfile?.name || "Parent",
          parentEmail: parent?.email || "",
          subject: r.subject,
          classLevel: r.classLevel,
          mentorsNotified: r.selectedTutorIds.length,
          status: r.status,
          createdAt: r.createdAt,
          closedAt: r.closedAt || null,
        };
      }),
    });
  } catch (err) {
    console.error("IC admin summary error:", err);
    res.status(500).json({ error: "Failed to load Instant Connect admin data" });
  }
});

/** GET /:id — parent detail */
router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth?.role !== "parent") {
      res.status(403).json({ error: "Parents only" });
      return;
    }
    const r = await InstantConnectRequest.findById(req.params.id);
    if (!r || r.parentId.toString() !== req.auth.sub) {
      res.status(404).json({ error: "Request not found" });
      return;
    }
    await ensureRequestFresh(r);

    const tutors = await User.find({
      _id: { $in: r.selectedTutorIds },
    }).select("profile.name profile.subjects profile.hourlyRate profileImageUrl");

    res.json({
      request: serializeParentRow(r),
      mentors: tutors.map((t) => ({
        id: t._id.toString(),
        name: t.profile?.name || "Mentor",
        subjects: t.profile?.subjects || [],
        hourlyRate: t.profile?.hourlyRate ?? null,
        profileImageUrl: t.profileImageUrl || null,
      })),
    });
  } catch (err) {
    console.error("IC get error:", err);
    res.status(500).json({ error: "Failed to load request" });
  }
});

/** POST /:id/close — parent closes */
router.post(
  "/:id/close",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth?.role !== "parent") {
        res.status(403).json({ error: "Parents only" });
        return;
      }
      const r = await InstantConnectRequest.findById(req.params.id);
      if (!r || r.parentId.toString() !== req.auth.sub) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
      await ensureRequestFresh(r);
      if (r.status !== "active") {
        res.status(400).json({ error: "Request is not active" });
        return;
      }
      r.status = "closed";
      r.closedAt = new Date();
      r.closedBy = "parent";
      await r.save();

      const tutorIds = r.selectedTutorIds.map((id: { toString(): string }) =>
        id.toString(),
      );
      void notifyFacultyRequestEnded(tutorIds, r, "closed");
      void notifyParentInstantConnectEvent(req.auth.sub, {
        type: "instant_connect_closed",
        title: "Instant Connect requirement closed",
        body: "Mentors no longer have access to your phone through this request.",
        requestId: r._id.toString(),
      });

      res.json({ request: serializeParentRow(r) });
    } catch (err) {
      console.error("IC close error:", err);
      res.status(500).json({ error: "Could not close request" });
    }
  },
);

/** GET /tutor/:id — faculty detail */
router.get(
  "/tutor/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth?.role !== "faculty") {
        res.status(403).json({ error: "Faculty only" });
        return;
      }
      const mentorId = req.auth.sub;
      const r = await InstantConnectRequest.findById(req.params.id);
      if (!r || !r.selectedTutorIds.some((id: { toString(): string }) => id.toString() === mentorId)) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
      await ensureRequestFresh(r);
      const parent = await User.findById(r.parentId).select(
        "parentProfile.phoneNumber",
      );
      res.json({
        request: serializeTutorRow(
          r,
          mentorId,
          parent?.parentProfile?.phoneNumber?.trim() || null,
        ),
      });
    } catch (err) {
      console.error("IC tutor get error:", err);
      res.status(500).json({ error: "Failed to load request" });
    }
  },
);

export default router;
