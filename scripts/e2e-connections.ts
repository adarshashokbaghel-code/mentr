/* Temporary E2E check for the connection-request flow. Run:
 *   npx tsx scripts/e2e-connections.ts
 */
import "dotenv/config";
import { connectDb, disconnectDb } from "../server/db";
import { Connection } from "../server/models/Connection";
import { User } from "../server/models/User";
import { signAuthToken } from "../server/services/jwt";

const API = "http://localhost:5000/api";

async function call(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<{ status: number; body: any }> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

function assert(cond: unknown, label: string) {
  if (!cond) throw new Error(`FAILED: ${label}`);
  console.log(`ok — ${label}`);
}

async function main() {
  await connectDb();

  const teacher = await User.findOne({
    role: "faculty",
    profileCompleted: true,
    "profile.name": { $exists: true, $ne: "" },
  });
  const parent = await User.findOne({
    role: "parent",
    profileCompleted: true,
    "parentProfile.name": { $exists: true, $ne: "" },
  });
  if (!teacher || !parent) {
    throw new Error("Need one completed faculty and one completed parent in the DB");
  }
  const tid = teacher._id.toString();
  const pid = parent._id.toString();
  console.log(`teacher: ${teacher.profile!.name} (${tid})`);
  console.log(`parent:  ${parent.parentProfile!.name} (${pid})`);

  // Clean slate for this pair
  await Connection.deleteMany({ parent: pid, teacher: tid });

  const parentToken = signAuthToken(pid, parent.email, "parent");
  const teacherToken = signAuthToken(tid, teacher.email, "faculty");

  // 1. Phone hidden before any connection
  let r = await call(`/teachers/${tid}`, parentToken);
  assert(r.status === 200, "teacher detail loads for parent");
  assert(r.body.teacher.phone === null, "phone hidden before connection");
  assert(r.body.teacher.connectionStatus === "none", "status none initially");

  // 2. Message is compulsory
  r = await call("/connections", parentToken, {
    method: "POST",
    body: JSON.stringify({ teacherId: tid, message: "hi" }),
  });
  assert(r.status === 400, "too-short message rejected");

  // 3. Send a proper request
  r = await call("/connections", parentToken, {
    method: "POST",
    body: JSON.stringify({
      teacherId: tid,
      message: "Looking for Physics classes for my son in Class 9, weekends.",
    }),
  });
  assert(r.status === 201, "request created");
  const connId = r.body.connection.id as string;

  // 4. Duplicate pending blocked
  r = await call("/connections", parentToken, {
    method: "POST",
    body: JSON.stringify({ teacherId: tid, message: "another try here ok" }),
  });
  assert(r.status === 409 && r.body.code === "ALREADY_PENDING", "duplicate pending blocked");

  // 5. Teacher can't send requests
  r = await call("/connections", teacherToken, {
    method: "POST",
    body: JSON.stringify({ teacherId: tid, message: "faculty cannot do this" }),
  });
  assert(r.status === 403, "faculty cannot send requests");

  // 6. Status pending for parent, phone still hidden
  r = await call(`/teachers/${tid}`, parentToken);
  assert(r.body.teacher.connectionStatus === "pending", "status pending after send");
  assert(r.body.teacher.phone === null, "phone still hidden while pending");

  // 7. Teacher inbox shows it
  r = await call("/connections/requests", teacherToken);
  assert(r.status === 200 && r.body.pendingCount >= 1, "teacher sees pending request");

  // 8. Parent cannot respond
  r = await call(`/connections/${connId}/respond`, parentToken, {
    method: "POST",
    body: JSON.stringify({ action: "accept" }),
  });
  assert(r.status === 403, "parent cannot accept their own request");

  // 9. Teacher accepts
  r = await call(`/connections/${connId}/respond`, teacherToken, {
    method: "POST",
    body: JSON.stringify({ action: "accept" }),
  });
  assert(r.status === 200 && r.body.request.status === "accepted", "teacher accepts");

  // 10. Phone now visible to this parent only
  r = await call(`/teachers/${tid}`, parentToken);
  assert(r.body.teacher.connectionStatus === "accepted", "status accepted");
  assert(typeof r.body.teacher.phone === "string" && r.body.teacher.phone.length >= 10, "phone visible after accept");

  // 11. Parent history includes phone
  r = await call("/connections/mine", parentToken);
  const mine = r.body.connections.find((c: any) => c.id === connId);
  assert(mine?.status === "accepted" && mine?.phone, "parent history has accepted + phone");

  // 12. Double-respond blocked
  r = await call(`/connections/${connId}/respond`, teacherToken, {
    method: "POST",
    body: JSON.stringify({ action: "decline" }),
  });
  assert(r.status === 409, "already-handled request cannot be re-responded");

  // Clean up the test connection
  await Connection.deleteMany({ parent: pid, teacher: tid });
  console.log("\nAll connection-flow checks passed.");
}

main()
  .catch((err) => {
    console.error(err.message || err);
    process.exitCode = 1;
  })
  .finally(() => disconnectDb());
