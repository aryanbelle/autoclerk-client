import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import React, { useState, useEffect } from 'react';

export type ChatRole = "user" | "assistant";

export interface ChatMessageProps {
  role: ChatRole;
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  return (
    <article className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
      aria-label={isUser ? "User message" : "Assistant message"}>
      <div className={cn(
        "max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm md:text-base",
        isUser ? "bg-foreground text-background" : "text-foreground"
      )}>
        <div className="flex items-start gap-2">
          {isUser ? <User className="h-6 w-6 mt-1 opacity-70" /> : <Bot className="h-6 w-6 mt-1 opacity-70" />} 
          <TypingEffect content={content} />
        </div>
      </div>
    </article>
  );
}

interface TypingEffectProps {
  content: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < content.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedContent((prev) => prev + content.charAt(index));
        setIndex((prev) => prev + 1);
      }, 10); // Adjust typing speed here (milliseconds per character)
      return () => clearTimeout(timeoutId);
    } else {
      // Ensure full content is displayed once typing is complete
      setDisplayedContent(content);
    }
  }, [content, index]);

  return <p className="leading-relaxed whitespace-pre-wrap">{displayedContent}</p>;
};
