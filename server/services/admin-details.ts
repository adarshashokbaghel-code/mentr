import { Types } from "mongoose";
import { isDemoUserEmail } from "../lib/demo-users";
import { Connection } from "../models/Connection";
import { OtpSession } from "../models/OtpSession";
import { ProfileView } from "../models/ProfileView";
import { Requirement } from "../models/Requirement";
import {
  NotLoggedInRequirement,
  type IGuestActivity,
} from "../models/NotLoggedInRequirement";
import { User } from "../models/User";

async function demoUserIds(): Promise<Types.ObjectId[]> {
  const rows = await User.find({ email: { $regex: /@mentr\.local$/i } })
    .select("_id")
    .lean();
  return rows.map((r) => r._id as Types.ObjectId);
}

function excludeDemoParticipants(demoIds: Types.ObjectId[]) {
  if (demoIds.length === 0) return {};
  return {
    parent: { $nin: demoIds },
    teacher: { $nin: demoIds },
  };
}

export type AdminConnectionRow = {
  id: string;
  parentName: string;
  parentEmail: string;
  teacherName: string;
  teacherEmail: string;
  status: string;
  requestedBy: string;
  message: string;
  createdAt: string;
  respondedAt?: string;
};

export type AdminRequirementRow = {
  id: string;
  subject: string;
  classLevel: string;
  city: string;
  area: string;
  status: string;
  interestCount: number;
  parentEmail: string;
  details: string;
  expiresAt: string;
  createdAt: string;
};

export async function listAdminConnections(limit = 200): Promise<AdminConnectionRow[]> {
  const demoIds = await demoUserIds();
  const cap = Math.min(Math.max(limit, 1), 500);

  const rows = await Connection.find(excludeDemoParticipants(demoIds))
    .sort({ createdAt: -1 })
    .limit(cap)
    .lean();

  const userIds = new Set<string>();
  for (const row of rows) {
    userIds.add(String(row.parent));
    userIds.add(String(row.teacher));
  }

  const users = await User.find({ _id: { $in: Array.from(userIds) } })
    .select("email")
    .lean();
  const emailById = new Map(users.map((u) => [String(u._id), u.email]));

  return rows.map((row) => ({
    id: String(row._id),
    parentName: row.parentName,
    parentEmail: emailById.get(String(row.parent)) || "Deleted user",
    teacherName: row.teacherName,
    teacherEmail: emailById.get(String(row.teacher)) || "Deleted user",
    status: row.status,
    requestedBy: row.requestedBy,
    message: row.message,
    createdAt: row.createdAt.toISOString(),
    respondedAt: row.respondedAt?.toISOString(),
  }));
}

export async function listAdminRequirements(limit = 200): Promise<AdminRequirementRow[]> {
  const demoIds = await demoUserIds();
  const cap = Math.min(Math.max(limit, 1), 500);

  const rows = await Requirement.find(
    demoIds.length ? { parent: { $nin: demoIds } } : {},
  )
    .sort({ createdAt: -1 })
    .limit(cap)
    .lean();

  const parentIds = rows.map((r) => r.parent);
  const parents = await User.find({ _id: { $in: parentIds } })
    .select("email")
    .lean();
  const emailById = new Map(parents.map((p) => [String(p._id), p.email]));

  return rows.map((row) => ({
    id: String(row._id),
    subject: row.subject,
    classLevel: row.classLevel,
    city: row.city,
    area: row.area,
    status: row.status,
    interestCount: row.interestCount,
    parentEmail: emailById.get(String(row.parent)) || "Deleted user",
    details: row.details,
    expiresAt: row.expiresAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  }));
}

/** Admin: close a board post early (spam, filled offline, etc.). */
export async function closeAdminRequirement(
  id: string,
): Promise<
  | { id: string; status: "closed"; message: string }
  | { error: string; status: number }
> {
  if (!Types.ObjectId.isValid(id)) {
    return { error: "Invalid post id", status: 400 };
  }

  const requirement = await Requirement.findById(id);
  if (!requirement) {
    return { error: "Post not found", status: 404 };
  }
  if (requirement.status === "closed") {
    return { error: "Post is already closed", status: 400 };
  }

  requirement.status = "closed";
  await requirement.save();

  return { id: String(requirement._id), status: "closed", message: "Post closed" };
}

