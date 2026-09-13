import { Router } from "express";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import {
  enrollParentInStarter,
  getParentStarterEnrollment,
} from "../services/learn-enroll";
import { serializeUser } from "./auth";

const router = Router();

router.use(ensureDb);
router.use(requireAuth);

router.get("/enrollment", async (req: AuthenticatedRequest, res) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({ error: "Parent account required" });
      return;
    }
    const enrollment = await getParentStarterEnrollment(req.auth!.sub);
    res.json({ enrollment });
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn enrollment get error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Failed to load enrollment",
    });
  }
});

router.post("/enroll", async (req: AuthenticatedRequest, res) => {
  try {
    if (req.auth!.role !== "parent") {
      res.status(403).json({
        error: "Only parent accounts can enroll in Mentr Learn",
      });
      return;
    }
    const { enrollment, created, user } = await enrollParentInStarter(
      req.auth!.sub,
    );
    res.status(created ? 201 : 200).json({
      enrollment,
      created,
      user: serializeUser(user),
      message: created
        ? "Enrolled in Mentr Starter"
        : "Already enrolled in Mentr Starter",
    });
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    console.error("Learn enroll error:", err);
    res.status(status).json({
      error: err instanceof Error ? err.message : "Enrollment failed",
    });
  }
});

export default router;
