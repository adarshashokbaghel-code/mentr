import { Router, type Response } from "express";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { User } from "../models/User";
import { serializeUser } from "./auth";
import {
  chooseFreeMentorPlan,
  createPremiumMentorOrder,
  isPremiumRazorpayConfigured,
  markPremiumOrderFailed,
  serializeMentrPremiumState,
  verifyPremiumMentorPayment,
} from "../services/premium-mentor-billing";
import { serializePremiumCatalog } from "../lib/premium-mentor-plans";

const router = Router();
router.use(ensureDb);

const hitBuckets = new Map<string, number[]>();

function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const prev = hitBuckets.get(key) || [];
  const next = prev.filter((t) => now - t < windowMs);
  if (next.length >= max) {
    hitBuckets.set(key, next);
    return false;
  }
  next.push(now);
  hitBuckets.set(key, next);
  return true;
}

/** Public catalog — no auth required. */
router.get("/catalog", (_req, res: Response) => {
  res.json({
    ...serializePremiumCatalog(),
    paymentsEnabled: isPremiumRazorpayConfigured(),
  });
});

/** Mentor premium status + paid history. */
router.get(
  "/me",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await User.findById(req.auth!.sub);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      if (user.role !== "faculty") {
        res.status(403).json({ error: "Only mentors have Premium plans" });
        return;
      }
      res.json({
        user: serializeUser(user),
        premium: serializeMentrPremiumState(user),
      });
    } catch (err) {
      console.error("premium-mentor me error:", err);
      res.status(500).json({ error: "Failed to load Premium status" });
    }
  },
);

router.post(
  "/order",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!rateLimit(`prem-order:${req.auth!.sub}`, 8, 60_000)) {
        res.status(429).json({ error: "Too many payment attempts. Wait a minute." });
        return;
      }
      const months = Number(req.body?.months);
      const result = await createPremiumMentorOrder(req.auth!.sub, months);
      if ("error" in result) {
        const status =
          result.code === "PAYMENTS_OFF"
            ? 503
            : result.code === "TOO_MANY_ORDERS" || result.code === "ALREADY_ACTIVE"
              ? 429
              : result.code === "FORBIDDEN"
                ? 403
                : 400;
        res.status(status).json(result);
        return;
      }
      res.json(result);
    } catch (err) {
      console.error("premium-mentor order error:", err);
      res.status(500).json({ error: "Could not start payment" });
    }
  },
);

router.post(
  "/verify",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!rateLimit(`prem-verify:${req.auth!.sub}`, 40, 60_000)) {
        res.status(429).json({ error: "Too many verify attempts" });
        return;
      }
      const orderId = String(
        req.body?.razorpay_order_id || req.body?.orderId || "",
      );
      const paymentId = String(
        req.body?.razorpay_payment_id || req.body?.paymentId || "",
      );
      const signature = String(
        req.body?.razorpay_signature || req.body?.signature || "",
      );
      const result = await verifyPremiumMentorPayment({
        userId: req.auth!.sub,
        orderId,
        paymentId,
        signature,
      });
      if ("error" in result) {
        const code = String(result.code || "");
        const status =
          code === "FORBIDDEN"
            ? 403
            : code === "NOT_CAPTURED" || code === "FETCH_FAILED"
              ? 409
              : code === "ALREADY_ACTIVE"
                ? 429
                : 400;
        res.status(status).json(result);
        return;
      }
      res.json({
        alreadyApplied: result.alreadyApplied,
        user: serializeUser(result.user),
        premium: result.premium,
        payment: result.payment,
      });
    } catch (err) {
      console.error("premium-mentor verify error:", err);
      res.status(500).json({ error: "Could not confirm payment" });
    }
  },
);

