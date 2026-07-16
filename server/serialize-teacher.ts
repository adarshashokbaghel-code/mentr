import { Connection, type IConnection } from "./models/Connection";
import { type IUser, type IAvailabilitySlot } from "./models/User";

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

export interface ViewerConnection {
  status: "none" | "pending" | "accepted" | "declined";
  phone: string | null;
}

export const NO_CONNECTION: ViewerConnection = { status: "none", phone: null };

/** Maps a DB user to the public Teacher shape used across the frontend. */
export function toPublicTeacher(
  user: IUser,
  conn: ViewerConnection = NO_CONNECTION,
) {
  const p = user.profile;
  if (!p?.name) {
    throw new Error("Cannot serialize teacher without profile");
  }

  const fmt = p.timeFormat || "12h";
  const timezone = p.timezone || "Asia/Kolkata";
  const tzTag = tzShort(timezone);
  const slots = (p.availability || []).map((s) => ({
    label: `${slotLabel(s, fmt)}${tzTag ? ` ${tzTag}` : ""}`,
    available: !s.booked,
  }));
  const subjects = p.subjects || [];
  const designation = p.designation || "Tutor";
  const isMentor = ["Coach", "Trainer"].includes(designation);
  const openSlots = slots.filter((s) => s.available).length;
  const levels = Array.isArray(p.levels) ? p.levels : [];

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
    designation,
    area: [p.area, p.city].filter(Boolean).join(", ") || "Bengaluru",
    locality: p.area || p.city || "Bengaluru",
    lat: null,
    lng: null,
    bio: p.bio || "",
    levels: levels.join(" · "),
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
    timezone,
    timeFormat: fmt,
    availability: (p.availability || []).map((s) => ({
      day: s.day,
      start: s.start,
      end: s.end,
      booked: Boolean(s.booked),
    })),
    phone: conn.status === "accepted" ? conn.phone : null,
    connectionStatus: conn.status,
    verified: user.emailVerified,
    kind: isMentor ? ("mentor" as const) : ("tutor" as const),
    live: true,
  };
}

export async function viewerConnections(
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
