import { config } from "../config";
import type { UserRole } from "../models/User";

const LINKEDIN_URL = "https://www.linkedin.com/company/mentrbypaprly/";
const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/H6ZDDyJnNWeLUj5eRlKRAj?mode=gi_t";
const SITE = config.publicSiteUrl;

export type MessengerTemplateId =
  | "initial-user"
  | "mentor-go-live"
  | "mentor-referral"
  | "mentor-whatsapp-group"
  | "mentor-coupon-alert"
  | "parent-welcome"
  | "parent-find-tutor"
  | "parent-whatsapp-group";

export type MessengerAudience = "faculty" | "parent";

export type CouponMailLine = {
  label: string;
  payableInr: number;
  offInr: number;
};

export type CouponMailVars = {
  code: string;
  offInr: number;
  sameOff: boolean;
  validUntilLabel: string;
  perUserLimit: number;
  lines: CouponMailLine[];
};

export type MessengerTemplateVars = {
  name: string;
  loginUrl: string;
  signupUrl: string;
  dashboardUrl: string;
  searchUrl: string;
  postRequirementUrl: string;
  profilingUrl: string;
  referralUrl: string;
  premiumPricingUrl?: string;
  /** Resolved intro paragraph (admin Messenger welcome settings). */
  welcomeIntro?: string;
  welcomeSubjectOverride?: string;
  coupon?: CouponMailVars;
};

export type MessengerTemplate = {
  id: MessengerTemplateId;
  label: string;
  description: string;
  audience: MessengerAudience;
  /** Admin must supply a live coupon; the mail fills code, off, and payable from it. */
  requiresCoupon?: boolean;
  subject: (vars: MessengerTemplateVars) => string;
  text: (vars: MessengerTemplateVars) => string;
  html: (vars: MessengerTemplateVars) => string;
};

function emailShell(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mentr by Paprly</title>
</head>
<body style="margin:0;padding:0;background:#fffaf5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fffaf5;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background:#ffffff;border:1px solid #e8dfd4;">
          <tr>
            <td style="padding:16px 24px;background:#fff1e4;border-bottom:1px solid #e8dfd4;">
              <p style="margin:0 0 2px;font-size:16px;font-weight:800;color:#1a231c;">Mentr by Paprly</p>
              <p style="margin:0;font-size:12px;color:#6b756e;">A product of <span style="color:#facc15;font-weight:700;">Papr</span><span style="color:#67b5eb;font-weight:700;">ly</span></p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px;">${body}</td>
          </tr>
          <tr>
            <td style="padding:14px 24px;border-top:1px solid #e8dfd4;background:#fffaf5;">
              <p style="margin:0 0 4px;font-size:11px;line-height:1.5;color:#6b756e;">
                <strong style="color:#1a231c;">Mentr by Paprly</strong> · Free · No commissions
              </p>
              <p style="margin:0;font-size:11px;">
                <a href="${SITE}" style="color:#ef7a28;font-weight:600;text-decoration:none;">mentr.in</a>
                <span style="color:#e8dfd4;"> · </span>
                <a href="${LINKEDIN_URL}" style="color:#ef7a28;font-weight:600;text-decoration:none;">LinkedIn</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function primaryBtn(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;padding:8px 16px;background:#ff9a4d;color:#1a231c;font-size:12px;font-weight:700;text-decoration:none;">${label}</a>`;
}

function secondaryBtn(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;padding:8px 16px;background:#e6f6ee;color:#2f9e6e;font-size:12px;font-weight:700;text-decoration:none;border:1px solid #2f9e6e;">${label}</a>`;
}

function whatsappBtn(label: string) {
  return `<a href="${WHATSAPP_GROUP_URL}" style="display:inline-block;padding:11px 20px;background:#2f9e6e;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;">${label}</a>`;
}

/** Some clients strip the button styling, so always spell the invite link out. */
function whatsappLinkFallback() {
  return `<p style="margin:10px 0 0;font-size:11px;line-height:1.5;color:#6b756e;word-break:break-all;">
    Button not working? Open this link:
    <a href="${WHATSAPP_GROUP_URL}" style="color:#2f9e6e;font-weight:600;text-decoration:underline;">${WHATSAPP_GROUP_URL}</a>
  </p>`;
}

function checklist(items: string[]) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    ${items
      .map(
        (item) => `<tr>
      <td style="padding:3px 0;font-size:12px;line-height:1.55;color:#525252;">
        <span style="color:#2f9e6e;font-weight:700;">&#10003;</span>&nbsp;${item}
      </td>
    </tr>`,
      )
      .join("")}
  </table>`;
}

function textLink(href: string, label: string) {
  return `<a href="${href}" style="color:#2f9e6e;font-size:12px;font-weight:600;text-decoration:underline;">${label}</a>`;
}

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inr(amount: number) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function sectionLabel(text: string, color = "#ef7a28") {
  return `<p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${color};">${text}</p>`;
}

