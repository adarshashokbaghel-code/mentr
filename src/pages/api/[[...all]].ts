import type { NextApiRequest, NextApiResponse } from "next";
import app from "../../../server/app";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

/**
 * Forward Next.js req/res to Express. Must resolve only after `res.finish`
 * so Next/Vercel does not stall until FUNCTION_INVOCATION_TIMEOUT.
 */
export default function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  return new Promise((resolve, reject) => {
    res.once("finish", resolve);
    res.once("close", resolve);
    res.once("error", reject);
    app(req, res);
  });
}
