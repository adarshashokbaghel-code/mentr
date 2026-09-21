import { NextResponse } from "next/server";

/** Lightweight health check outside the Pages Express catch-all. */
export async function GET() {
  return NextResponse.json({ status: "ok", service: "champs-api" });
}