function greeting(name: string) {
  return `<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#1a231c;">Dear <strong>${name}</strong>,</p>`;
}

function signOff() {
  return `<p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:#6b756e;">Questions? Reply to this email — we're here to help.</p>`;
}

function introParagraph(v: MessengerTemplateVars, fallback: string) {
  const text = v.welcomeIntro?.trim() || fallback;
  return `<p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#525252;">${esc(text)}</p>`;
}

function premiumMentorWelcomeBlock(v: MessengerTemplateVars) {
  const pricing = v.premiumPricingUrl || `${SITE}/mentrpricing`;
  const coupon = v.coupon;
  const couponBit =
    coupon && coupon.lines.length > 0
      ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;">
          <tr>
            <td style="padding:10px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(250,204,21,0.45);">
              <p style="margin:0;font-size:12px;line-height:1.55;color:#ffffff;">
                <strong style="color:#facc15;">Launch offer:</strong>
                <span style="color:rgba(255,255,255,0.92);"> use code </span>
                <span style="font-family:ui-monospace,Menlo,monospace;font-weight:800;color:#fffaf5;letter-spacing:0.04em;">${esc(coupon.code)}</span>
                <span style="color:rgba(255,255,255,0.92);"> at checkout${coupon.sameOff ? ` (${inr(coupon.lines[0].offInr)} off)` : ""}.</span>
              </p>
              <p style="margin:6px 0 0;font-size:11px;line-height:1.45;color:rgba(255,255,255,0.75);">
                Valid through ${esc(coupon.validUntilLabel)}.
              </p>
            </td>
          </tr>
        </table>`
      : "";

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
    <tr>
      <td style="padding:14px 14px 16px;background:#1a231c;border:1px solid #1a231c;">
        ${sectionLabel("Optional · Premium Mentor", "#facc15")}
        <p style="margin:0;font-size:13px;line-height:1.55;color:#ffffff;">
          Core mentoring stays <strong>free forever</strong>. When you want more reach, Premium adds
          unlimited daily pitches, 3 parent contact unlocks per day, a human SPOC, featured landing placement, and a Premium badge — from <strong>$5/mo (≈ ₹449)</strong>, price as shown.
        </p>
        <ul style="margin:10px 0 0;padding:0 0 0 16px;font-size:12px;line-height:1.55;color:rgba(255,255,255,0.85);">
          <li>Unlimited pitches (no 3-a-day cap)</li>
          <li>Parent directory + pitch board unlocks, direct parent contact</li>
          <li>Featured on mentr.in for Premium mentors</li>
        </ul>
        ${couponBit}
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;">
          <tr><td style="padding-bottom:6px;">${primaryBtn(pricing, "Get Premium — view plans")}</td></tr>
          <tr><td><a href="${v.dashboardUrl}" style="color:#a7f3d0;font-size:12px;font-weight:600;text-decoration:underline;">Or open your dashboard</a></td></tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function referralBlock(v: MessengerTemplateVars) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:14px 0 0;">
    <tr>
      <td style="padding:12px 14px;background:#e6f6ee;border:1px solid #2f9e6e;">
        ${sectionLabel("Your referral link", "#2f9e6e")}
        <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#525252;">
          Share with fellow educators. Referrals help you stay visible in our early community.
        </p>
        <p style="margin:0;padding:8px 10px;background:#ffffff;border:1px solid #2f9e6e;font-size:11px;font-family:ui-monospace,Menlo,monospace;word-break:break-all;">
          <a href="${v.referralUrl}" style="color:#2f9e6e;font-weight:600;text-decoration:none;">${v.referralUrl}</a>
        </p>
      </td>
    </tr>
  </table>`;
}

