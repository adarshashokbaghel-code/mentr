import { Router, Response } from "express";
import { DemoRequest, type IDemoRequest } from "../models/DemoRequest";
import { User, type IUser } from "../models/User";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { isProfileComplete } from "../lib/profile-complete";
import { notifyTutorDemoRequest } from "../services/demo-request-notify";

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
  };
}

function serializeTutor(row: IDemoRequest) {
  return {
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
    const subject = clip(req.body?.subject, 80);
    const classLevel = clip(req.body?.classLevel, 40);
    const board = clip(req.body?.board, 40);
    const preferredDate = clip(req.body?.preferredDate, 10);
    const preferredTime = clip(req.body?.preferredTime, 40);
    const note = clip(req.body?.note, 500);

    if (!/^[a-f\d]{24}$/i.test(teacherId)) {
      res.status(404).json({ error: "Tutor not found" });
      return;
    }
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
    if (!(DEMO_TIMES as readonly string[]).includes(preferredTime)) {
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
      status: "pending",
    });
    if (open) {
      res.status(409).json({
        error: "You already have a demo waiting with this tutor",
        code: "ALREADY_PENDING",
        demo: serializeParent(open),
      });
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
      subject,
      classLevel,
      board: board || undefined,
      preferredDate,
      preferredTime,
      mode: "online",
      note,
      status: "pending",
      tutorNote: "",
    });

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
    res.json({ demos: rows.map(serializeTutor) });
  } catch (err) {
    console.error("list tutor demos error:", err);
    res.status(500).json({ error: "Could not load demo requests" });
  }
});

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
      if (action !== "accept" && action !== "decline") {
        res.status(400).json({ error: "Choose accept or decline" });
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
      if (row.status !== "pending") {
        res.json({
          demo: serializeTutor(row),
          message: "This demo was already answered",
        });
        return;
      }

      row.status = action === "accept" ? "accepted" : "declined";
      row.tutorNote = tutorNote;
      row.respondedAt = new Date();
      await row.save();

      res.json({
        demo: serializeTutor(row),
        message:
          action === "accept"
            ? "Demo accepted. The parent's number is already on this request."
            : "Demo declined.",
      });
    } catch (err) {
      console.error("respond demo request error:", err);
      res.status(500).json({ error: "Could not update the demo request" });
    }
  },
);

export default router;
