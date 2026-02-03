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
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-3 min-h-0">
      <div className="space-y-2 py-3">
        {messages.map((msg, index) => (
          <ChatMessage
            key={`${msg.when}-${index}`}
            name={msg.name}
            message={msg.message}
            moment={msg.moment}
            when={msg.when}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
