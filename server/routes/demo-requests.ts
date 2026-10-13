import { Router, Response } from "express";
import { DemoRequest, type IDemoRequest } from "../models/DemoRequest";
import { Requirement } from "../models/Requirement";
import { Connection } from "../models/Connection";
import { User, type IUser } from "../models/User";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { isProfileComplete } from "../lib/profile-complete";
import {
  notifyParentDemoUpdate,
  notifyTutorDemoReply,
  notifyTutorDemoRequest,
} from "../services/demo-request-notify";

const router = Router();

router.use(ensureDb);
router.use(requireAuth);

export const DEMO_LEVELS = [
  "Class 1–5",
  "Class 6–8",
  "Class 9–10",
  "Class 11–12",
  "JEE / NEET",
  "College",
] as const;

export const DEMO_TIMES = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "Flexible",
] as const;

export const DEMO_BOARDS = [
  "CBSE",
  "ICSE",
  "State board",
  "IGCSE",
  "IB",
] as const;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function todayInIndia(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const SLOT_DAYS = 14;
/** Parents can't book a slot starting sooner than this */
const LEAD_MINUTES = 120;
const SLOT_MINUTES = 60;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function label12h(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function nowIn(timeZone: string): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function weekdayOf(iso: string): (typeof WEEKDAYS)[number] {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

type DemoSlotDay = { date: string; times: string[] };

/**
 * Bookable demo start times from the tutor's weekly hours, in the tutor's
 * time zone. Hours already requested by another parent are left out.
 */
async function demoSlotsFor(teacher: IUser): Promise<{
  timezone: string;
  hasHours: boolean;
  days: DemoSlotDay[];
}> {
  const timezone = teacher.profile?.timezone || "Asia/Kolkata";
  const hours = (teacher.profile?.availability || []).filter((s) => !s.booked);
  if (hours.length === 0) return { timezone, hasHours: false, days: [] };

  let now: { date: string; minutes: number };
  try {
    now = nowIn(timezone);
  } catch {
    now = nowIn("Asia/Kolkata");
  }
  const last = addDays(now.date, SLOT_DAYS - 1);
  const taken = await DemoRequest.find({
    teacher: teacher._id,
    $or: [
      { status: { $in: ["pending", "accepted"] }, preferredDate: { $gte: now.date, $lte: last } },
      { status: "proposed", proposedDate: { $gte: now.date, $lte: last } },
    ],
  }).select("status preferredDate preferredTime proposedDate proposedTime");
  const takenKeys = new Set(
    taken.map((t) =>
      t.status === "proposed"
        ? `${t.proposedDate} ${t.proposedTime}`
        : `${t.preferredDate} ${t.preferredTime}`,
    ),
  );

  const days: DemoSlotDay[] = [];
  for (let i = 0; i < SLOT_DAYS; i++) {
    const date = addDays(now.date, i);
    const day = weekdayOf(date);
    const starts = new Set<number>();
    for (const slot of hours.filter((s) => s.day === day)) {
      const start = toMinutes(slot.start);
      const end = toMinutes(slot.end);
      if (end <= start) continue;
      if (end - start < SLOT_MINUTES) starts.add(start);
      for (let t = start; t + SLOT_MINUTES <= end; t += SLOT_MINUTES) starts.add(t);
    }
    const times = [...starts]
      .sort((a, b) => a - b)
      .filter((t) => i > 0 || t >= now.minutes + LEAD_MINUTES)
      .map(label12h)
      .filter((label) => !takenKeys.has(`${date} ${label}`));
    if (times.length) days.push({ date, times });
  }
  return { timezone, hasHours: true, days };
}

function serializeParent(row: IDemoRequest) {
  return {
    id: row._id.toString(),
    teacherId: row.teacher.toString(),
    teacherName: row.teacherName,
    subject: row.subject,
    classLevel: row.classLevel,
    board: row.board || null,
    preferredDate: row.preferredDate,
    preferredTime: row.preferredTime,
    note: row.note || "",
    status: row.status,
    tutorNote: row.tutorNote || null,
    sentAt: row.createdAt.toISOString(),
    respondedAt: row.respondedAt?.toISOString() ?? null,
    proposedDate: row.proposedDate || null,
    proposedTime: row.proposedTime || null,
    declinedBy: row.declinedBy || null,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    history: (row.history || []).map((h) => ({
      by: h.by,
      action: h.action,
      date: h.date || null,
      time: h.time || null,
      note: h.note || null,
      at: h.at.toISOString(),
    })),
  };
}

type PostContext = {
  postedAt: string;
  details: string;
  modes: string[];
  area: string;
  budgetMin: number | null;
  budgetMax: number | null;
  /** Present when this tutor pitched on the post before the parent booked */
  pitch: { message: string; sentAt: string } | null;
};

/** The parent's post (and this tutor's pitch on it) behind each demo booked from a post. */
async function postContexts(
  rows: IDemoRequest[],
  teacherId: string,
): Promise<Map<string, PostContext>> {
  const ids = [...new Set(rows.map((r) => r.requirement?.toString()).filter(Boolean))] as string[];
  const out = new Map<string, PostContext>();
  if (ids.length === 0) return out;
  const [posts, pitches] = await Promise.all([
    Requirement.find({ _id: { $in: ids } }),
    Connection.find({
      teacher: teacherId,
      requirement: { $in: ids },
      requestedBy: "teacher",
    }).select("requirement message createdAt"),
  ]);
  const pitchByPost = new Map(pitches.map((c) => [c.requirement!.toString(), c]));
  for (const p of posts) {
    const pitch = pitchByPost.get(p._id.toString());
    out.set(p._id.toString(), {
      postedAt: p.createdAt.toISOString(),
      details: p.details,
      modes: p.modes,
      area: p.area && p.area !== p.city ? `${p.area}, ${p.city}` : p.city,
      budgetMin: p.budgetMin ?? null,
      budgetMax: p.budgetMax ?? null,
      pitch: pitch
        ? { message: pitch.message, sentAt: pitch.createdAt.toISOString() }
        : null,
    });
  }
  return out;
}

function serializeTutor(row: IDemoRequest, contexts?: Map<string, PostContext>) {
  return {
    fromPost: row.requirement
      ? (contexts?.get(row.requirement.toString()) ?? null)
      : null,
    id: row._id.toString(),
    parentName: row.parentName,
    parentPhone: row.parentPhone,
    parentEmail: row.parentEmail,
    parentCity: row.parentCity || null,
    parentArea: row.parentArea || null,
    subject: row.subject,
    classLevel: row.classLevel,
    board: row.board || null,
    preferredDate: row.preferredDate,
    preferredTime: row.preferredTime,
    note: row.note || "",
    status: row.status,
    tutorNote: row.tutorNote || null,
    sentAt: row.createdAt.toISOString(),
    respondedAt: row.respondedAt?.toISOString() ?? null,
    proposedDate: row.proposedDate || null,
    proposedTime: row.proposedTime || null,
    declinedBy: row.declinedBy || null,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    history: (row.history || []).map((h) => ({
      by: h.by,
      action: h.action,
      date: h.date || null,
      time: h.time || null,
      note: h.note || null,
      at: h.at.toISOString(),
    })),
  };
}

/** Parent books an online demo. Phone is stored for the tutor immediately. */
router.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Only parent accounts can book a demo" });
      return;
    }

    const teacherId = clip(req.body?.teacherId, 40);
    const requirementId = clip(req.body?.requirementId, 40);
    let subject = clip(req.body?.subject, 80);
    let classLevel = clip(req.body?.classLevel, 40);
    let board = clip(req.body?.board, 40);
    const preferredDate = clip(req.body?.preferredDate, 10);
    const preferredTime = clip(req.body?.preferredTime, 40);
    let note = clip(req.body?.note, 500);

    if (!/^[a-f\d]{24}$/i.test(teacherId)) {
      res.status(404).json({ error: "Tutor not found" });
      return;
    }

    // Booked from the parent's own post: the post already says what they need.
    const requirement = requirementId
      ? /^[a-f\d]{24}$/i.test(requirementId)
        ? await Requirement.findOne({ _id: requirementId, parent: req.auth!.sub })
        : null
      : undefined;
    if (requirement === null) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    if (requirement) {
      subject = requirement.subject;
      classLevel = requirement.classLevel;
      board = requirement.board && requirement.board !== "Other" ? requirement.board : "";
      if (!note) note = requirement.details.slice(0, 500);
    } else {
      if (subject.length < 2) {
        res.status(400).json({ error: "Add the subject you want the demo in" });
        return;
      }
      if (!(DEMO_LEVELS as readonly string[]).includes(classLevel)) {
        res.status(400).json({ error: "Choose a class or level" });
        return;
      }
      if (board && !(DEMO_BOARDS as readonly string[]).includes(board)) {
        res.status(400).json({ error: "Choose a board, or leave it blank" });
        return;
      }
    }
    if (!DATE_RE.test(preferredDate)) {
      res.status(400).json({ error: "Pick a date for the demo" });
      return;
    }
    const today = todayInIndia();
    if (preferredDate < today || preferredDate > addDays(today, 60)) {
      res.status(400).json({
        error: "Pick a date in the next 60 days",
      });
      return;
    }
    if (
      !(DEMO_TIMES as readonly string[]).includes(preferredTime) &&
      !/^(1[0-2]|[1-9]):[0-5]\d (AM|PM)$/.test(preferredTime)
    ) {
      res.status(400).json({ error: "Pick a time for the demo" });
      return;
    }

    const [parent, teacher] = await Promise.all([
      User.findById(req.auth!.sub),
      User.findById(teacherId),
    ]);

    const profile = parent?.parentProfile;
    if (!parent || !profile?.name || !profile.phoneNumber) {
      res.status(400).json({
        error: "Add your name and phone number before booking a demo",
      });
      return;
    }
    if (
      !teacher ||
      teacher.role === "parent" ||
      !isProfileComplete(teacher as IUser)
    ) {
      res.status(404).json({ error: "Tutor not found" });
      return;
    }
    if (String(teacher._id) === String(parent._id)) {
      res.status(400).json({ error: "You can't book a demo with yourself" });
      return;
    }

    const open = await DemoRequest.findOne({
      parent: parent._id,
      teacher: teacher._id,
      $or: [
        { status: "pending", preferredDate: { $gte: today } },
        { status: "proposed", proposedDate: { $gte: today } },
      ],
    });
    if (open) {
      res.status(409).json({
        error: "You already have a demo waiting with this tutor",
        code: "ALREADY_PENDING",
        demo: serializeParent(open),
      });
      return;
    }

    const slots = await demoSlotsFor(teacher as IUser);
    if (slots.hasHours) {
      const free = slots.days
        .find((d) => d.date === preferredDate)
        ?.times.includes(preferredTime);
      if (!free) {
        res.status(409).json({
          error: "That time was just taken. Pick another slot.",
          code: "SLOT_TAKEN",
        });
        return;
      }
    } else if (!(DEMO_TIMES as readonly string[]).includes(preferredTime)) {
      res.status(400).json({ error: "Pick a time for the demo" });
      return;
    }

    const place = [profile.area, profile.city].filter(Boolean).join(", ");
    const row = await DemoRequest.create({
      parent: parent._id,
      teacher: teacher._id,
      parentName: profile.name,
      parentPhone: profile.phoneNumber,
      parentEmail: parent.email,
      parentCity: profile.city || undefined,
      parentArea: place || undefined,
      teacherName: teacher.profile?.name || "Tutor",
      requirement: requirement?._id,
      subject,
      classLevel,
      board: board || undefined,
      preferredDate,
      preferredTime,
      mode: "online",
      note,
      status: "pending",
      tutorNote: "",
      history: [
        { by: "parent", action: "requested", date: preferredDate, time: preferredTime, at: new Date() },
      ],
    });

    // Booking from a pitch is the parent's answer to it — both sides can now see each other's WhatsApp.
    if (requirement) {
      await Connection.updateOne(
        {
          parent: parent._id,
          teacher: teacher._id,
          requirement: requirement._id,
          requestedBy: "teacher",
          status: "pending",
        },
        { $set: { status: "accepted", respondedAt: new Date() } },
      );
    }

    void notifyTutorDemoRequest(row).catch((err) => {
      console.error("demo request email failed:", err);
    });

    res.status(201).json({
      demo: serializeParent(row),
      message: "Demo request sent. This tutor can see your number now.",
    });
  } catch (err) {
    console.error("create demo request error:", err);
    res.status(500).json({ error: "Could not send the demo request" });
  }
});