export const MESSENGER_TEMPLATES: Record<MessengerTemplateId, MessengerTemplate> = {
  "initial-user": {
    id: "initial-user",
    label: "Mentor · Initial welcome",
    description:
      "Auto/manual signup welcome — profile CTAs, Premium pitch, optional coupon (Messenger settings).",
    audience: "faculty",
    subject: (v) =>
      v.welcomeSubjectOverride?.trim() || `Welcome to Mentr, ${v.name}`,
    text: (v) => {
      const intro =
        v.welcomeIntro?.trim() ||
        "Thank you for joining Mentr by Paprly. Your mentor profile stays free forever.";
      const pricing = v.premiumPricingUrl || `${SITE}/mentrpricing`;
      const couponLine =
        v.coupon && v.coupon.lines.length > 0
          ? `\nPremium coupon: ${v.coupon.code} (${v.coupon.sameOff ? inr(v.coupon.lines[0].offInr) + " off" : "see plans"})\n`
          : "";
      return `Dear ${v.name},\n\n${intro}\n\nLog in: ${v.loginUrl}\nComplete profile: ${v.profilingUrl}\nGet Premium: ${pricing}${couponLine}\nReferral: ${v.referralUrl}\n\nMentr by Paprly`;
    },
    html: (v) =>
      emailShell(`
        ${greeting(v.name)}
        ${introParagraph(
          v,
          "Thank you for joining Mentr by Paprly. Your mentor profile stays free forever — complete it so parents can find you in search.",
        )}
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
          <tr><td style="padding-bottom:8px;">${sectionLabel("Get started", "#1a231c")}</td></tr>
          <tr><td style="padding-bottom:6px;">${primaryBtn(v.loginUrl, "Log in to Mentr")}</td></tr>
          <tr><td>${secondaryBtn(v.profilingUrl, "Complete your mentor profile")}</td></tr>
        </table>
        ${premiumMentorWelcomeBlock(v)}
        ${referralBlock(v)}
        ${signOff()}
      `),
  },

  "mentor-go-live": {
    id: "mentor-go-live",
    label: "Mentor · Go live",
    description: "Nudge tutors to finish their profile and appear in search.",
    audience: "faculty",
    subject: (v) => `${v.name}, your mentor profile is almost ready`,
    text: (v) =>
      `Dear ${v.name},\n\nParents are searching for tutors on Mentr. Complete your profile to go live in search results.\n\nFinish profile: ${v.profilingUrl}\nDashboard: ${v.dashboardUrl}\nLog in: ${v.loginUrl}\n\nMentr by Paprly`,
    html: (v) =>
      emailShell(`
        ${greeting(v.name)}
        <p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#525252;">
          Parents are actively searching for tutors on Mentr. A complete profile helps you
          get discovered — <strong>100% free, no lead fees</strong>.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
          <tr>
            <td style="padding:12px 14px;background:#fff1e4;border-left:3px solid #ff9a4d;">
              ${sectionLabel("What to add")}
              <p style="margin:0;font-size:12px;line-height:1.55;color:#525252;">
                Subjects, city, availability, bio, and teaching modes — takes about 5 minutes.
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr><td style="padding-bottom:6px;">${primaryBtn(v.profilingUrl, "Complete my profile")}</td></tr>
          <tr><td style="padding-bottom:6px;">${secondaryBtn(v.dashboardUrl, "Open dashboard")}</td></tr>
          <tr><td><span style="font-size:12px;color:#6b756e;">Already done? </span>${textLink(v.loginUrl, "Log in")}</td></tr>
        </table>
        ${signOff()}
      `),
  },

  "mentor-referral": {
    id: "mentor-referral",
    label: "Mentor · Refer & stay visible",
    description: "Ask tutors to share their invite link with fellow educators.",
    audience: "faculty",
    subject: (v) => `${v.name}, invite educators you trust`,
    text: (v) =>
      `Dear ${v.name},\n\nShare your personal Mentr invite link so fellow educators can join through you.\n\nYour link: ${v.referralUrl}\nLog in: ${v.loginUrl}\n\nMentr by Paprly`,
    html: (v) =>
      emailShell(`
        ${greeting(v.name)}
        <p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#525252;">
          Know a great tutor or mentor? Invite them to Mentr with your personal link.
          Early referrers stay visible as we grow the community.
        </p>
        ${referralBlock(v)}
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:14px;">
          <tr><td>${primaryBtn(v.loginUrl, "Log in to Mentr")}</td></tr>
        </table>
        ${signOff()}
      `),
  },

  "mentor-whatsapp-group": {
    id: "mentor-whatsapp-group",
    label: "Mentor · WhatsApp group invite",
    description: "Invite tutors to the official WhatsApp group for daily updates.",
    audience: "faculty",
    subject: (v) => `${v.name}, join our official Mentr WhatsApp group`,
    text: (v) =>
      `Dear ${v.name},\n\nWe run one official WhatsApp group for mentors and tutors on Mentr — daily updates, new parent postings, and quick answers from our team.\n\nJoin here: ${WHATSAPP_GROUP_URL}\n\nDashboard: ${v.dashboardUrl}\n\nMentr by Paprly`,
    html: (v) =>
      emailShell(`
        ${greeting(v.name)}
        <p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#525252;">
          We run <strong>one official WhatsApp group</strong> for mentors and tutors on Mentr.
          It is where we post daily updates and new parent postings first — so you hear about
          them before anyone else.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px;">
          <tr>
            <td style="padding:12px 14px;background:#e6f6ee;border-left:3px solid #2f9e6e;">
              ${sectionLabel("What you get inside", "#2f9e6e")}
              ${checklist([
                "Daily updates from the Mentr team",
                "New parent postings and requirements",
                "New free tools the moment they go live",
                "Direct help — ask us anything",
              ])}
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr><td style="padding-bottom:6px;">${whatsappBtn("Join the WhatsApp group")}</td></tr>
          <tr><td>${textLink(v.dashboardUrl, "Open your dashboard")}</td></tr>
        </table>
        ${whatsappLinkFallback()}
        <p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:#6b756e;">
        Only our team posts announcements, so the group stays quiet and useful. Free to join,
        leave any time.
      </p>
      `),
  },

  "mentor-coupon-alert": {
    id: "mentor-coupon-alert",
    label: "Mentor · Coupon alert",
    description: "Live coupon: code, rupees off, and only what they pay at checkout.",
    audience: "faculty",
    requiresCoupon: true,
    subject: (v) => couponSubject(v),
    text: (v) => couponText(v),
    html: (v) => emailShell(couponHtml(v)),
  },

  "parent-welcome": {
    id: "parent-welcome",
    label: "Parent · Welcome",
    description:
      "Auto/manual signup welcome for parents — search & book free (Messenger settings).",
    audience: "parent",
    subject: (v) =>
      v.welcomeSubjectOverride?.trim() || `Welcome to Mentr, ${v.name}`,
    text: (v) => {
      const intro =
        v.welcomeIntro?.trim() ||
        "Welcome to Mentr by Paprly — find verified tutors near you or online, 100% free.";
      return `Dear ${v.name},\n\n${intro}\n\nSearch tutors: ${v.searchUrl}\nLog in: ${v.loginUrl}\n\nMentr by Paprly`;
    },
    html: (v) =>
      emailShell(`
        ${greeting(v.name)}
        ${introParagraph(
          v,
          "Welcome to Mentr by Paprly. Find verified tutors for your child — online or nearby — with no platform fees and no hidden charges.",
        )}
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
          <tr>
            <td style="padding:12px 14px;background:#e6f6ee;border-left:3px solid #2f9e6e;">
              ${sectionLabel("How Mentr works", "#2f9e6e")}
              <p style="margin:0;font-size:12px;line-height:1.55;color:#525252;">
                Search by subject and location, compare tutor profiles, and connect directly.
                WhatsApp unlocks after they accept — you stay in control.
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr><td style="padding-bottom:6px;">${primaryBtn(v.searchUrl, "Search tutors")}</td></tr>
          <tr><td style="padding-bottom:6px;">${secondaryBtn(v.loginUrl, "Log in to your account")}</td></tr>
          <tr><td><span style="font-size:12px;color:#6b756e;">New here? </span>${textLink(v.signupUrl, "Create a free account")}</td></tr>
        </table>
        ${signOff()}
      `),
  },

  "parent-find-tutor": {
    id: "parent-find-tutor",
    label: "Parent · Find a tutor",
    description: "Push parents to search or post a requirement on the board.",
    audience: "parent",
    subject: (v) => `${v.name}, find the right tutor on Mentr`,
    text: (v) =>
      `Dear ${v.name},\n\nStill looking for the right tutor? Search verified mentors or post your requirement — tutors come to you.\n\nSearch: ${v.searchUrl}\nPost requirement: ${v.postRequirementUrl}\nLog in: ${v.loginUrl}\n\nMentr by Paprly`,
    html: (v) =>
      emailShell(`
        ${greeting(v.name)}
        <p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#525252;">
          Whether you need maths, science, or exam prep — Mentr helps you find the right fit.
          Search tutors directly or post your requirement and let verified mentors reach out.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
          <tr><td style="padding-bottom:8px;">${sectionLabel("Two ways to start", "#1a231c")}</td></tr>
          <tr><td style="padding-bottom:6px;">${primaryBtn(v.searchUrl, "Browse tutors")}</td></tr>
          <tr><td>${secondaryBtn(v.postRequirementUrl, "Post your requirement")}</td></tr>
        </table>
        <p style="margin:0;font-size:12px;line-height:1.5;color:#6b756e;">
          Already have an account? ${textLink(v.loginUrl, "Log in")} to manage your posts and connections.
        </p>
        ${signOff()}
      `),
  },

  "parent-whatsapp-group": {
    id: "parent-whatsapp-group",
    label: "Parent · WhatsApp group invite",
    description: "Invite parents to the official WhatsApp group for daily updates.",
    audience: "parent",
    subject: (v) => `${v.name}, join our official Mentr WhatsApp group`,
    text: (v) =>
      `Dear ${v.name},\n\nJoin our official Mentr WhatsApp group for daily updates, newly verified tutors, and quick answers from our team.\n\nJoin here: ${WHATSAPP_GROUP_URL}\n\nSearch tutors: ${v.searchUrl}\n\nMentr by Paprly`,
    html: (v) =>
      emailShell(`
        ${greeting(v.name)}
        <p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#525252;">
          We run <strong>one official WhatsApp group</strong> for the Mentr community. Join in to
          hear about newly verified tutors and updates the day they happen.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px;">
          <tr>
            <td style="padding:12px 14px;background:#e6f6ee;border-left:3px solid #2f9e6e;">
              ${sectionLabel("What you get inside", "#2f9e6e")}
              ${checklist([
                "Daily updates from the Mentr team",
                "New verified tutors in your city",
                "Free learning resources for your child",
                "Direct help — ask us anything",
              ])}
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr><td style="padding-bottom:6px;">${whatsappBtn("Join the WhatsApp group")}</td></tr>
          <tr><td>${textLink(v.searchUrl, "Search tutors on Mentr")}</td></tr>
        </table>
        ${whatsappLinkFallback()}
        <p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:#6b756e;">
          Only our team posts announcements, so the group stays quiet and useful. Free to join,
          leave any time.
        </p>
      `),
  },
};

