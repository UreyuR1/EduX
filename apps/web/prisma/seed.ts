import { PrismaClient } from "../src/generated/prisma";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const MOCK_DIR = path.resolve(__dirname, "../../../mock-data");

function loadJSON(filename: string) {
  return JSON.parse(fs.readFileSync(path.join(MOCK_DIR, filename), "utf-8"));
}

function loadSyllabus(filename: string): string {
  return fs.readFileSync(
    path.join(MOCK_DIR, "syllabus", filename),
    "utf-8"
  );
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.insight.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.weeklyFocus.deleteMany();
  await prisma.performanceNote.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  console.log("  Cleared existing data");

  // 1. School
  const school = loadJSON("school.json");
  await prisma.school.create({ data: school });
  console.log("  ✓ School created");

  // 2. Users
  const users = loadJSON("users.json");
  for (const user of users) {
    await prisma.user.create({
      data: { ...user, schoolId: school.id },
    });
  }
  console.log(`  ✓ ${users.length} users created`);

  // 3. Students
  const students = loadJSON("students.json");
  for (const student of students) {
    await prisma.student.create({
      data: { ...student, schoolId: school.id },
    });
  }
  console.log(`  ✓ ${students.length} students created`);

  // 4. Courses
  const courses = loadJSON("courses.json");
  for (const course of courses) {
    const syllabusRaw = loadSyllabus(course.syllabusFile);
    // For MVP, syllabusPlain is a simplified version (would be LLM-generated in production)
    const syllabusPlain = syllabusRaw
      .replace(/^#+\s/gm, "")
      .replace(/\*\*/g, "")
      .replace(/---/g, "");

    await prisma.course.create({
      data: {
        id: course.id,
        name: course.name,
        yearLevel: course.yearLevel,
        subject: course.subject,
        currentWeek: course.currentWeek,
        totalWeeks: course.totalWeeks,
        teacherId: course.teacherId,
        schoolId: school.id,
        syllabusRaw,
        syllabusPlain,
      },
    });
  }
  console.log(`  ✓ ${courses.length} courses created`);

  // 5. Enrollments
  const enrollments = loadJSON("enrollments.json");
  for (let i = 0; i < enrollments.length; i++) {
    await prisma.enrollment.create({
      data: {
        id: `enrollment-${i + 1}`,
        ...enrollments[i],
      },
    });
  }
  console.log(`  ✓ ${enrollments.length} enrollments created`);

  // 6. Performance Notes
  const perfNotes = loadJSON("performance-notes.json");
  for (let i = 0; i < perfNotes.length; i++) {
    await prisma.performanceNote.create({
      data: {
        id: `perf-${i + 1}`,
        ...perfNotes[i],
      },
    });
  }
  console.log(`  ✓ ${perfNotes.length} performance notes created`);

  // 7. Weekly Focuses
  const focuses = loadJSON("weekly-focuses.json");
  for (let i = 0; i < focuses.length; i++) {
    await prisma.weeklyFocus.create({
      data: {
        id: `focus-${i + 1}`,
        ...focuses[i],
      },
    });
  }
  console.log(`  ✓ ${focuses.length} weekly focuses created`);

  // 8. Feedback
  const feedbacks = loadJSON("feedback.json");
  for (const fb of feedbacks) {
    await prisma.feedback.create({ data: fb });
  }
  console.log(`  ✓ ${feedbacks.length} feedback entries created`);

  // 9. Insights
  const insights = loadJSON("insights.json");
  for (const insight of insights) {
    await prisma.insight.create({ data: insight });
  }
  console.log(`  ✓ ${insights.length} insights created`);

  console.log("\n✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
