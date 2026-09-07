import { config } from "../config";
import { Connection } from "../models/Connection";
import { Requirement } from "../models/Requirement";
import { User } from "../models/User";
import { sendAdminEmail } from "./mail";

const DIGEST_INTERVAL_MS = 24 * 60 * 60 * 1000;

function dashboardUrl(path = "/parent/dashboard"): string {
  return `${config.publicSiteUrl}${path}`;
}

function digestEmailHtml(title: string, lines: string[], ctaHref: string) {
  const list = lines.map((l) => `<li style="margin: 0 0 8px;">${l}</li>`).join("");
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 4px; color: #1a231c;">Mentr by Paprly</h2>
      <p style="margin: 0 0 20px; color: #6b756e; font-size: 12px;">Daily pitch digest</p>
      <p style="font-size: 16px; font-weight: 700; color: #1a231c; margin: 0 0 12px;">${title}</p>
      <ul style="color: #525252; line-height: 1.5; margin: 0 0 20px; padding-left: 20px;">${list}</ul>
      <a href="${ctaHref}" style="display: inline-block; background: #ff9a4d; color: #fff; text-decoration: none; font-weight: 700; padding: 12px 20px; border-radius: 8px;">Review pitches</a>
      <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px;">Tutors pitched on your open posts — accept to unlock WhatsApp. Mentr takes no cut of fees.</p>
    </div>
  `;
}

/** Send at most one digest email per parent per 24h when pitches are waiting. */
export async function maybeSendPitchDigestEmail(parentId: string): Promise<void> {
  try {
    const user = await User.findById(parentId);
    if (!user || user.role !== "parent" || !user.email || !user.parentProfile) {
      return;
    }

    const lastSent = user.parentProfile.lastPitchDigestAt;
    if (lastSent && Date.now() - lastSent.getTime() < DIGEST_INTERVAL_MS) {
      return;
    }

    const pending = (await Connection.find({
      parent: user._id,
      requestedBy: "teacher",
      status: "pending",
      requirement: { $exists: true, $ne: null },
    }).select("requirement")) as { requirement?: { toString(): string } }[];

    if (pending.length === 0) return;

    const reqIds = [
      ...new Set(
        pending
          .map((c) => c.requirement?.toString())
          .filter(Boolean) as string[],
      ),
    ];
    const requirements = await Requirement.find({ _id: { $in: reqIds } }).select(
      "subject classLevel area status expiresAt",
    );
    const reqById = new Map(requirements.map((r) => [r._id.toString(), r]));

    const counts = new Map<string, number>();
    for (const c of pending) {
      const id = c.requirement?.toString();
      if (!id) continue;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }

    const lines: string[] = [];
    for (const [id, count] of counts) {
      const r = reqById.get(id);
      if (!r) continue;
      const open =
        r.status === "open" && r.expiresAt.getTime() > Date.now();
      if (!open) continue;
      lines.push(
        `<strong>${count} pitch${count === 1 ? "" : "es"}</strong> on ${r.subject} · ${r.classLevel} (${r.area})`,
      );
    }

    if (lines.length === 0) return;

    const total = pending.length;
    const title =
      total === 1
        ? "1 tutor pitch is waiting for you"
        : `${total} tutor pitches are waiting for you`;

    const href = dashboardUrl("/parent/dashboard");
    await sendAdminEmail(
      user.email,
      `${total} pitch${total === 1 ? "" : "es"} waiting · Mentr`,
      `${title}\n\n${lines.map((l) => l.replace(/<[^>]+>/g, "")).join("\n")}\n\n${href}`,
      digestEmailHtml(title, lines, href),
    );

    user.parentProfile.lastPitchDigestAt = new Date();
    user.markModified("parentProfile");
    await user.save();
  } catch (err) {
    console.error("pitch digest email failed:", err);
  }
}

/** Cron entry: digest all parents with pending pitches (respects 24h throttle). */
export async function sendAllPitchDigests(): Promise<number> {
  const parentIds = await Connection.distinct("parent", {
    requestedBy: "teacher",
    status: "pending",
    requirement: { $exists: true, $ne: null },
  });

  for (const id of parentIds) {
    await maybeSendPitchDigestEmail(id.toString());
  }
  return parentIds.length;
}
