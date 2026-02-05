"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

const WEBSOCKET_URL = "wss://tp-iai3.cleverapps.io";

interface Message {
  when: number;
  name: string;
  message: string;
  moment?: number;
}

interface ChatProps {
  onTimestampClick?: (time: string) => void;
  currentTime?: number;
}

const emptySubscribe = () => () => {};

export default function Chat({ onTimestampClick, currentTime = 0 }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const userName = "LylRom";
  const wsRef = useRef<WebSocket | null>(null);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Connexion WebSocket
  useEffect(() => {
    if (!isMounted) return;

    const ws = new WebSocket(WEBSOCKET_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connecté");
    };

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        
        const normalizeWhen = (when: number): number => {
          if (typeof when === "number") {
            return when > 10000000000 ? when : when * 1000;
          }
          if (typeof when === "string") {
            const num = parseInt(when);
            return num > 10000000000 ? num : num * 1000;
          }
          return Date.now();
        };
        
        if (Array.isArray(data)) {
          const normalizedData = data.map((msg) => ({
            ...msg,
            when: normalizeWhen(msg.when),
          }));
          
          setMessages((prev) => {
            const serverMap = new Map(normalizedData.map((m) => [`${m.name}|${m.message}`, m]));
            
            prev.forEach((m) => {
              const key = `${m.name}|${m.message}`;
              if (!serverMap.has(key)) {
                serverMap.set(key, m);
              }
            });
            
            return Array.from(serverMap.values()).sort((a, b) => a.when - b.when);
          });
        } else {
          const normalizedMsg = {
            ...data,
            when: normalizeWhen(data.when),
          };
          setMessages((prev) => {
            const exists = prev.some(
              (m) => m.name === normalizedMsg.name && m.message === normalizedMsg.message
            );
            return exists ? prev : [...prev, normalizedMsg];
          });
        }
      } catch (error) {
        console.error("Erreur parsing message:", error);
      }
    };

    ws.onclose = (evt) => {
      setIsConnected(false);
      console.log("WebSocket déconnecté", evt.code, evt.reason);
    };

    ws.onerror = () => {
      // Ne logger l'erreur que si la connexion n'est pas établie
      // (On avait des erreurs de connexion alors que tout marchait sur la page)
      if (!ws.OPEN) {
        console.warn("Erreur WebSocket lors de la connexion");
      }
    };

    return () => {
      ws.close();
    };
  }, [isMounted]);

  const handleSendMessage = (text: string, moment?: number) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket non connecté");
      return;
    }

    const newMessage: Message = {
      when: Date.now(),
      name: userName,
      message: text,
      moment,
    };
    setMessages((prev) => [...prev, newMessage]);

    const messageToSend: { name: string; message: string; moment?: number } = {
      name: userName,
      message: text,
    };

    if (moment !== undefined) {
      messageToSend.moment = moment;
    }

    wsRef.current.send(JSON.stringify(messageToSend));
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
    <Card className="h-full flex flex-col" role="region" aria-label="Chat en direct">
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <header className="px-4 py-2 border-b border-neutral-800 flex items-center justify-between">
          <span className="text-sm text-neutral-400">
            Connecté en tant que <span className="font-bold">{userName}</span>
          </span>
          <span 
            className={`text-xs ${isConnected ? "text-green-500" : "text-red-500"}`}
            role="status"
            aria-live="polite"
            aria-label={isConnected ? "Statut : connecté au chat" : "Statut : déconnecté du chat"}
          >
            {isConnected ? "● Connecté" : "● Déconnecté"}
          </span>
        </header>
        <ChatMessages messages={messages} onTimestampClick={onTimestampClick} />
        <ChatInput onSendMessage={handleSendMessage} disabled={!isConnected} currentTime={currentTime} />
      </CardContent>
    </Card>
  );
}
