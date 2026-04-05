"use client";

import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FeedbackOverview } from "@/components/teacher/FeedbackOverview";
import { InsightCard } from "@/components/teacher/InsightCard";
import { AttentionList } from "@/components/teacher/AttentionList";
import { MessageComposer } from "@/components/teacher/MessageComposer";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { getCurrentUser } from "@/lib/auth";
import { useChat } from "@/hooks/useChat";
import type { Course, FeedbackAggregate, Insight, StudentAttention } from "@/lib/types";

function buildProactiveGreeting(courseName: string, insights: Insight[]): string {
  const newInsights = insights.filter((i) => i.status === "NEW");
  if (newInsights.length === 0) {
    return `Hi! I'm your Data Analysis Assistant for **${courseName}**. Ask me to summarise parent feedback, identify students needing support, or draft a message to parents.`;
  }
  const top = newInsights[0];
  return `Hi! I noticed **${newInsights.length} unactioned insight${newInsights.length > 1 ? "s" : ""}** for **${courseName}**:\n\n**Data:** ${top.dataPoint}\n**Therefore:** ${top.therefore}\n**Suggestion:** ${top.suggestion}\n\nWould you like me to draft a parent message, or dig deeper into the feedback data?`;
}

export default function TeacherDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [aggregate, setAggregate] = useState<FeedbackAggregate | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [attentionStudents, setAttentionStudents] = useState<StudentAttention[]>([]);
  const [loading, setLoading] = useState(true);
  const [composingInsight, setComposingInsight] = useState<Insight | null>(null);
  const proactiveInjectedRef = useRef<string>("");

  const { messages, isLoading: chatLoading, streamingContent, sendMessage, resetMessages } = useChat({
    endpoint: "/api/chat",
    courseId: selectedCourseId || undefined,
    language: "en",
    chatType: "teacher",
  });

  // Load courses for a given teacher user
  const loadCourses = (userId: string) => {
    setLoading(true);
    proactiveInjectedRef.current = "";
    fetch(`/api/courses?userId=${userId}&role=TEACHER`)
      .then((r) => r.json())
      .then((data: Course[]) => {
        setCourses(data);
        setSelectedCourseId(data.length > 0 ? data[0].id : null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Initial load + user-switch listener
  useEffect(() => {
    const u = getCurrentUser();
    loadCourses(u.id);

    const handler = (e: Event) => {
      const newUser = (e as CustomEvent).detail;
      loadCourses(newUser.id);
    };
    window.addEventListener("edux-user-changed", handler);
    return () => window.removeEventListener("edux-user-changed", handler);
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

  // Inject proactive greeting when course changes
  useEffect(() => {
    if (!selectedCourseId || proactiveInjectedRef.current === selectedCourseId) return;
    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) return;

    fetch(`/api/insights?courseId=${selectedCourseId}`)
      .then((r) => r.json())
      .then((ins: Insight[]) => {
        proactiveInjectedRef.current = selectedCourseId;
        resetMessages([
          {
            id: `greeting-${selectedCourseId}`,
            role: "assistant",
            content: buildProactiveGreeting(course.name, ins),
          },
        ]);
      })
      .catch(console.error);
  }, [selectedCourseId, courses, resetMessages]);

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
        <div className="w-px bg-border" />
        <div className="w-[400px] p-3">
          <Skeleton className="h-full" />
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
    <div className="flex h-full">
      {/* ── Left: Dashboard ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 min-w-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Parent feedback and class insights</p>
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
              <div className="space-y-5 mt-4">
                {/* Top row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FeedbackOverview aggregate={aggregate} />
                  <AttentionList students={attentionStudents} />
                </div>

                {/* Insights */}
                {insights.length > 0 && (
                  <div>
                    <h2 className="text-base font-semibold mb-3">AI Insights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* ── Divider ── */}
      <div className="w-px bg-border shrink-0" />

      {/* ── Right: Chat ── */}
      <div className="w-[400px] shrink-0 flex flex-col bg-card">
        {/* Chat panel header */}
        <div className="px-4 py-3 border-b bg-primary/8 shrink-0">
          <p className="text-sm font-semibold text-primary">💬 AI Data Assistant</p>
          {courses.length > 1 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCourseId === course.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {course.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 min-h-0 p-3">
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            isLoading={chatLoading}
            streamingContent={streamingContent}
            placeholder="Ask about parent feedback, class trends, or draft a message…"
            userAvatar={getCurrentUser().name.slice(0, 2)}
          />
        </div>
      </div>
    </div>
  );
}
