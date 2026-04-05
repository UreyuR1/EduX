import { NextResponse } from "next/server";
import { getWeeklyFocus } from "@/lib/mock-data";
import { publishedMessages } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;

  // Teacher-published messages take priority over mock data
  const published = publishedMessages.get(courseId);
  if (published) {
    return NextResponse.json({
      id: `published-${courseId}`,
      courseId,
      weekNumber: 0,
      topic: published.topic,
      activity: published.activity,
      source: "teacher" as const,
    });
  }

  const focus = getWeeklyFocus(courseId);
  if (!focus) {
    return NextResponse.json({ error: "No weekly focus found" }, { status: 404 });
  }

  return NextResponse.json(focus);
}
