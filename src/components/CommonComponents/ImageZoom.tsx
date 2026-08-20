import { useRef, useState } from "react";
import NextImage from "next/image";

export const ImageZoom = ({ src, alt, className = "", h = "450px" }: any) => {
  const sourceRef: any = useRef(null);
  const targetRef: any = useRef(null);
  const containerRef: any = useRef(null);

  const [opacity, setOpacity] = useState(0);
  const [offset, setOffset] = useState({ left: 0, top: 0 });

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!targetRef.current || !sourceRef.current || !containerRef.current)
      return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const sourceRect = sourceRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Use mouse position relative to the source image
    const left = Math.max(
      Math.min(e.clientX - sourceRect.left, sourceRect.width),
      0
    );
    const top = Math.max(
      Math.min(e.clientY - sourceRect.top, sourceRect.height),
      0
    );

    const xRatio = (targetRect.width - containerRect.width) / sourceRect.width;
    const yRatio =
      (targetRect.height - containerRect.height) / sourceRect.height;

    setOffset({
      left: left * -xRatio,
      top: top * -yRatio,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ borderRadius: "8px" }}
    >
      <div className={`relative w-full h-[300px] md:h-[${h}]`}>
        <NextImage
          ref={sourceRef}
          src={src}
          alt={alt || "zoom-image"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="block object-contain"
        />
      </div>
      <img
        ref={targetRef}
        src={src}
        alt={alt || "zoom-target"}
        className="absolute pointer-events-none"
        style={{
          left: `${offset.left}px`,
          top: `${offset.top}px`,
          opacity: opacity,
          transform: "scale(2)",
          transformOrigin: "top left",
          transition: "opacity 0.3s ease",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
