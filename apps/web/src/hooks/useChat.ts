"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "@/lib/types";

interface UseChatOptions {
  endpoint: string;
  courseId?: string;
  studentId?: string;
  language?: string;
}

export function useChat({ endpoint, courseId, studentId, language = "en" }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const messageCountRef = useRef(0);

  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setStreamingContent("");

      // Build history for context
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Abort previous request if any
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            course_id: courseId,
            student_id: studentId,
            language,
            history,
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`Chat error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") {
                // Finalize: move streaming content to messages
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    content: accumulated,
                  },
                ]);
                setStreamingContent("");
                messageCountRef.current += 1;
                setIsLoading(false);
                return;
              }
              accumulated += data;
              setStreamingContent(accumulated);
            }
          }
        }

        // If we get here without [DONE], still finalize
        if (accumulated) {
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: accumulated,
            },
          ]);
          setStreamingContent("");
          messageCountRef.current += 1;
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Chat error:", err);
          setMessages((prev) => [
            ...prev,
            {
              id: `error-${Date.now()}`,
              role: "assistant",
              content:
                "Sorry, I encountered an error. Please try again.",
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, courseId, studentId, language, messages]
  );

  const exchangeCount = messageCountRef.current;

  return {
    messages,
    isLoading,
    streamingContent,
    sendMessage,
    exchangeCount,
  };
}
