"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  avatar?: string;
  isStreaming?: boolean;
}

export function MessageBubble({ role, content, avatar, isStreaming }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 py-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn("text-xs", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
          {isUser ? (avatar || "You") : "AI"}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "rounded-lg px-4 py-2.5 max-w-[80%] text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
          role === "system" && "bg-accent/50 text-muted-foreground italic text-xs"
        )}
      >
        <div className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}
