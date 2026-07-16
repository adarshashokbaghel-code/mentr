import { Router, Response } from "express";
import { Connection, type IConnection } from "../models/Connection";
import {
  MAX_OPEN_REQUIREMENTS,
  Requirement,
  START_TIMELINES,
  TIMELINE_TTL_DAYS,
  type IRequirement,
  type StartTimeline,
} from "../models/Requirement";
import { TEACHING_MODES, User, type TeachingMode } from "../models/User";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { isProfileComplete } from "./auth";

const router = Router();

router.use(ensureDb);

router.use(requireAuth);

const DETAILS_MIN = 20;
const DETAILS_MAX = 500;
const PITCH_MIN = 10;
const PITCH_MAX = 500;
/** Free-forever spam control: replaces "coins" with a simple daily cap */
const MAX_INTERESTS_PER_DAY = 3;

/** wa.me needs a country code — assume India for bare 10-digit numbers */
function waPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function requirePostable(status: string, expiresAt: Date): boolean {
  return status === "open" && expiresAt.getTime() > Date.now();
}

/** Anonymized board row — never includes the parent's name or contact. */
function serializeForBoard(
  r: IRequirement,
  myInterest?: IConnection,
) {
  return {
    id: r._id.toString(),
    subject: r.subject,
    classLevel: r.classLevel,
    city: r.city,
    area: r.area,
    modes: r.modes,
    budgetMin: r.budgetMin ?? null,
    budgetMax: r.budgetMax ?? null,
    details: r.details,
    startTimeline: r.startTimeline ?? "flexible",
    status: requirePostable(r.status, r.expiresAt) ? "open" : "closed",
    interestCount: r.interestCount,
    postedAt: r.createdAt,
    expiresAt: r.expiresAt,
    /** This tutor's own interest on the post, if any */
    myInterestStatus: myInterest?.status ?? null,
  };
}

/** The parent's own post, including its live status. */
function serializeForOwner(r: IRequirement) {
  return {
    id: r._id.toString(),
    subject: r.subject,
    classLevel: r.classLevel,
    city: r.city,
    area: r.area,
    modes: r.modes,
    budgetMin: r.budgetMin ?? null,
    budgetMax: r.budgetMax ?? null,
    details: r.details,
    startTimeline: r.startTimeline ?? "flexible",
    status: requirePostable(r.status, r.expiresAt) ? "open" : "closed",
    interestCount: r.interestCount,
    postedAt: r.createdAt,
    expiresAt: r.expiresAt,
  };
}

/**
 * Parent: post a learning need to the board. Anonymous by design — tutors
 * see subject/class/area/budget/details, never the parent's identity.
 */
