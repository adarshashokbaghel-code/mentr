import { Router, Response } from "express";
import { Connection, type IConnection } from "../models/Connection";
import { ProfileView } from "../models/ProfileView";
import { User, type IUser, type IAvailabilitySlot } from "../models/User";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { isProfileComplete } from "./auth";

const router = Router();

router.use(ensureDb);

// Teacher data (names, phone numbers, availability) is for signed-in
// users only — the find-teachers experience is fully login-gated.
router.use(requireAuth);

const DAY_SHORT: Record<IAvailabilitySlot["day"], string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

function formatTime(t: string, fmt: "12h" | "24h"): string {
  if (fmt === "24h") return t;
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function slotLabel(slot: IAvailabilitySlot, fmt: "12h" | "24h"): string {
  return `${DAY_SHORT[slot.day]} ${formatTime(slot.start, fmt)}–${formatTime(slot.end, fmt)}`;
}

const TZ_ABBREVIATIONS: Record<string, string> = {
  "Asia/Kolkata": "IST",
  "Asia/Dubai": "GST",
  "Asia/Singapore": "SGT",
  "Asia/Tokyo": "JST",
  "Asia/Hong_Kong": "HKT",
  "Asia/Riyadh": "AST",
  "Asia/Karachi": "PKT",
  "Asia/Dhaka": "BST",
  "Asia/Kathmandu": "NPT",
  "Australia/Sydney": "AEST",
  "Australia/Perth": "AWST",
  "Europe/London": "UK",
  "Europe/Paris": "CET",
  "Europe/Berlin": "CET",
  "America/New_York": "ET",
  "America/Chicago": "CT",
  "America/Denver": "MT",
  "America/Los_Angeles": "PT",
  "America/Toronto": "ET",
  "America/Vancouver": "PT",
  UTC: "UTC",
};

/** Short zone name shown after slot times, e.g. "IST" or "GMT+2". */
function tzShort(tz: string): string {
  if (TZ_ABBREVIATIONS[tz]) return TZ_ABBREVIATIONS[tz];
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value || "";
  } catch {
    return "";
  }
}

/** wa.me needs a country code — assume India for bare 10-digit numbers */
function waPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/**
 * Viewer-specific connection state. Phone numbers are never public:
 * a parent only gets the number after the teacher accepts their request.
 */
interface ViewerConnection {
  status: "none" | "pending" | "accepted" | "declined";
  phone: string | null;
}

const NO_CONNECTION: ViewerConnection = { status: "none", phone: null };

/** Maps a DB user to the public Teacher shape used across the frontend. */
function toPublicTeacher(user: IUser, conn: ViewerConnection = NO_CONNECTION) {
  const p = user.profile!;
  const fmt = p.timeFormat || "12h";
  const timezone = p.timezone || "Asia/Kolkata";
  const tzTag = tzShort(timezone);
  const slots = (p.availability || []).map((s) => ({
    label: `${slotLabel(s, fmt)}${tzTag ? ` ${tzTag}` : ""}`,
    available: !s.booked,
  }));
  const subjects = p.subjects || [];
  const isMentor = ["Coach", "Trainer"].includes(p.designation);
  const openSlots = slots.filter((s) => s.available).length;

  return {
    id: user._id.toString(),
    name: p.name,
    initials: initialsOf(p.name),
    imageUrl: "",
    subjects,
    subjectLine: subjects.slice(0, 2).join(" & ") || "Faculty",
    experienceYears: p.experienceYears ?? 0,
    rating: 0,
    reviewCount: 0,
    openSlots,
    designation: p.designation,
    area: [p.area, p.city].filter(Boolean).join(", "),
    locality: p.area || p.city || "",
    lat: null,
    lng: null,
    bio: p.bio,
    levels: (p.levels || []).join(" · "),
    modes: p.teachingModes || [],
    languages: p.languages || [],
    qualification: p.qualification || "",
    workplace: p.workplace || "",
    certifications: p.certifications || [],
    achievements: p.achievements || [],
    introVideo: p.introVideo || "",
    hourlyRate: p.hourlyRate ?? null,
    socials: p.socials || {},
    slots,
    // Raw weekly slots + zone so the frontend can convert to the viewer's time
    timezone,
    timeFormat: fmt,
    availability: (p.availability || []).map((s) => ({
      day: s.day,
      start: s.start,
      end: s.end,
      booked: Boolean(s.booked),
    })),
    // Numbers stay private until the teacher accepts this viewer's request
    phone: conn.status === "accepted" ? conn.phone : null,
    connectionStatus: conn.status,
    verified: user.emailVerified,
    kind: isMentor ? "mentor" : "tutor",
    live: true,
  };
}

/** Connection state of one parent against a set of teachers. */
async function viewerConnections(
  viewerId: string,
  viewerRole: string,
  teachers: IUser[],
): Promise<Map<string, ViewerConnection>> {
  const map = new Map<string, ViewerConnection>();
  if (viewerRole !== "parent" || teachers.length === 0) return map;

  const connections = (await Connection.find({
    parent: viewerId,
    teacher: { $in: teachers.map((t) => t._id) },
  })) as IConnection[];

  const byTeacher = new Map(
    connections.map((c) => [c.teacher.toString(), c.status]),
  );
  for (const t of teachers) {
    const status = byTeacher.get(t._id.toString());
    if (!status) continue;
    map.set(t._id.toString(), {
      status,
      phone:
        status === "accepted" ? waPhone(t.profile?.phoneNumber || "") : null,
    });
  }
  return map;
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
