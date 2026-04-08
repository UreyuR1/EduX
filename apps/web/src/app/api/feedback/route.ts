import { NextRequest, NextResponse } from "next/server";

// In-memory feedback storage for MVP (would be PostgreSQL in production)
const feedbackStore: Array<{
  id: string;
  type: string;
  value: string;
  courseId: string;
  parentId: string;
  createdAt: string;
}> = [];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, value, courseId, parentId } = body;

  if (!type || !value || !courseId || !parentId) {
    return NextResponse.json(
      { error: "type, value, courseId, and parentId are required" },
      { status: 400 }
    );
  }

  const feedback = {
    id: `fb-live-${Date.now()}`,
    type,
    value,
    courseId,
    parentId,
    createdAt: new Date().toISOString(),
  };

  feedbackStore.push(feedback);
  console.log("📝 Feedback received:", feedback);

  return NextResponse.json(feedback, { status: 201 });
}

export async function GET() {
  return NextResponse.json(feedbackStore);
}
