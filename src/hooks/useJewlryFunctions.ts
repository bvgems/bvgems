"use client";

import { useState, useEffect, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

export function useJewelryFunctions(
  path: string,
  productData: any,
  selectedShape: any,
  selectedImage: any,
  twoStoneRings: any,
  addToCart: any
) {
  const segments = path?.split("/").filter(Boolean);
  const category = segments?.[1];
  // console.log('categoryy',segments)

  const showShapeOptions = productData?.showshapeoptions?.value === "true";
  const isTwoStoneRing = productData?.isTwoStoneRing?.value === "true";
  const isRingCategory = category === "rings";
  const isEarringCategory = category === "earrings";
  const isNecklaces = category === "necklaces";
  const isBracelets = category === "bracelets";
  const isBead = category === "beads";

  // ---------- State ----------
  const [selectedRingSize, setSelectedRingSize] = useState<any>();
  const [selectedCarat, setSelectedCarat] = useState<any>();

  const [selectedNecklaceStoneSize, setSelectedNecklacesStoneSize] =
    useState<any>("");
  const [selectedBraceletLength, setSelectedBraceletLength] =
    useState<any>("6.0");
  const [selectedBeadStoneSize, setSelectedBeadStoneSize] = useState<any>();
  const [selectedNecklaceLength, setSelectedNecklaceLength] =
    useState<any>("16 Inch");

  const [customPrice, setCustomPrice] = useState<any>();
  const [quantity, setQuantity] = useState<any>(1);
  const [selectedGoldColor, setSelectedGoldColor] = useState<any>();
  const [firstStone, setFirstStone] = useState<any>(null);
  const [secondStone, setSecondStone] = useState<any>(null);

  useEffect(() => {
    if (!isNecklaces || !productData?.variants?.edges?.length) return;
    const firstVariant = productData.variants.edges[0]?.node;
    const parts = firstVariant?.title?.split(" / ");
    if (parts?.length === 3) {
      const [gold, stoneSize, length] = parts;
      if (!selectedGoldColor) setSelectedGoldColor(gold?.trim());
      if (!selectedNecklaceStoneSize)
        setSelectedNecklacesStoneSize(stoneSize?.trim());
      if (!selectedNecklaceLength) setSelectedNecklaceLength(length?.trim());
    }
  }, [productData, isNecklaces]);

  useEffect(() => {
    if (
      !isRingCategory ||
      isTwoStoneRing ||
      !productData?.variants?.edges?.length
    )
      return;
    const firstVariant = productData.variants.edges[0]?.node;
    const parts = firstVariant?.title?.split(" / ");
    if (parts?.length === 2) {
      const [gold, size] = parts;
      if (!selectedGoldColor) setSelectedGoldColor(gold?.trim());
      if (!selectedRingSize) setSelectedRingSize(size?.trim());
    }
  }, [productData, isRingCategory, isTwoStoneRing]);

  // ---------- Derived Price ----------
  const getPrice = (title: string) => {
    const variant = productData?.variants?.edges?.find(
      (v: any) => v?.node?.title === title
    );
    return variant?.node?.price?.amount;
  };
  const displayPrice = useMemo(() => {
    // 💎 Earrings use custom price
    if (isEarringCategory && customPrice) {
      return `${Number(customPrice).toFixed(2)}`;
    }

    if (isBead) {
      const price = getPrice(selectedBeadStoneSize);
      return price ? `${Number(price).toFixed(2)}` : "Select Size";
    }

    if (isNecklaces) {
      const title = `${selectedGoldColor} / ${selectedNecklaceStoneSize} / ${selectedNecklaceLength}`;
      const price = getPrice(title);
      if (price) return `${Number(price).toFixed(2)}`;

      const fallback = productData?.variants?.edges?.[0]?.node?.price?.amount;
      return fallback ? `${Number(fallback).toFixed(2)}` : "Unavailable";
    }

    if (isRingCategory) {
      if (!isTwoStoneRing && !showShapeOptions) {
        if (!selectedGoldColor || !selectedRingSize) return "Select options";
        const title = `${selectedGoldColor} / ${selectedRingSize.replace(
          " mm",
          ""
        )}`;
        const price = getPrice(title);
        return price ? `$${Number(price).toFixed(2)}` : "Unavailable";
      } else if (!isTwoStoneRing && showShapeOptions) {
        const m = productData?.variants?.edges?.find(
          (item: any) => item?.node?.title === selectedShape
        );
        if (m?.node?.price?.amount) {
          return `$${Number(m.node.price.amount).toFixed(2)}`;
        }
        return "Select Options";
      } else if (isTwoStoneRing) {
        const m = productData?.variants?.edges?.find(
          (item: any) => item?.node?.title === `${firstStone}/${secondStone}`
        );
        if (m?.node?.price?.amount) {
          return `$${Number(m.node.price.amount).toFixed(2)}`;
        }
        return "Select Options";
      }
    }

    const price = productData?.variants?.edges?.[0]?.node?.price?.amount;
    return `$${Number(price || 0).toFixed(2)}`;
  }, [
    productData,
    isBead,
    isNecklaces,
    isRingCategory,
    isTwoStoneRing,
    isEarringCategory,
    customPrice,
    showShapeOptions,
    selectedBeadStoneSize,
    selectedGoldColor,
    selectedNecklaceLength,
    selectedNecklaceStoneSize,
    selectedRingSize,
    selectedShape,
    firstStone,
    secondStone,
  ]);

  const numericPrice = useMemo(() => {
    const m = /([\d.]+)/.exec(String(displayPrice));
    return m ? parseFloat(m[1]) : undefined;
  }, [displayPrice]);

  // ---------- Helper Functions ----------
  const getLengthData = () => [16, 18, 20, 22].map((len) => `${len} Inch`);

  const braceletLength = () =>
    Array.from({ length: 4 }, (_, i) => (6 + i * 0.5).toFixed(2));

  const ringSizes = () => {
    if (!twoStoneRings && !showShapeOptions) {
      if (!productData?.variants?.edges?.length || !selectedGoldColor)
        return [];
      const sizeSet = new Set<string>();
      productData.variants.edges.forEach(({ node }: any) => {
        const [gold, size] = node.title.split(" / ");
        if (gold.trim() === selectedGoldColor.trim()) sizeSet.add(size.trim());
      });
      return Array.from(sizeSet);
    } else {
      return Array.from({ length: 15 }, (_, i) => (4 + i * 0.5).toFixed(2));
    }
  };
  useEffect(() => {
    const sizes = ringSizes();
    if (isRingCategory && sizes.length > 0 && !selectedRingSize) {
      setSelectedRingSize(sizes[0]);
    }
  }, [isRingCategory, ringSizes, selectedRingSize]);
  useEffect(() => {
    const beadSizes = getBeadStoneSize();
    if (isBead && beadSizes.length > 0 && !selectedBeadStoneSize) {
      setSelectedBeadStoneSize(beadSizes[0]);
    }
  }, [isBead, productData, selectedBeadStoneSize]);

  const getBeadStoneSize = () => {
    return (
      productData?.variants?.edges?.map((item: any) => item?.node?.title) || []
    );
  };

  const isDisabled = () => {
    if (isBead) return !selectedBeadStoneSize;
    if (isEarringCategory) {
      return !selectedGoldColor;
    }
    if (isRingCategory && !selectedRingSize) return true;
    if (!selectedGoldColor && !isBead) return true;

    // if (
    //   productData?.showshapeoptions?.value === "true" &&
    //   twoStoneRings &&
    //   (!firstStone || !secondStone)
    // )
    //   return true;
    if (
      productData?.showshapeoptions?.value === "true" &&
      !twoStoneRings &&
      !selectedShape
    )
      return true;

    return false;
  };

  const setStones = (val: any) => {
    const splitedStones = (val || "").split("/");
    setFirstStone(splitedStones[0]);
    setSecondStone(splitedStones[1]);
  };

  const addProductInCart = (value?: any) => {
    const variables: any = {};

    if (isBead) {
      variables.size = selectedBeadStoneSize;
    }
    if (isRingCategory) {
      variables.goldColor = selectedGoldColor;
      variables.size = selectedRingSize;
      variables.stone = productData?.gemstone?.value || "";
      variables.image = selectedImage;
    } else if (isNecklaces) {
      variables.goldColor = selectedGoldColor;
      variables.size = value ? value : "";
      variables.length = selectedNecklaceLength;
      variables.image = selectedImage;
    } else if (isEarringCategory) {
      variables.goldColor = selectedGoldColor;
      variables.totalCaratWeight = selectedCarat;
      variables.stone = selectedShape;
      variables.image = selectedImage;
    } else if (isBracelets) {
      variables.goldColor = selectedGoldColor;
      variables.length = selectedBraceletLength;
      // variables.image = selectedImage;
    } else if (isBead) {
      variables.size = selectedBeadStoneSize;
    }

    addToCart({
      product: {
        productType: isBead
          ? "bead"
          : isRingCategory
          ? "ringJewelry"
          : isNecklaces
          ? "necklaceJewelry"
          : isBracelets
          ? "braceletJewelry"
          : isEarringCategory
          ? "earringJewelry"
          : "Product",
        productId: productData?.id,
        handle: productData?.handle,
        title: productData?.title,
        image_url:
          variables?.image || productData?.images?.edges?.[0]?.node?.url,
        price: isEarringCategory
          ? displayPrice.replace(/[^0-9.]/g, "")
          : isBead
          ? getPrice(selectedBeadStoneSize)
          : productData?.variants?.edges?.[0]?.node?.price?.amount,

        gemstone: variables?.stone,
        size: variables?.size || "",
        goldColor: variables?.goldColor || "",
        length: variables?.length || "",
        firstStone: isRingCategory ? firstStone : "",
        secondStone: isRingCategory ? secondStone : "",
        totalCaratWeight: isEarringCategory ? variables?.totalCaratWeight : "",
      },
      quantity,
    });
  };

  return {
    // booleans
    isRingCategory,
    isEarringCategory,
    isNecklaces,
    isBracelets,
    isBead,
    isTwoStoneRing,
    showShapeOptions,

    // states
    selectedRingSize,
    setSelectedRingSize,
    selectedNecklaceStoneSize,
    setSelectedNecklacesStoneSize,
    selectedBraceletLength,
    setSelectedBraceletLength,
    selectedBeadStoneSize,
    setSelectedBeadStoneSize,
    selectedNecklaceLength,
    setSelectedNecklaceLength,
    selectedGoldColor,
    setSelectedGoldColor,
    firstStone,
    secondStone,
    setStones,
    quantity,
    setQuantity,
    selectedCarat,
    setSelectedCarat,
    customPrice,
    setCustomPrice,

    // helpers
    displayPrice,
    numericPrice,
    getLengthData,
    braceletLength,
    ringSizes,
    getBeadStoneSize,
    isDisabled,
    addProductInCart,
  };
}
