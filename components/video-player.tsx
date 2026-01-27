"use client";

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

interface VideoPlayerProps {
  url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <MediaController 
      style={{
        flex: 1,
      }}
    >
      <ReactPlayer
        slot="media"
        src={url}
        controls={false}
        pip={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <MediaLoadingIndicator slot="centered-chrome" />
      <MediaControlBar className="*:px-2">
        <MediaPlayButton />
        <MediaTimeDisplay showDuration />
        <MediaTimeRange />
        <MediaMuteButton />
        <MediaVolumeRange />
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  );
}
