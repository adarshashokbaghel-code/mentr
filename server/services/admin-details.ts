import { Types } from "mongoose";
import { isDemoUserEmail } from "../lib/demo-users";
import { Connection } from "../models/Connection";
import { OtpSession } from "../models/OtpSession";
import { ProfileView } from "../models/ProfileView";
import { Requirement } from "../models/Requirement";
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
    parentEmail: emailById.get(String(row.parent)) || "—",
    teacherName: row.teacherName,
    teacherEmail: emailById.get(String(row.teacher)) || "—",
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
    parentEmail: emailById.get(String(row.parent)) || "—",
    details: row.details,
    expiresAt: row.expiresAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  }));
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
      teacherName: teacher?.name || "—",
      teacherEmail: teacher?.email || "—",
      viewerName: row.viewerName || viewer?.name || "—",
      viewerEmail: viewer?.email || "—",
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
