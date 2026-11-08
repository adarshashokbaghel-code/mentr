import "dotenv/config";
import { MongoClient } from "mongodb";
import { PY_ALL_LMS_SLUGS } from "../../src/lib/python-lms/index";

async function main() {
  const email = "video-qa-l2@mentr.local";
  const client = new MongoClient(process.env.MONGODB_URI!, {
    family: 4,
    autoSelectFamily: false,
  });
  await client.connect();
  const users = client.db("champs").collection("users");
  const now = new Date();
  await users.updateOne(
    { email },
    {
      $set: {
        email,
        role: "parent",
        name: "Aarav Sharma",
        acceptedLegal: true,
        legalAcceptedAt: now,
        "learnPython.visited": true,
        "learnPython.intermediateAccess": true,
        "learnPython.lastVisitAt": now,
        "learnPython.placement": { passed: true, score: 12, total: 12, at: now },
        "learnPython.unlockedLessons": PY_ALL_LMS_SLUGS,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
  console.log("upserted", email, "slugs", PY_ALL_LMS_SLUGS.length);

  const res = await fetch("http://localhost:5000/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, intent: "login", role: "parent" }),
  });
  console.log("send-otp", res.status, await res.text());
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
