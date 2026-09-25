import { config } from "../config";
import type { INotLoggedInRequirement } from "../models/NotLoggedInRequirement";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { sendAdminEmail } from "./mail";

function siteUrl(path: string): string {
  return `${config.publicSiteUrl}${path}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailShell(
  title: string,
  bodyHtml: string,
  ctaLabel: string,
  ctaHref: string,
) {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 4px; color: #1a231c;">Mentr by Paprly</h2>
      <p style="margin: 0 0 20px; color: #6b756e; font-size: 12px;">Guest requirement</p>
      <p style="font-size: 16px; font-weight: 700; color: #1a231c; margin: 0 0 8px;">${title}</p>
      ${bodyHtml}
      <a href="${ctaHref}" style="display: inline-block; background: #ff9a4d; color: #fff; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 8px; margin-top: 16px;">${ctaLabel}</a>
    </div>
  `;
}

/** Email + in-app notification when a guest sends a need to a Premium mentor. */
export async function notifyFacultyGuestRequirement(
  row: INotLoggedInRequirement,
): Promise<void> {
  const href = "/dashboard#parents-reached";
  const title = "New parent request (no account)";
  const notifBody = `${row.name} · ${row.requirement}`;

  try {
    await Notification.create({
      user: row.teacher,
      type: "guest_requirement",
      title,
      body: notifBody,
      href,
      meta: {
        teacherId: row.teacher.toString(),
        requirementId: row._id.toString(),
        subject: row.requirement,
      },
    });
  } catch (err) {
    console.error("guest requirement notification failed:", err);
  }

  try {
    const user = await User.findById(row.teacher).select("email role");
    if (!user?.email || user.role !== "faculty") return;

    const textBody = [
      "A parent sent you a requirement without creating an account.",
      "",
      `Name: ${row.name}`,
      `Phone: ${row.phone}`,
      `Email: ${row.email}`,
      `Need: ${row.requirement}`,
      "",
      "Details:",
      row.description,
      "",
      "Open Parents reached on your dashboard:",
      siteUrl(href),
    ].join("\n");

    const htmlBody = `
      <p style="margin: 0 0 12px; color: #525252; font-size: 14px; line-height: 1.5;">
        A parent sent you a requirement without creating an account. You can call or email them directly.
      </p>
      <pre style="white-space: pre-wrap; background: #fffaf5; padding: 12px; border-radius: 8px; color: #525252; font-size: 13px; line-height: 1.5;">${escapeHtml(
        [
          `Name: ${row.name}`,
          `Phone: ${row.phone}`,
          `Email: ${row.email}`,
          `Need: ${row.requirement}`,
          "",
          row.description,
        ].join("\n"),
      )}</pre>
    `;

    await sendAdminEmail(
      user.email,
      `New parent need from ${row.name} — Mentr`,
      textBody,
      emailShell(title, htmlBody, "Open Parents reached", siteUrl(href)),
    );
  } catch (err) {
    console.error("guest requirement email failed:", err);
  }
}
