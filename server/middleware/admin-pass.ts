import { timingSafeEqual } from "crypto";
import type { NextFunction, Request, Response } from "express";
import { config } from "../config";

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    // Keep roughly constant work when lengths differ
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

/** Extract admin write password from body or header. */
export function readAdminPass(req: Request): string {
  const fromBody =
    req.body && typeof req.body.adminPass === "string"
      ? req.body.adminPass
      : "";
  const fromHeader = req.header("x-admin-pass") || "";
  return fromBody || fromHeader;
}

export function isValidAdminPass(provided: string): boolean {
  const expected = config.adminPass;
  if (!expected || !provided) return false;
  return safeEqual(provided, expected);
}

/**
 * Gate write actions (delete user, send mail, mutate marketing links).
 * Reads stay open with the URL admin key alone.
 */
export function requireAdminPass(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!config.adminPass) {
    res.status(503).json({
      error: "ADMIN_PASS is not configured on the server",
    });
    return;
  }

  const provided = readAdminPass(req);
  if (!isValidAdminPass(provided)) {
    res.status(403).json({ error: "Invalid admin password" });
    return;
  }

  next();
}
