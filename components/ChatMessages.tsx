"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

interface Message {
  when: string;
  name: string;
  message: string;
  moment?: number;
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 px-3">
      <div className="space-y-2">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            name={msg.name}
            message={msg.message}
            moment={msg.moment}
            when={msg.when}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
