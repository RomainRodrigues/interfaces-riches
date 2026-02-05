"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { Chapter } from "@/types/film";

interface ChaptersNavigationProps {
  currentTime: number;
  chapters: Chapter[];
  onChapterSelect: (timestamp: string) => void;
}

export function ChaptersNavigation({
  chapters,
  onChapterSelect,
  currentTime = 0,
}: ChaptersNavigationProps) {
  const timestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const getCurrentChapterIndex = (): number => {
    return chapters.findIndex((chapter, index) => {
      const currentSeconds = timestampToSeconds(chapter.timestamp);
      const nextSeconds =
        index + 1 < chapters.length
          ? timestampToSeconds(chapters[index + 1].timestamp)
          : Infinity;
      return currentTime >= currentSeconds && currentTime < nextSeconds;
    });
  };

  const currentChapterIndex = getCurrentChapterIndex();

  return (
    <div className="w-full flex flex-col gap-4">
      <ButtonGroup className="flex-wrap">
        {chapters.map((chapter, index) => (
          <Button
            key={chapter.chapter}
            variant={index === currentChapterIndex ? "default" : "outline"}
            size="sm"
            onClick={() => onChapterSelect(chapter.timestamp)}
          >
            {chapter.title}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
