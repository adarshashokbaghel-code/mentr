import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { connectDb } from "./db";
import authRoutes from "./routes/auth";
import connectionRoutes from "./routes/connections";
import profileRoutes from "./routes/profile";
import requirementRoutes from "./routes/requirements";
import teacherRoutes from "./routes/teachers";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = new Set([
  config.frontendUrl,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://mentr.in",
  "http://mentr.in",
  "http://www.mentr.in",
  "http://localhost:3001",
  "https://www.mentr.in",
]);

/** Allow Next.js dev on any local port (3000, 3001, …). */
function isLocalDevOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.has(origin) ||
        (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin))
      ) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(async (_req, _res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "champs-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/teachers", teacherRoutes);

export default app;
