import type { NextFunction, Request, Response } from "express";
import { config } from "../config";

export function requireAdminKey(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const key = config.adminSecretKey;
  if (!key) {
    res.status(503).json({ error: "Admin panel not configured" });
    return;
  }

  const provided =
    (typeof req.query.key === "string" ? req.query.key : null) ||
    req.header("x-admin-key") ||
    "";

  if (!provided || provided !== key) {
    res.status(401).json({ error: "Invalid admin key" });
    return;
  }

  next();
}
