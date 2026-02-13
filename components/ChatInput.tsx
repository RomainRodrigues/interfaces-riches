"use client";

import { useState } from "react";
import { Send, Film } from "lucide-react";
import { secondsToTimestamp } from "@/lib/timestamp-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage?: (message: string, moment?: number) => void;
  disabled?: boolean;
  currentTime?: number;
}

export function ChatInput({ onSendMessage, disabled = false, currentTime = 0 }: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [shareTimestamp, setShareTimestamp] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<number>(0);

  const handleSend = () => {
    if (inputMessage.trim() && !disabled) {
      onSendMessage?.(
        inputMessage,
        shareTimestamp ? selectedMoment : undefined
      );
      setInputMessage("");
    }
  };

  const handleClick = () => {
    if (!shareTimestamp) {
      setSelectedMoment(Math.floor(currentTime));
    }
    setShareTimestamp(!shareTimestamp);
  };

  return (
    <form 
      className="border-t border-neutral-200 p-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      aria-label="Message sending form"
    >
      {/* Option to share a movie moment */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={shareTimestamp ? "default" : "outline"}
          size="xs"
          onClick={handleClick}
          className="gap-1.5"
          disabled={disabled}
          aria-pressed={shareTimestamp}
          aria-label={shareTimestamp ? `Selected moment: ${secondsToTimestamp(selectedMoment)}. Click to disable` : "Share the current video moment"}
        >
          <Film className="size-3" aria-hidden="true" />
          <span>{shareTimestamp ? `Moment: ${secondsToTimestamp(selectedMoment)}` : "Share current moment"}</span>
        </Button>
      </div>

      {/* Input and send button */}
      <div className="flex gap-2">
        <label htmlFor="chat-message-input" className="sr-only">
          Your message
        </label>
        <Input
          id="chat-message-input"
          placeholder={disabled ? "Connecting..." : "Type your message..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1"
          disabled={disabled}
          aria-describedby="chat-input-help"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <span id="chat-input-help" className="sr-only">
          Press Enter to send the message
        </span>
        <Button 
          type="submit" 
          size="icon" 
          className="shrink-0" 
          disabled={disabled || !inputMessage.trim()}
          aria-label="Send message"
        >
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