export type AdminProfileViewRow = {
  id: string;
  teacherName: string;
  teacherEmail: string;
  viewerName: string;
  viewerEmail: string;
  viewerArea?: string;
  count: number;
  lastViewedAt: string;
};

export type AdminOtpRow = {
  id: string;
  email: string;
  purpose: string;
  role: string;
  consumed: boolean;
  attempts: number;
  createdAt: string;
};

export async function listAdminProfileViews(limit = 200): Promise<AdminProfileViewRow[]> {
  const demoIds = await demoUserIds();
  const cap = Math.min(Math.max(limit, 1), 500);

  const filter =
    demoIds.length > 0
      ? { teacher: { $nin: demoIds }, viewer: { $nin: demoIds } }
      : {};

  const rows = await ProfileView.find(filter)
    .sort({ lastViewedAt: -1 })
    .limit(cap)
    .lean();

  const userIds = new Set<string>();
  for (const row of rows) {
    userIds.add(String(row.teacher));
    userIds.add(String(row.viewer));
  }

  const users = await User.find({ _id: { $in: Array.from(userIds) } })
    .select("email profile.name parentProfile.name")
    .lean();

  const metaById = new Map(
    users.map((u) => [
      String(u._id),
      {
        email: u.email,
        name: u.profile?.name || u.parentProfile?.name || u.email,
      },
    ]),
  );

  return rows.map((row) => {
    const teacher = metaById.get(String(row.teacher));
    const viewer = metaById.get(String(row.viewer));
    return {
      id: String(row._id),
      teacherName: teacher?.name || "Deleted user",
      teacherEmail: teacher?.email || "Deleted user",
      viewerName: row.viewerName || viewer?.name || "Deleted user",
      viewerEmail: viewer?.email || "Deleted user",
      viewerArea: row.viewerArea,
      count: row.count,
      lastViewedAt: row.lastViewedAt.toISOString(),
    };
  });
}

export async function listAdminOtpActivity(limit = 100): Promise<AdminOtpRow[]> {
  const cap = Math.min(Math.max(limit, 1), 300);
  const rows = await OtpSession.find({})
    .sort({ createdAt: -1 })
    .limit(cap * 2)
    .lean();

  const filtered = rows.filter((r) => !isDemoUserEmail(r.email)).slice(0, cap);

  return filtered.map((row) => ({
    id: String(row._id),
    email: row.email,
    purpose: row.purpose,
    role: row.role,
    consumed: row.consumed,
    attempts: row.attempts,
    createdAt: row.createdAt.toISOString(),
  }));
}

export type AdminGuestRequirementRow = {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  name: string;
  email: string;
  phone: string;
  requirement: string;
  description: string;
  status: string;
  activity: { action: string; at: string }[];
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export async function listAdminGuestRequirements(
  limit = 200,
): Promise<AdminGuestRequirementRow[]> {
  const cap = Math.min(Math.max(limit, 1), 500);

  const rows = await NotLoggedInRequirement.find({})
    .sort({ createdAt: -1 })
    .limit(cap)
    .lean();

  const teacherIds = rows.map((r) => r.teacher);
  const teachers = await User.find({ _id: { $in: teacherIds } })
    .select("email")
    .lean();
  const emailById = new Map(teachers.map((t) => [String(t._id), t.email]));

  return rows.map((row) => ({
    id: String(row._id),
    teacherId: String(row.teacher),
    teacherName: row.teacherName,
    teacherEmail: emailById.get(String(row.teacher)) || "Deleted user",
    name: row.name,
    email: row.email,
    phone: row.phone,
    requirement: row.requirement,
    description: row.description,
    status: row.status,
    activity: ((row.activity ?? []) as IGuestActivity[]).map((a) => ({
      action: a.action,
      at: a.at instanceof Date ? a.at.toISOString() : String(a.at),
    })),
    respondedAt: row.respondedAt
      ? row.respondedAt instanceof Date
        ? row.respondedAt.toISOString()
        : String(row.respondedAt)
      : undefined,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt.toISOString()
        : String(row.updatedAt),
  }));
}
