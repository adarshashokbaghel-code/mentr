import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../config";
import type { UserRole } from "../models/User";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

const authSignOptions: SignOptions = {
  expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
};

export function signAuthToken(
  userId: string,
  email: string,
  role: UserRole,
): string {
  const payload: AuthTokenPayload = { sub: userId, email, role };
  return jwt.sign(payload, config.jwtSecret, authSignOptions);
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
  if (!payload.sub || !payload.role) {
    throw new Error("Malformed auth token");
  }
  return payload;
}
