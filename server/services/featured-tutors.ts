import mongoose from "mongoose";
import { isProfileComplete } from "../lib/profile-complete";
import { SiteSettings } from "../models/SiteSettings";
import { User, type IUser } from "../models/User";
import { NO_CONNECTION, toPublicTeacher } from "../serialize-teacher";
import { isMentrPremiumActive } from "./premium-mentor-billing";

export const FEATURED_TUTORS_MAX = 8;

/** Active Premium mentors (Razorpay dated or legacy verified). */
export function activePremiumMongoFilter(now = new Date()) {
  return {
    role: { $ne: "parent" },
    $or: [
      {
        "mentrPremium.type": "premium",
        "mentrPremium.expiresAt": { $gt: now },
      },
      {
        premiumMentorStatus: "verified",
        $or: [
          { mentrPremium: { $exists: false } },
          { "mentrPremium.type": { $ne: "premium" } },
        ],
      },
    ],
  };
}

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

function serializePublic(u: IUser): Record<string, unknown> | null {
  if (!isProfileComplete(u)) return null;
  try {
    return JSON.parse(
      JSON.stringify(toPublicTeacher(u, NO_CONNECTION)),
    ) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Landing featured strip: active Premium mentors first, then admin-curated IDs.
 * Deduped, capped at FEATURED_TUTORS_MAX.
 */
export async function loadFeaturedPublicTeachers(): Promise<
  Record<string, unknown>[]
> {
  const now = new Date();
  const [premiumUsers, curatedIds] = await Promise.all([
    User.find(activePremiumMongoFilter(now))
      .sort({ "mentrPremium.lastPurchasedAt": -1, premiumMentorVerifiedAt: -1 })
      .limit(FEATURED_TUTORS_MAX) as Promise<IUser[]>,
    getFeaturedTeacherIds(),
  ]);

  const ordered: Record<string, unknown>[] = [];
  const seen = new Set<string>();

  for (const u of premiumUsers) {
    if (ordered.length >= FEATURED_TUTORS_MAX) break;
    const row = serializePublic(u);
    if (!row) continue;
    seen.add(u._id.toString());
    ordered.push(row);
  }

  if (ordered.length < FEATURED_TUTORS_MAX && curatedIds.length > 0) {
    const remainingIds = curatedIds.filter((id) => !seen.has(id));
    if (remainingIds.length > 0) {
      const curated = (await User.find({
        _id: { $in: remainingIds },
        role: { $ne: "parent" },
      })) as IUser[];
      const byId = new Map(curated.map((u) => [u._id.toString(), u]));
      for (const id of remainingIds) {
        if (ordered.length >= FEATURED_TUTORS_MAX) break;
        const u = byId.get(id);
        if (!u) continue;
        const row = serializePublic(u);
        if (!row) continue;
        ordered.push(row);
      }
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
  premium: boolean;
  hourlyRate: number | null;
  profileComplete: boolean;
};

export async function listActivePremiumAdminRows(
  limit = FEATURED_TUTORS_MAX,
): Promise<FeaturedAdminRow[]> {
  const now = new Date();
  const users = (await User.find(activePremiumMongoFilter(now))
    .sort({
      "mentrPremium.lastPurchasedAt": -1,
      premiumMentorVerifiedAt: -1,
    })
    .limit(Math.min(Math.max(limit, 1), FEATURED_TUTORS_MAX))) as IUser[];
  return users.map(toAdminRow).filter((r) => r.profileComplete);
}

/** Public directory of active Premium mentors (higher cap than homepage featured). */
export const PUBLIC_PREMIUM_MENTORS_MAX = 80;

export async function loadPublicPremiumTeachers(
  limit = PUBLIC_PREMIUM_MENTORS_MAX,
): Promise<Record<string, unknown>[]> {
  const now = new Date();
  const cap = Math.min(Math.max(limit, 1), PUBLIC_PREMIUM_MENTORS_MAX);
  const users = (await User.find(activePremiumMongoFilter(now))
    .sort({
      "mentrPremium.lastPurchasedAt": -1,
      premiumMentorVerifiedAt: -1,
      createdAt: -1,
    })
    .limit(cap)) as IUser[];

  const ordered: Record<string, unknown>[] = [];
  for (const u of users) {
    const row = serializePublic(u);
    if (!row) continue;
    ordered.push(row);
  }
  return ordered;
}

export async function getAdminFeaturedState(): Promise<{
  ids: string[];
  selected: FeaturedAdminRow[];
  /** Active Premium mentors — always first on the homepage featured strip. */
  premiumAuto: FeaturedAdminRow[];
  max: number;
}> {
  const [ids, premiumAuto] = await Promise.all([
    getFeaturedTeacherIds(),
    listActivePremiumAdminRows(FEATURED_TUTORS_MAX),
  ]);
  const selected = await resolveAdminRows(ids);
  return { ids, selected, premiumAuto, max: FEATURED_TUTORS_MAX };
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
    premium: isMentrPremiumActive(u),
    hourlyRate: p?.hourlyRate ?? null,
    profileComplete: isProfileComplete(u),
  };
}
