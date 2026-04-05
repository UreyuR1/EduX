import { getCourses, getWeeklyFocus } from "@/lib/mock-data";

export async function GET() {
  try {
    const courses = getCourses();
    const focus = getWeeklyFocus("course-1");
    return Response.json({
      courseCount: courses.length,
      courseIds: courses.map(c => c.id),
      firstCourseName: courses[0]?.name,
      syllabusLength: courses[0]?.syllabusPlain?.length,
      focus,
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
