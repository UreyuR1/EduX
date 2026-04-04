import { NextResponse } from "next/server";
import { getWeeklyFocus } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  const focus = getWeeklyFocus(courseId);

  if (!focus) {
    return NextResponse.json({ error: "No weekly focus found" }, { status: 404 });
  }

  return NextResponse.json(focus);
}
