import { useRef, useState } from "react";

export const ImageZoom = ({ src, alt, className = "" }: any) => {
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

    const xRatio = (targetRect.width - containerRect.width) / sourceRect.width;
    const yRatio =
      (targetRect.height - containerRect.height) / sourceRect.height;

    const left = Math.max(
      Math.min(e.clientX - sourceRect.left, sourceRect.width),
      0
    );
    const top = Math.max(
      Math.min(e.clientY - sourceRect.top, sourceRect.height),
      0
    );

    setOffset({
      left: left * -xRatio,
      top: top * -yRatio,
    });
  };

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 w-full h-[300px] md:h-[450px] border border-gray-100 rounded-lg ${className}`}
      >
        <span className="text-gray-400 font-medium tracking-wide text-sm">Image Not Available</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in h-[300px] md:h-[450px] ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ borderRadius: "8px" }}
    >
      <img
        ref={sourceRef}
        src={src}
        alt={alt}
        className={`w-full h-[300px] md:h-[450px] block object-contain`}
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
