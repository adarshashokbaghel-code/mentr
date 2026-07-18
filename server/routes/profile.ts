import { Router, Response } from "express";
import {
  TEACHING_MODES,
  User,
  WEEK_DAYS,
  type IAvailabilitySlot,
  type IFacultyProfile,
  type IParentProfile,
  type ISocialLinks,
} from "../models/User";
import { Connection, type IConnection } from "../models/Connection";
import { ProfileView, type IProfileView } from "../models/ProfileView";
import { recordProfileView } from "../lib/record-profile-view";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { isProfileComplete, serializeUser } from "./auth";

const router = Router();

router.use(ensureDb);

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const PHONE_RE = /^\+?[\d\s-]{10,15}$/;

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function sanitizeStringArray(value: unknown, max = 20): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => String(v).trim())
    .filter(Boolean)
    .slice(0, max);
}

function validateAvailability(value: unknown): string | IAvailabilitySlot[] {
  if (!Array.isArray(value) || value.length === 0) {
    return "Add at least one availability slot";
  }
  if (value.length > 40) return "Too many availability slots";

  const slots: IAvailabilitySlot[] = [];
  for (const raw of value) {
    const day = String(raw?.day || "").toLowerCase();
    const start = String(raw?.start || "");
    const end = String(raw?.end || "");
    if (!WEEK_DAYS.includes(day as (typeof WEEK_DAYS)[number])) {
      return "Invalid day in availability";
    }
    if (!TIME_RE.test(start) || !TIME_RE.test(end)) {
      return "Times must be in HH:mm format";
    }
    if (toMinutes(start) >= toMinutes(end)) {
      return "Slot end time must be after start time";
    }
    slots.push({
      day: day as IAvailabilitySlot["day"],
      start,
      end,
      booked: Boolean(raw?.booked),
    });
  }
  return slots;
}

/** IANA zone check, e.g. "Asia/Kolkata" — falls back gracefully for old clients. */
function validateTimezone(value: unknown): string | null {
  const tz = String(value ?? "").trim();
  if (!tz) return "Asia/Kolkata";
  if (tz.length > 64) return null;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return null;
  }
}

/** Normalizes to https:// and validates; returns undefined for empty, null for invalid. */
function normalizeUrl(value: unknown): string | undefined | null {
  const raw = String(value ?? "").trim();
  if (!raw) return undefined;
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProto);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function buildSocials(
  body: Record<string, unknown>,
): { ok: true; socials?: ISocialLinks } | { ok: false; error: string } {
  const raw = (body.socials ?? {}) as Record<string, unknown>;
  const labels: Record<keyof ISocialLinks, string> = {
    linkedin: "LinkedIn",
    github: "GitHub",
    website: "Website",
    youtube: "YouTube",
    instagram: "Instagram",
  };
  const socials: ISocialLinks = {};
  for (const key of Object.keys(labels) as (keyof ISocialLinks)[]) {
    const normalized = normalizeUrl(raw[key]);
    if (normalized === null) {
      return { ok: false, error: `Enter a valid ${labels[key]} URL` };
    }
    if (normalized) socials[key] = normalized;
  }
  return {
    ok: true,
    socials: Object.keys(socials).length > 0 ? socials : undefined,
  };
}

