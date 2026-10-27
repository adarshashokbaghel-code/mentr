import { Router, Response } from "express";
import { randomBytes } from "crypto";
import type { Types } from "mongoose";
import { Connection, type IConnection } from "../models/Connection";
import {
  CLASSES_PER_WEEK,
  MAX_OPEN_REQUIREMENTS,
  PREFERRED_TIMES,
  REQUIREMENT_BOARDS,
  REQUIREMENT_GOALS,
  Requirement,
  START_TIMELINES,
  TIMELINE_TTL_DAYS,
  type IRequirement,
  type StartTimeline,
} from "../models/Requirement";
import { LEGAL_DOCS_VERSION } from "../../src/lib/legal";
import {
  explainMatch,
  findTopMatches,
  type MatchInput,
} from "../services/tutor-match";
import { TEACHING_MODES, User, type TeachingMode } from "../models/User";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { isProfileComplete } from "./auth";
import { notifyParentRequirementPitch } from "../services/parent-notifications";
import { alertTutorsOfNewPost } from "../services/requirement-tutor-alert";
import { isMentrPremiumActive } from "../services/premium-mentor-billing";
import { getRevealQuota } from "../services/parent-contact-reveal";

const router = Router();

router.use(ensureDb);

const DETAILS_MIN = 20;
const DETAILS_MAX = 500;
const PITCH_MIN = 10;
const PITCH_MAX = 500;
/** Free mentors: 3 pitches/day. Premium: unlimited. */
const MAX_INTERESTS_PER_DAY = 3;

/** wa.me needs a country code — assume India for bare 10-digit numbers */
function waPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function requirePostable(status: string, expiresAt: Date): boolean {
  return status === "open" && expiresAt.getTime() > Date.now();
}

/** Anonymized board row — never includes the parent's name or contact. Premium mentors get the parent id so a reveal can be charged against the daily cap. */
function serializeForBoard(
  r: IRequirement,
  myInterest?: IConnection,
  parentId?: string,
) {
  return {
    id: r._id.toString(),
    parentId: parentId ?? null,
    subject: r.subject,
    classLevel: r.classLevel,
    city: r.city,
    area: r.area,
    modes: r.modes,
    budgetMin: r.budgetMin ?? null,
    budgetMax: r.budgetMax ?? null,
    details: r.details,
    startTimeline: r.startTimeline ?? "flexible",
    board: r.board ?? null,
    goal: r.goal ?? null,
    classesPerWeek: r.classesPerWeek ?? null,
    preferredTime: r.preferredTime ?? null,
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
    board: r.board ?? null,
    goal: r.goal ?? null,
    classesPerWeek: r.classesPerWeek ?? null,
    preferredTime: r.preferredTime ?? null,
    status: requirePostable(r.status, r.expiresAt) ? "open" : "closed",
    interestCount: r.interestCount,
    postedAt: r.createdAt,
    expiresAt: r.expiresAt,
    shareToken: r.shareToken,
  };
}

function newShareToken(): string {
  return randomBytes(9).toString("base64url");
}

async function ensureShareToken(r: IRequirement): Promise<string> {
  if (r.shareToken) return r.shareToken;
  r.shareToken = newShareToken();
  await r.save();
  return r.shareToken;
}

type ParsedPost = {
  subject: string;
  classLevel: string;
  area: string;
  modes: TeachingMode[];
  budgetMin?: number;
  budgetMax?: number;
  details: string;
  startTimeline: StartTimeline;
  board?: string;
  goal?: string;
  classesPerWeek?: string;
  preferredTime?: string;
};

function pickFrom<T extends readonly string[]>(
  list: T,
  raw: unknown,
): T[number] | undefined {
  const value = String(raw ?? "").trim();
  return (list as readonly string[]).includes(value)
    ? (value as T[number])
    : undefined;
}

