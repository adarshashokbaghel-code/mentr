import { config } from "../config";
import {
  InstantConnectRequest,
  type IInstantConnectRequest,
} from "../models/InstantConnectRequest";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { sendAdminEmail } from "./mail";

function siteUrl(path: string): string {
  return `${config.publicSiteUrl}${path}`;
}

function emailShell(title: string, bodyHtml: string, ctaLabel: string, ctaHref: string) {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 4px; color: #1a231c;">Mentr by Paprly</h2>
      <p style="margin: 0 0 20px; color: #6b756e; font-size: 12px;">Instant Connect</p>
      <p style="font-size: 16px; font-weight: 700; color: #1a231c; margin: 0 0 8px;">${title}</p>
      ${bodyHtml}
      <a href="${ctaHref}" style="display: inline-block; background: #ff9a4d; color: #fff; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 8px; margin-top: 16px;">${ctaLabel}</a>
    </div>
  `;
}

function reqSummary(r: IInstantConnectRequest): string {
  const budget =
    r.budgetMin != null || r.budgetMax != null
      ? `₹${r.budgetMin ?? 0}–₹${r.budgetMax ?? "∞"}/hour`
      : "Flexible";
  return [
    `Class: ${r.classLevel}`,
    `Subject: ${r.subject}`,
    `Board: ${r.board}`,
    `Mode: ${r.mode}`,
    `Budget: ${budget}`,
    r.preferredTime ? `Preferred time: ${r.preferredTime}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function reqSummaryHtml(r: IInstantConnectRequest): string {
  return `<pre style="white-space: pre-wrap; background: #fffaf5; padding: 12px; border-radius: 8px; color: #525252; font-size: 13px; line-height: 1.5;">${reqSummary(r)}</pre>`;
}

/** Expire due active requests (idempotent). */
export async function expireDueInstantConnectRequests(): Promise<number> {
  const now = new Date();
  const result = await InstantConnectRequest.updateMany(
    { status: "active", expiresAt: { $lte: now } },
    { $set: { status: "expired", closedAt: now, closedBy: "system" } },
  );
  return result.modifiedCount || 0;
}

export async function ensureRequestFresh(
  r: IInstantConnectRequest,
): Promise<IInstantConnectRequest> {
  if (r.status === "active" && r.expiresAt.getTime() <= Date.now()) {
    r.status = "expired";
    r.closedAt = new Date();
    r.closedBy = "system";
    await r.save();
  }
  return r;
}

export function canViewParentPhone(
  r: IInstantConnectRequest,
  mentorId: string,
): boolean {
  if (r.status !== "active") return false;
  if (r.expiresAt.getTime() <= Date.now()) return false;
  return r.selectedTutorIds.some((id) => id.toString() === mentorId);
}

export async function notifyFacultyInstantConnect(
  tutorIds: string[],
  request: IInstantConnectRequest,
): Promise<void> {
  const href = `/dashboard#instant-connect`;
  const title = "New Instant Connect request";
  const body = reqSummary(request);
  const htmlBody = `
    <p style="color: #525252; line-height: 1.5;">You have a new Instant Connect request. Open your dashboard to view the parent contact while this requirement is active.</p>
    ${reqSummaryHtml(request)}
    <p style="color: #6b756e; font-size: 12px; margin-top: 12px;">Parent contact is only shown in your Mentr dashboard — not in this email.</p>
  `;

  for (const id of tutorIds) {
    try {
      await Notification.create({
        user: id,
        type: "instant_connect_request",
        title,
        body,
        href,
        meta: {
          instantConnectId: request._id.toString(),
          subject: request.subject,
          classLevel: request.classLevel,
        },
      });

      const user = await User.findById(id).select("email role");
      if (!user?.email || user.role !== "faculty") continue;

      await sendAdminEmail(
        user.email,
        "New Instant Connect request on Mentr",
        `${title}\n\n${body}\n\nView request: ${siteUrl(href)}\n\nParent contact is available in your dashboard while the requirement is active.`,
        emailShell(title, htmlBody, "View request", siteUrl(href)),
      );
    } catch (err) {
      console.error("IC faculty notify failed:", id, err);
    }
  }
}

export async function notifyParentInstantConnectEvent(
  parentId: string,
  opts: {
    type:
      | "instant_connect_submitted"
      | "instant_connect_closed"
      | "instant_connect_expired";
    title: string;
    body: string;
    requestId: string;
  },
): Promise<void> {
  const href = `/parent/dashboard#instant-connect`;
  try {
    await Notification.create({
      user: parentId,
      type: opts.type,
      title: opts.title,
      body: opts.body,
      href,
      meta: { instantConnectId: opts.requestId },
    });

    const user = await User.findById(parentId).select("email role");
    if (!user?.email || user.role !== "parent") return;

    await sendAdminEmail(
      user.email,
      `${opts.title} · Mentr`,
      `${opts.title}\n\n${opts.body}\n\n${siteUrl(href)}`,
      emailShell(
        opts.title,
        `<p style="color:#525252;line-height:1.5;">${opts.body}</p>`,
        "View on Mentr",
        siteUrl(href),
      ),
    );
  } catch (err) {
    console.error("IC parent notify failed:", err);
  }
}

export async function notifyFacultyRequestEnded(
  tutorIds: string[],
  request: IInstantConnectRequest,
  ended: "closed" | "expired",
): Promise<void> {
  const title =
    ended === "closed"
      ? "Instant Connect requirement closed"
      : "Instant Connect requirement expired";
  const body =
    ended === "closed"
      ? "The parent closed this requirement. Parent contact is no longer available."
      : "This requirement expired after 48 hours. Parent contact is no longer available.";

  for (const id of tutorIds) {
    try {
      await Notification.create({
        user: id,
        type:
          ended === "closed"
            ? "instant_connect_closed"
            : "instant_connect_expired",
        title,
        body,
        href: `/dashboard#instant-connect`,
        meta: {
          instantConnectId: request._id.toString(),
          subject: request.subject,
          classLevel: request.classLevel,
        },
      });
    } catch (err) {
      console.error("IC faculty end notify failed:", id, err);
    }
  }
}
