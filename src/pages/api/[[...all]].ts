import serverless from "serverless-http";
import app from "../../../server/app";

export const config = {
  api: {
    bodyParser: false,
    // Required when Express/serverless-http owns res.end() — without this Next.js
    // waits forever and Vercel returns FUNCTION_INVOCATION_TIMEOUT.
    externalResolver: true,
  },
};

export default serverless(app);
