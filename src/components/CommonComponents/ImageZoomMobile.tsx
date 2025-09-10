"use client";

import { useState } from "react";

interface ImageZoomMobileProps {
  src: string;
  alt?: string;
  scale: number;
}

export const ImageZoomMobile = ({ src, alt, scale }: ImageZoomMobileProps) => {
  return (
    <div className="relative w-full h-[350px] bg-gray-50 overflow-hidden rounded-lg">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
        style={{
          transform: `scale(${scale})`,
        }}
        draggable={false}
      />
    </div>
  );
};