router.get("/slots/:teacherId", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = String(req.params.teacherId || "");
    if (!/^[a-f\d]{24}$/i.test(teacherId)) {
      res.status(404).json({ error: "Tutor not found" });
      return;
    }
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role === "parent") {
      res.status(404).json({ error: "Tutor not found" });
      return;
    }
    res.json(await demoSlotsFor(teacher as IUser));
  } catch (err) {
    console.error("demo slots error:", err);
    res.status(500).json({ error: "Could not load this tutor's times" });
  }
});

router.get("/mine", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Only parent accounts can view this" });
      return;
    }
    const rows = await DemoRequest.find({ parent: req.auth!.sub })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ demos: rows.map(serializeParent) });
  } catch (err) {
    console.error("list parent demos error:", err);
    res.status(500).json({ error: "Could not load demo requests" });
  }
});

router.get("/inbox", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role === "parent") {
      res.status(403).json({ error: "Only tutors can view demo requests" });
      return;
    }
    const rows = await DemoRequest.find({ teacher: req.auth!.sub })
      .sort({ createdAt: -1 })
      .limit(100);
    const contexts = await postContexts(rows, req.auth!.sub);
    res.json({ demos: rows.map((row) => serializeTutor(row, contexts)) });
  } catch (err) {
    console.error("list tutor demos error:", err);
    res.status(500).json({ error: "Could not load demo requests" });
  }
});

