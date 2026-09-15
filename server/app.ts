import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { clearAuthCookie } from "./middleware/auth";
import authRoutes from "./routes/auth";
import connectionRoutes from "./routes/connections";
import profileRoutes from "./routes/profile";
import requirementRoutes from "./routes/requirements";
import teacherRoutes from "./routes/teachers";
import adminRoutes from "./routes/admin";
import marketingRoutes from "./routes/marketing";
import feedbackRoutes from "./routes/feedback";
import notificationRoutes from "./routes/notifications";
import parentHiringRoutes from "./routes/parent-hiring";
import learnRoutes from "./routes/learn";
import { getPublicRequirementShare } from "./public-requirement-share";
import { connectDb } from "./db";
import { sendAllPitchDigests } from "./services/pitch-digest";
import { getPublicTeacher, getPublicTeachers } from "./public-teacher";
import { getPublicTestimonialNames } from "./public-testimonial-names";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = new Set(
  [
    config.frontendUrl,
    config.publicSiteUrl,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://mentr.in",
    "https://www.mentr.in",
  ].filter(Boolean) as string[],
);

/** Allow Next.js dev on any local port (3000, 3001, …). */
function isLocalDevOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.has(origin)) return true;
  if (isLocalDevOrigin(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    if (hostname === "mentr.in" || hostname.endsWith(".mentr.in")) return true;
    if (hostname.endsWith(".vercel.app")) return true;
  } catch {
    return false;
  }

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, origin ?? true);
        return;
      }
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(null, false);
    },
    credentials: true,
  }),
);


// comment
// 3mb so cropped profile images can POST as base64 JSON
app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "champs-api" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "champs-api" });
});

// No MongoDB — must respond instantly on Vercel serverless.
app.post("/api/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

// Public SEO profiles — mounted before the auth-gated teachers router.
app.get("/api/teachers/public", (_req, res) => {
  void getPublicTeachers(res);
});

app.get("/api/teachers/public/:id", (req, res) => {
  void getPublicTeacher(String(req.params.id || ""), res);
});

app.get("/api/testimonials/names", (_req, res) => {
  void getPublicTestimonialNames(res);
});

app.get("/api/requirements/share/:token", (req, res) => {
  void getPublicRequirementShare(String(req.params.token || ""), res);
});

app.post("/api/cron/pitch-digest", async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.authorization;
  if (!secret || auth !== `Bearer ${secret}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    await connectDb();
    const count = await sendAllPitchDigests();
    res.json({ message: "Pitch digests processed", parents: count });
  } catch (error) {
    console.error("cron pitch digest error:", error);
    res.status(500).json({ error: "Digest job failed" });
  }
});

app.use("/api/marketing", marketingRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/parent", parentHiringRoutes);
app.use("/api/learn", learnRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/admin", adminRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("API error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default app;
