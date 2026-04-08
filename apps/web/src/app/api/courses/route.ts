import { NextRequest, NextResponse } from "next/server";
import { getCoursesForParent, getCoursesForTeacher } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const role = searchParams.get("role");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const courses =
    role === "TEACHER"
      ? getCoursesForTeacher(userId)
      : getCoursesForParent(userId);

  return NextResponse.json(courses);
}
