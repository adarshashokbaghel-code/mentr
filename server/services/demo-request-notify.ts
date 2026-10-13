import { config } from "../config";
import type { IDemoRequest } from "../models/DemoRequest";
import { User } from "../models/User";
import { sendAdminEmail } from "./mail";
import { notifyParent } from "./parent-notifications";

const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const DEMO_MINUTES = 60;

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

function formatDay(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

function timeText(time: string): string {
  return time === "Flexible" ? "Any time that day" : time;
}

export function formatWhen(date: string, time: string): string {
  return `${formatDay(date)} · ${timeText(time)}`;
}

/** Google Calendar "add event" link; null when the time isn't a fixed hour. */
export function googleCalendarUrl(input: {
  title: string;
  details: string;
  date: string;
  time: string;
  timezone: string;
}): string | null {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(input.time);
  const [y, m, d] = input.date.split("-").map(Number);
  if (!match || !y || !m || !d) return null;
  const startMin = ((Number(match[1]) % 12) + (match[3] === "PM" ? 12 : 0)) * 60 + Number(match[2]);
  const stamp = (minutes: number) => {
    const day = new Date(Date.UTC(y, m - 1, d, 0, minutes));
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${day.getUTCFullYear()}${pad(day.getUTCMonth() + 1)}${pad(day.getUTCDate())}T${pad(day.getUTCHours())}${pad(day.getUTCMinutes())}00`;
  };
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    details: input.details,
    dates: `${stamp(startMin)}/${stamp(startMin + DEMO_MINUTES)}`,
    ctz: input.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function detailRow(label: string, value: string): string {
  if (!value.trim()) return "";
  return `
          <tr>
            <td style="padding: 7px 12px 7px 0; font-family: ${SANS}; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8a847a; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</td>
            <td style="padding: 7px 0; font-family: ${SANS}; font-size: 14px; line-height: 1.45; color: #1a231c;">${escapeHtml(value)}</td>
          </tr>`;
}

type Tone = "coral" | "sage" | "muted";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  coral: { bg: "#fff1e6", fg: "#c4561e" },
  sage: { bg: "#e8f2ea", fg: "#2f6b45" },
  muted: { bg: "#f1eee8", fg: "#6b6458" },
};

/** One layout for every demo email: badge, headline, slot card, details, CTA. */
function demoEmailHtml(input: {
  preheader: string;
  badge: string;
  tone: Tone;
  title: string;
  intro: string;
  whenLabel: string;
  when: string;
  previousWhen?: string;
  rows: string;
  quote?: { by: string; text: string };
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  footer: string;
}): string {
  const tone = TONES[input.tone];
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 0; background: #f6f4ef;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${escapeHtml(input.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f6f4ef;">
    <tr><td align="center" style="padding: 28px 14px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px;">
        <tr><td style="padding: 0 6px 14px; font-family: ${SANS}; font-size: 15px; font-weight: 800; color: #1a231c;">mentr<span style="color: #ff8a3d;">.</span></td></tr>
        <tr><td style="background: #ffffff; border: 1px solid #e6e1d8; border-radius: 18px; padding: 24px 22px;">
          <span style="display: inline-block; background: ${tone.bg}; color: ${tone.fg}; font-family: ${SANS}; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px;">${escapeHtml(input.badge)}</span>
          <h1 style="margin: 12px 0 6px; font-family: ${SANS}; font-size: 22px; line-height: 1.25; color: #1a231c;">${escapeHtml(input.title)}</h1>
          <p style="margin: 0 0 18px; font-family: ${SANS}; font-size: 14px; line-height: 1.55; color: #5b5549;">${input.intro}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #faf8f4; border: 1px solid #ece7de; border-radius: 14px;">
            <tr><td style="padding: 14px 16px;">
              <div style="font-family: ${SANS}; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8a847a;">${escapeHtml(input.whenLabel)}</div>
              <div style="margin-top: 4px; font-family: ${SANS}; font-size: 18px; font-weight: 800; color: #1a231c;">${escapeHtml(input.when)}</div>
              ${
                input.previousWhen
                  ? `<div style="margin-top: 3px; font-family: ${SANS}; font-size: 13px; color: #9a9387;">Instead of <span style="text-decoration: line-through;">${escapeHtml(input.previousWhen)}</span></div>`
                  : ""
              }
              <div style="margin-top: 3px; font-family: ${SANS}; font-size: 12px; color: #8a847a;">Online demo · free on Mentr</div>
            </td></tr>
          </table>

          ${
            input.quote
              ? `<div style="margin-top: 14px; border-left: 3px solid #ff8a3d; padding: 6px 0 6px 12px; font-family: ${SANS}; font-size: 14px; line-height: 1.55; color: #3d3830;"><strong style="color: #1a231c;">${escapeHtml(input.quote.by)}:</strong> “${escapeHtml(input.quote.text)}”</div>`
              : ""
          }

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 14px; border-collapse: collapse;">${input.rows}
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
            <tr>
              <td style="border-radius: 10px; background: #ff8a3d;"><a href="${input.cta.href}" style="display: inline-block; padding: 12px 20px; font-family: ${SANS}; font-size: 14px; font-weight: 800; color: #ffffff; text-decoration: none;">${escapeHtml(input.cta.label)}</a></td>
              ${
                input.secondary
                  ? `<td style="width: 8px;"></td><td style="border-radius: 10px; border: 1px solid #e6e1d8;"><a href="${input.secondary.href}" style="display: inline-block; padding: 11px 16px; font-family: ${SANS}; font-size: 14px; font-weight: 700; color: #1a231c; text-decoration: none;">${escapeHtml(input.secondary.label)}</a></td>`
                  : ""
              }
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding: 16px 6px 0; font-family: ${SANS}; font-size: 12px; line-height: 1.55; color: #8a847a; text-align: center;">${input.footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function textEmail(lines: (string | null | false | undefined)[]): string {
  return lines.filter((l): l is string => typeof l === "string").join("\n");
}

async function teacherInfo(teacherId: IDemoRequest["teacher"]) {
  const tutor = await User.findById(teacherId).select(
    "email role profile.name profile.timezone",
  );
  return {
    email: tutor?.role !== "parent" ? tutor?.email || "" : "",
    name: tutor?.profile?.name || "Your tutor",
    timezone: tutor?.profile?.timezone || "Asia/Kolkata",
  };
}

function subjectLine(row: IDemoRequest): string {
  return [row.subject, row.classLevel, row.board].filter(Boolean).join(" · ");
}

/** Email the tutor a copy of a new demo, with a link to the full request. */
export async function notifyTutorDemoRequest(row: IDemoRequest): Promise<void> {
  const tutor = await teacherInfo(row.teacher);
  if (!tutor.email) return;

  const when = formatWhen(row.preferredDate, row.preferredTime);
  const place = [row.parentArea, row.parentCity].filter(Boolean).join(", ");
  const href = siteUrl("/dashboard#demos");
  const firstName = tutor.name.split(" ")[0];

  await sendAdminEmail(
    tutor.email,
    `New demo request — ${row.subject}, ${when}`,
    textEmail([
      `Hi ${firstName},`,
      "",
      `${row.parentName} requested an online demo with you.`,
      `Subject: ${subjectLine(row)}`,
      `When: ${when}`,
      `Phone: ${row.parentPhone}`,
      place ? `Area: ${place}` : null,
      row.note ? `Note: ${row.note}` : null,
      "",
      "Accept, decline, or propose another time:",
      href,
    ]),
    demoEmailHtml({
      preheader: `${row.parentName} wants a ${row.subject} demo on ${when}`,
      badge: "New demo request",
      tone: "coral",
      title: `${row.parentName} wants a demo`,
      intro: `Hi ${escapeHtml(firstName)}, a parent picked a slot from your hours. Accept it, decline, or propose another time — they get an email either way.`,
      whenLabel: "Requested slot",
      when,
      rows: [
        detailRow("Subject", subjectLine(row)),
        detailRow("Parent", row.parentName),
        detailRow("Phone", row.parentPhone),
        detailRow("Area", place),
        detailRow("Note", row.note || ""),
      ].join(""),
      cta: { label: "Respond on Mentr", href },
      footer:
        "You're getting this because a parent booked a demo with you on Mentr. Fees stay between you and the parent — Mentr takes nothing.",
    }),
  );
}

export type ParentDemoUpdate = "accepted" | "declined" | "proposed";

/** In-app + email to the parent when the tutor accepts, declines, or proposes. */
export async function notifyParentDemoUpdate(
  row: IDemoRequest,
  kind: ParentDemoUpdate,
): Promise<void> {
  const tutor = await teacherInfo(row.teacher);
  const tutorFirst = tutor.name.split(" ")[0];
  const parentFirst = (row.parentName || "there").split(" ")[0];
  const href = siteUrl("/parent/dashboard#demos");
  const when = formatWhen(row.preferredDate, row.preferredTime);
  const proposedWhen =
    row.proposedDate && row.proposedTime
      ? formatWhen(row.proposedDate, row.proposedTime)
      : "";
  const note = row.tutorNote?.trim() || "";

  const copy = {
    accepted: {
      inApp: `${tutorFirst} confirmed your demo`,
      body: `${row.subject} · ${when}. ${tutorFirst} will message you on WhatsApp before the class.`,
      subject: `Confirmed: ${row.subject} demo with ${tutorFirst}, ${when}`,
      badge: "Demo confirmed",
      tone: "sage" as Tone,
      title: `Your demo with ${tutorFirst} is confirmed`,
      intro: `Hi ${escapeHtml(parentFirst)}, ${escapeHtml(tutorFirst)} accepted your slot. They already have your number and will message you on WhatsApp with the class link.`,
      whenLabel: "Confirmed slot",
      whenText: when,
      cta: "View my demos",
    },
    declined: {
      inApp: `${tutorFirst} can't take this demo`,
      body: `${row.subject} · ${when}. Book another tutor or pick a new slot.`,
      subject: `${tutorFirst} can't take the ${row.subject} demo`,
      badge: "Not available",
      tone: "muted" as Tone,
      title: `${tutorFirst} can't take this demo`,
      intro: `Hi ${escapeHtml(parentFirst)}, ${escapeHtml(tutorFirst)} isn't able to do this slot. Other tutors who pitched on your post are still on your dashboard.`,
      whenLabel: "Requested slot",
      whenText: when,
      cta: "Find another tutor",
    },
    proposed: {
      inApp: `${tutorFirst} proposed a new time`,
      body: `${row.subject} · ${proposedWhen}. Accept or decline it on your dashboard.`,
      subject: `${tutorFirst} proposed a new demo time: ${proposedWhen}`,
      badge: "New time proposed",
      tone: "coral" as Tone,
      title: `${tutorFirst} suggested another time`,
      intro: `Hi ${escapeHtml(parentFirst)}, ${escapeHtml(tutorFirst)} can't make your slot but can do this one. Accept it in one tap, or decline.`,
      whenLabel: "Proposed slot",
      whenText: proposedWhen,
      cta: "Accept or decline",
    },
  }[kind];

  await notifyParent({
    parentId: row.parent.toString(),
    type: "demo_update",
    title: copy.inApp,
    body: copy.body,
    href: "/parent/dashboard#demos",
    meta: {
      teacherId: row.teacher.toString(),
      teacherName: tutor.name,
      subject: row.subject,
      classLevel: row.classLevel,
      demoId: row._id.toString(),
    },
    skipEmail: true,
  });

  if (!row.parentEmail) return;
  const calendar =
    kind === "accepted"
      ? googleCalendarUrl({
          title: `${row.subject} demo with ${tutor.name}`,
          details: `Online demo booked on Mentr. ${tutor.name} will share the class link on WhatsApp.`,
          date: row.preferredDate,
          time: row.preferredTime,
          timezone: tutor.timezone,
        })
      : null;

  await sendAdminEmail(
    row.parentEmail,
    copy.subject,
    textEmail([
      `Hi ${parentFirst},`,
      "",
      copy.title + ".",
      `${copy.whenLabel}: ${copy.whenText}`,
      kind === "proposed" ? `Your slot was: ${when}` : null,
      `Subject: ${subjectLine(row)}`,
      note ? `${tutorFirst}: "${note}"` : null,
      "",
      `${copy.cta}: ${href}`,
      calendar ? `Add to Google Calendar: ${calendar}` : null,
    ]),
    demoEmailHtml({
      preheader: copy.body,
      badge: copy.badge,
      tone: copy.tone,
      title: copy.title,
      intro: copy.intro,
      whenLabel: copy.whenLabel,
      when: copy.whenText,
      previousWhen: kind === "proposed" ? when : undefined,
      rows: [
        detailRow("Tutor", tutor.name),
        detailRow("Subject", subjectLine(row)),
      ].join(""),
      quote: note ? { by: tutorFirst, text: note } : undefined,
      cta: { label: copy.cta, href },
      secondary: calendar ? { label: "Add to Google Calendar", href: calendar } : undefined,
      footer:
        "You're getting this because you booked a demo on Mentr. Your number is shared only with tutors you book. Mentr takes no fee.",
    }),
  );
}

