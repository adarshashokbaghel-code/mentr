import { Router, Response } from "express";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { serializeUser } from "./auth";
import { User } from "../models/User";
import {
  computeHiringProgress,
  markHiringStep,
} from "../services/hiring-progress";
import { maybeSendPitchDigestEmail } from "../services/pitch-digest";

const router = Router();

router.use(ensureDb);
router.use(requireAuth);

/** Parent hiring checklist + pending pitch counts */
router.get("/hiring-progress", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Only parent accounts have hiring progress" });
      return;
    }

    const user = await User.findById(req.auth!.sub);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const progress = await computeHiringProgress(user);

    if (progress.pendingPitchCount > 0) {
      void maybeSendPitchDigestEmail(user._id.toString());
    }

    res.json(progress);
  } catch (error) {
    console.error("hiring progress error:", error);
    res.status(500).json({ error: "Failed to load hiring progress" });
  }
});

/** Mark trial or first-session step complete (self-reported). */
router.post(
  "/hiring-progress/:step",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.auth!.role !== "parent") {
        res.status(403).json({ error: "Only parent accounts have hiring progress" });
        return;
      }

      const step = String(req.params.step || "");
      if (step !== "trial" && step !== "firstSession") {
        res.status(400).json({ error: "Invalid step" });
        return;
      }

      const user = await User.findById(req.auth!.sub);
      if (!user?.parentProfile) {
        res.status(400).json({ error: "Complete your parent profile first" });
        return;
      }

      if (step === "firstSession") {
        const progressBefore = await computeHiringProgress(user);
        if (!progressBefore.steps.connect) {
          res.status(400).json({
            error: "Connect with a tutor on WhatsApp before logging a session",
          });
          return;
        }
      }

      await markHiringStep(user, step);
      const updated = await User.findById(req.auth!.sub);
      if (!updated) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const progress = await computeHiringProgress(updated);
      res.json({
        user: serializeUser(updated),
        progress,
        message:
          step === "trial"
            ? "Trial marked — great progress!"
            : "First session logged — you're hiring!",
      });
    } catch (error) {
      console.error("mark hiring step error:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  },
);

export default router;
