"use client";

import Chat from "@/components/Chat";
import { useEffect, useState } from "react";
import { VideoPlayer } from "@/components/video-player";
import type { FilmData } from "@/types/film";

export default function Home() {
  const [filmData, setFilmData] = useState<FilmData | null>(null);

  useEffect(() => {
    fetch("https://tp-iai3.cleverapps.io/projet/")
      .then(res => res.json())
      .then(data => setFilmData(data))
      .catch(err => console.error("Erreur chargement:", err));
  }, []);

  if (!filmData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      {/* Colonne gauche */}
      <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
        {/* Vidéo - 2/3 hauteur */}
        <div className="flex-[2] flex flex-col gap-4 overflow-hidden">
          <VideoPlayer 
            url={filmData.film.file_url}
            subtitles={filmData.subtitles}
          />
        </div>

        {/* Carte - 1/3 hauteur */}
        <div className="bg-gray-200 rounded-lg flex-1 min-h-0" />
      </div>

      {/* Chat - pleine hauteur droite */}
      <div className="min-h-0">
        <Chat />
      </div>
    </div>
  );
}
