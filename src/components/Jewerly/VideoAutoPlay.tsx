// components/VideoAutoPlay.tsx
"use client";
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  style?: React.CSSProperties;
};

export function VideoAutoPlay({ src, style }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Force play — Chrome requires an explicit .play() call
    // when the element may not have been fully painted yet
    const tryPlay = () => {
      video.play().catch(() => {
        // Silently ignore — happens if user navigates away mid-play
      });
    };

    if (video.readyState >= 2) {
      // Already has enough data
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.pause();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="auto"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        ...style,
      }}
    />
  );
}
