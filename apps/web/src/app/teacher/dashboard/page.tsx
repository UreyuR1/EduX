"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FeedbackOverview } from "@/components/teacher/FeedbackOverview";
import { InsightCard } from "@/components/teacher/InsightCard";
import { AttentionList } from "@/components/teacher/AttentionList";
import { MessageComposer } from "@/components/teacher/MessageComposer";
import { getCurrentUser } from "@/lib/auth";
import type { Course, FeedbackAggregate, Insight, StudentAttention } from "@/lib/types";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [aggregate, setAggregate] = useState<FeedbackAggregate | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [attentionStudents, setAttentionStudents] = useState<StudentAttention[]>([]);
  const [loading, setLoading] = useState(true);
  const [composingInsight, setComposingInsight] = useState<Insight | null>(null);

  // Load courses for current teacher
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    fetch(`/api/courses?userId=${user.id}&role=TEACHER`)
      .then((r) => r.json())
      .then((data: Course[]) => {
        setCourses(data);
        if (data.length > 0) setSelectedCourseId(data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Load course-specific data when selection changes
  useEffect(() => {
    if (!selectedCourseId) return;

    setAggregate(null);
    setInsights([]);
    setAttentionStudents([]);

    Promise.all([
      fetch(`/api/feedback/aggregate?courseId=${selectedCourseId}`).then((r) => r.json()),
      fetch(`/api/insights?courseId=${selectedCourseId}`).then((r) => r.json()),
      fetch(`/api/students/attention?courseId=${selectedCourseId}`).then((r) => r.json()),
    ])
      .then(([agg, ins, att]) => {
        setAggregate(agg);
        setInsights(ins);
        setAttentionStudents(att);
      })
      .catch(console.error);
  }, [selectedCourseId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No courses found for your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Parent feedback and class insights
        </p>
      </div>

      <Tabs
        value={selectedCourseId ?? undefined}
        onValueChange={setSelectedCourseId}
      >
        <TabsList>
          {courses.map((course) => (
            <TabsTrigger key={course.id} value={course.id}>
              {course.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {courses.map((course) => (
          <TabsContent key={course.id} value={course.id}>
            <div className="space-y-6 mt-4">
              {/* Top row: overview + attention list */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FeedbackOverview aggregate={aggregate} />
                <AttentionList students={attentionStudents} />
              </div>

              {/* Insights */}
              {insights.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold mb-3">AI Insights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {insights.map((insight) => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        onDraftMessage={setComposingInsight}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <MessageComposer
        insight={composingInsight}
        courseId={selectedCourseId ?? ""}
        courseName={courses.find((c) => c.id === selectedCourseId)?.name ?? ""}
        onClose={() => setComposingInsight(null)}
      />
    </div>
  );
}
