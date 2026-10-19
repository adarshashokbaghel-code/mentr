/**
 * Checks the SMTP login from .env and optionally sends a test email.
 * When an email is provided, also keeps Learn Python fully unlocked for QA (all slugs).
 *
 *   npx tsx scripts/test-mail.ts                 # login check only
 *   npx tsx scripts/test-mail.ts you@gmail.com   # OTP + unlock all LMS lessons
 *   npx tsx scripts/test-mail.ts you@gmail.com --no-unlock
 */
import { config } from "../server/config";
import { sendOtpEmail, verifyMailTransport } from "../server/services/mail";
import { withDbUnlockAll } from "./lib/learn-python-qa-unlock";

async function main() {
  const args = process.argv.slice(2);
  const noUnlock = args.includes("--no-unlock");
  const to = args.find((a) => !a.startsWith("--"));
  console.log(
    `SMTP ${config.smtp.host}:${config.smtp.port} (secure=${config.smtp.secure}) as ${config.emailUser}`,
  );
  await verifyMailTransport();
  console.log("Login OK.");
  if (to) {
    await sendOtpEmail(to, "123456", "login");
    console.log(`Test OTP email sent to ${to}.`);
    if (!noUnlock) {
      await withDbUnlockAll(to);
      console.log(`Learn Python: intermediate access + all lesson slugs unlocked for ${to}.`);
    }
  }
}

main().catch((err) => {
  console.error("Mail check failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
