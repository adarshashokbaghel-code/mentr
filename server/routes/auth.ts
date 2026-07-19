import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { config } from "../config";
import { User, USER_ROLES, type IUser, type UserRole } from "../models/User";
import { OtpSession, type IOtpSession } from "../models/OtpSession";
import {
  generateOtpCode,
  getOtpExpiryDate,
  getOtpPurgeDate,
  hashOtp,
  isValidEmail,
  isValidOtpCode,
  normalizeEmail,
  verifyOtp,
} from "../services/otp";
import { sendOtpEmail } from "../services/mail";
import { signAuthToken } from "../services/jwt";
import {
  AuthenticatedRequest,
  requireAuth,
  setAuthCookie,
} from "../middleware/auth";
import { ensureDb } from "../middleware/ensure-db";
import { isProfileComplete } from "../lib/profile-complete";

const router = Router();

// ensureDb is per-route so /me returns 401 instantly when logged out (no Mongo wait).

// ————————————————————————————————————————————————————————————————
// Serialization & validation helpers
// ————————————————————————————————————————————————————————————————

export { isProfileComplete } from "../lib/profile-complete";

export function serializeUser(user: IUser) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    profileCompleted: isProfileComplete(user),
    profile: user.profile,
    parentProfile: user.parentProfile,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

/** Strict: an unknown role value is a client bug, not a default. */
function parseRole(value: unknown): UserRole | null {
  if (value === undefined || value === null || value === "") return "faculty";
  return USER_ROLES.includes(value as UserRole) ? (value as UserRole) : null;
}

function parseIntent(value: unknown): "login" | "signup" | "" | null {
  if (value === undefined || value === null || value === "") return "";
  return value === "login" || value === "signup" ? value : null;
}

function roleMismatchError(actualRole: UserRole) {
  return {
    error:
      actualRole === "parent"
        ? "This email belongs to a parent account. Use the parent login."
        : "This email belongs to a tutor account. Use the tutor login.",
    code: "ROLE_MISMATCH" as const,
    role: actualRole,
  };
}

// ————————————————————————————————————————————————————————————————
// Per-IP rate limiting (in-memory sliding window).
// Single-instance guard on top of the per-email DB limits; move to
// Redis if the API ever runs on more than one instance.
// ————————————————————————————————————————————————————————————————

const IP_WINDOW_MS = 15 * 60 * 1000;
const IP_MAX_SENDS = 20;
const IP_MAX_VERIFIES = 60;
const ipHits = new Map<string, number[]>();

