import mongoose from "mongoose";
import { isProfileComplete } from "../lib/profile-complete";
import { SiteSettings } from "../models/SiteSettings";
import { User, type IUser } from "../models/User";
import { NO_CONNECTION, toPublicTeacher } from "../serialize-teacher";

export const FEATURED_TUTORS_MAX = 8;

export async function getFeaturedTeacherIds(): Promise<string[]> {
  const doc = await SiteSettings.findOne({ key: "main" }).lean();
  const ids = (doc?.featuredTeacherIds || []).map(String).filter(Boolean);
  return ids.slice(0, FEATURED_TUTORS_MAX);
}

export async function setFeaturedTeacherIds(
  rawIds: unknown,
): Promise<string[]> {
  if (!Array.isArray(rawIds)) {
    throw new Error("featuredTeacherIds must be an array");
  }

  const cleaned = [
    ...new Set(
      rawIds
        .map((id) => String(id || "").trim())
        .filter((id) => mongoose.isValidObjectId(id)),
    ),
  ].slice(0, FEATURED_TUTORS_MAX);

  if (cleaned.length > 0) {
    const users = (await User.find({
      _id: { $in: cleaned },
      role: { $ne: "parent" },
    }).select("_id profile.name")) as IUser[];
    const valid = new Set(users.map((u) => u._id.toString()));
    const ordered = cleaned.filter((id) => valid.has(id));
    await SiteSettings.findOneAndUpdate(
      { key: "main" },
      { $set: { featuredTeacherIds: ordered } },
      { upsert: true, new: true },
    );
    return ordered;
  }

  await SiteSettings.findOneAndUpdate(
    { key: "main" },
    { $set: { featuredTeacherIds: [] } },
    { upsert: true, new: true },
  );
  return [];
}

export async function loadFeaturedPublicTeachers(): Promise<
  Record<string, unknown>[]
> {
  const ids = await getFeaturedTeacherIds();
  if (ids.length === 0) return [];

  const users = (await User.find({
    _id: { $in: ids },
    role: { $ne: "parent" },
  })) as IUser[];

  const byId = new Map(users.map((u) => [u._id.toString(), u]));
  const ordered: Record<string, unknown>[] = [];

  for (const id of ids) {
    const u = byId.get(id);
    if (!u || !isProfileComplete(u)) continue;
    try {
      ordered.push(
        JSON.parse(JSON.stringify(toPublicTeacher(u, NO_CONNECTION))) as Record<
          string,
          unknown
        >,
      );
    } catch {
      /* skip broken profile */
    }
  }

  return ordered;
}

export type FeaturedAdminRow = {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  area: string;
  city: string;
  imageUrl: string;
  verified: boolean;
  hourlyRate: number | null;
  profileComplete: boolean;
};

export async function getAdminFeaturedState(): Promise<{
  ids: string[];
  selected: FeaturedAdminRow[];
  max: number;
}> {
  const ids = await getFeaturedTeacherIds();
  const selected = await resolveAdminRows(ids);
  return { ids, selected, max: FEATURED_TUTORS_MAX };
}

export async function searchFacultyForFeatured(
  q: string,
  limit = 24,
): Promise<FeaturedAdminRow[]> {
  const query = q.trim();
  const filter: Record<string, unknown> = {
    role: { $ne: "parent" },
    "profile.name": { $exists: true, $ne: "" },
  };
  if (query) {
    const rx = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { "profile.name": rx },
      { email: rx },
      { "profile.subjects": rx },
      { "profile.city": rx },
      { "profile.area": rx },
    ];
  }

  const users = (await User.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 50))) as IUser[];

  return users.map(toAdminRow);
}

async function resolveAdminRows(ids: string[]): Promise<FeaturedAdminRow[]> {
  if (ids.length === 0) return [];
  const users = (await User.find({ _id: { $in: ids } })) as IUser[];
  const byId = new Map(users.map((u) => [u._id.toString(), u]));
  return ids
    .map((id) => byId.get(id))
    .filter((u): u is IUser => Boolean(u))
    .map(toAdminRow);
}

function toAdminRow(u: IUser): FeaturedAdminRow {
  const p = u.profile;
  return {
    id: u._id.toString(),
    name: p?.name || "Untitled",
    email: u.email || "",
    subjects: p?.subjects || [],
    area: p?.area || "",
    city: p?.city || "",
    imageUrl: (u.profileImageUrl || "").trim(),
    verified: Boolean(u.emailVerified),
    hourlyRate: p?.hourlyRate ?? null,
    profileComplete: isProfileComplete(u),
  };
}
