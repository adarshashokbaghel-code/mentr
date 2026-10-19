import type { IUser } from "../models/User";
import {
  getMessengerWelcomeSettings,
  welcomeExtrasForRole,
} from "./messenger-welcome-settings";
import { ensureReferralUrl, displayName } from "./admin-messenger";
import {
  renderMessengerTemplate,
  templateVarsForRole,
  type MessengerTemplateId,
} from "./email-templates";
import { sendAdminEmail } from "./mail";

export async function buildSignupWelcomeRender(user: IUser) {
  const templateId: MessengerTemplateId =
    user.role === "parent" ? "parent-welcome" : "initial-user";
  const name = displayName(user);
  const referralUrl =
    user.role === "faculty" ? await ensureReferralUrl(user) : undefined;

  const welcome = await welcomeExtrasForRole(user.role, name, {
    useStoredMentorCoupon: true,
  });

  const vars = {
    ...templateVarsForRole(user.role, name, referralUrl),
    name,
    ...(referralUrl ? { referralUrl } : {}),
    ...welcome,
  };

  return renderMessengerTemplate(templateId, vars);
}

/** Sends configured signup welcome once per account (if enabled in settings). */
export async function sendSignupWelcomeEmail(user: IUser): Promise<boolean> {
  if (!user.emailVerified || user.signupWelcomeSentAt) return false;

  const settings = await getMessengerWelcomeSettings();
  if (user.role === "faculty" && !settings.autoWelcomeMentor) return false;
  if (user.role === "parent" && !settings.autoWelcomeParent) return false;

  const rendered = await buildSignupWelcomeRender(user);
  await sendAdminEmail(user.email, rendered.subject, rendered.text, rendered.html);
  user.signupWelcomeSentAt = new Date();
  await user.save();
  return true;
}
