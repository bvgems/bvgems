"use client";
import { fetchProductByHandle } from "@/apis/api";
import { Grid, GridCol, Image, Slider } from "@mantine/core";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ImageZoom } from "@/components/CommonComponents/ImageZoom";
import { JewelryProductDetails } from "@/components/Jewerly/JewerlyProductDetails";

type Thumb = { url: string; title?: string | null };

function HandTryOn({ ringImage }: { ringImage: string }) {
  const [skinTone, setSkinTone] = useState(30);

  return (
    <div className="relative w-full flex flex-col items-center mb-5">
      <div className="relative w-[450px] h-[450px]">
        <img
          src="/assets/hand-base2.png"
          alt="Hand"
          className="w-full h-full object-contain transition-all duration-300"
          style={{
            filter: `brightness(${1.2 - skinTone / 100}) sepia(${
              skinTone / 200
            }) saturate(1.2)`,
          }}
        />

        {/* Ring overlay */}
        {ringImage && (
          <img
            src={"/assets/removed-ring-preview.png"}
            alt="Ring Preview"
            className="absolute object-contain"
            style={{
              width: "54px",
              top: "152px",
              left: "157px",
            }}
          />
        )}
      </div>

      {/* Skin tone slider */}
      <div className="w-64 mt-4">
        <Slider
          value={skinTone}
          onChange={setSkinTone}
          min={0}
          max={100}
          step={1}
          label={null}
          color="brown"
        />
        <p className="text-center text-sm mt-1">Adjust Skin Tone</p>
      </div>
    </div>
  );
}