function parsePost(
  body: Record<string, unknown> | undefined,
): { ok: true; data: ParsedPost } | { ok: false; error: string } {
  const b = body ?? {};
  const subject = String(b.subject || "").trim();
  const classLevel = String(b.classLevel || "").trim();
  const area = String(b.area || "").trim();
  const note = String(b.details || "").trim();
  const startTimeline = String(b.startTimeline || "") as StartTimeline;
  const rawModes = Array.isArray(b.modes) ? b.modes : [];
  const modes = rawModes.filter((m: unknown): m is TeachingMode =>
    (TEACHING_MODES as readonly string[]).includes(String(m)),
  );

  if (!subject || subject.length > 60) return { ok: false, error: "Pick a subject" };
  if (!classLevel || classLevel.length > 40) {
    return { ok: false, error: "Pick a class level" };
  }
  if (modes.length === 0) {
    return { ok: false, error: "Pick at least one teaching mode" };
  }
  if (area.length > 80 || (modes.includes("student_home") && !area)) {
    return { ok: false, error: "Add your area (locality only)" };
  }
  if (!START_TIMELINES.includes(startTimeline)) {
    return { ok: false, error: "Pick when you want to start" };
  }
  if (note.length > DETAILS_MAX) {
    return { ok: false, error: `Keep details under ${DETAILS_MAX} characters` };
  }

  let budgetMin: number | undefined;
  let budgetMax: number | undefined;
  if (b.budgetMin != null && b.budgetMin !== "") {
    budgetMin = Number(b.budgetMin);
    if (!Number.isFinite(budgetMin) || budgetMin < 0 || budgetMin > 100000) {
      return { ok: false, error: "Invalid minimum budget" };
    }
  }
  if (b.budgetMax != null && b.budgetMax !== "") {
    budgetMax = Number(b.budgetMax);
    if (!Number.isFinite(budgetMax) || budgetMax < 0 || budgetMax > 100000) {
      return { ok: false, error: "Invalid maximum budget" };
    }
  }
  if (budgetMin != null && budgetMax != null && budgetMin > budgetMax) {
    return { ok: false, error: "Minimum budget can't exceed maximum" };
  }

  const board = pickFrom(REQUIREMENT_BOARDS, b.board);
  const goal = pickFrom(REQUIREMENT_GOALS, b.goal);
  const classesPerWeek = pickFrom(CLASSES_PER_WEEK, b.classesPerWeek);
  const preferredTime = pickFrom(PREFERRED_TIMES, b.preferredTime);

  // Tutors read `details` on the board — compose one from the picked
  // options so a post is useful even when the parent skips the note.
  const summary = [
    `Looking for a ${subject} tutor for ${classLevel}${board && board !== "Other" ? ` (${board})` : ""}.`,
    goal ? `Goal: ${goal.toLowerCase()}.` : "",
    classesPerWeek ? `${classesPerWeek} classes a week.` : "",
    preferredTime && preferredTime !== "Any time"
      ? `Prefers ${preferredTime.toLowerCase()}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const details =
    note.length >= DETAILS_MIN ? note : [summary, note].filter(Boolean).join(" ").slice(0, DETAILS_MAX);

  return {
    ok: true,
    data: {
      subject,
      classLevel,
      area,
      modes,
      budgetMin,
      budgetMax,
      details,
      startTimeline,
      board,
      goal,
      classesPerWeek,
      preferredTime,
    },
  };
}

function matchInputFor(
  data: Pick<
    ParsedPost,
    "subject" | "classLevel" | "modes" | "area" | "budgetMin" | "budgetMax" | "board"
  >,
  city: string,
): MatchInput {
  const online = data.modes.includes("online");
  const offline = data.modes.some((m) => m !== "online");
  return {
    subject: data.subject,
    classLevel: data.classLevel,
    mode: online && offline ? "either" : online ? "online" : "offline",
    location: [data.area, city].filter(Boolean).join(", "),
    budgetMin: data.budgetMin ?? undefined,
    budgetMax: data.budgetMax ?? undefined,
    board: data.board,
  };
}

const SHOWN_MATCHES = 4;
const ALERTED_TUTORS = 10;

/** Top matches for the parent, and an email nudge to the best-fit tutors. */
async function matchAndAlert(requirement: IRequirement, data: ParsedPost, city: string) {
  try {
    const { matches } = await findTopMatches(matchInputFor(data, city), ALERTED_TUTORS);
    void alertTutorsOfNewPost(
      requirement,
      matches.map((m) => m.id),
    ).catch((err) => console.error("new post tutor alert failed:", err));
    return matches.slice(0, SHOWN_MATCHES);
  } catch (err) {
    console.error("requirement match error:", err);
    return [];
  }
}

async function createRequirement(
  parentId: Types.ObjectId,
  city: string,
  data: ParsedPost,
  extra: { contactName?: string; contactPhone?: string; source: "parent" | "guest" },
): Promise<IRequirement | { error: string }> {
  const openCount = await Requirement.countDocuments({
    parent: parentId,
    status: "open",
    expiresAt: { $gt: new Date() },
  });
  if (openCount >= MAX_OPEN_REQUIREMENTS) {
    return {
      error: `You can have up to ${MAX_OPEN_REQUIREMENTS} open posts — close one to post a new need`,
    };
  }
  return (await Requirement.create({
    parent: parentId,
    city,
    ...data,
    area: data.area || city,
    ...extra,
    status: "open",
    shareToken: newShareToken(),
    // Urgent needs expire fast; flexible ones stay up longer
    expiresAt: new Date(
      Date.now() + TIMELINE_TTL_DAYS[data.startTimeline] * 24 * 60 * 60 * 1000,
    ),
  })) as IRequirement;
}

const GUEST_IP_WINDOW_MS = 60 * 60 * 1000;
const GUEST_IP_MAX = 5;
const guestIpHits = new Map<string, number[]>();

function guestIpLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (guestIpHits.get(ip) ?? []).filter(
    (t) => now - t < GUEST_IP_WINDOW_MS,
  );
  if (hits.length >= GUEST_IP_MAX) {
    guestIpHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  guestIpHits.set(ip, hits);
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s-]{10,15}$/;

/**
 * Guest: post without an account. Creates (or reuses) an unverified parent
 * stub for the email — signing in with an email code later verifies it and
 * shows the pitches. Posts for an existing parent email land on that account.
 */
router.post("/guest", async (req, res: Response) => {
  try {
    if (guestIpLimited(req.ip ?? "unknown")) {
      res.status(429).json({ error: "Too many posts. Try again in an hour." });
      return;
    }

    const name = String(req.body?.name || "").trim().slice(0, 80);
    const email = String(req.body?.email || "").trim().toLowerCase().slice(0, 160);
    const phone = String(req.body?.phone || "").trim().slice(0, 20);
    const city = String(req.body?.city || "").trim().slice(0, 60) || "Bengaluru";

    if (!name) {
      res.status(400).json({ error: "Add your name" });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Enter a valid email" });
      return;
    }
    if (!PHONE_RE.test(phone)) {
      res.status(400).json({ error: "Enter a valid WhatsApp number" });
      return;
    }
    if (req.body?.acceptedLegal !== true) {
      res.status(400).json({
        error: "Please accept the Terms of service and Privacy policy to continue.",
      });
      return;
    }

    const parsed = parsePost(req.body);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    let user = await User.findOne({ email });
    if (user?.emailVerified && user.role !== "parent") {
      res.status(409).json({
        error: "This email belongs to a tutor account. Use a parent email.",
        code: "ROLE_MISMATCH",
      });
      return;
    }

    // Existing parent account: file the post under it without touching the
    // profile. They see it on their dashboard after signing in with this email.
    if (user?.emailVerified) {
      const created = await createRequirement(user._id, city, parsed.data, {
        contactName: name,
        contactPhone: phone,
        source: "guest",
      });
      if ("error" in created) {
        res.status(409).json({ error: created.error });
        return;
      }
      res.status(201).json({
        requirement: serializeForOwner(created),
        matches: await matchAndAlert(created, parsed.data, city),
        email,
        accountExists: true,
        message: "Posted — tutors will pitch you by email",
      });
      return;
    }

    const parentProfile = {
      name,
      phoneNumber: phone,
      country: "India",
      city,
      area: parsed.data.area,
    };
    const acquisition = {
      ...(typeof req.body?.registrationSource === "string" &&
      req.body.registrationSource.trim()
        ? { registrationSource: req.body.registrationSource.trim().slice(0, 2048) }
        : {}),
    };
    if (user) {
      user.role = "parent";
      user.parentProfile = parentProfile as NonNullable<typeof user.parentProfile>;
      if (!user.registrationSource && acquisition.registrationSource) {
        user.registrationSource = acquisition.registrationSource;
      }
      await user.save();
    } else {
      user = await User.create({
        email,
        role: "parent",
        emailVerified: false,
        parentProfile,
        legalAcceptedAt: new Date(),
        legalAcceptedVersion: LEGAL_DOCS_VERSION,
        ...acquisition,
      });
    }

    const created = await createRequirement(user._id, city, parsed.data, {
      source: "guest",
    });
    if ("error" in created) {
      res.status(409).json({ error: created.error });
      return;
    }

    res.status(201).json({
      requirement: serializeForOwner(created),
      matches: await matchAndAlert(created, parsed.data, city),
      email,
      accountExists: false,
      message: "Posted — tutors will pitch you by email",
    });
  } catch (error) {
    console.error("guest post requirement error:", error);
    res.status(500).json({ error: "Failed to post requirement" });
  }
});

router.use(requireAuth);

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
    if (!parent) {
      res.status(404).json({ error: "Account not found" });
      return;
    }

    const contactName = String(req.body?.contactName || "").trim().slice(0, 80);
    const contactPhone = String(req.body?.contactPhone || "").trim().slice(0, 20);
    if (contactPhone && !PHONE_RE.test(contactPhone)) {
      res.status(400).json({ error: "Enter a valid WhatsApp number" });
      return;
    }
    const name = parent.parentProfile?.name || contactName;
    if (!name) {
      res.status(400).json({ error: "Add your name so tutors know who to address" });
      return;
    }

    const parsed = parsePost(req.body);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const city = parent.parentProfile?.city || "Bengaluru";
    // A number given here completes a missing profile; otherwise it only
    // applies to this post.
    if (!parent.parentProfile?.phoneNumber && contactPhone) {
      parent.parentProfile = {
        ...(parent.parentProfile ?? {}),
        name,
        phoneNumber: contactPhone,
        country: parent.parentProfile?.country || "India",
        city,
        area: parent.parentProfile?.area || parsed.data.area,
      } as NonNullable<typeof parent.parentProfile>;
      parent.profileCompleted = true;
      parent.markModified("parentProfile");
      await parent.save();
    }

    const created = await createRequirement(parent._id, city, parsed.data, {
      contactName: parent.parentProfile?.name ? undefined : contactName,
      contactPhone:
        contactPhone && contactPhone !== parent.parentProfile?.phoneNumber
          ? contactPhone
          : undefined,
      source: "parent",
    });
    if ("error" in created) {
      res.status(409).json({ error: created.error });
      return;
    }

    res.status(201).json({
      requirement: serializeForOwner(created),
      matches: await matchAndAlert(created, parsed.data, city),
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

    // Phone (accepted) + headshots for every tutor who pitched
    const teacherIds = [...new Set(interests.map((c) => c.teacher.toString()))];
    const teachers = teacherIds.length
      ? await User.find({ _id: { $in: teacherIds } }).select(
          "role profile profileImageUrl",
        )
      : [];
    const teacherById = new Map(teachers.map((t) => [t._id.toString(), t]));

    const byRequirement = new Map<string, IConnection[]>();
    for (const c of interests) {
      const key = c.requirement?.toString() ?? "";
      if (!key) continue;
      const list = byRequirement.get(key) ?? [];
      list.push(c);
      byRequirement.set(key, list);
    }

    res.json({
      requirements: await Promise.all(
        requirements.map(async (r) => {
          await ensureShareToken(r);
          const input = matchInputFor(r, r.city);
          return {
            ...serializeForOwner(r),
            interests: (byRequirement.get(r._id.toString()) ?? []).map((c) => {
              const teacher = teacherById.get(c.teacher.toString());
              const p = teacher?.profile;
              const teacherGone = !teacher;
              const match =
                teacher && p ? explainMatch(teacher, input) : { score: 0, reasons: [] };
              return {
                id: c._id.toString(),
                teacherId: c.teacher.toString(),
                teacherName: teacherGone
                  ? "Deleted user"
                  : c.teacherName?.trim() || "Deleted user",
                teacherArea: teacherGone ? null : (c.teacherArea ?? null),
                teacherImageUrl: teacherGone
                  ? null
                  : (teacher.profileImageUrl || "").trim() || null,
                designation: p?.designation || null,
                hourlyRate: p?.hourlyRate ?? null,
                experienceYears: p?.experienceYears ?? null,
                teachingModes: p?.teachingModes ?? [],
                subjects: p?.subjects ?? [],
                matchScore: match.score,
                matchReasons: match.reasons,
                message: c.message,
                status: c.status,
                phone:
                  c.status === "accepted" && p
                    ? waPhone(p.phoneNumber || "") || null
                    : null,
                sentAt: c.createdAt,
                respondedAt: c.respondedAt ?? null,
              };
            }),
          };
        }),
      ),
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

    const mentor = await User.findById(req.auth!.sub).select(
      "mentrPremium premiumMentorStatus",
    );
    const premium = mentor ? isMentrPremiumActive(mentor) : false;
    const dailyLimit = premium ? null : MAX_INTERESTS_PER_DAY;
    const revealQuota = premium
      ? await getRevealQuota(req.auth!.sub)
      : null;

    res.json({
      requirements: requirements.map((r) =>
        serializeForBoard(
          r,
          interestByRequirement.get(r._id.toString()),
          premium && requirePostable(r.status, r.expiresAt)
            ? r.parent.toString()
            : undefined,
        ),
      ),
      premiumMentor: premium,
      revealQuota,
      dailyLimit,
      usedToday: premium
        ? usedToday
        : Math.min(usedToday, MAX_INTERESTS_PER_DAY),
      unlimitedPitches: premium,
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
      "subject classLevel area city startTimeline status expiresAt contactPhone",
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
          parentName: c.status === "accepted"
            ? c.parentName?.trim() || "Deleted user"
            : null,
          parentPhone:
            c.status === "accepted"
              ? (r?.contactPhone
                  ? waPhone(r.contactPhone)
                  : parentPhoneById.get(c.parent.toString())) || null
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
      const parentName =
        parent?.parentProfile?.name || requirement.contactName || "";
      if (!parent || !parentName) {
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

      if (
        existing?.status === "pending" &&
        (existing.requestedBy !== "teacher" || pitchedOnThisPost)
      ) {
        res.status(409).json({
          error:
            existing.requestedBy === "parent"
              ? "This parent already sent you a request — check your inbox"
              : "You already responded — waiting for the parent",
          code: "ALREADY_PENDING",
        });
        return;
      }

      if (
        countsTowardLimit &&
        !isMentrPremiumActive(teacher) &&
        usedToday >= MAX_INTERESTS_PER_DAY
      ) {
        res.status(429).json({
          error: `Daily limit reached — you can pitch ${MAX_INTERESTS_PER_DAY} posts per day. Upgrade to Premium for unlimited pitches.`,
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
        parentName,
        parentArea:
          parent.parentProfile?.area ||
          parent.parentProfile?.city ||
          requirement.area ||
          undefined,
        teacherName: tp.name,
        teacherArea: [tp.area, tp.city].filter(Boolean).join(", ") || undefined,
        respondedAt: alreadyConnected ? existing!.respondedAt : undefined,
        ...(pitchAt ? { lastPitchAt: pitchAt } : {}),
      };

      let connection: IConnection;
      if (existing) {
        existing.set(fields);
        connection = await existing.save();
      } else {
        connection = (await Connection.create({
          parent: parent._id,
          teacher: teacher._id,
          ...fields,
        })) as IConnection;
      }

      void notifyParentRequirementPitch({
        parentId: parent._id.toString(),
        teacherName: connection.teacherName,
        teacherId: teacher._id.toString(),
        teacherArea: fields.teacherArea,
        requirementId: requirement._id.toString(),
        subject: requirement.subject,
        classLevel: requirement.classLevel,
        postArea: [requirement.area, requirement.city].filter(Boolean).join(", "),
        message,
        connectionId: connection._id.toString(),
        alreadyConnected,
      });

      if (!pitchedOnThisPost) {
        await Requirement.updateOne(
          { _id: requirement._id },
          { $inc: { interestCount: 1 } },
        );
      }

      const premium = isMentrPremiumActive(teacher);
      res.status(201).json({
        message: alreadyConnected
          ? "Pitch sent — you're already connected on WhatsApp"
          : "Sent — the parent will review your pitch",
        usedToday: premium
          ? countsTowardLimit
            ? usedToday + 1
            : usedToday
          : Math.min(
              countsTowardLimit ? usedToday + 1 : usedToday,
              MAX_INTERESTS_PER_DAY,
            ),
        dailyLimit: premium ? null : MAX_INTERESTS_PER_DAY,
        unlimitedPitches: premium,
        alreadyConnected,
      });
    } catch (error) {
      console.error("express interest error:", error);
      res.status(500).json({ error: "Failed to send your response" });
    }
  },
);

export default router;
