"use client";

import { useEffect, useState } from "react";
import { useResizablePanel } from "@/hooks/useResizablePanel";
import { CourseCard } from "@/components/parent/CourseCard";
import { WeeklyFocus } from "@/components/parent/WeeklyFocus";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { FeedbackPrompt } from "@/components/parent/FeedbackPrompt";
import { getCurrentUser, type MockUser } from "@/lib/auth";
import { useChat } from "@/hooks/useChat";
import { t } from "@/lib/i18n";
import { seedDemoChatHistory } from "@/lib/demo-chat-history";
import type { Course, PerformanceNote, WeeklyFocus as WeeklyFocusType } from "@/lib/types";

export default function ParentDashboard() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [performances, setPerformances] = useState<Record<string, PerformanceNote[]>>({});
  const [weeklyFocuses, setWeeklyFocuses] = useState<Record<string, WeeklyFocusType>>({});
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackDismissed, setFeedbackDismissed] = useState(false);
  const [language, setLanguage] = useState("en");

  const { messages, isLoading: chatLoading, streamingContent, sendMessage, exchangeCount } = useChat({
    endpoint: "/api/chat",
    courseId: selectedCourseId || undefined,
    language,
  });

  useEffect(() => {
    if (exchangeCount >= 2 && !feedbackDismissed) setShowFeedback(true);
  }, [exchangeCount, feedbackDismissed]);

  useEffect(() => {
    // Seed demo chat histories on first load
    seedDemoChatHistory();

    async function loadData(u: MockUser) {
      if (u.role !== "PARENT") return;
      setLoading(true);
      setExpandedCourse(null);
      try {
        const coursesRes = await fetch(`/api/courses?userId=${u.id}&role=PARENT`);
        const coursesData: Course[] = await coursesRes.json();
        setCourses(coursesData);
        if (coursesData.length > 0) setSelectedCourseId(coursesData[0].id);

        const perfMap: Record<string, PerformanceNote[]> = {};
        const focusMap: Record<string, WeeklyFocusType> = {};
        await Promise.all(
          coursesData.map(async (course) => {
            const perfRes = await fetch(`/api/courses/${course.id}/performance?parentId=${u.id}`);
            perfMap[course.id] = await perfRes.json();
            const focusRes = await fetch(`/api/courses/${course.id}/weekly-focus`);
            if (focusRes.ok) focusMap[course.id] = await focusRes.json();
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

    const u = getCurrentUser();
    setUser(u);
    setLanguage(u.language);
    loadData(u);

    const userHandler = (e: Event) => {
      const newUser = (e as CustomEvent).detail as MockUser;
      setUser(newUser);
      setLanguage(newUser.language);
      setFeedbackDismissed(false);
      setShowFeedback(false);
      loadData(newUser);
    };
    const langHandler = (e: Event) => setLanguage((e as CustomEvent).detail);

    window.addEventListener("edux-user-changed", userHandler);
    window.addEventListener("edux-language-changed", langHandler);
    return () => {
      window.removeEventListener("edux-user-changed", userHandler);
      window.removeEventListener("edux-language-changed", langHandler);
    };
  }, []);

  const { chatWidth, onMouseDown } = useResizablePanel({ defaultWidth: 400, minWidth: 400, maxRatio: 0.5 });

  if (!user) return null;

  return (
    <div className="flex h-full">
      {/* ── Left: Dashboard ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-w-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("parent.dashboard.title", language)}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("parent.dashboard.subtitle", language)}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-44" />)}
          </div>
        ) : (
          <>
            {/* Weekly Focus */}
            {Object.keys(weeklyFocuses).length > 0 && (
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-foreground">
                  🎯 {t("parent.dashboard.thisWeek", language)}
                </h2>
                <div className="space-y-3">
                  {Object.entries(weeklyFocuses).map(([courseId, focus]) => {
                    const course = courses.find((c) => c.id === courseId);
                    return (
                      <WeeklyFocus
                        key={courseId}
                        focus={focus}
                        courseName={course?.name || ""}
                        language={language}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Courses */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                📚 {t("parent.courses", language)}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {courses.map((course) => {
                  const perfNotes = performances[course.id] || [];
                  const firstPerf = perfNotes[0] as PerformanceNote | undefined;
                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      performance={firstPerf}
                      expanded={expandedCourse === course.id}
                      language={language}
                      onToggle={() =>
                        setExpandedCourse(expandedCourse === course.id ? null : course.id)
                      }
                    />
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>

      {/* ── Drag handle ── */}
      <div
        onMouseDown={onMouseDown}
        className="w-1.5 shrink-0 cursor-col-resize bg-border hover:bg-primary/40 transition-colors group relative"
        title="Drag to resize"
      >
        {/* Visual grip dots */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col gap-1 opacity-40 group-hover:opacity-80 transition-opacity">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-primary" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Chat ── */}
      <div className="shrink-0 flex flex-col bg-card overflow-hidden" style={{ width: chatWidth }}>
        {/* Chat panel header */}
        <div className="px-4 py-3 border-b bg-primary/8 shrink-0">
          <p className="text-sm font-semibold text-primary">
            💬 {t("parent.dashboard.chatTitle", language)}
          </p>
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
                  {course.syllabusCode
                    ? `${course.name} (${course.syllabusCode})`
                    : course.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-3">
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            isLoading={chatLoading}
            streamingContent={streamingContent}
            placeholder={t("parent.chat.placeholder", language)}
            emptyState={t("chat.emptyState", language)}
            userAvatar={user.name.slice(0, 2)}
          >
            {showFeedback && selectedCourseId && (
              <FeedbackPrompt
                courseId={selectedCourseId}
                parentId={user.id}
                language={language}
                onDismiss={() => {
                  setShowFeedback(false);
                  setFeedbackDismissed(true);
                }}
              />
            )}
          </ChatWindow>
        </div>
      </div>
    </div>
  );
}
