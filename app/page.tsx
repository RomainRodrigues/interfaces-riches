"use client";

import Chat from "@/components/Chat";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { VideoPlayer, type VideoPlayerRef } from "@/components/VideoPlayer";
import { ChaptersNavigation } from "@/components/ChaptersNavigation";
import { timestampToSeconds } from "@/lib/timestamp-utils";
import type { FilmData, Chapter, POI } from "@/types/film";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
  const [filmData, setFilmData] = useState<FilmData | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  // Variable synchronized with the current video time
  const [currentTime, setCurrentTime] = useState(0);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const handleTimeChange = (time: number) => {
    setCurrentTime(time)
  }

  const seekToTimestamp = (timestamp: string) => {
    const totalSeconds = timestampToSeconds(timestamp);
    videoPlayerRef.current?.seekTo(totalSeconds);
  };

  useEffect(() => {
    fetch("https://tp-iai3.cleverapps.io/projet/")
      .then(res => res.json())
      .then(data => {
        setFilmData(data);
        // Fetch and display chapters
        if (data.chapters) {
          fetch(data.chapters)
            .then(res => res.json())
            .then(chaptersData => {
              setChapters(chaptersData as Chapter[]);
            })
            .catch(err => console.error("Error loading chapters:", err));
        }
        if (data.poi) {
          fetch(data.poi)
            .then(res => res.json())
            .then(poiData => {
              setPois(poiData as POI[]);
            })
            .catch(err => console.error("Error loading POI:", err));
        }
      })
      .catch(err => console.error("Error loading:", err));
  }, []);

  if (!filmData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      {/* Left column */}
      <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
        {/* Video - 2/3 height */}
        <div className="flex-[2] flex flex-col gap-4 overflow-hidden">
          {chapters.length > 0 && (
            <ChaptersNavigation
              currentTime={currentTime}
              chapters={chapters}
              onChapterSelect={seekToTimestamp}
            />
          )}
          <VideoPlayer
            ref={videoPlayerRef}
            url={filmData.film.file_url}
            subtitles={filmData.subtitles}
            onTimeChange={handleTimeChange}
          />
        </div>

        {/* Map - 1/3 height */}
        <div className="bg-gray-200 rounded-lg flex-1">
          <Map pois={pois} onTimestampClick={seekToTimestamp} />
        </div>
      </div>

      {/* Chat - full height right */}
      <div className="min-h-0">
        <Chat onTimestampClick={seekToTimestamp} currentTime={currentTime} />
      </div>
    </div>
  );
}
