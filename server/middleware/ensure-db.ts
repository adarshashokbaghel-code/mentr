import type { NextFunction, Request, Response } from "express";
import { connectDb } from "../db";

/** Attach MongoDB before route handlers; fail fast instead of hanging. */
export async function ensureDb(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(503).json({ error: "Database unavailable. Try again shortly." });
  }
}

/** Skip DB for routes that do not touch Mongo (e.g. logout). */
export function ensureDbUnless(
  ...skipPaths: string[]
): (req: Request, res: Response, next: NextFunction) => void {
  const skip = new Set(skipPaths);
  return (req, res, next) => {
    if (skip.has(req.path)) {
      next();
      return;
    }
    void ensureDb(req, res, next);
  };
}
