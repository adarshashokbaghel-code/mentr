import { config } from "../config";
import type { IDemoRequest } from "../models/DemoRequest";
import { User } from "../models/User";
import { sendAdminEmail } from "./mail";

function siteUrl(path: string): string {
  return `${config.publicSiteUrl}${path}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatWhen(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return `${date} · ${time}`;
  const label = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  return `${label} · ${time}`;
}

function row(label: string, value: string): string {
  if (!value.trim()) return "";
  return `
    <tr>
      <td style="padding: 8px 12px 8px 0; color: #6b756e; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</td>
      <td style="padding: 8px 0; color: #1a231c; font-size: 14px; line-height: 1.45;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function shell(bodyHtml: string, ctaHref: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 0; background: #f6f4ef;">
  <div style="font-family: Georgia, 'Iowan Old Style', serif; max-width: 520px; margin: 0 auto; padding: 28px 16px;">
    <p style="margin: 0 0 4px; font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #c46a32;">Mentr</p>
    <h1 style="margin: 0 0 8px; font-size: 26px; line-height: 1.2; color: #1a231c;">A parent booked a demo with you</h1>
    <p style="margin: 0 0 20px; font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.5; color: #525252;">They picked a subject, class, and time. Their number is below so you can confirm. Open your dashboard to accept or decline.</p>
    <div style="background: #ffffff; border: 1px solid #e6e1d8; border-radius: 16px; padding: 8px 18px;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">${bodyHtml}</table>
    </div>
    <a href="${ctaHref}" style="display: inline-block; margin-top: 20px; background: #1a231c; color: #ffffff; text-decoration: none; font-family: system-ui, sans-serif; font-weight: 700; font-size: 14px; padding: 12px 18px; border-radius: 10px;">Open your dashboard</a>
    <p style="margin: 18px 0 0; font-family: system-ui, sans-serif; font-size: 12px; line-height: 1.5; color: #8a847a;">Demo requests live in Inbox. Fees stay between you and the parent — Mentr takes nothing.</p>
  </div>
</body>
</html>`;
}

/** Email the tutor a copy of a new demo, with a link to the full request. */
export async function notifyTutorDemoRequest(rowDoc: IDemoRequest): Promise<void> {
  const tutor = await User.findById(rowDoc.teacher).select("email role profile.name");
  if (!tutor?.email || tutor.role === "parent") return;

  const when = formatWhen(rowDoc.preferredDate, rowDoc.preferredTime);
  const place = [rowDoc.parentArea, rowDoc.parentCity].filter(Boolean).join(", ");
  const href = siteUrl("/dashboard#inbox");
  const firstName = (tutor.profile?.name || "there").split(" ")[0];

  const lines = [
    `Hi ${firstName},`,
    "",
    `${rowDoc.parentName} booked an online demo with you.`,
    "",
    `Subject: ${rowDoc.subject}`,
    `Class: ${rowDoc.classLevel}`,
    rowDoc.board ? `Board: ${rowDoc.board}` : null,
    `When: ${when}`,
    `Parent: ${rowDoc.parentName}`,
    `Phone: ${rowDoc.parentPhone}`,
    place ? `Area: ${place}` : null,
    rowDoc.note ? `Note: ${rowDoc.note}` : null,
    "",
    `Open your dashboard to confirm or decline:`,
    href,
  ].filter((line): line is string => line !== null);

  const htmlRows = [
    row("Subject", rowDoc.subject),
    row("Class", rowDoc.classLevel),
    row("Board", rowDoc.board || ""),
    row("When", `${when} · Online`),
    row("Parent", rowDoc.parentName),
    row("Phone", rowDoc.parentPhone),
    row("Area", place),
    row("Note", rowDoc.note || ""),
  ].join("");

  await sendAdminEmail(
    tutor.email,
    `New demo — ${rowDoc.subject}, ${when}`,
    lines.join("\n"),
    shell(htmlRows, href),
  );
}