router.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res
        .status(403)
        .json({ error: "Only parent accounts can post requirements" });
      return;
    }

    const parent = await User.findById(req.auth!.sub);
    if (!parent?.parentProfile?.name) {
      res
        .status(400)
        .json({ error: "Complete your details before posting a requirement" });
      return;
    }

    const subject = String(req.body?.subject || "").trim();
    const classLevel = String(req.body?.classLevel || "").trim();
    const area = String(req.body?.area || "").trim();
    const details = String(req.body?.details || "").trim();
    const startTimeline = String(
      req.body?.startTimeline || "",
    ) as StartTimeline;
    const rawModes = Array.isArray(req.body?.modes) ? req.body.modes : [];
    const modes = rawModes.filter((m: unknown): m is TeachingMode =>
      (TEACHING_MODES as readonly string[]).includes(String(m)),
    );

    if (!subject || subject.length > 60) {
      res.status(400).json({ error: "Pick a subject" });
      return;
    }
    if (!classLevel || classLevel.length > 40) {
      res.status(400).json({ error: "Pick a class level" });
      return;
    }
    if (!area || area.length > 80) {
      res.status(400).json({ error: "Add your area (locality only)" });
      return;
    }
    if (modes.length === 0) {
      res.status(400).json({ error: "Pick at least one teaching mode" });
      return;
    }
    if (!START_TIMELINES.includes(startTimeline)) {
      res.status(400).json({ error: "Pick when you want to start" });
      return;
    }
    if (details.length < DETAILS_MIN) {
      res.status(400).json({
        error: `Describe what you need (at least ${DETAILS_MIN} characters)`,
      });
      return;
    }
    if (details.length > DETAILS_MAX) {
      res
        .status(400)
        .json({ error: `Keep details under ${DETAILS_MAX} characters` });
      return;
    }

    let budgetMin: number | undefined;
    let budgetMax: number | undefined;
    if (req.body?.budgetMin != null && req.body.budgetMin !== "") {
      budgetMin = Number(req.body.budgetMin);
      if (!Number.isFinite(budgetMin) || budgetMin < 0 || budgetMin > 100000) {
        res.status(400).json({ error: "Invalid minimum budget" });
        return;
      }
    }
    if (req.body?.budgetMax != null && req.body.budgetMax !== "") {
      budgetMax = Number(req.body.budgetMax);
      if (!Number.isFinite(budgetMax) || budgetMax < 0 || budgetMax > 100000) {
        res.status(400).json({ error: "Invalid maximum budget" });
        return;
      }
    }
    if (budgetMin != null && budgetMax != null && budgetMin > budgetMax) {
      res.status(400).json({ error: "Minimum budget can't exceed maximum" });
      return;
    }

    const openCount = await Requirement.countDocuments({
      parent: parent._id,
      status: "open",
      expiresAt: { $gt: new Date() },
    });
    if (openCount >= MAX_OPEN_REQUIREMENTS) {
      res.status(409).json({
        error: `You can have up to ${MAX_OPEN_REQUIREMENTS} open posts — close one to post a new need`,
      });
      return;
    }

    const requirement = (await Requirement.create({
      parent: parent._id,
      subject,
      classLevel,
      city: parent.parentProfile.city || "Bengaluru",
      area,
      modes,
      budgetMin,
      budgetMax,
      details,
      startTimeline,
      status: "open",
      // Urgent needs expire fast; flexible ones stay up longer
      expiresAt: new Date(
        Date.now() + TIMELINE_TTL_DAYS[startTimeline] * 24 * 60 * 60 * 1000,
      ),
    })) as IRequirement;

    res.status(201).json({
      requirement: serializeForOwner(requirement),
      message: "Posted — verified tutors can now reach out to you",
    });
  } catch (error) {
    console.error("post requirement error:", error);
    res.status(500).json({ error: "Failed to post requirement" });
  }
});

/**
 * Parent: my posts + every tutor interest on them (pending first).
 * This is the parent's inbox for the board flow.
 */
router.get("/mine", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Only parent accounts have requirements" });
      return;
    }

    const requirements = (await Requirement.find({ parent: req.auth!.sub })
      .sort({ createdAt: -1 })
      .limit(20)) as IRequirement[];

    const interests = (await Connection.find({
      parent: req.auth!.sub,
      requestedBy: "teacher",
    })
      .sort({ createdAt: -1 })
      .limit(200)) as IConnection[];

    // Accepted pitches unlock the tutor's WhatsApp right in the thread
    const acceptedTeacherIds = interests
      .filter((c) => c.status === "accepted")
      .map((c) => c.teacher);
    const teachers = acceptedTeacherIds.length
      ? await User.find({ _id: { $in: acceptedTeacherIds } }).select(
          "profile.phoneNumber",
        )
      : [];
    const phoneById = new Map<string, string>(
      teachers.map((t) => [
        t._id.toString(),
        waPhone(t.profile?.phoneNumber || ""),
      ]),
    );

    const byRequirement = new Map<string, IConnection[]>();
    for (const c of interests) {
      const key = c.requirement?.toString() ?? "";
      if (!key) continue;
      const list = byRequirement.get(key) ?? [];
      list.push(c);
      byRequirement.set(key, list);
    }

    res.json({
      requirements: requirements.map((r) => ({
        ...serializeForOwner(r),
        interests: (byRequirement.get(r._id.toString()) ?? []).map((c) => ({
          id: c._id.toString(),
          teacherId: c.teacher.toString(),
          teacherName: c.teacherName,
          teacherArea: c.teacherArea ?? null,
          message: c.message,
          status: c.status,
          phone:
            c.status === "accepted"
              ? (phoneById.get(c.teacher.toString()) ?? null)
              : null,
          sentAt: c.createdAt,
          respondedAt: c.respondedAt ?? null,
        })),
      })),
    });
  } catch (error) {
    console.error("list my requirements error:", error);
    res.status(500).json({ error: "Failed to load requirements" });
  }
});

/** Parent: close a post early (found a tutor, changed plans). */
router.post("/:id/close", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Only parent accounts have requirements" });
      return;
    }
    const id = String(req.params.id || "");
    if (!/^[a-f\d]{24}$/i.test(id)) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const requirement = (await Requirement.findOne({
      _id: id,
      parent: req.auth!.sub,
    })) as IRequirement | null;
    if (!requirement) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    requirement.status = "closed";
    await requirement.save();
    res.json({
      requirement: serializeForOwner(requirement),
      message: "Post closed",
    });
  } catch (error) {
    console.error("close requirement error:", error);
    res.status(500).json({ error: "Failed to close post" });
  }
});