export function templateAudience(templateId: MessengerTemplateId): MessengerAudience {
  const t = MESSENGER_TEMPLATES[templateId];
  if (!t) throw new Error(`Unknown template: ${templateId}`);
  return t.audience;
}

function couponSubject(v: MessengerTemplateVars) {
  const coupon = v.coupon;
  if (!coupon || coupon.lines.length === 0) return "Coupon alert";
  const first = coupon.lines[0];
  const pay =
    coupon.lines.length > 1
      ? `pay from ${inr(first.payableInr)}`
      : `pay ${inr(first.payableInr)}`;
  return `Coupon alert — Hi ${v.name}, use ${coupon.code}, ${pay}`;
}

function couponUseLine(coupon: CouponMailVars) {
  if (coupon.perUserLimit <= 1) return "One use per mentor.";
  return `Up to ${coupon.perUserLimit} uses per mentor.`;
}

function couponText(v: MessengerTemplateVars) {
  const coupon = v.coupon;
  if (!coupon || coupon.lines.length === 0) {
    return `Hi ${v.name},\n\nAdd a coupon code in Messenger to fill this alert.\n\nMentr by Paprly`;
  }
  const off = coupon.sameOff
    ? `${inr(coupon.lines[0].offInr)} off.\n`
    : "";
  const lines = coupon.lines
    .map((line) =>
      coupon.sameOff
        ? `${line.label}: you pay ${inr(line.payableInr)}`
        : `${line.label}: ${inr(line.offInr)} off, you pay ${inr(line.payableInr)}`,
    )
    .join("\n");
  return `Hi ${v.name},\n\nCoupon alert. Use ${coupon.code} on Premium Mentor checkout.\n\n${off}${lines}\n\nValid through ${coupon.validUntilLabel}. ${couponUseLine(coupon)} Works on rupee checkout.\n\nUpgrade: ${v.dashboardUrl}\n\nMentr by Paprly`;
}

