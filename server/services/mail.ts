import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: "login" | "signup",
): Promise<void> {
  const action = purpose === "signup" ? "complete your signup" : "log in";

  await transporter.sendMail({
    from: `"Mentr Faculty" <${config.emailUser}>`,
    to,
    subject: `${code} is your Mentr verification code`,
    text: `Your Mentr verification code is ${code}. Use it to ${action}. It expires in ${config.otp.expiryMinutes} minutes. If you didn't request this, ignore this email.`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 8px;">Mentr Faculty</h2>
        <p style="color: #525252;">Use this code to ${action}:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0;">${code}</p>
        <p style="color: #525252; font-size: 14px;">Expires in ${config.otp.expiryMinutes} minutes. Do not share this code.</p>
      </div>
    `,
  });
}
