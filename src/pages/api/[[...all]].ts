import type { NextApiRequest, NextApiResponse } from "next";
import serverless from "serverless-http";
import app from "../../../server/app";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = serverless(app);

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return handler(req, res);
}
