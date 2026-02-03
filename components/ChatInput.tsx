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
    <form 
      className="border-t border-neutral-200 p-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      aria-label="Formulaire d'envoi de message"
    >
      {/* Option pour partager un moment du film */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={shareTimestamp ? "default" : "outline"}
          size="xs"
          onClick={() => setShareTimestamp(!shareTimestamp)}
          className="gap-1.5"
          disabled={disabled}
          aria-pressed={shareTimestamp}
          aria-label={shareTimestamp ? "Moment sélectionné: 5:30. Cliquez pour désactiver" : "Partager le moment actuel de la vidéo"}
        >
          <Film className="size-3" aria-hidden="true" />
          <span>{shareTimestamp ? "Moment: 5:30" : "Partager le moment actuel"}</span>
        </Button>
      </div>

      {/* Input et bouton d'envoi */}
      <div className="flex gap-2">
        <label htmlFor="chat-message-input" className="sr-only">
          Votre message
        </label>
        <Input
          id="chat-message-input"
          placeholder={disabled ? "Connexion en cours..." : "Écrivez votre message..."}
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
          Appuyez sur Entrée pour envoyer le message
        </span>
        <Button 
          type="submit" 
          size="icon" 
          className="shrink-0" 
          disabled={disabled || !inputMessage.trim()}
          aria-label="Envoyer le message"
        >
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
