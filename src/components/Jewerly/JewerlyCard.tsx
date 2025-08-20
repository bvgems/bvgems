"use client";

import { Card, Tooltip, Skeleton } from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const JewelryCategoryCard = ({
  isBead,
  category,
  product,
  index,
  selectedStones, // ⬅️ new prop
}: any) => {
  const router = useRouter();
  const { user } = useAuth();

  const isLoading = !product?.node;
  if (isLoading) {
    return (
      <Card radius="md" shadow="none" padding="md">
        <Skeleton height={260} radius="md" mb="sm" />
        <Skeleton height={20} width="80%" mb="xs" />
        <Skeleton height={16} width="40%" />
      </Card>
    );
  }

  const variants = product?.node?.variants?.edges || [];
  const defaultMain = product?.node?.images?.edges?.[0]?.node?.url || "";

  // 🔑 Decide main image
  const [mainImage, setMainImage] = useState<string>(defaultMain);

  const [selectedImage, setSelectedImage] = useState<string>(mainImage);
  const [hoverPreviewImage, setHoverPreviewImage] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (selectedStones?.length) {
      const matchStone = selectedStones[0].toLowerCase();
      console.log("matchedd", matchStone);
      const matchedVariant = variants.find(
        (v: any) => v?.node?.title?.toLowerCase() === matchStone
      );
      console.log("heyyy", matchedVariant);
      if (matchedVariant?.node?.image?.url) {
        setMainImage(matchedVariant.node.image.url);
        return;
      }
    }
    setMainImage(defaultMain);
  }, [selectedStones, product]);

  useEffect(() => {
    setSelectedImage(mainImage);
  }, [mainImage]);

  const priceText = useMemo(() => {
    const amounts =
      variants
        ?.map((e: any) => Number(e?.node?.price?.amount ?? 0))
        ?.filter((n: number) => Number.isFinite(n)) || [];

    if (!amounts.length) return "$0.00 USD";
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    return min === max
      ? `$${min.toFixed(2)} USD`
      : `$${min.toFixed(2)} – $${max.toFixed(2)} USD`;
  }, [product]);

  const variantImages: { title?: string; image: string }[] =
    variants
      ?.map((v: any) => ({
        title: v?.node?.title,
        image: v?.node?.image?.url || defaultMain,
      }))
      ?.filter((v: any) => !!v.image) || [];

  const isTwoStone: boolean = Boolean(
    product?.node?.isTwoStoneRing?.value ?? product?.node?.isTwoStoneRing
  );

  const redirectToProduct = () => {
    const handle = product?.node?.handle;
    if (!handle) return;
    isBead
      ? router.push(`/jewelry-details/beads/${handle}`)
      : router.push(`/jewelry-details/${category}/${handle}`);
  };

  const displayImage = hoverPreviewImage || selectedImage || mainImage;

  return (
    <Card
      withBorder={false}
      radius="md"
      shadow="none"
      padding="md"
      className="bg-transparent cursor-pointer select-none"
      onClick={redirectToProduct}
    >
      {/* IMAGE AREA */}
      <div className="relative w-full h-[260px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={displayImage}
            src={displayImage}
            alt={product?.node?.title}
            className="absolute object-contain"
            style={{ width: "100%", height: "100%" }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </AnimatePresence>
      </div>

      {/* VARIANT SWATCHES */}
      {!isTwoStone && !isBead && variantImages.length > 1 && (
        <div
          className="mt-3 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {variantImages.slice(0, 6).map((variant: any, i: number) => (
            <Tooltip
              key={`${variant?.image}-${i}`}
              label={variant.title || `Variant ${i + 1}`}
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

      {/* TITLE */}
      <div className="mt-2">
        <h3 className="text-[0.98rem] leading-snug text-gray-800 line-clamp-2 min-h-[40px]">
          {product?.node?.title}
        </h3>
      </div>

      {/* PRICE */}
      <div className="mt-1 text-[1rem] font-semibold text-gray-900">
        {priceText}
      </div>
    </Card>
  );
};
