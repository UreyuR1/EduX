"use client";

import { useEffect, useState, useMemo } from "react";
import { CourseCard } from "@/components/parent/CourseCard";
import { WeeklyFocus } from "@/components/parent/WeeklyFocus";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { FeedbackPrompt } from "@/components/parent/FeedbackPrompt";
import { getCurrentUser, type MockUser } from "@/lib/auth";
import { useChat } from "@/hooks/useChat";
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

  const placeholder = useMemo(
    () => language === "zh" ? "询问有关孩子学习的问题..." : "Ask about your child's learning...",
    [language]
  );

  if (!user) return null;

  return (
    <div className="flex h-full">
      {/* ── Left: Dashboard ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-w-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === "zh" ? "学习概览" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === "zh" ? "孩子的学习情况" : "Your child's learning overview"}
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
                  🎯 {language === "zh" ? "本周学习重点" : "This Week"}
                </h2>
                <div className="space-y-3">
                  {Object.entries(weeklyFocuses).map(([courseId, focus]) => {
                    const course = courses.find((c) => c.id === courseId);
                    return (
                      <WeeklyFocus key={courseId} focus={focus} courseName={course?.name || ""} />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Courses */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                📚 {language === "zh" ? "课程" : "Courses"}
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

      {/* ── Divider ── */}
      <div className="w-px bg-border shrink-0" />

      {/* ── Right: Chat ── */}
      <div className="w-[400px] shrink-0 flex flex-col bg-card">
        {/* Chat panel header */}
        <div className="px-4 py-3 border-b bg-primary/8 shrink-0">
          <p className="text-sm font-semibold text-primary">
            💬 {language === "zh" ? "AI 学习助手" : "AI Learning Assistant"}
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
            placeholder={placeholder}
            userAvatar={user.name.slice(0, 2)}
          >
            {showFeedback && selectedCourseId && (
              <FeedbackPrompt
                courseId={selectedCourseId}
                parentId={user.id}
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