function buildProfile(body: Record<string, unknown>):
  | { ok: true; profile: IFacultyProfile }
  | { ok: false; error: string } {
  const name = String(body.name || "").trim();
  const designation = String(body.designation || "").trim();
  const phoneNumber = String(body.phoneNumber || "").trim();
  const country = String(body.country || "").trim();
  const city = String(body.city || "").trim();
  const area = String(body.area || "").trim();
  const qualification = String(body.qualification || "").trim();
  const bio = String(body.bio || "").trim();
  const subjects = sanitizeStringArray(body.subjects);
  const levels = sanitizeStringArray(body.levels);
  const languages = sanitizeStringArray(body.languages);
  const teachingModes = sanitizeStringArray(body.teachingModes).filter((m) =>
    TEACHING_MODES.includes(m as (typeof TEACHING_MODES)[number]),
  ) as IFacultyProfile["teachingModes"];
  const experienceYears = Number(body.experienceYears);
  const timeFormat = body.timeFormat === "24h" ? "24h" : "12h";
  const timezone = validateTimezone(body.timezone);
  if (timezone === null) {
    return { ok: false, error: "Select a valid time zone" };
  }
  const workplace = String(body.workplace || "").trim();
  const certifications = sanitizeStringArray(body.certifications, 15);
  const achievements = sanitizeStringArray(body.achievements, 10);
  if (certifications.some((c) => c.length > 120)) {
    return { ok: false, error: "Certification entries must be under 120 characters" };
  }
  if (achievements.some((a) => a.length > 160)) {
    return { ok: false, error: "Achievement entries must be under 160 characters" };
  }
  const introVideo = normalizeUrl(body.introVideo);
  if (introVideo === null) {
    return { ok: false, error: "Enter a valid intro video URL" };
  }
  const genderRaw = String(body.gender || "").trim();
  const gender = ["male", "female", "other"].includes(genderRaw)
    ? (genderRaw as IFacultyProfile["gender"])
    : undefined;

  const hourlyRateRaw = body.hourlyRate;
  let hourlyRate: number | undefined;
  if (hourlyRateRaw !== undefined && hourlyRateRaw !== null && hourlyRateRaw !== "") {
    hourlyRate = Number(hourlyRateRaw);
    if (!Number.isFinite(hourlyRate) || hourlyRate < 0 || hourlyRate > 100000) {
      return { ok: false, error: "Enter a valid hourly rate" };
    }
  }

  if (!name) return { ok: false, error: "Full name is required" };
  if (name.length > 80) return { ok: false, error: "Name is too long" };
  if (!designation) return { ok: false, error: "Role is required" };
  if (designation.length > 60) return { ok: false, error: "Role is too long" };
  if (!PHONE_RE.test(phoneNumber)) {
    return { ok: false, error: "Enter a valid WhatsApp number" };
  }
  if (!country) return { ok: false, error: "Country is required" };
  if (!city) return { ok: false, error: "City is required" };
  if (!area) return { ok: false, error: "Area / locality is required" };
  if (country.length > 56 || city.length > 60 || area.length > 80) {
    return { ok: false, error: "Location fields are too long" };
  }
  if (qualification.length > 120) {
    return { ok: false, error: "Qualification is too long" };
  }
  if (workplace.length > 120) {
    return { ok: false, error: "Workplace is too long" };
  }
  if (subjects.length === 0) {
    return { ok: false, error: "Add at least one subject" };
  }
  if (levels.length === 0) {
    return { ok: false, error: "Select at least one level you teach" };
  }
  if (languages.length === 0) {
    return { ok: false, error: "Add at least one language" };
  }
  if (!qualification) {
    return { ok: false, error: "Highest qualification is required" };
  }
  if (!Number.isFinite(experienceYears) || experienceYears < 0 || experienceYears > 60) {
    return { ok: false, error: "Enter valid years of experience (0–60)" };
  }
  if (teachingModes.length === 0) {
    return { ok: false, error: "Pick at least one teaching mode" };
  }
  if (bio.length < 30) {
    return { ok: false, error: "Bio must be at least 30 characters" };
  }
  if (bio.length > 1200) {
    return { ok: false, error: "Bio must be under 1200 characters" };
  }

  const availability = validateAvailability(body.availability);
  if (typeof availability === "string") {
    return { ok: false, error: availability };
  }

  const socialsResult = buildSocials(body);
  if (!socialsResult.ok) return socialsResult;

  return {
    ok: true,
    profile: {
      name,
      designation,
      phoneNumber,
      bio,
      subjects,
      country,
      city,
      area,
      levels,
      languages,
      qualification,
      experienceYears,
      teachingModes,
      hourlyRate,
      timeFormat,
      timezone,
      availability,
      gender,
      workplace: workplace || undefined,
      certifications,
      achievements,
      introVideo,
      socials: socialsResult.socials,
    },
  };
}

function buildParentProfile(body: Record<string, unknown>):
  | { ok: true; profile: IParentProfile }
  | { ok: false; error: string } {
  const name = String(body.name || "").trim();
  const phoneNumber = String(body.phoneNumber || "").trim();
  const country = String(body.country || "").trim();
  const city = String(body.city || "").trim();
  const area = String(body.area || "").trim();

  if (!name) return { ok: false, error: "Full name is required" };
  if (name.length > 80) return { ok: false, error: "Name is too long" };
  if (!PHONE_RE.test(phoneNumber)) {
    return { ok: false, error: "Enter a valid WhatsApp number" };
  }
  if (!country) return { ok: false, error: "Country is required" };
  if (!city) return { ok: false, error: "City is required" };
  if (country.length > 56 || city.length > 60 || area.length > 80) {
    return { ok: false, error: "Location fields are too long" };
  }

  return {
    ok: true,
    profile: { name, phoneNumber, country, city, area: area || undefined },
  };
}

