import { Clock, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { secondsToTimestamp } from "@/lib/timestamp-utils";

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  if (isToday) {
    return `Aujourd'hui à ${time}`;
  } else if (isYesterday) {
    return `Hier à ${time}`;
  } else {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year} ${time}`;
  }
}

interface ChatMessageProps {
  name: string;
  message: string;
  moment?: number;
  when: number;
  onTimestampClick?: (time: string) => void;
}

export function ChatMessage({ name, message, moment, when, onTimestampClick }: ChatMessageProps) {
  const timeLabel = `Envoyé à ${formatTime(when)}`;

  return (
    <article 
      className="flex gap-3 hover:bg-neutral-200 focus:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg transition-colors p-1"
      aria-label={`Message de ${name}: ${message}`}
      tabIndex={0}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-neutral-900">
            {name}
          </span>
          <time 
            className="text-xs text-neutral-400" 
            dateTime={new Date(when).toISOString()}
            aria-label={timeLabel}
          >
            {formatTime(when)}
          </time>
        </div>

        <p className="text-sm text-neutral-700 mt-1 break-words">
          {message}
        </p>

        {moment !== undefined && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              const timestamp = secondsToTimestamp(moment);
              onTimestampClick?.(timestamp);
            }}
            className="mt-2 gap-1.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:ring-2 focus:ring-blue-500"
            aria-label={`Aller au moment ${secondsToTimestamp(moment)} de la vidéo`}
            tabIndex={0}
          >
            <Film className="size-3" aria-hidden="true" />
            <Clock className="size-3" aria-hidden="true" />
            <span>{secondsToTimestamp(moment)}</span>
          </Button>
        )}
      </div>
    </article>
  );
}
