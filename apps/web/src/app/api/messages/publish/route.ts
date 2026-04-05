import { NextRequest, NextResponse } from "next/server";
import { publishedMessages } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { courseId, content }: { courseId: string; content: string } = body;

  if (!courseId || !content) {
    return NextResponse.json({ error: "courseId and content required" }, { status: 400 });
  }

  // Extract a short topic from first sentence of the message
  const firstSentence = content.split(/[.\n]/)[0]?.trim() ?? "Teacher Update";
  const topic = firstSentence.length > 80 ? firstSentence.slice(0, 77) + "…" : firstSentence;

  publishedMessages.set(courseId, {
    courseId,
    topic,
    activity: content,
    publishedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, publishedAt: new Date().toISOString() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  if (!courseId) return NextResponse.json(null);
  return NextResponse.json(publishedMessages.get(courseId) ?? null);
}
