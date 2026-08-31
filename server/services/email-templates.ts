import { config } from "../config";
import type { UserRole } from "../models/User";

const LINKEDIN_URL = "https://www.linkedin.com/company/mentrbypaprly/";
const SITE = config.publicSiteUrl;

export type MessengerTemplateId =
  | "initial-user"
  | "mentor-go-live"
  | "mentor-referral"
  | "parent-welcome"
  | "parent-find-tutor";

export type MessengerAudience = "faculty" | "parent";

export type MessengerTemplateVars = {
  name: string;
  loginUrl: string;
  signupUrl: string;
  dashboardUrl: string;
  searchUrl: string;
  postRequirementUrl: string;
  profilingUrl: string;
  referralUrl: string;
};

export type MessengerTemplate = {
  id: MessengerTemplateId;
  label: string;
  description: string;
  audience: MessengerAudience;
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

function textLink(href: string, label: string) {
  return `<a href="${href}" style="color:#2f9e6e;font-size:12px;font-weight:600;text-decoration:underline;">${label}</a>`;
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
    description: "Welcome early tutors, upcoming free tools, and referral link.",
    audience: "faculty",
    subject: (v) => `Welcome to Mentr, ${v.name}`,
    text: (v) =>
      `Dear ${v.name},\n\nThank you for joining Mentr by Paprly as an initial user.\n\nLog in: ${v.loginUrl}\nComplete profile: ${v.profilingUrl}\nReferral: ${v.referralUrl}\n\nMentr by Paprly`,
    html: (v) =>
      emailShell(`
        ${greeting(v.name)}
        <p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#525252;">
          Thank you for choosing <strong>Mentr by Paprly</strong>. As an
          <span style="background:#fff3a3;padding:0 4px;font-weight:600;">initial user</span>,
          you get our full teaching stack free — LMS, scheduling, and class tools as we launch them.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
          <tr><td style="padding-bottom:8px;">${sectionLabel("Get started", "#1a231c")}</td></tr>
          <tr><td style="padding-bottom:6px;">${primaryBtn(v.loginUrl, "Log in to Mentr")}</td></tr>
          <tr><td>${secondaryBtn(v.profilingUrl, "Complete your mentor profile")}</td></tr>
        </table>
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

  "parent-welcome": {
    id: "parent-welcome",
    label: "Parent · Welcome",
    description: "Welcome parents — find verified tutors free, no commissions.",
    audience: "parent",
    subject: (v) => `Welcome to Mentr, ${v.name}`,
    text: (v) =>
      `Dear ${v.name},\n\nWelcome to Mentr by Paprly — find verified tutors near you or online, 100% free.\n\nSearch tutors: ${v.searchUrl}\nLog in: ${v.loginUrl}\n\nMentr by Paprly`,
    html: (v) =>
      emailShell(`
        ${greeting(v.name)}
        <p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#525252;">
          Welcome to <strong>Mentr by Paprly</strong>. Find verified tutors for your child —
          online or nearby — with <strong>no platform fees</strong> and no hidden charges.
        </p>
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
};

export function templateAudience(templateId: MessengerTemplateId): MessengerAudience {
  const t = MESSENGER_TEMPLATES[templateId];
  if (!t) throw new Error(`Unknown template: ${templateId}`);
  return t.audience;
}

export function listMessengerTemplates() {
  return Object.values(MESSENGER_TEMPLATES).map(({ id, label, description, audience }) => ({
    id,
    label,
    description,
    audience,
  }));
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
  };
}

/** @deprecated use templateVarsForRole */
export function defaultTemplateVars(referralUrl?: string): MessengerTemplateVars {
  return templateVarsForRole("faculty", "Educator", referralUrl);
}
