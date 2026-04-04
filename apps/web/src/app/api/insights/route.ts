import { NextRequest, NextResponse } from "next/server";
import { getInsightsForCourse } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }

  const insights = getInsightsForCourse(courseId);
  return NextResponse.json(insights);
}
