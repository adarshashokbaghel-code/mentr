import { Router, Request, Response } from "express";
import { ensureDb } from "../middleware/ensure-db";
import {
  USER_INTERACTION_ROLES,
  USER_INTERACTION_TYPES,
  UserInteraction,
} from "../models/UserInteraction";
import { sendAdminEmail } from "../services/mail";
import { config } from "../config";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_MAX = 8;
const ipHits = new Map<string, number[]>();

function ipLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (hits.length >= IP_MAX) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

router.post("/", ensureDb, async (req: Request, res: Response) => {
  try {
    if (ipLimited(req.ip ?? "unknown")) {
      res.status(429).json({ error: "Too many submissions. Try again later." });
      return;
    }

    const name = clip(req.body?.name, 80);
    const email = clip(req.body?.email, 160).toLowerCase();
    const city = clip(req.body?.city, 80);
    const country = clip(req.body?.country, 56) || "India";
    const role = String(req.body?.role || "");
    const feedbackType = String(req.body?.feedbackType || "");
    const feedback = clip(req.body?.feedback, 2000);
    const featureTitle = clip(req.body?.featureTitle, 120) || undefined;
    const featureDescription = clip(req.body?.featureDescription, 2000) || undefined;
    const review = clip(req.body?.review, 2000) || undefined;
    const page = clip(req.body?.page, 80) || "/contact";
    const rating = Number(req.body?.rating);

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Enter a valid email" });
      return;
    }
    if (!city) {
      res.status(400).json({ error: "City is required" });
      return;
    }
    if (!USER_INTERACTION_ROLES.includes(role as (typeof USER_INTERACTION_ROLES)[number])) {
      res.status(400).json({ error: "Choose who you are" });
      return;
    }
    if (!USER_INTERACTION_TYPES.includes(feedbackType as (typeof USER_INTERACTION_TYPES)[number])) {
      res.status(400).json({ error: "Choose a feedback type" });
      return;
    }
    if (feedbackType === "feature") {
      if (!featureTitle) {
        res.status(400).json({ error: "Add a feature title" });
        return;
      }
    } else if (feedbackType === "review") {
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        res.status(400).json({ error: "Please rate Mentr from 1 to 5 stars" });
        return;
      }
    } else if (feedback.length < 10) {
      res.status(400).json({ error: "Tell us a little more in the feedback box" });
      return;
    }

    const savedRating =
      feedbackType === "review" && Number.isInteger(rating) && rating >= 1 && rating <= 5
        ? rating
        : undefined;

    const doc = await UserInteraction.create({
      name,
      email,
      city,
      country,
      role,
      feedbackType,
      feedback,
      featureTitle,
      featureDescription,
      rating: savedRating,
      review,
      page: page.startsWith("/") ? page : "/contact",
    });

    const ratingLabel = savedRating ? `${savedRating}★` : "no rating";
    void sendAdminEmail(
      config.emailUser,
      `Mentr feedback · ${feedbackType} · ${ratingLabel} from ${city}`,
      `${name} (${email}, ${role}, ${city})\n\n${feedback}\n\nFeature: ${featureTitle || "—"}\n${featureDescription || ""}\n\nReview: ${review || "—"}`,
      `<p><strong>${name}</strong> · ${email} · ${role} · ${city}</p><p>${feedback.replace(/\n/g, "<br/>")}</p><p><strong>Feature:</strong> ${featureTitle || "—"}<br/>${(featureDescription || "").replace(/\n/g, "<br/>")}</p><p><strong>Rating:</strong> ${savedRating ? `${savedRating}/5` : "—"}<br/>${(review || "").replace(/\n/g, "<br/>")}</p>`,
    ).catch((err) => console.error("Feedback admin email failed:", err));

    res.json({ ok: true, id: doc._id.toString() });
  } catch (err) {
    console.error("Feedback submit error:", err);
    res.status(500).json({ error: "Could not save your message. Try again." });
  }
});

export default router;
