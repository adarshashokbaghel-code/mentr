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
  /** In-app notification only — caller sends its own email */
  skipEmail?: boolean;
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
    skipEmail = false,
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

  if (!skipEmail) {
    void sendParentEmail(
      parentId,
      `${title} · Mentr`,
      title,
      body,
      dashboardUrl(href),
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pitchEmailHtml(input: {
  parentFirst: string;
  teacherName: string;
  teacherArea: string;
  subject: string;
  classLevel: string;
  postArea: string;
  message: string;
  href: string;
  alreadyConnected?: boolean;
}): string {
  const quote = escapeHtml(input.message).replace(/\n/g, "<br>");
  const detail = [
    ["Tutor", input.teacherName],
    ["Area", input.teacherArea],
    ["Your post", `${input.subject} · ${input.classLevel}`],
    ["Where", input.postArea],
  ]
    .filter(([, value]) => value.trim())
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 8px 12px 8px 0; color: #6b756e; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; vertical-align: top; white-space: nowrap;">${label}</td>
          <td style="padding: 8px 0; color: #1a231c; font-size: 14px; line-height: 1.45;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 0; background: #f6f4ef;">
  <div style="font-family: Georgia, 'Iowan Old Style', serif; max-width: 520px; margin: 0 auto; padding: 28px 16px;">
    <p style="margin: 0 0 4px; font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #c46a32;">Mentr</p>
    <h1 style="margin: 0 0 8px; font-size: 26px; line-height: 1.2; color: #1a231c;">A tutor pitched on your post</h1>
    <p style="margin: 0 0 20px; font-family: system-ui, sans-serif; font-size: 14px; line-height: 1.5; color: #525252;">Hi ${escapeHtml(input.parentFirst)}, ${escapeHtml(input.teacherName)} wants to teach your ${escapeHtml(input.subject)} requirement.${input.alreadyConnected ? " You're already connected, so you can reply on WhatsApp." : " Read the pitch, then accept on your dashboard if you want to chat on WhatsApp."}</p>
    <div style="background: #ffffff; border: 1px solid #e6e1d8; border-radius: 16px; padding: 16px 18px; margin: 0 0 12px;">
      <p style="margin: 0 0 8px; font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #6b756e;">Their pitch</p>
      <p style="margin: 0; font-family: system-ui, sans-serif; font-size: 15px; line-height: 1.55; color: #1a231c;">${quote}</p>
    </div>
    <div style="background: #ffffff; border: 1px solid #e6e1d8; border-radius: 16px; padding: 8px 18px;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">${detail}</table>
    </div>
    <a href="${input.href}" style="display: inline-block; margin-top: 20px; background: #1a231c; color: #ffffff; text-decoration: none; font-family: system-ui, sans-serif; font-weight: 700; font-size: 14px; padding: 12px 18px; border-radius: 10px;">Review this pitch</a>
    <p style="margin: 18px 0 0; font-family: system-ui, sans-serif; font-size: 12px; line-height: 1.5; color: #8a847a;">${input.alreadyConnected ? "Mentr takes no fee." : "Your number stays private until you accept. WhatsApp unlocks only after you do. Mentr takes no fee."}</p>
  </div>
</body>
</html>`;
}

async function sendRequirementPitchEmail(input: {
  parentId: string;
  teacherName: string;
  teacherArea: string;
  subject: string;
  classLevel: string;
  postArea: string;
  message: string;
  alreadyConnected?: boolean;
}): Promise<void> {
  const parent = await User.findById(input.parentId).select(
    "email role parentProfile.name",
  );
  if (!parent?.email || parent.role !== "parent") return;

  const parentName = parent.parentProfile?.name?.trim() || "there";
  const parentFirst = parentName.split(" ")[0] || "there";
  const href = dashboardUrl("/parent/dashboard#requirements");
  const text = [
    `Hi ${parentFirst},`,
    "",
    `${input.teacherName} pitched on your ${input.subject} post (${input.classLevel}).`,
    "",
    input.message,
    "",
    input.teacherArea ? `Tutor area: ${input.teacherArea}` : null,
    input.postArea ? `Your post: ${input.postArea}` : null,
    "",
    input.alreadyConnected
      ? "You're already connected. Their new pitch is on your dashboard:"
      : "Review and accept on your dashboard to unlock WhatsApp:",
    href,
    "",
    input.alreadyConnected
      ? "Mentr takes no fee."
      : "Your number stays private until you accept.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  await sendAdminEmail(
    parent.email,
    `${input.teacherName} pitched on your ${input.subject} post`,
    text,
    pitchEmailHtml({
      parentFirst,
      teacherName: input.teacherName,
      teacherArea: input.teacherArea,
      subject: input.subject,
      classLevel: input.classLevel,
      postArea: input.postArea,
      message: input.message,
      href,
      alreadyConnected: input.alreadyConnected,
    }),
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

export async function notifyParentRequirementPitch(input: {
  parentId: string;
  teacherName: string;
  teacherId: string;
  teacherArea?: string;
  requirementId: string;
  subject: string;
  classLevel: string;
  postArea?: string;
  message: string;
  connectionId: string;
  alreadyConnected?: boolean;
}) {
  const {
    parentId,
    teacherName,
    teacherId,
    teacherArea = "",
    requirementId,
    subject,
    classLevel,
    postArea = "",
    message,
    connectionId,
    alreadyConnected = false,
  } = input;

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
    meta: {
      teacherId,
      teacherName,
      requirementId,
      subject,
      classLevel,
      connectionId,
    },
    dedupeConnectionId: connectionId,
    skipEmail: true,
  });

  try {
    await sendRequirementPitchEmail({
      parentId,
      teacherName,
      teacherArea,
      subject,
      classLevel,
      postArea,
      message,
      alreadyConnected,
    });
  } catch (err) {
    console.error("requirement pitch email failed:", err);
  }
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
