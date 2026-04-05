import { NextRequest, NextResponse } from "next/server";
import { publishedMessages } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { courseId, content }: { courseId: string; content: string } = body;

  if (!courseId || !content) {
    return NextResponse.json({ error: "courseId and content required" }, { status: 400 });
  }

  // Extract topic: skip greeting lines (Dear/Hi/Hello), take first substantive sentence
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  const greetingPattern = /^(dear|hi|hello|g'day)/i;
  const substantiveLine = lines.find((l) => !greetingPattern.test(l)) ?? lines[0] ?? "Teacher Update";
  const firstSentence = substantiveLine.split(/[.!?]/)[0]?.trim() ?? substantiveLine;
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
