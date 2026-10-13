import { config } from "../config";
import type { IRequirement } from "../models/Requirement";
import { User } from "../models/User";
import { sendAdminEmail } from "./mail";

const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const MODE_LABELS: Record<string, string> = {
  online: "Online",
  student_home: "At the student's home",
  tutor_home: "At the tutor's place",
};

const START_LABELS: Record<string, string> = {
  immediately: "Immediately",
  within_week: "Within a week",
  within_month: "Within a month",
  flexible: "Flexible",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function budgetText(r: IRequirement): string {
  if (r.budgetMin == null && r.budgetMax == null) return "";
  if (r.budgetMin != null && r.budgetMax != null) return `₹${r.budgetMin}–${r.budgetMax}/hr`;
  return r.budgetMax != null ? `Up to ₹${r.budgetMax}/hr` : `₹${r.budgetMin}+/hr`;
}

function row(label: string, value: string): string {
  if (!value.trim()) return "";
  return `
          <tr>
            <td style="padding: 7px 12px 7px 0; font-family: ${SANS}; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8a847a; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</td>
            <td style="padding: 7px 0; font-family: ${SANS}; font-size: 14px; line-height: 1.45; color: #1a231c;">${escapeHtml(value)}</td>
          </tr>`;
}

/**
 * Email the best-matching tutors when a parent posts, so posts don't sit
 * unseen until someone happens to open the board. The parent stays anonymous.
 */
export async function alertTutorsOfNewPost(
  requirement: IRequirement,
  tutorIds: string[],
): Promise<void> {
  if (tutorIds.length === 0) return;
  const tutors = await User.find({
    _id: { $in: tutorIds },
    role: "faculty",
    emailVerified: true,
  }).select("email profile.name");

  const href = `${config.publicSiteUrl}/board`;
  const what = `${requirement.subject} · ${requirement.classLevel}${
    requirement.board && requirement.board !== "Other" ? ` · ${requirement.board}` : ""
  }`;
  const where =
    requirement.area && requirement.area !== requirement.city
      ? `${requirement.area}, ${requirement.city}`
      : requirement.city;
  const modes = requirement.modes.map((m) => MODE_LABELS[m]).filter(Boolean).join(" or ");
  const budget = budgetText(requirement);
  const start = START_LABELS[requirement.startTimeline] ?? "";

  await Promise.allSettled(
    tutors.map(async (tutor) => {
      if (!tutor.email) return;
      const firstName = (tutor.profile?.name || "there").split(" ")[0];
      await sendAdminEmail(
        tutor.email,
        `New ${requirement.subject} student in ${requirement.city} — pitch before others do`,
        [
          `Hi ${firstName},`,
          "",
          `A parent just posted a need that matches your profile:`,
          `${what}`,
          `Area: ${where}`,
          modes ? `Mode: ${modes}` : null,
          budget ? `Budget: ${budget}` : null,
          start ? `Start: ${start}` : null,
          "",
          requirement.details,
          "",
          `Send your pitch: ${href}`,
        ]
          .filter((l): l is string => typeof l === "string")
          .join("\n"),
        `<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 0; background: #f6f4ef;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${escapeHtml(`${what} in ${where} — pitch the parent on Mentr`)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f6f4ef;">
    <tr><td align="center" style="padding: 28px 14px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px;">
        <tr><td style="padding: 0 6px 14px; font-family: ${SANS}; font-size: 15px; font-weight: 800; color: #1a231c;">mentr<span style="color: #ff8a3d;">.</span></td></tr>
        <tr><td style="background: #ffffff; border: 1px solid #e6e1d8; border-radius: 18px; padding: 24px 22px;">
          <span style="display: inline-block; background: #fff1e6; color: #c4561e; font-family: ${SANS}; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px;">New post matches you</span>
          <h1 style="margin: 12px 0 6px; font-family: ${SANS}; font-size: 22px; line-height: 1.25; color: #1a231c;">${escapeHtml(what)}</h1>
          <p style="margin: 0 0 14px; font-family: ${SANS}; font-size: 14px; line-height: 1.55; color: #5b5549;">Hi ${escapeHtml(firstName)}, a parent in ${escapeHtml(where)} is looking for a tutor. Send a short pitch — if they pick you, they book a free online demo.</p>
          <div style="border-left: 3px solid #ff8a3d; padding: 6px 0 6px 12px; font-family: ${SANS}; font-size: 14px; line-height: 1.55; color: #3d3830;">${escapeHtml(requirement.details)}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 14px; border-collapse: collapse;">${[
            row("Area", where),
            row("Mode", modes),
            row("Budget", budget),
            row("Start", start),
          ].join("")}
          </table>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
            <tr><td style="border-radius: 10px; background: #ff8a3d;"><a href="${href}" style="display: inline-block; padding: 12px 20px; font-family: ${SANS}; font-size: 14px; font-weight: 800; color: #ffffff; text-decoration: none;">Pitch this parent</a></td></tr>
          </table>
        </td></tr>
        <tr><td style="padding: 16px 6px 0; font-family: ${SANS}; font-size: 12px; line-height: 1.55; color: #8a847a; text-align: center;">You're getting this because your Mentr profile matches this post. The parent's name and number unlock once they book a demo with you.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      );
    }),
  );
}
