"use client";

import { useEffect, useState } from "react";
import { CourseCard } from "@/components/parent/CourseCard";
import { WeeklyFocus } from "@/components/parent/WeeklyFocus";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth";
import type { Course, PerformanceNote, WeeklyFocus as WeeklyFocusType } from "@/lib/types";

export default function ParentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [performances, setPerformances] = useState<Record<string, PerformanceNote[]>>({});
  const [weeklyFocuses, setWeeklyFocuses] = useState<Record<string, WeeklyFocusType>>({});
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user.role !== "PARENT") return;

    async function loadData() {
      try {
        // Fetch courses
        const coursesRes = await fetch(
          `/api/courses?userId=${user.id}&role=PARENT`
        );
        const coursesData: Course[] = await coursesRes.json();
        setCourses(coursesData);

        // Fetch performance and weekly focus for each course
        const perfMap: Record<string, PerformanceNote[]> = {};
        const focusMap: Record<string, WeeklyFocusType> = {};

        await Promise.all(
          coursesData.map(async (course) => {
            // Performance
            const perfRes = await fetch(
              `/api/courses/${course.id}/performance?parentId=${user.id}`
            );
            perfMap[course.id] = await perfRes.json();

            // Weekly focus
            const focusRes = await fetch(
              `/api/courses/${course.id}/weekly-focus`
            );
            if (focusRes.ok) {
              focusMap[course.id] = await focusRes.json();
            }
          })
        );

        setPerformances(perfMap);
        setWeeklyFocuses(focusMap);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Your child&apos;s learning overview
        </p>
      </div>

      {/* Weekly Learning Focus */}
      {Object.entries(weeklyFocuses).length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">🎯 This Week</h2>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(weeklyFocuses).map(([courseId, focus]) => {
              const course = courses.find((c) => c.id === courseId);
              return (
                <WeeklyFocus
                  key={courseId}
                  focus={focus}
                  courseName={course?.name || ""}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Courses */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">📚 Courses</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {courses.map((course) => {
            const perfNotes = performances[course.id] || [];
            const firstPerf = perfNotes[0] as PerformanceNote | undefined;

            return (
              <CourseCard
                key={course.id}
                course={course}
                performance={firstPerf}
                expanded={expandedCourse === course.id}
                onToggle={() =>
                  setExpandedCourse(
                    expandedCourse === course.id ? null : course.id
                  )
                }
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
