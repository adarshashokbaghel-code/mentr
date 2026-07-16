import { loadPublicTeacherById } from "../../../../../../server/public-teacher";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const teacher = await loadPublicTeacherById(id);
  if (!teacher) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }
  return NextResponse.json({ teacher });
}
