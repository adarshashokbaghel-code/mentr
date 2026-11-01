import { Router } from "express";
import { ensureDb } from "../middleware/ensure-db";
import { verifyAuthToken, type AuthTokenPayload } from "../services/jwt";
import { config } from "../config";
import { recordPythonCompilerRun } from "../services/python-compiler-stats";
import type { Request } from "express";

const router = Router();
router.use(ensureDb);

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 40;
const hits = new Map<string, { n: number; reset: number }>();

function clientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : req.ip;
  return ip || "unknown";
}

function limited(req: Request): boolean {
  const now = Date.now();
  const key = clientKey(req);
  const row = hits.get(key);
  if (!row || row.reset < now) {
    hits.set(key, { n: 1, reset: now + WINDOW_MS });
    return false;
  }
  row.n += 1;
  return row.n > MAX_PER_WINDOW;
}

function optionalUserId(req: Request): string | undefined {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const cookieToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[config.cookieName];
  const token = bearer || cookieToken;
  if (!token) return undefined;
  try {
    const auth: AuthTokenPayload = verifyAuthToken(token);
    return /^[a-f\d]{24}$/i.test(auth.sub) ? auth.sub : undefined;
  } catch {
    return undefined;
  }
}

/** Public. Stores a run summary only — code, input and output are dropped. */
router.post("/runs", async (req, res) => {
  try {
    if (limited(req)) {
      res.status(204).end();
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    await recordPythonCompilerRun({
      surface: body.surface,
      projectId: body.projectId,
      ok: body.ok,
      status: body.status,
      passed: body.passed,
      errorType: body.errorType,
      errorMessage: body.errorMessage,
      line: body.line,
      durationMs: body.durationMs,
      chars: body.chars,
      userId: optionalUserId(req),
    });
    res.status(204).end();
  } catch (err) {
    console.error("python compiler track:", err);
    res.status(204).end();
  }
});

export default router;
