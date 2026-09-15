import { createHash } from "crypto";
import { config } from "../config";
import type { Request } from "express";

/** Stable, non-reversible visitor key from client IP (unique-per-IP analytics). */
export function marketingVisitorKeyFromIp(ip: string): string {
  const salt = process.env.MARKETING_IP_SALT || config.jwtSecret;
  return createHash("sha256")
    .update(`${salt}|ip|${ip}`)
    .digest("hex")
    .slice(0, 32);
}

export function clientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0]!.trim().slice(0, 64);
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).split(",")[0]!.trim().slice(0, 64);
  }
  return (req.ip || req.socket.remoteAddress || "unknown").slice(0, 64);
}
