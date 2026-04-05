/**
 * Mock data loader for API routes.
 * In production, these would query PostgreSQL via Prisma.
 * For hackathon MVP, we load directly from JSON files.
 */

import fs from "fs";
import path from "path";

const MOCK_DIR = path.resolve(process.cwd(), "../../mock-data");

function loadJSON<T>(filename: string): T {
  const filepath = path.join(MOCK_DIR, filename);
  return JSON.parse(fs.readFileSync(filepath, "utf-8")) as T;
}

function loadSyllabus(filename: string): string {
  return fs.readFileSync(path.join(MOCK_DIR, "syllabus", filename), "utf-8");
}

// Types matching the JSON structure
interface RawCourse {
  id: string;
  name: string;
  yearLevel: string;
  subject: string;
  currentWeek: number;
  totalWeeks: number;
  teacherId: string;
  syllabusFile: string;
}

interface RawUser {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
}

interface RawStudent {
  id: string;
  name: string;
  parentId: string;
}

interface RawEnrollment {
  studentId: string;
  courseId: string;
}

interface RawPerformanceNote {
  studentId: string;
  courseId: string;
  label: string;
  details: string | null;
}

interface RawWeeklyFocus {
  courseId: string;
  weekNumber: number;
  topic: string;
  activity: string;
  source: string;
}

interface RawFeedback {
  id: string;
  type: string;
  value: string;
  tags: string[];
  sentiment: string;
  parentId: string;
  courseId: string;
}

interface RawInsight {
  id: string;
  courseId: string;
  dataPoint: string;
  therefore: string;
  suggestion: string;
  status: string;
}

// Cached data
let _cache: Record<string, unknown> = {};

function cached<T>(key: string, loader: () => T): T {
  if (!_cache[key]) {
    _cache[key] = loader();
  }
  return _cache[key] as T;
}

export function getUsers() {
  return cached("users", () => loadJSON<RawUser[]>("users.json"));
}

export function getStudents() {
  return cached("students", () => loadJSON<RawStudent[]>("students.json"));
}

export function getEnrollments() {
  return cached("enrollments", () => loadJSON<RawEnrollment[]>("enrollments.json"));
}

export function getCourses() {
  const raw = cached("courses", () => loadJSON<RawCourse[]>("courses.json"));
  const users = getUsers();

  return raw.map((c) => {
    const teacher = users.find((u) => u.id === c.teacherId);
    const syllabusRaw = loadSyllabus(c.syllabusFile);
    const syllabusPlain = syllabusRaw
      .replace(/^#+\s/gm, "")
      .replace(/\*\*/g, "")
      .replace(/---/g, "");

    return {
      id: c.id,
      name: c.name,
      yearLevel: c.yearLevel,
      subject: c.subject,
      currentWeek: c.currentWeek,
      totalWeeks: c.totalWeeks,
      teacherId: c.teacherId,
      teacherName: teacher?.name || "",
      syllabusPlain,
    };
  });
}

export function getCoursesForParent(parentId: string) {
  const students = getStudents().filter((s) => s.parentId === parentId);
  const studentIds = students.map((s) => s.id);
  const enrollments = getEnrollments().filter((e) =>
    studentIds.includes(e.studentId)
  );
  const courseIds = [...new Set(enrollments.map((e) => e.courseId))];
  return getCourses().filter((c) => courseIds.includes(c.id));
}

export function getCoursesForTeacher(teacherId: string) {
  return getCourses().filter((c) => c.teacherId === teacherId);
}

export function getPerformanceNotes() {
  return cached("perfNotes", () =>
    loadJSON<RawPerformanceNote[]>("performance-notes.json")
  );
}

export function getPerformanceForStudent(studentId: string, courseId: string) {
  return getPerformanceNotes().find(
    (p) => p.studentId === studentId && p.courseId === courseId
  );
}

export function getPerformanceForParent(parentId: string, courseId: string) {
  const students = getStudents().filter((s) => s.parentId === parentId);
  return students
    .map((s) => ({
      studentName: s.name,
      ...getPerformanceForStudent(s.id, courseId),
    }))
    .filter((p) => p.label);
}

export function getWeeklyFocuses() {
  return cached("weeklyFocuses", () =>
    loadJSON<RawWeeklyFocus[]>("weekly-focuses.json")
  );
}

export function getWeeklyFocus(courseId: string) {
  const course = getCourses().find((c) => c.id === courseId);
  if (!course) return null;
  return (
    getWeeklyFocuses().find(
      (f) => f.courseId === courseId && f.weekNumber === course.currentWeek
    ) || null
  );
}

export function getFeedback() {
  return cached("feedback", () => loadJSON<RawFeedback[]>("feedback.json"));
}

export function getFeedbackForCourse(courseId: string) {
  return getFeedback().filter((f) => f.courseId === courseId);
}

export function getInsights() {
  return cached("insights", () => loadJSON<RawInsight[]>("insights.json"));
}

export function getInsightsForCourse(courseId: string) {
  return getInsights().filter((i) => i.courseId === courseId);
}

export function getStudentsNeedingAttention(courseId: string) {
  const enrollments = getEnrollments().filter((e) => e.courseId === courseId);
  const students = getStudents();
  const perfNotes = getPerformanceNotes();
  const feedback = getFeedbackForCourse(courseId);

  return enrollments
    .map((e) => {
      const student = students.find((s) => s.id === e.studentId);
      const perf = perfNotes.find(
        (p) => p.studentId === e.studentId && p.courseId === courseId
      );
      const parentFeedback = feedback.filter(
        (f) =>
          f.parentId === student?.parentId &&
          f.sentiment === "negative"
      );

      const flags: string[] = [];
      if (perf?.label.includes("extra attention")) {
        flags.push(perf.label);
      }
      if (parentFeedback.length >= 2) {
        flags.push("Multiple parent concerns reported");
      }

      return {
        id: e.studentId,
        name: student?.name || "",
        flags,
        courseId,
      };
    })
    .filter((s) => s.flags.length > 0);
}

export function getFeedbackAggregate(courseId: string) {
  const feedback = getFeedbackForCourse(courseId);
  const completionFeedback = feedback.filter((f) => f.type === "completion");
  const doneCount = completionFeedback.filter((f) => f.value === "Done").length;
  const completionRate =
    completionFeedback.length > 0 ? doneCount / completionFeedback.length : 0;

  // Tag frequency — only count tags from negative/neutral feedback to surface difficulty topics
  const tagCounts: Record<string, number> = {};
  for (const f of feedback.filter((f) => f.sentiment !== "positive")) {
    for (const tag of f.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // Sentiment
  const sentimentDistribution = { positive: 0, neutral: 0, negative: 0 };
  for (const f of feedback) {
    if (f.sentiment in sentimentDistribution) {
      sentimentDistribution[f.sentiment as keyof typeof sentimentDistribution]++;
    }
  }

  return {
    courseId,
    completionRate,
    topTags,
    sentimentDistribution,
  };
}
