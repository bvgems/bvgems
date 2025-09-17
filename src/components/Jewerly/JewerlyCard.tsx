"use client";

import { Card, Tooltip, Skeleton, NumberFormatter } from "@mantine/core";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { Metadata } from "next";
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { category, stone } = await params;

  return {
    title: `${stone} ${category} Ring – Shop Online | B.V. Gems`,
    description: `Shop fine ${stone} ${category} rings at B.V. Gems. Discover ${stone.toLowerCase()} & diamond jewelry, ethically sourced with free U.S. shipping.`,
  };
}

export const JewelryCategoryCard = ({ isBead, category, product }: any) => {
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

  const [selectedVariant, setSelectedVariant] = useState<any>();

  const [hoverPreviewImage, setHoverPreviewImage] = useState<string | null>(
    null
  );

  const setVariant = () => {
    const variant = product?.mainImage
      ? product?.node?.variants?.edges?.find(
          (item: any) => item?.node?.metafield?.value === product?.matchedTitle
        )
      : variants?.length > 1
      ? variants[0]
      : product;

    setSelectedVariant(variant);
  };

  useEffect(() => {
    setVariant();
  }, [product]);

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
  }, [variants]);

  const redirectToProduct = () => {
    const handle = product?.node?.handle;
    const stoneSlug = selectedVariant?.node?.title
      ? selectedVariant?.node?.title.toLowerCase().replace(/\s+/g, "-")
      : null;

    if (!handle) return;

    if (stoneSlug) {
      router.push(`/jewelry-details/${category}/${handle}/${stoneSlug}`);
    } else {
      router.push(`/jewelry-details/${category}/${handle}`);
    }
  };

  const seoTitle = !isBead
    ? product?.node?.variants?.edges?.length > 1
      ? `${selectedVariant?.node?.title}`
      : `${product?.node?.title}`
    : product?.node?.title;

  const displayImage = !isBead
    ? hoverPreviewImage ||
      (product?.node?.variants?.edges?.length > 1
        ? selectedVariant?.node?.image?.url
        : product?.node?.image?.url ||
          product?.node?.images?.edges[0]?.node?.url)
    : product?.node?.image?.url || product?.node?.images?.edges[0]?.node?.url;

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
            alt={seoTitle}
            className="absolute object-contain"
            style={{ width: "100%", height: "100%" }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </AnimatePresence>
      </div>

      {!isBead && variants.length > 1 && (
        <div
          className="mt-2 flex justify-center items-center gap-2 flex-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          {variants.slice(0, 6).map((v: any, i: number) => {
            return (
              <Tooltip
                key={`${v?.node?.image?.url}-${i}`}
                label={v?.node?.title || `Variant ${i + 1}`}
              >
                <button
                  onClick={() => {
                    setSelectedVariant(v);
                  }}
                  onMouseEnter={() => setHoverPreviewImage(v?.node?.image?.url)}
                  onMouseLeave={() => setHoverPreviewImage(null)}
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden transition hover:scale-[1.06] ${
                    v === selectedVariant
                      ? "shadow-[0_0_0_2px_rgba(0,0,0,0.5)]"
                      : ""
                  }`}
                  aria-label={`Variant ${v?.node?.title || i + 1}`}
                >
                  <img
                    src={v?.node?.image?.url}
                    alt={v?.node?.title}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </button>
              </Tooltip>
            );
          })}
        </div>
      )}

      {/* TITLE */}
      <div className="mt-2">
        <h3 className="text-md font-medium text-gray-500 mt-3">{seoTitle}</h3>
      </div>

      <NumberFormatter
        thousandSeparator
        prefix="$"
        className="text-md text-gray-500 mt-2"
        value={priceText}
        suffix=" USD"
      />
    </Card>
  );
};