/** Client dismissed / failed checkout — mark open order failed (best effort). */
router.post(
  "/cancel",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orderId = String(req.body?.orderId || req.body?.razorpay_order_id || "");
      if (orderId) {
        await markPremiumOrderFailed(req.auth!.sub, orderId);
      }
      res.json({ ok: true });
    } catch (err) {
      console.error("premium-mentor cancel error:", err);
      res.status(500).json({ error: "Could not update order" });
    }
  },
);

/** Onboarding: stay on Classic / Free mentor (no payment). */
router.post(
  "/choose-free",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!rateLimit(`prem-free:${req.auth!.sub}`, 20, 60_000)) {
        res.status(429).json({ error: "Too many attempts" });
        return;
      }
      const result = await chooseFreeMentorPlan(req.auth!.sub);
      if ("error" in result) {
        res.status(403).json(result);
        return;
      }
      res.json({
        alreadyPremium: result.alreadyPremium,
        user: serializeUser(result.user),
        premium: result.premium,
      });
    } catch (err) {
      console.error("premium-mentor choose-free error:", err);
      res.status(500).json({ error: "Could not save plan" });
    }
  },
);

/** Premium parent directory — blurred contacts until reveal. */
router.get(
  "/parents",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await User.findById(req.auth!.sub);
      if (!user || user.role !== "faculty") {
        res.status(403).json({ error: "Only mentors can open the parent list" });
        return;
      }
      const { listParentsForPremiumMentor } = await import(
        "../services/parent-contact-reveal"
      );
      const result = await listParentsForPremiumMentor({
        mentor: user,
        query: String(req.query.q || ""),
        onlyPosted: String(req.query.posted || "") === "1",
        limit: Number(req.query.limit) || 120,
      });
      if ("error" in result) {
        res.status(403).json({
          ...result,
          premiumActive: false,
          upgradeUrl: "/mentrpricing",
        });
        return;
      }
      res.json(result);
    } catch (err) {
      console.error("premium-mentor parents error:", err);
      res.status(500).json({ error: "Failed to load parents" });
    }
  },
);

router.post(
  "/parents/:id/reveal",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!rateLimit(`prem-reveal:${req.auth!.sub}`, 20, 60_000)) {
        res.status(429).json({ error: "Too many reveal attempts" });
        return;
      }
      const user = await User.findById(req.auth!.sub);
      if (!user || user.role !== "faculty") {
        res.status(403).json({ error: "Only mentors can reveal contacts" });
        return;
      }
      const { revealParentContact } = await import(
        "../services/parent-contact-reveal"
      );
      const result = await revealParentContact({
        mentor: user,
        parentId: String(req.params.id || ""),
      });
      if ("error" in result) {
        const status =
          result.code === "NOT_PREMIUM"
            ? 403
            : result.code === "DAILY_LIMIT"
              ? 429
              : result.code === "ALREADY_REVEALED"
                ? 409
              : result.code === "NOT_FOUND"
                ? 404
                : 400;
        res.status(status).json(result);
        return;
      }
      res.json(result);
    } catch (err) {
      console.error("premium-mentor reveal error:", err);
      res.status(500).json({ error: "Failed to reveal contact" });
    }
  },
);

router.get(
  "/reveals",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await User.findById(req.auth!.sub);
      if (!user || user.role !== "faculty") {
        res.status(403).json({ error: "Only mentors have reveal history" });
        return;
      }
      const { isMentrPremiumActive } = await import(
        "../services/premium-mentor-billing"
      );
      if (!isMentrPremiumActive(user)) {
        res.status(403).json({
          error: "Premium required",
          code: "NOT_PREMIUM",
          premiumActive: false,
          upgradeUrl: "/mentrpricing",
        });
        return;
      }
      const { listRevealHistory } = await import(
        "../services/parent-contact-reveal"
      );
      const data = await listRevealHistory(user._id.toString());
      res.json({ ...data, premiumActive: true });
    } catch (err) {
      console.error("premium-mentor reveals error:", err);
      res.status(500).json({ error: "Failed to load reveal history" });
    }
  },
);

export default router;
