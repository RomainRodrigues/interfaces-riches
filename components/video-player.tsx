"use client";

import { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaMuteButton,
  MediaFullscreenButton,
  MediaLoadingIndicator,
} from "media-chrome/react";
import { MediaCaptionsMenu, MediaCaptionsMenuButton } from "media-chrome/react/menu";
import { srt2vtt } from "srt-support-for-html5-videos";

interface VideoPlayerProps {
  url: string;
  subtitles: {
    en: string;
    fr: string;
    es: string;
  }
}

export function VideoPlayer({ url, subtitles }: VideoPlayerProps) {
  const [trackData, setTrackData] = useState<{
    en?: string;
    fr?: string;
    es?: string;
  }>({});
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const loadSubtitles = async () => {
      const converted: typeof trackData = {};

      for (const [lang, srtUrl] of Object.entries(subtitles)) {
        try {
          const response = await fetch(srtUrl);
          const srtContent = await response.text();
          const vttContent = srt2vtt(srtContent);
          const blob = new Blob([vttContent], { type: "text/vtt" });
          converted[lang as keyof typeof subtitles] = URL.createObjectURL(blob);
        } catch (error) {
          console.error(`Failed to load subtitles for ${lang}:`, error);
        }
      }

      setTrackData(converted);
    };

    loadSubtitles();
  }, [subtitles]);

  return (
    <MediaController
      defaultSubtitles
      style={{
        flex: 1,
        aspectRatio: "16 / 9",
      }}
    >
      <ReactPlayer
        slot="media"
        crossOrigin=""
        src={url}
        controls={false}
        pip={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {trackData.en && (
          <track
            kind="subtitles"
            srcLang="en"
            label="English"
            src={trackData.en}
            default
          />
        )}
        {trackData.fr && (
          <track
            kind="subtitles"
            srcLang="fr"
            label="Français"
            src={trackData.fr}
          />
        )}
        {trackData.es && (
          <track
            kind="subtitles"
            srcLang="es"
            label="Español"
            src={trackData.es}
          />
        )}
      </ReactPlayer>
      <MediaLoadingIndicator slot="centered-chrome" />
      <MediaControlBar className="*:px-2">
        <MediaPlayButton />
        <MediaTimeDisplay showDuration />
        <MediaTimeRange />
        <MediaMuteButton />
        <MediaVolumeRange />
        <MediaCaptionsMenuButton />
        <MediaCaptionsMenu hidden anchor="auto" />
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
}