/**
 * Tutor: the anonymized board — open, unexpired needs, newest first.
 * Includes this tutor's own interest status per post and their remaining
 * daily interest quota.
 */
router.get("/board", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role === "parent") {
      res.status(403).json({ error: "The board is for tutor accounts" });
      return;
    }

    // Closed/expired posts stay on the board (filterable client-side) so
    // tutors keep the context of pitches they already sent.
    const requirements = (await Requirement.find({})
      .sort({ createdAt: -1 })
      .limit(100)) as IRequirement[];

    const [myInterests, usedToday] = await Promise.all([
      Connection.find({
        teacher: req.auth!.sub,
        requestedBy: "teacher",
        requirement: { $in: requirements.map((r) => r._id) },
      }) as Promise<IConnection[]>,
      interestsUsedToday(req.auth!.sub),
    ]);
    const interestByRequirement = new Map<string, IConnection>(
      myInterests
        .filter((c) => c.requirement)
        .map((c) => [c.requirement!.toString(), c]),
    );

    res.json({
      requirements: requirements.map((r) =>
        serializeForBoard(r, interestByRequirement.get(r._id.toString())),
      ),
      dailyLimit: MAX_INTERESTS_PER_DAY,
      usedToday: Math.min(usedToday, MAX_INTERESTS_PER_DAY),
    });
  } catch (error) {
    console.error("requirements board error:", error);
    res.status(500).json({ error: "Failed to load the board" });
  }
});

/**
 * Tutor: every pitch I've sent from the board, newest activity first.
 * The parent's name stays hidden until they accept — before that they
 * appear only as "Parent in <area>".
 */
router.get("/pitches", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role === "parent") {
      res.status(403).json({ error: "Only tutor accounts send pitches" });
      return;
    }

    const pitches = (await Connection.find({
      teacher: req.auth!.sub,
      requestedBy: "teacher",
    })
      .sort({ updatedAt: -1 })
      .limit(50)) as IConnection[];

    const reqIds = pitches
      .map((c) => c.requirement)
      .filter(Boolean) as (typeof pitches)[number]["requirement"][];
    const requirements = (await Requirement.find({
      _id: { $in: reqIds },
    }).select(
      "subject classLevel area city startTimeline status expiresAt",
    )) as IRequirement[];
    const reqById = new Map(requirements.map((r) => [r._id.toString(), r]));

    // Acceptance is mutual consent on the board flow — the parent's
    // WhatsApp unlocks for the tutor too.
    const acceptedParentIds = pitches
      .filter((c) => c.status === "accepted")
      .map((c) => c.parent);
    const parents = acceptedParentIds.length
      ? await User.find({ _id: { $in: acceptedParentIds } }).select(
          "parentProfile.phoneNumber",
        )
      : [];
    const parentPhoneById = new Map<string, string>(
      parents.map((p) => [
        p._id.toString(),
        waPhone(p.parentProfile?.phoneNumber || ""),
      ]),
    );

    res.json({
      pitches: pitches.map((c) => {
        const r = c.requirement
          ? reqById.get(c.requirement.toString())
          : undefined;
        return {
          id: c._id.toString(),
          status: c.status,
          message: c.message,
          sentAt: c.createdAt,
          respondedAt: c.respondedAt ?? null,
          // Privacy: identity unlocks only on acceptance
          parentName: c.status === "accepted" ? c.parentName : null,
          parentPhone:
            c.status === "accepted"
              ? (parentPhoneById.get(c.parent.toString()) ?? null)
              : null,
          parentArea: c.parentArea ?? null,
          requirement: r
            ? {
                subject: r.subject,
                classLevel: r.classLevel,
                area: r.area,
                city: r.city,
                startTimeline: r.startTimeline ?? "flexible",
                open: requirePostable(r.status, r.expiresAt),
              }
            : null,
        };
      }),
    });
  } catch (error) {
    console.error("list my pitches error:", error);
    res.status(500).json({ error: "Failed to load your pitches" });
  }
});

