"use client";

import { useState, useSyncExternalStore } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

// Messages de démonstration pour l'ébauche visuelle
const mockMessages = [
  {
    when: "1580742794",
    name: "Alice",
    message: "Salut tout le monde ! Vous avez vu cette scène ?",
    moment: 120,
  },
  {
    when: "1580742800",
    name: "Bob",
    message: "Oui c'est vraiment effrayant !",
  },
  {
    when: "1580742850",
    name: "Charlie",
    message: "Regardez ce passage, c'est le meilleur !",
    moment: 462,
  },
  {
    when: "1580742900",
    name: "Alice",
    message: "La scène du cimetière est iconique",
  },
  {
    when: "1580742950",
    name: "David",
    message: "Je recommande de regarder à partir de ce moment",
    moment: 1200,
  },
];

const emptySubscribe = () => () => {};

export default function Chat() {
  const [messages, setMessages] = useState(mockMessages);
  
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const handleSendMessage = (text: string, moment?: number) => {
    const newMessage = {
      when: Math.floor(Date.now() / 1000).toString(),
      name: "Vous",
      message: text,
      moment,
    };
    setMessages([...messages, newMessage]);
  };

  if (!isMounted) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-neutral-400">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ChatMessages messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </CardContent>
    </Card>
  );
}
