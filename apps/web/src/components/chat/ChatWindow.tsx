"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import type { ChatMessage } from "@/lib/types";

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isLoading?: boolean;
  streamingContent?: string;
  placeholder?: string;
  userAvatar?: string;
  children?: React.ReactNode; // For overlay components like FeedbackPrompt
}

export function ChatWindow({
  messages,
  onSend,
  isLoading,
  streamingContent,
  placeholder,
  userAvatar,
  children,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  return (
    <div className="flex flex-col flex-1 min-h-0 border rounded-lg overflow-hidden bg-background">
      {/* Messages area */}
      <ScrollArea className="flex-1 min-h-0 px-4" ref={scrollRef}>
        <div className="py-4 space-y-1">
          {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              Start a conversation...
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              avatar={msg.role === "user" ? userAvatar : undefined}
            />
          ))}

          {/* Streaming message */}
          {streamingContent && (
            <MessageBubble
              role="assistant"
              content={streamingContent}
              isStreaming
            />
          )}

          {/* Loading indicator */}
          {isLoading && !streamingContent && (
            <MessageBubble
              role="assistant"
              content="Thinking..."
              isStreaming
            />
          )}
        </div>
      </ScrollArea>

      {/* Overlay content (e.g., FeedbackPrompt) */}
      {children}

      {/* Input */}
      <ChatInput
        onSend={onSend}
        placeholder={placeholder}
        disabled={isLoading}
      />
    </div>
  );
}
