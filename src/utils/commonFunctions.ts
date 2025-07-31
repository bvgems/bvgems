const getCompositeKey = (
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
  variables: any,
  isBead: boolean,
  isRingCategory: boolean,
  isNecklaces: boolean
) => {
  if (!productData) return;

  const jewelryItem = {
    product: {
      productType: isBead
        ? "bead"
        : isRingCategory
        ? "ringJewelry"
        : isNecklaces
        ? "necklaceJewelry"
        : "jewelry",
      productId: isBead
        ? productData?.productId
        : getCompositeKey(
            productData?.id,
            variables,
            isRingCategory,
            isNecklaces
          ),
      collection_slug: productData?.title,
      color: "",
      ct_weight: productData?.ct_weight,
      cut: "",
      image_url: variables?.image || productData?.images?.edges?.[0]?.node?.url,
      price: productData?.variants?.edges?.[0]?.node?.price?.amount,
      gemstone:
        productData?.showshapeoptions?.value === "true"
          ? variables?.stone
          : productData?.gemstone?.value || "",
      size: variables?.size || "",
      shape: productData?.shape?.value || "",
      type: "",
      goldColor: variables?.goldColor || "",
      length: variables?.length || "",
    },
    quantity,
  };

  addToCart(jewelryItem);
};