/** Tutor accepts, declines, or proposes another slot. The parent is emailed each time. */
router.post(
  "/:id/respond",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth!.role === "parent") {
        res.status(403).json({ error: "Only the tutor can respond" });
        return;
      }
      const id = String(req.params.id || "");
      if (!/^[a-f\d]{24}$/i.test(id)) {
        res.status(404).json({ error: "Demo request not found" });
        return;
      }
      const action = clip(req.body?.action, 20);
      const tutorNote = clip(req.body?.tutorNote, 500);
      const proposedDate = clip(req.body?.proposedDate, 10);
      const proposedTime = clip(req.body?.proposedTime, 40);
      if (action !== "accept" && action !== "decline" && action !== "propose") {
        res.status(400).json({ error: "Choose accept, decline, or propose a time" });
        return;
      }

      const row = await DemoRequest.findOne({
        _id: id,
        teacher: req.auth!.sub,
      });
      if (!row) {
        res.status(404).json({ error: "Demo request not found" });
        return;
      }
      const contexts = await postContexts([row], req.auth!.sub);
      const open =
        row.status === "pending" || (row.status === "proposed" && action !== "accept");
      if (!open) {
        res.json({
          demo: serializeTutor(row, contexts),
          message: "This demo was already answered",
        });
        return;
      }

      if (action === "propose") {
        const today = todayInIndia();
        if (!DATE_RE.test(proposedDate) || proposedDate < today || proposedDate > addDays(today, 60)) {
          res.status(400).json({ error: "Pick a day in the next 60 days" });
          return;
        }
        if (!/^(1[0-2]|[1-9]):[0-5]\d (AM|PM)$/.test(proposedTime)) {
          res.status(400).json({ error: "Pick a time" });
          return;
        }
        if (proposedDate === row.preferredDate && proposedTime === row.preferredTime) {
          res.status(400).json({ error: "That's the time the parent already asked for — accept it instead" });
          return;
        }
        row.status = "proposed";
        row.proposedDate = proposedDate;
        row.proposedTime = proposedTime;
      } else {
        row.status = action === "accept" ? "accepted" : "declined";
        row.proposedDate = undefined;
        row.proposedTime = undefined;
        if (action === "accept") row.confirmedAt = new Date();
        else row.declinedBy = "tutor";
      }
      row.tutorNote = tutorNote;
      row.respondedAt = new Date();
      row.history.push({
        by: "tutor",
        action: action === "accept" ? "accepted" : action === "decline" ? "declined" : "proposed",
        date: action === "propose" ? proposedDate : row.preferredDate,
        time: action === "propose" ? proposedTime : row.preferredTime,
        note: tutorNote || undefined,
        at: new Date(),
      });
      await row.save();

      void notifyParentDemoUpdate(
        row,
        action === "accept" ? "accepted" : action === "decline" ? "declined" : "proposed",
      ).catch((err) => console.error("demo update email failed:", err));

      res.json({
        demo: serializeTutor(row, contexts),
        message:
          action === "accept"
            ? "Demo confirmed. We emailed the parent."
            : action === "decline"
              ? "Demo declined. We let the parent know."
              : "New time sent. We emailed the parent to accept it.",
      });
    } catch (err) {
      console.error("respond demo request error:", err);
      res.status(500).json({ error: "Could not update the demo request" });
    }
  },
);

