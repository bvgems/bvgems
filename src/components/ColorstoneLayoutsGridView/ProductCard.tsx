import { Card, GridCol, Slider, Tooltip } from "@mantine/core";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ImageZoom } from "../CommonComponents/ImageZoom";
import { useMediaQuery } from "@mantine/hooks";
import { ImageZoomMobile } from "../CommonComponents/ImageZoomMobile";

const MotionDiv = motion.div;
export const ProductCard = ({ node, index }: { node: any; index: number }) => {
  const router = useRouter();

  const variants = node?.variants?.edges || [];
  const defaultMain = node?.images?.edges?.[1]?.node?.url || "";

  const [mainImage, setMainImage] = useState<string>(defaultMain);
  const [selectedImage, setSelectedImage] = useState<string>(mainImage);
  const [hoverPreviewImage, setHoverPreviewImage] = useState<string | null>(
    null
  );
  const isMobile = useMediaQuery("(max-width: 1100px)");
  const [scale, setScale] = useState(2);

  useEffect(() => {
    setMainImage(defaultMain);
  }, [node]);

  useEffect(() => {
    setSelectedImage(mainImage);
  }, [mainImage]);

  // 💲 Price text
  const priceText = useMemo(() => {
    const amounts =
      variants
        ?.map((e: any) => Number(e?.node?.price?.amount ?? 0))
        ?.filter((n: number) => Number.isFinite(n)) || [];

    if (!amounts.length) return "Price on Request";
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    return min === max
      ? `$${min.toFixed(2)} USD`
      : `$${min.toFixed(2)} – $${max.toFixed(2)} USD`;
  }, [variants]);

  const variantImages: { title?: string; image: string }[] = useMemo(
    () =>
      variants
        ?.map((v: any) => ({
          title: v?.node?.title,
          image: v?.node?.image?.url || defaultMain,
        }))
        ?.filter((v: any) => !!v.image) || [],
    [variants, defaultMain]
  );

  const redirectToProduct = () => {
    if (!node?.handle) return;
    router.push(`/colorstone-layouts/${node.handle}`);
  };

  const displayImage = hoverPreviewImage || selectedImage || mainImage;

  return (
    <GridCol key={node.id} span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
      <MotionDiv
        className="h-full"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Card
          radius="md"
          shadow="none"
          className="overflow-hidden flex flex-col h-full cursor-pointer bg-transparent"
          onClick={redirectToProduct}
          style={{ height: "100%" }}
        >
          {/* IMAGE AREA */}
          <div className="relative w-full h-[350px] flex items-center justify-center overflow-hidden bg-gray-50">
            {isMobile ? (
              <ImageZoomMobile
                src={displayImage}
                alt={node?.title}
                scale={scale}
              />
            ) : (
              <AnimatePresence mode="wait">
                <ImageZoom
                  key={displayImage}
                  src={displayImage}
                  alt={node?.title}
                />
              </AnimatePresence>
            )}
          </div>

          {/* VARIANT SWATCHES */}
          {variantImages.length > 1 && (
            <div
              className="mt-3 flex items-center gap-2 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {variantImages.slice(0, 6).map((variant: any, i: number) => (
                <Tooltip
                  key={`${variant?.image}-${i}`}
                  label={variant?.title || `Variant ${i + 1}`}
                >
                  <button
                    onClick={() => setSelectedImage(variant.image)}
                    onMouseEnter={() => setHoverPreviewImage(variant.image)}
                    onMouseLeave={() => setHoverPreviewImage(null)}
                    className={`w-7 h-7 rounded-full overflow-hidden ring-0 outline-none transition transform hover:scale-[1.06] ${
                      selectedImage === variant.image
                        ? "shadow-[0_0_0_2px_rgba(0,0,0,0.5)]"
                        : ""
                    }`}
                    aria-label={`Variant ${variant.title || i + 1}`}
                  >
                    <img
                      src={variant.image}
                      alt={variant.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </Tooltip>
              ))}
            </div>
          )}

          {isMobile && (
            <div
              className="px-4 mt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs">Zoom In</p>
              <Slider
                size={"xs"}
                color="#0b182d"
                min={1}
                max={4}
                step={0.1}
                value={scale}
                onChange={setScale}
                label={(value) => `${value.toFixed(1)}x`}
              />
            </div>
          )}

          {/* TITLE */}
          <div className="mt-2 px-4">
            <h3 className="text-[1.05rem] leading-snug text-gray-800 line-clamp-2 min-h-[40px]">
              {node?.title}
            </h3>
          </div>

          {/* SHAPE + WEIGHT */}
          <div className="px-4 mt-1 text-[0.95rem] text-gray-500">
            {node.shape?.value} • {node.ct_weight?.value} ct
          </div>

          {/* PRICE */}
          <div className="mt-2 px-4 pb-4 text-[1rem] font-semibold text-gray-900">
            {priceText}
          </div>
        </Card>
      </MotionDiv>
    </GridCol>
  );
};
