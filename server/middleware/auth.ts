import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { verifyAuthToken, type AuthTokenPayload } from "../services/jwt";

export interface AuthenticatedRequest extends Request {
  auth?: AuthTokenPayload;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const cookieToken = req.cookies?.[config.cookieName] as string | undefined;
  const token = bearer || cookieToken;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    req.auth = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(config.cookieName, { path: "/" });
}
