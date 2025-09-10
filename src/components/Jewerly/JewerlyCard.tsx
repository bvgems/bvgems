"use client";

import { Card, Tooltip, Skeleton } from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export const JewelryCategoryCard = ({
  isBead,
  category,
  product,
  index,
  selectedStones,
}: any) => {
  const router = useRouter();

  const isLoading = !product?.node;
  if (isLoading) {
    return (
      <Card radius="md" shadow="none" padding="md">
        <Skeleton height={180} radius="md" mb="sm" />
        <Skeleton height={14} width="80%" mb="xs" />
        <Skeleton height={12} width="40%" />
      </Card>
    );
  }

  const variants = product?.node?.variants?.edges || [];
  const defaultMain = product?.node?.images?.edges?.[0]?.node?.url || "";

  const [mainImage, setMainImage] = useState<string>(defaultMain);
  const [selectedImage, setSelectedImage] = useState<string>(mainImage);
  const [hoverPreviewImage, setHoverPreviewImage] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (selectedStones?.length) {
      const matchStone = selectedStones[0].toLowerCase();
      const matchedVariant = variants.find(
        (v: any) => v?.node?.title?.toLowerCase() === matchStone
      );
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
    // 1. If earrings + metafield exists, use it
    if (
      category?.toLowerCase() === "earrings" &&
      product?.node?.earring_metafielcd?.value
    ) {
      try {
        const parsed = JSON.parse(product.node.earring_metafielcd.value);
        const prices = parsed
          .map((p: any) => Number(p?.price))
          .filter((n: number) => Number.isFinite(n));
        if (prices.length) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          return min === max
            ? `$${min.toFixed(2)} USD`
            : `$${min.toFixed(2)} – $${max.toFixed(2)} USD`;
        }
      } catch (err) {
        console.warn("Invalid earring_metafielcd JSON", err);
      }
    }

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
  }, [category, product, variants]);

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
      padding="sm"
      className="bg-transparent cursor-pointer select-none"
      onClick={redirectToProduct}
    >
      {/* IMAGE */}
      <div className="relative w-full h-[160px] md:h-[220px] flex items-center justify-center overflow-hidden">
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

      {/* VARIANT SWATCHES (always visible) */}
      {!isBead && variants.length > 1 && (
        <div
          className="mt-2 flex items-center gap-2 flex-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          {variants.slice(0, 6).map((v: any, i: number) => (
            <Tooltip
              key={`${v?.node?.image?.url}-${i}`}
              label={v?.node?.title || `Variant ${i + 1}`}
            >
              <button
                onClick={() => setSelectedImage(v?.node?.image?.url)}
                onMouseEnter={() => setHoverPreviewImage(v?.node?.image?.url)}
                onMouseLeave={() => setHoverPreviewImage(null)}
                className={`w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden transition hover:scale-[1.06] ${
                  selectedImage === v?.node?.image?.url
                    ? "shadow-[0_0_0_2px_rgba(0,0,0,0.5)]"
                    : ""
                }`}
                aria-label={`Variant ${v?.node?.title || i + 1}`}
              >
                <img
                  src={v?.node?.image?.url}
                  alt={v?.node?.title}
                  className="w-full h-full object-cover"
                />
              </button>
            </Tooltip>
          ))}
        </div>
      )}

      {/* TITLE */}
      <div className="mt-2">
        <h3 className="text-[0.75rem] md:text-[0.9rem] leading-tight text-gray-800 line-clamp-2 min-h-[32px] md:min-h-[40px]">
          {product?.node?.title}
        </h3>
      </div>

      {/* PRICE */}
      <div className="mt-1 text-[0.8rem] md:text-[1rem] font-semibold text-gray-900">
        {priceText}
      </div>
    </Card>
  );
};
