"use client";

import { useState } from "react";
import NextImage from "next/image";

interface ImageZoomMobileProps {
  src: string;
  alt?: string;
  scale: number;
}

export const ImageZoomMobile = ({ src, alt, scale }: ImageZoomMobileProps) => {
  return (
    <div className="relative w-full h-[350px] bg-gray-50 overflow-hidden rounded-lg">
      <NextImage
        src={src}
        alt={alt || "product-image"}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain transition-transform duration-300 ease-in-out"
        style={{
          transform: `scale(${scale})`,
        }}
        draggable={false}
      />
    </div>
  );
};
