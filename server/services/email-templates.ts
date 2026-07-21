import { config } from "../config";

const LINKEDIN_URL = "https://www.linkedin.com/company/mentrbypaprly/";
const SITE = config.publicSiteUrl;

export type MessengerTemplateId = "initial-user";

export type MessengerTemplateVars = {
  name: string;
  loginUrl: string;
  signupUrl: string;
  referralUrl: string;
};

export type MessengerTemplate = {
  id: MessengerTemplateId;
  label: string;
  description: string;
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
            <td style="padding:20px 24px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:14px 24px;border-top:1px solid #e8dfd4;background:#fffaf5;">
              <p style="margin:0 0 4px;font-size:11px;line-height:1.5;color:#6b756e;">
                <strong style="color:#1a231c;">Mentr by Paprly</strong> · Free tutor discovery · No commissions
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

function textLink(href: string, label: string) {
  return `<a href="${href}" style="color:#2f9e6e;font-size:12px;font-weight:600;text-decoration:underline;">${label}</a>`;
}

function sectionLabel(text: string, color = "#ef7a28") {
  return `<p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${color};">${text}</p>`;
}

export const MESSENGER_TEMPLATES: Record<MessengerTemplateId, MessengerTemplate> = {
  "initial-user": {
    id: "initial-user",
    label: "Initial user welcome",
    description: "Welcome email with platform overview and personal referral link.",
    subject: (v) => `Welcome to Mentr, ${v.name}`,
    text: (v) =>
      `Dear ${v.name},

Thank you for choosing Mentr by Paprly. As one of our initial users, you have our commitment to support you as the platform grows.

What's included for you:
A complete end-to-end teaching stack — LMS, scheduling, student management, and class organisation. Fully free for initial users. No platform fees.

Log in: ${v.loginUrl}
Create your mentor profile: ${v.signupUrl}

Your referral link:
${v.referralUrl}

Share with fellow educators. Referrals help you stay visible in our early community.

Mentr by Paprly
${LINKEDIN_URL}`,
    html: (v) =>
      emailShell(`
        <p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#1a231c;">
          Dear <strong>${v.name}</strong>,
        </p>
        <p style="margin:0 0 16px;font-size:13px;line-height:1.55;color:#525252;">
          Thank you for choosing <strong style="color:#1a231c;">Mentr by Paprly</strong>.
          As one of our <span style="background:#fff3a3;padding:0 4px;font-weight:600;">initial users</span>,
          you have our commitment to support you as the platform grows.
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
          <tr>
            <td style="padding:12px 14px;background:#fff1e4;border-left:3px solid #ff9a4d;">
              ${sectionLabel("What's included for you")}
              <p style="margin:0;font-size:13px;line-height:1.55;color:#525252;">
                A complete end-to-end teaching stack — LMS, scheduling, student management,
                and class organisation. <strong style="color:#1a231c;">Fully free</strong> for initial users. No platform fees.
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
          <tr>
            <td style="padding-bottom:8px;">${sectionLabel("Get started", "#1a231c")}</td>
          </tr>
          <tr>
            <td style="padding-bottom:6px;">${primaryBtn(v.loginUrl, "Log in to Mentr")}</td>
          </tr>
          <tr>
            <td>
              <span style="font-size:12px;color:#6b756e;">New here? </span>${textLink(v.signupUrl, "Create your mentor profile")}
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding:12px 14px;background:#e6f6ee;border:1px solid #2f9e6e;">
              ${sectionLabel("Your referral link", "#2f9e6e")}
              <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#525252;">
                Share with fellow educators. Referrals help you stay visible in our early community.
              </p>
              <p style="margin:0;padding:8px 10px;background:#ffffff;border:1px solid #2f9e6e;font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;word-break:break-all;">
                <a href="${v.referralUrl}" style="color:#2f9e6e;font-weight:600;text-decoration:none;">${v.referralUrl}</a>
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:#6b756e;">
          Questions? Reply directly to this email.
        </p>
      `),
  },
};

export function listMessengerTemplates() {
  return Object.values(MESSENGER_TEMPLATES).map(({ id, label, description }) => ({
    id,
    label,
    description,
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

export function defaultTemplateVars(referralUrl?: string): MessengerTemplateVars {
  const base = config.publicSiteUrl;
  return {
    name: "Educator",
    loginUrl: `${base}/faculty`,
    signupUrl: `${base}/faculty/signup`,
    referralUrl: referralUrl || `${base}/faculty/signup?ref=preview`,
  };
}
