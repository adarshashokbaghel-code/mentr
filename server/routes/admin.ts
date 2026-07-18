import { Router } from "express";
import { ensureDb } from "../middleware/ensure-db";
import { requireAdminKey } from "../middleware/admin-auth";
import { getAdminStats } from "../services/admin-stats";

const router = Router();

router.use(ensureDb);
router.use(requireAdminKey);

router.get("/stats", async (_req, res) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
});

export default router;