router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.auth!.sub);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      role: user.role,
      profile: user.profile ?? null,
      parentProfile: user.parentProfile ?? null,
      profileCompleted: isProfileComplete(user),
    });
  } catch (error) {
    console.error("get profile error:", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

/** Parent opened a tutor profile — record the view (login-gated). */
router.post(
  "/views/:teacherId",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth!.role !== "parent") {
        res.status(403).json({ error: "Only parent accounts record profile views" });
        return;
      }

      const teacherId = String(req.params.teacherId || "");
      if (!/^[a-f\d]{24}$/i.test(teacherId)) {
        res.status(404).json({ error: "Teacher not found" });
        return;
      }
      if (teacherId === req.auth!.sub) {
        res.status(400).json({ error: "Cannot record a view on your own profile" });
        return;
      }

      const teacher = await User.findById(teacherId).select("role profileCompleted");
      if (!teacher || teacher.role === "parent" || !teacher.profileCompleted) {
        res.status(404).json({ error: "Teacher not found" });
        return;
      }

      await recordProfileView(teacherId, req.auth!.sub);
      res.status(204).end();
    } catch (error) {
      console.error("record profile view error:", error);
      res.status(500).json({ error: "Failed to record profile view" });
    }
  },
);

/** Who saw my profile — tutors only. Distinct parents, most recent first. */
router.get(
  "/views",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth!.role === "parent") {
        res.status(403).json({ error: "Only tutor accounts have profile views" });
        return;
      }

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const [views, totalViewers, weekCount, connections] = await Promise.all([
        ProfileView.find({ teacher: req.auth!.sub })
          .sort({ lastViewedAt: -1 })
          .limit(30) as Promise<IProfileView[]>,
        ProfileView.countDocuments({ teacher: req.auth!.sub }),
        ProfileView.countDocuments({
          teacher: req.auth!.sub,
          lastViewedAt: { $gte: weekAgo },
        }),
        Connection.find({ teacher: req.auth!.sub }).limit(200) as Promise<
          IConnection[]
        >,
      ]);

      const connectionByParent = new Map<string, IConnection>(
        connections.map((c) => [c.parent.toString(), c]),
      );

      res.json({
        totalViewers,
        weekCount,
        views: views.map((v) => {
          const viewerId = v.viewer.toString();
          const connection = connectionByParent.get(viewerId);
          const status = connection?.status ?? "none";
          const requestedBy = connection?.requestedBy;
          const canReachOut =
            !connection || connection.status === "declined";

          return {
            id: viewerId,
            name: v.viewerName,
            area: v.viewerArea ?? null,
            count: v.count,
            lastViewedAt: v.lastViewedAt,
            connectionStatus: status,
            connectionId: connection?._id.toString() ?? null,
            requestedBy: requestedBy ?? null,
            canReachOut,
          };
        }),
      });
    } catch (error) {
      console.error("get profile views error:", error);
      res.status(500).json({ error: "Failed to load profile views" });
    }
  },
);

/** Basic details for parents — name, WhatsApp number, where they are from. */
router.put(
  "/parent",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await User.findById(req.auth!.sub);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      if (user.role !== "parent") {
        res.status(403).json({ error: "Only parent accounts can save this profile" });
        return;
      }

      const result = buildParentProfile(req.body ?? {});
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }

      user.parentProfile = result.profile;
      user.profileCompleted = true;
      await user.save();

      res.json({
        user: serializeUser(user),
        message: "You're all set. Find your teacher!",
      });
    } catch (error) {
      console.error("update parent profile error:", error);
      res.status(500).json({ error: "Failed to save profile" });
    }
  },
);

/** Toggle booked/open on existing slots without resubmitting the whole profile. */
router.patch(
  "/availability",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await User.findById(req.auth!.sub);
      if (!user || !user.profile) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }

      const availability = validateAvailability(req.body?.availability);
      if (typeof availability === "string") {
        res.status(400).json({ error: availability });
        return;
      }

      user.profile.availability = availability;
      user.markModified("profile.availability");
      await user.save();

      res.json({
        user: serializeUser(user),
        message: "Availability updated",
      });
    } catch (error) {
      console.error("update availability error:", error);
      res.status(500).json({ error: "Failed to update availability" });
    }
  },
);

router.put("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.auth!.sub);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (user.role === "parent") {
      res.status(403).json({ error: "Parent accounts cannot create a tutor listing" });
      return;
    }

    const result = buildProfile(req.body ?? {});
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }

    user.profile = result.profile;
    user.profileCompleted = true;
    await user.save();

    res.json({
      user: serializeUser(user),
      message: "Profile saved. You're live on Mentr!",
    });
  } catch (error) {
    console.error("update profile error:", error);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;
