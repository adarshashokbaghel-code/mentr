import mongoose from "mongoose";
import {
  ParentContactReveal,
  type IParentContactReveal,
} from "../models/ParentContactReveal";
import { Requirement } from "../models/Requirement";
import { User, type IUser } from "../models/User";
import { isMentrPremiumActive } from "./premium-mentor-billing";

export const PARENT_REVEALS_PER_DAY = 3;

function waPhone(raw: string): string {
  const digits = String(raw || "").replace(/\D/g, "");
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

/** Start of today in Asia/Kolkata as a Date (UTC instant). */
export function startOfDayIst(now = new Date()): Date {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const ymd = fmt.format(now); // YYYY-MM-DD
  // IST is UTC+5:30 — midnight IST = previous day 18:30 UTC
  return new Date(`${ymd}T00:00:00+05:30`);
}

export function serializeReveal(row: IParentContactReveal) {
  return {
    id: row._id.toString(),
    parentId: row.parent.toString(),
    parentName: row.parentName,
    parentPhone: row.parentPhone,
    parentEmail: row.parentEmail || null,
    parentCity: row.parentCity || null,
    parentArea: row.parentArea || null,
    hasPosted: Boolean(row.hasPosted),
    openPostsAtReveal: row.openPostsAtReveal || 0,
    revealedAt: row.revealedAt?.toISOString?.() || null,
    whatsappUrl: row.parentPhone
      ? `https://wa.me/${row.parentPhone}`
      : null,
  };
}

async function revealsUsedToday(mentorId: string, now = new Date()) {
  return ParentContactReveal.countDocuments({
    mentor: mentorId,
    revealedAt: { $gte: startOfDayIst(now) },
  });
}

export async function getRevealQuota(mentorId: string, now = new Date()) {
  const usedToday = await revealsUsedToday(mentorId, now);
  return {
    dailyLimit: PARENT_REVEALS_PER_DAY,
    usedToday: Math.min(usedToday, PARENT_REVEALS_PER_DAY),
    remaining: Math.max(0, PARENT_REVEALS_PER_DAY - usedToday),
  };
}

type ParentListOpts = {
  mentor: IUser;
  query?: string;
  onlyPosted?: boolean;
  limit?: number;
};

export async function listParentsForPremiumMentor(opts: ParentListOpts) {
  if (!isMentrPremiumActive(opts.mentor)) {
    return { error: "Premium required", code: "NOT_PREMIUM" as const };
  }

  const limit = Math.min(Math.max(opts.limit ?? 120, 1), 200);
  const filter: Record<string, unknown> = {
    role: "parent",
    "parentProfile.name": { $exists: true, $ne: "" },
    "parentProfile.phoneNumber": { $exists: true, $ne: "" },
  };

  if (opts.query?.trim()) {
    const rx = new RegExp(
      opts.query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    filter.$or = [
      { "parentProfile.name": rx },
      { "parentProfile.city": rx },
      { "parentProfile.area": rx },
      { email: rx },
    ];
  }

  const parents = (await User.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select(
      "email parentProfile profileImageUrl createdAt lastLoginAt",
    )) as IUser[];

  const parentIds = parents.map((p) => p._id);
  const [reqs, reveals, quota] = await Promise.all([
    Requirement.find({ parent: { $in: parentIds } })
      .select("parent subject classLevel status expiresAt createdAt area city")
      .sort({ createdAt: -1 })
      .lean(),
    ParentContactReveal.find({
      mentor: opts.mentor._id,
      parent: { $in: parentIds },
    }),
    getRevealQuota(opts.mentor._id.toString()),
  ]);

  const reqsByParent = new Map<string, typeof reqs>();
  for (const r of reqs) {
    const pid = String(r.parent);
    const list = reqsByParent.get(pid) || [];
    list.push(r);
    reqsByParent.set(pid, list);
  }

  const revealByParent = new Map(
    reveals.map((r) => [r.parent.toString(), r]),
  );

  const now = Date.now();
  let list = parents.map((p) => {
    const pid = p._id.toString();
    const posts = reqsByParent.get(pid) || [];
    const openPosts = posts.filter(
      (r) => r.status === "open" && new Date(r.expiresAt).getTime() > now,
    );
    const reveal = revealByParent.get(pid);
    const pp = p.parentProfile!;
    const maskedPhone = reveal
      ? reveal.parentPhone
      : maskPhone(pp.phoneNumber || "");
    const maskedEmail = reveal
      ? reveal.parentEmail || p.email || null
      : maskEmail(p.email || "");

    return {
      id: pid,
      name: pp.name,
      initials: initialsOf(pp.name),
      imageUrl: (p.profileImageUrl || "").trim() || null,
      city: pp.city || null,
      area: pp.area || null,
      country: pp.country || "India",
      hasPosted: posts.length > 0,
      openPosts: openPosts.length,
      totalPosts: posts.length,
      latestPost: posts[0]
        ? {
            subject: posts[0].subject,
            classLevel: posts[0].classLevel,
            area: posts[0].area || posts[0].city || null,
            status: posts[0].status,
            createdAt: posts[0].createdAt
              ? new Date(posts[0].createdAt).toISOString()
              : null,
          }
        : null,
      joinedAt: p.createdAt?.toISOString?.() ?? null,
      lastLoginAt: p.lastLoginAt?.toISOString?.() ?? null,
      contactRevealed: Boolean(reveal),
      phone: reveal ? reveal.parentPhone : maskedPhone,
      email: maskedEmail,
      whatsappUrl: reveal?.parentPhone
        ? `https://wa.me/${reveal.parentPhone}`
        : null,
      revealedAt: reveal?.revealedAt?.toISOString?.() ?? null,
    };
  });

  if (opts.onlyPosted) {
    list = list.filter((p) => p.hasPosted);
  }

  return {
    parents: list,
    quota,
    premiumActive: true,
  };
}

function maskPhone(raw: string): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length < 4) return "••••••••••";
  return `${"•".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
}

function maskEmail(email: string): string {
  const e = String(email || "").trim();
  if (!e.includes("@")) return "••••@••••";
  const [user, domain] = e.split("@");
  const u = user || "";
  const visible = u.slice(0, Math.min(2, u.length));
  return `${visible}${"•".repeat(Math.max(3, u.length - visible.length))}@${domain}`;
}

export async function revealParentContact(opts: {
  mentor: IUser;
  parentId: string;
}) {
  if (!isMentrPremiumActive(opts.mentor)) {
    return { error: "Premium required", code: "NOT_PREMIUM" as const };
  }
  if (!mongoose.isValidObjectId(opts.parentId)) {
    return { error: "Invalid parent", code: "BAD_ID" as const };
  }

  const existing = await ParentContactReveal.findOne({
    mentor: opts.mentor._id,
    parent: opts.parentId,
  });
  if (existing) {
    const quota = await getRevealQuota(opts.mentor._id.toString());
    return {
      alreadyRevealed: true as const,
      reveal: serializeReveal(existing),
      quota,
    };
  }

  const quota = await getRevealQuota(opts.mentor._id.toString());
  if (quota.remaining <= 0) {
    return {
      error: `Daily limit reached — you can reveal ${PARENT_REVEALS_PER_DAY} parent contacts per day.`,
      code: "DAILY_LIMIT" as const,
      quota,
    };
  }

  const parent = (await User.findById(opts.parentId)) as IUser | null;
  if (!parent || parent.role !== "parent" || !parent.parentProfile?.phoneNumber) {
    return { error: "Parent not found", code: "NOT_FOUND" as const };
  }

  const posts = await Requirement.find({ parent: parent._id })
    .select("status expiresAt")
    .lean();
  const now = Date.now();
  const openPosts = posts.filter(
    (r) => r.status === "open" && new Date(r.expiresAt).getTime() > now,
  );

  try {
    const row = await ParentContactReveal.create({
      mentor: opts.mentor._id,
      parent: parent._id,
      parentName: parent.parentProfile.name,
      parentPhone: waPhone(parent.parentProfile.phoneNumber),
      parentEmail: parent.email || undefined,
      parentCity: parent.parentProfile.city || undefined,
      parentArea: parent.parentProfile.area || undefined,
      hasPosted: posts.length > 0,
      openPostsAtReveal: openPosts.length,
      revealedAt: new Date(),
    });
    const nextQuota = await getRevealQuota(opts.mentor._id.toString());
    return {
      alreadyRevealed: false as const,
      reveal: serializeReveal(row),
      quota: nextQuota,
    };
  } catch (err: unknown) {
    // Race: another request created the unique pair
    const code =
      err && typeof err === "object" && "code" in err
        ? Number((err as { code: number }).code)
        : 0;
    if (code === 11000) {
      const again = await ParentContactReveal.findOne({
        mentor: opts.mentor._id,
        parent: opts.parentId,
      });
      if (again) {
        return {
          alreadyRevealed: true as const,
          reveal: serializeReveal(again),
          quota: await getRevealQuota(opts.mentor._id.toString()),
        };
      }
    }
    throw err;
  }
}

export async function listRevealHistory(mentorId: string, limit = 50) {
  const rows = await ParentContactReveal.find({ mentor: mentorId })
    .sort({ revealedAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 100));
  const quota = await getRevealQuota(mentorId);
  return {
    reveals: rows.map(serializeReveal),
    quota,
  };
}
