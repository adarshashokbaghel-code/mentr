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
    demoId?: string;
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

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function pitchEmailHtml(input: {
  parentFirst: string;
  teacherName: string;
  teacherArea: string;
  profileHref: string;
  subject: string;
  classLevel: string;
  postArea: string;
  message: string;
  href: string;
  pendingCount: number;
  signInFirst: boolean;
  email: string;
  alreadyConnected?: boolean;
}): string {
  const quote = escapeHtml(input.message).replace(/\n/g, "<br>");
  const initial = escapeHtml(input.teacherName.trim().charAt(0).toUpperCase() || "M");
  const post = [`${input.subject} · ${input.classLevel}`, input.postArea]
    .filter((v) => v.trim())
    .join(" · ");
  const waiting =
    input.pendingCount > 1
      ? `<p style="margin: 0 0 16px; padding: 10px 14px; background: #fff4ea; border-radius: 10px; font-family: ${SANS}; font-size: 13px; line-height: 1.45; color: #8a4a1c;"><strong>${input.pendingCount} tutors</strong> have pitched on this post so far. Compare them side by side on your dashboard.</p>`
      : "";
  const steps = input.alreadyConnected
    ? ""
    : `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0 0;">
      ${[
        input.signInFirst
          ? `Sign in with <strong>${escapeHtml(input.email)}</strong>. We email you a 6-digit code, no password needed.`
          : "Open <strong>My posts</strong> on your dashboard.",
        "Compare the pitches and open any tutor's profile.",
        "Tap <strong>Book free demo</strong> on the one you like and pick a time.",
      ]
        .map(
          (step, i) => `
      <tr>
        <td width="28" valign="top" style="padding: 0 0 10px;"><div style="width: 20px; height: 20px; border-radius: 10px; background: #1a231c; color: #ffffff; font-family: ${SANS}; font-size: 11px; font-weight: 700; line-height: 20px; text-align: center;">${i + 1}</div></td>
        <td valign="top" style="padding: 1px 0 10px; font-family: ${SANS}; font-size: 13px; line-height: 1.5; color: #525252;">${step}</td>
      </tr>`,
        )
        .join("")}
    </table>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin: 0; padding: 0; background: #f6f4ef;">
  <div style="display: none; max-height: 0; overflow: hidden;">${escapeHtml(input.teacherName)} wants to teach your ${escapeHtml(input.subject)} requirement. Review their pitch on Mentr.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f6f4ef;">
    <tr><td align="center" style="padding: 28px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px;">
        <tr><td style="padding: 0 4px 16px; font-family: ${SANS}; font-size: 15px; font-weight: 800; letter-spacing: -0.01em; color: #1a231c;">Mentr<span style="color: #ff9a4d;">.</span></td></tr>
        <tr><td style="background: #ffffff; border: 1px solid #e6e1d8; border-radius: 18px; padding: 26px 22px;">
          <p style="margin: 0 0 6px; font-family: ${SANS}; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #c46a32;">New pitch on your post</p>
          <h1 style="margin: 0 0 10px; font-family: Georgia, 'Iowan Old Style', serif; font-size: 24px; line-height: 1.25; font-weight: 700; color: #1a231c;">${escapeHtml(input.teacherName)} wants to teach your child</h1>
          <p style="margin: 0 0 18px; font-family: ${SANS}; font-size: 14px; line-height: 1.55; color: #525252;">Hi ${escapeHtml(input.parentFirst)}, a verified tutor read your ${escapeHtml(input.subject)} requirement and sent you this pitch.</p>
          ${waiting}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e6e1d8; border-radius: 14px;">
            <tr><td style="padding: 16px 16px 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td valign="middle" style="padding-right: 12px;"><div style="width: 40px; height: 40px; border-radius: 20px; background: #e8efe9; color: #2f5a3c; font-family: ${SANS}; font-size: 16px; font-weight: 700; line-height: 40px; text-align: center;">${initial}</div></td>
                <td valign="middle">
                  <p style="margin: 0; font-family: ${SANS}; font-size: 15px; font-weight: 700; color: #1a231c;">${escapeHtml(input.teacherName)}</p>
                  ${input.teacherArea ? `<p style="margin: 2px 0 0; font-family: ${SANS}; font-size: 12px; color: #6b756e;">${escapeHtml(input.teacherArea)}</p>` : ""}
                </td>
              </tr></table>
            </td></tr>
            <tr><td style="padding: 0 16px 16px;">
              <p style="margin: 0; padding: 12px 14px; background: #faf8f4; border-left: 3px solid #ff9a4d; border-radius: 4px; font-family: ${SANS}; font-size: 14px; line-height: 1.6; color: #1a231c;">${quote}</p>
              <p style="margin: 10px 0 0; font-family: ${SANS}; font-size: 12px; color: #6b756e;">Your post: ${escapeHtml(post)} · <a href="${input.profileHref}" style="color: #1a231c; font-weight: 700;">View tutor profile</a></p>
            </td></tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 22px 0 0;">
            <tr><td align="center" style="border-radius: 12px; background: #ff9a4d;">
              <a href="${input.href}" style="display: block; padding: 14px 18px; font-family: ${SANS}; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none;">${input.alreadyConnected ? "Open my dashboard" : input.pendingCount > 1 ? "Compare pitches on my dashboard" : "Review pitch on my dashboard"}</a>
            </td></tr>
          </table>
          ${steps}
        </td></tr>
        <tr><td style="padding: 16px 6px 0; font-family: ${SANS}; font-size: 12px; line-height: 1.55; color: #8a847a; text-align: center;">${input.alreadyConnected ? "You're already connected with this tutor. Mentr takes no fee." : "Your number is shared only with a tutor you book a demo with. Mentr takes no fee from parents or tutors."}<br>You're getting this because you posted a requirement on Mentr.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendRequirementPitchEmail(input: {
  parentId: string;
  teacherId: string;
  teacherName: string;
  teacherArea: string;
  subject: string;
  classLevel: string;
  postArea: string;
  message: string;
  pendingCount: number;
  alreadyConnected?: boolean;
}): Promise<void> {
  const parent = await User.findById(input.parentId).select(
    "email role emailVerified parentProfile.name",
  );
  if (!parent?.email || parent.role !== "parent") return;

  const parentName = parent.parentProfile?.name?.trim() || "there";
  const parentFirst = parentName.split(" ")[0] || "there";
  const dashboardPath = "/parent/dashboard#requirements";
  // Guest posters have an unverified account, so send them through sign-in
  // with the email already filled in.
  const signInFirst = !parent.emailVerified;
  const href = signInFirst
    ? dashboardUrl(
        `/parent?email=${encodeURIComponent(parent.email)}&next=${encodeURIComponent(dashboardPath)}`,
      )
    : dashboardUrl(dashboardPath);
  const profileHref = dashboardUrl(`/teachers/${input.teacherId}`);
  const text = [
    `Hi ${parentFirst},`,
    "",
    `${input.teacherName} pitched on your ${input.subject} post (${input.classLevel}).`,
    "",
    `"${input.message}"`,
    "",
    input.teacherArea ? `Tutor area: ${input.teacherArea}` : null,
    input.postArea ? `Your post: ${input.postArea}` : null,
    `Tutor profile: ${profileHref}`,
    input.pendingCount > 1
      ? `${input.pendingCount} tutors have pitched on this post so far.`
      : null,
    "",
    input.alreadyConnected
      ? "You're already connected. Their new pitch is on your dashboard:"
      : signInFirst
        ? `Sign in with ${parent.email} (we email you a code) to compare and book a demo:`
        : "Compare pitches and book a free demo on your dashboard:",
    href,
    "",
    input.alreadyConnected
      ? "Mentr takes no fee."
      : "Your number is shared only with a tutor you book a demo with.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  await sendAdminEmail(
    parent.email,
    input.pendingCount > 1
      ? `${input.teacherName} pitched on your ${input.subject} post (${input.pendingCount} pitches waiting)`
      : `${input.teacherName} pitched on your ${input.subject} post`,
    text,
    pitchEmailHtml({
      parentFirst,
      teacherName: input.teacherName,
      teacherArea: input.teacherArea,
      profileHref,
      subject: input.subject,
      classLevel: input.classLevel,
      postArea: input.postArea,
      message: input.message,
      href,
      pendingCount: input.pendingCount,
      signInFirst,
      email: parent.email,
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
      ? `Class ${classLevel} · ${pendingCount} tutors waiting — compare and book a free demo.`
      : `Class ${classLevel} · review their pitch and book a free demo.`;

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
      teacherId,
      teacherName,
      teacherArea,
      subject,
      classLevel,
      postArea,
      message,
      pendingCount,
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
