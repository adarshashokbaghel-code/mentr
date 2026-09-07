import { config } from "../config";
import { Connection } from "../models/Connection";
import { Notification, type ParentNotificationType } from "../models/Notification";
import { User } from "../models/User";
import { sendAdminEmail } from "./mail";

type NotifyInput = {
  parentId: string;
  type: ParentNotificationType;
  title: string;
  body: string;
  href?: string;
  meta?: {
    teacherId?: string;
    teacherName?: string;
    requirementId?: string;
    subject?: string;
    classLevel?: string;
    connectionId?: string;
    openSlots?: number;
  };
  /** Skip if a notification with this connectionId already exists */
  dedupeConnectionId?: string;
};

function dashboardUrl(path = "/parent/dashboard"): string {
  return `${config.publicSiteUrl}${path}`;
}

function emailShell(title: string, body: string, ctaLabel: string, ctaHref: string) {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 4px; color: #1a231c;">Mentr by Paprly</h2>
      <p style="margin: 0 0 20px; color: #6b756e; font-size: 12px;">Update for your parent account</p>
      <p style="font-size: 16px; font-weight: 700; color: #1a231c; margin: 0 0 8px;">${title}</p>
      <p style="color: #525252; line-height: 1.5; margin: 0 0 20px;">${body}</p>
      <a href="${ctaHref}" style="display: inline-block; background: #ff9a4d; color: #fff; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 8px;">${ctaLabel}</a>
      <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px;">You're receiving this because something changed on your Mentr account. Reply on WhatsApp after you connect — Mentr stays out of fees.</p>
    </div>
  `;
}

async function sendParentEmail(
  parentId: string,
  subject: string,
  title: string,
  body: string,
  href: string,
) {
  try {
    const user = await User.findById(parentId).select("email role");
    if (!user || user.role !== "parent" || !user.email) return;

    await sendAdminEmail(
      user.email,
      subject,
      `${title}\n\n${body}\n\nOpen: ${href}`,
      emailShell(title, body, "View on Mentr", href),
    );
  } catch (err) {
    console.error("parent notification email failed:", err);
  }
}

export async function notifyParent(input: NotifyInput): Promise<void> {
  const {
    parentId,
    type,
    title,
    body,
    href = "/parent/dashboard",
    meta = {},
    dedupeConnectionId,
  } = input;

  if (dedupeConnectionId) {
    const existing = await Notification.findOne({
      user: parentId,
      type,
      "meta.connectionId": dedupeConnectionId,
    });
    if (existing) return;
  }

  await Notification.create({
    user: parentId,
    type,
    title,
    body,
    href,
    meta: { ...meta, connectionId: dedupeConnectionId ?? meta.connectionId },
  });

  void sendParentEmail(
    parentId,
    `${title} · Mentr`,
    title,
    body,
    dashboardUrl(href),
  );
}

export async function notifyParentConnectionAccepted(
  parentId: string,
  teacherName: string,
  teacherId: string,
  connectionId: string,
) {
  await notifyParent({
    parentId,
    type: "connection_accepted",
    title: `${teacherName} accepted your request`,
    body: `You're connected — open your dashboard to chat on WhatsApp.`,
    href: "/parent/dashboard",
    meta: { teacherId, teacherName, connectionId },
    dedupeConnectionId: connectionId,
  });
}

export async function notifyParentConnectionDeclined(
  parentId: string,
  teacherName: string,
  teacherId: string,
  connectionId: string,
) {
  await notifyParent({
    parentId,
    type: "connection_declined",
    title: `${teacherName} declined your request`,
    body: `Browse other verified tutors or post a requirement — tutors can pitch you for free.`,
    href: "/search",
    meta: { teacherId, teacherName, connectionId },
    dedupeConnectionId: connectionId,
  });
}

export async function notifyParentRequirementPitch(
  parentId: string,
  teacherName: string,
  teacherId: string,
  requirementId: string,
  subject: string,
  classLevel: string,
  connectionId: string,
) {
  const pendingCount = await Connection.countDocuments({
    parent: parentId,
    requirement: requirementId,
    requestedBy: "teacher",
    status: "pending",
  });

  const title =
    pendingCount > 1
      ? `${pendingCount} pitches waiting on your ${subject} post`
      : `${teacherName} pitched on your ${subject} post`;

  const body =
    pendingCount > 1
      ? `Class ${classLevel} · ${pendingCount} tutors waiting — review and accept to unlock WhatsApp.`
      : `Class ${classLevel} · review their message and accept to unlock WhatsApp.`;

  await notifyParent({
    parentId,
    type: "requirement_pitch",
    title,
    body,
    href: "/parent/dashboard#requirements",
    meta: { teacherId, teacherName, requirementId, subject, classLevel, connectionId },
    dedupeConnectionId: connectionId,
  });
}

export async function notifyParentTeacherOutreach(
  parentId: string,
  teacherName: string,
  teacherId: string,
  connectionId: string,
) {
  await notifyParent({
    parentId,
    type: "teacher_outreach",
    title: `${teacherName} reached out to you`,
    body: `They saw you viewed their profile — review their message on your dashboard.`,
    href: "/parent/dashboard",
    meta: { teacherId, teacherName, connectionId },
    dedupeConnectionId: connectionId,
  });
}

export async function notifyParentTutorSlotsOpen(
  parentId: string,
  teacherName: string,
  teacherId: string,
  openSlots: number,
) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recent = await Notification.findOne({
    user: parentId,
    type: "tutor_slots_open",
    "meta.teacherId": teacherId,
    createdAt: { $gte: weekAgo },
  });
  if (recent) return;

  await notifyParent({
    parentId,
    type: "tutor_slots_open",
    title: `${teacherName} has ${openSlots} open slot${openSlots === 1 ? "" : "s"}`,
    body: `You viewed this tutor recently — send a connect request before slots fill up.`,
    href: `/teachers/${teacherId}`,
    meta: { teacherId, teacherName, openSlots },
  });
}

export function countOpenSlots(
  availability: { booked?: boolean }[] | undefined,
): number {
  if (!availability?.length) return 0;
  return availability.filter((s) => !s.booked).length;
}
