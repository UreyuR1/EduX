import { NextRequest, NextResponse } from "next/server";
import { getPerformanceForParent } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get("parentId");

  if (!parentId) {
    return NextResponse.json({ error: "parentId required" }, { status: 400 });
  }

  const notes = getPerformanceForParent(parentId, courseId);
  return NextResponse.json(notes);
}
