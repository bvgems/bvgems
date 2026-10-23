"use client";

import { useRef, useState } from "react";

export const ImageZoom = ({ src, alt, className = "", h, zoom = 2.2 }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 w-full h-[300px] md:h-[450px] border border-gray-100 rounded-lg ${className}`}
        style={h ? { height: h } : undefined}
      >
        <span className="text-gray-400 font-medium tracking-wide text-sm">Image Not Available</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in h-[300px] md:h-[450px] w-full flex items-center justify-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ borderRadius: "8px", ...(h ? { height: h } : {}) }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full block object-contain pointer-events-none transition-transform duration-150 ease-out will-change-transform select-none"
        style={{
          transform: isZoomed ? `scale(${zoom})` : "scale(1)",
          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
        }}
      />
    </div>
  );
};