export default function JewelryProductPage() {
  const { product } = useParams();
  const path = usePathname();

  const [productData, setProductData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<Thumb[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [showShapeOptions, setShowShapeOptions] = useState<boolean>(false);
  const [twoStoneRings, setTwoStoneRings] = useState<boolean>(false);

  useEffect(() => {
    const getProductByHandle = async () => {
      if (!product) return;

      const response = await fetchProductByHandle(product as string);
      const productInfo = response?.product;
      if (!productInfo) return;

      const isTwoStoneRing = productInfo?.isTwoStoneRing?.value === "true";
      const shapeOptionValue = productInfo?.showshapeoptions?.value === "true";

      setShowShapeOptions(shapeOptionValue);
      setTwoStoneRings(isTwoStoneRing);
      setProductData(productInfo);

      // ---- Normalize thumbnail list ----
      let images: Thumb[] = [];

      if (isTwoStoneRing) {
        images =
          productInfo?.images?.edges?.map((e: any) => ({
            url: e?.node?.url,
            title: null,
          })) ?? [];
      } else if (shapeOptionValue) {
        const variantEdges = productInfo?.variants?.edges ?? [];
        images = variantEdges
          .map((v: any) => ({
            url: v?.node?.image?.url,
            title: v?.node?.title,
          }))
          .filter((t: Thumb) => !!t.url);
      } else {
        images =
          productInfo?.images?.edges?.map((e: any) => ({
            url: e?.node?.url,
            title: null,
          })) ?? [];
      }

      setThumbnails(images);
      const firstUrl = images?.[0]?.url || "/placeholder.png";
      setSelectedImage(firstUrl);

      const firstShape = images?.[0]?.title || null;
      if (firstShape) setSelectedShape(firstShape);
    };

    getProductByHandle();
  }, [product]);

  const handleShapeChange = (shape: string) => {
    setSelectedShape(shape);
    const matched = thumbnails.find((t) =>
      (t.title || "").toLowerCase().includes(shape.toLowerCase())
    );
    if (matched?.url) setSelectedImage(matched.url);
  };

  const selectedIdx = useMemo(
    () => thumbnails.findIndex((t) => t.url === selectedImage),
    [thumbnails, selectedImage]
  );

  return (
    <div className="mt-9 p-9">
      <Grid>
        {/* LEFT: Imagery */}
        <GridCol span={{ base: 12, md: 7 }}>
          {productData && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Product Image */}
              <div className="flex flex-col items-center">
                <ImageZoom
                  src={selectedImage || "/placeholder.png"}
                  alt={productData?.title}
                />

                {/* Thumbnails below ONLY the product image */}
                <div className="flex gap-3 flex-wrap justify-center mt-6">
                  {thumbnails.map((thumb, idx) => {
                    const isActive = idx === selectedIdx;
                    return (
                      <button
                        key={`${thumb.url}-${idx}`}
                        type="button"
                        onClick={() => {
                          setSelectedImage(thumb.url);
                          if (thumb.title) setSelectedShape(thumb.title);
                        }}
                        aria-selected={isActive}
                        className={`rounded border overflow-hidden w-20 h-20 focus:outline-none ${
                          isActive ? "border-black" : "border-gray-300"
                        }`}
                        title={thumb.title ?? `Image ${idx + 1}`}
                      >
                        <Image
                          src={thumb.url}
                          alt={thumb.title || `thumb-${idx}`}
                          fit="cover"
                          height={80}
                          width={80}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-20 py-20">
                <Grid>
                  <GridCol
                    className="flex items-center justify-center relative"
                    span={{ base: 12, md: 12 }}
                  >
                    <Grid>
                      <GridCol span={{ base: 12, md: 9 }}>
                        <Image
                          src={productData?.images?.edges[4]?.node?.url}
                          h={300}
                          w={400}
                          className="object-contain"
                        />
                      </GridCol>

                      {/* Horizontal Arrow + Label */}

                      <GridCol
                        className="flex items-center"
                        span={{ base: 12, md: 3 }}
                      >
                        {/* Dime with measurement arrows */}
                        <div className="flex flex-col items-center">
                          <div className="relative mb-2">
                            <div className="flex justify-center items-center pointer-events-none">
                              <svg width="84px" height="16">
                                <line
                                  x1="5%"
                                  y1="8"
                                  x2="95%"
                                  y2="8"
                                  stroke="black"
                                  strokeWidth="1.5"
                                  markerStart="url(#dimeTopArrowhead)"
                                  markerEnd="url(#dimeTopArrowhead)"
                                />
                                <defs>
                                  <marker
                                    id="dimeTopArrowhead"
                                    markerWidth="8"
                                    markerHeight="6"
                                    refX="4"
                                    refY="3"
                                    orient="auto"
                                  >
                                    <polygon
                                      points="0 0, 8 3, 0 6"
                                      fill="black"
                                    />
                                  </marker>
                                </defs>
                              </svg>
                              <span className="absolute text-xs bg-white px-1 rounded shadow-sm">
                                7.50 Ring Size
                              </span>
                            </div>
                          </div>

                          {/* Dime image with bottom measurement arrow */}
                          <div className="relative">
                            <img
                              src="/assets/dime.png"
                              alt="Dime for scale"
                              className="w-[84px] h-[84px] object-contain"
                            />

                            {/* Bottom arrow below dime */}
                            <div className="absolute top-full left-0 right-0 flex justify-center items-center pointer-events-none mt-2">
                              <svg width="100%" height="16">
                                <line
                                  x1="5%"
                                  y1="8"
                                  x2="95%"
                                  y2="8"
                                  stroke="black"
                                  strokeWidth="1.5"
                                  markerStart="url(#dimeBottomArrowhead)"
                                  markerEnd="url(#dimeBottomArrowhead)"
                                />
                                <defs>
                                  <marker
                                    id="dimeBottomArrowhead"
                                    markerWidth="8"
                                    markerHeight="6"
                                    refX="4"
                                    refY="3"
                                    orient="auto"
                                  >
                                    <polygon
                                      points="0 0, 8 3, 0 6"
                                      fill="black"
                                    />
                                  </marker>
                                </defs>
                              </svg>
                              <span className="absolute text-xs bg-white px-1 rounded shadow-sm">
                                17.91 mm
                              </span>
                            </div>
                          </div>
                        </div>
                      </GridCol>
                    </Grid>
                  </GridCol>
                </Grid>
              </div>
            </motion.div>
          )}
        </GridCol>

        {/* RIGHT: Details */}
        <GridCol span={{ base: 12, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <JewelryProductDetails
              path={path}
              productData={productData}
              selectedShape={selectedShape}
              onShapeChange={handleShapeChange}
              selectedImage={selectedImage}
              twoStoneRings={twoStoneRings}
            />
          </motion.div>
        </GridCol>
      </Grid>
    </div>
  );
}
