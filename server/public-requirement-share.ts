import { Response } from "express";
import { connectDb } from "./db";
import { Requirement } from "./models/Requirement";

function requirePostable(status: string, expiresAt: Date): boolean {
  return status === "open" && expiresAt.getTime() > Date.now();
}

/** Public, anonymized requirement for share links — no parent identity. */
export async function getPublicRequirementShare(
  token: string,
  res: Response,
): Promise<void> {
  try {
    await connectDb();

    const shareToken = String(token || "").trim();
    if (!shareToken || shareToken.length > 64) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const requirement = await Requirement.findOne({ shareToken }).select(
      "subject classLevel city area modes budgetMin budgetMax details startTimeline status expiresAt interestCount createdAt",
    );

    if (
      !requirement ||
      !requirePostable(requirement.status, requirement.expiresAt)
    ) {
      res.status(404).json({ error: "This post is no longer open" });
      return;
    }

    const headline = `Looking for a ${requirement.classLevel} ${requirement.subject.toLowerCase()} tutor in ${requirement.area}`;

    res.json({
      headline,
      subject: requirement.subject,
      classLevel: requirement.classLevel,
      city: requirement.city,
      area: requirement.area,
      modes: requirement.modes,
      budgetMin: requirement.budgetMin ?? null,
      budgetMax: requirement.budgetMax ?? null,
      details: requirement.details,
      startTimeline: requirement.startTimeline ?? "flexible",
      interestCount: requirement.interestCount,
      postedAt: requirement.createdAt,
      expiresAt: requirement.expiresAt,
    });
  } catch (error) {
    console.error("public requirement share error:", error);
    res.status(500).json({ error: "Failed to load post" });
  }
}
