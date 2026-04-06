"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage } from "@/lib/types";
import { getCurrentUser } from "@/lib/auth";

interface UseChatOptions {
  endpoint: string;
  courseId?: string;
  studentId?: string;
  language?: string;
  chatType?: string;
}

const MAX_STORED = 50;

function storageKey(userId: string, chatType: string, courseId?: string) {
  return `edux-chat:${userId}:${chatType}:${courseId ?? "general"}`;
}

export function useChat({
  endpoint,
  courseId,
  studentId,
  language = "en",
  chatType = "parent",
}: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const messageCountRef = useRef(0);
  // Ref (not state) so greeting effects can read it synchronously in the same batch
  const restoredRef = useRef(false);

  // ── Load from localStorage when courseId changes ──────────────────────────
  useEffect(() => {
    if (!courseId) return;
    restoredRef.current = false;
    try {
      const user = getCurrentUser();
      const key = storageKey(user.id, chatType, courseId);
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed: ChatMessage[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setMessages(parsed);
          messageCountRef.current = parsed.filter((m) => m.role === "assistant").length;
          restoredRef.current = true;
          return;
        }
      }
    } catch {
      // localStorage unavailable or corrupt — silently ignore
    }
    setMessages([]);
    messageCountRef.current = 0;
  }, [courseId, chatType]);

  // ── Persist to localStorage whenever messages change ──────────────────────
  useEffect(() => {
    if (!courseId || messages.length === 0) return;
    try {
      const user = getCurrentUser();
      const key = storageKey(user.id, chatType, courseId);
      localStorage.setItem(key, JSON.stringify(messages.slice(-MAX_STORED)));
    } catch {
      // localStorage full — silently ignore
    }
  }, [messages, courseId, chatType]);

  // ── Reset (e.g. when switching users or injecting proactive greeting) ──────
  const resetMessages = useCallback((initialMessages: ChatMessage[] = []) => {
    abortRef.current?.abort();
    restoredRef.current = false;
    setMessages(initialMessages);
    setStreamingContent("");
    setIsLoading(false);
    messageCountRef.current = 0;
  }, []);

  // ── Send a message and stream the response ────────────────────────────────
  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setStreamingContent("");

      const history = messages.map((m) => ({ role: m.role, content: m.content }));

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
            chat_type: chatType,
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
              const raw = line.slice(6).trim();
              if (raw === "[DONE]") {
                setMessages((prev) => [
                  ...prev,
                  { id: `assistant-${Date.now()}`, role: "assistant", content: accumulated },
                ]);
                setStreamingContent("");
                messageCountRef.current += 1;
                setIsLoading(false);
                return;
              }
              try {
                const chunk = JSON.parse(raw);
                if (typeof chunk === "string") {
                  accumulated += chunk;
                  setStreamingContent(accumulated);
                }
              } catch {
                accumulated += raw;
                setStreamingContent(accumulated);
              }
            }
          }
        }

        if (accumulated) {
          setMessages((prev) => [
            ...prev,
            { id: `assistant-${Date.now()}`, role: "assistant", content: accumulated },
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
              content: "Sorry, I encountered an error. Please try again.",
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, courseId, studentId, language, messages, chatType]
  );

  return {
    messages,
    isLoading,
    streamingContent,
    sendMessage,
    resetMessages,
    exchangeCount: messageCountRef.current,
    /** True if messages were restored from localStorage this session (used to skip proactive greeting) */
    isRestoredFromStorage: restoredRef,
  };
}