/** Parent accepts or declines the tutor's proposed slot. */
router.post(
  "/:id/parent-respond",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth!.role !== "parent") {
        res.status(403).json({ error: "Only the parent can answer this" });
        return;
      }
      const id = String(req.params.id || "");
      if (!/^[a-f\d]{24}$/i.test(id)) {
        res.status(404).json({ error: "Demo request not found" });
        return;
      }
      const action = clip(req.body?.action, 20);
      if (action !== "accept" && action !== "decline") {
        res.status(400).json({ error: "Choose accept or decline" });
        return;
      }
      const row = await DemoRequest.findOne({ _id: id, parent: req.auth!.sub });
      if (!row) {
        res.status(404).json({ error: "Demo request not found" });
        return;
      }
      if (row.status !== "proposed" || !row.proposedDate || !row.proposedTime) {
        res.json({ demo: serializeParent(row), message: "Nothing to answer here" });
        return;
      }

      const date = row.proposedDate;
      const time = row.proposedTime;
      if (action === "accept") {
        row.status = "accepted";
        row.preferredDate = date;
        row.preferredTime = time;
        row.proposedDate = undefined;
        row.proposedTime = undefined;
        row.confirmedAt = new Date();
      } else {
        row.status = "declined";
        row.declinedBy = "parent";
      }
      row.history.push({
        by: "parent",
        action: action === "accept" ? "parent_accepted" : "parent_declined",
        date,
        time,
        at: new Date(),
      });
      await row.save();

      void notifyTutorDemoReply(
        row,
        action === "accept" ? "parent_accepted" : "parent_declined",
      ).catch((err) => console.error("demo reply email failed:", err));

      res.json({
        demo: serializeParent(row),
        message: action === "accept" ? "Demo confirmed." : "Proposed time declined.",
      });
    } catch (err) {
      console.error("parent respond demo error:", err);
      res.status(500).json({ error: "Could not update the demo request" });
    }
  },
);

export default router;
