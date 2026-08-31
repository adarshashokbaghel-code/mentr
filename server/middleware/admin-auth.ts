import type { NextFunction, Request, Response } from "express";
import { isValidAdminKey } from "../lib/admin-panel";

export function requireAdminKey(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const provided =
    (typeof req.query.key === "string" ? req.query.key : null) ||
    req.header("x-admin-key") ||
    "";

  if (!isValidAdminKey(provided)) {
    res.status(401).json({ error: "Invalid admin key" });
    return;
  }

  next();
}