function couponPayableRows(coupon: CouponMailVars) {
  if (coupon.lines.length === 1) {
    const line = coupon.lines[0];
    return `<p style="margin:16px 0 0;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b756e;">You pay</p>
      <p style="margin:2px 0 0;font-size:28px;line-height:1.1;font-weight:800;color:#1a231c;">${inr(line.payableInr)}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#525252;">${esc(line.label)} of Premium Mentor</p>`;
  }
  return `<p style="margin:16px 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b756e;">You pay</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${coupon.lines
        .map(
          (line, index) => `<tr>
        <td style="padding:8px 0;border-top:${index === 0 ? "0" : "1px solid #e8dfd4"};font-size:13px;color:#525252;">${esc(line.label)}</td>
        <td align="right" style="padding:8px 0;border-top:${index === 0 ? "0" : "1px solid #e8dfd4"};font-size:16px;font-weight:800;color:#1a231c;">${inr(line.payableInr)}</td>
      </tr>`,
        )
        .join("")}
    </table>`;
}

function couponHtml(v: MessengerTemplateVars) {
  const name = esc(v.name);
  const coupon = v.coupon;
  if (!coupon || coupon.lines.length === 0) {
    return `<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#1a231c;">Hi <strong>${name}</strong>,</p>
      <p style="margin:0;font-size:13px;line-height:1.55;color:#525252;">
        Enter a coupon code above. This alert will fill in the code, the rupees off, and only what the mentor pays.
      </p>`;
  }

  const offLine = coupon.sameOff
    ? `<p style="margin:10px 0 0;font-size:13px;color:#525252;">${inr(coupon.lines[0].offInr)} off the plan price</p>`
    : `<p style="margin:10px 0 0;font-size:13px;color:#525252;">The rupees off sit under each plan, because a shorter plan cannot go below ₹1.</p>`;

  const mixedOff = coupon.sameOff
    ? ""
    : `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:8px;">
        ${coupon.lines
          .map(
            (line) => `<tr>
          <td style="padding:2px 0;font-size:12px;color:#6b756e;">${esc(line.label)} · ${inr(line.offInr)} off</td>
        </tr>`,
          )
          .join("")}
      </table>`;

  return `<p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#ef7a28;">Coupon alert</p>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#1a231c;">Hi <strong>${name}</strong>,</p>
    <p style="margin:0 0 16px;font-size:13px;line-height:1.55;color:#525252;">
      Use this code when you upgrade to Premium Mentor. The amount below is what you pay — nothing else is added.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding:16px 16px 18px;background:#fffaf5;border:1px solid #e8dfd4;">
          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6b756e;">Use this code</p>
          <p style="margin:6px 0 0;font-size:22px;line-height:1.2;font-weight:800;letter-spacing:0.04em;color:#1a231c;font-family:ui-monospace,Menlo,Consolas,monospace;">${esc(coupon.code)}</p>
          ${offLine}
          ${mixedOff}
          ${couponPayableRows(coupon)}
        </td>
      </tr>
    </table>
    <p style="margin:12px 0 16px;font-size:12px;line-height:1.5;color:#6b756e;">
      Valid through ${esc(coupon.validUntilLabel)}. ${esc(couponUseLine(coupon))} Works on rupee checkout.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr><td>${primaryBtn(v.dashboardUrl, "Use this code")}</td></tr>
    </table>`;
}

