"use client";

import { useState } from "react";
import { Send, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage?: (message: string, moment?: number) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [shareTimestamp, setShareTimestamp] = useState(false);

  const handleSend = () => {
    if (inputMessage.trim() && !disabled) {
      onSendMessage?.(
        inputMessage,
        shareTimestamp ? 330 : undefined
      );
      setInputMessage("");
    }
  };

  return (
    <div className="border-t border-neutral-200 p-4 space-y-3">
      {/* Option pour partager un moment du film */}
      <div className="flex items-center gap-2">
        <Button
          variant={shareTimestamp ? "default" : "outline"}
          size="xs"
          onClick={() => setShareTimestamp(!shareTimestamp)}
          className="gap-1.5"
          disabled={disabled}
        >
          <Film className="size-3" />
          {shareTimestamp ? "Moment: 5:30" : "Partager le moment actuel"}
        </Button>
      </div>

      {/* Input et bouton d'envoi */}
      <div className="flex gap-2">
        <Input
          placeholder={disabled ? "Connexion en cours..." : "Écrivez votre message..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button size="icon" className="shrink-0" onClick={handleSend} disabled={disabled || !inputMessage.trim()}>
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
