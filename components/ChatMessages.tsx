"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

interface Message {
  when: number;
  name: string;
  message: string;
  moment?: number;
}

interface ChatMessagesProps {
  messages: Message[];
  onTimestampClick?: (time: string) => void;
}

export function ChatMessages({ messages, onTimestampClick }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea 
      className="flex-1 px-3 min-h-0"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      tabIndex={0}
    >
      <div className="space-y-2 py-3">
        {messages.length === 0 ? (
          <p className="text-center text-neutral-400 text-sm py-4" role="status">
            No messages yet
          </p>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={`${msg.when}-${index}`}
              name={msg.name}
              message={msg.message}
              moment={msg.moment}
              when={msg.when}
              onTimestampClick={onTimestampClick}
            />
          ))
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </ScrollArea>
  );
}
