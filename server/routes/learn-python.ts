import { Router, type Response } from "express";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { syncLearnPython } from "../services/learn-python";
import {
  claimLearnPythonCertificate,
  getLearnPythonLeaderboard,
  getLearnPythonProfile,
  verifyLearnPythonCertificate,
} from "../services/learn-python-profile";

const router = Router();

router.use(ensureDb);

function fail(res: Response, err: unknown, fallback: string) {
  const status = (err as { status?: number }).status || 500;
  if (status >= 500) console.error(`Learn Python: ${fallback}`, err);
  res.status(status).json({ error: err instanceof Error ? err.message : fallback });
}

/** Public: anyone holding a certificate id can check it is real. Shows only what is printed on it. */
router.get("/certificate/:id", async (req, res) => {
  try {
    const cert = await verifyLearnPythonCertificate(String(req.params.id ?? ""));
    if (!cert) return res.status(404).json({ error: "No certificate with this id" });
    res.json(cert);
  } catch (err) {
    fail(res, err, "Failed to verify certificate");
  }
});

router.use(requireAuth);

/** Open to every signed-in account (parent or tutor). Also counts as today's visit and login. */
router.post("/sync", async (req: AuthenticatedRequest, res) => {
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const state = await syncLearnPython(req.auth!.sub, {
      day: body.day,
      awards: body.awards,
      lessons: body.lessons,
      achievements: body.achievements,
      projects: body.projects,
    });
    res.json(state);
  } catch (err) {
    fail(res, err, "Failed to save progress");
  }
});

router.get("/profile", async (req: AuthenticatedRequest, res) => {
  try {
    res.json(await getLearnPythonProfile(req.auth!.sub));
  } catch (err) {
    fail(res, err, "Failed to load profile");
  }
});

router.get("/leaderboard", async (req: AuthenticatedRequest, res) => {
  try {
    res.json(await getLearnPythonLeaderboard(req.auth!.sub));
  } catch (err) {
    fail(res, err, "Failed to load leaderboard");
  }
});

router.post("/certificate", async (req: AuthenticatedRequest, res) => {
  try {
    res.json(await claimLearnPythonCertificate(req.auth!.sub, (req.body as { name?: unknown } | undefined)?.name));
  } catch (err) {
    fail(res, err, "Failed to issue certificate");
  }
});

export default router;
