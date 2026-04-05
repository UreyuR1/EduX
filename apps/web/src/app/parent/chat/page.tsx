"use client";

import { useState, useEffect, useMemo } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { FeedbackPrompt } from "@/components/parent/FeedbackPrompt";
import { getCurrentUser, type MockUser } from "@/lib/auth";
import { useChat } from "@/hooks/useChat";
import type { Course } from "@/lib/types";

export default function ParentChat() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackDismissed, setFeedbackDismissed] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const language = user?.language || "en";

  const { messages, isLoading, streamingContent, sendMessage, exchangeCount } =
    useChat({
      endpoint: "/api/chat",
      courseId: selectedCourseId || undefined,
      language,
    });

  // Load courses on mount
  useEffect(() => {
    if (!user) return;
    async function loadCourses() {
      try {
        const res = await fetch(`/api/courses?userId=${user!.id}&role=PARENT`);
        const data: Course[] = await res.json();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    }
    loadCourses();
  }, [user]);

  // Show feedback prompt after 2 exchanges
  useEffect(() => {
    if (exchangeCount >= 2 && !feedbackDismissed) {
      setShowFeedback(true);
    }
  }, [exchangeCount, feedbackDismissed]);

  const handleDismissFeedback = () => {
    setShowFeedback(false);
    setFeedbackDismissed(true);
  };

  const placeholder = useMemo(
    () =>
      language === "zh"
        ? "询问有关孩子学习的问题..."
        : "Ask about your child's learning...",
    [language]
  );

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
          placeholder={placeholder}
          userAvatar={user.name.slice(0, 2)}
        >
          {showFeedback && selectedCourseId && (
            <FeedbackPrompt
              courseId={selectedCourseId}
              parentId={user.id}
              onDismiss={handleDismissFeedback}
            />
          )}
        </ChatWindow>
      </div>
    </div>
  );
}
