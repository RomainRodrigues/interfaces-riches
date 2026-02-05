"use client";

import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
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
  onTimeChange: (time: number) => void
}

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>((props, ref) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);

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

      for (const [lang, srtUrl] of Object.entries(props.subtitles)) {
        try {
          const response = await fetch(srtUrl);
          const srtContent = await response.text();
          const vttContent = srt2vtt(srtContent);
          const blob = new Blob([vttContent], { type: "text/vtt" });
          converted[lang as keyof typeof props.subtitles] = URL.createObjectURL(blob);
        } catch (error) {
          console.error(`Failed to load subtitles for ${lang}:`, error);
        }
      }

      setTrackData(converted);
    };

    loadSubtitles();
  }, [props, props.subtitles]);

  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (playerRef.current) {
        playerRef.current.currentTime = seconds;
      }
    },
  }));

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    // We only want to update time slider if we are not currently seeking
    if (!player || !player.duration) return;

    props.onTimeChange(player.currentTime);
  }

  return (
    <MediaController
      style={{
        flex: 1,
        aspectRatio: "16 / 9",
      }}
    >
      <div>
    </div>
      <ReactPlayer
        ref={playerRef}
        slot="media"
        crossOrigin=""
        src={props.url}
        controls={false}
        pip={false}
        style={{
          width: "100%",
          height: "100%",
        }}
        onTimeUpdate={handleTimeUpdate}
      >
        {trackData.en && (
          <track
            kind="subtitles"
            srcLang="en"
            label="English"
            src={trackData.en}
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
});

VideoPlayer.displayName = "VideoPlayer";
