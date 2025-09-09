export const getData = () => {
  if (isBead) {
    return (
      productData?.variants?.edges?.map((item: any) => item?.node?.title) || []
    );
  } else if (isNecklaces) {
    const sizeSet = new Set<string>();
    productData?.variants?.edges?.forEach(({ node }: any) => {
      const parts = node?.title?.split(" / ");
      if (parts?.length === 3) sizeSet.add(parts[1].trim());
    });
    return Array.from(sizeSet);
  }
  return [];
};

export const getLengthData = () => [16, 18, 20, 22].map((len) => `${len} Inch`);

export const isDisabled = () => {
  if (isBead) return !selectedBeadStoneSize;
  if (isEarringCategory) {
    return productData?.showGoldColor?.value === "true" && !selectedGoldColor;
  }
  if (isRingCategory && !selectedRingSize) return true;
  if (!selectedGoldColor && !isBead) return true;

  if (
    productData?.showshapeoptions?.value === "true" &&
    twoStoneRings &&
    (!firstStone || !secondStone)
  )
    return true;
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

export const ringSizes = (
  twoStoneRings: any,
  showShapeOptions: any,
  productData: any,
  selectedGoldColor: any
) => {
  if (!twoStoneRings && !showShapeOptions) {
    if (!productData?.variants?.edges?.length || !selectedGoldColor) return [];
    const sizeSet = new Set<string>();
    productData.variants.edges.forEach(({ node }: any) => {
      const [gold, size] = node.title.split(" / ");
      if (gold.trim() === selectedGoldColor.trim()) sizeSet.add(size.trim());
    });
    return Array.from(sizeSet);
  } else {
    const ringSizes = Array.from({ length: 15 }, (_, i) =>
      (4 + i * 0.5).toFixed(2)
    );
    return ringSizes;
  }
};

export const braceletLength = () =>
  Array.from({ length: 4 }, (_, i) => (6 + i * 0.5).toFixed(2));

export const getCompositeKey = (
  productId: any,
  variables: any,
  isRingCategory: any,
  isNecklaces: any
) => {
  if (isRingCategory) {
    return `${productId}_${variables?.goldColor}_${variables?.size}_${variables?.stone}`;
  } else {
    return `${productId}_${variables?.goldColor}_${variables?.size}_${variables?.length}`;
  }
};

export const addProductToCart = (
  productData: any,
  quantity: number,
  addToCart: any,
  variables?: any,
  isBead?: boolean,
  isRingCategory?: boolean,
  isNecklaces?: boolean,
  isBracelets?: boolean,
  isEarringCategory?: boolean,
  firstStone?: string | any,
  secondStone?: any
) => {
  if (!productData) return;
  console.log("prodd", variables);

  const showshapeoptions = productData?.showshapeoptions?.value === "true";

  const jewelryItem = {
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
      productId: isBead
        ? productData?.productId
        : getCompositeKey(
            productData?.id,
            variables,
            isRingCategory,
            isNecklaces
          ),
      handle: productData?.handle,
      collection_slug: productData?.title,
      color: "",
      ct_weight: productData?.ct_weight,
      cut: "",
      image_url: variables?.image || productData?.images?.edges?.[0]?.node?.url,
      price: productData?.variants?.edges?.[0]?.node?.price?.amount,

      gemstone: variables?.stone,
      size: variables?.size || "",
      shape: productData?.shape?.value || "",
      type: "",
      goldColor: variables?.goldColor || "",
      length: variables?.length || "",
      firstStone: isRingCategory ? firstStone : "",
      secondStone: isRingCategory ? secondStone : "",
    },
    quantity,
  };

  addToCart(jewelryItem);
};

export const addProduct = async (
  isRingCategory: any,
  selectedGoldColor: any,
  selectedRingSize: any,
  isTwoStoneRing: any,
  firstStone: any,
  productData: any,
  selectedShape: any,
  selectedImage: any,
  isNecklaces: any,
  selectedNecklaceStoneSize: any,
  selectedNecklaceLength: any,
  isEarringCategory: any,
  isBracelets: any,
  selectedBraceletLength: any,
  quantity: any,
  addToCart: any,
  isBead: any,
  secondStone: any,
  selectedBeadStoneSize: any
) => {
  let variables: any;

  if (isRingCategory) {
    variables = {
      goldColor: selectedGoldColor,
      size: selectedRingSize,
      stone: isTwoStoneRing
        ? `${firstStone} - ${productData?.firstShape?.value} , ${secondStone} - ${productData?.secondShape?.value}`
        : selectedShape
        ? selectedShape
        : productData?.gemstone?.value,
      image: selectedImage,
    };
  } else if (isNecklaces) {
    variables = {
      goldColor: selectedGoldColor,
      size:
        productData?.showGoldColor?.value === "true"
          ? selectedNecklaceStoneSize
          : null,
      length: selectedNecklaceLength,
    };
  } else if (isEarringCategory) {
    variables = {
      goldColor:
        productData?.showGoldColor?.value === "true" ? selectedGoldColor : "",
    };
  } else if (isBracelets) {
    variables = {
      goldColor: selectedGoldColor,
      length: selectedBraceletLength,
    };
  } else if (isBead) {
    variables = { size: selectedBeadStoneSize };
  }

  addProductToCart(
    productData,
    quantity,
    addToCart,
    variables,
    isBead,
    isRingCategory,
    isNecklaces,
    isBracelets,
    isEarringCategory,
    firstStone,
    secondStone
  );
};
