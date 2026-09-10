import { Router, Request, Response } from "express";
import { ensureDb } from "../middleware/ensure-db";
import { MarketingStat } from "../models/MarketingStat";
import {
  sanitizeMarketingKind,
  sanitizeMarketingSlug,
} from "../lib/marketing-attribution";

const router = Router();

const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_MAX_EVENTS = 120;
const ipHits = new Map<string, number[]>();

function ipLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (hits.length >= IP_MAX_EVENTS) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, hits] of ipHits) {
    const fresh = hits.filter((t) => now - t < IP_WINDOW_MS);
    if (fresh.length === 0) ipHits.delete(key);
    else ipHits.set(key, fresh);
  }
}, IP_WINDOW_MS).unref();

function sanitizePath(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const path = value.trim().slice(0, 200);
  if (!path.startsWith("/")) return undefined;
  if (path.startsWith("/admin") || path.startsWith("/admintesting")) {
    return undefined;
  }
  return path;
}

function sanitizeHref(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const href = value.trim().slice(0, 500);
  return href.length > 0 ? href : undefined;
}

function sanitizeVisitorId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const id = value.trim().slice(0, 64);
  return /^[a-zA-Z0-9_-]+$/.test(id) ? id : undefined;
}

router.post("/event", ensureDb, async (req: Request, res: Response) => {
  try {
    if (ipLimited(req.ip ?? "unknown")) {
      res.status(429).json({ error: "Too many requests" });
      return;
    }

    const type = req.body?.type === "redirect" ? "redirect" : req.body?.type === "view" ? "view" : null;
    const slug = sanitizeMarketingSlug(req.body?.slug);
    const kind = sanitizeMarketingKind(req.body?.kind);
    const path = sanitizePath(req.body?.path);
    const visitorId = sanitizeVisitorId(req.body?.visitorId);
    const href = type === "redirect" ? sanitizeHref(req.body?.href) : undefined;

    if (!type || !slug || !kind || !path || !visitorId) {
      res.status(400).json({ error: "Invalid event" });
      return;
    }

    await MarketingStat.findOneAndUpdate(
      { slug, kind, event: type, visitorId },
      {
        $inc: { count: 1 },
        $set: {
          lastAt: new Date(),
          path,
          ...(href ? { href } : {}),
        },
        $setOnInsert: { slug, kind, event: type, visitorId },
      },
      { upsert: true },
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Marketing event error:", err);
    res.status(500).json({ error: "Failed to record event" });
  }
});

export default router;
