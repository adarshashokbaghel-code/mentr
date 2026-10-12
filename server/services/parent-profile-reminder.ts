import { config } from "../config";
import { excludeDemoUsersFilter } from "../lib/demo-users";
import { User } from "../models/User";
import { sendAdminEmail } from "./mail";

const MIN_AGE_MS = 2 * 60 * 60 * 1000;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function reminderHtml(name: string, href: string) {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 20px; color: #1a231c;">Mentr by Paprly</h2>
      <p style="font-size: 16px; font-weight: 700; color: #1a231c; margin: 0 0 12px;">Hi ${name}, one step left</p>
      <p style="color: #525252; line-height: 1.5; margin: 0 0 12px;">
        Your Mentr parent account is ready, but tutors can't reply to you yet.
        Add your name, WhatsApp number and city — it takes under a minute.
      </p>
      <ul style="color: #525252; line-height: 1.5; margin: 0 0 20px; padding-left: 20px;">
        <li style="margin: 0 0 6px;">Book a free demo class with verified tutors</li>
        <li style="margin: 0 0 6px;">Post what your child needs and get tutor pitches</li>
        <li style="margin: 0 0 6px;">Pay the tutor directly — Mentr takes no cut</li>
      </ul>
      <a href="${href}" style="display: inline-block; background: #ff9a4d; color: #fff; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 8px;">Finish my profile</a>
      <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px;">Your number is shared only with tutors you choose to contact.</p>
    </div>
  `;
}

function greetingName(email: string): string {
  const local = email.split("@")[0]?.replace(/[._+\d-]+/g, " ").trim() || "";
  const first = local.split(/\s+/)[0] || "";
  return first ? first[0].toUpperCase() + first.slice(1).toLowerCase() : "there";
}

/** Cron entry: one reminder per verified parent who never finished profiling. */
export async function sendParentProfileReminders(): Promise<number> {
  const now = Date.now();
  const parents = await User.find({
    ...excludeDemoUsersFilter,
    role: "parent",
    emailVerified: true,
    profileCompleted: { $ne: true },
    profileReminderSentAt: { $exists: false },
    acquisitionSlug: { $ne: "seed-parent-attract" },
    createdAt: {
      $lte: new Date(now - MIN_AGE_MS),
      $gte: new Date(now - MAX_AGE_MS),
    },
  }).select("email");

  const href = `${config.publicSiteUrl}/parent/profiling?next=${encodeURIComponent("/parent/dashboard")}`;
  let sent = 0;
  for (const parent of parents) {
    try {
      const name = greetingName(parent.email);
      await sendAdminEmail(
        parent.email,
        "One step left to reach tutors · Mentr",
        `Hi ${name}, your Mentr parent account is ready, but tutors can't reply to you yet. Add your name, WhatsApp number and city (under a minute): ${href}`,
        reminderHtml(name, href),
      );
      await User.updateOne(
        { _id: parent._id },
        { $set: { profileReminderSentAt: new Date() } },
      );
      sent += 1;
    } catch (err) {
      console.error("parent profile reminder failed:", err);
    }
  }
  return sent;
}
