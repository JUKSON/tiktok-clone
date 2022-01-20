import React, { useRef, useState } from "react";

const useVideo = () => {
  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (videoRef && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setPlaying(false);
      } else {
        videoRef.current.play();
        setPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    setMuted((oldState) => !oldState);
  };

  return {
    videoRef,
    isPlaying,
    togglePlay,
    setPlaying,
    toggleMute,
    isMuted,
    setMuted,
  };
};

export default useVideo;
