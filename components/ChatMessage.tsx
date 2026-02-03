import { Clock, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

interface ChatMessageProps {
  name: string;
  message: string;
  moment?: number;
  when: number;
}

export function ChatMessage({ name, message, moment, when }: ChatMessageProps) {
  return (
    <div className="flex gap-3 hover:bg-neutral-200 rounded-lg transition-colors p-1">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-neutral-900">
            {name}
          </span>
          <span className="text-xs text-neutral-400">{formatTime(when)}</span>
        </div>

        <p className="text-sm text-neutral-700 mt-1 break-words">
          {message}
        </p>

        {moment !== undefined && (
          <Button
            variant="outline"
            size="xs"
            className="mt-2 gap-1.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Film className="size-3" />
            <Clock className="size-3" />
            {formatTimestamp(moment)}
          </Button>
        )}
      </div>
    </div>
  );
}
