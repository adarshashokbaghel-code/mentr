import { randomBytes } from "crypto";
import mongoose from "mongoose";
import { config } from "../config";
import { excludeDemoUsersFilter } from "../lib/demo-users";
import { isProfileComplete } from "../lib/profile-complete";
import { IUser, User } from "../models/User";
import {
  defaultTemplateVars,
  listMessengerTemplates,
  renderMessengerTemplate,
  type MessengerTemplateId,
} from "./email-templates";
import { sendAdminEmail } from "./mail";

export type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  profileComplete: boolean;
  emailVerified: boolean;
  city: string;
  createdAt: string;
  lastLoginAt?: string;
  referralUrl?: string;
  registrationSource?: string;
};

function toAdminUserRow(u: IUser & { _id: unknown; createdAt: Date }): AdminUserRow {
  return {
    id: String(u._id),
    email: u.email,
    name: displayName(u),
    role: u.role,
    profileComplete: isProfileComplete(u),
    emailVerified: u.emailVerified,
    city: u.profile?.city || u.parentProfile?.city || "—",
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt?.toISOString(),
    referralUrl: u.referralUrl,
    registrationSource: u.registrationSource,
  };
}

function userSearchFilter(q: string) {
  const filter: Record<string, unknown> = { ...excludeDemoUsersFilter };
  if (!q.trim()) return filter;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  filter.$or = [
    { email: { $regex: escaped, $options: "i" } },
    { "profile.name": { $regex: escaped, $options: "i" } },
    { "parentProfile.name": { $regex: escaped, $options: "i" } },
  ];
  return filter;
}

function displayName(user: IUser): string {
  if (user.profile?.name?.trim()) return user.profile.name.trim();
  if (user.parentProfile?.name?.trim()) return user.parentProfile.name.trim();
  const local = user.email.split("@")[0] || "there";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function buildReferralUrl(refCode: string): string {
  const base = config.publicSiteUrl;
  return `${base}/faculty/signup?ref=${encodeURIComponent(refCode)}`;
}

function extractRefFromUrl(url: string): string | null {
  try {
    return new URL(url).searchParams.get("ref");
  } catch {
    return null;
  }
}

export async function ensureReferralUrl(user: IUser): Promise<string> {
  const publicBase = config.publicSiteUrl;

  if (user.referralUrl) {
    const ref = extractRefFromUrl(user.referralUrl);
    if (ref && !user.referralUrl.startsWith(publicBase)) {
      user.referralUrl = buildReferralUrl(ref);
      await user.save();
    }
    return user.referralUrl;
  }

  const refCode = randomBytes(8).toString("hex");
  const referralUrl = buildReferralUrl(refCode);
  user.referralUrl = referralUrl;
  await user.save();
  return referralUrl;
}

export async function listAdminUsers(
  query = "",
  limit = 500,
): Promise<AdminUserRow[]> {
  const cap = Math.min(Math.max(limit, 1), 1000);
  const users = await User.find(userSearchFilter(query))
    .sort({ createdAt: -1 })
    .limit(cap)
    .lean();

  return users.map((u) => toAdminUserRow(u as IUser & { _id: unknown; createdAt: Date }));
}

export async function searchAdminUsers(query: string, limit = 40): Promise<AdminUserRow[]> {
  return listAdminUsers(query, limit);
}

export function getMessengerTemplates() {
  return listMessengerTemplates();
}

export function previewMessengerEmail(
  templateId: MessengerTemplateId,
  opts?: { name?: string; referralUrl?: string },
) {
  const defaults = defaultTemplateVars(opts?.referralUrl);
  return renderMessengerTemplate(templateId, {
    ...defaults,
    name: opts?.name?.trim() || defaults.name,
    referralUrl: opts?.referralUrl || defaults.referralUrl,
  });
}

export type SendResult = {
  userId: string;
  email: string;
  ok: boolean;
  error?: string;
  referralUrl?: string;
};

export async function sendMessengerEmails(
  templateId: MessengerTemplateId,
  userIds: string[],
): Promise<{ sent: number; failed: number; results: SendResult[] }> {
  const template = listMessengerTemplates().find((t) => t.id === templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);

  const validIds = userIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
  const invalidIds = userIds.filter((id) => !mongoose.Types.ObjectId.isValid(id));

  const users = validIds.length
    ? await User.find({ _id: { $in: validIds } })
    : [];
  const byId = new Map(users.map((u) => [u._id.toString(), u]));

  const results: SendResult[] = [];
  let sent = 0;
  let failed = 0;

  for (const userId of invalidIds) {
    results.push({ userId, email: "", ok: false, error: "Invalid user id" });
    failed += 1;
  }

  for (const userId of validIds) {
    const user = byId.get(userId);
    if (!user) {
      results.push({ userId, email: "", ok: false, error: "User not found" });
      failed += 1;
      continue;
    }

    try {
      const referralUrl = await ensureReferralUrl(user);
      const vars = {
        ...defaultTemplateVars(referralUrl),
        name: displayName(user),
        referralUrl,
      };
      const rendered = renderMessengerTemplate(templateId, vars);
      await sendAdminEmail(user.email, rendered.subject, rendered.text, rendered.html);
      results.push({ userId, email: user.email, ok: true, referralUrl });
      sent += 1;
    } catch (err) {
      results.push({
        userId,
        email: user.email,
        ok: false,
        error: err instanceof Error ? err.message : "Send failed",
      });
      failed += 1;
    }
  }

  return { sent, failed, results };
}
