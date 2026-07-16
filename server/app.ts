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

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = new Set(
  [
    config.frontendUrl,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
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
  if (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin)) {
    return true;
  }

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
        callback(null, true);
        return;
      }
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json());
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

app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/teachers", teacherRoutes);

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
