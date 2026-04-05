"use client";

import { useState, useEffect, useRef } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { getCurrentUser, type MockUser } from "@/lib/auth";
import { useChat } from "@/hooks/useChat";
import type { Course, Insight } from "@/lib/types";

function buildProactiveGreeting(courseName: string, insights: Insight[]): string {
  const newInsights = insights.filter((i) => i.status === "NEW");
  if (newInsights.length === 0) {
    return `Hi! I'm your Data Analysis Assistant for **${courseName}**. You can ask me to summarise parent feedback, identify students who may need support, or draft a message to parents.`;
  }
  const top = newInsights[0];
  return `Hi! I noticed **${newInsights.length} unactioned insight${newInsights.length > 1 ? "s" : ""}** for **${courseName}**:\n\n**Data:** ${top.dataPoint}\n**Therefore:** ${top.therefore}\n**Suggestion:** ${top.suggestion}\n\nWould you like me to draft a parent message, or dig deeper into the feedback data?`;
}

export default function TeacherChat() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const proactiveInjectedRef = useRef<string>(""); // tracks which course already got its greeting

  const { messages, isLoading, streamingContent, sendMessage, resetMessages } = useChat({
    endpoint: "/api/chat",
    courseId: selectedCourseId || undefined,
    language: "en",
    chatType: "teacher",
  });

  // Load user
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Load teacher's courses
  useEffect(() => {
    if (!user) return;
    fetch(`/api/courses?userId=${user.id}&role=TEACHER`)
      .then((r) => r.json())
      .then((data: Course[]) => {
        setCourses(data);
        if (data.length > 0) setSelectedCourseId(data[0].id);
      })
      .catch(console.error);
  }, [user]);

  // When course changes: load insights and inject proactive greeting
  useEffect(() => {
    if (!selectedCourseId || proactiveInjectedRef.current === selectedCourseId) return;

    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) return;

    Promise.all([
      fetch(`/api/insights?courseId=${selectedCourseId}`).then((r) => r.json()),
    ]).then(([insights]: [Insight[]]) => {
      const greeting = buildProactiveGreeting(course.name, insights);
      proactiveInjectedRef.current = selectedCourseId;
      resetMessages([
        {
          id: `assistant-greeting-${selectedCourseId}`,
          role: "assistant",
          content: greeting,
        },
      ]);
    }).catch(console.error);
  }, [selectedCourseId, courses, resetMessages]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-full max-w-3xl">
      {/* Course selector */}
      {courses.length > 1 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCourseId === course.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {course.name}
            </button>
          ))}
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 min-h-0">
        <ChatWindow
          messages={messages}
          onSend={sendMessage}
          isLoading={isLoading}
          streamingContent={streamingContent}
          placeholder="Ask about parent feedback, class trends, or draft a parent message…"
          userAvatar={user.name.slice(0, 2)}
        />
      </div>
    </div>
  );
}
