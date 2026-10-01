/**
 * Checks the SMTP login from .env and optionally sends a test email.
 *
 *   npx tsx scripts/test-mail.ts                 # login check only
 *   npx tsx scripts/test-mail.ts you@gmail.com   # also send a test OTP
 */
import { config } from "../server/config";
import { sendOtpEmail, verifyMailTransport } from "../server/services/mail";

async function main() {
  const to = process.argv[2];
  console.log(
    `SMTP ${config.smtp.host}:${config.smtp.port} (secure=${config.smtp.secure}) as ${config.emailUser}`,
  );
  await verifyMailTransport();
  console.log("Login OK.");
  if (to) {
    await sendOtpEmail(to, "123456", "login");
    console.log(`Test OTP email sent to ${to}.`);
  }
}

main().catch((err) => {
  console.error("Mail check failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
