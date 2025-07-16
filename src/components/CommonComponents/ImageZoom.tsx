import { useRef, useState } from "react";

export const ImageZoom = ({ src, alt, className = "", isBead }: any) => {
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

  const handleMouseMove = (e: any) => {
    if (!targetRef.current || !sourceRef.current || !containerRef.current)
      return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const sourceRect = sourceRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const xRatio = (targetRect.width - containerRect.width) / sourceRect.width;
    const yRatio =
      (targetRect.height - containerRect.height) / sourceRect.height;

    const left = Math.max(
      Math.min(e.pageX - sourceRect.left, sourceRect.width),
      0
    );
    const top = Math.max(
      Math.min(e.pageY - sourceRect.top, sourceRect.height),
      0
    );

    setOffset({
      left: left * -xRatio,
      top: top * -yRatio,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in ${
        isBead ? "h-[900]" : "h-[600]"
      }  ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ borderRadius: "8px" }}
    >
      <img
        ref={sourceRef}
        src={src}
        alt={alt}
        className="w-full h-full block"
        style={{ height: "70%", objectFit: "fill" }}
      />
      <img
        ref={targetRef}
        src={src}
        alt={alt}
        className="absolute pointer-events-none"
        style={{
          left: `${offset.left}px`,
          top: `${offset.top}px`,
          opacity: opacity,
          transform: "scale(2)",
          transformOrigin: "top left",
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
};
