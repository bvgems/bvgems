"use client";
import { Button } from "@mantine/core";
import React, { useEffect, useRef } from "react";

export const OwnEngagementRing = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 1;
    }
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden mt-10">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-fill"
        src="/assets/ringvideo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="relative z-10 pb-12 flex items-end justify-center h-full bg-black/25 text-white">
        <div className="text-center pb-10 px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">
            Create Your Own Engagement Ring
          </h1>
          <p className="text-xl">
            Craft a timeless symbol of love with your unique vision. Choose your
            gemstone, metal, and design — and let our expertise bring your dream
            ring to life.
          </p>
          <div className="flex justify-center gap-3 mt-3">
            <Button
              size="compact-lg"
              variant="outline"
              color="white"
              radius={0}
            >
              Start with Setting
            </Button>
            <Button
              size="compact-lg"
              variant="outline"
              color="white"
              radius={0}
            >
              Start with Gemstone
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