export function listMessengerTemplates() {
  return Object.values(MESSENGER_TEMPLATES).map(
    ({ id, label, description, audience, requiresCoupon }) => ({
      id,
      label,
      description,
      audience,
      requiresCoupon: Boolean(requiresCoupon),
    }),
  );
}

export function renderMessengerTemplate(
  templateId: MessengerTemplateId,
  vars: MessengerTemplateVars,
) {
  const template = MESSENGER_TEMPLATES[templateId];
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  return {
    subject: template.subject(vars),
    text: template.text(vars),
    html: template.html(vars),
  };
}

export function templateVarsForRole(
  role: UserRole,
  name = "User",
  referralUrl?: string,
): MessengerTemplateVars {
  const base = config.publicSiteUrl;
  if (role === "parent") {
    return {
      name,
      loginUrl: `${base}/parent`,
      signupUrl: `${base}/parent/signup`,
      dashboardUrl: `${base}/parent/dashboard`,
      searchUrl: `${base}/search`,
      postRequirementUrl: `${base}/parent/dashboard`,
      profilingUrl: `${base}/parent/profiling`,
      referralUrl: referralUrl || `${base}/parent/signup?ref=preview`,
    };
  }
  return {
    name,
    loginUrl: `${base}/faculty`,
    signupUrl: `${base}/faculty/signup`,
    dashboardUrl: `${base}/dashboard`,
    searchUrl: `${base}/search`,
    postRequirementUrl: `${base}/parent/dashboard`,
    profilingUrl: `${base}/profiling`,
    referralUrl: referralUrl || `${base}/faculty/signup?ref=preview`,
    premiumPricingUrl: `${base}/mentrpricing`,
  };
}

/** @deprecated use templateVarsForRole */
export function defaultTemplateVars(referralUrl?: string): MessengerTemplateVars {
  return templateVarsForRole("faculty", "Educator", referralUrl);
}
