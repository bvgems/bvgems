"use client";
import { fetchProductByHandle } from "@/apis/api";
import { JewerlyProductDetails } from "@/components/Jewerly/JewerlyProductDetails";
import { Grid, GridCol } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Custom Image Zoom Component
const ImageZoom = ({ src, alt, className = "" }: any) => {
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
      className={`relative overflow-hidden cursor-zoom-in h-[600px] ${className}`}
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
        style={{ height: "100%", objectFit: "fill" }}
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

export default function JewerlyProductPage() {
  const { product } = useParams();
  const [productData, setProductData] = useState<any>(null);

  useEffect(() => {
    const getProductByHandle = async () => {
      if (product) {
        const response = await fetchProductByHandle(product);
        setProductData(response?.product);
      }
    };
    getProductByHandle();
  }, [product]);

  return (
    <div className="mt-9 p-9">
      <Grid>
        <GridCol span={{ base: 12, md: 7 }}>
          {productData && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ImageZoom
                src={
                  productData?.images?.edges?.[0]?.node?.url ||
                  "/placeholder.png"
                }
                alt={productData?.title}
              />
            </motion.div>
          )}
        </GridCol>

        <GridCol span={{ base: 12, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <JewerlyProductDetails productData={productData} />
          </motion.div>
        </GridCol>
      </Grid>
    </div>
  );
}
