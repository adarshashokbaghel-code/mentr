import type { NextApiRequest, NextApiResponse } from "next";
import type { Express } from "express";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const PUBLIC_TEACHER_PATH =
  /^(?:\/api)?\/teachers\/public\/([a-f\d]{24})$/i;

let appPromise: Promise<Express> | null = null;

function loadApp(): Promise<Express> {
  if (!appPromise) {
    appPromise = import("../../../server/app")
      .then((mod) => mod.default as Express)
      .catch((err) => {
        appPromise = null;
        throw err;
      });
  }
  return appPromise;
}

/**
 * Forward Next.js req/res to Express. Must resolve only after `res.finish`
 * so Next/Vercel does not stall until FUNCTION_INVOCATION_TIMEOUT.
 *
 * App is loaded lazily so a Snap & Grade / sharp crash does not take down
 * every /api route at module-eval time.
 */
export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const path = (req.url ?? "").split("?")[0] ?? "";
  const publicMatch = path.match(PUBLIC_TEACHER_PATH);

  if (req.method === "GET" && publicMatch) {
    return handlePublicTeacher(publicMatch[1]!, res);
  }

  let app: Express;
  try {
    app = await loadApp();
  } catch (error) {
    console.error("API app import failed:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "API failed to start",
        detail: error instanceof Error ? error.message : String(error),
      });
    }
    return;
  }

  await new Promise<void>((resolve, reject) => {
    res.once("finish", resolve);
    res.once("close", resolve);
    res.once("error", reject);
    app(req, res);
  });
}

async function handlePublicTeacher(
  id: string,
  res: NextApiResponse,
): Promise<void> {
  try {
    const { loadPublicTeacherById } = await import(
      "../../../server/public-teacher"
    );
    const teacher = await loadPublicTeacherById(id);
    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }
    res.status(200).json({ teacher });
  } catch (error) {
    console.error("public teacher handler error:", error);
    res.status(500).json({ error: "Failed to load teacher" });
  }
}