function ipLimited(ip: string, kind: "send" | "verify"): boolean {
  const key = `${kind}:${ip}`;
  const now = Date.now();
  const hits = (ipHits.get(key) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  const max = kind === "send" ? IP_MAX_SENDS : IP_MAX_VERIFIES;
  if (hits.length >= max) return true;
  hits.push(now);
  ipHits.set(key, hits);
  return false;
}

// Keep the map from growing unbounded
setInterval(() => {
  const now = Date.now();
  for (const [key, hits] of ipHits) {
    const fresh = hits.filter((t) => now - t < IP_WINDOW_MS);
    if (fresh.length === 0) ipHits.delete(key);
    else ipHits.set(key, fresh);
  }
}, IP_WINDOW_MS).unref();

// ————————————————————————————————————————————————————————————————
// POST /send-otp — { email, intent: "login" | "signup", role: "faculty" | "parent" }
// ————————————————————————————————————————————————————————————————

router.post("/send-otp", ensureDb, async (req: Request, res: Response) => {
  try {
    if (ipLimited(req.ip ?? "unknown", "send")) {
      res.status(429).json({ error: "Too many requests. Try again later." });
      return;
    }

    const email = normalizeEmail(String(req.body.email || ""));
    const intent = parseIntent(req.body.intent);
    const role = parseRole(req.body.role);

    if (!isValidEmail(email)) {
      res.status(400).json({ error: "Enter a valid email address" });
      return;
    }
    if (intent === null || role === null) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const existingUser = await User.findOne({ email });

    // Email is the primary unique key across BOTH roles:
    // a verified account blocks re-signup, for any role.
    if (intent === "signup" && existingUser && existingUser.emailVerified) {
      if (existingUser.role !== role) {
        res.status(409).json(roleMismatchError(existingUser.role));
      } else {
        res.status(409).json({
          error: "An account with this email already exists. Log in instead.",
          code: "EMAIL_EXISTS",
        });
      }
      return;
    }

    if (intent === "login" && (!existingUser || !existingUser.emailVerified)) {
      res.status(404).json({
        error: "No account found with this email. Create a free account.",
        code: "NO_ACCOUNT",
      });
      return;
    }

    // Logging into the wrong portal: point the user to their real one.
    if (intent === "login" && existingUser && existingUser.role !== role) {
      res.status(409).json(roleMismatchError(existingUser.role));
      return;
    }

    const purpose =
      existingUser && existingUser.emailVerified ? "login" : "signup";

    // Per-email send cap — consumed sessions still count until TTL purge.
    const windowStart = new Date(Date.now() - 60 * 60 * 1000);
    const recentSends = await OtpSession.countDocuments({
      email,
      createdAt: { $gte: windowStart },
    });
    if (recentSends >= config.otp.maxSendsPerHour) {
      res.status(429).json({
        error: "Too many OTP requests. Try again in an hour.",
      });
      return;
    }

    // Resend cooldown against the latest active session
    const activeSession = await OtpSession.findOne({
      email,
      consumed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (activeSession) {
      const cooldownMs = config.otp.resendCooldownSeconds * 1000;
      const elapsed = Date.now() - activeSession.createdAt.getTime();
      if (elapsed < cooldownMs) {
        const retryAfter = Math.ceil((cooldownMs - elapsed) / 1000);
        res.status(429).json({
          error: `Wait ${retryAfter}s before requesting a new code`,
          retryAfter,
          sessionId: activeSession.sessionId,
          isNewUser: purpose === "signup",
          purpose,
        });
        return;
      }
    }

    // Supersede any previous active sessions — exactly one live code per email
    await OtpSession.updateMany(
      { email, consumed: false },
      { $set: { consumed: true } },
    );

    const code = generateOtpCode();
    const otpHash = await hashOtp(code);
    const sessionId = randomUUID();

    const registrationSource =
      typeof req.body.registrationSource === "string" &&
      req.body.registrationSource.trim().length > 0
        ? req.body.registrationSource.trim().slice(0, 2048)
        : undefined;

    await OtpSession.create({
      sessionId,
      email,
      otpHash,
      purpose,
      role,
      registrationSource,
      expiresAt: getOtpExpiryDate(),
      purgeAt: getOtpPurgeDate(),
    });

    await sendOtpEmail(email, code, purpose);

    res.json({
      sessionId,
      isNewUser: purpose === "signup",
      purpose,
      message: "Verification code sent to your email.",
      expiresIn: config.otp.expiryMinutes * 60,
    });
  } catch (error) {
    console.error("send-otp error:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

// ————————————————————————————————————————————————————————————————
// POST /verify-otp — { email, sessionId, code }
// The role and purpose recorded at send time are authoritative;
// the client cannot switch portals between send and verify.
// ————————————————————————————————————————————————————————————————

router.post("/verify-otp", ensureDb, async (req: Request, res: Response) => {
  try {
    if (ipLimited(req.ip ?? "unknown", "verify")) {
      res.status(429).json({ error: "Too many requests. Try again later." });
      return;
    }

    const email = normalizeEmail(String(req.body.email || ""));
    const sessionId = String(req.body.sessionId || "");
    const code = String(req.body.code || "").trim();

    if (!isValidEmail(email) || !sessionId || sessionId.length > 64) {
      res.status(400).json({ error: "Email and session are required" });
      return;
    }
    if (!isValidOtpCode(code)) {
      res.status(400).json({ error: `Enter a ${config.otp.length}-digit code` });
      return;
    }

    const session = await OtpSession.findOne({
      sessionId,
      email,
      consumed: false,
    }) as IOtpSession | null;

    if (!session) {
      res
        .status(400)
        .json({ error: "Invalid or expired session. Request a new code." });
      return;
    }

    if (session.expiresAt < new Date()) {
      session.consumed = true;
      await session.save();
      res.status(400).json({ error: "Code expired. Request a new one." });
      return;
    }

    if (session.attempts >= config.otp.maxAttempts) {
      session.consumed = true;
      await session.save();
      res.status(429).json({ error: "Too many attempts. Request a new code." });
      return;
    }

    const valid = await verifyOtp(code, session.otpHash);
    if (!valid) {
      session.attempts += 1;
      const burned = session.attempts >= config.otp.maxAttempts;
      if (burned) session.consumed = true;
      await session.save();
      res.status(400).json({
        error: burned
          ? "Too many attempts. Request a new code."
          : "Incorrect code",
        attemptsRemaining: Math.max(config.otp.maxAttempts - session.attempts, 0),
      });
      return;
    }

    // ——— Code is correct. Resolve the account. ———
    let user = await User.findOne({ email });

    // Defense in depth: a verified account never changes role, and never
    // logs in through the other portal — even if send-otp was bypassed.
    if (user && user.emailVerified && user.role !== session.role) {
      session.consumed = true;
      await session.save();
      res.status(409).json(roleMismatchError(user.role));
      return;
    }

    if (!user) {
      user = await User.create({
        email,
        role: session.role,
        emailVerified: true,
        lastLoginAt: new Date(),
        ...(session.registrationSource && session.purpose === "signup"
          ? { registrationSource: session.registrationSource }
          : {}),
      });
    } else {
      // Unverified stubs may still switch portals; verified accounts cannot.
      if (!user.emailVerified) user.role = session.role;
      user.emailVerified = true;
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Consume every outstanding session for this email
    await OtpSession.updateMany(
      { email, consumed: false },
      { $set: { consumed: true } },
    );

    const token = signAuthToken(user._id.toString(), user.email, user.role);
    setAuthCookie(res, token);

    const completed = isProfileComplete(user);
    res.json({
      token,
      user: serializeUser(user),
      profileCompleted: completed,
      message: completed
        ? "Welcome back!"
        : user.role === "parent"
          ? "Email verified. Add your details to start searching."
          : "Email verified. Complete your profile to go live.",
    });
  } catch (error) {
    console.error("verify-otp error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

// ————————————————————————————————————————————————————————————————
// Session endpoints
// ————————————————————————————————————————————————————————————————

router.get("/me", requireAuth, ensureDb, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.auth!.sub);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user: serializeUser(user) });
  } catch (error) {
    console.error("me error:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

export default router;
