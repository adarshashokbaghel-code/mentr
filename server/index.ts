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

app.use(
  cors({
    origin: [config.frontendUrl, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "champs-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/teachers", teacherRoutes);

async function start() {
  await connectDb();
  app.listen(config.port, () => {
    console.log(`Mentr API running on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