async function interestsUsedToday(teacherId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const tracked = await Connection.countDocuments({
    teacher: teacherId,
    requestedBy: "teacher",
    lastPitchAt: { $gte: startOfDay },
  });
  if (tracked > 0) return tracked;

  // Fallback for pitches sent today before lastPitchAt was tracked
  return Connection.countDocuments({
    teacher: teacherId,
    requestedBy: "teacher",
    requirement: { $exists: true, $ne: null },
    updatedAt: { $gte: startOfDay },
  });
}

/**
 * Tutor: express interest on a post. Creates a pending Connection the
 * parent reviews — rate-limited per day instead of charging coins.
 */
router.post(
  "/:id/interest",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth!.role === "parent") {
        res
          .status(403)
          .json({ error: "Only tutor accounts can express interest" });
        return;
      }

      const id = String(req.params.id || "");
      const message = String(req.body?.message || "").trim();
      if (!/^[a-f\d]{24}$/i.test(id)) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      if (message.length < PITCH_MIN) {
        res.status(400).json({
          error: `Add a short pitch (at least ${PITCH_MIN} characters) so the parent knows why you're a fit`,
        });
        return;
      }
      if (message.length > PITCH_MAX) {
        res
          .status(400)
          .json({ error: `Keep your pitch under ${PITCH_MAX} characters` });
        return;
      }

      const teacher = await User.findById(req.auth!.sub);
      if (!teacher || !isProfileComplete(teacher)) {
        res.status(400).json({
          error: "Complete your tutor profile before reaching out to parents",
        });
        return;
      }

      const requirement = (await Requirement.findById(
        id,
      )) as IRequirement | null;
      if (
        !requirement ||
        !requirePostable(requirement.status, requirement.expiresAt)
      ) {
        res
          .status(404)
          .json({ error: "This post is no longer open" });
        return;
      }

      const usedToday = await interestsUsedToday(req.auth!.sub);

      const parent = await User.findById(requirement.parent);
      if (!parent?.parentProfile?.name) {
        res.status(404).json({ error: "This post is no longer open" });
        return;
      }

      const existing = (await Connection.findOne({
        parent: parent._id,
        teacher: teacher._id,
      })) as IConnection | null;

      const pitchedOnThisPost =
        existing?.requirement?.toString() === requirement._id.toString();
      const countsTowardLimit = !pitchedOnThisPost;

      if (existing?.status === "pending") {
        res.status(409).json({
          error:
            existing.requestedBy === "parent"
              ? "This parent already sent you a request — check your inbox"
              : "You already responded — waiting for the parent",
          code: "ALREADY_PENDING",
        });
        return;
      }

      if (countsTowardLimit && usedToday >= MAX_INTERESTS_PER_DAY) {
        res.status(429).json({
          error: `Daily limit reached — you can pitch ${MAX_INTERESTS_PER_DAY} posts per day. Resets at midnight.`,
          code: "DAILY_LIMIT",
        });
        return;
      }

      const alreadyConnected = existing?.status === "accepted";
      const tp = teacher.profile!;
      const pitchAt = countsTowardLimit ? new Date() : existing?.lastPitchAt;
      const fields = {
        message,
        status: (alreadyConnected ? "accepted" : "pending") as
          | "accepted"
          | "pending",
        requestedBy: "teacher" as const,
        requirement: requirement._id,
        parentName: parent.parentProfile.name,
        parentArea:
          parent.parentProfile.area || parent.parentProfile.city || undefined,
        teacherName: tp.name,
        teacherArea: [tp.area, tp.city].filter(Boolean).join(", ") || undefined,
        respondedAt: alreadyConnected ? existing!.respondedAt : undefined,
        ...(pitchAt ? { lastPitchAt: pitchAt } : {}),
      };

      if (existing) {
        existing.set(fields);
        await existing.save();
      } else {
        await Connection.create({
          parent: parent._id,
          teacher: teacher._id,
          ...fields,
        });
      }

      if (!pitchedOnThisPost) {
        await Requirement.updateOne(
          { _id: requirement._id },
          { $inc: { interestCount: 1 } },
        );
      }

      res.status(201).json({
        message: alreadyConnected
          ? "Pitch sent — you're already connected on WhatsApp"
          : "Sent — the parent will review your pitch",
        usedToday: Math.min(
          countsTowardLimit ? usedToday + 1 : usedToday,
          MAX_INTERESTS_PER_DAY,
        ),
        dailyLimit: MAX_INTERESTS_PER_DAY,
        alreadyConnected,
      });
    } catch (error) {
      console.error("express interest error:", error);
      res.status(500).json({ error: "Failed to send your response" });
    }
  },
);

export default router;