/** Email the tutor when the parent answers their proposed time. */
export async function notifyTutorDemoReply(
  row: IDemoRequest,
  kind: "parent_accepted" | "parent_declined",
): Promise<void> {
  const tutor = await teacherInfo(row.teacher);
  if (!tutor.email) return;
  const tutorFirst = tutor.name.split(" ")[0];
  const href = siteUrl("/dashboard#demos");
  const accepted = kind === "parent_accepted";
  const when = accepted
    ? formatWhen(row.preferredDate, row.preferredTime)
    : row.proposedDate && row.proposedTime
      ? formatWhen(row.proposedDate, row.proposedTime)
      : formatWhen(row.preferredDate, row.preferredTime);
  const calendar = accepted
    ? googleCalendarUrl({
        title: `${row.subject} demo with ${row.parentName}`,
        details: `Online demo booked on Mentr. Parent: ${row.parentName}, ${row.parentPhone}.`,
        date: row.preferredDate,
        time: row.preferredTime,
        timezone: tutor.timezone,
      })
    : null;

  await sendAdminEmail(
    tutor.email,
    accepted
      ? `Confirmed: ${row.parentName} accepted ${when}`
      : `${row.parentName} declined your proposed time`,
    textEmail([
      `Hi ${tutorFirst},`,
      "",
      accepted
        ? `${row.parentName} accepted your proposed time. The demo is confirmed.`
        : `${row.parentName} declined the time you proposed.`,
      `When: ${when}`,
      `Phone: ${row.parentPhone}`,
      "",
      href,
      calendar ? `Add to Google Calendar: ${calendar}` : null,
    ]),
    demoEmailHtml({
      preheader: accepted
        ? `${row.parentName} accepted — ${when}`
        : `${row.parentName} declined ${when}`,
      badge: accepted ? "Demo confirmed" : "Proposal declined",
      tone: accepted ? "sage" : "muted",
      title: accepted
        ? `${row.parentName} accepted your time`
        : `${row.parentName} declined your time`,
      intro: accepted
        ? `Hi ${escapeHtml(tutorFirst)}, the demo is locked in. Message them on WhatsApp with the class link before it starts.`
        : `Hi ${escapeHtml(tutorFirst)}, this demo is closed. No action needed.`,
      whenLabel: accepted ? "Confirmed slot" : "Proposed slot",
      when,
      rows: [
        detailRow("Subject", subjectLine(row)),
        detailRow("Parent", row.parentName),
        detailRow("Phone", row.parentPhone),
      ].join(""),
      cta: { label: "Open my demos", href },
      secondary: calendar ? { label: "Add to Google Calendar", href: calendar } : undefined,
      footer:
        "You're getting this because a parent booked a demo with you on Mentr. Fees stay between you and the parent — Mentr takes nothing.",
    }),
  );
}
