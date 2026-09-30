import { config } from "../config";
import { User, type IUser } from "../models/User";
import { activePremiumMongoFilter } from "./featured-tutors";
import { sendAdminEmail } from "./mail";

/** Keep signup responsive — emails that miss this window are dropped, not retried. */
const SEND_BUDGET_MS = 8_000;
const INTERNAL_EMAIL_RX = /@(mentr\.local|mentr\.in)$/i;
const SEED_SOURCE_RX = /^seed:/i;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parentsListUrl(): string {
  const q = new URLSearchParams({
    utm_source: "email",
    utm_medium: "premium_alert",
    utm_campaign: "new_parent",
  });
  return `${config.frontendUrl}/parentslist?${q.toString()}`;
}

function renderEmail(opts: {
  mentorName: string;
  parentLocation: string | null;
  parentBoard: string | null;
}) {
  const url = parentsListUrl();
  const mentorName = escapeHtml(opts.mentorName);
  const location = opts.parentLocation ? escapeHtml(opts.parentLocation) : null;
  const board = opts.parentBoard ? escapeHtml(opts.parentBoard) : null;

  const subject = opts.parentLocation
    ? `New parent on Mentr in ${opts.parentLocation}`
    : "A new parent just joined Mentr";

  const text = [
    `Hi ${opts.mentorName},`,
    "",
    "A new parent just joined Mentr.",
    "",
    ...(opts.parentLocation ? [`Location: ${opts.parentLocation}`] : []),
    ...(opts.parentBoard ? [`Board: ${opts.parentBoard}`] : []),
    "Name, phone and email stay hidden until you reveal.",
    "",
    "Reach out early — open the Premium parent list to reveal their contact:",
    url,
    "",
    "You're receiving this because you are an active Mentr Premium mentor.",
    "— Team Mentr",
  ].join("\n");

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #eee7da;color:#6b6456;font-size:13px;width:92px;">${label}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eee7da;color:#1a231c;font-size:14px;font-weight:600;">${value}</td>
    </tr>`;

  const html = `
<div style="background:#f6f1e7;padding:24px 12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:2px solid #1a231c;border-radius:16px;overflow:hidden;">
    <div style="background:#ff6a1a;padding:18px 22px;">
      <p style="margin:0;color:#fff4ea;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Mentr Premium · New parent alert</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;line-height:1.3;">A new parent just joined</h1>
    </div>
    <div style="padding:22px;">
      <p style="margin:0 0 14px;color:#3d3a33;font-size:14px;">Hi ${mentorName},</p>
      <p style="margin:0 0 16px;color:#3d3a33;font-size:14px;line-height:1.5;">
        A parent has just signed up on Mentr. Premium mentors who reach out first usually get the conversation.
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border:1px solid #eee7da;border-radius:12px;border-collapse:separate;overflow:hidden;background:#fbf8f2;">
        ${location ? row("Location", location) : ""}
        ${board ? row("Board", board) : ""}
        ${row("Contact", `<span style="color:#8a8373;font-weight:500;font-size:13px;">Hidden until you reveal</span>`)}
      </table>
      <div style="text-align:center;margin:22px 0 8px;">
        <a href="${url}" style="display:inline-block;background:#1a231c;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 26px;border-radius:12px;">
          Contact parent →
        </a>
      </div>
      <p style="margin:10px 0 0;color:#6b6456;font-size:12px;text-align:center;line-height:1.5;">
        Opens your Premium parent list. Log in if asked — then use a daily reveal to unlock email, phone &amp; WhatsApp.
      </p>
    </div>
    <div style="border-top:1px solid #eee7da;padding:14px 22px;background:#fbf8f2;">
      <p style="margin:0;color:#8a8373;font-size:11px;line-height:1.5;">
        You're receiving this because you are an active Mentr Premium mentor.<br />
        Mentr by Paprly · <a href="${config.frontendUrl}" style="color:#8a8373;">mentr.in</a>
      </p>
    </div>
  </div>
</div>`;

  return { subject, text, html };
}

function isRealParent(parent: IUser): boolean {
  if (parent.role !== "parent" || !parent.emailVerified) return false;
  if (!parent.email || INTERNAL_EMAIL_RX.test(parent.email)) return false;
  return !SEED_SOURCE_RX.test(String(parent.registrationSource || ""));
}

/**
 * Email every active Premium mentor that a new parent joined.
 * Fired on the parent's first email verification (OTP). Idempotent per
 * parent via `premiumMentorsNotifiedAt`. Never throws.
 */
export async function notifyPremiumMentorsOfNewParent(
  parentId: string,
): Promise<{ sent: number; failed: number; skipped?: string }> {
  try {
    // Claim atomically so a double-submit can't send twice.
    const parent = (await User.findOneAndUpdate(
      { _id: parentId, premiumMentorsNotifiedAt: { $exists: false } },
      { $set: { premiumMentorsNotifiedAt: new Date() } },
      { new: true },
    )) as IUser | null;
    if (!parent) return { sent: 0, failed: 0, skipped: "already_notified" };
    if (!isRealParent(parent)) return { sent: 0, failed: 0, skipped: "not_real_parent" };

    const mentors = (await User.find({
      ...activePremiumMongoFilter(),
      role: "faculty",
    }).select("email profile.name")) as IUser[];
    if (mentors.length === 0) return { sent: 0, failed: 0, skipped: "no_mentors" };

    const pp = parent.parentProfile;
    const location =
      [pp?.area, pp?.city].filter((s) => s && String(s).trim()).join(", ") ||
      null;

    const sends = mentors
      .filter((m) => m.email && !INTERNAL_EMAIL_RX.test(m.email))
      .map((m) => {
        const email = renderEmail({
          mentorName: m.profile?.name?.trim() || "there",
          parentLocation: location,
          parentBoard: pp?.board || null,
        });
        return sendAdminEmail(m.email, email.subject, email.text, email.html);
      });

    const settled = await Promise.race([
      Promise.allSettled(sends),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), SEND_BUDGET_MS)),
    ]);
    if (!settled) {
      console.warn("premium new-parent alert: send budget exceeded", parentId);
      return { sent: 0, failed: 0, skipped: "timeout" };
    }
    const failed = settled.filter((r) => r.status === "rejected");
    for (const f of failed) {
      console.error("premium new-parent alert send failed:", (f as PromiseRejectedResult).reason);
    }
    return { sent: settled.length - failed.length, failed: failed.length };
  } catch (err) {
    console.error("premium new-parent alert error:", err);
    return { sent: 0, failed: 0, skipped: "error" };
  }
}
