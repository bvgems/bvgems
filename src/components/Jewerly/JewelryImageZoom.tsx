"use client";

import React, { useRef, useState } from "react";
import { Image } from "@mantine/core";

type JewelryImageZoomProps = {
  src: string;
  alt?: string;
  zoom?: number; // e.g. 2 = 200% zoom
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
};

export const JewelryImageZoom: React.FC<JewelryImageZoomProps> = ({
  src,
  alt = "Jewelry Image",
  zoom = 2,
  width = "100%",
  height = "100%",
  style = {},
}) => {
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      containerRef.current?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };

    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      style={{
        width,
        height,
        overflow: "hidden",
        cursor: "zoom-in",
        backgroundImage: `url(${src})`,
        backgroundSize: isZoomed ? `${zoom * 100}%` : "contain",
        backgroundPosition: isZoomed ? backgroundPosition : "center",
        backgroundRepeat: "no-repeat",
        transition: "background-size 0.3s ease-out",
        ...style,
      }}
    >
      {/* fallback image for non-zoom state */}
      {!isZoomed && (
        <Image loading="lazy"
          src={src}
          alt={alt}
          fit="contain"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        />
      )}
    </div>
  );
};
